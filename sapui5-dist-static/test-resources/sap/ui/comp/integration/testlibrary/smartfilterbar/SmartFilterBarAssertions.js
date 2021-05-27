sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/comp/integration/testlibrary/TestUtils"
], function (Opa5, TestUtils) {
    "use strict";

    return {
        iCheckFilterBarIsVisible: function(){},
        iCheckListOfFiltersIsDisplayed: function(aFilters){},
        iCheckVariantIsSelected: function(sVariantName){},
        iCheckFilterIsAtPosition: function(sFilterId, nPositionIndex){},
        // AdaptFilters
        iCheckFilterIsSelected: function(sFilterId){},
        iCheckFilterIsNotSelected: function(sFilterId){},
        iCheckFilterExists: function(sFilterId){},
        iCheckFilterValueHasTokens: function(aTokens){},
        iCheckGroupExists: function(sGroupName){},
        iCheckGroupHasNumberOfFilters: function(nCount){},
        iCheckGroupHasListOfFilters: function(aFilters){}
    };
});