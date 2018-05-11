/**
 * This script resizes all JPG images present in the directories listed in IMAGE_FOLDERS,
 * as needed by various mobile devices. It is run automatically by NativeScript during
 * the prepare stage of building the app.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGE_FOLDERS = [
    'app/content/backgrounds',
];
const HEIGHT_STEPS = [
    2560,
    2048,
    1280,
    1080,
    800,
    600,
    480,
];
const TOP_DIRECTORY_NAME = 'automatically-resized';


/**
 * Create separate versions of the file in all of the HEIGHT_STEPS sizes.
 */
function resizeFile(directoryName, fileName) {
    for (let height of HEIGHT_STEPS) {
        let newFileName = path.join(directoryName, TOP_DIRECTORY_NAME, height.toString(), fileName);
        if (fs.existsSync(newFileName)) {
            continue;  // skip if the file already exists
        }
        sharp(path.join(directoryName, fileName))
            .resize(undefined, height)
            .toFile(newFileName);
    }
}

/**
 * Creates separate directories for all image sizes listed in HEIGHT_STEPS.
 */
function createSizeDirs(directoryName) {
    // create the top directory if needed
    topDirName = path.join(directoryName, TOP_DIRECTORY_NAME);
    if (!fs.existsSync(topDirName)){
        fs.mkdirSync(topDirName);
    }

    // create the size subdirectories as needed
    for (let height of HEIGHT_STEPS) {
        let newDirName = path.join(directoryName, TOP_DIRECTORY_NAME, height.toString());
        if (!fs.existsSync(newDirName)){
            fs.mkdirSync(newDirName);
        }
    }

}


console.log("Resizing images...");
for (let folder of IMAGE_FOLDERS) {
    createSizeDirs(folder);
    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            if (file.endsWith('.jpg')) {
                resizeFile(folder, file);
            }
        });
    });
}
