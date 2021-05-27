sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report: LR & OP Navigation");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", "manifestReuse");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
		});

		opaTest("Check the Delete button is not availble on the table toolbar in case of in-line delete", function (Given, When, Then) {
			When.onTheGenericListReport
				.iLookAtTheScreen();
			Then.onTheGenericListReport
				.iShouldNotSeeTheButtonWithIdInToolbar("template::ListReport::TableToolbar","deleteEntry");
		});

		opaTest("Check the in-line delete action", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickDeleteButtonOnNthRowOfTable(1);
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000010?");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object deleted")
				.and
				.theAvailableNumberOfItemsIsCorrect("1,079");
		});

		opaTest("Navigating to the Object Page", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012");
		});

		opaTest("Navigating to the Sub-ObjectPage and check the Object Page table selection is retained", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_Item", 0)
				.and
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown","STTA_C_SO_SalesOrderItem_ND")
				.and
				.iClickTheLastBreadCrumbLink();
			Then.onTheGenericObjectPage
				.theListItemIsSelected("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 0);

		});

		opaTest("Enter Edit mode of Non Draft object", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "JAMILA"
				})
				.and
				.theButtonWithLabelIsEnabled("Save", true);
		});

		opaTest("Discard Changes in Non Draft", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","2222")
				.and
				.iClickTheButtonWithId("cancel")
				.and
				.iClickTheButtonWithId("DiscardDraftConfirmButton");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "JAMILA"
				});
		});

		opaTest("Navigating back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			Then.onTheListReportPage
				.theSmartTableIsVisible("STTA_C_SO_SalesOrder_ND--listReport");
		});

		opaTest("Share Button Rendering on List Report", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlWithId("template::Share");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("shareEmailButton", {"visible": true, "enabled": true});
		});

		opaTest("Click Create focus should set on first editable Input Field ", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Create");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_SO_SalesOrder_ND");
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information"])
				.and
				.iExpectFocusSetOnControlById("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::BusinessPartnerID::Field-input");
		});

		opaTest("Check Create button and toast message after creation", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theButtonWithLabelIsEnabled("Create", true);
			When.onTheGenericObjectPage
				.iSaveTheDraft(true);
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Object created");
			Then.iTeardownMyApp();
		});

		opaTest("External navigation in create mode", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("SalesOrder-nondraft,SalesOrder-MultiViews#SalesOrder-nondraft");
			When.onTheListReportPage
				.iClickOnButtonWithText("Sales Order-MES(Ext nav to createMode)");
			Then.onTheObjectPage
				.iCheckObjectPageEntitySet("C_STTA_SO_BPAContact");
			Then.iTeardownMyApp();
		});
	}
);
