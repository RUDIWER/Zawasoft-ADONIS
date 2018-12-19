'use strict';

const Model = use('Model');

class ps_CategoryLang extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_category_lang';
	}

	static get primaryKey() {
		return 'id_category';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_CategoryLang;
