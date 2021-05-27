// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.AllMyApps.
 * Testing the consumptions of groups data, external providers data and catalogs data
 * and how the model is updated in each use-case.
 *
 * Tested functions:
 */

sap.ui.require([
    "sap/ushell/library",
    "sap/ui/Device",
    "sap/ushell/services/Container",
    "sap/ushell/resources",
    "sap/m/SplitApp",
    "sap/ui/layout/Grid",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/Config",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/XMLView"
], function (library, Device, Container, resources, SplitApp, Grid, AccessibilityCustomData, Config, JSONModel, XMLView) {
    "use strict";
    /* global QUnit, sinon */

    var AppTitleState = library.AppTitleState;
    var AllMyAppsState = library.AllMyAppsState;

    var oView,
        oShellModel = new JSONModel(),
        oAllMyAppsModel = new JSONModel(),
        aExternalProvider0Data = [
            { // Group 1
                title: "Group01",
                apps: [
                    {
                        title: "P0_G1_Title1",
                        subTitle: "P0_G1_SubTitle1",
                        url: "#Action-todefaultapp"
                    }, {
                        title: "P0_G1_Title2",
                        subTitle: "P0_G1_SubTitle2",
                        url: "https://www.youtube.com/"
                    }
                ]
            }, { // Group 2
                title: "Group02",
                apps: [
                    {
                        title: "P0_G2_Title1",
                        subTitle: "P0_G2_SubTitle1",
                        url: "http://www.ynet.co.il"
                    }, {
                        title: "P0_G2_Title2",
                        subTitle: "P0_G2_SubTitle2",
                        url: "#Action-todefaultapp"
                    }
                ]
            }
        ],
        aExternalProvider1Data = [
            { // Group 1
                title: "Group11",
                apps: [
                    {
                        title: "P1_G1_Title1",
                        subTitle: "P1_G1_SubTitle1",
                        url: "#Action-todefaultapp"
                    }, {
                        title: "P1_G1_Title2",
                        subTitle: "P1_G1_SubTitle2",
                        url: "https://www.youtube.com/"
                    }
                ]
            }, { // Group 2
                title: "Group12",
                apps: [
                    {
                        title: "P1_G2_Title1",
                        subTitle: "P1_G2_SubTitle1",
                        url: "http://www.ynet.co.il"
                    }, {
                        title: "P1_G2_Title2",
                        subTitle: "P1_G2_SubTitle2",
                        url: "#Action-todefaultapp"
                    }
                ]
            }
        ],
        oAllMyAppsGetDataProvidersResponse1 = {
            ExternalProvider0: {
                getTitle: function () {
                    return "ExternalProvider0";
                },
                getData: function () {
                    var oDeferred = jQuery.Deferred();
                    oDeferred.resolve(aExternalProvider0Data);
                    return oDeferred.promise();
                }
            }
        },
        oAllMyAppsGetDataProvidersResponse2 = {
            ExternalProvider0: {
                getTitle: function () {
                    return "ExternalProvider0";
                },
                getData: function () {
                    var oDeferred = jQuery.Deferred();
                    oDeferred.resolve(aExternalProvider0Data);
                    return oDeferred.promise();
                }
            },
            ExternalProvider1: {
                getTitle: function () {
                    return "ExternalProvider1";
                },
                getData: function () {
                    var oDeferred = jQuery.Deferred();
                    oDeferred.resolve(aExternalProvider1Data);
                    return oDeferred.promise();
                }
            }
        };

    QUnit.module("sap.ushell.renderers.fiori2.allMyApps.AllMyApps", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                oAllMyAppsModel.setProperty("/AppsData", []);
            });
        },

        afterEach: function () {
            var oAllMyAppsView = sap.ui.getCore().byId("allMyAppsView");
            if (oAllMyAppsView) {
                oAllMyAppsView.destroy();
            }

            delete sap.ushell.Container;
            Config.emit("/core/shell/model/allMyAppsMasterLevel", undefined);
        }
    });

    // -------------------------------------------------------------------------------
    // ----------------------------------   TESTS   ----------------------------------
    // -------------------------------------------------------------------------------


    QUnit.test("Test onAfterRendering", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oMasterPage = oView.byId("sapUshellAllMyAppsMasterPage");
            this.oDetailsPage = oView.byId("sapUshellAllMyAppsDetailsPage");
            this.oSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");

            var oClock = sinon.useFakeTimers();
            var oLoadAppsDataSpy = sinon.stub();
            sinon.stub(this.oController, "_getAllMyAppsManager").returns({
                loadAppsData: oLoadAppsDataSpy
            });

            this.oController.switchToInitialState = sinon.spy();
            this.oController._isSingleDataSource = sinon.spy();
            this.oMasterPage.setBusy = sinon.spy();
            this.oDetailsPage.setBusy = sinon.spy();
            this.oSplitApp.toMaster = sinon.spy();



            this.oController.onAfterRendering();
            oClock.tick();

            assert.strictEqual(this.oMasterPage.setBusy.callCount, 1, "setBusy function called for the master page.");
            assert.strictEqual(this.oMasterPage.setBusy.firstCall.args[0], true, "setBusy called with 'true' for the master page.");
            assert.strictEqual(this.oDetailsPage.setBusy.callCount, 1, "setBusy function called for the details page.");
            assert.strictEqual(this.oDetailsPage.setBusy.firstCall.args[0], true, "setBusy called with 'true' for the details page.");
            assert.strictEqual(this.oController.switchToInitialState.callCount, 1, "switchToInitialState called once");
            assert.strictEqual(this.oController._isSingleDataSource.callCount, 1, "isSingleDataSource called once");
            assert.strictEqual(oLoadAppsDataSpy.callCount, 1, "AllMyAppsManager.loadAppsData called once");
            assert.strictEqual(this.oSplitApp.toMaster.callCount, 1, "SplitApp's toMaster called once");

            oClock.restore();
        }.bind(this)).finally(done);

    });

    QUnit.test("Test onAfterRendering on phone", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");

            var oClock = sinon.useFakeTimers();
            var oOriginalDeviceSystem = Device.system;
            var oLoadAppsDataSpy = sinon.spy();
            sinon.stub(this.oController, "_getAllMyAppsManager").returns({
                loadAppsData: oLoadAppsDataSpy
            });

            Device.system.phone = true;
            this.oController.switchToInitialState = sinon.spy();
            this.oController._isSingleDataSource = sinon.spy();
            this.oSplitApp.toMaster = sinon.spy();
            this.oSplitApp.toDetail = sinon.spy();

            this.oController.onAfterRendering();
            oClock.tick();

            assert.strictEqual(this.oSplitApp.toMaster.callCount, 1, "oView.oSplitApp.toMaster called");
            assert.strictEqual(this.oSplitApp.toDetail.callCount, 0, "On phone,oView.oSplitApp.toDetail is not called");
            assert.strictEqual(this.oController.switchToInitialState.callCount, 1, "switchToInitialState called once");
            assert.strictEqual(this.oController._isSingleDataSource.callCount, 1, "isSingleDataSource called once");
            assert.strictEqual(oLoadAppsDataSpy.callCount, 1, "AllMyAppsManager.loadAppsData called once");

            Device.system = oOriginalDeviceSystem;
            Device.system.phone = false;

            oClock.restore();
        }.bind(this)).finally(done);
    });

    QUnit.test("Test _isSingleDataSource", function (assert) {

        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();

            var oOriginalGetService = sap.ushell.Container.getService,
                bShowGroupsApps = false,
                bShowCatalogsApps = true,
                bShowExternalProvidersApps = false,
                oGetDataProvidersResponse = oAllMyAppsGetDataProvidersResponse1;

            sap.ushell.Container.getService = function () {
                return {
                    isHomePageAppsEnabled: function () {
                        return bShowGroupsApps;
                    },
                    isCatalogAppsEnabled: function () {
                        return bShowCatalogsApps;
                    },
                    isExternalProviderAppsEnabled: function () {
                        return bShowExternalProvidersApps;
                    },
                    getDataProviders: function () {
                        return oGetDataProvidersResponse;
                    }
                };
            };

            assert.strictEqual(
                this.oController._isSingleDataSource(),
                false,
                "isSingleDataSource returns false when CatalogsApps are enabled"
            );

            bShowGroupsApps = true;
            bShowCatalogsApps = false;
            bShowExternalProvidersApps = false;
            assert.strictEqual(
                this.oController._isSingleDataSource(),
                true,
                "isSingleDataSource returns true when only GroupsApps are enabled"
            );

            bShowGroupsApps = false;
            bShowCatalogsApps = false;
            bShowExternalProvidersApps = true;
            assert.strictEqual(
                this.oController._isSingleDataSource(),
                true,
                "isSingleDataSource returns true when only ExternalProviders are enabled, and only singe provider exists"
            );

            oGetDataProvidersResponse = oAllMyAppsGetDataProvidersResponse2;
            assert.strictEqual(
                this.oController._isSingleDataSource(),
                false,
                "isSingleDataSource returns false when only ExternalProviders are enabled, and two providers exist"
            );

            sap.ushell.Container.getService = oOriginalGetService;
        }.bind(this)).finally(done);

    });

    QUnit.test("Test switchToInitialState", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();

            var oViewOriginalSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail"),
                oBindItemStub = sinon.stub(oView.byId("sapUshellAllMyAppsDataSourcesList"), "bindItems").returns(),
                oIsSingleDataSourceStub = sinon.stub(this.oController, "_isSingleDataSource").returns(true),
                oSetTextSpy = sinon.spy(),
                oGetPopoverHeaderLabelStub = sinon.stub(this.oController, "_getPopoverHeaderLabel").returns({
                    setText: oSetTextSpy
                }),
                oSetVisibleSpy = sinon.spy(),
                oGetPopoverHeaderContentStub = sinon.stub(this.oController, "_getPopoverHeaderContent").returns({
                    setVisible: sinon.spy()
                }),
                oGetPopoverBackButtonStub = sinon.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleSpy
                });


            var oSplitAppToMasterSpy = sinon.spy(oViewOriginalSplitApp, "toMaster");
            var oToDetailStub = sinon.stub(oViewOriginalSplitApp, "toDetail").returns(function () { });

            Device.system.phone = true;
            Config.emit("/core/shellHeader/ShellAppTitleState", AppTitleState.AllMyAppsOnly);

            this.oController.switchToInitialState();
            assert.strictEqual(
                Config.last("/core/shell/model/allMyAppsMasterLevel"),
                AllMyAppsState.FirstLevelSpread,
                "isSingleDataSource is true, allMyAppsMasterLevel is FirstLevelSpread"
            );
            assert.strictEqual(oBindItemStub.callCount, 1, "BindItem called once");
            assert.strictEqual(
                oBindItemStub.args[0][0],
                "allMyAppsModel>/AppsData/0/groups",
                "BindItem called for binding groups level to the master list"
            );
            assert.strictEqual(
                oSetVisibleSpy.callCount,
                1,
                "The current state is AllMyAppsOnly - BackButton setVisible called once"
            );
            assert.strictEqual(
                oSetVisibleSpy.args[0][0],
                false,
                "The current state is AllMyAppsOnly - BackButton setVisible called with false"
            );

            assert.strictEqual(
                oSplitAppToMasterSpy.callCount,
                1,
                "The device is phone, so oSplitApp.toMaster is called"
            );
            assert.strictEqual(
                oSplitAppToMasterSpy.args[0][0],
                "sapUshellAllMyAppsMasterPage",
                "oSplitApp.toMaster is called for page sapUshellAllMyAppsMasterPage"
            );
            assert.strictEqual(
                oSplitAppToMasterSpy.args[0][1],
                "show",
                "oSplitApp.toMaster page sapUshellAllMyAppsMasterPage show"
            );

            // Changing two parameters:
            // 1. isSingleDataSource returns false (state should not be FirstLevelSpread)
            // 2. ShellAppTitle state changes to AllMyApps (from AllMyAppsOnly)
            oIsSingleDataSourceStub.restore();
            Device.system.phone = false;
            oSplitAppToMasterSpy = sinon.spy();
            oIsSingleDataSourceStub = sinon.stub(this.oController, "_isSingleDataSource").returns(false);
            Config.emit("/core/shellHeader/ShellAppTitleState", AppTitleState.AllMyApps);
            this.oController.switchToInitialState();

            assert.strictEqual(
                Config.last("/core/shell/model/allMyAppsMasterLevel"),
                AllMyAppsState.FirstLevel,
                "isSingleDataSource is false, allMyAppsMasterLevel is FirstLevel"
            );
            assert.strictEqual(oBindItemStub.callCount, 2, "BindItem called twice");
            assert.strictEqual(
                oBindItemStub.args[1][0],
                "allMyAppsModel>/AppsData",
                "BindItem called for binding providers level to the master list"
            );
            assert.strictEqual(oSetVisibleSpy.callCount, 2, "The current state is AllMyApps - BackButton setVisible called twice");
            assert.strictEqual(oSetVisibleSpy.args[1][0], true, "The current state is AllMyApps - BackButton setVisible called with true");
            assert.strictEqual(oSplitAppToMasterSpy.notCalled, true, "The device is not phone, so oSplitApp.toMaster is not called");

            oView.oSplitApp = oViewOriginalSplitApp;
            oBindItemStub.restore();
            oIsSingleDataSourceStub.restore();
            oGetPopoverHeaderLabelStub.restore();
            oGetPopoverHeaderContentStub.restore();
            oGetPopoverBackButtonStub.restore();
            oToDetailStub.restore();
        }.bind(this)).finally(done);

    });

    QUnit.test("Test handleSwitchToMasterAreaOnPhone", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();

            oShellModel = new JSONModel();
            var oIsSingleDataSourceStub = sinon.stub(this.oController, "_isSingleDataSource").returns(true),
                oSetVisibleSpy = sinon.spy(),
                oGetPopoverBackButtonStub = sinon.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleSpy
                }),
                oGetPopoverHeaderContentStub = sinon.stub(this.oController, "_getPopoverHeaderContent").returns({
                    setVisible: sinon.spy()
                }),
                oConfigEmitStub,
                oGetDataSourcesSelectedPathStub = sinon.stub(this.oController, "_getDataSourcesSelectedPath").returns(
                    "/AppsData/2/groups/0"
                );

            oView.setModel(oShellModel);

            // Use case 1:
            // - SingleDataSource
            // - AllMyAppsState is AllMyAppsOnly (meaning: ShellNavMenu is not available)
            // Expected result: back button should not be visible
            Config.emit("/core/shellHeader/ShellAppTitleState", AppTitleState.AllMyAppsOnly);

            oConfigEmitStub = sinon.stub(Config, "emit").returns();

            // first call to the tested function, isSingleDataSource is true and StateEnum is AllMyAppsOnly
            this.oController.handleSwitchToMasterAreaOnPhone();
            assert.strictEqual(oConfigEmitStub.callCount, 1, "oShellModel.setProperty called");
            assert.strictEqual(
                oConfigEmitStub.args[0][0],
                "/core/shell/model/allMyAppsMasterLevel",
                "Model property allMyAppsMasterLevel is set"
            );
            assert.strictEqual(
                oConfigEmitStub.args[0][1],
                AllMyAppsState.FirstLevelSpread,
                "Model property allMyAppsMasterLevel is set with FirstLevelSpread"
            );
            assert.strictEqual(oSetVisibleSpy.callCount, 1, "The current state is AllMyAppsOnly - BackButton setVisible called once");
            assert.strictEqual(
                oSetVisibleSpy.args[0][0],
                false,
                "The current state is AllMyAppsOnly - BackButton setVisible called with false"
            );

            // Use case 2:
            // - SingleDataSource
            // - AllMyAppsState is AllMyApps (meaning: ShellNavMenu is also available)
            // Expected result: back button needs to be visible
            oConfigEmitStub.restore();
            Config.emit("/core/shellHeader/ShellAppTitleState", AppTitleState.AllMyApps);
            this.oController.handleSwitchToMasterAreaOnPhone();
            assert.strictEqual(oSetVisibleSpy.callCount, 2, "Visibility is updated after handleSwitchToMasterAreaOnPhone");

            // Use case 3:
            // - Not SingleDataSource
            // - The previously selected master item is a 2nd level item (i.e. group)
            // oSetVisibleSpy.restore();
            oSetVisibleSpy = sinon.spy();
            oGetPopoverBackButtonStub.restore();
            oGetPopoverBackButtonStub = sinon.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                setVisible: oSetVisibleSpy
            });
            oIsSingleDataSourceStub.restore();
            oIsSingleDataSourceStub = sinon.stub(this.oController, "_isSingleDataSource").returns(false);
            oConfigEmitStub.restore();
            oConfigEmitStub = sinon.stub(Config, "emit").returns();
            this.oController.handleSwitchToMasterAreaOnPhone();
            assert.strictEqual(oConfigEmitStub.callCount, 1, "Config.emit called");
            assert.strictEqual(
                oConfigEmitStub.args[0][0],
                "/core/shell/model/allMyAppsMasterLevel",
                "Model property allMyAppsMasterLevel is set"
            );
            assert.strictEqual(
                oConfigEmitStub.args[0][1],
                AllMyAppsState.SecondLevel,
                "Model property allMyAppsMasterLevel is set with SecondLevel"
            );
            assert.strictEqual(
                oSetVisibleSpy.callCount,
                1,
                "Return to SecondLevel - BackButton setVisible is updated after handleSwitchToMasterAreaOnPhone call"
            );

            // Use case 4:
            // - Not SingleDataSource
            // - The previously selected master item is a 1st level item (i.e. catalog)
            //  oSetVisibleSpy.restore();
            oSetVisibleSpy = sinon.spy();
            oGetPopoverBackButtonStub.restore();
            oGetPopoverBackButtonStub = sinon.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                setVisible: oSetVisibleSpy
            });
            oConfigEmitStub.restore();
            Config.emit("/core/shellHeader/ShellAppTitleState", AppTitleState.AllMyAppsOnly);
            oConfigEmitStub = sinon.stub(Config, "emit").returns();
            oGetDataSourcesSelectedPathStub.restore();
            oGetDataSourcesSelectedPathStub = sinon.stub(this.oController, "_getDataSourcesSelectedPath").returns("/AppsData/2");
            this.oController.handleSwitchToMasterAreaOnPhone();
            assert.strictEqual(
                oConfigEmitStub.args[0][0],
                "/core/shell/model/allMyAppsMasterLevel",
                "Model property allMyAppsMasterLevel is set"
            );
            assert.strictEqual(
                oConfigEmitStub.args[0][1],
                AllMyAppsState.FirstLevel,
                "Model property allMyAppsMasterLevel is set with FirstLevel"
            );
            assert.strictEqual(oSetVisibleSpy.callCount, 1, "Return to FirstLevel - BackButton setVisible called once");
            assert.strictEqual(oSetVisibleSpy.args[0][0], false, "Return to FirstLevel - BackButton setVisible called with false");

            oGetPopoverBackButtonStub.restore();
            oConfigEmitStub.restore();
            oGetDataSourcesSelectedPathStub.restore();
            oIsSingleDataSourceStub.restore();
            oGetPopoverHeaderContentStub.restore();

        }.bind(this)).finally(done);
    });

    QUnit.test("Test handleMasterListItemPress", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();

            oAllMyAppsModel = oView.getModel("allMyAppsModel");
            var oGetPropertyReturnedProviderType = sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().HOME,
                oGetPropertyReturnedMasterState = AllMyAppsState.FirstLevel,
                sClickedItemModelPath = "/AppsData/2",
                oGetClickedDataSourceItemPathStub = sinon.stub(this.oController, "_getClickedDataSourceItemPath").returns(
                    sClickedItemModelPath
                ),
                oGetModelPropertyStub = sinon.stub(oAllMyAppsModel, "getProperty").callsFake(function (sProperty) {
                    if (sProperty.endsWith("type")) {
                        return oGetPropertyReturnedProviderType;
                    }
                    return oGetPropertyReturnedMasterState;
                }),
                fnOrigGetPopoverObject = this.oController._getPopoverObject;

            this.oController._getPopoverObject = function () {
                return {
                    getCustomHeader: function () {
                        return {
                            getContentLeft: function () {
                                return [];
                            }
                        };
                    }
                };
            };

            this.oController.handleMasterListItemPressToDetails = sinon.spy();
            this.oController.handleMasterListItemPressToSecondLevel = sinon.spy();

            // Provider type HOME, Master level is FirstLevel => handleMasterListItemPressToSecondLevel should be called
            this.oController.handleMasterListItemPress({
                getParameter: function () {
                    return "testListItem";
                }
            });
            assert.strictEqual(
                this.oController.handleMasterListItemPressToSecondLevel.callCount,
                1,
                "Provider type HOME, Master level is FirstLevel => handleMasterListItemPressToSecondLevel was called"
            );

            // Provider type CATALOG, Master level is FirstLevel => handleMasterListItemPressToDetails should be called
            oGetPropertyReturnedProviderType = sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().CATALOG;

            this.oController.handleMasterListItemPress({
                getParameter: function () {
                    return "testListItem";
                }
            });
            assert.strictEqual(
                this.oController.handleMasterListItemPressToDetails.callCount,
                1,
                "Provider type HOME, Master level is FirstLevel => handleMasterListItemPressToDetails was called"
            );

            this.oController._getPopoverObject = fnOrigGetPopoverObject;
            oGetModelPropertyStub.restore();
            oGetClickedDataSourceItemPathStub.restore();
        }.bind(this)).finally(done);
    });

    QUnit.test("Test handleMasterListItemPressToSecondLevel", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oSplitApp = oView.byId("sapUshellAllMyAppsMasterDetail");
            this.oDataSourceList = oView.byId("sapUshellAllMyAppsDataSourcesList");

            oAllMyAppsModel = oView.getModel("allMyAppsModel");
            var oConfigEmitStub,
                oGetPopoverHeaderContentStub = sinon.stub(this.oController, "_getPopoverHeaderContent").returns({
                    setVisible: sinon.spy()
                }),
                sClickedItemModelPath = "/AppsData/2",
                oGetClickedDataSourceItemPathStub = sinon.stub(this.oController, "_getClickedDataSourceItemPath").returns(
                    sClickedItemModelPath
                ),
                oSetMasterLabelTextSpy = sinon.spy(),
                oGetPopoverHeaderLabelStub = sinon.stub(this.oController, "_getPopoverHeaderLabel").returns({
                    setText: oSetMasterLabelTextSpy
                }),
                oSetDetailsLabelTextSpy = sinon.spy(),
                oGetPopoverDetailsLabelStub = sinon.stub(this.oController, "_getDetailsHeaderLabel").returns({
                    setText: oSetDetailsLabelTextSpy
                }),
                oSetVisibleSpy = sinon.spy(),
                oGetPopoverBackButtonStub = sinon.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleSpy
                });

            oAllMyAppsModel.setProperty(sClickedItemModelPath, {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups", []);
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/0", {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/0/title", "someTitle");
            oAllMyAppsModel.setProperty(
                sClickedItemModelPath + "/type",
                sap.ushell.Container.getService("AllMyApps").getProviderTypeEnum().HOME
            );

            Config.emit("/core/shellHeader/ShellAppTitleState", AppTitleState.AllMyAppsOnly);
            oConfigEmitStub = sinon.spy(Config, "emit");

            this.oController.handleSwitchToDetailsAreaOnPhone = sinon.spy();
            this.oSplitApp.toDetail = sinon.spy();
            this.oDataSourceList.bindItems = sinon.spy();
            this.oController._setBindingContext = sinon.spy();

            Device.system.phone = false;
            this.oController.handleMasterListItemPressToSecondLevel();

            // Verify that oSplitApp.toDetail("sapUshellAllMyAppsDetailsPage") is called
            assert.strictEqual(
                this.oSplitApp.toDetail.callCount,
                1,
                "Not on Phone, oView.oSplitApp.toDetail is called when first level master item pressed"
            );
            assert.strictEqual(oConfigEmitStub.callCount, 1, "Config.emit called");

            // If the pressed item is not CATALOG, verify that the state is set to SecondLevel
            assert.strictEqual(oConfigEmitStub.args[0][0], "/core/shell/model/allMyAppsMasterLevel", "allMyAppsMasterLevel set");
            assert.strictEqual(
                oConfigEmitStub.args[0][1],
                AllMyAppsState.SecondLevel,
                "allMyAppsMasterLevel set to AllMyAppsState.SecondLevel"
            );

            // Verify that the list is bound to the second level (groups)
            assert.strictEqual(this.oDataSourceList.bindItems.callCount, 1, "oView.oDataSourceList.bindItems called");
            assert.strictEqual(
                this.oDataSourceList.bindItems.args[0][0],
                "allMyAppsModel>" + sClickedItemModelPath + "/groups",
                "oView.oDataSourceList.bindItems called to bind th elist to the groups level"
            );

            // In case of AllMyAppsOnly - verify that the back button becomes visible
            assert.strictEqual(oSetVisibleSpy.callCount, 1, "Setting back button visibility");
            assert.strictEqual(oSetVisibleSpy.args[0][0], true, "Setting back button visibility to true");

            // Verify that the BindingContext of the details area is set to the first group of the clicked item/provider
            assert.strictEqual(this.oController._setBindingContext.callCount, 1, "Setting details area context");
            assert.strictEqual(
                this.oController._setBindingContext.args[0][0],
                sClickedItemModelPath + "/groups/0",
                "Setting details area context to the content of the first group of the clicked item/provider"
            );

            assert.strictEqual(oSetMasterLabelTextSpy.callCount, 1, "One call to SetText of master area header label");
            assert.strictEqual(
                oSetMasterLabelTextSpy.args[0][0],
                sap.ushell.resources.i18n.getText("allMyApps_homeEntryTitle"),
                "Master area header label is set to: " + sap.ushell.resources.i18n.getText("allMyApps_homeEntryTitle")
            );

            assert.strictEqual(oSetDetailsLabelTextSpy.callCount, 1, "One call to SetText of details area header label");
            assert.strictEqual(oSetDetailsLabelTextSpy.args[0][0], "someTitle", "Details area header label was set to someTitle");

            oGetPopoverHeaderLabelStub.restore();
            oGetPopoverDetailsLabelStub.restore();
            oGetPopoverBackButtonStub.restore();
            oGetPopoverHeaderContentStub.restore();
            oGetClickedDataSourceItemPathStub.restore();
            oConfigEmitStub.restore();
        }.bind(this)).finally(done);
    });

    QUnit.test("Test handleMasterListItemPressToDetails", function (assert) {
        var done = assert.async();

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();

            oAllMyAppsModel = oView.getModel("allMyAppsModel");
            var oOriginalDeviceSystem = Device.system,
                sClickedItemModelPath = "/AppsData/2",
                oSetDetailsLabelTextSpy = sinon.spy(),
                oGetPopoverDetailsLabelStub = sinon.stub(this.oController, "_getDetailsHeaderLabel").returns({
                    setText: oSetDetailsLabelTextSpy
                }),
                oSetVisibleSpy = sinon.spy(),
                oGetPopoverBackButtonStub = sinon.stub(this.oController, "_getPopoverHeaderBackButton").returns({
                    setVisible: oSetVisibleSpy
                }),
                oGetPopoverHeaderContentStub = sinon.stub(this.oController, "_getPopoverHeaderContent").returns({
                    setVisible: sinon.spy()
                }),
                oHandleSwitchToMasterAreaOnPhoneStub = sinon.stub(this.oController, "handleSwitchToMasterAreaOnPhone").returns(),
                oGetClickedDataSourceItemPathStub = sinon.stub(this.oController, "_getClickedDataSourceItemPath").returns(
                    sClickedItemModelPath + "/groups/4"
                );

            oAllMyAppsModel.setProperty(sClickedItemModelPath, {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups", []);
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/4", {});
            oAllMyAppsModel.setProperty(sClickedItemModelPath + "/groups/4/title", "someTitle");

            Device.system.phone = true;

            this.oController.handleMasterListItemPressToDetails();

            assert.strictEqual(oSetDetailsLabelTextSpy.callCount, 1, "Setting text of details header");
            assert.strictEqual(oSetDetailsLabelTextSpy.args[0][0], "someTitle", "Details area header label was set to someTitle");

            Device.system = oOriginalDeviceSystem;
            oHandleSwitchToMasterAreaOnPhoneStub.restore();
            oGetClickedDataSourceItemPathStub.restore();
            oGetPopoverBackButtonStub.restore();
            oGetPopoverHeaderContentStub.restore();
            oGetPopoverDetailsLabelStub.restore();
        }.bind(this)).finally(done);
    });


    QUnit.module("AppFinder disabled", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {
                oAllMyAppsModel.setProperty("/AppsData", []);
            });
        },

        afterEach: function () {
            var oAllMyAppsView = sap.ui.getCore().byId("allMyAppsView");
            if (oAllMyAppsView) {
                oAllMyAppsView.destroy();
            }

            delete sap.ushell.Container;
            Config.emit("/core/catalog/enabled", true);
        }
    });

    QUnit.test("Link to open the AppFinder is not visible", function (assert) {
        var done = assert.async();
        Config.emit("/core/catalog/enabled", false);

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oCustomLink = oView.byId("sapUshellAllMyAppsCustomPanelLink");
            this.oCustomPanel = oView.byId("sapUshellAllMyAppsCustomPanel");

            assert.equal(this.oCustomPanel.getItems().length, 2, "The custom label and the link should both be rendered.");
            assert.equal(this.oCustomLink.getVisible(), false, "The link to open the AppFinder should not be visible.");
        }.bind(this)).finally(done);
    });

    QUnit.test("Test link to open the AppFinder is visible", function (assert) {
        var done = assert.async();
        Config.emit("/core/catalog/enabled", true);

        return XMLView.create({
            id: "allMyAppsView",
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps"
        }).then(function (view) {
            oView = view;
            this.oController = oView.getController();
            this.oCustomLink = oView.byId("sapUshellAllMyAppsCustomPanelLink");
            this.oCustomPanel = oView.byId("sapUshellAllMyAppsCustomPanel");

            assert.equal(this.oCustomPanel.getItems().length, 2, "The custom label and the link should both be rendered.");
            assert.equal(this.oCustomLink.getVisible(), true, "The link to open the AppFinder should be visible.");
        }.bind(this)).finally(done);
    });
});