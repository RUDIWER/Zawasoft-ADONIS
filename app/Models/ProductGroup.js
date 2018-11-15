'use strict';

const Model = use('Model');

class ProductGroup extends Model {
	childs() {
		return this.hasMany('App/Models/ProductGroup', 'id', 'id_parent');
	}
}

module.exports = ProductGroup;
