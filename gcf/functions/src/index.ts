const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
import { faceDetectionNet, faceDetectionOptions, canvas } from './commons/index';
import * as faceapi from 'face-api.js';
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.faceDetection = functions.https.onRequest(async(req, res) => {
  // Create the response body
  let response = {
    status: 200,
    faces: []
  };

  // Get image blob from request and use node-url to resolve
  let busboy = new Busboy({ headers: req.headers });
  req.pipe(busboy);
  let saveTo = '';

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    const tmpdir = os.tmpdir();
    saveTo = path.join(tmpdir, 'temp.jpg');
    let writeStream = fs.createWriteStream(saveTo);
    file.pipe(writeStream).on('finish', () => console.log(`Wrote file to ${saveTo}`));
  });
  
  busboy.on('finish', async () => {
    // Load up the face detection model from disk
    await faceDetectionNet.loadFromDisk('./models').then(async() => {
      const tmpdir = os.tmpdir();
      saveTo = path.join(tmpdir, 'temp.jpg');
      console.log(`Successfully wrote file to ${saveTo}`);
      // Load the image onto the canvas using the parsed url
      let img = await canvas.loadImage(saveTo);
      let detections = await faceapi.detectAllFaces(img, faceDetectionOptions);
      response.faces = detections;
      res.end(JSON.stringify(response));
    });
  });

  busboy.end(req.rawBody);

});
