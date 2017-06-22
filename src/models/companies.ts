import * as Sequelize from 'sequelize';

export function Companies(sequelize) {

    return sequelize.define('companies', {

        companyName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
}
