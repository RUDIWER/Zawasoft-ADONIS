'use strict';
const Product = use('App/Models/Product');
const ProductBrand = use('App/Models/ProductBrand');
const ProductGroup = use('App/Models/ProductGroup');
const ProductProductGroup = use('App/Models/ProductProductGroup');
const ps_Product = use('App/Models/ps_Product');
const ps_ProductShop = use('App/Models/ps_ProductShop');
const ps_ProductLang = use('App/Models/ps_ProductLang');
const ps_StockAvailable = use('App/Models/ps_StockAvailable');
const ps_Manufacturer = use('App/Models/ps_Manufacturer');
const ps_ManufacturerLang = use('App/Models/ps_ManufacturerLang');
const ps_ManufacturerShop = use('App/Models/ps_ManufacturerShop');
const ps_Category = use('App/Models/ps_Category');
const ps_CategoryProduct = use('App/Models/ps_CategoryProduct');
const ps_CategoryLang = use('App/Models/ps_CategoryLang');
const ps_CategoryGroup = use('App/Models/ps_CategoryGroup');
const ps_CategoryShop = use('App/Models/ps_CategoryShop');
const ps_Group = use('App/Models/ps_Group');
const ps_Image = use('App/Models/ps_Image');
const ps_Supplier = use('App/Models/ps_Supplier');
const ps_SupplierLang = use('App/Models/ps_SupplierLang');
const ps_SupplierShop = use('App/Models/ps_SupplierShop');
const Supplier = use('App/Models/Supplier');
const request = require('request');
const fs = require('fs');
const Helpers = use('Helpers');
const Env = use('Env');

class PrestaApi {
	constructor() {}

