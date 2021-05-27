/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * TransformSvgElementToolGizmo renderer.
	 * @namespace
	 */
	var TransformSvgElementToolGizmoRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} control
	 *            the control to be rendered
	 */
	TransformSvgElementToolGizmoRenderer.render = function(rm, control) {
		if (!control._viewport) {
			return;
		}

		var viewBox = control._viewport._getViewBox();
		rm.write("<svg xmlns=\"http://www.w3.org/2000/svg\"");
		rm.writeControlData(control);
		rm.writeClasses();
		rm.writeAttribute("width", "100%");
		rm.writeAttribute("height", "100%");
		rm.writeAttribute("viewBox", viewBox.join(" "));
		rm.addStyle("position", "absolute");
		rm.addStyle("pointer-events", "none");
		rm.writeStyles();
		rm.write(">");

		rm.write("<defs><filter id='shadow-effect'><feDropShadow dx='0' dy='0' stdDeviation='2' flood-color='#000'/></filter></defs>");

		var scale = 1 / control._viewport._camera.zoom;
		function addTouchRect(x, y, sx, sy) {
			rm.write("<rect");
			rm.writeAttribute("fill", "#fff");
			rm.writeAttribute("stroke", "#000");
			rm.writeAttribute("stroke-width", 1);
			rm.writeAttribute("vector-effect", "non-scaling-stroke");
			rm.writeAttribute("filter", "url(#shadow-effect)");

			var w = Math.abs(8 * sx);
			var h = Math.abs(8 * sy);
			rm.writeAttribute("x", x - w * 0.5);
			rm.writeAttribute("y", y - h * 0.5);
			rm.writeAttribute("width", w);
			rm.writeAttribute("height", h);
			rm.write("/>");
		}

		control._nodes.forEach(function(nodeInfo) {
			var node = nodeInfo.node;
			var bbox = nodeInfo.bbox;
			if (bbox) {
				var matrix = node._matrixWorld();
				var handlePositions = control._getHandleLocalPositions(nodeInfo, matrix);
				var sx = scale * nodeInfo.xSign * nodeInfo.ySign / Math.sqrt(matrix[ 0 ] * matrix[ 0 ] + matrix[ 1 ] * matrix[ 1 ]);
				var sy = scale * nodeInfo.ySign / Math.sqrt(matrix[ 2 ] * matrix[ 2 ] + matrix[ 3 ] * matrix[ 3 ]);

				rm.write("<g");
				rm.writeAttribute("transform", "matrix(" + matrix.join(",") + ")");
				rm.write(">");

				rm.write("<rect");
				rm.writeAttribute("fill", "none");
				rm.writeAttribute("stroke", "#fff");
				rm.writeAttribute("vector-effect", "non-scaling-stroke");
				rm.writeAttribute("x", bbox.x);
				rm.writeAttribute("y", bbox.y);
				rm.writeAttribute("width", bbox.width);
				rm.writeAttribute("height", bbox.height);
				rm.write("/>");
				rm.write("<rect");
				rm.writeAttribute("fill", "none");
				rm.writeAttribute("stroke", "#000");
				// rm.writeAttribute("stroke-width", 1);
				rm.writeAttribute("stroke-dasharray", "5 5");
				rm.writeAttribute("vector-effect", "non-scaling-stroke");
				rm.writeAttribute("x", bbox.x);
				rm.writeAttribute("y", bbox.y);
				rm.writeAttribute("width", bbox.width);
				rm.writeAttribute("height", bbox.height);
				rm.write("/>");

				rm.write("<line");
				rm.writeAttribute("stroke", "#fff");
				rm.writeAttribute("vector-effect", "non-scaling-stroke");
				rm.writeAttribute("x1", handlePositions[ 0 ]);
				rm.writeAttribute("y1", handlePositions[ 1 ]);
				rm.writeAttribute("x2", handlePositions[ 16 ]);
				rm.writeAttribute("y2", handlePositions[ 17 ]);
				rm.write("/>");
				rm.write("<line");
				rm.writeAttribute("stroke", "#000");
				rm.writeAttribute("stroke-dasharray", "5 5");
				rm.writeAttribute("vector-effect", "non-scaling-stroke");
				rm.writeAttribute("x1", handlePositions[ 0 ]);
				rm.writeAttribute("y1", handlePositions[ 1 ]);
				rm.writeAttribute("x2", handlePositions[ 16 ]);
				rm.writeAttribute("y2", handlePositions[ 17 ]);
				rm.write("/>");

				// rm.write("<ellipse");
				// rm.writeAttribute("fill", "#fff");
				// rm.writeAttribute("stroke", "#000");
				// rm.writeAttribute("stroke-width", 1);
				// rm.writeAttribute("vector-effect", "non-scaling-stroke");
				// // rm.writeAttribute("filter", "url(#shadow-effect)");
				// rm.writeAttribute("cx", handlePositions[ 16 ]);
				// rm.writeAttribute("cy", handlePositions[ 17 ]);
				// rm.writeAttribute("rx", 6 * sx);
				// rm.writeAttribute("ry", 6 * sy);
				// rm.write("/>");

				rm.write("<g");
				rm.writeAttribute("transform", "matrix(" + sx + ",0,0," + sy + "," + (handlePositions[ 16 ] - 8 * sx) + "," + (handlePositions[ 17 ] - 8 * sy) + ")");
				rm.write(">");
				rm.write("<circle fill='#fff' stroke='#000' cx='8' cy='8' r='7.5'/><path fill='#000' d='M8,12.94A4.84,4.84,0,1,1,8,3.27h2.84v1H8a3.84,3.84,0,1,0,3.84,3.84h1A4.84,4.84,0,0,1,8,12.94Z'/><path fill='#000' d='M9.89,5.59a.5.5,0,0,1-.34-.88l1.09-1L9.56,2.83a.51.51,0,0,1-.05-.71.49.49,0,0,1,.7-.05l1.51,1.31a.48.48,0,0,1,.17.37.49.49,0,0,1-.16.38L10.22,5.46A.5.5,0,0,1,9.89,5.59Z'/><circle fill='#000' cx='8' cy='8' r='0.83'/>");
				rm.write("</g>");

				for (var i = 0; i < 8; i++) {
					addTouchRect(handlePositions[ i * 2 ], handlePositions[ i * 2 + 1 ], sx, sy);
				}

				rm.write("</g>");
			}
		});

		rm.write("</svg>");
	};

	return TransformSvgElementToolGizmoRenderer;

}, /* bExport= */ true);
