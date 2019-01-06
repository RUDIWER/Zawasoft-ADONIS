'use strict';

const Product = use('App/Models/Product');
const Supplier = use('App/Models/Supplier');
const Param = use('App/Models/Param');
const StockPlace = use('App/Models/StockPlace');
const ProductGroup = use('App/Models/ProductGroup');
const ProductBrand = use('App/Models/ProductBrand');
const ProductProductGroup = use('App/Models/ProductProductGroup');
const ps_Image = use('App/Models/ps_Image');
const BolCategory = use('App/Models/BolCategory');
const Env = use('Env');
const BolApi = use('App/ZawaClasses/BolApi.js');
const PrestaApi = use('App/ZawaClasses/PrestaApi');
const Helpers = use('Helpers');
const Database = use('Database');
const fs = require('fs');
//const request = require('request');

class ProductController {
	async index({ view }) {
		const products = (await Product.all()).toJSON();
		const count = await Database.from('products').count();
		const records = count[0]['count(*)'];
		return view.render('admin.products.productList', { products, records });
	}

	async noStock({ view }) {
		const products = await Product.query().where('stock_real', '<', '1');
		const count = await Database.from('products').count();
		const records = count[0]['count(*)'];
		return view.render('admin.products.productList', { products, records });
	}

	async noEan({ view }) {
		const products = await Product.query().where('ean13', '=', '');
		const count = await Database.from('products').count();
		const records = count[0]['count(*)'];
		return view.render('admin.products.productList', { products, records });
	}

	async notBolBe({ view }) {
		const products = await Product.query().where('active_bol_be', '<', '1');
		const count = await Database.from('products').count();
		const records = count[0]['count(*)'];
		return view.render('admin.products.productList', { products, records });
	}

	async notBolNl({ view }) {
		const products = await Product.query().where('active_bol_nl', '<', '1');
		const count = await Database.from('products').count();
		const records = count[0]['count(*)'];
		return view.render('admin.products.productList', { products, records });
	}

