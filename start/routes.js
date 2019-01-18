'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route');

// Home routes
Route.get('/', 'HomeController.index').as('home');

// Authentication Registration & Login & logout
Route.get('register', 'Auth/RegisterController.showRegisterForm').as('register').middleware([ 'authenticated' ]);
Route.post('register', 'Auth/RegisterController.register')
	.validator('storeUser')
	.as('register')
	.middleware([ 'authenticated' ]);
Route.get('login', 'Auth/LoginController.showLoginForm').middleware([ 'authenticated' ]);
Route.post('login', 'Auth/LoginController.login').as('login');
Route.get('logout', 'Auth/LogoutController.logout').as('logout').middleware([ 'auth' ]);

Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm');
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail');
Route.get('password/reset/:token', 'Auth/PasswordResetController.showresetForm');
Route.post('password/reset', 'Auth/PasswordResetController.reset');

// Profile
Route.get('profile/create', 'Profile/ProfileController.create').middleware([ 'auth' ]);
Route.get('profile/edit', 'Profile/ProfileController.edit').middleware([ 'auth' ]);
Route.post('profile', 'Profile/ProfileController.store').validator('storeProfile').middleware([ 'auth' ]).as('profile');

// Change locale route
Route.get('/locale/:locale', 'Locale/LocaleController.changeLocale').as('locale');

//ADMIN PANEL
Route.get('admin', 'Admin/HomeController.index').as('admin').middleware([ 'auth' ]);
Route.get('admin/bol/calculate/ean/:ean/id/:id', 'Admin/HomeController.getEan').middleware([ 'auth' ]);

// PARAM
Route.get('admin/param', 'Admin/ParamController.showParamForm').as('admin-param').middleware([ 'auth' ]);
Route.post('/admin/param/save', 'Admin/ParamController.save')
	.validator('storeParam')
	.as('admin-param-save')
	.middleware([ 'auth' ]);
Route.get('admin/bulk-changes', 'Admin/ParamController.showBulkForm').as('admin-bulk-changes').middleware([ 'auth' ]);
Route.post('/admin/bulk-changes/save', 'Admin/ParamController.bulkSave')
	.validator('storeBulk')
	.as('admin-bulk-changes-save')
	.middleware([ 'auth' ]);

// PRODUCT
Route.get('admin/products', 'Admin/ProductController.index').as('admin-products').middleware([ 'auth' ]);
Route.get('admin/products/no-stock', 'Admin/ProductController.noStock')
	.as('admin-products-no-stock')
	.middleware([ 'auth' ]);
Route.get('admin/products/no-ean', 'Admin/ProductController.noEan').as('admin-products-no-ean').middleware([ 'auth' ]);
Route.get('admin/products/not-in-bol-be', 'Admin/ProductController.notBolBe')
	.as('admin-products-not-in-bol-be')
	.middleware([ 'auth' ]);
Route.get('admin/products/not-in-bol-nl', 'Admin/ProductController.notBolNl')
	.as('admin-products-not-in-bol-nl')
	.middleware([ 'auth' ]);

Route.get('admin/product/edit/:id', 'Admin/ProductController.edit').as('admin-product-edit').middleware([ 'auth' ]);
Route.get('admin/product/modal/:id', 'Admin/ProductController.modal').as('admin-product-modal').middleware([ 'auth' ]);

Route.get('admin/product/create', 'Admin/ProductController.create').as('admin-product-create').middleware([ 'auth' ]);
Route.post('/admin/product/save/:id', 'Admin/ProductController.save')
	.as('admin-product-save')
	.validator('storeProduct')
	.middleware([ 'auth' ]);

// PRODUCT GROUPS
Route.get('admin/product-parent-groups', 'Admin/ProductGroupController.index')
	.as('admin-product-parent-groups')
	.middleware([ 'auth' ]);
Route.get('admin/product-child-groups/:id', 'Admin/ProductGroupController.childs')
	.as('admin-product-parent-childs')
	.middleware([ 'auth' ]);
