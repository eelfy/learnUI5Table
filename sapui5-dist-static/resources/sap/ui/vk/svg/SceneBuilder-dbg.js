/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides object sap.ui.vk.svg.SceneBuilder.
sap.ui.define([
	"sap/base/Log",
	"./Element",
	"./Ellipse",
	"./Rectangle",
	"./Line",
	"./Polyline",
	"./Path",
	"./Text",
	"./OrthographicCamera",
	"../View",
	"../NodeContentType",
	"../TransformationMatrix",
	"../getResourceBundle",
	"../totara/TotaraUtils"
], function(
	Log,
	Element,
	Ellipse,
	Rectangle,
	Line,
	Polyline,
	Path,
	Text,
	OrthographicCamera,
	View,
	NodeContentType,
	TransformationMatrix,
	getResourceBundle,
	TotaraUtils
) {
	"use strict";

	/**
	 * Provides the ability to create SVG scene from the information retrieved from streaming or vds file.
	 * SceneBuilder allows for creating scene tree, material, and drawing elements in any order.
	 *
	 * Constructor for a new SceneBuilder
	 *
	 * @param {any} rootNode The reference object of a root node.
	 * 							When <code>rootNode</code> is specified in constructor, it's assumed that
	 * 							the constructed SceneBuilder only deals with one root node, and therefore one single scene.<br/>
	 * 							When <code>rootNode</code> is not specified, the function setRootNode has to be called for each root node.

	 * @param {any} contentResource From content manager, only used for vds file reading (matai.js).
	 * @param {any} resolve From content manager, called in setScene function, only used for vds file reading (matai.js).
	 * @param {any} reject From content manager, called in serScene function, only used for vds file reading (matai.js).
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.88.0
	 * @experimental Since 1.81.0 This class is experimental and might be modified or removed in future versions.
	 */
	var SceneBuilder = function(rootNode, contentResource, resolve, reject) {
		this._rootNode = rootNode;
		this._contentResource = contentResource;
		this._resolve = resolve;
		this._reject = reject;
		this._cameras = new Map();
		this._sceneIdTreeNodesMap = new Map();	// map of scene id and map of tree nodes
		this._sceneIdRootNodeMap = new Map();	// map of scene id and root node
		this._materialMap = new Map();			// map of loaded materials
		this._materialNodesMap = new Map();		// map of material usage in nodes
		this._nodes = new Map();
		this._viewGroups = new Map();
		this._views = new Map();
		this._viewThumbnails = new Map();
		this._geometries = new Map();			// geometryId -> geometry info
		this._geometryMeshes = new Map();		// geometryId -> [ submesh info ]
		this._meshNodes = new Map();			// meshId -> [ Element ]
		this._meshSubmeshes = new Map();
		this._images = new Map();
		this._fillStyles = new Map();
		this._lineStyles = new Map();
		this._textStyles = new Map();
		this._joints = new Map();				// parentSid -> joint info
		this._yIndex = 1;						// streaming service geometry data

		if (contentResource) {
			var nodeProxy = contentResource.getNodeProxy();
			var nodeHierarchy = nodeProxy.getNodeHierarchy();
			this._vkScene = nodeHierarchy.getScene();

			var source = contentResource.getSource();
			if (source && source.name) {
				this._sceneIdTreeNodesMap.set(source.name, this._nodes);
				this._sceneIdRootNodeMap.set(source.name, rootNode);
				this._currentSceneId = source.name;
			}
			if (this._rootNode) {
				this._rootNode.userData.skipIt = !contentResource.name; // If content resource doesn't have name then don't display it in scene tree
			}
		}
	};

	/**
	 * Set scene information
	 *
	 * @param {any} info The reference object of root node
	 * @public
	 */
	SceneBuilder.prototype.setScene = function(info) {
		if (info.result !== 1) {
			var err = { status: info.result };
			switch (info.result) {
				case -1: err.errorText = getResourceBundle().getText("LOADER_FILENOTFOUND"); break;
				case -2: err.errorText = getResourceBundle().getText("LOADER_WRONGFILEFORMAT"); break;
				case -3: err.errorText = getResourceBundle().getText("LOADER_WRONGPASSWORD"); break;
				case -4: err.errorText = getResourceBundle().getText("LOADER_ERRORREADINGFILE"); break;
				case -5: err.errorText = getResourceBundle().getText("LOADER_FILECONTENT"); break;
				default: err.errorText = getResourceBundle().getText("LOADER_UNKNOWNERROR");
			}
			this._reject(err);
		} else {
			this._yIndex = 1; // VDS4 file geometry data
			this._rootNode.matrix[ 3 ] = info.upAxis === 2 ? -1 : 1; // (0 = +X, 1 = -X, 2 = +Y, 3 = -Y, 4 = +Z, 5 = -Z)
			var camera = this._cameras.get(info.cameraId);
			Log.info("setScene", JSON.stringify(info), camera);
			this._resolve({
				node: this._rootNode,
				camera: camera,
				backgroundTopColor: info.backgroundTopColor,
				backgroundBottomColor: info.backgroundBottomColor,
				contentResource: this._contentResource,
				builder: this
			});
		}
	};

	/**
	 * Set current root node, and create corresponding tree nodes map and mesh ID map
	 *
	 * @param {any} rootNode The reference object of root node
	 * @param {any} nodeId The id of root node in the scene tree
	 * @param {any} sceneId The id of scene with the root node as its top node
	 * @param {sap.ui.vk.svg.Scene} vkScene scene
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining
	 * @public
	 */
	SceneBuilder.prototype.setRootNode = function(rootNode, nodeId, sceneId, vkScene) {
		this._rootNode = rootNode;
		rootNode.sid = nodeId;
		this._nodes.set(nodeId, rootNode);
		this._viewGroups = new Map();
		this._views = new Map();

		if (sceneId) {
			this._sceneIdTreeNodesMap.set(sceneId, this._nodes);
			this._sceneIdRootNodeMap.set(sceneId, rootNode);
			this._currentSceneId = sceneId;
		}

		if (vkScene) {
			this._vkScene = vkScene;
		}
		return this;
	};

	/**
	 * @param {sap.ui.vk.svg.Element} nodeRef Reference to the node which persistent id is set
	 * @param {string} nodeId Node's persistent identifier
	 * @param {string} sceneId The id of the scene where node is loaded
	 * @returns {boolean} <code>true</code> if id is successfully set, otherwise <code>false</code>
	 * @public
	 */
	SceneBuilder.prototype.setNodePersistentId = function(nodeRef, nodeId, sceneId) {
		this._resetCurrentScene(sceneId);

		nodeRef.sid = nodeId;
		this._nodes.set(nodeId, nodeRef);
		return true;
	};

	/**
	 * Clear all data stored in SceneBuilder
	 *
	 * @public
	 */
	SceneBuilder.prototype.cleanup = function() {
		this._rootNode = null;

		this._currentSceneId = null;

		if (this._nodes) {
			this._nodes.clear();
		}
		if (this._viewGroups) {
			this._viewGroups.clear();
		}
		if (this._views) {
			this._views.clear();
		}

		this._materialMap.clear();
		this._materialNodesMap.clear();
		this._sceneIdTreeNodesMap.clear();
		this._sceneIdRootNodeMap.clear();

		this._fillStyles.clear();
		this._lineStyles.clear();
		this._textStyles.clear();
	};

	/**
	 * Get SVG element
	 * @param {any} nodeId The id of node in the scene tree
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {sap.ui.vk.svg.Element} Element group node
	 * @public
	 */
	SceneBuilder.prototype.getNode = function(nodeId, sceneId) {
		if (sceneId) {
			this._resetCurrentScene(sceneId);
			if (this._nodes) {
				return this._nodes.get(nodeId);
			}
		} else {
			var contextIterator = this._sceneIdTreeNodesMap.values();
			var contextItem = contextIterator.next();
			while (!contextItem.done) {
				var node = contextItem.value.get(nodeId);
				if (node) {
					return node;
				}
				contextItem = contextIterator.next();
			}
		}
		return null;
	};

	SceneBuilder.prototype._resetCurrentScene = function(sceneId) {
		if (sceneId && sceneId !== this._currentSceneId) {
			var nodes = this._sceneIdTreeNodesMap.get(sceneId);
			if (nodes) {
				this._nodes = nodes;
			} else {
				this._nodes = new Map();
			}

			var node = this._sceneIdRootNodeMap.get(sceneId);
			if (node) {
				this._rootNode = node;
			} else {
				this._rootNode = null;
			}

			this._currentSceneId = sceneId;
		}
	};

	/**
	 * Create a camera from camera information (not used in SVG)
	 *
	 * @param {any} cameraInfo <br/>
	 * @param {any} sceneId The id of scene containing the nodes
	 *
	 * @returns {sap.ui.vk.svg.OrthographicCamera} The created camera
	 * @public
	 */
	SceneBuilder.prototype.createCamera = function(cameraInfo, sceneId) {
		this._resetCurrentScene(sceneId);

		var camera = new OrthographicCamera();
		camera.setPosition(cameraInfo.origin);
		camera.setZoomFactor(cameraInfo.zoom);

		this._cameras.set(cameraInfo.id, camera);

		return camera;
	};

	/**
	 * Get camera from camera Id (not used in SVG)
	 *
	 * @param {any} cameraId The id of camera
	 * @returns {sap.ui.vk.svg.OrthographicCamera} The camera
	 * @public
	 */
	SceneBuilder.prototype.getCamera = function(cameraId) {
		return this._cameras.get(cameraId);
	};

	SceneBuilder.prototype.hasMesh = function(meshId) {
		return this._meshSubmeshes.has(meshId);
	};

	SceneBuilder.prototype.hasImage = function(imageId) {
		return this._images.has(imageId);
	};

	function findBestLOD(lods) {
		if (Array.isArray(lods)) {
			for (var i = 0; i < lods.length; i++) {
				if (lods[ i ].type === undefined || lods[ i ].type === "mesh" || lods[ i ].type === "line") {
					return lods[ i ];
				}
			}
		}

		return null;
	}

	SceneBuilder.prototype.setMeshNode = function(nodeId, meshId) {
		this._setMeshNode(this._nodes.get(nodeId), meshId);
	};

	SceneBuilder.prototype.setModelViewVisibilitySet = function() {
	};

	SceneBuilder.prototype.setAnimationPlaybacks = function() {
	};

	SceneBuilder.prototype.loadingFinished = function(info) {
		Log.info("loadingFinished", JSON.stringify(info));
		this._loader.fireContentLoadingFinished({
			source: this._contentResource,
			node: this._rootNode
		});
	};

	SceneBuilder.prototype.createThumbnail = function(info) {
		var view = this._viewThumbnails.get(info.imageId);
		if (view) {
			view.thumbnailData = "data:image/" + "jpeg" + ";base64," + window.btoa(String.fromCharCode.apply(null, info.data));
			if (this._fireThumbnailLoaded) {
				this._fireThumbnailLoaded({ modelView: view });
			}
		}
	};

	SceneBuilder.prototype.insertSubmesh = function(submeshInfo) {
		// console.log("insertSubmesh", submeshInfo);
		if (!submeshInfo.lods) {
			return false;
		}

		var lod = findBestLOD(submeshInfo.lods);
		if (!lod) {
			return false;
		}

		submeshInfo.boundingBox = lod.boundingBox;

		var geometry = this._geometries.get(lod.id);
		if (geometry) {
			var nodes = this._meshNodes.get(submeshInfo.meshId);
			if (nodes) {
				for (var ni = 0; ni < nodes.length; ni++) {
					this._addGeometryToNode(nodes[ ni ], geometry, submeshInfo);
				}
			}
		} else {
			TotaraUtils.pushElementIntoMapArray(this._geometryMeshes, lod.id, submeshInfo);
		}

		TotaraUtils.pushElementIntoMapArray(this._meshSubmeshes, submeshInfo.meshId, submeshInfo);
	};

	/**
	 * get a view group - array of views
	 *
	 * @param {any} viewGroupId view group information
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {sap.ui.vk.view[]} array of views.
	 * @public
	 */
	SceneBuilder.prototype.getViewGroup = function(viewGroupId, sceneId) {
		this._resetCurrentScene(sceneId);
		var viewGroup = this._viewGroups.get(viewGroupId);
		var views = [];
		if (viewGroup && viewGroup.views) {
			for (var vi = 0; vi < viewGroup.views.length; vi++) {
				var viewId = viewGroup.views[vi].id;
				var view = this._views.get(viewId);
				if (view) {
					views.push(view);
				}
			}
		}

		return views;
	};

	/**
	 * Insert a view group
	 *
	 * @param {any} info View group information
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertViewGroup = function(info, sceneId) {
		this._resetCurrentScene(sceneId);

		var viewGroup = this._viewGroups.get(info.id);

		if (!viewGroup) {
			viewGroup = this._vkScene.createViewGroup({
				viewGroupId: info.id,
				name: info.name,
				description: info.description
			});
			this._viewGroups.set(info.id, viewGroup);
		} else {
			viewGroup.setViewGroupId(info.id);
			viewGroup.setName(info.name);
			viewGroup.setDescription(info.description);
		}

		viewGroup.type = info.type;
		viewGroup.metadata = info.metadata;
		viewGroup.veids = info.veids;
		viewGroup.views = info.views;
		viewGroup.sceneId = info.sceneId;

		return this;
	};

	/**
	 * Insert a view
	 *
	 * @param {any} viewInfo View information
	 * @param {any} sceneId The scene identifier
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertView = function(viewInfo, sceneId) {
		this._resetCurrentScene(sceneId);

		var view = this._vkScene.createView({
			viewId: viewInfo.viewId,
			name: viewInfo.name,
			description: viewInfo.description ? "<pre style=\"white-space: pre-wrap;\">" + viewInfo.description + "</pre>" : viewInfo.description, // Currently this is plain text so we preserve it's formatting (line breaks)
			aspectRatio: viewInfo.safeAreaAspectRatio
		});

		view.userData = {
			viewInfo: viewInfo
		};

		if (viewInfo.thumbnailId) {
			var imageData = this._images.get(viewInfo.thumbnailId);
			if (imageData) {
				view.thumbnailData = imageData;
			} else {
				this._viewThumbnails.set(viewInfo.thumbnailId, view);
			}
		}

		if (viewInfo.cameraId) {
			view.setCamera(this._cameras.get(viewInfo.cameraId));
		}

		view.type = viewInfo.type;
		view.flyToTime = viewInfo.flyToTime;
		view.preDelay = viewInfo.preDelay;
		view.postDelay = viewInfo.postDelay;
		view.navigationMode = viewInfo.navigationMode;
		view.topColor = viewInfo.topColour;
		view.bottomColor = viewInfo.bottomColour;
		view.dimension = viewInfo.dimension;
		view.query = viewInfo.query;
		view.metadata = viewInfo.metadata;
		view.veids = viewInfo.veids;

		view.viewGroupId = viewInfo.viewGroupId;
		view.id = viewInfo.viewId;

		this._views.set(viewInfo.viewId, view);

		if (view.viewGroupId) {
			var viewGroup = this._viewGroups.get(view.viewGroupId);
			if (viewGroup) {
				viewGroup.addView(view);
			}
		}
		return this;
	};

	/**
	 * Get a view
	 *
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene
	 * @returns {sap.ui.vk.View} View
	 * @public
	 */
	SceneBuilder.prototype.getView = function(viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		return this._views.get(viewId);
	};

	/**
	 * Add a camera to a view
	 *
	 * @param {any} cameraId The id of camera
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setViewCamera = function(cameraId, viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		var camera = this._cameras.get(cameraId);
		var view = this._views.get(viewId);

		if (camera && view) {
			view.setCamera(camera);
		}

		return this;
	};

	/**
	 * Get ids of child nodes of a node.
	 *
	 * @param {any} nodeId The id of node in the scene tree
	 * @param {any} sceneId The id of scene containing the node
	 * @param {boolean} includeMeshNode If set to <code>true</code> then id's of drawing sub-objects will be included in returned array.
	 * @returns {any[]} array of child node ids
	 * @public
	 */
	SceneBuilder.prototype.getChildNodeIds = function(nodeId, sceneId, includeMeshNode) {
		this._resetCurrentScene(sceneId);

		var node = this._nodes.get(nodeId);

		var ids = [];

		if (!node) {
			return ids;
		}

		if (node && node.children) {
			for (var i = 0; i < node.children.length; i++) {
				var child = node.children[ i ];
				if (child.userData.treeNode && child.userData.treeNode.sid) {
					ids.push(child.userData.treeNode.sid);
				} else if (includeMeshNode && child.userData.submeshInfo && child.userData.submeshInfo.id) {
					ids.push(child.userData.submeshInfo.id);
				}
			}
		}
		return ids;
	};

	/**
	 * Add an array of node infos to a view
	 *
	 * @param {any} nodeInfos Array of node info
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setViewNodeInfos = function(nodeInfos, viewId, sceneId) {
		this._resetCurrentScene(sceneId);

		var view = this._views.get(viewId);
		view.setNodeInfos(nodeInfos);

		return this;
	};

	/**
	 * Finalize view group data, should be called after all views are read
	 *
	 * @param {string} sceneId Id of scene
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.finalizeViewGroups = function(sceneId) {
		this._resetCurrentScene(sceneId);

		var entries = this._viewGroups.entries();
		var next = entries.next();
		while (!next.done) {
			var viewGroup = next.value[1];
			var viewGroupId = next.value[0];
			if (!viewGroup || !viewGroup.views || !viewGroup.views.length) {
				next = entries.next();
				continue;
			}

			viewGroup.removeViews();
			for (var vi = 0; vi < viewGroup.views.length; vi++) {
				var viewId = viewGroup.views[vi].id;
				var view = this._views.get(viewId);
				if (view && view.userData.viewInfo.thumbnailId && !view.thumbnailData) {
					var imageData = this._images.get(view.userData.viewInfo.thumbnailId);
					if (imageData) {
						view.thumbnailData = imageData;
					}
				}
				if (view) {
					view.viewGroupId = viewGroupId;
					viewGroup.addView(view);
				}
			}
			next = entries.next();
		}
		return this;
	};

	/**
	 * Set threshold number which controls loading of LOD levels
	 * @param {number} voxelThreshold The ratio of the item bounding box to the scene/view bounding box.
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setVoxelThreshold = function(voxelThreshold) {
		return this;
	};

	/**
	 * Get threshold number which controls loading of LOD levels
	 * @returns {number} Threshold level.
	 * @public
	 */
	SceneBuilder.prototype.getVoxelThreshold = function() {
		return 0.0;
	};

	/**
	 * Create SVG grouping element
	 *
	 * @param {any} nodeInfo The node information object containning the following properties <br/>
	* 							<code>sid</code>: String. The id of node.
	 * 							<code>parametricId</code>: String. The id of object's parametric representation.
	 * 							<code>name</code>: String. The name of the node. Optional.<br/>
	 * 							<code>visible</code>: Boolean. True if the node is visible. Default true. Optional<br/>
	 * 							<code>visualisable</code>: Boolean. False if the node is skipped. Default true. Optional<br/>
	 * 							<code>materialId</code>: String. The id of the material the node is associated with. Optional<br/>
	 * 							<code>meshId</code>: String. The id of the mesh. Optional<br/>
	 * 							<code>opacity</code>: String. The opacity of node, to be applied to submesh nodes. Optional<br/>
	 * 							<code>parentId</code>: id of parent node. Optional<br/>
	 *
	 * @param {string} sceneId The id of scene containing the node
	 * @returns {any} The created node<br/>
	*/
	SceneBuilder.prototype.createNode = function(nodeInfo, sceneId) {
		this._resetCurrentScene(sceneId);

		var transform = nodeInfo.transform;
		var node = new Element({
			sid: nodeInfo.sid,
			name: nodeInfo.name,
			matrix: TransformationMatrix.convertTo3x2(transform)
		});
		this._nodes.set(nodeInfo.sid, node);

		var userData = node.userData;
		if (nodeInfo.metadata) {
			userData.metadata = nodeInfo.metadata;
		}
		if (nodeInfo.veids) {
			userData.veids = nodeInfo.veids;
		}

		if (nodeInfo.parametricId) {
			userData.parametricId = nodeInfo.parametricId;
		} else if (nodeInfo.meshId) {
			this._setMeshNode(node, nodeInfo.meshId);
		}

		userData.treeNode = nodeInfo;
		node.setVisible(1, nodeInfo.visible ? nodeInfo.visible : true);

		if (nodeInfo.visualisable === false) {
			userData.skipIt = true; // Don't display this node in scene tree
		}

		if (nodeInfo.contentType === "HOTSPOT") {
			node._vkSetNodeContentType(NodeContentType.Hotspot);
		}

		if (nodeInfo.joints) {
			nodeInfo.joints.forEach(function(joint) {
				var parent = this._nodes.get(joint.parentSid);
				if (parent) {
					parent.userData.jointNodes = parent.userData.jointNodes || [];
					parent.userData.jointNodes.push(node);
				} else {
					TotaraUtils.pushElementIntoMapArray(this._joints, joint.parentSid, node);
				}
			}, this);
		}

		var jointNodes = this._joints.get(nodeInfo.sid);
		if (jointNodes) {
			userData.jointNodes = userData.jointNodes ? userData.jointNodes.concat(jointNodes) : jointNodes;
		}

		var parent = this._nodes.get(nodeInfo.parentId);
		(parent || this._rootNode).add(node);

		return node;
	};

	/**
	 * If node has both mesh and parametric definitions this method will tell which one to use.
	 * @returns {boolean} true if meshes are prefered over parametric definition
	 * @public
	 */
	SceneBuilder.prototype.preferMeshes = function() {
		return false;
	};

	////////////////////////////////////////////////////////////////////////
	// Add an annotation to a node
	SceneBuilder.prototype.createAnnotation = function(annotation, sceneId) {
		// TODO: Implement HTML annotations for 2D content
	};

	/**
	 * Delete array of nodes
	 *
	 * @param {any[]} nodeIds Array of ids of nodes to be deleted
	 * @param {any} sceneId The id of scene containing the nodes
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.remove = function(nodeIds, sceneId) {
		this._resetCurrentScene(sceneId);

		var that = this;

		nodeIds = [].concat(nodeIds);
		nodeIds.forEach(function(id) {
			var target = that._nodes.get(id); // search tree node map
			if (target) {
				that._nodes.delete(id);

				for (var i = 0; i < target.children.length; i++) {
					var child = target.children[ i ];
					if (child.userData && child.userData.treeNode && child.userData.treeNode.sid) {
						that.remove(child.userData.treeNode.sid, sceneId);
					}
				}
			}
		});

		return this;
	};

	SceneBuilder.prototype._addPolylineSegment = function(segments, indices, points) {
		var count = indices.length;
		if (count < 2) {
			return;
		}
		var polylinePoints = [];
		var closed = indices[ 0 ] === indices[ count - 1 ];
		if (closed) {
			count--;
		}
		for (var i = 0, l = indices.length; i < l; i++) {
			var ei = indices[ i ] * 3;
			polylinePoints.push(points[ ei ], points[ ei + this._yIndex ]);
		}
		segments.push({
			type: "polyline",
			points: polylinePoints,
			closed: closed
		});
	};

	SceneBuilder.prototype._addGeometryToNode = function(node, geometry, submeshInfo) {
		var materialId = submeshInfo.materialId;
		var material = this._getMaterial(materialId);
		// console.log("addGeometryToNode", node.name, node, geometry, submeshInfo.transform, submeshInfo.boundingBox, material);
		var data = geometry.data;
		var indices = data.indices;
		var points = data.points;
		var matrix = new Float32Array([ 1, 0, 0, 1, 0, 0 ]);
		if (geometry.isPositionQuantized && submeshInfo.boundingBox) {
			// TODO: dequantize points or update matrix
		}
		if (submeshInfo.transform) {
			// TODO: transform points or update matrix
		}
		var i, i0, i1, i2;
		var l = indices.length;
		var segments = [];
		if (geometry.isPolyline) {
			material = Object.assign(Object.assign({}, material), { color: [ 0, 0, 0, 0 ] }); // no fill
			var polylineIndices = [];
			for (i = 0, i0 = -1; i < l; i += 2, i0 = i2) {
				i1 = indices[ i ];
				i2 = indices[ i + 1 ];
				if (i1 !== i0) {
					this._addPolylineSegment(segments, polylineIndices, points);
					polylineIndices.length = 0;
					polylineIndices.push(i1);
				}
				polylineIndices.push(i2);
			}

			this._addPolylineSegment(segments, polylineIndices, points);
		} else {
			material = Object.assign(Object.assign({}, material), { lineColor: [ 0, 0, 0, 0 ], lineWidth: 0 }); // no stroke
			var meshPoints = [];
			for (i = 0; i < l; i += 3) {
				i0 = indices[ i ] * 3;
				i1 = indices[ i + 1 ] * 3;
				i2 = indices[ i + 2 ] * 3;
				meshPoints.push(points[ i0 ], points[ i0 + this._yIndex ], points[ i1 ], points[ i1 + this._yIndex ], points[ i2 ], points[ i2 + this._yIndex ]);
			}
			segments.push({
				type: "mesh",
				points: meshPoints
			});
		}

		var path = new Path({
			segments: segments,
			isTriangleMesh: !geometry.isPolyline,
			matrix: matrix,
			material: material,
			materialID: materialId,
			fillStyle: geometry.isPolyline ? null : { colour: material.color },
			subelement: true
		});
		path.uid += "-g";
		node.add(path);

		TotaraUtils.pushElementIntoMapArray(this._materialNodesMap, materialId, path);

		node.rerender();
	};

	/**
	 * Create a geometry from geometry information
	 *
	 * @param {any} geomInfo The object of geometry information that have the following properties<br/>
	 *								<code>id</code> : string, id of this geometry<br/>
	 *								<code>isPolyline</code>: boolean, true if the submesh is polyline<br/>
	 *								<code>isPositionQuantized</code>: boolean, true if the asociated submesh needs to be repositioned to bounding box centre<br/>
	 *								<code>data.indices</code>: array of point index<br/>
	 *								<code>data.points</code>: array of point coordinates<br/>
	 *								<code>data.uvs</code>: array of texture uv coordinates, optional<br/>
	 *
	 * @returns {sap.ui.vk.svg.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setGeometry = function(geomInfo) {
		this._geometries.set(geomInfo.id, geomInfo);
		// console.log("setGeometry", geomInfo);

		var geometryMeshes = this._geometryMeshes.get(geomInfo.id);
		if (geometryMeshes) {
			for (var mi = 0; mi < geometryMeshes.length; mi++) {
				var submeshInfo = geometryMeshes[ mi ];
				var nodes = this._meshNodes.get(submeshInfo.meshId);
				if (nodes) {
					for (var ni = 0; ni < nodes.length; ni++) {
						this._addGeometryToNode(nodes[ ni ], geomInfo, submeshInfo);
					}
				}
			}
		}

		if (this._fireSceneUpdated) {
			this._fireSceneUpdated();
		}

		return this;
	};

	SceneBuilder.prototype._setMeshNode = function(node, meshId) {
		TotaraUtils.pushElementIntoMapArray(this._meshNodes, meshId, node);

		var submeshes = this._meshSubmeshes.get(meshId);
		if (submeshes) {
			for (var i = 0; i < submeshes.length; i++) {
				var submeshInfo = submeshes[ i ];
				var lod = findBestLOD(submeshInfo.lods);
				if (lod) {
					var geometry = this._geometries.get(lod.id);
					if (geometry) {
						this._addGeometryToNode(node, geometry, submeshInfo);
					}
				}
			}
		}
	};

	function getTransformationMatrix(shape) {
		var matrix = new Float32Array([ 1, 0, 0, 1, 0, 0 ]);
		if (shape.t) {
			matrix[ 4 ] = shape.t[ 0 ];
			matrix[ 5 ] = shape.t[ 1 ];
		}
		if (shape.r) {
			var x = shape.r[ 0 ], y = shape.r[ 1 ], z = shape.r[ 2 ], w = shape.r[ 3 ];
			var xy = x * y;
			var zz = z * z;
			var wz = w * z;
			matrix[ 0 ] = 1 - (y * y + zz) * 2;
			matrix[ 1 ] = (xy + wz) * 2;
			matrix[ 2 ] = (xy - wz) * 2;
			matrix[ 3 ] = 1 - (x * x + zz) * 2;
		}
		if (shape.s) {
			matrix[ 0 ] *= shape.s[ 0 ];
			matrix[ 1 ] *= shape.s[ 0 ];
			matrix[ 2 ] *= shape.s[ 1 ];
			matrix[ 3 ] *= shape.s[ 1 ];
		}
		return matrix;
	}

	function optimizeShapes(shapes) {
		var segments = [];
		var materialID;

		function addShape() {
			if (segments.length > 0) {
				segments.forEach(function(segment) {
					var points = segment.points;
					if (points && points.length >= 4 && points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
						segment.closed = true;
						points.length -= 2;
					}
				});

				shapes.push({
					type: "path",
					segments: segments,
					materialID: materialID
				});
				segments = [];
			}
		}

		var matrix;
		var i = 0;
		while (i < shapes.length) {
			var shape = shapes[ i ];
			if (shape.type === "line") {
				if (materialID !== shape.materialID) {
					addShape();
					materialID = shape.materialID;
				}

				matrix = getTransformationMatrix(shape);
				var x1 = shape.x1 * matrix[ 0 ] + shape.y1 * matrix[ 2 ] + matrix[ 4 ];
				var y1 = shape.x1 * matrix[ 1 ] + shape.y1 * matrix[ 3 ] + matrix[ 5 ];
				var x2 = shape.x2 * matrix[ 0 ] + shape.y2 * matrix[ 2 ] + matrix[ 4 ];
				var y2 = shape.x2 * matrix[ 1 ] + shape.y2 * matrix[ 3 ] + matrix[ 5 ];

				var points = segments.length > 0 ? segments[ segments.length - 1 ].points : null;
				if (points && points[ points.length - 2 ] === x1 && points[ points.length - 1 ] === y1) {
					points.push(x2, y2);
				} else {
					segments.push({
						type: "polyline",
						points: [ x1, y1, x2, y2 ]
					});
				}
				shapes.shift();
			} else {
				i++;
			}
		}

		addShape();
	}

	/**
	 * Set parametric content to scene node
	 * @param {string} nodeId Identifier of the node which will have parametric content assigned
	 * @param {any} parametricContent  The object with parametric content with the following properties<br/>
	 * 									<code>id</code>: string, id of this object<br/>
	 * 									<code>type</code>: string, type of this object<br/>
	 * @param {any} sceneId The scene identifier
	 * @public
	 */
	SceneBuilder.prototype.setParametricContent = function(nodeId, parametricContent, sceneId) {
		if (parametricContent == null) {
			Log.warning("Empty parametric content for node " + nodeId);
			return;
		}

		// console.log("setParametricContent", nodeId, parametricContent);

		this._resetCurrentScene(sceneId);
		var node = this._nodes.get(nodeId);
		node.uid += "-p";

		var shapes = parametricContent.shapes;
		if (shapes) {
			optimizeShapes(shapes);

			for (var i = 0; i < shapes.length; i++) {
				var shape = this._createObject(shapes[ i ]);
				if (shape) {
					node.add(shape);
				}
			}
		} else {
			var newNode = this._createObject(parametricContent);
			if (newNode) {
				node.add(newNode);
			}
		}

		node.rerender();
	};

	SceneBuilder.prototype._createObject = function(parametricContent) {
		parametricContent.matrix = getTransformationMatrix(parametricContent);
		parametricContent.subelement = true;
		parametricContent.material = this._getMaterial(parametricContent.materialID);

		if (this._lineStyles && parametricContent.stroke_id !== undefined) {
			parametricContent.lineStyle = this._lineStyles.get(parametricContent.stroke_id);
		}

		if (this._fillStyles && parametricContent.fill_id !== undefined) {
			parametricContent.fillStyle = this._fillStyles.get(parametricContent.fill_id);
		}

		if (this._textStyles && parametricContent.style_id !== undefined) {
			parametricContent.style = this._textStyles.get(parametricContent.style_id);
		}

		var shape;
		switch (parametricContent.type) {
			case "arc":
			case "ellipticalArc":
				// console.log(parametricContent.type, parametricContent.start * 180 / Math.PI, parametricContent.end * 180 / Math.PI);
				parametricContent.segments = [ {
					type: "arc",
					cx: parametricContent.cx || 0,
					cy: parametricContent.cy || 0,
					rx: parametricContent.major || parametricContent.radius,
					ry: parametricContent.minor || parametricContent.radius,
					start: parametricContent.start > parametricContent.end ? parametricContent.start - Math.PI * 2 : parametricContent.start,
					end: parametricContent.end
				} ];
				shape = new Path(parametricContent);
				break;
			case "rectangle":
				shape = new Rectangle(parametricContent);
				break;
			case "line":
				shape = new Line(parametricContent);
				break;
			case "polyline":
				shape = new Polyline(parametricContent);
				break;
			case "ellipse":
			case "circle":
				shape = new Ellipse(parametricContent);
				break;
			case "text":
				if (this._rootNode.matrix[ 3 ] < 0) {// flip text vertically
					parametricContent.matrix[ 2 ] *= -1;
					parametricContent.matrix[ 3 ] *= -1;
				}
				shape = new Text(parametricContent);
				break;
			case "path":
				shape = new Path(parametricContent);
				break;
			default:
				Log.warning("Unsupported parametric type", parametricContent.type);
				shape = null;
				break;
		}

		if (shape) {
			shape.userData.po = parametricContent;
			shape.uid += "-s";
			if (parametricContent.materialID) {
				TotaraUtils.pushElementIntoMapArray(this._materialNodesMap, parametricContent.materialID, shape);
			}
		}

		return shape;
	};

	/**
	 * Clean up internal lists when node is deleted
	 * @param {any} nodeRef Node to be removed
	 * @public
	 */
	SceneBuilder.prototype.removeNode = function(nodeRef) {
		this._nodes.delete(nodeRef.sid);
	};

	/**
	 * Create material object from material information
	 * @param  {any} materialInfo The object of material information that have the following properties<br/>
	 * 								<code>id</code>: string, id of this element<br/>
	 * 								<code>name</code>: material name<br/>
	 * 								<code>diffuseColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
	 * 								<code>opacity</code>: float, opacity, defaults to 0, optional<br/>
	 * 								<code>lineDashPattern</code>: [ array of floats of dash pattern, optional]<br/>
	 * 								<code>lineDashPatternScale</code> : line's dash pattern segment scale, defaults to 0, optional<br/>
	 * 								<code>lineColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
	 * 								<code>lineWidth</code>: float, line's width, defaults to 0, optional<br/>
	 * 								<code>lineHaloWidth</code>
	 * 								<code>lineEndCapStyle</code>
	 * 								<code>lineWidthCoordinateSpace</code>
	 * @returns {string[]} Array of texture ids to be loaded
	 * @public
	 */
	SceneBuilder.prototype.createMaterial = function(materialInfo) {
		// console.log("createMaterial", materialInfo.id, materialInfo);
		var materialId = materialInfo.id;
		var material = this._getMaterial(materialId);

		material.lineColor = materialInfo.lineColour;
		material.lineWidth = materialInfo.lineWidth || 1;
		material.lineStyle = {
			width: materialInfo.lineWidth || 1,
			haloWidth: materialInfo.lineHaloWidth || 0,
			endCapStyle: materialInfo.lineEndRound ? 1 : 0,
			dashPattern: materialInfo.lineDashPattern || [],
			dashPatternScale: materialInfo.lineDashPatternScale,
			widthCoordinateSpace: materialInfo.lineWidthCoordinateSpace
		};

		if (materialInfo.emissiveColour) {
			material.color = materialInfo.emissiveColour;
		}

		if (materialInfo.opacity !== undefined) {
			material.opacity = materialInfo.opacity;
		}

		var nodeIdsToUpdate = this._materialNodesMap.get(materialId);
		if (nodeIdsToUpdate) {
			for (var j = 0; j < nodeIdsToUpdate.length; j++) {
				nodeIdsToUpdate[ j ].setMaterial(material, true);
			}
		}

		return [];
	};

	SceneBuilder.prototype._getMaterial = function(materialId) {
		return this._materialMap.get(materialId) || this._createTemporaryMaterial(materialId);
	};

	SceneBuilder.prototype._createTemporaryMaterial = function(materialId) {
		var material = {
			materialId: materialId,
			lineColor: [ 0, 0, 0, 1 ],
			lineWidth: 1
		};
		this._materialMap.set(materialId, material);
		return material;
	};

	/**
	 * Check if material is already loaded
	 * @param {string} materialId Id of the material
	 * @param {boolean} temporaryMaterialNeeded Is set to <code>true</code> and material with <code>materialId</code> does not exist then temporary material will be created
	 * @returns {boolean} <code>true</code> if material exists, otherwise <code>false</code>
	 * @public
	 */
	SceneBuilder.prototype.checkMaterialExists = function(materialId, temporaryMaterialNeeded) {
		if (!this._materialMap.get(materialId)) {
			if (temporaryMaterialNeeded) {
				this._createTemporaryMaterial(materialId);
			}
			return false;
		}
		return true;
	};

	SceneBuilder.prototype.updateViewsForReplacedNodes = function(nodeInfos) {

	};

	/**
	 * Load fill style
	 * @param {any} fillStyle Objects with veid and fill colour
	 * @public
	 */
	SceneBuilder.prototype.insertFillStyle = function(fillStyle) {
		this._fillStyles.set(fillStyle.veid, fillStyle);
	};

	/**
	 * Load line style
	 * @param {any} lineStyle Objects with veid, line colour and dash pattern
	 * @public
	 */
	SceneBuilder.prototype.insertLineStyle = function(lineStyle) {
		this._lineStyles.set(lineStyle.veid, lineStyle);
	};

	/**
	 * Load text style
	 * @param {any} textStyle Objects with veid, font family and font size
	 * @public
	 */
	SceneBuilder.prototype.insertTextStyle = function(textStyle) {
		this._textStyles.set(textStyle.veid, textStyle);
	};

	var uint8ArrayToString = function(uint8Array) {

		var finalString = "";
		try {
			// if uint8Array is too long, stack runsout in String.fromCharCode.apply
			// so batch it in certain size
			var CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
			var index = 0;
			var length = uint8Array.length;
			var slice;
			while (index < length) {
				slice = uint8Array.slice(index, Math.min(index + CHUNK_SIZE, length)); // `Math.min` is not really necessary here I think
				finalString += String.fromCharCode.apply(null, slice);
				index += CHUNK_SIZE;
			}
		} catch (e) {
			finalString = "";
			// console.log(e);
		}
		return finalString;
	};

	SceneBuilder.prototype.createImage = function(imageInfo) {
		if (imageInfo.binaryData.length < 32) {
			Log.warning("SceneBuilder.createImage()", "Can't create image from empty data");
			return this;
		}

		var dv = new DataView(imageInfo.binaryData.buffer);

		var isPng = true;
		// rest is image blob
		// check jpeg magic number
		if (dv.getUint8(0, true) === parseInt("0xFF", 16) &&
			dv.getUint8(1, true) === parseInt("0xD8", 16)) {
			// you must be jpg.
			isPng = false; // currently we only support jpg and png
		}

		var imageDataStr = uint8ArrayToString(imageInfo.binaryData);

		var dataUri = "data:image/" + (isPng ? "png" : "jpeg") + ";base64," + btoa(imageDataStr);

		this._images.set(imageInfo.id, dataUri);

		return this;
	};

	SceneBuilder.prototype.setViewThumbnail = function(imageId, viewId, sceneId, tileWidth) {
		this._resetCurrentScene(sceneId);
		var view = this._views.get(viewId);
		var imageData = this._images.get(imageId);

		if (view && imageData) {
			if (view.userData !== undefined){
				if (view.userData.viewInfo.thumbnailId === imageId) {
					view.thumbnailData = imageData;
				}
			}
		}
		return this;
	};

	return SceneBuilder;
});