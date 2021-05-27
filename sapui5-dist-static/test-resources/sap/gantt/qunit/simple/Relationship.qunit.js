/*global QUnit */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/ComponentContainer",
	"sap/gantt/simple/GanttRowSettings",
	"sap/gantt/simple/BaseRectangle",
	"sap/gantt/simple/Relationship",
	"sap/gantt/simple/test/GanttQUnitUtils",
	"sap/ui/Device"
], function (Core, ComponentContainer, GanttRowSettings, BaseRectangle, Relationship, utils, Device) {
	"use strict";

	QUnit.module("Functional", {
		beforeEach: function () {
			this.RELATION_TYPE = { "FinishToFinish": 0, "FinishToStart": 1, "StartToFinish": 2, "StartToStart": 3 };
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
			this.sD = undefined;
			this.oRls = new Relationship();
		},
		afterEach: function () {
			utils.destroyGantt();
		}
	});

	QUnit.test("getLinePathD", function (assert) {
		this.sD = this.oRls.getLinePathD([[5, 5], [35, 35]]);
		assert.equal(this.sD, "M5,5L35,35Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcIRlsPathD", function (assert) {
		this.sD = this.oRls.calcIRlsPathD(5, 5, 35, 5);
		assert.equal(this.sD, "M5,5L35,5Z", "Line path is '" + this.sD + "'");
	});

	QUnit.test("calcLRlsPathD", function (assert) {
		this.sD = this.oRls.calcLRlsPathD(5, 5, 35, 35);
		assert.equal(this.sD, "M5,5L35,5L35,35L35,5Z", "Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", true, true);
		this.sD = this.oRls.calcLRlsPathD(5, 5, 35, 35);
		assert.equal(this.sD, "M5,5L35,5L35,35", "Curved Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", false, true);
	});

	QUnit.test("calcURlsPathD", function (assert) {
		this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35,false,3);
		assert.equal(this.sD, "M5,5L53,5L53,35L35,35L53,35L53,5Z", "Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35,false,2);
		assert.equal(this.sD, "M5,5L47,5L47,35L35,35L47,35L47,5Z", "Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", true, true);
		this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35,false,3);
		assert.equal(this.sD, "M5,5L53,5L53,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcURlsPathD(5, 5, 35, 35,false,2);
		assert.equal(this.sD, "M5,5L47,5L47,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", false, true);
	});

	QUnit.test("calcSRlsPathDSF", function (assert) {
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10, 2,3);
		assert.equal(this.sD, "M5,5L-13,5L-13,10L53,10L53,35L35,35L53,35L53,10L-13,10L-13,5Z", "Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10, 2,2);
		assert.equal(this.sD, "M5,5L-7,5L-7,10L47,10L47,35L35,35L47,35L47,10L-7,10L-7,5Z", "Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", true, true);
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10, 2,3);
		assert.equal(this.sD, "M5,5L-13,5L-13,10L53,10L53,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10, 2,2);
		assert.equal(this.sD, "M5,5L-7,5L-7,10L47,10L47,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", false, true);
	});

	QUnit.test("calcSRlsPathDFS", function (assert) {
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10, 1,3);
		assert.equal(this.sD, "M5,5L23,5L23,10L17,10L17,35L35,35L17,35L17,10L23,10L23,5Z", "Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcSRlsPathD(5, 5, 25, 25, 10, 1,2);
		assert.equal(this.sD, "M5,5L17,5L17,10L13,10L13,25L25,25L13,25L13,10L17,10L17,5Z", "Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", true, true);
		this.sD = this.oRls.calcSRlsPathD(5, 5, 35, 35, 10, 1,3);
		assert.equal(this.sD, "M5,5L23,5L23,10L17,10L17,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcSRlsPathD(5, 5, 25, 25, 10, 1,2);
		assert.equal(this.sD, "M5,5L17,5L17,10L13,10L13,25L25,25", "Curved Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", false, true);
	});

	QUnit.test("calcZRlsPathD", function (assert) {
		this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35,3);
		assert.equal(this.sD, "M5,5L23,5L23,35L35,35L23,35L23,5Z", "Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35,2);
		assert.equal(this.sD, "M5,5L17,5L17,35L35,35L17,35L17,5Z", "Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", true, true);
		this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35,3);
		assert.equal(this.sD, "M5,5L23,5L23,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.sD = this.oRls.calcZRlsPathD(5, 5, 35, 35,2);
		assert.equal(this.sD, "M5,5L17,5L17,35L35,35", "Curved Line path is '" + this.sD + "'");
		this.oRls.setProperty("enableCurvedEdge", false, true);
	});

	QUnit.test("getConnectorEndPath", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var aRelationType = ["FinishToStart", "StartToFinish"];
			aRelationType.forEach(function (sType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Arrow"
				});
				var sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,11L32,11Z", "up arrow and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,29L32,29Z", "down arrow and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Square"
				});
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,5L38,11L32,11L32,5Z", "Square upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,35L38,29L32,29L32,35Z", "Square downward's and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Diamond"
				});
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,8L35,11L32,8Z", "Diamond upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,32L35,29L32,32Z", "Diamond downward's and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Circle"
				});
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M37,10C36,11,34,11,33,10C32,9,32,7,32.5,5.999999999999999C33,5,34,5,35,4.999999999999999C36,5,37,5,37.5,5.999999999999999C38,7,38,9,37,10", "Circle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M37,29.999999999999996C36,29,34,29,33,29.999999999999996C32,31,32,33,32.5,34C33,35,34,35,35,35C36,35,37,35,37.5,34C38,33,38,31,37,29.999999999999996", "Circle downward's and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "HorizontalRectangle"
				});
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L41,5L41,11L29,11L29,5Z", "Horizontal Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L41,35L41,29L29,29L29,35Z", "Horizontal Rectangle downward's and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "VerticalRectangle"
				});
				sD = oRls.getConnectorEndPath("M5,35L35,35L35,5L35,35Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L38,5L38,17L32,17L32,5Z", "Vertical Rectangle upward's and relation type is " + sType + "");
				sD = oRls.getConnectorEndPath("M5,5L35,5L35,35L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,35L38,35L38,23L32,23L32,35Z", "Vertical Rectangle downward's and relation type is " + sType + "");

			}.bind(this));

			aRelationType = ["FinishToFinish", "StartToFinish"];
			aRelationType.forEach(function (sType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Arrow"
				});
				var sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L11,2L11,8Z", "left arrow and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Square"
				});
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L11,2L11,8L5,8Z", "Square and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Diamond"
				});
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L8,2L11,5L8,8Z", "Diamond and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Circle"
				});
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				if (Device.browser.msie) {
					assert.equal(sD, "M10,3C11,4,11,6,10,6.999999999999999C9,8,7,8,5.999999999999999,7.499999999999999C5,7,5,6,4.999999999999999,4.999999999999999C5,3.9999999999999995,5,3,5.999999999999999,2.5C7,2,9,2,10,3", "Circle and relation type is " + sType + "");
				} else {
					assert.equal(sD, "M10,3C11,4,11,6,10,6.999999999999999C9,8,7,8,5.999999999999999,7.499999999999999C5,7,5,6,4.999999999999999,4.999999999999999C5,3.9999999999999996,5,3,5.999999999999999,2.5C7,2,9,2,10,3", "Circle and relation type is " + sType + "");
				}

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "HorizontalRectangle"
				});
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L17,2L17,8L5,8Z", "Horizontal Rectangle and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "VerticalRectangle"
				});
				sD = oRls.getConnectorEndPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,-1L11,-1L11,11L5,11Z", "Vertical Rectangle and relation type is " + sType + "");
			}.bind(this));

			aRelationType = ["FinishToStart", "StartToStart"];
			aRelationType.forEach(function (sType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Arrow"
				});
				var sD = oRls.getConnectorEndPath(("M5,5L35,5Z"), this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L29,2L29,8Z", "right arrow and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Square"
				});
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L29,2L29,8L35,8Z", "Square and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Diamond"
				});
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L32,2L29,5L32,8Z", "Diamond and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "Circle"
				});
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				if (Device.browser.msie) {
					assert.equal(sD, "M29.999999999999996,3C29,4,29,6,29.999999999999996,6.999999999999999C31,8,33,8,34,7.499999999999999C35,7,35,6,35,4.999999999999999C35,3.9999999999999995,35,3,34,2.5C33,2,31,2,29.999999999999996,3", "Circle and relation type is " + sType + "");
				} else {
					assert.equal(sD, "M29.999999999999996,3C29,4,29,6,29.999999999999996,6.999999999999999C31,8,33,8,34,7.499999999999999C35,7,35,6,35,4.999999999999999C35,3.9999999999999996,35,3,34,2.5C33,2,31,2,29.999999999999996,3", "Circle and relation type is " + sType + "");
				}


				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "HorizontalRectangle"
				});
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L23,2L23,8L35,8Z", "Horizontal Rectangle and relation type is " + sType + "");


				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeEnd: "VerticalRectangle"
				});
				sD = oRls.getConnectorEndPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,-1L29,-1L29,11L35,11Z", "Vertical Rectangle and relation type is " + sType + "");
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("getConnectorStartPath", function (assert) {
		return utils.waitForGanttRendered(this.oGantt).then(function () {
			var aRelationType = ["FinishToFinish", "FinishToStart"];
			aRelationType.forEach(function (sType, iType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Arrow"
				});
				var sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), iType);
				assert.equal(sD, "M5,5L5,2L11,5L5,8Z", "right arrow and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Square"
				});
				sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L5,2L11,2L11,8L5,8Z", "Square and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Diamond"
				});
				sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M5,5L8,2L11,5L8,8Z", "Diamond and relation type is " + sType + "");


				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Circle"
				});
				sD = oRls.getConnectorStartPath("M5,5L35,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				if (Device.browser.msie) {
					assert.equal(sD, "M10,3C11,4,11,6,10,6.999999999999999C9,8,7,8,5.999999999999999,7.499999999999999C5,7,5,6,4.999999999999999,4.999999999999999C5,3.9999999999999995,5,3,5.999999999999999,2.5C7,2,9,2,10,3", "Circle and relation type is " + sType + "");
				} else {
					assert.equal(sD, "M10,3C11,4,11,6,10,6.999999999999999C9,8,7,8,5.999999999999999,7.499999999999999C5,7,5,6,4.999999999999999,4.999999999999999C5,3.9999999999999996,5,3,5.999999999999999,2.5C7,2,9,2,10,3", "Circle and relation type is " + sType + "");
				}
			}.bind(this));

			aRelationType = ["StartToFinish", "StartToStart"];
			aRelationType.forEach(function (sType, iType) {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Arrow"

				});
				var sD = oRls.getConnectorStartPath(("M35,5L5,5Z"), this.oGantt.getId(), iType + 2);
				assert.equal(sD, "M35,5L35,2L29,5L35,8Z", "left arrow and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Square"
				});
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L29,2L29,8L35,8Z", "Square and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Diamond"
				});
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L32,2L29,5L32,8Z", "Diamond and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "Circle"
				});
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				if (Device.browser.msie) {
				    assert.equal(sD, "M29.999999999999996,3C29,4,29,6,29.999999999999996,6.999999999999999C31,8,33,8,34,7.499999999999999C35,7,35,6,35,4.999999999999999C35,3.9999999999999995,35,3,34,2.5C33,2,31,2,29.999999999999996,3", "Circle and relation type is " + sType + "");
				} else {
					assert.equal(sD, "M29.999999999999996,3C29,4,29,6,29.999999999999996,6.999999999999999C31,8,33,8,34,7.499999999999999C35,7,35,6,35,4.999999999999999C35,3.9999999999999996,35,3,34,2.5C33,2,31,2,29.999999999999996,3", "Circle and relation type is " + sType + "");
				}
				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "HorizontalRectangle"
				});
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,2L23,2L23,8L35,8Z", "Horizontal Rectangle and relation type is " + sType + "");

				oRls = new Relationship({
					predecessor: "0",
					successor: "1",
					shapeTypeStart: "VerticalRectangle"
				});
				sD = oRls.getConnectorStartPath("M35,5L5,5Z", this.oGantt.getId(), this.RELATION_TYPE[sType]);
				assert.equal(sD, "M35,5L35,-1L29,-1L29,11L35,11Z", "Vertical Rectangle and relation type is " + sType + "");
			}.bind(this));
		}.bind(this));
	});

	QUnit.module("Relationship render", {
		beforeEach: function () {
			utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 1000);
		}
	});

	QUnit.test("getRelatedInRowShapes", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1"
				});
				var oChart = window.oGanttChart;
				var oShapes = oRls.getRelatedInRowShapes(oChart.getId());
				assert.equal(oShapes.predecessor.getShapeId(), "0", "Shape instance is found");
				assert.equal(oShapes.successor.getShapeId(), "1", "Shape instance is found");
				done();
			});
		}.bind(this));
	});

	QUnit.test("getRlsAnchors", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1"
				});
				var oChart = window.oGanttChart;
				var oShapes = oRls.getRelatedInRowShapes(oChart.getId()), oAnchors;
				var aRelationType = ["FinishToFinish", "FinishToStart", "StartToFinish", "StartToStart"];
				aRelationType.forEach(function (sType, iType) {
					oRls.setProperty("type", sType);
					oAnchors = oRls.getRlsAnchors(iType, oShapes);
					assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
					oAnchors = oRls.getRlsAnchors(iType, { "predecessor": oShapes.predecessor, "successor": null });
					assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
					oAnchors = oRls.getRlsAnchors(iType, { "predecessor": null, "successor": oShapes.successor });
					assert.ok(oAnchors.predecessor && oAnchors.successor, "Default anchors are created");
				});
				done();
			});
		}.bind(this));
	});

	QUnit.test("Test Anchors for FinishToFinish relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1"
				});
				var oChart = window.oGanttChart;
				var oShapes = oRls.getRelatedInRowShapes(oChart.getId()), oOldAnchors, oNewAnchors;
				oRls.setProperty("type", "FinishToFinish");
				oOldAnchors = oRls.getRlsAnchors(0, oShapes);
				for (var key in oShapes) {
					oShapes[key].setXBias(10);
					oShapes[key].setYBias(5);
				}
				oNewAnchors = oRls.getRlsAnchors(0, oShapes);
				assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
				done();
			});
		}.bind(this));
	});

	QUnit.test("Test Anchors for FinishToStart relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1"
				});
				var oChart = window.oGanttChart;
				var oShapes = oRls.getRelatedInRowShapes(oChart.getId()), oOldAnchors, oNewAnchors;
				oRls.setProperty("type", "FinishToStart");
				oOldAnchors = oRls.getRlsAnchors(1, oShapes);
				for (var key in oShapes) {
					oShapes[key].setXBias(10);
					oShapes[key].setYBias(5);
				}
				oNewAnchors = oRls.getRlsAnchors(1, oShapes);
				assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
				done();
			});
		}.bind(this));
	});

	QUnit.test("Test Anchors for StartToFinish relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1"
				});
				var oChart = window.oGanttChart;
				var oShapes = oRls.getRelatedInRowShapes(oChart.getId()), oOldAnchors, oNewAnchors;
				oRls.setProperty("type", "StartToFinish");
				oOldAnchors = oRls.getRlsAnchors(2, oShapes);
				for (var key in oShapes) {
					oShapes[key].setXBias(10);
					oShapes[key].setYBias(5);
				}
				oNewAnchors = oRls.getRlsAnchors(2, oShapes);
				assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
				done();
			});
		}.bind(this));
	});

	QUnit.test("Test Anchors for StartToStart relation when xbias and ybias are set", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					predecessor: "0",
					successor: "1"
				});
				var oChart = window.oGanttChart;
				var oShapes = oRls.getRelatedInRowShapes(oChart.getId()), oOldAnchors, oNewAnchors;
				oRls.setProperty("type", "StartToStart");
				oOldAnchors = oRls.getRlsAnchors(3, oShapes);
				for (var key in oShapes) {
					oShapes[key].setXBias(10);
					oShapes[key].setYBias(5);
				}
				oNewAnchors = oRls.getRlsAnchors(3, oShapes);
				assert.equal(oNewAnchors.predecessor.x - oOldAnchors.predecessor.x, 10, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.successor.x - oOldAnchors.successor.x, 10, "Relation anchor aligned with the successor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the predecessor shape");
				assert.equal(oNewAnchors.predecessor.y - oOldAnchors.predecessor.y, 5, "Relation anchor aligned with the successor shape");
				done();
			});
		}.bind(this));
	});


	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var clr = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;

		if (clr) {
			return "rgb(" + clr.r + ", " + clr.g + ", " + clr.b + ")";
		}

		return hex;
	}

	QUnit.test("renderElement", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					type: "FinishToStart",
					shapeId: "rls-1",
					selectable: true,
					predecessor: "0",
					successor: "1",
					stroke: "#ff0000",
					strokeOpacity: 0.8,
					strokeWidth: 4,
					strokeDasharray: "1 4"
				});
				var oChart = window.oGanttChart;
				var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
				var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);


				var oRm = Core.createRenderManager();
				oRls.renderElement(oRm, oRls, oChart.getId());
				oRm.flush(oRlsCnt);
				if (!Device.browser.msie) {

					var $path = oRls.$();

					assert.equal(true, $path.css("stroke-width") === "4px" || $path.css("stroke-width") === "4", "stroke width");
					assert.equal(hexToRgb($path.css("stroke")), "rgb(255, 0, 0)", "stroke color");
					assert.equal($path.css("opacity"), "0.8", "stroke opacity");

				var sArray = $path[0].style["stroke-dasharray"],
					bCondition = sArray === "1, 4" || sArray === "1px, 4px" || sArray === "1,4" || sArray === "1px,4px",
					arrowStrokeDashArray = $path[0].children[1].style.strokeDasharray === "none";

					assert.equal(bCondition, true, "stroke dasharray");
					assert.equal(arrowStrokeDashArray, true, "stroke dasharray for arrow should be none");

					assert.ok(jQuery(oRlsCnt).find("[data-sap-gantt-shape-id='rls-1']").get(0) != null, "Relationship dom element is found");
				} else {
					assert.ok(true);
				}
				oRm.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.test("visibility", function (assert) {
		var done = assert.async();
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					type: "FinishToStart",
					shapeId: "rls-1",
					selectable: true,
					predecessor: "0",
					successor: "1",
					stroke: "#ff0000",
					strokeOpacity: 0.8,
					strokeWidth: 4,
					strokeDasharray: "1 4",
					visible: false
				});
				var oChart = window.oGanttChart;
				var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
				var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);

				var oRm = Core.createRenderManager();
				oRls.renderElement(oRm, oRls, oChart.getId());
				oRm.flush(oRlsCnt);
				if (!Device.browser.msie) {
					var $path = oRls.$();
					assert.equal($path.length, 0);
				} else {
					assert.ok(true);
				}
				oRm.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.module("Connector Overlap", {
		beforeEach: function () {
			this.oGantt = utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true,
						resizable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 1000);
		}
	});

	QUnit.test("Start Connector Shapes Overlap", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "FinishToStart",
				predecessor: "0",
				successor: "1",
				shapeTypeStart: "Square",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				type: "FinishToStart",
				predecessor: "0",
				successor: "2",
				shapeTypeStart: "Square",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeStart", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizonatl rectangle shape on overlap with different shape");
			done();
		}.bind(this));
	});

	QUnit.test("End Connector Shape Overlap", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "FinishToStart",
				predecessor: "0",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				type: "FinishToStart",
				predecessor: "2",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeEnd", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			done();
		}.bind(this));
	});

	QUnit.test("End Connector Overlap in L-shape up/down position", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "FinishToStart",
				predecessor: "0",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: "leftUp"
			});
			var oRls1 = new Relationship({
				type: "FinishToStart",
				predecessor: "2",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: "leftUp"
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftUp"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeEnd", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftUp"), "VerticalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with  different shape in L-shape Up position");
			oRls.setProperty("_lMarker", "leftDown", true);
			oRls1.setProperty("_lMarker", "leftDown", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftDown"), "VerticalRectangle", "Connector will change to horizontal rectangle shape on overlap with  different shape in L-shape down position");
			done();
		}.bind(this));
	});

	QUnit.test("Start Connector Shapes Overlap with End shape Connector of other Relation", function (assert) {
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "FinishToStart",
				predecessor: "0",
				successor: "1",
				shapeTypeStart: "Arrow",
				shapeTypeEnd: "Circle",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				type: "FinishToFinish",
				predecessor: "3",
				successor: "0",
				shapeTypeStart: "Arrow",
				shapeTypeEnd: "Diamond",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			done();
		}.bind(this));
	});

	QUnit.test("Start Connector Shapes Overlap in RTL mode", function (assert) {
		sap.ui.getCore().getConfiguration().setRTL(true);
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "StartToFinish",
				predecessor: "0",
				successor: "1",
				shapeTypeStart: "Square",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				type: "StartToFinish",
				predecessor: "0",
				successor: "2",
				shapeTypeStart: "Square",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeStart", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			sap.ui.getCore().getConfiguration().setRTL(false);
			done();
		}.bind(this));

	});

	QUnit.test("End Connector Shape Overlap in RTL mode", function (assert) {
		sap.ui.getCore().getConfiguration().setRTL(true);
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "StartToFinish",
				predecessor: "3",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				type: "StartToFinish",
				predecessor: "4",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeEnd", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			sap.ui.getCore().getConfiguration().setRTL(false);
			done();
		}.bind(this));
	});

	QUnit.test("End Connector Overlap in L-shape up/down position in RTL mode", function (assert) {
		sap.ui.getCore().getConfiguration().setRTL(true);
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "StartToFinish",
				predecessor: "0",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: "leftUp"
			});
			var oRls1 = new Relationship({
				type: "StartToFinish",
				predecessor: "2",
				successor: "1",
				shapeTypeEnd: "Square",
				_lMarker: "leftUp"
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftUp"), "Square", "Connector shape will remain same  on overlap with same shape");
			oRls.setProperty("shapeTypeEnd", "Circle", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftUp"), "VerticalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with  different shape in L-shape Up position");
			oRls.setProperty("_lMarker", "leftDown", true);
			oRls1.setProperty("_lMarker", "leftDown", true);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "end", "leftDown"), "VerticalRectangle", "Connector will change to horizontal rectangle shape on overlap with  different shape in L-shape down position");
			sap.ui.getCore().getConfiguration().setRTL(false);
			done();
		}.bind(this));
	});

	QUnit.test("Start Connector Shapes Overlap with End shape Connector of other Relation in RTL mode", function (assert) {
		sap.ui.getCore().getConfiguration().setRTL(true);
		var done = assert.async();
		this.delayedAssert(function () {
			var oRls = new Relationship({
				type: "StartToFinish",
				predecessor: "0",
				successor: "1",
				shapeTypeStart: "Arrow",
				shapeTypeEnd: "Circle",
				_lMarker: ""
			});
			var oRls1 = new Relationship({
				type: "FinishToStart",
				predecessor: "3",
				successor: "0",
				shapeTypeStart: "Arrow",
				shapeTypeEnd: "Diamond",
				_lMarker: ""
			});
			this.oGantt.getTable().getRows()[0].getAggregation('_settings').mAggregations.relationships.push(oRls, oRls1);
			assert.equal(oRls._checkConnectorOverlap(this.oGantt.getId(), 1, "start"), "HorizontalRectangle", "Connector shape will change to horizontal rectangle shape on overlap with different shape");
			sap.ui.getCore().getConfiguration().setRTL(false);
			done();
		}.bind(this));
	});
	QUnit.module("Theme Adaptation", {
		before: function () {
			this.oTheme = sap.ui.getCore().getConfiguration().getTheme();
		},
		beforeEach: function () {
			utils.createGantt(false, new GanttRowSettings({
				rowId: "{Id}",
				shapes1: [
					new BaseRectangle({
						shapeId: "{Id}",
						time: "{StartDate}",
						endTime: "{EndDate}",
						title: "{Name}",
						fill: "#008FD3",
						selectable: true
					})
				]
			}));
		},
		afterEach: function () {
			utils.destroyGantt();
		},
		after: function () {
			sap.ui.getCore().applyTheme(this.oTheme);
		},
		delayedAssert: function (fnAssertion) {
			setTimeout(function () {
				fnAssertion();
			}, 1000);
		}
	});

	QUnit.test("adaptToHcbTheme", function (assert) {
		var done = assert.async();
		sap.ui.getCore().applyTheme("sap_hcb");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					type: "FinishToStart",
					shapeId: "rls-1",
					selectable: true,
					predecessor: "0",
					successor: "1"
				});

				var oChart = window.oGanttChart;
				var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
				var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
				var oRm = Core.createRenderManager();
				oRls.renderElement(oRm, oRls, oChart.getId());
				oRm.flush(oRlsCnt);

				if (!Device.browser.msie) {
					var $path = oRls.$();
					assert.equal(hexToRgb($path.css("stroke")), "rgb(255, 255, 255)", "stroke color is correct");
				} else {
					assert.ok(true);
				}

				oRm.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.test("adaptToHcwTheme", function (assert) {
		var done = assert.async();
		sap.ui.getCore().applyTheme("sap_fiori_3_hcw");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					type: "FinishToStart",
					shapeId: "rls-1",
					selectable: true,
					predecessor: "0",
					successor: "1"
				});

				var oChart = window.oGanttChart;
				var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
				var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
				var oRm = Core.createRenderManager();
				oRls.renderElement(oRm, oRls, oChart.getId());
				oRm.flush(oRlsCnt);

				if (!Device.browser.msie) {
					var $path = oRls.$();
					assert.equal(hexToRgb($path.css("stroke")), "rgb(0, 0, 0)", "stroke color is correct");
				} else {
					assert.ok(true);
				}

				oRm.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.test("adaptToDarkTheme", function (assert) {
		var done = assert.async();
		sap.ui.getCore().applyTheme("sap_fiori_3_dark");
		utils.waitForGanttRendered(window.oGanttChart).then(function () {
			this.delayedAssert(function () {
				var oRls = new Relationship({
					type: "FinishToStart",
					shapeId: "rls-1",
					selectable: true,
					predecessor: "0",
					successor: "1"
				});

				var oChart = window.oGanttChart;
				var oGntSvg = window.document.getElementById(oChart.getId() + "-svg");
				var oRlsCnt = jQuery(oGntSvg).children("g.sapGanttChartRls").get(0);
				var oRm = Core.createRenderManager();
				oRls.renderElement(oRm, oRls, oChart.getId());
				oRm.flush(oRlsCnt);

				if (!Device.browser.msie) {
					var $path = oRls.$();
					assert.equal(hexToRgb($path.css("stroke")), "rgb(250, 250, 250)", "stroke color is correct");
				} else {
					assert.ok(true);
				}

				oRm.destroy();
				done();
			});
		}.bind(this));
	});

	QUnit.module("OData Gantt render", {
		beforeEach: function () {
			this.oComponentContainer = new ComponentContainer({
				height: "300px", // limit height so we can test incoming relationship from a shape which won't be visible after we scroll down
				name: "sap.gantt.simple.test.GanttChart2OData",
				settings: {
					id: "sap.gantt.sample.GanttChart2OData"
				}
			});
			return new Promise(function (fnResolve) {
				this.oComponentContainer.attachComponentCreated(function () {
					this.oComponentContainer.getComponentInstance().getRootControl().loaded().then(function (oView) {
						this.oGantt = oView.byId("gantt1");
						utils.waitForGanttRendered(this.oGantt).then(fnResolve);
					}.bind(this));
				}.bind(this));
				this.oComponentContainer.placeAt("qunit-fixture");
			}.bind(this));
		},
		afterEach: function () {
			this.oComponentContainer.destroy();
		}
	});

	/**
	 * The relationships tested here should look like this:
	 *         ______________
	 *   —>🔗 |    shape    | —>🔗
	 *        ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅
	 */
	QUnit.test("relationship prompts (links)", function (assert) {
		return new Promise(function (fnResolve) {
			setTimeout(function () {
				document.querySelector(".sapUiTableVSbExternal").scrollTop = 100; // scroll down so the predecessor shape is not visible
				this.oGantt.getInnerGantt().attachEventOnce("ganttReady", function () {
					var oLeftRls = document.querySelector("[data-sap-gantt-shape-id='rls-X1']");
					assert.ok(oLeftRls, "Left relationship should be visible.");
					assert.strictEqual(oLeftRls.childElementCount, 5, "Left relationship should have correct number of children.");
					assert.strictEqual(escape(oLeftRls.querySelector("text").textContent), "%uE088", "Left relationship should have link icon rendered.");

					var oRightRls = document.querySelector("[data-sap-gantt-shape-id='rls-X2']");
					assert.ok(oRightRls, "Right relationship should be visible.");
					assert.strictEqual(oRightRls.childElementCount, 5, "Right relationship should have correct number of children.");
					assert.strictEqual(escape(oRightRls.querySelector("text").textContent), "%uE088", "Right relationship should have link icon rendered.");

					fnResolve();
				});
			}.bind(this), 100); // because table updates rows async in AutoRowMode
		}.bind(this));
	});

});
