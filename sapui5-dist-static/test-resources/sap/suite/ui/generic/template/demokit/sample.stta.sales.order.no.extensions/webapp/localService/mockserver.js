sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log",
	"sap/base/util/deepExtend",
	"sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
	"sap/base/util/UriParameters",
	"sap/ui/util/XMLHelper"
], function(MockServer, Log, deepExtend, AjaxHelper, UriParameters, XMLHelper) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "SOwoExt/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function() {
			var oUriParameters = new UriParameters(window.location.href),
				sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesModulePath),
				sManifestUrl = sap.ui.require.toUrl(_sAppModulePath + "manifest.json"),
				sEntity = "C_STTA_SalesOrder_WD_20",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oManifest = AjaxHelper.syncGetJSON(sManifestUrl).data,
				oDataSource = oManifest["sap.app"].dataSources,
				oMainDataSource = oDataSource.mainService,
				sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + oMainDataSource.settings.localUri),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				aAnnotations = oMainDataSource.settings.annotations;

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			// load local mock data
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}
			oMockServer.start();

			oMockServer.attachAfter("GET", function (obj) {
                console.log("---MOCKSERVER-REQUEST");
                console.log(deepExtend({}, obj));
                console.log(obj.mParameters.oXhr.method + " " + obj.mParameters.oXhr.url);
                /*
                 console.log(obj.mParameters.oXhr.responseText);
                 console.log(obj.mParameters.oXhr.responseXML);*/
            });


			Log.info("Running the app with mock data");

			aAnnotations.forEach(function(sAnnotationName) {
				var oAnnotation = oDataSource[sAnnotationName],
					sUri = oAnnotation.uri,
					sLocalUri = sap.ui.require.toUrl(_sAppModulePath + oAnnotation.settings.localUri);

				///annotiaons
				new MockServer({
					rootUri: sUri,
					requests: [{
						method: "GET",
						path: new RegExp(""),
						response: function(oXhr) {
							var oAnnotations = AjaxHelper.sjax({
								url: sLocalUri,
								dataType: "xml"
							}).data;

							oXhr.respondXML(200, {}, XMLHelper.serialize(oAnnotations));
							return true;
						}
					}]

				}).start();

			});

		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer}
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});
