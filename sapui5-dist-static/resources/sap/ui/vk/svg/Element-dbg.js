/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the sap.ui.vk.svg.Element class.
sap.ui.define([
	"../abgrToColor",
	"../cssColorToColor",
	"../NodeContentType",
	"sap/base/util/uid"
], function(
	abgrToColor,
	cssColorToColor,
	NodeContentType,
	uid
) {
	"use strict";

	var Element = function(parameters) {
		parameters = parameters || {};

		this.type = "Group";
		this.uid = uid();
		this.sid = parameters.sid || undefined;
		this.name = parameters.name || undefined;
		this.vMask = (1 | 0); // visibility mask
		this.sMask = (0 | 0); // selection mask
		this.matrix = new Float32Array(parameters.matrix || [ 1, 0, 0, 1, 0, 0 ]);
		this.parent = null;
		this.children = [];
		this.domRef = null;
		this.nodeContentType = NodeContentType.Regular;
		this.materialId = parameters.materialID;
		if (parameters.lineStyle) {
			this.lineStyle = parameters.lineStyle;
		}
		if (parameters.fillStyle) {
			this.fillStyle = parameters.fillStyle;
		}
		this.userData = parameters.subelement ? { skipIt: true } : {};
	};

	function convertColor(c, defaultAlpha) {
		if (c) {
			if (typeof c === "string") {
				c = cssColorToColor(c);
				return new Float32Array([ c.red / 255, c.green / 255, c.blue / 255, c.alpha ]);
			} else if (c.length === 4) {
				return new Float32Array(c);
			} else {
				return new Float32Array([ c[ 0 ], c[ 1 ], c[ 2 ], defaultAlpha ]);
			}
		}
		return new Float32Array([ 0, 0, 0, defaultAlpha ]);
	}

	Element.prototype.isFillable = function() {
		return true;
	};

	Element.prototype.defaultFillAlpha = 0;

	Element.prototype.setMaterial = function(material, invalidate) {
		material = material || {};

		// Update material only if original material id is matching.
		if (this.materialId === material.materialId) {
			var fillStyle = this.fillStyle;
			if (fillStyle) {
				this.fill = convertColor(fillStyle.colour, 1);
			} else {
				this.fill = new Float32Array([ 0, 0, 0, 0 ]); // no fill
			}

			var lineStyle = this.lineStyle;
			if (lineStyle) {
				this.stroke = convertColor(lineStyle.colour, 1);
				this.strokeWidth = lineStyle.width || 1;
				this.strokeDashArray = Element._convertDashes(lineStyle.dashes || [], this.strokeWidth);
			} else {
				this.stroke = convertColor(material.lineColor, 1);
				this.strokeWidth = material.lineWidth !== undefined ? material.lineWidth : 1;
				this.strokeDashArray = (material.lineStyle && material.lineStyle.dashPattern) || [];
			}

			if (material.lineStyle && material.lineStyle.widthCoordinateSpace !== undefined) {
				this.widthCoordinateSpace = material.lineStyle.widthCoordinateSpace;
			}
		}

		// Propagate this call to children as they may use this material
		for (var i = 0, l = this.children.length; i < l; i++) {
			this.children[ i ].setMaterial(material);
		}

		if (invalidate) {
			this.invalidate();
		}
	};

	Element._convertDashes = function(dashes, strokeWidth) {
		var dashArray = [];
		for (var i = 0; i < dashes.length; i++) {
			var n = dashes[i] * 10;
			if (n > 0) {
				dashArray.push(n);
				dashArray.push(0);
			} else if (n < 0) {
				dashArray.push(0);
				dashArray.push(-n);
			} else {
				// just a dot
				dashArray.push(strokeWidth);
				dashArray.push(strokeWidth);
			}
		}
		return dashArray;
	};

	Element.prototype.add = function(element) {
		if (element.parent !== null) {
			element.parent.remove(element);
		}

		element.parent = this;
		this.children.push(element);

		// copy current selection state to child element
		element.sMask = this.sMask;
		if (this.highlightColor) {
			element.highlightColor = this.highlightColor;
		}

		return this;
	};

	Element.prototype.remove = function(element) {
		var index = this.children.indexOf(element);
		if (index !== -1) {
			element.parent = null;
			this.children.splice(index, 1);

			this.invalidate();
		}

		return this;
	};

	Element.prototype.replace = function(element, newElement) {
		var index = this.children.indexOf(element);
		if (index !== -1) {
			element.parent = null;
			newElement.parent = this;
			this.children[ index ] = newElement;

			newElement.domRef = element.domRef;
			newElement.invalidate();
		}

		return this;
	};

	Element.prototype._vkPersistentId = function() {
		/* eslint-disable consistent-this */
		var obj2D = this;
		do {
			if (obj2D.sid) {
				return obj2D.sid;
			}
			obj2D = obj2D.parent;
		} while (obj2D);
		/* eslint-enable consistent-this */
		return null;
	};

	Element.prototype._vkGetNodeContentType = function() {
		return this.nodeContentType;
	};

	Element.prototype._initAsHotspot = function(opacity) {
		function resetColor(color) {
			if (color) { // set to opaque black
				color[0] = 0;
				color[1] = 0;
				color[2] = 0;
				color[3] = color[3] > 0 ? 1 : 1e-4;
			}
		}

		if (opacity !== undefined) {
			this.opacity = opacity;
		}

		this.traverse(function(node) {
			if (node !== this) {
				node.userData.skipIt = true;
			}
			resetColor(node.fill);
			resetColor(node.stroke);
		}.bind(this));
	};

	Element.prototype._vkSetNodeContentType = function(nodeContentType) {
		this.nodeContentType = nodeContentType;
		if (nodeContentType === NodeContentType.Hotspot) {
			this._initAsHotspot(0);
		}
	};

	Element.prototype.traverse = function(callback) {
		callback(this);

		var children = this.children;
		for (var i = 0, l = children.length; i < l; i++) {
			children[ i ].traverse(callback);
		}
	};

	Element.prototype.traverseAncestors = function(callback) {
		var parent = this.parent;
		if (parent !== null) {
			callback(parent);
			parent.traverseAncestors(callback);
		}
	};

	Element.prototype.traverseVisible = function(callback, mask) {
		if (this.isVisible(mask)) {
			callback(this);

			var children = this.children;
			for (var i = 0, l = children.length; i < l; i++) {
				children[ i ].traverseVisible(callback, mask);
			}
		}
	};

	Element.prototype.setVisible = function(mask, visible) {
		if (!this.userData.skipIt) {
			if (visible) {
				this.vMask |= mask;
			} else {
				this.vMask &= ~mask;
			}
			if (this.domRef !== null) {
				if (visible) {
					this.domRef.removeAttribute("display");
				} else {
					this.domRef.setAttribute("display", "none");
				}
			}
		}
	};

	Element.prototype.isVisible = function(mask) {
		return this.userData.skipIt || (this.vMask & mask) !== 0;
	};

	Element.prototype._updateColor = function(mask) {
		if (this.domRef !== null) {
			if (this.fill !== undefined) {
				this.domRef.setAttribute("fill", this._cssColor(this.fill, mask));
			}
			if (this.stroke !== undefined && this.stroke[ 3 ] > 0 && this.strokeWidth) {
				this.domRef.setAttribute("stroke", this._cssColor(this.stroke, mask));
			}
		}
	};

	Element.prototype.setSelected = function(mask, selected, highlightColor) {
		if (selected) {
			this.sMask |= mask;
			this.highlightColor = highlightColor;
		} else {
			this.sMask &= ~mask;
			delete this.highlightColor;
		}
		this._updateColor(mask);

		if (this.nodeContentType === NodeContentType.Hotspot) {
			this.setOpacity(mask, this.opacity);
		}
	};

	Element.prototype.isSelected = function(mask) {
		return (this.sMask & mask) !== 0;
	};

	Element.prototype.setTintColor = function(mask, tintColor) {
		this.tintColor = tintColor;
		this._updateColor(mask);
	};

	Element.prototype._setOpacity = function(mask, opacity) {
		if (this.domRef !== null) {
			if (opacity !== undefined) {
				this.domRef.setAttribute("opacity", this.nodeContentType === NodeContentType.Hotspot && this.isSelected(mask) ? (opacity * 0.5 + 0.5) : opacity);
			} else {
				this.domRef.removeAttribute("opacity");
			}
		}
	};

	Element.prototype._isGeometryNode = function() {
		return this.type !== "Group";
	};

	Element.prototype._getFurthestParentWithOpacity = function() {
		var parent = this.parent;
		var opacity;
		while (parent) {
			if (parent.opacity) {
				opacity = parent.opacity;
			}
			parent = parent.parent;
		}
		return opacity;
	};

	Element.prototype.setOpacity = function(mask, opacity) {
		if (this._isGeometryNode()) {
			return;
		}

		var allLeafNodes = [];

		this.opacity = opacity;

		if (this.nodeContentType === NodeContentType.Hotspot) {
			this._setOpacity(mask, opacity);
			return;
		}

		this.traverse(function(child) {
			if (child._isGeometryNode()) {
				allLeafNodes.push(child);
			}
		});

		allLeafNodes.forEach(function(l) {
			var setOpacity = opacity;
			if (opacity === undefined) {
				if (l.opacity) {
					setOpacity = l.opacity;
				} else {
					setOpacity = l._getFurthestParentWithOpacity();
				}
			}
			l._setOpacity(mask, setOpacity);
		});
	};

	function isIdentityMatrix(matrix) {
		return matrix[ 0 ] === 1 && matrix[ 1 ] === 0 && matrix[ 2 ] === 0 && matrix[ 3 ] === 1 && matrix[ 4 ] === 0 && matrix[ 5 ] === 0;
	}

	Element.prototype.setMatrix = function(matrix) {
		this.matrix = matrix;
		if (this.domRef !== null) {
			if (!isIdentityMatrix(matrix)) {
				this.domRef.setAttribute("transform", "matrix(" + this.matrix.join(",") + ")");
			} else {
				this.domRef.removeAttribute("transform");
			}
		}
	};

	Element._multiplyMatrices = function(a, b) {
		var a11 = a[ 0 ], a12 = a[ 2 ], a13 = a[ 4 ];
		var a21 = a[ 1 ], a22 = a[ 3 ], a23 = a[ 5 ];

		var b11 = b[ 0 ], b12 = b[ 2 ], b13 = b[ 4 ];
		var b21 = b[ 1 ], b22 = b[ 3 ], b23 = b[ 5 ];

		return new Float32Array([
			a11 * b11 + a12 * b21,
			a21 * b11 + a22 * b21,
			a11 * b12 + a12 * b22,
			a21 * b12 + a22 * b22,
			a11 * b13 + a12 * b23 + a13,
			a21 * b13 + a22 * b23 + a23
		]);
	};

	Element._invertMatrix = function(m) {
		var m11 = m[ 0 ], m21 = m[ 1 ],
			m12 = m[ 2 ], m22 = m[ 3 ],
			m13 = m[ 4 ], m23 = m[ 5 ],
			det = m11 * m22 - m21 * m12;

		if (det === 0) {
			return new Float32Array([ 0, 0, 0, 0, 0, 0 ]);
		}

		var detInv = 1 / det;
		var te = new Float32Array(6);
		te[ 0 ] = m22 * detInv;
		te[ 1 ] = -m21 * detInv;
		te[ 2 ] = -m12 * detInv;
		te[ 3 ] = m11 * detInv;
		te[ 4 ] = (m23 * m12 - m22 * m13) * detInv;
		te[ 5 ] = (m21 * m13 - m23 * m11) * detInv;
		return te;
	};

	Element._decompose = function(matrix) {
		var sx = Math.sqrt(matrix[ 0 ] * matrix[ 0 ] + matrix[ 1 ] * matrix[ 1 ]);
		var sy = Math.sqrt(matrix[ 2 ] * matrix[ 2 ] + matrix[ 3 ] * matrix[ 3 ]);
		var m11 = matrix[ 0 ] / sx, m21 = matrix[ 1 ] / sx,
			m12 = matrix[ 2 ] / sy, m22 = matrix[ 3 ] / sy;

		var q, s;
		if (m11 + m22 + 1 > 0) {
			s = 0.5 / Math.sqrt(2 + m11 + m22);
			q = [ 0, 0, (m21 - m12) * s, 0.25 / s ];
		} else {
			s = 2.0 * Math.sqrt(2 - m11 - m22);
			q = [ 0, 0, 0.25 * s, (m21 - m12) / s ];
		}

		return {
			position: [ matrix[ 4 ], matrix[ 5 ], 0 ],
			quaternion: q,
			scale: [ sx, sy, 1 ]
		};
	};

	Element._compose = function(position, quaternion, scale) {
		var sx = scale[ 0 ], sy = scale[ 1 ];
		var qz = quaternion[ 2 ], qw = quaternion[ 3 ];
		var zz = qz * qz * 2, wz = qw * qz * 2;
		return new Float32Array([ (1 - zz) * sx, wz * sx, -wz * sy, (1 - zz) * sy, position[ 0 ], position[ 1 ] ]);
	};

	Element._transformPoint = function(px, py, matrix) {
		return {
			x: px * matrix[ 0 ] + py * matrix[ 2 ] + matrix[ 4 ],
			y: px * matrix[ 1 ] + py * matrix[ 3 ] + matrix[ 5 ]
		};
	};

	Element.prototype._matrixWorld = function(matrixParent) {
		if (matrixParent !== undefined) {
			return Element._multiplyMatrices(matrixParent, this.matrix);
		} else {
			var parent = this.parent;
			var matrix = this.matrix;
			while (parent !== null) {
				matrix = Element._multiplyMatrices(parent.matrix, matrix);
				parent = parent.parent;
			}
			return matrix;
		}
	};

	function expandBoundingBoxWS(boundingBox, x, y, ex, ey) {
		boundingBox.min.x = Math.min(boundingBox.min.x, x - ex);
		boundingBox.min.y = Math.min(boundingBox.min.y, y - ey);
		boundingBox.max.x = Math.max(boundingBox.max.x, x + ex);
		boundingBox.max.y = Math.max(boundingBox.max.y, y + ey);
	}

	function sqr(a) {
		return a * a;
	}

	Element.prototype._expandBoundingBoxCE = function(boundingBox, matrixWorld, centerX, centerY, extX, extY) {
		expandBoundingBoxWS(boundingBox,
			centerX * matrixWorld[ 0 ] + centerY * matrixWorld[ 2 ] + matrixWorld[ 4 ],
			centerX * matrixWorld[ 1 ] + centerY * matrixWorld[ 3 ] + matrixWorld[ 5 ],
			Math.abs(extX * matrixWorld[ 0 ]) + Math.abs(extY * matrixWorld[ 2 ]),
			Math.abs(extX * matrixWorld[ 1 ]) + Math.abs(extY * matrixWorld[ 3 ]));
	};

	Element.prototype._expandBoundingBoxCR = function(boundingBox, matrixWorld, centerX, centerY, radiusX, radiusY) {
		expandBoundingBoxWS(boundingBox,
			centerX * matrixWorld[ 0 ] + centerY * matrixWorld[ 2 ] + matrixWorld[ 4 ],
			centerX * matrixWorld[ 1 ] + centerY * matrixWorld[ 3 ] + matrixWorld[ 5 ],
			Math.sqrt(sqr(radiusX * matrixWorld[ 0 ]) + sqr(radiusY * matrixWorld[ 2 ])),
			Math.sqrt(sqr(radiusX * matrixWorld[ 1 ]) + sqr(radiusY * matrixWorld[ 3 ])));
	};

	Element.prototype._expandBoundingBox = function(boundingBox, matrixWorld) {
	};

	Element.prototype._expandBoundingBoxRecursive = function(boundingBox, mask, matrixParent) {
		if (this.isVisible(mask)) {
			var matrixWorld = this._matrixWorld(matrixParent);
			this._expandBoundingBox(boundingBox, matrixWorld);
			var children = this.children;
			for (var i = 0, l = children.length; i < l; i++) {
				children[ i ]._expandBoundingBoxRecursive(boundingBox, mask, matrixWorld);
			}
		}
	};

	Element.prototype._getSceneTreeElement = function() {
		/* eslint-disable consistent-this */
		var element = this;
		/* eslint-enable consistent-this */

		var parent = element.parent;
		while (parent) {
			if (parent.userData.closed) {
				element = parent;
			}
			parent = parent.parent;
		}

		while (element.userData.skipIt) {
			element = element.parent;
		}

		return element;
	};

	Element.prototype._findRectElementsRecursive = function(selection, rect, mask, matrixParent) {
		if (this.isVisible(mask)) {
			var matrixWorld = this._matrixWorld(matrixParent);
			var children = this.children;
			var boundingBox = {
				min: { x: Infinity, y: Infinity },
				max: { x: -Infinity, y: -Infinity }
			};
			this._expandBoundingBox(boundingBox, matrixWorld);

			if (boundingBox.min.x <= rect.x2 && boundingBox.max.x >= rect.x1 &&
				boundingBox.min.y <= rect.y2 && boundingBox.max.y >= rect.y1) {
				selection.add(this._getSceneTreeElement());
			}

			for (var i = 0, l = children.length; i < l; i++) {
				children[ i ]._findRectElementsRecursive(selection, rect, mask, matrixWorld);
			}
		}
	};

	Element.prototype.tagName = function() {
		return "g";
	};

	Element.prototype._setBaseAttributes = function(setAttributeFunc, mask) {
		setAttributeFunc("id", this.uid);
		if (this.opacity !== undefined) {
			setAttributeFunc("opacity", this.nodeContentType === NodeContentType.Hotspot && this.isSelected(mask) ? (this.opacity * 0.5 + 0.5) : this.opacity);
		}
		if (!isIdentityMatrix(this.matrix)) {
			setAttributeFunc("transform", "matrix(" + this.matrix.join(",") + ")");
		}
		if (!this.isVisible(mask)) {
			setAttributeFunc("display", "none");
		}

		if (this.fill !== undefined) {
			setAttributeFunc("fill", this._cssColor(this.fill, mask));
		}

		if (this.stroke !== undefined && this.stroke[ 3 ] > 0 && this.strokeWidth) {
			setAttributeFunc("stroke", this._cssColor(this.stroke, mask));
			setAttributeFunc("stroke-width", this.strokeWidth);
			setAttributeFunc("vector-effect", "non-scaling-stroke"); // TODO: What about widthCoordinateSpace?
			if (this.strokeDashArray.length > 0) {
				setAttributeFunc("stroke-dasharray", this.strokeDashArray.join(" "));
			}
		}

		if (this.nodeContentType === NodeContentType.Hotspot) {
			setAttributeFunc("filter", "url(#hotspot-effect)");
		}
	};

	Element.prototype._setSpecificAttributes = function(setAttributeFunc) {
	};

	Element.prototype.render = function(rm, mask) {
		var tagName = this.tagName();
		rm.write("<" + tagName);

		var setAttributeFunc = rm.writeAttribute.bind(rm);
		this._setBaseAttributes(setAttributeFunc, mask);
		this._setSpecificAttributes(setAttributeFunc);

		rm.write(">");

		if (this._renderContent) {
			this._renderContent(rm);
		}

		this.children.forEach(function(element) {
			element.render(rm, mask);
		});

		rm.write("</" + tagName + ">");
	};

	Element.prototype._createDomElement = function(channel) {
		var domRef = document.createElementNS("http://www.w3.org/2000/svg", this.tagName());

		var setAttributeFunc = domRef.setAttribute.bind(domRef);
		this._setBaseAttributes(setAttributeFunc, 1 << channel);
		this._setSpecificAttributes(setAttributeFunc);

		if (this._createContent) {
			this._createContent(domRef);
		}

		return domRef;
	};

	Element.prototype.invalidate = function(channel) {
		if (this.domRef !== null) {
			var oldDomRef = this.domRef;
			this.domRef = this._createDomElement(channel);

			oldDomRef.parentNode.replaceChild(this.domRef, oldDomRef);
			for (var i = 0, l = this.children.length; i < l; i++) {
				var childDomRef = this.children[ i ].domRef;
				if (childDomRef) {
					this.domRef.appendChild(childDomRef);
				}
			}
		}
	};

	Element.prototype.rerender = function(channel) {
		var oldDomRef = this.domRef;
		if (oldDomRef !== null && oldDomRef.parentNode !== null) {
			this.traverse(function(node) {
				node.domRef = node._createDomElement(channel);
				if (node === this) {
					oldDomRef.parentNode.replaceChild(node.domRef, oldDomRef);
				} else {
					node.parent.domRef.appendChild(node.domRef);
				}
			}.bind(this));
		}
	};

	function getChildById(domRef, id) {
		var children = domRef.children;
		for (var i = 0, l = children.length; i < l; i++) {
			if (children[ i ].id === id) {
				return children[ i ];
			}
		}
		return null;
	}

	Element.prototype._setDomRef = function(domRef) {
		this.domRef = domRef;
		var children = this.children;
		for (var i = 0, l = children.length; i < l; i++) {
			var child = children[ i ];
			child._setDomRef(domRef ? getChildById(domRef, child.uid) : null);
		}
	};

	Element.prototype.getElementByProperty = function(name, value) {
		if (this[ name ] === value) {
			return this;
		}

		var children = this.children;
		for (var i = 0, l = children.length; i < l; i++) {
			var element = children[ i ].getElementByProperty(name, value);
			if (element !== null) {
				return element;
			}
		}

		return null;
	};

	Element.prototype.getElementById = function(id) {
		return this.getElementByProperty("uid", id);
	};

	Element.prototype.copy = function(source, recursive) {
		this.name = source.name;
		this.matrix = source.matrix.slice();
		this.nodeContentType = source.nodeContentType;
		this.materialId = source.materialId;
		this.lineStyle = source.lineStyle;
		this.fillStyle = source.fillStyle;
		if (source.opacity !== undefined) {
			this.opacity = source.opacity;
		}
		if (source.tintColor !== undefined) {
			this.tintColor = source.tintColor;
		}
		// if (source.highlightColor !== undefined) {
		// 	this.highlightColor = source.highlightColor;
		// }
		if (source.fill !== undefined) {
			this.fill = source.fill.slice();
		}
		if (source.stroke !== undefined) {
			this.stroke = source.stroke.slice();
		}
		if (source.strokeWidth !== undefined) {
			this.strokeWidth = source.strokeWidth;
		}
		if (source.strokeDashArray !== undefined) {
			this.strokeDashArray = source.strokeDashArray.slice();
		}
		if (source.widthCoordinateSpace !== undefined) {
			this.widthCoordinateSpace = source.widthCoordinateSpace;
		}

		if (recursive || recursive === undefined) {
			for (var i = 0, l = source.children.length; i < l; i++) {
				this.add(source.children[ i ].clone());
			}
		}

		return this;
	};

	Element.prototype.clone = function() {
		return new this.constructor().copy(this);
	};

	function lerp(a, b, f) {
		return a + (b - a) * f;
	}

	Element.prototype._cssColor = function(color, mask) {
		var a = color[ 3 ];
		if (a === 0) {
			return "none";
		}

		var r = color[ 0 ] * 255;
		var g = color[ 1 ] * 255;
		var b = color[ 2 ] * 255;

		var tintColor = this.tintColor;
		if (tintColor) {
			tintColor = abgrToColor(tintColor);
			var ta = tintColor.alpha;
			if (ta > 0) {
				r = lerp(r, tintColor.red, ta);
				g = lerp(g, tintColor.green, ta);
				b = lerp(b, tintColor.blue, ta);
			}
		}

		var highlightColor = this.highlightColor;
		if (highlightColor) {
			highlightColor = abgrToColor(highlightColor);
			var ha = highlightColor.alpha;
			if (ha > 0) {
				r = lerp(r, highlightColor.red, ha);
				g = lerp(g, highlightColor.green, ha);
				b = lerp(b, highlightColor.blue, ha);
				a = lerp(a, ha, ha);
			}
		}

		// return "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a + ")";
		var hex = ((r << 24) | (g << 16) | (b << 8) | (a * 255)) >>> 0;
		return "#" + ("00000000" + hex.toString(16)).slice(-8);
	};

	return Element;
});
