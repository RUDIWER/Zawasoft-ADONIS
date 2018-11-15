'use strict';

function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = 'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:; ';
	var to = 'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa-------';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}
	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/-+/g, '-'); // collapse dashes
	// If there is a id put id in front of slug
	if ($('#id').val()) {
		str = $('#id').val() + '-' + str;
	}
	return str;
}

function checkEan(eanCode) {
	// Check if only digits
	var ValidChars = '0123456789';
	for (i = 0; i < eanCode.length; i++) {
		digit = eanCode.charAt(i);
		if (ValidChars.indexOf(digit) == -1) {
			return false;
		}
	}

	// Add five 0 if the code has only 8 digits
	if (eanCode.length == 8) {
		eanCode = '00000' + eanCode;
	} else if (eanCode.length != 13) {
		// Check for 13 digits otherwise
		return false;
	}

	// Get the check number
	originalCheck = eanCode.substring(eanCode.length - 1);
	eanCode = eanCode.substring(0, eanCode.length - 1);

	// Add even numbers together
	even =
		Number(eanCode.charAt(1)) +
		Number(eanCode.charAt(3)) +
		Number(eanCode.charAt(5)) +
		Number(eanCode.charAt(7)) +
		Number(eanCode.charAt(9)) +
		Number(eanCode.charAt(11));
	// Multiply this result by 3
	even *= 3;

	// Add odd numbers together
	odd =
		Number(eanCode.charAt(0)) +
		Number(eanCode.charAt(2)) +
		Number(eanCode.charAt(4)) +
		Number(eanCode.charAt(6)) +
		Number(eanCode.charAt(8)) +
		Number(eanCode.charAt(10));

	// Add two totals together
	total = even + odd;

	// Calculate the checksum
	// Divide total by 10 and store the remainder
	checksum = total % 10;
	// If result is not 0 then take away 10
	if (checksum != 0) {
		checksum = 10 - checksum;
	}

	// Return the result
	if (checksum != originalCheck) {
		return false;
	}

	return true;
}
