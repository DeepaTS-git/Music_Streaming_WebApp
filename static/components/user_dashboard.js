const UserDashboard = {
    template: `<div>
  

    <div v-if ="success">
        <div>
 
            <form style = "color: #f2f2f2; display: inline-block;">
                <select v-model="searchData.searchType" name="type">
                <option value="song">Song</option>
                <option value="album">Album</option>
                <option value="genre">Genre</option>    
                </select>
                <input v-model="searchData.searchText" type="text" placeholder="Search.." name="search">
                <button @click.prevent = "search" type="submit"> Submit </button>
            </form>

            <button @click.prevent="logout" type="submit" style="float: right;">Logout</button>

        </div>



        <div v-if="userdata.access === 'general'"> 
            <h3> This is General User's Dashboard.</h3>
        </div>

        <div v-if="userdata.access === 'creator'"> 
            <h3> This is Creator's Dashboard.</h3>
        </div>

        <h2>Welcome {{userdata.name}}!</h2>

        <div v-if="msg">
            <h2>{{ msg }} </h2>
        </div>
        
        <!-- Recommended Songs-->

        <div class="scroll-container">
            <h2>Recomended Songs</h2>
            <div v-for="i in recomended_songs" :key="i.song.song_id" class = 'play_song'>
                <li>
                    <div>
                        <p>{{ i.song.song_title }}</p>
                       
                        <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + i.song.song_id"><button class="btn btn-secondary">Open/Rate</button></router-link>
                    </div>
                </li>
            </div>
        </div>

        <!-- Recommended Albums-->

        <div class="scroll-container">
            <h2>Recomended Albums</h2>

            <div v-for="i in recomended_albums" :key="i.album.song_id" class = 'play_song'>
                <li>
                    <div>
                        <p>{{ i.album.album_name }}</p>
                       
                        <router-link :to="'/userdashboard/' + userdata.id + '/open_album/' + i.album.album_id"><button class="btn btn-secondary">Open/Rate</button></router-link>
                    </div>
                </li>
            </div>
        </div>


        <!-- Create playlist-->

        <div> 
            <h2>My Playlist</h2>
            <div class="scroll-container">
                <!-- Button trigger modal for New Playlist-->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newplaylistModal">
                    Create New Playlist
                </button>
    
                <!-- Modal for New Playlist-->
                <div class="modal fade" id="newplaylistModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="newplaylistModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content" style="width: 800px;" >
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="newplaylistModalLabel">Create New Playlist</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form> 
                                <div class="modal-body">
                                    <div>
                                        <label class = "my-2"> Playlist Title : </label>
                                        <input v-model = "playlistform.title" type="text">
                                    </div>

                                    <div>
                                        <select name="playlist_songs" v-model="playlistform.selectedplaylistSongs" multiple>
                                            <!-- Iterate through all_songs and create an option for each -->
                                            <option v-for="song in allSongs" :key="song.song_id" :value="song.song_id">
                                                {{ song.song_title }}
                                            </option>
                                        </select>
                                    </div>
                                </div> 
    
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" @click.prevent="create_playlist" data-bs-dismiss="modal">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- My all playlists-->

                <div class="scroll-container">
                    <div v-for="playlist in my_playlists" :key="playlist.pl_id" class = 'play_song'>
                        <li>
                            <div>
                                <p>{{ playlist.pl_title }}</p>

                                <!--Open playlist-->
                                <router-link :to="'/userdashboard/' + userdata.id + '/open_playlist/' + playlist.pl_id"><button class="btn btn-secondary">Open</button></router-link>
                                <!--Open playlist end-->

                                <!--Edit playlist-->






                                <!-- Button trigger modal for Edit Playlist-->
                                <button @click.prevent="openEditModal(playlist)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editplaylistModal">
                                    Edit
                                </button>
                    
                                <!-- Modal for Edit Playlist-->
                                <div class="modal fade" id="editplaylistModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editplaylistModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content" style="width: 800px;" >
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="editplaylistModalLabel">Edit Playlist</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form> 
                                                <div class="modal-body">
                                                <div>
                                                <label class = "my-2"> Playlist Title : </label>
                                                <input v-model = "selectedplaylist.title" type="text">
                                            </div>
        
                                            <div>
                                                <select name="playlist_songs" v-model="selectedplaylist.songs" multiple>
                                                    <!-- Iterate through all_songs and create an option for each -->
                                                    <option v-for="song in allSongs" :key="song.song_id" :value="song.song_id">
                                                        {{ song.song_title }}
                                                    </option>
                                                </select>
                                            </div>
                                                </div> 
                    
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" @click.prevent="edit_playlist(selectedplaylist.id)" data-bs-dismiss="modal">Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>







                                <!--Edit playlist end-->

                                <!--Delete playlist-->

                                <button @click.prevent="delete_playlist(playlist.pl_id)" type="button" class="btn btn-secondary" >Delete</button>

                                <!--Delete playlist end-->
                            </div>
                        </li>
                    </div> 
                </div> 
                <!-- My all playlists ends-->

            </div>
        </div>

        <!-- Creator - New Song Upload-->



        <div v-if="userdata.access === 'creator'" > 
            <h2>My Uplaods</h2>
            <div class="scroll-container">
                <h4>Songs</h4>
                <!-- Button trigger modal for New Song Upload-->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newsongModal">
                    Upload New Song
                </button>
    
                <!-- Modal for Upload New Song-->
                <div class="modal fade" id="newsongModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="newsongModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content" style="width: 800px;" >
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="newsongModalLabel">Upload New Song</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form> 
                                <div class="modal-body">
                                    <div>
                                        <label class = "my-2"> Title : </label>
                                        <input v-model = "formdata1.title" type="text">
                                    </div>
                                    <div>
                                        <label class = "my-2"> Singer : </label>
                                        <input v-model = "formdata1.singer" type="text">
                                    </div>
                                    <div>
                                        <label class = "my-2"> Duration : </label>
                                        <input v-model = "formdata1.duration" type="number" step="0.01">
                                    </div>
                                    <div>
                                        <label class = "my-2"> Lyrics : </label>
                                        <textarea  rows="10" style="height: 319px; width: 700px;" v-model = "formdata1.lyrics"> Write Lyrics here </textarea>
                                    </div>
                                    <div> 
                                        <input style="width: 600px;" type="file" ref="fileInput" @change="formfile" accept = ".mp3"/>
                                    </div>
                                </div> 
    
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" @click.prevent="add_song" data-bs-dismiss="modal">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!--Creator - My Uploaded songs-->

                <div class="scroll-container">
                    <div v-for="song in my_songs" :key="song.song_id" class = 'play_song'>
                        <li>
                            <div>
                                <p>{{ song.song_title }}</p>

                                <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + song.song_id"><button class="btn btn-secondary">Open</button></router-link>

                               


                                <!-- Button trigger modal for Edit Song-->
                                <button @click.prevent="openEditSongModal(song)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editsongModal">
                                    Edit
                                </button>
                    
                                <!-- Modal for Edit Song-->
                                <div class="modal fade" id="editsongModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editsongModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content" style="width: 800px;" >
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="editsongModalLabel">Edit Song</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form> 
                                                <div class="modal-body">
                                                    <div>
                                                        <label class = "my-2"> Title : </label>
                                                        <input v-model = "selectedSong.title" type="text">
                                                    </div>
                                                    <div>
                                                        <label class = "my-2"> Singer : </label>
                                                        <input v-model = "selectedSong.singer" type="text">
                                                    </div>
                                                    <div>
                                                        <label class = "my-2"> Duration : </label>
                                                        <input v-model = "selectedSong.duration" type="number" step="0.01">
                                                    </div>
                                                    <div>
                                                        <label class = "my-2"> Lyrics : </label>
                                                        <textarea  rows="10" style="height: 319px; width: 700px;" v-model = "selectedSong.lyrics"></textarea>
                                                    </div>
                                                    <div> 
                                                        <input style="width: 600px;" type="file" ref="fileInput" @change="formfile1" accept = ".mp3"/>
                                                    </div>
                                                </div> 
                    
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" @click.prevent="edit_song(selectedSong.id)" data-bs-dismiss="modal">Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <button @click.prevent="delete_song(song.song_id)" type="button" class="btn btn-secondary" >Delete</button>
                            </div>
                        </li>
                    </div>
                </div>
            </div>

            <!-- Creator - New Album Upload-->
            <div class="scroll-container">
                <h4>Albums</h4>

                <div class="scroll-container">
                    <!-- Button trigger modal for New Album-->
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newalbumModal">
                        Create New Album
                    </button>
    
                    <!-- Modal for New Album-->
                    <div class="modal fade" id="newalbumModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="newalbumModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="width: 800px;" >
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="newalbumModalLabel">Create New Album</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <form> 
                                    <div class="modal-body">
                                        <div>
                                            <label class = "my-2"> Album Name : </label>
                                            <input v-model = "albumform.name" type="text">
                                        </div>
                                        <div>
                                            <label class = "my-2"> Album Genre : </label>
                                            <input v-model = "albumform.genre" type="text">
                                        </div>

                                        <div>
                                            <select name="album_songs" v-model="albumform.selectedalbumSongs" multiple>
                                                <!-- Iterate through all_songs and create an option for each -->
                                                <option v-for="song in allSongs" :key="song.song_id" :value="song.song_id">
                                                    {{ song.song_title }}
                                                </option>
                                            </select>
                                        </div>
                                    </div> 
    
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary" @click.prevent="create_album" data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- My all Albums-->

                    <div class="scroll-container">
                        <div v-for="album in my_albums" :key="album.album_id" class = 'play_song'>
                            <li>
                                <div>
                                    <p>{{ album.album_name }}</p>

                                    <!--Open album-->
                                    <router-link :to="'/userdashboard/' + userdata.id + '/open_album/' + album.album_id"><button class="btn btn-secondary">Open</button></router-link>
                                    <!--Open album end-->

                                    <!--Edit album-->

                                    <!-- Button trigger modal for Edit Album-->
                                    <button @click.prevent="openEditAlbum(album)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editalbumModal">
                                        Edit
                                    </button>
                        
                                    <!-- Modal for Edit Album-->
                                    <div class="modal fade" id="editalbumModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editalbumModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content" style="width: 800px;" >
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="editalbumModalLabel">Edit Album</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <form> 
                                                    <div class="modal-body">
                                                        <div>
                                                            <label class = "my-2"> Album Name : </label>
                                                            <input v-model = "selectedalbum.name" type="text">
                                                        </div>
                                                        <div>
                                                            <label class = "my-2"> Album Genre : </label>
                                                            <input v-model = "selectedalbum.genre" type="text">
                                                        </div>
                                                        <div>
                                                            <select name="album_songs" v-model="selectedalbum.songs" multiple>
                                                                <!-- Iterate through all_songs and create an option for each -->
                                                                <option v-for="song in allSongs" :key="song.song_id" :value="song.song_id">
                                                                    {{ song.song_title }}
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div> 
                        
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" class="btn btn-primary" @click.prevent="edit_album(selectedalbum.id)" data-bs-dismiss="modal">Submit</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>


                                    <!--Edit Album end-->

                                    <!--Delete Album-->

                                    <button @click.prevent="delete_album(album.album_id)" type="button" class="btn btn-secondary" >Delete</button>

                                    <!--Delete album end-->
                                </div>
                            </li>
                        </div> 
                    </div> 
                    <!-- My all playlists ends-->
                </div>
            </div>

            <!-- Creator - New Album Upload end-->

        </div>

        <!-- if user is unable to login show error-->
    
        
    </div>

    <div v-else>
        {{error}}
    </div>

    <div class ='row'> 
        <div class = "column">
            <router-view></router-view>
        </div>
    </div>

    </div>`,

    props : ["id"],
    
    data : function(){
        // add v-model to input field e.g. <input v-model="password" type="password">
        return {
            userdata : {
                id : '',
                name : '',
                email : '',
                access : '',
            },
            formdata1 : { //new song data
                title : '',
                singer : '',
                duration : '',
                lyrics : '',
                selectedFile: null,
            },
            allSongs :{},
            selectedSong:{ 
                id :'',
                title : '',
                singer : '',
                duration : '',
                lyrics : '',
                selectedFile: null,
            },
            recomended_songs : null,
            recomended_albums : null,
            my_songs : null,
            playlistform :{
                title: '',
                selectedplaylistSongs: [], 
            },
            albumform :{
                name: '',
                genre: '',
                selectedalbumSongs: [], 
            },
            my_playlists : {},
            my_albums : {},
            all_playlist_songs : {},
            selectedplaylist:{ // open playlist
                title : '',
                id : '',
                songs : [],
            },
            selectedalbum:{ // open playlist
                name : '',
                id : '',
                genre: '',
                songs : [],
            },
            searchData:{
                searchType: '', 
                searchText: '',
            },
            // search_result : false,
            // result : {},
            
            // selectedplaylist1 :{
            //     id : '',
            //     title: '',
            //     selectedplaylistSongs: [], 
            // },


            success : true,
            msg : null,
            error : null,

            creator_role : false,
            
        };
       
    },

    async mounted() {
        const res = await fetch (`/userdashboard/${this.$route.params.id}`, { 
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token' : localStorage.getItem('Auth-token'),
            },
        })
        const data = await res.json()
        // console.log(data)
        if (res.ok) {
            this.userdata = data.user
        } else if (res.status == 401){
            this.success = false
            this.error = data.response.error
        }
        const all_data = await fetch (`/all_data/${this.$route.params.id}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token' : localStorage.getItem('Auth-token'),
            },
            body: JSON.stringify(this.userdata), // guess only access is required at endpoint
        })
        if (all_data.ok) {
            const responseData = await all_data.json();

            const allSongs = responseData.all_songs;
            this.allSongs = allSongs

            const recomended_songs = responseData.recomended_songs_serialized;
            this.recomended_songs = recomended_songs;

            const recomended_albums = responseData.recomended_albums_serialized;
            this.recomended_albums = recomended_albums;

            const my_songs = responseData.my_songs;
            this.my_songs = my_songs;

            const my_playlists = responseData.my_playlists;
            this.my_playlists = my_playlists;

            const all_playlist_songs = responseData.all_playlist_songs;
            this.all_playlist_songs = all_playlist_songs;

            const my_albums = responseData.my_albums;
            this.my_albums = my_albums;

            const all_album_songs = responseData.all_album_songs;
            this.all_album_songs = all_album_songs;

            console.log(allSongs); //not required can delete later
            console.log(recomended_songs); //not required can delete later
            console.log(recomended_albums); //not required can delete later
            console.log(my_songs); //not required can delete later


            allSongs.forEach(song => { //not required can delete later
                console.log(song.song_id, song.song_title,); //not required can delete later
            }); //not required can delete later
        } else {
            
             console.error('Error fetching data');
        }
        // if (this.selectedSong) {
        //     this.editSong.title = this.selectedSong.song_title;
        //     this.editSong.singer = this.selectedSong.singer;
        //     this.editSong.duration = this.selectedSong.song_duration;
        //     this.editSong.lyrics = this.selectedSong.song_lyrics;
        // }
    },
    methods : {
        async logout(){
            // this.login = false;
            const res = await fetch("/logout")
            if (res.ok){
              localStorage.clear()
              this.$router.push("/")
            }else{
              console.log("Could not logout the user.")
            }
        },
        async delete_song(song_id) {
            const res = await fetch(`/userdashboard/${this.$route.params.id}/delete_song/${song_id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('Auth-token'),
                },
            });
    
            if (res.ok) {
                const response = await res.json();
                console.log(response.msg);
                location.reload();
            } else {
                const error = await res.json();
                console.error(error);
                
            }
        },
        formfile(event) { //for new song
            console.log(event)
            this.formdata1.selectedFile = event.target.files[0];
        },
        formfile1(event) { //for edit song
            console.log(event)
            this.selectedSong.selectedFile = event.target.files[0];
        },
        async add_song(){
            if (!this.formdata1.title || !this.formdata1.singer || !this.formdata1.selectedFile) {
                // to handle input validation request 
                alert('Please fill in Title, Singer and File.');
                return;
            }

            const formData = new FormData();
            formData.append('title', this.formdata1.title);
            formData.append('singer', this.formdata1.singer);
            formData.append('duration', this.formdata1.duration); 
            formData.append('lyrics', this.formdata1.lyrics);
            formData.append('selectedFile', this.formdata1.selectedFile);
            
            const res = await fetch(`/add_song/${this.$route.params.id}`, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authentication-Token' : localStorage.getItem('Auth-token'),
                },
                body: formData,
            });
            // console.log(res)
            if (res.ok) {
                const songdata = await res.json();
                console.log(songdata)
                location.reload();
            } else {
                const songdata = await res.json();
                console.log(songdata)
            }

        },

        async edit_song(song_id){
            
            if (!this.selectedSong.title || !this.selectedSong.singer ){
                // to handle input validation request 
                alert('Please fill in Title and Singer.');
                return;
            }
            const editformData = new FormData();
            editformData.append('title', this.selectedSong.title);
            editformData.append('singer', this.selectedSong.singer);
            editformData.append('duration', this.selectedSong.duration);
            editformData.append('lyrics', this.selectedSong.lyrics);

            editformData.append('selectedFile', this.selectedSong.selectedFile || null);

            // editformData.append('selectedFile', this.selectedSong.selectedFile);
            // console.log(editformData)
            const res = await fetch(`/userdashboard/${this.$route.params.id}/edit_song/${song_id}`, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authentication-Token' : localStorage.getItem('Auth-token'),
                },
                body: editformData,
            });
            // console.log(res)
            if (res.ok) {
                const thissong = await res.json();
                console.log(thissong)

                location.reload();
            } else {
                const thissong = await res.json();
                console.log(thissong)
            }

        },
        async openEditSongModal(song) {
            this.selectedSong.title = song.song_title;
            this.selectedSong.singer = song.singer;
            this.selectedSong.duration = song.song_duration;
            this.selectedSong.lyrics = song.song_lyrics;
            this.selectedSong.id = song.song_id;
            // this.selectedSong.selectedFile = song.file_name;

        },
        async create_playlist() {
            const res = await fetch(`/userdashboard/${this.$route.params.id}/create_playlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token' : localStorage.getItem('Auth-token'),
                },
                body: JSON.stringify(this.playlistform),
                
            });
            // console.log(res)
            if (res.ok) {
                const playlistdata = await res.json();
                console.log(playlistdata)

                location.reload();
            } else {
                const playlistdata = await res.json();
                console.log(playlistdata)
            }
        },
        async delete_playlist(pl_id) {
            const res = await fetch(`/userdashboard/${this.$route.params.id}/delete_playlist/${pl_id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('Auth-token'),
                },
            });
    
            if (res.ok) {
                const response = await res.json();
                console.log(response.msg);
                location.reload();
            } else {
                const error = await res.json();
                console.error(error);
            }
        },
        async openEditModal(playlist) {
            this.selectedplaylist.title = playlist.pl_title;
            this.selectedplaylist.id = playlist.pl_id;
            // this.selectedplaylist.songs = playlist.songs;   
        },
        async edit_playlist(pl_id){
            const res = await fetch(`/userdashboard/${this.$route.params.id}/edit_playlist/${pl_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token' : localStorage.getItem('Auth-token'),
                },
                body: JSON.stringify(this.selectedplaylist),
            });
           
            if (res.ok) {
                const thisplaylist = await res.json();
                console.log(thisplaylist)

                location.reload();
            } else {
                const thisplaylist = await res.json();
                console.log(thisplaylist)
            }
        },
        async create_album() {
            const res = await fetch(`/userdashboard/${this.$route.params.id}/create_album`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token' : localStorage.getItem('Auth-token'),
                },
                body: JSON.stringify(this.albumform),
                
            });
            // console.log(res)
            if (res.ok) {
                const albumdata = await res.json();
                console.log(albumdata)

                location.reload();
            } else {
                const albumdata = await res.json();
                console.log(albumdata)
            }
        },
        async openEditAlbum(album) {
            this.selectedalbum.name = album.album_name;
            this.selectedalbum.id = album.album_id;
            this.selectedalbum.genre = album.album_genre;
            // this.selectedplaylist.songs = playlist.songs;   
        },
        async edit_album(album_id){
            const res = await fetch(`/userdashboard/${this.$route.params.id}/edit_album/${album_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token' : localStorage.getItem('Auth-token'),
                },
                body: JSON.stringify(this.selectedalbum),
            });
           
            if (res.ok) {
                const thisalbum = await res.json();
                console.log(thisalbum)

                location.reload();
            } else {
                const thisalbum = await res.json();
                console.log(thisalbum)
            }
        },
        async delete_album(album_id) {
            const res = await fetch(`/userdashboard/${this.$route.params.id}/delete_album/${album_id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('Auth-token'),
                },
            });
    
            if (res.ok) {
                const response = await res.json();
                console.log(response.msg);
                location.reload();
            } else {
                const error = await res.json();
                console.error(error);
            }
        },
        async search() {
            // const searchData = new FormData();
            // searchData.append('searchType', this.searchType);
            // searchData.append('searchText', this.searchText);
            const res = await fetch(`/${this.$route.params.id}/search`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('Auth-token'),
                },
                // body: JSON.stringify(this.selectedalbum),
                // body: searchData,
                body: JSON.stringify(this.searchData)
            });
            if (res.ok) {
                const result = await res.json();
                console.log(result);

                this.$router.push({ 
                path: `/${this.$route.params.id}/search_result`,
                query: { result: result },
                });
            } else {
                this. error = "Something Went wrong."
            }
        },
        // generateLink(type, itemId) {
        //     switch (type) {
        //         case "song":
        //             return `/userdashboard/${this.$route.params.id}/open_song/${itemId}`;
        //         case "album":
        //             return `/userdashboard/${this.$route.params.id}/open_album/${itemId}`;
        //         case "genre":
        //             return `/userdashboard/${this.$route.params.id}/open_genre/${itemId}`;
            
        //     }
        // },
    },

}

export default UserDashboard;




// <!-- Search results -->

// <div v-if="search_result"> 
//     <div v-if="result.msg" >
//         <h3> {{ result.msg }} </h3>
//     </div>
//     <div v-else> 
//         <div v-for= "item in result.item" :key="item.id" >
//             <router-link to = "generateLink(item.type, item.id)">{{item.title}}</router-link>
//         </div>
//     </div>
// </div>



// <!--My Playlists-->

//                 <div class="scroll-container">
//                     <div v-for="playlist in my_playlists" :key="playlist.pl_id" class = 'play_song'>
//                         <li>
//                             <div>
//                                 <p>{{ playlist.pl_title }}</p>

//                                 <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + song.song_id"><button class="btn btn-secondary">Open</button></router-link>

//                                  <!--Open playlist-->
// <!-- Button trigger modal for Open Playlist-->
// <button @click.prevent="openplaylistModal(playlist)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#openplaylistModal">
//     Open
// </button>

// <!-- Modal for Open Playlist-->
// <div class="modal fade" id="openplaylistModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="openplaylistModalLabel" aria-hidden="true">
//     <div class="modal-dialog">
//         <div class="modal-content" style="width: 800px;" >
//             <div class="modal-header">
//                 <h1 class="modal-title fs-5" id="openplaylistModalLabel">{{playlist.pl_title}}</h1>
//                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
            
//             <div class="modal-body">
//                 <ul class = 'play_song'>
//                     <li v-for="playlistSong in all_playlist_songs" :key="playlistSong.apl_id" v-if="playlistSong.apl_id === playlist.pl_id">
//                         <div v-for="song in allSongs" : key="song.song_id" v-if="song.song_id === playlistSong.asong_id">
                                    
//                             <p>{{ song.song_title }}</p>
                                            
//                             <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + song.song_id"><button class="btn btn-secondary">Open</button>
//                             </router-link> 
//                         </div>
//                     </li>
//                 </ul>
//             </div>
//             <div class="modal-footer">
//                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//             </div>
            
//         </div>
//     </div>
// </div>



// <!--Open playlist end-->


                               


//                                 <!-- Button trigger modal for Edit Song-->
//                                 <button @click.prevent="openEditModal(song)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editsongModal">
//                                     Edit
//                                 </button>
                    
//                                 <!-- Modal for Edit Song-->
//                                 <div class="modal fade" id="editsongModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editsongModalLabel" aria-hidden="true">
//                                     <div class="modal-dialog">
//                                         <div class="modal-content" style="width: 800px;" >
//                                             <div class="modal-header">
//                                                 <h1 class="modal-title fs-5" id="editsongModalLabel">Edit Song</h1>
//                                                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                                             </div>
//                                             <form> 
//                                                 <div class="modal-body">
//                                                     <div>
//                                                         <label class = "my-2"> Title : </label>
//                                                         <input v-model = "selectedSong.title" type="text">
//                                                     </div>
//                                                     <div>
//                                                         <label class = "my-2"> Singer : </label>
//                                                         <input v-model = "selectedSong.singer" type="text">
//                                                     </div>
//                                                     <div>
//                                                         <label class = "my-2"> Duration : </label>
//                                                         <input v-model = "selectedSong.duration" type="number" step="0.01">
//                                                     </div>
//                                                     <div>
//                                                         <label class = "my-2"> Lyrics : </label>
//                                                         <textarea  rows="10" style="height: 319px; width: 700px;" v-model = "selectedSong.lyrics"></textarea>
//                                                     </div>
//                                                     <div> 
//                                                         <input style="width: 600px;" type="file" ref="fileInput" @change="formfile1" accept = ".mp3"/>
//                                                     </div>
//                                                 </div> 
                    
//                                                 <div class="modal-footer">
//                                                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                                                     <button type="button" class="btn btn-primary" @click.prevent="edit_song(selectedSong.id)" data-bs-dismiss="modal">Submit</button>
//                                                 </div>
//                                             </form>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button @click.prevent="delete_song(song.song_id)" type="button" class="btn btn-secondary" >Delete</button>
                                
                                
//                             </div>
//                         </li>
//                     </div>
//                 </div>



{/* <button @click.prevent="delete_song(song.song_id)" type="button" class="btn btn-secondary" >Delete</button> */}
{/* <button type="button" class="btn btn-secondary" >Edit</button> */}


// My all playlists

{/* <div class="scroll-container">
                    <div v-for="playlist in my_playlists" :key="playlist.pl_id" class = 'play_song'>
                        <li>
                            <div>
                                <p>{{ playlist.pl_title }}</p>

                                <!--Open playlist-->

                                <!-- Button trigger modal for Open Playlist-->
                                <button @click.prevent="openplaylistModal(playlist)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#openplaylistModal">
                                    Open
                                </button>
                    
                                <!-- Modal for Open Playlist-->
                                <div class="modal fade" id="openplaylistModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="openplaylistModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content" style="width: 800px;" >
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="openplaylistModalLabel">{{playlist.pl_title}}</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            
                                            <div class="modal-body">
                                                <ul class = 'play_song'>
                                                    <li v-for="playlistSong in all_playlist_songs" :key="playlistSong.apl_id" v-if="playlistSong.apl_id === playlist.pl_id">
                                                        <div v-for="song in allSongs" : key="song.song_id" v-if="song.song_id === playlistSong.asong_id">
                                                                    
                                                            <p>{{ song.song_title }}</p>
                                                                            
                                                            <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + song.song_id"><button class="btn btn-secondary">Open</button>
                                                            </router-link> 
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>


                               
                                <!-- Edit playlist -->

                                <!-- Button trigger modal for Edit Playlist-->
                                <button @click.prevent="openEditModal(song)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editsongModal">
                                    Edit
                                </button>
                    
                                <!-- Modal for Edit Song-->
                                <div class="modal fade" id="editsongModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editsongModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content" style="width: 800px;" >
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="editsongModalLabel">Edit Song</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form> 
                                                <div class="modal-body">
                                                    <div>
                                                        <label class = "my-2"> Title : </label>
                                                        <input v-model = "selectedSong.title" type="text">
                                                    </div>
                                                    <div>
                                                        <label class = "my-2"> Singer : </label>
                                                        <input v-model = "selectedSong.singer" type="text">
                                                    </div>
                                                    <div>
                                                        <label class = "my-2"> Duration : </label>
                                                        <input v-model = "selectedSong.duration" type="number" step="0.01">
                                                    </div>
                                                    <div>
                                                        <label class = "my-2"> Lyrics : </label>
                                                        <textarea  rows="10" style="height: 319px; width: 700px;" v-model = "selectedSong.lyrics"></textarea>
                                                    </div>
                                                    <div> 
                                                        <input style="width: 600px;" type="file" ref="fileInput" @change="formfile1" accept = ".mp3"/>
                                                    </div>
                                                </div> 
                    
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" @click.prevent="edit_song(selectedSong.id)" data-bs-dismiss="modal">Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <!-- Delete playlist -->

                                <button @click.prevent="delete_song(song.song_id)" type="button" class="btn btn-secondary" >Delete</button>
                                
                                
                            </div>
                        </li>
                    </div>
                </div> */}










// <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + song.song_id">Open</router-link>
// <router-link :to="'/userdashboard/' + userdata.id + '/edit_song/' + song.song_id">Edit</router-link>
// <router-link :to="'/userdashboard/' + userdata.id + '/delete_song/' + song.song_id">Delete</router-link>


/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newsongModal">
Upload New Song
</button>

</div>


<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Open modal for @mdo</button>
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@fat">Open modal for @fat</button>
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">Open modal for @getbootstrap</button>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class="modal-dialog">
<div class="modal-content">
    <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">New message</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <form>
            <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Recipient:</label>
                <input type="text" class="form-control" id="recipient-name">
            </div>
            <div class="mb-3">
                <label for="message-text" class="col-form-label">Message:</label>
                <textarea class="form-control" id="message-text"></textarea>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Send message</button>
    </div>
</div>
</div>
</div> */







/* <div v-for="song in allSongs" :key="song.song_id">
            <p>{{ song.song_title }}</p>

            <!-- Button trigger modal for Open Song-->
            <button type="button" class="btn btn-primary" :data-bs-target="'#opensongModal' + song.song_id" data-bs-toggle="modal" data-bs-target="#opensongModal">
                Open
            </button>


            <!-- Modal for Open Song-->
            <div :id="'opensongModal' + song.song_id" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'opensongModalLabel' + song.song_id" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" style="width: 800px;" >
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="opensongModalLabel"> Title :{{ song.song_title }}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div class="modal-body">
                                
                            <h6> Singer : {{song.singer}} </h6>
                            <h6> Added by : {{song.song_creator}} </h6>
                            <h6> MP3 File : {{song.file_name}} </h6>
                            <h6> Singer : {{song.singer}} </h6>
                            <audio controls>
                                <source :src="'/static/mp3/' + song.file_name" type="audio/mp3">
                            </audio>
                            <h6> Rating :  </h6>
                            <h6> My Rating :  </h6>
                            <h6> Lyrics : {{song.song_lyrics}} </h6>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        
                    </div>
                </div>
            </div>


        </div> */




        // <div>
        //     <div class="scroll-container">
        //         <h2>Recomended Songs</h2>
        //             <div v-for="i in all_songs" :key="i[0].song_id">
                    
        //                 <div class = 'play_song'>
        //                     <li>
        //                         <div>
        //                             <p>{{i[0].song_title}}</p>

                                    
        //                         </div>
        //                     </li>
        //                 </div>
                    
        //             </div>
        //     </div>
        // </div>



            // const sformData = new FormData();
            // sformData.append('file', this.selectedFile);
            // console.log(sformData)
            // const res = await fetch(`/add_song/${this.$route.params.id}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authentication-Token' : localStorage.getItem('Auth-token'),
            //     },
            //     body: JSON.stringify(this.formdata1),
            // });
            // console.log(res)
            // if (res.ok) {

            //     const songdata = await res.json();
            //     console.log(songdata)
            // } else {

            // }


// <body>
//     <input type="file" id="fileInput">
//     <button onclick="uploadFile()">Upload</button>

//     <script>
//         function uploadFile() {
//             const fileInput = document.getElementById('fileInput');
//             const file = fileInput.files[0];

//             const formData = new FormData();
//             formData.append('mp3file', file);

//             fetch('/your_upload_endpoint', {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(response => response.json())
//             .then(data => console.log(data))
//             .catch(error => console.error('Error:', error));
//         }
//     </script>
// </body>

{/* <input style="width: 600px;" @change="formfile" type="file" name = "mp3file" accept = ".mp3"> */}