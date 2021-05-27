/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/table/Utils",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/DelegateUtil",
		"sap/ui/model/Filter",
		"sap/base/Log",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/macros/FilterBarDelegate",
		"sap/fe/core/helpers/ExcelFormatHelper",
		"sap/fe/macros/table/TableHelper",
		"sap/fe/macros/ResourceModel"
	],
	function(
		JSONModel,
		CommonHelper,
		TableUtils,
		CommonUtils,
		DelegateUtil,
		Filter,
		Log,
		TypeUtil,
		FilterBarDelegate,
		ExcelFormat,
		TableHelper,
		ResourceModel
	) {
		"use strict";

		var FETCHED_PROPERTIES_DATA_KEY = "sap_fe_TableDelegate_propertyInfoMap";
		var FilterRestrictions = DelegateUtil.FilterRestrictions;

		function _getColumnsFor(oTable) {
			return CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "columns"));
		}

		function _getAggregatedPropertyMap(oTable) {
			return CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "aggregates") || {});
		}

		function _isLineItem(oPropertyInfo) {
			return oPropertyInfo && oPropertyInfo.metadataPath.includes("@com.sap.vocabularies.UI.v1.LineItem");
		}

		function _setCachedProperties(oTable, aFetchedProperties) {
			// do not cache during templating, else it becomes part of the cached view
			if (oTable instanceof window.Element) {
				return;
			}
			DelegateUtil.setCustomData(oTable, FETCHED_PROPERTIES_DATA_KEY, aFetchedProperties);
		}

		function _getCachedProperties(oTable) {
			// properties are not cached during templating
			if (oTable instanceof window.Element) {
				return null;
			}
			return DelegateUtil.getCustomData(oTable, FETCHED_PROPERTIES_DATA_KEY);
		}

		/**
		 * Helper class for sap.ui.mdc.Table.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.69
		 * @alias sap.fe.macros.table.TableDelegateBaseMixin
		 */
		var TableDelegateBaseMixin = {
			_fetchPropertyInfo: function(oBindingContext, oColumnInfo, oTable, oAppComponent) {
				var sAbsoluteNavigationPath = oColumnInfo.annotationPath,
					oMetaModel = oBindingContext.getModel(),
					oDataField = oMetaModel.getObject(oColumnInfo.annotationPath),
					oNavigationContext = oMetaModel.createBindingContext(sAbsoluteNavigationPath),
					vType = CommonUtils.getPropertyDataType(oNavigationContext),
					isComplexProperty = !!oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length > 1,
					//source : https://ui5.sap.com/#/api/sap.ui.export.EdmType%23properties
					sExportType = this._getExportDataType(vType, isComplexProperty),
					sDateFormat = vType && vType === "Edm.Date" ? ExcelFormat.getExcelDatefromJSDate() : undefined,
					sDateTimeFormat = vType && vType === "Edm.DateTimeOffset" ? ExcelFormat.getExcelDateTimefromJSDateTime() : undefined,
					sTimeFormat = vType && vType === "Edm.TimeOfDay" ? ExcelFormat.getExcelTimefromJSTime() : undefined,
					sDateInputFormat = sDateFormat ? "YYYY-MM-DD" : undefined,
					sDescription = null, // TODO this was erroneous - better having it empty for now
					bFilterable = CommonHelper.isPropertyFilterable(oColumnInfo.relativePath, { context: oNavigationContext }, oDataField),
					bComplexType = vType && vType.indexOf("Edm.") !== 0,
					oTypeConfig = DelegateUtil.isTypeFilterable(vType) ? TypeUtil.getTypeConfig(vType) : undefined,
					sLabel = DelegateUtil.getLocalizedText(oColumnInfo.label, oAppComponent || oTable),
					bIsAnalyticalTable = DelegateUtil.getCustomData(oTable, "enableAnalytics") === "true",
					aAggregatedPropertyMapUnfilterable = bIsAnalyticalTable ? _getAggregatedPropertyMap(oTable) : {},
					bRTLLanguage = sap.ui
						.getCore()
						.getConfiguration()
						.getRTL(),
					oExportSettings = {
						label: this._getExportLabel(oColumnInfo, sLabel, oTable, oAppComponent, bRTLLanguage),
						type: sExportType,
						inputFormat: sDateInputFormat,
						format: sDateFormat || sDateTimeFormat || sTimeFormat,
						scale: oNavigationContext.getProperty("$Scale") || oNavigationContext.getProperty("Value/$Path/$Scale"),
						delimiter: vType && vType === "Edm.Int64" ? true : false,
						trueValue: vType && vType === "Edm.Boolean" ? "Yes" : undefined,
						falseValue: vType && vType === "Edm.Boolean" ? "No" : undefined
					};

				// Set the exportSettings template only if it exists.
				if (oColumnInfo.exportSettings && oColumnInfo.exportSettings.template) {
					oExportSettings.template = oColumnInfo.exportSettings.template;
				}

				var oPropertyInfo = {
					name: oColumnInfo.name,
					metadataPath: sAbsoluteNavigationPath,
					groupLabel: oColumnInfo.groupLabel,
					group: oColumnInfo.group,
					label: sLabel,
					description: sDescription || sLabel,
					maxLength: oNavigationContext.$MaxLength,
					precision: oNavigationContext.$Precision,
					scale: oNavigationContext.$Scale,
					type: vType,
					typeConfig: oTypeConfig,
					visible: oColumnInfo.availability !== "Hidden" && !bComplexType,
					exportSettings: oExportSettings,
					unit: oColumnInfo.unit
				};

				// MDC expects  'propertyInfos' only for complex properties.
				// An empty array throws validation error and undefined value is unhandled.
				if (oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length) {
					oPropertyInfo.propertyInfos = oColumnInfo.propertyInfos;
				} else {
					// Add properties which are supported only by simple PropertyInfos.
					oPropertyInfo.path = oColumnInfo.relativePath;
					// TODO with the new complex property info, a lot of "Description" fields are added as filter/sort fields
					oPropertyInfo.sortable =
						oColumnInfo.sortable &&
						// TODO sorting by association properties is not supported by CAP/RAP (the created query is correct OData syntax)
						!oColumnInfo.relativePath.includes("/");
					oPropertyInfo.filterable =
						bFilterable &&
						// TODO ignoring all properties that are not also available for adaptation for now, but proper concept required
						!oColumnInfo.relativePath.includes("/") &&
						(!bIsAnalyticalTable || !aAggregatedPropertyMapUnfilterable[oPropertyInfo.name]);
					oPropertyInfo.key = oColumnInfo.isKey;
					oPropertyInfo.groupable = oColumnInfo.isGroupable;
				}

				return oPropertyInfo;
			},

			/**
			 * @param {string} sDataFieldType data field Type
			 * @param {boolean} bComplexProperty true if the field uses complex property (propertyInfos)
			 * @returns {string} export Data Type
			 */
			_getExportDataType: function(sDataFieldType, bComplexProperty) {
				var sExportDataType;
				if (bComplexProperty) {
					sExportDataType = "String";
				} else if (sDataFieldType) {
					switch (sDataFieldType) {
						case "Edm.Decimal":
						case "Edm.Int32":
						case "Edm.Int64":
						case "Edm.Double":
						case "Edm.Byte":
							sExportDataType = "Number";
							break;
						case "Edm.DateOfTime":
						case "Edm.Date":
							sExportDataType = "Date";
							break;
						case "Edm.DateTimeOffset":
							sExportDataType = "DateTime";
							break;
						case "Edm.TimeOfDay":
							sExportDataType = "Time";
							break;
						case "Edm.Boolean":
							sExportDataType = "Boolean";
							break;
						default:
							sExportDataType = "String";
					}
				}
				return sExportDataType;
			},

			_getExportLabel: function(oColumnInfo, sPropertyLabel, oTable, oAppComponent, bRTLLanguage) {
				var sExportLabel,
					aLabels = [];
				// Set Label for exported Columns considering localization and Internationalization
				if (oColumnInfo.exportSettings && oColumnInfo.exportSettings.labels) {
					aLabels = oColumnInfo.exportSettings.labels.map(function(label) {
						if (label === "DataPoint.TargetValue") {
							return ResourceModel.getText("TargetValue");
						}
						return DelegateUtil.getLocalizedText(label, oAppComponent || oTable);
					});
				}

				// Check if a RTL language if used and if so we need to reverse labels
				if (aLabels.length > 1 && bRTLLanguage) {
					aLabels.reverse();
				}
				sExportLabel = aLabels.length > 0 ? aLabels.join(" - ") : sPropertyLabel;
				return sExportLabel;
			},

			_fetchCustomPropertyInfo: function(oColumnInfo, oTable, oAppComponent) {
				var sLabel = DelegateUtil.getLocalizedText(oColumnInfo.header, oAppComponent || oTable); // Todo: To be removed once MDC provides translation support
				var oPropertyInfo = {
					name: oColumnInfo.name,
					groupLabel: null,
					group: null,
					label: sLabel,
					description: sLabel, // property?
					maxLength: undefined, // TBD
					precision: undefined, // TBD
					scale: undefined, // TBD
					type: "Edm.String", // TBD
					visible: oColumnInfo.availability !== "Hidden",
					exportSettings: undefined //TBD
				};

				// MDC expects 'propertyInfos' only for complex properties.
				// An empty array throws validation error and undefined value is unhandled.
				if (oColumnInfo.propertyInfos && oColumnInfo.propertyInfos.length) {
					oPropertyInfo.propertyInfos = oColumnInfo.propertyInfos;
				} else {
					// Add properties which are supported only by simple PropertyInfos.
					oPropertyInfo.path = oColumnInfo.name;
					oPropertyInfo.sortable = false;
					oPropertyInfo.filterable = false;
				}
				return oPropertyInfo;
			},

			_fetchPropertiesForEntity: function(oTable, sBindingPath, oMetaModel, oAppComponent) {
				// when fetching properties, this binding context is needed - so lets create it only once and use if for all properties/data-fields/line-items
				var oBindingContext = oMetaModel.createBindingContext(sBindingPath),
					aFetchedProperties = [],
					mEntitySetAnnotations = oMetaModel.getObject(sBindingPath + "@"),
					oFilterRestrictions = mEntitySetAnnotations && mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"],
					aNonFilterableProps =
						DelegateUtil.getFilterRestrictions(oFilterRestrictions, FilterRestrictions.NON_FILTERABLE_PROPERTIES) || [],
					//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
					mAllowedExpressions =
						DelegateUtil.getFilterRestrictions(oFilterRestrictions, FilterRestrictions.ALLOWED_EXPRESSIONS) || {},
					that = this;

				return Promise.resolve(_getColumnsFor(oTable)).then(function(aColumns) {
					// DraftAdministrativeData does not work via 'entitySet/$NavigationPropertyBinding/DraftAdministrativeData'
					if (!aColumns) {
						return Promise.resolve([]);
					}
					var oPropertyInfo;
					aColumns.forEach(function(oColumnInfo) {
						switch (oColumnInfo.type) {
							case "Annotation":
								oPropertyInfo = that._fetchPropertyInfo(oBindingContext, oColumnInfo, oTable, oAppComponent);
								if (oPropertyInfo && aNonFilterableProps.indexOf(oPropertyInfo.name) === -1) {
									if (mAllowedExpressions[oPropertyInfo.name]) {
										oPropertyInfo.filterExpression = mAllowedExpressions[oPropertyInfo.name];
									} else {
										oPropertyInfo.filterExpression = "auto"; // default
									}
									oPropertyInfo.maxConditions = DelegateUtil.isMultiValue(oPropertyInfo) ? -1 : 1;
								}
								break;
							case "Default":
								oPropertyInfo = that._fetchCustomPropertyInfo(oColumnInfo, oTable, oAppComponent);
								break;
							default:
								throw new Error("unhandled switch case " + oColumnInfo.type);
						}
						aFetchedProperties.push(oPropertyInfo);
					});

					// Set the 'unit' property on the propertyInfos that need one
					aFetchedProperties.forEach(function(oPropertyInfo) {
						var sUnitName =
							oPropertyInfo.path && oPropertyInfo.exportSettings ? oPropertyInfo.exportSettings.unitProperty : undefined;
						if (sUnitName) {
							// Find the propertyInfo corresponding to the unit
							var oUnitPropertyInfo = aFetchedProperties.find(function(oProp) {
								return oProp.path === sUnitName;
							});
							if (oUnitPropertyInfo) {
								oPropertyInfo.unit = oUnitPropertyInfo.name;
							}
						}
					});

					return aFetchedProperties;
				});
			},

			_getCachedOrFetchPropertiesForEntity: function(oTable, sEntitySetPath, oMetaModel, oAppComponent) {
				var aFetchedProperties = _getCachedProperties(oTable);

				if (aFetchedProperties) {
					return Promise.resolve(aFetchedProperties);
				}
				return this._fetchPropertiesForEntity(oTable, sEntitySetPath, oMetaModel, oAppComponent).then(function(aFetchedProperties) {
					_setCachedProperties(oTable, aFetchedProperties);
					return aFetchedProperties;
				});
			},

			_setTableNoDataText: function(oTable, oBindingInfo) {
				var sNoDataKey = "",
					oTableFilterInfo = TableUtils.getAllFilterInfo(oTable),
					suffixResourceKey = oBindingInfo.path.substr(1);

				var _getNoDataTextWithFilters = function() {
					if (oTable.data("hiddenFilters") || oTable.data("quickFilterKey")) {
						return "M_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER_MULTI_VIEW";
					} else {
						return "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER";
					}
				};

				if (oTable.getFilter()) {
					// check if a FilterBar is associated to the Table
					if (oTableFilterInfo.search || (oTableFilterInfo.filters && oTableFilterInfo.filters.length)) {
						// check if table has any Filterbar filters or personalization filters
						sNoDataKey = _getNoDataTextWithFilters();
					} else {
						sNoDataKey = "M_OP_TABLE_AND_CHART_NO_FILTERS_NO_DATA_TEXT";
					}
				} else {
					if (oTableFilterInfo.search || (oTableFilterInfo.filters && oTableFilterInfo.filters.length)) {
						//check if table has any personalization filters
						sNoDataKey = _getNoDataTextWithFilters();
					} else {
						sNoDataKey = "M_OP_TABLE_AND_CHART_OP_NO_FILTERS_NO_DATA_TEXT";
					}
				}
				if (sNoDataKey === "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER") {
					return oTable
						.getModel("sap.fe.i18n")
						.getResourceBundle()
						.then(function(oResourceBundle) {
							oTable.setNoDataText(CommonUtils.getTranslatedText(sNoDataKey, oResourceBundle, null, suffixResourceKey));
						})
						.catch(function(error) {
							Log.error(error);
						});
				} else {
					if (ResourceModel) {
						oTable.setNoDataText(ResourceModel.getText(sNoDataKey));
					}
				}
			},

			handleTableDataReceived: function(oTable, oInternalModelContext) {
				var oBinding = oTable && oTable.getRowBinding(),
					bDataReceivedAttached = oInternalModelContext.getProperty("dataReceivedAttached");

				if (!bDataReceivedAttached) {
					oBinding.attachDataReceived(function() {
						TableHelper.handleTableDeleteEnablementForSideEffects(oTable, oInternalModelContext);
					});
					oInternalModelContext.setProperty("dataReceivedAttached", true);
				}
			},

			_getDelegateParentClass: function() {
				return undefined;
			},

			rebindTable: function(oTable, oBindingInfo) {
				if (!oTable.data("tableHidden")) {
					TableUtils.clearSelection(oTable);
					this._getDelegateParentClass().rebindTable(oTable, oBindingInfo);
					TableUtils.onTableBound(oTable);
					this._setTableNoDataText(oTable, oBindingInfo);
					TableUtils.whenBound(oTable)
						.then(this.handleTableDataReceived(oTable, oTable.getBindingContext("internal")))
						.catch(function(oError) {
							Log.error("Error while waiting for the table to be bound", oError);
						});
				}
			},

			/**
			 * Fetches the relevant metadata for the table and returns property info array.
			 *
			 * @param {object} oTable - instance of the mdc Table
			 * @returns {Array} array of property info
			 */
			fetchProperties: function(oTable) {
				var that = this;

				return DelegateUtil.fetchModel(oTable).then(function(oModel) {
					if (!oModel) {
						return [];
					}
					return that._getCachedOrFetchPropertiesForEntity(
						oTable,
						DelegateUtil.getCustomData(oTable, "targetCollectionName"),
						oModel.getMetaModel()
					);
				});
			},

			updateBindingInfo: function(oTable, oMetadataInfo, oBindingInfo) {
				Object.assign(oBindingInfo, DelegateUtil.getCustomData(oTable, "rowsBindingInfo"));
				/**
				 * Binding info might be suspended at the beginning when the first bindRows is called:
				 * To avoid duplicate requests but still have a binding to create new entries.
				 *
				 * After the initial binding step, follow up bindings should not longer be suspended.
				 */
				if (oTable.getRowBinding()) {
					oBindingInfo.suspended = false;
				}

				var oFilter;
				var oFilterInfo = TableUtils.getAllFilterInfo(oTable);
				// Prepare binding info with filter/search parameters
				if (oFilterInfo.filters.length > 0) {
					oFilter = new Filter({ filters: oFilterInfo.filters, and: true });
				}
				TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
			},

			_templateCustomColumnFragment: function(oColumnInfo, oView, oModifier) {
				var oColumnModel = new JSONModel(oColumnInfo),
					oPreprocessorSettings = {
						bindingContexts: {
							"column": oColumnModel.createBindingContext("/")
						},
						models: {
							"column": oColumnModel
						}
					};

				return DelegateUtil.templateControlFragment(
					"sap.fe.macros.table.CustomColumn",
					oPreprocessorSettings,
					{ view: oView },
					oModifier
				).then(function(oItem) {
					oColumnModel.destroy();
					return oItem;
				});
			},

			_getVHRelevantFields: function(oMetaModel, sMetadataPath, sBindingPath) {
				var aFields = [];
				var oDataFieldData = oMetaModel.getObject(sMetadataPath);
				if (oDataFieldData.$kind && oDataFieldData.$kind === "Property") {
					oDataFieldData = oMetaModel.getObject(sMetadataPath + "@com.sap.vocabularies.UI.v1.DataFieldDefault");
					sMetadataPath = sMetadataPath + "@com.sap.vocabularies.UI.v1.DataFieldDefault";
				}
				switch (oDataFieldData.$Type) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
						if (
							oMetaModel
								.getObject(sMetadataPath + "/Target/$AnnotationPath")
								.includes("com.sap.vocabularies.UI.v1.FieldGroup")
						) {
							oMetaModel.getObject(sMetadataPath + "/Target/$AnnotationPath/Data").forEach(function(oValue, iIndex) {
								aFields = aFields.concat(
									TableDelegateBaseMixin._getVHRelevantFields(
										oMetaModel,
										sMetadataPath + "/Target/$AnnotationPath/Data/" + iIndex
									)
								);
							});
						}
						break;
					case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
					case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
					case "com.sap.vocabularies.UI.v1.DataField":
						aFields.push(oMetaModel.getObject(sMetadataPath + "/Value/$Path"));
						break;
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						break;
					default:
						// property
						// temporary workaround to make sure VH relevant field path do not contain the bindingpath
						if (sMetadataPath.indexOf(sBindingPath) === 0) {
							aFields.push(sMetadataPath.substring(sBindingPath.length + 1));
							break;
						}
						aFields.push(CommonHelper.getNavigationPath(sMetadataPath, true));
						break;
				}
				return aFields;
			},

			/**
			 * Invoked when a column is added using table personalization dialog.
			 * @param {string} sPropertyInfoName Name of the entity type property for which the column is added
			 * @param {sap.ui.mdc.Table} oTable Instance of Table control
			 * @param {map} mPropertyBag Instance of property bag from Flex API
			 * @returns {Promise} once resolved, a table column definition is returned
			 */
			addItem: function(sPropertyInfoName, oTable, mPropertyBag) {
				var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel(),
					oModifier = mPropertyBag.modifier,
					sTableId = oModifier.getId(oTable),
					sPath,
					sGroupId,
					pValueHelp,
					oTableContext,
					oColumnInfo,
					oPropertyContext,
					oPropertyInfo,
					oParameters,
					aVHProperties,
					aColumns = _getColumnsFor(oTable);

				oColumnInfo = aColumns.find(function(oColumn) {
					return oColumn.name === sPropertyInfoName;
				});
				if (!oColumnInfo) {
					Log.error(sPropertyInfoName + " not found while adding column");
					return Promise.resolve(null);
				}
				// render custom column
				if (oColumnInfo.type === "Default") {
					return this._templateCustomColumnFragment(oColumnInfo, mPropertyBag.view, oModifier);
				}

				// fall-back
				if (!oMetaModel) {
					return Promise.resolve(null);
				}

				sPath = DelegateUtil.getCustomData(oTable, "metaPath", oModifier);
				sGroupId = DelegateUtil.getCustomData(oTable, "requestGroupId", oModifier) || undefined;
				oTableContext = oMetaModel.createBindingContext(sPath);

				// 1. check if this column has value help
				// 2. check if there is already a value help existing which can be re-used for the new column added

				return this._getCachedOrFetchPropertiesForEntity(oTable, sPath, oMetaModel, mPropertyBag.appComponent).then(function(
					aFetchedProperties
				) {
					oPropertyInfo = aFetchedProperties.find(function(oInfo) {
						return oInfo.name === sPropertyInfoName;
					});

					oPropertyContext = oMetaModel.createBindingContext(oPropertyInfo.metadataPath);
					aVHProperties = TableDelegateBaseMixin._getVHRelevantFields(oMetaModel, oPropertyInfo.metadataPath, sPath);
					oParameters = {
						sBindingPath: sPath,
						sValueHelpType: "TableValueHelp",
						oControl: oTable,
						oMetaModel: oMetaModel,
						oModifier: oModifier,
						oPropertyInfo: oPropertyInfo
					};
					pValueHelp = Promise.all(
						aVHProperties.map(function(sPropertyName) {
							var mParameters = Object.assign({}, oParameters, { sPropertyName: sPropertyName });

							return Promise.all([
								DelegateUtil.isValueHelpRequired(mParameters),
								DelegateUtil.doesValueHelpExist(mParameters)
							]).then(function(aResults) {
								var bValueHelpRequired = aResults[0],
									bValueHelpExists = aResults[1];
								if (bValueHelpRequired && !bValueHelpExists) {
									return fnTemplateValueHelp("sap.fe.macros.table.ValueHelp");
								}
								return Promise.resolve();
							});
						})
					);

					function fnTemplateValueHelp(sFragmentName) {
						var oThis = new JSONModel({
								id: sTableId,
								requestGroupId: sGroupId
							}),
							oPreprocessorSettings = {
								bindingContexts: {
									"this": oThis.createBindingContext("/"),
									"dataField": oPropertyContext
								},
								models: {
									"this": oThis,
									"dataField": oMetaModel,
									metaModel: oMetaModel
								}
							};

						return DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {}, oModifier)
							.then(function(oValueHelp) {
								if (oValueHelp) {
									oModifier.insertAggregation(oTable, "dependents", oValueHelp, 0);
								}
							})
							.catch(function(oError) {
								//We always resolve the promise to ensure that the app does not crash
								Log.error("ValueHelp not loaded : " + oError.message);
								return Promise.resolve(null);
							})
							.finally(function() {
								oThis.destroy();
							});
					}

					function fnTemplateFragment(oPropertyInfo, oView) {
						var sFragmentName = _isLineItem(oPropertyInfo)
								? "sap.fe.macros.table.Column"
								: "sap.fe.macros.table.ColumnProperty",
							bDisplayMode = DelegateUtil.getCustomData(oTable, "displayModePropertyBinding", oModifier);
						bDisplayMode = typeof bDisplayMode === "boolean" ? bDisplayMode : bDisplayMode === "true";
						var oThis = new JSONModel({
								displayMode: bDisplayMode,
								tableType: DelegateUtil.getCustomData(oTable, "tableType", oModifier),
								onChange: DelegateUtil.getCustomData(oTable, "onChange", oModifier),
								id: sTableId,
								navigationPropertyPath: sPropertyInfoName,
								columnInfo: oColumnInfo,
								collection: {
									sPath: sPath,
									oModel: oMetaModel
								},
								creationMode: DelegateUtil.getCustomData(oTable, "creationMode", oModifier)
							}),
							oPreprocessorSettings = {
								bindingContexts: {
									"entitySet": oTableContext,
									"collection": oTableContext,
									"dataField": oPropertyContext,
									"this": oThis.createBindingContext("/"),
									"column": oThis.createBindingContext("/columnInfo")
								},
								models: {
									"this": oThis,
									"entitySet": oMetaModel,
									"collection": oMetaModel,
									"dataField": oMetaModel,
									metaModel: oMetaModel,
									"column": oThis
								}
							};

						return DelegateUtil.templateControlFragment(
							sFragmentName,
							oPreprocessorSettings,
							{ view: oView },
							oModifier
						).finally(function() {
							oThis.destroy();
						});
					}

					return pValueHelp.then(fnTemplateFragment.bind(this, oPropertyInfo, mPropertyBag.view));
				});
			},

			/**
			 * Provide the Table's filter delegate to provide basic filter functionality such as adding FilterFields.
			 *
			 * @returns {object} Object for the Tables filter personalization.
			 */
			getFilterDelegate: function() {
				return Object.assign({}, FilterBarDelegate, {
					addItem: function(sPropertyInfoName, oParentControl) {
						if (sPropertyInfoName.indexOf("Property::") === 0) {
							// Correct the name of complex property info references.
							sPropertyInfoName = sPropertyInfoName.replace("Property::", "");
						}
						return FilterBarDelegate.addItem(sPropertyInfoName, oParentControl);
					}
				});
			},

			/**
			 * Returns the typeutil attached to this delegate.
			 *
			 * @param {object} oPayload Delegate payload object
			 * @returns {sap.ui.mdc.util.TypeUtil} Any instance of TypeUtil
			 */
			getTypeUtil: function(oPayload) {
				return TypeUtil;
			}
		};

		return TableDelegateBaseMixin;
	},
	/* bExport= */ false
);
