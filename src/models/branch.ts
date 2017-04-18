import * as Sequelize from "sequelize";


export function Branch(sequelize) {

    return sequelize.define('branch', {

        branch: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}
