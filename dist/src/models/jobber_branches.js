"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
function JobberBranches(sequelize) {
    return sequelize.define('jobber_branches', {
        jobberId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    });
}
exports.JobberBranches = JobberBranches;
//# sourceMappingURL=jobber_branches.js.map