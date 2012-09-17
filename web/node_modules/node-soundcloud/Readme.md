#node-soundcloud

Fun little soundcloud client for node.js! wooo!
The majority of the structure of this SDK was taken from [masylum](https://github.com/masylum/ "masylum")'s [twitter-js](https://github.com/masylum/twitter-js/ "twitter-js") client, so thanks to him for that!

## Usage

if you are familiar with twitter-js, this works the same:

* getAccessToken(_req_, _res_, _callback_): Uses oAuth module to retrieve the access_token
* apiCall(_http_method_, _path_, _params_, _callback_): Does a call to soundcloud API

the Params object must contain your access token!

## Example (express.js)

    var express = require('express');
    var app = module.exports = express.createServer();
    
    var soundcloud = new require('soundcloud')('appID', 'appSecret', 'http://redirect.url'); // add a fourth argument, true, if using sandbox
    
    app.get('/auth', function(req, res) {
      soundcloud.getAccessToken(req, res, function(err, token) {
        if(token) {
          // Insert into a DB, do whatever else you'd wanna do?
        }
      });
    });
    
    app.get('/my_tracks', function(req, res) {
      // Assuming you've already authenticated
      soundcloud.apiCall('GET', 'me/tracks', {token: req.user.sc_token}, function(err, data, response) {
        res.render('tracks', {
          locals: {
            tracks: data
          }
        });
      });
    }
  
## Future Plans

* OAuth2 support (soundcloud plans to deprecate OAuth1 in the future
* Convenience methods (won't need to directly call apiCall, but you can if you want)
* Who knows!!!!!