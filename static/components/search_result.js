const SearchResult = {
    template: 
    `<div> 
        <button @click.prevent = "close" type="button" aria-label="Close"  >Close</button>

        <!-- Search results -->

        <h3> Search Result </h3>

        <div v-if="result.msg" >
            <p> {{ result.msg }} </p>
        </div>
        <div v-else> 
            <div v-if="result.result && result.result.song_id">
                <!-- Display song title as a link -->
                <router-link :to="'/userdashboard/' + this.$route.params.id + '/open_song/' + result.result.song_id">
                    {{ result.result.song_title }}
                </router-link>
            </div>
            <div v-if="result.result && result.result.album_id">
                <!-- Display song title as a link -->
                <router-link :to="'/userdashboard/' + this.$route.params.id + '/open_album/' + result.result.album_id">
                    {{ result.result.album_name }}
                </router-link>
            </div>
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
            // search_result : false,
            result : {},
        };
       
    },
    async mounted() {
        this.result = this.$route.query.result;

        // const res = await fetch (`/${this.$route.params.id}/search`, { 
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authentication-Token' : localStorage.getItem('Auth-token'),
        //     },
        // })
        // const data = await res.json()
        // console.log(data)
        // if (res.ok) {
        //     this.result = data
        // } else {
        //     console.error('Error fetching data');  
        // }
    },
    methods : {
        async close(){
            const userId = this.$route.params.id; 
            let route;
            if (userId === '1') {
                route = `/admindashboard/${this.$route.params.id}`;
            } else {
                route = `/userdashboard/${this.$route.params.id}`;
            }
            this.$router.push(route);
            // this.$router.push(`/userdashboard/${this.$route.params.id}`)
        },
        // generateLink(type, itemId) {
        //     switch (type) {
        //         case "song":
        //             return `/userdashboard/${this.$route.params.id}/open_song/${itemId}`;
        //         case "album":
        //             return `/userdashboard/${this.$route.params.id}/open_album/${itemId}`;
        //         case "genre":
        //             return `/userdashboard/${this.$route.params.id}/open_album/${itemId}`;
            
        //     }
        // },


       
    },

}

export default SearchResult;