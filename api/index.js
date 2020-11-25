let comic = require('./comic/route');
let admin = require('./admin/route');
let login = require('./login/route');
let series = require('./series/route');
let publisher = require('./publisher/route');

module.exports = {
    registerRoutes: function(app) {
        app.use('/api/admin', admin);
        app.use('/api/user', login);
        app.use('/api/publisher', publisher); // publishers like DC, Marvel
        app.use('/api/series', series); // volumes inside the DC, Marvel[i.e., The Amazing Spider-Man vol.1]
        app.use('/api/issue', comic); // comics | magzines | issues 
    }
};