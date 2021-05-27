sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/core/format/DateFormat',
	'sap/ui/core/library',
	'sap/ui/comp/integration/testlibrary/CompTestLibrary'
], function (
	Opa5,
	opaTest,
	DateFormat,
	coreLibrary
) {
	'use strict';

	var coreResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");
	var sCurrencyControlId = "__xmlview0--Currency";
	var sCurrencyCodeControlId = "__xmlview0--Currency-sfEdit";
	var ValueState = coreLibrary.ValueState;


	var fnGetDateTime = function (iYear, iMonth, iDate, iHour, iMinute, iSecond) {
		var oDate = new Date(iYear, iMonth, iDate, iHour, iMinute, iSecond);
		iMonth = iMonth + 1;
		var sMonth = iMonth < 10 ? "0" + iMonth : "" + iMonth;
		var sDate = oDate.getUTCDate() < 10 ? "0" + oDate.getUTCDate() : "" + oDate.getUTCDate();
		var sHours = oDate.getUTCHours() < 10 ? "0" + oDate.getUTCHours() : "" + oDate.getUTCHours();
		var sMinutes = oDate.getUTCMinutes() < 10 ? "0" + oDate.getUTCMinutes() : "" + oDate.getUTCMinutes();
		var sSeconds = oDate.getUTCSeconds() < 10 ? "0" + oDate.getUTCSeconds() : "" + oDate.getUTCSeconds();
		var sDtOffset = "" + oDate.getUTCFullYear() + "-" + sMonth + "-" + sDate + "T" +
			sHours + ":" + sMinutes + ":" + sSeconds + ".000Z";
		return sDtOffset;
	};

	var fnGetDateInTimeZone = function (iYear, iMonth, iDate) {
		var oDate = new Date(Date.UTC(iYear, (iMonth - 1), iDate, 0, 0, 0));
		var oFormat = DateFormat.getDateInstance({pattern: "yyyyMMdd"});
		return oFormat.format(oDate);
	};

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/smartfield/SmartFieldTypes/SmartField_Types.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfield/opa/SmartFieldTypes/pages/SmartFieldTypes"
	]);

	opaTest("When SmartFields with date values get enabled/disabled, their values should stay consistent", function (Given, When, Then) {
		//Arrangement
		var sStringDateValue = "Dec 15, 2000",
			sDateTimeValue = "Oct 24, 2014, 2:20:00 PM", // sap.ui.model.odata.type.DateTimeBase.prototype.formatValue(new Date("Oct 24, 2014, 2:20:00 PM"), "string")
			sDateTimeOffsetValue = "Oct 24, 2014, 2:20:00 PM", // sap.ui.model.odata.type.DateTimeOffset.prototype.formatValue(new Date("Oct 24, 2014, 2:20:00 PM"), "string")
			sDateValue = "Oct 24, 2014";

		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--date", sDateValue);
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--dateTime", sDateTimeValue);
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--dtOffset", sDateTimeOffsetValue);
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--stringDate", sStringDateValue);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--date", sDateValue);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--dateTime", sDateTimeValue);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--dtOffset", sDateTimeOffsetValue);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--stringDate", sStringDateValue);

		//Action
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--date", sDateValue);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--dateTime", sDateTimeValue);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--dtOffset", sDateTimeOffsetValue);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--stringDate", sStringDateValue);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When SmartFields gets enabled/disabled, its inner controls of a type SmartLink should get updated accordingly", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithoutDomAttribute("__xmlview0--smartLink", "aria-disabled");

		//Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldControlProperty("__xmlview0--smartLink", "enabled", false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithDomAttribute("__xmlview0--smartLink", "aria-disabled", "true");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I start the 'SmartField_Types' app, the SmartFields should have the right values displayed", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--date", "Oct 24, 2014");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--time", "11:33:55 AM");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue("__xmlview0--dtOffset", new Date(1414149600000).toString());
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--stringDate", "Dec 15, 2000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--string", "SB");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--stringUpperCase", "aa");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--decimal", "45,301.23");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--double", "127,890.134");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--int16", "35");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--byte", "122");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--bool", true);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--inKey", "A");

	});

	opaTest("When I change value of SmartField the data should change", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--date", "May 21, 2019");
		When.onTheSmartFieldTypesPage.iDisableSmartFieldTimePickerMask("__xmlview0--time");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--time", "101010PM"); // no : because of edit mask
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--dtOffset", "May 22, 2019, 7:01:30 AM");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--stringDate", "May 22, 2019");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--string", "Hi");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--stringUpperCase", "HELLO");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--decimal", "1234.56");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--double", "1234.56");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--int16", "1234");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--byte", "123");
		When.onTheSmartFieldTypesPage.iUncheckSmartFieldItem("__xmlview0--bool");

		//for Test create Date string time zone independent:
		var sDtOffset = fnGetDateTime(2019, 4, 22, 7, 1, 30);
		var sDateOffset = fnGetDateInTimeZone(2019, 5, 22);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeData("DATE", "2019-05-21T00:00:00.000Z");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("TIME", {ms: 79810000, __edmType: "Edm.Time"});
		Then.onTheSmartFieldTypesPage.iShouldSeeData("DTOFFSET", sDtOffset);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("STRINGDATE", sDateOffset);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("STRING", "Hi");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("STRINGUPPERCASE", "HELLO");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("DECIMAL", "1234.56");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("DOUBLE", 1234.56);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("INT16", 1234);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("BYTE", 123);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("BOOL", false);

		Given.iStopMyApp();
	});


	opaTest("When I use the value help the in-parameters are set as filter", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iOpenVHD("__xmlview0--key-input");
		When.onTheSmartFieldTypesPage.iExpandVHDFilters();

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(7, 2);
		Then.onTheSmartFieldTypesPage.iCheckFieldContainsToken("__xmlview0--key-input-valueHelpDialog-smartFilterBar-filterItemControlA_-InKey", "=A");

	});


	opaTest("When I select an entry out-parameters are set", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iSelectSecondRowInVHDTable();

		//Assertion

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--key", "02");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDate", "Jan 1, 2019");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outTime", "1:01:01 AM");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue("__xmlview0--outDateTime", new Date(1546300861000).toString());
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outStringDate", "Jan 1, 2019");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDecimal", "654.32");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDouble", "654.321");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outInt16", "21");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outByte", "321");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outBool", false);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("Key", "02");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDate", "2019-01-01T00:00:00.000Z");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutTime", {ms: 3661000, __edmType: "Edm.Time"});
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDateTime", "2019-01-01T00:01:01.000Z");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutStringDate", "20190101");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDecimal", "654.321"); // TODO really? (Fits not to constraints)
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDouble", 654.321);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutInt16", 21);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutByte", 321);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutBool", false);

	});

	opaTest("When I open the ComboBox I should see the items filtered by A in parameter", function (Given, When, Then) {

		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iOpenSuggestionsForSmartField("__xmlview0--key2");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered("__xmlview0--key2", 2);

	});

	opaTest("When I select an entry out-parameters are set", function (Given, When, Then) {

		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iSelectSmartFieldFirstDropdownItem("__xmlview0--key2");

		// //Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--key2", "01");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDate", "May 20, 2019");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outTime", "8:32:11 AM");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndDateTimeValue("__xmlview0--outDateTime", new Date(1558333855900).toString());
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outStringDate", "May 20, 2019");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDecimal", "123.45");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outDouble", "123.456");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outInt16", "12");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outByte", "123");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--outBool", true);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("Key2", "01");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDate", "2019-05-20T00:00:00.000Z");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutTime", {ms: 30731000, __edmType: "Edm.Time"});
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDateTime", "2019-05-20T06:30:55.000Z");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutStringDate", "20190520");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDecimal", "123.456");
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutDouble", 123.456);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutInt16", 12);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutByte", 123);
		Then.onTheSmartFieldTypesPage.iShouldSeeData("OutBool", true);

	});

	opaTest("When I change the In Parameter and open the combobox, the items are filtered", function (Given, When, Then) {

		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--inKey", "B");
		When.onTheSmartFieldTypesPage.iOpenSuggestionsForSmartField("__xmlview0--key2");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered("__xmlview0--key2", 1);

	});

	opaTest("When I toggle between display/edit mode and open the combobox, the items are filtered", function (Given, When, Then) {

		//Action
		When.onTheSmartFieldTypesPage.iPressButton("__xmlview0--btnCancel-button");
		When.onTheSmartFieldTypesPage.iPressButton("__xmlview0--btnEdit-button");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--key2-comboBoxEdit", "0");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFiledPopupFiltered("__xmlview0--key2", 1);

		Given.iStopMyApp();
	});

	opaTest("When I entered invalid value in fixed-list and change mode should have entered value in the model", function (Given, When, Then) {
		Given.iEnsureMyAppIsRunning();
		//Action

		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--key2", "5");
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);


		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue("__xmlview0--key2", "5");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--key2", "5");

		Given.iStopMyApp();
	});

	opaTest("When I entered invalid value in fixed-list and toggle from edit/disply mode should have entered value in the model", function (Given, When, Then) {
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--key2", "5");
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(true);


		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue("__xmlview0--key2", "5");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--key2", "5");

		Given.iStopMyApp();
	});

	opaTest("When has default guid which is not in list item not to show it", function (Given, When, Then) {
		Given.iEnsureMyAppIsRunning();

		//Action

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue("__xmlview0--stringFixed", "00000000-0000-0000-0000-000000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--stringFixed", "");

		Given.iStopMyApp();
	});

	opaTest("When SmartFields value is not valid should has error state", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--date", "May 32, 2019");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--dtOffset", "May 32, 2019, 7:01:30 AM");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--stringDate", "May May");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--string", "Hello Hello Hello");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--decimal", "1234.56a");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--double", "1234.56a");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--int16", "1234a");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--byte", "123a");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--date", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--dtOffset", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--stringDate", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--string", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--decimal", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--double", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--int16", ValueState.Error);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--byte", ValueState.Error);

		Given.iStopMyApp();
	});

	opaTest("When SmartFields has an empty value and is in a Form, it should be indicated in a meaningful way", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator("__xmlview0--CurrencyCodeFixedValues");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator("__xmlview0--Currency");

		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--smartLink");

		//Action
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(true);
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--CurrencyCodeFixedValues", "European Euro");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--Currency", "110");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--Currency-sfEdit", "EUR");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--smartLink", "");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--CurrencyCodeFixedValues");
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--Currency");
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--smartLink");

		//Assertion
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--CurrencyCodeFixedValues");
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--Currency");

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator("__xmlview0--smartLink");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When SmartFields is in a Form and has a OjectStatus inner control with an empty value, it should be indicated in a meaningful way", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldInnerControlProperties("__xmlview0--objectStatus", {"text": "",
																	"title": "",
																	"icon": "",
																	"state": ValueState.Success});

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithEmptyIndicator("__xmlview0--objectStatus");

		//Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldInnerControlProperties("__xmlview0--objectStatus", {"text": "Available",
																	"title": "",
																	"icon": "",
																	"state": ValueState.None});

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--objectStatus");

		//Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldInnerControlProperties("__xmlview0--objectStatus", {"text": "",
																	"title": "Title",
																	"icon": "",
																	"state": ValueState.None});

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--objectStatus");

		//Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldInnerControlProperties("__xmlview0--objectStatus", {"text": "",
																	"title": "",
																	"icon": "sap-icon://message-success",
																	"state": ValueState.None});

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldNotSeeSmartFieldWithEmptyIndicator("__xmlview0--objectStatus");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When SmartFields UOM field edit mode has been toggled the CSS should be as expected", function (Given, When, Then) {

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeUomFieldWithShrinkFactorOf("__xmlview0--Currency", 1);

		//Action
		When.onTheSmartFieldTypesPage.iToggleUomEditMode("__xmlview0--Currency", false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeUomFieldWithShrinkFactorOf("__xmlview0--Currency", 0);

		//Action
		When.onTheSmartFieldTypesPage.iToggleUomEditMode("__xmlview0--Currency", true);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeUomFieldWithShrinkFactorOf("__xmlview0--Currency", 1);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When SmartFields value is not valid should has error text", function (Given, When, Then) {

		var sCurrentYear = new Date().getFullYear();

		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--date", "May 32, 2019");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--dtOffset", "May 32, 2019, 7:01:30 AM");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--stringDate", "May May");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--string", "Hello Hello Hello");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--decimal", "1234.56a");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--double", "1234.56a");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--int16", "1234a");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--byte", "123a");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--date", "Enter a valid date in the following format: Dec 31, " + sCurrentYear);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--dtOffset", "Enter a valid date and a valid time in the following format: Dec 31, " + sCurrentYear + ", 11:59:58 PM");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--stringDate", " is not a valid date");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--string", "Enter a text with a maximum of 2 characters and spaces");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--decimal", "Enter a number");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--double", "Enter a number");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--int16", coreResourceBundle.getText("EnterInt"));
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueStateText("__xmlview0--byte", coreResourceBundle.getText("EnterInt"));

		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.00");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.5");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.5");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.50");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.50");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.500");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.500");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.50");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.5000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "100000000000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10,000,000,000.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000.500");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10000000000.500");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input an invalid currency type, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000.50");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "foo");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "foo");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency value and an empty string for currency code, the amount should be formatted with scale of 2 with value state of NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.00");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency value and an empty string for currency code for Mandatory field, but clientSideMandatoryCheck is set to false, there should be no validation error", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--CurrencyMandatory", "10");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState("__xmlview0--CurrencyMandatory-sfEdit", ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input an amount with only zeros as fraction digits and currency code without fraction, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.00");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.5");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.50");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.50");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.500");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.500");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid scale, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10.5000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10.5000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "10000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10,000,000,000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "100000000000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "100000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "100,000,000,000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "1000000000000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "1000000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "1,000,000,000,000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a currency value with invalid precision, the binding currency value should fallback to the last valid one with value state of ERROR", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "HUF");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "1000000000000");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "10000000000000");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "HUF");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyCodeControlId, ValueState.None);

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, "1000000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "10000000000000");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.Error);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I input a valid currency amount and code, it should be formatted correctly with value state NONE", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "USD");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyCodeControlId, "USD");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyCodeControlId, "USD");

		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue(sCurrencyControlId, null);
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue(sCurrencyControlId, "");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithValueState(sCurrencyControlId, ValueState.None);

		// Clean
		Given.iStopMyApp();
	});


	opaTest("When I use the ValueHelp dialog in SmartFields should take over a value into the basic search", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--key-input", "0", true);
		When.onTheSmartFieldTypesPage.iOpenVHD("__xmlview0--key-input");

		//Assertion
		When.onTheSmartFieldTypesPage.iExpandVHDFilters();
		Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(7, 2);
		Then.onTheSmartFieldTypesPage.iCheckValueHelpDialogBasicSearchTextEqualsTo("0");

		Given.iStopMyApp();
	});


	opaTest("When I use the ValueHelp dialog with deprecation code annotation in SmartFields it should hide revoked values", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iOpenVHD("__xmlview0--CurrencyCodeDeprecationCodeValues-input");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithTitle("Currency with DeprecationCode annotation");

		// Action
		When.onTheSmartFieldTypesPage.iExpandVHDFilters();

		// Assertion
		Then.onTheSmartFieldTypesPage.iCheckVHDFilterBarHasFilterWithLabelAndValue("Currency Status", "");
		// Action
		When.onTheSmartFieldTypesPage.iPressTheVHDFilterGoButton();

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(2,7);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I use the ValueHelp dialog with deprecation code annotation in SmartFields it should display revoked values on search", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iOpenVHD("__xmlview0--CurrencyCodeDeprecationCodeValues-input");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithTitle("Currency with DeprecationCode annotation");

		// Action
		When.onTheSmartFieldTypesPage.iExpandVHDFilters();

		//Assertion
		Then.onTheSmartFieldTypesPage.iCheckVHDFilterBarHasFilterWithLabelAndValue("Currency Status", "");

		// Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--CurrencyCodeDeprecationCodeValues-input-valueHelpDialog-smartFilterBar-filterItemControlA_-DeprecationCode", "=E");

		// Action
		When.onTheSmartFieldTypesPage.iPressTheVHDFilterGoButton();

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeValueHelpDialogWithFiltersAndRows(2,2);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I use SmartFields with TextArrangement type whitespace from the end of a string value should get trimmed", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--languageCode1", "CN      ");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--languageCode1", "CN (China)");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I use SmartFields with Value List fixed-values and TextArrangement type, I should see the text and its description in display mode", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iSelectDropdownItemWithKey("__xmlview0--languageCode3", "CN");
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue("__xmlview0--languageCode3", "CN (China)");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I use SmartFields with TextArrangement type with IsUpperCase annotations, the user input should be must be coverted to uppercase", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--languageCode5", "aa");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--languageCode5", "AA");

		// Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--languageCode5", "bb");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--languageCode5", "BB");

		// Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--languageCode5", "cc");

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--languageCode5", "CC");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I use SmartFields with Value List fixed-values (ComboBox) and enter value which is not in the list to be saved in the model and shown in display mode", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--languageCode3", "NV");
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue("__xmlview0--languageCode3", "NV");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue("__xmlview0--languageCode3", "NV");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--languageCode3", "NV");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When I use SmartFields with Value List fixed-values (ComboBox) and enter value which is not in the list but the list have key empty string should update the model", function (Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		//Action
		When.onTheSmartFieldTypesPage.iChangeFirstItemKeyInInnerControl("__xmlview0--languageCode3", "");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField("__xmlview0--languageCode3", "NV");
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		//Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue("__xmlview0--languageCode3", "NV");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndBindingValue("__xmlview0--languageCode3", "NV");
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndValue("__xmlview0--languageCode3", "NV");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("In Display mode, when currency does not have decimal (like JPY), there should be only one space added to the amount", function(Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyControlId, "123");
		When.onTheSmartFieldTypesPage.iEnterTextInSmartField(sCurrencyCodeControlId, "JPY");
		When.onTheSmartFieldTypesPage.iToggleFormEditMode(false);

		// Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeSmartFieldWithIdAndInnerControlValue(sCurrencyControlId, "123" + "\u2007");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When Form has low importance, fields should be visible regardles of importance", function(Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iSetSmartFormControlProperty("__xmlview0--form", "importance", "Low");

		// Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--HighImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--MediumImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--LowImportance", "");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When Form has medium importance, field with low importance should be hidden", function(Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iSetSmartFormControlProperty("__xmlview0--form", "importance", "Medium");

		// Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--HighImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--MediumImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--LowImportance", "none");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When form has high importance fields with medium and low importance should be hidden", function(Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iSetSmartFormControlProperty("__xmlview0--form", "importance", "High");

		// Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--HighImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--MediumImportance", "none");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--LowImportance", "none");

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When field has property 'visible' set to false, it should stay hidden regardless of importance", function(Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldControlProperty("__xmlview0--HighImportance", "visible", false);
		When.onTheSmartFieldTypesPage.iSetSmartFieldControlProperty("__xmlview0--LowImportance", "visible", false);
		When.onTheSmartFieldTypesPage.iSetSmartFormControlProperty("__xmlview0--form", "importance", "Low");


		// Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--HighImportance", null);
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--MediumImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--LowImportance", null);

		// Clean
		Given.iStopMyApp();
	});

	opaTest("When field has property 'mandatory' set to true, it should stay visible regardless of importance", function(Given, When, Then) {
		//Arrangement
		Given.iEnsureMyAppIsRunning();

		// Action
		When.onTheSmartFieldTypesPage.iSetSmartFieldControlProperty("__xmlview0--HighImportance", "mandatory", true);
		When.onTheSmartFieldTypesPage.iSetSmartFieldControlProperty("__xmlview0--MediumImportance", "mandatory", true);
		When.onTheSmartFieldTypesPage.iSetSmartFieldControlProperty("__xmlview0--LowImportance", "mandatory", true);
		When.onTheSmartFieldTypesPage.iSetSmartFormControlProperty("__xmlview0--form", "importance", "High");


		// Assertion
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--HighImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--MediumImportance", "");
		Then.onTheSmartFieldTypesPage.iShouldSeeGroupElementWithCSSDisplay("__xmlview0--Importance", "__xmlview0--LowImportance", "");

		// Clean
		Given.iStopMyApp();
	});
});
