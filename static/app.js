
import router from "./router.js"

const app = new Vue({
    el: '#app',
    // delimiters : ['${','}'],
    router: router,
    data : {
        // message : "My perso msg",
        // c_user : false,
        // g_user : false,
        a_user : true,
        login : false,
    },
    mounted() {
      
         
      },
    methods: {
      // Method to change login status
      toggleLogin() {
        this.login = !this.login;
        },
      },
})
