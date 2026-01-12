const AdminDashboard = {
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

            <h2>Welcome {{userdata.name}}!</h2>

            <div v-if="msg">
                <h2>{{ msg }} </h2>
            </div>

            <!-- Statistics-->
            <div class="scroll-container">
                <div>
                    <h2>Statistics</h2>
                    <div class = "stats">
                        <li>
                            <div>
                                <p>Total Users</p>
                                <span>{{total_users}}</span> 
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>Total Creators</p>
                                <span>{{c_count}}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>Total General Users</p>
                                <span>{{u_count}}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>Total Songs</p>
                                <span>{{song_count}}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>Total Albums</p>
                                <span>{{album_count}}</span>
                            </div>
                        </li>
                    </div>
                </div>
            </div>

            <!-- Top 5 Songs -->
            <div class="scroll-container">
                <h2>Top 5 Songs</h2>
                <div class = "stats">
                    
                    <li v-for="i in top5_songs" :key="i.song.song_id">
                        <div>
                            <p>{{i.song.song_title}}</p>

                            <span>Rating : {{ i.avg_rating.toFixed(1) }}</span>
                        </div>
                    </li>
                </div>
            </div>

            <!-- Top 5 Albums -->
            <div class="scroll-container">
                <h2>Top 5 Albums</h2>
                <div class = "stats">
                    
                    <li v-for="i in top5_albums" :key="i.album.album_id">
                        <div>
                            <p>{{i.album.album_name}}</p>

                            <span>Rating : {{ i.avg_rating.toFixed(1) }}</span>
                        </div>
                    </li>
                </div>
            </div>

            <!-- Flaged Songs -->
            
            <div class="scroll-container">
                <h2>Flagged Songs</h2>
                <div v-for="i in flagged_songs" :key="i.flag_id" class = 'play_song' >
                    <div v-for="j in allSongs" :key="j.song_id">
                        <li v-if="i.song_id === j.song_id" style="height: 140px;">
                            <div>
                                <p>{{ j.song_title }}</p>
                                <p>Flagged By: {{ i.user_id }}</p>
                            
                                <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + i.song_id"><button class="btn btn-secondary">Open</button></router-link>

                                <button @click.prevent="delete_song(i.song_id)" type="button" class="btn btn-secondary" >Delete</button>
                            </div>
                        </li>
                    </div> 
                </div>
            </div>



            <!-- Flaged Albums -->

            <div class="scroll-container">
            <h2>Flagged Albums</h2>
            <div v-for="i in flagged_albums" :key="i.flag_id" class = 'play_song' >
                <div v-for="j in allalbums" :key="j.album_id">
                    
                    <li v-if="i.album_id === j.album_id" style="height: 140px;">
                        <div>
                            <p>{{ j.album_name }}</p>
                            <p>Flagged By: {{ i.user_id }}</p>
                            
                            <router-link :to="'/userdashboard/' + userdata.id + '/open_album/' + i.album_id"><button class="btn btn-secondary">Open</button></router-link>

                            <button @click.prevent="delete_album(i.album_id)" type="button" class="btn btn-secondary" >Delete</button>
                        </div>
                    </li>

                </div> 
            </div>
            </div> 




            <!-- All Songs-->

            <div class="scroll-container">
                <h2>All Songs</h2>
                <div v-for="i in allSongs" :key="i.song_id" class = 'play_song'>
                    <li>
                        <div>
                            <p>{{ i.song_title }}</p>
                        
                            <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + i.song_id"><button class="btn btn-secondary">Open</button></router-link>

                            <button @click.prevent="delete_song(i.song_id)" type="button" class="btn btn-secondary" >Delete</button>
                        </div>
                    </li>
                </div>
            </div>

            <!-- All Albums-->

            <div class="scroll-container">
                <h2>All Albums</h2>
                <div v-for="i in allalbums" :key="i.album_id" class = 'play_song'>
                    <li>
                        <div>
                            <p>{{ i.album_name }}</p>
                            <router-link :to="'/userdashboard/' + userdata.id + '/open_album/' + i.album_id"><button class="btn btn-secondary">Open</button></router-link>

                            <button @click.prevent="delete_album(i.album_id)" type="button" class="btn btn-secondary" >Delete</button>

                        </div>
                    </li>
                </div>
            </div>








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

        return {
            userdata : {
                id : '',
                name : '',
                email : '',
                access : '',
            },
            searchData:{
                searchType: '', 
                searchText: '',
            },
            allSongs :{},
            allalbums : {},
            top5_songs : {},
            top5_albums : {},
            song_count : '',
            album_count : '',
            c_count : '',
            u_count : '',
            total_users : '',
            // flagged_music : '',
            flagged_songs : '',
            flagged_albums : '',


            success : true,
            msg : null,
            error : null,

        };
       
    },
    async mounted() {
        const res = await fetch (`/admindashboard/${this.$route.params.id}`, { 
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

            // console.log(responseData)

            const all_Songs = responseData.all_songs;
            this.allSongs = all_Songs

            const all_albums = responseData.all_albums;
            this.allalbums = all_albums;

            // const all_album_songs = responseData.all_album_songs;
            // this.all_album_songs = all_album_songs;

            console.log(all_albums)

            const c_count = responseData.c_count;
            this.c_count = c_count;

            const u_count = responseData.u_count;
            this.u_count = u_count;

            const total_users = responseData.total_users;
            this.total_users = total_users;

            const top5_songs = responseData.top5_songs;
            this.top5_songs = top5_songs;

            const top5_albums = responseData.top5_albums;
            this.top5_albums = top5_albums;

            const song_count = responseData.song_count;
            this.song_count = song_count;

            const album_count = responseData.album_count;
            this.album_count = album_count;

            // const flagged_music = responseData.flagged_music;
            // this.flagged_music = flagged_music;

            const flagged_songs = responseData.flagged_songs;
            this.flagged_songs = flagged_songs;

            const flagged_albums = responseData.flagged_albums;
            this.flagged_albums = flagged_albums;

            // console.log(flagged_music)
 

        } else {
            
             console.error('Error fetching data');
        }

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
        async search() {

            const res = await fetch(`/${this.$route.params.id}/search`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('Auth-token'),
                },

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
    },

}

export default AdminDashboard;



{/* <div class="scroll-container">
<h2>Flagged Songs</h2>
<div v-for="i in flagged_music" :key="i.flag_id" class = 'play_song' >
    <div v-for="j in allSongs" :key="j.song_id">
        <li v-if="i.song_id === j.song_id" style="height: 140px;">
            <div>
                <p>{{ j.song_title }}</p>
                <p>Flagged By: {{ i.user_id }}</p>
            
                <router-link :to="'/userdashboard/' + userdata.id + '/open_song/' + i.song_id"><button class="btn btn-secondary">Open</button></router-link>

                <button @click.prevent="delete_song(i.song_id)" type="button" class="btn btn-secondary" >Delete</button>
            </div>
        </li>
    </div> 
</div>
</div> */}




