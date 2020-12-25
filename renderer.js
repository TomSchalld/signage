// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const ipcRenderer = require('electron').ipcRenderer
const app = require('electron').remote.app
const path = require('path')
let env;
try {
    env = require('./env.prod').env
} catch (error) {
    env = require('./env').env
}


const { join } = path;





document.addEventListener("DOMContentLoaded", function (event) {
    // Your code to run since DOM is loaded and ready
    const dataPath = join(app.getPath('userData'), env.LOCAL_FOLDER);
    const remotewindow = require('electron').remote.getCurrentWindow();
    setupStyleAccordingToScreenSize(remotewindow.getSize()[0], remotewindow.getSize()[1]);
    remotewindow.on('resize', () => setupStyleAccordingToScreenSize(remotewindow.getSize()[0], remotewindow.getSize()[1]));

    ipcRenderer.on('image:add', function (e, imageName) {
        console.log('image name : ' + imageName);
        const imgDataPath = join(dataPath, imageName);
        const contentPane = document.getElementById('content-inside');
        const carouselItems = document.getElementsByClassName('carousel-item');
        if (carouselItems) {
            Array.from(carouselItems).forEach(element => {
                element.classList = ['carousel-item'];
                element.style.height = '' + remotewindow.getSize()[1] + 'px';
                element.style.width = '' + remotewindow.getSize()[0] + 'px';
            });
        }

        const carouselItem = document.createElement('div');
        carouselItem.id = imageName;
        carouselItem.classList = ['carousel-item active'];
        const img = document.createElement('img');
        img.src = imgDataPath;
        img.classList = ['d-block mw-100 mh-100 mx-auto'];
        carouselItem.appendChild(img);
        contentPane.appendChild(carouselItem);
    });

    ipcRenderer.on('image:remove', function (e, imageName) {
        console.log('image name : ' + imageName);
        const carouselItem = document.getElementById(imageName);
        carouselItem.remove();
    });



});

function setupStyleAccordingToScreenSize(width, height) {
    const carouselItems = document.getElementsByClassName('carousel-item');
    if (carouselItems) {
        Array.from(carouselItems).forEach(element => {
            element.style.height = '' + height + 'px';
            element.style.width = '' + width + 'px';
        });
    }

}

