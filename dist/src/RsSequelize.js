var Sequelize = require('sequelize');
var path = require('path');
var sequelize = new Sequelize('recspec', 'root', '', {
    dialect: 'mysql',
    port: 3306,
    logging: function () {
        console.debug(arguments);
    }
});
var RsSequelize = (function () {
    function RsSequelize(app, config) {
        this.app = app;
        this.config = config;
    }
    return RsSequelize;
}());
//# sourceMappingURL=RsSequelize.js.map