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

*/

var User = describe('User', function () {
    property('email', String, {index:true, limit:150});
    property('firstname', String);
    property('lastname', String);
    property('username', String);
    property('password', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('updatedAt', Date, {default: function () { return new Date() }});
    property('activated', Boolean, {default:false});
    property('accounttype', String);
    property('description', String);
    property('image', String);
    property('image_https', String);
    property('twitterAccessToken', String);
    property('twitterAccessTokenSecret', String);
    property('twitterUsername', String);
    property('twitterId', String);
    property('facebookAccessToken', String);
    property('facebookAccessTokenSecret', String);
    property('facebookUsername', String);
    property('facebookId', String);
});var Post = describe('Post', function () {
    property('title', String);
    property('content', String);
    property('type', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('source', String);
    property('originaldata', String);
    property('originalid', String);
    property('userid', String);
});var Periodical = describe('Periodical', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('options', String);
});var Periodicalmembers = describe('Periodicalmembers', function () {
    property('periodicalid', Number);
    property('userid', Number);
    property('membertype', String);
});var Volume = describe('Volume', function () {
    property('title', String);
    property('name', String,{index:true,limit:150});
    property('description', String);
    property('createdAt', Date, {default: function () { return new Date() }});
    property('periodicalid', Number);
    property('options', String);
});