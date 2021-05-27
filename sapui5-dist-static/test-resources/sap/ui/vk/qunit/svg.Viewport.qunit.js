/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/NodeContentType",
	"sap/ui/vk/VisibilityMode",
	"sap/ui/vk/ZoomTo",
], function(
	ViewStateManager,
	Viewport,
	Scene,
	Element,
	Rectangle,
	NodeContentType,
	VisibilityMode,
	ZoomTo
) {
	"use strict";

	var rectIndex = 0;
	function createElementsRecursive(parent, array, level) {
		array.forEach(function(element) {
			if (Array.isArray(element)) {
				var g = new Element();
				g.sid = g.name = "G" + level + parent.children.length;
				parent.add(g);
				createElementsRecursive(g, element, level + 1);
			} else {
				var r = new Rectangle();
				r.sid = r.name = element;
				r.strokeWidth = rectIndex + 1;
				r.x = (rectIndex % 3) * 100 + r.strokeWidth * 0.5;
				r.y = Math.floor(rectIndex / 3) * 100 + r.strokeWidth * 0.5;
				r.width = 100 - r.strokeWidth;
				r.height = 100 - r.strokeWidth;
				r.fill = [ 0.5, 0.5, 0.5, 0.5 ];
				rectIndex++;
				parent.add(r);
			}
		});
	}

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");

	var scene = new Scene();
	createElementsRecursive(scene.getRootElement(), [ [ "A", "B", "C" ], [ "D", [ "E", "F", "G" ], "H" ] ], 0, 0);

	viewport.setScene(scene);
	viewStateManager._setScene(scene);

	// set node fake veid
	var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
	var allNodeRefs = nodeHierarchy.findNodesByName();
	allNodeRefs.forEach(function(node) {
		node.userData.treeNode = { sid: node.uid };
	});

	var maxDifference = 1e-3;
	function assertClose(assert, actual, expected, message) {
		var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
		assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
	}

	QUnit.test("SVG Viewport", function(assert) {
		assert.ok(viewport, "The viewport is created.");
		assert.ok(viewport instanceof Viewport, "The viewport is sap.ui.vk.svg.Viewport implementation.");

		// No query provided (shall return camera info only)
		var viewInfo = viewport.getViewInfo();
		assert.ok(!!viewInfo.camera, "No query - Camera retrieved");
		assert.strictEqual(viewInfo.visibility, undefined, "No query - No visibility information");
		assert.strictEqual(viewInfo.selection, undefined, "No query - No selection information");

		// Query with no camera required
		viewInfo = viewport.getViewInfo({ camera: false });
		assert.strictEqual(viewInfo.camera, undefined, "Camera info shall not be retreived");

		// Simple visibility query without camera specified (shall still return camera info)
		viewInfo = viewport.getViewInfo({ visibility: true, selection: false });
		assert.ok(!!viewInfo.camera, "No camera query - Camera still retreived");
		assert.ok(!!viewInfo.visibility, "Visibility required - Visibility information retreived");
		assert.strictEqual(viewInfo.visibility.visible.length, 11, "Visibility required - Correct number of visible nodes");
		assert.strictEqual(viewInfo.visibility.hidden.length, 0, "Visibility required - Correct number of hidden nodes");
		assert.strictEqual(viewInfo.selection, undefined, "Selection not required -  No selection information");

		// Visibility query requiring differences but diff tracking is not set
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.ok(!!viewInfo.visibility, "Visibility diff required - Visibility object retreived");
		assert.strictEqual(viewInfo.visibility.changes, undefined, "Visibility diff required - Tracking not set");

		// Visibility query requiring differences with diff tracking set
		var viewStateManager = viewport._viewStateManager;
		viewStateManager.setShouldTrackVisibilityChanges(true);
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.ok(!!viewInfo.visibility, "Visibility diff required - Visibility object retreived");
		assert.ok(!!viewInfo.visibility.changes, "Visibility diff required - Tracking set");

		// Simple selection query
		viewInfo = viewport.getViewInfo({ selection: true });
		assert.ok(!!viewInfo.selection, "Selection required - Selection information retreived");
		assert.strictEqual(viewInfo.selection.selected.length, 0, "Selection required - No selected nodes");

		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy(),
			allNodeRefs = nodeHierarchy.findNodesByName(),
			nodeRefToVEID = new Map(),
			veidToNodeRef = new Map(),
			nodeRefs = [],
			nodes = [];
		allNodeRefs.forEach(function(node) {
			nodeRefs.push(node);
			nodes.push(node.sid);
			nodeRefToVEID.set(node, node.sid);
			veidToNodeRef.set(node.sid, node);
		});

		var cameraTests = [
			{ camera: { viewBox: [ 0, 0, 250, 250 ] } },
			{ camera: { viewBox: [ 50, 0, 200, 200 ] } },
			{ camera: { viewBox: [ 0, 50, 150, 150 ] } },
			{ camera: { viewBox: [ 100, 100, 100, 100 ] } }
		];

		cameraTests.forEach(function(test, i) {
			viewport.setViewInfo(test, 0);
			var viewBox = viewport._getViewBox();
			assertClose(assert, viewBox[ 0 ], test.camera.viewBox[ 0 ], "setViewInfo " + i + " viewBox.x");
			assertClose(assert, viewBox[ 1 ], test.camera.viewBox[ 1 ], "setViewInfo " + i + " viewBox.y");
			assertClose(assert, viewBox[ 2 ], test.camera.viewBox[ 2 ], "setViewInfo " + i + " viewBox.width");
			assertClose(assert, viewBox[ 3 ], test.camera.viewBox[ 3 ], "setViewInfo " + i + " viewBox.height");
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
				assert.strictEqual(viewStateManager.getVisibilityState(nodeRef), true, veid + " visible");
				assert.notStrictEqual(visibility.visible.indexOf(veid), -1, veid + " visible");
				assert.strictEqual(visibility.hidden.indexOf(veid), -1, veid + " not hidden");
			});
			test.visibility.hidden.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.strictEqual(viewStateManager.getVisibilityState(nodeRef), false, veid + " hidden");
				assert.strictEqual(visibility.visible.indexOf(veid), -1, veid + " not visible");
				assert.notStrictEqual(visibility.hidden.indexOf(veid), -1, veid + " hidden");
			});
		});

		function testSelectionViewInfo(count1, count2) {
			var viewInfo = viewport.getViewInfo({ selection: true });

			assert.equal(viewInfo.selection.selected.length, count1, count1 + " selected nodes");

			viewStateManager.enumerateSelection(function(nodeRef) {
				var veId = nodeRefToVEID.get(nodeRef);
				assert.ok(viewInfo.selection.selected.indexOf(veId) >= 0, veId + " selected");
			});

			return viewInfo;
		}

		testSelectionViewInfo(0, 0);

		viewStateManager.setSelectionStates([ nodeRefs[ 1 ], nodeRefs[ 2 ], nodeRefs[ 3 ] ], [], false, false);
		var vi = testSelectionViewInfo(3, 2);

		viewStateManager.setSelectionStates([ nodeRefs[ 3 ], nodeRefs[ 5 ] ], [ nodeRefs[ 1 ], nodeRefs[ 2 ] ], false, false);
		testSelectionViewInfo(2, 3);

		viewport.setViewInfo(vi);
		testSelectionViewInfo(3, 2);

		// check default value
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// get initial camera position
		var initialCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen");

		// try to rotate
		viewport.rotate(20, 20);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not rotated");

		// try to pan
		viewport.pan(5, 10);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not panned");

		// try to zoom
		viewport.zoom(1.4);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not zoomed");

		// unfreeze camera
		viewport.setFreezeCamera(false);
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// zoom out scene
		viewport.beginGesture(1, 1);
		viewport.zoom(0.04);
		viewport.endGesture();

		// get new camera position
		var newCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen again");

		// try to double click
		var done = assert.async();
		var done2 = assert.async();
		viewport.tap(1, 1, true);
		setTimeout(function() {
			assert.deepEqual(viewport.getViewInfo().camera, newCamera, "Not changed");

			viewport.zoomTo(ZoomTo.All, null, 0, 0);
			viewport.setFreezeCamera(false);

			var nodeClicked;
			viewport.attachNodeClicked(function(event) {
				nodeClicked = event.getParameter("nodeRef");
				assert.equal(nodeClicked.name, "B", "Viewport Gesture click tab");
				done2();
			});
			viewport.tap(150, 50, false);

			// assert.equal(viewport.getCamera().getCameraRef().position.toArray().toString(), "0,0,100", "Viewport camera original postion");

			var newViewBox;
			viewport.attachCameraChanged(function(event) {
				newViewBox = event.getParameter("viewBox");
			});
			viewport.tap(50, 150, true);

			setTimeout(function() {
				assertClose(assert, newViewBox[ 0 ], -5, "zoomTo viewBox.x");
				assertClose(assert, newViewBox[ 1 ], 95, "zoomTo viewBox.y");
				assertClose(assert, newViewBox[ 2 ], 110, "zoomTo viewBox.width");
				assertClose(assert, newViewBox[ 3 ], 110, "zoomTo viewBox.height");

				viewport.zoomTo(ZoomTo.All, null, 0, 0);

				var dx = 100;
				var dy = 50;
				var zoom = 0.95;

				viewport.pan(dx, dy);
				var id = viewport.getIdForLabel();
				var domobj = document.getElementById(id);
				var o = viewport._viewportHandler._getOffset(domobj);
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
				viewport._viewportHandler.beginGesture(event);
				viewport._viewportHandler.move(event);
				viewport.zoom(1 / zoom);
				viewport._viewportHandler.endGesture(event);
				setTimeout(function() {
					assertClose(assert, newViewBox[ 0 ], -dx + viewport._width * (1 - zoom), "Viewport gestures viewBox.x");
					assertClose(assert, newViewBox[ 1 ], -dy + viewport._height * (1 - zoom), "Viewport gestures viewBox.y");
					assertClose(assert, newViewBox[ 2 ], viewport._width * zoom, "Viewport gestures viewBox.width");
					assertClose(assert, newViewBox[ 3 ], viewport._height * zoom, "Viewport gestures viewBox.height");

					viewport.zoomTo(ZoomTo.All, null, 0, 0);
					nodeRefs.forEach(function(node) {
						if (node.children.length === 0) {
							node._vkSetNodeContentType(NodeContentType.Hotspot);
						}
					});

					var hotspotName;
					viewport.attachHotspotEnter(function(event) {
						hotspotName = event.getParameter("nodeRef").name;
					});
					viewport.attachHotspotLeave(function(event) {
						hotspotName = "!" + event.getParameter("nodeRef").name;
					});
					viewport.hover(50, 50);
					assert.strictEqual(hotspotName, "A", "Hotspot enter A");
					viewport.hover(100, -5);
					assert.strictEqual(hotspotName, "!A", "Hotspot leave A");
					viewport.hover(150, 50);
					assert.strictEqual(hotspotName, "B", "Hotspot enter B");
					viewport.hover(200, -5);
					assert.strictEqual(hotspotName, "!B", "Hotspot leave B");
					viewport.hover(250, 50);
					assert.strictEqual(hotspotName, "C", "Hotspot enter C");
					viewport.hover(305, 50);
					assert.strictEqual(hotspotName, "!C", "Hotspot leave C");

					viewport.exit();
					assert.equal(viewport.getScene(), null, "Viewport exit");

					done();
				}, 1000);
			}, 1000);
		}, 1000);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
