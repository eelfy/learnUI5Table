/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/templates/ExtensionAPI","sap/fe/macros/filter/FilterUtils"],function(E,F){"use strict";var e=E.extend("sap.fe.templates.ListReport.ExtensionAPI",{refresh:function(){var f=this._controller._getFilterBarControl();return f.waitForInitialization().then(function(){f.triggerSearch();});},setFilterValues:function(c,o,v){return F.setFilterValues(this._controller._getFilterBarControl(),c,o,v);}});return e;});
