'use strict';

const Model = use('Model');

class ps_ProductLang extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_product_lang';
	}

	static get primaryKey() {
		return 'id_product';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_ProductLang;
