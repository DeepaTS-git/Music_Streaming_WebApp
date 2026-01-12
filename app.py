from flask import Flask, render_template, request, jsonify, session
from api.resource import *
from models import *
from security import *
from flask_security.utils import hash_password
from flask_security import auth_token_required, current_user
import os
import workers, task
from datetime import datetime, timedelta
from flask_mail import Message, Mail
from mailer import *
from flask_caching import Cache

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite3' #to connect to SQLite databese 
app.config['UPLOAD_FOLDER'] = 'static/mp3'#to store uploaded files
app.config['SECRET_KEY'] = 'thisissecret'#for session encryption
app.config["SECURITY_PASSWORD_SALT"] = "salt"#for password hashing 
app.config['WTF_CSRF_ENABLED'] = False#cross-site request forgery
app.config["SECURITY_TOKEN_AUTHENTICATION_HEADER"] = "Authentication-Token"
app.config["SECURITY_PASSWORD_HASH"] = "bcrypt"

app.config["MAIL_SERVER"] = 'localhost'#for sending emails
app.config["MAIL_PORT"] = 1025#for sending emails
app.config["CACHE_TYPE"] = "RedisCache" #for redis catching
app.config["CACHE_DEFAULT_TIMEOUT"] = 300
app.config["DEBUG"] = True

mail = Mail(app)#to initialize with Flask app to set up email functionality

celery = workers.celery#

celery.conf.update(
    BROKER_URL='redis://localhost:6379',
    RESULT_BACKEND='redis://localhost:6379'
)
celery.Task = workers.ContextTask

cache = Cache(app)#Catch is initialized with Flask app
app.app_context().push() #to ensure that the app context is available for subsequent operations


api.init_app(app) #connecting to api from resource.py file
db.init_app(app)
sec.init_app(app, user_datastore)#to initializ the database using the Flask app and a user datastore
# api = Api(app)

app.app_context().push()


# @app.before_request
def create_db():
    # db.create_all()
    if not user_datastore.find_role("admin"):
        admin_role = user_datastore.create_role(name = "admin", description = "Admin related role")
        gen_role = user_datastore.create_role(name='general', description='Genaera User role')
        creator_role = user_datastore.create_role(name='creator', description='Creator role')
        db.session.commit()

    if not user_datastore.find_user(email = "admin@gmail.com" ):
        # current_user = user_datastore.create_user(name = "Admin", email = "admin@gmail.com", password = hash_password("admin@password"))
        admin_user = user_datastore.create_user(name = "Admin", email = "admin@gmail.com", password = hash_password("admin@password"))
        user_datastore.add_role_to_user(admin_user, 'admin')
        # db.session.add(RolesUsers(user_id = 1 , role_id = 1))
        db.session.commit()

    if not user_datastore.find_user(email = "mitu@gmail.com"):
        gen_user = user_datastore.create_user(name = "Mitu", email = "mitu@gmail.com", password = hash_password("mitu@password"))
        user_datastore.add_role_to_user(gen_user, 'general')
        db.session.commit()
    
    if not user_datastore.find_user(email = "raj@gmail.com"):
        crr1_user = user_datastore.create_user(name = "raj", email = "raj@gmail.com", password = hash_password("raj@password"))
        user_datastore.add_role_to_user(crr1_user, 'creator')
        db.session.commit()

    if not user_datastore.find_user(email = "xyz@gmail.com"):
        crr2_user = user_datastore.create_user(name = "xyz", email = "xyz@gmail.com", password = hash_password("xyz@password"))
        user_datastore.add_role_to_user(crr2_user, 'creator')
        db.session.commit()

    return "Database created successfully."

with app.app_context():
    create_db()  

    
@app.route('/', methods=['GET', 'POST'])
def home():

    if request.method == 'POST':
        data = request.get_json()
        user_role = data.get('userAccess')
        user_email = data.get('email')
      

        if not user_datastore.find_user(email = user_email):
         
            role = user_datastore.find_role(user_role)
            new_users = user_datastore.create_user(name=data.get('name'), email=user_email, password=hash_password(data.get('password')))
            user_datastore.add_role_to_user(new_users, role)
            db.session.commit()


            return {'msg' : "User created SuccessfulLy."}
            
        if user_datastore.find_user(email = user_email):
            return {'error' : "Please enter other email address. The email you are using is already registered."}

        else:
            return {'msg' : "Role issue"}
        
    return render_template('index.html')

