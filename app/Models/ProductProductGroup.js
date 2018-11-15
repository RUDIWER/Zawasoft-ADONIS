'use strict';

const Model = use('Model');

class ProductProductGroup extends Model {
	group() {
		return this.hasOne('App/Models/ProductGroup', 'product_group_id', 'id');
	}
}

module.exports = ProductProductGroup;
