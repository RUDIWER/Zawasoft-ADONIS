'use strict';

const Model = use('Model');

class StoreSquareCategory extends Model {
	static get table() {
		return 'storesquare_categories';
	}
}

module.exports = StoreSquareCategory;