@app.route('/userdashboard/<int:id>')

@auth_token_required
def getdata(id):
    current_user = User.query.filter_by(id=id).first()
    role_id = RolesUsers.query.filter_by(user_id = current_user.id ).first()
    user_role = Role.query.filter_by(id=role_id.role_id).first()
    print("from userdashboard app.py")
    if current_user and role_id and user_role :
        user = {
                'id': current_user.id,
                'name': current_user.name,
                'email': current_user.email,
                'access': user_role.name,
            }
        return jsonify(user=user)
    else:
        return { jsonify(error="User not authorised."), 404}

@app.route('/admindashboard/<int:id>')
@auth_token_required
def getadmindata(id):
    current_user = User.query.filter_by(id=id).first()
    role_id = RolesUsers.query.filter_by(user_id = current_user.id ).first()
    user_role = Role.query.filter_by(id=role_id.role_id).first()
    print("from app.py admindashboard route")
    if current_user and role_id and user_role :
        user = {
                'id': current_user.id,
                'name': current_user.name,
                'email': current_user.email,
                'access': user_role.name,
            }
        return jsonify(user=user)
    else:
        return { jsonify(error="User not authorised."), 404}


@app.route('/add_song/<int:id>', methods = ['GET', 'POST'])
@auth_token_required
def add_song(id):

    if request.method == "POST":
        
        song_title = request.form.get('title')
        singer = request.form.get('singer')
        song_duration = request.form.get('duration')
        song_lyrics = request.form.get('lyrics')
        
        file = request.files['selectedFile']
        
        if file:
            file_name = file.filename
   
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file_name))

            new_song = Song(song_title=song_title, singer=singer, song_lyrics=song_lyrics, song_duration=song_duration, file_name=file_name, song_creator=id)
            db.session.add(new_song)
            db.session.commit()

            return jsonify({'msg' : "Song added SuccessfulLy."})

    return {'error': "Failed to add song."}

@app.route('/userdashboard/<int:id>/open_song/<int:song_id>', methods = ['GET', 'POST'])
@cache.cached(timeout=50, unless=lambda: request.method == 'POST')
@auth_token_required
def open_song(id, song_id):
    this_song = Song.query.filter_by(song_id=song_id).first()
    this_user_rating = Song_Rating.query.filter_by(user_id=id, song_id=song_id).first()
    flag = Flag.query.filter_by(user_id=id, song_id=song_id).first()
    user_flag = False
    if flag:
        user_flag = True
    
    c_flag = False
    if this_song.song_creator == id:
        c_flag = True

    my_rating = None
    if this_user_rating:
        my_rating = this_user_rating.song_rating
    
    avg_rating = Song_Rating.query.filter(Song_Rating.song_id == song_id).with_entities(func.avg(Song_Rating.song_rating)).scalar()

    if request.method == 'POST':
        cache.clear()
        data = request.get_json()
        user_rating = data.get('user_rating')
        add_rating = Song_Rating(song_rating = user_rating, user_id = id, song_id = song_id)
        db.session.add(add_rating)
        db.session.commit()
        

        return jsonify({'msg' : "Rating Added successfully."})


    # print(this_song)
    if this_song:
         return jsonify({
            'this_song': {
                'song_id': this_song.song_id,
                'song_title': this_song.song_title,
                'singer': this_song.singer,
                'song_creator': this_song.song_creator,
                'file_name': this_song.file_name,
                'song_duration': this_song.song_duration,
                'song_lyrics': this_song.song_lyrics,
                'avg_rating': avg_rating,
                'my_rating': my_rating,
                'user_flag': user_flag,
                'c_flag': c_flag,
            },
        })
    else:
        return jsonify({'message': 'Song not found'}), 404
    


    
@app.route('/userdashboard/<int:id>/edit_song/<int:song_id>', methods = ['GET', 'POST'])
@auth_token_required
def edit_song(id, song_id):

    this_song = Song.query.filter_by(song_id=song_id).first()

    if request.method == 'POST':
        song_title = request.form.get('title')
        singer = request.form.get('singer')
        song_duration = request.form.get('duration')
        song_lyrics = request.form.get('lyrics')

        file = None
        if 'selectedFile' in request.files:
            file = request.files['selectedFile']

        if this_song.song_creator == id:
            if file:
                file_name = file.filename
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], file_name))
                this_song.file_name = file_name

            this_song.song_title = song_title
            this_song.singer = singer
            this_song.song_lyrics = song_lyrics
            this_song.song_duration = song_duration
            db.session.commit()

            return jsonify({'msg' : "Song Updated SuccessfulLy."})
    
    return jsonify({'message': 'Song not Updated'})

