import * as Sequelize from 'sequelize';

export function Jobs(sequelize) {

    return sequelize.define('jobs', {

        titel: {
            type: Sequelize.STRING,
            allowNull: false
        },
        jobbeschreibung: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}
