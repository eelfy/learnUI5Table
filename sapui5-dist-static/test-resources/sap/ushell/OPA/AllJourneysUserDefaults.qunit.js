// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Shell",
    "sap/ui/core/ComponentContainer",
    "sap/ui/fl/FakeLrepConnectorLocalStorage",
    "./JourneyExecutor"
], function (Shell, ComponentContainer, FakeLrepConnectorLocalStorage, JourneyExecutor) {
    "use strict";

    var oView1 = {
        fileName: "id_1601457802403_15_wrapper",
        fileType: "variant",
        changeType: "wrapper",
        moduleName: "",
        reference: "sap.ushell.components.shell.Settings.userDefaults.Component",
        packageName: "",
        content: {
            favorite: true,
            Second: {value: "View1 Second"},
            First: {value: "View1 First"},
            AdditionalValueParam: {
                value: "View1 Extended Value",
                additionalValues: {
                    Ranges: [
                        {Sign: "I", Option: "BT", Low: "2", High: "2323"},
                        {Sign: "I", Option: "CP", Low: "ASDF", High: null},
                        {Sign: "I", Option: "LT", Low: "200", High: null}
                    ]
                }
            }
        },
        selector: {persistencyKey: "UserDefaultsFormPersKey"},
        layer: "USER",
        texts: {variantName: {value: "View1", type: "XFLD"}},
        namespace: "apps/sap.ushell.components.shell.Settings.userDefaults/changes/",
        projectId: "sap.ushell.components.shell.Settings.userDefaults",
        creation: "2020-09-30T09:23:22.429Z",
        originalLanguage: "EN",
        support: {
            generator: "Change.createInitialFileContent",
            service: "",
            user: "",
            sapui5Version: "1.84.0-SNAPSHOT",
            sourceChangeFileName: "",
            compositeCommand: "",
            command: ""
        },
        oDataInformation: {},
        dependentSelector: {},
        validAppVersions: {},
        jsOnly: false,
        variantReference: "",
        appDescriptorChange: false
    };

    var oView2 = {
        fileName: "id_1601457802403_16_wrapper",
        fileType: "variant",
        changeType: "wrapper",
        moduleName: "",
        reference: "sap.ushell.components.shell.Settings.userDefaults.Component",
        packageName: "",
        content: {
            favorite: true,
            Second: {value: "View2 Second"},
            First: {value: "View2 First"},
            AdditionalValueParam: {value: "View2 Extended Value"}
        },
        selector: {persistencyKey: "UserDefaultsFormPersKey"},
        layer: "USER",
        texts: {variantName: {value: "View2", type: "XFLD"}},
        namespace: "apps/sap.ushell.components.shell.Settings.userDefaults/changes/",
        projectId: "sap.ushell.components.shell.Settings.userDefaults",
        creation: "2020-09-30T09:23:22.429Z",
        originalLanguage: "EN",
        support: {
            generator: "Change.createInitialFileContent",
            service: "",
            user: "",
            sapui5Version: "1.84.0-SNAPSHOT",
            sourceChangeFileName: "",
            compositeCommand: "",
            command: ""
        },
        oDataInformation: {},
        dependentSelector: {},
        validAppVersions: {},
        jsOnly: false,
        variantReference: "",
        appDescriptorChange: false
    };

    FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();
    FakeLrepConnectorLocalStorage.forTesting.synchronous.store(
        oView1.fileName,
        oView1
    );
    FakeLrepConnectorLocalStorage.forTesting.synchronous.store(
        oView2.fileName,
        oView2
    );
    FakeLrepConnectorLocalStorage.enableFakeConnector();

    sap.ui.require([
        "opatests/userSettings/journeys/UserDefaults"
    ], JourneyExecutor.start.bind(this, {
        timeout: 30,
        viewNamespace: "sap.ushell.components.shell.Settings.userDefaults.view."
    }));
});
