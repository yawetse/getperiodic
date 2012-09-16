User.validatesLengthOf('password', {
  min: 8,
  allowNull: true
});

User.validatesLengthOf('username', {
  min: 4,
  allowNull: true
});

User.validatesExclusionOf('username', {
  "in": ['admin', 'config', 'profile', 'index', 'create', 'delete', 'destroy', 'edit', 'update', 'login', 'logut', 'destroy', 'welcome','dashboard'],
  allowNull: true
});

User.validatesFormatOf('email', {
  "with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i,
  allowNull: true
});

User.validatesUniquenessOf('email', {  allowNull: true,message:"- email is taken, you already have an account"});
User.validatesUniquenessOf('username', {  allowNull: true,message:"- username is taken"});

// var customUsernameValidator = function(err,done){
//   console.log("object to make sure username and email are uniques");
//   console.log(this.username)
//   User.all({where:{username:this.username},limit:1},function(err, user){
    
//     if(user){
//       err;
//       done();
//     }
//     else{
//       setTimeout(done(),1000);
//     }
//   });
// }


// User.validate('username',customUsernameValidator,{message:"user already exists"});

User.verifyPassword = function(userpassword,hash) {
	var bcrypt = require('bcrypt');
	var salt = bcrypt.genSaltSync(10);
	return bcrypt.compareSync(userpassword, hash);
};

User.beforeUpdate = function (done,obj){
	console.log("BEFORE UPDATE USER obj")
  this.updatedAt = new Date();
  // return obj;
  done();
};

// User.beforeCreate = function(done,obj){
//   //console.log("object to make sure username and email are unique");
//   done();
// }