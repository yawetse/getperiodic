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
      if(username){
        return username.replace(/[^a-z0-9]/gi,'-').toLowerCase();        
      }
      else{
        return false;
      }
    },
    sort_by : function(field, reverse, primer){

       reverse = (reverse) ? -1 : 1;

       return function(a,b){

           a = a[field];
           b = b[field];

           if (typeof(primer) != 'undefined'){
               a = primer(a);
               b = primer(b);
           }

           if (a<b) return reverse * -1;
           if (a>b) return reverse * 1;
           return 0;

       }
    },
    strip_tags: function(textinput){
      // cleantext = textinput.replace(/(<([^>]+)>)/ig,"");
      // return cleantext;
      if(textinput){
        return textinput.replace(/[^a-z0-9]/gi,'-').toLowerCase();
      }
      else{
        return false
      }
    }
}