Route.get('admin/product-group/create/:parentId', 'Admin/ProductGroupController.create')
	.as('admin-product-group-create')
	.middleware([ 'auth' ]);
Route.get('admin/product-group/edit/:parentId/:id', 'Admin/ProductGroupController.edit')
	.as('admin-product-group-edit')
	.middleware([ 'auth' ]);

Route.post('/admin/product-group/save/:parentId/:id', 'Admin/ProductGroupController.save')
	.as('admin-product-group-save')
	.validator('storeProductGroup')
	.middleware([ 'auth' ]);

// BRANDS
Route.get('admin/brands', 'Admin/ProductBrandController.index').as('admin-brands').middleware([ 'auth' ]);
Route.get('admin/brand/create', 'Admin/ProductBrandController.create').as('admin-brand-create').middleware([ 'auth' ]);
Route.get('admin/brand/edit/:id', 'Admin/ProductBrandController.edit').as('admin-brand-edit').middleware([ 'auth' ]);
Route.post('/admin/brand/save/:id', 'Admin/ProductBrandController.save')
	.as('admin-brand-save')
	.validator('storeBrand')
	.middleware([ 'auth' ]);

// PRODUCT REPORTS
Route.get('admin/products/reports/stock-report', 'Admin/ProductReportController.stockReport')
	.as('admin-products-reports-stockreport')
	.middleware([ 'auth' ]);

// OLD PRODUCTS
Route.get('admin/old-products', 'Admin/OldProductController.index').as('admin-old-products').middleware([ 'auth' ]);
Route.get('admin/old-products/copy/:id', 'Admin/OldProductController.copy')
	.as('admin-old-product-copy')
	.middleware([ 'auth' ]);
Route.get('admin/old-products/del/:id', 'Admin/OldProductController.delete')
	.as('admin-old-product-copy')
	.middleware([ 'auth' ]);

// CUSTOMERS
Route.get('admin/customers', 'Admin/CustomerController.index').as('admin-customers').middleware([ 'auth' ]);
Route.get('admin/customer/edit/:id', 'Admin/CustomerController.edit').as('admin-customer-edit').middleware([ 'auth' ]);
Route.get('admin/customer/create', 'Admin/CustomerController.create')
	.as('admin-customer-create')
	.middleware([ 'auth' ]);
// Save NEW CUSTOMER (Validation with address fields)
Route.post('/admin/customer/save/new/:id', 'Admin/CustomerController.save')
	.as('admin-customer-save')
	.validator('storeCustomerAddress')
	.middleware([ 'auth' ]);
// save existing CUSTOMER (Validation without address fields)
Route.post('/admin/customer/save/:id', 'Admin/CustomerController.save')
	.as('admin-customer-save')
	.validator('storeCustomer')
	.middleware([ 'auth' ]);

// CUSTOMER ADDRESS

Route.get('admin/customer/address/create', 'Admin/CustomerController.addressCreate')
	.as('admin-customer-address-create')
	.middleware([ 'auth' ]);
Route.get('admin/customer/address/edit/:id', 'Admin/CustomerController.addressEdit')
	.as('admin-customer-address-edit')
	.middleware([ 'auth' ]);
Route.post('/admin/customer/address/save', 'Admin/CustomerController.addressSave')
	.as('admin-customer-address-save')
	.middleware([ 'auth' ]);

Route.get('/admin/customer/address/get/:id', 'Admin/CustomerController.getAddresses')
	.as('admin-customer-address-get')
	.middleware([ 'auth' ]);

Route.post('/admin/customer/address/delete', 'Admin/CustomerController.addressDelete')
	.as('admin-customer-address-delete')
	.middleware([ 'auth' ]);

// SUPPLIERS
Route.get('admin/suppliers', 'Admin/SupplierController.index').as('admin-suppliers').middleware([ 'auth' ]);
Route.get('admin/supplier/create', 'Admin/SupplierController.create')
	.as('admin-supplier-create')
	.middleware([ 'auth' ]);
