'use strict';

const Schema = use('Schema');

class ProfileSchema extends Schema {
	up() {
		this.create('profiles', (table) => {
			table.increments();
			table.integer('user_id').unsigned();
			table.string('avatar');
			table.string('first_name', 30).notNullable();
			table.string('last_name', 40).notNullable();
			table.date('birthday');
			table.string('nationality', 40).notNullable();
			table.string('gender', 10).notNullable();
			table.string('delivery_addr_street', 40).notNullable();
			table.string('delivery_addr_housenr', 10).notNullable();
			table.string('delivery_addr_bus', 10);
			table.string('delivery_addr_postcode', 15).notNullable();
			table.string('delivery_addr_city', 30).notNullable();
			table.string('delivery_addr_country', 30).notNullable();
			table.string('delivery_phone_1', 20);
			table.string('delivery_mobile_1', 20);
			table.string('company_name', 30);
			table.string('vat_number', 20);
			table.string('invoice_addr_street', 40).notNullable();
			table.string('invoice_addr_housenr', 10).notNullable();
			table.string('invoice_addr_bus', 10);
			table.string('invoice_addr_postcode', 15).notNullable();
			table.string('invoice_addr_city', 30).notNullable();
			table.string('invoice_addr_country', 30).notNullable();
			table.string('invoice_phone_1', 20);
			table.string('invoice_mobile_1', 20);
			table.boolean('newsletter').defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('profiles');
	}
}

module.exports = ProfileSchema;
