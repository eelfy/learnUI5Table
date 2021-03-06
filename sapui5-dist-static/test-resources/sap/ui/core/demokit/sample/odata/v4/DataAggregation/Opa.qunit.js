/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	/*eslint max-nested-callbacks: 0 */
	"use strict";

	sap.ui.require([
		"sap/ui/core/sample/common/Helper",
		"sap/ui/core/sample/odata/v4/DataAggregation/tests/expandPageCollapse",
		"sap/ui/core/sample/odata/v4/DataAggregation/tests/filter",
		"sap/ui/test/opaQunit"
	], function (Helper, expandPageCollapse, filter, opaTest) {
		Helper.qUnitModule("sap.ui.core.sample.odata.v4.DataAggregation");

		["", "true", "false"].forEach(function (sGrandTotalAtBottomOnly) {
			["", "true", "false"].forEach(function (sSubtotalsAtBottomOnly) {
				var sTitle = "expand, page, collapse"
						+ "; grand total at bottom only: " + sGrandTotalAtBottomOnly
						+ "; subtotals at bottom only: " + sSubtotalsAtBottomOnly;

				//*****************************************************************************
				opaTest(sTitle,
					expandPageCollapse.bind(null, sGrandTotalAtBottomOnly, sSubtotalsAtBottomOnly));
			});
		});

		//*****************************************************************************
		opaTest("filter", filter);

		QUnit.start();
	});
});
