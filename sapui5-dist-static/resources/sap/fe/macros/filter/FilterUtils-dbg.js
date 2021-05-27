/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/mdc/util/FilterUtil",
		"sap/ui/fl/Utils",
		"sap/ui/core/Core",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/helpers/ModelHelper",
		"sap/ui/model/Filter",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/core/converters/templates/ListReportConverter",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/templates/BaseConverter",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/base/util/merge",
		"sap/ui/model/json/JSONModel",
		"sap/ui/mdc/field/ConditionsType",
		"sap/ui/mdc/p13n/StateUtil"
	],
	function(
		FilterUtil,
		FlUtils,
		Core,
		CommonHelper,
		CommonUtils,
		ModelHelper,
		Filter,
		DelegateUtil,
		ListReportConverter,
		ConverterContext,
		BaseConverter,
		MetaModelConverter,
		merge,
		JSONModel,
		ConditionsType,
		StateUtil
	) {
		"use strict";

		var oFilterUtils = {
			getFilter: function(vIFilter) {
				var aFilters = oFilterUtils.getFilterInfo(vIFilter).filters;
				return aFilters.length ? new Filter(oFilterUtils.getFilterInfo(vIFilter).filters, false) : undefined;
			},
			getConvertedFilterFields: function(oFilterControl, sEntityTypePath) {
				var sFilterEntityTypePath = DelegateUtil.getCustomData(oFilterControl, "entityType"),
					sFilterEntityPath = ModelHelper.getEntitySetPath(sFilterEntityTypePath),
					sEntitySetPath = sEntityTypePath && ModelHelper.getEntitySetPath(sEntityTypePath),
					sTargetEntityPath = sEntitySetPath || sFilterEntityPath,
					sTargetEntitySetName = sTargetEntityPath ? sTargetEntityPath.slice(1) : sTargetEntityPath,
					sCustomDataPath =
						"selectionFields" +
						(!sTargetEntityPath || sFilterEntityPath === sTargetEntityPath ? "" : "For" + sTargetEntitySetName),
					aSelectionFields = DelegateUtil.getCustomData(oFilterControl, sCustomDataPath);

				if (!aSelectionFields && (!sTargetEntityPath || !(oFilterControl.data instanceof Function))) {
					return [];
				} else if (!aSelectionFields) {
					var oView = FlUtils.getViewForControl(oFilterControl);
					var oMetaModel = oFilterControl.getModel().getMetaModel();
					var oAppComponent = CommonUtils.getAppComponent(oView);
					var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(
						oMetaModel.createBindingContext("/" + sTargetEntitySetName)
					);
					var oConverterContext = ConverterContext.createConverterContextForMacro(
						oVisualizationObjectPath.startingEntitySet.name,
						oMetaModel,
						BaseConverter.TemplateType.ListReport,
						oAppComponent && oAppComponent.getShellServices(),
						oAppComponent && oAppComponent.getDiagnostics(),
						merge,
						oVisualizationObjectPath.contextLocation,
						undefined
					);
					aSelectionFields = ListReportConverter.getSelectionFields(oConverterContext);
					DelegateUtil.setCustomData(oFilterControl, sCustomDataPath, aSelectionFields);
				}
				return CommonHelper.parseCustomData(aSelectionFields);
			},

			/**
			 * Get All Filter coming from MDC FilterBar.
			 *
			 * @param {object|string} vIFilter String or object instance related to
			 *  - MDC FilterBar/Table/Chart
			 * @param {object} mProperties - Properties on Filters to retrieve. Available parameters:
			 * 	 - ignoredProperties: Array of property names which should be not considered for filtering
			 *	 - propertiesMetadata: Array with all the property metadata. If not provided, properties will be retrieve from vIFilter.
			 *	 - targetControl: MDC Table or Chart. If provided property names which are not relevant for the Target control entitySet are not considered
			 * @returns {object} FilterBar filters and basic search
			 * @private
			 * @ui5-restricted
			 */
			getFilterInfo: function(vIFilter, mProperties) {
				var oIFilter = vIFilter,
					sSearch,
					aFilters = [],
					aIgnoreProperties = (mProperties && mProperties.ignoredProperties) || [],
					aPropertiesMetadata = mProperties && mProperties.propertiesMetadata,
					oTargetControl = mProperties && mProperties.targetControl,
					sTargetEntity = oTargetControl ? oTargetControl.data("targetCollectionName") : undefined;
				if (typeof vIFilter === "string") {
					oIFilter = Core.byId(vIFilter);
				}
				if (oIFilter) {
					sSearch = oIFilter.getSearch && aIgnoreProperties.indexOf("search") === -1 ? oIFilter.getSearch() : null;
					var mConditions = oIFilter.getConditions(),
						aFilterPropertiesMetadata = oIFilter.getPropertyInfoSet ? oIFilter.getPropertyInfoSet() : null;
					if (mConditions) {
						var sTargetEntityType = sTargetEntity + "/";
						//Exclude Interface Filter properties that are not relevant for the Target control entitySet
						if (sTargetEntity && oIFilter.data("entityType") !== sTargetEntityType) {
							var oMetaModel = oIFilter.getModel().getMetaModel();
							var aTargetPropertiesMetadata = oIFilter
								.getControlDelegate()
								.fetchPropertiesForEntity(sTargetEntityType, oMetaModel, oIFilter);
							aPropertiesMetadata = aTargetPropertiesMetadata;

							var mEntityProperties = {};
							for (var i = 0; i < aTargetPropertiesMetadata.length; i++) {
								var oEntityProperty = aTargetPropertiesMetadata[i];
								mEntityProperties[oEntityProperty.name] = true;
							}
							aFilterPropertiesMetadata.forEach(function(oIFilterProperty) {
								var sIFilterPropertyName = oIFilterProperty.name;
								if (!mEntityProperties[sIFilterPropertyName]) {
									aIgnoreProperties.push(sIFilterPropertyName);
								}
							});
						} else if (!aPropertiesMetadata) {
							aPropertiesMetadata = aFilterPropertiesMetadata;
						}
						var oFilter = FilterUtil.getFilterInfo(oIFilter, mConditions, aPropertiesMetadata, aIgnoreProperties).filters;
						aFilters = oFilter ? [oFilter] : [];
					}
				}
				return { filters: aFilters, search: sSearch || undefined };
			},
			getNotApplicableFiltersForTable: function(oFilterBar, oTable) {
				var sTargetEntityPath = oTable.data("targetCollectionName"),
					aNotApplicable = [],
					mConditions = oFilterBar.getConditions(),
					oMetaModel = oFilterBar.getModel().getMetaModel(),
					sTargetEntityTypePath = sTargetEntityPath + "/",
					bIsFilterBarEntityType = sTargetEntityTypePath === oFilterBar.data("entityType"),
					bIsAnalyticalTable = DelegateUtil.getCustomData(oTable, "enableAnalytics") === "true";

				if (mConditions && (!bIsFilterBarEntityType || bIsAnalyticalTable)) {
					// We don't need to calculate the difference on property Level if entity sets are identical
					var aTargetProperties = bIsFilterBarEntityType
							? []
							: oFilterBar.getControlDelegate().fetchPropertiesForEntity(sTargetEntityTypePath, oMetaModel, oFilterBar),
						mTargetProperties = aTargetProperties.reduce(function(mProp, oProp) {
							mProp[oProp.name] = oProp;
							return mProp;
						}, {}),
						mTableAggreagtes = CommonHelper.parseCustomData(DelegateUtil.getCustomData(oTable, "aggregates") || {}),
						mAggreagtedProperties = {};

					Object.keys(mTableAggreagtes).forEach(function(sAggregateName) {
						var oAggregate = mTableAggreagtes[sAggregateName];
						mAggreagtedProperties[oAggregate.relativePath] = oAggregate;
					});

					for (var sProperty in mConditions) {
						// Need to check the length of mConditions[sProperty] since previous filtered properties are kept into mConditions with empty array as definition
						var aConditionProperty = mConditions[sProperty];
						if (
							Array.isArray(aConditionProperty) &&
							aConditionProperty.length > 0 &&
							((!mTargetProperties[sProperty] && !bIsFilterBarEntityType) || mAggreagtedProperties[sProperty])
						) {
							aNotApplicable.push(sProperty);
						}
					}
				}
				if (bIsAnalyticalTable && oFilterBar.getSearch()) {
					aNotApplicable.push("$search");
				}
				return aNotApplicable;
			},

			attachConditionHandling: function(oFilterBar) {
				var oFilterModel = new JSONModel(),
					oEventData = {
						filterControl: oFilterBar,
						filterModel: oFilterModel
					},
					that = this;

				oFilterBar.setModel(oFilterModel, "filterValues");
				return oFilterBar.initialized().then(function() {
					var oConditionModel = oFilterBar._getConditionModel();
					oConditionModel.attachPropertyChange(oEventData, that._handleConditionModelChange, that);
					oFilterModel.attachPropertyChange(oEventData, that._handleFilterModelChange, that);
				});
			},
			detachConditionHandling: function(oFilterBar) {
				var oFilterModel = oFilterBar.getModel("filterValues"),
					oConditionModel = oFilterBar._getConditionModel();
				oConditionModel.detachPropertyChange(this._handleConditionModelChange, this);
				oFilterModel.detachPropertyChange(this._handleFilterModelChange, this);
				oFilterModel.destroy();
			},
			setFilterValues: function(oFilterControl, sConditionPath, sOperator, vValues) {
				var oFormatOptions = {};
				if (vValues === undefined) {
					vValues = sOperator;
				} else {
					oFormatOptions.operators = [sOperator];
				}

				if (typeof vValues === "object" && vValues.operator) {
					oFormatOptions.operators = [vValues.operator];
					vValues = vValues.values;
				}

				var oConditionsType = new ConditionsType(oFormatOptions),
					oClearFilter = {},
					oFilter = {};

				vValues = Array.isArray(vValues) ? vValues : [vValues];

				oClearFilter[sConditionPath] = [];
				if (sOperator) {
					oFilter[sConditionPath] = vValues
						.filter(function(vValue) {
							return vValue !== undefined && vValue !== null;
						})
						.reduce(function(aAllFilters, vValue) {
							return aAllFilters.concat(oConditionsType.parseValue(vValue.toString(), "any"));
						}, []);
				}

				// needs to be cleared first, else it is just added to the already existing filters
				return StateUtil.applyExternalState(oFilterControl, { filter: oClearFilter }).then(
					StateUtil.applyExternalState.bind(StateUtil, oFilterControl, { filter: oFilter })
				);
			},
			conditionToModelPath: function(sConditionPath) {
				// make the path usable as model property, therefore slashes become backslashes
				return sConditionPath.replace(/\//g, "\\");
			},
			modelToConditionPath: function(sConditionPath) {
				return sConditionPath.replace(/\\/g, "/");
			},
			_handleConditionModelChange: function(oEvent, oData) {
				// substring(12) => strip away "/conditions/" from the path
				var sConditionPath = this.modelToConditionPath(oEvent.getParameter("path").substring(12)),
					// return pure value without operator, e.g. "42" instead of "=42"
					oConditionsType = new ConditionsType({ maxConditions: -1 }),
					oFilterModel = oData.filterModel,
					aValue = oEvent.getParameter("value"),
					vValue = oConditionsType.formatValue(aValue, "any");
				oFilterModel.setProperty("/" + this.conditionToModelPath(sConditionPath), vValue);
			},
			_handleFilterModelChange: function(oEvent, oData) {
				var sPath = oEvent
						.getParameter("context")
						.getPath()
						.substring(1)
						.replace(/\\/g, "/"),
					vValues = oEvent.getParameter("value");
				this.setFilterValues(oData.filterControl, sPath, vValues);
			}
		};

		return oFilterUtils;
	}
);
