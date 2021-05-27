sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	// All the assertions for Opa tests are defined here
	var CommonAssertions = Opa5.extend("sap.ovp.test.integrations.pages.CommonAssertions", {
 
		dialogOpen: function() {
            return this.waitFor({
                controlType: "sap.m.Title",
                matchers: new sap.ui.test.matchers.PropertyStrictEquals({
                    name: "text",
                    value: "Adapt Filters"
                }),
                success: function(oTitle) {
                    QUnit.ok(true, "Setting Dialog opened with a title");
                },
                errorMessage: "Setting Dialog not opened with a title."
            });
        },
        checkNavParams: function (sKey, sValue) {
            return this.waitFor({
               // Turn off autoWait
               autoWait: true,
               check: function () {
                   // Locate the message toast using its class name in a jQuery function
                   var hash = sap.ui.test.Opa5.getWindow().location.hash;
                   var propertySplit = hash.split(sKey)[1];
                   var propertyValue = propertySplit && propertySplit.split("&")[0];
                   if (propertyValue.indexOf(sValue) > -1){
                      return true;
                   }
               },
               success: function () {
                   Opa5.assert.ok(true, "Parameter passed to target app");
               },
               errorMessage: "Parameter did not gets paased to target app"
           });
       },
        checkForNumberOFColumnsInTableCard: function (tableID) {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 30,
                success: function (aTables) {
                    var count = 0;
                    var tbl;
                    for (var i in aTables) {
                       var tID = aTables[i].getId();
                       if (tID.indexOf(tableID) > -1) { 
                            tbl = aTables[i];
                            break;
                        }
                    }

                    var cols = tbl && tbl.getColumns();
                    for (var i in cols) {
                        count += cols[i].getVisible() ? 1 : 0; 
                    }
                    if (count == 3) {
                        QUnit.ok(true, "max " + count + " columns");
                    }

                },
                errorMessage: "Columns not ok"
            });
        },
        iCheckRowAfterNav: function (sID) {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 45,
                success: function (aRow) {
                    var count = 0;
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1){
                            var aItems = aRow[i].mAggregations.items;
                            if (aItems.length == 1){
                               QUnit.ok(true, "Row Navigation Successful");
                               break;
                            }
                        }   
                    }            
                },
                errorMessage: "The Row navigation not successful"
            });
        },
        checkAppTitle: function (appName) {
            var bSuccess = false;
            return this.waitFor({
                controlType: "sap.m.Button",
                timeout: 30,
                check: function (aButtons) {
                    for (var i in aButtons) {
                        if (aButtons[i].getId().indexOf("shellAppTitle") !== -1) {
                            if (aButtons[i].getText() === appName) {
                                bSuccess = true;
                            }
                        }
                    }
                    return bSuccess;
                },success: function() {
                    
                    QUnit.ok(true, "Title found successfully");
                },
                errorMessage: "Cannot navigate to new app"
            });
        },
        checkForNumberOFTableCard: function () {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 30,
                success: function (aTables) {
                    var count = 0;
                    for (var i in aTables) {
                       count++;
                    }
                    QUnit.ok(true, count + " Table Cards Present");
                },
                errorMessage: "Cannot find any Table Card"
            });
        },
        checkForNumberOFListCards: function () {
            return this.waitFor({
                controlType: "sap.m.List",
                timeout: 30,
                success: function (aList) {
                    var count = 0;
                    for (var i in aList) {
                       var listId = aList[i].getId();
                       if(listId.indexOf("Link") == -1){
                        count++;
                       }
                         
                    }
                    QUnit.ok(true, count + " List Cards Present")
                },
                errorMessage: "No List Card present"
            });
        },
        checkForListCardsHeaderTitles: function () {
            return this.waitFor({
                controlType: "sap.m.List",
                timeout: 30,
                success: function (aList) {
                    var count = 0;
                    for (var i in aList) {
                       var listId = aList[i].getId();
                       if(listId.indexOf("Link") == -1){
                        count++;
                        listId = listId.split("--");
                        listId = listId[0] + "--ovpHeaderTitle";
                        this.fetchListCardTitleControl(listId,count)
                       }
                         
                    }
                },
            });
        },
        fetchListCardTitleControl: function (listId,count) {
            return this.waitFor({
                id:listId,
                success: function(aTitles){

                   if(aTitles.getText()) {
                    QUnit.ok(true, "List Card " + count + " Title: " + aTitles.getText());
                   }
                   
                },
                errorMessage: "No List Card Title"
            })
        },
        checkForListCardsHeaderSubTitles: function () {
            return this.waitFor({
                controlType: "sap.m.List",
                timeout: 30,
                success: function (aList) {
                    for (var i in aList) {
                       var listId = aList[i].getId();
                       if(listId.indexOf("Link") == -1){
                           if(listId == "card009Original_Tab1--ovpList"){
                            listId = "card009Original_Tab1--ovpDescriptionValue-__box41-0";
                            this.fetchListCardTitleControl(listId)
                           }
                           else{
                            listId = listId.split("--");
                            listId = listId[0] + "--SubTitle-Text";
                            this.fetchListCardTitleControl(listId)
                           }

                       }
                         
                    }
                },
            });
        },
        fetchListCardSubTitleControl: function (listId) {
            return this.waitFor({
                id:listId,
                success: function(aTitles){

                   var count = 0; 
                   if(aTitles.getText()) {
                    count ++;
                    QUnit.ok(true, "List Card " + count + " Sub-Title: " + aTitles.getText());
                   }
                   else
                   {
                    count ++;
                    QUnit.ok(true, "List Card " + count + " Sub-Title: " + "NA");  
                   }
                   
                },
                errorMessage: "No List Card Title"
            })
        },
        checkForTableCardTitle: function () {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 30,
                success: function (aTables) {
                    var count = 0;
                    for (var i in aTables) {
                       count ++;
                       var titleID = aTables[i].getId().split("--");
                       titleID = titleID[0] + "--ovpHeaderTitle";
                       this.fetchTitleControl(titleID,count)
                    }
                },
               
            });
        },
        
        fetchTitleControl: function (titleID,count) {
            return this.waitFor({
                id:titleID,
                success: function(aTitles){
                   
                    QUnit.ok(true, "Table Card " + count + " Title: " + aTitles.getText());
                },
                errorMessage: "Cannot find any Table Card"
            })
        },
        
        checkForTableCardSubTitle: function () {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 30,
                success: function (aTables) {
                    var count = 0;
                    for (var i in aTables) {
                       count ++;
                       var subTitleID = aTables[i].getId().split("--");
                       subTitleID = subTitleID[0] + "--SubTitle-Text";
                       this.fetchSubTitleControl(subTitleID,count)
                    }
                },
                
            });
        },
        checkCriticalityForTableCard: function (cardID) {
            return this.waitFor({
                controlType: "sap.m.ObjectStatus",
                timeout: 30,
                success: function (aState) {
                    for (var i in aState) {
                       if(aState[i].getId().indexOf(cardID) !== -1)
                       {
                         if(aState[i].getState() == "Success" || aState[i].getState() == "Error")
                         {
                             QUnit.ok(true, "Criticality OK");
                         }
                       } 
                    }
                },
                errorMessage: "Criticality Not OK"
            });
        },
        fetchSubTitleControl: function (subTitleID,count) {
            return this.waitFor({
                id:subTitleID,
                success: function(aSubTitles){
                   
                    QUnit.ok(true, "Table Card " + count + " Sub-Title: " + aSubTitles.getText());
                },
                errorMessage: "Cannot find any Table Card"
            })
        },
        checkForTableCardHeaderCount: function () {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 30,
                success: function (aTables) {
                    var count = 0;
                    for (var i in aTables) {
                       count ++;
                       var headerID = aTables[i].getId().split("--");
                       headerID = headerID[0] + "--ovpCountHeader";
                       this.fetchHeaderControl(headerID,count)
                    }
                },
                
            });
        },
        fetchHeaderControl: function (headerID,count) {
            return this.waitFor({
                id:headerID,
                success: function(aHeader){
                   
                    QUnit.ok(true, "Table Card " + count + " HeaderCount: " + aHeader.getText());
                },
                errorMessage: "Cannot find any Table Card"
            })
        },
        checkForTableCardValueSelectionInfo: function () {
            return this.waitFor({
                controlType: "sap.m.Table",
                timeout: 30,
                success: function (aTables) {
                    var count = 0;
                    for (var i in aTables) {
                       count ++;
                       var headerID = aTables[i].getId().split("--");
                       headerID = headerID[0];
                       if(headerID == "card012Original_Tab1"){
                           headerID = headerID + "--ovpValueSelectionInfo";
                           this.fetchValueSelection(headerID);
                       }
                    }
                },
                
            });
        },
        fetchValueSelection: function (headerID) {
            return this.waitFor({
                id:headerID,
                success: function(aHeader){
                    QUnit.ok(true, "Value Selection info: " + aHeader.getText());
                },
                errorMessage: "Cannot find any Table Card"
            })
        },
        checkForListCardValueSelectionInfo: function () {
            return this.waitFor({
                controlType: "sap.m.List",
                timeout: 30,
                success: function (aList) {
                    var count = 0;
                    for (var i in aList) {
                       var listId = aList[i].getId();
                       if(listId.indexOf("Link") == -1){
                           count++;
                           var headerID = listId.split("--");
                           headerID = headerID[0];
                           if(headerID == "card009Original_Tab1"){
                                headerID = headerID + "--ovpValueSelectionInfo";
                                this.fetchValueSelection(headerID);
                           }
                       }
                    }
                },
                
            });
        },
        fetchValueSelection: function (headerID) {
            return this.waitFor({
                id:headerID,
                success: function(aHeader){
                    QUnit.ok(true, "Value Selection info: " + aHeader.getText());
                },
                errorMessage: "Cannot find any list Card value selection info"
            })
        },
        iCheckListCardKpiInfo: function (sID) {
            return this.waitFor({
                controlType: "sap.m.NumericContent",
                timeout: 45,
                success: function (aRow) {
                    var count = 0;
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1){
                            var KpiValue = aRow[i].getValue();
                            if(KpiValue == "10.3K"){
                               QUnit.ok(true, "KPI Info Value for list card" + ": " + KpiValue); 
                            } 
                        }   
                    }            
                },
                errorMessage: "The KPI value not present or incorrect"
            });
        },
        iCheckListCardKpiInfoColouring: function (sID) {
            return this.waitFor({
                controlType: "sap.m.NumericContent",
                timeout: 45,
                success: function (aRow) {
                    var count = 0;
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1){
                            var KpiValueColour = aRow[i].getValueColor();
                            if(KpiValueColour){
                               QUnit.ok(true, "KPI Info Colour value for list card" + ": " + KpiValueColour); 
                            } 
                        }   
                    }            
                },
                errorMessage: "The KPI Info not present"
            });
        },
        iCheckListCardKpiArrow: function (sID) {
            return this.waitFor({
                controlType: "sap.m.NumericContent",
                timeout: 45,
                success: function (aRow) {
                    var count = 0;
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1){
                            var arrowIndicator = aRow[i].getIndicator();
                            if(arrowIndicator){
                               QUnit.ok(true, "KPI Info arrow indicator for list card" + ": " + arrowIndicator); 
                            } 
                        }   
                    }            
                },
                errorMessage: "The KPI Info not present"
            });
        },
        iCheckListCardTargetValue: function (sID) {
            return this.waitFor({
                controlType: "sap.m.Text",
                timeout: 45,
                success: function (aRow) {
                    var count = 0;
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1  && rowID.indexOf("ovpTargetValue") > -1){
                            var targetValue = aRow[i].getText();
                            if(targetValue){
                               QUnit.ok(true, "Target Value for list card" + ": " + targetValue); 
                            } 
                        }   
                    }            
                },
                errorMessage: "Target Value not present"
            });
        },
        iCheckListCardDeviation: function (sID) {
            return this.waitFor({
                controlType: "sap.m.Text",
                timeout: 45,
                success: function (aRow) {
                    var count = 0;
                    for (var i in aRow) {
                        var rowID = aRow[i].getId();
                        if(rowID.indexOf(sID) > -1  && rowID.indexOf("kpiNumberPercentage") > -1){
                            var devValue = aRow[i].getText();
                            if(devValue){
                               QUnit.ok(true, "Deviation value for list card" + ": " + devValue); 
                            } 
                        }   
                    }            
                },
                errorMessage: "The Deviation display not present"
            });
        },
        checkForTableCardHeaderCount: function () {
            return this.waitFor({
                controlType: "sap.m.List",
                timeout: 30,
                success: function (aList) {
                    var count = 0;
                    for (var i in aList) {
                       var listId = aList[i].getId();
                       if(listId.indexOf("Link") == -1){
                           count++;
                           var headerID = listId.split("--");
                           headerID = headerID[0];
                           headerID = headerID + "--ovpCountHeader";
                       this.fetchHeaderControl(headerID,count);
                       }
                    }
                },
                
            });
        },
        fetchHeaderControl: function (headerID,count) {
            return this.waitFor({
                id:headerID,
                success: function(aHeader){
                    if(aHeader)
                    QUnit.ok(true, "List Card " + count + " HeaderCount: " + aHeader.getText());
                },
                errorMessage: "Cannot find any List Card"
            })
        },
        checkCriticalityForListCard: function (cardID) {
            return this.waitFor({
                controlType: "sap.m.StandardListItem",
                timeout: 30,
                success: function (aState) {
                    for (var i in aState) {
                       if(aState[i].getId().indexOf(cardID) !== -1)
                       {
                         if(aState[i].getInfoState() == "Error")
                         {
                             QUnit.ok(true, "Criticality OK");
                         }
                       } 
                    }
                },
                errorMessage: "Criticality Not OK"
            });
        },


    });
        

	return CommonAssertions;

});
