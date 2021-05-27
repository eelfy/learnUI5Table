// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview Integration tests for the User Defaults Parameter Persistence flow.
 */
sap.ui.require([
    "sap/ui/core/util/MockServer",
    "sap/ui/core/mvc/Controller",
    "sap/ushell/test/adapters/cflp/_UserDefaultPersistence/serverData",
    "sap/ushell/test/adapters/cflp/_UserDefaultPersistence/CDMServiceSiteStub",
    "sap/ushell/services/URLParsing",
    "sap/ushell/services/ReferenceResolver",
    "sap/ushell/services/ClientSideTargetResolution",
    "sap/ushell/adapters/cdm/ClientSideTargetResolutionAdapter",
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/Component"
], function (
    MockServer,
    Controller,
    oMockData,
    CDMServiceSiteStub,
    // To stub sap.ushell.Container.getService to manually initialize CSTR
    URLParsing,
    ReferenceResolver,
    ClientSideTargetResolution,
    ClientSideTargetResolutionAdapter,
    URI,
    jQuery,
    Component
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("UserDefaultParameterPersistence", function (hooks) {
        // This is a nesting module for the common stubs for all the tests, including the server configuration.
        // Change the server response by editing the corresponding server object!
        hooks.beforeEach(function (assert) {
            // This fnDone will block the test execution until the before assync processes are done
            var fnDone = assert.async();

            // Stub some general methods
            this.sLanguage = "EN";
            this.sClient = "120";
            this.oGetUserStub = {
                getLanguage: sinon.stub().returns(this.sLanguage)
            };
            this.oGetClientStub = {
                getClient: sinon.stub().returns(this.sClient),
                getProductVersion: sinon.stub().returns("Version"),
                getProductName: sinon.stub().returns("Name"),
                getSystemName: sinon.stub().returns("Name"),
                getSystemRole: sinon.stub().returns("Role"),
                getTenantRole: sinon.stub().returns("Role")
            };
            sap.ushell = sap.ushell || {};
            sap.ushell.Container = sap.ushell.Container || {};
            sap.ushell.Container.getUser = function () {
                return this.oGetUserStub;
            }.bind(this);
            sap.ushell.Container.getLogonSystem = function () {
                return this.oGetClientStub;
            }.bind(this);

            // We stub the CDM service #getSite to use our test data
            sap.ushell.Container.getServiceAsync = sinon.stub();
            sap.ushell.Container.getServiceAsync.withArgs("CommonDataModel").returns(Promise.resolve(CDMServiceSiteStub));

            // To initialize the CSTR without running the shell, we need
            // to mock the sap.ushell.Container.getService method at "hand deliver"
            // the corresponding services and adapters.
            var oReferenceResolver = new ReferenceResolver();
            sap.ushell.Container.getServiceAsync.withArgs("ReferenceResolver").returns(Promise.resolve(oReferenceResolver));

            sap.ushell.Container.getService = sinon.stub();
            sap.ushell.Container.getService.withArgs("ReferenceResolver").returns(oReferenceResolver);

            sap.ushell.Container.getServiceAsync.withArgs("URLParsing").returns(Promise.resolve(new URLParsing()));
            sap.ushell.Container.getService.withArgs("URLParsing").returns(new URLParsing());

            // the plugin manager is used as a fallback, so we mock it to be able to test failures
            // IMPORTANT: in case of failure, the process is NOT resolved!!!!
            var oPluginManagerStub = {
                loadPlugins: function () {
                    var oDeferred = new jQuery.Deferred();
                    Component.create({
                        name: "sap.ushell.demo.UserDefaultPluginSample",
                        componentData: {
                            config: {
                                localMode: "true"
                            }
                        }
                    }).then(oDeferred.resolve);
                    return oDeferred.promise();
                }
            };
            sap.ushell.Container.getService.withArgs("PluginManager").returns(oPluginManagerStub);

            // Initialize the CSTR. We need to do this manually: first we instantiate the Adapter and then pass it to the service.
            var oCSTRAdapter = new ClientSideTargetResolutionAdapter({}, "", {});
            this.oCSTRService = new ClientSideTargetResolution(oCSTRAdapter);

            // Our Mock server structure
            // Here we mock the content providers (mostly their content). The routing to them
            // is handled by our mock App Router
            // Headers are non-editable (for now?)
            this.mMockContentProviders = {
                first: {
                    name: "FirstServer",
                    baseUrl: "/ZEUGS",
                    serverResponse: {
                        iStatusCode: 200,
                        oJsonObjectOrString: oMockData.firstServer,
                        csrfToken: "first-token"
                    },
                    receivedRequests: {
                        post: [],
                        get: []
                    }
                },
                second: {
                    name: "SecondServer",
                    baseUrl: "/DINGS",
                    serverResponse: {
                        iStatusCode: 200,
                        oJsonObjectOrString: oMockData.secondServer,
                        csrfToken: "second-token"
                    },
                    receivedRequests: {
                        post: [],
                        get: []
                    }
                },
                // Use this server to test the default System Alias
                // This corresponds to a direct call to a FE server
                default: {
                    name: "DefaultServer",
                    baseUrl: "/",
                    serverResponse: {
                        iStatusCode: 200,
                        oJsonObjectOrString: oMockData.defaultServer,
                        csrfToken: "third-token"
                    },
                    receivedRequests: {
                        post: [],
                        get: []
                    }
                },
                wrongRequest: {
                    name: "wrong request",
                    serverResponse: {
                        iStatusCode: 500,
                        oJsonObjectOrString: "wrong request",
                        csrfToken: "wrongRequest-token"
                    },
                    receivedRequests: {
                        post: [],
                        get: []
                    }
                }
            };
            // Prepare a Mockserver that works as an AppRouter to the aforementioned
            // content providers.

            // Router itself (read-only)
            // This just matches the oData call and its position in the url and then
            // tries to match the prefix that will route the call to the corresponding
            // content provider servers ("baseURL" in the object this.mMockContentProviders)
            this.processRoute = function (oURLRequest) {
                var oResponseObject = {
                    iStatusCode: 404,
                    oJsonObjectOrString: "Page not found"
                };
                // HttpClient encodes some of the calls so we need to encode everything to be sure we match correctly
                var sBaseURl = new URI().path("/sap/opu/odata/UI2/INTEROP/PersContainers(category='P',id='sap.ushell.UserDefaultParameter')").path();
                var sEncodedOData = new URI().path("?$expand=PersContainerItems").path();
                var sEncodedRequest = (new URI().path(oURLRequest.url)).path();

                // We need both the baseUrl and the Odata request
                if (sEncodedRequest.indexOf(sBaseURl) !== -1 && sEncodedRequest.indexOf(sEncodedOData) !== -1) {
                    // Nothing before the baseUrl -> no pathprefix -> default case
                    if (sEncodedRequest.indexOf(sBaseURl) === 0) {
                        oResponseObject = this.mMockContentProviders.default.serverResponse;
                        this.mMockContentProviders.default.receivedRequests.get.push(oURLRequest);
                    }
                    if (sEncodedRequest.indexOf(this.mMockContentProviders.first.baseUrl) === 0) {
                        oResponseObject = this.mMockContentProviders.first.serverResponse;
                        this.mMockContentProviders.first.receivedRequests.get.push(oURLRequest);
                    }
                    if (sEncodedRequest.indexOf(this.mMockContentProviders.second.baseUrl) === 0) {
                        oResponseObject = this.mMockContentProviders.second.serverResponse;
                        this.mMockContentProviders.second.receivedRequests.get.push(oURLRequest);
                    }
                } else {
                    oResponseObject = this.mMockContentProviders.wrongRequest.serverResponse;
                }
                return oResponseObject;
            }.bind(this);

            this.processPostRequest = function (oURLRequest) {
                var oResponseObject = {
                    iStatusCode: 404,
                    oJsonObjectOrString: "Page not found"
                };

                // HttpClient encodes some of the calls so we need to encode everything to be sure we match correctly
                var sBaseURl = new URI("/sap/opu/odata/UI2/INTEROP/PersContainers").path();
                var sEncodedRequest = new URI(oURLRequest.url).path();

                if (sEncodedRequest.indexOf(sBaseURl) !== -1) {
                    // Nothing before the baseUrl -> no pathprefix -> default case
                    if (sEncodedRequest.indexOf(sBaseURl) === 0) {
                        this.mMockContentProviders.default.receivedRequests.post.push(oURLRequest);
                        oResponseObject.iStatusCode = this.mMockContentProviders.default.serverResponse.iStatusCode;
                        oResponseObject.csrfToken = this.mMockContentProviders.default.serverResponse.csrfToken;
                    }
                    if (sEncodedRequest.indexOf(this.mMockContentProviders.first.baseUrl) === 0) {
                        this.mMockContentProviders.first.receivedRequests.post.push(oURLRequest);
                        oResponseObject.iStatusCode = this.mMockContentProviders.first.serverResponse.iStatusCode;
                        oResponseObject.csrfToken = this.mMockContentProviders.first.serverResponse.csrfToken;
                    }
                    if (sEncodedRequest.indexOf(this.mMockContentProviders.second.baseUrl) === 0) {
                        this.mMockContentProviders.second.receivedRequests.post.push(oURLRequest);
                        oResponseObject.iStatusCode = this.mMockContentProviders.second.serverResponse.iStatusCode;
                        oResponseObject.csrfToken = this.mMockContentProviders.second.serverResponse.csrfToken;
                    }
                } else {
                    oResponseObject = this.mMockContentProviders.wrongRequest.serverResponse;
                }

                return oResponseObject;
            }.bind(this);


            // Mock FE server's AppRouter
            // In cFLP, our calls will first go to a FE server that has a so-called App-Router which
            // will then forward our call to the corresponding S/4 content provider (another server).
            // Here, we moch that first server and, specifically, its functionallity as an App-Router
            // (hence the designation as oMockAppRouter), whereas the contetn providers (mostly mock
            // data) are being mocked in the map above mMockContentProviders.
            // For more inforamtion, check the concept "User Defaults in cFLP"

            // We catch all requests and filter them in #processResponse.
            // A refactoring making the UI5 Regex work would be nice.
            this.oMockAppRouter = new MockServer({ rootUri: "/" });
            this.oMockAppRouter.setRequests([{
                method: "GET",
                path: ".*",
                response: function (xhr) {
                    var oResponse = this.processRoute(xhr);
                    xhr.respondJSON(
                        oResponse.iStatusCode,
                        {
                            "x-csrf-token": oResponse.csrfToken
                        },
                        oResponse.oJsonObjectOrString
                    );
                }.bind(this)
            },
            {
                method: "POST",
                path: ".*",
                response: function (xhr) { // xhr the request
                    var oResponse = this.processPostRequest(xhr);
                    xhr.respondJSON(
                        oResponse.iStatusCode, // Status
                        {
                            "x-csrf-token": oResponse.csrfToken
                        },
                        ""
                    );
                }.bind(this)
            }
            ]);
            this.oMockAppRouter.start();

            // This is the earliest point we can load the adapter due to HttpClient's
            // binding of XMLHttpRequest: we need to mock the server _before_ the client
            // is initialized (After initialization, the HttpClient keeps a copy of the
            // pointer to the _original_ XMLHttpRequest and is not affected by the stubbing)
            sap.ui.require([
                "sap/ushell/services/UserDefaultParameters",
                "sap/ushell/services/UserDefaultParameterPersistence",
                "sap/ushell/adapters/cflp/UserDefaultParameterPersistenceAdapter",
                "sap/ushell/utils/DynamicTileRequest"
            ], function (
                UserDefaultService,
                PersistenceService,
                PersistenceAdapter,
                DynamicTileRequest
            ) {
                // Here we finish stubbing sap.ushell.container.getService to enable
                // the loading of the missing pieces in the User Default's persistence
                // flow. Note that the flow is loaded "on demand" by the CSTR, that is why we could
                // initialize it first.
                // NOTE: we are NOT stubbing any part of the flow, just the #getService call. The
                // objects returned by our getService are the same the service would return.
                this.PersistenceAdapter = PersistenceAdapter;
                this.oAdapter = new this.PersistenceAdapter();
                sap.ushell.Container.getService.withArgs("UserDefaultParameters").returns(new UserDefaultService());
                sap.ushell.Container.getService.withArgs("ClientSideTargetResolution").returns(this.oCSTRService);
                sap.ushell.Container.getServiceAsync.withArgs("ClientSideTargetResolution").returns(Promise.resolve(this.oCSTRService));

                var oPersistenceService = new PersistenceService(this.oAdapter);
                sap.ushell.Container.getServiceAsync.withArgs("UserDefaultParameterPersistence").returns(Promise.resolve(oPersistenceService));
                this.DynamicTileRequest = DynamicTileRequest;

                fnDone();
            }.bind(this));
        });
        hooks.afterEach(function () {
            this.oMockAppRouter.destroy();
            delete sap.ushell.Container;
        });

        // These are "black-box" tests, so we only need to check what CSTR returns.
        // If the resolved object contains the default parameter with the expected
        // content, the test worked.
        QUnit.module("Navigation call");

        QUnit.test("the intent resolves with the correct user default", function (assert) {
            var done = assert.async();
            var sExpectedValueFirstSystem = "Nice_place_you_have_got_here";
            var sExpectedAppIdFirstSystem = "UserDefaultsApp";
            var oResolvedIntentFirstSystem = this.oCSTRService.resolveTileIntent("#UserDefault-start");

            oResolvedIntentFirstSystem.done(function (oResult) {
                assert.ok(true, "Resolution returned");
                assert.strictEqual(oResult.appId, sExpectedAppIdFirstSystem, "The correct app was matched");
                assert.strictEqual(oResult.startupParameters.myDefaultedParameter[0], sExpectedValueFirstSystem, "The correct startup parameters were retrieved from first system");
                done();
            });

            oResolvedIntentFirstSystem.fail(function (oResult) {
                assert.ok(false, "Resolution failed");
                done();
            });

            return oResolvedIntentFirstSystem;
        });

        QUnit.test("two intents pointing at two different systems resolve correctly", function (assert) {
            // Arrange
            var sExpectedValueFirstSystem = "Nice_place_you_have_got_here";
            var sExpectedAppIdFirstSystem = "UserDefaultsApp";
            var sExpectedValueSecondSystem = "The_other_place_is_nicer";
            var sExpectedAppIdSecondSystem = "UserDefaultsApp";

            var oResolvedIntentFirstSystem = this.oCSTRService.resolveTileIntent("#UserDefault-start");
            var oResolvedIntentSecondSystem = this.oCSTRService.resolveTileIntent("#OtherUserDefault-start");

            // Act
            var oBothSystemsResolved = jQuery.when(oResolvedIntentFirstSystem, oResolvedIntentSecondSystem);

            // Assert
            oBothSystemsResolved.done(function (oResultFirst, oResultSecond) {
                assert.ok(true, "Resolution returned");
                assert.strictEqual(oResultFirst.appId, sExpectedAppIdFirstSystem, "The correct app was matched in the first system");
                assert.strictEqual(oResultFirst.startupParameters.myDefaultedParameter[0], sExpectedValueFirstSystem, "The correct startup parameters were retrieved from first system");
                assert.strictEqual(oResultSecond.appId, sExpectedAppIdSecondSystem, "The correct app was matched in the second system");
                assert.strictEqual(oResultSecond.startupParameters.myDefaultedParameter[0], sExpectedValueSecondSystem, "The correct startup parameters were retrieved from second system");
            });

            oBothSystemsResolved.fail(function () {
                assert.ok(false, "Resolution failed");
            });

            return oBothSystemsResolved;
        });

        QUnit.test("the system context has no path prefix", function (assert) {
            // Arrange
            var sExpectedValue = "VanillaActivity";
            var sExpectedAppId = "UserDefaultDefault";

            // Act
            var oResolvedIntentFirstSystem = this.oCSTRService.resolveTileIntent("#UserDefault-default");

            // Assert
            oResolvedIntentFirstSystem.done(function (oResult) {
                assert.ok(true, "Resolution returned");
                assert.strictEqual(oResult.appId, sExpectedAppId, "The correct app was matched");
                assert.strictEqual(oResult.startupParameters.myDefaultedParameter[0], sExpectedValue, "The correct startup parameters were retrieved from default system");
            });

            oResolvedIntentFirstSystem.fail(function () {
                assert.ok(false, "Resolution failed");
            });

            return oResolvedIntentFirstSystem;
        });

        // This is also a black-box test of the whole flow, this time starting from a Dynamic tile.
        // We instantiate the tile and only mock one method: the #refresh in DynamicTileRequest (as well as the whole
        // model) (see tests).
        // Note, that, similar to the tile tests, we only need to check the resulting call
        // for inserted default parameters, no step in between is checked or mocked.
        QUnit.module("Dynamic Tile");

        QUnit.test("the intent resolves with the correct user default", function (assert) {
            // Arrange
            var done = assert.async();
            var sExpectedURL = location.origin + "/my/super/duper/service/?myDefaultParameter=SuperFunkyData&sap-language=EN";

            // NOTE: we are not stubbing any part of the User Defaults flow: this refresh call
            // is the one made by the DynamicTileRequest to its service _after_ getting the results
            // from the User Defaults Parameter Persistence service.
            // The address in this call is the actual result of the black-box test.
            var oRefreshStub = sinon.stub(this.DynamicTileRequest.prototype, "refresh", function () {
                // Assert
                assert.ok(true, "Resolution returned");
                var sResult = this._getRequestUrl();
                assert.strictEqual(sResult, sExpectedURL, "The DynamicTile requested the correct url");

                //Cleanup
                oRefreshStub.restore();

                done();
            });

            Controller.create({ name: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile" })
                .then(function (oDynamicTile) {
                    var oGetPropertyStub = sinon.stub();
                    // Probably should get this from a service and not hard code it...
                    // Still, not essential to the User Default logic.
                    oGetPropertyStub.withArgs("/configuration/serviceUrl").returns("/my/super/duper/service/?myDefaultParameter={%%UserDefault.DynamicData%%}");
                    oGetPropertyStub.withArgs("/properties/contentProviderId").returns("contentProviderUserDefaultsFirstSystem");

                    oDynamicTile.getView = sinon.stub().returns({
                        getModel: sinon.stub().returns({
                            getProperty: oGetPropertyStub,
                            setProperty: sinon.spy()
                        })
                    });

                    // Act
                    oDynamicTile.loadData(0);
                });
        });

        QUnit.module("Save");

        QUnit.test("Stores the correct value on the server", function (assert) {
            var sName = "ProfitCenter";
            var oValueObject = {value: "someValue"};

            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");

            var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

            return oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                return new Promise(function (resolve, reject) {
                    oUserDefaultParameters.editorSetValue(sName, oValueObject, oSystemContext)
                        .done(function () {
                            var oPostData = JSON.parse(this.mMockContentProviders.first.receivedRequests.post[0].requestBody);
                            var iIndex = oPostData.PersContainerItems.findIndex(function (item) { return item.id === "ProfitCenter"; });
                            var oProfitCenterValue = JSON.parse(oPostData.PersContainerItems[iIndex].value);
                            assert.strictEqual(oProfitCenterValue.value, "someValue", "The right value was passed to the server");
                            assert.ok(oProfitCenterValue._shellData, "_shellData is present");
                            resolve();
                        }.bind(this))
                        .fail(reject);
                }.bind(this));
            }.bind(this));
        });

        QUnit.test("Stores the correct values on the corresponding servers when using different content providers", function (assert) {
            var sName = "ProfitCenter";
            var oValueObjectFirst = {value: "someValue"};
            var oValueObjectSecond = {value: "someOtherMoreFancyValue"};

            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");

            var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

            var oFirstSave = oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                return new Promise(function (resolve, reject) {
                    oUserDefaultParameters.editorSetValue(sName, oValueObjectFirst, oSystemContext)
                        .done(resolve)
                        .fail(reject);
                });
            });
            var oSecondSave = oCSTR.getSystemContext("contentProviderUserDefaultsSecondSystem").then(function (oSystemContext) {
                return new Promise(function (resolve, reject) {
                    oUserDefaultParameters.editorSetValue(sName, oValueObjectSecond, oSystemContext)
                        .done(resolve)
                        .fail(reject);
                });
            });

            return Promise.all([oFirstSave, oSecondSave]).then(function () {
                // First content provider
                var oPostData = JSON.parse(this.mMockContentProviders.first.receivedRequests.post[0].requestBody);
                var iIndex = oPostData.PersContainerItems.findIndex(function (item) { return item.id === "ProfitCenter"; });
                var oProfitCenterValue = JSON.parse(oPostData.PersContainerItems[iIndex].value);
                assert.strictEqual(oProfitCenterValue.value, "someValue", "The right value was passed to the server");
                assert.ok(oProfitCenterValue._shellData, "_shellData is present");
                // Second content provider
                var oPostDataSecond = JSON.parse(this.mMockContentProviders.second.receivedRequests.post[0].requestBody);
                iIndex = oPostDataSecond.PersContainerItems.findIndex(function (item) { return item.id === "ProfitCenter"; });
                oProfitCenterValue = JSON.parse(oPostDataSecond.PersContainerItems[iIndex].value);
                assert.strictEqual(oProfitCenterValue.value, "someOtherMoreFancyValue", "The right value was passed to the server");
                assert.ok(oProfitCenterValue._shellData, "_shellData is present");
            }.bind(this));
        });

        QUnit.test("Stores the correct value on the server if an extended value is set", function (assert) {
            var sName = "CommunityActivity";
            var oValueObject = {extendedValue: "someValue"};

            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");
            return oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

                return new Promise(function (resolve, reject) {
                    oUserDefaultParameters.editorSetValue(sName, oValueObject, oSystemContext)
                        .done(function () {
                            var oPostData = JSON.parse(this.mMockContentProviders.first.receivedRequests.post[0].requestBody);
                            var iIndex = oPostData.PersContainerItems.findIndex(function (item) { return item.id === "CommunityActivity"; });
                            var oProfitCenterValue = JSON.parse(oPostData.PersContainerItems[iIndex].value);
                            assert.strictEqual(oProfitCenterValue.extendedValue, "someValue", "The right value was passed to the server");
                            assert.ok(oProfitCenterValue._shellData, "_shellData is present");
                            resolve();
                        }.bind(this))
                        .fail(reject);
                }.bind(this));
           }.bind(this));
        });

        QUnit.module("Delete");

        QUnit.test("Deletes the right value if undefined is passed as value", function (assert) {
            var sName = "CostCenter";
            var oValueObject = {value: undefined};

            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");

            var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

            return oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                return new Promise(function (resolve, reject) {
                    oUserDefaultParameters.editorSetValue(sName, oValueObject, oSystemContext)
                        .done(function () {
                            var oPostData = JSON.parse(this.mMockContentProviders.first.receivedRequests.post[0].requestBody);
                            var iIndex = oPostData.PersContainerItems.findIndex(function (item) { return item.id === "CostCenter"; });
                            assert.strictEqual(iIndex, -1, "The right persContainerItem was deleted");
                            resolve();
                        }.bind(this))
                        .fail(reject);
                }.bind(this));
            }.bind(this));
        });

        QUnit.module("Get Value from plugin");

        QUnit.test("Recieves the value provided by the plugin and stores it in the BE", function (assert) {
            var fnDone = assert.async();
            var sName = "FirstName";
            var sExpectedValue = "John";

            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");

            var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

            oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                oUserDefaultParameters.getValue(sName, oSystemContext)
                    .done(function (oValue) {
                        var oPostData = JSON.parse(this.mMockContentProviders.first.receivedRequests.post[0].requestBody);
                        var oPostRequest = JSON.parse(oPostData.PersContainerItems[8].value);

                        var bShellDataPresentPostCall = !!oPostRequest._shellData;
                        assert.deepEqual(oValue.value, sExpectedValue, "Value is correct");
                        assert.ok(oValue._shellData, "_shellData is present");
                        assert.strictEqual(oPostRequest.value, sExpectedValue, "The correct value was stored in the front end server");
                        assert.ok(bShellDataPresentPostCall, "The front end server received a _ShellData");
                        fnDone();
                    }.bind(this))
                    .fail(function () {
                        assert.ok(false, "Resolution failed");
                        fnDone();
                    });
            }.bind(this));
        });

        QUnit.module("Error cases");

        QUnit.test("A wrong parameter name returns an empty value", function (assert) {
            var fnDone = assert.async();
            var sName = "FirstName2";
            var oExpected = {value: undefined};
            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");

            var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

            oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                    oUserDefaultParameters.getValue(sName, oSystemContext)
                        .done(function (oValue) {
                            assert.deepEqual(oValue, oExpected, "Value is undefined");
                            fnDone();
                        })
                        .fail(function () {
                            assert.ok(false, "Resolution failed");
                            fnDone();
                        });
            });
        });

        QUnit.module("csrf handling");
        // these test are usually a copy of the usual read/save tests with minimal changes.
        // It would be possible to just combine this with the read/save tests but for the sake
        // of clarity I went for redundancy and clearly delimited tests.

        /**  Some important details:
        *  GET: no matter how often a value is requested, the server is only called ONCE. After
        *       that, the cached content is used, so additional calls to one system won't reflect
        *       if the caching of the csrf token was successfull or not.
        *  POST: here every call should come with its csrf token, as before any POST there is always a GET call
        *        to retrieve the parameter names that indirectly retrieves the csrf token.
        *  csrf caching: the main point of these tests is to check that for each path-prefix a different csrf is
        *        being stored by the HttpClient instance (there is one instance per path-prefix). The first call to
        *        a system (a GET in the context of these test) will have the token set to undefined, subsequent calls
        *        should then send the correct token.
        *        This is acutally testing some very specific HttpClient behaviour, the reason that the tests are here
        *        and not in the HttpClient itself have to do with the complex logic needed to be able to mock the server
        *        calls.
        *  OPEN ISSUE: move this to HttpClient if a mocking of the server is implemented in its tests or if the client is refactored.
        **/
        QUnit.test("Check the correct initialization of the csrf token in two different systems (GET calls)", function (assert) {
            // We call the systems sequentially to be sure of the order of the calls.
            // This has no impact whatsoever besides making the test slightly easier to write.

            var done = assert.async();

            // Trigger the GET call to the first system that will request a csfr-token
            return this.oCSTRService.resolveTileIntent("#UserDefault-start").done(function (/*response is tested somewhere else*/) {
                // Trigger the GET call to the second system that will request a csfr-token and not contain the previous csrf token
                this.oCSTRService.resolveTileIntent("#OtherUserDefault-start").done(function (/*ditto*/) {
                    assert.ok(true, "Resolution returned");
                    //
                    var sCsrfTokenFirstRequest = this.mMockContentProviders.first.receivedRequests.get[0].requestHeaders["x-csrf-token"];
                    var sCsrfTokenSecondRequest = this.mMockContentProviders.second.receivedRequests.get[0].requestHeaders["x-csrf-token"];
                    assert.strictEqual(sCsrfTokenFirstRequest, "fetch", "The csrf was requested for the first system");
                    assert.strictEqual(sCsrfTokenSecondRequest, "fetch", "The csrf was requested for the second system");
                    done();
                }.bind(this));
            }.bind(this))
            .fail(function () {
                assert.ok(false, "Resolution failed");
                done();
            });
        });

        /**  Now we check the quircky interaction between POST and GET:
        * Before any POST request is done by the UserDefaultsParameterPersistenceAdapter,
        * the UserDefaultsContainer is first requested through a GET request (as we always
        * rewrite the whole container instead of updating just one entry). After the first
        * GET request, though, we do not request the Container anymore and all of the POST
        * requests are sent directly.
        *
        * For the csrf token this means that it is requested on the first GET call (csrf header set to "fetch")
        * and then set with each subsequent POST call to that system (csrf header set to the token),
        * while no more GET calls happen.
        *
        * Before the new caching, HttpClient would only remember the _last_ used csrf,
        * leading to problems when switching systems.
        * To correctly check this, we will do a series of calls to two mock systems and
        * check that the correct value is stored and used for each system
        **/
        QUnit.test("Check the correct initialization of the csrf token in two different systems (POST calls)", function (assert) {
            // Arrange
            var sName = "ProfitCenter";
            var oValueObjectFirst = {value: "someValue"};
            var oValueObjectSecond = {value: "someOtherMoreFancyValue"};

            var oCSTR = sap.ushell.Container.getService("ClientSideTargetResolution");
            var oUserDefaultParameters = sap.ushell.Container.getService("UserDefaultParameters");

            // Act
            // We use sequential calls to make the csrf caching easier to track
            var oSavingChain = oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem")
                .then(function (oSystemContext) {
                    return new Promise(function (resolve, reject) {
                        // First System: First GET (fetching the csfr) and first POST
                        oUserDefaultParameters.editorSetValue(sName, oValueObjectFirst, oSystemContext)
                            .done(resolve)
                            .fail(reject);
                    });
                })
                .then(function () {
                    return oCSTR.getSystemContext("contentProviderUserDefaultsSecondSystem").then(function (oSystemContext) {
                        return new Promise(function (resolve, reject) {
                            // Second System: First GET (fetching the csfr) and first POST
                            oUserDefaultParameters.editorSetValue(sName, oValueObjectSecond, oSystemContext)
                                .done(resolve)
                                .fail(reject);
                        });
                    });
                })
                // We repeat the chain to track the csrf token
                // the key here is the swaping of systems: First > Second > First > Second
                .then(function () {
                    return oCSTR.getSystemContext("contentProviderUserDefaultsFirstSystem").then(function (oSystemContext) {
                        return new Promise(function (resolve, reject) {
                            // First System: Second POST (no GET request!)
                            oUserDefaultParameters.editorSetValue(sName, oValueObjectSecond, oSystemContext)
                                .done(resolve)
                                .fail(reject);
                        });
                    });
                })
                .then(function () {
                    return oCSTR.getSystemContext("contentProviderUserDefaultsSecondSystem").then(function (oSystemContext) {
                        return new Promise(function (resolve, reject) {
                            // Second System: Second POST (no GET request!)
                            oUserDefaultParameters.editorSetValue(sName, oValueObjectFirst, oSystemContext)
                                .done(resolve)
                                .fail(reject);
                        });
                    });
                });

            // Assert
            return oSavingChain.then(function () {
                // Check the first GET/POST on the first system
                var sCsrfTokenRequestFirstSystemFirstGet = this.mMockContentProviders.first.receivedRequests.get[0].requestHeaders["x-csrf-token"];
                var sCsrfTokenRequestFirstSystemFirstPost = this.mMockContentProviders.first.receivedRequests.post[0].requestHeaders["x-csrf-token"];
                assert.strictEqual(sCsrfTokenRequestFirstSystemFirstGet, "fetch", "The csrf was requested for the first system");
                assert.strictEqual(sCsrfTokenRequestFirstSystemFirstPost, this.mMockContentProviders.first.serverResponse.csrfToken, "POST request sent the correct csrf token");

                // Check the first GET/POST on the second system
                var sCsrfTokenRequestSecondSystemFirstGet = this.mMockContentProviders.second.receivedRequests.get[0].requestHeaders["x-csrf-token"];
                var sCsrfTokenRequestSecondSystemFirstPost = this.mMockContentProviders.second.receivedRequests.post[0].requestHeaders["x-csrf-token"];
                assert.strictEqual(sCsrfTokenRequestSecondSystemFirstGet, "fetch", "The csrf was requested for the second system");
                assert.strictEqual(sCsrfTokenRequestSecondSystemFirstPost, this.mMockContentProviders.second.serverResponse.csrfToken, "POST request sent the correct csrf token");

                // Check the second POST on the first system
                var bCsrfTokenRequestSecondSystemSecondRequest = !!this.mMockContentProviders.second.receivedRequests.get[1];
                var sCsrfTokenRequestSecondSystemSecondPost = this.mMockContentProviders.second.receivedRequests.post[1].requestHeaders["x-csrf-token"];
                assert.notOk(bCsrfTokenRequestSecondSystemSecondRequest, "The csrf was not request again for the second system");
                assert.strictEqual(sCsrfTokenRequestSecondSystemSecondPost, this.mMockContentProviders.second.serverResponse.csrfToken, "POST request sent the correct csrf token");

                // Check the second POST on the second system
                var bCsrfTokenRequestFirstSystemSecondRequest = !!this.mMockContentProviders.first.receivedRequests.get[1];
                var sCsrfTokenRequestFirstSystemSecondPost = this.mMockContentProviders.first.receivedRequests.post[1].requestHeaders["x-csrf-token"];
                assert.notOk(bCsrfTokenRequestFirstSystemSecondRequest, "The csrf was not request again for the first system");
                assert.strictEqual(sCsrfTokenRequestFirstSystemSecondPost, this.mMockContentProviders.first.serverResponse.csrfToken, "POST request sent the correct csrf token");
            }.bind(this));
        });
    });
});
