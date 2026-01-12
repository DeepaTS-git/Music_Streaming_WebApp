const AdminLogin = {
    template: `<div>
    <div v-if="error" class="modal-body">
            <div class="alert alert-danger" role="alert">
                {{ error }}
            </div>
    </div>
    <form>
        <div class="row mb-2">
            <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-3">
                <input v-model = "formdata.email" type="email" class="form-control" id="inputEmail3">
            </div>
        </div>
        <div class="row mb-2">
            <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-3">
                <input v-model = "formdata.password" type="password" class="form-control" id="inputPassword3">
            </div>
        </div>
        <div >
            <button type="button" @click.prevent = "verifyUser" class="btn btn-primary">Login</button>
        </div>
    </form>
    

    </div>`,
    data : function(){
        return {
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
        };
       
    },
    methods : {
        async verifyUser(){
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
                    console.log(Udata)
                    this.Udata = Udata.user
                    this.$router.push(`/admindashboard/${this.Udata.id}`) // to (router) app.py --> admin_dashboard
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
    }

}

export default AdminLogin;