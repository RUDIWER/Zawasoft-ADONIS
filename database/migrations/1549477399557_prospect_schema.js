'use strict';

const Schema = use('Schema');

class ProspectSchema extends Schema {
	up() {
		this.create('prospects', (table) => {
			table.increments();
			table.string('id_title', 10).notNullable();
			table.string('id_lang', 10).notNullable();
			table.string('id_type', 10).notNullable();
			table.string('first_name', 50).notNullable();
			table.string('company', 50);
			table.string('last_name', 50).notNullable();
			table.string('country', 50).notNullable();
			table.string('state', 50).nullable();
			table.string('postcode', 20).notNullable();
			table.string('city', 50).notNullable();
			table.string('street', 50).notNullable();
			table.string('number', 10).notNullable();
			table.string('bus', 10);
			table.string('phone', 40);
			table.string('mobile', 40);
			table.string('email', 60).notNullable().unique();
			table.string('website', 80).nullable();
			table.date('birthday').nullable();
			table.boolean('newsletter').defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('propsects');
	}
}

module.exports = ProspectSchema;
