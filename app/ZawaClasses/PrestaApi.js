'use strict';
const Product = use('App/Models/Product');
const ProductBrand = use('App/Models/ProductBrand');
const ps_Product = use('App/Models/ps_Product');
const ps_Manufacturer = use('App/Models/ps_Manufacturer');
const ps_ManufacturerLang = use('App/Models/ps_ManufacturerLang');
const ps_ManufacturerShop = use('App/Models/ps_ManufacturerShop');
const ps_Supplier = use('App/Models/ps_Supplier');
const ps_SupplierLang = use('App/Models/ps_SupplierLang');
const ps_SupplierShop = use('App/Models/ps_SupplierShop');
const Supplier = use('App/Models/Supplier');

class PrestaApi {
	constructor() {}

	async setProduct(id) {
		const zawaProduct = await Product.find(id);
		const psProduct = new ps_Product();
		psProduct.id_product = zawaProduct.id;
		psProduct.id_supplier = zawaProduct.id_supplier;
		if(zawaProduct.id_brand){psProduct.id_manufacturer = zawaProduct.id_brand}
	}	


	async setSupplier(id) {
		const zawaSupplier = await Supplier.find(id);
		// 1) Create || modify PS_SUPPLIER
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
		ps_manufacturerLang.description = "";
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
}

module.exports = PrestaApi;
