'use strict';

const Model = use('Model');

class ProductGroup extends Model {
	childs() {
		return this.hasMany('App/Models/ProductGroup', 'id', 'id_parent');
	}

	parent() {
		return this.hasOne('App/Models/ProductGroup', 'id_parent', 'id');
	}
}

module.exports = ProductGroup;
