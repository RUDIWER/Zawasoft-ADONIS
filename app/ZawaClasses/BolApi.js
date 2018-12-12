'use strict';
const Product = use('App/Models/Product');
const dateFormat = require('dateformat');
var CryptoJS = require('crypto-js');
const curl = new (require('curl-request'))(); // OPGEPAST CODE AANGEPAST MET PUT OPTIE !!!!!!!
// NOG TE BEKIJKEN KAN MISLOPEN BIJ NPM UPDATE

class BolApi {
	constructor(publicKey, privateKey) {
		this.publicKey = publicKey;
		this.privateKey = privateKey;
		this.http_uri = 'https://plazaapi.bol.com:443';
		this.contentType = 'application/xml';
		this.dateTemplate = 'GMT:ddd, dd mmm yyyy HH:MM:ss ';
	}

	authenticate(httpMethod, endPoint) {
		const now = new Date();
		var http_content_type = this.contentType;
		//X-Bol-Date
		var bol_date = dateFormat(now, this.dateTemplate) + 'GMT';
		//X-Bol-Authorization
		var bolSignature =
			httpMethod +
			'\n\n' +
			http_content_type +
			'\n' +
			bol_date +
			'\n' +
			'x-bol-date:' +
			bol_date +
			'\n' +
			endPoint;
		var bolAuthorization =
			this.publicKey + ':' + CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(bolSignature, this.privateKey));
		return bolAuthorization;
	}

	async request(httpMethod, endPoint, params, body) {
		const now = new Date();
		var bol_date = dateFormat(now, this.dateTemplate) + 'GMT';
		var path = this.http_uri + endPoint + params;
		if (httpMethod == 'GET') {
			const curlResult = await curl
				.setHeaders([
					'Content-type: ' + this.contentType,
					'X-BOL-Date:' + bol_date,
					'X-BOL-Authorization: ' + this.authenticate(httpMethod, endPoint)
				])
				.get(path)
				.then(({ statusCode, body, headers }) => {
					console.log('Result from GET => OK : ' + statusCode, body, headers);
					console.log(body);
					return [ statusCode, body ];
				})
				.catch((e) => {
					console.log(e);
				});

			/*    TEST INPUT
			const statuscode = 200;
			const body =
				'<?xml version="1.0" encoding="UTF-8"?>' +
				'<Orders xmlns="https://plazaapi.bol.com/services/xsd/v2/plazaapi.xsd">' +
				'<Order>' +
				'<OrderId>4123456789</OrderId>' +
				'<DateTimeCustomer>2017-02-09T12:39:48.000+01:00</DateTimeCustomer>' +
				'<DateTimeDropShipper>2017-02-09T12:39:48.000+01:00</DateTimeDropShipper>' +
				'<CustomerDetails>' +
				'<ShipmentDetails>' +
				'<SalutationCode>02</SalutationCode>' +
				'<Firstname>Billie</Firstname>' +
				'<Surname>Van der Bol.com</Surname>' +
				'<Streetname>Dorpstraat</Streetname>' +
				'<Housenumber>1</Housenumber>' +
				'<HousenumberExtended>B</HousenumberExtended>' +
				'<ZipCode>1111 ZZ</ZipCode>' +
				'<City>Utrecht</City>' +
				'<CountryCode>NL</CountryCode>' +
				'<Email>2awq74td4z4mizmx6dcdbsdbdcna@verkopen.bol.com</Email>' +
				'<Company>bol.com</Company>' +
				'</ShipmentDetails>' +
				'<BillingDetails>' +
				'<SalutationCode>02</SalutationCode>' +
				'<Firstname>Billie</Firstname>' +
				'<Surname>van der Bol.com</Surname>' +
				'<Streetname>Dorpstraat</Streetname>' +
				'<Housenumber>1</Housenumber>' +
				'<HousenumberExtended>B</HousenumberExtended>' +
				'<ZipCode>1111 ZZ</ZipCode>' +
				'<City>Utrecht</City>' +
				'<CountryCode>NL</CountryCode>' +
				'<Email>2awq74td4z4mizmx6dcdbsdbdcna@verkopen.bol.com</Email>' +
				'<Company>bol.com</Company>' +
				'</BillingDetails>' +
				'</CustomerDetails>' +
				'<OrderItems>' +
				'<OrderItem>' +
				'<OrderItemId>2012345678</OrderItemId>' +
				'<EAN>5412810182312</EAN>' +
				'<OfferReference>10</OfferReference>' +
				'<Title>Basicxl - Rijdende Wekker - Kunststof - 16x11cm - Zwart</Title>' +
				'<Quantity>1</Quantity>' +
				'<OfferPrice>27.95</OfferPrice>' +
				'<TransactionFee>5.18</TransactionFee>' +
				'<LatestDeliveryDate>2017-02-10+01:00</LatestDeliveryDate>' +
				'<OfferCondition>NEW</OfferCondition>' +
				'<CancelRequest>false</CancelRequest>' +
				'<FulfilmentMethod>FBR</FulfilmentMethod>' +
				'</OrderItem>' +
				'</OrderItems>' +
				'</Order>' +
				'<Order>' +
				'<OrderId>4123456790</OrderId>' +
				'<DateTimeCustomer>2017-03-09T12:39:48.000+01:00</DateTimeCustomer>' +
				'<DateTimeDropShipper>2017-03-09T12:39:48.000+01:00</DateTimeDropShipper>' +
				'<CustomerDetails>' +
				'<ShipmentDetails>' +
				'<SalutationCode>02</SalutationCode>' +
				'<Firstname>Bollie</Firstname>' +
				'<Surname>Van der Bil.com</Surname>' +
				'<Streetname>Statstraat</Streetname>' +
				'<Housenumber>2</Housenumber>' +
				'<HousenumberExtended>C</HousenumberExtended>' +
				'<ZipCode>2222 ZZ</ZipCode>' +
				'<City>Utrechd</City>' +
				'<CountryCode>NLL</CountryCode>' +
				'<Email>2awq74td4z4mizmx6dcdbsdbdcna@verkopen.bol.com</Email>' +
				'<Company>Zawadi</Company>' +
				'</ShipmentDetails>' +
				'<BillingDetails>' +
				'<SalutationCode>02</SalutationCode>' +
				'<Firstname>BOllie</Firstname>' +
				'<Surname>van der Bil.com</Surname>' +
				'<Streetname>Dorpstraat</Streetname>' +
				'<Housenumber>1</Housenumber>' +
				'<HousenumberExtended>B</HousenumberExtended>' +
				'<ZipCode>1111 ZZ</ZipCode>' +
				'<City>Utrecht</City>' +
				'<CountryCode>NL</CountryCode>' +
				'<Email>2awq74td4z4mizmx6dcdbsdbdcna@verkopen.bol.com</Email>' +
				'<Company>bol.com</Company>' +
				'</BillingDetails>' +
				'</CustomerDetails>' +
				'<OrderItems>' +
				'<OrderItem>' +
				'<OrderItemId>2012345678</OrderItemId>' +
				'<EAN>5412810182312</EAN>' +
				'<OfferReference>13</OfferReference>' +
				'<Title>Basicxl - Vliegende Wekker - Kunststof - 16x11cm - Zwart</Title>' +
				'<Quantity>2</Quantity>' +
				'<OfferPrice>39.95</OfferPrice>' +
				'<TransactionFee>5.18</TransactionFee>' +
				'<LatestDeliveryDate>2017-02-10+01:00</LatestDeliveryDate>' +
				'<OfferCondition>NEW</OfferCondition>' +
				'<CancelRequest>false</CancelRequest>' +
				'<FulfilmentMethod>FBR</FulfilmentMethod>' +
				'</OrderItem>' +
				'<OrderItem>' +
				'<OrderItemId>123456789012</OrderItemId>' +
				'<EAN>5412345678901</EAN>' +
				'<OfferReference>14</OfferReference>' +
				'<Title>Basicxl - Stilstaande Wekker - Kunststof - 16x11cm - Zwart</Title>' +
				'<Quantity>2</Quantity>' +
				'<OfferPrice>59.95</OfferPrice>' +
				'<TransactionFee>5.18</TransactionFee>' +
				'<LatestDeliveryDate>2017-02-10+01:00</LatestDeliveryDate>' +
				'<OfferCondition>NEW</OfferCondition>' +
				'<CancelRequest>false</CancelRequest>' +
				'<FulfilmentMethod>FBR</FulfilmentMethod>' +
				'</OrderItem>' +
				'</OrderItems>' +
				'</Order>' +
				'</Orders>';	
			const curlResult = [ statuscode, body ];
			*/
			return curlResult;
		} else if (httpMethod == 'PUT') {
			const curlResult = await curl
				.setHeaders([
					'Content-type: ' + this.contentType,
					'X-BOL-Date:' + bol_date,
					'X-BOL-Authorization: ' + this.authenticate(httpMethod, endPoint)
				])
				.setBody(body)
				.put(path)
				.then(({ statusCode, body, headers }) => {
					console.log('Result from PUT => OK : ' + statusCode, body, headers);
					return statusCode;
				})
				.catch((e) => {
					console.log(e);
				});
			return curlResult;
		} else if (httpMethod == 'DELETE') {
			const curlResult = await curl
				.setHeaders([
					'Content-type: ' + this.contentType,
					'X-BOL-Date:' + bol_date,
					'X-BOL-Authorization: ' + this.authenticate(httpMethod, endPoint)
				])
				.setBody(body)
				.delete(path)
				.then(({ statusCode, body, headers }) => {
					console.log('Result from DELETE => OK : ' + statusCode, body, headers);
					return statusCode;
				})
				.catch((e) => {
					console.log(e);
				});
			return curlResult;
		} else if (httpMethod == 'POST') {
			curl
				.setHeaders([
					'Content-type: ' + this.contentType,
					'X-BOL-Date:' + bol_date,
					'X-BOL-Authorization: ' + this.authenticate(httpMethod, endPoint)
				])
				.post(path)
				.then(({ statusCode, body, headers }) => {
					console.log('Result from POST => OK : ' + statusCode, body, headers);
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}

	async setProductBe(id) {
		const product = await Product.find(id);
		const available = product.stock_real > 0 ? 'true' : 'false';
		const productXml =
			'<UpsertRequest xmlns="https://plazaapi.bol.com/offers/xsd/api-2.0.xsd">' +
			'<RetailerOffer>' +
			'<EAN>' +
			product.ean13 +
			'</EAN>' +
			'<Condition>NEW</Condition>' +
			'<Price>' +
			product.sp_in_vat_bol_be +
			'</Price>' +
			'<DeliveryCode>' +
			product.bol_be_delivery_time +
			'</DeliveryCode>' +
			'<QuantityInStock>' +
			product.stock_real +
			'</QuantityInStock>' +
			'<Publish>' +
			available +
			'</Publish>' +
			'<ReferenceCode>' +
			product.id +
			'</ReferenceCode>' +
			'<Description>NOT NEW</Description>' +
			'<Title>' +
			product.name_nl +
			'</Title>' +
			'<FulfillmentMethod>FBR</FulfillmentMethod>' +
			'</RetailerOffer>' +
			'</UpsertRequest>';
		const result = await this.request('PUT', '/offers/v2/', '', productXml);
		return result;
	}

	async setProductNl(id) {
		const product = await Product.find(id);
		const available = product.stock_real > 0 ? 'true' : 'false';
		const productXml =
			'<UpsertRequest xmlns="https://plazaapi.bol.com/offers/xsd/api-2.0.xsd">' +
			'<RetailerOffer>' +
			'<EAN>' +
			product.ean13 +
			'</EAN>' +
			'<Condition>NEW</Condition>' +
			'<Price>' +
			product.sp_in_vat_bol_nl +
			'</Price>' +
			'<DeliveryCode>' +
			product.bol_nl_delivery_time +
			'</DeliveryCode>' +
			'<QuantityInStock>' +
			product.stock_real +
			'</QuantityInStock>' +
			'<Publish>' +
			available +
			'</Publish>' +
			'<ReferenceCode>' +
			product.id +
			'</ReferenceCode>' +
			'<Description>NOT NEW</Description>' +
			'<Title>' +
			product.name_nl +
			'</Title>' +
			'<FulfillmentMethod>FBR</FulfillmentMethod>' +
			'</RetailerOffer>' +
			'</UpsertRequest>';
		const result = await this.request('PUT', '/offers/v2/', '', productXml);
		return result;
	}

	async delProduct(id) {
		const product = await Product.find(id);
		const productXml =
			'<DeleteBulkRequest xmlns="https://plazaapi.bol.com/offers/xsd/api-2.0.xsd">' +
			'<RetailerOfferIdentifier>' +
			'<EAN>' +
			product.ean13 +
			'</EAN>' +
			'<Condition>NEW</Condition>' +
			'</RetailerOfferIdentifier>' +
			'</DeleteBulkRequest>';

		const result = await this.request('DELETE', '/offers/v2/', '', productXml);
		return result;
	}

	async getCommission(ean) {
		const result = await this.request('GET', '/commission/v2/' + ean, '');
		return result;
	}

	async getOrders() {
		const result = await this.request('GET', '/services/rest/orders/v2', '');
		return result;
	}
}

module.exports = BolApi;
