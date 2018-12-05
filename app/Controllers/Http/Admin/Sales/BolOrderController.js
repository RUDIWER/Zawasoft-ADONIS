'use strict';
const Customer = use('App/Models/Customer');
const Address = use('App/Models/Address');
const Param = use('App/Models/Param');
const Product = use('App/Models/Product');
const Order = use('App/Models/SalesOrderBol');
const OrderItem = use('App/Models/SalesOrderRowBol');
const Env = use('Env');
const BolApi = use('App/ZawaClasses/BolApi.js');
const parseString = require('xml2js').parseString;

class BolOrderController {
	async openOrders({ view, params }) {
		if (params.country == 'be') {
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
		//const orderId = json.Orders.Order[0].OrderId[0];
		//const orderDate = json.Orders.Order[0].DateTimeCustomer[0];
		const bolOrders = json.Orders.Order;
		// If there are new orders do get from BOL
		if (bolOrders) {
			let ordersLength = bolOrders.length;
			for (let counter1 = 0; counter1 < ordersLength; counter1++) {
				// Loop over orders (ORDERS)
				// Create Order records
				const bolOrder = json.Orders.Order[counter1];
				const order = await new Order();
				order.id_order_bol = bolOrder.OrderId;
				if (params.country == 'be') {
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
				//	return response.send(bolOrder);
				console.log('ORDERNR : ' + order.id_order_bol);
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
						if (params.country == 'be') {
							orderItem.id_country_bol = '2';
						} else {
							orderItem.id_country_bol = '1';
						}
						orderItem.id_order_bol_be_item = bolOrderItem.OrderItemId;
						orderItem.ean13 = bolOrderItem.EAN;
						orderItem.id_product = bolOrderItem.OfferReference;
						const product = await Product.find(orderItem.id_product);
						orderItem.product_name_nl = bolOrderItem.Title;
						orderItem.quantity = bolOrderItem.Quantity;
						orderItem.product_sp_in_vat = bolOrderItem.OfferPrice;
						orderItem.product_sp_ex_vat = Number(bolOrderItem.OfferPrice) / (product.vat_procent / 100 + 1);
						orderItem.vat_procent = product.vat_procent;
						orderItem.row_total_sp_in_vat =
							Number(bolOrderItem.Quantity) * Number(orderItem.product_sp_in_vat);
						console.log(bolOrderItem.quantity);
						orderItem.transaction_fee = bolOrderItem.TransactionFee;
						if (params.country == 'be') {
							orderItem.calc_cost_bol = product.total_cost_ex_vat_bol_be;
						} else {
							orderItem.calc_cost_bol = product.total_cost_ex_vat_bol_nl;
						}
						orderItem.latest_delivery_date = bolOrderItem.LatestDeliveryDate;
						if (params.country == 'be') {
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

						console.log('ORDER :' + counter1 + ' ITEMs : ' + counter2 + ' ITEM' + counter3);
						console.log(bolOrderItem);
					}
				}
			}
		}
		const orders = (await Order.query().with('rows').fetch()).toJSON();
		return view.render('admin.sales.orderBolList', { orders });
	}
}

module.exports = BolOrderController;
