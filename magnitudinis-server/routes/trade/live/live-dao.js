const api = require('../../api');
const express = api.getExpress();
const router = express.Router();
const firebaseDB = api.getFirebaseDB();
const firebasePath = '/status/result/1/data';
const async = require('async');
liveTradeData = {};
index = 0;
var io;

firebaseDB.ref(firebasePath).on("child_changed", (snapshot) => {
    liveTradeData[snapshot.ref.key] = snapshot.val();
    io.emit('update', liveTradeData )
    liveTradeData = {};
});

// router.get('/messagesJson', (req, res) => {
//     responseObject = `{"Messages":{"NSE":{"DISHMAN":{"05-01-2015":{"1420459500":"12: 05 AM - NSE: BUY DISHMAN @ 6000","1420496580":"10: 23 PM - NSE: SELL DISHMAN @ 7000"},"06-01-2015":{"1420528320":"07: 12 AM - NSE: BUY DISHMAN @ 8000"}}},"NYSE":{"AAPL":{"06-01-2015":{"1420575300":"08: 15 PM - NYSE: SELL AAPL@ 217.66"}}}}}`;
//     return res.send(responseObject);
// });

router.get('/messages', (req, res) => {

    // var io = req.app.get('socketio');
    
    var ref = firebaseDB.ref("messages");
    
    const exchanges = [...new Set(req.query['exchange'].split(','))]
    const symbols = [...new Set(req.query['symbol'].split(','))]
    // console.log(exchanges, symbols);

    ref.on("value", function (snapshot) {
        let result = [];
        const messages = snapshot.val();
        // console.log(i++, Object.keys(messages) + ' news feed found !!!!!!!!!');

        exchanges.forEach(exc => {
            symbols.forEach(sym => {
                if (messages && messages[exc] && messages[exc][sym]) {
                    const objArray = Object.values(messages[exc][sym]);
                    for (let index = 0; index < objArray.length; index++) {
                        const obj = objArray[index];
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                const element = obj[key];
                                result.push({
                                    Exchange: exc,
                                    MessageDate: element.substr(0, 9),
                                    UnixTimeStamp: key,
                                    MessageText: element.substr(17)
                                });
                            }
                        }
                    }
                }
            });
        })
        res.end(JSON.stringify(result), encoding = 'utf8');
        // console.log(new Date(), result.length, exchanges, symbols);
        io.sockets.emit('messagesChanged', {
            msg: result
        });
    });

    // res.end();
})

router.get('/messageColors', async (req, res) => {

    // const search = req.query['settings'];
    var ref = firebaseDB.ref("settings");
    ref.once('value', (snapshot) => {
        console.log(snapshot.val());
        let result = snapshot.val();
        res.send(result);
    });
})


router.get('/getAllSymbols', async (req, res) => {
    const search = req.query['search'];
    firebaseDB.ref(firebasePath).once('value', (snapshot) => {
        // console.log(search, snapshot.val());
        let result = snapshot.val();
        let returnResult = result.filter(x => x.Symbol.toUpperCase().includes(search.toUpperCase()));
        res.send(returnResult);
    });
})

router.get('/getAllExchange', (req, res) => {
    responseObject = [];
    firebaseDB.ref(firebasePath).once('value', (snapshot) => {
        if (snapshot.val()) {
            list = [...new Set(snapshot.val().map(item => item.Exchange))];
            list.forEach((element, index) => {
                responseObject.push({ ID: index, VALUE: element })
            });
            return res.send(responseObject);
        } else {
            return res.send(responseObject);
        }
    });
});

router.get('/getDistinctSymbol', (req, res) => {
    responseObject = [];
    queryParams = req.query['exchange'];
    if (queryParams) {
        exchanges = [...new Set(queryParams.split(','))];
        exchanges.forEach(exchange => {

            firebaseDB.ref(firebasePath).once('value', (snapshot) => {
                list = [...new Set(snapshot.val().filter(data => data.Exchange === exchange))];
                let dataSet = [];
                list.forEach(element => {
                    dataSet.push({ ID: index++, VALUE: element });
                });
                responseObject = responseObject.concat(dataSet);
            });

        })
        // console.log('responseObject', responseObject);

        return res.send(responseObject);

        // firebaseDB.ref(firebasePath).once('value', (snapshot) => {
        //     let index = 0;
        //     exchanges.forEach((exchange) => {
        //         list = [...new Set(snapshot.val().filter(data => data.Exchange === exchange))];
        //         let dataSet = [];
        //         list.forEach(element => {
        //             dataSet.push({ ID: index++, VALUE: element });                    
        //         });
        //         exchangeDataMap[exchange] = dataSet;
        //         responseObject = responseObject.concat(dataSet);

        //     })

        // });
    } else {
        return res.send(responseObject);
    }

});


router.get('/getLiveTradeData', (req, res) => {
    let responseObject = liveTradeData;
    liveTradeData = {};
    return res.send(responseObject);
});

router.get('/getSelectedItems/:email', (req, res) => {
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var items = {};
                Object.keys(snapshot.val()).forEach(key => {
                    temp = snapshot.val()[key];
                    if (temp.email === req.params.email) {
                        items.exchange = temp.exchange || [];
                        items.symbols = temp.symbols || [];
                    }
                })
                callback(null, items);
            });
        }, function (userSelected, callback) {
            let exchanges = [];
            let symbols = [];
            firebaseDB.ref(firebasePath).once('value', (snapshot) => {
                if (snapshot.val()) {
                    //Build Exchange
                    let uniqueExchanges = [...new Set(snapshot.val().map(item => item.Exchange))];
                    uniqueExchanges.forEach((exchange, index) => {
                        if (userSelected.exchange.includes(exchange))
                            exchanges.push({ id: index, itemName: exchange })
                    });
                    //Build Symbols
                    let dataset = snapshot.val();
                    userSelected.symbols.forEach((symbol, index) => {
                        symbols.push({
                            id: index,
                            itemName: symbol,
                            data: dataset.filter(sym => sym.Symbol === symbol)[0]
                        });
                    })


                    callback({ exchange: exchanges, symbols: symbols });
                } else {
                    callback({ exchange: exchanges, symbols: symbols });
                }
            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.post('/setSelectedItems/:email', (req, res) => {
    firebaseDB.ref('users').once("value", function (snapshot) {
        Object.keys(snapshot.val()).forEach(key => {
            temp = snapshot.val()[key];
            if (temp.email === req.params.email) {
                firebaseDB.ref('users/' + temp.username).update({ exchange: req.body.exchange, symbols: req.body.symbols }).then()
            }
        })
        res.send({ success: true });
    });

})

module.exports = {
    init: (sio) => {
        io = sio;
    },
    router: router
}