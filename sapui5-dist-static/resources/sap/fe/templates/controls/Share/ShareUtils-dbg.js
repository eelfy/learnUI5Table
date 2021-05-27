sap.ui.define(
	[
		"sap/base/util/ObjectPath",
		"sap/base/util/extend",
		"sap/base/Log",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/HashChanger",
		"sap/fe/core/CommonUtils"
	],
	function(ObjectPath, extend, Log, XMLTemplateProcessor, XMLPreprocessor, Fragment, JSONModel, HashChanger, CommonUtils) {
		"use strict";

		var ShareUtils = {},
			oLastFocusedControl;

		ShareUtils.onShareActionButtonPressImpl = function(oControl, oController, pageTitleInfo, bServiceUrlAllowed) {
			sap.ui.require(["sap/m/library"], function(library) {
				var oGetResourceBundle = oController
					.getView()
					.getModel("sap.fe.i18n")
					.getResourceBundle();
				var fragmentController = {
					shareEmailPressed: function() {
						var sEmailSubject;
						if (pageTitleInfo !== null) {
							sEmailSubject = pageTitleInfo.title;
							var sObjectSubtitle = pageTitleInfo.subtitle;
							if (sObjectSubtitle) {
								sEmailSubject = sEmailSubject + " - " + sObjectSubtitle;
							}
							library.URLHelper.triggerEmail(null, sEmailSubject, document.URL);
						} else {
							oGetResourceBundle
								.then(function(oBundle) {
									sEmailSubject = oBundle.getText("T_SHARE_UTIL_HELPER_SAPFE_EMAIL_SUBJECT", [document.title]);
									library.URLHelper.triggerEmail(null, sEmailSubject, document.URL);
								})
								.catch(function(oError) {
									Log.error("Error while getting the resource bundle", oError);
								});
						}
					},
					onSaveTilePress: function() {
						// TODO it seems that the press event is executed before the dialog is available - adding a timeout is a cheap workaround
						setTimeout(function() {
							sap.ui
								.getCore()
								.byId("bookmarkDialog")
								.attachAfterClose(function() {
									oLastFocusedControl.focus();
								});
						}, 0);
					},
					getServiceUrl: function() {
						if (bServiceUrlAllowed) {
							return ShareUtils.getCountUrl(oController);
						} else {
							return "";
						}
					},
					getModelData: function() {
						var oShareModel;
						if (pageTitleInfo !== null) {
							oShareModel = {
								title: pageTitleInfo.title,
								subtitle: pageTitleInfo.subtitle
							};
						} else {
							var oAppComponent = CommonUtils.getAppComponent(oController.getView());
							var oMetadata = oAppComponent.getMetadata();
							var oUIManifest = oMetadata.getManifestEntry("sap.ui");
							var sIcon = (oUIManifest && oUIManifest.icons && oUIManifest.icons.icon) || "";
							var oAppManifest = oMetadata.getManifestEntry("sap.app");
							var sTitle = (oAppManifest && oAppManifest.title) || "";
							// TODO: check if there is any semantic date used before adding serviceURL as BLI:FIORITECHP1-18023
							oShareModel = {
								icon: sIcon,
								title: sTitle,
								serviceUrl: fragmentController.getServiceUrl()
							};
						}
						oShareModel.customUrl = ShareUtils.getCustomUrl();
						return oShareModel;
					}
				};
				ShareUtils.openSharePopup(oControl, oController, fragmentController);
			});
		};

		ShareUtils.setStaticShareData = function(shareModel) {
			var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.m");
			shareModel.setProperty("/emailButtonText", oResource.getText("SEMANTIC_CONTROL_SEND_EMAIL"));
		};

		/**
		 * Instantiates and opens the ShareSheet fragment and merges its model data with the SaveAsTile data
		 * returned by the function getModelData of the fragment controller.
		 *
		 * @param {sap.ui.core.Control} by The control by which the popup is to be opened
		 * @param oController
		 * @param {object} fragmentController A plain object serving as the share popup's controller
		 * @protected
		 * @static
		 */
		ShareUtils.openSharePopup = function(by, oController, fragmentController) {
			var oShareActionSheet;
			oLastFocusedControl = by;
			fragmentController.onCancelPressed = function() {
				oShareActionSheet.close();
			};
			fragmentController.setShareSheet = function(oShareSheet) {
				oController.shareSheet = oShareSheet;
			};

			var oThis = new JSONModel({
					id: oController.getView().getId()
				}),
				oPreprocessorSettings = {
					bindingContexts: {
						"this": oThis.createBindingContext("/")
					},
					models: {
						"this": oThis,
						"this.i18n": oController.getView().getModel("sap.fe.i18n")
					}
				};

			var oModelData = fragmentController.getModelData();
			if (oController.shareSheet) {
				oShareActionSheet = oController.shareSheet;
				var oShareModel = oShareActionSheet.getModel("share");
				ShareUtils.setStaticShareData(oShareModel);
				var oNewData = extend(oShareModel.getData(), oModelData);
				oShareModel.setData(oNewData);
				oShareActionSheet.openBy(by);
			} else {
				var oView = oController.getView(),
					oBindingContext = oView.getBindingContext();
				var sFragmentName = "sap.fe.templates.controls.Share.ShareSheet",
					oPopoverFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");

				Promise.resolve(XMLPreprocessor.process(oPopoverFragment, { name: sFragmentName }, oPreprocessorSettings))
					.then(function(oFragment) {
						return Fragment.load({ definition: oFragment, controller: fragmentController });
					})
					.then(function(oActionSheet) {
						oShareActionSheet = oActionSheet;
						oShareActionSheet.setModel(new JSONModel(oModelData), "share");
						var oShareModel = oShareActionSheet.getModel("share");
						ShareUtils.setStaticShareData(oShareModel);
						var oNewData = extend(oShareModel.getData(), oModelData);
						oShareModel.setData(oNewData);
						oView.addDependent(oShareActionSheet);
						oShareActionSheet.setBindingContext(oBindingContext);
						oShareActionSheet.openBy(by);
						fragmentController.setShareSheet(oShareActionSheet);
					})
					.catch(function(oError) {
						Log.error("Error while opening the share fragment", oError);
					});
			}
		};

		/**
		 * Get custom URL for creating a new tile.
		 *
		 * @returns {string} The custom URL
		 * @protected
		 * @static
		 */
		ShareUtils.getCustomUrl = function() {
			var sHash = HashChanger.getInstance().getHash();
			return sHash ? HashChanger.getInstance().hrefForAppSpecificHash("") + sHash : window.location.href;
		};

		/**
		 * Get count url URL for the eneity bound to the LR table(s).
		 * @param {object} oController the Controller instance
		 * @returns {string} The service URL with /$count
		 */
		ShareUtils.getCountUrl = function(oController) {
			var sTableId = oController
				.getView()
				.getContent()[0]
				.data().singleTableId;
			if (!sTableId) {
				// if single table id is not there then get the selected table id from multiple tabs
				sTableId = oController
					.getView()
					.byId("fe::TabMultipleMode")
					.getSelectedKey();
			}
			var oTable = oController.getView().byId(sTableId);
			if (!oTable) {
				return "";
			}
			var oBinding = oTable.getRowBinding() || oTable.getBinding("items");
			var sDownloadUrl = (oBinding && oBinding.getDownloadUrl()) || "";
			var aSplitUrl = sDownloadUrl.split("?");
			var baseUrl = aSplitUrl[0] + "/$count?";
			// getDownloadUrl() returns url with $select, $expand which is not supported when /$count is used to get the record count. only $apply, $search, $filter is supported
			// ?$count=true returns count in a format which is not supported by FLP yet.
			// currently supported format for v4 is ../count.. only (where tile preview will still not work)
			var aSupportedParams = [];
			if (aSplitUrl.length > 1) {
				var urlParams = aSplitUrl[1];
				urlParams.split("&").forEach(function(urlParam) {
					var aUrlParamParts = urlParam.split("=");
					switch (aUrlParamParts[0]) {
						case "$apply":
						case "$search":
						case "$filter":
							aSupportedParams.push(urlParam);
					}
				});
			}
			return baseUrl + aSupportedParams.join("&");
		};

		return ShareUtils;
	}
);
