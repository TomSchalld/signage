# Signage

**Clone and run for a quick way to display images in a slider.**

This application is build to have a simple go to when building signage based on Raspberry Pi. 
I made this as a Christmas present for my granny. 

The idea is, you put some images on some sftp server and the pi runs a kiosk mode app to display them. 

Periodically it will try to sync images from remote to local.


![](https://media.giphy.com/media/jfCiiXRssTQcsLw897/giphy.gif)



**What can it do as of latest release**

* KIOSK mode 
* next, previous image via arrows
* download images via SFTP
* check if download is needed (polling), otherwise dont download
* synchronise images (delete from local when deleted from server)
* scaled to show full picture



## How To Use

To use this app you will need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/TomSchalld/signage
# Go into the repository
cd signage
```

Edit the env.js or create a env.prod.js file like below:

```js
module.exports = {
    env: {

        LOCAL_FOLDER: 'img', // Folder where images are stored
        REMOTE_FOLDER: '/', // Folder where images should be found on the server
        SFTP_PROVIDER: 'ssh.example.com', // SFTP Host
        SFTP_PORT: 22, // Port of the SFTP server
        SFTP_USER: 'sftp_user', // SFTP user 
        SFTP_PASSWORD: 'sftp_password', // SFTP password
        ENABLE_KIOSK: false, // should the application switch into Kiosk mode aka full screen after loading
        REFRESH_INTERVAL: 10000 // how often shall the SFTP server be polled for updates, in milliseconds

    }
};
```
Almost there just run the following: 

```bash
# Install dependencies
npm install
# Run the app
npm start
```

Note: I really didnt bother too much with this as it is almost Christmas. I see however that there is a range of use cases that could easily be implemented.
      Additionally I also am fully aware that you can package electron apps into binaries. Yeah you got me I was lazy ;) 


## How To Contribute

Use your brain, dont make a mess and ...

![](https://media.giphy.com/media/3o84sw9CmwYpAnRRni/giphy.gif)


