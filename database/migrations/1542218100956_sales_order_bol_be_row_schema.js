'use strict';

const Schema = use('Schema');

class SalesOrderBolBeRowSchema extends Schema {
	up() {
		this.create('sales_orders_bol_be_rows', (table) => {
			table.increments();
			table.integer('id_sales_order_bol_be').unsigned().notNullable();
			table.string('id_order_bol_be').notNullable(); // Bol reference from the order
			table.string('id_order_bol_be_item').notNullable(); // Bol reference from the order
			table.integer('id_product').unsigned().defaultTo(0);
			table.string('ean13', 20);
			table.string('product_name_nl', 80).notNullable();
			table.decimal('quantity', 12, 2).nullable();
			table.decimal('row_total_sp_in_vat', 12, 2).defaultTo(0);
			table.decimal('product_sp_in_vat', 12, 2).defaultTo(0);
			table.decimal('product_sp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('transaction_fee', 12, 2).defaultTo(0);
			table.decimal('calc_cost_bol_be', 12, 2).defaultTo(0);
			table.string('latest_delivery_date', 30);
			table.decimal('vat_procent', 4, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_bol_be', 12, 2).defaultTo(0);
			table.boolean('cancel_request').defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('sales_orders_bol_be_rows');
	}
}

module.exports = SalesOrderBolBeRowSchema;
