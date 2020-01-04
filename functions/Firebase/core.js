import * as firebase from 'firebase';
import uuidv4 from 'uuid/v4';
// const util = require('util');
// Import lodash for formatting flatlist data
import _ from 'lodash';
import {firebaseConfig, gcfUrl} from './firebaseConfig';

export default class Firebase {
	// Async function to initilize firebase for the app - must be awaited when called
	static async initialiseFirebase() {
		// Initialise Firebase
        firebase.initializeApp(firebaseConfig);
    }

    static async runFaceDetection(uri) {
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        let formData = new FormData();
        formData.append('file', {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`
        });
        let options = {
            method: 'POST',
            body: formData,
            headers: {
            Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };
        let res = await fetch(gcfUrl, options);
        return await res.json();
    }

}
