/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the sap.ui.vk.svg.Path class.
sap.ui.define([
	"sap/base/Log",
	"./Element"
], function(
	Log,
	Element
) {
	"use strict";

	var Path = function(parameters) {
		parameters = parameters || {};
		Element.call(this, parameters);

		this.type = "Path";
		this.segments = parameters.segments || [];
		if (parameters.isTriangleMesh) {
			this.isTriangleMesh = true;
		}

		this.setMaterial(parameters.material);
	};

	Path.prototype = Object.assign(Object.create(Element.prototype), { constructor: Path });

	Path.prototype.tagName = function() {
		return "path";
	};

	Path.prototype.isFillable = function() {
		return this.isTriangleMesh;
	};

	function polarToCartesian(cx, cy, rx, ry, angle) {
		var x = cx + rx * Math.cos(angle);
		var y = cy + ry * Math.sin(angle);
		return { x: x, y: y };
	}

	Path.prototype._expandBoundingBox = function(boundingBox, matrixWorld) {
		if (this.domRef) {
			var bbox = this.domRef.getBBox();
			if (bbox) {
				this._expandBoundingBoxCE(boundingBox, matrixWorld, bbox.x + bbox.width * 0.5, bbox.y + bbox.height * 0.5, bbox.width * 0.5, bbox.height * 0.5);
				return;
			}
		}

		var strokeDelta = isNaN(this.strokeWidth) ? 0 : this.strokeWidth * 0.5;
		var x = 0, y = 0;
		for (var si = 0, sl = this.segments.length; si < sl; si++) {
			var segment = this.segments[ si ];
			var points = segment.points;
			var dim = segment.dimension || 2, i, l;
			switch (segment.type) {
				case "arc":
					if (points) {
						if (segment.relative) {
							x += points[ 0 ];
							y += points[ 1 ];
						} else {
							x = points[ 0 ];
							y = points[ 1 ];
						}
						this._expandBoundingBoxCE(boundingBox, matrixWorld, x, y, strokeDelta, strokeDelta);
					} else {
						for (var a = 0, n = 6; a < n; a++) {
							var pos = polarToCartesian(segment.cx, segment.cy, segment.rx, segment.ry, segment.start + (segment.end - segment.start) * a / (n - 1));
							this._expandBoundingBoxCE(boundingBox, matrixWorld, pos.x, pos.y, strokeDelta, strokeDelta);
						}
						if (segment.closed) {
							this._expandBoundingBoxCE(boundingBox, matrixWorld, segment.cx, segment.cy, strokeDelta, strokeDelta);
						}
					}
					break;
				case "move":
				case "polyline":
				case "mesh":
					x = points[ 0 ];
					y = points[ 1 ];
					this._expandBoundingBoxCE(boundingBox, matrixWorld, x, y, strokeDelta, strokeDelta);
					for (i = dim, l = points.length - 1; i < l; i += dim) {
						if (segment.relative) {
							x += points[ i ];
							y += points[ i + 1 ];
						} else {
							x = points[ i ];
							y = points[ i + 1 ];
						}
						this._expandBoundingBoxCE(boundingBox, matrixWorld, x, y, strokeDelta, strokeDelta);
					}
					break;
				case "line":
					for (i = 0, l = points.length - 1; i < l; i += dim) {
						if (segment.relative) {
							x += points[ i ];
							y += points[ i + 1 ];
						} else {
							x = points[ i ];
							y = points[ i + 1 ];
						}
						this._expandBoundingBoxCE(boundingBox, matrixWorld, x, y, strokeDelta, strokeDelta);
					}
					break;
				case "bezier":
					var degree = segment.degree || 2;
					for (i = 0, l = points.length - 1; i < l; i += dim) {
						if (segment.relative) {
							this._expandBoundingBoxCE(boundingBox, matrixWorld, x + points[ i ], y + points[ i + 1 ], strokeDelta, strokeDelta);
							if ((i / dim) % degree === degree - 1) {
								x += points[ i ];
								y += points[ i + 1];
							}
						} else {
							x = points[ i ];
							y = points[ i + 1 ];
							this._expandBoundingBoxCE(boundingBox, matrixWorld, x, y, strokeDelta, strokeDelta);
						}
					}
					break;
				default:
					break;
			}
		}
	};

	function addBezierSegment(d, segment) {
		var i, l;
		var points = segment.points;
		switch (segment.degree || 2) {
			case 2:
				for (i = 0, l = points.length - 3; i < l; i += 4) {
					d.push(segment.relative ? "q" : "Q", points[ i ], points[ i + 1 ], points[ i + 2 ], points[ i + 3 ]);
				}
				break;
			case 3:
				if (!segment.smooth) {
					for (i = 0, l = points.length - 5; i < l; i += 6) {
						d.push(segment.relative ? "c" : "C", points[ i ], points[ i + 1 ], points[ i + 2 ], points[ i + 3 ], points[ i + 4 ], points[ i + 5 ]);
					}
				} else {
					for (i = 0, l = points.length - 3; i < l; i += 4) {
						d.push(segment.relative ? "s" : "S", points[ i ], points[ i + 1 ], points[ i + 2 ], points[ i + 3 ]);
					}
				}
				break;
			default:
				Log.warning("Unsupported bezier segment degree:", segment.type);
				break;
		}
	}

	function addPolyline(d, segment) {
		var points = segment.points;
		d.push("M", points[ 0 ], points[ 1 ]);
		var dim = segment.dimension || 2;
		for (var i = dim, l = points.length - 1; i < l; i += dim) {
			d.push("L", points[ i ], points[ i + 1 ]);
		}
		if (segment.closed) {
			d.push("Z");
		}
	}

	function addLine(d, segment) {
		var points = segment.points;
		var dim = segment.dimension || 2;
		for (var i = 0, l = points.length - 1; i < l; i += dim) {
			d.push(segment.relative ? "l" : "L", points[ i ], points[ i + 1 ]);
		}
	}

	function addMesh(d, segment) {
		var points = segment.points;
		for (var i = 0, l = points.length - 5; i < l; i += 6) {
			d.push("M", points[ i ], points[ i + 1 ], "L", points[ i + 2 ], points[ i + 3 ], "L", points[ i + 4 ], points[ i + 5 ], "Z");
		}
	}

	function addArc(d, segment) {
		var points = segment.points;
		if (points) {
			d.push(segment.relative ? "a" : "A", segment.major, segment.minor, "0", segment.followLargeArc ? "1" : "0", segment.clockwise ? "1" : "0", points[ 0 ], points[ 1 ]);
		} else {
			var startPos = polarToCartesian(segment.cx, segment.cy, segment.rx, segment.ry, segment.start);
			var endPos = polarToCartesian(segment.cx, segment.cy, segment.rx, segment.ry, segment.end);
			d.push("M", startPos.x, startPos.y, "A", segment.rx, segment.ry, "0", Math.abs(segment.end - segment.start) < Math.PI ? "0" : "1", segment.end > segment.start ? "1" : "0", endPos.x, endPos.y);
			if (segment.closed) {
				d.push("L", segment.cx, segment.cy, "Z");
			}
		}
	}

	Path.prototype._setSpecificAttributes = function(setAttributeFunc) {
		var d = [];
		this.segments.forEach(function(segment) {
			switch (segment.type) {
				case "arc":
					addArc(d, segment);
					break;
				case "line":
					addLine(d, segment);
					break;
				case "close":
					d.push("Z");
					break;
				case "bezier":
					addBezierSegment(d, segment);
					break;
				case "move":
				case "polyline":
					addPolyline(d, segment);
					break;
				case "mesh":
					addMesh(d, segment);
					break;
				default:
					Log.warning("Unsupported path segment type:", segment.type, JSON.stringify(segment));
					break;
			}
		});

		if (d.length > 0) {
			// console.log(this, d.join(" "));
			setAttributeFunc("d", d.join(" "));
		}

		if (!this.isTriangleMesh) {
			// setAttributeFunc("stroke-linecap", "butt");
			setAttributeFunc("stroke-linejoin", "round");
		}
	};

	Path.prototype.copy = function(source, recursive) {
		Element.prototype.copy.call(this, source, recursive);

		for (var i = 0, l = source.segments.length; i < l; i++) {
			var sourceSegment = source.segments[ i ];
			var segment = { type: sourceSegment.type };
			if (sourceSegment.points !== undefined) {
				segment.points = sourceSegment.points.slice();
			}
			if (sourceSegment.dimension !== undefined) {
				segment.dimension = sourceSegment.dimension;
			}
			if (sourceSegment.degree !== undefined) {
				segment.degree = sourceSegment.degree;
			}
			if (sourceSegment.smooth) {
				segment.smooth = true;
			}
			if (sourceSegment.relative) {
				segment.relative = true;
			}
			if (sourceSegment.closed) {
				segment.closed = true;
			}
			if (sourceSegment.major) {
				segment.major = sourceSegment.major;
			}
			if (sourceSegment.minor) {
				segment.minor = sourceSegment.minor;
			}
			if (sourceSegment.followLargeArc) {
				segment.followLargeArc = true;
			}
			if (sourceSegment.clockwise) {
				segment.clockwise = true;
			}
			if (sourceSegment.cx !== undefined) {
				segment.cx = sourceSegment.cx;
			}
			if (sourceSegment.cy !== undefined) {
				segment.cy = sourceSegment.cy;
			}
			if (sourceSegment.rx !== undefined) {
				segment.rx = sourceSegment.rx;
			}
			if (sourceSegment.ry !== undefined) {
				segment.ry = sourceSegment.ry;
			}
			if (sourceSegment.start !== undefined) {
				segment.start = sourceSegment.start;
			}
			if (sourceSegment.end !== undefined) {
				segment.end = sourceSegment.end;
			}
			this.segments.push(segment);
		}
		if (source.isTriangleMesh) {
			this.isTriangleMesh = true;
		}

		return this;
	};

	return Path;
});
