module.exports = {
    require_admin_user_access: function (currentuser,usertomodifyobj,isnotauser){
        // console.log(currentuser.data.accounttype)
        if(!currentuser.loggedIn){
            console.log('user isnt logged in')
            return false;
        }
        else if(isnotauser && currentuser.data.id == usertomodifyobj.userid){
            console.log('same user owner, you can modify')
            return true;
        }
        else if(currentuser.data.id == usertomodifyobj.id){
            console.log('same user, you can modify')
            return true;
        }
        else if(currentuser.data.accounttype=="admin"){
            console.log('admin user, you can modify')
            return true;       
        }
        else{
            console.log("you don't have access")
            // console.log("currentuser")
            // console.log(currentuser.data.id)
            // console.log("usertomodifyobj")
            // console.log(usertomodifyobj.id)
            return false;
        }
    },
    make_user_name_nice: function(username){
        return username.replace(/[^a-z0-9]/gi,'-').toLowerCase();
    }
}