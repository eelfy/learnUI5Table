// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.tiles.utils.js
 */

sap.ui.require([
    "sap/ushell/components/tiles/utils"
], function (oUtils) {
    "use strict";
    /*global equal, module, notEqual, test, sinon, QUnit */

    module("sap.ushell.components.tiles.utils", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {

        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    test("check buildFormFactorsObject()", function () {

        var oModel = {
            modelData: {},
            modelData1: {},

            getProperty: function (val, result) {
                switch (val) {
                    case "/config/appFormFactor":
                        return this.modelData.appFormFactor;
                    case "/config/desktopChecked":
                        return this.modelData.desktop;
                    case "/config/tabletChecked":
                        return this.modelData.tablet;
                    case "/config/phoneChecked":
                        return this.modelData.phone;
                    default:
                        return null;
                }
            }
        };
        //before each test we init the oModel mock and then test it

        oModel.modelData = { appFormFactor: true, desktop: true, tablet: false, phone: true};
        var oResult = oUtils.buildFormFactorsObject(oModel);
        equal(oResult.appDefault, true, "Test1.1: buildFormFactorsObject constructed correctly");


        oModel.modelData = {appFormFactor: false, desktop: true, tablet: true, phone: true, defaultParam: true };
        oResult = oUtils.buildFormFactorsObject(oModel);
        //Important - in order to make sure we are aligned with the form factor (device types) values as UI5 and backend team for the target resolution logic
        equal(oResult.appDefault, false, "Test1.2: buildFormFactorsString constructed correctly");
        equal(oResult.manual.desktop, true, "Test1.3: buildFormFactorsObject constructed correctly - Desktop");
        equal(oResult.manual.tablet, true, "Test1.4: buildDefaultFormFactorsObject constructed correctly - Tablet");
        equal(oResult.manual.phone, true, "Test1.5: buildDefaultFormFactorsObject constructed correctly - Phone");
        equal(oResult.defaultParam, undefined, "Test1.6: buildDefaultFormFactorsObject constructed correctly - Default setting - that mean that it's not defined ");


        oModel.modelData = {appFormFactor: true, desktop: false, tablet: false, phone: true, defaultParam: true };
        oModel.modelData1 = oUtils.getDefaultFormFactors();
        notEqual(oModel.modelData.appFormFactor, oModel.modelData1.appFormFactor, " Test 1.7 : correct, The application form factor should be false for good");

    });


    test("check tableHasDuplicateParameterNames()", function () {

        var aNames = [{name:'first'},{name:'second'},{name:'first'}];
        equal(oUtils.tableHasDuplicateParameterNames(aNames),true,"Test 2.1: duplication was found as expected");

        aNames = [{name:'first'},{name:'second'},{name:'third'}];
        equal(oUtils.tableHasDuplicateParameterNames(aNames),false,"Test 2.2: No duplication was found as expected");

        equal(oUtils.tableHasDuplicateParameterNames([]),false,"Test 2.3: No duplication was found as expected");

    });
    //The getMappingSignature input is incremented in the following tests, meaning it is added to the previously used....
    test("check getMappingSignatureString() and getOneParamSignature()", function () {
        //test mandatory non reg ex param.
        var row = {    mandatory:true,
                    isRegularExpression:false,
                    name:'userID',
                    value:'001234',
                    defaultValue:''
                 };
        var aTable = [row];
        var sParam = oUtils.getMappingSignatureString(aTable,false);
        equal(sParam, 'userID=001234',"Test 3.1: params string matches expected pattern");

        //test mandatory and regular expression
        row = { mandatory: true,
                    isRegularExpression:true,
                    name:'password',
                    value:'abcd',
                    defaultValue:''
                  };
        aTable.push(row);
        sParam = oUtils.getMappingSignatureString(aTable,false);
        equal(sParam, 'userID=001234&{password=abcd}',"Test 3.2: params string matches expected pattern");

        //test optional parameter
        row = {    mandatory:false,
                    name:'language',
                    value:'',
                    defaultValue:'English'
                  };
        aTable.push(row);
        sParam = oUtils.getMappingSignatureString(aTable,false);
        equal(sParam, 'userID=001234&{password=abcd}&[language=English]',"Test 3.3: params string matches expected pattern");
        //Test the undefined params
        sParam = oUtils.getMappingSignatureString(aTable,true);
        equal(sParam, 'userID=001234&{password=abcd}&[language=English]&*=*',"Test 3.4: params string matches expected pattern");

    });

    test("check getMappingSignatureTableData() and getOneParamObject()", function () {

        var aParam = oUtils.getMappingSignatureTableData('userID=001234&{password=abcd}&[language=English]&*=*');
        var thirdParam = aParam[2];

        equal(thirdParam.name, 'language',"Test 4.1: parsed object matches");
        equal(thirdParam.value, '',"Test 4.2: parsed object matches");
        equal(thirdParam.defaultValue, 'English',"Test 4.3: parsed object matches");
        equal(thirdParam.mandatory, false,"Test 4.4: parsed object matches");

        var firstParam = aParam[0];
        equal(firstParam.name, 'userID',"Test 4.5: parsed object matches");
        equal(firstParam.value, '001234',"Test 4.6: parsed object matches");
        equal(firstParam.defaultValue, '',"Test 4.7: parsed object matches");
        equal(firstParam.mandatory, true,"Test 4.8: parsed object matches");

    });

    test("check getAllowUnknownParametersValue()", function () {

        var bAllowedUndefined = oUtils.getAllowUnknownParametersValue('userID=001234&{password=abcd}&[language=English]&*=*');
        equal(bAllowedUndefined, true,"Test 5.1: Unknown parameters flag matches expected value");

        bAllowedUndefined = oUtils.getAllowUnknownParametersValue('userID=001234&{password=abcd}&[language=English]');
        equal(bAllowedUndefined, false,"Test 5.2: Unknown parameters flag matches expected value");

        //Check empty string
        bAllowedUndefined = oUtils.getAllowUnknownParametersValue('');
        equal(bAllowedUndefined, false,"Test 5.3: Unknown parameters flag matches expected value");

        //check *=* in the middle
        bAllowedUndefined = oUtils.getAllowUnknownParametersValue('userID=001234&{password=abcd}&*=*&[language=English]');
        equal(bAllowedUndefined, false,"Test 5.4: Unknown parameters flag matches expected value");

    });

    test("check checkInput()", function () {
        var configurationView = {};

        function baseItem () {
            this.value = "";
            this.text = "";

            this.setValueState = function (val) {
                this.value = val;
            };
            this.setValueStateText = function (val) {
                this.text = val;
            };
        }

        //Create inherit icon object class
        function icon () {}
        icon.prototype = new baseItem();
        //create instance for testing
        var oIcon = new icon();

        //Create inherit semantic object class
        function soInput () {
            this.aItems = [];
            this.getModel = function () {
                var that = this;
                return {
                    getProperty: function () {
                        return that.aItems;
                    }
                };
            };
        }
        function saInput () {
            this.getValue = function () {
                return "actionTestValue";
            };
        }
        soInput.prototype = new baseItem();
        //create instance for testing
        var oSO = new soInput();
        var oSA = new saInput();

        configurationView.byId = function (val) {
            switch (val) {
                case "iconInput":
                   return oIcon;
                case "navigation_semantic_objectInput":
                    return oSO;
                case "navigation_semantic_actionInput":
                    return oSA;
                case "semantic_objectInput":
                    break;
                case "semantic_actionInput":
                    break;

                default:
                    break;
            }
            return "tester";
        };

        var event = {
            param: "testString",
            testObject: oIcon,

            getParameter: function (val) {
                return this.param;
            },
            getSource: function () {
                return this.testObject;
            }
        };

        //Test Icon
        oUtils.checkInput(configurationView, event);
        equal(event.getSource().value, 'Error', "Test 7.1: Checkinput set the correct value for icon checks");

        event.param = "sap-icon://sapUIFiori.jpg";
        oUtils.checkInput(configurationView, event);
        equal(event.getSource().value, 'None', "Test 7.1: Checkinput set the correct value for icon checks");

        //Test Semantic object
        event.testObject = oSO; //currently contains "sap-icon://sapUIFiori.jpg" which is an illegal value for the semantic object
        oUtils.checkInput(configurationView, event);
        equal(event.getSource().value, 'Error', "Test 7.1: Checkinput set the correct value for semantic object checks");

        event.param = "displayOrder";
//        oUtils.checkInput(configurationView, event);
//        equal(event.getSource().value, 'Warning',"Test 7.1: Checkinput set the correct value for semantic object checks");
        oSO.aItems = [{obj: "displayOrder"}];

        oUtils.checkInput(configurationView, event);
        equal(event.getSource().value, 'None', "Test 7.1: Checkinput set the correct value for semantic object checks");

    });

    [
        {
            description: "createNavigationProviderModel: return all application type for dropdown",
            currentAppType: "SAPUI5",
            expectedTypes: ["SAPUI5", "LPD", "TR", "WDA", "URL"]
        }, {
            description: "createNavigationProviderModel: WCF application type is shown in dropdown if it is current application",
            currentAppType: "WCF",
            expectedTypes: ["SAPUI5", "LPD", "TR", "WDA", "URL", "WCF"]
        }, {
            description: "createNavigationProviderModel: WCF application type is shown in dropdown if it is current application",
            currentAppType: "URLT",
            expectedTypes: ["SAPUI5", "LPD", "TR", "WDA", "URL", "URLT"]
        }
    ].forEach(function (oTestCase) {
        QUnit.test(oTestCase.description, function (assert) {

            var oConfigController = {
                getView: sinon.spy()
            };
            var oTargetTypeSelector = {
                bindItems: sinon.spy(),
                setModel: sinon.spy(),
                getBinding: function () {
                    return {
                        sort: sinon.spy()
                    };
                }
            };

            var oResourceStub = sinon.stub(oUtils, "getResourceBundleModel").returns({
                getResourceBundle: function () {
                    return {
                        getText: sinon.spy()
                    };
                }
            });
            var oConfigurationStub = sinon.stub(oUtils, "getConfiguration").returns({
                "navigation_provider": oTestCase.currentAppType
            });


            oUtils.createNavigationProviderModel(oConfigController, oTargetTypeSelector);
            assert.ok(oTargetTypeSelector.setModel.calledOnce, "Model should be set");
            var aKeys = oTargetTypeSelector.setModel.getCall(0).args[0].getData().items.map(function (oItem) {
                return oItem.key;
            });
            assert.deepEqual(aKeys, oTestCase.expectedTypes, "The correct application type should be added into the model");

            oResourceStub.restore();
            oConfigurationStub.restore();

        });

    });

    [
        {
            applicationType: "URLT",
            expectedVisibleFields: [
                "application_description",
                "target_application_descriptionInput",
                "urlt_application_component",
                "urlt_application_componentInput",
                "target_urlt_system_alias",
                "target_urlt_system_aliasInput"
            ]
        }, {
            applicationType: "LPD",
            expectedVisibleFields: [
                "navigation_provider_role",
                "navigation_provider_roleInput",
                "navigation_provider_instance",
                "navigation_provider_instanceInput",
                "target_application_alias",
                "target_application_aliasInput",
                "target_application_id",
                "target_application_idInput",
                "application_type_deprecated"
            ]
        }, {
            applicationType: "SAPUI5",
            expectedVisibleFields: [
                "application_description",
                "target_application_descriptionInput",
                "application_url",
                "target_application_urlInput",
                "application_component",
                "target_application_componentInput"
            ]
        }, {
            applicationType: "TR",
            expectedVisibleFields: [
                "application_description",
                "target_application_descriptionInput",
                "target_transaction",
                "target_transactionInput",
                "target_system_alias",
                "target_system_aliasInput"
            ]
        }, {
            applicationType: "WDA",
            expectedVisibleFields: [
                "application_description",
                "target_application_descriptionInput",
                "target_web_dynpro_application",
                "target_web_dynpro_applicationInput",
                "target_web_dynpro_configuration",
                "target_web_dynpro_configurationInput",
                "target_system_alias",
                "target_system_aliasInput"
            ]
        }, {
            applicationType: "URL",
            expectedVisibleFields: [
                "application_description",
                "target_application_descriptionInput",
                "application_url",
                "target_application_urlInput",
                "target_system_alias",
                "target_system_aliasInput"
            ]
        }, {
            applicationType: "WCF",
            expectedVisibleFields: [
                "application_description",
                "target_application_descriptionInput",
                "target_wcf_application_id",
                "target_wcf_application_idInput",
                "target_system_alias",
                "target_system_aliasInput"
            ]
        }
    ].forEach(function (oTestCase) {
        QUnit.test("displayApplicationTypeFields: correct fields are visible for " + oTestCase.applicationType + " application type", function (assert) {
            var oResult = {};
            var oConfigurationView = {
                byId: function (sId) {
                    return {
                        setVisible: function (bVisible) {
                            oResult[sId] = bVisible;
                        }
                    };
                }
            };

            var oExpectedResult = {
                "navigation_provider_role": false,
                "navigation_provider_roleInput": false,
                "navigation_provider_instance": false,
                "navigation_provider_instanceInput": false,
                "target_application_alias": false,
                "target_application_aliasInput": false,
                "target_application_id": false,
                "target_application_idInput": false,
                "application_description": false,
                "target_application_descriptionInput": false,
                "application_url": false,
                "target_application_urlInput": false,
                "application_component": false,
                "target_application_componentInput": false,
                "target_transaction": false,
                "target_transactionInput": false,
                "target_wcf_application_id": false,
                "target_wcf_application_idInput": false,
                "target_web_dynpro_application": false,
                "target_web_dynpro_applicationInput": false,
                "target_web_dynpro_configuration": false,
                "target_web_dynpro_configurationInput": false,
                "target_system_alias": false,
                "target_system_aliasInput": false,
                "urlt_application_component": false,
                "urlt_application_componentInput": false,
                "target_urlt_system_alias": false,
                "target_urlt_system_aliasInput": false,
                "application_type_deprecated": false
            };

            oTestCase.expectedVisibleFields.forEach(function (sFieldId) {
                oExpectedResult[sFieldId] = true;
            });

            oUtils.displayApplicationTypeFields(oTestCase.applicationType, oConfigurationView);
            assert.deepEqual(oResult, oExpectedResult, "The correct fields should be visible");

        });
    });
});
