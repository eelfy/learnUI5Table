/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the OrthographicCamera class.
sap.ui.define([
	"../OrthographicCamera"
], function(
	OrthographicCamera
) {
	"use strict";

	/**
	 * Constructor for a new OrthographicCamera.
	 *
	 *
	 * @class Provides the interface for the camera.
	 *
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.88.0
	 * @extends sap.ui.vk.OrthographicCamera
	 * @alias sap.ui.vk.svg.OrthographicCamera
	 * @since 1.80.0
	 */
	var SvgOrthographicCamera = OrthographicCamera.extend("sap.ui.vk.svg.OrthographicCamera", /** @lends sap.ui.vk.svg.OrthographicCamera.prototype */ {
		metadata: {
		}
	});

	var basePrototype = OrthographicCamera.getMetadata().getParent().getClass().prototype;

	SvgOrthographicCamera.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this.zoom = 1;
		this.offsetX = 0;
		this.offsetY = 0;
		this.zoomedObject = null;
	};

	SvgOrthographicCamera.prototype.update = function(width, height, oldWidth, oldHeight) {
		var oldZoom = this.zoom;
		this.zoom *= Math.min(width, height) / Math.min(oldWidth, oldHeight);
		this.offsetX = (this.offsetX - oldWidth * 0.5) * (this.zoom / oldZoom) + width * 0.5;
		this.offsetY = (this.offsetY - oldHeight * 0.5) * (this.zoom / oldZoom) + height * 0.5;
	};

	SvgOrthographicCamera.prototype.reset = function(camera, width, height) {
		if (camera && camera.viewBox) {
			this._setViewBox(camera.viewBox, width, height);
		}
	};

	SvgOrthographicCamera.prototype._setViewBox = function(viewBox, width, height) {
		this.zoom = width / viewBox[ 2 ];
		this.offsetX = -viewBox[ 0 ] * this.zoom;
		this.offsetY = -viewBox[ 1 ] * this.zoom;

		this.update(width, height, width, width * viewBox[ 3 ] / viewBox[ 2 ]);
	};

	SvgOrthographicCamera.prototype._zoomTo = function(boundingBox, width, height, margin) {
		var zoom = Math.min(width / (boundingBox.max.x - boundingBox.min.x), height / (boundingBox.max.y - boundingBox.min.y)) / (1 + (margin || 0));

		this.zoom = zoom;
		this.offsetX = (width - (boundingBox.min.x + boundingBox.max.x) * zoom) * 0.5;
		this.offsetY = (height - (boundingBox.min.y + boundingBox.max.y) * zoom) * 0.5;
	};

	SvgOrthographicCamera.prototype._screenToWorld = function(x, y) {
		return {
			x: (x - this.offsetX) / this.zoom,
			y: (y - this.offsetY) / this.zoom
		};
	};

	SvgOrthographicCamera.prototype._worldToScreen = function(x, y) {
		return {
			x: x * this.zoom + this.offsetX,
			y: y * this.zoom + this.offsetY
		};
	};

	SvgOrthographicCamera.prototype._transformRect = function(rect) {
		var p1 = this._screenToWorld(rect.x1, rect.y1);
		var p2 = this._screenToWorld(rect.x2, rect.y2);
		return {
			x1: Math.min(p1.x, p2.x),
			y1: Math.min(p1.y, p2.y),
			x2: Math.max(p1.x, p2.x),
			y2: Math.max(p1.y, p2.y)
		};
	};

	SvgOrthographicCamera.prototype.getPosition = function() {
		return [ this.offsetX, this.offsetY, 0 ];
	};

	SvgOrthographicCamera.prototype.setPosition = function(vals) {
		if (Array.isArray(vals) && vals.length >= 2) {
			this.offsetX = vals[0];
			this.offsetY = vals[1];
		}
	};

	SvgOrthographicCamera.prototype.getZoomFactor = function() {
		return this.zoom;
	};

	SvgOrthographicCamera.prototype.setZoomFactor = function(val) {
		this.zoom  = val;
	};

	return SvgOrthographicCamera;
});
