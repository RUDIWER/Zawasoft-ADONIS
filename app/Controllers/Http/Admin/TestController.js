'use strict';

const Product = use('App/Models/Product');
const Database = use('Database');
const ProductGroupTree = use('App/ZawaClasses/ProductGroupTree');

//TEST

class TestController {
	async tree() {
		const productGroupTree = new ProductGroupTree();
		var result = await productGroupTree.calcTree();
		return result;
	}
}

module.exports = TestController;
