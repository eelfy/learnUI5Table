/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/svg/ViewStateManager",
	"sap/ui/vk/svg/Viewport",
	"sap/ui/vk/svg/Scene",
	"sap/ui/vk/svg/Element",
	"sap/ui/vk/svg/Rectangle",
	"sap/ui/vk/svg/Line",
	"sap/ui/vk/svg/Ellipse",
	"sap/ui/vk/svg/Path",
	"sap/ui/vk/svg/Polyline",
	"sap/ui/vk/svg/Text"
], function(
	ViewStateManager,
	Viewport,
	Scene,
	Element,
	Rectangle,
	Line,
	Ellipse,
	Path,
	Polyline,
	Text
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");

	var scene = new Scene();
	var root = scene.getRootElement();
	var group1Params = {
		name: "group",
		sid: "00-00",
		matrix: new Float32Array([ 1.01, 0.011, -0.022, 1.02, 1, 2 ])
	};
	var group = new Element(group1Params);
	root.add(group);

	var rectParams = {
		name: "rect",
		sid: "11-11",
		x: 12,
		y: 23,
		width: 123,
		height: 234,
		rx: 2,
		ry: 3,
		matrix: new Float32Array([ 0.5, 0.1, -0.05, 0.6, 3, 4 ]),
		lineStyle: {
			// colour: new Float32Array([ 0.1, 0.2, 0.3, 0.4 ]),
			colour: new Float32Array([ 0.2, 0.3, 0.4, 0.5 ]),
			width: 3,
			dashes: [ 6, 2, 9, 3 ]
		},
		fillStyle: {
			colour: new Float32Array([ 0.1, 0.2, 0.3, 0.4 ])
		}
	};
	group.add(new Rectangle(rectParams));

	var lineParams = {
		name: "line",
		sid: "22-22",
		x1: -12,
		y1: 23,
		x2: 345,
		y2: 456,
		matrix: new Float32Array([ 0.6, 0.03, -0.06, 0.7, -5, -6 ]),
		lineStyle: {
			colour: new Float32Array([ 0.2, 0.9, 0.4, 0.8 ]),
			width: 5,
			dashes: [ 10, 5, 15, 5 ]
		}
	};
	group.add(new Line(lineParams));

	var ellipseParams = {
		name: "ellipse",
		sid: "33-33",
		cx: 213,
		cy: 332,
		major: 133,
		minor: 244,
		matrix: new Float32Array([ 0.5, -0.04, 0.05, 0.4, 7, -8 ]),
		lineStyle: {
			// colour: new Float32Array([ 0.5, 0.4, 0.3, 0.2 ]),
			colour: new Float32Array([ 0.3, 0.4, 0.5, 0.6 ]),
			width: 3,
			dashes: [ 10, 2, 15, 3 ]
		},
		fillStyle: {
			colour: new Float32Array([ 0.5, 0.4, 0.3, 0.2 ])
		}
	};
	group.add(new Ellipse(ellipseParams));

	var polylineParams = {
		name: "polyline",
		sid: "44-44",
		points: [ 100, 100, 200, 100, 300, 200, 300, 300 ],
		matrix: new Float32Array([ 0.75, 0.04, -0.05, 0.85, 9, 10 ]),
		lineStyle: {
			// colour: new Float32Array([ 0.4, 0.5, 0.6, 0.7 ]),
			colour: new Float32Array([ 0.7, 0.7, 0.1, 0.7 ]),
			width: 3,
			dashes: [ 9, 3, 6, 3 ]
		},
		fillStyle: {
			colour: new Float32Array([ 0.4, 0.5, 0.6, 0.7 ])
		}
	};
	group.add(new Polyline(polylineParams));

	var pathParams = {
		name: "path",
		sid: "55-55",
		segments: [ {
			type: "arc",
			cx: 150,
			cy: 200,
			rx: 100,
			ry: 50,
			start: 0,
			end: Math.PI
		}, {
			type: "move",
			points: [ 100, 100 ]
		}, {
			type: "bezier",
			degree: 3,
			smooth: true,
			points: [ 200, 100, 300, 200, 300, 300 ]
		}, {
			type: "bezier",
			degree: 3,
			smooth: true,
			relative: true,
			points: [ 201, 101, 301, 201, 301, 301 ]
		}, {
			type: "bezier",
			degree: 3,
			smooth: true,
			points: [ 205, 105, 305, 205 ]
		}, {
			type: "bezier",
			degree: 3,
			relative: true,
			points: [ 208, 108, 308, 208 ]
		}, {
			type: "polyline",
			points: [ 50, 50, 250, 50, 250, 250, 50, 250 ]
		} ],
		matrix: new Float32Array([ 1.1, 0.1, -0.2, 1.2, -11, 12 ]),
		lineStyle: {
			// colour: new Float32Array([ 0.5, 0.9, 0.8, 0.7 ]),
			colour: new Float32Array([ 0.1, 0.5, 0.9, 0.9 ]),
			width: 2,
			dashes: [ 4, 2, 6, 2 ]
		},
		fillStyle: {
			colour: new Float32Array([ 0.5, 0.9, 0.8, 0.7 ])
		}
	};
	group.add(new Path(pathParams));

	var textParams = {
		name: "text",
		x: 11,
		y: 22,
		style: {
			size: 67.8,
			fontFace: "Comic Sans MS"
		},
		content: [ {
			type: 10,
			text: "ABC.123"
		}, {
			type: 12,
			style: {
				size: 44.4,
				fontFace: "Impact"
			},
			pathSegments: [ {
				type: "move",
				points: [ 10, 290 ]
			}, {
				type: "arc",
				clockwise: true,
				major: 120,
				minor: 120,
				points: [ 150, 150 ]
			}, {
				type: "arc",
				clockwise: false,
				major: 120,
				minor: 120,
				points: [ 290, 10 ]
			} ],
			content: [ {
				type: 10,
				text: "DEF.456"
			}, {
				type: 11,
				style: {
					size: 33.3,
					fontFace: "Courier"
				},
				content: [ {
					type: 10,
					text: "-abcdef-"
				} ]
			}, {
				type: 10,
				text: "XYZ.789"
			} ]
		} ],
		sid: "66-66",
		matrix: new Float32Array([ 1.04, 0.01, 0.02, 1.05, -13, 14 ]),
		lineStyle: {
			colour: new Float32Array([ 0.9, 0.9, 0.3, 0.8 ]),
			width: 2,
			dashes: [ 4, 2 ]
		},
		fillStyle: {
			colour: new Float32Array([ 0.8, 0.4, 0.2, 0.7 ])
		}
	};
	group.add(new Text(textParams));

	viewport.setScene(scene);
	viewStateManager._setScene(scene);

	// set node fake veid
	var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
	var allNodeRefs = nodeHierarchy.findNodesByName();
	allNodeRefs.forEach(function(node) {
		node.userData.treeNode = { sid: node.uid };
	});

	// var maxDifference = 1e-3;
	// function assertClose(assert, actual, expected, message) {
	// 	var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
	// 	assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
	// }

	QUnit.test("SVG Element", function(assert) {
		var done = assert.async();

		function hexColor(color) {
			if (color[ 3 ] === 0) {
				return "none";
			}
			var hex = (((color[ 0 ] * 255) << 24) | ((color[ 1 ] * 255) << 16) | ((color[ 2 ] * 255) << 8) | (color[ 3 ] * 255)) >>> 0;
			return "#" + ("00000000" + hex.toString(16)).slice(-8);
		}

		function testDomRef(element) {
			var name = element.name;
			var domRef = element.domRef;
			assert.ok(domRef, name + " dom element");
			assert.strictEqual(domRef.tagName, element.tagName(), name + " tag name");
			assert.strictEqual(domRef.id, element.uid, name + " unique id");
			assert.strictEqual(domRef.getAttribute("transform"), "matrix(" + element.matrix.join() + ")", name + " matrix");
			if (element.fill) {
				assert.strictEqual(domRef.getAttribute("fill"), hexColor(element.fill), name + " fill");
			}
			if (element.stroke) {
				assert.strictEqual(domRef.getAttribute("stroke"), hexColor(element.stroke), name + " stroke");
				assert.strictEqual(domRef.getAttribute("stroke-width"), element.strokeWidth.toString(), name + " stroke-width");
				if (element.strokeDashArray) {
					assert.strictEqual(domRef.getAttribute("stroke-dasharray"), element.strokeDashArray.join(" "), name + " stroke-dasharray");
				}
			}

			switch (domRef.tagName) {
				case "rect":
					assert.strictEqual(domRef.getAttribute("x"), element.x.toString(), name + " x");
					assert.strictEqual(domRef.getAttribute("y"), element.y.toString(), name + " y");
					assert.strictEqual(domRef.getAttribute("width"), element.width.toString(), name + " width");
					assert.strictEqual(domRef.getAttribute("height"), element.height.toString(), name + " height");
					break;
				case "line":
					assert.strictEqual(domRef.getAttribute("x1"), element.x1.toString(), name + " x1");
					assert.strictEqual(domRef.getAttribute("y1"), element.y1.toString(), name + " y1");
					assert.strictEqual(domRef.getAttribute("x2"), element.x2.toString(), name + " x2");
					assert.strictEqual(domRef.getAttribute("y2"), element.y2.toString(), name + " y2");
					break;
				case "ellipse":
					assert.strictEqual(domRef.getAttribute("cx"), element.cx.toString(), name + " cx");
					assert.strictEqual(domRef.getAttribute("cy"), element.cy.toString(), name + " cy");
					assert.strictEqual(domRef.getAttribute("rx"), element.rx.toString(), name + " rx");
					assert.strictEqual(domRef.getAttribute("ry"), element.ry.toString(), name + " ry");
					break;
				case "polyline":
					assert.strictEqual(domRef.getAttribute("points"), element.points.join(" "), name + " points");
					break;
				case "path":
					assert.strictEqual(domRef.getAttribute("d"), "M 250 200 A 100 50 0 1 1 50 200 M 100 100 S 200 100 300 200 s 201 101 301 201 S 205 105 305 205 M 50 50 L 250 50 L 250 250 L 50 250", " path.d");
					break;
				case "text":
					var textPathContent = element.content[ 1 ];
					var tspanContent = textPathContent.content[ 1 ];
					assert.strictEqual(domRef.textContent, element.content[ 0 ].text + textPathContent.content[ 0 ].text + tspanContent.content[ 0 ].text + textPathContent.content[ 2 ].text, name + " textContent");
					assert.strictEqual(domRef.getAttribute("font-family"), element.style.fontFace, name + " fontFamily");
					assert.strictEqual(domRef.getAttribute("font-size"), element.style.size.toString(), name + " fontSize");

					assert.strictEqual(domRef.childNodes.length, 2, name + " childNodes");
					assert.strictEqual(domRef.children.length, 1, name + " children");
					assert.strictEqual(domRef.childNodes[ 0 ].nodeName, "#text", name + " text1 nodeName");
					assert.strictEqual(domRef.childNodes[ 0 ].textContent, element.content[ 0 ].text, name + " text1");

					var textPath = domRef.childNodes[ 1 ];
					assert.strictEqual(textPath.getAttribute("font-family"), textPathContent.style.fontFace, name + " textPath fontFamily");
					assert.strictEqual(textPath.getAttribute("font-size"), textPathContent.style.size.toString(), name + " textPath fontSize");
					assert.strictEqual(textPath.childNodes.length, 4, name + " textPath childNodes");
					assert.strictEqual(textPath.children.length, 2, name + " textPath children");
					assert.strictEqual(textPath.getAttribute("href"), "#" + textPath.childNodes[ 0 ].getAttribute("id"), name + " textPath href");
					assert.strictEqual(textPath.childNodes[ 0 ].nodeName, "path", name + " textPath path nodeName");
					assert.strictEqual(textPath.childNodes[ 0 ].getAttribute("d"), "M 10 290 A 120 120 0 0 1 150 150 A 120 120 0 0 0 290 10", name + " textPath path");
					assert.strictEqual(textPath.childNodes[ 1 ].nodeName, "#text", name + " textPath text1 nodeName");
					assert.strictEqual(textPath.childNodes[ 1 ].textContent, textPathContent.content[ 0 ].text, name + " textPath text1");
					assert.strictEqual(textPath.childNodes[ 3 ].nodeName, "#text", name + " textPath text2 nodeName");
					assert.strictEqual(textPath.childNodes[ 3 ].textContent, textPathContent.content[ 2 ].text, name + " textPath text2");

					var tspan = textPath.childNodes[ 2 ];
					assert.strictEqual(tspan.nodeName, "tspan", name + " tspan nodeName");
					assert.strictEqual(tspan.getAttribute("font-family"), tspanContent.style.fontFace, name + " tspan fontFamily");
					assert.strictEqual(tspan.getAttribute("font-size"), tspanContent.style.size.toString(), name + " tspan fontSize");
					assert.strictEqual(tspan.childNodes.length, 1, name + " tspan childNodes");
					assert.strictEqual(tspan.children.length, 0, name + " tspan children");
					assert.strictEqual(tspan.childNodes[ 0 ].nodeName, "#text", name + " tspan text1 nodeName");
					assert.strictEqual(tspan.childNodes[ 0 ].textContent, tspanContent.content[ 0 ].text, name + " tspan text1");
					break;
				default:
					break;
			}
		}

		function testElement(params) {
			var name = params.name;
			var nodes = nodeHierarchy.findNodesByName({ value: name });
			assert.ok(nodes && nodes.length === 1 && nodes[ 0 ].name === name, name + " found");
			var element = nodes[ 0 ];
			assert.strictEqual(element.sid, params.sid, name + " element sid");
			testElementContent(element, params);

			var clone = element.clone();
			assert.notEqual(clone, element, name + " cloned");
			testElementContent(clone, params);

			testDomRef(element);

			var domRef = element.domRef;
			element.invalidate();
			assert.notEqual(element.domRef, domRef, name + " invalidate()");
			testDomRef(element);

			domRef = element.domRef;
			element.invalidate();
			assert.notEqual(element.domRef, domRef, name + " rerender()");
			testDomRef(element);
		}

		function testElementContent(element, params) {
			var name = element.name;
			assert.strictEqual(element.name, params.name, name + " element name");
			assert.deepEqual(element.matrix, params.matrix, name + " element matrix");
			var lineStyle = params.lineStyle;
			if (lineStyle) {
				assert.deepEqual(element.stroke, lineStyle.colour, name + " element stroke color");
				assert.strictEqual(element.strokeWidth, lineStyle.width, name + " element stroke width");
				assert.deepEqual(element.strokeDashArray, Element._convertDashes(lineStyle.dashes), name + " element stroke dash pattern");
			}
			var fillStyle = params.fillStyle;
			if (fillStyle && element.isFillable()) {
				assert.deepEqual(element.fill, fillStyle.colour, name + " element fill color");
			}

			switch (element.tagName()) {
				case "rect":
					assert.strictEqual(element.x, params.x, name + " element x");
					assert.strictEqual(element.y, params.y, name + " element y");
					assert.strictEqual(element.width, params.width, name + " element width");
					assert.strictEqual(element.height, params.height, name + " element height");
					assert.strictEqual(element.rx, params.rx, name + " element rx");
					assert.strictEqual(element.ry, params.ry, name + " element ry");
					break;
				case "line":
					assert.strictEqual(element.x1, params.x1, name + " element x1");
					assert.strictEqual(element.y1, params.y1, name + " element y1");
					assert.strictEqual(element.x2, params.x2, name + " element x2");
					assert.strictEqual(element.y2, params.y2, name + " element y2");
					break;
				case "ellipse":
					assert.strictEqual(element.cx, params.cx, name + " element cx");
					assert.strictEqual(element.cy, params.cy, name + " element cy");
					assert.strictEqual(element.rx, params.major, name + " element rx");
					assert.strictEqual(element.ry, params.minor, name + " element ry");
					break;
				case "path":
					assert.deepEqual(element.segments, params.segments, name + " element segments");
					break;
				case "polyline":
					assert.deepEqual(element.points, new Float32Array(params.points), name + " element points");
					break;
				case "text":
					assert.deepEqual(element.content, params.content, name + " element content");
					assert.deepEqual(element.style, params.style, name + " element style");
					break;
				default:
					break;
			}
		}

		testElement(group1Params);
		testElement(rectParams);
		testElement(lineParams);
		testElement(ellipseParams);
		testElement(polylineParams);
		testElement(pathParams);
		testElement(textParams);

		var matrix1 = new Float32Array([ 1, 2, 3, 4, 5, 6 ]);
		var matrix2 = new Float32Array([ 7, 8, 9, 10, 11, 12 ]);
		var m1x2 = Element._multiplyMatrices(matrix1, matrix2);
		assert.deepEqual(m1x2, new Float32Array([ 31, 46, 39, 58, 52, 76 ]), "Element._multiplyMatrices");
		var m1Inv = Element._invertMatrix(matrix1);
		assert.deepEqual(m1Inv, new Float32Array([ -2, 1, 1.5, -0.5, 1, -2 ]), "Element._invertMatrix");
		var m1x2xi1 = Element._multiplyMatrices(m1Inv, m1x2);
		assert.deepEqual(m1x2xi1, matrix2, "Element inverted matrix multiply");

		var maxDifference = 1e-3;
		function assertClose(actual, expected, message) {
			var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
			assert.pushResult({ result: passes, actual: actual, expected: expected, message: message + " (" + actual + " ~ " + expected + ")" });
		}

		function testArray(a, b, message) {
			a.forEach(function(v, i) {
				assertClose(v, b[ i ], message + ":" + i);
			});
		}

		var sx = 2;
		var sy = 3;
		var px = 4;
		var py = 5;
		for (var i = 0; i < 360; i += 15) {
			var angle = i * Math.PI / 180;
			var sa = Math.sin(angle), ca = Math.cos(angle);
			var qz = Math.sin(angle / 2), qw = Math.cos(angle / 2);

			// var q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
			// var m = new THREE.Matrix4().makeRotationFromQuaternion(q);
			// var q2 = new THREE.Quaternion();
			// m.decompose(new THREE.Vector3(), q2, new THREE.Vector3());

			var m1 = new Float32Array([ sx * ca, sx * sa, sy * -sa, sy * ca, px, py ]);
			var res = Element._decompose(m1);
			var m2 = Element._compose(res.position, res.quaternion, res.scale);

			assert.deepEqual(res.position, [ px, py, 0 ], "Element._decompose position " + i);
			testArray(res.quaternion, res.quaternion[ 2 ] * qz >= 0 ? [ 0, 0, qz, qw ] : [ 0, 0, -qz, -qw ], "Element._decompose quaternion " + i);
			testArray(res.scale, [ sx, sy, 1 ], "Element._decompose scale " + i);
			testArray(m2, m1, "Element decompose & compose " + i);
		}

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
