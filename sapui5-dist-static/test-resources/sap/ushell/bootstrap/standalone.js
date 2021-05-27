// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's bootstrap code for development sandbox scenarios.
 *
 * @version 1.88.1
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    
    // Additional bootstrap for noShellIndex.html + also used by sandbox bootstrap
    // (to have common code for this)

    // Set translation resource model
    // (needed here so apps using addBookmarkButton etc. work in the sandbox)
    // (Original code from Fiori Launchpad: ushell-lib/src/main/js/sap/ushell/renderers/fiori2/Renderer.js)
    jQuery.sap.require("sap.ui.model.resource.ResourceModel");
    var oTranslationModel = new sap.ui.model.resource.ResourceModel({
        bundleUrl : jQuery.sap.getModulePath(
            "sap.ushell.renderers.fiori2.resources.resources",
            ".properties"
        ),
        bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
    });
    jQuery.sap.setObject("sap.ushell.resources", { i18n : oTranslationModel.getResourceBundle() });
}());
