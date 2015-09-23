function DD(...args) {
	this.hi = 0.0;
	this.lo = 0.0;
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [hi, lo] = args;
				this.init(hi, lo);
			})(...args);
		case 1:
			if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [x] = args;
					this.init(x);
				})(...args);
			} else if (args[0] instanceof DD) {
				return ((...args) => {
					let [dd] = args;
					this.init(dd);
				})(...args);
			} else if (args[0] instanceof String) {
				return ((...args) => {
					let [str] = args;
					DD.call(this, DD.parse(str));
				})(...args);
			}
		case 0:
			return ((...args) => {
				let [] = args;
				this.init(0.0);
			})(...args);
	}
}
module.exports = DD
var Double = require('java/lang/Double');
var Character = require('java/lang/Character');
DD.prototype.le = function (y) {
	return this.hi < y.hi || this.hi === y.hi && this.lo <= y.lo;
};
DD.prototype.extractSignificantDigits = function (insertDecimalPoint, magnitude) {
	var y = this.abs();
	var mag = DD.magnitude(y.hi);
	var scale = DD.TEN.pow(mag);
	y = y.divide(scale);
	if (y.gt(DD.TEN)) {
		y = y.divide(DD.TEN);
		mag += 1;
	} else if (y.lt(DD.ONE)) {
		y = y.multiply(DD.TEN);
		mag -= 1;
	}
	var decimalPointPos = mag + 1;
	var buf = new StringBuffer();
	var numDigits = DD.MAX_PRINT_DIGITS - 1;
	for (var i = 0; i <= numDigits; i++) {
		if (insertDecimalPoint && i === decimalPointPos) {
			buf.append('.');
		}
		var digit = y.hi;
		if (digit < 0 || digit > 9) {}
		if (digit < 0) {
			break;
		}
		var rebiasBy10 = false;
		var digitChar = 0;
		if (digit > 9) {
			rebiasBy10 = true;
			digitChar = '9';
		} else {
			digitChar = '0' + digit;
		}
		buf.append(digitChar);
		y = y.subtract(DD.valueOf(digit)).multiply(DD.TEN);
		if (rebiasBy10) y.selfAdd(DD.TEN);
		var continueExtractingDigits = true;
		var remMag = DD.magnitude(y.hi);
		if (remMag < 0 && Math.abs(remMag) >= numDigits - i) continueExtractingDigits = false;
		if (!continueExtractingDigits) break;
	}
	magnitude[0] = mag;
	return buf.toString();
};
DD.prototype.sqr = function () {
	return this.multiply(this);
};
DD.prototype.doubleValue = function () {
	return this.hi + this.lo;
};
DD.prototype.subtract = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					return this.add(y.negate());
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					return this.add(-y);
				})(...args);
			}
	}
};
DD.prototype.equals = function (y) {
	return this.hi === y.hi && this.lo === y.lo;
};
DD.prototype.isZero = function () {
	return this.hi === 0.0 && this.lo === 0.0;
};
DD.prototype.selfSubtract = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					if (this.isNaN()) return this;
					return this.selfAdd(-y.hi, -y.lo);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					if (this.isNaN()) return this;
					return this.selfAdd(-y, 0.0);
				})(...args);
			}
	}
};
DD.prototype.getSpecialNumberString = function () {
	if (this.isZero()) return "0.0";
	if (this.isNaN()) return "NaN ";
	return null;
};
DD.prototype.min = function (x) {
	if (this.le(x)) {
		return this;
	} else {
		return x;
	}
};
DD.prototype.selfDivide = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [yhi, ylo] = args;
				var hc = null, tc = null, hy = null, ty = null, C = null, c = null, U = null, u = null;
				C = this.hi / yhi;
				c = DD.SPLIT * C;
				hc = c - C;
				u = DD.SPLIT * yhi;
				hc = c - hc;
				tc = C - hc;
				hy = u - yhi;
				U = C * yhi;
				hy = u - hy;
				ty = yhi - hy;
				u = hc * hy - U + hc * ty + tc * hy + tc * ty;
				c = (this.hi - U - u + this.lo - C * ylo) / yhi;
				u = C + c;
				this.hi = u;
				this.lo = C - u + c;
				return this;
			})(...args);
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					return this.selfDivide(y.hi, y.lo);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					return this.selfDivide(y, 0.0);
				})(...args);
			}
	}
};
DD.prototype.dump = function () {
	return "DD<" + this.hi + ", " + this.lo + ">";
};
DD.prototype.divide = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					var hc = null, tc = null, hy = null, ty = null, C = null, c = null, U = null, u = null;
					C = this.hi / y.hi;
					c = DD.SPLIT * C;
					hc = c - C;
					u = DD.SPLIT * y.hi;
					hc = c - hc;
					tc = C - hc;
					hy = u - y.hi;
					U = C * y.hi;
					hy = u - hy;
					ty = y.hi - hy;
					u = hc * hy - U + hc * ty + tc * hy + tc * ty;
					c = (this.hi - U - u + this.lo - C * y.lo) / y.hi;
					u = C + c;
					var zhi = u;
					var zlo = C - u + c;
					return new DD(zhi, zlo);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					if (Double.isNaN(y)) return DD.createNaN();
					return DD.copy(this).selfDivide(y, 0.0);
				})(...args);
			}
	}
};
DD.prototype.ge = function (y) {
	return this.hi > y.hi || this.hi === y.hi && this.lo >= y.lo;
};
DD.prototype.pow = function (exp) {
	if (exp === 0.0) return DD.valueOf(1.0);
	var r = new DD(this);
	var s = DD.valueOf(1.0);
	var n = Math.abs(exp);
	if (n > 1) {
		while (n > 0) {
			if (n % 2 === 1) {
				s.selfMultiply(r);
			}
			n /= 2;
			if (n > 0) r = r.sqr();
		}
	} else {
		s = r;
	}
	if (exp < 0) return s.reciprocal();
	return s;
};
DD.prototype.ceil = function () {
	if (this.isNaN()) return DD.NaN;
	var fhi = Math.ceil(this.hi);
	var flo = 0.0;
	if (fhi === this.hi) {
		flo = Math.ceil(this.lo);
	}
	return new DD(fhi, flo);
};
DD.prototype.compareTo = function (o) {
	var other = o;
	if (this.hi < other.hi) return -1;
	if (this.hi > other.hi) return 1;
	if (this.lo < other.lo) return -1;
	if (this.lo > other.lo) return 1;
	return 0;
};
DD.prototype.rint = function () {
	if (this.isNaN()) return this;
	var plus5 = this.add(0.5);
	return plus5.floor();
};
DD.prototype.setValue = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [value] = args;
					this.init(value);
					return this;
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [value] = args;
					this.init(value);
					return this;
				})(...args);
			}
	}
};
DD.prototype.max = function (x) {
	if (this.ge(x)) {
		return this;
	} else {
		return x;
	}
};
DD.prototype.sqrt = function () {
	if (this.isZero()) return DD.valueOf(0.0);
	if (this.isNegative()) {
		return DD.NaN;
	}
	var x = 1.0 / Math.sqrt(this.hi);
	var ax = this.hi * x;
	var axdd = DD.valueOf(ax);
	var diffSq = this.subtract(axdd.sqr());
	var d2 = diffSq.hi * x * 0.5;
	return axdd.add(d2);
};
DD.prototype.selfAdd = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [yhi, ylo] = args;
				var H = null, h = null, T = null, t = null, S = null, s = null, e = null, f = null;
				S = this.hi + yhi;
				T = this.lo + ylo;
				e = S - this.hi;
				f = T - this.lo;
				s = S - e;
				t = T - f;
				s = yhi - e + this.hi - s;
				t = ylo - f + this.lo - t;
				e = s + T;
				H = S + e;
				h = e + S - H;
				e = t + h;
				var zhi = H + e;
				var zlo = e + H - zhi;
				this.hi = zhi;
				this.lo = zlo;
				return this;
			})(...args);
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					return this.selfAdd(y.hi, y.lo);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					var H = null, h = null, S = null, s = null, e = null, f = null;
					S = this.hi + y;
					e = S - this.hi;
					s = S - e;
					s = y - e + this.hi - s;
					f = s + this.lo;
					H = S + f;
					h = f + S - H;
					this.hi = H + h;
					this.lo = h + H - this.hi;
					return this;
				})(...args);
			}
	}
};
DD.prototype.selfMultiply = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [yhi, ylo] = args;
				var hx = null, tx = null, hy = null, ty = null, C = null, c = null;
				C = DD.SPLIT * this.hi;
				hx = C - this.hi;
				c = DD.SPLIT * yhi;
				hx = C - hx;
				tx = this.hi - hx;
				hy = c - yhi;
				C = this.hi * yhi;
				hy = c - hy;
				ty = yhi - hy;
				c = hx * hy - C + hx * ty + tx * hy + tx * ty + this.hi * ylo + this.lo * yhi;
				var zhi = C + c;
				hx = C - zhi;
				var zlo = c + hx;
				this.hi = zhi;
				this.lo = zlo;
				return this;
			})(...args);
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					return this.selfMultiply(y.hi, y.lo);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					return this.selfMultiply(y, 0.0);
				})(...args);
			}
	}
};
DD.prototype.selfSqr = function () {
	return this.selfMultiply(this);
};
DD.prototype.floor = function () {
	if (this.isNaN()) return DD.NaN;
	var fhi = Math.floor(this.hi);
	var flo = 0.0;
	if (fhi === this.hi) {
		flo = Math.floor(this.lo);
	}
	return new DD(fhi, flo);
};
DD.prototype.negate = function () {
	if (this.isNaN()) return this;
	return new DD(-this.hi, -this.lo);
};
DD.prototype.clone = function () {
	try {
		return DD.super_.prototype.clone.call(this);
	} catch (e) {
		if (e instanceof CloneNotSupportedException) {
			return null;
		}
	} finally {}
};
DD.prototype.multiply = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					if (y.isNaN()) return DD.createNaN();
					return DD.copy(this).selfMultiply(y);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					if (Double.isNaN(y)) return DD.createNaN();
					return DD.copy(this).selfMultiply(y, 0.0);
				})(...args);
			}
	}
};
DD.prototype.isNaN = function () {
	return Double.isNaN(this.hi);
};
DD.prototype.intValue = function () {
	return this.hi;
};
DD.prototype.toString = function () {
	var mag = DD.magnitude(this.hi);
	if (mag >= -3 && mag <= 20) return this.toStandardNotation();
	return this.toSciNotation();
};
DD.prototype.toStandardNotation = function () {
	var specialStr = this.getSpecialNumberString();
	if (specialStr !== null) return specialStr;
	var magnitude = [];
	var sigDigits = this.extractSignificantDigits(true, magnitude);
	var decimalPointPos = magnitude[0] + 1;
	var num = sigDigits;
	if (sigDigits.charAt(0) === '.') {
		num = "0" + sigDigits;
	} else if (decimalPointPos < 0) {
		num = "0." + DD.stringOfChar('0', -decimalPointPos) + sigDigits;
	} else if (sigDigits.indexOf('.') === -1) {
		var numZeroes = decimalPointPos - sigDigits.length();
		var zeroes = DD.stringOfChar('0', numZeroes);
		num = sigDigits + zeroes + ".0";
	}
	if (this.isNegative()) return "-" + num;
	return num;
};
DD.prototype.reciprocal = function () {
	var hc = null, tc = null, hy = null, ty = null, C = null, c = null, U = null, u = null;
	C = 1.0 / this.hi;
	c = DD.SPLIT * C;
	hc = c - C;
	u = DD.SPLIT * this.hi;
	hc = c - hc;
	tc = C - hc;
	hy = u - this.hi;
	U = C * this.hi;
	hy = u - hy;
	ty = this.hi - hy;
	u = hc * hy - U + hc * ty + tc * hy + tc * ty;
	c = (1.0 - U - u - C * this.lo) / this.hi;
	var zhi = C + c;
	var zlo = C - zhi + c;
	return new DD(zhi, zlo);
};
DD.prototype.toSciNotation = function () {
	if (this.isZero()) return DD.SCI_NOT_ZERO;
	var specialStr = this.getSpecialNumberString();
	if (specialStr !== null) return specialStr;
	var magnitude = [];
	var digits = this.extractSignificantDigits(false, magnitude);
	var expStr = DD.SCI_NOT_EXPONENT_CHAR + magnitude[0];
	if (digits.charAt(0) === '0') {
		throw new IllegalStateException("Found leading zero: " + digits);
	}
	var trailingDigits = "";
	if (digits.length() > 1) trailingDigits = digits.substring(1);
	var digitsWithDecimal = digits.charAt(0) + "." + trailingDigits;
	if (this.isNegative()) return "-" + digitsWithDecimal + expStr;
	return digitsWithDecimal + expStr;
};
DD.prototype.abs = function () {
	if (this.isNaN()) return DD.NaN;
	if (this.isNegative()) return this.negate();
	return new DD(this);
};
DD.prototype.isPositive = function () {
	return this.hi > 0.0 || this.hi === 0.0 && this.lo > 0.0;
};
DD.prototype.lt = function (y) {
	return this.hi < y.hi || this.hi === y.hi && this.lo < y.lo;
};
DD.prototype.add = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof DD) {
				return ((...args) => {
					let [y] = args;
					return DD.copy(this).selfAdd(y);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [y] = args;
					return DD.copy(this).selfAdd(y);
				})(...args);
			}
	}
};
DD.prototype.init = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [hi, lo] = args;
				this.hi = hi;
				this.lo = lo;
			})(...args);
		case 1:
			if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [x] = args;
					this.hi = x;
					this.lo = 0.0;
				})(...args);
			} else if (args[0] instanceof DD) {
				return ((...args) => {
					let [dd] = args;
					this.hi = dd.hi;
					this.lo = dd.lo;
				})(...args);
			}
	}
};
DD.prototype.gt = function (y) {
	return this.hi > y.hi || this.hi === y.hi && this.lo > y.lo;
};
DD.prototype.isNegative = function () {
	return this.hi < 0.0 || this.hi === 0.0 && this.lo < 0.0;
};
DD.prototype.trunc = function () {
	if (this.isNaN()) return DD.NaN;
	if (this.isPositive()) return this.floor(); else return this.ceil();
};
DD.prototype.signum = function () {
	if (this.hi > 0) return 1;
	if (this.hi < 0) return -1;
	if (this.lo > 0) return 1;
	if (this.lo < 0) return -1;
	return 0;
};
DD.sqr = function (x) {
	return DD.valueOf(x).selfMultiply(x);
};
DD.valueOf = function (...args) {
	switch (args.length) {
		case 1:
			if (args[0] instanceof String) {
				return ((...args) => {
					let [str] = args;
					return DD.parse(str);
				})(...args);
			} else if (!Number.isInteger(args[0])) {
				return ((...args) => {
					let [x] = args;
					return new DD(x);
				})(...args);
			}
	}
};
DD.sqrt = function (x) {
	return DD.valueOf(x).sqrt();
};
DD.parse = function (str) {
	var i = 0;
	var strlen = str.length();
	while (Character.isWhitespace(str.charAt(i))) i++;
	var isNegative = false;
	if (i < strlen) {
		var signCh = str.charAt(i);
		if (signCh === '-' || signCh === '+') {
			i++;
			if (signCh === '-') isNegative = true;
		}
	}
	var val = new DD();
	var numDigits = 0;
	var numBeforeDec = 0;
	var exp = 0;
	while (true) {
		if (i >= strlen) break;
		var ch = str.charAt(i);
		i++;
		if (Character.isDigit(ch)) {
			var d = ch - '0';
			val.selfMultiply(DD.TEN);
			val.selfAdd(d);
			numDigits++;
			continue;
		}
		if (ch === '.') {
			numBeforeDec = numDigits;
			continue;
		}
		if (ch === 'e' || ch === 'E') {
			var expStr = str.substring(i);
			try {
				exp = Integer.parseInt(expStr);
			} catch (e) {
				if (e instanceof NumberFormatException) {
					throw new NumberFormatException("Invalid exponent " + expStr + " in string " + str);
				}
			} finally {}
			break;
		}
		throw new NumberFormatException("Unexpected character '" + ch + "' at position " + i + " in string " + str);
	}
	var val2 = val;
	var numDecPlaces = numDigits - numBeforeDec - exp;
	if (numDecPlaces === 0) {
		val2 = val;
	} else if (numDecPlaces > 0) {
		var scale = DD.TEN.pow(numDecPlaces);
		val2 = val.divide(scale);
	} else if (numDecPlaces < 0) {
		var scale = DD.TEN.pow(-numDecPlaces);
		val2 = val.multiply(scale);
	}
	if (isNegative) {
		return val2.negate();
	}
	return val2;
};
DD.createNaN = function () {
	return new DD(Double.NaN, Double.NaN);
};
DD.copy = function (dd) {
	return new DD(dd);
};
DD.magnitude = function (x) {
	var xAbs = Math.abs(x);
	var xLog10 = Math.log(xAbs) / Math.log(10);
	var xMag = Math.floor(xLog10);
	var xApprox = Math.pow(10, xMag);
	if (xApprox * 10 <= xAbs) xMag += 1;
	return xMag;
};
DD.stringOfChar = function (ch, len) {
	var buf = new StringBuffer();
	for (var i = 0; i < len; i++) {
		buf.append(ch);
	}
	return buf.toString();
};
DD.PI = new DD(3.141592653589793116e+00, 1.224646799147353207e-16);
DD.TWO_PI = new DD(6.283185307179586232e+00, 2.449293598294706414e-16);
DD.PI_2 = new DD(1.570796326794896558e+00, 6.123233995736766036e-17);
DD.E = new DD(2.718281828459045091e+00, 1.445646891729250158e-16);
DD.NaN = new DD(Double.NaN, Double.NaN);
DD.EPS = 1.23259516440783e-32;
DD.SPLIT = 134217729.0;
DD.MAX_PRINT_DIGITS = 32;
DD.TEN = DD.valueOf(10.0);
DD.ONE = DD.valueOf(1.0);
DD.SCI_NOT_EXPONENT_CHAR = "E";
DD.SCI_NOT_ZERO = "0.0E0";

