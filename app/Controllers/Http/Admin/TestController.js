'use strict';

const Product = use('App/Models/Product');
const Database = use('Database');
const PrestaApi = use('App/ZawaClasses/PrestaApi');

//TEST

class TestController {
	async prestaProducts({}) {
		//	const products = await Database.connection('mysql2').table('ps_product').where('id_product', '=', '1');
		let product = await Product.find(19000);
		if (!product) {
			product = new Product();
		}
		return product;
	}
}

module.exports = TestController;
