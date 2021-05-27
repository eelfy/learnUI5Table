// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for bootstrap common.configure.ushell.js
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.configure.ushell",
    "sap/ushell/bootstrap/common/common.read.metatags"
], function (fnConfigureUshell, oMetaTagReader) {

    /* global QUnit, sinon */
    "use strict";

    QUnit.dump.maxDepth = 10;
    var sandbox = sinon.createSandbox({});

    QUnit.module("common.configure.ushell", {
        beforeEach: function () {
            this.oUshellConfigBackUp = window["sap-ushell-config"]; // save ushell config for restoring
            this.oMetaTagReaderStub = sandbox.stub(oMetaTagReader, "readMetaTags");
            this.oMetaTagReaderStub.returns([]);
        },
        afterEach: function () {
            sandbox.restore();
            window["sap-ushell-config"] = this.oUshellConfigBackUp; // restore config
        }
    });

    QUnit.test("configure Ushell when services.Container.adapter.config.userProfilePersonalization is provided", function (assert) {
        // Arrange
        var oUshellConfig = {
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                items: {
                                    itemOne: {
                                        someProperty: "someValue"
                                    }
                                },
                                __metadata: "ToBeDeleted"
                            }
                        }
                    }
                }
            }
        };
        var oSettings = {};
        var oExpectedResult = {
            userProfilePersonalization: {
                itemOne: {
                    someProperty: "someValue" // The Actual Result will be trimmed because the object is too deep for a deepEqual!
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);
        oResult = jQuery.sap.getObject("services.Container.adapter.config", 0, oResult);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when services.Container.adapter.config.userProfilePersonalization is undefined", function (assert) {
        // Arrange
        var oUshellConfig = {};
        var oSettings = {};
        var oExpectedResult = {
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when oSettings is undefined", function (assert) {
        // Arrange
        var oUshellConfig = {};
        var oSettings;
        var oExpectedResult = {
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when ushellConfig is undefined", function (assert) {
        // Arrange
        var oUshellConfig;
        var oSettings = {};
        var oExpectedResult = {
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when ushellConfig and oSettings are undefined", function (assert) {
        // Arrange
        var oUshellConfig;
        var oSettings;
        var oExpectedResult = {
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when valid ushellConfig", function (assert) {
        // Arrange
        var oUshellConfig = {
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                }
            }
        };
        var oSettings;
        var oExpectedResult = {
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when ushellConfig is undefined; oSettings valid", function (assert) {
        // Arrange
        var oUshellConfig;
        var oSettings = {
            defaultUshellConfig: {
                defaultRenderer: "some renderer",
                services: {
                    PluginManager: {
                        config: {
                            someConfig: true
                        }
                    },
                    Container: {
                        adapter: {
                            config: {
                                systemProperties: {},
                                userProfile: {
                                    metadata: {
                                        someMetaData: ["entry"]
                                    },
                                    defaults: {
                                        someDefaultProperty: "foo"
                                    }
                                },
                                anotherProperty: {}
                            }
                        }
                    }
                }
            }
        };
        var oExpectedResult = {
            defaultRenderer: "some renderer",
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when ushellConfig and oSettings are valid and merged with undefined userProfilePersonalization", function (assert) {
        // Arrange
        var oUshellConfig = {
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                }
            }
        };
        var oSettings = {
            defaultUshellConfig: {
                defaultRenderer: "some renderer",
                services: {
                    MockService: {
                        config: {
                            someOtherConfig: true
                        }
                    },
                    AnotherService: {
                        adapter: {
                            config: {
                                systemProperties: {},
                                userProfile: {
                                    metadata: {
                                        someMetaData: ["entry"]
                                    },
                                    defaults: {
                                        someDefaultProperty: "foo"
                                    }
                                },
                                anotherProperty: {}
                            }
                        }
                    }
                }
            }
        };
        var oExpectedResult = {
            defaultRenderer: "some renderer",
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                },
                MockService: {
                    config: {
                        someOtherConfig: true
                    }
                },
                AnotherService: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when ushellConfig and oSettings are valid and merged with additional userProfilePersonalization", function (assert) {
        // Arrange
        var oUshellConfig = {
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {},
                            userProfilePersonalization: {
                                items: {
                                    anItem: "FooBar"
                                },
                                __metadata: "someMetaData"
                            }
                        }
                    }
                }
            }
        };
        var oSettings = {
            defaultUshellConfig: {
                defaultRenderer: "some renderer",
                services: {
                    MockService: {
                        config: {
                            someOtherConfig: true
                        }
                    },
                    AnotherService: {
                        adapter: {
                            config: {
                                systemProperties: {},
                                userProfile: {
                                    metadata: {
                                        someMetaData: ["entry"]
                                    },
                                    defaults: {
                                        someDefaultProperty: "foo"
                                    }
                                },
                                anotherProperty: {}
                            }
                        }
                    }
                }
            }
        };
        var oExpectedResult = {
            defaultRenderer: "some renderer",
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {},
                            userProfilePersonalization: {
                                anItem: "FooBar"
                            }
                        }
                    }
                },
                MockService: {
                    config: {
                        someOtherConfig: true
                    }
                },
                AnotherService: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when ushellConfig and oSettings are valid and merged with additional userProfilePersonalization plus meta tag configs", function (assert) {
        // Arrange
        this.oMetaTagReaderStub.returns([
            {
                services: {
                    testService: {
                        someSettings: "FooBar"
                    }
                }
            }
        ]);
        var oUshellConfig = {
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {},
                            userProfilePersonalization: {
                                items: {
                                    anItem: "FooBar"
                                },
                                __metadata: "someMetaData"
                            }
                        }
                    }
                }
            }
        };
        var oSettings = {
            defaultUshellConfig: {
                defaultRenderer: "some renderer",
                services: {
                    MockService: {
                        config: {
                            someOtherConfig: true
                        }
                    },
                    AnotherService: {
                        adapter: {
                            config: {
                                systemProperties: {},
                                userProfile: {
                                    metadata: {
                                        someMetaData: ["entry"]
                                    },
                                    defaults: {
                                        someDefaultProperty: "foo"
                                    }
                                },
                                anotherProperty: {}
                            }
                        }
                    }
                }
            }
        };
        var oExpectedResult = {
            defaultRenderer: "some renderer",
            services: {
                PluginManager: {
                    config: {
                        someConfig: true
                    }
                },
                Container: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {},
                            userProfilePersonalization: {
                                anItem: "FooBar"
                            }
                        }
                    }
                },
                MockService: {
                    config: {
                        someOtherConfig: true
                    }
                },
                AnotherService: {
                    adapter: {
                        config: {
                            systemProperties: {},
                            userProfile: {
                                metadata: {
                                    someMetaData: ["entry"]
                                },
                                defaults: {
                                    someDefaultProperty: "foo"
                                }
                            },
                            anotherProperty: {}
                        }
                    }
                },
                testService: {
                    someSettings: "FooBar"
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when duplicate settings are provided (ushellConfig + defaultUshellConfig) -> defaultUshellConfig prioritized", function (assert) {
        // Arrange
        var oUshellConfig = {
            services: {
                MockService: {
                    config: {
                        someOtherConfig: false
                    }
                }
            }
        };
        var oSettings = {
            defaultUshellConfig: {
                services: {
                    MockService: {
                        config: {
                            someOtherConfig: true
                        }
                    }
                }
            }
        };
        var oExpectedResult = {
            services: {
                MockService: {
                    config: {
                        someOtherConfig: true
                    }
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("configure Ushell when duplicate settings are provided (ushellConfig + defaultUshellConfig + metatags) -> MetaTags prioritized", function (assert) {
        // Arrange
        this.oMetaTagReaderStub.returns([
            {
                services: {
                    MockService: {
                        config: {
                            someOtherConfig: false
                        }
                    }
                }
            }
        ]);
        var oUshellConfig = {
            services: {
                MockService: {
                    config: {
                        someOtherConfig: true
                    }
                }
            }
        };
        var oSettings = {
            defaultUshellConfig: {
                services: {
                    MockService: {
                        config: {
                            someOtherConfig: true
                        }
                    }
                }
            }
        };
        var oExpectedResult = {
            services: {
                MockService: {
                    config: {
                        someOtherConfig: false
                    }
                }
            },
            "sap-ui-debug": false
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell(oSettings);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The correct object was returned");
        assert.strictEqual(this.oMetaTagReaderStub.callCount, 1, "The metagtagreader was called once");
    });

    QUnit.test("Spaces personalization: false/false/false => '/ushell/spaces/enabled:false'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: false,
                    configurable: false
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: false
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, false, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: false/false/true => '/ushell/spaces/enabled:false'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: false,
                    configurable: false
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: true
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, false, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: false/true/false => '/ushell/spaces/enabled:false'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: false,
                    configurable: true
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: false
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, false, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: false/true/true => '/ushell/spaces/enabled:true'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: false,
                    configurable: true
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: true
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, true, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: true/false/false => '/ushell/spaces/enabled:true'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: true,
                    configurable: false
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: false
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, true, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: true/false/true => '/ushell/spaces/enabled:true'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: true,
                    configurable: false
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: true
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, true, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: true/true/false => '/ushell/spaces/enabled:false'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: true,
                    configurable: true
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: false
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, false, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: true/true/true => '/ushell/spaces/enabled:true'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: true,
                    configurable: true
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: true
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, true, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: false/true/undefined => '/ushell/spaces/enabled:true'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: false,
                    configurable: true
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: undefined
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, false, "The config /ushell/spaces/enabled is set correctly.");
    });

    QUnit.test("Spaces personalization: true/true/undefined => '/ushell/spaces/enabled:true'", function (assert) {
        // Arrange
        var oUshellConfig = {
            ushell: {
                spaces: {
                    enabled: true,
                    configurable: true
                }
            },
            services: {
                Container: {
                    adapter: {
                        config: {
                            userProfilePersonalization: {
                                spacesEnabled: undefined
                            }
                        }
                    }
                }
            }
        };

        window["sap-ushell-config"] = oUshellConfig;

        // Act
        var oResult = fnConfigureUshell();

        //Assert
        assert.strictEqual(oResult.ushell.spaces.enabled, true, "The config /ushell/spaces/enabled is set correctly.");
    });
});
