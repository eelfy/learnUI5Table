/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/svg/SceneBuilder",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Line",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/svg/Polyline",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path",
	"sap/ui/vk/svg/Text"
], function(
	jQuery,
	SceneBuilder,
	Scene,
	Element,
	Line,
	Rectangle,
	Polyline,
	Ellipse,
	Path,
	Text
) {
	"use strict";

	QUnit.test("SceneBuilder", function(assert) {
		var done = assert.async();

		var nativeScene = new Scene();
		var sceneRoot = nativeScene.getRootElement();

		var root = new Element();
		sceneRoot.add(root);

		var sceneBuilder = new SceneBuilder();

		var sceneId = "scene123";
		sceneBuilder.setRootNode(root, "id-root", sceneId, nativeScene);

		// node creation test

		var node1 = sceneBuilder.createNode({
			parentId: "id-root",
			sid: "id-1",
			name: "node1"
		}, sceneId);

		assert.ok(node1, "node1 created");
		assert.ok(node1.parent === root, "node1 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-1") === node1, "node1 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node1") === node1, "node1 name");

		var node2 = sceneBuilder.createNode({
			parentId: "id-1",
			sid: "id-2",
			name: "node2"
		}, sceneId);

		assert.ok(node2, "node2 created");
		assert.ok(node2.parent === node1, "node2 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-2") === node2, "node2 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node2") === node2, "node2 name");
		assert.strictEqual(node2.children.length, 0, "node2 children");

		// material creation test

		var material1Info = {
			id: "id-material1",
			lineColour: [ 1, 0.5, 0.25, 0.75 ],
			emissiveColour: [ 0.25, 0.5, 1, 0.25 ],
			opacity: 0.987,
			lineWidth: 1.123,
			lineHaloWidth: 0.567,
			lineEndRound: 1,
			lineDashPattern: [ 1, 2, 3, 4 ],
			lineWidthCoordinateSpace: 4
		};

		var material2Info = {
			id: "id-material2",
			lineColour: [ 0.75, 0.5, 0.25, 0.5 ],
			emissiveColour: [ 0.125, 0.25, 0.5, 0.75 ],
			opacity: 0.789,
			lineWidth: 2.345,
			lineHaloWidth: 0.678,
			lineEndRound: 0,
			lineDashPattern: [ 5, 6 ],
			lineWidthCoordinateSpace: 0
		};

		sceneBuilder.createMaterial(material1Info);
		var material1 = sceneBuilder._getMaterial(material1Info.id);

		assert.ok(material1, "material1 created");
		assert.deepEqual(material1.lineColor, material1Info.lineColour, "material1 lineColor");
		assert.strictEqual(material1.lineWidth, material1Info.lineWidth, "material1 lineWidth");
		assert.deepEqual(material1.color, material1Info.emissiveColour, "material1 color");
		assert.strictEqual(material1.opacity, material1Info.opacity, "material1 opacity");
		assert.ok(material1.lineStyle, "material1 lineStyle");
		assert.strictEqual(material1.lineStyle.haloWidth, material1Info.lineHaloWidth, "material1 lineHaloWidth");
		assert.strictEqual(material1.lineStyle.endCapStyle, 1, "material1 lineEndRound");
		assert.deepEqual(material1.lineStyle.dashPattern, material1Info.lineDashPattern, "material1 lineDashPattern");
		assert.strictEqual(material1.lineStyle.widthCoordinateSpace, material1Info.lineWidthCoordinateSpace, "material1 lineWidthCoordinateSpace");

		// parametric line test

		var lineInfo = {
			type: "line",
			materialID: material1Info.id,
			x1: 11,
			y1: 22,
			x2: 33,
			y2: 44
		};
		sceneBuilder.setParametricContent("id-2", lineInfo, sceneId);
		assert.strictEqual(node2.children.length, 1, "paremetric line added");
		var line = node2.children[ node2.children.length - 1 ];

		assert.ok(line instanceof Line, "line class");
		assert.deepEqual(Array.from(line.stroke), material1.lineColor, "line color");
		assert.strictEqual(line.strokeWidth, material1.lineWidth, "line width");
		assert.deepEqual(line.strokeDashArray, material1.lineStyle.dashPattern, "line dashPattern");
		assert.strictEqual(line.widthCoordinateSpace, material1.lineStyle.widthCoordinateSpace, "line widthCoordinateSpace");
		assert.strictEqual(line.x1, lineInfo.x1, "line x1");
		assert.strictEqual(line.y1, lineInfo.y1, "line y1");
		assert.strictEqual(line.x2, lineInfo.x2, "line x2");
		assert.strictEqual(line.y2, lineInfo.y2, "line y2");

		// parametric polyline test

		var polylineInfo = {
			type: "polyline",
			materialID: null,
			points: [ 11, 22, 33, 44, 55, 66 ]
		};
		sceneBuilder.setParametricContent("id-2", polylineInfo, sceneId);
		assert.strictEqual(node2.children.length, 2, "paremetric polyline added");
		var polyline = node2.children[ node2.children.length - 1 ];

		assert.ok(polyline instanceof Polyline, "polyline class");
		assert.deepEqual(Array.from(polyline.stroke), [ 0, 0, 0, 1 ], "polyline color");
		assert.strictEqual(polyline.strokeWidth, 1, "polyline lineWidth");
		assert.deepEqual(polyline.strokeDashArray, [], "polyline dashPattern");
		assert.strictEqual(polyline.widthCoordinateSpace, undefined, "polyline widthCoordinateSpace");
		assert.deepEqual(Array.from(polyline.points), polylineInfo.points, "polyline points");

		// parametric ellipse test

		var ellipseInfo = {
			type: "ellipse",
			materialID: undefined,
			cx: 11,
			cy: 22,
			major: 33,
			minor: 44
		};
		sceneBuilder.setParametricContent("id-2", ellipseInfo, sceneId);
		assert.strictEqual(node2.children.length, 3, "paremetric ellipse added");
		var ellipse = node2.children[ node2.children.length - 1 ];

		assert.ok(ellipse instanceof Ellipse, "ellipse class");
		assert.deepEqual(Array.from(ellipse.stroke), [ 0, 0, 0, 1 ], "ellipse color");
		assert.strictEqual(ellipse.strokeWidth, 1, "ellipse lineWidth");
		assert.deepEqual(ellipse.strokeDashArray, [], "ellipse dashPattern");
		assert.strictEqual(ellipse.widthCoordinateSpace, undefined, "ellipse widthCoordinateSpace");
		assert.strictEqual(ellipse.cx, ellipseInfo.cx, "ellipse cx");
		assert.strictEqual(ellipse.cy, ellipseInfo.cy, "ellipse cy");
		assert.strictEqual(ellipse.rx, ellipseInfo.major, "ellipse rx");
		assert.strictEqual(ellipse.ry, ellipseInfo.minor, "ellipse ry");

		// parametric arc test

		var arcInfo = {
			type: "arc",
			materialID: material2Info.id,
			cx: 12,
			cy: 23,
			major: 34,
			minor: 45,
			start: 1.234,
			end: 2.345
		};
		sceneBuilder.setParametricContent("id-2", arcInfo, sceneId);
		assert.strictEqual(node2.children.length, 4, "paremetric arc added");
		var arc = node2.children[ node2.children.length - 1 ];

		assert.ok(arc instanceof Path, "arc class");
		assert.deepEqual(Array.from(arc.stroke), [ 0, 0, 0, 1 ], "arc default color");
		assert.strictEqual(arc.strokeWidth, 1, "arc default lineWidth");
		assert.deepEqual(arc.strokeDashArray, [], "arc default dashPattern");
		assert.strictEqual(arc.widthCoordinateSpace, undefined, "arc default widthCoordinateSpace");
		assert.ok(arc.segments && arc.segments.length === 1, "arc path segments");
		var arcSegment = arc.segments[ 0 ];
		assert.strictEqual(arcSegment.type, "arc", "arc segment type");
		assert.strictEqual(arcSegment.cx, arcInfo.cx, "arc cx");
		assert.strictEqual(arcSegment.cy, arcInfo.cy, "arc cy");
		assert.strictEqual(arcSegment.rx, arcInfo.major, "arc rx");
		assert.strictEqual(arcSegment.ry, arcInfo.minor, "arc ry");
		assert.strictEqual(arcSegment.start, arcInfo.start, "arc start");
		assert.strictEqual(arcSegment.end, arcInfo.end, "arc start");

		sceneBuilder.createMaterial(material2Info);
		var material2 = sceneBuilder._getMaterial(material2Info.id);

		assert.ok(material2, "material2 created");
		assert.deepEqual(material2.lineColor, material2Info.lineColour, "material2 lineColor");
		assert.strictEqual(material2.lineWidth, material2Info.lineWidth, "material2 lineWidth");
		assert.deepEqual(material2.color, material2Info.emissiveColour, "material2 color");
		assert.strictEqual(material2.opacity, material2Info.opacity, "material2 opacity");
		assert.ok(material2.lineStyle, "material2 lineStyle");
		assert.strictEqual(material2.lineStyle.haloWidth, material2Info.lineHaloWidth, "material2 lineHaloWidth");
		assert.strictEqual(material2.lineStyle.endCapStyle, 0, "material2 lineEndRound");
		assert.deepEqual(material2.lineStyle.dashPattern, material2Info.lineDashPattern, "material2 lineDashPattern");
		assert.strictEqual(material2.lineStyle.widthCoordinateSpace, material2Info.lineWidthCoordinateSpace, "material2 lineWidthCoordinateSpace");

		assert.deepEqual(Array.from(arc.stroke), material2.lineColor, "arc color");
		assert.strictEqual(arc.strokeWidth, material2.lineWidth, "arc lineWidth");
		assert.deepEqual(arc.strokeDashArray, material2.lineStyle.dashPattern, "arc dashPattern");
		assert.strictEqual(arc.widthCoordinateSpace, material2.lineStyle.widthCoordinateSpace, "arc widthCoordinateSpace");

		// parametric path test

		var pathInfo = {
			type: "path",
			materialID: material2Info.id,
			segments: [
				{
					type: "move",
					points: [ 11, 22 ]
				}, {
					type: "line",
					points: [ 33, 44 ]
				}, {
					type: "arc",
					major: 15,
					minor: 20,
					followLargeArc: "0",
					clockwise: "1",
					points: [ 55, 66 ]
				}, {
					type: "close"
				}, {
					type: "bezier",
					degree: 3,
					points: [ 10, 11, 12, 13, 14, 15, 16, 17 ]
				}, {
					type: "polyline",
					points: [ 20, 21, 22, 23, 24, 25, 26, 27, 28, 29 ]
				}
			]
		};
		sceneBuilder.setParametricContent("id-2", pathInfo, sceneId);
		assert.strictEqual(node2.children.length, 5, "paremetric path added");
		var path = node2.children[ node2.children.length - 1 ];

		assert.ok(path instanceof Path, "path class");
		assert.ok(path.segments && path.segments.length === 6, "path segments");
		assert.deepEqual(Array.from(path.stroke), material2.lineColor, "path color");
		assert.strictEqual(path.strokeWidth, material2.lineWidth, "path lineWidth");
		assert.deepEqual(path.strokeDashArray, material2.lineStyle.dashPattern, "path dashPattern");
		assert.strictEqual(path.widthCoordinateSpace, material2.lineStyle.widthCoordinateSpace, "path widthCoordinateSpace");

		var moveSegment = path.segments[ 0 ];
		assert.strictEqual(moveSegment.type, "move", "move path segment type");
		assert.deepEqual(moveSegment.points, pathInfo.segments[ 0 ].points, "move points");

		var lineSegment = path.segments[ 1 ];
		assert.strictEqual(lineSegment.type, "line", "line path segment type");
		assert.deepEqual(lineSegment.points, pathInfo.segments[ 1 ].points, "line points");

		arcSegment = path.segments[ 2 ];
		assert.strictEqual(arcSegment.type, "arc", "arc path segment type");
		assert.strictEqual(arcSegment.major, pathInfo.segments[ 2 ].major, "arc rx");
		assert.strictEqual(arcSegment.minor, pathInfo.segments[ 2 ].minor, "arc ry");
		assert.strictEqual(arcSegment.followLargeArc, pathInfo.segments[ 2 ].followLargeArc, "arc followLargeArc");
		assert.strictEqual(arcSegment.clockwise, pathInfo.segments[ 2 ].clockwise, "arc clockwise");
		assert.deepEqual(arcSegment.points, pathInfo.segments[ 2 ].points, "arc points");

		var closeSegment = path.segments[ 3 ];
		assert.strictEqual(closeSegment.type, "close", "close path segment type");

		var bezierSegment = path.segments[ 4 ];
		assert.strictEqual(bezierSegment.type, "bezier", "bezier path segment type");
		assert.strictEqual(bezierSegment.degree, pathInfo.segments[ 4 ].degree, "bezier degree");
		assert.deepEqual(bezierSegment.points, pathInfo.segments[ 4 ].points, "bezier points");

		var polylineSegment = path.segments[ 5 ];
		assert.strictEqual(polylineSegment.type, "polyline", "polyline path segment type");
		assert.deepEqual(polylineSegment.points, pathInfo.segments[ 5 ].points, "polyline points");

		// parametric rectangle test

		var rectInfo = {
			type: "rectangle",
			materialID: material1Info.id,
			x: 30,
			y: 40,
			width: 150,
			height: 160
		};
		sceneBuilder.setParametricContent("id-2", rectInfo, sceneId);
		assert.strictEqual(node2.children.length, 6, "paremetric rectangle added");
		var rectangle = node2.children[ node2.children.length - 1 ];

		assert.ok(rectangle instanceof Rectangle, "rectangle class");
		assert.deepEqual(Array.from(rectangle.stroke), material1.lineColor, "rectangle color");
		assert.strictEqual(rectangle.strokeWidth, material1.lineWidth, "rectangle lineWidth");
		assert.deepEqual(rectangle.strokeDashArray, material1.lineStyle.dashPattern, "rectangle dashPattern");
		assert.strictEqual(rectangle.widthCoordinateSpace, material1.lineStyle.widthCoordinateSpace, "rectangle widthCoordinateSpace");
		assert.strictEqual(rectangle.x, rectInfo.x, "rectangle x");
		assert.strictEqual(rectangle.y, rectInfo.y, "rectangle y");
		assert.strictEqual(rectangle.width, rectInfo.width, "rectangle width");
		assert.strictEqual(rectangle.height, rectInfo.height, "rectangle height");

		// parametric text test

		var textInfo = {
			type: "text",
			materialID: material1Info.id,
			x: 36,
			y: 47,
			style: {
				fontFamily: "Comic Sans MS",
				size: 17
			},
			content: [ {
				type: 10,
				text: "ABC123"
			} ]
		};
		sceneBuilder.setParametricContent("id-2", textInfo, sceneId);
		assert.strictEqual(node2.children.length, 7, "paremetric text added");
		var text = node2.children[ node2.children.length - 1 ];

		assert.ok(text instanceof Text, "text class");
		assert.deepEqual(Array.from(rectangle.stroke), material1.lineColor, "rectangle color");
		assert.strictEqual(rectangle.strokeWidth, material1.lineWidth, "rectangle lineWidth");
		assert.deepEqual(rectangle.strokeDashArray, material1.lineStyle.dashPattern, "rectangle dashPattern");
		assert.strictEqual(rectangle.widthCoordinateSpace, material1.lineStyle.widthCoordinateSpace, "rectangle widthCoordinateSpace");
		assert.strictEqual(text.x, textInfo.x, "text x");
		assert.strictEqual(text.y, textInfo.y, "text y");
		//assert.deepEqual(text.style, textInfo.style, "text style"); // TODO: uncomment this test after fixing the streaming protocol
		assert.deepEqual(text.content, textInfo.content, "text content");

		// parametric shapes test

		var shapes = [
			{
				type: "ellipticalArc",
				materialID: material1Info.id,
				cx: 11,
				cy: 21,
				major: 31,
				minor: 41,
				start: 1.1,
				end: 2.2
			}, {
				type: "circle",
				materialID: material2Info.id,
				cx: 61,
				cy: 71,
				radius: 55
			}
		];

		sceneBuilder.setParametricContent("id-2", { shapes: shapes }, sceneId);
		assert.strictEqual(node2.children.length, 9, "paremetric shapes added");

		var ellipticalArc = node2.children[ node2.children.length - 2 ];
		assert.ok(ellipticalArc instanceof Path, "ellipticalArc class");
		assert.deepEqual(Array.from(ellipticalArc.stroke), material1.lineColor, "ellipticalArc color");
		assert.strictEqual(ellipticalArc.strokeWidth, material1.lineWidth, "ellipticalArc lineWidth");
		assert.deepEqual(ellipticalArc.strokeDashArray, material1.lineStyle.dashPattern, "ellipticalArc dashPattern");
		assert.strictEqual(ellipticalArc.widthCoordinateSpace, material1.lineStyle.widthCoordinateSpace, "ellipticalArc widthCoordinateSpace");
		assert.ok(ellipticalArc.segments && ellipticalArc.segments.length === 1, "ellipticalArc path segments");
		arcSegment = ellipticalArc.segments[ 0 ];
		assert.strictEqual(arcSegment.type, "arc", "ellipticalArc segment type");
		assert.strictEqual(arcSegment.cx, shapes[ 0 ].cx, "ellipticalArc cx");
		assert.strictEqual(arcSegment.cy, shapes[ 0 ].cy, "ellipticalArc cy");
		assert.strictEqual(arcSegment.rx, shapes[ 0 ].major, "ellipticalArc rx");
		assert.strictEqual(arcSegment.ry, shapes[ 0 ].minor, "ellipticalArc ry");
		assert.strictEqual(arcSegment.start, shapes[ 0 ].start, "ellipticalArc start");
		assert.strictEqual(arcSegment.end, shapes[ 0 ].end, "ellipticalArc start");

		var circle = node2.children[ node2.children.length - 1 ];
		assert.ok(circle instanceof Ellipse, "circle class");
		assert.deepEqual(Array.from(circle.stroke), material2.lineColor, "circle color");
		assert.strictEqual(circle.strokeWidth, material2.lineWidth, "circle lineWidth");
		assert.deepEqual(circle.strokeDashArray, material2.lineStyle.dashPattern, "circle dashPattern");
		assert.strictEqual(circle.widthCoordinateSpace, material2.lineStyle.widthCoordinateSpace, "circle widthCoordinateSpace");
		assert.strictEqual(circle.cx, shapes[ 1 ].cx, "circle cx");
		assert.strictEqual(circle.cy, shapes[ 1 ].cy, "circle cy");
		assert.strictEqual(circle.rx, shapes[ 1 ].radius, "circle rx");
		assert.strictEqual(circle.ry, shapes[ 1 ].radius, "circle ry");

		// triangle geometry test

		var node3 = sceneBuilder.createNode({
			parentId: "id-1",
			sid: "id-3",
			name: "node3",
			meshId: "mesh-id-1"
		}, sceneId);

		assert.ok(node3, "node3 created");
		assert.ok(node3.parent === node1, "node3 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-3") === node3, "node3 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node3") === node3, "node3 name");

		assert.strictEqual(node3.children.length, 0, "node3 no children");

		sceneBuilder.insertSubmesh({
			id: "submesh-id-1",
			materialId: material1Info.id,
			meshId: "mesh-id-1",
			lods: [ {
				id: "geom-id-1"
			} ]
		});

		sceneBuilder.setGeometry({
			id: "geom-id-1",
			isPolyline: false,
			isPositionQuantized: false,
			data: {
				indices: [ 0, 1, 2, 0, 2, 3 ],
				points: [
					0, 0, 0,
					100, 0, 0,
					100, 100, 0,
					0, 100, 0
				]
			}
		});

		assert.strictEqual(node3.children.length, 1, "node3 submesh added");

		var tmesh = node3.children[ 0 ];
		assert.ok(tmesh instanceof Path, "triangle mesh class");
		assert.strictEqual(tmesh.isTriangleMesh, true, "triangleMesh test");

		assert.ok(tmesh.segments && tmesh.segments.length === 1, "triangle mesh path segments");
		assert.deepEqual(Array.from(tmesh.fill), material1.color, "triangle mesh fill");
		assert.deepEqual(Array.from(tmesh.stroke), [ 0, 0, 0, 0 ], "triangle mesh stroke");
		assert.strictEqual(tmesh.strokeWidth, 0, "triangle mesh strokeWidth");
		assert.deepEqual(tmesh.strokeDashArray, material1.lineStyle.dashPattern, "triangle mesh dashPattern");
		assert.strictEqual(tmesh.widthCoordinateSpace, material1.lineStyle.widthCoordinateSpace, "triangle mesh widthCoordinateSpace");
		var tmeshSegment = tmesh.segments[ 0 ];
		assert.strictEqual(tmeshSegment.type, "mesh", "triangle mesh segment type");
		assert.deepEqual(tmeshSegment.points, [ 0, 0, 100, 0, 100, 100, 0, 0, 100, 100, 0, 100 ], "triangle mesh points");

		// polyline geometry test

		sceneBuilder.setGeometry({
			id: "geom-id-2",
			isPolyline: true,
			isPositionQuantized: false,
			data: {
				indices: [ 0, 1, 1, 2 ],
				points: [
					10, 20, 0,
					20, 30, 0,
					30, 40, 0
				]
			}
		});

		sceneBuilder.insertSubmesh({
			id: "submesh-id-2",
			materialId: material1Info.id,
			meshId: "mesh-id-2",
			lods: [ {
				id: "geom-id-2"
			} ]
		});

		var node4 = sceneBuilder.createNode({
			parentId: "id-1",
			sid: "id-4",
			name: "node4",
			meshId: "mesh-id-2"
		}, sceneId);

		assert.ok(node4, "node4 created");
		assert.ok(node4.parent === node1, "node4 parent");
		assert.ok(sceneRoot.getElementByProperty("sid", "id-4") === node4, "node4 sid");
		assert.ok(sceneRoot.getElementByProperty("name", "node4") === node4, "node4 name");

		assert.strictEqual(node4.children.length, 1, "node4 submesh added");

		var pmesh = node4.children[ 0 ];
		assert.ok(pmesh instanceof Path, "polyline mesh class");
		assert.notOk(pmesh.isTriangleMesh, "not triangleMesh test");

		assert.ok(pmesh.segments && pmesh.segments.length === 1, "polyline mesh segments");
		assert.deepEqual(Array.from(pmesh.fill), [ 0, 0, 0, 0 ], "polyline mesh fill");
		assert.deepEqual(Array.from(pmesh.stroke), material1.lineColor, "polyline mesh stroke");
		assert.strictEqual(pmesh.strokeWidth, material1.lineWidth, "polyline mesh strokeWidth");
		assert.deepEqual(pmesh.strokeDashArray, material1.lineStyle.dashPattern, "polyline mesh dashPattern");
		assert.strictEqual(pmesh.widthCoordinateSpace, material1.lineStyle.widthCoordinateSpace, "polyline mesh widthCoordinateSpace");
		var pmeshSegment = pmesh.segments[ 0 ];
		assert.strictEqual(pmeshSegment.type, "polyline", "polyline mesh segment type");
		assert.deepEqual(pmeshSegment.points, [ 10, 20, 20, 30, 30, 40 ], "polyline mesh points");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
