'use strict';

const Schema = use('Schema');

class SalesInvoiceRowSchema extends Schema {
	up() {
		this.create('sales_invoice_rows', (table) => {
			table.increments();
			table.integer('id_invoice').unsigned().notNullable();
			table.integer('invoice_number').unsigned().notNullable();
			table.integer('id_supplier').unsigned();
			table.integer('id_bol_category').unsigned();
			table.integer('id_product_brand').unsigned();
			table.integer('id_sales_order').unsigned().defaultTo(0);
			table.integer('id_invoice_type').unsigned().notNullable(); // Comes from customer_type
			table.string('order_reference', 20).defaultTo(0);
			table.integer('id_product').unsigned().defaultTo(0);
			table.string('id_product_supplier', 20);
			table.string('ean13', 20);
			table.string('description', 50).notNullable();
			table.decimal('quantity', 12, 2).nullable();
			table.decimal('product_pp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('product_sp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('product_sp_in_vat', 12, 2).defaultTo(0);
			table.decimal('row_total_pp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('row_total_pp_in_vat', 12, 2).defaultTo(0);
			table.decimal('row_total_sp_ex_vat', 12, 2).defaultTo(0);
			table.decimal('row_total_sp_in_vat', 12, 2).defaultTo(0);
			table.decimal('vat_procent', 4, 2).defaultTo(0);
			table.decimal('cost_ex_vat_bol_be', 12, 2).defaultTo(0);
			table.decimal('cost_ex_vat_bol_nl', 12, 2).defaultTo(0);
			table.decimal('row_total_cost_ex_vat_bol_be', 12, 2).defaultTo(0);
			table.decimal('row_total_cost_ex_vat_bol_nl', 12, 2).defaultTo(0);
			table.decimal('amazon_cost_ex_vat', 12, 2).defaultTo(0);
			table.timestamps();
		});
	}

	down() {
		this.drop('sales_invoice_rows');
	}
}

module.exports = SalesInvoiceRowSchema;
