const api = require('../api');
const crypto = require('crypto');
const express = api.getExpress();
const router = express.Router();
const connection = api.getDatabaseConnection();
const firebase = api.getFirebase();
const firebaseDB = api.getFirebaseDB();
const async = require('async');
/* GET api listing. */

router.get('/findCountries', (req, res) => {
    let responseObject = [
        { itemName: 'Afghanistan', code: 'AF' },
        { itemName: 'Åland Islands', code: 'AX' },
        { itemName: 'Albania', code: 'AL' },
        { itemName: 'Algeria', code: 'DZ' },
        { itemName: 'American Samoa', code: 'AS' },
        { itemName: 'AndorrA', code: 'AD' },
        { itemName: 'Angola', code: 'AO' },
        { itemName: 'Anguilla', code: 'AI' },
        { itemName: 'Antarctica', code: 'AQ' },
        { itemName: 'Antigua and Barbuda', code: 'AG' },
        { itemName: 'Argentina', code: 'AR' },
        { itemName: 'Armenia', code: 'AM' },
        { itemName: 'Aruba', code: 'AW' },
        { itemName: 'Australia', code: 'AU' },
        { itemName: 'Austria', code: 'AT' },
        { itemName: 'Azerbaijan', code: 'AZ' },
        { itemName: 'Bahamas', code: 'BS' },
        { itemName: 'Bahrain', code: 'BH' },
        { itemName: 'Bangladesh', code: 'BD' },
        { itemName: 'Barbados', code: 'BB' },
        { itemName: 'Belarus', code: 'BY' },
        { itemName: 'Belgium', code: 'BE' },
        { itemName: 'Belize', code: 'BZ' },
        { itemName: 'Benin', code: 'BJ' },
        { itemName: 'Bermuda', code: 'BM' },
        { itemName: 'Bhutan', code: 'BT' },
        { itemName: 'Bolivia', code: 'BO' },
        { itemName: 'Bosnia and Herzegovina', code: 'BA' },
        { itemName: 'Botswana', code: 'BW' },
        { itemName: 'Bouvet Island', code: 'BV' },
        { itemName: 'Brazil', code: 'BR' },
        { itemName: 'British Indian Ocean Territory', code: 'IO' },
        { itemName: 'Brunei Darussalam', code: 'BN' },
        { itemName: 'Bulgaria', code: 'BG' },
        { itemName: 'Burkina Faso', code: 'BF' },
        { itemName: 'Burundi', code: 'BI' },
        { itemName: 'Cambodia', code: 'KH' },
        { itemName: 'Cameroon', code: 'CM' },
        { itemName: 'Canada', code: 'CA' },
        { itemName: 'Cape Verde', code: 'CV' },
        { itemName: 'Cayman Islands', code: 'KY' },
        { itemName: 'Central African Republic', code: 'CF' },
        { itemName: 'Chad', code: 'TD' },
        { itemName: 'Chile', code: 'CL' },
        { itemName: 'China', code: 'CN' },
        { itemName: 'Christmas Island', code: 'CX' },
        { itemName: 'Cocos (Keeling) Islands', code: 'CC' },
        { itemName: 'Colombia', code: 'CO' },
        { itemName: 'Comoros', code: 'KM' },
        { itemName: 'Congo', code: 'CG' },
        { itemName: 'Congo, The Democratic Republic of the', code: 'CD' },
        { itemName: 'Cook Islands', code: 'CK' },
        { itemName: 'Costa Rica', code: 'CR' },
        { itemName: 'Cote D\'Ivoire', code: 'CI' },
        { itemName: 'Croatia', code: 'HR' },
        { itemName: 'Cuba', code: 'CU' },
        { itemName: 'Cyprus', code: 'CY' },
        { itemName: 'Czech Republic', code: 'CZ' },
        { itemName: 'Denmark', code: 'DK' },
        { itemName: 'Djibouti', code: 'DJ' },
        { itemName: 'Dominica', code: 'DM' },
        { itemName: 'Dominican Republic', code: 'DO' },
        { itemName: 'Ecuador', code: 'EC' },
        { itemName: 'Egypt', code: 'EG' },
        { itemName: 'El Salvador', code: 'SV' },
        { itemName: 'Equatorial Guinea', code: 'GQ' },
        { itemName: 'Eritrea', code: 'ER' },
        { itemName: 'Estonia', code: 'EE' },
        { itemName: 'Ethiopia', code: 'ET' },
        { itemName: 'Falkland Islands (Malvinas)', code: 'FK' },
        { itemName: 'Faroe Islands', code: 'FO' },
        { itemName: 'Fiji', code: 'FJ' },
        { itemName: 'Finland', code: 'FI' },
        { itemName: 'France', code: 'FR' },
        { itemName: 'French Guiana', code: 'GF' },
        { itemName: 'French Polynesia', code: 'PF' },
        { itemName: 'French Southern Territories', code: 'TF' },
        { itemName: 'Gabon', code: 'GA' },
        { itemName: 'Gambia', code: 'GM' },
        { itemName: 'Georgia', code: 'GE' },
        { itemName: 'Germany', code: 'DE' },
        { itemName: 'Ghana', code: 'GH' },
        { itemName: 'Gibraltar', code: 'GI' },
        { itemName: 'Greece', code: 'GR' },
        { itemName: 'Greenland', code: 'GL' },
        { itemName: 'Grenada', code: 'GD' },
        { itemName: 'Guadeloupe', code: 'GP' },
        { itemName: 'Guam', code: 'GU' },
        { itemName: 'Guatemala', code: 'GT' },
        { itemName: 'Guernsey', code: 'GG' },
        { itemName: 'Guinea', code: 'GN' },
        { itemName: 'Guinea-Bissau', code: 'GW' },
        { itemName: 'Guyana', code: 'GY' },
        { itemName: 'Haiti', code: 'HT' },
        { itemName: 'Heard Island and Mcdonald Islands', code: 'HM' },
        { itemName: 'Holy See (Vatican City State)', code: 'VA' },
        { itemName: 'Honduras', code: 'HN' },
        { itemName: 'Hong Kong', code: 'HK' },
        { itemName: 'Hungary', code: 'HU' },
        { itemName: 'Iceland', code: 'IS' },
        { itemName: 'India', code: 'IN' },
        { itemName: 'Indonesia', code: 'ID' },
        { itemName: 'Iran, Islamic Republic Of', code: 'IR' },
        { itemName: 'Iraq', code: 'IQ' },
        { itemName: 'Ireland', code: 'IE' },
        { itemName: 'Isle of Man', code: 'IM' },
        { itemName: 'Israel', code: 'IL' },
        { itemName: 'Italy', code: 'IT' },
        { itemName: 'Jamaica', code: 'JM' },
        { itemName: 'Japan', code: 'JP' },
        { itemName: 'Jersey', code: 'JE' },
        { itemName: 'Jordan', code: 'JO' },
        { itemName: 'Kazakhstan', code: 'KZ' },
        { itemName: 'Kenya', code: 'KE' },
        { itemName: 'Kiribati', code: 'KI' },
        { itemName: 'Korea, Democratic People\'S Republic of', code: 'KP' },
        { itemName: 'Korea, Republic of', code: 'KR' },
        { itemName: 'Kuwait', code: 'KW' },
        { itemName: 'Kyrgyzstan', code: 'KG' },
        { itemName: 'Lao People\'S Democratic Republic', code: 'LA' },
        { itemName: 'Latvia', code: 'LV' },
        { itemName: 'Lebanon', code: 'LB' },
        { itemName: 'Lesotho', code: 'LS' },
        { itemName: 'Liberia', code: 'LR' },
        { itemName: 'Libyan Arab Jamahiriya', code: 'LY' },
        { itemName: 'Liechtenstein', code: 'LI' },
        { itemName: 'Lithuania', code: 'LT' },
        { itemName: 'Luxembourg', code: 'LU' },
        { itemName: 'Macao', code: 'MO' },
        { itemName: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
        { itemName: 'Madagascar', code: 'MG' },
        { itemName: 'Malawi', code: 'MW' },
        { itemName: 'Malaysia', code: 'MY' },
        { itemName: 'Maldives', code: 'MV' },
        { itemName: 'Mali', code: 'ML' },
        { itemName: 'Malta', code: 'MT' },
        { itemName: 'Marshall Islands', code: 'MH' },
        { itemName: 'Martinique', code: 'MQ' },
        { itemName: 'Mauritania', code: 'MR' },
        { itemName: 'Mauritius', code: 'MU' },
        { itemName: 'Mayotte', code: 'YT' },
        { itemName: 'Mexico', code: 'MX' },
        { itemName: 'Micronesia, Federated States of', code: 'FM' },
        { itemName: 'Moldova, Republic of', code: 'MD' },
        { itemName: 'Monaco', code: 'MC' },
        { itemName: 'Mongolia', code: 'MN' },
        { itemName: 'Montserrat', code: 'MS' },
        { itemName: 'Morocco', code: 'MA' },
        { itemName: 'Mozambique', code: 'MZ' },
        { itemName: 'Myanmar', code: 'MM' },
        { itemName: 'Namibia', code: 'NA' },
        { itemName: 'Nauru', code: 'NR' },
        { itemName: 'Nepal', code: 'NP' },
        { itemName: 'Netherlands', code: 'NL' },
        { itemName: 'Netherlands Antilles', code: 'AN' },
        { itemName: 'New Caledonia', code: 'NC' },
        { itemName: 'New Zealand', code: 'NZ' },
        { itemName: 'Nicaragua', code: 'NI' },
        { itemName: 'Niger', code: 'NE' },
        { itemName: 'Nigeria', code: 'NG' },
        { itemName: 'Niue', code: 'NU' },
        { itemName: 'Norfolk Island', code: 'NF' },
        { itemName: 'Northern Mariana Islands', code: 'MP' },
        { itemName: 'Norway', code: 'NO' },
        { itemName: 'Oman', code: 'OM' },
        { itemName: 'Pakistan', code: 'PK' },
        { itemName: 'Palau', code: 'PW' },
        { itemName: 'Palestinian Territory, Occupied', code: 'PS' },
        { itemName: 'Panama', code: 'PA' },
        { itemName: 'Papua New Guinea', code: 'PG' },
        { itemName: 'Paraguay', code: 'PY' },
        { itemName: 'Peru', code: 'PE' },
        { itemName: 'Philippines', code: 'PH' },
        { itemName: 'Pitcairn', code: 'PN' },
        { itemName: 'Poland', code: 'PL' },
        { itemName: 'Portugal', code: 'PT' },
        { itemName: 'Puerto Rico', code: 'PR' },
        { itemName: 'Qatar', code: 'QA' },
        { itemName: 'Reunion', code: 'RE' },
        { itemName: 'Romania', code: 'RO' },
        { itemName: 'Russian Federation', code: 'RU' },
        { itemName: 'RWANDA', code: 'RW' },
        { itemName: 'Saint Helena', code: 'SH' },
        { itemName: 'Saint Kitts and Nevis', code: 'KN' },
        { itemName: 'Saint Lucia', code: 'LC' },
        { itemName: 'Saint Pierre and Miquelon', code: 'PM' },
        { itemName: 'Saint Vincent and the Grenadines', code: 'VC' },
        { itemName: 'Samoa', code: 'WS' },
        { itemName: 'San Marino', code: 'SM' },
        { itemName: 'Sao Tome and Principe', code: 'ST' },
        { itemName: 'Saudi Arabia', code: 'SA' },
        { itemName: 'Senegal', code: 'SN' },
        { itemName: 'Serbia and Montenegro', code: 'CS' },
        { itemName: 'Seychelles', code: 'SC' },
        { itemName: 'Sierra Leone', code: 'SL' },
        { itemName: 'Singapore', code: 'SG' },
        { itemName: 'Slovakia', code: 'SK' },
        { itemName: 'Slovenia', code: 'SI' },
        { itemName: 'Solomon Islands', code: 'SB' },
        { itemName: 'Somalia', code: 'SO' },
        { itemName: 'South Africa', code: 'ZA' },
        { itemName: 'South Georgia and the South Sandwich Islands', code: 'GS' },
        { itemName: 'Spain', code: 'ES' },
        { itemName: 'Sri Lanka', code: 'LK' },
        { itemName: 'Sudan', code: 'SD' },
        { itemName: 'Suriname', code: 'SR' },
        { itemName: 'Svalbard and Jan Mayen', code: 'SJ' },
        { itemName: 'Swaziland', code: 'SZ' },
        { itemName: 'Sweden', code: 'SE' },
        { itemName: 'Switzerland', code: 'CH' },
        { itemName: 'Syrian Arab Republic', code: 'SY' },
        { itemName: 'Taiwan, Province of China', code: 'TW' },
        { itemName: 'Tajikistan', code: 'TJ' },
        { itemName: 'Tanzania, United Republic of', code: 'TZ' },
        { itemName: 'Thailand', code: 'TH' },
        { itemName: 'Timor-Leste', code: 'TL' },
        { itemName: 'Togo', code: 'TG' },
        { itemName: 'Tokelau', code: 'TK' },
        { itemName: 'Tonga', code: 'TO' },
        { itemName: 'Trinidad and Tobago', code: 'TT' },
        { itemName: 'Tunisia', code: 'TN' },
        { itemName: 'Turkey', code: 'TR' },
        { itemName: 'Turkmenistan', code: 'TM' },
        { itemName: 'Turks and Caicos Islands', code: 'TC' },
        { itemName: 'Tuvalu', code: 'TV' },
        { itemName: 'Uganda', code: 'UG' },
        { itemName: 'Ukraine', code: 'UA' },
        { itemName: 'United Arab Emirates', code: 'AE' },
        { itemName: 'United Kingdom', code: 'GB' },
        { itemName: 'United States', code: 'US' },
        { itemName: 'United States Minor Outlying Islands', code: 'UM' },
        { itemName: 'Uruguay', code: 'UY' },
        { itemName: 'Uzbekistan', code: 'UZ' },
        { itemName: 'Vanuatu', code: 'VU' },
        { itemName: 'Venezuela', code: 'VE' },
        { itemName: 'Viet Nam', code: 'VN' },
        { itemName: 'Virgin Islands, British', code: 'VG' },
        { itemName: 'Virgin Islands, U.S.', code: 'VI' },
        { itemName: 'Wallis and Futuna', code: 'WF' },
        { itemName: 'Western Sahara', code: 'EH' },
        { itemName: 'Yemen', code: 'YE' },
        { itemName: 'Zambia', code: 'ZM' },
        { itemName: 'Zimbabwe', code: 'ZW' }
    ];

    return res.send(responseObject)
});

router.get('/fetchUser/:username', (req, res) => {
    let user = {};
    firebaseDB.ref('users/' + req.params.username).once("value", function (snapshot) {
        user = snapshot.val() || {};
        //Check for email verification
        if (Object.keys(user).length > 0) {
            checkAndUpdateEmailVerification(user['email'], user['username']);
        }
        res.send(user);
    });
});

function checkAndUpdateEmailVerification(email, username) {
    firebase.auth().getUserByEmail(email).then((user) => {
        if (user.emailVerified) {
            firebaseDB.ref('users/' + username).update({ emailVerified: true }).then()
        }
    })
}

router.get('/fetchUserByEmail/:email', (req, res) => {
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var user = {};
                Object.keys(snapshot.val()).forEach(key => {
                    temp = snapshot.val()[key];
                    if (temp.email === req.params.email) {
                        user = temp;
                        checkAndUpdateEmailVerification(temp.email, temp.username)
                    }
                })
                callback(user);
            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.post('/isEmailUnique', (req, res) => {
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var val = true;
                Object.keys(snapshot.val()).forEach(key => {
                    if (snapshot.val()[key].email === req.body.email) {
                        val = false;
                    }
                })
                callback(val);
            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.post('/isPhoneUnique', (req, res) => {
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var exists = true;
                Object.keys(snapshot.val()).forEach(key => {
                    if (snapshot.val()[key].phone === req.body.phone) {
                        exists = false;
                    }
                })
                callback(exists);
            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.post('/isUsernameUnique', (req, res) => {
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var exists = true;
                Object.keys(snapshot.val()).forEach(key => {
                    if (snapshot.val()[key].username === req.body.username) {
                        exists = false;
                    }
                })
                callback(exists);
            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.post('/register', (req, res) => {
    responseObject = {};
    user = getFormattedRegisterObject(req.body)
    firebaseDB.ref().child('/users/' + user.username).set(user)
        .then(
            responseObject = {
                message: 'User Registration Successful !',
                success: true
            }
        ).catch((err) => {
            responseObject = {
                message: err.message,
                success: false
            };
        });
    return res.send(responseObject);
});

router.get('/phoneVerified/:username', (req, res) => {
    let responseObject = {};
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var user = '';
                Object.keys(snapshot.val()).forEach(key => {
                    if (snapshot.val()[key].username === req.params.username) {
                        firebaseDB.ref().child('/users/' + key).update({ phoneVerified: true })
                            .then(
                                responseObject = {
                                    message: 'Success!',
                                    success: true
                                }
                            ).catch((err) => {
                                responseObject = {
                                    message: err.message,
                                    success: false
                                };
                            });
                    }
                })
                callback(responseObject);

            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.get('/emailVerified/:uid/:username', (req, res) => {
    let responseObject = {};
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var user = '';
                Object.keys(snapshot.val()).forEach(key => {
                    if (snapshot.val()[key].username === req.params.username) {
                        firebaseDB.ref().child('/users/' + key).update({ emailVerified: true })
                            .then(
                                responseObject = {
                                    message: 'Success!',
                                    success: true
                                }
                            ).catch((err) => {
                                responseObject = {
                                    message: err.message,
                                    success: false
                                };
                            });
                    }
                })
                callback(responseObject);

            });
        }
    ], function (result, err) {
        res.send(result)
    });
});


router.get('/verifyToken/:token', (req, res) => {
    firebase.auth().verifyIdToken(req.params.token)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
        }).catch(function (error) {
            // Handle error
        });

})

function getFormattedRegisterObject(obj) {
    if (obj) {
        for (var key in obj) {
            if (Object.prototype.toString.call(obj[key]) == '[object Array]') {
                var objArr = obj[key];
                if (objArr.length > 0 && objArr[0].itemName) {
                    if (objArr.length === 1) {
                        obj[key] = objArr[0].itemName;
                    }
                    else {
                        obj[key] = [];
                        for (val of objArr) {
                            obj[key].push(val.itemName);
                        }
                    }
                }
            }
        }

        obj['password'] = getEncryptedPassword(obj['password']);
        obj['emailVerified'] = false;
        obj['phoneVerified'] = false;

    }
    return obj;

}
/**
 * generates an encrypted version of plain password text
 * @function
 * @param {string} plainPassText 
 */
function getEncryptedPassword(plainPassText) {
    var salt = getRandomString(18);
    var passwordData = getHashCode(plainPassText, salt);

    return passwordData;
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function getHashCode(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

module.exports = {
    router: router
};