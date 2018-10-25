const login = require('./login');
const register = require('./register');

module.exports = {
    loginRoute : login.router,
    registerRoute: register.router
} 