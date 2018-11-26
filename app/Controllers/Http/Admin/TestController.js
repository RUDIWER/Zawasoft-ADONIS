'use strict';

const OldInvoice = use('App/Models/OldSalesInvoice');
const OldInvoiceRow = use('App/Models/OldSalesInvoiceDetail');
const Invoice = use('App/Models/SalesInvoice');
const InvoiceRow = use('App/Models/SalesInvoiceRow');
const Customer = use('App/Models/Customer');
const OldCustomer = use('App/Models/OldCustomer');
const OldAddress = use('App/Models/OldAddress');
const Address = use('App/Models/Address');
const Product = use('App/Models/Product');

//test
class TestController {
	async getInvoices() {
		console.log('Start import oude facturen ...');
		const oldInvoices = (await OldInvoice.all()).toJSON();
		console.log('Aantal te importeren: ' + oldInvoices.length);
		for (var i = 0; i < 1240; i++) {
			const inv = await new Invoice();
			var oldInv;
			try {
				oldInv = await OldInvoice.find(i);
			} catch (e) {
				console.log('GEEN RECORD GEVONDEN !!!!' + e);
			}
			if (oldInv == null) {
				console.log('Factuur met id : ' + i + ' Bestaat niet !');
				continue;
			}
			inv.id = oldInv.id_cz_cust_invoice;
			inv.invoice_number = oldInv.id_cust_invoice;
			inv.id_sales_order = oldInv.id_cust_order;
			inv.order_reference = oldInv.order_reference;
			inv.invoice_date = oldInv.invoice_date;
			inv.order_date = oldInv.order_date;
			inv.id_customer = oldInv.id_customer;
			if (oldInv.invoice_type == 1 || oldInv.invoice_type == '') {
				inv.id_invoice_type = 1;
			} else if (oldInv.invoice_type == 2) {
				inv.id_invoice_type = 5;
			} else if (oldInv.invoice_type == 3) {
				inv.id_invoice_type = 4;
			} else if (oldInv.invoice_type == 4) {
				inv.id_invoice_type = 2;
			} else if (oldInv.invoice_type == 5) {
				inv.id_invoice_type = 6;
			} else if (oldInv.invoice_type == 6) {
				inv.id_invoice_type = 3;
			}
			var cust = await Customer.find(inv.id_customer);
			try {
				var addresses = await cust.addresses().fetch();
			} catch (e) {
				console.log('GEEN ADDRESSEN GEVONDEN !!!!' + e);
			}
			if (addresses.rows.length < 1) {
				console.log('adres voor klant id : ' + oldInv.id_customer + ' Bestaat niet !');
				inv.id_invoice_address = 0;
			} else {
				var address = await addresses.first();
				inv.id_invoice_address = address.id;
			}
			inv.customer_first_name = oldInv.customer_first_name;
			inv.customer_last_name = oldInv.customer_name;
			inv.company = oldInv.company_name;
			inv.country = oldInv.customer_country;
			inv.state = '';
			inv.postcode = oldInv.customer_postal_code;
			inv.alias = '';
			inv.street = oldInv.customer_street_nr;
			inv.number = '';
			inv.bus = '';
			inv.city = oldInv.customer_city;
			inv.email = oldInv.customer_email;
			inv.phone = oldInv.customer_phone;
			inv.vat_number = oldInv.customer_vat_number;
			inv.shipping_vat_procent = oldInv.total_shipping_btw_procent;
			inv.shipping_cost_ex_vat = oldInv.total_shipping_cost_exl_btw;
			inv.shipping_amount_ex_vat = oldInv.total_shipping_exl_btw;
			inv.shipping_amount_in_vat = oldInv.total_shipping_incl_btw;
			inv.products_ex_vat = oldInv.total_products_exl_btw;
			inv.products_in_vat = oldInv.total_products_incl_btw;
			inv.pp_ex_vat_cz = oldInv.total_ikp_cz_exl_btw;
			inv.cost_ex_vat_bol = oldInv.total_costs_bol_exl_btw;
			inv.wrapping_cost_ex_vat = oldInv.total_wrapping_cost_ex_btw;
			inv.wrapping_amount_ex_vat = oldInv.total_wrapping_exl_btw;
			inv.wrapping_amount_in_vat = oldInv.total_wrapping_incl_btw;
			inv.invoice_ex_vat = oldInv.total_invoice_exl_btw;
			inv.invoice_in_vat = oldInv.total_invoice_incl_btw;
			inv.amount_paid = oldInv.total_paid;
			inv.netto_margin_ex_vat = oldInv.netto_margin_ex_vat;
			if (oldInv.payment_method == '' || oldInv.payment_method == null) {
				inv.id_payment_method = 0;
			} else if (oldInv.payment_method == 'HiPay') {
				inv.id_payment_method = 3;
			} else if (oldInv.payment_method == 'Paypal' || oldInv.payment_method == 'PayPal') {
				inv.id_payment_method = 4;
			} else if (oldInv.payment_method == 'Niet Voldaan') {
				inv.id_payment_method = 1;
			} else if (oldInv.payment_method == 'Kas' || oldInv.payment_method == 'Via Cool-Zawadi') {
				inv.id_payment_method = 2;
			} else if (oldInv.payment_method == 'Via bol.com') {
				inv.id_payment_method = 5;
			} else {
				console.log('Betaalwijze is anders : ' + oldInv.payment_method);
			}
			try {
				await inv.save();
			} catch (e) {
				console.log('Factuur niet kunnen opslaan !!!!' + e);
			}
		}
	}

