/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/fe/core/converters/ConverterContext", "sap/base/util/merge", "sap/base/util/uid"], function(
	ConverterContext,
	merge,
	uid
) {
	"use strict";
	var fnGetOverrides = function(mControlConfiguration, sID) {
		var oProps = {};
		if (mControlConfiguration) {
			var oControlConfig = mControlConfiguration[sID];
			if (oControlConfig) {
				Object.keys(oControlConfig).forEach(function(sConfigKey) {
					oProps[sConfigKey] = oControlConfig[sConfigKey];
				});
			}
		}
		return oProps;
	};
	var fnSetDefaultValue = function(oProps, sPropName, oOverrideValue) {
		if (oProps[sPropName] === undefined) {
			oProps[sPropName] = oOverrideValue;
		}
	};
	var MacroMetadata = {
		metadata: {
			properties: {
				_flexId: {
					type: "string"
				}
			}
		},
		extend: function(fnName, oContent) {
			oContent.metadata.properties._flexId = MacroMetadata.metadata.properties._flexId;
			oContent.hasValidation = true;
			oContent.getOverrides = fnGetOverrides.bind(oContent);
			oContent.setDefaultValue = fnSetDefaultValue.bind(oContent);
			oContent.getConverterContext = function(oVisualizationObjectPath, contextPath, mSettings) {
				var oAppComponent = mSettings.appComponent;
				var viewData = mSettings.models.viewData && mSettings.models.viewData.getData();
				var oConverterContext = ConverterContext.createConverterContextForMacro(
					oVisualizationObjectPath.startingEntitySet.name,
					mSettings.models.metaModel,
					viewData.converterType,
					oAppComponent && oAppComponent.getShellServices(),
					oAppComponent && oAppComponent.getDiagnostics(),
					merge,
					oVisualizationObjectPath.contextLocation,
					viewData
				);
				return oConverterContext;
			};
			oContent.createBindingContext = function(oData, mSettings) {
				var sContextPath = "/" + uid();
				mSettings.models.converterContext.setProperty(sContextPath, oData);
				return mSettings.models.converterContext.createBindingContext(sContextPath);
			};
			return oContent;
		}
	};
	return MacroMetadata;
});
