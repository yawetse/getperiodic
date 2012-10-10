## About 

GetPeriodic is a boilerplate node application that aggregates social feeds and provides and API to cache your social data. GetPeriodic is built on top of railwayjs (express/connect mvc framework for node) and passportjs (for authentication).

## Dependencies

You must have node > 0.6.12 (this was tested on 0.6.12)

1. node with gyp installed

	`$ npm install -g node-gyp`

## Installation

1. Install via npm

    `$ npm install getperiodic`
    
2. Configure environment settings
The application will not start until you configure database.json as well as passport.yml 
*You have to make sure you have passport strategies for every configuration in passport.yml*

3. Test your configuration  by firing up the app

    `$ rw s 80 #note you may have to use sudo to run the application on port 80 (on OS X)`
    
## Participation

If you want to join team -- send me a message with your email.

## Usage

Once you've created your user account, you can continue to set up **Periodicals**. Periodicals are the collection of your social activity stored in the cloud. You can create curated feeds by segmenting your posts into **volumes**

**Volumes** are like playlists, for example if you wanted to create a social stream for your tweets that have a specific hash tag, you would create a **volume** for that.

**Periodicals** are collaborative, you can add other users to your periodicals and you can create multiple periodicals.

### **Via the web**

You can use your Periodical to display / aggregate your social feeds, as a makeshift blog. Your posts are cached so even if the service you are curating from is down, you still have access to your data.

### **Via the API & Widgets**

The power comes from using the API to embed feeds into your apps or other web sites.

## License 
(The MIT License)
Copyright (c) 2012 Yaw Etse <yetse@condenast.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

