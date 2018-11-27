'use strict';

const OldProduct = use('App/Models/OldProduct');
const Product = use('App/Models/Product');
const Supplier = use('App/Models/Supplier');
const Param = use('App/Models/Param');
const ProductBrand = use('App/Models/ProductBrand');
const ProductGroup = use('App/Models/ProductGroup');
const ProductProductGroup = use('App/Models/ProductProductGroup');
const BolCategory = use('App/Models/BolCategory');

class OldProductController {
	async index({ view }) {
		const oldProducts = (await OldProduct.all()).toJSON();
		return view.render('admin.oldProducts.productList', { oldProducts });
	}

	async copy({ view, params }) {
		const oldProduct = await OldProduct.query().where('id_product', '=', params.id).first();
		const isNew = 1;
		const suppliers = (await Supplier.all()).toJSON();
		const brands = (await ProductBrand.all()).toJSON();
		const param = await Param.find(1);
		const array = (await ProductGroup.all()).toJSON();
		const productGroups = makeTree(array, 0); // See functon on bottom
		const bolCategories = (await BolCategory.all()).toJSON();
		const stockPlace1 = await StockPlace.query().where('place_level', '=', '1');
		const stockPlace2 = await StockPlace.query().where('place_level', '=', '2');
		const stockPlace3 = await StockPlace.query().where('place_level', '=', '3');
		const stockPlace4 = await StockPlace.query().where('place_level', '=', '4');
		const stockPlace5 = await StockPlace.query().where('place_level', '=', '5');
		//const activeGroups = await ProductProductGroup.query().where('product_id', '=', product.id);

		const product = await new Product();
		product.slug_nl = this.slugify(oldProduct.name, params.id);
		product.slug_fr = '';
		product.slug_en = '';
		product.id_supplier = oldProduct.id_supplier;
		product.id_product_supplier = oldProduct.product_supplier_reference;
		product.id_brand = '';
		product.id_bol_category = '';
		if (oldProduct.ean13) {
			product.ean13 = oldProduct.ean13;
		} else {
			product.ean13 = '';
		}
		product.id_invoice_supplier = 0;
		product.name_nl = oldProduct.name;
		product.name_fr = '';
		product.name_en = '';
		product.meta_descr_nl = oldProduct.meta_descr_nl;
		product.meta_title_nl = oldProduct.meta_title_nl;
		product.descr_short_nl = oldProduct.descr_short_nl;
		product.descr_long_nl = '';
		product.meta_descr_fr = '';
		product.meta_descr_en = '';
		product.descr_short_fr = '';
		product.descr_short_en = '';
		product.descr_long_fr = '';
		product.descr_long_en = '';
		product.meta_title_fr = '';
		product.meta_title_en = '';
		product.active = 0;
		product.active_bol_be = 0;
		product.active_bol_nl = 0;
		product.cost_factor = oldProduct.cost_factor;
		product.cost_amount = oldProduct.ikp_supplier - oldProduct.ikp_ex_cz;
		product.pp_ex_vat_supplier = oldProduct.ikp_supplier;
		product.pp_ex_vat_cz = oldProduct.ikp_ex_cz;
		product.vat_procent = oldProduct.vat_procent;
		product.sp_ex_vat_dropshipping = oldProduct.vkp_ex_dropshipping;
		product.sp_ex_vat_wholesale = oldProduct.vkp_ex_wholesale;
		product.sp_ex_vat_cz = oldProduct.vkp_cz_ex_vat;
		product.sp_in_vat_cz = oldProduct.vkp_cz_in_vat;
		product.sp_ex_vat_bol_be = oldProduct.vkp_bol_be_ex_vat;
		product.sp_in_vat_bol_be = oldProduct.vkp_bol_be_in_vat;
		product.sp_ex_vat_bol_nl = oldProduct.vkp_bol_nl_ex_vat;
		product.sp_in_vat_bol_nl = oldProduct.vkp_bol_nl_in_vat;
		product.margin_factor_dropshipping = oldProduct.margin_factor_dropshipping;
		product.margin_factor_wholesale = oldProduct.margin_factor_wholesale;
		product.margin_factor_cz_web_be = oldProduct.margin_factor_be_cz;
		product.margin_factor_cz_web_nl = oldProduct.margin_factor_nl_cz;
		product.margin_factor_cz_shop = oldProduct.margin_factor_cz;
		product.margin_factor_bol_be = oldProduct.margin_factor_bol_be;
		product.margin_factor_bol_nl = oldProduct.margin_factor_bol_nl;
		product.shipping_cost_ex_vat_cz_be = oldProduct.shipping_cost_cz_be;
		product.shipping_cost_ex_vat_cz_nl = oldProduct.shipping_cost_cz_nl;
		product.shipping_cost_ex_vat_bol_be = oldProduct.shipping_cost_bol_be;
		product.shipping_cost_ex_vat_bol_nl = oldProduct.shipping_cost_bol_nl;
		product.total_cost_ex_vat_bol_be = oldProduct.bol_be_cost;
		product.total_cost_ex_vat_bol_nl = oldProduct.bol_nl_cost;
		product.netto_profit_amount_cz_be = oldProduct.netto_profit_amount_be;
		product.netto_profit_amount_cz_nl = oldProduct.netto_profit_amount_nl;
		product.netto_profit_amount_bol_be = oldProduct.netto_profit_amount_bol_be;
		product.netto_profit_amount_bol_nl = oldProduct.netto_profit_amount_bol_nl;
		product.stock_start = oldProduct.quantity_in_stock;
		product.stock_real = 0;
		product.stock_accounting = 0;
		product.stock_place_1 = '';
		product.stock_place_2 = '';
		product.stock_place_3 = '';
		product.stock_place_4 = '';
		product.created_at = oldProduct.date_add;
		product.updated_at = oldProduct.date_upd;

		return view.render('admin.products.productForm', {
			isNew,
			product,
			suppliers,
			param,
			productGroups,
			brands,
			bolCategories,
			stockPlace1,
			stockPlace2,
			stockPlace3,
			stockPlace4,
			stockPlace5
		});
	}

	async delete({ session, response, params }) {
		session.flashAll();
		const oldProduct = await OldProduct.query().where('id_product', '=', params.id).delete();
		session.flash({
			notification: {
				type: 'success',
				message: 'Het product is geschrapt uit de database !'
			}
		});
		return response.redirect('back');
	}

	slugify(str, id) {
		str = str.replace(/^\s+|\s+$/g, ''); // trim
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from =
			'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:; ';
		var to = 'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa-------';
		for (var i = 0, l = from.length; i < l; i++) {
			str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}
		str = str
			.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
			.replace(/-+/g, '-'); // collapse dashes
		// If there is a id put id in front of slug
		if (id) {
			str = id + '-' + str;
		}
		return str;
	}
}

// Function to convert flat file (id, id_parent to tree array with childs)
function makeTree(arr, parentid) {
	let output = [];
	for (const obj of arr) {
		if (obj.id_parent == parentid) {
			var childs = makeTree(arr, obj.id);
			if (childs.length) {
				obj.childs = childs;
			}
			output.push(obj);
		}
	}
	return output;
}

module.exports = OldProductController;
