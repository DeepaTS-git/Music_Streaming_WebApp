from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy import distinct, desc
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable = False)
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'), nullable = False)

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(), nullable = False)
    email = db.Column(db.String(), unique = True, nullable = False)
    password = db.Column(db.String(), nullable = False)
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)
    active =  db.Column(db.Boolean())
    roles = db.relationship('Role', secondary = 'roles_users', backref = db.backref('users', lazy = 'dynamic'))
    last_login = db.Column(db.DateTime(timezone = True), default = func.now())

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(), unique = True)
    description = db.Column(db.String())

class Song(db.Model):
    __tablename__ = 'song'
    song_id = db.Column(db.Integer(), primary_key = True)
    song_title = db.Column(db.String(), nullable = False)
    singer = db.Column(db.String())
    song_lyrics = db.Column(db.String())
    song_duration = db.Column(db.Integer())
    file_name = db.Column(db.String())
    song_creation_date = db.Column(db.DateTime(timezone = True), default = func.now())
    song_creator = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable = False)

    def serialize(self):
        return {
            'song_id': self.song_id,
            'song_title': self.song_title,
            'singer': self.singer,
            'song_lyrics': self.song_lyrics,
            'song_duration': self.song_duration,
            'file_name': self.file_name,
            'song_creator': self.song_creator,
            'song_creation_date' : self.song_creation_date,
        } 

class Song_Rating(db.Model):
    __tablename__ = 'song_rating'
    sr_id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(),  db.ForeignKey('user.id'), nullable = False)
    song_id = db.Column(db.Integer(), db.ForeignKey('song.song_id'), nullable = False)
    song_rating = db.Column(db.Integer(), nullable = False)
    rating_given_date = db.Column(db.DateTime(timezone = True), default = func.now())

class Album(db.Model):
    __tablename__ = 'album'
    album_id = db.Column(db.Integer(), primary_key = True)
    album_name = db.Column(db.String(), unique = True, nullable = False)
    album_genre = db.Column(db.String(), nullable = False)
    album_artist = db.Column(db.Integer(), db.ForeignKey('user.id')) # album creator
    album_creation_date = db.Column(db.DateTime(timezone = True), default = func.now())

    def serialize(self):
        return {
            'album_id': self.album_id,
            'album_name': self.album_name,
            'album_genre': self.album_genre,
            'album_artist': self.album_artist,
            'album_creation_date': self.album_creation_date,
        }

class Album_Rating(db.Model):
    __tablename__ = 'album_rating'
    ar_id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable = False) 
    album_id = db.Column(db.Integer(), db.ForeignKey('album.album_id'), nullable = False)
    album_rating = db.Column(db.Integer(), nullable = False)
    rating_given_date = db.Column(db.DateTime(timezone = True), default = func.now())

# Many to many relationship between Song and Album 
class Album_song_association(db.Model):
    __tablename__ = 'album_song_association'
    asa_id = db.Column(db.Integer(), primary_key = True)
    aalbum_id = db.Column(db.Integer, db.ForeignKey("album.album_id"), nullable = False)
    asong_id = db.Column(db.Integer, db.ForeignKey("song.song_id"), nullable = False)

    def serialize(self):
        return {
            'asa_id': self.asa_id,
            'aalbum_id': self.aalbum_id,
            'asong_id': self.asong_id,
        }

class Flag(db.Model):
    __tablename__ = 'flag'
    flag_id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    song_id = db.Column(db.Integer(), db.ForeignKey('song.song_id'))
    album_id = db.Column(db.Integer(), db.ForeignKey('album.album_id'))

    def serialize(self):
        return {
            'flag_id': self.flag_id,
            'user_id': self.user_id,
            'song_id': self.song_id,
            'album_id': self.album_id,
        }

class Blacklist(db.Model):
     __tablename__ = 'blacklist'
     bl_id = db.Column(db.Integer(), primary_key = True)
     user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))

class Splaylist(db.Model):
    __tablename__ = 'playlist'
    pl_id = db.Column(db.Integer(), primary_key = True)
    pl_title = db.Column(db.String(), nullable = False)
    pl_user = db.Column(db.Integer(), db.ForeignKey('user.id'))

    def serialize(self):
        return {
            'pl_id': self.pl_id,
            'pl_title': self.pl_title,
            'pl_user': self.pl_user,
        }

# Many to many relationship between Song and Playlist 
class Playlist_song_association(db.Model):
    __tablename__ = 'playlist_song_association'
    psa_id = db.Column(db.Integer(), primary_key = True)
    apl_id = db.Column(db.Integer, db.ForeignKey("playlist.pl_id"), nullable = False)
    asong_id = db.Column(db.Integer, db.ForeignKey("song.song_id"), nullable = False)

    def serialize(self):
        return {
            'psa_id': self.psa_id,
            'apl_id': self.apl_id,
            'asong_id': self.asong_id,
        }