const OpenAlbum = {
    template: `<div>
    
        <div v-if="success">
            
            <button @click.prevent = "close" type="button" aria-label="Close"  >Close</button>

            <h2 > Album Name : {{ this.this_album.album_name }}</h2>
            <h2 > Album Genre : {{ this.this_album.album_genre }}</h2>
            <h2 > Album Artist : {{ this.this_album.album_artist }}</h2>

            <!--Album Rating-->

            <h2> Avg Rating : {{ typeof this.this_album.avg_rating === 'number' ? this.this_album.avg_rating.toFixed(2) : 'N/A' }} </h2>
            <h2 style="display: inline;"> My Rating :  
            
            </h2>


            <div v-if="this.this_album.my_rating !== null" style="display: inline; margin-left: 5px;">
            <span style="font-weight: bold;">{{this.this_album.my_rating }}</span>
            </div>

            <div v-else>
            <form>
                <input type="radio" v-model="albumform.my_rating" value="1" />
                <label>1</label>
                <input type="radio" v-model="albumform.my_rating" value="2" />
                <label>2</label>
                <input type="radio" v-model="albumform.my_rating" value="3" />
                <label>3</label>
                <input type="radio" v-model="albumform.my_rating" value="4" />
                <label>4</label>
                <input type="radio" v-model="albumform.my_rating" value="5" />
                <label>5</label>
                <button type="submit"  @click.prevent="submitRating">Submit</button>
            </form>
            </div> 

            <!--Album Rating end-->

            <div class="scroll-container">
                <div v-for="songObj in this.this_album_songs" :key="songObj.song.song_id" class="play_song">
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

            <div v-if="!this_album.c_flag && !this_album.user_flag">
                    <button type="submit"  @click.prevent="flag_music">Flag this album</button>
                    {{this.id}}
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

    props : ["id","album_id"],

    data (){
        return{
            this_album : {},
            this_album_songs: [],

            albumform:{
                my_rating: null,  
            },

            message : null,
            success : true,
            user_id : null,
           
            }
    },

    async mounted (){
        const get_album = await fetch (`/album_data/${this.$route.params.id}/${this.$route.params.album_id}`, { 
            
            // method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token' : localStorage.getItem('Auth-token'),
            },
        })
        if (get_album.ok) {
            const responseData = await get_album.json();
            console.log(responseData);
            this.this_album = responseData.this_album;
            this.this_album_songs = responseData.this_album_songs;
            this.user_id = responseData.user_id;

        } else {
            console.error('Error in fetching Album');
            this.success = false;
            this.message = 'Error in fetching Album';
        }
        // console.log(this.user_id)
    },
    
    methods: {

        async close(){

            const userId = this.user_id; 

            let route;
            if (userId === 1) {
                route = `/admindashboard/${this.$route.params.id}`;
            } else {
                route = `/userdashboard/${this.$route.params.id}`;
            }
        
            this.$router.push(route);
            // this.$router.push(`/userdashboard/${this.$route.params.id}`)
        },
        async submitRating() {
            const response = await fetch (`/album_data/${this.$route.params.id}/${this.$route.params.album_id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("Auth-token"),
              },
              body: JSON.stringify({
                user_rating: this.albumform.my_rating,
              }),
            });
            if (response.ok) {
                console.log('Rating Added successfully.');
                location.reload();
            } else {
                console.log('Error submitting Album Rating.');
            }
        },
        async flag_music(){
            const response = await fetch (`/userdashboard/${this.$route.params.id}/flag_music/${this.$route.params.album_id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("Auth-token"),
                },
                body: JSON.stringify({
                    album_id: this.this_album.album_id,
                  }),
              });
              if (response.ok) {
                  console.log('album flag request sent successfully.');
                  location.reload();
              } else {
                  console.log('Error submitting flag request.');
              }
        },
      },
};

export default OpenAlbum;


// album rating part - include "Avg Rating :  " line 14 from open_song

{/* <div v-if="albumdata.my_rating !== null" style="display: inline; margin-left: 5px;">
<span style="font-weight: bold;">{{ albumdata.my_rating }}</span>
</div>

<div v-else>
<form>
    <input type="radio" v-model="albumform.my_rating" value="1" />
    <label>1</label>
    <input type="radio" v-model="albumform.my_rating" value="2" />
    <label>2</label>
    <input type="radio" v-model="albumform.my_rating" value="3" />
    <label>3</label>
    <input type="radio" v-model="albumform.my_rating" value="4" />
    <label>4</label>
    <input type="radio" v-model="albumform.my_rating" value="5" />
    <label>5</label>
    <button type="submit"  @click.prevent="submitRating">Submit</button>
</form>
</div>  */}


