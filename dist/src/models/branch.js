"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
function Branch(sequelize) {
    return sequelize.define('branch', {
        branch: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}
exports.Branch = Branch;
//# sourceMappingURL=branch.js.map