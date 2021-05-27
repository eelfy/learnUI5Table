/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/model/Filter",
		"sap/ui/core/format/NumberFormat",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/filter/FilterUtils",
		"sap/base/Log",
		"sap/fe/macros/DelegateUtil"
	],
	function(Filter, NumberFormat, CommonUtils, CommonHelper, FilterUtils, Log, DelegateUtil) {
		"use strict";

		/**
		 * Get filter information for a SelectionVariant annotation.
		 *
		 * @param {object} oTable Table instance
		 * @param {string} sSvPath relative SelectionVariant annotation path
		 * @returns {object} Information on filters
		 *  filters: array of sap.ui.model.filters
		 * text: selection Variant text property
		 * @private
		 * @ui5-restricted
		 */
		function getFiltersInfoforSV(oTable, sSvPath) {
			var sEntitySetPath = oTable.data("targetCollectionName"),
				oMetaModel = CommonUtils.getAppComponent(oTable).getMetaModel(),
				oSelectionVariant = oMetaModel.getObject(sEntitySetPath + "/@" + sSvPath),
				aFilters = [],
				aPaths = [],
				sText = "";
			if (oSelectionVariant) {
				sText = oSelectionVariant.Text;
				for (var i in oSelectionVariant.SelectOptions) {
					var oSelectOption = oSelectionVariant.SelectOptions[i];
					if (oSelectOption && oSelectOption.PropertyName) {
						var sPath = oSelectOption.PropertyName.$PropertyPath;
						var aRangeFilters = [];
						for (var j in oSelectOption.Ranges) {
							var oRange = oSelectOption.Ranges[j];
							aRangeFilters.push(new Filter(sPath, oRange.Option.$EnumMember.split("/").pop(), oRange.Low, oRange.High));
						}
						if (aRangeFilters.length > 0) {
							if (!aPaths.includes(sPath)) {
								aPaths.push(sPath);
							}
							aFilters.push(
								new Filter({
									filters: aRangeFilters,
									and: false
								})
							);
						}
					}
				}
			}

			return {
				properties: aPaths,
				filters: aFilters,
				text: sText
			};
		}

		/**
		 * Get all table hiddenFilters configured via macro table parameter 'filters'.
		 *
		 * @param {object} oTable Table instance
		 * @returns {Array} Information on filters
		 * @private
		 * @ui5-restricted
		 */
		function getHiddenFilters(oTable) {
			var aFilters = [],
				hiddenFilters = oTable.data("hiddenFilters");
			if (hiddenFilters && Array.isArray(hiddenFilters.paths)) {
				hiddenFilters.paths.forEach(function(mPath) {
					var oSvFilter = getFiltersInfoforSV(oTable, mPath.annotationPath);
					aFilters = aFilters.concat(oSvFilter.filters);
				});
			}
			return aFilters;
		}

		/**
		 * Get current table quickFilter configured via macro table parameter 'filters'.
		 *
		 * @param {object} oTable Table instance
		 * @returns {Array} Information on filters
		 * @private
		 * @ui5-restricted
		 */
		function getQuickFilter(oTable) {
			var aFilters = [],
				sQuickFilterKey = DelegateUtil.getCustomData(oTable, "quickFilterKey");
			if (sQuickFilterKey) {
				aFilters = aFilters.concat(getFiltersInfoforSV(oTable, sQuickFilterKey).filters);
			}
			return aFilters;
		}

		/**
		 * Get all table configured via macro table parameter 'filters' ( potential selected quickFilter and hiddenFilters).
		 *
		 * @param {object} oTable Table instance
		 * @returns {Array} Information on filters
		 * @private
		 * @ui5-restricted
		 */
		function getTableFilters(oTable) {
			return getQuickFilter(oTable).concat(getHiddenFilters(oTable));
		}

		/**
		 * Add binding event listener.
		 *
		 * @param {object} oTable - Table instance
		 * @param {object} sEventName - Event name
		 * @param {object} fHandler - Handler to be called
		 * @private
		 * @ui5-restricted
		 */
		function addEventToBindingInfo(oTable, sEventName, fHandler) {
			var oBindingInfo = oTable.data("rowsBindingInfo");
			if (oBindingInfo) {
				if (!oBindingInfo.events) {
					oBindingInfo.events = {};
				}
				if (!oBindingInfo.events[sEventName]) {
					oBindingInfo.events[sEventName] = fHandler;
				} else {
					var fOriginalHandler = oBindingInfo.events[sEventName];
					oBindingInfo.events[sEventName] = function() {
						fHandler.apply(this, arguments);
						fOriginalHandler.apply(this, arguments);
					};
				}
			}
		}

		/**
		 * Create List Bind Context request for a Table with additional filters.
		 *
		 * @param {object} oTable Table instance
		 * @param {sap.ui.model.Context} oPageBinding  Page Binding Context where the Table is set
		 * @param {object} oParams additional settings for the List Binding
		 *    oParams: {
		 * 		batchGroupId: 	group ID to be used for read requests triggered by this binding
		 * 		additionalFilters: Filters to add on Table Fitlers for the items/rows count
		 * }
		 * @returns {Promise} Promise containing the ListBinding Context request
		 * @private
		 * @ui5-restricted
		 */
		function getListBindingForCount(oTable, oPageBinding, oParams) {
			var oBindingInfo = oTable.data("rowsBindingInfo"),
				oDataModel = oTable.getModel(),
				oListBinding,
				oTableContextFilter,
				sBatchId = oParams.batchGroupId || "",
				oFilterInfo = getFilterInfo(oTable),
				aFilters = Array.isArray(oParams.additionalFilters) ? oParams.additionalFilters : [];

			aFilters = aFilters.concat(oFilterInfo.filters).concat(getP13nFilters(oTable));
			oTableContextFilter = new Filter({
				filters: aFilters,
				and: true
			});

			oListBinding = oDataModel.bindList(
				(oPageBinding ? oPageBinding.getPath() + "/" : "") + oBindingInfo.path,
				oTable.getBindingContext(),
				null,
				oTableContextFilter,
				{
					$count: true,
					$$groupId: sBatchId || "$auto",
					$search: oFilterInfo.search
				}
			);
			return oListBinding.requestContexts(0, 1).then(function(oContext) {
				var iCount = oContext && oContext.length ? oContext[0].getBinding().getLength() : 0;
				oListBinding.destroy();
				return iCount;
			});
		}

		/**
		 * Manage List Binding request related to Counts on QuickFilter control and update text
		 * in line with batch result.
		 *
		 * @param {object} oTable Table Instance
		 * @param {sap.ui.model.Context} oPageBinding  Page Binding Context where the Table is set
		 * @param {object} mParams Object containing additional filters
		 * @private
		 * @ui5-restricted
		 */

		function getCountFormatted(iCount) {
			var oCountFormatter = NumberFormat.getIntegerInstance({ groupingEnabled: true });
			return oCountFormatter.format(iCount);
		}

		function getFilterInfo(oTable) {
			var isAnalyticalEnabled = DelegateUtil.getCustomData(oTable, "enableAnalytics"),
				aIgnoreProperties = [];
			function _getRelativePathArrayFromAggregates(oTable) {
				var mAggregates = CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "aggregates") || {});
				return Object.keys(mAggregates).map(function(sAggregateName) {
					return mAggregates[sAggregateName].relativePath;
				});
			}
			if (isAnalyticalEnabled === "true" || isAnalyticalEnabled === true) {
				aIgnoreProperties = aIgnoreProperties.concat(["search"]).concat(_getRelativePathArrayFromAggregates(oTable));
			}
			var oFilter = FilterUtils.getFilterInfo(oTable.getFilter(), {
				ignoredProperties: aIgnoreProperties,
				targetControl: oTable
			});
			return oFilter;
		}

		/**
		 * Retrieves all filters configured in Table filter personalization dialog.
		 *
		 * @param {sap.ui.mdc.Table} oTable Table instance
		 * @returns {Array} aP13nFilters Filters configured in table personalization dialog
		 * @private
		 * @ui5-restricted
		 */
		function getP13nFilters(oTable) {
			var aP13nMode = oTable.getP13nMode();
			if (aP13nMode && aP13nMode.indexOf("Filter") > -1) {
				var aP13nProperties = (DelegateUtil.getCustomData(oTable, "sap_fe_TableDelegate_propertyInfoMap") || []).filter(function(
						oTableProperty
					) {
						return oTableProperty && !(oTableProperty.filterable === false);
					}),
					oFilterInfo = FilterUtils.getFilterInfo(oTable, { propertiesMetadata: aP13nProperties });
				if (oFilterInfo && oFilterInfo.filters) {
					return oFilterInfo.filters;
				}
			}
			return [];
		}

		function getAllFilterInfo(oTable) {
			var oIFilterInfo = getFilterInfo(oTable);
			return {
				filters: oIFilterInfo.filters.concat(getTableFilters(oTable), getP13nFilters(oTable)),
				search: oIFilterInfo.search
			};
		}

		/**
		 * Returns a promise that is resolved with the table itself when the table was bound.
		 * @param {sap.ui.mdc.Table} oTable the table to check for binding
		 * @returns {Promise} the Promise that will be resolved when table is bound
		 */
		function whenBound(oTable) {
			return _getOrCreateBoundPromiseInfo(oTable).promise;
		}

		/**
		 * If not yet happened, it resolves the table bound promise.
		 * @param {sap.ui.mdc.Table} oTable the table that was bound
		 */
		function onTableBound(oTable) {
			var oBoundPromiseInfo = _getOrCreateBoundPromiseInfo(oTable);
			if (oBoundPromiseInfo.resolve) {
				oBoundPromiseInfo.resolve(oTable);
				oTable.data("boundPromiseResolve", null);
			}
		}

		function _getOrCreateBoundPromiseInfo(oTable) {
			if (!oTable.data("boundPromise")) {
				var fnResolve;
				oTable.data(
					"boundPromise",
					new Promise(function(resolve) {
						fnResolve = resolve;
					})
				);
				if (oTable.isBound()) {
					fnResolve(oTable);
				} else {
					oTable.data("boundPromiseResolve", fnResolve);
				}
			}
			return { promise: oTable.data("boundPromise"), resolve: oTable.data("boundPromiseResolve") };
		}

		function updateBindingInfo(oBindingInfo, oFilterInfo, oFilter) {
			oBindingInfo.filters = oFilter;
			if (oFilterInfo.search) {
				oBindingInfo.parameters.$search = oFilterInfo.search;
			} else {
				delete oBindingInfo.parameters.$search;
			}
		}

		// This event will allow us to intercept the export before is triggered to cover specific cases
		// that couldn't be addressed on the propertyInfos for each column.
		// e.g. Fixed Target Value for the datapoints
		function onBeforeExport(oEvent, oTable) {
			var oMetaModel = CommonUtils.getAppComponent(oTable).getMetaModel(),
				sEntitySetPath = oTable.data("targetCollectionName");

			//Add TargetValue on dummy created property when  exporting on split mode
			if (oEvent.mParameters.userExportSettings.splitCells) {
				oEvent.mParameters.exportSettings.workbook.columns.forEach(function(column) {
					if (column.property.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1) {
						var sAnnotationPath = column.property,
							oProperty = oMetaModel.getObject(sEntitySetPath + "/" + sAnnotationPath);
						if (
							oProperty &&
							oProperty.Visualization &&
							oProperty.Visualization.$EnumMember &&
							(oProperty.Visualization.$EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Rating" ||
								oProperty.Visualization.$EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Progress")
						) {
							var sTargetValue = oProperty.TargetValue.toString();
							column.template = sTargetValue;
							column.property = [oProperty.Value.$Path];
						}
					}
				});
			}
			// Export contact>fn property when using Communication.Contact dataFieldForAnnotation
			oEvent.mParameters.exportSettings.workbook.columns.forEach(function(column) {
				var oProperty = oMetaModel.getObject(sEntitySetPath + "/" + column.property);
				if (
					oProperty &&
					oProperty.$Type &&
					oProperty.$Type === "com.sap.vocabularies.Communication.v1.ContactType" &&
					oProperty.fn &&
					oProperty.fn.$Path
				) {
					column.property = column.property.substring(0, column.property.indexOf("/") + 1) + oProperty.fn.$Path;
				}
			});
		}

		function fnGetSemanticTargetsFromTable(oController, oTable) {
			var oView = oController.getView();
			var oInternalModelContext = oView.getBindingContext("internal");
			if (oInternalModelContext) {
				var sEntitySet = DelegateUtil.getCustomData(oTable, "targetCollectionName");
				if (sEntitySet) {
					var oComponent = oController.getOwnerComponent();
					var oAppComponent = sap.ui.core.Component.getOwnerComponentFor(oComponent);
					var oMetaModel = oAppComponent.getMetaModel();
					var oShellServiceHelper = CommonUtils.getShellServices(oAppComponent);
					var sCurrentHash = oShellServiceHelper.hrefForExternal();
					var oColumns = DelegateUtil.getCustomData(oTable, "columns");
					var aSemanticObjectsForGetLinks = [];
					var aSemanticObjects = [];
					var aFinalLinks = [];
					var sPath, sAnnotationPath, oProperty;
					var _oSemanticObject;

					if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
						// sCurrentHash can contain query string, cut it off!
						sCurrentHash = sCurrentHash.split("?")[0];
					}

					for (var i = 0; i < oColumns.customData.length; i++) {
						sAnnotationPath = oColumns.customData[i].annotationPath;
						//this check is required in cases where custom columns are configured via manifest where there is no provision for an annotation path.
						if (sAnnotationPath) {
							oProperty = oMetaModel.getObject(sAnnotationPath);
							if (oProperty && oProperty.$kind === "Property") {
								sPath = oColumns.customData[i].annotationPath;
							} else if (oProperty && oProperty.$Type === "com.sap.vocabularies.UI.v1.DataField") {
								sPath = sEntitySet + "/" + oMetaModel.getObject(sAnnotationPath + "/Value/$Path");
							}
						}
						if (sPath) {
							_oSemanticObject = CommonUtils.getSemanticObjectsFromPath(oMetaModel, sPath);
							if (_oSemanticObject.semanticObject) {
								aSemanticObjectsForGetLinks.push(_oSemanticObject.semanticObjectForGetLinks);
								aSemanticObjects.push({
									semanticObject: _oSemanticObject.semanticObject.semanticObject,
									unavailableActions: _oSemanticObject.unavailableActions,
									path: sPath ? sPath : sAnnotationPath
								});
							}
						}
						sPath = undefined;
					}

					oShellServiceHelper
						.getLinksWithCache(aSemanticObjectsForGetLinks)
						.then(function(aLinks) {
							if (aLinks && aLinks.length > 0 && aLinks[0] !== undefined) {
								var oSemanticObject = {};
								var oTmp = {};
								var sAlternatePath;
								var fnRemoveCurrentHashInLink = function(oLinkItem) {
									if (!(sCurrentHash === oLinkItem.intent)) {
										if (
											aSemanticObjects[i].unavailableActions &&
											aSemanticObjects[i].unavailableActions.find(function(sAction) {
												if (sAction === oLinkItem.intent.split("-")[1]) {
													return true;
												}
											})
										) {
											return false;
										} else {
											aFinalLinks[i].push(oLinkItem);
										}
									}
								};
								for (var i = 0; i < aLinks.length; i++) {
									aFinalLinks.push([]);
									aLinks[i][0].forEach(fnRemoveCurrentHashInLink);
									oTmp = {
										semanticObject: aSemanticObjects[i].semanticObject,
										path: aSemanticObjects[i].path,
										HasTargets: aFinalLinks[i].length > 0 ? true : false,
										HasTargetsNotFiltered: aLinks[i].length > 0 ? true : false
									};
									if (oSemanticObject[aSemanticObjects[i].semanticObject] === undefined) {
										oSemanticObject[aSemanticObjects[i].semanticObject] = {};
									}
									sAlternatePath = aSemanticObjects[i].path.replace(/\//g, "_");
									if (oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath] === undefined) {
										oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath] = {};
									}
									oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath] = Object.assign(
										oSemanticObject[aSemanticObjects[i].semanticObject][sAlternatePath],
										oTmp
									);
								}
								oInternalModelContext.setProperty("semanticsTargets", oSemanticObject);
							}
						})
						.catch(function(oError) {
							Log.error("fnGetSemanticTargets: Cannot read links", oError);
						});
				}
			}
		}

		function clearSelection(oTable) {
			oTable.clearSelection();
			var oInternalModelContext = oTable.getBindingContext("internal");
			if (oInternalModelContext) {
				oInternalModelContext.setProperty("deleteEnabled", false);
				oInternalModelContext.setProperty("numberOfSelectedContexts", 0);
				oInternalModelContext.setProperty("selectedContexts", []);
				oInternalModelContext.setProperty("deletableContexts", []);
			}
		}

		var oTableUtils = {
			addEventToBindingInfo: addEventToBindingInfo,
			getCountFormatted: getCountFormatted,
			getHiddenFilters: getHiddenFilters,
			getFiltersInfoforSV: getFiltersInfoforSV,
			getTableFilters: getTableFilters,
			getListBindingForCount: getListBindingForCount,
			getFilterInfo: getFilterInfo,
			getP13nFilters: getP13nFilters,
			getAllFilterInfo: getAllFilterInfo,
			whenBound: whenBound,
			onTableBound: onTableBound,
			getSemanticTargetsFromTable: fnGetSemanticTargetsFromTable,
			updateBindingInfo: updateBindingInfo,
			clearSelection: clearSelection,
			onBeforeExport: onBeforeExport
		};

		return oTableUtils;
	}
);
