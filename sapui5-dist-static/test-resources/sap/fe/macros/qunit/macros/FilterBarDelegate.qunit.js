/* global QUnit sinon */
/* eslint no-warning-comments: 0 */
sap.ui.define(
	[
		"sap/base/util/deepEqual",
		"sap/ui/test/TestUtils",
		"sap/ui/model/odata/v4/ODataModel",
		"sap/fe/macros/FilterBarDelegate",
		"sap/ui/core/library",
		"sap/ui/mdc/FilterBar",
		"sap/fe/core/CommonUtils"
	],
	function(deepEqual, TestUtils, ODataModel, FilterBarDelegate, coreLib, FilterBar, CommonUtils) {
		"use strict";
		// *********************************************************************************************
		QUnit.module("Filter Bar Delegate Tests for an OData V4 Service", {
			before: function() {
				var sServiceUrl = "/fake/",
					sSourceBase = "sap/fe/macros/qunit/macros/chartMetadata",
					mFixture = {
						"$metadata": { source: "metadata.xml" }
					};

				this.oSandbox = sinon.sandbox.create();
				TestUtils.setupODataV4Server(this.oSandbox, mFixture, sSourceBase, sServiceUrl);
				this.oModel = new ODataModel({
					groupId: "$direct",
					operationMode: "Server",
					serviceUrl: TestUtils.proxy(sServiceUrl),
					synchronizationMode: "None"
				});
				this.oFilterBar = new FilterBar();
				this.oFilterBar.setModel(this.oModel);
				this.oFilterBar.data("entityType", "/BusinessPartners/");

				this.getAppComponentStub = this.oSandbox.stub(CommonUtils, "getAppComponent").callsFake(function() {
					return undefined;
				});

				return this.oModel.getMetaModel().requestObject("/");
			},
			after: function() {
				this.oFilterBar.destroy();
				this.oModel.destroy();
				this.oModel = null;
				this.oSandbox.restore();
			}
		});

		QUnit.test("General structure of metadata", function(assert) {
			var done = assert.async();

			FilterBarDelegate.fetchProperties(this.oFilterBar).then(aFetchedProperties => {
				assert.deepEqual(
					aFetchedProperties.map(property => property.groupLabel),
					[
						undefined,
						"",
						"",
						"",
						"A test",
						"A test",
						"BusinessPartnerType",
						"BusinessPartnerType",
						"BusinessPartnerType",
						"Testing"
					],
					"FetchProperties returns filter fields"
				);
				done();
			});
		});
	}
);
