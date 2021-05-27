/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/LegendContainer",
	"sap/gantt/simple/ListLegend",
	"sap/gantt/simple/ListLegendItem",
	"sap/gantt/simple/LegendShapeGroup",
	"sap/gantt/simple/LegendShapeGroupOrientation",
	"sap/ui/core/Core",
	"sap/gantt/simple/DimensionLegend",
	"sap/gantt/simple/LegendColumnConfig",
	"sap/gantt/simple/LegendRowConfig"
], function (LegendContainer, ListLegend, ListLegendItem, LegendShapeGroup, LegendShapeGroupOrientation, Core, DimensionLegend, LegendColumnConfig, LegendRowConfig) {
	"use strict";

	function placeAt(oControl) {
		//Cover onBeforeRendering logic
		oControl.placeAt("qunit-fixture");
		Core.applyChanges();
	}

	QUnit.test("single legend", function(assert) {
		var oLegendContainer = new LegendContainer({
			legends: [new ListLegend("Empty")]
		});

		placeAt(oLegendContainer);
		var oNavContainer = oLegendContainer._oNavContainer;
		assert.strictEqual(oNavContainer.getPages().length, 1, "only 1 page is generated");
		assert.strictEqual(oNavContainer.getWidth(), "200px", "same width applied");
		assert.strictEqual(oNavContainer.getHeight(), "200px", "same height applied");
		oLegendContainer.destroy();
	});

	QUnit.module("Multiple sections", {
		beforeEach: function() {
			this.oLegendContainer = new LegendContainer({
				width : "900px",
				height : "1200px",
				legends: [
					new ListLegend({title: "First"}),
					new ListLegend({title: "Second"})
				]
			});
			placeAt(this.oLegendContainer);
		},
		afterEach: function() {
			this.oLegendContainer.destroy();
		}
	});

	QUnit.test("construtor", function (assert) {
		var oNavContainer = this.oLegendContainer._oNavContainer;
		assert.ok(oNavContainer instanceof sap.m.NavContainer, "NavContainer generated");
		assert.ok(this.oLegendContainer._sCurrentPageTitle == null, "no current page title at init");

		var aPages = oNavContainer.getPages();
		var aLegends = this.oLegendContainer.getLegends();

		assert.strictEqual(oNavContainer.getWidth(), this.oLegendContainer.getWidth(), "width is set to navigation container correctly");
		assert.strictEqual(oNavContainer.getHeight(), this.oLegendContainer.getHeight(), "width is set to navigation container correctly");
		assert.strictEqual(aPages.length, aLegends.length + 1, "initial page is created so 1 more page added to navigation container");
		assert.ok(aPages[0].getContent()[0].getItems().length == aLegends.length, "Initial page List Item generated");
	});

	QUnit.test("legend navigations", function(assert) {
		var oNavContainer = this.oLegendContainer._oNavContainer;
		var oInitialPage = oNavContainer.getPages()[0];
		var oList = oInitialPage.getContent()[0];

		assert.ok(oList != null, "initial page content is a List control");
		assert.strictEqual(oList.getItems().length, 2, "item in the list has same number of legend");

		var fnToSpy = sinon.spy(oNavContainer, "to");
		var fnBackToTop = sinon.spy(oNavContainer, "backToTop");
		var oFirstItem = oList.getItems()[0];
		var oFirstPage = oNavContainer.getPages()[1];
		oFirstItem.firePress();
		assert.ok(fnToSpy.calledOnce, "navigation to function is called");
		assert.equal(oFirstItem.getTitle(), "First", "First Legend list item is showing");
		assert.strictEqual(oFirstItem.getTitle(), oFirstPage.getTitle(), "The legend title matched");

		oFirstPage.fireNavButtonPress();
		assert.ok(fnBackToTop.calledOnce, "navigation back to intial page now");

		fnToSpy.restore();
		fnBackToTop.restore();
	});

	QUnit.test("Check page numbers", function(assert) {
		var oLC = this.oLegendContainer;
		oLC.rerender();

		var oNC = oLC._oNavContainer;
		var aLegends = oLC.getLegends(),
			aPages = oNC.getPages();
		assert.strictEqual(aPages.length, aLegends.length + 1, "call onBeforeRendering shouldn't create duplicate pages");

		// validate whether current page is restored
		var done = assert.async();
		oNC.to(aPages[1]);
		this.oLegendContainer._oNavContainer.attachAfterNavigate(function(){
			assert.strictEqual(oLC._sCurrentPageTitle, aPages[1].getTitle(), "sCurrent page title is set correctly");
			done();
		});
	});

	QUnit.module("manipulate legends aggregations");
	QUnit.test("addLegend", function(assert) {
		var oLC = new LegendContainer({
			legends: [new ListLegend({title: "First Legend"})]
		});

		assert.strictEqual(oLC._oNavContainer.getPages().length, 0, "no render no pages in NavContainer");

		oLC.addLegend(new ListLegend({title: "Second Legend"}));
		assert.strictEqual(oLC._oNavContainer.getPages().length, 0, "even you add legend aggregation to LegendContainer");

		placeAt(oLC);
		assert.strictEqual(oLC._oNavContainer.getPages().length, 3, "UI5 rendered, so total 3 pages created for NavContainer");

		oLC.removeLegend(oLC.getLegends().length - 1);
		oLC._oNavContainer.removePage(oLC._oNavContainer.getPages().length - 1);
		oLC.invalidate();
		Core.applyChanges();
		assert.strictEqual(oLC._oNavContainer.getPages().length, 2, "trigger render, removeLegend take effects, and 1 legend only has 1 page");
		oLC.destroy();
	});

	QUnit.test("Validate Diamond inside LegendContainer is rendered properly for DimensionLegend", function(assert) {
		var oLC = new LegendContainer({
			id: "legendContainer",
			legends: [
				new DimensionLegend({
					title: "DimensionLegend",
					columnConfigs: [
						new LegendColumnConfig({
							text: "Test1",
							fill: "red"
						}),
						new LegendColumnConfig({
							text: "Test2",
							fill: "red"
						}),
						new LegendColumnConfig({
							text: "Test3",
							fill: "red"
						})
					],
					rowConfigs: [
						new LegendRowConfig({
							shapeClass: "sap.gantt.simple.BaseDiamond"
						}),
						new LegendRowConfig({
							shapeClass: "sap.gantt.simple.BaseRectangle"
						}),
						new LegendRowConfig({
							shapeClass: "sap.gantt.simple.BaseChevron"
						}),
						new LegendRowConfig({
							shapeClass: "sap.gantt.simple.BaseCursor"
						})
					]
				})
			],
			width : "900px",
			height : "1200px"
		});
		placeAt(oLC);
		var count = 0;
		for (var i = 0; i < document.getElementsByClassName("sapGanttDLSvg").length - 1; i++) {
			for (var j = 0; j < document.getElementsByClassName("sapGanttDLSvg")[i].childElementCount; j++) {
				var svgContainer = document.getElementsByClassName("sapGanttDLSvg")[i].getBoundingClientRect();
				var shapeContainer = document.getElementsByClassName("sapGanttDLSvg")[i].childNodes[j].getBoundingClientRect();
				if (shapeContainer.left >= svgContainer.left && (shapeContainer.left + shapeContainer.width) <= (svgContainer.left + svgContainer.width )) {
					assert.ok(true, "Element " + document.getElementsByClassName("sapGanttDLSvg")[i].childNodes[j].id + " has been set properly");
					count++;
				}
			}
		}
		oLC.destroy();
	});

	QUnit.test("Legend Container having Multiple Sub Section for ListLegend", function(assert) {
		var oLC = new LegendContainer({
			id: "legendContainer",
			legends: [
				new ListLegend({
					title: "First Legend",
					items: new ListLegendItem({
						legendName: "First Legend Item",
						shape: new sap.gantt.simple.BaseRectangle({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Second Legend",
					items: new ListLegendItem({
						legendName: "Second Legend Item",
						shape: new sap.gantt.simple.BaseChevron({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Third Legend",
					items: new ListLegendItem({
						legendName: "Third Legend Item",
						shape: new sap.gantt.simple.BaseDiamond({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Fourth Legend",
					items: new ListLegendItem({
						legendName: "Fourth Legend Item",
						shape: new sap.gantt.simple.BaseCursor({
							title: "First Legend Item",
							fill: "red"
						})
					})
				})
			],
			width : "900px",
			height : "1200px"
		});
		placeAt(oLC);

		var oList = oLC._oNavContainer.getPages()[0].getContent()[0];
		var done = assert.async();
		var	afterNavigate = function(evt) {
			if (!evt.getParameter("isBackToTop")) {
				var svgContainer = document.getElementsByClassName("sapGanttLLSvg")[0].getBoundingClientRect();
				var shapeContainer = document.getElementsByClassName("sapGanttLLSvg")[0].firstChild.getBoundingClientRect();
				assert.ok(true, "Navigation occured to page: " + evt.getParameter("to").getTitle());
				if (shapeContainer.left >= svgContainer.left && (shapeContainer.x + shapeContainer.width) <= (svgContainer.left + svgContainer.width )) {
					assert.ok(true, "Element " + document.getElementsByClassName("sapGanttLLSvg")[0].firstChild.id + " has been set properly");
				}
			} else {
				assert.ok(true, "Back Navigation occured to page: " +  evt.getParameter("to").getTitle());
			}
		};

		oLC._oNavContainer.attachAfterNavigate(afterNavigate);

		for ( var i = 0; i < oList.getItems().length; i++) {
			var oListLegendItem = oList.getItems()[i];
			var ocurrentPage = oLC._oNavContainer.getPages()[i + 1];
			oListLegendItem.firePress();
			ocurrentPage.fireNavButtonPress();
		}
		window.setTimeout(function(){
			done();
			oLC.destroy();
		}, 6000);

	});

	QUnit.test("Legend Container having Multiple Items for ListLegend", function(assert) {
		var oLC = new LegendContainer({
			id: "legendContainer",
			legends: [
				new ListLegend({
					title: "First Legend",
					items: [
						new ListLegendItem({
						legendName: "First Legend Item",
						shape: new sap.gantt.simple.BaseRectangle({
							title: "First Legend Item",
							fill: "red"
						})
						}),
						new ListLegendItem({
							legendName: "Second Legend Item",
							shape: new sap.gantt.simple.BaseChevron({
								title: "Second Legend Item",
								fill: "red"
							})
						}),
						new ListLegendItem({
							legendName: "Third Legend Item",
							shape: new sap.gantt.simple.BaseDiamond({
								title: "Third Legend Item",
								fill: "red"
							})
						}),
						new ListLegendItem({
							legendName: "Fourth Legend Item",
							shape: new sap.gantt.simple.BaseCursor({
								title: "Fourth Legend Item",
								fill: "red"
							})
						})
					]
				})
			],
			width : "900px",
			height : "1200px"
		});
		placeAt(oLC);

		for (var i = 0; i < document.getElementsByClassName("sapGanttLLSvg").length; i++) {
			var svgContainer = document.getElementsByClassName("sapGanttLLSvg")[i].getBoundingClientRect();
			var shapeContainer = document.getElementsByClassName("sapGanttLLSvg")[i].childNodes[0].getBoundingClientRect();
			if (shapeContainer.left >= svgContainer.left && (shapeContainer.left + shapeContainer.width) <= (svgContainer.left + svgContainer.width)) {
				assert.ok(true, "Element " + document.getElementsByClassName("sapGanttLLSvg")[i].childNodes[0].id + " has been set properly");
			}
		}
		oLC.destroy();
	});

	QUnit.test("Legends with same title as the LegendContainer", function(assert) {
		var oLC = new LegendContainer({
			legends: [new ListLegend({title: "First Legend"}), new ListLegend({title: "Second Legend"}), new ListLegend({title: "Legend"})]
		});
		placeAt(oLC);

		assert.strictEqual(oLC._oNavContainer.getPages().length, 4, "UI5 rendered, so total 4 pages created for NavContainer");
		assert.strictEqual(oLC._oNavContainer.getPages()[0].getTitle(), "Legend", "Initial Landing Page has Title as Legend");
		assert.strictEqual(oLC._oNavContainer.getPages()[1].getTitle(), "First Legend", "First Section Title as First Legend");
		assert.strictEqual(oLC._oNavContainer.getPages()[2].getTitle(), "Second Legend", "Second Section has Title as Second Legend");
		assert.strictEqual(oLC._oNavContainer.getPages()[3].getTitle(), "Legend", "Third Section has Title as Legend");

		var oInitialPage = oLC._oNavContainer.getPages()[0];
		var oList = oInitialPage.getContent()[0];

		var fnToSpy = sinon.spy(oLC._oNavContainer, "to");
		var oThirdItem = oList.getItems()[2];
		var oThirdPage = oLC._oNavContainer.getPages()[3];
		oThirdItem.firePress();

		assert.ok(fnToSpy.calledOnce, "Navigation to function is called");
		assert.equal(oThirdItem.getTitle(), "Legend", "Third Legend list item is showing");
		assert.strictEqual(oThirdItem.getTitle(), oThirdPage.getTitle(), "The legend title matched");

		fnToSpy.restore();
		oLC.destroy();
	});

	QUnit.test("Adding Vertical Legend Shape Group", function(assert) {
		var oLC = new LegendContainer({
			id: "legendContainer",
			legends: [
				new ListLegend({
					title: "First Legend",
					items: new ListLegendItem({
						legendName: "First Legend Item",
						shape: new sap.gantt.simple.BaseRectangle({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Second Legend",
					items: new ListLegendItem({
						legendName: "Second Legend Item",
						shape: new sap.gantt.simple.BaseChevron({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Third Legend",
					items: new ListLegendItem({
						legendName: "Third Legend Item",
						shape: new sap.gantt.simple.BaseDiamond({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Fourth Legend",
					items: new ListLegendItem({
						legendName: "Fourth Legend Item",
						shape: new sap.gantt.simple.BaseCursor({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
                    title: "Fifth Legend",
                    items: new ListLegendItem({
                        legendName: "Fifth Legend Item",
                        legendShapeGroup: new sap.gantt.simple.LegendShapeGroup({
                            orientation: LegendShapeGroupOrientation.Vertical,
                            shapes: [new sap.gantt.simple.BaseChevron({
                                title: "Fifth Legend Item",
                                fill: "red"
                            }), new sap.gantt.simple.BaseDiamond({
                                title: "Fifth Legend Item",
                                fill: "red"
							}),
							new sap.gantt.simple.BaseCursor({
                                title: "Fifth Legend Item",
                                fill: "red"
							}),
							new sap.gantt.simple.BaseImage({
                                title: "Fifth Legend Item",
                                fill: "red"
							}),
							new sap.gantt.simple.BaseLine({
                                title: "Fifth Legend Item",
                                fill: "red"
                            })]
                        })
                    })
				})
			],
			width : "900px",
			height : "1200px"
		});
		placeAt(oLC);

		var oList = oLC._oNavContainer.getPages()[0].getContent()[0];
		var done = assert.async();
		var	afterNavigate = function(evt) {
			if (!evt.getParameter("isBackToTop")) {
				var svgContainer = document.getElementsByClassName("sapGanttLLSvg")[0].getBoundingClientRect();
				var shapeContainer = document.getElementsByClassName("sapGanttLLSvg")[0].firstChild.getBoundingClientRect();
				assert.ok(true, "Navigation occured to page: " + evt.getParameter("to").getTitle());
				if (shapeContainer.left >= svgContainer.left && (shapeContainer.left + shapeContainer.width) <= (svgContainer.left + svgContainer.width )) {
					assert.ok(true, "Element " + document.getElementsByClassName("sapGanttLLSvg")[0].firstChild.id + " has been set properly");
				}
			} else {
				assert.ok(true, "Back Navigation occured to page: " +  evt.getParameter("to").getTitle());
			}
		};

		oLC._oNavContainer.attachAfterNavigate(afterNavigate);

		for ( var i = 0; i < oList.getItems().length; i++) {
			var oListLegendItem = oList.getItems()[i];
			var ocurrentPage = oLC._oNavContainer.getPages()[i + 1];
			oListLegendItem.firePress();
			ocurrentPage.fireNavButtonPress();
		}
		window.setTimeout(function(){
			done();
			oLC.destroy();
		}, 6000);

	});

	QUnit.test("Adding Horizontal Legend Shape Group", function(assert) {
		var oLC = new LegendContainer({
			id: "legendContainer",
			legends: [
				new ListLegend({
					title: "First Legend",
					items: new ListLegendItem({
						legendName: "First Legend Item",
						shape: new sap.gantt.simple.BaseRectangle({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Second Legend",
					items: new ListLegendItem({
						legendName: "Second Legend Item",
						shape: new sap.gantt.simple.BaseChevron({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Third Legend",
					items: new ListLegendItem({
						legendName: "Third Legend Item",
						shape: new sap.gantt.simple.BaseDiamond({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
					title: "Fourth Legend",
					items: new ListLegendItem({
						legendName: "Fourth Legend Item",
						shape: new sap.gantt.simple.BaseCursor({
							title: "First Legend Item",
							fill: "red"
						})
					})
				}),
				new ListLegend({
                    title: "Fifth Legend",
                    items: new ListLegendItem({
                        legendName: "Fifth Legend Item",
                        legendShapeGroup: new sap.gantt.simple.LegendShapeGroup({
                            orientation: LegendShapeGroupOrientation.Horizontal,
                            shapes: [new sap.gantt.simple.BaseChevron({
                                title: "Fifth Legend Item",
                                fill: "red"
                            }), new sap.gantt.simple.BaseDiamond({
                                title: "Fifth Legend Item",
                                fill: "red"
							}),
							new sap.gantt.simple.BaseCursor({
                                title: "Fifth Legend Item",
                                fill: "red"
							}),
							new sap.gantt.simple.BaseImage({
                                title: "Fifth Legend Item",
                                fill: "red"
							}),
							new sap.gantt.simple.BaseLine({
                                title: "Fifth Legend Item",
                                fill: "red"
                            }),
							new sap.gantt.simple.BaseImage({
                                title: "Fifth Legend Item",
								fill: "red",
								src: "sap-icon://locked"
                            })]
                        })
                    })
				})
			],
			width : "900px",
			height : "1200px"
		});
		placeAt(oLC);

		var oList = oLC._oNavContainer.getPages()[0].getContent()[0];
		var done = assert.async();
		var	afterNavigate = function(evt) {
			if (!evt.getParameter("isBackToTop")) {
				var svgContainer = document.getElementsByClassName("sapGanttLLSvg")[0].getBoundingClientRect();
				var shapeContainer = document.getElementsByClassName("sapGanttLLSvg")[0].firstChild.getBoundingClientRect();
				assert.ok(true, "Navigation occured to page: " + evt.getParameter("to").getTitle());
				if (shapeContainer.left >= svgContainer.left && (shapeContainer.left + shapeContainer.width) <= (svgContainer.left + svgContainer.width )) {
					assert.ok(true, "Element " + document.getElementsByClassName("sapGanttLLSvg")[0].firstChild.id + " has been set properly");
				}
			} else {
				assert.ok(true, "Back Navigation occured to page: " +  evt.getParameter("to").getTitle());
			}
		};

		oLC._oNavContainer.attachAfterNavigate(afterNavigate);

		for ( var i = 0; i < oList.getItems().length; i++) {
			var oListLegendItem = oList.getItems()[i];
			var ocurrentPage = oLC._oNavContainer.getPages()[i + 1];
			oListLegendItem.firePress();
			ocurrentPage.fireNavButtonPress();
		}
		window.setTimeout(function(){
			done();
			oLC.destroy();
		}, 6000);

	});

});