@app.route('/userdashboard/<int:id>/delete_song/<int:song_id>', methods = ['DELETE'])
@auth_token_required
def delete_song(id, song_id):

    if request.method == 'DELETE':
        Song.query.filter_by(song_id=song_id).delete()
        db.session.commit()

        return {'msg' : "Song Deleted SuccessfulLy."}

@app.route('/userdashboard/<int:id>/create_playlist', methods = ['GET', 'POST'])
@auth_token_required
def create_playlist(id):
    if request.method == 'POST':
        data = request.get_json()
        pl_title = data.get('title')
        selectedplaylistSongs = data.get('selectedplaylistSongs')
        # print(selectedplaylistSongs)

        new_playlist = Splaylist(pl_title=pl_title, pl_user=id)
        db.session.add(new_playlist)
        db.session.commit()

        this_playlist = Splaylist.query.filter_by(pl_user=id, pl_title= pl_title).first()
        for i in selectedplaylistSongs:
            new_playlist1 = Playlist_song_association( apl_id = this_playlist.pl_id, asong_id = i)
            db.session.add(new_playlist1)
            db.session.commit()

        return {'msg' : "Plylist Created."}
    
@app.route('/userdashboard/<int:id>/delete_playlist/<int:pl_id>', methods = ['DELETE'])
@auth_token_required
def delete_playlist(id, pl_id):
    current_playlist = Splaylist.query.filter_by(pl_id=pl_id).first()

    if request.method == 'DELETE':
        if current_playlist.pl_user == id:
            Splaylist.query.filter_by(pl_id=pl_id).delete()
            Playlist_song_association.query.filter_by(apl_id = pl_id).delete
            db.session.commit()

        return {'msg' : "Playlist Deleted SuccessfulLy."}


@app.route('/playlist_data/<int:id>/<int:pl_id>', methods = ['GET', 'POST'])
@cache.cached(timeout=50, unless=lambda: request.method == 'POST')
@auth_token_required
def playlist_data(id, pl_id):
    playlist = Splaylist.query.filter_by(pl_id=pl_id).first()
    my_playlists = Playlist_song_association.query.filter_by(apl_id=pl_id).all()
    songlist = []
   
    for i in my_playlists:
        songlist.append(i.asong_id)

    this_playlist_songs = []
    if len(songlist) > 0:
        for i in songlist:
            playlist_songs = Song.query.filter_by(song_id=i).first()
            # if playlist_songs:
            this_playlist_songs.append({"song": playlist_songs.serialize()})
            # this_playlist_songs.append({"song": playlist_songs.serialize()})

    return jsonify({
        'this_playlist': {
            'pl_id': playlist.pl_id,
            'pl_title': playlist.pl_title,
            'songs': songlist,
        },
        'this_playlist_songs': this_playlist_songs,
        'user_id' : id,
    })

@app.route('/userdashboard/<int:id>/edit_playlist/<int:pl_id>', methods = ['GET', 'POST'])
@auth_token_required
def edit_playlist(id, pl_id):
    
    this_playlist = Splaylist.query.filter_by(pl_id=pl_id).first()
    # my_playlists = Playlist_song_association.query.filter_by(apl_id=pl_id).all()


    if request.method == 'POST':
        
        data = request.get_json()
        pl_title = data.get('title')
        songs = data.get('songs')
        print(songs)
        
        if this_playlist.pl_user == id:
            this_playlist.pl_title = pl_title
            db.session.commit()
            if len(songs) > 0:
                Playlist_song_association.query.filter_by(apl_id=pl_id).delete()
                db.session.commit()
                for i in songs:
                    new_playlist = Playlist_song_association( apl_id = this_playlist.pl_id, asong_id = i)
                    db.session.add(new_playlist)
                    db.session.commit()

            return jsonify({'msg' : "Playlist Updated SuccessfulLy."})
    
    return jsonify({'message': 'Playlist not Updated'})

