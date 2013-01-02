/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });
//User.all({where:{email:/Yaw/gi}},function(err,data){console.log(data)});

//50595957b337ed65b8000086
//505bfcf9ab419c1f59000001

As far as i remember when you are using mongoose/mongo adapter you can use {where: {userid: {in: [1,2,3]}}} query. If it doesn't work try '$in' instead of 'in'.    

searching: User.all({where:{email:/Yaw/gi}},function(err,data){console.log(data)});

multiple ids: Post.all({where:{ userid: {in:['50595957b337ed65b8000086','505bfcf9ab419c1f59000001']}},limit:5,order:'originaldate DESC'},function(err,data){for(x in data){console.log(data[x].title+', '+data[x].content)}})
*/


// Post.all({where:{content:/mean/gi},limit:5,order:'originaldate DESC'},function(err,data){for(x in data){console.log(data[x].title+', '+data[x].content)}})

var User = describe('User', function () {
    property('email', String, {index:true, limit:150});
    property('firstname', String);
    property('lastname', String);
    property('username', String, {index:true, limit:150});
    property('password', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('activated', Boolean, {default:false});
    property('accounttype', String, {default:"regular"});
    property('description', String);
    property('url', String);
    property('image', String);
    property('image_https', String);
    property('twitterAccessToken', String);
    property('twitterAccessTokenSecret', String);
    property('twitterUsername', String);
    property('twitterId', String, { index: true });
    property('facebookAccessToken', String);
    property('facebookUsername', String);
    property('facebookId', String, { index: true });
    property('foursquareAccessToken', String);
    property('foursquareId', String, { index: true });
    property('soundcloudId', String);
    property('soundcloudAccessToken', String);
    property('soundcloudAccessTokenSecret', String);
    property('meetupId', String);
    property('meetupAccessToken', String);
    property('meetupAccessTokenSecret', String);
    property('linkedinId', String);
    property('linkedinAccessToken', String);
    property('linkedinAccessTokenSecret', String);
    property('instagramId', String);
    property('instagramAccessToken', String);
    property('githubId', String);
    property('githubUsername', String);
    property('githubAccessToken', String);
    property('tumblrUsername', String);
    property('tumblrAccessToken', String);
    property('tumblrAccessTokenSecret', String);
    property('goodreadsId', String);
    property('goodreadsAccessToken', String);
    property('goodreadsAccessTokenSecret', String);
});var Post = describe('Post', function () {
    property('title', String);
    property('content', String);
    property('mediacontent', String);
    property('link', String);
    property('type', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('source', String);
    property('originaldata', String);
    property('originalid', String);
    property('originaldate', Date);
    property('userid', String);
    property('service-userid-orginaldataid', String);
});var Periodical = describe('Periodical', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('config', String);
    property('userid', String);
    property('image', String);
    property('public', Boolean, {default: false});
});
var Periodicalmember = describe('Periodicalmember', function () {
    property('periodicalid', String);
    property('userid', String);
    property('collaboratoruserid', String);
    property('membertype', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('confirmed', Boolean,{default: false});
});
var Userconnection = describe('Userconnection', function () {
    property('userid', String);
    property('username', String);
    property('collaboratoruserid', String);
    property('collaboratorusername', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('confirmed', Boolean,{default: false});
});var Category = describe('Category', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('periodicalid', Number);
    property('config', String);
    property('version', Number);
    property('private', Boolean, {default: false});

});