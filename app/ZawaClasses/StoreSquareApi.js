'use strict';
const Product = use('App/Models/Product');
const Brand = use('App/Models/ProductBrand');
const Category = use('App/Models/StoreSquareCategory');
const axios = require('axios');
class StoreSquareApi {
	constructor(key) {
		this.key = '$2y$10$WO7a.' + key;
		this.http_uri = 'https://storesquare.be/api/v1';
		this.contentType = 'application/json';
	}

	async request(httpMethod, endPoint, param) {
		if (!param) {
			param = '';
		}
		if (httpMethod == 'GET') {
			const path = this.http_uri + endPoint + '?apikey=' + this.key + param;
			console.log('PATH IS :' + path);
			return await axios
				.get(path)
				.then((response) => {
					const body = response.data.data;
					console.log('Result from GET => OK : ' + JSON.stringify(body));
					return body;
				})
				.catch((error) => {
					const body = error.response.data.error;
					console.log('Result from GET => ERROR : ' + body);
					console.log(body);
					return body;
				});
		} else if (httpMethod == 'POST') {
			const path = this.http_uri + endPoint;
			console.log('PATH IS :' + path);
			const object = Object.assign({ apikey: this.key }, param);
			console.log('OBJECT IS   ' + JSON.stringify(object));
			return await axios
				.post(path, object)
				.then((response) => {
					const body = response.data.data;
					console.log('Result from POST => OK : ' + JSON.stringify(body));
					const status = 200;
					return { body: body, status: status };
				})
				.catch((error) => {
					const body = error.response.data.error;
					console.log('Result from POST => ERROR : ' + body);
					const status = 400;
					return { body: body, status: status };
				});
		}
	}

	async getCategories() {
		const result = await this.request('GET', '/categories', '&flat=true');
		return result;
	}

	async getBrands() {
		const result = await this.request('GET', '/brands/cool-zawadi');
		return result;
	}

	async getBrand(id) {
		const brand = await Brand.find(id);
		const uri = '/brands/' + brand.name_nl;
		let result = await this.request('GET', uri);
		return result;
	}

	async addBrand(id) {
		const brand = await Brand.find(id);
		const uri = '/brands';
		const param = {
			name: brand.name_nl
		};
		console.log(param);
		let result = await this.request('POST', uri, param);
		return result;
	}

	async setProduct(id) {
		const product = await Product.find(id);
		const brand = await Brand.find(product.id_brand);
		const category = await Category.find(product.id_storesquare_category);
		const uri = '/products';
		const param = {
			sku: product.id,
			name: product.name_nl,
			description: product.descr_short_nl + '<br>' + product.descr_long_nl,
			stock: product.stock_real,
			category: category.id_storesquare,
			brand: brand.id_storesquare,
			price: product.sp_in_vat_storesquare,
			promotion: 0,
			ean: product.ean13,
			images: [ product.pic ],
			active: true
		};
		const result = await this.request('POST', uri, param);
		console.log('NA POST IN SETPRODUCT !!!!!!!!!!!!!!!!!!!!!!!');
		console.log('status is :' + result.status);
		console.log('body is :' + JSON.stringify(result.body));
		return result;
	}

	async delProduct(id) {
		const product = await Product.find(id);
		const brand = await Brand.find(product.id_brand);
		const uri = '/products';
		const param = {
			sku: product.id,
			name: product.name_nl,
			description:
				product.descr_short_nl +
				'<br>' +
				product.descr_long_nl +
				'<br>' +
				'<br>' +
				'<p>Meer info zie : <a href="https://zawadeals.com">www.zawadeals.com</a></p>',
			stock: product.stock_real,
			category: product.id_storesquare_category,
			brand: brand.id_storesquare,
			price: product.sp_in_vat_storesquare,
			promotion: 0,
			ean: product.ean13,
			images: [ product.pic ],
			active: false
		};
		const result = await this.request('POST', uri, param);
		console.log('NA POST IN DEL PRODUCT !!!!!!!!!!!!!!!!!!!!!!!');
		console.log('status is :' + result.status);
		console.log('body is :' + JSON.stringify(result.body));
		return result;
	}
}

module.exports = StoreSquareApi;
