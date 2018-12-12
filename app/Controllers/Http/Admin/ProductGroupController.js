'use strict';

const Product = use('App/Models/Product');
const ProductGroup = use('App/Models/ProductGroup');
const Database = use('Database');

class ProductGroupController {
	async index({ view }) {
		const isParent = 1;
		const parentGroups = await Database.table('product_groups').where('id_parent','=','2');
		return view.render('admin.productGroups.productGroupList', { isParent, parentGroups });
	}
}

module.exports = ProductGroupController;
