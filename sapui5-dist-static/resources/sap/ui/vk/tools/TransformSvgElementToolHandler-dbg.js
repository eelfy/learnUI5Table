/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.TransformSvgElementToolHandler
sap.ui.define([
	"sap/ui/base/EventProvider",
	"../svg/Element"
], function(
	EventProvider,
	Element
) {
	"use strict";

	var TransformSvgElementToolHandler = EventProvider.extend("sap.ui.vk.tools.TransformSvgElementToolHandler", {
		metadata: {
		},
		constructor: function(tool) {
			this._priority = 10; // the priority of the handler
			this._tool = tool;
			this._gizmo = tool.getGizmo();
			this._rect = null;
		}
	});

	TransformSvgElementToolHandler.prototype._getPosition = function(event) {
		return this._tool._viewport._camera._screenToWorld(event.x - this._rect.x, event.y - this._rect.y);
	};

	TransformSvgElementToolHandler.prototype.getGizmoHandle = function(event) {
		var viewport = this._tool._viewport;
		if (!viewport || !this._gizmo || !this._inside(event)) {
			return null;
		}

		var camera = viewport._camera;
		var nodes = this._gizmo._nodes;
		if (!camera || !nodes || nodes.length === 0) {
			return null;
		}

		var mx = event.x - this._rect.x;
		var my = event.y - this._rect.y;
		var wmp = this._getPosition(event); // world mouse position
		var dSize = 12;

		var gizmoIndex = -1;
		for (var ni = 0; ni < nodes.length; ni++) {
			var nodeInfo = nodes[ ni ];
			var node = nodeInfo.node;
			var bbox = node.domRef ? node.domRef.getBBox() : null;
			if (!bbox) {
				continue;
			}
			var matrix = node._matrixWorld();
			var handlePositions = this._gizmo._getHandleLocalPositions(nodeInfo, matrix);

			for (var hi = 0; hi < 9; hi++) {
				var whp = Element._transformPoint(handlePositions[ hi * 2 ], handlePositions[ hi * 2 + 1 ], matrix); // world handle position
				var pos = camera._worldToScreen(whp.x, whp.y); // screen handle position
				if (mx >= pos.x - dSize && mx <= pos.x + dSize && my >= pos.y - dSize && my <= pos.y + dSize) {
					return { gizmoIndex: ni, handleIndex: hi, angle: Math.atan2(matrix[ 2 ], matrix[ 3 ]) };
				}
			}

			if (gizmoIndex < 0) {// check if mouse is inside bounding box
				var lmp = Element._transformPoint(wmp.x, wmp.y, Element._invertMatrix(matrix)); // local mouse position
				if (lmp.x >= bbox.x && lmp.x <= bbox.x + bbox.width && lmp.y >= bbox.y && lmp.y <= bbox.y + bbox.height) {
					gizmoIndex = ni;
				}
			}
		}

		return gizmoIndex < 0 ? null : { gizmoIndex: gizmoIndex, handleIndex: -1 };
	};

	TransformSvgElementToolHandler.prototype.hover = function(event) {
		if (this._gizmo) {
			var handle = this.getGizmoHandle(event);
			if (handle) {
				this._gizmo._selectHandle(handle.gizmoIndex, handle.handleIndex);
			} else {
				this._gizmo._selectHandle(-1, -1);
			}
		}
	};

	TransformSvgElementToolHandler.prototype.beginGesture = function(event) {
		this._handle = this.getGizmoHandle(event);
		if (this._handle) {
			event.handled = true;
			this._gizmo._selectHandle(this._handle.gizmoIndex, this._handle.handleIndex);

			this._startPos = this._getPosition(event);
			this._gizmo.beginGesture();
		}
	};

	TransformSvgElementToolHandler.prototype.move = function(event) {
		if (this._handle) {
			event.handled = true;

			var pos = this._getPosition(event);
			this._gizmo._update(pos.x - this._startPos.x, pos.y - this._startPos.y);
		}
	};

	TransformSvgElementToolHandler.prototype.endGesture = function(event) {
		if (this._handle) {
			this._handle = null;
			event.handled = true;
			this._gizmo.endGesture();
		}
	};

	TransformSvgElementToolHandler.prototype.click = function(event) { };

	TransformSvgElementToolHandler.prototype.doubleClick = function(event) { };

	TransformSvgElementToolHandler.prototype.contextMenu = function(event) { };

	TransformSvgElementToolHandler.prototype.getViewport = function() {
		return this._tool._viewport;
	};

	// GENERALISE THIS FUNCTION
	TransformSvgElementToolHandler.prototype._getOffset = function(obj) {
		var rectangle = obj.getBoundingClientRect();
		var p = {
			x: rectangle.left + window.pageXOffset,
			y: rectangle.top + window.pageYOffset
		};
		return p;
	};

	// GENERALISE THIS FUNCTION
	TransformSvgElementToolHandler.prototype._inside = function(event) {
		var id = this._tool._viewport.getIdForLabel();
		var domobj = document.getElementById(id);

		if (domobj == null) {
			return false;
		}

		var offset = this._getOffset(domobj);
		this._rect = {
			x: offset.x,
			y: offset.y,
			w: domobj.offsetWidth,
			h: domobj.offsetHeight
		};

		return (event.x >= this._rect.x && event.x <= this._rect.x + this._rect.w && event.y >= this._rect.y && event.y <= this._rect.y + this._rect.h);
	};

	return TransformSvgElementToolHandler;
});