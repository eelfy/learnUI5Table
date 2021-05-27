// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ovp.Card
 */
sap.ui.define([
    "sap/ovp/app/Component",
    "sap/ovp/cards/CommonUtils",
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/OVPCardAsAPIUtils"
], function (appComponent, CommonUtils, utils, OVPCardAsAPIUtils) {
    "use strict";

    /**
     * This is a hack, as the namespace 'sap.ovp.demo' when run in the qunit results in wrong resource prefix
     * so i change now manually - to continue work. consult Aviad what causes this so we could remove this.
     */
    var utils = utils;
    var oController;
    var CardController;
    var OVPCardAsAPIUtils = OVPCardAsAPIUtils;
    var CommonUtils = CommonUtils;

    module("sap.ovp.cards.Table", {
        /**
         * This method is called before each test
         */
        setup: function () {
            oController = new sap.ui.controller("sap.ovp.cards.v4.table.Table");
            CardController = new sap.ui.controller("sap.ovp.cards.v4.generic.Card");
        }
    });

    function getCardProp() {

        return {
            newCardLayout: {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            },
            cardSizeProperties: {
                dropDownHeight: 0,
                itemHeight: 111
            }
        };
    }

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    test("Card Test - Testing card item binding info", function () {
        oController.getView = function () {
            return {
                byId: function (arg) {
                    if (arg && (arg === "ovpTable")) {
                        return {
                            getBindingInfo: function (arg) {
                                if (arg && (arg === "items")) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                    } else {
                        return {
                            getBindingInfo: function () {
                                return false;
                            }
                        }
                    }
                }
            }
        };
        var expectedResult = true;
        deepEqual(oController.getCardItemBindingInfo() == true, expectedResult);
    });

    test("Card Test - Testing card item binding info", function () {
        var tableData = {
            "results": [
                {
                    "BusinessProcess": "FI"
                }]
        };
        var oTable = new sap.m.Table({
            id: "ovpTable",
            headerText: "JavaScript",
            inset: true
        });
        var oTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Label({
                    text: "{test>BusinessProcess}"
                })]
        });
        var model = new sap.ui.model.json.JSONModel();
        model.setData(tableData);
        oTable.setModel(model, "test");
        oTable.bindItems("test>/results", oTemplate);
        oController.getView = function () {
            return {
                byId: function () {
                    return oTable;
                }
            }
        };
        ok(oController.getCardItemBindingInfo().path == "/results", "To check the items path");
        oTable.destroy();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  End of Test Cases for item Binding Function
     *  ------------------------------------------------------------------------------
     */

    /**
     *  ------------------------------------------------------------------------------
     *  Start of Test Cases for onItemPress Function
     *  ------------------------------------------------------------------------------
     */

    test("table Card Test - On Content click of OVP Cards used as an API in other Applications", function () {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return true;
        });
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked", function () {
            return undefined;
        });
        oController.checkAPINavigation = function () {
            return 1;
        };
        var actualValue = oController.onColumnListItemPress();
        ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });

    /**
     *  ------------------------------------------------------------------------------
     *  Test Cases for OnContact Details Press
     *  ------------------------------------------------------------------------------
     */


    test("Table Card Test - navigation from contact details", function () {
        var oBindingContext = {
            getPath: function () {
                return "/BusinessPartnerSet('0100000004')"
            }
        };
        var oPopover = [new sap.m.Popover({
            title: "Sample Popover"
        })
        ];

        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            }
                        }
                    }
                }
            }
        };
        var openByStub = sinon.stub(oPopover[0], "openBy");
        openByStub.returns(null);
        oController.onContactDetailsLinkPress(oEvent);
        ok(oPopover[0].mObjectBindingInfos.undefined.path === "/BusinessPartnerSet('0100000004')", "Binding path is fetched for Popover");
    });


    test("Table Card Test - navigation from contact details When binding context is null", function () {
        var oBindingContext = null;
        var oPopover = [new sap.m.Popover({
            title: "Sample Popover"
        })
        ];
        var oEvent = {
            getSource: function () {
                return {
                    getBindingContext: function () {
                        return oBindingContext;
                    },
                    getParent: function () {
                        return {
                            getAggregation: function (arg) {
                                if (arg == "items") {
                                    return oPopover;
                                }
                            }
                        }
                    }
                }
            }
        };
        var actualValue = oController.onContactDetailsLinkPress(oEvent);
        ok(actualValue === undefined, "Function returns undefined if the binding context is null");
    });

});

