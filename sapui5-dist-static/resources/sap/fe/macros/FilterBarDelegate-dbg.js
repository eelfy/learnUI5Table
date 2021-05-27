/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the FilterBar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/FilterBarDelegate",
		"sap/ui/model/json/JSONModel",
		"sap/fe/core/TemplateModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/macros/field/FieldHelper",
		"sap/fe/macros/filter/FilterUtils",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/macros/ResourceModel",
		"sap/base/util/merge",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/macros/FilterBarHelper",
		"sap/base/Log",
		"sap/base/util/JSTokenizer",
		"sap/fe/core/templating/PropertyFormatters"
	],
	function(
		FilterBarDelegate,
		JSONModel,
		TemplateModel,
		CommonHelper,
		CommonUtils,
		ModelHelper,
		StableIdHelper,
		FieldHelper,
		FilterUtils,
		TypeUtil,
		ResourceModel,
		mergeObjects,
		DelegateUtil,
		FilterBarHelper,
		Log,
		JSTokenizer,
		PropertyFormatters
	) {
		"use strict";
		var ODataFilterBarDelegate = Object.assign({}, FilterBarDelegate),
			EDIT_STATE_PROPERTY_NAME = "$editState",
			SEARCH_PROPERTY_NAME = "$search",
			VALUE_HELP_TYPE = "FilterFieldValueHelp",
			FETCHED_PROPERTIES_DATA_KEY = "sap_fe_FilterBarDelegate_propertyInfoMap",
			CONDITION_PATH_TO_PROPERTY_PATH_REGEX = /\+|\*/g;

		var FilterRestrictions = DelegateUtil.FilterRestrictions;

		function _getSearchFilterPropertyInfo() {
			return {
				name: SEARCH_PROPERTY_NAME,
				path: SEARCH_PROPERTY_NAME,
				typeConfig: TypeUtil.getTypeConfig("sap.ui.model.odata.type.String"),
				maxConditions: 1
			};
		}

		function _getEditStateFilterPropertyInfo() {
			return {
				name: EDIT_STATE_PROPERTY_NAME,
				path: EDIT_STATE_PROPERTY_NAME,
				groupLabel: "",
				group: "",
				label: ResourceModel.getText("M_COMMON_FILTERBAR_EDITING_STATUS"),
				tooltip: null,
				hiddenFilter: false,
				typeConfig: TypeUtil.getTypeConfig("sap.ui.model.odata.type.String"),

				defaultFilterConditions: [
					{
						fieldPath: "$editState",
						operator: "DRAFT_EDIT_STATE",
						values: ["0"]
					}
				]
			};
		}

		function _templateEditState(sIdPrefix, oModifier) {
			var oThis = new JSONModel({
					id: sIdPrefix
				}),
				oPreprocessorSettings = {
					bindingContexts: {
						"this": oThis.createBindingContext("/")
					},
					models: {
						"this.i18n": ResourceModel.getModel(),
						"this": oThis
					}
				};

			return DelegateUtil.templateControlFragment(
				"sap.fe.macros.filter.DraftEditState",
				oPreprocessorSettings,
				undefined,
				oModifier
			).finally(function() {
				oThis.destroy();
			});
		}

		function _templateCustomFilter(oFilterBar, sIdPrefix, oSelectionFieldInfo, oMetaModel, oModifier) {
			var oThis = new JSONModel({
					id: sIdPrefix
				}),
				oItemModel = new TemplateModel(oSelectionFieldInfo, oMetaModel),
				oPreprocessorSettings = {
					bindingContexts: {
						"this": oThis.createBindingContext("/"),
						"item": oItemModel.createBindingContext("/")
					},
					models: {
						"this": oThis,
						"item": oItemModel
					}
				};

			return DelegateUtil.templateControlFragment(
				"sap.fe.macros.filter.CustomFilter",
				oPreprocessorSettings,
				undefined,
				oModifier
			).finally(function() {
				oThis.destroy();
				oItemModel.destroy();
			});
		}

		function _getPropertyPath(sConditionPath) {
			return sConditionPath.replace(CONDITION_PATH_TO_PROPERTY_PATH_REGEX, "");
		}

		function _findSelectionField(aSelectionFields, sFlexName) {
			return aSelectionFields.find(function(oSelectionField) {
				return oSelectionField.conditionPath === sFlexName && oSelectionField.availability !== "Hidden";
			});
		}

		function _fetchBasicPropertyInfo(oFilterFieldInfo) {
			return {
				name: oFilterFieldInfo.conditionPath,
				path: oFilterFieldInfo.conditionPath,
				groupLabel: oFilterFieldInfo.groupLabel,
				group: oFilterFieldInfo.group,
				label: oFilterFieldInfo.label,
				tooltip: null,
				hiddenFilter: oFilterFieldInfo.availability === "Hidden",
				removeFromAppState: false,
				hasValueHelp: false,
				display: "Value",
				typeConfig: TypeUtil.getTypeConfig("String")
			};
		}

		function _fetchPropertyInfo(oMetaModel, oFilterFieldInfo) {
			var oPropertyInfo = _fetchBasicPropertyInfo(oFilterFieldInfo),
				sAnnotationPath = oFilterFieldInfo.annotationPath;

			// no annotationPath => transient filter field
			if (!sAnnotationPath) {
				return oPropertyInfo;
			}

			var sParentPath = sAnnotationPath.substr(0, sAnnotationPath.lastIndexOf("/")),
				oProperty = oMetaModel.getObject(sAnnotationPath),
				oPropertyAnnotations = oMetaModel.getObject(sAnnotationPath + "@"),
				oCollectionAnnotations = oMetaModel.getObject(sParentPath + "/@"),
				oFilterDefaultValue,
				oFilterDefaultValueAnnotation,
				oPropertyContext = oMetaModel.createBindingContext(sAnnotationPath),
				oFormatOptions = JSTokenizer.parseJS(FieldHelper.formatOptions(oProperty, { context: oPropertyContext }) || "{}"),
				oConstraints = JSTokenizer.parseJS(FieldHelper.constraints(oProperty, { context: oPropertyContext }) || "{}"),
				bRemoveFromAppState =
					oPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
					oPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
					oPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"];

			// check if type can be used for filtering, unsupported types are eg. Edm.Stream, field control, messages -> they have no sap.ui.model.type correspondence
			// So using prefix path instead of sEntitySetPath
			var sTargetPropertyPrefix = CommonHelper.getEntitySetForPropertyPath(oMetaModel, oFilterFieldInfo.annotationPath);
			var sProperty = oFilterFieldInfo.annotationPath.replace(sTargetPropertyPrefix + "/", "");

			if (!CommonUtils.isPropertyFilterable(oMetaModel, sTargetPropertyPrefix, _getPropertyPath(sProperty), true)) {
				return null;
			}

			oFilterDefaultValueAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.FilterDefaultValue"];
			if (oFilterDefaultValueAnnotation) {
				oFilterDefaultValue = oFilterDefaultValueAnnotation["$" + DelegateUtil.getModelType(oProperty.$Type)];
			}

			oPropertyInfo = Object.assign(oPropertyInfo, {
				tooltip: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.QuickInfo"] || undefined,
				removeFromAppState: bRemoveFromAppState,
				hasValueHelp: PropertyFormatters.hasValueHelp(oPropertyContext.getObject(), { context: oPropertyContext }),
				formatOptions: oFormatOptions,
				constraints: oConstraints,
				typeConfig: TypeUtil.getTypeConfig(oProperty.$Type, oFormatOptions, oConstraints),
				display: FieldHelper.displayMode(oPropertyAnnotations, oCollectionAnnotations),
				defaultFilterConditions: oFilterDefaultValue
					? [
							{
								fieldPath: oFilterFieldInfo.conditionPath,
								operator: "EQ",
								values: [oFilterDefaultValue]
							}
					  ]
					: undefined
			});

			return oPropertyInfo;
		}

		function _generateIdPrefix(sFilterBarId, sControlType, sNavigationPrefix) {
			return sNavigationPrefix
				? StableIdHelper.generate([sFilterBarId, sControlType, sNavigationPrefix])
				: StableIdHelper.generate([sFilterBarId, sControlType]);
		}

		function _templateValueHelp(oSettings, oParameters) {
			return Promise.resolve()
				.then(function() {
					var oThis = new JSONModel({
							idPrefix: oParameters.sVhIdPrefix,
							conditionModel: "$filters",
							navigationPrefix: oParameters.sNavigationPrefix ? "/" + oParameters.sNavigationPrefix : "",
							filterFieldValueHelp: true,
							requestGroupId: oParameters.sValueHelpGroupId,
							useSemanticDateRange: oParameters.bUseSemanticDateRange
						}),
						oPreprocessorSettings = mergeObjects({}, oSettings, {
							bindingContexts: {
								"this": oThis.createBindingContext("/")
							},
							models: {
								"this": oThis
							}
						});

					return DelegateUtil.templateControlFragment("sap.fe.macros.internal.valuehelp.ValueHelp", oPreprocessorSettings, {
						isXML: oSettings.isXML
					})
						.then(function(oVHElement) {
							if (oVHElement) {
								var sAggregationName = "dependents";
								if (oParameters.oModifier) {
									oParameters.oModifier.insertAggregation(oParameters.oControl, sAggregationName, oVHElement, 0);
								} else {
									oParameters.oControl.insertAggregation(sAggregationName, oVHElement, 0, false);
								}
							}
						})
						.finally(function() {
							oThis.destroy();
						});
				})
				.catch(function(oError) {
					Log.error("Error while evaluating DelegateUtil.isValueHelpRequired", oError);
				});
		}

		function _templateFilterField(oSettings, oParameters) {
			var oThis = new JSONModel({
					idPrefix: oParameters.sIdPrefix,
					vhIdPrefix: oParameters.sVhIdPrefix,
					propertyPath: oParameters.sPropertyName,
					navigationPrefix: oParameters.sNavigationPrefix ? "/" + oParameters.sNavigationPrefix : "",
					useSemanticDateRange: oParameters.bUseSemanticDateRange,
					settings: oParameters.oSettings
				}),
				oPreprocessorSettings = mergeObjects({}, oSettings, {
					bindingContexts: {
						"this": oThis.createBindingContext("/")
					},
					models: {
						"this": oThis
					}
				});

			return DelegateUtil.templateControlFragment("sap.fe.macros.FilterField", oPreprocessorSettings, {
				isXML: oSettings.isXML
			}).finally(function() {
				oThis.destroy();
			});
		}

		/**
		 * Method responsible for creating filter field in standalone / personalization filter bar.
		 *
		 * @param {string} sPropertyInfoName Name of the property being added as filter field
		 * @param {object} oParentControl Parent control instance to which the filter field is added
		 * @param {map} mPropertyBag Instance of property bag from Flex API
		 * @returns {Promise} once resolved, a filter field definition is returned
		 */
		ODataFilterBarDelegate.addItem = function(sPropertyInfoName, oParentControl, mPropertyBag) {
			if (!mPropertyBag) {
				// Invoked during runtime.
				return ODataFilterBarDelegate._addP13nItem(sPropertyInfoName, oParentControl);
			}

			var oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel();
			if (!oMetaModel) {
				return Promise.resolve(null);
			}

			return ODataFilterBarDelegate._addFlexItem(sPropertyInfoName, oParentControl, oMetaModel, mPropertyBag.modifier);
		};

		/**
		 * Responsible to create Filter field in Table adaptation FilterBar.
		 *
		 * @param {string} sPropertyInfoName Entity type property name for which the filter field needs to be created
		 * @param {object} oParentControl Instance of the parent control
		 * @returns {Promise} Once resolved a filter field definition is returned
		 */
		ODataFilterBarDelegate._addP13nItem = function(sPropertyInfoName, oParentControl) {
			return DelegateUtil.fetchModel(oParentControl)
				.then(function(oModel) {
					return ODataFilterBarDelegate._addFlexItem(sPropertyInfoName, oParentControl, oModel.getMetaModel(), undefined);
				})
				.catch(function(oError) {
					Log.error("Model could not be resolved", oError);
					return null;
				});
		};

		function _getFilterRestrictionsByPath(sEntitySetPath, oMetaModel) {
			var oRet = {},
				mEntitySetAnnotations = sEntitySetPath ? oMetaModel.getObject(sEntitySetPath + "@") : {},
				oFilterRestrictions = mEntitySetAnnotations && mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
			oRet[FilterRestrictions.REQUIRED_PROPERTIES] =
				DelegateUtil.getFilterRestrictions(oFilterRestrictions, FilterRestrictions.REQUIRED_PROPERTIES) || [];
			oRet[FilterRestrictions.NON_FILTERABLE_PROPERTIES] =
				DelegateUtil.getFilterRestrictions(oFilterRestrictions, FilterRestrictions.NON_FILTERABLE_PROPERTIES) || [];
			//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
			oRet[FilterRestrictions.ALLOWED_EXPRESSIONS] =
				DelegateUtil.getFilterRestrictions(oFilterRestrictions, FilterRestrictions.ALLOWED_EXPRESSIONS) || {};

			var aPathParts = sEntitySetPath.split("/");

			if (aPathParts.length > 2) {
				// In normal filterbar scenarios sEntitySetPath is of the format "/Customer".
				// But, In case of sEntitySetPath of format "/Customer/Set" this is to check navigation restrictions of "Customer" for non-filterable properties in "Set"
				var sNavigationPath = aPathParts[aPathParts.length - 1];
				aPathParts.splice(-1, 1); // removing NavigationProperty from the end.
				var sParentEntitySetPath = aPathParts.join("/");
				var oNavigationRestrictions = CommonUtils.getNavigationRestrictions(oMetaModel, sParentEntitySetPath, sNavigationPath);
				var oNavigationFilterRestrictions = oNavigationRestrictions && oNavigationRestrictions["FilterRestrictions"];
				oRet[FilterRestrictions.REQUIRED_PROPERTIES].concat(
					DelegateUtil.getFilterRestrictions(oNavigationFilterRestrictions, FilterRestrictions.REQUIRED_PROPERTIES) || []
				);
				oRet[FilterRestrictions.NON_FILTERABLE_PROPERTIES].concat(
					DelegateUtil.getFilterRestrictions(oNavigationFilterRestrictions, FilterRestrictions.NON_FILTERABLE_PROPERTIES) || []
				);
				//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
				oRet[FilterRestrictions.ALLOWED_EXPRESSIONS] = mergeObjects(
					{},
					DelegateUtil.getFilterRestrictions(oNavigationFilterRestrictions, FilterRestrictions.ALLOWED_EXPRESSIONS) || {},
					oRet[FilterRestrictions.ALLOWED_EXPRESSIONS]
				);
			}

			return oRet;
		}

		ODataFilterBarDelegate.fetchPropertiesForEntity = function(sEntityTypePath, oMetaModel, oFilterControl) {
			var oEntityType = oMetaModel.getObject(sEntityTypePath);
			if (!oFilterControl || !oEntityType) {
				return [];
			}
			var sEntitySetPath = ModelHelper.getEntitySetPath(sEntityTypePath),
				mFilterFields = FilterUtils.getConvertedFilterFields(oFilterControl, sEntityTypePath),
				oPropertyInfo,
				aFetchedProperties = [],
				oFR = _getFilterRestrictionsByPath(sEntitySetPath, oMetaModel),
				aRequiredProps = oFR[FilterRestrictions.REQUIRED_PROPERTIES],
				aNonFilterableProps = oFR[FilterRestrictions.NON_FILTERABLE_PROPERTIES],
				mAllowedExpressions = oFR[FilterRestrictions.ALLOWED_EXPRESSIONS];

			Object.keys(mFilterFields).forEach(function(sFilterFieldKey) {
				var oConvertedProperty = mFilterFields[sFilterFieldKey];
				var sPropertyPath = _getPropertyPath(oConvertedProperty.conditionPath);
				// TODO double check that this is obsolete, due to additional check in _fetchPropertyInfo (by calling CommonHelper.isPropertyFilterable)
				if (aNonFilterableProps.indexOf(sPropertyPath) === -1) {
					oPropertyInfo = _fetchPropertyInfo(oMetaModel, oConvertedProperty);
					if (oPropertyInfo) {
						if (mAllowedExpressions[sPropertyPath]) {
							oPropertyInfo.filterExpression = mAllowedExpressions[sPropertyPath];
						} else {
							oPropertyInfo.filterExpression = "auto"; // default
						}
						oPropertyInfo.maxConditions = DelegateUtil.isMultiValue(oPropertyInfo) ? -1 : 1;
						oPropertyInfo.required = aRequiredProps.indexOf(sPropertyPath) >= 0;
						oPropertyInfo.visible = oConvertedProperty.availability === "Default";
						oPropertyInfo.label = DelegateUtil.getLocalizedText(oConvertedProperty.label, oFilterControl);
						aFetchedProperties.push(oPropertyInfo);
					}
				}
			});

			if (oFilterControl.data("showDraftEditState")) {
				aFetchedProperties.push(_getEditStateFilterPropertyInfo());
			}

			if (
				sEntitySetPath &&
				FilterBarHelper.checkIfBasicSearchIsVisible(
					oFilterControl.data("hideBasicSearch") === "true",
					oMetaModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.SearchRestrictions")
				)
			) {
				aFetchedProperties.push(_getSearchFilterPropertyInfo());
			}
			return aFetchedProperties;
		};

		ODataFilterBarDelegate._addFlexItem = function(sFlexPropertyName, oParentControl, oMetaModel, oModifier) {
			var sFilterBarId = oModifier ? oModifier.getId(oParentControl) : oParentControl.getId(),
				sIdPrefix = oModifier ? "" : "Adaptation",
				aSelectionFields = FilterUtils.getConvertedFilterFields(oParentControl),
				oSelectionField = _findSelectionField(aSelectionFields, sFlexPropertyName),
				sPropertyPath = _getPropertyPath(sFlexPropertyName),
				bIsXML = !!oModifier && oModifier.targets === "xmlTree";
			if (sFlexPropertyName === EDIT_STATE_PROPERTY_NAME) {
				return _templateEditState(sFilterBarId, oModifier);
			} else if (sFlexPropertyName === SEARCH_PROPERTY_NAME) {
				return Promise.resolve(null);
			} else if (oSelectionField && oSelectionField.template) {
				return _templateCustomFilter(
					oParentControl,
					_generateIdPrefix(sFilterBarId, sIdPrefix + "FilterField"),
					oSelectionField,
					oMetaModel,
					oModifier
				);
			}

			var sNavigationPath = CommonHelper.getNavigationPath(sPropertyPath),
				sEntityTypePath = DelegateUtil.getCustomData(oParentControl, "entityType", oModifier),
				oPropertyContext = oMetaModel.createBindingContext(sEntityTypePath + sPropertyPath),
				sFilterBarId = oModifier ? oModifier.getId(oParentControl) : oParentControl.getId(),
				oSettings = {
					bindingContexts: {
						"entityType": oMetaModel.createBindingContext(sEntityTypePath),
						"property": oPropertyContext
					},
					models: {
						"entityType": oMetaModel,
						"property": oMetaModel
					},
					isXML: bIsXML
				},
				oParameters = {
					sPropertyName: sPropertyPath,
					sBindingPath: ModelHelper.getEntitySetPath(sEntityTypePath),
					sValueHelpType: VALUE_HELP_TYPE,
					oControl: oParentControl,
					oMetaModel: oMetaModel,
					oModifier: oModifier,
					sIdPrefix: _generateIdPrefix(sFilterBarId, sIdPrefix + "FilterField", sNavigationPath),
					sVhIdPrefix: _generateIdPrefix(sFilterBarId, sIdPrefix + VALUE_HELP_TYPE, sNavigationPath),
					sNavigationPrefix: sNavigationPath,
					sValueHelpGroupId: DelegateUtil.getCustomData(oParentControl, "valueHelpRequestGroupId", oModifier),
					bUseSemanticDateRange: DelegateUtil.getCustomData(oParentControl, "useSemanticDateRange", oModifier),
					oSettings: oSelectionField ? oSelectionField.settings : {}
				};

			return DelegateUtil.doesValueHelpExist(oParameters)
				.then(function(bValueHelpExists) {
					if (!bValueHelpExists) {
						return _templateValueHelp(oSettings, oParameters);
					}
					return Promise.resolve();
				})
				.then(_templateFilterField.bind(undefined, oSettings, oParameters));
		};

		function _getCachedProperties(oFilterBar) {
			// properties are not cached during templating
			if (oFilterBar instanceof window.Element) {
				return null;
			}
			return DelegateUtil.getCustomData(oFilterBar, FETCHED_PROPERTIES_DATA_KEY);
		}

		function _setCachedProperties(oFilterBar, aFetchedProperties) {
			// do not cache during templating, else it becomes part of the cached view
			if (oFilterBar instanceof window.Element) {
				return;
			}
			DelegateUtil.setCustomData(oFilterBar, FETCHED_PROPERTIES_DATA_KEY, aFetchedProperties);
		}

		function _getCachedOrFetchPropertiesForEntity(sEntityTypePath, oMetaModel, oFilterBar) {
			var aFetchedProperties = _getCachedProperties(oFilterBar);

			if (!aFetchedProperties) {
				aFetchedProperties = ODataFilterBarDelegate.fetchPropertiesForEntity(sEntityTypePath, oMetaModel, oFilterBar);
				aFetchedProperties.sort(function(a, b) {
					if (a.groupLabel === undefined || a.groupLabel === null) {
						return -1;
					}
					if (b.groupLabel === undefined || b.groupLabel === null) {
						return 1;
					}
					return a.groupLabel.localeCompare(b.groupLabel);
				});
				_setCachedProperties(oFilterBar, aFetchedProperties);
			}
			return aFetchedProperties;
		}

		/**
		 * Fetches the relevant metadata for the filter bar and returns property info array.
		 * @param {sap.ui.mdc.FilterBar} oFilterBar - the instance of filter bar
		 * @returns {Promise} once resolved an array of property info is returned
		 */
		ODataFilterBarDelegate.fetchProperties = function(oFilterBar) {
			var sEntityTypePath = DelegateUtil.getCustomData(oFilterBar, "entityType");
			return DelegateUtil.fetchModel(oFilterBar).then(function(oModel) {
				if (!oModel) {
					return [];
				}
				return _getCachedOrFetchPropertiesForEntity(sEntityTypePath, oModel.getMetaModel(), oFilterBar);
			});
		};

		ODataFilterBarDelegate.getTypeUtil = function(oPayload) {
			return TypeUtil;
		};

		return ODataFilterBarDelegate;
	},
	/* bExport= */ false
);
