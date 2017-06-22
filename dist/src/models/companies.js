"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
function Companies(sequelize) {
    return sequelize.define('companies', {
        companyName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}
exports.Companies = Companies;
//# sourceMappingURL=companies.js.map