	async setProduct(id) {
		const zawaProduct = await Product.find(id);
		// 1) Create || modify PS_PRODUCT
		let ps_product = await ps_Product.find(id);
		if (!ps_product) {
			ps_product = new ps_Product();
		}
		ps_product.id_product = zawaProduct.id;
		ps_product.id_supplier = zawaProduct.id_supplier;
		if (zawaProduct.id_brand) {
			ps_product.id_manufacturer = zawaProduct.id_brand;
		}
		ps_product.id_category_default = zawaProduct.id_stand_category;
		if (zawaProduct.vat_procent == 12) {
			ps_product.id_tax_rules_group = 2;
		} else if (zawaProduct.vat_procent == 6) {
			ps_product.id_tax_rules_group = 3;
		} else {
			ps_product.id_tax_rules_group = 1;
		}
		ps_product.on_sale = 0;
		ps_product.online_only = 0;
		ps_product.ean13 = zawaProduct.ean13;
		ps_product.isbn = '';
		ps_product.upc = '';
		ps_product.ecotax = 0;
		ps_product.quantity = zawaProduct.stock_real;
		ps_product.minimal_quantity = 1;
		ps_product.low_stock_threshold = 0;
		ps_product.low_stock_alert = 0;
		ps_product.price = zawaProduct.sp_ex_vat_cz;
		ps_product.wholesale_price = 0;
		ps_product.unity = ' ';
		ps_product.unit_price_ratio = 0;
		ps_product.additional_shipping_cost = 0;
		ps_product.reference = zawaProduct.id;
		ps_product.supplier_reference = zawaProduct.id_product_supplier;
		ps_product.location = '';
		ps_product.width = 0;
		ps_product.height = 0;
		ps_product.depth = 0;
		ps_product.weight = 0;
		ps_product.out_of_stock = 2;
		ps_product.additional_delivery_times = 1;
		ps_product.quantity_discount = 0;
		ps_product.customizable = 0;
		ps_product.uploadable_files = 0;
		ps_product.text_fields = 0;
		ps_product.active = 1;
		ps_product.redirect_type = '404';
		ps_product.id_type_redirected = 0;
		ps_product.available_for_order = 1;
		ps_product.available_date = null;
		ps_product.show_condition = 0;
		ps_product.condition = 'new';
		ps_product.show_price = 1;
		ps_product.indexed = 0;
		ps_product.visibility = 'both';
		ps_product.cache_is_pack = 0;
		ps_product.cache_has_attachments = 0;
		ps_product.is_virtual = 0;
		ps_product.cache_default_attribute = 0;
		ps_product.advanced_stock_management = 0;
		ps_product.pack_stock_type = 3;
		ps_product.state = 1;
		await ps_product.save();

		// 2) Create || modify PS_PRODUCT_LANG
		let ps_product_lang = await ps_ProductLang.find(id);
		if (!ps_product_lang) {
			ps_product_lang = new ps_ProductLang();
		}
		ps_product_lang.id_product = zawaProduct.id;
		ps_product_lang.id_shop = 1;
		ps_product_lang.id_lang = 1;
		ps_product_lang.description = zawaProduct.descr_long_nl;
		ps_product_lang.description_short = zawaProduct.descr_short_nl;
		ps_product_lang.link_rewrite = zawaProduct.slug_nl;
		ps_product_lang.meta_description = zawaProduct.meta_descr_nl;
		ps_product_lang.meta_keywords = zawaProduct.meta_keywords_nl;
		ps_product_lang.meta_title = zawaProduct.meta_title_nl;
		ps_product_lang.name = zawaProduct.name_nl;
		ps_product_lang.available_now = '';
		ps_product_lang.available_later = '';
		ps_product_lang.delivery_in_stock = '';
		ps_product_lang.delivery_out_stock = '';
		await ps_product_lang.save();

		// 3) Create || modify PS_PRODUCT_SHOP
		let ps_product_shop = await ps_ProductShop.find(id);
		if (!ps_product_shop) {
			ps_product_shop = new ps_ProductShop();
		}
		ps_product_shop.id_product = zawaProduct.id;
		ps_product_shop.id_shop = 1;
		ps_product_shop.id_category_default = zawaProduct.id_stand_category;
		if (zawaProduct.vat_procent == 12) {
			ps_product.id_tax_rules_group = 2;
		} else if (zawaProduct.vat_procent == 6) {
			ps_product_shop.id_tax_rules_group = 3;
		} else {
			ps_product_shop.id_tax_rules_group = 1;
		}
		ps_product_shop.on_sale = 0;
		ps_product_shop.online_only = 0;
		ps_product_shop.ecotax = 0;
		ps_product_shop.minimal_quantity = 1;
		ps_product_shop.low_stock_threshold = 0;
		ps_product_shop.low_stock_alert = 0;
		ps_product_shop.price = zawaProduct.sp_ex_vat_cz;
		ps_product_shop.wholesale_price = 0;
		ps_product_shop.unity = ' ';
		ps_product_shop.unit_price_ratio = 0;
		ps_product_shop.additional_shipping_cost = 0;
		ps_product_shop.customizable = 0;
		ps_product_shop.uploadable_files = 0;
		ps_product_shop.text_fields = 0;
		ps_product_shop.active = 1;
		ps_product_shop.redirect_type = '404';
		ps_product_shop.id_type_redirected = 0;
		ps_product_shop.available_for_order = 1;
		ps_product_shop.available_date = null;
		ps_product_shop.show_condition = 0;
		ps_product_shop.condition = 'new';
		ps_product_shop.show_price = 1;
		ps_product_shop.indexed = 0;
		ps_product_shop.visibility = 'both';
		ps_product_shop.cache_default_attribute = 0;
		ps_product_shop.advanced_stock_management = 0;
		ps_product_shop.pack_stock_type = 3;
		await ps_product_shop.save();

		// 4) Create || modify PS_STOCK_AVAILABLE
		let ps_stock_available_data = (await ps_StockAvailable.query().where('id_product', id).fetch()).toJSON();
		if (ps_stock_available_data.length > 0) {
			console.log(ps_stock_available_data[0].id_stock_available);
			var ps_stock_available = await ps_StockAvailable.find(ps_stock_available_data[0].id_stock_available);
		}
		if (!ps_stock_available) {
			ps_stock_available = new ps_StockAvailable();
		}
		ps_stock_available.id_product = zawaProduct.id;
		ps_stock_available.id_product_attribute = 0;
		ps_stock_available.id_shop = 1;
		ps_stock_available.id_shop_group = 0;
		ps_stock_available.quantity = zawaProduct.stock_real;
		ps_stock_available.physical_quantity = zawaProduct.stock_real;
		ps_stock_available.reserved_quantity = 0;
		ps_stock_available.depends_on_stock = 0;
		ps_stock_available.out_of_stock = 0;
		await ps_stock_available.save();
		// 5) Create || modify PS_CATEGORY_PRODUCT;
		const product_product_groups = (await ProductProductGroup.query().where('product_id', id).fetch()).toJSON();
		console.log(product_product_groups);
		// 5.1 delete all product_groups for this id in prestashop.
		await ps_CategoryProduct.query().where('id_product', id).delete();
		if (product_product_groups.length > 0) {
			const length = product_product_groups.length;
			for (let i = 0; i < length; i++) {
				const product_product_groupData = product_product_groups[i];
				const ps_category_product = new ps_CategoryProduct();
				ps_category_product.id_product = zawaProduct.id;
				ps_category_product.id_category = product_product_groupData.product_group_id;
				ps_category_product.position = 0;
				await ps_category_product.save();
			}
		}
	}

