sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/ui/core/mvc/XMLView",
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/core/util/MockServer"
	], function (
		XMLView,
		Controller,
		ODataModel,
		MockServer
	) {
		var MyController = Controller.extend("mainView.controller", {
			onInit : function () {
				var oModel,
					oView,
					sServiceName = "testService";

				this.setupMockServer(sServiceName);

				oModel = new ODataModel(sServiceName + "/", {
					useBatch: false,
					defaultBindingMode: "TwoWay"
				});

				oView = this.getView();
				oView.setModel(oModel);

				oModel.getMetaModel().loaded().then(function() {
					this.byId("smartForm").bindElement("/Employees('0001')");
				}.bind(this));

				this._oModel = oModel;
			},
			handleChange: function (oEvent) {
				var sPath = oEvent.getSource().getBinding("value").getPath(),
					oPendingChanges = this._oModel.getPendingChanges(),
					sFieldPendingChange;

				if (oPendingChanges && oPendingChanges["Employees('0001')"]) {
					sFieldPendingChange = oPendingChanges["Employees('0001')"][sPath];
				}

				this.byId("events").addItem(new sap.m.StandardListItem({
					title: "Change event fired for '" + sPath + "': " + sFieldPendingChange
				}));
			},
			setupMockServer: function (service) {
				var basePath = service;

				var mockServer = new MockServer({
					rootUri: basePath
				});

				var reqList = mockServer.getRequests();

				// $metadata
				reqList.push({
					method: 'GET',
					path: '/\\$metadata(.*)',
					response: function(req, resp) {
						req.respondXML(200, {}, document.getElementById("metadata").textContent);
					}
				});

				// Data
				reqList.push({
					method: 'GET',
					path: '/\\Employees(.*)',
					response: function(req, resp) {
						req.respondJSON(200, {}, document.getElementById("dataSection").textContent);
					}
				});

				// Data
				reqList.push({
					method: 'GET',
					path: '/\\StringVH[\/?](.*)',
					response: function(req, resp) {
						var sRequest = decodeURIComponent(req.url),
							aMatch = /filter=KEY eq '([0-9]+)'/.exec(sRequest),
							oData,
							aResult,
							oResult;

						if (aMatch && aMatch[1] && sRequest.indexOf('$top=2') !== -1) {
							oData = JSON.parse(document.getElementById("dataSectionVH").textContent);

							aResult = oData.d.results.filter(function (oResult) {
								return oResult.KEY === aMatch[1];
							});

							oResult = {d:{results:aResult,"__count": aResult.length}};
							req.respondJSON(200, {}, JSON.stringify(oResult));

							sap.ui.getCore().byId("idView--events").addItem(
								new sap.m.CustomListItem({
									content: new sap.m.Panel({
										headerText: sRequest,
										content: new sap.m.Text({renderWhitespace: true}).setText("Request:\n" + sRequest + "\n\nResponse:\n" + JSON.stringify(oResult, null, 4)),
										expandable: true
									})
								}).data("request", sRequest)
							);
						}
					}
				});

				// Data
				reqList.push({
					method: 'GET',
					path: '/\\ProductVH[\/?](.*)',
					response: function(req, resp) {
						var sRequest = decodeURIComponent(req.url),
							aMatch = sRequest.match(/([a-zA-Z0-9]+) eq '([\S]+)'/g),
							aMatchers = [],
							oData,
							aResult,
							oResult;

						aMatch.forEach(function (sMatch) {
							var aMatch = sMatch.match(/([a-zA-Z0-9]+) eq '([\S]+)'/);
							aMatchers.push(function (oResult) {return oResult[aMatch[1]] === aMatch[2];});
						});

						if (aMatch && aMatch[1] && sRequest.indexOf('$top=2') !== -1) {
							oData = JSON.parse(document.getElementById("dataSectionProductVH").textContent);

							aResult = oData.d.results.filter(function (oResult) {
								return aMatchers.every(function (fnMatcher) {
									return fnMatcher(oResult);
								});
							});

							oResult = {d:{results:aResult, "__count": aResult.length}};
							req.respondJSON(200, {}, JSON.stringify(oResult));

							sap.ui.getCore().byId("idView--events").addItem(
								new sap.m.CustomListItem({
									content: new sap.m.Panel({
										headerText: sRequest,
										content: new sap.m.Text({renderWhitespace: true}).setText("Request:\n" + sRequest + "\n\nResponse:\n" + JSON.stringify(oResult, null, 4)),
										expandable: true
									})
								}).data("request", sRequest)
							);
						}
					}
				});

				mockServer.setRequests(reqList);
				mockServer.simulate(basePath + '/$metadata',
					{
						sMockdataBaseUrl: basePath + '/Employees',
						bGenerateMissingMockData: true
					});
				mockServer.start();
			},
			onExit: function () {
				this._oMockServer.stop();
			}
		});

		XMLView.create({
			id: "idView",
			definition: document.getElementById("mainView").textContent,
			controller: new MyController()
		}).then(function (oView) {
			oView.placeAt("content");
		});

	});

});
