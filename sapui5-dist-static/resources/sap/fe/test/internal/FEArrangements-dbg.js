sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/base/util/UriParameters",
		"sap/fe/test/Utils",
		"sap/fe/test/Stubs",
		"sap/fe/test/BaseArrangements"
	],
	function(Opa5, OpaBuilder, UriParameters, Utils, Stubs, BaseArrangements) {
		"use strict";

		return BaseArrangements.extend("sap.fe.test.internal.FEArrangements", {
			constructor: function(mSettings) {
				BaseArrangements.call(
					this,
					Utils.mergeObjects(
						{
							launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html"
						},
						mSettings
					)
				);
			},

			iResetTestData: function(bIgnoreRedeploy) {
				var that = this,
					oUriParams = new UriParameters(window.location.href),
					sBackendUrl = oUriParams.get("useBackendUrl"),
					sProxyPrefix = sBackendUrl ? "/databinding/proxy/" + sBackendUrl.replace("://", "/") : "",
					bSuccess = false,
					sTenantID =
						window.__karma__ && window.__karma__.config && window.__karma__.config.ui5
							? window.__karma__.config.ui5.shardIndex
							: "default";

				return OpaBuilder.create(this)
					.success(function() {
						var oResetData = that.resetTestData(),
							oRedeploy = bIgnoreRedeploy ? Promise.resolve() : jQuery.post(sProxyPrefix + "/redeploy?tenant=" + sTenantID);

						Promise.all([oResetData, oRedeploy])
							.finally(function() {
								bSuccess = true;
							})
							.catch(function(oError) {
								throw oError;
							});

						return OpaBuilder.create(this)
							.check(function() {
								return bSuccess;
							})
							.execute();
					})
					.description(Utils.formatMessage("Reset test data on tenant '{0}'", sTenantID))
					.execute();
			}
		});
	}
);
