/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */

/**
 * @namespace Provides utitlity functions for OPA tests
 * @name sap.ui.comp.integration.testlibrary.TestUtils
 * @author SAP SE
 * @version 1.88.0
 * @private
 * @since 1.77.0
 */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/Device"
], function(BaseObject, Device) {
	"use strict";

	var TestUtils = BaseObject.extend("sap.ui.comp.integration.testlibrary.TestUtils", {});

	/**
	 * Gets translation for a key
	 * @param {string} sLibraryName The library containing the translation key
	 * @param {string} sTextKey Translation key
	 * @param {array} aParams Аdditional parameters for the translation
	 * @returns {string} Тranslated text
	 * @public
	 */
	TestUtils.getTextFromResourceBundle = function(sLibraryName, sTextKey, aParams) {
		var oCore = sap.ui.test.Opa5.getWindow().sap.ui.getCore();
		return oCore.getLibraryResourceBundle(sLibraryName).getText(sTextKey, aParams);
	};

	/**
	 * Returns the ID of the <code>ValueHelpDialog</code>
	 * @param {string} sInputId The input control ID whose <code>ValueHelpDialog</code> ID we want to receive
	 * @param {string} sValueHelpId Fixed <code>ValueHelpDialog</code> ID
	 * @returns {string} The <code>ValueHelpDialog</code> ID
	 */
	TestUtils.getValueHelpDialogId = function(sInputId, sValueHelpId){
		if (sValueHelpId) {
			return sValueHelpId;
		}
		return sInputId + "-valueHelpDialog";
	};

	/**
	 * Checks if the device the tests are running on is a phone
	 * @returns {boolean} <code>True</code> if the device is a phone
	 */
	TestUtils.isPhone = function(){
		return Device.system.phone;
	};

	TestUtils.COMP_TEST_LIBRARY_NAME = "compTestLibrary";

	return TestUtils;
}, /* bExport= */true);
