const OpenPlaylist = {
    template: `<div>
    
        <div v-if="success">
            
            <button @click.prevent = "close" type="button" aria-label="Close"  >Close</button>

            <h2 > Playlist Title : {{ this.this_playlist.pl_title }}</h2>

            <div class="scroll-container">
                <div v-for="songObj in this.this_playlist_songs" :key="songObj.song.song_id" class="play_song">
                        <li>
                            <div>
                                <p>{{ songObj.song.song_title }}</p>
                                    
                                <router-link :to="'/userdashboard/' + user_id
                                 + '/open_song/' + songObj.song.song_id">
                                    <button class="btn btn-secondary">Open/Rate</button>
                                </router-link>
                            </div>
                        </li>
                </div>
            </div>
        </div>
        <div v-else>
            {{message}}
        </div>
    
        <div class ='row'> 
            <div class = "column">
                <router-view></router-view>
            </div>
        </div>
            
    </div>`,

    props : ["id","pl_id"],

    data (){
        return{
            this_playlist : {},
            this_playlist_songs: [],

            message : null,
            success : true,
            user_id : null,
           
            }
    },

    async mounted (){
        const get_playlist = await fetch (`/playlist_data/${this.$route.params.id}/${this.$route.params.pl_id}`, { 
            
            // method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token' : localStorage.getItem('Auth-token'),
            },
        })
        if (get_playlist.ok) {
            const responseData = await get_playlist.json();
            console.log(responseData);
            this.this_playlist = responseData.this_playlist;
            this.this_playlist_songs = responseData.this_playlist_songs;
            this.user_id = responseData.user_id;

        } else {
            console.error('Error in fetching Playlist');
            this.success = false;
            this.message = 'Error in fetching Playlist';
        }
        console.log(this.user_id)
    },
    
    methods: {

        async close(){
            this.$router.push(`/userdashboard/${this.$route.params.id}`)
        },
      },
};

export default OpenPlaylist;
