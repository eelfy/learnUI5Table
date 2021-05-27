/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/base/util/merge',
	"sap/base/Log"
], function(merge, Log) {
	"use strict";
	/**
	 * Change handler for handling the variant content handling
	 *
	 * @constructor
	 * @private
	 * @since 1.87
	 * @alias sap.ui.comp.smartvariants.flexibility.changes.VariantContent
	 */
	var VariantContent = {};
	VariantContent.applyChange = function(oChange, oVariantManagement, mPropertyBag) {
		var oChangeContent = oChange.getContent();
		if (!oChangeContent) {
			Log.error("Change does not contain sufficient information to be applied");
			return;
		}
		if (oVariantManagement.isA("sap.ui.comp.smartvariants.SmartVariantManagement")) {
			var oRevertData = {};
			var oCurrentContent = oVariantManagement._getVariantContent(oChangeContent.key);
			if (oVariantManagement.isPageVariant()) {
				oRevertData.content = oCurrentContent && oCurrentContent[oChangeContent.persistencyKey];
			} else {
				oRevertData.content = oCurrentContent;
			}
			oRevertData.key = oChangeContent.key;
			oRevertData.persistencyKey = oChangeContent.persistencyKey;
			oChange.setRevertData(oRevertData);
			if ((oVariantManagement.getSelectionKey() === oChangeContent.key)) {
				var oControlContent = {};
				if (oVariantManagement.isPageVariant()) {
					oControlContent[oChangeContent.persistencyKey] = oChangeContent.content;
					oVariantManagement._applyVariantByPersistencyKey(oChangeContent.persistencyKey, oControlContent, "KEY_USER");
				} else {
					oControlContent = oChangeContent.content;
					oVariantManagement._applyVariant(oVariantManagement._getPersoController(), oControlContent, "KEY_USER");
				}
			}
		}
	};
	VariantContent.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {
		if (!oSpecificChangeInfo.hasOwnProperty("content")) {
			throw new Error("oSpecificChangeInfo.content should be filled");
		}
		if (!oSpecificChangeInfo.content.hasOwnProperty("key")) {
			throw new Error("In oSpecificChangeInfo.content.key attribute is required");
		}
		if (!oSpecificChangeInfo.content.hasOwnProperty("persistencyKey")) {
			throw new Error("In oSpecificChangeInfo.content.persistencyKey attribute is required");
		}
		if (!oSpecificChangeInfo.content.hasOwnProperty("content")) {
			throw new Error("In oSpecificChangeInfo.content.content attribute is required");
		}
	};
	VariantContent.revertChange = function(oChange, oVariantManagement, mPropertyBag) {
		var oChangeContent = oChange.getRevertData();
		if (oChangeContent && (oVariantManagement.isA("sap.ui.comp.smartvariants.SmartVariantManagement"))) {
			if ((oVariantManagement.getSelectionKey() === oChangeContent.key)) {
				var oControlContent = {};
				if (oVariantManagement.isPageVariant()) {
					oControlContent[oChangeContent.persistencyKey] = oChangeContent.content;
					oVariantManagement._applyVariantByPersistencyKey(oChangeContent.persistencyKey, oControlContent, "KEY_USER");
				} else {
					oControlContent = oChangeContent.content;
					oVariantManagement._applyVariant(oVariantManagement._getPersoController(), oControlContent, "KEY_USER");
				}
			}
			oChange.resetRevertData();
		}
	};
	return VariantContent;
},
/* bExport= */true);
