module.exports = function (compound, User) {
  // define User here
	User.validatesLengthOf('password', {
	  min: 8,
	  allowNull: true
	});

	User.validatesLengthOf('username', {
	  min: 4,
	  allowNull: true
	});

	User.validatesExclusionOf('username', {
	  	"in": ['admin', 'config', 'profile', 'index', 'create', 'delete', 'destroy', 'edit', 'update', 'login','true','false', 'logut', 'destroy', 'welcome','dashboard'],
		message :"- not a valid username",
	  	allowNull: true
	});

	User.validatesFormatOf('email', {
	  "with": /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i,
  		message :"- not a valid email format",
		allowNull: true
	});

	User.validatesUniquenessOf('email', { 
		message :"- email is taken, you already have an account!!",
		allowNull: true
	});

	// User.validatesUniquenessOf('username', {  
	// 	message:"- username is taken",
	// 	allowNull: true
	// });



	// User.validatesUniquenessOf('twitterId', {  allowNull: true,message:"- already synced twitter account"});
	// User.validatesUniquenessOf('facebookId', {  allowNull: true,message:"- already synced twitter account"});
	// User.validatesUniquenessOf('facebookId', {  allowNull: true,message:"- already synced facebook account"});
	// User.validatesUniquenessOf('soundcloudId', {  allowNull: true,message:"- already synced soundcloud account"});
	// User.validatesUniquenessOf('githubId', {  allowNull: true,message:"- already synced github account"});

	// var customUsernameValidator = function(err,done){
	//   console.log("object to make sure username and email are uniques");
	//   console.log(this.username)
	//   User.all({where:{username:this.username},limit:1},function(err, user){
	    
	//     if(user){
	//       err;
	//     }
	//     else{
	//       setTimeout(done,1000);
	//     }
	//   });
	// }


	// User.validate('username',customUsernameValidator,{
	// 	message:"user already exists",
	// 	allowNull: true
	// });

	User.verifyPassword = function(userpassword,hash) {

		console.log("checking password")
		console.log(userpassword)
		console.log(hash)
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

	User.findPassportOrCreate = function (data, done) {
	    // console.log("in passport for railway findorcreate")
	    // console.log("data variable")
	    // console.log(data)

	    /* FACEBOOK */
	    if (data.facebookId) {
	        var facebookdata = data.profile._json;
	        // var userEmail = data.profile.emails[0].value;
	        User.all({
	            where: {
	                facebookId: facebookdata.id,
	                email: facebookdata.email,
	                facebookAccessToken: data.token
	            }, limit: 1
	        }, function (err, user) {
	            if (user[0]){
	                user = user[0];
	                console.log("got facebook user")
	                // console.log(user)
	                return done(err, user);
	            } 
	            else{
	                console.log("create a new facebook user")
	                User.create({
	                    email: facebookdata.email,
	                    facebookId: facebookdata.id,
	                    facebookAccessToken: data.token,
	                    facebookUsername: facebookdata.username,
	                    facebookId: data.facebookId,
	                    username: facebookdata.username+"-fb",
	                    activated: true,
	                    accounttype: "regular",
	                    firstname: facebookdata.first_name,
	                    lastname: facebookdata.last_name
	                }, done);                
	            }
	        });
	    } else

	    /* TWITTER */
	    if (data.twitterId) {
	        var twitterdata = data.profile._json;
	        User.all({
	            where: {
	                twitterId: twitterdata.id,
	                // email: twitterdata.email,
	                twitterAccessToken: data.token,
	                twitterAccessTokenSecret: data.tokenSecret
	            }, limit: 1
	        }, function (err, user) {
	            if (user[0]){
	                console.log("got twitter user")
	                console.log(user[0])
	                return done(err, user[0]);
	            } 
	            else{
	                // console.log("check if already a user")
	                console.log(twitterdata)

	                console.log("create a new user")
	                User.create({
	                    twitterId: twitterdata.id,
	                    username: twitterdata.screen_name+'-tw',
	                    twitterAccessToken: data.token,
	                    twitterAccessTokenSecret: data.tokenSecret,
	                    twitterUsername: twitterdata.screen_name,
	                    url: twitterdata.url,
	                    image: twitterdata.profile_image_url,
	                    image_https: twitterdata.profile_image_url_https,
	                    description: twitterdata.description,
	                    activated: true,
	                    accounttype: "regular"
	                }, done);                
	            }
	        });
	    } else

	    /* LOCAL */
	    if (data.email) {
	        User.all({
	            where: {
	                email: data.email
	            }, limit: 1
	        }, function (err, user) {
	            if (user[0]) return done(err, user[0]);
	            if (!user[0]) return done(err);
	        });
	    } else

	    // =========================================================
	    // ==================== connecting accounts ================
	    // =========================================================

	    /* GITHUB */
	    if (data.githubId) {
	        User.all({
	            where: {
	                githubId: data.githubId
	            }, limit: 1
	        }, function (err, user) {
	            if (user[0]) return done(err, user[0]);
	            User.create({
	                githubId: data.githubId,
	                displayName: data.profile.displayName || data.profile.username
	            }, done);
	        });
	    } else

	    /* GOOGLE OPENID */
	    if (data.openId) {
	        User.all({
	            where: {
	                googleId: data.openId
	            }, limit: 1
	        }, function (err, user) {
	            if (user[0]) return done(err, user[0]);
	            User.create({
	                displayName: data.profile.displayName,
	                email: data.profile.emails[0].value,
	                googleId: data.openId
	            }, done);
	        });
	    } else

	    /* LINKEDIN */
	    if (data.linkedinId) {
	        User.all({
	            where: {
	                linkedinId: data.linkedinId
	            }, limit: 1
	        }, function (err, user) {
	            if (user[0]) return done(err, user[0]);
	            User.create({
	                displayName: data.profile.displayName,
	                linkedinId: data.linkedinId
	            }, done);
	        });
	    } else


	    /* SOMETHING NOT KNOWN YET */
	    {
	        console.log("no strategy for data return")
	        //console.log(data.profile);
	    }
	};


};