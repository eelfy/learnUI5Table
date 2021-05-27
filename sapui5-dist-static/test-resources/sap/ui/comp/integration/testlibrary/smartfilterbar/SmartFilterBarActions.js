sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/comp/integration/testlibrary/TestUtils",
    "sap/ui/test/OpaBuilder"
], function (Opa5, Press, EnterText, TestUtils, OpaBuilder) {
	"use strict";

	return {
        iShowFilterBar: function(){},
        iHideFilterBar: function(){},
        iPressTheRestoreButton: function () {},
        iPressTheFilterBarGoButton: function () {},
        iPressSearchFieldIconButton:function (sId) {},
        iEnterValueInFilter: function (sFilterId, sValue, bKeepFocus) {},
        iOpenTheAdaptFiltersDialog: function () {},
        iSelectAVariant: function(){},
        iSwichtToLiveMode: function(){},
        iSwitchToManualMode: function(){},
        // Adapt Filters
        iSelectAFilter: function(sFilterId){},
        iDeselectAFilter: function(sFilterId){},
        iPressTheOKButton: function () {},
        iPressTheCancelButton: function () {},
        iPressTheResetButton: function () {},
        iConfirmTheReset: function(){},
        iCancelTheReset: function(){},
        iFilterFiltersByState: function(oState){},
        iExpandFilterGroup: function(sGroupName){},
        iCollapseFilterGroup: function(sGroupName){},
        iFilterFiltersByText: function(sText){}
    };
});