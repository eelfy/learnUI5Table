/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.CreateRectangleTool
sap.ui.define([
	"sap/base/Log",
	"../library",
	"./Tool",
	"./CreateRectangleToolHandler",
	"./CreateRectangleToolGizmo",
	"../svg/Rectangle"
], function(
	Log,
	vkLibrary,
	Tool,
	CreateRectangleToolHandler,
	CreateRectangleToolGizmo,
	Rectangle
) {
	"use strict";

	/**
	 * Constructor for a new CreateRectangleTool.
	 *
	 * @class
	 * The CreateRectangleTool allows applications to create a rectangle/square svg element.

	 * @param {string} [sId] ID of the new tool instance. <code>sId</code>is generated automatically if no non-empty ID is given.
	 *                       Note: this can be omitted, regardless of whether <code>mSettings</code> will be provided or not.
	 * @param {object} [mSettings] An optional map/JSON object with initial property values, aggregated objects etc. for the new tool instance.
	 * @public
	 * @author SAP SE
	 * @version 1.88.0
	 * @extends sap.ui.vk.tools.Tool
	 * @alias sap.ui.vk.tools.CreateRectangleTool
	 */
	var CreateRectangleTool = Tool.extend("sap.ui.vk.tools.CreateRectangleTool", /** @lends sap.ui.vk.tools.CreateRectangleTool.prototype */ {
		metadata: {
			properties: {
				/**
				 * Parent node for new elements.
				 */
				parentNode: {
					type: "any",
					defaultValue: null
				},
				/**
				 * Indicates that the tool creates a square instead of a rectangle.
				 */
				uniformMode: {
					type: "boolean",
					defaultValue: false
				}
			},
			events: {
				completed: {
					parameters: {
						/**
						 * node - created node object
						 *
						 * node.sid - node's sid
						 * node.nodeContentType - node content type
						 * node.materialId - assigned meterial sid
						 * node.name - node's name
						 * node.matrix - node transformation matrix
						 * node.parametric - index of created parametric object in parametrics array
						 */
						node: { type: "any" },
						/**
						 * parametric - created primitive
						 * parametric.type - type of parametric object, "rectangle"
						 * parametric.width - rectangle width
						 * parametric.height - rectangle height
						 * parametric.rx - horizontal corner radius of the rectangle
						 * parametric.ry - vertical corner radius of the rectangle
						 */
						parametric: { type: "any" }
					}
				}
			}
		},

		constructor: function(sId, mSettings) {
			// Treat tool instantiation as singleton
			if (CreateRectangleTool._instance) {
				return CreateRectangleTool._instance;
			}

			Tool.apply(this, arguments);

			// Configure dependencies
			this._viewport = null;
			this._handler = new CreateRectangleToolHandler(this);

			CreateRectangleTool._instance = this;
		}
	});

	CreateRectangleTool.prototype.init = function() {
		if (Tool.prototype.init) {
			Tool.prototype.init.call(this);
		}

		// set footprint for tool
		this.setFootprint([ "sap.ui.vk.svg.Viewport" ]);

		this.setAggregation("gizmo", new CreateRectangleToolGizmo());
	};

	// Override the active property setter so that we execute activation / deactivation code at the same time
	CreateRectangleTool.prototype.setActive = function(value, activeViewport, gizmoContainer) {
		Tool.prototype.setActive.call(this, value, activeViewport, gizmoContainer);

		var viewport = this._viewport;
		if (viewport) {
			if (value) {
				this._gizmo = this.getGizmo();
				if (this._gizmo) {
					this._gizmo.show(viewport, this);
				}

				this._addLocoHandler();
			} else {
				this._removeLocoHandler();

				if (this._gizmo) {
					this._gizmo.hide();
					this._gizmo = null;
				}
			}
		}

		return this;
	};

	CreateRectangleTool.prototype.setMaterial = function(material, lineStyle, fillStyle) {
		this._material = material;
		this._lineStyle = lineStyle;
		this._fillStyle = fillStyle;
	};

	/** MOVE TO BASE
	 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
	 *
	 * @param {function} command The command to be executed.
	 * @returns {sap.ui.vk.tools.CreateRectangleTool} <code>this</code> to allow method chaining.
	 * @public
	 */
	CreateRectangleTool.prototype.queueCommand = function(command) {
		if (this._addLocoHandler()) {
			if (this.isViewportType("sap.ui.vk.svg.Viewport")) {
				command();
			}
		}
		return this;
	};

	CreateRectangleTool.prototype.setParentNode = function(value) {
		if (value === this.getParentNode()) {
			return this;
		}

		this.setProperty("parentNode", value, true);

		if (this._gizmo) {
			this._gizmo.updateParentNode();
		}
		return this;
	};

	return CreateRectangleTool;
});
