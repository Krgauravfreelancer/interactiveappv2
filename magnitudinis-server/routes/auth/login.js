const api = require('../api');
const express = api.getExpress();
const router = express.Router();
const firebaseDB = api.getFirebaseDB();

/* GET api listing. */
router.post('/login', (req, res) => {
    queryParams = req.body;
    console.log(queryParams);

    /**
     * Logic to authenticate login
     */

    res.send({
        message: 'Login Successfull',
        success: true
    });
});

module.exports = {
    router: router
};