sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	// All the actions for Opa tests are defined here
	var CommonActions = Opa5.extend("sap.ovp.test.integrations.pages.CommonActions", {
 
		iClickTheAdaptFiltersButton: function(btnName) {
            return this.waitFor({
                controlType: "sap.m.Button",
                success: function(aButtons) {

                    for (var i in aButtons) {
                        if (aButtons[i].getId().indexOf("ovpGlobalFilter") > -1 ) {
                            aButtons[i].$().trigger("tap");
                            break;
                        }
                    }
                },
                errorMessage: " Adapt Filters button cant be clicked"
            });
        },
        iClickTheCardHeader: function (sID) {
            return this.waitFor({
                controlType: "sap.m.VBox",
                timeout: 45,
                success: function (aHBox) {
                    for (var i in aHBox) {
                        var headerID = sID + "Original--ovpCardHeader";
                        if(aHBox[i].getId() == headerID)
                        {
                            aHBox[i].$().trigger("click");
                            QUnit.ok(true, "card header clicked");            
                    
                        } 
                    }    
                },
                errorMessage: "The header cannot be clicked"
            });
        },
        iClickTheCardItem: function (sID, sNum) {
            return this.waitFor({
                controlType: "sap.m.ColumnListItem",
                timeout: 45,
                success: function (aRow) {
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1 && rowID.indexOf(sNum) > -1)
                        {
                            //aRow[i].$().trigger("click");
                            aRow[i].firePress();
                            QUnit.ok(true, "Card Row#1 clicked");
                            break;        
                    
                        } 
                    }    
                },
                errorMessage: "The Row cannot be clicked"
            });
        },
        iClickBackButton: function () {
            return this.waitFor({
                controlType: "sap.m.Button",
                check: function (btns) {
                    for (var i = 0; i < btns.length; i++) {
                        if (btns[i].getId().indexOf("shellAppTitle") !== -1) {
                            var backButton = btns[i].getParent().getHeadItems();
                            for (var j = 0; j < backButton.length; j++) {
                                if (backButton[j].sId.indexOf("backBtn") !== -1) {
                                    backButton[j].firePress();
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                },
                success: function () {
                    // btns[0].firePress();
                    QUnit.ok(true, "Back Button Pressed");
                },
                errorMessage: "Back Button not working"
            });
        },
        iClickDropdownPopoverSearchFieldWithFilter: function(sFilter) {
            var oSearchButton;
             return this.waitFor({
                //searchOpenDialogs: true,
                controlType: "sap.m.SearchField",
                check : function (aSearchField) {
                    var bFlag = false;
                    if (aSearchField) {
                        aSearchField[0].setValue(sFilter);
                        oSearchButton = aSearchField[0];
                        bFlag = true;
                    }
                    return bFlag;
                },
                success: function() {
                    oSearchButton.fireSearch();
                    QUnit.ok(true,"Dropdown popover search triggered");
                 },
                errorMessage: "Dropdown popover search trigger failed"
             });
        }
	});

	return CommonActions;

});