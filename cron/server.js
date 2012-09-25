//NODE_ENV=production node server.js

var https = require('https'),
    YAML = require('yamljs'),
    application_env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development',
    application_auth_conf = YAML.load('../web/config/passport.yml')[application_env],
    mongoose = require('mongoose'),
    db = mongoose.createConnection('localhost', 'test');

console.log(process.env)

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("openec connection!")
});
db.on("close", function(error){
    console.log("Connection to the database was closed!");
});

var userSchema = new mongoose.Schema( {
    email: String
});
var User = db.model('User', userSchema)


User.find(function (err, users) {
  if (err){ 
    console.log(err)// TODO handle err
  }
  console.log(users)
})


console.log(application_auth_conf)
process.exit(code=0)

///me/tracks.json?oauth_token=API-TOKEN
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
//     console.log(res)

//  });
// get_soundcloud_data("API-TOKEN",function(err,soundcloud){
//     if(err){
//         process.exit(1);
//     }
//     else{   
//         for(x in soundcloud){
//             console.log(soundcloud[x].permalink_url)
//         }
//         process.exit(code=0)        
//     }
// });



// http://nodejs.org/api/https.html#https_https_get_options_callback
function get_soundcloud_data(request_token,callback){
    console.log("getting soundclud")

    var options = {
      host: 'api.soundcloud.com',
      port: 443,
      path: '/me/tracks.json?oauth_token='+request_token,
      method: 'GET'
    };

    var req = https.request(options, function(res) {
        console.log("making https request")
       // console.log("statusCode: ", res.statusCode);
        // console.log("headers: ", res.headers);

        // res.on('data', function(d) {
        //   process.stdout.write(d);
        // });
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        res.on('end', function () {
            output =JSON.parse(str) 
            // console.log(output);
            console.log("got data")
            return callback(null,output);
        });
    });
    req.end();

    req.on('error', function(e) {
      console.error(e);
      // err = e
      return callback(e,null);
    });

}


    // property('firstname', String);
    // property('lastname', String);
    // property('username', String);
    // property('password', String);
    // property('createdAt', Date, {default: function () { return new Date() }});
    // property('updatedAt', Date, {default: function () { return new Date() }});
    // property('activated', Boolean, {default:false});
    // property('accounttype', String, {default:"regular"});
    // property('description', String);
    // property('url', String);
    // property('image', String);
    // property('image_https', String);
    // property('twitterAccessToken', String);
    // property('twitterAccessTokenSecret', String);
    // property('twitterUsername', String);
    // property('twitterId', String, { index: true });
    // property('facebookAccessToken', String);
    // property('facebookUsername', String);
    // property('facebookId', String, { index: true });
    // property('foursquareAccessToken', String);
    // property('foursquareId', String, { index: true });
    // property('soundcloudId', String);
    // property('soundcloudAccessToken', String);
    // property('soundcloudAccessTokenSecret', String);
    // property('meetupId', String);
    // property('meetupAccessToken', String);
    // property('meetupAccessTokenSecret', String);
    // property('linkedinId', String);
    // property('linkedinAccessToken', String);
    // property('linkedinAccessTokenSecret', String);
    // property('instagramId', String);
    // property('instagramAccessToken', String);
    // property('githubId', String);
    // property('githubUsername', String);
    // property('githubAccessToken', String);
    // property('tumblrUsername', String);
    // property('tumblrAccessToken', String);
    // property('tumblrAccessTokenSecret', String);
    // property('goodreadsId', String);
    // property('goodreadsAccessToken', String);
    // property('goodreadsAccessTokenSecret', String);