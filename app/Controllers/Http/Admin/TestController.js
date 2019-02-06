'use strict';

//const Product = use('App/Models/Product');
const StoreSquareApi = use('App/ZawaClasses/StoreSquareApi.js');
const Env = use('Env');

//TEST
class TestController {
	async getCategories() {
		const storeSquareApi = new StoreSquareApi(Env.get('STORESQUARE_KEY'));
		var result = await storeSquareApi.getCategories();
		return result;
	}
}

module.exports = TestController;
