sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report - Data Loss Navigation");

			opaTest("Start the app and load data", function (Given, When, Then) {
				// arrangements
				Given.iStartMyAppInSandbox("SalesOrder-nondraft#SalesOrder-nondraft");

				When.onTheGenericListReport
					.iExecuteTheSearch();

				Then.onTheGenericListReport
					.theResultListIsVisible();
			});

			opaTest("Select items in the ListReport and press 'Set Random Opp ID' button", function (Given, When, Then) {

				// actions
				When.onTheGenericListReport
					.iSelectListItemsByLineNo([0], true)
					.and
					.iSelectListItemsByLineNo([2], true)
					.and
					.iClickTheButtonWithId("RandomOppID") // changes OpportunityId for 2 selected items
					.and
					.iNavigateFromListItemByLineNo(2);

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Warning");
			});

			opaTest("Navigate to the Object Page", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Leave Page");

				Then.onTheGenericObjectPage
					.theObjectPageDataFieldHasTheCorrectValue({
						Field  : "OpportunityID",
						Value : "JAMILA"
					});
			});

			opaTest("Navigate back to List Report and check if changed fields have initial values", function (Given, When, Then) {
				When.onTheObjectPage
					.iClickTheControlWithId("backBtn", "Back");
				Then.onTheGenericListReport
					.theResultListFieldHasTheCorrectValue({Line: 0, Field: "OpportunityID", Value: "2222"})
					.and
					.theResultListFieldHasTheCorrectValue({Line: 2, Field: "OpportunityID", Value: "JAMILA"});
			});

			opaTest("Navigate to Object Page and press 'Edit' button, change a value and navigate back to the List Report", function (Given, When, Then) {
				When.onTheGenericListReport
					.iNavigateFromListItemByLineNo(2);
				When.onTheGenericObjectPage
					.iClickTheButtonHavingLabel("Edit")
					.and
					.iSetTheObjectPageDataField("GeneralInformation", "OpportunityID", "1111");
				When.onTheObjectPage
					.iClickTheControlWithId("backBtn", "Back");
				Then.onTheGenericObjectPage
					.iShouldSeeTheDialogWithTitle("Warning");
			});

			opaTest("Click button 'Leave Page' in dialog and navigate back to the List Report", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iClickTheButtonOnTheDialog("Leave Page");

				Then.onTheGenericListReport
					.theResultListFieldHasTheCorrectValue({Line:2, Field:"OpportunityID", Value:"JAMILA"})
					.and
					.iTeardownMyApp();
			});
	}
);