Route.get('admin/supplier/edit/:id', 'Admin/SupplierController.edit').as('admin-supplier-edit').middleware([ 'auth' ]);

Route.post('/admin/supplier/save/:id', 'Admin/SupplierController.save')
	.as('admin-supplier-save')
	.validator('storeSupplier')
	.middleware([ 'auth' ]);

// SALES INVOICES
Route.get('admin/sales/invoices', 'Admin/Sales/InvoiceController.index')
	.as('admin-sales-invoices')
	.middleware([ 'auth' ]);
Route.get('admin/sales/invoice/create', 'Admin/Sales/InvoiceController.create')
	.as('admin-sales-invoice-create')
	.middleware([ 'auth' ]);
Route.get('admin/sales/invoice/edit/:id', 'Admin/Sales/InvoiceController.edit')
	.as('admin-sales-invoice-edit')
	.middleware([ 'auth' ]);
Route.post('/admin/sales/invoice/save/:id', 'Admin/Sales/InvoiceController.save')
	.as('admin-sales-invoice-save')
	.validator('storeSalesInvoice')
	.middleware([ 'auth' ]);

/*
Route.get('admin/sales/invoice/print/:id', 'Admin/Sales/InvoiceController.print')
	.as('admin-sales-invoice-print')
	.middleware([ 'auth' ]);
Route.get('admin/sales/invoice/pdf/:id', 'Admin/Sales/InvoiceController.getPdf')
	.as('admin-sales-invoice-pdf')
	.middleware([ 'auth' ]);
*/

// ZAWA ORDERS
Route.get('admin/sales/open-orders/zawa/deals', 'Admin/Sales/ZwdOrderController.openOrders')
	.as('admin-sales-open-orders-zawadeals')
	.middleware([ 'auth' ]);
Route.get('/admin/sales/open-orders/zawa/change-state/:id/:newStatus', 'Admin/Sales/ZwdOrderController.changeStatus')
	.as('admin-sales-open-orders-zawa-change-status')
	.middleware([ 'auth' ]);

Route.get('/admin/sales/open-orders/zawa/del-order/:id/:status', 'Admin/Sales/ZwdOrderController.delOrder')
	.as('admin-sales-open-orders-zawa-del-order')
	.middleware([ 'auth' ]);

Route.get('/admin/sales/open-orders/zawa/problem-order/:id/:status', 'Admin/Sales/ZwdOrderController.problemOrder')
	.as('admin-sales-open-orders-zawa-problem-order')
	.middleware([ 'auth' ]);

Route.post('/admin/sales/orders/zawa/search', 'Admin/Sales/ZwdOrderController.getOrders')
	.as('admin-sales-orders-zawa-search')
	.middleware([ 'auth' ]);

// BOL ORDERS
Route.get('admin/sales/open-orders/bol/:country', 'Admin/Sales/BolOrderController.openOrders')
	.as('admin-sales-open-orders-bol')
	.middleware([ 'auth' ]);

Route.get('/admin/sales/open-orders/bol/change-state/:id/:newStatus', 'Admin/Sales/BolOrderController.changeStatus')
	.as('admin-sales-open-orders-bol-change-status')
	.middleware([ 'auth' ]);

Route.get('/admin/sales/open-orders/bol/del-order/:id/:status/:country', 'Admin/Sales/BolOrderController.delOrder')
	.as('admin-sales-open-orders-bol-del-order')
	.middleware([ 'auth' ]);

Route.get(
	'/admin/sales/open-orders/bol/problem-order/:id/:status/:country',
	'Admin/Sales/BolOrderController.problemOrder'
)
	.as('admin-sales-open-orders-bol-problem-order')
	.middleware([ 'auth' ]);

Route.post('/admin/sales/orders/bol/search/:country', 'Admin/Sales/BolOrderController.getOrders')
	.as('admin-sales-orders-search')
	.middleware([ 'auth' ]);

// TEST Routes
//Route.get('admin/test', 'Admin/TestController.tree').as('admin-test').middleware([ 'auth' ]);
