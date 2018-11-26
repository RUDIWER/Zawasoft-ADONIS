'use strict';

const Schema = use('Schema');

class AddressSchema extends Schema {
	up() {
		this.create('addresses', (table) => {
			table.increments();
			table.integer('id_customer').unsigned();
			table.integer('id_supplier').unsigned();
			table.string('country', 50).notNullable();
			table.string('state', 50).Nullable();
			table.string('postcode', 20).notNullable();
			table.string('alias', 30).notNullable();
			table.string('company', 50);
			table.string('street', 50).notNullable();
			table.string('number', 10).notNullable();
			table.string('bus', 10);
			table.string('city', 50).notNullable();
			table.string('other', 50);
			table.string('phone', 40);
			table.string('mobile', 40);
			table.string('fax', 40);
			table.string('email', 60);
			table.string('vat_number', 50);
			table.string('first_name', 50);
			table.string('last_name', 50);
			table.timestamps();
		});
	}

	down() {
		this.drop('addresses');
	}
}

module.exports = AddressSchema;
