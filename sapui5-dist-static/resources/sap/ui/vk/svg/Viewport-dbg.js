/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.svg.Viewport.
sap.ui.define([
	"../Core",
	"./ViewportRenderer",
	"../ViewportBase",
	"sap/ui/core/ResizeHandler",
	"sap/ui/events/KeyCodes",
	"../Loco",
	"../ViewStateManager",
	"./ViewStateManager",
	"../ViewportHandler",
	"../VisibilityMode",
	"../ZoomTo",
	"../SelectionMode",
	"../NodeContentType",
	"../getResourceBundle",
	"../Messages",
	"./Scene",
	"./OrthographicCamera",
	"./Element",
	"./Rectangle",
	"./HotspotHelper",
	"../colorToCSSColor",
	"../cssColorToColor",
	"../colorToABGR",
	"../abgrToColor",
	"sap/base/Log"
], function(
	vkCore,
	ViewportRenderer,
	ViewportBase,
	ResizeHandler,
	KeyCodes,
	Loco,
	ViewStateManagerVK,
	ViewStateManagerSVG,
	ViewportHandler,
	VisibilityMode,
	ZoomTo,
	SelectionMode,
	NodeContentType,
	getResourceBundle,
	Messages,
	Scene,
	OrthographicCamera,
	Element,
	Rectangle,
	HotspotHelper,
	colorToCSSColor,
	cssColorToColor,
	colorToABGR,
	abgrToColor,
	Log
) {
	"use strict";

	/**
	 *  Constructor for a SVG viewport.
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.88.0
	 * @extends sap.ui.vk.ViewportBase
	 * @alias sap.ui.vk.svg.Viewport
	 */
	var Viewport = ViewportBase.extend("sap.ui.vk.svg.Viewport", /** @lends sap.ui.vk.svg.Viewport.prototype  */ {
		metadata: {
			library: "sap.ui.vk",
			// properties: {
			// 	zoomInLimit: {
			// 		type: "float",
			// 		defaultValue: 500
			// 	},
			// 	zoomOutLimit: {
			// 		type: "float",
			// 		defaultValue: 0.25
			// 	}
			// },
			events: {
				cameraChanged: {
					parameters: {
						/**
						 * Returns a new camera offset.
						 */
						offset: "float[]",
						/**
						 * Returns a new camera zoom factor.
						 */
						zoom: "float"
					},
					enableEventBubbling: true
				},
				hotspotEnter: {
					parameters: {
						nodeRef: "any"
					},
					enableEventBubbling: true
				},
				hotspotLeave: {
					parameters: {
						nodeRef: "any"
					},
					enableEventBubbling: true
				}
			}
		}
	});

	var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

	Viewport.prototype.init = function() {

		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this._resizeListenerId = null;
		this._animLoopRequestId = 0;
		this._animLoopFunction = this._animLoop.bind(this);

		this._width = this._height = 0;
		this._camera = new OrthographicCamera();
		this._gestureX = 0;
		this._gestureY = 0;

		this._scene = null;
		this._selectionRect = new Rectangle({
			material: {
				lineColor: [ 0.75, 0.75, 0, 1 ],
				lineStyle: {
					dashPattern: [ 2, 2 ]
				}
			}
		});

		this._viewportHandler = new ViewportHandler(this);

		this._loco = new Loco(this);
		this._loco.addHandler(this._viewportHandler, -1);

		this._hotspotHelper = new HotspotHelper();

		this._currentViewIndex = 0;
		this._currentView = null;

		vkCore.getEventBus().subscribe("sap.ui.vk", "viewStateApplied", this._onViewStateApplied, this);
	};

	Viewport.prototype.exit = function() {
		vkCore.getEventBus().unsubscribe("sap.ui.vk", "viewStateApplied", this._onViewStateApplied, this);

		this._loco.removeHandler(this._viewportHandler);
		this._viewportHandler.destroy();

		if (this._resizeListenerId) {
			ResizeHandler.deregister(this._resizeListenerId);
			this._resizeListenerId = null;
		}

		this.setScene(null);
		this._renderer = null;
		this._loco = null;
		this._viewportHandler = null;

		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	Viewport.prototype.onBeforeRendering = function() {
		if (this._resizeListenerId) {
			ResizeHandler.deregister(this._resizeListenerId);
			this._resizeListenerId = null;
		}
	};

	Viewport.prototype.onAfterRendering = function() {
		this._resizeListenerId = ResizeHandler.register(this, this._handleResize.bind(this));

		var domRef = this.getDomRef();

		if (this._scene) {
			var root = this._scene.getRootElement();
			root._setDomRef(document.getElementById(root.uid));
			this._hotspotEffect = root.domRef ? root.domRef.parentNode.getElementById("hotspot-effect") : null;
		} else {
			this._hotspotEffect = null;
		}

		this._handleResize({
			size: {
				width: domRef.clientWidth,
				height: domRef.clientHeight
			}
		});
	};

	Viewport.prototype._handleResize = function(event) {
		var oldWidth = this._width;
		var oldHeight = this._height;
		this._width = event.size.width;
		this._height = event.size.height;

		if (oldWidth === 0 || oldHeight === 0) {
			this.zoomTo(ZoomTo.All, null, 0, 0);
		} else {
			this._camera.update(this._width, this._height, oldWidth, oldHeight);
			this._updateViewBox();

			this.fireCameraChanged({ viewBox: this._getViewBox() });
		}

		this.fireResize({
			size: {
				width: this._width,
				height: this._height
			}
		});

		return true;
	};

	/**
	* Attaches the scene to the Viewport for rendering.
	* @param {sap.ui.vk.svg.Scene} scene The scene to attach to the Viewport.
	* @returns {sap.ui.vk.svg.Viewport}<code>this</code> to allow method chaining.
	* @deprecated Since version 1.80.0.
	* @public
	*/
	Viewport.prototype.setScene = function(scene) {
		this._scene = scene;
		this._currentViewIndex = 0;
		this._currentView = null;

		if (scene) {
			var initialView = scene.getInitialView();
			if (initialView) {
				this.activateView(initialView);
			}

			this._onContentLoadingFinished();
		}

		return this;
	};

	/**
	* Gets the Viewport Scene
	* @returns {sap.ui.vk.svg.Scene} returns Scene
	* @public
	*/
	Viewport.prototype.getScene = function() {
		return this._scene;
	};

	/**
	 * @returns {sap.ui.vk.svg.Viewport} <code>this</code> to allow method chaining.
	 * @protected
	 */
	// Viewport.prototype._setShouldRerender = function() {
	// 	if (!this._renderFrameTimer) {
	// 		this._renderFrameTimer = setTimeout(function() {
	// 			this._renderFrameTimer = 0;
	// 			this.rerender();
	// 		}.bind(this), 0);
	// 	}
	// 	return this;
	// };

	Viewport.prototype.onSetViewStateManager = function(viewStateManager) {
		this._viewStateManager = viewStateManager;

		viewStateManager.attachOutliningChanged(this._onOutliningOrSelectionChanged, this);
		viewStateManager.attachSelectionChanged(this._onOutliningOrSelectionChanged, this);
	};

	Viewport.prototype.onRemoveViewStateManager = function(viewStateManager) {
		viewStateManager.detachOutliningChanged(this._onOutliningOrSelectionChanged, this);
		viewStateManager.detachSelectionChanged(this._onOutliningOrSelectionChanged, this);

		this._viewStateManager = null;
	};

	Viewport.prototype._getViewStateManagerSVG = function() {
		if (this._viewStateManager) {
			if (this._viewStateManager instanceof ViewStateManagerSVG) {
				return this._viewStateManager;
			}
			if (this._viewStateManager instanceof ViewStateManagerVK &&
				this._viewStateManager._implementation instanceof ViewStateManagerSVG) {
				return this._viewStateManager._implementation;
			}
		}
		return null;
	};

	/**
	* Performs a screen-space hit test and gets the hit node reference, it must be called between beginGesture() and endGesture()
	*
	* @param {int} x: x coordinate in viewport to perform hit test
	* @param {int} y: y coordinate in viewport to perform hit test
	* @returns {object} object under the viewport coordinates (x, y).
	*/
	Viewport.prototype.hitTest = function(x, y) {
		var vsm = this._getViewStateManagerSVG();
		if (!vsm || !this._scene) {
			return null;
		}

		var rootElement = this._scene.getRootElement();
		// if (!sap.ui.Device.browser.firefox) {
		// 	var svgDomRef = rootElement.domRef;
		// 	var rect = svgDomRef.createSVGRect();
		// 	rect.x = (x - svgDomRef.clientLeft - this._camera.offsetX) / this._camera.zoom;
		// 	rect.y = (y - svgDomRef.clientTop - this._camera.offsetY) / this._camera.zoom;
		// 	rect.width = rect.height = 1;
		// 	var list = svgDomRef.getIntersectionList(rect, null);
		// 	return list.length > 0 ? rootElement.getElementById(list[ 0 ].id) : null;
		// }

		var viewportRect = this.getDomRef().getBoundingClientRect();
		var htmlElement = document.elementFromPoint(x + viewportRect.x, y + viewportRect.y);
		var element = htmlElement !== null && htmlElement.id ? rootElement.getElementById(htmlElement.id) : null;
		return element ? element._getSceneTreeElement() : null;
	};

	/**
	 * Executes a click or tap gesture.
	 *
	 * @param {int} x The tap gesture's x-coordinate.
	 * @param {int} y The tap gesture's y-coordinate.
	 * @param {boolean} isDoubleClick Indicates whether the tap gesture should be interpreted as a double-click. A value of <code>true</code> indicates a double-click gesture, and <code>false</code> indicates a single click gesture.
	 * @returns {sap.ui.vk.svg.Viewport} <code>this</code> to allow method chaining.
	 */
	Viewport.prototype.tap = function(x, y, isDoubleClick) {
		var node = this.hitTest(x, y);

		if (!isDoubleClick) {
			this.tapObject(node);

			if (node !== null) {
				this.fireNodeClicked({ nodeRef: node, x: x, y: y }, true, true);
			}
		} else if (!this.getFreezeCamera()) {
			if (node && this._camera.zoomedObject !== node) { // doubleclick on new object
				this._camera.zoomedObject = node;
				this.zoomTo(ZoomTo.Node, this._camera.zoomedObject, 0.5, 0.1);
			} else { // doubleclick on previously doubleclicked object, or on empty space
				this._camera.zoomedObject = null;
				this.zoomTo(ZoomTo.Visible, null, 0.5, 0);
			}
		}

		return this;
	};

	/**
	 * Executes a click or tap gesture on particular object
	 *
	 * @param {any} nodeRef Node that user clicked on
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @private
	 */
	Viewport.prototype.tapObject = function(nodeRef) {
		var parameters = {
			picked: nodeRef ? [ nodeRef ] : []
		};
		this.fireNodesPicked(parameters);

		if (this.getSelectionMode() === SelectionMode.Exclusive) {
			this.exclusiveSelectionHandler(parameters.picked);
		} else if (this.getSelectionMode() === SelectionMode.Sticky) {
			this.stickySelectionHandler(parameters.picked);
		}

		return this;
	};

	////////////////////////////////////////////////////////////////////////
	// Keyboard handling begins.

	var offscreenPosition = { x: -2, y: -2 };
	var rotateDelta = 2;
	var panDelta = 5;

	Viewport.prototype.onkeydown = function(event) {
		if (!event.isMarked()) {
			switch (event.keyCode) {
				case KeyCodes.ARROW_LEFT:
				case KeyCodes.ARROW_RIGHT:
				case KeyCodes.ARROW_UP:
				case KeyCodes.ARROW_DOWN:
					if (event.ctrlKey || event.altKey || event.metaKey) {
						break;
					}
					var delta = { x: 0, y: 0 };
					switch (event.keyCode) {
						case KeyCodes.ARROW_LEFT: delta.x = -1; break;
						case KeyCodes.ARROW_RIGHT: delta.x = +1; break;
						case KeyCodes.ARROW_UP: delta.y = -1; break;
						case KeyCodes.ARROW_DOWN: delta.y = +1; break;
						default: break;
					}
					this.beginGesture(offscreenPosition.x, offscreenPosition.y);
					if (event.shiftKey) {
						this.pan(panDelta * delta.x, panDelta * delta.y);
					} else {
						this.rotate(rotateDelta * delta.x, rotateDelta * delta.y, true);
					}
					this.endGesture();
					event.preventDefault();
					event.stopPropagation();
					break;

				case 189: // KeyCodes.MINUS is not returning 189
				case KeyCodes.PLUS:
				case KeyCodes.NUMPAD_MINUS:
				case KeyCodes.NUMPAD_PLUS:
					this.beginGesture(this._width * 0.5, this._height * 0.5);
					this.zoom(event.keyCode === KeyCodes.PLUS || event.keyCode === KeyCodes.NUMPAD_PLUS ? 1.02 : 0.98);
					this.endGesture();
					event.preventDefault();
					event.stopPropagation();
					break;

				default: break;
			}
		}
	};

	// Keyboard handling ends.
	////////////////////////////////////////////////////////////////////////

	Viewport.prototype._onOutliningOrSelectionChanged = function(event) {
		var tools = this.getTools();
		for (var i = 0; i < tools.length; i++) { // loop over all oTools
			var tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
			var gizmo = tool.getGizmoForContainer(this);
			if (gizmo && gizmo.handleSelectionChanged) {
				gizmo.handleSelectionChanged(event);
			}
		}
	};

	Viewport.prototype.setSelectionRect = function(rect) {
		var domRef = document.getElementById(this._selectionRect.uid);
		if (domRef) {
			if (rect) {
				domRef.removeAttribute("display");
				rect = this._camera._transformRect(rect);
				domRef.setAttribute("x", rect.x1, rect.x2);
				domRef.setAttribute("y", rect.y1, rect.y2);
				domRef.setAttribute("width", rect.x2 - rect.x1);
				domRef.setAttribute("height", rect.y2 - rect.y1);
			} else {
				domRef.setAttribute("display", "none");
			}
		}
	};

	Viewport.prototype._select = function(rect) {
		var vsm = this._getViewStateManagerSVG();
		if (vsm && this._scene) {
			rect = this._camera._transformRect(rect);
			var selection = new Set();
			this._scene.getRootElement()._findRectElementsRecursive(selection, rect, vsm._mask);
			vsm.setSelectionStates(Array.from(selection), []);
			return Array.from(selection);
		}
		return [];
	};

	/**
	 * Returns viewport content as an image of desired size.
	 *
	 * @param {int} width Requested image width in pixels. Allowed values are 8 to 2048, default is 16
	 * @param {int} height Requested image height in pixels. Allowed values are 8 to 2048, default is 16
	 * @param {string} topColor The sap.ui.core.CSSColor to be used for top background color
	 * @param {string} bottomColor The sap.ui.core.CSSColor to be used for bottom background color
	 * @param {boolean} includeSelection Include selected nodes
	 * @returns {string} Base64 encoded PNG image
	 * @public
	 */
	Viewport.prototype.getImage = function(width, height, topColor, bottomColor, includeSelection) {
		return null;
	};

	// Overridden sap.ui.vk.ViewportBase#_setContent.
	Viewport.prototype._setContent = function(content) {
		this.setScene(content instanceof Scene ? content : null);

		var camera = new OrthographicCamera();
		camera.reset(content && content.camera, this._width, this._height);
		this.setCamera(camera);

		if (this.getScene()) {
			var initialView = this.getScene().getInitialView();
			if (initialView && this._getViewStateManagerSVG()) {
				this.activateView(initialView, false, true);
			}
		}

		return this;
	};

	Viewport.prototype.onSetContentConnector = function(contentConnector) {
		ViewportBase.prototype.onSetContentConnector.call(this, contentConnector);
		contentConnector.attachContentLoadingFinished(this._onContentLoadingFinished, this);
	};

	Viewport.prototype.onUnsetContentConnector = function(contentConnector) {
		contentConnector.detachContentLoadingFinished(this._onContentLoadingFinished, this);
		ViewportBase.prototype.onUnsetContentConnector.call(this, contentConnector);
	};

	Viewport.prototype._onContentLoadingFinished = function(event) {
		if (this._scene) {
			var nodeHierarchy = this._scene.getDefaultNodeHierarchy();
			if (nodeHierarchy) {
				var opacity = this.getShowAllHotspots() ? 1 : 0;
				var hotspotNodes = nodeHierarchy.getHotspotNodeIds();
				hotspotNodes.forEach(function(hotspotNode) {
					this._hotspotHelper.updateHotspot(hotspotNode, undefined, opacity);
				}, this);
			}

			this.zoomTo(ZoomTo.All, null, 0, 0);
			this.invalidate();
		}
	};

	function lerp(a, b, f) {
		return a + (b - a) * f;
	}

	function smootherStep(edge0, edge1, x) {
		// Scale, and clamp x to 0..1 range
		x = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0);
		// Evaluate polynomial
		return x * x * x * (x * (x * 6 - 15) + 10);
	}

	Viewport.prototype._animLoop = function() {
		this._animLoopRequestId = 0;

		var anim = this._anim;
		if (anim) {
			var start = anim.start;
			var end = anim.end;
			var timeNow = Date.now();
			var f = Math.min(smootherStep(0, 1, (timeNow - start.time) / anim.duration), 1);
			this._camera.offsetX = lerp(start.offsetX, end.offsetX, f);
			this._camera.offsetY = lerp(start.offsetY, end.offsetY, f);
			this._camera.zoom = lerp(start.zoom, end.zoom, f);

			this.fireCameraChanged({ viewBox: this._getViewBox() });

			if (this._updateViewBox() && (timeNow - start.time) < anim.duration) {
				this._animLoopRequestId = window.requestAnimationFrame(this._animLoopFunction); // request next frame
			} else {
				delete this._anim;
			}
		}
	};

	/**
	* Get current view - remembered when activateView function is called
	*
	* @returns {sap.ui.vk.View} Current view
	* @public
	*/
	Viewport.prototype.getCurrentView = function() {
		return this._currentView;
	};

	Viewport.prototype._onViewStateApplied = function(channel, eventId, event) {
		if (event.source === this._getViewStateManagerSVG()) {
			this.activateView(event.view);
		}
	};

	/**
	* Activates the view based on view object passed
	* @param {sap.ui.vk.View} view View object definition
	* @returns {sap.ui.vk.svg.Viewport} returns this
	* @public
	*/
	Viewport.prototype.activateView = function(view) {
		if (!this._scene) {
			return this;
		}

		var viewGroups = this._scene.getViewGroups();
		var that = this;
		if (viewGroups){
			viewGroups.forEach(function(viewGroup){
				viewGroup.getViews().forEach(function(modelView){
					if (modelView === view){
						that._currentViewIndex = viewGroup.getViews().indexOf(modelView);
					}
				});
			});
		}

		this.fireViewActivated({ viewIndex: this._currentViewIndex, view: view });
		vkCore.getEventBus().publish("sap.ui.vk", "viewActivated", { source: this, view: view, viewIndex: this._currentViewIndex });

		vkCore.getEventBus().publish("sap.ui.vk", "readyForAnimation", {
			source: this._getViewStateManagerSVG(),
			view: view,
			ignoreAnimationPosition: false
		});

		this._currentView = view;

		var camera = view.getCamera();
		if (camera) {
			this.setCamera(camera);
		}

		if (view.topColor !== undefined) {
			this.setBackgroundColorTop(colorToCSSColor({
				red: view.topColor[0] * 255,
				green: view.topColor[1] * 255,
				blue: view.topColor[2] * 255,
				alpha: view.topColor[3] })
			);
		}

		if (view.bottomColor !== undefined) {
			this.setBackgroundColorBottom(colorToCSSColor({
				red: view.bottomColor[0] * 255,
				green: view.bottomColor[1] * 255,
				blue: view.bottomColor[2] * 255,
				alpha: view.bottomColor[3] })
			);
		}

		this.rerender();

		this.fireViewFinished({ viewIndex: this._currentViewIndex });

		return this;
	};

	/**
	* Reset current view to its inital status
	*
	* @returns {sap.ui.vk.threejs.Viewport} returns this
	* @private
	*/
	Viewport.prototype.resetCurrentView = function() {
		if (this._currentView) {
			this._getViewStateManagerSVG()._resetNodesStatusByCurrenView(this._currentView);
			this.rerender();
		}
		return this;
	};

	/**
	 * Zooms the scene to a bounding box created from a particular set of nodes.
	 * @param {sap.ui.vk.ZoomTo|sap.ui.vk.ZoomTo[]} what What set of nodes to zoom to.
	 * @param {any} nodeRef Is used if what == (sap.ui.vk.ZoomTo.Node || ZoomTo.NodeSetIsolation)
	 * @param {float} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
	 * @param {float} margin Margin. Set to 0 to zoom to the entire screen.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.zoomTo = function(what, nodeRef, crossFadeSeconds, margin) {
		if (this._width === 0 || this._height === 0 || this._scene == null) {
			return this;
		}

		var boundingBox = {
			min: { x: Infinity, y: Infinity },
			max: { x: -Infinity, y: -Infinity }
		};

		var vsm = this._getViewStateManagerSVG();

		(Array.isArray(what) ? what : [ what ]).forEach(function(what) {
			switch (what) {
				case ZoomTo.All:
					this._scene.getRootElement()._expandBoundingBoxRecursive(boundingBox, -1 >>> 0);
					break;
				case ZoomTo.Visible:
					if (vsm) {
						this._scene.getRootElement()._expandBoundingBoxRecursive(boundingBox, vsm._mask);
					}
					break;
				case ZoomTo.Selected:
					if (vsm) {
						vsm.enumerateSelection(function(nodeRef) {
							nodeRef._expandBoundingBoxRecursive(boundingBox, -1 >>> 0);
						});
					}
					break;
				case ZoomTo.Node:
					if (!nodeRef) {
						return this;
					}
					if (Array.isArray(nodeRef)) {
						nodeRef.forEach(function(nodeRef) {
							nodeRef._expandBoundingBoxRecursive(boundingBox, -1 >>> 0);
						});
					} else {
						nodeRef._expandBoundingBoxRecursive(boundingBox, -1 >>> 0);
					}
					break;
				case ZoomTo.Restore:
					Log.error(getResourceBundle().getText("VIEWPORT_MSG_RESTORENOTIMPLEMENTED"));
					return this;
				case ZoomTo.NodeSetIsolation:
					Log.error(getResourceBundle().getText("VIEWPORT_MSG_NODESETISOLATIONNOTIMPLEMENTED"));
					return this;
				case ZoomTo.RestoreRemoveIsolation:
					Log.error(getResourceBundle().getText("VIEWPORT_MSG_RESTOREREMOVEISOLATIONNOTIMPLEMENTED"));
					return this;
				case ZoomTo.ViewLeft:
				case ZoomTo.ViewRight:
				case ZoomTo.ViewTop:
				case ZoomTo.ViewBottom:
				case ZoomTo.ViewBack:
				case ZoomTo.ViewFront:
					return this;
				default:
					break;
			}
		}.bind(this));

		if (boundingBox.min.x < boundingBox.max.x && boundingBox.min.y < boundingBox.max.y) {
			var newCamera = new OrthographicCamera();
			newCamera._zoomTo(boundingBox, this._width, this._height, margin);
			this._activateCamera(newCamera, crossFadeSeconds);
		}

		return this;
	};

	Viewport.prototype._activateCamera = function(camera, flyToDuration) {
		if (flyToDuration > 0 && !this._animLoopRequestId) {
			this._anim = {
				start: {
					time: Date.now(),
					offsetX: this._camera.offsetX,
					offsetY: this._camera.offsetY,
					zoom: this._camera.zoom
				},
				end: {
					offsetX: camera.offsetX,
					offsetY: camera.offsetY,
					zoom: camera.zoom
				},
				duration: flyToDuration * 1e3
			};

			this._animLoopRequestId = window.requestAnimationFrame(this._animLoopFunction);
		} else {
			this._camera.zoom = camera.zoom;
			this._camera.offsetX = camera.offsetX;
			this._camera.offsetY = camera.offsetY;
			this._updateViewBox();

			this.fireCameraChanged({ viewBox: this._getViewBox() });
		}
	};

	Viewport.prototype.beginGesture = function(x, y) {
		this._gestureX = (x - this._camera.offsetX) / this._camera.zoom;
		this._gestureY = (y - this._camera.offsetY) / this._camera.zoom;
	};

	Viewport.prototype.endGesture = function() {
		this._gestureX = 0;
		this._gestureY = 0;
	};

	Viewport.prototype.pan = function(dx, dy) {
		if (!this.getFreezeCamera()) {
			this._camera.offsetX += dx;
			this._camera.offsetY += dy;
			this._updateViewBox();

			this.fireCameraChanged({ viewBox: this._getViewBox() });
		}
	};

	Viewport.prototype.rotate = function(dx, dy) {
		this.pan(dx, dy);
	};

	Viewport.prototype.zoom = function(z) {
		if (!this.getFreezeCamera()) {
			var oldZoom = this._camera.zoom;
			this._camera.zoom *= z;
			this._camera.offsetX += this._gestureX * (oldZoom - this._camera.zoom);
			this._camera.offsetY += this._gestureY * (oldZoom - this._camera.zoom);

			this._updateViewBox();

			this.fireCameraChanged({ viewBox: this._getViewBox() });
		}
	};

	Viewport.prototype.hover = function(x, y) {
		var vsm = this._getViewStateManagerSVG();
		if (!vsm) {
			return;
		}

		var elem = this.getDisableHotspotHovering() ? null : this.hitTest(x, y);

		if (this._hotspotElement && this._hotspotElement !== elem) {
			this.fireHotspotLeave({ nodeRef: this._hotspotElement });
			if (!this.getShowAllHotspots()) {
				this._hotspotElement.setOpacity(vsm._mask, 0);
			}
			this._hotspotElement = null;
		}

		if (elem && elem._vkGetNodeContentType() === NodeContentType.Hotspot) {
			this._hotspotElement = elem;
			if (!this.getShowAllHotspots()) {
				elem.setOpacity(vsm._mask, 1);
			}
			this.fireHotspotEnter({ nodeRef: elem });
		}
	};

	Viewport.prototype._getViewBox = function() {
		var scale = this._camera.zoom > 0 ? 1 / this._camera.zoom : 1;
		return [ -this._camera.offsetX * scale, -this._camera.offsetY * scale, this._width * scale, this._height * scale ];
	};

	Viewport.prototype._updateViewBox = function() {
		var rootElement = this._scene ? this._scene.getRootElement() : null;
		var domRef = rootElement ? rootElement.domRef : null;
		if (domRef) {
			domRef.parentNode.setAttribute("viewBox", this._getViewBox().join(" "));
			if (this._hotspotEffect) {
				var scale = this._getHotspotEffectScale();
				var ext = scale * 8;
				this._hotspotEffect.setAttribute("x", -ext + "%");
				this._hotspotEffect.setAttribute("y", -ext + "%");
				this._hotspotEffect.setAttribute("width", (100 + ext * 2) + "%");
				this._hotspotEffect.setAttribute("height", (100 + ext * 2) + "%");
				this._hotspotEffect.children[0].setAttribute("stdDeviation", scale);
			}
			return true;
		}

		return false;
	};

	Viewport.prototype._getHotspotEffectScale = function() {
		return this._camera && this._camera.zoom > 0 ? 8 / this._camera.zoom : 0;
	};

	/**
	 * Retrieves information about the current camera view in the scene, and saves the information in a JSON-like object.
	 * The information can then be used at a later time to restore the scene to the same camera view using the
	 * {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} method.<br/>
	 * @param {object}         [query]                       Query object which indicates what information to be retrieved.
	 * @param {boolean|object} [query.visibility=false]      Indicator to retrieve visibility information.
	 * @param {sap.ui.vk.VisibilityMode} [query.visibility.mode=sap.ui.vk.VisibilityMode.Complete]
	 *                                                       Indicator to retrieve the complete visibility definition or just the difference.
	 * @param {boolean|object} [query.selection=false]       Indicator to retrieve selection information.
	 * @returns {object} JSON-like object which holds the current view information. See {@link sap.ui.vk.Viewport#setViewInfo setViewInfo}.
	 *                   In addition to properties defined in {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} the output from
	 *                   {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} contains camera view and projection matrices
	 * <pre>
	 *   {
	 *     ...
	 *   }
	 * </pre>
	 * @public
	 */
	Viewport.prototype.getViewInfo = function(query) {
		var viewInfo = {};

		if (query == null) {
			query = {};
		}

		if (query.camera == null) {
			query.camera = true;
		}

		if (query.camera) {
			viewInfo.camera = { viewBox: this._getViewBox() };
		}

		if (query.visibility && this._viewStateManager) {
			var visibilityMode = query.visibility.mode == null ? VisibilityMode.Complete : query.visibility.mode;
			viewInfo.visibility = {
				mode: visibilityMode
			};
			if (visibilityMode === VisibilityMode.Complete) {
				var allVisibility = this._viewStateManager.getVisibilityComplete();
				viewInfo.visibility.visible = allVisibility.visible;
				viewInfo.visibility.hidden = allVisibility.hidden;
			} else if (this._viewStateManager.getShouldTrackVisibilityChanges()) {
				viewInfo.visibility.changes = this._viewStateManager.getVisibilityChanges();
			} else {
				Log.warning(getResourceBundle().getText(Messages.VIT32.summary), Messages.VIT32.code, "sap.ui.vk.threejs.Viewport");
			}
		}

		var vsm = this._getViewStateManagerSVG();
		if (query.selection && vsm) {
			viewInfo.selection = vsm._getSelectionComplete();
		}

		return viewInfo;
	};

	/**
	 * Sets the current scene to use the camera view information acquired from the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
	 * Internally, the <code>setViewInfo</code> method activates certain steps at certain animation times,
	 * and then changes the camera position, rotation and field of view (FOV) / zoom factor.
	 * @param {object}   viewInfo                             A JSON-like object containing view information acquired using
	 *                                                        the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
	 * @param {object}   [viewInfo.camera]                    A JSON-like object containing the camera information.
	 * @param {object}   [viewInfo.visibility]                A JSON-like object containing the visibility information.
	 * @param {sap.ui.vk.VisibilityMode} viewInfo.visibility.mode If the mode equals to {@link sap.ui.vk.VisibilityMode.Complete complete}
	 *                                                        then the visible and hidden fields are defined. If the mode
	 *                                                        equals {@link sap.ui.vk.VisibilityMode.Differences differences} then
	 *                                                        the changes field is defined.
	 * @param {string[]} viewInfo.visibility.visible          List of Ids of visible nodes.
	 * @param {string[]} viewInfo.visibility.hidden           List of Ids of hidden nodes.
	 * @param {string[]} viewInfo.visibility.changes          List of Ids of nodes with inverted visibility.
	 * @param {object}   [viewInfo.selection]                 A JSON-like object containing the selection information.
	 * @param {string[]} viewInfo.selection.selected          List of Ids of selected nodes.
	 * @param {string[]} viewInfo.selection.outlined          List of Ids of outlined nodes.
	 * @param {float}    [flyToDuration=0]                    Fly-to animation duration in seconds.
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @public
	 */
	Viewport.prototype.setViewInfo = function(viewInfo, flyToDuration) {
		var camera = viewInfo.camera;
		if (camera && camera.viewBox) {
			var newCamera = new OrthographicCamera();
			newCamera._setViewBox(camera.viewBox, this._width, this._height);
			this._activateCamera(newCamera, flyToDuration);
		}

		var veIdToNodeRefMap = new Map();
		if (viewInfo.visibility || viewInfo.selection) {
			var nodeHierarchy = this._viewStateManager.getNodeHierarchy(),
				allNodeRefs = nodeHierarchy.findNodesByName();

			allNodeRefs.forEach(function(nodeRef) {
				// create node proxy based on dynamic node reference
				var nodeProxy = nodeHierarchy.createNodeProxy(nodeRef);
				var veId = nodeProxy.getVeId();
				// destroy the node proxy
				nodeHierarchy.destroyNodeProxy(nodeProxy);
				if (veId) {
					// push the ve id to either visible/hidden array
					veIdToNodeRefMap.set(veId, nodeRef);
				}
			});
		}

		// restoring the visibility state
		if (viewInfo.visibility) {
			switch (viewInfo.visibility.mode) {
				case VisibilityMode.Complete:
					var visibleVeIds = viewInfo.visibility.visible,
						hiddenVeIds = viewInfo.visibility.hidden;

					visibleVeIds.forEach(function(veId) {
						this._viewStateManager.setVisibilityState(veIdToNodeRefMap.get(veId), true, false);
					}, this);

					hiddenVeIds.forEach(function(veId) {
						this._viewStateManager.setVisibilityState(veIdToNodeRefMap.get(veId), false, false);
					}, this);
					break;

				case VisibilityMode.Differences:
					this._viewStateManager.resetVisibility();
					viewInfo.visibility.changes.forEach(function(veId) {
						var nodeRef = veIdToNodeRefMap.get(veId);
						// reverting the visibility for this particular node
						if (nodeRef) {
							this._viewStateManager.setVisibilityState(nodeRef, !this._viewStateManager.getVisibilityState(nodeRef), false);
						}
					}, this);
					break;

				default:
					Log.error(getResourceBundle().getText(Messages.VIT28.summary), Messages.VIT28.code, "sap.ui.vk.threejs.Viewport");
					break;
			}
		}

		var vsm = this._getViewStateManagerSVG();
		var selection = viewInfo.selection;
		if (selection && vsm) {
			var info = vsm._getSelectionComplete();

			if (Array.isArray(selection.selected)) {
				var selected = [];
				var unselected = [];
				selection.selected.forEach(function(veId) {
					var nodeRef = veIdToNodeRefMap.get(veId);
					if (nodeRef) {
						selected.push(nodeRef);
					}
				});
				info.selected.forEach(function(veId) {
					var nodeRef = veIdToNodeRefMap.get(veId);
					if (nodeRef && selection.selected.indexOf(veId) < 0) {
						unselected.push(nodeRef);
					}
				});
				vsm.setSelectionStates(selected, unselected, false, false);
			}
		}
		return this;
	};

	/**
	 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
	 *
	 * @param {function} command The command to be executed.
	 * @returns {sap.ui.vk.svg.Viewport} returns this
	 * @public
	 */
	Viewport.prototype.queueCommand = function(command) {
		if (this instanceof Viewport) {
			command();
		}
		return this;
	};

	/**
	 * Gets position and size of the viewport square.
	 * The information can be used for making calculations when restoring Redlining elements.
	 * @returns {object} The information in this object:
	 *   <ul>
	 *     <li><b>left</b> - The x coordinate of the top-left corner of the square.</li>
	 *     <li><b>top</b> - The y coordinate of the top-left corner of the square.</li>
	 *     <li><b>sideLength</b> - The length of the square.</li>
	 *   </ul>
	 * @public
	 */
	Viewport.prototype.getOutputSize = function() {
		var boundingClientRect = this.getDomRef().getBoundingClientRect();
		var viewportWidth = boundingClientRect.width;
		var viewportHeight = boundingClientRect.height;
		var relevantDimension;

		relevantDimension = Math.min(viewportWidth, viewportHeight);

		return {
			left: (viewportWidth - relevantDimension) * 0.5,
			top: (viewportHeight - relevantDimension) * 0.5,
			sideLength: relevantDimension
		};
	};

	Viewport.prototype.setShouldRenderFrame = function() {

	};

	// HACK: This is added because Viewer app is using it, must be fixed in the app and removed!
	Viewport.prototype._isPanoramicActivated = function() {
		return false;
	};

	Viewport.prototype.setShowAllHotspots = function(value) {
		this.setProperty("showAllHotspots", value, true);
		var vsm = this._getViewStateManagerSVG();
		if (vsm) {
			var nodeHierarchy = vsm.getNodeHierarchy();
			var nodes = nodeHierarchy.getHotspotNodeIds();
			var hotspotElement = this._hotspotElement;
			nodes.forEach(function(node) {
				if (node.domRef) {
					if (value) {
						node.setOpacity(vsm._mask, 1);
					} else if (node !== hotspotElement) {
						node.setOpacity(vsm._mask, 0);
					}
				}
			});
		}
	};

	Viewport.prototype.setDisableHotspotHovering = function(value) {
		this.setProperty("disableHotspotHovering", value, true);
		if (value) {// hide current hotspot
			this.hover(0, 0);
		}
	};

	Viewport.prototype.setHotspotColorABGR = function(value) {
		this.setProperty("hotspotColorABGR", value, true);
		this.setProperty("hotspotColor", colorToCSSColor(abgrToColor(value)), true);
		this.invalidate();
		return this;
	};

	Viewport.prototype.setHotspotColor = function(value) {
		this.setProperty("hotspotColor", value, true);
		this.setProperty("hotspotColorABGR", colorToABGR(cssColorToColor(value)), true);
		this.invalidate();
		return this;
	};


	return Viewport;
});
