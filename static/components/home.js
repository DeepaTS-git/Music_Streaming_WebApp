

const Home = {
    template: `<div>

        <h1 class = 'h1'>Welcome to Music streaming Application</h1>
        <div v-if="error" class="modal-body">
            <div class="alert alert-danger" role="alert">
                {{ error }}
            </div>
        </div>
        <div v-if="msg" class="modal-body">
            <div class="alert alert-danger" role="alert">
                {{ msg }}
            </div>
        </div>

        <span>
        <!-- Button trigger modal for Login-->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
            Login
        </button>

        
        <!-- Modal for Login -->
        <div class="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="loginModalLabel">User Login</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form> 
                        <div class="modal-body">
                            <div>
                                <label class = "my-2"> Email ID : </label>
                                <input v-model = "formdata.email" type="email">
                            </div>
                            <div>
                                <label class = "my-2"> Password : </label>
                                <input v-model = "formdata.password" type="password">
                            </div> 
                        </div> 

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click.prevent = "verifyUser" class="btn btn-primary" data-bs-dismiss="modal">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </span>
        
        <span>
        <!-- Button trigger modal for Register User-->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
        Register
        </button>
        
        <!-- Modal for Register User -->
        <div class="modal fade" id="registerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="registerModalLabel">Register User</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                   
                    <form>
                        <div class="modal-body">
                            <div>
                                <label class = "my-2" > Name : </label>
                                <input v-model = "regdata.name" type="text">
                            </div>
                            <div>
                                <label class = "my-2"> Email ID : </label>
                                <input v-model = "regdata.email" type="text" required >
                            </div>
                            <div>
                                <label class = "my-2"> Password : </label>
                                <input v-model = "regdata.password" type="password">
                            </div> 
                            <div>
                                <label class = "my-2"> User Access : </label>
                                    <input type="radio" id="general" v-model="regdata.userAccess" value="general">
                                    <label for="general">General</label>
                            
                                    <input type="radio" id="creator" value="creator" v-model="regdata.userAccess" >
                                    <label for="creator">Creator</label>
                            </div> 
                        </div> 

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" @click.prevent = "CreateUser" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </span>
       
        <div class ='row'> 
            <div class = "column">
                <router-view></router-view>
            </div>
        </div>

    </div>`, 

 

    data : function(){
       
        return {
            regdata:{
                name : '',
                email : '',
                password : '',
                userAccess: '',
                },
            formdata:{
                email : '',
                password : '',
            },
            Udata:{
                'id': '',
                'name': '',
                'email': '',
                'access': '',
            },
            error : null,
            msg : null,
        };
       
    },
    methods : {
        async CreateUser(){
            if (!this.regdata.email || !this.regdata.userAccess || !this.regdata.password || !this.regdata.name) {
                // to handle input validation request 
                alert('Please fill in all fields.');
                return;
            }
            const res = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.regdata),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.error){
                    this.error = data.error; 
                    console.log(data.error)
                } else {
                    this.msg = data.msg; 
                    console.log(data);  
                    console.log(data.msg); 
                }
            } else {
                console.log("Something went wrong");
            }
        },
        async verifyUser() {
            if (!this.formdata.email || !this.formdata.password) {
                // to handle input validation request 
                alert('Please fill in all fields.');
                return;
            }
            try{
            const res = await fetch('/login?include_auth_token', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formdata),
            });
            // const data = await res.json();
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem(
                    'Auth-token', data.response.user.authentication_token
                )
                
                const res1 = await fetch(`/api/user/${this.formdata.email}`, { // from router.py
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token' : localStorage.getItem('Auth-token'),
                    },
                });
                if (res1.ok){
                    const Udata = await res1.json();
                    // console.log(Udata)
                    this.Udata = Udata.user
                    this.$router.push(`/userdashboard/${this.Udata.id}`) // to app.py --> user_dashboard
                } else {
                    
                    this. error = "User not authorised. Please login again."
                }

            } else {
                this. error = 'Invalid User'
                console.log('Invalid User')
            }
   
        }  catch (error) {
            console.error('Error:', error);
            this. error = error
        }
        },
    },
};
export default Home;
