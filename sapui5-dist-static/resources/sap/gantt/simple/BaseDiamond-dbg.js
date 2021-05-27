/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseRectangle", "./BasePath", "sap/gantt/misc/Utility"], function (BaseRectangle, BasePath, Utility) {
	"use strict";

	/**
	 * Creates and initializes a Diamond object
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Diamond shape class using the SVG tag "path". You can use this class to represent a milestone.
	 *
	 * @extends sap.gantt.simple.BaseRectangle
	 *
	 * @author SAP SE
	 * @version 1.88.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.BaseDiamond
	 */
	var BaseDiamond = BaseRectangle.extend("sap.gantt.simple.BaseDiamond",/** @lends sap.gantt.simple.BaseDiamond.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * width of Diamond
				 */
				width: { type: "sap.gantt.SVGLength", defaultValue: "auto" },

				/**
				 * height of Diamond
				 */
				height: { type: "sap.gantt.SVGLength", defaultValue: "auto" }
			}
		},
		renderer: {
			apiVersion: 2    // enable in-place DOM patching
		}
	});

	/**
	 * Diamond is extends from Rectangle but rendered as a path
	 *
	 * @return {string} Value of property d.
	 * @private
	 */
	BaseDiamond.prototype.getD = function () {
		var x = this.getX(),
			w = this.getWidth(),
			h = this.getHeight(),
			y = this.getRowYCenter();

		var concat = function () {
			var sResult = "";
			for (var iIdx = 0; iIdx < arguments.length; iIdx++) {
				sResult += arguments[iIdx] + " ";
			}
			return sResult;
		};

		return concat("M", x, y - h / 2, "l", w / 2, h / 2, "l", -w / 2, h / 2, "l", -w / 2, -h / 2) + "Z";
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	BaseDiamond.prototype.getWidth = function () {
		var vWidth = this.getProperty("width");
		if (vWidth === "auto") {
			return parseFloat(this._iBaseRowHeight * 0.625, 10);
		}
		if (vWidth === "inherit") {
			return this._iBaseRowHeight;
		}
		return vWidth;
	};

	BaseDiamond.prototype.renderElement = BasePath.prototype.renderElement;

	BaseDiamond.prototype.getShapeAnchors = function () {
		var mBias = Utility.getShapeBias(this);

		return {
			head: {
				x: this.getX() - this.getWidth() / 2 + mBias.x,
				y: this.getRowYCenter() + mBias.y,
				dx: this.getWidth() / 2,
				dy: this.getHeight() / 2
			},
			tail: {
				x: this.getX() + this.getWidth() / 2 + mBias.x,
				y: this.getRowYCenter() + mBias.y,
				dx: this.getWidth() / 2,
				dy: this.getHeight() / 2
			}
		};
	};

	BaseDiamond.prototype.renderElement = function () {
		if (this._isValid()) {
			BasePath.prototype.renderElement.apply(this, arguments);
		}
	};

	return BaseDiamond;
}, true);
