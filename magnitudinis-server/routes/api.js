const express = require('express');
const firebase = require('firebase-admin');
const serviceAccount = require('../firebase-auth/interactiveapp7-b4dba-firebase-adminsdk-bqv2d-6a1fe5b960');
const router = express.Router();
const connection = null;

const config = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://interactiveapp7-b4dba.firebaseio.com"
};

firebase.initializeApp(config);
const firebaseDB = firebase.database();

console.log('Firebase initialized : ' + firebase.auth().app.name);

module.exports = {
    router: router,
    getExpress: function() {
        return express;
    },
    getDatabaseConnection: function() {
        return connection;
    },
    getFirebase: function() {
        return firebase;
    },
    getFirebaseDB: function() {
        return firebaseDB;
    }
};

