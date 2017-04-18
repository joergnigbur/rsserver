"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
var User = (function () {
    function User(sequelize) {
        return sequelize.define('boxmessage', {
            BOX_SERIAL_NUMBER: {
                type: Sequelize.STRING,
                allowNull: false
            },
            BD_GPS_LATITUDE: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            BD_GPS_LONGITUDE: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            freezeTableName: true
        });
    }
    return User;
}());
module.exports = function (sequelize) {
    var BoxMessage = sequelize.define('boxmessage', {
        BOX_SERIAL_NUMBER: {
            type: Sequelize.STRING,
            allowNull: false
        },
        BD_GPS_LATITUDE: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        BD_GPS_LONGITUDE: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true
    });
    return BoxMessage;
};
//# sourceMappingURL=user.js.map