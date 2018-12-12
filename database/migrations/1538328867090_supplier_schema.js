'use strict';

const Schema = use('Schema');

class SupplierSchema extends Schema {
	up() {
		this.create('suppliers', (table) => {
			table.increments();
			table.string('company', 50).unique();
			table.text('description');
			table.string('email_1', 60);
			table.string('email_1_descr', 50);
			table.string('email_2', 60);
			table.string('email_2_descr', 50);
			table.string('website', 80);
			table.string('phone_1', 20);
			table.string('phone_descr_1', 50);
			table.string('phone_2', 20);
			table.string('phone_descr_2', 50);
			table.string('phone_3', 20);
			table.string('phone_descr_3', 50);
			table.string('contact_1', 50);
			table.string('contact_2', 50);
			table.string('vat_number', 30);
			table.string('bank_account', 30);
			table.string('country', 50);
			table.string('state', 50);
			table.string('postcode', 20);
			table.string('street', 50);
			table.string('number', 10);
			table.string('bus', 10);
			table.string('city', 50);
			table.string('meta_title', 125);
			table.string('meta_keywords', 255);
			table.string('meta_description', 255);
			table.text('memo', 100);
			table.timestamps();
		});
	}

	down() {
		this.drop('suppliers');
	}
}

module.exports = SupplierSchema;
