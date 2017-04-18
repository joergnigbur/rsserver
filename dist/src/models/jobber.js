"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
var interfaces_1 = require("rscommon/src/interfaces");
function Jobber(sequelize) {
    return sequelize.define('jobber', {
        anrede: {
            type: Sequelize.ENUM,
            values: ['Herr', 'Frau'],
            allowNull: false
        },
        vorname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nachname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        strasse: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hausnummer: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        plz: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                len: [4, 5],
                isNumeric: true
            }
        },
        ort: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        mobil: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isPhone: function (value) {
                    if (!new RegExp(interfaces_1.RegexTelPattern).test(value)) {
                        throw new Error('Bitte gültige Mobilfunknummer eingeben');
                    }
                }
            }
        }
    });
}
exports.Jobber = Jobber;
//# sourceMappingURL=jobber.js.map