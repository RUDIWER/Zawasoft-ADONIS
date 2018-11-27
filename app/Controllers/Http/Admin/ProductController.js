'use strict';

const Product = use('App/Models/Product');
const Supplier = use('App/Models/Supplier');
const Param = use('App/Models/Param');
const StockPlace = use('App/Models/StockPlace');
const ProductGroup = use('App/Models/ProductGroup');
const ProductBrand = use('App/Models/ProductBrand');
const ProductProductGroup = use('App/Models/ProductProductGroup');
const BolCategory = use('App/Models/BolCategory');
const Env = use('Env');
const BolApi = use('App/ZawaClasses/BolApi.js');
const Helpers = use('Helpers');
const fs = require('fs');

class ProductController {
	async index({ view }) {
		const products = (await Product.all()).toJSON();
		return view.render('admin.products.productList', { products });
	}

	async create({ view }) {
		const isNew = 1;
		const product = await new Product();
		const suppliers = (await Supplier.all()).toJSON();
		const brands = (await ProductBrand.all()).toJSON();
		const param = await Param.find(1);
		const productGroupsFlat = (await ProductGroup.all()).toJSON();
		//loop over array and add field active
		const productGroups = makeTree(productGroupsFlat, 0); // See function on bottom
		const bolCategories = (await BolCategory.all()).toJSON();
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
			bolCategories,
			stockPlace1,
			stockPlace2,
			stockPlace3,
			stockPlace4,
			stockPlace5
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const product = await Product.find(params.id);
		const suppliers = (await Supplier.all()).toJSON();
		const brands = (await ProductBrand.all()).toJSON();
		const param = await Param.find(1);
		const array = (await ProductGroup.all()).toJSON();
		const productGroups = makeTree(array, 0); // See functon on bottom
		const bolCategories = (await BolCategory.all()).toJSON();
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
			brands,
			bolCategories,
			activeGroups,
			stockPlace1,
			stockPlace2,
			stockPlace3,
			stockPlace4,
			stockPlace5
		});
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
		//	return productData;
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

			// Set product info in BOL.BE
			const bolApiBe = new BolApi(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
			if (product.active_bol_be == 1 && product.ean13 != '') {
				var result = await bolApiBe.setProduct(product.id);
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
				var result = await bolApiNl.setProduct(product.id);
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

			//return response.redirect('back');
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
