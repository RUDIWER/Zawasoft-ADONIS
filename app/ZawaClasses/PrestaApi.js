'use strict';
const Product = use('App/Models/Product');
const ProductBrand = use('App/Models/ProductBrand');
const ps_Product = use('App/Models/ps_Product');
const ps_Manufacturer = use('App/Models/ps_Manufacturer');
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
		psProduct.id_manufacterer;
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
		ps_supplier.save();
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
		ps_supplierLang.save();
		// 3) Create || modify PS_SUPPLIER_SHOP
		let ps_supplierShop = await ps_SupplierShop.find(id);
		if (!ps_supplierShop) {
			ps_supplierShop = new ps_SupplierShop();
		}
		ps_supplierShop.id_supplier = zawaSupplier.id;
		ps_supplierShop.id_shop = 1;
		ps_supplierShop.save();
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
		ps_manufacturer.save();
	}
}

module.exports = PrestaApi;
