const OpenSong = {
    template: `<div style = "justify-content: center;">
    
        <div v-if="success" >
            <div class="play_song">
                <button @click.prevent = "close" type="button" aria-label="Close"  >Close</button>
                <h1 > Title :{{ songdata.song_title }}</h1>

                <h6> Singer : {{songdata.singer}} </h6>
                <h6> Added by : {{songdata.song_creator}} </h6>
                <h6> MP3 File : {{songdata.file_name}} </h6>
                <audio v-if="playaudio" controls :src="getAudioPath()" type="audio/mp3"></audio>
                
                <h6> Avg Rating : {{ typeof songdata.avg_rating === 'number' ? songdata.avg_rating.toFixed(2) : 'N/A' }} </h6>
                <h6 style="display: inline;"> My Rating :  </h6>

                <div v-if="songdata.my_rating !== null" style="display: inline; margin-left: 5px;">
                    <span style="font-weight: bold;">{{ songdata.my_rating }}</span>
                </div>

                <div v-else>
                    <form>
                        <input type="radio" v-model="songform.my_rating" value="1" />
                        <label>1</label>
                        <input type="radio" v-model="songform.my_rating" value="2" />
                        <label>2</label>
                        <input type="radio" v-model="songform.my_rating" value="3" />
                        <label>3</label>
                        <input type="radio" v-model="songform.my_rating" value="4" />
                        <label>4</label>
                        <input type="radio" v-model="songform.my_rating" value="5" />
                        <label>5</label>
                        <button type="submit"  @click.prevent="submitRating">Submit</button>
                    </form>
                </div> 

                <h6> Lyrics : <pre>{{songdata.song_lyrics}}</pre> </h6>
                
                <div v-if="!songdata.c_flag && !songdata.user_flag">
                    <button type="submit"  @click.prevent="flag_music">Flag this song</button>
                    {{this.id}}

                </div>
                <button  v-else disabled >Flagged</button>
               
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

    props : ["id","song_id"],

    data (){
        return{
            songdata : {
                song_id: '',
                song_title: '',
                singer: '',
                song_creator: '',
                file_name: '',
                song_duration: '',
                song_lyrics: '',
                avg_rating: '',
                my_rating: '',
                user_flag : '',
                c_flag : '',
                },
            songform:{
                my_rating: null,  
            },
            playaudio : false,
            message : null,
            success : true,
            }
    },

    async mounted (){
        const get_song = await fetch (`/userdashboard/${this.$route.params.id}/open_song/${this.$route.params.song_id}`, { 
            
            // method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token' : localStorage.getItem('Auth-token'),
            },
        })
        if (get_song.ok) {
            const responseData = await get_song.json();
            console.log(responseData);
            this.songdata = responseData.this_song;
            this.playaudio = true;

        } else {
            console.error('Error in fetching song');
            this.success = false;
            this.message = 'Error in fetching song';
        }
    },
    
    methods: {
        getAudioPath() {
          return `/static/mp3/${this.songdata.file_name}`;
        },
        async close(){
            // this.$router.push(`/userdashboard/${this.$route.params.id}`)
            this.$router.go(-1);
        },
        async submitRating() {
            const response = await fetch (`/userdashboard/${this.$route.params.id}/open_song/${this.$route.params.song_id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("Auth-token"),
              },
              body: JSON.stringify({
                user_rating: this.songform.my_rating,
              }),
            });
            if (response.ok) {
                console.log('Rating Added successfully.');
                location.reload();
            } else {
                console.log('Error submitting Song Rating.');
            }
        },
        async flag_music(){
            const response = await fetch (`/userdashboard/${this.$route.params.id}/flag_music/${this.$route.params.song_id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("Auth-token"),
                },
                body: JSON.stringify({
                    song_id: this.songdata.song_id,
                  }),
              });
              if (response.ok) {
                  console.log('flag request sent successfully.');
                  location.reload();
              } else {
                  console.log('Error submitting flag request.');
              }

        },
      },
};

export default OpenSong;
