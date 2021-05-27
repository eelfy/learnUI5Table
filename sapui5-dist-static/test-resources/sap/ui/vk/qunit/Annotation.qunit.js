/* global QUnit */

sap.ui.define([
	"sap/ui/vk/Annotation",
	"sap/ui/vk/AnnotationStyle",
	"sap/ui/vk/View",
	"sap/ui/vk/NodeUtils",
	"sap/ui/vk/NodeContentType",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/SceneBuilder",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/base/util/uid"
], function(
	Annotation,
	AnnotationStyle,
	View,
	NodeUtils,
	NodeContentType,
	Viewport,
	ViewStateManager,
	SceneBuilder,
	ModuleWithContentConnector,
	uid
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("Viewport", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);

		var scene = viewport.getScene();
		var root = scene.getDefaultNodeHierarchy().getChildren()[0];
		var sb = new SceneBuilder(root);
		scene.setSceneBuilder(sb);

		// Workaround for SceneBuilder with custom loader. Should me done in SceneBuilder itself, not here
		scene.annotations = sb._annotations;
	});

	QUnit.test("Annotation Creation", function(assert){
		var title = "this is a title";
		var annotation = new Annotation({ text: title, style: AnnotationStyle.Default });
		assert.equal(annotation.getText(), title, "title added");
		assert.equal(annotation.getStyle(), AnnotationStyle.Default, "style added");
		annotation.destroy();
	});

	function createAnnotation(annotationInfo) {
		annotationInfo = annotationInfo || {};

		annotationInfo.type = "html";
		annotationInfo.name = annotationInfo.name || "2D Text test node";
		if (annotationInfo.text == null || annotationInfo.text.html == null){
			annotationInfo.text = { html: annotationInfo.name + "-annotation" };
		}

		var nh = viewport.getScene().getDefaultNodeHierarchy();
		var node = nh.createNode(null, null, null, NodeContentType.Annotation, annotationInfo);

		return node;
	}

	QUnit.test("Annotation creation via NodeHierarchy", function(assert) {
		var annotations = viewport.getAnnotations();
		assert.equal(annotations.length, 0, "No annotations in new scene");

		var nodeName = "2D Text test node";
		var annotationText = nodeName + "-annotation";
		var node = createAnnotation({ name: nodeName, text: { html: annotationText } });

		assert.ok(node, "Node created");
		assert.equal(node.name, nodeName, "Node name is correct");

		annotations = viewport.getAnnotations();
		assert.equal(annotations.length, 1, "One annotation added");
		assert.equal(annotations[0].getNodeRef(), node, "Annotation node assigned");
		assert.equal(annotations[0].getName(), nodeName, "Annotation name is correct");
		assert.equal(annotations[0].getText(), annotationText, "Annotation text is correct");
		assert.equal(annotations[0].getText(), annotationText, "Annotation text is set");
	});

	QUnit.test("Annotation synchronization with node", function(assert){
		var node = createAnnotation();

		var annotation = viewport.getAnnotations()[0];

		assert.equal(node.name, annotation.getName(), "Name is equal");

		// Check initial state
		assert.notOk(annotation.getSelected(), "Initial annotation selection is ok");
		assert.ok(annotation.getDisplay(), "Initial annotation visibiity is ok");
		assert.notOk(viewStateManager.getSelectionState(node), "Initial node selection is ok");
		assert.ok(viewStateManager.getVisibilityState(node), "Initial node visibility is ok");

		// Check visibility synchronization
		annotation.setDisplay(false);
		assert.notOk(annotation.getDisplay(), "Annotation hidden");
		assert.notOk(viewStateManager.getVisibilityState(node), "Node hidden - sync with annotation");

		annotation.setDisplay(true);
		assert.ok(annotation.getDisplay(), "Annotation visible");
		assert.ok(viewStateManager.getVisibilityState(node), "Node visibile - sync with annotation");

		viewStateManager.setVisibilityState(node, false);
		assert.notOk(annotation.getDisplay(), "Annotation hidden - sync with node");

		viewStateManager.setVisibilityState(node, true);
		assert.ok(annotation.getDisplay(), "Annotation visible - sync with node");

		// Check selection synchronization
		annotation.setSelected(true);
		assert.ok(viewStateManager.getSelectionState(node), "Node selected - sync with annotation");

		annotation.setSelected(false);
		assert.notOk(viewStateManager.getSelectionState(node), "Node not selected - sync with annotation");

		viewStateManager.setSelectionState(node, true);
		assert.ok(annotation.getSelected(), "Annotation selected - sync with node");

		viewStateManager.setSelectionState(node, false);
		assert.notOk(annotation.getSelected(), "Annotation not selected - sync with node");

		// Name synchronization
		var newName = "New name";
		annotation.setName(newName);
		assert.equal(annotation.getName(), newName, "Annotation name changed");
		assert.equal(node.name, newName, "Node name changed");

		node.name = "New node name";
		assert.equal(annotation.getName(), node.name, "Annotation name changed - sync with node");
	});

	QUnit.test("Remove annotation", function(assert) {
		var node = createAnnotation();

		var annotations = viewport.getAnnotations();
		assert.equal(annotations.length, 1, "Annotation created");

		viewStateManager.setSelectionState(node, true);
		assert.equal(viewStateManager.getSelectionState(node), true, "Node selected");

		viewport.getScene().getDefaultNodeHierarchy().removeNode(node);

		annotations = viewport.getAnnotations();
		assert.equal(annotations.length, 0, "Annotation deleted");

		// Make sure it's also removed from view state manager
		assert.equal(viewStateManager.getSelectionState(node), false, "Node is not in list of selected nodes");
	});

	QUnit.test("Test target nodes", function(assert) {
		createAnnotation();

		var annotations = viewport.getAnnotations();
		assert.equal(annotations[0].getTargetNodes().length, 0, "No target nodes");

		// Create a node to attach annotation to
		var node = viewport.getScene().getDefaultNodeHierarchy().createNode(null, "New node", null, NodeContentType.Regular);

		var nodeId = viewport.getScene().nodeRefToPersistentId(node);
		createAnnotation({ leaderLines: [ { start: { sid: nodeId } } ] });
		annotations = viewport.getAnnotations();
		assert.equal(annotations.length, 2, "Second annotation created");
		assert.equal(annotations[1].getTargetNodes().length, 1, "One target node");
		assert.equal(annotations[1].getTargetNodes()[0], node, "Correct target node");
	});

	QUnit.test("Update identifiers", function(assert) {
		createAnnotation();

		var annotation = viewport.getAnnotations()[0];

		var scene = viewport.getScene();
		var nodeId = scene.nodeRefToPersistentId(annotation.getNodeRef());
		assert.ok(nodeId, "Default node id set");
		assert.ok(annotation.getAnnotationId(), "Default annotation id set");

		var newNodeId = "123";
		var newAnnotationId = "456";
		annotation.updateNodeId(newNodeId);
		annotation.setAnnotationId(newAnnotationId);
		nodeId = scene.nodeRefToPersistentId(annotation.getNodeRef());
		assert.equal(nodeId, newNodeId, "Node id updated");
		assert.equal(annotation.getAnnotationId(), newAnnotationId, "Annotation id updated");

		viewport._clearAnnotations(); // This will force HTML annotations to be re-created

		var annotations = viewport.getAnnotations();
		assert.equal(annotations.length, 1, "Still only one annotation");

		annotation = annotations[0];
		nodeId = scene.nodeRefToPersistentId(annotation.getNodeRef());
		assert.equal(nodeId, newNodeId, "Node id updated");
		assert.equal(annotation.getAnnotationId(), newAnnotationId, "Annotation id updated");
	});

	QUnit.test("Preserve properties", function(assert) {
		// Check if annotation specific properties are preserved between two creation
		createAnnotation();
		var annotation = viewport.getAnnotations()[0];

		assert.equal(annotation.getEditable(), false, "Initial editable state");
		assert.equal(annotation.getAnimate(), true, "Initial animate state");
		assert.equal(annotation.getStyle(), AnnotationStyle.Default, "Initial style");

		annotation.setEditable(true);
		annotation.setAnimate(false);
		var newText = "My new text";
		annotation.setText(newText);
		annotation.setStyle(AnnotationStyle.Random);

		assert.equal(annotation.getEditable(), true, "Updated editable state");
		assert.equal(annotation.getAnimate(), false, "Updated animate state");
		assert.equal(annotation.getText(), newText, "Updated text");
		assert.equal(annotation.getStyle(), AnnotationStyle.Random, "Updated style");

		viewport._clearAnnotations();

		annotation = viewport.getAnnotations()[0];
		assert.equal(annotation.getEditable(), true, "Reloaded editable state");
		assert.equal(annotation.getAnimate(), false, "Reloaded animate state");
		assert.equal(annotation.getText(), newText, "Reloaded text");
		assert.equal(annotation.getStyle(), AnnotationStyle.Random, "Reloaded style");
	});

	QUnit.test("getNodeRefCenter Function", function(assert){
		var nodeRef = new THREE.Object3D();
		nodeRef.matrixWorld = new THREE.Matrix4();
		nodeRef.matrixWorld.set(0, 0, 1, 0,
								1, 0, 0, 0,
								0, 1, 0, 7.887115478515625,
								0, 0, 0, 1);
		nodeRef.userData = {};
		nodeRef.userData.boundingBox = {
			min: {
				x: -107.00257873535156,
				y: -11.392314910888672,
				z: -23.500080108642578
			},
			max: {
				x: 107.00257873535156,
				y: 102.88311004638672,
				z: 23.500080108642578
			}
		};
		var annotation = new Annotation({ nodeRef: nodeRef });
		var center = NodeUtils.centerOfNodes([ nodeRef ]);
		assert.equal(center[0], 0, "center x");
		assert.equal(center[1], 0, "center y");
		assert.equal(center[2], 53.63251304626465, "center z");
		annotation.destroy();
	});

	QUnit.test("getNodeRefScreenCenter Function", function(assert){
		var nodeRef = new THREE.Object3D();
		nodeRef.matrixWorld = new THREE.Matrix4();
		nodeRef.matrixWorld.set(0, 0, 1, 0,
								1, 0, 0, 0,
								0, 1, 0, 7.887115478515625,
								0, 0, 0, 1);
		nodeRef.userData = {};
		nodeRef.userData.boundingBox = {
			min: {
				x: -107.00257873535156,
				y: -11.392314910888672,
				z: -23.500080108642578
			},
			max: {
				x: 107.00257873535156,
				y: 102.88311004638672,
				z: 23.500080108642578
			}
		};
		var annotation = new Annotation({});
		annotation.getTargetNodes().push(nodeRef);
		var center = annotation._getNodeRefScreenCenter(viewport, nodeRef);
		assert.equal(center.x, 150, "center x");
		assert.equal(center.y, 150, "center y");
		assert.equal(center.depth, 0.45478040232648, "center z");
		annotation.destroy();
	});

	QUnit.test("Test multi annotations and nodes update", function(assert) {
		var done = assert.async();
		var nodes = [];
		viewport._getNativeScene().traverse(function(child) {
			if (child.isMesh) {
				child.userData.nodeId = THREE.Math.generateUUID().toLowerCase();
				nodes.push(child);
			}
		}.bind(this));
		var styles = [ AnnotationStyle.Default, AnnotationStyle.Explode, AnnotationStyle.Square, AnnotationStyle.Random ];
		viewport._currentView = new View();
		viewport._currentView._nodeInfos = [];
		var scene = viewport._scene;
		scene.annotations = new Map();
		var vsm = viewport._viewStateManager;
		var nodeHierarchy = scene.getDefaultNodeHierarchy();
		nodes.forEach(function(node) {
			var content = {
				id: uid(),
				type: "html",
				style: styles[Math.floor(Math.random() * Math.floor(4))],
				text: { html: node.name ? node.name : node.parent.name },
				leaderLines: [ { start: { sid: scene.nodeRefToPersistentId(node) } } ]
			};
			var nodeRef = nodeHierarchy.createNode(null, node.name, null, sap.ui.vk.NodeContentType.Annotation, content);
			scene.annotations.set(content.id, {
				annotation: content,
				node: nodeRef,
				targetNodes: [ node ]
			});
		});
		viewport.setShouldRenderFrame();
		setTimeout(function() {
			var ants = viewport.getAnnotations();
			var allSelected = true;
			ants.forEach(function(ant) {
				ant.setSelected(true);
				if (!ant.getSelected()) {
					allSelected = false;
				}
			});
			assert.equal(allSelected, true, "Select all annotations and its nodes");
			ants.forEach(function(ant) {
				ant.setSelected(false);
			});

			ants[0].setSelected(true);
			ants[0].setEditable(false);
			ants[0].setEditable(true);
			assert.equal(ants[0].getEditable(), true, "Set annotation[0] in edit mode");

			ants[0].openEditor();
			assert.notEqual(ants[0].getTextEditor(), null, "Open text editor on annotation[0]");

			ants[0].closeEditor();
			assert.equal(ants[0].getTextEditor(), null, "Close text editor on annotation[0]");

			ants[0].setHeight(0.1);
			assert.equal(ants[0].getHeight(), 0.1, "Set annotation[0] height 0.1");

			ants[0].setWidth(0.1);
			assert.equal(ants[0].getWidth(), 0.1, "Set annotation[0] width 0.1");

			ants[0].setXCoordinate(0.5);
			assert.equal(ants[0].getXCoordinate(), 0.5, "Set annotation[0] XCoordinate 0");

			ants[0].setYCoordinate(0.5);
			assert.equal(ants[0].getYCoordinate(), 0.5, "Set annotation[0] YCoordinate 0");

			ants[1].setSelected(true);
			ants[2].setSelected(true);
			assert.equal(ants[2].zIndex - ants[1].zIndex, 1, "Set selected annotation with max z-index");

			assert.notEqual(ants[1].getDomRef().className, "sapUiVizKitAnnotationHidden", "Display annotation when target node is not obscured");
			var newCameraPos;
			viewport.attachCameraChanged(function(event) {
				newCameraPos = event.getParameter("position").map(function(p) { return Number.parseFloat(p).toPrecision(4); }).toString();
			});
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
				timeStamp: 1587686558,
				n: 2,
				d: 0,
				x: rect.x + rect.w,
				y: rect.y + rect.h
			};
			viewport._viewportGestureHandler.beginGesture(event);
			viewport.rotate(0, 200);
			viewport._viewportGestureHandler.endGesture(event);
			setTimeout(function() {
				ants[1]._updateBlocked();
				assert.equal(ants[1].getDomRef().style.visibility, "hidden", "Hide annotation when target node is obscured");
				done();
			}, 1000);
		}, 3000);
	});

	QUnit.test("Fit to text", function(assert){
		var done = assert.async();
		createAnnotation();
		var annotation = viewport.getAnnotations()[0];
		var f = annotation.onAfterRendering;
		annotation.onAfterRendering = function() {
			// Call original function
			f.call(this);
			annotation.onAfterRendering = f;

			annotation.fitToText();
			var width1 = this.getWidth();
			var height1 = this.getHeight();
			assert.ok(width1 > 0.7, "Fit width of annotation to text");
			assert.ok(height1 > 0.1, "Fit height of annotation to text");

			annotation.fitToText(200, 30);
			var width2 = this.getWidth();
			var height2 = this.getHeight();
			assert.ok(width2 < width1, "Fit (with limit) width of annotation to text");
			assert.ok(height2 < height1, "Fit (with limit) height of annotation to text");

			annotation.setText("0");
			annotation.fitToText();
			var width3 = this.getWidth();
			var height3 = this.getHeight();
			assert.ok(width3 < width2, "Fit width of annotation to changed text");
			assert.equal(height1, height3, "Fit height of annotation to changed text");
			done();
		};
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});