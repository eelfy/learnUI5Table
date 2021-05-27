/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.CreateRectangleToolGizmo
sap.ui.define([
	"./Gizmo",
	"../svg/Rectangle"
], function(
	Gizmo,
	Rectangle
) {
	"use strict";

	/**
	 * Constructor for a new CreateRectangleToolGizmo.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides UI to display tooltips
	 * @extends sap.ui.vk.tools.Gizmo
	 *
	 * @author SAP SE
	 * @version 1.88.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.vk.tools.CreateRectangleToolGizmo
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CreateRectangleToolGizmo = Gizmo.extend("sap.ui.vk.tools.CreateRectangleToolGizmo", /** @lends sap.ui.vk.tools.CreateRectangleToolGizmo.prototype */ {
		metadata: {
			library: "sap.ui.vk"
		}
	});

	CreateRectangleToolGizmo.prototype.init = function() {
		if (Gizmo.prototype.init) {
			Gizmo.prototype.init.apply(this);
		}

		this._activeElement = null;
	};

	CreateRectangleToolGizmo.prototype.hasDomElement = function() {
		return false;
	};

	CreateRectangleToolGizmo.prototype.updateParentNode = function() {
		if (!this._tool || !this._viewport) {
			return;
		}

		var root = this._tool.getParentNode();
		if (!root) {
			root = this._viewport._scene.getRootElement();
			while (root.userData.skipIt && root.children.length > 0) {
				root = root.children[ 0 ];
			}
		}

		this._root = root;
	};

	CreateRectangleToolGizmo.prototype.show = function(viewport, tool) {
		this._viewport = viewport;
		this._tool = tool;

		this.updateParentNode();
	};

	CreateRectangleToolGizmo.prototype.hide = function() {
		this._viewport = null;
		this._tool = null;
		this._root = null;
	};

	CreateRectangleToolGizmo.prototype._startAdding = function(pos) {
		this._startPos = pos;
		var minRect = this._viewport._camera._transformRect({ x1: 0, y1: 0, x2: 1, y2: 1 });
		this._minWidth = minRect.x2 - minRect.x1; // 1px width
		this._minHeight = minRect.y2 - minRect.y1; // 1px height
		this._activeElement = new Rectangle({
			matrix: [ 1, 0, 0, 1, pos.x, pos.y ],
			width: this._minWidth,
			height: this._minHeight,
			material: this._tool._material,
			lineStyle: this._tool._lineStyle,
			fillStyle: this._tool._fillStyle
		});

		this._root.add(this._activeElement);
		this._root.rerender();
	};

	CreateRectangleToolGizmo.prototype._update = function(pos) {
		var p1 = this._startPos;
		var activeElement = this._activeElement;
		if (activeElement) {
			var minX = Math.min(p1.x, pos.x);
			var minY = Math.min(p1.y, pos.y);
			var width = Math.max(Math.abs(p1.x - pos.x), this._minWidth);
			var height = Math.max(Math.abs(p1.y - pos.y), this._minHeight);
			if (this._tool.getUniformMode()) {
				if (width < height) {
					width = height;
					if (pos.x < p1.x) {
						minX = p1.x - width;
					}
				} else {
					height = width;
					if (pos.y < p1.y) {
						minY = p1.y - height;
					}
				}
			}
			activeElement.matrix[ 4 ] = minX;
			activeElement.matrix[ 5 ] = minY;
			activeElement.width = width;
			activeElement.height = height;
			activeElement.invalidate();
		}
	};

	CreateRectangleToolGizmo.prototype._stopAdding = function(pos) {
		var node = this._activeElement;
		this._tool.fireCompleted({
			node: node,
			parametric: {
				type: "rectangle",
				width: node.width,
				height: node.height,
				rx: node.rx,
				ry: node.ry
			}
		});

		this._activeElement = null;

		this._tool.setActive(false);
	};

	return CreateRectangleToolGizmo;

});
