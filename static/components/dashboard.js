const Dashboard = {
    template: `<div>

    <h3>Dashboard</h3>
    <div v-if ="success">
    <div v-if="errorMessage">
        <h2>{{ errorMessage }} </h2>
    </div>
    <div v-else>
            <h2>User id : {{users.user_id}}</h2>
            <h2>User name : {{users.user_name}}</h2>
            <h2>User email : {{users.user_email}}</h2>
            <h2>User access : {{users.user_access}}</h2>
    </div>
    </div>
    <div v-else>
        {{WrongUrlError}}
    </div>
            
    </div>`,

    props : ["user_id"],

    data (){
        return{
            users:{
                user_id: "id",
                user_name: "name",
                user_email: "email",
                user_access: "access",
                },
            errorMessage: null,
            success: true,
            WrongUrlError: "something Went wrong.",
            }
    },
    async mounted (){
        const res = await fetch(`/api/dashboard/${this.$route.params.user_id}`)
       
        if (res.ok){
            const data = await res.json()
        } else {
            // this.errorMessage = 'User not found';
        }
            
        // }else {
            //if url not found
            // this.success = false,

            // console.log('something went wrong') 
        // }
    },

};

export default Dashboard;

// {{this.$route.paramas.user_id}} --if props is not used
// This dashboard is for {{ this.$route.paramas.user_id }}!

// with props = ["user_id"] --user this.user_id
// in routes add props : True