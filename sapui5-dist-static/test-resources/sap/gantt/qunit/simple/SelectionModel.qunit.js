/*global QUnit,sinon*/
sap.ui.define(["sap/gantt/simple/SelectionModel"], function (SelectionModel) {
	"use strict";

	QUnit.module("Basic", {
		beforeEach: function () {
			this.sut = new SelectionModel(sap.gantt.SelectionMode.Multiple);
			this.sutDefault = new SelectionModel();
		},
		afterEach: function () {
			this.sut.destroy();
			this.sutDefault.destroy();
		}
	});

	QUnit.test("Selection mode getter and setter", function (assert) {
		//Assert
		assert.strictEqual(this.sutDefault.getSelectionMode(), sap.gantt.SelectionMode.Single, "Default shape selection mode.");

		assert.strictEqual(this.sut.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "Configured shape selection mode.");

		//Act
		this.sut.setSelectionMode();
		//Assert
		assert.strictEqual(this.sut.getSelectionMode(), sap.gantt.SelectionMode.Single, "Set shape selection mode to default.");
		//Act
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		//Assert
		assert.strictEqual(this.sut.getSelectionMode(), sap.gantt.SelectionMode.Multiple, "Set shape selection mode to configured.");
	});

	QUnit.module("Selection", {
		beforeEach: function () {
			this.sut = new SelectionModel(sap.gantt.SelectionMode.Multiple);
		},
		afterEach: function () {
			this.sut.destroy();
		}
	});

	QUnit.test("Single shape selection and deselection", function (assert) {
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Default selected shapes UIDs are empty.");
		//Act
		this.sut.updateShape("Fake_shape_uid_1", {selected: true});
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);
		this.sut.updateShape("Fake_shape_uid_2", {selected: true, ctrl: true});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_1", "Add Shape uid 1.");
		assert.strictEqual(this.sut.allUid()[1], "Fake_shape_uid_2", "Add Shape uid 2.");
		assert.ok(this.sut.allUid().join("|") === "Fake_shape_uid_1|Fake_shape_uid_2", "Get all shape's uid.");
		//Act
		this.sut.updateShape("Fake_shape_uid_1", {selected: false, ctrl: true});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_2", "Remove Shape uid 1.");
		//Act
		this.sut.clear();
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Selected shapes uid is cleared.");
		//Act
		this.sut.updateShape("Fake_shape_uid_4", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_4", "Add Shape uid 4.");
		//Act
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Single);
		this.sut.updateShape("Fake_shape_uid_3", {selected: true, ctrl: false});
		//Assert
		assert.strictEqual(this.sut.allUid()[0], "Fake_shape_uid_3", "Add Shape uid in single mode.");
		assert.strictEqual(this.sut.existed("Fake_shape_uid_3"), true, "Shape uid existed.");
		//Act
		this.sut.clear(true);
		//Assert
		assert.ok(this.sut.allUid().length === 0, "Selected shapes uid is reset.");
	});

	QUnit.test("Multiple shape selection and deselection", function (assert) {
		//Assert 0
		assert.ok(this.sut.allUid().length === 0, "Default selected shapes UIDs are empty.");
		//Arrange 1
		this.sut.attachEventOnce("selectionChanged", function (oEvent) {
			//Assert 1
			assert.deepEqual(oEvent.getParameter("shapeUid"), ["Fake_shape_uid_1", "Fake_shape_uid_2", "Fake_shape_uid_3"], "Event should contain selected shape UIDs.");
			assert.deepEqual(oEvent.getParameter("deselectedUid"), [], "Event should not contain any deselected shape UIDs.");
			assert.notOk(oEvent.getParameter("silent"), "Event should not be silent when performing selection.");
		});

		//Act 1
		this.sut.updateShapes({
			"Fake_shape_uid_1": {
				selected: true
			},
			"Fake_shape_uid_2": {
				selected: true
			},
			"Fake_shape_uid_3": {
				selected: true
			}
		});

		//Arrange 2
		this.sut.attachEventOnce("selectionChanged", function (oEvent) {
			//Assert 2
			assert.deepEqual(oEvent.getParameter("shapeUid"), ["Fake_shape_uid_1"], "Event should contain all currently selected shape UIDs.");
			assert.deepEqual(oEvent.getParameter("deselectedUid"), ["Fake_shape_uid_2", "Fake_shape_uid_3"], "Event should contain deselected shape UIDs.");
			assert.notOk(oEvent.getParameter("silent"), "Event should not be silent when performing deselection.");
		});

		//Act 2
		this.sut.updateShapes({
			"Fake_shape_uid_2": {
				selected: false
			},
			"Fake_shape_uid_3": {
				selected: false
			}
		});

		//Arrange 3
		this.sut.attachEventOnce("selectionChanged", function (oEvent) {
			//Assert 3
			assert.deepEqual(oEvent.getParameter("shapeUid"), ["Fake_shape_uid_1", "Fake_shape_uid_4"], "Event should contain all currently selected shape UIDs.");
			assert.deepEqual(oEvent.getParameter("deselectedUid"), [], "Event should not contain any deselected shape UIDs.");
			assert.notOk(oEvent.getParameter("silent"), "Event should not be silent when performing deselection.");
		});

		//Act 3
		this.sut.updateShapes({
			"Fake_shape_uid_4": {
				selected: true
			}
		});

		//Arrange 4
		var oFireSelectionChangedSpy = sinon.spy(this.sut, "fireSelectionChanged");

		//Act 4
		this.sut.updateShapes();

		//Assert 4
		assert.ok(oFireSelectionChangedSpy.notCalled, "The selectionChanged event should not be called on an empty parameter.");
		assert.deepEqual(this.sut.mSelected.uid, {
			// undefined values are there because the Shape was not rendered to SVG yet
			"Fake_shape_uid_1": {
				"draggable": undefined,
				"endTime": undefined,
				"shapeUid": "Fake_shape_uid_1",
				"time": undefined
			},
			"Fake_shape_uid_4": {
				"draggable": undefined,
				"endTime": undefined,
				"shapeUid": "Fake_shape_uid_4",
				"time": undefined
			}
		}, "The state of the SelectionModel should be correct.");

		//Cleanup
		oFireSelectionChangedSpy.restore();
	});

	QUnit.module("Clear selection on empty area",{
		beforeEach: function(){
			this.sut = new SelectionModel();
		},
		afterEach: function(){
			this.sut.destroy();
		},
		assertSelectionEventFired: function(assert, oEventSpy) {
			assert.ok(oEventSpy.calledWith("selectionChanged"), "selectionChanged event fired");
		},
		assertNumberOfSelectedEquals: function(assert, iNum) {
			assert.strictEqual(this.sut.allUid().length, iNum, "The number of selected objects matched");
		}
	});

	QUnit.test("Single", function(assert){
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Single);
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");

		this.sut.updateShape("uid1", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		this.assertSelectionEventFired(assert, oSpyFireEvent);

		this.sut.updateShape(null);
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultiWithKeyboard", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboard);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		assert.ok(oSpyFireEvent.calledTwice, "fireEvent called Twice");

		this.sut.updateShape("uid3", {selected: true, ctrl: true});
		this.assertNumberOfSelectedEquals(assert, 2);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultiWithKeyboardAndLasso", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultiWithKeyboardAndLasso);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 1);
		assert.ok(oSpyFireEvent.calledTwice, "fireEvent called Twice");

		this.sut.updateShape("uid3", {selected: true, ctrl: true});
		this.assertNumberOfSelectedEquals(assert, 2);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Multiple", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Multiple);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.sut.updateShape("uid3", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 3);

		this.sut.updateShape("uid1", {selected: false});
		this.assertNumberOfSelectedEquals(assert, 2);

		this.sut.updateShape(null);

		// clear all selections
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("MultipleWithLasso", function(assert){
		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.MultipleWithLasso);

		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape("uid2", {selected: true});
		this.sut.updateShape("uid3", {selected: true});
		this.assertNumberOfSelectedEquals(assert, 3);

		this.sut.updateShape("uid1", {selected: false});
		this.assertNumberOfSelectedEquals(assert, 2);

		this.sut.updateShape(null);

		// clear all selections
		this.assertNumberOfSelectedEquals(assert, 0);
		this.assertSelectionEventFired(assert, oSpyFireEvent);
	});

	QUnit.test("Misc", function(assert){
		this.sut.setSelectionMode(sap.gantt.SelectionMode.Multiple);
		this.sut.updateShape("uid1", {selected: true});
		this.sut.updateShape(); // passing undefined also clear selection
		this.assertNumberOfSelectedEquals(assert, 0);

		var oSpyFireEvent = this.spy(this.sut, "fireEvent");
		this.sut.setSelectionMode(sap.gantt.SelectionMode.None);
		this.sut.updateShape("uid1", {selected: true});
		// None selection mode do nothing here
		this.assertNumberOfSelectedEquals(assert, 0);
		assert.ok(oSpyFireEvent.notCalled, "None selectionMode shouldn't fire any event");
	});
});
