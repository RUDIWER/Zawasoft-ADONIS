'use strict';

const Schema = use('Schema');

class SalesInvoiceSchema extends Schema {
	up() {
		this.create('sales_invoices', (table) => {
			table.increments();
			table.integer('invoice_number').unsigned().notNullable().unique();
			table.integer('id_sales_order').unsigned().defaultTo(0);
			table.string('order_reference', 20).defaultTo(0);
			table.date('invoice_date').notNullable();
			table.date('order_date').nullable();
			table.string('id_order_bol', 20).nullable();
			table.integer('id_payment_method').unsigned().defaultTo(0);
			table.integer('id_customer').unsigned().notNullable();
			table.integer('id_invoice_type').unsigned().notNullable(); // Comes from customer_type
			table.integer('id_invoice_address').unsigned().nullable();
			table.string('customer_first_name', 50).notNullable();
			table.string('customer_last_name', 50).notNullable();
			table.string('company', 50).nullable();
			table.string('country', 50).notNullable();
			table.string('state', 50).notNullable();
			table.string('postcode', 20).notNullable();
			table.string('alias', 30).notNullable();
			table.string('street', 50).notNullable();
			table.string('number', 10).notNullable();
			table.string('bus', 10).nullable();
			table.string('city', 50).notNullable();
			table.string('email', 60).nullable();
			table.string('phone', 50).nullable();
			table.string('vat_number', 50).nullable();
			table.decimal('shipping_vat_procent', 12, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat', 12, 2).defaultTo(0);
			table.decimal('shipping_amount_ex_vat', 12, 2).defaultTo(0);
			table.decimal('shipping_amount_in_vat', 12, 2).defaultTo(0);
			table.decimal('products_ex_vat', 12, 2).defaultTo(0);
			table.decimal('products_in_vat', 12, 2).defaultTo(0);
			table.decimal('pp_ex_vat_cz', 12, 2).defaultTo(0);
			table.decimal('cost_ex_vat_bol', 12, 2).defaultTo(0);
			table.decimal('wrapping_cost_ex_vat', 12, 2).defaultTo(0);
			table.decimal('wrapping_amount_ex_vat', 12, 2).defaultTo(0);
			table.decimal('wrapping_amount_in_vat', 12, 2).defaultTo(0);
			table.decimal('invoice_ex_vat', 12, 2).defaultTo(0);
			table.decimal('invoice_in_vat', 12, 2).defaultTo(0);
			table.decimal('amount_paid', 12, 2).defaultTo(0);
			table.decimal('netto_margin_ex_vat', 12, 2).defaultTo(0);
			table.decimal('margin_procent', 12, 2).defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('sales_invoices');
	}
}

module.exports = SalesInvoiceSchema;
