const async = require('async');
const express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
const api = require('../api');
const firebase = api.getFirebase();
const db = api.getFirebaseDB();

module.exports = {
  users: router
}

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/users', async (req, res) => {
  var ref = db.ref("users");
  let result = [];
  ref.once("value", function (snapshot) {
    Object.keys(snapshot.val()).forEach(key => {
      let user = snapshot.val()[key];
      user.uuid = key;
      result.push(user);
    })
    res.send(result);

  });
});


router.get('/gusers', async (req, res) => {
  var ref = db.ref("users");
  let result = [];
  ref.once("value", function (snapshot) {
    Object.keys(snapshot.val()).forEach(key => {
      let user = snapshot.val()[key];
      if (user.userType === 'general') {
        user.uuid = key;
        if (!user.follows) user.follows = [];
        result.push(user)
      }
    })
    res.send(result);
  });
});

router.post('/changes', async (req, res) => {
  let updates = req.body.changes;


  var updateUser = function (update, callback) {
    var ref = db.ref("users/" + update.uuid);

    ref.update({
      follows: update.newValue
    }).then(() => {
      return callback();
    }).catch((err) => {
      return callback(err);
    });
  }

  async.forEach(updates, updateUser, function (error) {
    if (error) {
      res.send({ code: -1, message: 'Error updating records.' })
    } else {
      res.send({ code: 0, message: 'Update successful' })
    }
  })
});