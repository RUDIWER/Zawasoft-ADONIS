'use strict';

const Product = use('App/Models/Product');
const Database = use('Database');

//TEST

class TestController {
	async prestaProducts({}) {
		const products = await Database.connection('mysql2').table('ps_product').where('id_product', '=', '1');

		return products;
	}
}

module.exports = TestController;