@app.route('/userdashboard/<int:id>/flag_music/<int:music_id>', methods = ['GET', 'POST'])
@auth_token_required
def flag_music(id, music_id):
    if request.method == 'POST':
        data = request.get_json()
        song_id = data.get('song_id')
        print(song_id)
        album_id = data.get('album_id')
        print(album_id)

        if album_id:
            new_flag = Flag(album_id = music_id, user_id = id)
            db.session.add(new_flag)
            db.session.commit()
            return jsonify({'msg' : "Album Flaged SuccessfulLy."})

        if song_id:
            new_flag = Flag(song_id = music_id, user_id = id)
            db.session.add(new_flag)
            db.session.commit()
            return jsonify({'msg' : "Song Flaged SuccessfulLy."})


        else:
            return jsonify({'msg' : "Flag request not processed"})

@app.route('/userdashboard/<int:id>/create_album', methods = ['GET', 'POST'])
@auth_token_required
def create_album(id):
    if request.method == 'POST':
        data = request.get_json()
        album_name = data.get('name')
        album_genre = data.get('genre')
        selectedalbumSongs = data.get('selectedalbumSongs')
        # print(selectedplaylistSongs)

        new_album = Album(album_name=album_name, album_genre=album_genre, album_artist=id)
        db.session.add(new_album)
        db.session.commit()

        this_album = Album.query.filter_by(album_artist=id, album_name= album_name, album_genre=album_genre).first()
        for i in selectedalbumSongs:
            new_album1 = Album_song_association( aalbum_id = this_album.album_id, asong_id = i)
            db.session.add(new_album1)
            db.session.commit()

        return {'msg' : "Album Created."}

@app.route('/userdashboard/<int:id>/edit_album/<int:album_id>', methods = ['GET', 'POST'])
@auth_token_required
def edit_album(id, album_id):
    
    this_album = Album.query.filter_by(album_id=album_id).first()
    # my_playlists = Playlist_song_association.query.filter_by(apl_id=pl_id).all()


    if request.method == 'POST':
        data = request.get_json()
        album_name = data.get('name')
        album_genre = data.get('genre')
        songs = data.get('songs')
        print(songs)
        
        if this_album.album_artist == id:
            this_album.album_name = album_name
            this_album.album_genre = album_genre
            db.session.commit()

            if len(songs) > 0:
                Album_song_association.query.filter_by(aalbum_id=album_id).delete()
                db.session.commit()
                for i in songs:
                    new_album = Album_song_association( aalbum_id = album_id, asong_id = i)
                    db.session.add(new_album)
                    db.session.commit()

            return jsonify({'msg' : "Album Updated SuccessfulLy."})
    
    return jsonify({'message': 'Album not Updated'})

@app.route('/userdashboard/<int:id>/delete_album/<int:album_id>', methods = ['DELETE'])
@auth_token_required
def delete_album(id, album_id):
    current_album = Album.query.filter_by(album_id=album_id).first()

    if request.method == 'DELETE':
        if current_album.album_artist == id:
            Album.query.filter_by(album_id=album_id).delete()
            Album_song_association.query.filter_by(asa_id = album_id).delete()
            db.session.commit()

        return {'msg' : "Album Deleted SuccessfulLy."}

@app.route('/album_data/<int:id>/<int:album_id>', methods = ['GET', 'POST'])
@cache.cached(timeout=50, unless=lambda: request.method == 'POST')
@auth_token_required
def album_data(id, album_id):
    album = Album.query.filter_by(album_id=album_id).first()
    this_user_rating = Album_Rating.query.filter_by(user_id=id, album_id=album_id).first()
    my_albums = Album_song_association.query.filter_by(aalbum_id=album_id).all()
    songlist = []

    flag = Flag.query.filter_by(user_id=id, album_id=album_id).first()
    user_flag = False
    if flag:
        user_flag = True

    c_flag = False
    if album.album_artist == id:
        c_flag = True

    for i in my_albums:
        songlist.append(i.asong_id)

    my_rating = None
    if this_user_rating:
        my_rating = this_user_rating.album_rating
    
    avg_rating = Album_Rating.query.filter(Album_Rating.album_id == album_id).with_entities(func.avg(Album_Rating.album_rating)).scalar()

    this_album_songs = []
    if len(songlist) > 0:
        for i in songlist:
            album_songs = Song.query.filter_by(song_id=i).first()
            # if playlist_songs:
            this_album_songs.append({"song": album_songs.serialize()})
            # this_playlist_songs.append({"song": playlist_songs.serialize()})

    if request.method == 'POST':
        cache.clear()
        data = request.get_json()
        user_rating = data.get('user_rating')
        add_rating = Album_Rating(album_rating = user_rating, user_id = id, album_id = album_id)
        db.session.add(add_rating)
        db.session.commit()

        return jsonify({'msg' : "Rating Added successfully."})
        
    return jsonify({
        'this_album': {
            'album_id': album.album_id,
            'album_name': album.album_name,
            'album_genre': album.album_genre,
            'album_artist': album.album_artist,
            'songs': songlist,
            'avg_rating': avg_rating,
            'my_rating': my_rating,
            'user_flag': user_flag,
            'c_flag': c_flag,
        },
        'this_album_songs': this_album_songs,
        'user_id' : id,
    })
    

