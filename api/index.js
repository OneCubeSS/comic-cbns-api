let comic = require('./comic/route');
let admin = require('./admin/route');
let login = require('./login/route');

module.exports = {
    registerRoutes: function(app) {
        app.use('/api/admin', admin);
        app.use('/api/comic', comic);
        app.use('/api/user', login);
    }
};