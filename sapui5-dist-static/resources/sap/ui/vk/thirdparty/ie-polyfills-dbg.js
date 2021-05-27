
	if (!Uint8Array.prototype.slice) {
		// IE11 polyfill
		Object.defineProperty(Uint8Array.prototype, "slice", {
			value: function(begin, end) {
				return new Uint8Array(Array.prototype.slice.call(this, begin, end));
			}
		});
	}

	if (!Uint8Array.prototype.indexOf) {
		// IE11 polyfill
		Object.defineProperty(Uint8Array.prototype, "indexOf", {
			value: function(obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i++) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			}
		});
	}

	if (!Array.prototype.includes) {
		// IE11 polyfill
		Object.defineProperty(Array.prototype, "includes", {
			enumerable: false,
			value: function(obj) {
				var newArr = this.filter(function(el) {
					return el == obj;
				});
				return newArr.length > 0;
			}
		});
	}

	if (!Uint32Array.prototype.forEach) {
		// IE11 polyfill
		Object.defineProperty(Uint32Array.prototype, "forEach", {
			value: function (callback, thisArg) {
				for (var i = 0; i < this.length; i++) {
					callback.call(thisArg, this[i], i, this);
				}
			}
		});
	}

	if (!Uint32Array.prototype.fill) {
		// IE11 polyfill
		Object.defineProperty(Uint32Array.prototype, 'fill', {
		  value: function(value) {
			if (this == null) {
			  throw new TypeError('this is null or not defined');
			}
			var O = Object(this);
			var len = O.length >>> 0;
			var start = arguments[1];
			var relativeStart = start >> 0;
			var k = relativeStart < 0 ?
				Math.max(len + relativeStart, 0) :
				Math.min(relativeStart, len);
			var end = arguments[2];
			var relativeEnd = end === undefined ?
			  len : end >> 0;
			var finalValue = relativeEnd < 0 ?
			  Math.max(len + relativeEnd, 0) :
			  Math.min(relativeEnd, len);
			while (k < finalValue) {
			  O[k] = value;
			  k++;
			}
			return O;
		  }
		});
	  }

