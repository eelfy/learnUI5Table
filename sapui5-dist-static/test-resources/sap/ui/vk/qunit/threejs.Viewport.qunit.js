/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/vk/CameraProjectionType",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/VisibilityMode",
	"sap/ui/vk/threejs/ThreeUtils",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"test-resources/sap/ui/vk/qunit/utils/ThreeJSUtils"
], function(
	CameraProjectionType,
	ViewStateManager,
	Viewport,
	VisibilityMode,
	ThreeUtils,
	loader,
	ThreeJSUtils
) {
	"use strict";

	var viewStateManager = null;
	var viewport = null;

	var materialCreate = sinon.spy(THREE.Material, "call");
	var materialDispose = sinon.spy(THREE.Material.prototype, "dispose");
	var geometryCreate = sinon.spy(THREE.BufferGeometry, "call");
	var geometryDispose = sinon.spy(THREE.BufferGeometry.prototype, "dispose");

	QUnit.moduleWithContentConnector("Viewport", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);

		// set node fake veid
		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
		var allNodeRefs = nodeHierarchy.findNodesByName();
		allNodeRefs.forEach(function(node) {
			node.userData.treeNode = { sid: node.uuid };
		});
	}, function(assert) {
		viewStateManager = new ViewStateManager();
		viewport = new Viewport({ viewStateManager: viewStateManager });
		viewport.placeAt("content");
		materialCreate.resetHistory();
		materialDispose.resetHistory();
		geometryCreate.resetHistory();
		geometryDispose.resetHistory();
	}, function(assert) {
		viewStateManager.destroy();
		var materialCallInfo = ThreeJSUtils.createCallInfo(materialCreate, materialDispose);
		ThreeJSUtils.analyzeCallInfo("Materials", materialCallInfo, assert);
		var geometryCallInfo = ThreeJSUtils.createCallInfo(geometryCreate, geometryDispose);
        ThreeJSUtils.analyzeCallInfo("Geometries", geometryCallInfo, assert);
	});

	QUnit.test("Initialization", function(assert) {
		assert.ok(viewport, "The viewport is created.");
		assert.ok(viewport instanceof Viewport, "The viewport is sap.ui.vk.threejs.Viewport implementation.");
	});

	QUnit.test("Default values", function(assert) {
		// No query provided (shall return camera info only)
		var viewInfo = viewport.getViewInfo();
		assert.notEqual(viewInfo.camera, null, "No query - Camera retrieved");
		assert.equal(viewInfo.visibility, null, "No query - No visibility information");
		assert.equal(viewInfo.selection, undefined, "No query - No selection information");

		// Query with no camera required
		viewInfo = viewport.getViewInfo({ camera: false });
		assert.equal(viewInfo.camera, null, "Camera info shall not be retreived");

		// Simple visibility query without camera specified (shall still return camera info)
		viewInfo = viewport.getViewInfo({ visibility: true, selection: false });
		assert.notEqual(viewInfo.camera, null, "No camera query - Camera still retreived");
		assert.notEqual(viewInfo.visibility, null, "Visibility required - Visibility information retreived");
		assert.equal(viewInfo.visibility.visible.length, 8, "Visibility required - Correct number of visible nodes");
		assert.equal(viewInfo.visibility.hidden.length, 0, "Visibility required - Correct number of hidden nodes");
		assert.equal(viewInfo.selection, undefined, "Selection not required -  No selection information");

		// Visibility query requiring differences but diff tracking is not set
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.notEqual(viewInfo.visibility, null, "Visibility diff required - Visibility object retreived");
		assert.equal(viewInfo.visibility.changes, null, "Visibility diff required - Tracking not set");

		// Visibility query requiring differences with diff tracking set
		var viewStateManager = viewport._viewStateManager;
		viewStateManager.setShouldTrackVisibilityChanges(true);
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.notEqual(viewInfo.visibility, null, "Visibility diff required - Visibility object retreived");
		assert.notEqual(viewInfo.visibility.changes, null, "Visibility diff required - Tracking set");

		// Simple selection query
		viewInfo = viewport.getViewInfo({ selection: true });
		assert.ok(!!viewInfo.selection, "Selection required - Selection information retreived");
		assert.equal(viewInfo.selection.selected.length, 0, "Selection required - No selected nodes");
		assert.equal(viewInfo.selection.outlined.length, 0, "Selection required - No outlined nodes");
	});

	QUnit.test("setViewInfo getViewInfo", function(assert) {
		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy(),
			viewStateManager = viewport._viewStateManager,
			allNodeRefs = nodeHierarchy.findNodesByName(),
			nodeRefToVEID = new Map(),
			veidToNodeRef = new Map(),
			nodeRefs = [],
			nodes = [];
		allNodeRefs.forEach(function(node) {
			nodeRefs.push(node);
			nodes.push(node.uuid);
			nodeRefToVEID.set(node, node.uuid);
			veidToNodeRef.set(node.uuid, node);
		});

		var cameraTests = [
			{ camera: { rotation: { yaw: -48, pitch: 32, roll: -35 }, position: { x: 10, y: 20, z: 30 }, projectionType: CameraProjectionType.Orthographic, zoomFactor: 1.123 } },
			{ camera: { rotation: { yaw: -137, pitch: -32, roll: 45 }, position: { x: 200, y: 300, z: 400 }, projectionType: CameraProjectionType.Perspective, fieldOfView: 45.67 } },
			{ camera: { rotation: { yaw: 134, pitch: 43, roll: -76 }, position: { x: 100, y: 50, z: 25 }, projectionType: CameraProjectionType.Orthographic, zoomFactor: 2.345 } },
			{ camera: { rotation: { yaw: 90, pitch: -5, roll: 10 }, position: { x: 350, y: 0, z: 0 }, projectionType: CameraProjectionType.Perspective, fieldOfView: 34.56 } }
		];

		function floatEqual(a, b, desc) {
			assert.deepEqual(a.toFixed(4), b.toFixed(4), desc);
		}

		cameraTests.forEach(function(test) {
			viewport.setViewInfo(test, 0);
			var camera = viewport.getViewInfo({ camera: true }).camera;
			floatEqual(camera.position.x, test.camera.position.x, "camera.position.x");
			floatEqual(camera.position.y, test.camera.position.y, "camera.position.y");
			floatEqual(camera.position.z, test.camera.position.z, "camera.position.z");
			floatEqual(camera.rotation.yaw, test.camera.rotation.yaw, "camera.yaw");
			floatEqual(camera.rotation.pitch, test.camera.rotation.pitch, "camera.pitch");
			floatEqual(camera.rotation.roll, test.camera.rotation.roll, "camera.roll");
			assert.deepEqual(camera.projectionType, test.camera.projectionType, "camera.projectionType");
			if (camera.projectionType === CameraProjectionType.Orthographic) {
				assert.deepEqual(camera.zoomFactor, test.camera.zoomFactor, "camera.zoomFactor");
			} else {
				assert.deepEqual(camera.fieldOfView, test.camera.fieldOfView, "camera.fieldOfView");
			}
		});

		var visibilityTests = [
			{ visibility: { visible: [ nodes[ 3 ], nodes[ 6 ] ], hidden: [ nodes[ 7 ], nodes[ 2 ] ], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [ nodes[ 7 ], nodes[ 3 ] ], hidden: [ nodes[ 2 ], nodes[ 6 ] ], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [ nodes[ 2 ], nodes[ 6 ] ], hidden: [ nodes[ 7 ], nodes[ 3 ] ], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [ nodes[ 3 ], nodes[ 7 ], nodes[ 2 ] ], hidden: [ nodes[ 6 ] ], mode: VisibilityMode.Complete } }
		];

		visibilityTests.forEach(function(test) {
			viewport.setViewInfo(test, 0);
			var visibility = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Complete } }).visibility;
			test.visibility.visible.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.deepEqual(viewStateManager.getVisibilityState(nodeRef), true, veid + " visible");
				assert.notDeepEqual(visibility.visible.indexOf(veid), -1, veid + " visible");
				assert.deepEqual(visibility.hidden.indexOf(veid), -1, veid + " not hidden");
			});
			test.visibility.hidden.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.deepEqual(viewStateManager.getVisibilityState(nodeRef), false, veid + " hidden");
				assert.deepEqual(visibility.visible.indexOf(veid), -1, veid + " not visible");
				assert.notDeepEqual(visibility.hidden.indexOf(veid), -1, veid + " hidden");
			});
		});

		var vsm = sap.ui.getCore().byId(viewport.getViewStateManager());

		function testSelectionViewInfo(count1, count2) {
			var viewInfo = viewport.getViewInfo({ selection: true });

			assert.equal(viewInfo.selection.selected.length, count1, count1 + " selected nodes");
			assert.equal(viewInfo.selection.outlined.length, count2, count2 + " outlined nodes");

			vsm.enumerateSelection(function(nodeRef) {
				var veId = nodeRefToVEID.get(nodeRef);
				assert.ok(viewInfo.selection.selected.indexOf(veId) >= 0, veId + " selected");
			});
			vsm.enumerateOutlinedNodes(function(nodeRef) {
				var veId = nodeRefToVEID.get(nodeRef);
				assert.ok(viewInfo.selection.outlined.indexOf(veId) >= 0, veId + " outlined");
			});

			return viewInfo;
		}

		testSelectionViewInfo(0, 0);

		vsm.setSelectionStates([ nodeRefs[ 1 ], nodeRefs[ 2 ], nodeRefs[ 3 ] ], [], false, false);
		vsm.setOutliningStates([ nodeRefs[ 1 ], nodeRefs[ 4 ] ], [], false, false);
		var vi = testSelectionViewInfo(3, 2);

		vsm.setSelectionStates([ nodeRefs[ 3 ], nodeRefs[ 5 ] ], [ nodeRefs[ 1 ], nodeRefs[ 2 ] ], false, false);
		vsm.setOutliningStates([ nodeRefs[ 1 ], nodeRefs[ 6 ], nodeRefs[ 7 ] ], [ nodeRefs[ 4 ] ], false, false);
		testSelectionViewInfo(2, 3);

		viewport.setViewInfo(vi);
		testSelectionViewInfo(3, 2);
	});

	QUnit.test("Freeze camera", function(assert) {
		// check default value
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// get initial camera position
		var initialCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen");

		// try to rotate
		viewport._viewportGestureHandler._cameraController.rotate(20, 20);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not rotated");

		// try to pan
		viewport._viewportGestureHandler._cameraController.pan(5, 10);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not panned");

		// try to zoom
		viewport._viewportGestureHandler._cameraController.zoom(1.4);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not zoomed");

		// unfreeze camera
		viewport.setFreezeCamera(false);
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// zoom out scene
		viewport._viewportGestureHandler._cameraController.beginGesture(1, 1);
		viewport._viewportGestureHandler._cameraController.zoom(0.04);
		viewport._viewportGestureHandler._cameraController.endGesture();

		// get new camera position
		var newCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen again");

		// try to double click
		var done = assert.async();
		viewport.tap(1, 1, true);
		setTimeout(function() {
			assert.deepEqual(viewport.getViewInfo().camera, newCamera, "Not changed");
			done();
		}, 1000);
	});

	QUnit.test("Viewport Gesture Handler", function(assert) {
		var done = assert.async();
		var done2 = assert.async();
		viewport.setFreezeCamera(false);
		var nodeClicked;
		viewport.attachNodeClicked(function(event) {
			nodeClicked = event.getParameter("nodeRef");
			assert.equal(nodeClicked.name, "Torus1", "Viewport Gesture click tab");
			done2();
		});
		viewport.tap(10, 70, false);

		assert.equal(viewport.getCamera().getCameraRef().position.toArray().toString(), "0,0,100", "Viewport camera original postion");

		var newCameraPos;
		viewport.attachCameraChanged(function(event) {
			newCameraPos = event.getParameter("position").map(function(p) { return Number.parseFloat(p).toPrecision(4); }).toString();
		});
		viewport.tap(10, 70, true);

		setTimeout(function() {
			assert.equal(newCameraPos, "-25.00,10.00,28.13", "Viewport Gesture double click zoomObject");

			viewport.pan(1, 1);
			var id = viewport.getIdForLabel();
			var domobj = document.getElementById(id);
			var o = viewport._viewportGestureHandler._getOffset(domobj);
			var rect = {
				x: o.x,
				y: o.y,
				w: domobj.offsetWidth,
				h: domobj.offsetHeight
			};
			var event = {
				points: [
					{ x: rect.x + rect.w, y: rect.y + rect.h },
					{ x: rect.x + rect.w, y: rect.y + rect.h }
				],
				buttons: 2,
				timeStamp: 249703,
				n: 2,
				d: 0,
				x: rect.x + rect.w,
				y: rect.y + rect.h
			};
			viewport._viewportGestureHandler.beginGesture(event);
			viewport._viewportGestureHandler.move(event);
			viewport.rotate(20, 20);
			viewport.zoomTo(sap.ui.vk.ZoomTo.All, null, 0.5, 0);
			viewport._viewportGestureHandler.endGesture(event);
			setTimeout(function() {
				assert.equal(newCameraPos, "-25.07,25.37,120.2", "Viewport Gesture pan move rotate zoomToAll");

				done();
			}, 1000);
		}, 1000);
	});

	QUnit.test("Viewport Gesture Handler - look at object", function(assert) {
		var done = assert.async();
		assert.equal(viewport.getCamera().getCameraRef().quaternion.toArray().toString(), "0,0,0,1", "Viewport camera original rotation");
		var newCameraQuat;
		viewport.attachCameraChanged(function(event) {
			newCameraQuat = event.getParameter("quaternion").map(function(p) { return Number.parseFloat(p).toPrecision(4); }).toString();
		});

		viewport._viewportGestureHandler._cameraController.lookAtObject(viewport.getScene().getSceneRef().getObjectByName("Torus1"), 100);

		setTimeout(function() {
			assert.equal(newCameraQuat, "0.04797,0.1220,-0.005906,0.9913", "double click - new camera rotate changed to look at object");
			done();
		}, 1000);
	});

	QUnit.test("getObjectImage", function(assert) {
		var obj = new THREE.Mesh(
			new THREE.BoxBufferGeometry(10, 15, 10),
			new THREE.MeshLambertMaterial({ color: 0x0000FF })
		);

		var maxColorDifference = 4;
		function testPixel(ctx, x, y, color) {
			var pixelData = ctx.getImageData(x, y, 1, 1).data;
			assert.ok(Math.abs(pixelData[ 0 ] - color[ 0 ]) < maxColorDifference &&
				Math.abs(pixelData[ 1 ] - color[ 1 ]) < maxColorDifference &&
				Math.abs(pixelData[ 2 ] - color[ 2 ]) < maxColorDifference, "pixel[" + x + "," + y + "] result=[" +
				pixelData[ 0 ] + "," + pixelData[ 1 ] + "," + pixelData[ 2 ] + "] expected=[" +
				color[ 0 ] + "," + color[ 1 ] + "," + color[ 2 ] + "]");
		}
		function testRect(ctx, x1, y1, x2, y2, color) {
			for (var y = y1; y < y2; y += 10) {
				for (var x = x1; x < x2; x += 10) {
					testPixel(ctx, x, y, color);
				}
			}
		}

		// function saveBase64AsFile(base64, fileName) {
		// 	var link = document.createElement("a");
		// 	document.body.appendChild(link); // for Firefox
		// 	link.setAttribute("href", base64);
		// 	link.setAttribute("download", fileName);
		// 	link.click();
		// }

		var done = assert.async();
		var image = new Image();
		image.onload = function() {
			assert.strictEqual(this.width, 256, "Default image width");
			assert.strictEqual(this.height, 256, "Default image height");
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, this.width, this.height);
			testRect(ctx, 0, 0, 40, 1, [ 0, 255, 0 ]); // background top
			testRect(ctx, 0, 128, 40, 129, [ 0, 127, 0 ]); // background middle
			testRect(ctx, 0, 255, 40, 256, [ 0, 0, 0 ]); // background bottom
			testRect(ctx, 44, 2, 211, 254, [ 0, 0, 197 ]); // box
			testRect(ctx, 215, 0, 256, 1, [ 0, 255, 0 ]); // background top
			testRect(ctx, 215, 128, 256, 128, [ 0, 127, 0 ]); // background middle
			testRect(ctx, 215, 255, 256, 255, [ 0, 0, 0 ]); // background bottom
			done();
		};
		image.src = viewport.getObjectImage(obj, undefined, undefined, "#00FF00", "#000000", new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0)); // front view
		// window.open("").document.write(image.outerHTML);
		// saveBase64AsFile(image.src, "image");

		var done2 = assert.async();
		var image2 = new Image();
		image2.onload = function() {
			assert.strictEqual(this.width, 300, "Image width");
			assert.strictEqual(this.height, 200, "Image height");
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, this.width, this.height);
			testRect(ctx, 0, 0, 49, 200, [ 255, 0, 0 ]); // background
			testRect(ctx, 52, 2, 247, 199, [ 0, 0, 255 ]); // box
			testRect(ctx, 251, 0, 300, 200, [ 255, 0, 0 ]); // background
			done2();
		};
		image2.src = viewport.getObjectImage(obj, 300, 200, "#FF0000", "#FF0000", new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)); // top view
		// saveBase64AsFile(image2.src, "image2");
		ThreeUtils.disposeObject(obj);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
