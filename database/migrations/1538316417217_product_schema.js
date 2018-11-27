'use strict';

const Schema = use('Schema');

class ProductSchema extends Schema {
	up() {
		this.create('products', (table) => {
			table.increments();
			table.string('id_product_supplier', 20);
			table.integer('id_supplier').unsigned().notNullable();
			table.integer('id_bol_category').unsigned().notNullable();
			table.integer('id_brand').unsigned().nullable();
			table.string('ean13', 20);
			table.string('name_nl', 80).notNullable();
			table.string('name_fr', 80);
			table.string('name_en', 80);
			table.string('slug_nl').unique().notNullable();
			table.string('slug_fr');
			table.string('slug_en');
			table.string('meta_descr_nl', 50);
			table.string('meta_title_nl', 50);
			table.text('descr_short_nl', 400);
			table.text('descr_long_nl', 800);
			table.string('meta_descr_fr', 50);
			table.string('meta_title_fr', 50);
			table.text('descr_short_fr', 400);
			table.text('descr_long_fr', 800);
			table.string('meta_descr_en', 50);
			table.string('meta_title_en', 50);
			table.text('descr_short_en', 400);
			table.text('descr_long_en', 800);
			table.boolean('active').defaultTo(0);
			table.boolean('active_bol_be').defaultTo(0);
			table.boolean('active_bol_nl').defaultTo(0);
			table.decimal('cost_factor', 6, 2).defaultTo(0);
			table.decimal('cost_amount', 12, 2).defaultTo(0);
			table.decimal('pp_ex_vat_supplier', 12, 2).defaultTo(0);
			table.decimal('pp_ex_vat_cz', 12, 2).defaultTo(0);
			table.decimal('vat_procent', 4, 2).defaultTo(0);
			table.decimal('sp_ex_vat_dropshipping', 12, 2).defaultTo(0);
			table.decimal('sp_ex_vat_wholesale', 12, 2).defaultTo(0);
			table.decimal('sp_ex_vat_cz', 12, 2).defaultTo(0);
			table.decimal('sp_in_vat_cz').defaultTo(0);
			table.decimal('sp_ex_vat_bol_be').defaultTo(0);
			table.decimal('sp_in_vat_bol_be').defaultTo(0);
			table.decimal('sp_ex_vat_bol_nl').defaultTo(0);
			table.decimal('sp_in_vat_bol_nl').defaultTo(0);
			table.decimal('margin_factor_dropshipping', 8, 4).defaultTo(0);
			table.decimal('margin_factor_wholesale', 8, 4).defaultTo(0);
			table.decimal('margin_factor_cz_web_be', 8, 4).defaultTo(0);
			table.decimal('margin_factor_cz_web_nl', 8, 4).defaultTo(0);
			table.decimal('margin_factor_cz_shop', 8, 4).defaultTo(0);
			table.decimal('margin_factor_bol_be', 8, 4).defaultTo(0);
			table.decimal('margin_factor_bol_nl', 8, 4).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_cz_be', 12, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_cz_nl', 12, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_bol_be', 12, 2).defaultTo(0);
			table.decimal('shipping_cost_ex_vat_bol_nl', 12, 2).defaultTo(0);
			table.decimal('total_cost_ex_vat_bol_be', 12, 2).defaultTo(0);
			table.decimal('total_cost_ex_vat_bol_nl', 12, 2).defaultTo(0);
			table.decimal('netto_profit_amount_cz_be', 12, 2).defaultTo(0);
			table.decimal('netto_profit_amount_cz_nl', 12, 2).defaultTo(0);
			table.decimal('netto_profit_amount_bol_be', 12, 2).defaultTo(0);
			table.decimal('netto_profit_amount_bol_nl', 12, 2).defaultTo(0);
			table.decimal('stock_start', 12, 2).defaultTo(0);
			table.decimal('stock_real', 12, 2).defaultTo(0);
			table.decimal('stock_accounting', 12, 2).defaultTo(0);
			table.integer('stock_place_1').unsigned().nullable();
			table.integer('stock_place_2').unsigned().nullable();
			table.integer('stock_place_3').unsigned().nullable();
			table.integer('stock_place_4').unsigned().nullable();
			table.integer('stock_place_5').unsigned().nullable();
			table.string('product_pic', 80);
			table.timestamps();
		});
	}

	down() {
		this.drop('products');
	}
}

module.exports = ProductSchema;
