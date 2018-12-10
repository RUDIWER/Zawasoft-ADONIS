'use strict';

const Product = use('App/Models/Product');
const ProductGroup = use('App/Models/ProductGroup');
const Database = use('Database');

class ProductGroupController {
	async index({ view }) {
		const groups = (await ProductGroup.all()).toJSON();
		const count = await Database.from('product_groups').count();
		const records = count[0]['count(*)'];
		return view.render('admin.productGroups.productGroupList', { groups, records });
	}
}

module.exports = ProductGroupController;
