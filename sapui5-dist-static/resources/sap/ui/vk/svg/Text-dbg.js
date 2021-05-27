/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the sap.ui.vk.svg.Text class.
sap.ui.define([
	"./Element",
	"./Path"
], function(
	Element,
	Path
) {
	"use strict";

	var Text = function(parameters) {
		parameters = parameters || {};
		Element.call(this, parameters);

		this.type = "Text";
		this.content = parameters.content || (parameters.text ? [ { type: 10, text: parameters.text } ] : []);
		this.style = parameters.style || {};
		this.style.size = this.style.size || 1;
		this.x = (parameters.textTranslate && parameters.textTranslate[ 0 ]) || parameters.x || 0;
		this.y = (parameters.textTranslate && parameters.textTranslate[ 1 ]) || parameters.y || 0;

		// If not specified then set default colours for text objects
		this.fillStyle = parameters.fillStyle || { colour: [ 0, 0, 0, 1 ] };
		this.lineStyle = parameters.lineStyle || {
			colour: [ 0, 0, 0, 0 ],
			width: 1
		};

		// If colours are provided in style then overwrite defaults
		if (this.style.fill) {
			this.fillStyle = { colour: this.style.fill };
		}
		if (this.style.stroke) {
			if (this.lineStyle == null) {
				this.lineStyle = {};
			}
			this.lineStyle.colour = this.style.stroke;
		}

		this.setMaterial(parameters.material);
	};

	Text.prototype = Object.assign(Object.create(Element.prototype), { constructor: Text });

	Text.prototype.tagName = function() {
		return "text";
	};

	Text.prototype.defaultFillAlpha = 1;

	// canvas for measuring text
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	Text.prototype._expandBoundingBox = function(boundingBox, matrixWorld) {
		if (this.domRef) {
			var bbox = this.domRef.getBBox();
			if (bbox) {
				this._expandBoundingBoxCE(boundingBox, matrixWorld, bbox.x + bbox.width * 0.5, bbox.y + bbox.height * 0.5, bbox.width * 0.5, bbox.height * 0.5);
				return;
			}
		}

		function getText(content) {
			var text = "";
			for (var i = 0, l = content.length; i < l; i++) {
				var c = content[ i ];
				switch (c.type) {
					case 10: // ptParametricTextData
						text += c.text;
						break;
					case 11: // ptParametricTextSpan
					case 12: // ptParametricTextPath
						text += getText(c.content);
						break;
					default: break;
				}
			}
			return text;
		}

		var strokeDelta = isNaN(this.strokeWidth) ? 0 : this.strokeWidth * 0.5;
		context.font = this.style.size + "px " + (this.style.fontFace || "Arial");
		var metrics = context.measureText(getText(this.content));
		var hw = metrics.width * 0.5 + strokeDelta;
		var hh = (metrics.actualBoundingBoxAscent || this.style.size) * 0.5 + strokeDelta;
		this._expandBoundingBoxCE(boundingBox, matrixWorld, this.x + hw, this.y - hh, hw, hh);
	};

	function setStyle(style, setAttributeFunc) {
		if (style.size) {
			setAttributeFunc("font-size", style.size);
		}

		if (style.fontFace) {
			setAttributeFunc("font-family", style.fontFace);
		}
	}

	Text.prototype._setSpecificAttributes = function(setAttributeFunc) {
		setAttributeFunc("x", this.x);
		setAttributeFunc("y", this.y);
		setStyle(this.style, setAttributeFunc);
	};

	function renderContent(content, rm) {
		for (var i = 0, l = content.length; i < l; i++) {
			var c = content[ i ];
			switch (c.type) {
				case 10: // ptParametricTextData
					rm.write(c.text);
					break;
				case 11: // ptParametricTextSpan
					rm.write("<tspan");
					if (c.style) {
						setStyle(c.style, rm.writeAttribute.bind(rm));
					}
					rm.write(">");
					renderContent(c.content, rm);
					rm.write("</tspan>");
					break;
				case 12: // ptParametricTextPath
					rm.write("<textPath");
					if (c.style) {
						setStyle(c.style, rm.writeAttribute.bind(rm));
					}
					if (!c.path && c.pathSegments) {
						c.path = new Path({ segments: c.pathSegments });
					}
					var path = c.path;
					if (path instanceof Path) {
						rm.writeAttribute("href", "#" + path.uid);
						rm.write(">");
						rm.write("<" + path.tagName());
						rm.writeAttribute("id", path.uid);
						path._setSpecificAttributes(rm.writeAttribute.bind(rm));
						rm.write("/>");
					} else {
						rm.write(">");
					}
					renderContent(c.content, rm);
					rm.write("</textPath>");
					break;
				default: break;
			}
		}
	}

	Text.prototype._renderContent = function(rm) {
		renderContent(this.content, rm);
	};

	var svgNamespace = "http://www.w3.org/2000/svg";

	function createContent(content, parentDomRef) {
		var domRef;
		for (var i = 0, l = content.length; i < l; i++) {
			var c = content[ i ];
			switch (c.type) {
				case 10: // ptParametricTextData
					parentDomRef.append(c.text);
					break;
				case 11: // ptParametricTextSpan
					domRef = document.createElementNS(svgNamespace, "tspan");
					if (c.style) {
						setStyle(c.style, domRef.setAttribute.bind(domRef));
					}
					createContent(c.content, domRef);
					parentDomRef.append(domRef);
					break;
				case 12: // ptParametricTextPath
					domRef = document.createElementNS(svgNamespace, "textPath");
					if (c.style) {
						setStyle(c.style, domRef.setAttribute.bind(domRef));
					}
					if (!c.path && c.pathSegments) {
						c.path = new Path({ segments: c.pathSegments });
					}
					var path = c.path;
					if (path instanceof Path) {
						domRef.setAttribute("href", "#" + path.uid);
						var pathDomRef = document.createElementNS(svgNamespace, path.tagName());
						pathDomRef.setAttribute("id", path.uid);
						path._setSpecificAttributes(pathDomRef.setAttribute.bind(pathDomRef));
						domRef.append(pathDomRef);
					}
					createContent(c.content, domRef);
					parentDomRef.append(domRef);
					break;
				default: break;
			}
		}
	}

	Text.prototype._createContent = function(domRef) {
		createContent(this.content, domRef);
	};

	Text.prototype.copy = function(source, recursive) {
		Element.prototype.copy.call(this, source, recursive);

		this.content = source.content; // just copy reference to the source content
		this.style = source.style; // just copy reference to the source style
		this.x = source.x;
		this.y = source.y;

		return this;
	};

	return Text;
});