@app.route('/all_data/<int:id>', methods = ['GET', 'POST'])
@cache.cached(timeout=50, unless=lambda: request.method == 'POST')
@auth_token_required
def all_songs(id):
    if request.method == 'POST':
        cache.clear()
        data = request.get_json()
        current_user_role = data.get('access')
        # user_role = data.get('userAccess')
        # print(current_user_role)
        
        all_songs = Song.query.all()
        all_albums = Album.query.all()
        all_users = User.query.all()

        top_songs = db.session.query(Song, func.avg(Song_Rating.song_rating).label('avg_rating')).join(Song_Rating, Song.song_id == Song_Rating.song_id).group_by(Song).order_by(func.avg(Song_Rating.song_rating).desc()).all()

        recomended_songs = []
        # [(<Song 1>, 5.0), (<Song 2>, .0), (<Song 3>, 3.0), (<Song 4>, 2.0), (<Song 5>, 1.0), (<Song 6>, 0.0)]
        top_song_ids = db.session.query(distinct(Song_Rating.song_id)).all()

        top_sid = []
        for i in top_song_ids:
            top_sid.append((i[0]))

        for j in top_songs:
            recomended_songs.append(j)
        for i in all_songs:
            if i.song_id not in top_sid:
                recomended_songs.append((i, 0.0))
        
        recomended_songs_serialized = [
            {
        'song': song.serialize(),
        'avg_rating': avg_rating,
        }
        for song, avg_rating in recomended_songs]

     

        top_albums = db.session.query(Album, func.avg(Album_Rating.album_rating).label('avg_rating')).join(Album_Rating, Album.album_id == Album_Rating.album_id).group_by(Album).order_by(func.avg(Album_Rating.album_rating).desc()).all()

        recomended_albums = []
        top_album_ids = db.session.query(distinct(Album_Rating.album_id)).all()

        top_aid = []
        for i in top_album_ids:
            top_aid.append((i[0]))

        for j in top_albums:
            recomended_albums.append(j)
        for i in all_albums:
            if i.album_id not in top_aid:
                recomended_albums.append((i, 0.0))

        recomended_albums_serialized = [
            {
        'album': album.serialize(),
        'avg_rating': avg_rating,
        }
        for album, avg_rating in recomended_albums]


        if current_user_role == 'creator':
       
            my_playlists = Splaylist.query.filter_by(pl_user=id).all()
            all_playlist_songs = Playlist_song_association.query.all()
            all_album_songs = Album_song_association.query.all()
            my_songs = Song.query.filter_by(song_creator=id).all()
          
            my_albums = Album.query.filter_by(album_artist=id).all()
            


            return jsonify({
                'all_songs': [song.serialize() for song in all_songs],
                'recomended_songs_serialized' : recomended_songs_serialized,
                'recomended_albums_serialized' : recomended_albums_serialized,
                'my_songs' : [song.serialize() for song in my_songs],
                'my_playlists' :  [playlist.serialize() for playlist in my_playlists],
                'all_playlist_songs' : [playlistsong.serialize() for playlistsong in all_playlist_songs],
                'my_albums' :  [album.serialize() for album in my_albums],
                'all_album_songs' : [albumsong.serialize() for albumsong in all_album_songs],

            })

        elif current_user_role == 'general':
            
            my_playlists = Splaylist.query.filter_by(pl_user=id).all()
            all_playlist_songs = Playlist_song_association.query.all()
         
  

            return jsonify({
                'all_songs': [song.serialize() for song in all_songs],
                'recomended_songs_serialized' : recomended_songs_serialized,
                'recomended_albums_serialized' : recomended_albums_serialized,
                'my_playlists' :  [playlist.serialize() for playlist in my_playlists],
                'all_playlist_songs' : [playlistsong.serialize() for playlistsong in all_playlist_songs],

            
            })
        
        elif current_user_role == 'admin':
            # total number of users for each role
            role_user_count = db.session.query(Role.name, func.count(RolesUsers.user_id).label('user_count')).join(RolesUsers, Role.id == RolesUsers.role_id).group_by(Role.name).all()

            role_user_count = {role_name: user_count for role_name, user_count in role_user_count}

            # print(role_user_count)

            song_count = Song.query.count()
            album_count = Album.query.count()
            c_count = role_user_count['creator']
            u_count = role_user_count['general']
            total_users = c_count + u_count

            top5_songs = db.session.query(Song, func.avg(Song_Rating.song_rating).label('avg_rating')).join(Song_Rating, Song.song_id == Song_Rating.song_id).group_by(Song).order_by(func.avg(Song_Rating.song_rating).desc()).limit(5).all()

            serialized_top5_songs = [{'song': song.serialize(), 'avg_rating': avg_rating} for song, avg_rating in top5_songs]

            top5_albums = db.session.query(Album, func.avg(Album_Rating.album_rating).label('avg_rating')).join(Album_Rating, Album.album_id == Album_Rating.album_id).group_by(Album).order_by(func.avg(Album_Rating.album_rating).desc()).limit(5).all()

            serialized_top5_albums = [{'album': album.serialize(), 'avg_rating': avg_rating} for album, avg_rating in top5_albums]

            # print(serialized_top5_songs)


            flagged_songs = Flag.query.filter(Flag.song_id.isnot(None)).all()
            flagged_albums = Flag.query.filter(Flag.album_id.isnot(None)).all()
            


            all_album_songs = Album_song_association.query.all()
            my_songs = Song.query.filter_by(song_creator=id).all()
            my_albums = Album.query.filter_by(album_artist=id).all()
        


            return jsonify({

                'top5_songs': serialized_top5_songs,
                'top5_albums': serialized_top5_albums,

                'all_songs': [song.serialize() for song in all_songs],
                'all_albums': [i.serialize() for i in all_albums],
                'all_album_songs' : [albumsong.serialize() for albumsong in all_album_songs],
             
                'flagged_songs' : [i.serialize() for i in flagged_songs],
                'flagged_albums' : [i.serialize() for i in flagged_albums],
               
                'song_count' : song_count,
                'album_count' : album_count,
                'c_count' : c_count,
                'u_count' : u_count,
                'total_users' : total_users,
               
            })
        else:
            return jsonify({'message': 'Invalid user role'}), 400

