
import Home from './components/home.js'
import UserDashboard from './components/user_dashboard.js'
import OpenSong from './components/open_song.js'
import OpenPlaylist from './components/open_playlist.js'
import OpenAlbum from './components/open_album.js'
import SearchResult from './components/search_result.js'
import AdminDashboard from './components/admin_dashboard.js'




import AdminLogin from './components/admin_login.js'
// import AdminDashboard from './components/admin_dashboard.js'
// import UserLogin from './components/user_login.js'
// import RegisterUser from './components/register_user.js'
import Dashboard from './components/dashboard.js'
// import Login from './components/login.js'
// import Test from './components/test.js'


// setting routes
const routes = [

    // Home, Login, Register user
    { 
        path: '/', 
        component: Home,
    },
    { 
        path: '/userdashboard/:id', // going to app.py -----not sure
        component: UserDashboard,
        props : true,
        children: [
                    // {
                    //   path: '/open_song/:song_id',
            //           component: () => import('./components/open_song.js') 
            //           //uses dynamic import to load the component asynchronously
                    // },
                  ],

    },
    { 
        path: '/admindashboard/:id', // going to app.py -----not sure
        component: AdminDashboard,
        props : true,
        children: [
                    // {
                    //   path: '/open_song/:song_id',
            //           component: () => import('./components/open_song.js') 
            //           //uses dynamic import to load the component asynchronously
                    // },
                  ],

    },
    { 
        path: '/userdashboard/:id/open_song/:song_id', //coming from userdashboard template link
        component: OpenSong,
        props : true,
    },
    { 
        path: '/userdashboard/:id/open_playlist/:pl_id', // coming from user_dashboard.js
        component: OpenPlaylist,
        props : true,
        
    },
    { 
        path: '/userdashboard/:id/open_album/:album_id', // coming from user_dashboard.js
        component: OpenAlbum,
        props : true,
        
    },
    { 
        path: '/:id/search_result', // coming from user_dashboard.js
        component: SearchResult,
        props : true,
        // query: { result: result },
        
    },
    { 
        path: '/admin_login', 
        component: AdminLogin,
    },

 
]


const router = new VueRouter({
    routes,
    // base: '/',  //endpoint to get routes
}) 


export default router;






    // Admin Dashboard
    // { 
    //     path: '/api/admin_dashboard', 
    //     component: AdminDashboard,
    //     children: [
    //         {
    //           path: 'settings',
    //           component: () => import('./components/AdminSettings.js') 
    //           //uses dynamic import to load the component asynchronously
    //         },
    //       ],

    //     },
    // User Dashboard
    // { 
    //     path: '/api/user_dashboard/:user_id', 
    //     component: UserDashboard,

    // },
 

    // { 
    //     path: '/api/dashboard/:user_id', 
    //     component: Dashboard,
    //     props : true,
    // },





// { 
//     path: '/userdashboard/:id/open_song/:song_id', // going to app.py -----not sure
//     component: OpenSong,
//     props : true,
//     children: [
//                 {
//                 path: 'static/mp3/:file_name',
//                 component: () => import('static/mp3/:file_name'),
//                 props: true,
//                 //   component: () => import('/static/mp3/' + file_name'),
//                //uses dynamic import to load the component asynchronously
//                 },
//               ],
// },