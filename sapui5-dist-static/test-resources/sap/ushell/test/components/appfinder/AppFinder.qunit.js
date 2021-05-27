// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.AppFinder
 */
sap.ui.require([
    "sap/ui/Device",
    "sap/ui/core/mvc/JSView",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/Router",
    "sap/m/Page",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Component",
    "sap/ushell/components/appfinder/VisualizationOrganizerHelper",
    "sap/ushell/components/CatalogsManager",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/EventHub",
    "sap/ushell/services/Container"
], function (
    Device,
    JSView,
    Controller,
    Router,
    Page,
    JSONModel,
    Component,
    VisualizationOrganizerHelper,
    CatalogsManager,
    HomepageManager,
    EventHub
) {
    "use strict";

    /* global QUnit, sinon */

    /**
     * Wrapper function to make ushell bootstrap a native promise instead of a jQuery.Promise.
     *
     * @returns {Promise<undefined>} A promise that is resolved once the ushell bootstrap is done.
     */
    function bootstrap () {
        return new Promise(function (resolve, reject) {
            var oBootstrapPromise = sap.ushell.bootstrap("local");

            oBootstrapPromise.then(resolve);
            oBootstrapPromise.catch(reject);
        });
    }

    var sandbox = sinon.createSandbox();

    QUnit.module("The AppFinder", {
        beforeEach: function () {
            this.oRouter = new Router();
            this.oNavToStub = sandbox.stub(this.oRouter, "navTo");

            return bootstrap()
                .then(function () {
                    return sap.ushell.Container.getServiceAsync("Personalization");
                })
                .then(function (Personalization) {
                    sandbox.stub(Personalization, "getPersonalizer").returns({
                        getPersData: sandbox.stub().returns(jQuery.Deferred().resolve("full"))
                    });

                    sap.ushell.Container.getRenderer = sandbox.stub().returns({
                        createExtendedShellState: sandbox.stub().returns(true),
                        applyExtendedShellState: sandbox.stub().returns(true)
                    });

                    this.oOwnerComponentModel = new JSONModel();
                    sandbox.stub(Component.prototype, "getModel").returns(this.oOwnerComponentModel);
                }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            EventHub._reset();
            sandbox.restore();
        }
    }, function () {
        QUnit.module("Component - View - Controller integration tests", {
            beforeEach: function () {
                return Component.create({ name: "sap.ushell.components.appfinder", componentData: {} })
                    .then(function (oComponent) {
                        // All created views are owned by this component
                        sandbox.stub(Component, "getOwnerComponentFor").returns(oComponent);

                        this.oComponent = oComponent;
                        this.oView = oComponent.getRootControl();

                        return this.oView.loaded();
                    }.bind(this))
                    .then(function () {
                        this.oController = this.oView.getController();
                    }.bind(this));
            },
            afterEach: function () {
                this.oComponent.destroy();
            }
        });

        QUnit.test("showOpenCloseSplitAppButton", function (assert) {
            // Arrange
            var bOriginalLandscape = Device.orientation.landscape;
            Device.orientation.landscape = false;

            // Act
            var bResult = this.oController._showOpenCloseSplitAppButton();

            // Assert
            assert.strictEqual(bResult, true, "Result was as expected.");

            // Cleanup
            Device.orientation.landscape = bOriginalLandscape;
        });

        QUnit.test("showOpenCloseSplitAppButton: isPhoneWidth - true", function (assert) {
            // Arrange
            this.oView.getModel().setProperty("/isPhoneWidth", true);

            // Act
            var bResult = this.oController._showOpenCloseSplitAppButton();

            // Assert
            assert.strictEqual(bResult, true, "Button is shown.");
        });

        QUnit.test("toggleView with classes tests", function (assert) {
            // Arrange
            var oShowSearchStub = sandbox.stub(this.oView, "_showSearch").returns(true);
            var oShowSeachTagStub = sandbox.stub(this.oView, "_showSearchTag").returns(false);

            // Act
            this.oController._toggleViewWithSearchAndTagsClasses();

            // Assert
            var oPage = this.oView.oPage;
            assert.ok(oPage.hasStyleClass("sapUshellAppFinderSearch"));
            assert.ok(!oPage.hasStyleClass("sapUshellAppFinderTags"));

            // Act
            this.oController._toggleViewWithToggleButtonClass(false);

            // Assert
            assert.ok(!oPage.hasStyleClass("sapUshellAppFinderToggleButton"));

            // Act
            this.oController._toggleViewWithToggleButtonClass(true);

            // Assert
            assert.ok(oPage.hasStyleClass("sapUshellAppFinderToggleButton"));

            oShowSearchStub.returns(false);
            oShowSeachTagStub.returns(true);

            // Act
            this.oController._toggleViewWithSearchAndTagsClasses();

            // Arrange
            assert.ok(!oPage.hasStyleClass("sapUshellAppFinderSearch"));
            assert.ok(oPage.hasStyleClass("sapUshellAppFinderTags"));
        });

        QUnit.test("updateSearchWithPlaceHolder String - according to menues", function (assert) {
            // Arrange
            sandbox.stub(this.oView, "_showSearch").returns(true);

            // Act
            this.oView.updateSubHeader("catalog");
            this.oView._updateSearchWithPlaceHolder("catalog");

            // Assert
            assert.strictEqual(this.oView.oAppFinderSearchControl.getPlaceholder().indexOf("Search in catalog"), 0);

            // Act
            this.oView.updateSubHeader("userMenu");
            this.oView._updateSearchWithPlaceHolder("userMenu");

            // Assert
            assert.strictEqual(this.oView.oAppFinderSearchControl.getPlaceholder().indexOf("Search in user menu"), 0);

            // Act
            this.oView.updateSubHeader("sapMenu");
            this.oView._updateSearchWithPlaceHolder("sapMenu");

            // Assert
            assert.strictEqual(this.oView.oAppFinderSearchControl.getPlaceholder().indexOf("Search in SAP menu"), 0);
        });

        QUnit.test("onShow WITHOUT systems and WITHOUT Search-Filtering, should show subHeader", function (assert) {
            // Arrange
            var done = assert.async();
            var onShowEvent = {
                getParameter: sandbox.stub().returns({
                    menu: "catalog"
                })
            };

            // Act
            this.oController.onShow(onShowEvent);

            this.oController
                .getSystemsModels()
                .done(function (userMenuSystemsModel, sapMenuSystemsModel) {
                    // Assert
                    var aUserMenuSystemsList = userMenuSystemsModel.getProperty("/systemsList");
                    assert.ok(aUserMenuSystemsList, "property \"systemsList\" exist");
                    assert.strictEqual(aUserMenuSystemsList.length, 0, "validate no systems are configured");
                    assert.ok(this.oView.oPage.getShowSubHeader(), "showSubHeader property is set to true");

                    var aSAPMenuSystemsList = sapMenuSystemsModel.getProperty("/systemsList");
                    assert.ok(aSAPMenuSystemsList, "property \"systemsList\" exist");
                    assert.strictEqual(aSAPMenuSystemsList.length, 0, "validate no systems are configured");
                    assert.ok(this.oView.oPage.getShowSubHeader(), "showSubHeader property is set to true");

                    done();
                }.bind(this));
        });

        QUnit.test("onShow WITHOUT systems and with Search-Filtering, should show subHeader", function (assert) {
            // Arrange
            var done = assert.async();

            this.oView.showSearch = true;

            // Act
            this.oController.onShow({
                getParameter: function () {
                    return { menu: "catalog" };
                }
            });

            this.oController
                .getSystemsModels()
                .done(function (userMenuSystemsModel, sapMenuSystemsModel) {
                    // Assert
                    var aUserMenuSystemsList = userMenuSystemsModel.getProperty("/systemsList");
                    assert.ok(aUserMenuSystemsList, "property \"systemsList\" exist");
                    assert.strictEqual(aUserMenuSystemsList.length, 0, "validate no systems are configured");
                    assert.ok(this.oView.oPage.getShowSubHeader(), "showSubHeader property is set to true");

                    var aSAPMenuSystemsList = sapMenuSystemsModel.getProperty("/systemsList");
                    assert.ok(aSAPMenuSystemsList, "property \"systemsList\" exist");
                    assert.strictEqual(aSAPMenuSystemsList.length, 0, "validate no systems are configured");
                    assert.ok(this.oView.oPage.getShowSubHeader(), "showSubHeader property is set to true");
                    done();
                }.bind(this));
        });

        QUnit.test("onShow with systems and WITHOUT Search-Filtering, should show subHeader", function (assert) {
            // Arrange
            var done = assert.async();
            sap.ushell.Container.getServiceAsync("ClientSideTargetResolution").then(function (clientService) {
                var getEasyAccessSystemsStub = sandbox.stub(clientService, "getEasyAccessSystems").returns(new jQuery.Deferred().resolve({
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    },

                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            WDA: true
                        }
                    }
                }));
                var onShowEvent = {
                    getParameter: sandbox.stub().returns({
                        menu: "catalog"
                    })
                };

                // Act
                this.oController.onShow(onShowEvent);

                this.oController
                    .getSystemsModels()
                    .done(function (userMenuSystemsModel, sapMenuSystemsModel) {
                        // Assert
                        var aUserMenuSystemsList = userMenuSystemsModel.getProperty("/systemsList");
                        assert.ok(aUserMenuSystemsList, "property \"systemsList\" exist");
                        assert.strictEqual(aUserMenuSystemsList.length, 2, "validate 2 systems are configured");
                        assert.ok(this.oView.oPage.getShowSubHeader(), "showSubHeader property is set to true");

                        var aSAPMenuSystemsList = sapMenuSystemsModel.getProperty("/systemsList");
                        assert.ok(aSAPMenuSystemsList, "property \"systemsList\" exist");
                        assert.strictEqual(aSAPMenuSystemsList.length, 2, "validate 2 systems are configured");
                        assert.ok(this.oView.oPage.getShowSubHeader(), "showSubHeader property is set to true");

                        getEasyAccessSystemsStub.restore();
                        done();
                    }.bind(this));
            }.bind(this));
        });

        QUnit.test("AppFinder Controller - get/set/reset Search Model & Search Handler", function (assert) {
            // Act
            delete this.oController.oSubHeaderModel;
            var oCatalogsManager = new CatalogsManager("catalogsMgr", {
                model: new JSONModel()
            });

            // Assert
            var oModel = this.oController._getSubHeaderModel();
            assert.ok(this.oController.oSubHeaderModel, "search model created on controller as a member");
            assert.ok(oModel, "search model created");
            assert.ok(!oModel.getProperty("/search/searchMode"), "search mode is false");
            assert.ok(!oModel.getProperty("/search/searchTerm"), "search term is empty");
            assert.ok(!oModel.getProperty("/activeMenu"), "active menu is not yet set");

            // Arrange
            var oEvent = {
                getSource: sandbox.stub().returns({
                    getValue: sandbox.stub().returns("newTermForSearch")
                }),
                getParameter: sandbox.stub()
            };

            // Act
            // simulate search event
            this.oController.searchHandler(oEvent);

            // Assert
            // check the search model again
            oModel = this.oController._getSubHeaderModel();
            assert.ok(oModel.getProperty("/search/searchMode"), "search mode is true");
            assert.strictEqual(oModel.getProperty("/search/searchTerm"), "newTermForSearch", "search term is upadted");

            oCatalogsManager.destroy();
        });

        QUnit.test("getSystems positive scenario(with systems), should resolve with a list of systems", function (assert) {
            // Arrange
            var done = assert.async();

            sap.ushell.Container.getServiceAsync("ClientSideTargetResolution")
                .then(function (clientService) {
                    var getEasyAccessSystemsStub = sandbox.stub(clientService, "getEasyAccessSystems").returns(new jQuery.Deferred().resolve({
                        AB1CLNT000: {
                            text: "CRM Europe",
                            appType: {
                                TR: true,
                                WDA: true
                            }
                        },

                        XY1CLNT100: {
                            text: "HR Central",
                            appType: {
                                WDA: true
                            }
                        }
                    }));

                    // Act
                    this.oController
                        .getSystems()
                        .done(function (aReturnSystems) {
                            // Assert
                            assert.deepEqual(aReturnSystems, [
                                {
                                    systemName: "CRM Europe",
                                    systemId: "AB1CLNT000"
                                },
                                {
                                    systemName: "HR Central",
                                    systemId: "XY1CLNT100"
                                }
                            ]);
                            getEasyAccessSystemsStub.restore();
                            done();
                        });
                }.bind(this));
        });

        QUnit.test("getSystems without system(empty object), should resolve with an empty list of systems", function (assert) {
            // Arrange
            var done = assert.async();

            sap.ushell.Container.getServiceAsync("ClientSideTargetResolution")
                .then(function (clientService) {
                    sandbox.stub(clientService, "getEasyAccessSystems").returns(new jQuery.Deferred().resolve({}));

                    // Act
                    this.oController
                        .getSystems()
                        .done(function (aReturnSystems) {
                            // Assert
                            assert.deepEqual(aReturnSystems, []);
                            done();
                        });
                }.bind(this));
        });

        QUnit.test("getSystems with an error, should fail", function (assert) {
            // Arrange
            var fnDone = assert.async();
            var sExpectedError = "An error occurred while retrieving the systems:";

            sap.ushell.Container.getServiceAsync("ClientSideTargetResolution")
                .then(function (CSTRService) {
                    sandbox.stub(CSTRService, "getEasyAccessSystems").returns(new jQuery.Deferred().reject("some error"));

                    // Act
                    this.oController
                        .getSystems()
                        .fail(function (error) {
                            // Assert
                            assert.equal(error.substring(0, sExpectedError.length), sExpectedError);
                            fnDone();
                        });
                }.bind(this));
        });

        QUnit.test("getSystems without clientService should reject", function (assert) {
            // Arrange
            var done = assert.async();
            var oGetServiceStub = sandbox.stub(sap.ushell.Container, "getService").returns();

            // Act
            this.oController
                .getSystems()
                .fail(function (error) {
                    // Assert
                    assert.equal(error, "cannot get ClientSideTargetResolution service");
                    oGetServiceStub.restore();
                    done();
                });
        });

        QUnit.module("AppFinder view initialization", {
            beforeEach: function () {
                this.oOriginalDeviceSystem = Device.system;
                Device.system = {
                    phone: false,
                    tablet: false,
                    combi: false
                };

                this.oGetOwnerComponentStub = sandbox.stub(Component, "getOwnerComponentFor").returns({
                    getRouter: sandbox.stub().returns(this.oRouter),
                    getModel: sandbox.stub().returns(this.oOwnerComponentModel),
                    getComponentData: function () {
                        return { config: {} };
                    }
                });

                return Controller.create({ name: "sap.ushell.components.appfinder.AppFinder" })
                    .then(function (oController) {
                        this.oController = oController;
                        this.oController.oSubHeaderModel = new JSONModel({
                            search: {
                                searchMode: true,
                                searchTerm: "for_testing"
                            }
                        });

                        this.oView = {
                            createSubHeader: function () {},
                            setModel: function () {},
                            oPage: new Page(),
                            _showOpenCloseSplitAppButton: sandbox.stub().returns(false)
                        };

                        sandbox.stub(this.oController, "getView").returns(this.oView);
                    }.bind(this));
            },
            afterEach: function () {
                Device.system = this.oOriginalDeviceSystem;

                // Must be destroyed here because the onExit hook is only invoked if the view is destroyed, not the controller.
                this.oController.oCatalogView.destroy();

                this.oView.oPage.destroy();
                this.oController.destroy();
            }
        });

        QUnit.test("enableEasyAccess: false - oView.oPage.getContent() contains catalogView", function (assert) {
            // Arrange
            // Disable easy access by turning off the options:
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", false);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", false);

            // Act
            this.oController.onInit();

            // Assert
            assert.ok(this.oView.oPage.getContent());
        });

        QUnit.test("enableEasyAccess: true - oView.oPage.getContent() is empty", function (assert) {
            // Arrange
            var oLoadPersonalizedGroupsSpy = sandbox.spy(HomepageManager.prototype, "loadPersonalizedGroups");
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", true);

            // Act
            this.oController.onInit();

            // Assert
            assert.strictEqual(this.oView.oPage.getContent().length, 0);
            assert.equal(oLoadPersonalizedGroupsSpy.callCount, 0, "Validate loadgroups are not called in case they are already loaded");
        });

        QUnit.module("Subheader buttons", {
            beforeEach: function () {
                this.createViewAndUpdate = function () {
                    return Component.create({ name: "sap.ushell.components.appfinder", componentData: {} })
                        .then(function (oComponent) {
                            this.oComponent = oComponent;

                            // All created views are owned by this component
                            sandbox.stub(Component, "getOwnerComponentFor").returns(oComponent);

                            this.oView = oComponent.getRootControl();

                            return this.oView.loaded();
                        }.bind(this))
                        .then(function () {
                            this.oController = this.oView.getController();

                            this.oController.oSubHeaderModel = new JSONModel({
                                search: {
                                    searchMode: true,
                                    searchTerm: "for_testing"
                                }
                            });

                            this.oView.updateSubHeader("", true);
                        }.bind(this));
                }.bind(this);
            },
            afterEach: function () {
                this.oComponent.destroy();
            }
        });

        QUnit.test("enableEasyAccess, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: all true - number of buttons in subHeader should be 3", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", true);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oView.oPage.getSubHeader().getContent()[1].getButtons().length, 3);
                }.bind(this));
        });

        QUnit.test("enableEasyAccess, enableEasyAccessSAPMenu: true, enableEasyAccessUserMenu: false - number of buttons in subHeader should be 2", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", false);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oView.oPage.getSubHeader().getContent()[1].getButtons().length, 2);
                }.bind(this));
        });

        QUnit.test("enableEasyAccess, enableEasyAccessUserMenu: true, enableEasyAccessSAPMenu: false - number of buttons in subHeader should be 2", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", false);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", true);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oView.oPage.getSubHeader().getContent()[1].getButtons().length, 2);
                }.bind(this));
        });

        QUnit.test("enableEasyAccess: true, enableEasyAccessUserMenu, enableEasyAccessSAPMenu: false - no subHeader", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", false);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", false);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oController.bShowEasyAccessMenu, false, "showEasyAccessMenu property is set to false - no subHeader");
                    assert.ok(this.oView.oPage.getContent());
                }.bind(this));
        });

        QUnit.test("enableEasyAccess, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: all true, on mobile system - no subHeader ", function (assert) {
            // Arrange
            sap.ui.Device.system.phone = true;
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", true);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oController.bShowEasyAccessMenu, false, "showEasyAccessMenu property is set to false");
                    assert.ok(this.oView.oPage.getContent());
                }.bind(this));
        });

        QUnit.test("enableEasyAccess, enableEasyAccessSAPMenu: true, enableEasyAccessUserMenu: false, on mobile system - no subHeader ", function (assert) {
            // Arrange
            sap.ui.Device.system.phone = true;
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", false);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oController.bShowEasyAccessMenu, false, "showEasyAccessMenu property is set to false");
                    assert.ok(this.oView.oPage.getContent());
                }.bind(this));
        });

        QUnit.test("enableEasyAccess: undefined, enableEasyAccessSAPMenu, enableEasyAccessUserMenu: true - number of buttons in subHeader should be 3", function (assert) {
            // Arrange
            sap.ui.Device.system.phone = true;
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", true);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oView.oPage.getSubHeader().getContent()[1].getButtons().length, 3);
                }.bind(this));
        });

        QUnit.test("enableEasyAccess: false, enableEasyAccessUserMenu, enableEasyAccessSAPMenu: true - no subHeader", function (assert) {
            // Arrange
            sap.ui.Device.system.phone = true;
            this.oOwnerComponentModel.setProperty("/enableEasyAccess", false);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessSAPMenu", true);
            this.oOwnerComponentModel.setProperty("/enableEasyAccessUserMenu", true);

            // Act
            return this.createViewAndUpdate()
                .then(function () {
                    // Assert
                    assert.strictEqual(this.oController.bShowEasyAccessMenu, false, "showEasyAccessMenu property is set to false");
                    assert.ok(this.oView.oPage.getContent());
                }.bind(this));
        });

        QUnit.test("getSystemsModels with systems, should return a model with 'systemsList' property that contains array of systems", function (assert) {
            var done = assert.async();

            this.createViewAndUpdate()
                .then(function () {
                    return sap.ushell.Container.getServiceAsync("ClientSideTargetResolution");
                })
                .then(function (CTSRService) {
                    var oGetEasyAccessSystemsStub = sandbox.stub(CTSRService, "getEasyAccessSystems");
                    oGetEasyAccessSystemsStub.withArgs("userMenu").returns(new jQuery.Deferred().resolve({
                        AB1CLNT000: {
                            text: "CRM Europe",
                            appType: {
                                TR: true,
                                WDA: true,
                                URL: true
                            }
                        },
                        XY1CLNT100: {
                            text: "HR Central",
                            appType: {
                                WDA: true,
                                URL: true
                            }
                        },
                        U1YCLNT000: {
                            text: "Business Objects",
                            appType: {
                                URL: true
                            }
                        }
                    }).promise());
                    oGetEasyAccessSystemsStub.withArgs("sapMenu").returns(new jQuery.Deferred().resolve({
                        AB1CLNT000: {
                            text: "CRM Europe",
                            appType: {
                                TR: true,
                                WDA: true
                            }
                        },
                        XY1CLNT100: {
                            text: "HR Central",
                            appType: {
                                WDA: true
                            }
                        }
                    }).promise());
                    oGetEasyAccessSystemsStub.returns(new jQuery.Deferred().reject("some error").promise());

                    this.oController
                        .getSystemsModels()
                        .done(function (userMenuModel, sapMenuModel) {
                            assert.strictEqual(oGetEasyAccessSystemsStub.callCount, 2, "getEasyAccessSystems was called once");
                            assert.ok(oGetEasyAccessSystemsStub.calledWith("userMenu"), "getEasyAccessSystemsStub was called with the 'userMenu' argument");
                            assert.ok(oGetEasyAccessSystemsStub.calledWith("sapMenu"), "getEasyAccessSystemsStub was called with the 'sapMenu' argument");

                            var aUserMenuSystems = userMenuModel.getProperty("/systemsList");
                            assert.ok(aUserMenuSystems, "property 'systemsList' exists in user menu model");
                            assert.deepEqual(aUserMenuSystems, [{
                                systemName: "CRM Europe",
                                systemId: "AB1CLNT000"
                            }, {
                                systemName: "HR Central",
                                systemId: "XY1CLNT100"
                            }, {
                                systemName: "Business Objects",
                                systemId: "U1YCLNT000"
                            }], "user menu system list is as expected");

                            var aSAPMenuSystems = sapMenuModel.getProperty("/systemsList");
                            assert.ok(aSAPMenuSystems, "property 'systemsList' exist in sap menu model");
                            assert.deepEqual(aSAPMenuSystems, [{
                                systemName: "CRM Europe",
                                systemId: "AB1CLNT000"
                            }, {
                                systemName: "HR Central",
                                systemId: "XY1CLNT100"
                            }], "sap menu system list is as expected");

                            done();
                        });
                }.bind(this));
        });

        QUnit.module("The function _navigateTo", {
            beforeEach: function () {
                return Component.create({ name: "sap.ushell.components.appfinder", componentData: {} })
                    .then(function (oComponent) {
                        this.oComponent = oComponent;

                        // All created views are owned by this component
                        sandbox.stub(Component, "getOwnerComponentFor").returns(oComponent);
                        sandbox.stub(oComponent, "getRouter").returns(this.oRouter);

                        var oView = oComponent.getRootControl();

                        return oView.loaded();
                    }.bind(this))
                    .then(function (oView) {
                        this.oController = oView.getController();

                        this.oController.oSubHeaderModel = new JSONModel({
                            search: {
                                searchMode: true,
                                searchTerm: "for_testing"
                            }
                        });
                    }.bind(this));
            },
            afterEach: function () {
                this.oComponent.destroy();
            }
        });

        QUnit.test("_navigateTo with group context should call navTo with filters", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/groupContext", { path: "/somePath" });

            // Act
            this.oController._navigateTo("catalog");

            // Assert
            assert.strictEqual(this.oNavToStub.callCount, 1, "The function navTo has been called once.");
            assert.deepEqual(this.oNavToStub.firstCall.args, [
                "catalog",
                {
                    filters: "{\"targetGroup\":\"%2FsomePath\"}"
                },
                true
            ], "The function navTo has been called with the correct args.");
        });

        QUnit.test("_navigateTo without group context should call navTo without filters", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/groupContext", {});

            // Act
            this.oController._navigateTo("catalog");

            // Assert
            assert.strictEqual(this.oNavToStub.callCount, 1, "The function navTo has been called once.");
            assert.deepEqual(this.oNavToStub.firstCall.args, [ "catalog", {}, true ], "The function navTo has been called with the correct args.");
        });

        QUnit.module("The function onSegmentButtonClick", {
            beforeEach: function () {
                return Controller.create({ name: "sap.ushell.components.appfinder.AppFinder" })
                    .then(function (oController) {
                        this.oController = oController;

                        oController.oSubHeaderModel = new JSONModel({
                            search: {
                                searchMode: true,
                                searchTerm: "for_testing"
                            }
                        });

                        this.oGetParameterStub = sandbox.stub();
                        this.oEvent = {
                            getParameter: this.oGetParameterStub
                        };
                        this.oNavigateToStub = sandbox.stub(oController, "_navigateTo");
                    }.bind(this));
            },
            afterEach: function () {
                this.oController.destroy();
            }
        });

        QUnit.test("onSegmentButtonClick with catalog should call _navigateTo with catalog", function (assert) {
            // Arrange
            this.oGetParameterStub.returns("catalog");

            // Act
            this.oController.onSegmentButtonClick(this.oEvent);

            // Assert
            assert.deepEqual(this.oNavigateToStub.firstCall.args, [ "catalog" ], "The function _navigateTo has been called with the correct parameters.");
        });

        QUnit.test("_updateModelWithGroupContext", function (assert) {
            var oModel = new JSONModel({
                groups: [{ title: "group1 title" }],
                groupContext: {}
            });

            var getServiceStub = sandbox.stub(sap.ushell.Container, "getService").returns({
                getGroupId: function () {
                    return "group1";
                }
            });

            this.oController._updateModelWithGroupContext.apply({ oView: {
                getModel: function () {
                    return oModel;
                }
            } }, [{ targetGroup: "/groups/0" }]);
            assert.deepEqual(oModel.getProperty("/groupContext"), { path: "/groups/0", id: "group1", title: "group1 title" });
            getServiceStub.restore();
        });

        QUnit.module("Accessibility", {
            beforeEach: function () {
                this.oOwnerComponentModel.setProperty("/enableEasyAccess", true);
                this.oOwnerComponentModel.setProperty("/groups", [ "" ]);
                this.oOwnerComponentModel.setProperty("/isPhoneWidth", false);

                return Component.create({ name: "sap.ushell.components.appfinder", componentData: {} })
                    .then(function (oComponent) {
                        this.oComponent = oComponent;

                        // All created views are owned by this component
                        sandbox.stub(Component, "getOwnerComponentFor").returns(oComponent);

                        this.oView = oComponent.getRootControl();

                        return this.oView.loaded();
                    }.bind(this))
                    .then(function () {
                        this.oController = this.oView.getController();

                        this.oController.oSubHeaderModel = new JSONModel({
                            search: {
                                searchMode: true,
                                searchTerm: "for_testing"
                            }
                        });

                        this.oView.updateSubHeader("", true);
                    }.bind(this));
            },
            afterEach: function () {
                this.oComponent.destroy();
            }
        });

        QUnit.test("SubHeader aria values are correct", function (assert) {
            // Arrange
            // Act
            this.oView.updateSubHeader("", true);

            // Assert
            var oViewPage = this.oView.getContent()[0];
            var oPageSubHeader = oViewPage.getSubHeader();

            assert.equal(oPageSubHeader.data("role"), "heading", "AppFinder sub header role is heading");
            assert.equal(oPageSubHeader.data("aria-level"), 2, "AppFinder sub header aria-level is 2");

            var aButtons = oPageSubHeader.getContent()[1].getItems();
            assert.strictEqual(aButtons.length, 1, "One button has been found.");

            var oButton = aButtons[0];
            assert.strictEqual(oButton.data("aria-controls"), oButton.getId() + "View", "The aria-controls custom data value is correct.");
        });

        QUnit.test("onShow - make sure we do not show a disabled menu", function (assert) {
            this.oController.bShowEasyAccessMenu = true;
            this.oController.bEnableEasyAccessSAPMenu = true;
            this.oController.bEnableEasyAccessUserMenu = true;
            sandbox.stub(this.oView, "_showSearch").returns(false);
            sandbox.stub(this.oView, "_showSearchTag").returns(false);

            //all is enabled
            this.oController._updateCurrentMenuName("catalog");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog'");
            this.oController._updateCurrentMenuName("sapMenu");
            assert.equal(this.oController.getCurrentMenuName(), "sapMenu", "current menu is 'sapMenu'");
            this.oController._updateCurrentMenuName("userMenu");
            assert.equal(this.oController.getCurrentMenuName(), "userMenu", "current menu is 'userMenu'");

            //sapMenu is disabled
            this.oController.bEnableEasyAccessSAPMenu = false;
            this.oController._updateCurrentMenuName("catalog");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog'");
            this.oController._updateCurrentMenuName("sapMenu");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog' as sapMenu is disabled");
            this.oController._updateCurrentMenuName("userMenu");
            assert.equal(this.oController.getCurrentMenuName(), "userMenu", "current menu is 'userMenu'");

            //userMenu is disabled
            this.oController.bEnableEasyAccessSAPMenu = true;
            this.oController.bEnableEasyAccessUserMenu = false;
            this.oController._updateCurrentMenuName("catalog");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog'");
            this.oController._updateCurrentMenuName("sapMenu");
            assert.equal(this.oController.getCurrentMenuName(), "sapMenu", "current menu is 'sapMenu'");
            this.oController._updateCurrentMenuName("userMenu");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog' as userMenu is disabled");

            //userMenu & sap menu are disabled
            this.oController.bEnableEasyAccessSAPMenu = false;
            this.oController.bEnableEasyAccessUserMenu = false;
            this.oController._updateCurrentMenuName("catalog");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog'");
            this.oController._updateCurrentMenuName("sapMenu");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog' as sapMenu is disabled");
            this.oController._updateCurrentMenuName("userMenu");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog' as userMenu is disabled");

            //userMenu & sap menu are enabled but showEasyAccessMenu is turn off
            this.oController.bShowEasyAccessMenu = false;
            this.oController.bEnableEasyAccessSAPMenu = true;
            this.oController.bEnableEasyAccessUserMenu = true;
            this.oController._updateCurrentMenuName("catalog");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog'");
            this.oController._updateCurrentMenuName("sapMenu");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog' as sapMenu is disabled");
            this.oController._updateCurrentMenuName("userMenu");
            assert.equal(this.oController.getCurrentMenuName(), "catalog", "current menu is 'catalog' as userMenu is disabled");
        });

        QUnit.test("The function containsOnlyWhiteSpace", function (assert) {
            assert.equal(this.oController.containsOnlyWhitepaces(" "), true);
            assert.equal(this.oController.containsOnlyWhitepaces("   "), true);
            assert.equal(this.oController.containsOnlyWhitepaces(" a b"), false);
            assert.equal(this.oController.containsOnlyWhitepaces(""), false);
            assert.equal(this.oController.containsOnlyWhitepaces(), false);
        });

        QUnit.test("Catalog - tag filtering - event handler - selected tags exist", function (assert) {
            // Arrange
            this.oController.currentMenu = "catalog";

            // Act
            this.oController.onTagsFilter({
                getSource: function () {
                    return {
                        getModel: sandbox.stub().returns(this.oOwnerComponentModel),
                        getSelectedItems: function () {
                            return [
                                {
                                    getText: sandbox.stub().returns("tag1")
                                }, {
                                    getText: sandbox.stub().returns("tag2")
                                }, {
                                    getText: sandbox.stub().returns("tag3")
                                }
                            ];
                        }
                    };
                }.bind(this)
            });

            // Assert
            assert.strictEqual(this.oOwnerComponentModel.getProperty("/activeMenu"), "catalog", "active menu is Catalog");
            assert.strictEqual(this.oOwnerComponentModel.getProperty("/tag").tagMode, true, "The correct tagMode has been found.");

            var aSelectedTagsKeys = this.oOwnerComponentModel.getProperty("/tag").selectedTags;

            assert.deepEqual(aSelectedTagsKeys, [ "tag1", "tag2", "tag3" ], "selected tags persisted in model successfully");
        });

        QUnit.test("Catalog - tag filtering - event handler - no selected tags", function (assert) {
            // Arrange
            this.oController.currentMenu = "catalog";

            // Act
            this.oController.onTagsFilter({
                getSource: function () {
                    return {
                        getModel: sandbox.stub().returns(this.oOwnerComponentModel),
                        getSelectedItems: function () {
                            return [];
                        }
                    };
                }.bind(this)
            });

            // Assert
            assert.strictEqual(this.oOwnerComponentModel.getProperty("/activeMenu"), "catalog", "active menu is Catalog");
            assert.strictEqual(this.oOwnerComponentModel.getProperty("/tag").tagMode, false, "The correct tagMode has been found.");
            assert.deepEqual(this.oOwnerComponentModel.getProperty("/tag").selectedTags, [], "There are no selected tags.");
        });

        QUnit.test("onSegmentButtonClick calls should clean Search field", function (assert) {
            // Arrange
            sandbox.stub(this.oController, "_navigateTo");

            // Act
            this.oController.onSegmentButtonClick({
                getParameter: function () {
                    return { id: "catalog" };
                }
            });

            // Assert
            assert.deepEqual(this.oController.oSubHeaderModel.getProperty("/search"), { searchMode: false, searchTerm: "" });
        });

        QUnit.test("Catalog - function handleSearchModelChanged invoked upon subheader model change and persists filtering data on URL", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setData({
                groups: [ "" ],
                dummy: {},
                tag: {
                    tagMode: false,
                    selectedTags: []
                },
                search: {
                    searchMode: false,
                    searchTerm: ""
                }
            });

            var oCatalogView = this.oController.oCatalogView;
            var oCatalogViewController = oCatalogView.getController();
            var oSubHeaderModel = this.oView.getModel("subHeaderModel");

            // Check the scenario of entering search/tag mode when not in catalog view.
            var oRestoreSelectedMasterItemSpy = sandbox.spy(oCatalogViewController, "_restoreSelectedMasterItem");
            this.oController.currentMenu = "catalog";
            oSubHeaderModel.setProperty("/tag/tagMode", true);
            assert.strictEqual(oRestoreSelectedMasterItemSpy.callCount, 0, "current appFinder view isn't 'catalog' - selected master item restored");

            // Check category filter selection upon entering search/tag mode when the appfinder is in Catalog view
            oSubHeaderModel.setProperty("/activeMenu", "catalogView");
            var oSetCategoryFilterSpy = sandbox.spy(oCatalogViewController, "setCategoryFilter");
            oSubHeaderModel.setProperty("/tag/tagMode", false);
            assert.strictEqual(oSetCategoryFilterSpy.callCount, 0, "category filter is set when in search/tag mode");

            // Check the scenario in which tag active mode was changed but the selected tags remained the same.
            var oSetCategoryFilterSelectionSpy = sandbox.spy(oCatalogView, "setCategoryFilterSelection");
            var oIsTagFilteringChangedStub = sandbox.stub(oCatalogViewController, "_isTagFilteringChanged");
            oIsTagFilteringChangedStub.returns(false);

            var oSetUrlWithTagsAndSearchTermStub = sandbox.stub(oCatalogViewController, "_setUrlWithTagsAndSearchTerm");
            oSubHeaderModel.setProperty("/tag/tagMode", true);

            assert.strictEqual(oSetCategoryFilterSelectionSpy.callCount, 0, "category selection is not called");
            assert.strictEqual(oIsTagFilteringChangedStub.callCount, 0, "tagFilteringChanged is not called");
            assert.strictEqual(oSetUrlWithTagsAndSearchTermStub.callCount, 0, "tags filtering data shouldn't be persisted on url because selected tags weren't changed");

            // Check the scenario in which tag active mode == true and the selected tags were changed.
            oIsTagFilteringChangedStub.returns(true);
            oSubHeaderModel.setProperty("/tag/selectedTags", ["tag1", "tag2"]);
            assert.strictEqual(oSetUrlWithTagsAndSearchTermStub.callCount, 0, "tags filtering data should be persisted on url because selected tags were changed");
        });

        QUnit.test("onShow publish 'contentRendered'", function (assert) {
            // Arrange
            var oPublishEventSpy = sandbox.spy(EventHub, "emit");
            sandbox.stub(this.oController, "_preloadAppHandler").returns({});

            // Act
            this.oController._handleAppFinderNavigation({
                getParameter: function () {
                    return { menu: "catalog" };
                }
            });

            // Assert
            assert.deepEqual(oPublishEventSpy.firstCall.args, [ "CenterViewPointContentRendered", "appFinder" ], "The emit function has been called with the correct arguments.");
        });

        QUnit.test("Catalog - show no apps message when to catalogs are loaded", function (assert) {
            // Arrange
            this.oOwnerComponentModel.setProperty("/catalogs", []);

            var oAppFinderController = this.oView.getController();
            var oCatalogView = oAppFinderController.oCatalogView;
            var oSubHeaderModel = this.oView.getModel("subHeaderModel");
            oSubHeaderModel.setProperty("/activeMenu", "catalogView");

            var oCalculateDetailPageIdItemSpy = sandbox.spy(oCatalogView, "_calculateDetailPageId");

            // Act
            oCatalogView.getController().handleSearchModelChanged();

            // Assert
            assert.strictEqual(oCalculateDetailPageIdItemSpy.callCount, 1, "_calculateDetailPageId is called once");
            assert.strictEqual(oCalculateDetailPageIdItemSpy.firstCall.returnValue, "catalogTilesDetailedPage", "Catalog message page is shown");
        });
    });
});
