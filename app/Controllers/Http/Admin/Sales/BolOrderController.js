'use strict';
const Customer = use('App/Models/Customer');
const Address = use('App/Models/Address');
const Param = use('App/Models/Param');
const Product = use('App/Models/Product');
const Order = use('App/Models/SalesOrderBol');
const OrderItem = use('App/Models/SalesOrderRowBol');
const SalesInvoice = use('App/Models/SalesInvoice');
const SalesInvoiceRow = use('App/Models/SalesInvoiceRow');
const Env = use('Env');
const BolApi = use('App/ZawaClasses/BolApi.js');
const PrestaApi = use('App/ZawaClasses/PrestaApi.js');
const parseString = require('xml2js').parseString;
const Database = use('Database');
const Mail = use('Mail');

class BolOrderController {
	async openOrders({ view, params }) {
		var bolCountry = params.country;
		if (bolCountry == 'be') {
			var bolApi = new BolApi(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
		} else {
			var bolApi = new BolApi(Env.get('BOL_NL_PUBLIC_KEY'), Env.get('BOL_NL_PRIVATE_KEY'));
		}
		var data = await bolApi.getOrders();
		var errorCode = data[0];
		var xml = data[1];
		var json = '';
		parseString(xml, function(error, result) {
			if (error) {
				console.log('XML PARSE ERROR :' + error);
				return;
			}
			json = result;
		});
		const bolOrders = json.Orders.Order;
		// If there are new orders  from BOL
		if (bolOrders) {
			let ordersLength = bolOrders.length;
			for (let counter1 = 0; counter1 < ordersLength; counter1++) {
				// Loop over orders (ORDERS)
				// Create Order records
				const bolOrder = json.Orders.Order[counter1];
				const bolOrderId = bolOrder.OrderId;
				const orderExist = (await Order.query().where('id_order_bol', bolOrderId).fetch()).toJSON();

				if (typeof orderExist !== 'undefined' && orderExist.length > 0) {
					continue;
				}
				const order = await new Order();
				order.id_order_bol = bolOrderId;
				order.current_status = 1;
				if (bolCountry == 'be') {
					order.id_country_bol = '2';
				} else {
					order.id_country_bol = '1';
				}
				order.date_time_order = bolOrder.DateTimeCustomer;
				order.customer_first_name_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].Firstname
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].Firstname
					: '';
				order.customer_last_name_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].Surname
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].Surname
					: '';
				order.id_title_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].SalutationCode
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].SalutationCode
					: '';
				order.company_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].Company
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].Company
					: '';
				order.street_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].Streetname
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].Streetname
					: '';
				order.number_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].Housenumber
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].Housenumber
					: '';
				order.bus_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].HousenumberExtended
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].HousenumberExtended
					: '';
				order.city_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].City
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].City
					: '';
				order.postcode_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].ZipCode
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].ZipCode
					: '';
				order.address_info_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].AddressSupplement
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].AddressSupplement
					: '';
				order.address_extra_info_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0]
					.ExtraAddressInformation
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].ExtraAddressInformation
					: '';
				order.country_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].CountryCode
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].CountryCode
					: '';
				order.email_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].Email
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].Email
					: '';
				order.phone_delivery = bolOrder.CustomerDetails[0].ShipmentDetails[0].DeliveryPhoneNumber
					? bolOrder.CustomerDetails[0].ShipmentDetails[0].DeliveryPhoneNumber
					: '';
				order.id_title_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].SalutationCode
					? bolOrder.CustomerDetails[0].BillingDetails[0].SalutationCode
					: '';
				order.customer_first_name_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].Firstname
					? bolOrder.CustomerDetails[0].BillingDetails[0].Firstname
					: '';
				order.customer_last_name_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].Surname
					? bolOrder.CustomerDetails[0].BillingDetails[0].Surname
					: '';
				order.company_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].Company
					? bolOrder.CustomerDetails[0].BillingDetails[0].Company
					: '';
				order.vat_number_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].VatNumber
					? bolOrder.CustomerDetails[0].BillingDetails[0].VatNumber
					: '';
				order.street_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].Streetname
					? bolOrder.CustomerDetails[0].BillingDetails[0].Streetname
					: '';
				order.number_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].Housenumber
					? bolOrder.CustomerDetails[0].BillingDetails[0].Housenumber
					: '';
				order.bus_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].HousenumberExtended
					? bolOrder.CustomerDetails[0].BillingDetails[0].HousenumberExtended
					: '';
				order.city_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].City
					? bolOrder.CustomerDetails[0].BillingDetails[0].City
					: '';
				order.postcode_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].ZipCode
					? bolOrder.CustomerDetails[0].BillingDetails[0].ZipCode
					: '';
				order.address_info_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].AddressSupplement
					? bolOrder.CustomerDetails[0].BillingDetails[0].AddressSupplement
					: '';
				order.address_extra_info_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].ExtraAddressInformation
					? bolOrder.CustomerDetails[0].BillingDetails[0].ExtraAddressInformation
					: '';
				order.country_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].CountryCode
					? bolOrder.CustomerDetails[0].BillingDetails[0].CountryCode
					: '';
				order.email_invoice = bolOrder.CustomerDetails[0].BillingDetails[0].Email
					? bolOrder.CustomerDetails[0].BillingDetails[0].Email
					: '';
				await order.save();
				//console.log('ORDERNR : ' + order.id_order_bol);
				const bolOrderItems = bolOrder.OrderItems;
				let bolOrderItemsLength = bolOrderItems.length;
				for (let counter2 = 0; counter2 < bolOrderItemsLength; counter2++) {
					const bolOrderItems = bolOrder.OrderItems[counter2];
					// GET EACH ITEM FOR a ORDER
					const bolOrderItem = bolOrderItems.OrderItem;
					let bolOrderItemLength = bolOrderItem.length;
					for (let counter3 = 0; counter3 < bolOrderItemLength; counter3++) {
						// Create aorderitem records
						const bolOrderItem = bolOrderItems.OrderItem[counter3];
						const orderItem = await new OrderItem();
						orderItem.id_sales_order_bol = order.id;
						orderItem.id_order_bol = order.id_order_bol;
						if (bolCountry == 'be') {
							orderItem.id_country_bol = '2';
						} else {
							orderItem.id_country_bol = '1';
						}
						orderItem.id_order_bol_item = bolOrderItem.OrderItemId;
						orderItem.ean13 = bolOrderItem.EAN;
						orderItem.id_product = bolOrderItem.OfferReference;
						const product = await Product.find(orderItem.id_product);
						const longTitle = String(bolOrderItem.Title);
						const title = longTitle.substring(0, 50);
						orderItem.product_name_nl = title;
						orderItem.quantity = bolOrderItem.Quantity;
						orderItem.product_sp_in_vat = bolOrderItem.OfferPrice;
						orderItem.product_sp_ex_vat = Number(bolOrderItem.OfferPrice) / (product.vat_procent / 100 + 1);
						orderItem.vat_procent = product.vat_procent;
						orderItem.row_total_sp_in_vat =
							Number(bolOrderItem.Quantity) * Number(orderItem.product_sp_in_vat);
						orderItem.transaction_fee = bolOrderItem.TransactionFee;
						if (bolCountry == 'be') {
							orderItem.calc_cost_bol = product.total_cost_ex_vat_bol_be;
						} else {
							orderItem.calc_cost_bol = product.total_cost_ex_vat_bol_nl;
						}
						orderItem.latest_delivery_date = bolOrderItem.PromisedDeliveryDate;
						if (bolCountry == 'be') {
							orderItem.shipping_cost_ex_vat_bol = product.shipping_cost_ex_vat_bol_be;
						} else {
							orderItem.shipping_cost_ex_vat_bol = product.shipping_cost_ex_vat_bol_nl;
						}
						if (bolOrderItem.CancelRequest == 'false') {
							orderItem.cancel_request = 0;
						} else {
							orderItem.cancel_request = 1;
						}
						await orderItem.save();

						//console.log('ORDER :' + counter1 + ' ITEMs : ' + counter2 + ' ITEM' + counter3);
						//console.log(bolOrderItem);
					}
				}
			}
		}
		if (bolCountry == 'be') {
			var orders = (await Order.query()
				.with('rows')
				.where('id_country_bol', '=', '2')
				.where('current_status', '<', '5')
				.orderBy('id', 'desc')
				.fetch()).toJSON();
		} else {
			var orders = (await Order.query()
				.with('rows')
				.where('id_country_bol', '=', '1')
				.where('current_status', '<', '5')
				.orderBy('id', 'desc')
				.fetch()).toJSON();
		}
		return view.render('admin.sales.order.orderListBol', { orders, bolCountry });
	}

	async getOrders({ params, request, view, session }) {
		// Flash old values to the session
		session.flashAll();
		// Get id from form
		const searchData = request.except([ '_csrf', 'submit' ]);
		const searchField = searchData.search_field;
		const bolCountry = params.country;
		//return searchData;
		if (bolCountry == 'be') {
			var orders = (await Order.query()
				.with('rows')
				.where('id_country_bol', '=', '2')
				.where('id_order_bol', searchField)
				.orWhere('customer_last_name_delivery', 'like', searchField + '%')
				.orWhere('customer_first_name_delivery', 'like', searchField + '%')
				.orWhere('company_delivery', 'like', searchField + '%')
				.orWhere('company_invoice', 'like', searchField + '%')
				.orWhere('customer_last_name_invoice', 'like', searchField + '%')
				.orWhere('customer_first_name_invoice', 'like', searchField + '%')
				.orderBy('id', 'desc')
				.fetch()).toJSON();
		} else {
			var orders = (await Order.query()
				.with('rows')
				.where('id_country_bol', '=', '1')
				.where('id_order_bol', searchField)
				.orWhere('customer_last_name_delivery', 'like', searchField + '%')
				.orWhere('customer_first_name_delivery', 'like', searchField + '%')
				.orWhere('customer_last_name_invoice', 'like', searchField + '%')
				.orWhere('company_delivery', 'like', searchField + '%')
				.orWhere('company_invoice', 'like', searchField + '%')
				.orWhere('customer_first_name_invoice', 'like', searchField + '%')
				.orderBy('id', 'desc')
				.fetch()).toJSON();
		}
		return view.render('admin.sales.order.orderListBol', { orders, bolCountry });
	}

	async changeStatus({ params, session }) {
		var order = await Order.find(params.id);
		var orderItems = (await OrderItem.query().where('id_sales_order_bol', params.id).fetch()).toJSON();
		var mailData = {
			order: order.toJSON(),
			orderItems: orderItems
		};
		// Order will be changed from received to start Handling
		if (params.newStatus == '2') {
			// 1) Change stock of products Real stock - to invoice
			for (let counter in orderItems) {
				var orderItem = orderItems[counter];
				var product = await Product.find(orderItem.id_product);
				product.stock_real = Number(product.stock_real) - Number(orderItem.quantity);
				product.quantity_to_invoice = product.quantity_to_invoice + Number(orderItem.quantity);
				await product.save();

				// 2) Send new stock to bol be
				const bolApiBe = new BolApi(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
				await bolApiBe.setProductBe(product.id);

				// 3) Send new stock to bol nl
				const bolApiNl = new BolApi(Env.get('BOL_NL_PUBLIC_KEY'), Env.get('BOL_NL_PRIVATE_KEY'));
				await bolApiNl.setProductNl(product.id);

				// 4) Send Stock To Prestashop
				const prestaApi = new PrestaApi();
				await prestaApi.setProductStock(product.id, product.stock_real);
			}
			// 4) Change order status
			order.current_status = params.newStatus;
			await order.save();

			// 5) Send email to Customer   TODO
			await Mail.send('admin.sales.emails.bolOrderReceived', mailData, (message) => {
				message
					.to(order.email_invoice, order.customer_first_name_delivery)
					.from(Env.get('MAIL_USERNAME'), 'Cool-Zawadi bvba - ZAWAdeals.com (via bol)')
					.replyTo(Env.get('MAIL_REPLY_USERNAME'), 'Het ZAWAdeals Team')
					.subject('We hebben uw order via bol.com ontvangen en gaan meteen aan de slag!');
			});
		} else if (params.newStatus == '3') {
			// 1) Change order status to 'Verzonden'
			order.current_status = params.newStatus;
			await order.save();
			// 5) Send email to Customer   TODO
			await Mail.send('admin.sales.emails.bolOrderSend', mailData, (message) => {
				message
					.to(order.email_invoice, order.customer_first_name_delivery)
					.from(Env.get('MAIL_USERNAME'), 'Cool-Zawadi bvba - ZAWAdeals.com (via bol)')
					.replyTo(Env.get('MAIL_REPLY_USERNAME'), 'Het ZAWAdeals Team')
					.subject('Uw order via bol.com werd door ons verstuurd!');
			});
		} else if (params.newStatus == '4') {
			// 1) Change order status to 'Afgeleverd'
			order.current_status = params.newStatus;
			await order.save();
			// 5) Send email to Customer   TODO
			await Mail.send('admin.sales.emails.bolOrderArrived', mailData, (message) => {
				message
					.to(order.email_invoice, order.customer_first_name_delivery)
					.from(Env.get('MAIL_USERNAME'), 'Cool-Zawadi bvba - ZAWAdeals.com (via bol)')
					.replyTo(Env.get('MAIL_REPLY_USERNAME'), 'Het ZAWAdeals Team')
					.subject('Controle mail onvangst order via bol.com.');
			});
		} else if (params.newStatus == '5') {
			// Change status to 'Gefactureerd'
			// 1) Create invoice
			// Start Transaction
			const param = await Param.find(1);
			const trx = await Database.beginTransaction();
			var invoice = new SalesInvoice();
			invoice.invoice_number = param.last_sales_invoice_nr + 1;
			try {
				// Set invoice values to invoice Data
				invoice.id_sales_order = 0;
				invoice.order_reference = '';
				invoice.id_order_bol = order.id_order_bol;
				invoice.invoice_date = new Date();
				invoice.order_date = order.date_time_order;
				// Search customer or create new one

				const customerExist = (await Address.query()
					.where('first_name', 'LIKE', '%' + order.customer_first_name_invoice + '%')
					.where('last_name', 'LIKE', '%' + order.customer_last_name_invoice + '%')
					.where('street', 'LIKE', '%' + order.street_invoice + '%')
					.where('number', 'LIKE', '%' + order.number_invoice + '%')
					.where('city', 'LIKE', '%' + order.city_invoice + '%')
					.fetch()).toJSON();
				if (typeof customerExist !== 'undefined' && customerExist.length > 0) {
					invoice.id_customer = customerExist[0].id_customer;
					invoice.id_invoice_address = customerExist[0].id;
				} else {
					// Create new customer and Address
					var customer = new Customer();
					customer.id_title = order.id_title_invoice;
					if (order.country_delivery == 'NL') {
						customer.id_type = 5;
					} else {
						customer.id_type = 4;
					}
					customer.id_origin = 6;
					customer.id_lang = 1;
					customer.first_name = order.customer_first_name_invoice;
					customer.last_name = order.customer_last_name_invoice;
					customer.email_1 = order.email_delivery;
					customer.email_2 = order.email_invoice;
					if (order.company_invoice) {
						customer.company = order.company_invoice;
					} else {
						customer.company = '';
					}
					order.vat_number_invoice
						? (customer.vat_number = order.vat_number_invoice)
						: (customer.vat_number = '');
					customer.bank_account = '';
					customer.website = '';
					customer.birthday = null;
					customer.phone_1 = '';
					customer.phone_2 = '';
					customer.phone_3 = '';
					customer.phone_descr_1 = '';
					customer.phone_descr_2 = '';
					customer.phone_descr_3 = '';
					customer.newsletter = 2; // Newsletter type 2 is specially for BOL clients !!!!
					await customer.save(trx);
					// Create Customer addresses
					// 1) Delivery Address
					var address = new Address();
					address.id_customer = customer.id;
					address.id_supplier = 0;
					if (order.country_delivery == 'NL') {
						address.country = 'Nederland';
					} else {
						address.country = 'België';
					}
					address.state = '';
					address.postcode = order.postcode_delivery;
					address.alias = 'Leveringsadres';
					address.company = order.company_delivery;
					address.street = order.street_delivery;
					address.number = order.number_delivery;
					address.bus = order.bus_delivery;
					address.city = order.city_delivery;
					address.other = '';
					address.phone = '';
					address.mobile = '';
					address.fax = '';
					address.email = '';
					address.vat_number = '';
					address.first_name = order.customer_first_name_delivery;
					address.last_name = order.customer_last_name_delivery;
					await address.save(trx);
					// ) Invoice Address
					var address = new Address();
					address.id_customer = customer.id;
					address.id_supplier = 0;
					if (order.country_invoice == 'NL') {
						address.country = 'Nederland';
					} else {
						address.country = 'Belgie';
					}
					address.state = '';
					address.postcode = order.postcode_invoice;
					address.alias = 'Facturatie adres';
					address.company = order.company_invoice;
					address.street = order.street_invoice;
					address.number = order.number_invoice;
					address.bus = order.bus_invoice;
					address.city = order.city_invoice;
					address.other = '';
					address.phone = '';
					address.mobile = '';
					address.fax = '';
					address.email = '';
					address.vat_number = '';
					address.first_name = order.customer_first_name_invoice;
					address.last_name = order.customer_last_name_invoice;
					await address.save(trx);
					invoice.id_customer = customer.id;
					invoice.id_invoice_address = address.id;
				}
				if (order.id_country_bol == '1') {
					// NL
					invoice.id_payment_method = '5';
					invoice.id_invoice_type = '5';
					invoice.shipping_cost_ex_vat = param.shipping_cost_ex_vat_bol_nl;
				} else {
					// BE
					invoice.id_payment_method = '4';
					invoice.id_invoice_type = '4';
					invoice.shipping_cost_ex_vat = param.shipping_cost_ex_vat_bol_be;
				}
				invoice.customer_first_name = order.customer_first_name_invoice;
				invoice.customer_last_name = order.customer_last_name_invoice;
				invoice.company = order.company_invoice;
				if (order.country_invoice == 'BE') {
					invoice.country = 'België';
				} else if (order.country_invoice == 'NL') {
					invoice.country = 'Nederland';
				}
				invoice.state = '';
				invoice.postcode = order.postcode_invoice;
				invoice.alias = 'Facturatie adres';
				invoice.street = order.street_invoice;
				invoice.number = order.number_invoice;
				invoice.bus = order.bus_invoice;
				invoice.city = order.city_invoice;
				invoice.email = order.email_invoice;
				invoice.phone = '';
				invoice.vat_number = order.vat_number_invoice;
				invoice.shipping_vat_procent = param.stand_shipping_vat_procent;
				invoice.shipping_amount_ex_vat = 0;
				invoice.shipping_amount_in_vat = 0;
				invoice.wrapping_cost_ex_vat = 0;
				invoice.wrapping_amount_ex_vat = 0;
				invoice.wrapping_amount_in_vat = 0;
				var costs_ex_vat_bol = 0;
				var products_sp_ex_vat = 0;
				var products_sp_in_vat = 0;
				var products_pp_ex_vat = 0;
				var costs_ex_vat_bol = 0;
				for (let counter in orderItems) {
					const orderItem = orderItems[counter];
					product = await Product.find(orderItem.id_product);
					products_sp_ex_vat =
						Number(products_sp_ex_vat) + Number(orderItem.product_sp_ex_vat) * Number(orderItem.quantity);
					//console.log('Producten' + products_sp_ex_vat);
					products_sp_in_vat =
						Number(products_sp_in_vat) + Number(orderItem.product_sp_in_vat) * Number(orderItem.quantity);
					products_pp_ex_vat = products_pp_ex_vat + Number(product.pp_ex_vat_cz) * Number(orderItem.quantity);
					costs_ex_vat_bol = costs_ex_vat_bol + Number(orderItem.transaction_fee);
				}
				invoice.products_ex_vat = products_sp_ex_vat;
				invoice.products_in_vat = products_sp_in_vat;
				invoice.pp_ex_vat_cz = products_pp_ex_vat;
				invoice.cost_ex_vat_bol = costs_ex_vat_bol;
				invoice.invoice_ex_vat = products_sp_ex_vat;
				invoice.invoice_in_vat = products_sp_in_vat;
				invoice.amount_paid = invoice.invoice_in_vat;
				var total_cost = invoice.pp_ex_vat_cz + costs_ex_vat_bol + invoice.shipping_cost_ex_vat;
				invoice.netto_margin_ex_vat = invoice.invoice_ex_vat - total_cost;
				invoice.margin_procent = (invoice.invoice_ex_vat / total_cost - 1) * 100;
				await invoice.save(trx);
				// Create Invoice Rows
				for (let counter in orderItems) {
					const orderItem = orderItems[counter];
					product = await Product.find(orderItem.id_product);
					const invoiceRow = new SalesInvoiceRow();
					invoiceRow.id_invoice = invoice.id;
					invoiceRow.invoice_number = invoice.invoice_number;
					invoiceRow.id_supplier = product.id_supplier;
					invoiceRow.id_bol_category = product.id_bol_category;
					invoiceRow.id_product_brand = product.id_brand;
					invoiceRow.id_sales_order = 0;
					invoiceRow.id_invoice_type = invoice.id_invoice_type;
					invoiceRow.order_reference = '';
					invoiceRow.id_order_bol = invoice.id_order_bol;
					invoiceRow.id_product = product.id;
					invoiceRow.id_product_supplier = product.id_product_supplier;
					invoiceRow.ean13 = orderItem.ean13;
					invoiceRow.description = orderItem.product_name_nl;
					invoiceRow.quantity = Number(orderItem.quantity);
					invoiceRow.product_pp_ex_vat = product.pp_ex_vat_cz;
					invoiceRow.product_sp_ex_vat = Number(orderItem.product_sp_ex_vat);
					invoiceRow.product_sp_in_vat = Number(orderItem.product_sp_in_vat);
					invoiceRow.row_total_pp_ex_vat = invoiceRow.product_pp_ex_vat * invoiceRow.quantity;
					invoiceRow.row_total_sp_ex_vat = invoiceRow.product_sp_ex_vat * invoiceRow.quantity;
					invoiceRow.row_total_sp_in_vat = invoiceRow.product_sp_in_vat * invoiceRow.quantity;
					invoiceRow.vat_procent = product.vat_procent;
					if (order.id_country_bol == '1') {
						invoiceRow.row_total_cost_ex_vat_bol_nl = Number(orderItem.transaction_fee);
						invoiceRow.cost_ex_vat_bol_nl = product.total_cost_ex_vat_bol_nl;
					} else if (order.id_country_bol == '2') {
						invoiceRow.row_total_cost_ex_vat_bol_be = Number(orderItem.transaction_fee);
						invoiceRow.cost_ex_vat_bol_be = product.total_cost_ex_vat_bol_be;
					}
					invoiceRow.amazon_cost_ex_vat = 0;
					await invoiceRow.save(trx);
				}
				// Change stock for products to invoice -x  //  boekhoudkundige voorraad -x
				product.stock_accounting = product.stock_accounting - invoiceRow.quantity;
				product.quantity_to_invoice = product.quantity_to_invoice - invoiceRow.quantity;
				await product.save(trx);
				// Change order status
				order.current_status = params.newStatus;
				await order.save(trx);
				// Commit complete transaction
				trx.commit();
				// Update Invoice Number in Parameters
				param.last_sales_invoice_nr += 1;
				await param.save();
			} finally {
				session.flash({
					notification: {
						type: 'success',
						message: 'De factuur werd aangemaakt !'
					}
				});
			}
		}
		return;
	}

	async delOrder({ params, session, response }) {
		const status = params.status;
		const id_order = params.id;
		const country = params.country;
		const param = await Param.find(1);
		if (status == '1') {
			// Order jsut comes in no handlings done just delete order ! STATUS =1
			const order = await Order.find(id_order);
			await order.delete();
			await OrderItem.query().where('id_sales_order_bol', id_order).delete();
		} else {
			const trx = await Database.beginTransaction();
			const order = await Order.find(id_order);
			const orderItems = (await OrderItem.query().where('id_sales_order_bol', id_order).fetch()).toJSON();
			for (let counter in orderItems) {
				const orderItem = orderItems[counter];
				const product = await Product.find(orderItem.id_product);
				product.stock_real = Number(product.stock_real) + Number(orderItem.quantity);
				product.quantity_to_invoice = product.quantity_to_invoice - Number(orderItem.quantity);
				await product.save(trx);

				// 2) Send new stock to bol be
				const bolApiBe = new BolApi(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
				await bolApiBe.setProductBe(product.id);

				// 3) Send new stock to bol nl
				const bolApiNl = new BolApi(Env.get('BOL_NL_PUBLIC_KEY'), Env.get('BOL_NL_PRIVATE_KEY'));
				await bolApiNl.setProductNl(product.id);

				// 4) Send Stock To Prestashop
				const prestaApi = new PrestaApi();
				await prestaApi.setProductStock(product.id, product.stock_real);

				// Recalc Order row set quantity - salesprice - bol cost to NUL // Add return transport cost
				const orderRow = await OrderItem.find(orderItem.id);
				orderRow.quantity = 0;
				orderRow.row_total_sp_in_vat = 0;
				orderRow.transaction_fee = 0;
				if (country == 'be') {
					orderRow.return_shipping_cost_ex_vat_bol = param.return_cost_ex_vat_bol_be;
				} else {
					orderRow.return_shipping_cost_ex_vat_bol = param.return_cost_ex_vat_bol_nl;
				}
				orderRow.cancel_request = 1;
				await orderRow.save(trx);
			}
			//Set order status to 7 = Cancelled
			order.current_status = 7;
			await order.save(trx);
			// Commit complete transaction
			trx.commit();
		}
		session.flash({
			notification: {
				type: 'success',
				message:
					'Het order werd geannuleerd en de voorraden werd aangepast en doorgestuurd naar de verschillende partners !'
			}
		});
		return response.route('admin-sales-open-orders-bol', { country: country });
	}

	async problemOrder({ params, session, response }) {
		const status = params.status;
		const id_order = params.id;
		const country = params.country;
		//const param = await Param.find(1);
		const order = await Order.find(id_order);
		order.is_problem = !order.is_problem;
		await order.save();

		session.flash({
			notification: {
				type: 'success',
				message: 'Probleem melding werd aangepast voor order : ' + order.id_order_bol + '!'
			}
		});
		return response.route('admin-sales-open-orders-bol', { country: country });
	}
}

module.exports = BolOrderController;
