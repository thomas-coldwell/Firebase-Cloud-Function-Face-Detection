# Firebase-Cloud-Function-Face-Detection
Add face detection capabilities to your Expo app!

This uses Firebase Cloud Functions and face-api.js for the server side processing of the image, but can easily be changed over to work on AWS etc.

## Usage

Run `npm i` in both the main app directory and also in `gcf` and `gcf/functions`. All GCF is written in TypeScript and then automatically compiled down to Node.js (es5) code - to do this simply run `npm run-script build` in the functions directory.

Then create a `firebaseConfig.js` in `functions/Firebase` which will export your cloud function endpoint url and firebase configuration that should be used.

![Example detection result](https://thomas-coldwell.github.com/Firebase-Cloud-Function-Face-Detection/images/example.png)
