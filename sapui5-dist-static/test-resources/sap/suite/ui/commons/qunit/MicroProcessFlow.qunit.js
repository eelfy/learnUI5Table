sap.ui.define([
	"sap/suite/ui/commons/MicroProcessFlow",
	"sap/suite/ui/commons/MicroProcessFlowItem",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/microchart/RadialMicroChart",
	'sap/ui/core/ValueState',
	"sap/m/Table",
	"sap/m/Column",
	"sap/m/Text",
	"sap/m/ColumnListItem",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement"
], function (MicroProcessFlow, MicroProcessFlowItem, createAndAppendDiv, RadialMicroChart, ValueState, Table, Column, Text, ColumnListItem, SmartForm, Group, GroupElement) {

	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");
	var styleElement = document.createElement("style");
	styleElement.textContent =
		"html, body {" +
		"       height: 100%;" +
		"}";
	document.head.appendChild(styleElement);
	createAndAppendDiv("qunit");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%;");

	QUnit.module("Micro Process Flow", {
	});

	QUnit.test("Micro process flow is rendered", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(4, oMicroProcessFlow.$("scrolling").children().length, "Correct number of children rendered");
		assert.equal(3, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparator").length, "Correct number of separators rendered");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process flow render types", function (assert) {
		// For scrolling type
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowLeftScroller").length, "Correct number of left scroller");
		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller").length, "Correct number of right scroller");

		// For scrolling with resize type
		oMicroProcessFlow.setRenderType("ScrollingWithResizer");
		sap.ui.getCore().applyChanges();
		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowLeftScroller").length, "Correct number of left scroller for resize");
		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller").length, "Correct number of right scroller for resize");

		// For wrap type
		oMicroProcessFlow.setRenderType("Wrap");
		sap.ui.getCore().applyChanges();
		assert.equal(1, oMicroProcessFlow.$().find("[style='flex-wrap: wrap;']").length, "Correct rednder type wrap");

		// For no wrap type
		oMicroProcessFlow.setRenderType("NoWrap");
		sap.ui.getCore().applyChanges();
		assert.equal(0, oMicroProcessFlow.$().find("[style='flex-wrap: wrap;']").length, "Correct rednder type no wrap");

		//for setting ariaLabel
		oMicroProcessFlow.setAriaLabel("test ariaLabel");
		sap.ui.getCore().applyChanges();
		var slabel = oMicroProcessFlow.getAriaLabel();
		assert.equal(slabel,"test ariaLabel", "ok");

		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process flow DOM", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(4, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowContent .sapSuiteUiCommonsMicroProcessFlowScrolling").children().length, "Correct number of div");
		assert.equal(4, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowContent .sapSuiteUiCommonsMicroProcessFlowScrolling .sapSuiteUiCommonsMicroProcessFlowItemWrapper").length, "Correct nesting of micro process flow items");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process flow separator", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showSeparator: false
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(0, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparator:visible").length, "Correct number of separators rendered");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process intermediary", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showIntermediary: true
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemIntermediary").length, "Correct number of intermediary");
		oMicroProcessFlow.destroy();
	});


	QUnit.test("Micro process custom intermediary", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				showIntermediary: true,
				intermediary: [
					new sap.ui.core.Icon({
						src: "sap-icon://account"
					})
				]
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(1, oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowItemIntermediary span").length, "Correct number of custom intermediary");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process default icons check", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [
				new MicroProcessFlowItem({
					state: ValueState.Information
				}),
				new MicroProcessFlowItem({
					state: ValueState.Success
				}),
				new MicroProcessFlowItem({
					state: ValueState.Error
				}),
				new MicroProcessFlowItem({
					state: ValueState.Warning
				}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(oMicroProcessFlow.getContent()[0]._getIconByState(), "sap-icon://message-information", "Information icon is Updated");
		assert.equal(oMicroProcessFlow.getContent()[1]._getIconByState(), "sap-icon://message-success", "Success icon is Updated");
		assert.equal(oMicroProcessFlow.getContent()[2]._getIconByState(), "sap-icon://message-error", "Error icon is Updated");
		assert.equal(oMicroProcessFlow.getContent()[3]._getIconByState(), "sap-icon://message-warning", "Warning icon is Updated");

	});

	QUnit.test("Micro process state property", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				state: ValueState.Information
			}), new MicroProcessFlowItem({
				state: ValueState.Good
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		assert.equal(ValueState.Information, oMicroProcessFlow.getContent()[0].getState(), "Information state mapped");
		assert.equal(ValueState.Good, oMicroProcessFlow.getContent()[1].getState(), "Good state mapped");

		oMicroProcessFlow.getContent()[0].setState(ValueState.Good);
		oMicroProcessFlow.getContent()[1].setState(ValueState.Information);

		sap.ui.getCore().applyChanges();

		assert.equal(ValueState.Good, oMicroProcessFlow.getContent()[0].getState(), "Good state mapped");
		assert.equal(ValueState.Information, oMicroProcessFlow.getContent()[1].getState(), "Information state mapped");

		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process step width", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				stepWidth: "300px"
			}), new MicroProcessFlowItem({
				stepWidth: "100%"
			}), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		var iMaxHeight = oMicroProcessFlow._getMaxHeight();

		assert.equal(300, oMicroProcessFlow.getContent()[0].$().find(".sapSuiteUiCommonsMicroProcessFlowItemSeparatorWrapper").width(), "Correct fix width");
		assert.equal(oMicroProcessFlow.getContent()[1].$("separator").width(), iMaxHeight, "Correct percentage width");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process custom control", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				customControl: new sap.suite.ui.microchart.RadialMicroChart("graphCustomItem", {
					size: "M",
					percentage: "45"
				})
			}), new MicroProcessFlowItem()
			]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(1, oMicroProcessFlow.$().find("#graphCustomItem").length, "Custom item");
		oMicroProcessFlow.destroy();

	});

	QUnit.test("Micro process press", function (assert) {
		var oEvent = {
			preventDefault: function () { },
			stopPropagation: function () { }
		};
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				press: function () {
					assert.ok("pressed");
				}
			})
			]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();

		oMicroProcessFlow.getContent()[0]._click(oEvent);
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process accessibility", function (assert) {
		var TITLE = "testtitle";
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem({
				title: TITLE,
				customControl: new RadialMicroChart("graphCustomItem", {
					size: "M",
					percentage: "45"
				})
			}), new MicroProcessFlowItem({
				title: TITLE
			})
			]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();
		assert.equal(oMicroProcessFlow.$().attr("aria-roledescription"), oResourceBundle.getText("ACC_CTR_TYPE_MICRO_PROCESS_FLOW"), "MicroProcessFlow aria-roledescription was rendered successfully");
		oMicroProcessFlow.getContent().forEach(function (oItem) {
			var sItem = oItem.$("item").attr("aria-label") || "",
				sItemContent = oItem.$("itemContent").attr("aria-label") || "",
				bTitle = sItem.indexOf(TITLE) !== -1 || sItemContent.indexOf(TITLE) !== -1;

			assert.equal(true, bTitle, "Title match");
		});
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Micro process flow scroll event", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			renderType: "Scrolling",
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(),
			new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});

		var oItem = new ColumnListItem({
			press: [function (oEvent) {
				assert.notOk("pressed");
			}],
			type: "Navigation",
			cells: [oMicroProcessFlow]
		});

		var oTable = new Table({
			width: "100px",
			columns: [new Column({
				header: [new Text({
					text: "Items"
				})]
			})],
			items: [oItem]
		});
		var oSpy1 = sinon.spy(oItem, "firePress");
		var oSpy2 = sinon.spy(oMicroProcessFlow, "_scroll");
		oTable.placeAt("content");
		sap.ui.getCore().applyChanges();

		oMicroProcessFlow.$().find(".sapSuiteUiCommonsMicroProcessFlowRightScroller").click();
		assert.equal(oSpy2.calledOnce, true, "Scroll event is triggered from MicroProcessFlow");
		assert.equal(oSpy1.calledOnce, false, "Parent event is not triggered from scroll");
		oTable.destroy();
	});

	QUnit.test("Micro process flow Item Role", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();
		for (var i = 0; i < oMicroProcessFlow.getContent().length; i++) {
			assert.equal(oMicroProcessFlow.getContent()[i].getDomRef("itemContent").getAttribute("role"), "option", "role=option should be present");
		}

		oMicroProcessFlow.destroy();
	});


	QUnit.test("Exit destroys scroller instance", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.setRenderType("Scrolling");
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();
		sinon.stub(oMicroProcessFlow._oLeftScroller, "destroy");
		sinon.stub(oMicroProcessFlow._oRightScroller, "destroy");
		oMicroProcessFlow.exit();
		assert.ok(oMicroProcessFlow._oLeftScroller.destroy.calledOnce);
		assert.ok(oMicroProcessFlow._oRightScroller.destroy.calledOnce);
	});
	QUnit.test("get accessibility info returns an object", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		oMicroProcessFlow.placeAt("content");
		sap.ui.getCore().applyChanges();
		var oInfo = oMicroProcessFlow.getAccessibilityInfo();
		assert.ok(!!oInfo, "getAccessibilityInfo returns a info object");
		oMicroProcessFlow.destroy();
	});

	QUnit.test("Rendering inside a Smart Form", function (assert) {
		var oMicroProcessFlow = new MicroProcessFlow({
			content: [new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem(), new MicroProcessFlowItem()]
		});
		var oSmartForm = new SmartForm("smartForm1", {
			groups: [
				new Group({
					groupElements: [
						new GroupElement({
							elements: [oMicroProcessFlow]
						})
					]
				})
			]
		});
		oSmartForm.placeAt("content");
		sap.ui.getCore().applyChanges();

		var oSmartFormRef = sap.ui.getCore().byId("smartForm1").getDomRef();
		var oMicroProcessFlowParent = oMicroProcessFlow.getParent().getParent().getParent().getParent();

		assert.ok(oMicroProcessFlowParent.getDomRef() == oSmartFormRef, "MicroProcessFlow is rendered inside SmartForm");
		assert.ok(oMicroProcessFlow.getFormDoNotAdjustWidth(), "MicroProcessFlow is not stretched for SmartForm");
		oSmartForm.destroy();
	});
});
