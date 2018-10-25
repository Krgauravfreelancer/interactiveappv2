const historic = require('./historic/historic-dao');
const live = require('./live/live-dao');

module.exports = {
    initialize : (io) => {
        live.init(io)
    },
    histTradeRoute : historic.router,
    liveTradeRoute : live.router

} 