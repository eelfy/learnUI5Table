function suite() {
	var oSuite = new parent.jsUnitTestSuite();
	var sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

	oSuite.addTestPage(sContextPath + "integration/opaTests.qunit.html");

	return oSuite;
}