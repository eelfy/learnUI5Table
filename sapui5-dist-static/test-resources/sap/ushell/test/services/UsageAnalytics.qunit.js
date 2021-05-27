// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.UsageAnalytics
 * Contains tests for UsageAnalytics service API:
 * - userEnabled
 * - init
 * - setCustomAttributes
 * - logCustomEvent
 */

sap.ui.require([
    "sap/ushell/services/Container",
    "sap/ushell/User"
], function (Container, User) {
    "use strict";

    /* global QUnit, sinon, swa */

    QUnit.module("userEnabled", {
        beforeEach: function () {
            this.oFakeUser = new User({ // default values
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_bluecrystal",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true,
                trackUsageAnalytics: true
            });
        },
        afterEach: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"];
        }
    });

    QUnit.test("configuration is set to \"true\"", function (assert) {
        // Arrgane
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce"
                    }
                }
            }
        };

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(this.oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");

                // Act
                var bResult = oSrvc.userEnabled();

                // Assert
                assert.strictEqual(bResult, true, "userEnabled configuration flag is read correctly");
            });
        }.bind(this));
    });

    QUnit.test("configuration is set to \"false\"", function (assert) {
        // Arrgane
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: false,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce"
                    }
                }
            }
        };

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(this.oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");
                oSrvc._trackCustomEvent = sinon.stub();

                // Act
                oSrvc.logCustomEvent("type", "value", ["firstStringValue", "secondStringValue"]);

                // Assert
                assert.strictEqual(oSrvc._trackCustomEvent.calledOnce, false,
                    "swa.trackCustomEvent never called when service enable flag = false");
            });
        }.bind(this));
    });

    QUnit.test("configuration is set to \"false\" and pubtoken is an empty string", function (assert) {
        // Arrgane
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: false,
                        pubToken: ""
                    }
                }
            }
        };

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(this.oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");

                // Act
                var bResult = oSrvc.userEnabled();

                // Assert
                assert.strictEqual(bResult, false,
                    "userEnabled returns false when pupToken is in the service configuration as an empty string");
            });
        }.bind(this));
    });

    QUnit.test("configuration is set to \"true\" with no pubtoken", function (assert) {
        // Arrgane
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true
                    }
                }
            }
        };

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(this.oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");

                // Act
                var bResult = oSrvc.userEnabled();

                // Assert
                assert.strictEqual(bResult, false, "userEnabled returns false when no pubToken was found in the service configuration");
            });
        }.bind(this));
    });

    QUnit.module("init", {
        afterEach: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"];
        }
    });

    QUnit.test("with set permitted, logClickEvents and logPageLoadEvent false", function (assert) {
        // Arrange
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                        logClickEvents: false,
                        logPageLoadEvents: false,
                        setUsageAnalyticsPermitted: false
                    }
                }
            }
        };

        return sap.ushell.bootstrap("local").then(function () {
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");
                oSrvc._handlingTrackingScripts = sinon.spy();

                // Act
                oSrvc.init();

                // Assert
                assert.strictEqual(swa.clicksEnabled, false, "swa.clicksEnabled is according to the value in the configuration");
                assert.strictEqual(swa.pageLoadEnabled, false, "swa.pageLoadEnabled is according to the value in the configuration");
            });
        });
    });

    QUnit.test("with set permitted false", function (assert) {
        // Arrange
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                        setUsageAnalyticsPermitted: false
                    }
                }
            }
        };

        return sap.ushell.bootstrap("local").then(function () {
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");
                oSrvc._handlingTrackingScripts = sinon.spy();

                // Act
                oSrvc.init();

                // Assert
                assert.strictEqual(swa.clicksEnabled, true,
                    "swa.clicksEnabled is according to the default value when no relevant configuration exists");
                assert.strictEqual(swa.pageLoadEnabled, true,
                    "swa.pageLoadEnabled is according to the default value when no relevant configuration exists");
            });
        });
    });

    QUnit.test("with tracking false", function (assert) {
        // Arrange
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                        logClickEvents: false,
                        logPageLoadEvents: false,
                        setUsageAnalyticsPermitted: true
                    }
                }
            }
        };

        var oFakeUser = new User({ // default values
            id: "DEFAULT_USER",
            firstName: "Default",
            lastName: "User",
            fullName: "Default User",
            accessibility: false,
            isJamActive: false,
            language: "en",
            bootTheme: {
                theme: "sap_bluecrystal",
                root: ""
            },
            setAccessibilityPermitted: true,
            setThemePermitted: true,
            trackUsageAnalytics: false
        });

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");

                oSrvc.showLegalPopup = sinon.spy();
                oSrvc._handlingTrackingScripts = sinon.spy();

                // Act
                oSrvc.init();

                // Assert
                assert.strictEqual(oSrvc._handlingTrackingScripts.calledOnce, false, "make the swa scripts are not loaded");
                assert.strictEqual(oSrvc.showLegalPopup.calledOnce, false,
                    "make sure popup is not open when  setUsageAnalyticsPermitted [true] and trackUsageAnalytics [true]");
            });
        });
    });

    QUnit.test("with tracking true", function (assert) {
        // Arrange
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                        logClickEvents: false,
                        logPageLoadEvents: false,
                        setUsageAnalyticsPermitted: true
                    }
                }
            }
        };

        var oFakeUser = new User({ // default values
            id: "DEFAULT_USER",
            firstName: "Default",
            lastName: "User",
            fullName: "Default User",
            accessibility: false,
            isJamActive: false,
            language: "en",
            bootTheme: {
                theme: "sap_bluecrystal",
                root: ""
            },
            setAccessibilityPermitted: true,
            setThemePermitted: true,
            trackUsageAnalytics: true
        });

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");

                oSrvc.showLegalPopup = sinon.spy();
                oSrvc._handlingTrackingScripts = sinon.spy();

                // Act
                oSrvc.init();

                // Assert
                assert.strictEqual(oSrvc._handlingTrackingScripts.calledOnce, true, "make the swa scripts are loaded");
                assert.strictEqual(oSrvc.showLegalPopup.calledOnce, false,
                    "make sure popup is not open when  setUsageAnalyticsPermitted [true] and trackUsageAnalytics [true]");
            });
        });
    });

    QUnit.test("init", function (assert) {
        // Arrange
        window["sap-ushell-config"] = {
            services: {
                UsageAnalytics: {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                        logClickEvents: false,
                        logPageLoadEvents: false,
                        setUsageAnalyticsPermitted: true
                    }
                }
            }
        };

        var oFakeUser = new User({ // default values
            id: "DEFAULT_USER",
            firstName: "Default",
            lastName: "User",
            fullName: "Default User",
            accessibility: false,
            isJamActive: false,
            language: "en",
            bootTheme: {
                theme: "sap_bluecrystal",
                root: ""
            },
            setAccessibilityPermitted: true,
            setThemePermitted: true,
            trackUsageAnalytics: null
        });

        return sap.ushell.bootstrap("local").then(function () {
            sinon.stub(sap.ushell.Container, "getUser").returns(oFakeUser);
            return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                oSrvc.setLegalText("bla");

                oSrvc.start = sinon.spy();
                oSrvc.showLegalPopup = sinon.spy();
                oSrvc._handlingTrackingScripts = sinon.spy();

                // Act
                oSrvc.init();

                // Assert
                assert.strictEqual(oSrvc._handlingTrackingScripts.calledOnce, false, "make the swa scripts are not loaded");
                assert.strictEqual(oSrvc.showLegalPopup.calledOnce, true,
                    "make sure popup is open when  setUsageAnalyticsPermitted [true] and trackUsageAnalytics [null]");
            });
        });
    });

    QUnit.module("setCustomAttributes", {
        beforeEach: function () {
            window["sap-ushell-config"] = {
                services: {
                    UsageAnalytics: {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                            setUsageAnalyticsPermitted: false
                        }
                    }
                }
            };
            return sap.ushell.bootstrap("local").then(function () {
                sinon.stub(sap.ushell.Container, "getUser", function () {
                    return new User({ // default values
                        id: "DEFAULT_USER",
                        firstName: "Default",
                        lastName: "User",
                        fullName: "Default User",
                        accessibility: false,
                        isJamActive: false,
                        language: "en",
                        bootTheme: {
                            theme: "sap_bluecrystal",
                            root: ""
                        },
                        setAccessibilityPermitted: true,
                        setThemePermitted: true,
                        trackUsageAnalytics: true
                    });
                });

                return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                    oSrvc.setLegalText("bla");
                    this.oSrvc = oSrvc;
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"];
        }
    });

    QUnit.test("setCustomAttributes", function (assert) {
        // Act
        // Verify simple setting of a single string to field custom3, and verify that is can't be set again
        this.oSrvc.setCustomAttributes({attribute1: "StringValue11"});
        this.oSrvc.setCustomAttributes({attribute1: "StringValue12"});

        // Assert
        assert.strictEqual(swa.custom5.ref, "StringValue11", "swa.custom3 contains an object with the 1st string and not the 2nd one");
    });

    QUnit.test("setCustomAttributes", function (assert) {
        // Act
        // Call to setCustomAttributes, with a string and a function
        this.oSrvc.setCustomAttributes({
            attribute2: "StringValue21",
            attribute3: function () {
                return "x";
            }
        });

        // Assert
        assert.strictEqual(swa.custom5.ref, "StringValue11", "swa.custom3 contains an object with the 1st string");
        assert.strictEqual(swa.custom6.ref, "StringValue21", "swa.custom4 contains an object with the given string");
        assert.strictEqual(swa.custom7.ref, "customFunction3", "swa.custom4 contains an object with ref = customFunction3");
        assert.strictEqual(jQuery.isFunction(window.customFunction3), true, "customFunction3 exists on the window as a function");
    });

    QUnit.module("logCustomEvent", {
        beforeEach: function () {
            window["sap-ushell-config"] = {
                services: {
                    UsageAnalytics: {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce"
                        }
                    }
                }
            };
            return sap.ushell.bootstrap("local").then(function () {
                sinon.stub(sap.ushell.Container, "getUser", function () {
                    return new User({ // default values
                        id: "DEFAULT_USER",
                        firstName: "Default",
                        lastName: "User",
                        fullName: "Default User",
                        accessibility: false,
                        isJamActive: false,
                        language: "en",
                        bootTheme: {
                            theme: "sap_bluecrystal",
                            root: ""
                        },
                        setAccessibilityPermitted: true,
                        setThemePermitted: true,
                        trackUsageAnalytics: true
                    });
                });
                swa.trackCustomEvent = sinon.spy();
                return sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (oSrvc) {
                    oSrvc.setLegalText("bla");
                    oSrvc.init();
                    oSrvc._isAnalyticsScriptLoaded = sinon.stub().returns(true);
                    this.oSrvc = oSrvc;
                }.bind(this));
            }.bind(this));
        },
        afterEach: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"];
        }
    });

    QUnit.test("logCustomEvent", function (assert) {
        // Arrange
        var aExpectedResult = [
            "type1",
            "value1",
            "firstStringValue",
            "secondStringValue"
        ];


        // Act
        // First call to logCustomEvent - verify passing of eventType and eventValue
        this.oSrvc.logCustomEvent("type1", "value1", ["firstStringValue", "secondStringValue"]);

        // Assert
        assert.deepEqual(swa.trackCustomEvent.args[0], aExpectedResult, "All arguments of swa.trackCustomEvent are correct");
    });

});
