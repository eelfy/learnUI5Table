sap.ui.define(["sap/ui/model/json/JSONModel"],
	function (JSONModel) {
		"use strict";

		var oManifestModel = new JSONModel();
		oManifestModel.loadData("test-resources/sap/suite/ui/generic/template/demokit/sample.stta.sales.order.worklist/webapp/manifest.json", null, false);

		return {
			"template": {},
			"demokit": {
				"sample.stta.sales.order.worklist": oManifestModel
			}
		};
	}
);
