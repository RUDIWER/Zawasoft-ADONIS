'use strict';

const Schema = use('Schema');

class ParamSchema extends Schema {
	up() {
		this.create('params', (table) => {
			table.increments();
			table.decimal('shipping_cost_ex_vat_cz_be', 6, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_cz_nl', 6, 2).defaultTo(0);
			table.decimal('min_order_amount_in_vat_free_shipping', 6, 2).defaultTo(0);
			table.decimal('shipping_amount_ex_vat_cz_be', 6, 2).defaultTo(0); // What we coutn to the client for shipping if amount < min_order_amount
			table.decimal('shipping_amount_ex_vat_cz_nl', 6, 2).defaultTo(0);
			table.decimal('shipping_amount_ex_vat_dropshipping_be', 6, 2).defaultTo(0); // What we coutn to the client for shipping if amount < min_order_amount
			table.decimal('shipping_amount_ex_vat_dropshipping_nl', 6, 2).defaultTo(0); // What we coutn to the client for shipping if amount < min_order_amount
			table.decimal('shipping_amount_ex_vat_wholesale_be', 6, 2).defaultTo(0); // What we coutn to the client for shipping if amount < min_order_amount
			table.decimal('shipping_amount_ex_vat_wholesale_nl', 6, 2).defaultTo(0); // What we coutn to the client for shipping if amount < min_order_amount
			table.decimal('shipping_cost_ex_vat_bol_be', 6, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_bol_nl', 6, 2).defaultTo(0);
			table.decimal('fix_cost_ex_vat_bol', 6, 2).defaultTo(0);
			table.decimal('stand_cost_procent_bol', 6, 2).defaultTo(0);
			table.decimal('stand_vat_procent', 6, 2).defaultTo(0);
			table.decimal('stand_shipping_vat_procent', 6, 2).defaultTo(0);
			table.decimal('stand_margin_dropshipping', 6, 2).defaultTo(0);
			table.decimal('stand_margin_wholesale', 6, 2).defaultTo(0);
			table.integer('last_sales_invoice_nr').defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('params');
	}
}

module.exports = ParamSchema;
