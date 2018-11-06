/*
 * @Author: neo
 * @Date: 2018-11-05 13:09:50
 * @LastEditors: neo
 * @LastEditTime: 2018-11-06 18:37:18
 */
(function() {
const 
ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
BASE = 58;
let ALPHABET_MAP = {};
for (let i = 0; i < ALPHABET.length; i++) {
	ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

function stringToBytes(str) {
	if (typeof str !== 'string') {
		throw new Error('invalide parameter');
	}
	let arr = [];
	for (let i = 0; i < str.length; i++) {
		const unicode = str.charCodeAt(i);
		let unicodeBinary = unicode.toString(2);
		const char = '10';
		if (unicode >= 0 && unicode <= 127) {
			let charOne = '00000000';
			let result = parseInt(charOne.slice(unicodeBinary.length) + unicodeBinary, 2);
			arr.push(result);
		} else if (unicode >= 128 && unicode <= 2047) {
			while (unicodeBinary.length < 11) {
				unicodeBinary = '0' + unicodeBinary;
			}
			let charOne = '110';
			let resultOne = parseInt(charOne + unicodeBinary.slice(0, 5), 2);
			let resultTwo = parseInt(char + unicodeBinary.slice(5), 2);
			arr.push(resultOne);
			arr.push(resultTwo);
		} else if (unicode >= 2048 && unicode <= 65535) {
			while (unicodeBinary.length < 16) {
				unicodeBinary = '0' + unicodeBinary;
			}
			let charOne = '1110';
			let resultOne = parseInt(charOne + unicodeBinary.slice(0, 4), 2);
			let resultTwo = parseInt(char + unicodeBinary.slice(4, 10), 2);
			let resultThree = parseInt(char + unicodeBinary.slice(10), 2);
			arr.push(resultOne);
			arr.push(resultTwo);
			arr.push(resultThree);
		} else if (unicode >= 65536 && unicode <= 1114111) {
			while (unicodeBinary.length < 21) {
				unicodeBinary = '0' + unicodeBinary;
			}
			let charOne = '11110';
			let resultOne = parseInt(charOne + unicodeBinary.slice(0, 3), 2);
			let resultTwo = parseInt(char + unicodeBinary.slice(3, 9), 2);
			let resultThree = parseInt(char + unicodeBinary.slice(9, 15), 2);
			let resultFour = parseInt(char + unicodeBinary.slice(15), 2);
			arr.push(resultOne);
			arr.push(resultTwo);
			arr.push(resultThree);
			arr.push(resultFour);
		}
	}
	return arr;
}

function bytesToString(arr) {
	if (typeof arr !== 'object') {
		throw new Error('expect array of bytes');
	}
	let str = '',
		count = 0,
		char = '';
	for (let i = 0; i < arr.length; i++) {
		const binary = arr[i].toString(2);
		if (count === 0) {
			if (binary.length >= 8) {
				if (binary.indexOf(0) === 0) {
					const r = binary.slice(binary.indexOf(1));
					str += String.fromCharCode(parseInt(r, 2));
				} else {
					count = binary.indexOf(0) - 1;
					char += binary.slice(binary.indexOf(0) + 1);
				}
			} else {
				str += String.fromCharCode(parseInt(binary, 2));
			}
		} else {
			if (--count === 0) {
				char += binary.slice(binary.indexOf(0) + 1);
				str += String.fromCharCode(parseInt(char, 2));
				char = '';
			} else {
				char += binary.slice(binary.indexOf(0) + 1);
			}
		}
	}
	return str;
}

function encode(str) {
	if (typeof str !== 'string') {
		throw new Error('expect string');
	}
	let buffer = stringToBytes(str);
	// let buffer = stringToBytesUtf8(str);
	if (buffer.length === 0) return '';
	let i,
		j,
		digits = [0];
	for (i = 0; i < buffer.length; i++) {
		for (j = 0; j < digits.length; j++) digits[j] <<= 8;
		digits[0] += buffer[i];
		let carry = 0;
		for (j = 0; j < digits.length; ++j) {
			digits[j] += carry;
			carry = (digits[j] / BASE) | 0;
			digits[j] %= BASE;
		}
		while (carry) {
			digits.push(carry % BASE);
			carry = (carry / BASE) | 0;
		}
	}
	for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);
	return digits
		.reverse()
		.map(function(digit) {
			return ALPHABET[digit];
		})
		.join('');
}

function decode(string) {
	if (typeof string !== 'string') {
		throw new Error('expect string');
	}
	if (string.length === 0) return [];
	let i,
		j,
		bytes = [0];
	for (i = 0; i < string.length; i++) {
		let c = string[i];
		if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');
		for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
		bytes[0] += ALPHABET_MAP[c];
		let carry = 0;
		for (j = 0; j < bytes.length; ++j) {
			bytes[j] += carry;
			carry = bytes[j] >> 8;
			bytes[j] &= 0xff;
		}
		while (carry) {
			bytes.push(carry & 0xff);
			carry >>= 8;
		}
	}
	for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0);
	return bytesToString(bytes.reverse());
}

bs = {};
bs.encode = encode;
bs.decode = decode;
return bs;
})();
