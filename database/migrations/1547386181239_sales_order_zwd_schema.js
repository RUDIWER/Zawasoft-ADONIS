'use strict';

const Schema = use('Schema');

class SalesOrderZwdSchema extends Schema {
	up() {
		this.create('sales_orders_zwd', (table) => {
			table.increments();
			table.string('id_order_zwd').notNullable();
			table.string('reference').notNullable();
			table.integer('current_status').notNullable();
			table.string('id_country_zwd').notNullable();
			table.string('date_time_order', 50).notNullable();
			table.integer('id_title_delivery').unsigned();
			table.string('customer_first_name_delivery', 50).notNullable();
			table.string('customer_last_name_delivery', 50).notNullable();
			table.string('company_delivery', 50).nullable();
			table.string('street_delivery', 50).notNullable();
			table.string('number_delivery', 10).notNullable();
			table.string('bus_delivery', 10).nullable();
			table.string('city_delivery', 50).notNullable();
			table.string('postcode_delivery', 20).notNullable();
			table.string('country_delivery', 50).notNullable();
			table.string('email_delivery', 60).nullable();
			table.string('phone_delivery', 50).nullable();
			table.integer('id_title_invoice').unsigned();
			table.string('customer_first_name_invoice', 50).notNullable();
			table.string('customer_last_name_invoice', 50).notNullable();
			table.string('company_invoice', 50).nullable();
			table.string('vat_number_invoice', 50).nullable();
			table.string('street_invoice', 50).notNullable();
			table.string('number_invoice', 10).notNullable();
			table.string('bus_invoice', 10).nullable();
			table.string('city_invoice', 50).notNullable();
			table.string('postcode_invoice', 20).notNullable();
			table.string('country_invoice', 50).notNullable();
			table.string('email_invoice', 60).nullable();
			table.decimal('shipping_cost_ex_vat', 12, 2).defaultTo(0);
			table.decimal('shipping_amount_ex_vat', 12, 2).defaultTo(0);
			table.decimal('shipping_amount_in_vat', 12, 2).defaultTo(0);
			table.string('payment_method', 50);
			table.decimal('total_paid', 12, 2).defaultTo(0);
			table.integer('current_state').unsigned().defaultTo(0);
			table.boolean('is_problem').defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('sales_orders_zwd');
	}
}

module.exports = SalesOrderZwdSchema;
