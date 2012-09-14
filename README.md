## About 

GetPeriodic is a boilerplate node application that aggregates social feeds and provides and API to cache your social data. GetPeriodic is built on top of railwayjs (express/connect mvc framework for node) and passportjs (for authentication).

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