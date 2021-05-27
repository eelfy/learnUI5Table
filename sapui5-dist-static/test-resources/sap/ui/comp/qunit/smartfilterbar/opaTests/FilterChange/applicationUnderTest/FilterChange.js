(function () {
	"use strict";

	sap.ui.getCore().attachInit(function () {

		var ODataModel = sap.ui.requireSync("sap/ui/model/odata/v2/ODataModel"),
			MockServer = sap.ui.requireSync("sap/ui/core/util/MockServer"),
			ODataUtils = sap.ui.requireSync("sap/ui/model/odata/ODataUtils"),
			FakeLrepConnectorLocalStorage = sap.ui.requireSync("sap/ui/fl/FakeLrepConnectorLocalStorage");

		FakeLrepConnectorLocalStorage.enableFakeConnector();

		/** Controller **/
		sap.ui.controller("mainView.controller", {
			onInit : function () {
				var sServiceName = "testService";

				setupMockServer(sServiceName);

				var oModel = new ODataModel(sServiceName + "/", {
					useBatch: false,
					defaultBindingMode: "TwoWay"
				});
				this.getView().setModel(oModel);

				this.oSmartFilterBar = this.byId("smartFilterBar");
				this.oFilterResult = this.byId("filterResult");

				this.oSmartFilterBar.attachInitialized(function () {
					setTimeout(function () {

						// Clear the SmartFilterBar
						this.oSmartFilterBar.clear();
						this.byId("filterChangeEventLog").addItem(new sap.m.StandardListItem({
							title: "SmartFilterBar.clear();"
						}));

						// We set the UI state
						this.oSmartFilterBar.setUiState(new sap.ui.comp.state.UIState({
							selectionVariant: {
								"Version": {"Major": "1", "Minor": "0", "Patch": "0"},
								"SelectionVariantID": "",
								"Text": "Selection Variant with ID ",
								"ODataFilterExpression": "",
								"Parameters": [],
								"SelectOptions": [{
									"PropertyName": "STRING_AUTO",
									"Ranges": [{"Sign": "I", "Option": "EQ", "Low": "1", "High": null}]
								}]
							}
						}), {
							replace: true,
							strictMode: false
						});
						this.byId("filterChangeEventLog").addItem(new sap.m.StandardListItem({
							title: "setUiState"
						}));

						// We mark the variant as not-dirty
						this.byId("smartvariant").currentVariantSetModified(false);
						this.byId("filterChangeEventLog").addItem(new sap.m.StandardListItem({
							title: "Synchronous call to currentVariantSetModified(false);"
						}));

					}.bind(this), 1000);

				}.bind(this));
			},
			onFilterChange: function () {
				if (!this._count) {
					this._count = 0;
				}
				this.byId("filterChangeEventLog").addItem(new sap.m.StandardListItem({title: "filterChange Event fired ", counter: ++this._count}));
			},
			onSearch: function () {
				var oFP = this.oSmartFilterBar._oFilterProvider;

				this.oFilterResult.setText(
					decodeURIComponent(
						ODataUtils._createFilterParams(
							this.oSmartFilterBar.getFilters(),
							oFP._oParentODataModel.oMetadata,
							oFP._oMetadataAnalyser._getEntityDefinition(oFP.sEntityType)
						)
					)
				);
			},
			onExit: function () {
				this._oMockServer.stop();
			}
		});

		/** Component **/
		jQuery.sap.declare("mainView.Component");
		sap.ui.core.UIComponent.extend("mainView.Component", {
			createContent: function() {
				var oApp = new sap.m.App({
					initialPage: "idView"
				});
				oApp.addPage(sap.ui.xmlview("idView", { viewContent: jQuery("#mainView").html() }));
				return oApp;
			}
		});

		new sap.ui.core.ComponentContainer({
			name : "mainView"
		}).placeAt("content");

		function setupMockServer(service) {
			var sBasePath = service,
				oMockServer,
				aReqList;

			oMockServer = new MockServer({
				rootUri: sBasePath
			});

			aReqList = oMockServer.getRequests();

			// $metadata
			aReqList.push({
				method: 'GET',
				path: '/\\$metadata(.*)',
				response: function(req, resp) {
					req.respondXML(200, {}, jQuery("#metadata").html());
				}
			});

			// Data
			aReqList.push({
				method: 'GET',
				path: '/\\StringVH3(.*)',
				response: function(req, resp) {
					var sRequest = decodeURIComponent(req.url),
						aMatch = /filter=KEY eq '([0-9]+)'/.exec(sRequest),
						oData,
						aResult;

					if (aMatch && aMatch[1]) {
						oData = JSON.parse(jQuery("#dataSection3").html());

						aResult = oData.d.results.filter(function (oResult) {
							return oResult.KEY === aMatch[1];
						});

						req.respondJSON(200, {}, JSON.stringify({d:{results:aResult,"__count": aResult.length}}));
					} else {
						req.respondJSON(200, {}, jQuery("#dataSection3").html());
					}
				}
			});

			// Data
			aReqList.push({
				method: 'GET',
				path: '/\\StringVH2(.*)',
				response: function(req, resp) {
					req.respondJSON(200, {}, jQuery("#dataSection2").html());
				}
			});

			// Data
			aReqList.push({
				method: 'GET',
				path: '/\\StringVH[\/?](.*)',
				response: function(req, resp) {
					var sRequest = decodeURIComponent(req.url),
						aMatch = /filter=KEY eq '([0-9]+)'/.exec(sRequest),
						oData,
						aResult;

					sap.ui.getCore().byId("idView--filterChangeEventLog").addItem(new sap.m.StandardListItem({title: "Backend request & response for VH data"}));

					if (aMatch && aMatch[1]) {
						oData = JSON.parse(jQuery("#dataSection").html());

						aResult = oData.d.results.filter(function (oResult) {
							return oResult.KEY === aMatch[1];
						});

						req.respondJSON(200, {}, JSON.stringify({d:{results:aResult,"__count": aResult.length}}));
					} else {
						req.respondJSON(200, {}, jQuery("#dataSection").html());
					}
				}
			});

			oMockServer.setRequests(aReqList);
			oMockServer.simulate(sBasePath + '/$metadata',
				{
					sMockdataBaseUrl: sBasePath + '/',
					bGenerateMissingMockData: true
				});
			oMockServer.start();
		}

	});

})();
