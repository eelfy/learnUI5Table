/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/ui/core/sample/common/Helper",
		"sap/ui/core/sample/common/pages/Any",
		"sap/ui/core/sample/odata/v4/FieldGroups/pages/Main",
		"sap/ui/test/Opa5",
		"sap/ui/test/opaQunit",
		"sap/ui/test/TestUtils"
	], function (Helper, Any, Main, Opa5, opaTest, TestUtils) {

		Helper.qUnitModule("sap.ui.core.sample.odata.v4.FieldGroups");

		if (TestUtils.isRealOData()) {
			QUnit.skip("Test runs only with realOData=false");
		} else {
			//*****************************************************************************
			opaTest("Enter a name and request side effects", function (Given, When, Then) {
				When.onAnyPage.applySupportAssistant();
				Given.iStartMyUIComponent({
					autoWait : true,
					componentConfig : {
						name : "sap.ui.core.sample.odata.v4.FieldGroups"
					}
				});
				Then.onTheMainPage.checkField("firstName", "Karl");
				Then.onTheMainPage.checkField("lastName", "Müller");

				When.onTheMainPage.resetRequestCount();
				When.onTheMainPage.selectField("firstName");
				When.onTheMainPage.enterValue("firstName", "Karl*");
				When.onTheMainPage.selectField("lastName");
				Then.onTheMainPage.checkField("firstName", "Karl*");
				Then.onTheMainPage.checkField("lastName", "Müller*");
				Then.onTheMainPage.checkRequestCount(1);

				Then.onAnyPage.checkLog();
				Then.onAnyPage.analyzeSupportAssistant();
				Then.iTeardownMyUIComponent();
			});

			QUnit.start();
		}
	});
});
