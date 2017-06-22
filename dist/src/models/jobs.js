"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
function Jobs(sequelize) {
    return sequelize.define('jobs', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}
exports.Jobs = Jobs;
//# sourceMappingURL=jobs.js.map