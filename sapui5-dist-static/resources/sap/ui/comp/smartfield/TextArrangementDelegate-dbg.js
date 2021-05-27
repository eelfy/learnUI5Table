/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/base/assert"
], function(
	compLibrary,
	BaseObject,
	Filter,
	FilterOperator,
	assert
) {
	"use strict";

	var TextInEditModeSource = compLibrary.smartfield.TextInEditModeSource;

	var TextArrangementDelegate = BaseObject.extend("sap.ui.comp.smartfield.TextArrangementDelegate", /** @lends sap.ui.comp.smartfield.TextArrangementDelegate.prototype */ {
		constructor: function(oFactory) {
			BaseObject.apply(this, arguments);
			this.oTextArrangementType = null;
			this.oFactory = oFactory;
			this.oSmartField = oFactory._oParent;
			this.bValidMetadata = false;
			this.sBindingContextPath = "";
		}
	});

	TextArrangementDelegate.prototype.setValue = function(sValue, sOldValue) {
		var oSmartField = this.oSmartField,
			oControl = oSmartField._oControl;

		// In edit mode, if the textInEditModeSource property is set to TextInEditModeSource.NavigationProperty or
		// to TextInEditModeSource.ValueList, a composite binding is used for the hosted inner control (usually a sap.m.Input).
		// So, calling .setValue() on the SmartField control, would not update all model properties of the hosted inner
		// control.
		if (this.bValidMetadata && (sValue !== sOldValue) && oControl) {
			var oInnerControl = oControl[oControl.current],
				oBinding = oInnerControl && oInnerControl.getBinding("value");

			if (!oBinding) {
				return;
			}

			// This bModelUpdate flag indicates whether the .setValue() mutator method is called by the framework
			// due to a property binding change e.g.: by calling .updateProperty("value")
			var bModelUpdate = oSmartField.isPropertyBeingUpdatedByModel("value");

			switch (oSmartField._getComputedTextInEditModeSource()) {
				case TextInEditModeSource.NavigationProperty:
					var bDescriptionForValueLoaded = !!oSmartField.getModel().getData(oBinding.getBindings()[1].getPath(), oSmartField.getBindingContext(), true);

					if ((bModelUpdate && !bDescriptionForValueLoaded) || !bModelUpdate) {
						oInnerControl.setValue(sValue);
					}

					return;

				case TextInEditModeSource.ValueList:
				case TextInEditModeSource.ValueListNoValidation:
					if (!bModelUpdate) {
						oInnerControl.setValue(sValue);
					} else if (
						// Last value for which text arrangement request was made is not the same as the new one
						this.oTextArrangementType && this.oTextArrangementType._sTextArrangementLastReadValue !== sValue
					) {
						// Upon model update we might need to update the text arrangement
						this.fetchIDAndDescriptionCollectionIfRequired();
					}

					return;

				// no default
			}
		}
	};

	TextArrangementDelegate.getPaths = function(sTextInEditModeSource, oMetadata) {
		var oValueListAnnotation = oMetadata.property && oMetadata.property.valueListAnnotation;

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.NavigationProperty:
				var oNavigationPropertyMetadata = oMetadata.annotations.text;

				if (!oNavigationPropertyMetadata) {
					return {};
				}

				return {
					keyField: oNavigationPropertyMetadata.entityType.key.propertyRef[0].name,
					descriptionField: oNavigationPropertyMetadata.property.typePath,
					entitySetName: oNavigationPropertyMetadata.entitySet.name
				};

			case TextInEditModeSource.ValueList:
				if (!oValueListAnnotation) {
					return {};
				}

				return {
					keyField: oValueListAnnotation.keyField,
					descriptionField: oValueListAnnotation.descriptionField,
					entitySetName: oMetadata.property.valueListEntitySet && oMetadata.property.valueListEntitySet.name
				};
			case TextInEditModeSource.ValueListNoValidation:
				if (!oValueListAnnotation) {
					return {};
				}

				return {
					valueListNoValidation: true,
					keyField: oValueListAnnotation.keyField,
					descriptionField: oValueListAnnotation.descriptionField,
					entitySetName: oMetadata.property.valueListEntitySet.name
				};

			// no default
		}
	};

	TextArrangementDelegate.prototype.getBindingInfo = function(oSettings) {
		var	oBindSettings,
			bValueListNoValidation = oSettings.valueListNoValidation,
			oFormatOptions = {},
			oSmartField = this.oSmartField,
			oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		this.oTextArrangementType = oSettings && oSettings.type;

		if (!this.oTextArrangementType) {
			var oBindingInfo = oSmartField.getBindingInfo("value");
			this.oTextArrangementType = (oBindingInfo && oBindingInfo.type) || {};
			var mTextArrangementBindingPaths = TextArrangementDelegate.getPaths(
				oFactory._bTextInDisplayModeValueList ? TextInEditModeSource.ValueList : oSmartField._getComputedTextInEditModeSource(),
				oMetadata
			);

			this.oTextArrangementType = oFactory._oTypes.getType(oMetadata.property, Object.assign(oFormatOptions, this.oTextArrangementType.oFormatOptions), this.oTextArrangementType.oConstraints, {
				composite: true,
				keyField: mTextArrangementBindingPaths.keyField,
				descriptionField: mTextArrangementBindingPaths.descriptionField,
				valueListNoValidation: bValueListNoValidation
			});

			this.oStringType = oFactory._oTypes.getType(oMetadata.property, Object.assign(oFormatOptions, this.oTextArrangementType.oFormatOptions), this.oTextArrangementType.oConstraints);
		}

		var sTextAnnotationPropertyPath = this.getTextAnnotationPropertyPath();

		// BCP: 1970338535 - Special case where we can't calculate the description binding path so we have to use
		// not existing one to prevent issues having an empty binding path.
		if (sTextAnnotationPropertyPath === "" || sTextAnnotationPropertyPath.indexOf("undefined") !== -1) {
			sTextAnnotationPropertyPath = "__$$SmartFieldNotExistingBindingPath";
		}

		// The Core layer will raise an error
		// if oTextArrangementType is not composite and we pass bind setting with "parts" property
		if (oSettings.skipValidation || !this.oTextArrangementType.isA("sap.ui.model.CompositeType")) {
			oBindSettings = {
				model: oMetadata.model,
				type: this.oStringType,
				path: oMetadata.path
			};
		} else {
			oBindSettings = {
				model: oMetadata.model,
				type: this.oTextArrangementType,
				parts: [
					{
						path: oMetadata.path
					},
					{
						path: sTextAnnotationPropertyPath
					}
				]
			};
		}

		return oBindSettings;
	};

	TextArrangementDelegate.prototype.getTextAnnotationPropertyPath = function(oSettings) {
		oSettings = oSettings || {};
		var sTextInEditModeSource = oSettings.textInEditModeSource || this.oSmartField._getComputedTextInEditModeSource(),
			oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		if (oFactory._bTextInDisplayModeValueList) {
			// In this scenario we always revert to ValueList
			sTextInEditModeSource = TextInEditModeSource.ValueList;
		}

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.NavigationProperty:
				var oTextAnnotation = oSettings.textAnnotation || oMetadata.annotations.text;
				return oFactory._oHelper.getTextAnnotationPropertyPath(oTextAnnotation);

			case TextInEditModeSource.ValueList:
				var oEdmValueListKeyProperty = oSettings.edmValueListKeyProperty || oMetadata.property.valueListKeyProperty,
					sBindingContextPath = oSettings.bindingContextPath || this.sBindingContextPath;

				// return the absolute path to the value list entity property e.g.: /VL_SH_H_CATEGORY('PR')/LTXT
				return oFactory._oHelper.getAbsolutePropertyPathToValueListEntity({
					property: oEdmValueListKeyProperty,
					bindingContextPath: sBindingContextPath
				});
			case TextInEditModeSource.ValueListNoValidation:
				var oEdmValueListKeyProperty = oSettings && oSettings.edmValueListKeyProperty || oMetadata.property.valueListKeyProperty,
				sBindingContextPath = oSettings && oSettings.bindingContextPath || this.sBindingContextPath,
				oTextAnnotation = oSettings && oSettings.textAnnotation || oMetadata && oMetadata.annotations && oMetadata.annotations.text;
				var bNewValue = this.oSmartField && this.oSmartField.getBinding("value") && this.oSmartField.getBinding("value").vOriginalValue !== this.oSmartField.getBinding("value").getValue();

				if (oTextAnnotation && sBindingContextPath !== "/undefined" && !bNewValue) {
					var  sTextAnnotationPath = oFactory._oHelper.getTextAnnotationPropertyPath(oTextAnnotation);
					if (sTextAnnotationPath && sTextAnnotationPath !== this.oFactory.getMetaData().path) {
						return sTextAnnotationPath;
					}
				}
				// return the absolute path to the value list entity property e.g.: /VL_SH_H_CATEGORY('PR')/LTXT
				return oFactory._oHelper.getAbsolutePropertyPathToValueListEntity({
					property: oEdmValueListKeyProperty,
					bindingContextPath: sBindingContextPath
				});

			case TextInEditModeSource.None:
				return "";
			default:
				return "";
		}
	};

	TextArrangementDelegate.prototype.checkRequiredMetadata = function(sTextInEditModeSource, bSuppressErrors) {
		var oFactory = this.oFactory,
			oMetadata = oFactory._oMetaData;

		switch (sTextInEditModeSource) {
			case TextInEditModeSource.None:
				return false;

			case TextInEditModeSource.NavigationProperty:
				var oNavigationPropertyMetadata = oMetadata.annotations.text,
					oEntityTypeOfNavigationProperty;

				if (oNavigationPropertyMetadata) {
					oEntityTypeOfNavigationProperty = oNavigationPropertyMetadata.entityType;
				}

				var oCheckNavigationPropertyMetadata = {
					propertyName: oMetadata.property && oMetadata.property.property && oMetadata.property.property.name,
					entityType: oMetadata.entityType,
					entityTypeOfNavigationProperty: oEntityTypeOfNavigationProperty,
					textAnnotation: oMetadata.property && oMetadata.property.property && oMetadata.property.property["com.sap.vocabularies.Common.v1.Text"]
				};

				if (bSuppressErrors) {
					return oFactory._oHelper.checkNavigationPropertyRequiredMetadataNoAsserts(oCheckNavigationPropertyMetadata);
				} else {
					return oFactory._oHelper.checkNavigationPropertyRequiredMetadata(oCheckNavigationPropertyMetadata);
				}
				break;
			case TextInEditModeSource.ValueList:
			case TextInEditModeSource.ValueListNoValidation:
				var oValueListMetadata = {
					propertyName: oMetadata.property && oMetadata.property.property && oMetadata.property.property.name,
					entityType: oMetadata.entityType,
					valueListAnnotation: oMetadata.property && oMetadata.property.valueListAnnotation
				};

				if (bSuppressErrors) {
					return oFactory._oHelper.checkValueListRequiredMetadataForTextArrangmentNoAsserts(oValueListMetadata);
				} else {
					return oFactory._oHelper.checkValueListRequiredMetadataForTextArrangment(oValueListMetadata);
				}
				break;
			default:
				return false;
		 }
	};

	TextArrangementDelegate.prototype.onBeforeValidateValue = function(sValue, oSettings) {
		var oSmartField = this.oSmartField;

		// Prevent unnecessary requests to be sent and validation errors to be displayed,
		// if the binding context is not set
		if (!oSmartField.getBindingContext()) { // note: the binding context can be null or undefined
			return;
		}

		var fnOnFetchSuccess = this.onFetchIDAndDescriptionCollectionSuccess.bind(this, {
			success: oSettings.success
		});

		var fnOnFetchError = this.onFetchIDAndDescriptionCollectionError.bind(this, {
			error: oSettings.error
		});

		var oFetchSettings = {
			value: sValue,
			success: fnOnFetchSuccess,
			error: fnOnFetchError,
			filterFields: oSettings.filterFields,
			bCheckValuesValidity: oSettings.bCheckValuesValidity
		};

		this.fetchIDAndDescriptionCollection(oFetchSettings);
		var oInputField = oSmartField._oControl.edit;

		if (oInputField && sValue) {
			oInputField.setBusyIndicatorDelay(300);
			oInputField.setBusy(true);
		}
	};

	TextArrangementDelegate.prototype.fetchIDAndDescriptionCollectionIfRequired = function() {
		var oSmartField = this.oSmartField;
		var sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource();
		var oMetaData = this.oFactory && this.oFactory.getMetaData();
		var oTextAnnotation = oMetaData && oMetaData.annotations && oMetaData.annotations.text;
		var bNewValue = this.oSmartField && this.oSmartField.getBinding("value") && this.oSmartField.getBinding("value").vOriginalValue !== this.oSmartField.getBinding("value").getValue();

		if (oTextAnnotation && ((oMetaData && oTextAnnotation.path === oMetaData.path) || this.sBindingContextPath === "/undefined" || bNewValue)) {
			oTextAnnotation = null;
		}

		if (sTextInEditModeSource === TextInEditModeSource.ValueList || (!oTextAnnotation && sTextInEditModeSource === TextInEditModeSource.ValueListNoValidation && this.oFactory._getDisplayBehaviourConfiguration() !== "idOnly" ) ||
			this.oFactory._bTextInDisplayModeValueList
		) {
			var INNER_CONTROL_VALUE_PROP_MAP = "value",
				vValue = oSmartField.getBinding(INNER_CONTROL_VALUE_PROP_MAP).getValue(),
				bUndefinedOrEmptyValue = (vValue == null) || (vValue === "");

			if (!bUndefinedOrEmptyValue) {
				var aFilterFields = ["keyField"];

				var oSuccessSettings = {
					value: vValue,
					oldValue: vValue,
					updateBusyIndicator: false,
					initialRendering: true
				};

				this.fetchIDAndDescriptionCollection({
					value: vValue,
					filterFields: aFilterFields,
					success: this.onFetchIDAndDescriptionCollectionSuccess.bind(this, oSuccessSettings)
				});
			}
		}
	};

	TextArrangementDelegate.prototype.fetchIDAndDescriptionCollection = function(oSettings) {
		var vValue = oSettings.value;

		// whether the variable vValue is null or undefined or "" (empty)
		if ((vValue == null) || (vValue === "")) {
			return;
		}

		if (oSettings.bCheckValuesValidity) {
			oSettings.filterFields = ["keyField"];
		}

		this.readODataModel(oSettings);
	};

	TextArrangementDelegate.prototype.readODataModel = function(oSettings) {
		var oSmartField = this.oSmartField,
			sFieldName,
			oAdditionalFilters,
			sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource(),
			oMetadata = oSmartField.getControlFactory().getMetaData(),
			mTextArrangementPaths = TextArrangementDelegate.getPaths(
				this.oFactory._bTextInDisplayModeValueList ? TextInEditModeSource.ValueList : sTextInEditModeSource,
				oMetadata
			),
			sKeyField = mTextArrangementPaths.keyField,
			sDescriptionField = mTextArrangementPaths.descriptionField;

		// BCP: 2080185890 If we cannot derive the description field we skip making the backend request as it would fail
		if (!sDescriptionField) {
			return;
		}

		oAdditionalFilters = this.getAdditionalFiltersData(oSmartField, oMetadata);

		var oFiltersSettings = {
			keyFieldPath: sKeyField,
			descriptionFieldPath: sDescriptionField,
			aFilterFields: oSettings.filterFields
		};

		for (sFieldName in oAdditionalFilters) {
			oSettings.filterFields.push(sFieldName);
			oFiltersSettings[sFieldName] = oAdditionalFilters[sFieldName];
		}

		if (this.oTextArrangementType) {
			this.oTextArrangementType._sTextArrangementLastReadValue = oSettings.value;
		}

		var aFilters = this.getFilters(oSettings.value, oFiltersSettings);

		var mUrlParameters = {
			"$select": sKeyField + "," + sDescriptionField,
			"$top": 2
		};

		var sPath = "/" + mTextArrangementPaths.entitySetName;

		var oDataModelReadSettings = {
			filters: aFilters,
			urlParameters: mUrlParameters,
			success: oSettings.success,
			error: oSettings.error
		};

		var oODataModel = oSmartField.getModel();
		oODataModel.read(sPath, oDataModelReadSettings);
	};

	TextArrangementDelegate.prototype.getAdditionalFiltersData = function(oSmartField, oData) {
		var mConstParams,
			mInParams,
			sConstFieldName,
			sInFieldName,
			sValueListFieldName,
			oAdditionalFilters = {};

		if (oData && oData.annotations && oData.annotations.valueListData) {
			mInParams = oData.annotations.valueListData.inParams;
			mConstParams = oData.annotations.valueListData.constParams;
		}

		if (mConstParams) {
			for (sConstFieldName in mConstParams) {
				oAdditionalFilters[sConstFieldName] = mConstParams[sConstFieldName];
			}
		}

		if (mInParams) {
			for (sInFieldName in mInParams) {
				sValueListFieldName = mInParams[sInFieldName];
				if (sValueListFieldName !== oData.annotations.valueListData.keyField) {
					oAdditionalFilters[sValueListFieldName] = oSmartField.getBindingContext().getProperty(sInFieldName);
				}
			}
		}

		return oAdditionalFilters;
	};

	TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionSuccess = function(oSettings, oData, oResponse) {
		oSettings = Object.assign({ updateBusyIndicator: true }, oSettings);

		// If the SmartField control is destroyed before this async callback is invoked.
		if (!this.oSmartField) {
			return;
		}

		var oSmartField = this.oSmartField,
			oInputField = oSmartField._oControl.edit,
			oInputFieldBinding = oInputField && oInputField.getBinding("value"),
			oDisplayControl = oSmartField._oControl.display;

		if (oInputFieldBinding && oSettings.updateBusyIndicator) {

			// restore the busy and busy indicator delay states to the initial value
			oInputField.setBusyIndicatorDelay(0);
			oInputField.setBusy(false);
		}

		if (typeof oSettings.success === "function") {
			oSettings.success(oData.results);
		}

		var setBindingPath = function(oSmartField, oData, sBindingProperty, oBindingControl) {
			var oODataModel = oSmartField.getModel(),
				bValueListNoValidation = oSmartField.getTextInEditModeSource() === "ValueListNoValidation" || oSmartField._getComputedTextInEditModeSource() === "ValueListNoValidation";
				assert(Array.isArray(oData.results), " - " + this.getMetadata().getName());
			if (oODataModel) {
				var vBindingContextPath = oODataModel.getKey(oData.results[0]);

				if (bValueListNoValidation && oData.results.length !== 1){
					this.sBindingContextPath = "/" + vBindingContextPath;
					this.bindPropertyForValueList(sBindingProperty, oBindingControl, true);
				} else if (typeof vBindingContextPath === "string") {
					this.sBindingContextPath = "/" + vBindingContextPath;
					this.bindPropertyForValueList(sBindingProperty, oBindingControl, false, bValueListNoValidation);
				}
			}
		};

		if (oSmartField.getMode() === "display") {
			var updateDisplayDescriptionBindingPath = function() {
				setBindingPath.call(this, oSmartField, oData, "text", oDisplayControl);
			};

			if (oSettings.initialRendering) {
				updateDisplayDescriptionBindingPath.call(this);
			}

		}

		if (
			oInputFieldBinding &&
			oSmartField.getMode() === "edit" &&
			oSmartField.isTextInEditModeSourceNotNone() // From display to edit mode with textInEditModeSource:None -> we should skip
		) {
			var updateDescriptionBindingPath = function() {
				setBindingPath.call(this, oSmartField, oData, "value", oInputField);
			};

			updateDescriptionBindingPath.call(this);
		}
	};

	TextArrangementDelegate.prototype.onFetchIDAndDescriptionCollectionError = function(oSettings, oError) {
		var oInputField = this.oSmartField._oControl.edit;

		if (oInputField) {

			// restore the busy and busy indicator delay states to the initial value
			oInputField.setBusyIndicatorDelay(0);
			oInputField.setBusy(false);
		}

		if (typeof oSettings.error === "function") {
			oSettings.error(oError);
		}
	};

	TextArrangementDelegate.prototype.bindPropertyForValueList = function(sProperty, oInputField, bSkipValidation, bValueListNoValidation) {
		var oSmartField = this.oSmartField,
			oSettings = {},
			oTextArrangementType,
			oBinding,
			oType,
			sTextInEditModeSource = oSmartField._getComputedTextInEditModeSource();

		if (
			sTextInEditModeSource === TextInEditModeSource.ValueList || sTextInEditModeSource === TextInEditModeSource.ValueListNoValidation ||
			this.oFactory._bTextInDisplayModeValueList
		) {
			oBinding = oInputField && oInputField.getBinding(sProperty);

			if (this.oFactory && oBinding) {
				oType = oBinding.getType();

				// In case improper type is set earlier - try to get the correct one
				if (
					(
						!oType || // We don't have no type
						!oType.isA("sap.ui.comp.smartfield.type.TextArrangement") // Or type is not TextArrangement type
					) &&
					this.oFactory._getTextArrangementType
				) {
					oTextArrangementType = this.oFactory._getTextArrangementType();
					if (oTextArrangementType) {
						oType = oTextArrangementType;
					}
				}

				if (oType) {
					oSettings = {type: oType};
				}

				oSettings.skipValidation = bSkipValidation;
				oSettings.bValueListNoValidation = bValueListNoValidation;
				oInputField.bindProperty(sProperty, this.getBindingInfo(oSettings));
			}
		}
	};

	TextArrangementDelegate.prototype.getFilters = function(vValue, oSettings) {
		this.destroyFilters();
		var aFilterFields = oSettings.aFilterFields,
			oAdditionalParamFilters;

		if (aFilterFields.length === 1) {

			switch (aFilterFields[0]) {
				case "keyField":
					this.oIDFilter = getIDFilter(vValue, oSettings);
					return [this.oIDFilter];

				case "descriptionField":
					this.oDescriptionFilter = getDescriptionFilter(vValue, oSettings);
					return [this.oDescriptionFilter];

				// no default
			}
		}

		this.oIDFilter = getIDFilter(vValue, oSettings);
		oAdditionalParamFilters = getAdditionalFilters(oSettings);

		this.oFilters = new Filter({
			and: true,
			filters: [
				new Filter({
					and:false,
					filters: [
						this.oIDFilter
					]
				})
			]
		});

		if (oAdditionalParamFilters.aFilters.length > 0) {
			this.oFilters.aFilters.push(oAdditionalParamFilters);
		}

		return [ this.oFilters ];
	};

	function getIDFilter(vValue, oSettings) {
		return new Filter({
			value1: vValue,
			path: oSettings.keyFieldPath,
			operator: FilterOperator.EQ
		});
	}

	 function getDescriptionFilter(vValue, oSettings) {
		return new Filter({
			value1: vValue,
			path: oSettings.descriptionFieldPath,
			operator: FilterOperator.Contains
		});
	}

	function getAdditionalFilters(oSettings) {
		var sFieldName,
			aFilters = [],
			i;

		for (sFieldName in oSettings) {
			for (i = 0; i < oSettings.aFilterFields.length; i++) {
				if (oSettings.aFilterFields[i] == sFieldName) {
					aFilters.push(new Filter({
						value1: oSettings[sFieldName],
						path: sFieldName,
						operator: FilterOperator.EQ
					}));
				}
			}
		}

		return new Filter({
			and: true,
			filters: aFilters
		});
	}

	TextArrangementDelegate.prototype.destroyFilters = function() {

		if (this.oIDFilter) {
			this.oIDFilter.destroy();
			this.oIDFilter = null;
		}

		if (this.oDescriptionFilter) {
			this.oDescriptionFilter.destroy();
			this.oDescriptionFilter = null;
		}

		if (this.oFilters) {
			this.oFilters.destroy();
			this.oFilters = null;
		}
	};

	TextArrangementDelegate.prototype.destroy = function() {
		this.oSmartField = null;
		this.bValidMetadata = false;
		this.sBindingContextPath = "";
		this.destroyFilters();
	};

	return TextArrangementDelegate;
});