	async setProductStock(id, quantity) {
		// modify PS_STOCK_AVAILABLE
		let ps_stock_available_data = (await ps_StockAvailable.query().where('id_product', id).fetch()).toJSON();
		if (ps_stock_available_data.length > 0) {
			console.log(ps_stock_available_data[0].id_stock_available);
			var ps_stock_available = await ps_StockAvailable.find(ps_stock_available_data[0].id_stock_available);
		}
		if (ps_stock_available) {
			ps_stock_available.id_product = id;
			ps_stock_available.id_product_attribute = 0;
			ps_stock_available.id_shop = 1;
			ps_stock_available.id_shop_group = 0;
			ps_stock_available.quantity = quantity;
			ps_stock_available.physical_quantity = quantity;
			ps_stock_available.reserved_quantity = 0;
			ps_stock_available.depends_on_stock = 0;
			ps_stock_available.out_of_stock = 0;
			await ps_stock_available.save();
		}
		// modify PS_PRODUCT_SHOP
		let ps_product_shop = await ps_ProductShop.find(id);
		if (ps_product_shop) {
			ps_product_shop.active = 0;
			await ps_product_shop.save();
		}
		// modify PS_PRODUCT
		let ps_product = await ps_Product.find(id);
		if (ps_product) {
			ps_product.active = 0;
			ps_product.quantity = quantity;
			await ps_product.save();
		}
	}

	async setProductPic(id, imageName) {
		// Load picture to Prestashop server
		const coverImage = (await ps_Image.query().where('id_product', id).where('cover', '=', '1').fetch()).toJSON();
		// If cover image in prestashop for this product then delete it
		if (coverImage.length > 0) {
			const id_image = coverImage[0].id_image;
			console.log('IN PRESTA API : ER IS REEDS COVER IMAGE IN PRESTA MET ID : ' + id_image);
			const url = Env.get('PRESTA_PRODUCT_IMAGE_PATH') + id + '/' + id_image;
			console.log('url is:' + url);
			await request
				.delete(url)
				.on('response', function(response) {
					console.log('IN API : Delete gelukt : ' + response.statusCode); // 200
				})
				.on('error', function(err) {
					console.log('IN API : Error on delete : ' + err);
				});
		}
		console.log('IN API NA DELETE : GEEN IMAGE IN PRESTA');
		const url = Env.get('PRESTA_PRODUCT_IMAGE_PATH') + id;
		console.log('url is:' + url);
		const localPicPath = Helpers.appRoot() + '/public/img-prd/img-prd-' + id + '/' + imageName;
		const picData = { image: fs.createReadStream(localPicPath) };
		console.log('picdata is :' + picData);
		await request.post({ url: url, formData: picData }, function(error, response, body) {
			console.log('error:', error);
			console.log('Response:', response && response.statusCode);
			console.log('body:', body);
		});
	}

	async setSupplier(id) {
		const zawaSupplier = await Supplier.find(id);
		// 3) Create || modify PS_SUPPLIER
		let ps_supplier = await ps_Supplier.find(id);
		if (!ps_supplier) {
			ps_supplier = new ps_Supplier();
		}
		ps_supplier.id_supplier = zawaSupplier.id;
		ps_supplier.name = zawaSupplier.company;
		ps_supplier.active = 1;
		await ps_supplier.save();
		// 2) Create || modify PS_SUPPLIER_LANG
		let ps_supplierLang = await ps_SupplierLang.find(id);
		if (!ps_supplierLang) {
			ps_supplierLang = new ps_SupplierLang();
		}
		ps_supplierLang.id_supplier = zawaSupplier.id;
		ps_supplierLang.id_lang = 1;
		ps_supplierLang.description = zawaSupplier.description;
		ps_supplierLang.meta_title = zawaSupplier.meta_title;
		ps_supplierLang.meta_keywords = zawaSupplier.meta_keywords;
		ps_supplierLang.meta_description = zawaSupplier.meta_description;
		await ps_supplierLang.save();
		// 3) Create || modify PS_SUPPLIER_SHOP
		let ps_supplierShop = await ps_SupplierShop.find(id);
		if (!ps_supplierShop) {
			ps_supplierShop = new ps_SupplierShop();
		}
		ps_supplierShop.id_supplier = zawaSupplier.id;
		ps_supplierShop.id_shop = 1;
		await ps_supplierShop.save();
	}