@app.route('/<int:user_id>/search', methods = ['GET', 'POST'])
@cache.cached(timeout=50, unless=lambda: request.method == 'POST')
@auth_token_required
def search(user_id):
    if request.method == "POST":
        cache.clear()
        data = request.get_json()
        type = data.get('searchType')
        searchText = data.get('searchText')
       


        if type == "song":
            result = Song.query.filter_by(song_title=searchText).all()
            # print(result)
            if result:
                for i in result: 
                    # print(i)
                    return jsonify({
                        'result': {
                        'song_id': i.song_id,
                        'song_title': i.song_title,
                  
                    },})
            
            else:
                return jsonify({'msg' : "No results found"})
            
        elif type == "album":
            result = Album.query.filter_by(album_name=searchText).all()
            if result:
                for i in result:
                    return jsonify({
                        'result': {
                        'album_id': i.album_id,
                        'album_name': i.album_name,
                      
                    },})
            else:
                return jsonify({'msg' : "No results found"})
            
        elif type == "genre":
            result = Album.query.filter_by(album_genre=searchText).all()
            if result:
                for i in result:
                    return jsonify({
                        'result': {
                        'album_id': i.album_id,
                        'album_name': i.album_name,
                       
                    },})
  
            else:
                return jsonify({'msg' : "No results found"})
            
    return jsonify({'error': 'Invalid request'})


if __name__ == "__main__":
    app.run(debug=True)



