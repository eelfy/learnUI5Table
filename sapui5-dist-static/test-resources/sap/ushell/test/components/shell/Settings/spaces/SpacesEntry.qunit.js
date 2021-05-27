// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/base/Log",
    "sap/ushell/components/shell/Settings/spaces/SpacesEntry",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (Log, SpacesEntry, Config, resources) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("getEntry:");

    QUnit.test("Check if the correct entry settings are applied", function (assert) {
        // Act
        var oSpacesEntry = SpacesEntry.getEntry();

        // Assert
        assert.strictEqual(oSpacesEntry.entryHelpID, "spaces", "entryHelpID is correct");
        assert.strictEqual(oSpacesEntry.title, resources.i18n.getText("spaces"), "title is correct");
        assert.strictEqual(oSpacesEntry.valueResult, null, "valueResult is null");
        assert.strictEqual(oSpacesEntry.contentResult, null, "contentResult is null");
        assert.strictEqual(oSpacesEntry.icon, "sap-icon://home", "icon is correct");
        assert.strictEqual(oSpacesEntry.provideEmptyWrapper, false, "provideEmptyWrapper is false");
        assert.strictEqual(oSpacesEntry.valueArgument, null, "valueArgument is null");
        assert.strictEqual(typeof oSpacesEntry.contentFunc, "function", "contentFunc is function");
        assert.strictEqual(typeof oSpacesEntry.onSave, "function", "onSave is function");
        assert.strictEqual(typeof oSpacesEntry.onCancel, "function", "onCancel is function");
    });

    QUnit.module("contentFunc:", {
        beforeEach: function () {
            this.oSpacesEntry = SpacesEntry.getEntry();
        },
        afterEach: function () {
            Config._reset();
        }
    });

    QUnit.test("Check if the view is correct if spaces is disabeled", function (assert) {
        // Arrange
        var bExpectedCheckboxSelected = false,
            fnDone = assert.async();

        Config.emit("/core/spaces/enabled", false);

        // Act
        this.oSpacesEntry.contentFunc().then(function (oView) {

            // Assert
            var aContent = oView.getContent();
            assert.strictEqual(aContent.length, 1, "The view has exactly one control in the content aggregation.");
            assert.ok(aContent[0].isA("sap.m.VBox"), "The control in the content aggregation is a VBox.");
            assert.ok(aContent[0].hasStyleClass("sapUiSmallMargin"), "The VBox has the class \"sapUiSmallMargin\".");
            var aItems = aContent[0].getItems();
            assert.strictEqual(aItems.length, 2, "The VBox has exactly 2 controls in the item aggregation.");
            assert.ok(aItems[0].isA("sap.m.CheckBox"), "The first control in the item aggregation is a CheckBox.");
            assert.ok(aItems[1].isA("sap.m.VBox"), "The second control in the item aggregation is a Vbox.");
            assert.strictEqual(aItems[0].getText(), resources.i18n.getText("spacesModeLabel"),
                "The CheckBox has the correct text.");
            assert.strictEqual(aItems[0].getSelected(), bExpectedCheckboxSelected, "The CheckBox is not selected.");
            assert.ok(aItems[1].hasStyleClass("sapUshellFlpSettingsDescriptionBorder"),
                "The inner VBox has the class \"sapUshellFlpSettingsDescriptionBorder\".");
            var aInnerVBoxItems = aItems[1].getItems();
            assert.strictEqual(aInnerVBoxItems.length, 1, "The inner VBox has exactly 1 control in the item aggregation.");
            assert.ok(aInnerVBoxItems[0].isA("sap.m.Text"), "The control in the item aggregation is a Text.");
            assert.ok(aInnerVBoxItems[0].hasStyleClass("sapUshellFlpSettingsDescription"),
                "The Text has the class \"sapUshellFlpSettingsDescription\".");
            assert.strictEqual(aInnerVBoxItems[0].getText(), resources.i18n.getText("spacesModeDescriptionText"),
                "The Text has the correct text.");

            // Clean - up
            oView.destroy();
            fnDone();
        });
    });

    QUnit.test("Check if the view is correct if spaces is enabled", function (assert) {
        // Arrange
        var bExpectedCheckboxSelected = true,
            fnDone = assert.async();

        Config.emit("/core/spaces/enabled", true);

        // Act
        this.oSpacesEntry.contentFunc().then(function (oView) {

            // Assert
            var aContent = oView.getContent();
            assert.strictEqual(aContent.length, 1, "The view has exactly one control in the content aggregation.");
            assert.ok(aContent[0].isA("sap.m.VBox"), "The control in the content aggregation is a VBox.");
            assert.ok(aContent[0].hasStyleClass("sapUiSmallMargin"), "The VBox has the class \"sapUiSmallMargin\".");
            var aItems = aContent[0].getItems();
            assert.strictEqual(aItems.length, 2, "The VBox has exactly 2 controls in the item aggregation.");
            assert.ok(aItems[0].isA("sap.m.CheckBox"), "The first control in the item aggregation is a CheckBox.");
            assert.ok(aItems[1].isA("sap.m.VBox"), "The second control in the item aggregation is a Vbox.");
            assert.strictEqual(aItems[0].getText(), resources.i18n.getText("spacesModeLabel"),
                "The CheckBox has the correct text.");
            assert.strictEqual(aItems[0].getSelected(), bExpectedCheckboxSelected, "The CheckBox is not selected.");
            assert.ok(aItems[1].hasStyleClass("sapUshellFlpSettingsDescriptionBorder"),
                "The inner VBox has the class \"sapUshellFlpSettingsDescriptionBorder\".");
            var aInnerVBoxItems = aItems[1].getItems();
            assert.strictEqual(aInnerVBoxItems.length, 1,
                "The inner VBox has exactly 1 control in the item aggregation.");
            assert.ok(aInnerVBoxItems[0].isA("sap.m.Text"), "The control in the item aggregation is a Text.");
            assert.ok(aInnerVBoxItems[0].hasStyleClass("sapUshellFlpSettingsDescription"),
                "The Text has the class \"sapUshellFlpSettingsDescription\".");
            assert.strictEqual(aInnerVBoxItems[0].getText(),
                resources.i18n.getText("spacesModeDescriptionText"),
                "The Text has the correct text.");

            // Clean - up
            oView.destroy();
            fnDone();
        });
    });

    QUnit.module("onSave:", {
        beforeEach: function () {
            this.oSpacesEntry = SpacesEntry.getEntry();
            this.oLogWarningSpy = sinon.spy(Log, "warning");
            this.oSetChangedPropertiesStub = sinon.stub();
            this.oResetChangedPropertyStub = sinon.stub();

        },
        afterEach: function () {
            delete sap.ushell.Container;
            Config._reset();
            this.oLogWarningSpy.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the view was not created yet", function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oSpacesEntry.onSave().then(function () {

            // Assert
            assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");

            // Clean - up
            fnDone();
        }.bind(this));
    });

    QUnit.test("Check that no warning is put into the Log if the view was already created", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oSpacesEntry.contentFunc().then(function (oView) {

            // Act
            this.oSpacesEntry.onSave().then(function () {

                // Assert
                assert.strictEqual(this.oLogWarningSpy.callCount, 0, "No warning was written into the Log.");

                // Clean - up
                oView.destroy();
                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("Check that the setting stays changed if it was changed.", function (assert) {
        // Arrange
        Config.emit("/core/spaces/enabled", false);

        sap.ushell.Container = {
            getServiceAsync: sinon.stub().returns(Promise.resolve({
                getUser: sinon.stub().returns({
                    setChangedProperties: this.oSetChangedPropertiesStub,
                    resetChangedProperty: this.oResetChangedPropertyStub
                }),
                updateUserPreferences: sinon.stub().returns(jQuery.Deferred().resolve({}))
            }))
        };

        var aExpectedChangedPropertiesSet = [
                {
                    "name": "SPACES_ENABLEMENT",
                    "propertyName": "spacesEnabled"
                },
                false,
                true
            ],
            fnDone = assert.async();

        this.oSpacesEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getItems()[0].setSelected(true);

            // Act
            this.oSpacesEntry.onSave().then(function (oResult) {

                // Assert
                assert.strictEqual(oView.getContent()[0].getItems()[0].getSelected(), true,
                    "Checkbox is still selected.");
                assert.strictEqual(this.oSetChangedPropertiesStub.callCount, 1,
                    "The function setChangedProperties was called exactly once.");
                assert.deepEqual(this.oSetChangedPropertiesStub.args[0], aExpectedChangedPropertiesSet,
                    "The parameters of the setChangedProperties call are correct.");
                assert.strictEqual(this.oResetChangedPropertyStub.callCount, 1,
                    "The function resetChangedProperty was called exactly once.");
                assert.deepEqual(this.oResetChangedPropertyStub.args[0], ["spacesEnabled"],
                    "The parameter of the resetChangedProperty call is correct.");
                assert.ok(oResult.refresh, "The resolved promise has the refresh flag set to true.");

                // Clean - up
                oView.destroy();
                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("Check that the setting stays changed if it was changed.", function (assert) {
        // Arrange
        Config.emit("/core/spaces/enabled", false);

        sap.ushell.Container = {
            getServiceAsync: sinon.stub().returns(Promise.resolve({
                getUser: sinon.stub().returns({
                    setChangedProperties: this.oSetChangedPropertiesStub,
                    resetChangedProperty: this.oResetChangedPropertyStub
                }),
                updateUserPreferences: sinon.stub().returns(jQuery.Deferred().reject({}))
            }))
        };

        var aExpectedChangedPropertiesSet = [
                {
                    "name": "SPACES_ENABLEMENT",
                    "propertyName": "spacesEnabled"
                },
                false,
                true
            ],
            fnDone = assert.async();

        this.oSpacesEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getItems()[0].setSelected(true);

            // Act
            this.oSpacesEntry.onSave().catch(function () {

                // Assert
                assert.strictEqual(oView.getContent()[0].getItems()[0].getSelected(), false, "Checkbox is still selected.");
                assert.strictEqual(this.oSetChangedPropertiesStub.callCount, 1,
                    "The function setChangedProperties was called exactly once.");
                assert.deepEqual(this.oSetChangedPropertiesStub.args[0], aExpectedChangedPropertiesSet,
                    "The parameters of the setChangedProperties call are correct.");
                assert.strictEqual(this.oResetChangedPropertyStub.callCount, 1,
                    "The function resetChangedProperty was called exactly once.");
                assert.deepEqual(this.oResetChangedPropertyStub.args[0], ["spacesEnabled"],
                    "The parameter of the resetChangedProperty call is correct.");

                // Clean - up
                oView.destroy();
                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.module("onCancel:", {
        beforeEach: function () {
            this.oSpacesEntry = SpacesEntry.getEntry();
            this.oLogWarningSpy = sinon.spy(Log, "warning");
        },
        afterEach: function () {
            Config._reset();
            this.oLogWarningSpy.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the View was not created yet", function (assert) {
        // Act
        this.oSpacesEntry.onCancel();

        // Assert
        assert.strictEqual(this.oLogWarningSpy.callCount, 1, "Exactly one warning was written into the Log.");
    });

    QUnit.test("Check that no warning is put into the Log if the View was already created", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oSpacesEntry.contentFunc().then(function (oView) {

            // Act
            this.oSpacesEntry.onCancel();

            // Assert
            assert.strictEqual(this.oLogWarningSpy.callCount, 0, "No warning was written into the Log.");

            // Clean - up
            oView.destroy();
            fnDone();
        }.bind(this));
    });

    QUnit.test("Check that the checkbox is reset when spaces is enabled", function (assert) {
        // Arrange
        Config.emit("/core/spaces/enabled", false);
        var fnDone = assert.async();
        this.oSpacesEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getItems()[0].setSelected(true);

            // Act
            this.oSpacesEntry.onCancel();

            // Assert
            assert.strictEqual(oView.getContent()[0].getItems()[0].getSelected(), false, "Checkbox is no longer selected.");

            // Clean - up
            oView.destroy();
            fnDone();
        }.bind(this));
    });

    QUnit.test("Check that the checkbox is reset when spaces is disabled", function (assert) {
        // Arrange
        Config.emit("/core/spaces/enabled", true);
        var fnDone = assert.async();
        this.oSpacesEntry.contentFunc().then(function (oView) {
            oView.getContent()[0].getItems()[0].setSelected(false);

            // Act
            this.oSpacesEntry.onCancel();

            // Assert
            assert.strictEqual(oView.getContent()[0].getItems()[0].getSelected(), true, "Checkbox is again selected.");

            // Clean - up
            oView.destroy();
            fnDone();
        }.bind(this));
    });
});