	async create({ view }) {
		const isNew = 1;
		const product = await new Product();
		const suppliers = (await Supplier.all()).toJSON();
		const brands = (await ProductBrand.all()).toJSON();
		const param = await Param.find(1);
		const appRoot = Env.get('APP_URL');
		const productGroupsFlat = (await ProductGroup.all()).toJSON();
		//loop over array and add field active
		const productGroups = makeTree(productGroupsFlat, 0); // See function on bottom
		const bolCategories = (await BolCategory.all()).toJSON();
		const standGroups = (await ProductGroup.query()
			.where('id_parent', 2)
			.with('childs')
			.orderBy('name_nl', 'asc')
			.fetch()).toJSON();
		const stockPlace1 = await StockPlace.query().where('place_level', '=', '1');
		const stockPlace2 = await StockPlace.query().where('place_level', '=', '2');
		const stockPlace3 = await StockPlace.query().where('place_level', '=', '3');
		const stockPlace4 = await StockPlace.query().where('place_level', '=', '4');
		const stockPlace5 = await StockPlace.query().where('place_level', '=', '5');

		return view.render('admin.products.productForm', {
			isNew,
			product,
			suppliers,
			param,
			brands,
			productGroups,
			standGroups,
			bolCategories,
			stockPlace1,
			stockPlace2,
			stockPlace3,
			stockPlace4,
			stockPlace5,
			appRoot
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const product = await Product.find(params.id);
		const suppliers = (await Supplier.all()).toJSON();
		const brands = (await ProductBrand.all()).toJSON();
		const param = await Param.find(1);
		const appRoot = Env.get('APP_URL');
		const array = (await ProductGroup.all()).toJSON();
		const productGroups = makeTree(array, 0); // See functon on bottom
		const bolCategories = (await BolCategory.all()).toJSON();
		const standGroups = (await ProductGroup.query()
			.where('id_parent', 2)
			.with('childs')
			.orderBy('name_nl', 'asc')
			.fetch()).toJSON();
		const activeGroups = await ProductProductGroup.query().where('product_id', '=', product.id);
		const stockPlace1 = await StockPlace.query().where('place_level', '=', '1');
		const stockPlace2 = await StockPlace.query().where('place_level', '=', '2');
		const stockPlace3 = await StockPlace.query().where('place_level', '=', '3');
		const stockPlace4 = await StockPlace.query().where('place_level', '=', '4');
		const stockPlace5 = await StockPlace.query().where('place_level', '=', '5');

		return view.render('admin.products.productForm', {
			isNew,
			product,
			suppliers,
			param,
			productGroups,
			standGroups,
			brands,
			bolCategories,
			activeGroups,
			stockPlace1,
			stockPlace2,
			stockPlace3,
			stockPlace4,
			stockPlace5,
			appRoot
		});
	}

	async modal({ params }) {
		const product = await Product.find(params.id);
		const stockPlace1 = await StockPlace.find(product.stock_place_1);
		const stockPlace2 = await StockPlace.find(product.stock_place_2);
		const stockPlace3 = await StockPlace.find(product.stock_place_3);
		const stockPlace4 = await StockPlace.find(product.stock_place_4);
		const stockPlace5 = await StockPlace.find(product.stock_place_5);
		const stockName1 = stockPlace1 ? stockPlace1.name : '';
		const stockName2 = stockPlace2 ? stockPlace2.name : '';
		const stockName3 = stockPlace3 ? stockPlace3.name : '';
		const stockName4 = stockPlace4 ? stockPlace4.name : '';
		const stockName5 = stockPlace5 ? stockPlace5.name : '';
		return {
			ean: product.ean13,
			id: product.id,
			name: product.name_nl,
			picture: product.product_pic,
			stock_place_1: stockName1,
			stock_place_2: stockName2,
			stock_place_3: stockName3,
			stock_place_4: stockName4,
			stock_place_5: stockName5
		};
	}

	async save({ request, response, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get productData data from form
		const appRoot = Env.get('APP_URL');
		const productData = request.except([
			'_csrf',
			'submit',
			'created_at',
			'updated_at',
			'min_order_amount_in_vat_free_shipping_in_param',
			'shipping_amount_ex_vat_cz_be_in_param',
			'shipping_cost_ex_vat_cz_be_in_param',
			'shipping_cost_ex_vat_cz_nl_in_param',
			'shipping_amount_ex_vat_cz_nl_in_param',
			'id_bol_category_in_db',
			'group'
		]);
		// Optimize productData
		if (!productData.margin_factor_cz_web_be) {
			productData.margin_factor_cz_web_be = '0';
		}
		if (!productData.margin_factor_cz_web_nl) {
			productData.margin_factor_cz_web_nl = '0';
		}
		if (!productData.netto_profit_amount_cz_be) {
			productData.netto_profit_amount_cz_be = '0';
		}
		if (!productData.netto_profit_amount_cz_nl) {
			productData.netto_profit_amount_cz_nl = '0';
		}
		if (!productData.margin_factor_dropshipping) {
			productData.margin_factor_dropshipping = '0';
		}
		if (!productData.margin_factor_wholesale) {
			productData.margin_factor_wholesale = '0';
		}
		if (!productData.vat_procent) {
			productData.vat_procent = '0';
		}
		if (!productData.margin_factor_bol_be) {
			productData.margin_factor_bol_be = '0';
		}
		if (!productData.margin_factor_bol_nl) {
			productData.margin_factor_bol_nl = '0';
		}
		if (!productData.shipping_cost_ex_vat_bol_be) {
			productData.shipping_cost_ex_vat_bol_be = '0';
		}
		if (!productData.shipping_cost_ex_vat_bol_nl) {
			productData.shipping_cost_ex_vat_bol_nl = '0';
		}
		if (!productData.total_cost_ex_vat_bol_be) {
			productData.total_cost_ex_vat_bol_be = '0';
		}
		if (!productData.netto_profit_amount_bol_nl) {
			productData.netto_profit_amount_bol_nl = '0';
		}
		if (!productData.netto_profit_amount_bol_be) {
			productData.netto_profit_amount_bol_be = '0';
		}
		if (!productData.total_cost_ex_vat_bol_nl) {
			productData.total_cost_ex_vat_bol_nl = '0';
		}
		if (!productData.stock_start) {
			productData.stock_start = '0';
		}
		if (!productData.stock_real) {
			productData.stock_real = '0';
		}
		if (!productData.stock_accounting) {
			productData.stock_accounting = '0';
		}
		if (!productData.active) {
			productData.active = '0';
		}
		if (!productData.active_bol_be) {
			productData.active_bol_be = '0';
		}
		if (!productData.active_bol_nl) {
			productData.active_bol_nl = '0';
		}
		if (productData.id_stand_category == 0) {
			productData.id_stand_category = '2';
		}

		const product_pic = request.file('product_pic', {
			maxSize: '2mb',
			allowedExtension: [ 'png', 'jpg', 'jpeg', 'gif' ]
		});
		// Save Record
		if (params.id === '0') {
			var product = new Product();
		} else {
			var product = await Product.find(params.id);
			var oldBolBe = product.active_bol_be;
			var oldBolNl = product.active_bol_nl;
		}
		try {
			product.merge(productData);
			await product.save();
		} catch (e) {
			console.log('there was an error on saving Product Data');
			console.log(e);
		} finally {
			if (params.id === '0') {
				// Correct Slug with product id and resave
				product.slug_nl = product.id + '-' + product.slug_nl;
			}
			// add groups active fields and delete non active
			// 1) Loop over productGroup Array
			const tempVar = request.only([ 'group' ]).group;
			if (tempVar) {
				if (tempVar.constructor === Array) {
					var activeGroupArray = tempVar;
				} else {
					var activeGroupArray = new Array(tempVar);
				}
			}
			const productGroupsArray = (await ProductGroup.all()).toJSON();
			return productGroupsArray;
			var productGroupsArrayLength = productGroupsArray.length;
			for (let i = 0; i < productGroupsArrayLength; i++) {
				const productGroupId = productGroupsArray[i].id;
				let productGroupParentId = productGroupsArray[i].id_parent;
				// if there are marekd groups for this product
				if (activeGroupArray) {
					const currentActiveGroup = await ProductProductGroup.query()
						.where('product_id', '=', product.id)
						.where('product_group_id', '=', productGroupId)
						.first();
					const active = activeGroupArray.includes(productGroupId.toString());
					// is there a active record in product FORM tree for this group ?
					if (active) {
						// if there is a record in the productproductGroups table -> is ok -> do nothing
						// If there is no record create one !
						if (!currentActiveGroup) {
							// Make a new record in productproductGroups table
							const productProductGroup = new ProductProductGroup();
							productProductGroup.product_id = product.id;
							productProductGroup.product_group_id = productGroupId;
							await productProductGroup.save();
							// Set Parents also to ACTIVE
						}
						// Check for parent Records and make them if needed
						if (productGroupParentId) {
							const currentActiveParentGroup = await ProductProductGroup.query()
								.where('product_id', '=', product.id)
								.where('product_group_id', '=', productGroupParentId)
								.first();
							// create Parent records
							if (!currentActiveParentGroup) {
								while (productGroupParentId) {
									const productProductGroup = new ProductProductGroup();
									productProductGroup.product_id = product.id;
									productProductGroup.product_group_id = productGroupParentId;
									await productProductGroup.save();
									// Search if parent has parent ?
									const productGroup = await ProductGroup.find(productGroupParentId);
									productGroupParentId = productGroup.id_parent;
								}
							}
						}
					} else {
						// If no record in Product form Tree check if there a record exist in PPG if Yes delete it !
						if (currentActiveGroup) {
							await currentActiveGroup.delete();
						}
					}
				} else {
					// If totaly no tree in form delete all in PPG for this product
					const currentActiveGroup = await ProductProductGroup.query()
						.where('product_id', '=', product.id)
						.delete();
				}
			}
			// Add Stand_category to product groupGroup if not already added
			const standCatExist = await ProductProductGroup.query()
				.where('product_id', product.id)
				.where('product_group_id', productData.id_stand_category)
				.first();
			if (!standCatExist) {
				const productProductGroup = new ProductProductGroup();
				productProductGroup.product_id = product.id;
				productProductGroup.product_group_id = productData.id_stand_category;
				await productProductGroup.save();
			}

			// Get images and move them to the img-prd map
			// If PRODUCT_PIC is changed (then clientName is name of new downloaded image on client site)

			if (product_pic.clientName) {
				const fileName = 'product-' + product.id + '-pic_1.' + product_pic.subtype;
				// Check if file not already exist and delete it before copuying the new one
				fs.exists(Helpers.publicPath('/img-prd/img-prd-' + product.id + '/' + fileName), function(exists) {
					if (exists) {
						fs.unlinkSync(Helpers.publicPath('/img-prd/img-prd-' + product.id + '/' + fileName));
					}
				});
				await product_pic.move(Helpers.publicPath('/img-prd/img-prd-' + product.id), { name: fileName });
				if (!product_pic.moved()) {
					return product_pic.error();
				}
				product.product_pic = appRoot + '/img-prd/img-prd-' + product.id + '/' + fileName;
			}
			await product.save();

			// Set product in PRESTASHOP
			if (Env.get('APP_PRESTA')) {
				const productPath = product.product_pic;
				const cutLength = (appRoot + '/img-prd/img-prd-' + product.id + '/').length;
				const imageName = productPath.substring(cutLength);
				if (product.active == 1) {
					const prestaApi = new PrestaApi();
					await prestaApi.setProduct(product.id);
					// If Image changed in Zawasoft kopie to PRESTASHOP
					if (product_pic.clientName) {
						console.log('IN CONTROLLER IMAGE GEWIJZIGD CALL PRESTA API !!!!!!!!!!');
						await prestaApi.setProductPic(product.id, imageName);
					} else {
						// If not image NOT changed in Zawa -> check if image exist in zawa and not in Presta. If not -> create in presta
						console.log('IN CONTROLLER IMAGE NIET GEWIJZIGD MAAR NIET IN PRESTA CALL API !!!!!!!!!!!!!!');
						const ps_image = ps_Image
							.query()
							.where('id_product', product.id)
							.where('cover', '=', 1)
							.fetch();
						if (!ps_image.length > 0 && product.product_pic) {
							// There is a image in Zawa and not in Presta
							await prestaApi.setProductPic(product.id, imageName);
						}
					}
				} else {
					// If flag active in Zawa is not set -> set stock to 0 in presta !
					const prestaApi = new PrestaApi();
					await prestaApi.setProductStock(product.id, 0);
				}
			}

			// Set product info in BOL.BE
			const bolApiBe = new BolApi(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
			if (product.active_bol_be == 1 && product.ean13 != '') {
				var result = await bolApiBe.setProductBe(product.id);
			} else if (product.active_bol_be == 0 && product.ean13 != '' && oldBolBe == 1) {
				var result = await bolApiBe.delProduct(product.id);
			}
			if (product.active_bol_be == 1 && result == '202') {
				session.flash({
					notification: {
						type: 'success',
						message2: 'Transfer naar Bol - BE was successvol'
					}
				});
			} else if (product.active_bol_be == 1 && result != undefined) {
				if (product.ean13) {
					session.flash({
						alert: {
							type: 'danger',
							message: 'Probleem bij transfer naar BOL - BE (ErrorCode : ' + result + ')'
						}
					});
				}
			}

			// Set product info in BOL.NL
			const bolApiNl = new BolApi(Env.get('BOL_NL_PUBLIC_KEY'), Env.get('BOL_NL_PRIVATE_KEY'));
			if (product.active_bol_nl == 1 && product.ean13 != '') {
				var result = await bolApiNl.setProductNl(product.id);
			} else if (product.active_bol_nl == 0 && product.ean13 != '' && oldBolNl == 1) {
				var result = await bolApiNl.delProduct(product.id);
			}
			if (product.active_bol_nl == 1 && result == '202') {
				session.flash({
					notification: {
						type: 'success',
						message3: 'Transfer naar Bol - NL was successvol'
					}
				});
			} else if (product.active_bol_nl == 1 && result != undefined) {
				if (product.ean13) {
					session.flash({
						alert: {
							type: 'danger',
							message3: 'Probleem bij transfer naar BOL - NL (ErrorCode : ' + result + ')'
						}
					});
				}
			}

			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('products.product_success')
				}
			});

			return response.route('admin-product-edit', { id: product.id });
		}
	}
}

// Function to convert flat file (id, id_parent to tree array with childs)
function makeTree(arr, parentid) {
	let output = [];
	for (const obj of arr) {
		if (obj.id_parent == parentid) {
			var childs = makeTree(arr, obj.id);
			if (childs.length) {
				obj.childs = childs;
			}
			output.push(obj);
		}
	}
	return output;
}

module.exports = ProductController;