	async getInvoiceRows() {
		console.log('Start import oude factuurregels ...');
		const oldInvoiceRows = (await OldInvoiceRow.all()).toJSON();
		console.log('Aantal te importeren: ' + oldInvoiceRows.length);
		for (var i = 0; i < 1690; i++) {
			const invRow = await new InvoiceRow();
			var oldInvRow;
			try {
				oldInvRow = await OldInvoiceRow.find(i);
			} catch (e) {
				console.log('GEEN RECORD GEVONDEN !!!!' + e);
			}
			if (oldInvRow == null) {
				console.log('Factuurregel  met id : ' + i + ' Bestaat niet !');
				continue;
			}

			invRow.id = oldInvRow.id_cz_cust_invoice_detail;
			invRow.id_invoice = oldInvRow.id_cz_cust_invoice;
			invRow.invoice_number = oldInvRow.id_cust_invoice;
			invRow.description = oldInvRow.product_descr;
			invRow.id_product = 0;
			invRow.ean13 = oldInvRow.ean_product;
			invRow.quantity = oldInvRow.quantity;
			invRow.vat_procent = oldInvRow.vat_procent;
			invRow.product_pp_ex_vat = oldInvRow.product_ikp_price_cz_ex_vat;
			invRow.product_sp_ex_vat = oldInvRow.product_unit_price_ex_vat;
			invRow.product_sp_in_vat = oldInvRow.product_unit_price_incl_vat;
			invRow.row_total_pp_ex_vat = oldInvRow.product_total_ikp_cz_ex_vat;
			invRow.row_total_pp_in_vat =
				invRow.row_total_pp_ex_vat + invRow.row_total_pp_ex_vat / 100 * invRow.vat_procent;
			invRow.row_total_sp_ex_vat = oldInvRow.product_total_price_ex_vat;
			invRow.row_total_sp_in_vat = oldInvRow.product_total_price_incl_vat;
			invRow.row_total_cost_ex_vat_bol_be = oldInvRow.row_bol_cost_amount;
			invRow.row_total_cost_ex_vat_bol_nl = 0;
			invRow.amazon_cost_ex_vat = 0;
			invRow.cost_ex_vat_bol_be = invRow.row_total_cost_ex_vat_bol_be / invRow.quantity;
			invRow.cost_ex_vat_bol_nl = 0;
			try {
				await invRow.save();
			} catch (e) {
				console.log('Fout bij opslaan : ' + e);
			}
			console.log('Regels ' + i + ' opgeslagen');
		}
		return 'TEST';
	}

