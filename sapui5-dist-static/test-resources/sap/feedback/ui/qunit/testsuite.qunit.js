/* eslint-disable sap-no-global-define */
/* eslint-disable sap-forbidden-window-property*/
window.suite = function () {

	/* eslint-enable sap-no-global-define */
	/* eslint-enable sap-forbidden-window-property*/
	"use strict";
	/* eslint-disable new-cap */
	var oSuite = new parent.jsUnitTestSuite(),
		sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

	oSuite.addTestPage(sContextPath + "unit/unitTests.qunit.html");
	// oSuite.addTestPage(sContextPath + "integration/opaTests.qunit.html");

	return oSuite;
};