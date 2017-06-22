import * as Sequelize from "sequelize";


export function JobberBranches(sequelize) {

    return sequelize.define('jobber_branches', {

        jobberId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

    });
}