	async getCustomers() {
		console.log('Start import oude klanten ...');
		const oldCustomers = (await OldCustomer.all()).toJSON();
		console.log('aantal te importeren: ' + oldCustomers.length);
		for (var i = 1; i < 1000; i++) {
			console.log('start import klant id : ' + i);
			const cust = await new Customer();
			var oldCust = '';
			try {
				oldCust = await OldCustomer.find(i);
			} catch (e) {
				console.log('GEEN RECORD GEVONDEN !!!!' + e);
			}

			if (oldCust == null) {
				console.log('Klant ' + i + ' Bestaat niet !');
				continue;
			}
			console.log('klant id is : ' + oldCust.id_customer);
			cust.id = oldCust.id_customer;
			if (oldCust.id_gender == 0) {
				cust.id_title = 3;
			} else {
				cust.id_title = oldCust.id_gender;
			}
			cust.id_type = 11;
			cust.id_origin = 2;
			cust.id_lang = 1;
			cust.first_name = oldCust.firstname;
			cust.last_name = oldCust.lastname;
			if (oldCust.email) {
				cust.email_1 = oldCust.email;
			} else {
				cust.email_1 = 'no_email@nothing.com';
			}
			cust.email_2 = '';
			cust.company = oldCust.company;
			cust.vat_number = '';
			cust.bank_account = '';
			cust.website = oldCust.website;
			if (oldCust.birthday == '0000-00-00') {
				console.log('Geen birthday');
				cust.birthday = null;
			} else {
				cust.birthday = oldCust.birthday;
			}
			cust.phone_1 = '';
			cust.phone_2 = '';
			cust.phone_3 = '';
			cust.phone_descr_1 = '';
			cust.phone_descr_2 = '';
			cust.phone_descr_3 = '';
			cust.newsletter = oldCust.newsletter;
			cust.created_at = oldCust.date_add;
			cust.updated_at = oldCust.date_upd;
			try {
				await cust.save();
			} catch (e) {
				console.log('Fout bij opslaan : ' + e);
			}
			console.log('klant ' + i + ' opgeslagen');
		}
	}

	async getAddresses() {
		console.log('Start import oude Addressen ...');
		const oldAddresses = (await OldAddress.all()).toJSON();
		console.log('aantal te importeren: ' + oldAddresses.length);
		for (var i = 1; i < 1360; i++) {
			console.log('start import Address id : ' + i);
			const addr = await new Address();
			var oldAddr = '';
			try {
				oldAddr = await OldAddress.query().where('id_address', '=', i);
			} catch (e) {
				console.log('GEEN RECORD GEVONDEN !!!!' + e);
			}
			if (oldAddr.length == 0) {
				console.log('Address ' + i + ' Bestaat niet !');
				continue;
			}
			if (oldAddr[0].id_customer == 0) {
				console.log('Address ' + i + ' Is geen klanten adres');
				continue;
			}
			console.log('adres id is : ' + oldAddr[0].id_customer);
			addr.id = oldAddr[0].id_address;
			addr.id_customer = oldAddr[0].id_customer;
			addr.id_supplier = 0;
			if (oldAddr[0].id_country == 3) {
				addr.country = 'België';
			} else if (oldAddr[0].id_country == 8) {
				addr.country = 'France';
			} else if (oldAddr[0].id_country == 13) {
				addr.country = 'Nederland';
			}
			addr.state = '';
			addr.postcode = oldAddr[0].postcode;
			addr.alias = oldAddr[0].alias;
			addr.company = oldAddr[0].company;
			addr.street = oldAddr[0].address1;
			addr.number = '';
			addr.bus = '';
			addr.city = oldAddr[0].city;
			addr.other = oldAddr[0].other;
			addr.phone = oldAddr[0].phone;
			addr.mobile = oldAddr[0].phone_mobile;
			addr.fax = '';
			addr.email = '';
			addr.vat_number = oldAddr[0].vat_number;
			addr.first_name = oldAddr[0].firstname;
			addr.last_name = oldAddr[0].lastname;
			addr.created_at = oldAddr[0].date_add;
			addr.updated_at = oldAddr[0].date_upd;

			try {
				await addr.save();
			} catch (e) {
				console.log('Fout bij opslaan : ' + e);
			}
			console.log('Adres ' + i + ' opgeslagen');
		}
	}

	async setEMailinAddr() {
		console.log('Start import oude Addressen ...');
		const addresses = (await Address.all()).toJSON();
		console.log('aantal te importeren: ' + addresses.length);
		var addr = '';
		var cust = '';
		for (var i = 1; i < 1360; i++) {
			console.log('start import Address id : ' + i);
			try {
				addr = await Address.find(i);
			} catch (e) {
				console.log('GEEN ADRES met dit id GEVONDEN !!!!' + e);
			}
			if (addr == null) {
				console.log('Addres' + i + ' Bestaat niet !');
				continue;
			}
			console.log('dit adres is van klant' + addr.id_customer);
			try {
				cust = await Customer.find(addr.id_customer);
			} catch (e) {
				console.log('GEEN KLANT GEVONDEN !!!!' + e);
			}
			if (cust == null) {
				console.log('klant' + addr.id_customer + ' Bestaat niet !');
				continue;
			}
			if (cust.email_1 == '') {
				console.log('Klant ' + i + ' heeft geen email adres');
				continue;
			}
			addr.email = cust.email_1;
			try {
				await addr.save();
			} catch (e) {
				console.log('Adres niet kunnen opslaan !!!!' + e);
			}
		}
	}
}

module.exports = TestController;
