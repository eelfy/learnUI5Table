// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview Test User Activity Log
 *
 * @version 1.88.1
 */
sap.ui.require([
    "sap/ushell/UserActivityLog",
    "sap/ushell/services/Container",
    "sap/ushell/EventHub",
    "sap/base/util/ObjectPath"
], function (UserActivityLog, Container, EventHub, ObjectPath) {
    "use strict";

    /*global QUnit, sinon */
    var sandbox = sinon.createSandbox();

    QUnit.module("sap.ushell.test.components.userActivity.userActivityLog", {
        beforeEach: function (assert) {
            this.oStorage = {
                "sap.ushell.UserActivityLog.loggingQueue": "",
                "sap.ushell.UserActivityLog.lastNavigationActionData": ""
            };

            sandbox.stub(window.sessionStorage, "setItem").callsFake(function (key, value) {
                this.oStorage[key] = value;
            }.bind(this));
            sandbox.stub(window.sessionStorage, "getItem").callsFake(function (key) {
                return this.oStorage[key];
            }.bind(this));

            var done = assert.async();

            sap.ushell.bootstrap("local").then(done);
        },
        afterEach: function () {
            delete sap.ushell.Container;

            sandbox.restore();

            UserActivityLog.deactivate();
            EventHub._reset();
        }
    });

    QUnit.test("Activation", function (assert) {
        UserActivityLog.activate(true);

        var userActivityLog = UserActivityLog.getMessageInfo();
        assert.ok(userActivityLog);
    });

    QUnit.test("Checks that User Log size (number of entries) does not exceed the maximum", function (assert) {
        var index,
            userActivityLog,
            firstLogStruct,
            LastLogStruct;
        UserActivityLog.activate(true);

        for (index = 0; index < 60; index++) {
            UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "message", index);
        }

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length, 50);

        firstLogStruct = userActivityLog.userLog[0];
        LastLogStruct = userActivityLog.userLog[userActivityLog.userLog.length-1];

        assert.strictEqual(firstLogStruct.messageID, 10);
        assert.strictEqual(LastLogStruct.messageID, 59);
    });

    QUnit.test("Checks that jQuery.sap.log.error messages are logged", function (assert) {
        var userActivityLog,
            logStruct,
            iNumLogsAfterActivation;

        UserActivityLog.activate(true);
        iNumLogsAfterActivation = UserActivityLog.getMessageInfo().userLog.length;

        // Create log error messages
        jQuery.sap.log.error("0_Error", "Details_0");
        jQuery.sap.log.error("1_Error", "Details_1");
        jQuery.sap.log.error("2_Error", "Details_2");

        jQuery.sap.log.error("3_Error");
        jQuery.sap.log.error("4_Error");
        jQuery.sap.log.error("5_Error");

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterActivation, 6);

        logStruct = userActivityLog.userLog[1 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "1_Error, Details_1");

        logStruct = userActivityLog.userLog[3 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "3_Error");
    });

    QUnit.test("Checks that Message Service error messages are logged", function (assert) {
        var messageService,
            userActivityLog,
            logStruct,
            iNumLogsAfterInit;

        UserActivityLog.activate(true);

        // Create error messages using Message service
        messageService = sap.ushell.Container.getService("Message");

        sap.ushell.Container.getService("Message").init(jQuery.proxy(function () {}, this));

        iNumLogsAfterInit = UserActivityLog.getMessageInfo().userLog.length;

        messageService.error("6_Message", "Title_6");
        messageService.error("7_Message", "Title_7");
        messageService.error("8_Message", "Title_8");

        messageService.error("9_Message");
        messageService.error("10_Message");
        messageService.error("11_Message");

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterInit, 6);

        logStruct = userActivityLog.userLog[1 + iNumLogsAfterInit];
        assert.strictEqual(logStruct.messageText, "7_Message");

        logStruct = userActivityLog.userLog[4 + iNumLogsAfterInit];
        assert.strictEqual(logStruct.messageText, "10_Message");
    });

    QUnit.test("Checks UserActivityLog.addMessage API", function (assert) {
        var userActivityLog,
            logStruct,
            str = "",
            strLength = 0,
            index,
            iNumLogsAfterActivation;

        UserActivityLog.activate(true);
        iNumLogsAfterActivation = UserActivityLog.getMessageInfo().userLog.length;

        // Use UserActivityLog addMessage API
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "12_Action", "12__Action_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "13_Action", "13__Action_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "14_Action");
        UserActivityLog.addMessage(UserActivityLog.messageType.ACTION, "15_Action");
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, "16_Error", "16_Error_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, "17_Error", "17_Error_ID");
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, "18_Error");

        // Test addMessage with large message text
        for (index = 0; index < 250; index = index + 1) {
            str = str + "1234567890";
            strLength = strLength + 10;
        }
        UserActivityLog.addMessage(UserActivityLog.messageType.ERROR, str);

        // Test addMessage with non-existing message type
        UserActivityLog.addMessage("NonExistingType", "20_Error");

        userActivityLog = UserActivityLog.getMessageInfo();
        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterActivation, 8);

        logStruct = userActivityLog.userLog[iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "12_Action");
        assert.strictEqual(logStruct.messageID, "12__Action_ID");

        logStruct = userActivityLog.userLog[4 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "16_Error");
        assert.strictEqual(logStruct.messageID, "16_Error_ID");

        logStruct = userActivityLog.userLog[6 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText, "18_Error");
        assert.notOk(logStruct.messageID);

        logStruct = userActivityLog.userLog[7 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.messageText.length, strLength);
    });

    QUnit.test("Checks that LPD events (i.e. user actions) are logged as 'Actions'", function (assert) {
        var userActivityLog,
            logStruct,
            indexOfActionName,
            iNumLogsAfterActivation;

        UserActivityLog.activate(true);
        iNumLogsAfterActivation = UserActivityLog.getMessageInfo().userLog.length;

        sap.ui.getCore().getEventBus().publish("launchpad", "createGroupAt");
        userActivityLog = UserActivityLog.getMessageInfo();
        logStruct = userActivityLog.userLog[iNumLogsAfterActivation];
        assert.strictEqual(logStruct.type, "ACTION");
        indexOfActionName = logStruct.messageText.indexOf("Create Group");
        assert.notStrictEqual(indexOfActionName, -1);

        sap.ui.getCore().getEventBus().publish("launchpad", "addBookmarkTile", {title: "bookmarkTitle", url: "bookmarkUrl"});
        userActivityLog = UserActivityLog.getMessageInfo();
        logStruct = userActivityLog.userLog[1 + iNumLogsAfterActivation];
        assert.strictEqual(logStruct.type, "ACTION");
        indexOfActionName = logStruct.messageText.indexOf("Add Bookmark");
        assert.notStrictEqual(indexOfActionName, -1);

        assert.strictEqual(userActivityLog.userLog.length - iNumLogsAfterActivation, 2);
    });

    QUnit.test("Checks if the received form factor is one of general form factor types of UI5", function (assert) {
        UserActivityLog.activate(true);
        var userActivityLog = UserActivityLog.getMessageInfo();

        assert.ok(["phone", "tablet", "desktop"].indexOf(userActivityLog.formFactor) >= 0, "form factor valid");
    });

    QUnit.test("Checks that LaunchPage service functions failures are logged", function (assert) {
        // Arrange
        UserActivityLog.activate(true);
        var oClock = sandbox.useFakeTimers();

        var oPromise = sap.ushell.Container.getServiceAsync("LaunchPage")
            .then(function (oLaunchPageService) {
                var oUserActivityLogLaunchPageAdapter = {
                    addBookmark: sandbox.stub().returns(new jQuery.Deferred().reject().promise())
                };
                sandbox.stub(oLaunchPageService, "_getAdapter").returns(oUserActivityLogLaunchPageAdapter);

                // Act
                oLaunchPageService.addBookmark({
                    title: "bookmarkTitle",
                    url: "bookmarkUrl"
                });

                // Assert
                var oUserActivityLog = UserActivityLog.getMessageInfo();
                assert.deepEqual(oUserActivityLog, {
                    userDetails: {
                        fullName: "Default User",
                        userId: "DEFAULT_USER",
                        eMail: "",
                        Language: "en"
                    },
                    shellState: "",
                    navigationData: {},
                    userLog: [
                        {
                            type: "ERROR",
                            messageText: "Fail to add bookmark for URL: bookmarkUrl and Title: bookmarkTitle",
                            time: "1970-01-01T00:00:00.001Z"
                        }
                    ],
                    formFactor: "desktop"
                }, "The correct activity log structure has been found.");
            });

        oClock.runAll();

        return oPromise;
    });

    QUnit.test("Navigation Hash is stored after pressing on tile", function (assert) {
        var orignHash = "origin-hash";
        var emptyFunction = function () {};

        this.getMetadata = function () {
            return {
                getName: function () {
                    return "sap.ushell.ui.launchpad.Tile";
                }
            };
        };

        this.getDebugInfo = function () {};
        this.getId = function () {};
        this.getBindingContext = function () {
            return {
                getPath: function () {},
                getModel: function () {
                    return {
                        getProperty: function () {
                            return { title: "title"};
                        }
                    };
                }};
        };
        this.addMessage = function () {};
        this.messageType = {
            ACTION: ""
        };
        this._getLastNavActionFromStorage = function () {
            return {};
        };
        this._putInSessionStorage = function () {
            return {};
        };

        var getCoreStub = sinon.stub(sap.ui.getCore(), "byId").returns({
            getModel: function () {
                return {
                    getData: function () {
                        return {
                            title: "title"
                        };
                    }
                };
            }
        });

        var putInLocalStorageStub = sinon.stub(this, "_putInSessionStorage");

        window.hasher = {
            getHash: function () {
                return orignHash;
            }
        };

        var fnTilePressed = UserActivityLog._tileOnTapDecorator.apply(this, [emptyFunction]);

        fnTilePressed.apply(this);

        var args = putInLocalStorageStub.args[0][1];
        var resultHash = JSON.parse(args).navigationHash;

        assert.strictEqual(resultHash, "#" + orignHash, "hash from url is - " + orignHash + ", and hash returned from function is - " + resultHash);

        getCoreStub.restore();
        putInLocalStorageStub.restore();
    });

    /*
     * Test that _handleActionEventHub works correctly.  This can only be
     * tested indirectly, by checking that
     * sap.ushell.UserActivityLog.addMessage was called with the right
     * parameters _and_ the eventbus didn't publish the event (just in case a
     * "subscribe" was forgotten in the code)
     */
    QUnit.test("_handleActionEventHub works properly", function (assert) {
        // Arrange
        var done = assert.async();

        // Stop the EventBus from emitting the "showCatalog" event but still allow
        // it to publish other events.
        var oPublishStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish");
        oPublishStub.callThrough();
        oPublishStub.withArgs("showCatalog").returns();

        UserActivityLog.activate(true);

        var oAddMessageSpy = sinon.spy(UserActivityLog, "addMessage");

        // Act
        EventHub.emit("showCatalog", { sId: "showCatalog", oData: Date.now() });

        // Assert
        EventHub.once("showCatalog").do(function () {
            assert.strictEqual(oAddMessageSpy.callCount, 1, "_handleAction was called");
            assert.strictEqual(oAddMessageSpy.args[0][1], "Show Catalog", "_handleAction was called with the right parameters");

            oAddMessageSpy.restore();
            oPublishStub.restore();
            done();
        });
    });
});