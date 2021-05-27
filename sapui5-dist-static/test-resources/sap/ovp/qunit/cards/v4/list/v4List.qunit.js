// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ovp.Card
 */
sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "sap/ovp/cards/v4/V4AnnotationHelper",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/cards/jUtils"
], function (utils, V4AnnotationHelper, OVPCardAsAPIUtils, CommonUtils, jUtils) {
    "use strict";

    /**
     * This is a hack, as the namespace 'sap.ovp.demo' when run in the qunit results in wrong resource prefix
     * so i change now manually - to continue work. consult Aviad what causes this so we could remove this.
     */

    var utils = utils;
    var V4AnnotationHelper = V4AnnotationHelper;
    var OVPCardAsAPIUtils = OVPCardAsAPIUtils;
    var CommonUtils = CommonUtils;
    var testContainer;
    var oController;
    var CardController;

    module("sap.ovp.cards.List", {
        /**
         * This method is called before each test
         */
        setup: function () {
            document.body.insertAdjacentHTML('beforeend', '<div id="testContainer" style="display: none;">');
            testContainer = document.querySelector('#testContainer');
            oController = new sap.ui.controller("sap.ovp.cards.v4.list.List");
            CardController = new sap.ui.controller("sap.ovp.cards.v4.generic.Card");
            var workingArea = '<div id="root">' + '<div id="container"> </div>' + '</div>';
            document.body.insertAdjacentHTML('beforeend', workingArea);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            testContainer.parentNode.removeChild(testContainer);
            oController.destroy();
        }
    });


    // /**
    //  *  ------------------------------------------------------------------------------
    //  *  Start of test cases to update minMaxModel and barChart value
    //  *  ------------------------------------------------------------------------------
    //  */
    function genericFunctions(oController, value) {
        oController.minMaxModel.setData = function (val) {
            return null;
        };
        oController.minMaxModel.refresh = function () {
            return true;
        }

        oController.getEntityType = function () {
            return {
                $path: "/dataServices/schema/0/entityType/1",
                "com.sap.vocabularies.UI.v1.LineItem": [
                    {
                        Label: {String: "Unit Price"},
                        RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
                        Target: {AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Price"}

                    }
                ]
            }
        }
        oController.getCardPropertiesModel = function () {
            return {
                getProperty: function (val) {
                    return "com.sap.vocabularies.UI.v1.LineItem";
                }
            }
        }
        oController.getMetaModel = function () {
            return {
                createBindingContext: function (val) {
                },
                getObject: function (val) {
                },
                getData: function (val) {
                }
            }

        }

        oController.getView = function () {
            return {
                byId: function (val) {
                    return {
                        getBinding: function (items) {
                            return {
                                getCurrentContexts: function () {
                                    return [
                                        {Price: value}
                                    ]
                                }
                            }
                        }
                    }
                }

            }

        }
        oController.getModel = function () {
            return {
                getOriginalProperty: function (val1, val2) {
                    return value;
                }
            }
        }

    }

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit when value is greater then zero", function () {

        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 100
            };
        };
        ok(oController.returnBarChartValue(70) == 70, "show minimal value in negative");
    });

    test("Card List Controller Test- returnBarChartValue First Data Point has Percentage Unit  when both Max is equal to zero and min is equal to zero", function () {

        oController._updateMinMaxModel = function () {
            return {
                minValue: 0,
                maxValue: 0
            };
        };
        ok(oController.returnBarChartValue(0) == 0, "Show value as it is.");
    });

    // // /**
    // //  *  ------------------------------------------------------------------------------
    // //  *  End of test cases to update minMaxModel and barChart value
    // //  *  ------------------------------------------------------------------------------
    // //  */

    // // /**
    // //  *  ------------------------------------------------------------------------------
    // //  *  Start of Test Cases for resize cards
    // //  *  ------------------------------------------------------------------------------
    // //  */
    function testResizeCard(oController, lengthVal, card) {
        var classList = {
            remove: function () {
                return ["sapMFlexItem", "sapOvpCardContentContainer", "sapOvpWrapper"];
            },
            add: function () {
                return ["sapMFlexItem", "sapOvpContentHidden", "sapOvpCardContentContainer", "sapOvpWrapper"];
            }
        }
        oController.cardId = card;
        oController.oDashboardLayoutUtil = {
            getCardDomId: function () {
                return "mainView--ovpLayout--" + oController.cardId;
            }
        }
        oController.getCardItemBindingInfo = function () {
            return {length: lengthVal}
        }
        oController.getCardItemsBinding = function () {
            return {
                refresh: function () {
                    return true;
                }
            }
        }
        oController.getHeaderHeight = function () {
            return 82;
        }
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getDomRef: function () {
                            return {
                                classList: classList,
                                style: {
                                    height: ""
                                }
                            }
                        }
                    }
                }
            }
        }
        oController.minMaxModel.refresh = function () {
            return true;
        }
    }

    test("Card Test - resize card, when showOnlyHeader is false, No change in number of rows", function () {

        var newCardLayout = {
            showOnlyHeader: false,
            rowSpan: 20,
            iRowHeightPx: 16,
            iCardBorderPx: 8,
            noOfItems: 3
        };
        var cardSizeProperties = {
            dropDownHeight: 0,
            itemHeight: 111
        };
        document.body.insertAdjacentHTML('beforeend', '<div id="mainView--ovpLayout--card001" style="height:320px; width:1500px">');
        var testContainer = document.querySelector('#mainView--ovpLayout--card001');
        document.querySelector('#container').appendChild(testContainer);

        testResizeCard(oController, 2, "card001");
        var iNoOfItems = 2;
        oController.resizeCard(newCardLayout, cardSizeProperties);
        ok(oController.getCardItemBindingInfo().length === iNoOfItems, "No change in number of rows");

    }),

        test("Card Test - resize card, when showOnlyHeader is false, Show more less of rows", function () {

            var newCardLayout = {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111
            };
            document.body.insertAdjacentHTML('beforeend', '<div id="mainView--ovpLayout--card002" style="height:320px; width:1500px">');
	        var testContainer = document.querySelector('#mainView--ovpLayout--card002');
            document.querySelector('#container').appendChild(testContainer);
            testResizeCard(oController, 4, "card002");
            var iNoOfItems = 2;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show less number of rows");
        }),

        test("Card Test - resize card, when showOnlyHeader is false, Show more number of rows", function () {

            var newCardLayout = {
                showOnlyHeader: false,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111
            };
            document.body.insertAdjacentHTML('beforeend', '<div id="mainView--ovpLayout--card003" style="height:320px; width:1500px">');
	        var testContainer = document.querySelector('#mainView--ovpLayout--card003');
            document.querySelector('#container').appendChild(testContainer);
            testResizeCard(oController, 2, "card003");
            var iNoOfItems = 4;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");

        }),
        test("Card Test - resize card, when showOnlyHeader is true", function () {

            var newCardLayout = {
                showOnlyHeader: true,
                rowSpan: 20,
                iRowHeightPx: 16,
                iCardBorderPx: 8,
                noOfItems: 3
            };
            var cardSizeProperties = {
                dropDownHeight: 0,
                itemHeight: 111
            };
            document.body.insertAdjacentHTML('beforeend', '<div id="mainView--ovpLayout--card004" style="height:320px; width:1500px">');
	        var testContainer = document.querySelector('#mainView--ovpLayout--card004');
            document.querySelector('#container').appendChild(testContainer);
            testResizeCard(oController, 2, "card004");
            var iNoOfItems = 4;
            oController.resizeCard(newCardLayout, cardSizeProperties);
            ok(oController.getCardItemBindingInfo().length !== iNoOfItems, "Show more number of rows");
        })
    // // /**
    // //  *  ------------------------------------------------------------------------------
    // //  *  End of Test Cases for resize cards
    // //  *  ------------------------------------------------------------------------------
    // //  */
    test("Card Test - Testing card item binding info", function () {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBindingInfo: function (val) {
                            return {}
                        }
                    }
                }
            }
        }
        var expectedResult = {};
        deepEqual(oController.getCardItemBindingInfo(), expectedResult);
    });

    test("Card Test - Testing card item binding", function () {
        oController.getView = function () {
            return {
                byId: function (id) {
                    return {
                        getBinding: function (val) {
                            return {}
                        }
                    }
                }
            }
        }
        var expectedResult = {};
        deepEqual(oController.getCardItemsBinding(), expectedResult);
    });

    // // /**
    // //  *  Start of test cases
    // //  *  This function does some CSS changes after the card is rendered
    // //  */
    function ImageStyle(oController, desc, icon) {
        oController.byId = function (ovpList) {
            return {
                getItems: function () {
                    return [{
                        getIcon: function () {
                            return icon
                        },
                        getDomRef: function () {
                            return {
                                children: [{
                                    id: "ovpIconImage",
                                    children: [{
                                        getAttribute: function (val1) {
                                            return "sapMImg sapMSLIImgThumb"
                                        },
                                        setAttribute: function (val1, val2) {
                                            oController.attributeClass = val2;
                                            return val2;
                                        }
                                    }]
                                }],
                                getAttribute: function (val) {
                                    return val;
                                },
                                insertBefore: function (val1, val2) {
                                    oController.placeHolderClass = val1.className;
                                    return "";
                                }
                            }
                        },
                        getDescription: function () {
                            return desc;
                        },
                        getTitle: function () {
                            return "Electronics Retail & Co.";
                        },
                        addStyleClass: function (val) {
                            oController.class = val;
                            return val;
                        }
                    }]
                },
                getDomRef: function () {
                    return {
                        getAttribute: function () {
                            return "sapMList sapMListBGSolid";
                        },
                        setAttribute: function (val1, val2) {
                            oController.densityClass = val2;
                            return val2;
                        }
                    }
                }
            }
        }

    }

    test("Card Test - onAfterRendering, when density style = compact and imageDensity = true", function () {
        var image = "https://www.w3schools.com/css/trolltunga.jpg"
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("compact");
        var expectedValue = "sapOvpListWithImageIconCompact";
        ok(oController.densityClass.indexOf("sapOvpListImageCompact") != -1, "Set the list image compact css")
        ok(oController.class === expectedValue, "Set the compact css when image is present");

    });

    test("Card Test - onAfterRendering, when density style = cozy and imageDensity = true", function () {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "Smart Firewall", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageIconCozy";
        ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css")
        ok(oController.class === expectedValue1, "Set the css when image is present");
        ok(oController.attributeClass.indexOf("sapOvpImageCozy") != -1, "Set the attribute css");
    });

    test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true, no description and icon is present", function () {
        var icon = "https://www.w3schools.com/css/trolltunga/icon.jpg"
        ImageStyle(oController, "", icon);
        oController._addImageCss("cozy");
        var expectedValue = "sapOvpListWithIconNoDescCozy";
        ok(oController.densityClass.indexOf("sapOvpListImageCozy") != -1, "Set the list image cozy css")
        ok(oController.class === expectedValue, "Set the css when icon is present");
    });

    test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no description", function () {
        var image = "https://www.w3schools.com/css/trolltunga.jpg";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        var expectedValue1 = "sapOvpListWithImageNoDescCozy";
        ok(oController.class === expectedValue1, "Set the css when image is present");
    });

    test("Card Test - onAfterRendering, when density style = cozy, imageDensity = true and no image and icon is present", function () {
        var image = "";
        ImageStyle(oController, "", image);
        oController._addImageCss("cozy");
        ok(oController.placeHolderClass.indexOf("sapOvpImageCozy") != -1, "There is no image and icon present");
    });
    // /**
    //  *  End of test cases
    //  *  This function does some CSS changes after the card is rendered
    //  */

    // /**
    //  *
    //  * Start of test cases onListItemPress
    //  */
    test("List Card Test - On Content click of OVP Cards used as an API in other Applications", function () {
        var oOVPCardAsAPIUtilsStub = sinon.stub(OVPCardAsAPIUtils, "checkIfAPIIsUsed", function () {
            return true;
        });
        var oCommonUtilsStub = sinon.stub(CommonUtils, "onContentClicked", function () {
            return undefined;
        });
        oController.checkAPINavigation = function () {
            return 1;
        }
        var actualValue = oController.onListItemPress();
        ok(actualValue === undefined, "Valid semantic object and action are not available");
        oOVPCardAsAPIUtilsStub.restore();
        oCommonUtilsStub.restore();
    });
    /**
     *
     * End of test cases onListItemPress
     */
});
