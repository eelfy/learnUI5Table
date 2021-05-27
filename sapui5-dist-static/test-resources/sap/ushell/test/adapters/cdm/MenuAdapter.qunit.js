// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapter.cdm.MenuAdapter
 * @version 1.88.1
 */
sap.ui.require([
    "sap/ushell/adapters/cdm/MenuAdapter"
], function (MenuAdapter) {
    "use strict";
    /* global QUnit sinon */

    QUnit.module("The function isMenuEnabled", {
        beforeEach: function () {
            this.oGetMenuEntriesStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();

            this.aMenuEntriesMock = [
                {
                    "id": "mockId",
                    "title": "mockTitle",
                    "description": "mockDescription",
                    "icon": "sap-icon://nurse",
                    "type": "IBN",
                    "target": {
                        "semanticObject": "Launchpad",
                        "action": "openFLPPage",
                        "parameters": [
                            {
                                "name": "pageId",
                                "value": "page3"
                            },
                            {
                                "name": "spaceId",
                                "value": "space03"
                            }
                        ]
                    }
                }
            ];
            this.oCdmServiceMock = {
                getMenuEntries: this.oGetMenuEntriesStub
            };

            this.oGetMenuEntriesStub.withArgs("main").resolves(this.aMenuEntriesMock);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceMock);
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oMenuAdapter = new MenuAdapter();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns true if array is not empty", function (assert) {
        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, true, "The function returns true.");
        });
    });

    QUnit.test("Returns false if array is empty", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.withArgs("main").resolves([]);
        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, false, "The function returns false.");
        });
    });

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            this.oGetMenuEntriesStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();

            this.aMenuEntriesMock = [
                {
                    "id": "mockId",
                    "title": "mockTitle",
                    "description": "mockDescription",
                    "icon": "sap-icon://nurse",
                    "type": "IBN",
                    "target": {
                        "semanticObject": "Launchpad",
                        "action": "openFLPPage",
                        "parameters": [
                            {
                                "name": "pageId",
                                "value": "page3"
                            },
                            {
                                "name": "spaceId",
                                "value": "space03"
                            }
                        ]
                    }
                }
            ];
            this.oCdmServiceMock = {
                getMenuEntries: this.oGetMenuEntriesStub
            };

            this.oGetMenuEntriesStub.withArgs("main").resolves(this.aMenuEntriesMock);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves(this.oCdmServiceMock);
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oMenuAdapter = new MenuAdapter();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns the correct menu entries", function (assert) {
        // Act
        return this.oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.strictEqual(aMenuEntries, this.aMenuEntriesMock, "The function returns the correct array of menu entries");
        }.bind(this));
    });
});