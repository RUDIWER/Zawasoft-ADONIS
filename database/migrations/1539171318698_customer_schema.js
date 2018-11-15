'use strict';

const Schema = use('Schema');

class CustomerSchema extends Schema {
	up() {
		this.create('customers', (table) => {
			table.increments();
			table.string('id_title', 10).notNullable();
			table.string('id_type', 10).notNullable(); // Comes from Customer_type
			table.string('id_origin', 10).notNullable();
			table.string('id_lang', 10).notNullable();
			table.string('first_name', 50).notNullable();
			table.string('last_name', 50).notNullable();
			table.string('email_1', 60).notNullable();
			table.string('email_2', 60).nullable();
			table.string('company', 50).nullable();
			table.string('vat_number', 50).nullable();
			table.string('bank_account', 50).nullable();
			table.string('website', 80).nullable();
			table.date('birthday').nullable();
			table.string('phone_1', 50).nullable();
			table.string('phone_2', 50).nullable();
			table.string('phone_3', 50).nullable();
			table.string('phone_descr_1', 50).nullable();
			table.string('phone_descr_2', 50).nullable();
			table.string('phone_descr_3', 50).nullable();
			table.boolean('newsletter').defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('customers');
	}
}

module.exports = CustomerSchema;
