// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.SessionHandler
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/services/Container",
    "sap/ushell/SessionHandler",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ui/util/Storage",
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ushell/Config",
    "sap/ushell/EventHub"
], function (Resources, Container, SessionHandler, AppLifeCycle, Storage, Log, ObjectPath, Config, EventHub) {
    "use strict";

    // sinon sandbox
    var oSinon;

    // Configurations for the session handler
    var oSessionHandlerConfigReminderNoSignout = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutReminderInMinutes: 5,
            enableAutomaticSignout: false,
            keepSessionAlivePopupText: "XXX The session is about to expire",
            pageReloadPopupText: "XXX The session was terminated, please reload"
        },
        oSessionHandlerConfigNoReminderNoSignout = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutReminderInMinutes: 0,
            enableAutomaticSignout: false
        };

    QUnit.start();

    QUnit.module("init", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oRegisterLogoutStub = sinon.stub();
            this.oPutTimestampInStorageStub = sinon.stub(this.oSessionHandler, "putTimestampInStorage");
            this.oRegisterCommHandlerStub = sinon.stub(this.oSessionHandler, "registerCommHandlers");
            this.oAttachUserEventsStub = sinon.stub(this.oSessionHandler, "attachUserEvents");
            this.oInitSessionTimeoutStub = sinon.stub(this.oSessionHandler, "initSessionTimeout");
            this.oInitTileRequestTimout = sinon.stub(this.oSessionHandler, "initTileRequestTimeout");

            ObjectPath.set("sap.ushell.Container.registerLogout", this.oRegisterLogoutStub);
        },
        afterEach: function () {
            this.oPutTimestampInStorageStub.restore();
            this.oRegisterCommHandlerStub.restore();
            this.oAttachUserEventsStub.restore();
            this.oInitSessionTimeoutStub.restore();
            this.oInitTileRequestTimout.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Test if all setup functions are called as expected", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutIntervalInMinutes: 30,
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        // Act
        this.oSessionHandler.init(oConfig);
        // Assert
        assert.ok(this.oRegisterLogoutStub.calledOnce, "registerLogout was called");
        assert.ok(this.oPutTimestampInStorageStub.calledOnce, "putTimestampInStorage was called");
        assert.ok(this.oRegisterCommHandlerStub.calledOnce, "registerCommHandlerStub was called");
        assert.ok(this.oAttachUserEventsStub.calledOnce, "attachUserEventsStub was called");
        assert.ok(this.oInitSessionTimeoutStub.calledOnce, "initSessionTimeoutStub was called");
        assert.ok(this.oInitTileRequestTimout.calledOnce, "initTileRequestTimout was called");
    });

    QUnit.test("Test if all setup functions are called as expected except the disabled timeout types", function (assert) {
        // Arrange
        var oConfig = {
            sessionTimeoutReminderInMinutes: -1,
            sessionTimeoutTileStopRefreshIntervalInMinutes: -1
        };
        // Act
        this.oSessionHandler.init(oConfig);
        // Assert
        assert.ok(this.oRegisterLogoutStub.calledOnce, "registerLogout was called");
        assert.ok(this.oPutTimestampInStorageStub.calledOnce, "putTimestampInStorage was called");
        assert.ok(this.oRegisterCommHandlerStub.calledOnce, "registerCommHandlerStub was called");
        assert.ok(this.oAttachUserEventsStub.calledOnce, "attachUserEventsStub was called");
        assert.ok(this.oInitSessionTimeoutStub.notCalled, "initSessionTimeoutStub was not called");
        assert.ok(this.oInitTileRequestTimout.notCalled, "initTileRequestTimout was not called");
    });

    QUnit.test("nwbc event 'nwbcUserIsActive' indeed calls userActivityHandler", function (assert) {
        var done = assert.async(),
            oStub = sinon.stub(this.oSessionHandler, "userActivityHandler");

        this.oSessionHandler.init({});

        EventHub.on("nwbcUserIsActive").do(function () {
            assert.ok(oStub.calledOnce, "userActivityHandler called twice");
            oStub.restore();
            done();
        });

        EventHub.emit("nwbcUserIsActive", Date.now());
    });

    QUnit.module("initSessionTimeout", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oModelStub = {
                setProperty: sinon.stub()
            };
            this.oSessionHandler.oModel = this.oModelStub;
            this.oNotifyServerStub = sinon.stub(this.oSessionHandler, "notifyServer");
            this.oMonitorUserIsInactiveStub = sinon.stub(this.oSessionHandler, "monitorUserIsInactive");
        },
        afterEach: function () {
            this.oNotifyServerStub.restore();
            this.oMonitorUserIsInactiveStub.restore();
        }
    });

    QUnit.test("Test if all setup functions for the session timeout feature are called as expected", function (assert) {

        // Arrange
        var oConfig = {
            enableAutomaticSignout: true,
            sessionTimeoutReminderInMinutes: 20
        };
        this.oSessionHandler.oConfig = oConfig;

        // Act
        this.oSessionHandler.initSessionTimeout();

        // Assert
        assert.ok(this.oNotifyServerStub.calledOnce, "notifyServer was called");
        assert.ok(this.oMonitorUserIsInactiveStub.calledOnce, "monitorUserIsInactive was called");
        assert.ok(this.oModelStub.setProperty.calledOnce, "oModel.setProperty was called");
    });

    QUnit.test("Test if enableAutomaticSignout and sessionTimeoutReminderInMinutes default values are set", function (assert) {

        // Arrange
        var oConfig = {},
            oExpectedConfig = {
                enableAutomaticSignout: false,
                sessionTimeoutReminderInMinutes: 0
            };
        this.oSessionHandler.oConfig = oConfig;

        // Act
        this.oSessionHandler.initSessionTimeout();

        // Assert
        assert.ok(this.oNotifyServerStub.calledOnce, "notifyServer was called");
        assert.ok(this.oMonitorUserIsInactiveStub.calledOnce, "monitorUserIsInactive was called");
        assert.ok(this.oModelStub.setProperty.calledOnce, "oModel.setProperty was called");
        assert.deepEqual(this.oSessionHandler.oConfig, oExpectedConfig, "default config values were set");
    });

    QUnit.module("initTileRequestTimeout", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.checkStopBackendRequestRemainingTimeStub = sinon.stub(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
        },
        afterEach: function () {
            this.checkStopBackendRequestRemainingTimeStub.restore();
        }
    });

    QUnit.test("Test if all setup functions for the tile request timeout feature are called as expected", function (assert) {

        // Arrange
        var oConfig = {
            sessionTimeoutTileStopRefreshIntervalInMinutes: 15
        };
        this.oSessionHandler.oConfig = oConfig;

        // Act
        this.oSessionHandler.initTileRequestTimeout();

        // Assert
        assert.ok(this.checkStopBackendRequestRemainingTimeStub.calledOnce, "checkStopBackendRequestRemainingTime was called");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "bBackendRequestsActive was initialised");
    });

    QUnit.module("checkStopBackendRequestRemainingTime", {
        beforeEach: function () {
            this.oFakeClock = sinon.useFakeTimers();
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oGetCurrentDateStub = sinon.stub(this.oSessionHandler, "_getCurrentDate").returns(new Date());
            this.oGetTimestampFromStorageStub = sinon.stub(this.oSessionHandler, "getTimestampFromStorage");
            this.oSetTileRequestsActiveStub = sinon.stub(this.oSessionHandler, "_setConnectionActive");
            this.oCheckTileStopRequestRemainingTimeSpy = sinon.spy(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
        },
        afterEach: function () {
            this.oFakeClock.restore();
            this.oGetCurrentDateStub.restore();
            this.oGetTimestampFromStorageStub.restore();
            this.oSetTileRequestsActiveStub.restore();
            this.oCheckTileStopRequestRemainingTimeSpy.restore();
        }
    });

    QUnit.test("Test if checkStopBackendRequestRemainingTime is called in the expected interval", function (assert) {
        // Arrange
        var oConfig = {
                sessionTimeoutTileStopRefreshIntervalInMinutes: 15
            },
            oDateFromTenMinutesAgo = new Date(),
            oDateFromTwentyMinutesAgo = new Date();

        oDateFromTenMinutesAgo.setMinutes(oDateFromTenMinutesAgo.getMinutes() - 10);
        oDateFromTwentyMinutesAgo.setMinutes(oDateFromTwentyMinutesAgo.getMinutes() - 20);
        this.oSessionHandler.oConfig = oConfig;
        this.oGetTimestampFromStorageStub.returns(oDateFromTenMinutesAgo);
        // Act & Assert
        // Initial call
        this.oSessionHandler.checkStopBackendRequestRemainingTime();
        assert.ok(this.oCheckTileStopRequestRemainingTimeSpy.calledOnce, "checkStopBackendRequestRemainingTime was not called more than once immediately");
        assert.ok(this.oSetTileRequestsActiveStub.notCalled, "_setConnectionActive was not called before the expected time has passed");
        // Advance 5 minutes to trigger the interval and pretend user was inactive for twenty minutes
        this.oGetTimestampFromStorageStub.returns(oDateFromTwentyMinutesAgo);
        this.oFakeClock.tick(5 * 60 * 1000);
        assert.ok(this.oCheckTileStopRequestRemainingTimeSpy.calledTwice, "checkStopBackendRequestRemainingTime was called a second time after the expected time has passed");
        assert.ok(this.oSetTileRequestsActiveStub.calledOnce, "_setConnectionActive was called after the expected amount of time has passed");
    });

    QUnit.module("_setConnectionActive", {
        beforeEach: function () {
            this.oConfigLastStub = sinon.stub(Config, "last");
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oCheckTileStopRequestRemainingTimeStub = sinon.stub(this.oSessionHandler, "checkStopBackendRequestRemainingTime");
            this.oSetTileVisibleOnHomepageStub = sinon.stub(this.oSessionHandler, "_setTilesVisibleOnHomepage");
            this.oSetTileInvisibleOnHomepageStub = sinon.stub(this.oSessionHandler, "_setTilesInvisibleOnHomepage");

            // EventBus
            this.oPublishStub = sinon.stub();
            this.oGetEventBusStub = sinon.stub().returns({
                publish: this.oPublishStub
            });
            this.oGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                getEventBus: this.oGetEventBusStub
            });

        },
        afterEach: function () {
            this.oConfigLastStub.restore();
            this.oCheckTileStopRequestRemainingTimeStub.restore();
            this.oSetTileVisibleOnHomepageStub.restore();
            this.oSetTileInvisibleOnHomepageStub.restore();
            this.oGetCoreStub.restore();
        }
    });

    QUnit.test("Test if checkTileStopRequestRemainingTime is called asynchronously if parameter true was provided", function (assert) {
        // Arrange
        var oFakeClock = sinon.useFakeTimers();
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        oFakeClock.tick(100);
        assert.ok(this.oCheckTileStopRequestRemainingTimeStub.calledOnce, "checkTileStopRequstRemainingTime was called after a few ms have passed.");
        oFakeClock.restore();
    });

    QUnit.test("Confirm no event is raised if communication to front-end server is already enabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oPublishStub.callCount, 0, "No event was published.");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
    });

    QUnit.test("Confirm no event is raised if communication to front-end server is already disabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oPublishStub.callCount, 0, "No event was published.");
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
    });

    QUnit.test("Confirm an event is raised if communication to front-end server isn't yet disabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.strictEqual(this.oPublishStub.callCount, 1, "One event was published.");
        assert.deepEqual(this.oPublishStub.getCall(0).args, ["launchpad", "setConnectionToServer", { active: false }], "Arguments as expected.");
    });

    QUnit.test("Confirm an event is raised if communication to front-end server isn't yet enabled as desired", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.strictEqual(this.oPublishStub.callCount, 1, "One event was published.");
        assert.deepEqual(this.oPublishStub.getCall(0).args, ["launchpad", "setConnectionToServer", { active: true }], "Arguments as expected.");
    });

    QUnit.test("Confirm _setTilesInvisibleOnHomepage is called when parameter false was provided in classical homepage mode", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.calledOnce, "_setTilesInvisibleOnHomepage was called once.");
    });

    QUnit.test("Confirm _setTilesVisibleOnHomepage is called when parameter true was provided in classical homepage mode", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.calledOnce, "_setTilesVisibleOnHomepage was called once.");
    });

    QUnit.test("Confirm _setTilesVisible/InvisibleOnHomepage is not called when in FLP spaces mode if parameter is true", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = false;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        // Act
        this.oSessionHandler._setConnectionActive(true);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, true, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.notCalled, "_setTilesVisibleOnHomepage was not called.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.notCalled, "_setTilesInvisibleOnHomepage was not called.");
    });

    QUnit.test("Confirm _setTilesVisible/InvisibleOnHomepage is not called when in FLP spaces mode if parameter is false", function (assert) {
        // Arrange
        this.oSessionHandler.bBackendRequestsActive = true;
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        // Act
        this.oSessionHandler._setConnectionActive(false);
        // Assert
        assert.strictEqual(this.oSessionHandler.bBackendRequestsActive, false, "SessionHandler.bBackendRequestsActive has the expected value.");
        assert.ok(this.oSetTileVisibleOnHomepageStub.notCalled, "_setTilesVisibleOnHomepage was not called.");
        assert.ok(this.oSetTileInvisibleOnHomepageStub.notCalled, "_setTilesInvisibleOnHomepage was not called.");
    });


    QUnit.module("_setTileVisible", {
        beforeEach: function () {
            var that = this;
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oUtilsStub = {
                handleTilesVisibility: sinon.stub()
            };
            this.oRequireStub = sinon.stub(sap.ui, "require").callsFake(function (modules, callback) {
                var aLoadedModules = [];
                if (Array.isArray(modules)) {
                    modules.forEach(function (module) {
                        switch (module) {
                            case "sap/ushell/utils":
                                aLoadedModules.push(that.oUtilsStub);
                                break;
                            default:
                                break;
                        }
                    });
                }
                callback.apply(null, aLoadedModules);
            });
        },
        afterEach: function () {
            this.oRequireStub.restore();
        }
    });

    QUnit.test("Test if sap.ushell.utils.handleTilesVisibility is called", function (assert) {
        // Arrange
        // Act
        this.oSessionHandler._setTilesVisibleOnHomepage();
        // Assert
        assert.ok(this.oUtilsStub.handleTilesVisibility.calledOnce, "sap.ushell.utils.handleTilesVisibility was called");
    });

    QUnit.module("_setTilesInvisibleOnHomepage", {
        beforeEach: function () {
            var that = this;
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            // LaunchPageService
            this.oGetGroupsStub = sinon.stub().resolves([{
                groupTiles: ["tile1", "tile2"]
            }, {
                groupTiles: ["tile3", "tile4"]
            }]);
            this.oGetGroupTilesStub = sinon.stub().callsFake(function (group) {
                return group.groupTiles;
            });
            this.oSetTileVisibleStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub().callsFake(function (service) {
                if (service === "LaunchPage") {
                    return Promise.resolve({
                        getGroups: that.oGetGroupsStub,
                        getGroupTiles: that.oGetGroupTilesStub,
                        setTileVisible: that.oSetTileVisibleStub
                    });
                }
                return null;
            });
            ObjectPath.set("sap.ushell.Container.getServiceAsync", this.oGetServiceAsyncStub);
            // EventBus
            this.oPublishStub = sinon.stub();
            this.oGetEventBusStub = sinon.stub().returns({
                publish: this.oPublishStub
            });
            this.oGetCoreStub = sinon.stub(sap.ui, "getCore").returns({
                getEventBus: this.oGetEventBusStub
            });
        },
        afterEach: function () {
            this.oGetCoreStub.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Test if tiles are set invisible as expected", function (assert) {
        // Arrange
        var done = assert.async(),
            aExpectedPublishParameters = ["launchpad", "visibleTilesChanged", []];
        // Act
        var oSetTilesInvisiblePromise = this.oSessionHandler._setTilesInvisibleOnHomepage();
        // Assert
        oSetTilesInvisiblePromise.then(function () {
            assert.ok(this.oGetServiceAsyncStub.calledOnce, "getServiceAsync was called");
            assert.ok(this.oGetGroupsStub.calledOnce, "LaunchPageService.getGroups was called");
            assert.ok(this.oGetGroupTilesStub.calledTwice, "LaunchPageService.getGroupTiles was called twice");
            assert.strictEqual(this.oSetTileVisibleStub.callCount, 4, "LaunchPageService.setTileVisible was called four times as expected");
            assert.ok(this.oGetCoreStub.calledOnce, "getCore was called");
            assert.ok(this.oGetEventBusStub.calledOnce, "getEventBus was called");
            assert.deepEqual(this.oPublishStub.firstCall.args, aExpectedPublishParameters, "publish was called with expected arguments");
            done();
        }.bind(this));
    });

    QUnit.module("monitorUserIsInactive", {
        beforeEach: function () {

            // Calculate some points in time: Before, at and after the session timeout warning or notification
            // shall appear. Also calculate the point in time the session is over.
            // This is 20 / 25 / 27 and 30 minutes from time of last interaction in case of a session timeout warning
            // and 20 / 30 / 32 and 30 minutes in case of a session timeout notification (without warning)
            this.calculateTimes = function (oSessionHandlerConfig) {
                this.timeLastInteraction = new Date();
                this.iReminderIntervalInMinutes =
                oSessionHandlerConfig.sessionTimeoutIntervalInMinutes
                    - oSessionHandlerConfig.sessionTimeoutReminderInMinutes;
                this.timeBeforePopup = new Date(this.timeLastInteraction.getTime());
                this.timeBeforePopup.setMinutes(this.timeLastInteraction.getMinutes() + this.iReminderIntervalInMinutes - 10);
                this.timeAtPopup = new Date(this.timeLastInteraction.getTime());
                this.timeAtPopup.setMinutes(this.timeLastInteraction.getMinutes() + this.iReminderIntervalInMinutes);
                this.timeAfterPopup = new Date(this.timeLastInteraction.getTime());
                this.timeAfterPopup.setMinutes(this.timeLastInteraction.getMinutes() + this.iReminderIntervalInMinutes + 2);
                this.timeOver = new Date(this.timeLastInteraction.getTime());
                this.timeOver.setMinutes(this.timeLastInteraction.getMinutes() + oSessionHandlerConfig.sessionTimeoutIntervalInMinutes);
            };

            // Perform a local ushell bootstrap before each test
            return sap.ushell.bootstrap("local").then(function () {

                // Create session handler for testing and sandbox
                this.oSessionHandler = new SessionHandler(AppLifeCycle);
                oSinon = sinon.sandbox.create();
                this.oOpenDialogSpy = oSinon.spy();

            }.bind(this));
        },
        afterEach: function () {

            // Clean up
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            oSinon.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("When reminder is enabled and automatic signout is disabled", function (assert) {

        // ===== Use-case 1: Timeout did not yet happen and session timeout warning dialog did appear =====

        // --- Arrange ---
        this.oSessionHandler.init(oSessionHandlerConfigReminderNoSignout);

        // Prepare timing
        // ... this.timeLastInteraction, this.timeBeforePopup, this.timeAtPopup, this.timeAfterPopup
        //     and this.timeOver
        this.calculateTimes(oSessionHandlerConfigReminderNoSignout);

        // Set time of the last user interaction
        oSinon.stub(this.oSessionHandler, "getTimestampFromStorage").returns(this.timeLastInteraction.toString());

        // Set time now and time popup
        oSinon.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeBeforePopup);
        oSinon.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeBeforePopup.getTime()/1000));
        oSinon.stub(this.oSessionHandler, "timePopup").returns(Math.floor(this.timeAtPopup.getTime()/1000));

        // Spy the windows timeout
        oSinon.stub(window, "setTimeout");

        // Stub the session expired dialog and the continue working dialog
        oSinon.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: this.oOpenDialogSpy
        });
        oSinon.stub(this.oSessionHandler, "createContinueWorkingDialog").returns({
            open: this.oOpenDialogSpy
        });

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 1,
            "setTimout called once when time since last user action < time to session over reminder");
        assert.strictEqual(window.setTimeout.args[0][1], 10*60*1000, // Next run in 10 minutes
                "Next run of monitorUserIsInactive() is scheduled in 10 minutes");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
                "Continue working dialog was not yet created");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 0,
                "Session expired dialog was not created");

        // ===== Use-case 2: Timeout did not yet happen, but session timeout warning dialog did appear =====

        // --- Arrange ---
        window.setTimeout.restore();
        oSinon.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        oSinon.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeAfterPopup.getTime()/1000));
        this.oSessionHandler._getCurrentDate.restore();
        oSinon.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeAfterPopup);
        oSinon.stub(this.oSessionHandler, "detachUserEvents");
        oSinon.spy(this.oSessionHandler, "monitorCountdown");

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 1,
            "setTimout() not called in monitorUserIsInactive() when time since last user action > time to session over reminder");
        assert.strictEqual(window.setTimeout.args[0][1], 500, "... but in monitorCountdown() after 500 msec");
        assert.strictEqual(this.oSessionHandler.detachUserEvents.callCount, 1,
            "detachUserEvents() is called");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.callCount, 1,
            "monitorCountdown() is called");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.args[0][0], true,
            "monitorCountdown() is called from outside");
        assert.strictEqual(this.oOpenDialogSpy.callCount, 1,
            "ContinueWorkingDialog opened");

        // ===== Use-case 3: Timeout did happen =====

        // --- Arrange ---
        window.setTimeout.restore();
        oSinon.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        oSinon.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeOver.getTime()/1000));
        this.oSessionHandler._getCurrentDate.restore();
        oSinon.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeOver);
        oSinon.stub(this.oSessionHandler, "handleSessionOver");
        this.oSessionHandler.monitorCountdown.restore();
        oSinon.spy(this.oSessionHandler, "monitorCountdown");

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert -----
        assert.strictEqual(window.setTimeout.callCount, 0,
            "setTimout() is not called when time since last user action > time to session over");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.callCount, 0, "No further countdown");
        assert.strictEqual(this.oSessionHandler.handleSessionOver.callCount, 1,
            "handleSessionOver() is called");
    });

    QUnit.test("When reminder and automatic signout are disabled", function (assert) {

        // ===== Use-case 1: Timeout did not yet happen and session timeout dialog did not appear =====

        // --- Arrange ---
        this.oSessionHandler.init(oSessionHandlerConfigNoReminderNoSignout);

        // Prepare timing
        // ... this.timeLastInteraction, this.timeBeforePopup, this.timeAtPopup, this.timeAfterPopup
        //     and this.timeOver
        this.calculateTimes(oSessionHandlerConfigNoReminderNoSignout);

        // Set time of the last user interaction
        oSinon.stub(this.oSessionHandler, "getTimestampFromStorage").returns(this.timeLastInteraction.toString());

        // Set time now and time popup
        oSinon.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeBeforePopup);
        oSinon.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeBeforePopup.getTime()/1000));
        oSinon.stub(this.oSessionHandler, "timePopup").returns(Math.floor(this.timeAtPopup.getTime()/1000));

        // Spy the windows timeout
        oSinon.stub(window, "setTimeout");

        // Stub the session expired dialog and the continue working dialog
        sinon.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: this.oOpenDialogSpy
        });
        sinon.stub(this.oSessionHandler, "createContinueWorkingDialog").returns({
            open: this.oOpenDialogSpy
        });

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 1,
            "setTimout called once when time since last interaction < time to session over");
        assert.strictEqual(window.setTimeout.args[0][1], 10*60*1000, // Next run in 10 minutes
                "Next run of monitorUserIsInactive() is scheduled in 10 minutes");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
            "Continue working dialog was not created");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 0,
            "Session expired dialog was not yet created");

        // ===== Use-case 2: Timeout reached and session timeout dialog appeared =====

        // --- Arrange ---
        window.setTimeout.restore();
        oSinon.stub(window, "setTimeout");
        this.oSessionHandler.timeNow.restore();
        oSinon.stub(this.oSessionHandler, "timeNow").returns(Math.floor(this.timeAfterPopup.getTime()/1000));
        this.oSessionHandler._getCurrentDate.restore();
        oSinon.stub(this.oSessionHandler, "_getCurrentDate").returns(this.timeAfterPopup);
        oSinon.spy(this.oSessionHandler, "monitorCountdown");

        // --- Act ---
        this.oSessionHandler.monitorUserIsInactive();

        // --- Assert ---
        assert.strictEqual(window.setTimeout.callCount, 0,
            "setTimout() is not called in monitorUserIsInactive() when time since last interaction > time to session over");
        assert.strictEqual(this.oSessionHandler.monitorCountdown.callCount, 0,
            "monitorCountdown() is not called");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.callCount, 1,
            "Session expired dialog was created");
        assert.strictEqual(this.oOpenDialogSpy.callCount, 1, "... and opened");
        assert.strictEqual(this.oSessionHandler.createContinueWorkingDialog.callCount, 0,
            "Continue working dialog was not created");
    });

    QUnit.module("notifyServer", {
        beforeEach: function () {
            return sap.ushell.bootstrap("local").then(function () {

                // Create session handler for testing
                this.oSessionHandler = new SessionHandler(AppLifeCycle);
                this.oSessionHandler.init(oSessionHandlerConfigReminderNoSignout);

                // Setup timing
                var dBaseDate = new Date();
                this.dDate1 = new Date(dBaseDate.getTime());
                this.dDate2 = new Date(dBaseDate.getTime());
                this.dDate1.setMinutes(dBaseDate.getMinutes() + oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes - 2);
                this.dDate2.setMinutes(dBaseDate.getMinutes() + oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes + 2);

                // Some stubs
                this.oOpenDialogStub = sinon.stub();
                sinon.stub(this.oSessionHandler, "getTimestampFromStorage").returns(dBaseDate.toString());
                sinon.stub(sap.ushell.Container, "sessionKeepAlive");
                sinon.stub(AppLifeCycle, "postMessageToIframeApp").returns();
            }.bind(this));
         },
        afterEach: function () {
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            AppLifeCycle.postMessageToIframeApp.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Confirm session is extended as expected", function (assert) {

        // Arrange
        // Use-case 1: the time since the last action is smaller then sessionTimeoutIntervalInMinutes
        var oCurrentDateStub = sinon.stub(this.oSessionHandler, "_getCurrentDate").returns(this.dDate1);
        sinon.stub(window, "setTimeout");

        // Act
        this.oSessionHandler.notifyServer();

        // Assert
        assert.strictEqual(sap.ushell.Container.sessionKeepAlive.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> sessionKeepAlive called once");
        assert.strictEqual(AppLifeCycle.postMessageToIframeApp.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> AppLifeCycle.postMessageToIframeApp called once");
        assert.strictEqual(window.setTimeout.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> setTimeout called");
        assert.strictEqual(window.setTimeout.args[0][1], oSessionHandlerConfigNoReminderNoSignout.sessionTimeoutIntervalInMinutes * 60 * 1000,
            "setTimeout called in order to wait another sessionTimeoutIntervalInMinutes interval");

        // Use-case 2: the time since the last action is bigger then sessionTimeoutIntervalInMinutes
        oCurrentDateStub.returns(this.dDate2);

        // Arrange
        sap.ushell.Container.sessionKeepAlive.resetHistory();
        AppLifeCycle.postMessageToIframeApp.resetHistory();
        window.setTimeout.resetHistory();

        // Act
        this.oSessionHandler.notifyServer();

        // Assert
        assert.strictEqual(sap.ushell.Container.sessionKeepAlive.callCount, 0,
            "Time from last user action is bigger than sessionTimeoutIntervalInMinutes -> sessionKeepAlive is not called");
        assert.strictEqual(AppLifeCycle.postMessageToIframeApp.callCount, 0,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> AppLifeCycle.postMessageToIframeApp is not called");
        assert.strictEqual(window.setTimeout.callCount, 1,
            "Time from last user action is smaller than sessionTimeoutIntervalInMinutes -> setTimeout called");
        assert.strictEqual(window.setTimeout.args[0][1], oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes * 60 * 1000,
            "setTimeout called in order to wait another sessionTimeoutIntervalInMinutes interval");

        // Cleanup
        window.setTimeout.restore();
    });

    QUnit.module("monitorCountdown", {
        beforeEach: function (assert) {

            // Perform a local ushell bootstrap before
            return sap.ushell.bootstrap("local").then(function () {

                // Create session handler for testing and sandbox
                this.oSessionHandler = new SessionHandler(AppLifeCycle);
                oSinon = sinon.sandbox.create();

            }.bind(this));
         },
        afterEach: function () {

            // Clean up
            oSinon.restore();
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);

            delete sap.ushell.Container;
        }
    });

    QUnit.test("Confirm countdown works", function (assert) {

        // Arrange
        // ... Session handler
        var oSessionHandler = this.oSessionHandler;
        oSessionHandler.init(oSessionHandlerConfigReminderNoSignout);

        // ... Spies and stubs
        oSinon.spy(oSessionHandler, "handleSessionOver");

        var oCloseKeepAliveDialogSpy = oSinon.spy();
        oSessionHandler.oSessionKeepAliveDialog = {
            close: oCloseKeepAliveDialogSpy
        };

        var oSessionExpiredDialogOpenSpy = oSinon.spy();
        oSinon.stub(oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });

        var oSetModelPropertySpy = oSinon.spy();
        oSessionHandler.oModel = {
            setProperty: oSetModelPropertySpy
        };

        oSessionHandler.logout = oSinon.spy();
        var oEventBusPublishStub = oSinon.stub(sap.ui.getCore().getEventBus(), "publish").returns({});

        // ... Prepare timing
        //     Last user interaction happened just now
        var dNowInSeconds = new Date().getTime();
        var oClock = oSinon.useFakeTimers(dNowInSeconds);
        oSessionHandler.putTimestampInStorage(dNowInSeconds); // Set timestamp last user interaction

        //     Advance time to point where pop up should appear
        var timeToPopupInMs = (oSessionHandlerConfigReminderNoSignout.sessionTimeoutIntervalInMinutes
            - oSessionHandlerConfigReminderNoSignout.sessionTimeoutReminderInMinutes) * 60 * 1000;
        oClock.tick(timeToPopupInMs);

        // Act
        oSessionHandler.monitorCountdown(true);

        // Assert
        assert.strictEqual(oSetModelPropertySpy.calledOnce, true, "Monitoring has been started");
        assert.strictEqual(oSetModelPropertySpy.args[0][0], "/SessionRemainingTimeInSeconds", "The Model has been updated");
        assert.strictEqual(oSetModelPropertySpy.args[0][1], 300, "Initially 300 seconds left until timeout");
        assert.strictEqual(oSessionHandler.handleSessionOver.notCalled, true, "Session is still alive");
        assert.strictEqual(oSessionHandler.logout.notCalled, true, "logout() was not called");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, false, "Session timeout dialog not yet opened");

        oClock.tick(500); // 500 msec later
        assert.strictEqual(oSetModelPropertySpy.calledTwice, true, "+ 0.5 sec: 2nd check");
        assert.ok(oSetModelPropertySpy.args[1][1] === 300 || oSetModelPropertySpy.args[1][1] === 299, true, "Still around 300 seconds left");

        oClock.tick(500);
        assert.strictEqual(oSetModelPropertySpy.args[2][1], 299, "+ 1.0 sec: 299 seconds remaining");
        assert.strictEqual(oSessionHandler.handleSessionOver.notCalled, true, "Session is still alive");
        assert.strictEqual(oEventBusPublishStub.notCalled, true, "No event published yet");
        assert.strictEqual(oCloseKeepAliveDialogSpy.notCalled, true, "Keep alive dialog still open");
        assert.strictEqual(oSessionHandler.logout.notCalled, true, "logout() was not called");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, false, "Session timeout dialog not yet opened");

        oClock.tick(5*60*1000); // 5 minutes later
        assert.strictEqual(oSessionHandler.handleSessionOver.calledOnce, true, "+ 5 min: Session is over");
        assert.strictEqual(oEventBusPublishStub.calledOnce, true, "+ 5 min: An event has been published");
        assert.deepEqual(oEventBusPublishStub.args[0], ["launchpad", "sessionTimeout"], "That was a launchpad/sessionTimeout event");
        assert.strictEqual(oCloseKeepAliveDialogSpy.calledOnce, true, "KeepAlive dialog was closed");
        assert.strictEqual(oSessionHandler.logout.notCalled, true, "logout() was not called");
        assert.strictEqual(oSessionHandler.createSessionExpiredDialog.calledOnce, true, "Session timeout dialog was created");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, true, "Session timeout dialog was opened");
    });

    QUnit.module("handleSessionOver", {
        beforeEach: function (assert) {

            // Perform a local ushell bootstrap before
            return sap.ushell.bootstrap("local").then(function () {

                // Create session handler for testing and sandbox
                this.oSessionHandler = new SessionHandler(AppLifeCycle);
                oSinon = sinon.sandbox.create();

            }.bind(this));
         },
        afterEach: function () {
            // Clean up
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            oSinon.restore();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("When reminder and automatic signout are disabled", function (assert) {

        // Arrange
        // ... Session handler
        this.oSessionHandler.init(oSessionHandlerConfigNoReminderNoSignout);

        // ... Spies and stubs
        var oSessionExpiredDialogOpenSpy = oSinon.spy();
        var oSessionExpiredDialogStub = oSinon.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });
        var oEventBusPublishStub = oSinon.stub(sap.ui.getCore().getEventBus(), "publish").returns({});
        oSinon.stub(this.oSessionHandler, "logout").returns(null);

        // Act
        this.oSessionHandler.handleSessionOver();

        // Assert
        assert.strictEqual(oEventBusPublishStub.calledOnce, true, "An event has been published");
        assert.deepEqual(oEventBusPublishStub.args[0], ["launchpad", "sessionTimeout"], "That was a launchpad/sessionTimeout event");
        assert.strictEqual(this.oSessionHandler.logout.calledOnce, false, "logout() was not called as an automatic timmeout was not configured");
        assert.strictEqual(oSessionExpiredDialogStub.calledOnce, true, "SessionExpiredDialog was opened");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, true, "SessionExpiredDialog was opened");
    });

    QUnit.test("When reminder is disabled and automatic signout is enabled", function (assert) {
        // Arrange

        // ... Session handler
        this.oSessionHandler.init(oSessionHandlerConfigNoReminderNoSignout);
        this.oSessionHandler.oConfig.enableAutomaticSignout = true;

        // ... Some spies and stubs
        var oSessionExpiredDialogOpenSpy = oSinon.spy();
        oSinon.stub(this.oSessionHandler, "createSessionExpiredDialog").returns({
            open: oSessionExpiredDialogOpenSpy
        });
        var oEventBusPublishStub = oSinon.stub(sap.ui.getCore().getEventBus(), "publish").returns({});
        this.oSessionHandler.logout = oSinon.stub(this.oSessionHandler, "logout").returns(null);

        // Act
        this.oSessionHandler.handleSessionOver();

        // Assert
        assert.strictEqual(oEventBusPublishStub.calledOnce, true, "An event has been published");
        assert.deepEqual(oEventBusPublishStub.args[0], ["launchpad", "sessionTimeout"], "That was a launchpad/sessionTimeout event");
        assert.strictEqual(this.oSessionHandler.logout.calledOnce, true, "logout() was called as configured");
        assert.strictEqual(this.oSessionHandler.createSessionExpiredDialog.calledOnce, false, "SessionExpiredDialog was opened");
        assert.strictEqual(oSessionExpiredDialogOpenSpy.calledOnce, false, "SessionExpiredDialog was opened");

        // Cleanup
        oSinon.restore();
    });

    QUnit.module("continueWorkingButtonPressHandler", {
        beforeEach: function (assert) {

            // Perform a local ushell bootstrap before
            return sap.ushell.bootstrap("local").then(function () {

                // Create session handler for testing and sandbox
                this.oSessionHandler = new SessionHandler(AppLifeCycle);
                oSinon = sinon.sandbox.create();

            }.bind(this));
         },
        afterEach: function () {
            // Clean up
            oSinon.restore();
            delete sap.ushell.Container;
            // resets window's local storage
            this.oSessionHandler.putTimestampInStorage("");
        }
    });

    QUnit.test("Confirm user inactivity monitoring gets restarted properly on user action", function (assert) {

        // Arrange
        var oKeepAliveDialogCloseSpy = oSinon.spy();
        this.oSessionHandler.oSessionKeepAliveDialog = {
            close: oKeepAliveDialogCloseSpy
        };

        oSinon.stub(this.oSessionHandler, "_getCurrentDate").returns("CurrentDate");
        oSinon.spy(this.oSessionHandler, "putTimestampInStorage");
        oSinon.stub(this.oSessionHandler, "monitorUserIsInactive");
        oSinon.stub(this.oSessionHandler, "attachUserEvents");
        oSinon.stub(AppLifeCycle, "postMessageToIframeApp");

        // Act
        this.oSessionHandler.continueWorkingButtonPressHandler();

        // Assert
        assert.strictEqual(oKeepAliveDialogCloseSpy.calledOnce, true, "Keep alive dialog gets closed.");
        assert.strictEqual(this.oSessionHandler.putTimestampInStorage.calledOnce, true, "Timestamp for user activity gets updated");
        assert.strictEqual(this.oSessionHandler.putTimestampInStorage.args[0][0], "CurrentDate", "... with the current time stamp.");
        assert.strictEqual(this.oSessionHandler.getTimestampFromStorage(), "CurrentDate", "Correct date is stored in LocalStorage.");
        assert.strictEqual(this.oSessionHandler.monitorUserIsInactive.calledOnce, true, "monitorUserIsInactive() is called once.");
        assert.strictEqual(this.oSessionHandler.attachUserEvents.calledOnce, true, "attachUserEvents() is called.");
        assert.strictEqual(AppLifeCycle.postMessageToIframeApp.calledOnce, true, "The app gets informed.");
    });

    QUnit.test("Confirm user inactivity monitoring gets restarted properly when method was implicitly triggered", function (assert) {

        // Arrange
        var oKeepAliveDialogCloseSpy = oSinon.spy();
        this.oSessionHandler.oSessionKeepAliveDialog = {
            close: oKeepAliveDialogCloseSpy
        };

        this.oSessionHandler.putTimestampInStorage("CurrentDate");
        oSinon.spy(this.oSessionHandler, "putTimestampInStorage");
        oSinon.stub(this.oSessionHandler, "monitorUserIsInactive");
        oSinon.stub(this.oSessionHandler, "attachUserEvents");
        oSinon.stub(AppLifeCycle, "postMessageToIframeApp");

        // Act
        this.oSessionHandler.continueWorkingButtonPressHandler(true);

        // Assert
        assert.strictEqual(oKeepAliveDialogCloseSpy.calledOnce, true, "Keep alive dialog gets closed.");
        assert.strictEqual(this.oSessionHandler.putTimestampInStorage.callCount, 0, "Timestamp for user activity is not updated");
        assert.strictEqual(this.oSessionHandler.getTimestampFromStorage(), "CurrentDate", "Correct date is stored in LocalStorage.");
        assert.strictEqual(this.oSessionHandler.monitorUserIsInactive.calledOnce, true, "monitorUserIsInactive() is called once.");
        assert.strictEqual(this.oSessionHandler.attachUserEvents.calledOnce, true, "attachUserEvents() is called.");
        assert.strictEqual(AppLifeCycle.postMessageToIframeApp.calledOnce, true, "The app gets informed.");
    });

    QUnit.module("getLocalStorage", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oIsLocalStorageSupportedStub = sinon.stub(this.oSessionHandler, "_isLocalStorageSupported");
        },
        afterEach: function () {
            clearTimeout(this.oSessionHandler.oMonitorUserIsInactiveTimer);
            clearTimeout(this.oSessionHandler.notifyServerTimer);
            clearTimeout(this.oSessionHandler.oUserActivityTimer);
            this.oIsLocalStorageSupportedStub.restore();
        }
    });

    QUnit.test("creates a new instance of sap.ui.util.Storage, checks if it is supported by the browser and saves the reference for later use", function (assert) {

        // Arrange
        var oResult,
            oResultOfSecondCall;
        this.oIsLocalStorageSupportedStub.returns(true);

        // Act
        oResult = this.oSessionHandler.getLocalStorage();
        oResultOfSecondCall = this.oSessionHandler.getLocalStorage();

        // Assert
        assert.ok(oResult instanceof Storage, "Returns an instance of sap.ui.util.Storage");
        assert.strictEqual(oResult, oResultOfSecondCall, "Returns the same instance of sap.ui.util.Storage when calling getLocalStorage two times");
    });

    QUnit.test("does not try to create multiple instances of sap.ui.util.Storage when the browser does not support localStorage", function (assert) {
        // Arrange
        var oResult,
            oResultOfSecondCall;
        this.oIsLocalStorageSupportedStub.returns(false);
        // Act
        oResult = this.oSessionHandler.getLocalStorage();
        oResultOfSecondCall = this.oSessionHandler.getLocalStorage();
        // Assert
        assert.strictEqual(oResult, false, "returns an false in case _isLocalStorageSupported fails");
        assert.strictEqual(oResultOfSecondCall, false, "returns false for further calls of _isLocalStorageSupported");
        assert.ok(this.oIsLocalStorageSupportedStub.calledOnce, "_isLocalStorageSupported was only called once");
    });

    QUnit.module("_isLocalStorageSupported", {
        beforeEach: function () {
            this.oSessionHandler = new SessionHandler(AppLifeCycle);
            this.oFakeStorage = {
                isSupported: sinon.stub()
            };
        }
    });

    QUnit.test("returns true if localStorage is supported", function (assert) {
        // Arrange
        var bResult;
        this.oFakeStorage.isSupported.returns(true);
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported(this.oFakeStorage);
        // Assert
        assert.ok(bResult, "expected result was returned");
    });

    QUnit.test("returns false and logs a warning if sap.ui.util.Storage reports it is not supported", function (assert) {
        // Arrange
        var oWarningStub = sinon.stub(Log, "warning"),
            bResult;
        this.oFakeStorage.isSupported.returns(false);
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported(this.oFakeStorage);
        // Assert
        assert.notOk(bResult, "expected result was returned");
        assert.ok(oWarningStub.calledOnce, "warning was logged");
        oWarningStub.restore();
    });

    QUnit.test("returns false and logs a warning if localStorage is not supported by the browser", function (assert) {
        // Arrange
        var oWarningStub = sinon.stub(Log, "warning"),
            bResult;
        // Act
        bResult = this.oSessionHandler._isLocalStorageSupported({}); // sap.ui.util.Storage.isSupported will throw an exception in this case so lets make it throw!
        // Assert
        assert.notOk(bResult, "expected result was returned");
        assert.ok(oWarningStub.calledOnce, "warning was logged");
        oWarningStub.restore();
    });
});
