'use strict';

const Schema = use('Schema');

class SalesOrderRowZwdSchema extends Schema {
	up() {
		this.create('sales_order_rows_zwd', (table) => {
			table.increments();
			table.integer('id_sales_order_zwd').unsigned().notNullable();
			table.string('id_country_zwd').notNullable(); // Be or NL
			table.string('id_order_zwd').notNullable(); // PRESTA reference from the order
			//	table.string('id_order_zwd_item').notNullable(); // PRESTA reference from the order
			table.integer('id_product').unsigned().defaultTo(0);
			table.string('ean13', 20);
			table.string('product_name_nl', 80).notNullable();
			table.decimal('quantity', 12, 2).nullable();
			table.decimal('row_total_sp_in_vat', 12, 2).defaultTo(0);
			table.decimal('row_total_sp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('product_sp_in_vat', 12, 2).defaultTo(0);
			table.decimal('product_sp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('vat_procent', 4, 2).defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('sales_order_rows_zwd');
	}
}

module.exports = SalesOrderRowZwdSchema;