	async setBrand(id) {
		const zawaBrand = await ProductBrand.find(id);
		// 1) Create || modify PS_MANUFACTURER
		let ps_manufacturer = await ps_Manufacturer.find(id);
		if (!ps_manufacturer) {
			ps_manufacturer = new ps_Manufacturer();
		}
		ps_manufacturer.id_manufacturer = zawaBrand.id;
		ps_manufacturer.name = zawaBrand.name_nl;
		ps_manufacturer.active = 1;
		await ps_manufacturer.save();
		// 2) Create || modify PS_MANUFACTURER_LANG
		let ps_manufacturerLang = await ps_ManufacturerLang.find(id);
		if (!ps_manufacturerLang) {
			ps_manufacturerLang = new ps_ManufacturerLang();
		}
		ps_manufacturerLang.id_manufacturer = zawaBrand.id;
		ps_manufacturerLang.id_lang = 1;
		ps_manufacturerLang.description = '';
		ps_manufacturerLang.short_description = zawaBrand.short_description;
		ps_manufacturerLang.meta_title = zawaBrand.meta_title;
		ps_manufacturerLang.meta_keywords = zawaBrand.meta_keywords;
		ps_manufacturerLang.meta_description = zawaBrand.meta_description;
		await ps_manufacturerLang.save();
		// 3) Create || modify PS_MANUFACTURER_SHOP
		let ps_manufacturerShop = await ps_ManufacturerShop.find(id);
		if (!ps_manufacturerShop) {
			ps_manufacturerShop = new ps_ManufacturerShop();
		}
		ps_manufacturerShop.id_manufacturer = zawaBrand.id;
		ps_manufacturerShop.id_shop = 1;
		await ps_manufacturerShop.save();
	}

	async setProductGroup(id) {
		const zawaGroup = await ProductGroup.find(id);
		// 1) Create || modify PS_CATEGORY
		let ps_category = await ps_Category.find(id);
		if (!ps_category) {
			ps_category = new ps_Category();
		}
		ps_category.id_category = zawaGroup.id;
		ps_category.id_parent = zawaGroup.id_parent;
		ps_category.id_shop_default = 1;
		ps_category.level_depth = zawaGroup.level_depth;
		ps_category.nleft = 0;
		ps_category.nright = 0;
		ps_category.active = zawaGroup.active;
		ps_category.position = zawaGroup.position;
		ps_category.is_root_category = 0;
		try {
			await ps_category.save();
		} finally {
			await request('http://95.179.152.34/fixCategory.php', function(error) {
				console.log(error);
			});
			// 2) Create || modify PS_CATEGORY_GROUP
			const ps_groups = (await ps_Group.all()).toJSON();
			const groupsLength = ps_groups.length;
			for (let i = 0; i < groupsLength; i++) {
				const groupData = ps_groups[i];
				let ps_category_group = (await ps_CategoryGroup
					.query()
					.where('id_category', ps_category.id_category)
					.where('id_group', groupData.id_group)
					.fetch()).toJSON();
				if (ps_category_group.length == 0) {
					ps_category_group = new ps_CategoryGroup();
					ps_category_group.id_category = ps_category.id_category;
					ps_category_group.id_group = groupData.id_group;
					await ps_category_group.save();
				}
			}
			// 3) Create || modify PS_CATEGORY_LANG
			let ps_category_lang = await ps_CategoryLang.find(id);
			if (!ps_category_lang) {
				ps_category_lang = new ps_CategoryLang();
			}
			ps_category_lang.id_category = zawaGroup.id;
			ps_category_lang.id_shop = 1;
			ps_category_lang.id_lang = 1;
			ps_category_lang.name = zawaGroup.name_nl;
			ps_category_lang.description = zawaGroup.descr_nl;
			ps_category_lang.link_rewrite = zawaGroup.slug;
			ps_category_lang.meta_title = zawaGroup.meta_title_nl;
			ps_category_lang.meta_keywords = zawaGroup.meta_keywords_nl;
			ps_category_lang.meta_description = zawaGroup.meta_descr_nl;
			await ps_category_lang.save();
			// 4) Create || modify PS_CATEGORY_SHOP
			let ps_category_shop = await ps_CategoryShop.find(id);
			if (!ps_category_shop) {
				ps_category_shop = new ps_CategoryShop();
			}
			ps_category_shop.id_category = zawaGroup.id;
			ps_category_shop.id_shop = 1;
			ps_category_shop.position = 0;
			await ps_category_shop.save();
		}
	}
}

module.exports = PrestaApi;
