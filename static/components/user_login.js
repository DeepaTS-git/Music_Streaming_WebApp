const AdminDashboard = {
    template: `<div>
        This Admin Dashboard.

        <div class ='row'> 
        <div class = "column">
            <router-view></router-view>
        </div>
    </div>`,
    
    data : function(){
        // add v-model to input field e.g. <input v-model="password" type="password">
        return {
            email : '',
            password : '',
        };
       
    },
    methods : {

        verifyUser : function(){
            // Make a GET request to your Flask API to verify user
        }
    },

}

export default AdminDashboard;