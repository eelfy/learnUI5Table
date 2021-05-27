(function () {
    "use strict";
    /*global sap, jQuery */

    /**
     * @fileOverview Application component to display information on entities from the GWSAMPLE_BASIC
     *   OData service.
     * @version @version@
     */
    jQuery.sap.declare("sales.webapp.Component");

    jQuery.sap.require("sap.ovp.app.Component");
    
    jQuery.sap.require("sap.ui.fl.FakeLrepConnectorLocalStorage");

    sap.ovp.app.Component.extend("sales.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * temp solution to initialize mockservers before manifest is loaded to avoid real odata calls
         * UI5 should provide proper hooks for such scenarios!!!
         */
        _initCompositeSupport: function(){
            // enable fake lrep local storage to be able to save personalization locally
            sap.ui.fl.FakeLrepConnectorLocalStorage.enableFakeConnector(jQuery.sap.getModulePath("sales.data.lrep.component-test-changes") + ".json");

            jQuery.sap.registerModulePath("sap.ovp.test", jQuery.sap.getModulePath("sap.ovp") + "/../../../test-resources/sap/ovp");
            jQuery.sap.require("sap.ovp.test.mockservers");

            var baseUrl = jQuery.sap.getModulePath("sales");
//            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/salesorder/", "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/");
//            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/purchaseorder/", "/sap/opu/odata/sap/ZME_OVERDUE_CDS/");
            sap.ovp.test.mockservers.loadMockServer(baseUrl + "/data/salesshare/", "/sap/smartbusinessdemo/services/SalesShare.xsodata/");
            sap.ovp.app.Component.prototype._initCompositeSupport.apply(this, arguments);
        },

        exit: function(){
            sap.ovp.test.mockservers.close();
        }
    });
}());
