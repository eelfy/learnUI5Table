/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/core/util/PasteHelper", "sap/m/MessageBox"], function(CorePasteHelper, MessageBox) {
	"use strict";

	var _createColumnInfoPerProperty = function(sPropertyPath, sRowBindingPath, oMetaContext, oMetaModel) {
		var oProperty = oMetaContext.getProperty(sPropertyPath),
			mFormatOptions = { parseKeepsEmptyString: true },
			oType = oMetaModel.getUI5Type(sRowBindingPath + "/" + sPropertyPath, mFormatOptions),
			bIgnore = !oProperty || oMetaContext.getProperty(sPropertyPath + "@Org.OData.Core.V1.Computed");
		return {
			property: sPropertyPath,
			ignore: bIgnore,
			type: oType
		};
	};

	var _getColumnInfoForPaste = function(oTable) {
		var oModel = oTable.getRowBinding().getModel(),
			oMetaModel = oModel.getMetaModel(),
			sRowBindingPath = oModel.resolve(oTable.getRowBinding().getPath(), oTable.getRowBinding().getContext()),
			oMetaContext = oMetaModel.getMetaContext(sRowBindingPath);
		return oTable
			.getControlDelegate()
			.fetchProperties(oTable)
			.then(function(aPropertyInfo) {
				var aColumnInfos = [];
				oTable.getColumns().forEach(function(oColumn) {
					var oInfoProperty = aPropertyInfo.find(function(property) {
						return property.name === oColumn.getDataProperty();
					});
					// Check if it's a complex property (property associated to multiple simple properties)
					if (oInfoProperty.propertyInfos) {
						oInfoProperty.propertyInfos.forEach(function(property) {
							// Get data from simple property
							var oDataProperty = aPropertyInfo.find(function(prop) {
								return prop.name === property;
							});

							// Check if there is a simple property associated to a Rating or Progress ComplexProperty --> ignore
							// Or check a navigation property within the current Complex property --> ignore
							// A fake property was created into the propertyInfos to include the Target Value
							// from the DataPoint (path includes the @com.sap.vocabularies.UI.v1.DataPoint annotation)
							if (
								(oDataProperty && oDataProperty.path.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1) ||
								property.indexOf("/") > -1
							) {
								aColumnInfos.push({
									property: oDataProperty.path,
									ignore: true
								});
							} else {
								aColumnInfos.push(
									_createColumnInfoPerProperty(oDataProperty.path, sRowBindingPath, oMetaContext, oMetaModel)
								);
							}
						});
					} else if (oInfoProperty.path) {
						aColumnInfos.push(_createColumnInfoPerProperty(oInfoProperty.path, sRowBindingPath, oMetaContext, oMetaModel));
					} else {
						// Empty column --> ignore
						aColumnInfos.push({
							property: "unused",
							type: null,
							ignore: true
						});
					}
				});
				return aColumnInfos;
			});
	};

	var oPasteHelper = {
		parseDataForTablePaste: function(aRawData, oTable) {
			return _getColumnInfoForPaste(oTable).then(function(oPasteInfos) {
				// Check if we have data for at least the first editable column
				var iPastedColumnCount = aRawData.length ? aRawData[0].length : 0;
				var iFirstEditableColumn = -1;
				for (var I = 0; I < oPasteInfos.length && iFirstEditableColumn < 0; I++) {
					if (!oPasteInfos[I].ignore) {
						iFirstEditableColumn = I;
					}
				}
				if (iFirstEditableColumn < 0 || iFirstEditableColumn > iPastedColumnCount - 1) {
					// We don't have data for an editable column --> return empty parsed data
					return Promise.resolve([]);
				} else {
					return CorePasteHelper.parse(aRawData, oPasteInfos).then(function(oParseResult) {
						if (oParseResult.errors) {
							var aErrorMessages = oParseResult.errors.map(function(oElement) {
								return oElement.message;
							});

							var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
								sPasteError,
								sErrorCorrection = oResourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_CORRECTION_MESSAGE"),
								sNote = oResourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_CORRECTION_NOTE");

							if (aErrorMessages.length > 1) {
								sPasteError = oResourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_MESSAGE_PLURAL", [
									aErrorMessages.length
								]);
							} else {
								sPasteError = oResourceBundle.getText("C_PASTE_HELPER_SAPFE_PASTE_ERROR_MESSAGE_SINGULAR");
							}
							aErrorMessages.unshift(""); // To show space between the short text and the list of errors
							aErrorMessages.unshift(sNote);
							aErrorMessages.unshift(sErrorCorrection);
							MessageBox.error(sPasteError, {
								icon: MessageBox.Icon.ERROR,
								title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_TITLE_ERROR"),
								details: aErrorMessages.join("<br>")
							});

							return []; // Errors --> return nothing
						} else {
							return oParseResult.parsedData ? oParseResult.parsedData : [];
						}
					});
				}
			});
		}
	};

	return oPasteHelper;
});
