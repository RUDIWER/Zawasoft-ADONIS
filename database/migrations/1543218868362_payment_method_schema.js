'use strict';

const Schema = use('Schema');

class PaymentMethodSchema extends Schema {
	up() {
		this.create('payment_methods', (table) => {
			table.string('name', 50).notNullable();
			table.increments();
			table.timestamps();
		});
	}

	down() {
		this.drop('payment_methods');
	}
}

module.exports = PaymentMethodSchema;
