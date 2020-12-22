// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const electron = require('electron');
const path = require('path');
const { env } = require('./vendor');

const { ipcRenderer, remote } = electron;
const { join } = path;
const app = remote.app;

document.addEventListener("DOMContentLoaded", function (event) {
    // Your code to run since DOM is loaded and ready
    const dataPath = join(app.getPath('userData'), env.LOCAL_FOLDER);
    console.log(dataPath);

    ipcRenderer.on('image:add', function (e, imageName) {
        console.log('image name : ' + imageName);
        const imgDataPath = join(dataPath, imageName);
        const contentPane = document.getElementById('content-inside');
        const carouselItems = document.getElementsByClassName('carousel-item');
        if (carouselItems) {
            Array.from(carouselItems).forEach(element => {
                element.classList = ['carousel-item'];
            });
        }

        const carouselItem = document.createElement('div');
        carouselItem.classList = ['carousel-item active'];

        const img = document.createElement('img');

        console.log('image path : ' + imgDataPath);

        img.src = imgDataPath;

        img.classList = ['d-block w-100 mh-100'];
        carouselItem.appendChild(img);
        contentPane.appendChild(carouselItem);
    });



});
