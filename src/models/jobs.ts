import * as Sequelize from 'sequelize';

export function Jobs(sequelize) {

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
