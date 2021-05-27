/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides HotspotHelper class.

sap.ui.define([
	"../NodeContentType",
	"./Element"
], function(
	NodeContentType,
	Element
) {
	"use strict";

	var HotspotHelper = function() {};

	HotspotHelper.prototype.createHotspot = function(scene, parentNode, jointNodes, name, nodeInfo) {
		var hotspotNode = scene.getDefaultNodeHierarchy().createNode(parentNode, name, null, NodeContentType.Hotspot, nodeInfo);
		this.updateHotspot(hotspotNode, jointNodes);
		hotspotNode.parent.rerender();
		return hotspotNode;
	};

	HotspotHelper.prototype.removeHotspot = function(scene, hotspotNode) {
		scene.getDefaultNodeHierarchy().removeNode(hotspotNode);
	};

	HotspotHelper.prototype.updateHotspot = function(hotspotNode, jointNodes, forceOpacity) {
		// remove all previous children
		while (hotspotNode.children.length > 0) {
			hotspotNode.remove(hotspotNode.children[ hotspotNode.children.length - 1 ]);
		}

		if (jointNodes) {
			hotspotNode.userData.jointNodes = Array.from(jointNodes);
		}

		jointNodes = hotspotNode.userData.jointNodes;
		if (jointNodes) {
			var hotspotInvWorldMatrix = Element._invertMatrix(hotspotNode._matrixWorld());
			jointNodes.forEach(function(jointNode) {
				var clone = jointNode.clone();
				clone.matrix = Element._multiplyMatrices(hotspotInvWorldMatrix, jointNode._matrixWorld());
				hotspotNode.add(clone);
			});
		}

		hotspotNode._initAsHotspot(forceOpacity);
	};

	return HotspotHelper;
});