'use strict';

const Model = use('Model');

class Product extends Model {
	activeGroups() {
		return this.belongsToMany('App/Models/ProductGroup').pivotTable('product_product_groups');
	}
}

module.exports = Product;
