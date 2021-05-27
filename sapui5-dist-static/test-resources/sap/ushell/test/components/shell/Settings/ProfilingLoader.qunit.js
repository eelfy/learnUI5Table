// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/Config",
    "sap/ushell/components/shell/Settings/ProfilingLoader",
    "sap/ushell/components/shell/Settings/userProfiling/UsageAnalyticsProfiling"
], function (Config, fnLoadProfiling, UsageAnalyticsProfiling) {
    "use strict";

    /* global QUnit sinon */


    QUnit.module("The onInit function", {
        beforeEach: function (assert) {

            this.oShellConfig = {
                enableSearch: false
            };
            this.oAnalyticsService = {
                systemEnabled: sinon.stub(),
                isSetUsageAnalyticsPermitted: sinon.stub()
            };
            this.oRenderer = {
                addUserProfilingEntry: sinon.stub(),
                getShellConfig: sinon.stub().returns(this.oShellConfig)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns({ //URLParsing
                    parseParameters: sinon.stub().returns({})
                }),
                getServiceAsync: sinon.stub().returns({ //UsageAnalytics Service
                    then: function (fnCallback) {
                        fnCallback(this.oAnalyticsService);
                    }.bind(this)
                }),
                getRenderer: sinon.stub().returns(this.oRenderer)
            };

        },

        afterEach: function () {
            delete sap.ushell.Container;
            Config._reset();
        }
    });

    QUnit.test("All profiles are disabled", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oAnalyticsService.systemEnabled.returns(false);
        // Act
        fnLoadProfiling().then(function () {
            // Assert
            assert.equal(Config.last("/core/userPreferences/profiling").length, 0, "no profiles was added");
            fnDone();
        });

    });

    QUnit.test("load UsageAnalyticsProfiling", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oAnalyticsService.systemEnabled.returns(true);
        this.oAnalyticsService.isSetUsageAnalyticsPermitted.returns(true);
        // Act
        fnLoadProfiling().then(function () {
            // Assert
            assert.equal(Config.last("/core/userPreferences/profiling").length, 1, "1 profile was added");
            assert.equal(
                Config.last("/core/userPreferences/profiling")[0].title,
                UsageAnalyticsProfiling.getProfiling().title, "UsageAnalyticsProfiling profile was added");
            fnDone();
        });
    });

    QUnit.test("load SearchProfiling", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSearch = true;
        this.oAnalyticsService.systemEnabled.returns(false);
        sap.ui.require(["sap/ushell/renderers/fiori2/search/userpref/SearchPrefs"], function (SearchPrefs) {
            var oIsSearchPrefsActiveStub = sinon.stub(SearchPrefs.model, "isSearchPrefsActive")
                                                .returns(new jQuery.Deferred().resolve(true).promise());
            // Act
            fnLoadProfiling().then(function () {
                // Assert
                assert.ok(oIsSearchPrefsActiveStub.calledOnce, "Check search config called");
                assert.ok(this.oRenderer.addUserProfilingEntry.calledOnce, "SearchProfiling was added");
                oIsSearchPrefsActiveStub.restore();
                fnDone();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("don't load SearchProfiling when disabled", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oShellConfig.enableSearch = true;
        this.oAnalyticsService.systemEnabled.returns(false);
        sap.ui.require(["sap/ushell/renderers/fiori2/search/userpref/SearchPrefs"], function (SearchPrefs) {
            var oIsSearchPrefsActiveStub = sinon.stub(SearchPrefs.model, "isSearchPrefsActive")
                                                .returns(new jQuery.Deferred().resolve(false).promise());
            // Act
            fnLoadProfiling().then(function () {
                // Assert
                assert.ok(oIsSearchPrefsActiveStub.calledOnce, "Check search config called");
                assert.ok(this.oRenderer.addUserProfilingEntry.notCalled, "SearchProfiling was not added");
                oIsSearchPrefsActiveStub.restore();
                fnDone();
            }.bind(this));
        }.bind(this));
    });

});
