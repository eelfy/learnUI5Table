/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

 /**
  * Provides utility methods to dispose THREEJS geometries and materials
  */
sap.ui.define([
	"../thirdparty/three",
	"sap/base/Log"
], function(
	three,
	Log
) {
	"use strict";

    var ThreeUtils = {};

    ThreeUtils._disposeMaterial = function(oMaterial) {
		if (oMaterial.map) {
			oMaterial.map.dispose();
		}
		if (oMaterial.lightMap) {
			oMaterial.lightMap.dispose();
		}
		if (oMaterial.bumpMap) {
			oMaterial.bumpMap.dispose();
		}
		if (oMaterial.normalMap) {
			oMaterial.normalMap.dispose();
		}
		if (oMaterial.specularMap) {
			oMaterial.specularMap.dispose();
		}
		if (oMaterial.envMap) {
			oMaterial.envMap.dispose();
		}
		oMaterial.dispose();
    };

	ThreeUtils.disposeMaterial = function(oMaterial) {
		if (oMaterial) {
			if (oMaterial instanceof THREE.MeshFaceMaterial) {
				oMaterial.materials.forEach(function(m) {
					ThreeUtils._disposeMaterial(m);
				});
			} else {
				ThreeUtils._disposeMaterial(oMaterial);
			}
		}
	};

    ThreeUtils.disposeObject = function(oThreeObject) {
        if (oThreeObject instanceof THREE.Mesh || oThreeObject instanceof THREE.Line || oThreeObject instanceof THREE.Box3Helper) {
            if (oThreeObject.geometry) {
                oThreeObject.geometry.dispose();
			}
			if (oThreeObject.material) {
				ThreeUtils._disposeMaterial(oThreeObject.material);
			}
        }
	};

	ThreeUtils.disposeGeometry = function(oThreeObject) {
		if (oThreeObject instanceof THREE.Mesh || oThreeObject instanceof THREE.Line || oThreeObject instanceof THREE.Box3Helper) {
            if (oThreeObject.geometry) {
                oThreeObject.geometry.dispose();
			}
		}
	};

	ThreeUtils.getAllTHREENodes = function(nodeList, all3DNodes, allGroupNodes) {
		if (!nodeList) {
			return;
		}

		if (!all3DNodes || !allGroupNodes) {
			Log.error("getAllTHREENodes input parameters - all3DNodes and/or allGroupNodes are undefined.");
			return;
		}

		nodeList.forEach(function(n) {
			if (n instanceof THREE.Mesh) {
				all3DNodes.push(n);
			} else if (n instanceof THREE.Light) {
				all3DNodes.push(n);
			} else if (n instanceof THREE.Camera) {
				all3DNodes.push(n);
			} else if (n instanceof THREE.Box3Helper) {
				all3DNodes.push(n);
			} else if (n instanceof THREE.Group) {
				allGroupNodes.push(n);
			}

			if (n.children && n.children.length > 0) {
				ThreeUtils.getAllTHREENodes(n.children, all3DNodes, allGroupNodes);
			}
		});
	};

	return ThreeUtils;
});