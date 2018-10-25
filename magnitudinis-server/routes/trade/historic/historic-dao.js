const api = require('../../api');
const express = api.getExpress();
const router = express.Router();
const connection = api.getDatabaseConnection();



/* router.get('/getAllExchange', (req, res) => {
    responseObject = new Object();
    connection.query('SELECT (@ROWNUM:=@ROWNUM + 1) AS `ID`, `VALUE` FROM ( SELECT DISTINCT(`EXCHANGE`) AS `VALUE` FROM `EXCHANGE`) E, ( SELECT @ROWNUM:=0 ) R ORDER BY `VALUE`', function(err, rows, fields){
        if(!err) {
            responseObject = {
                data: rows,
                success: true
            }
        }
        else {
            responseObject = {
                message: 'Exception occurred : ' + err.message,
                success: false
            }
        }

        return res.send(responseObject);
    });
    
});

router.get('/getDistinctSymbol', (req, res, next) => {
    queryParams = req.query;
    responseObject = new Object();
    connection.query('SELECT (@ROWNUM:=@ROWNUM + 1) AS `ID`, `VALUE` FROM ( SELECT DISTINCT(SYMBOL) AS `VALUE` FROM TRADE WHERE UPPER(`EXCHANGE`) LIKE ?) T, ( SELECT @ROWNUM:=0 ) R ORDER BY `VALUE`;', ['%' + queryParams['exchange'] + '%'] , function(err, rows, fields){
        if(!err) {
            responseObject = {
                data: rows,
                success: true
            };
        }
        else {
            responseObject = {
                message: 'Exception occurred : ' + err.message,
                success: false
            };
        }
        
       return res.send(responseObject);
    });
}); */

router.get('/getHistoricTradeData', (req, res) => {
    queryParams = req.query;
    connection.query('SELECT SYMBOL, TRADE, DATE_FORMAT(DATE_1, "%M %d %Y") AS DATE_1, PRICE_1, DATE_FORMAT(DATE_2, "%M %d %Y") AS DATE_2, PRICE_2, CASH_FUTURES, EXCHANGE FROM TRADE WHERE SYMBOL IN (?) AND EXCHANGE LIKE ? AND DATE_1 BETWEEN ? AND ? ORDER BY DATE_1 DESC',[queryParams.symbol.split(','), '%' + queryParams.exchange + '%', queryParams.histStartDate, queryParams.histEndDate], function (err, rows, fields) {
        
        if (!err) {
            responseObject = {
                data: rows,
                success: true
            };
        }
        else {
            responseObject = {
                message: 'Exception occurred : ' + err.message,
                success: false
            }
        }
        return res.send(responseObject);    
    });
});

module.exports = {
    router : router
}