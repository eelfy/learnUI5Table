/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/model/odata/v2/ODataModel"],function(O){"use strict";var a={handleModelInit:function(s,m,w){var l=false,M;if(s&&!s._bMetaModelLoadAttached&&m){M=s.getModel();if(M){if(M.getMetadata()&&M instanceof O){l=true;}else if(M.bLoadMetadataAsync||(M.getServiceMetadata&&!M.getServiceMetadata())){l=true;}s._bMetaModelLoadAttached=true;if(l&&M.getMetaModel()&&M.getMetaModel().loaded){if(!w){M.getMetaModel().loaded().then(m.bind(s));}else{this._getFlexRuntimeInfoAPI().then(function(F){var p;if(!F.isFlexSupported({element:s})){p=Promise.resolve();}else{p=F.waitForChanges({element:s});}Promise.all([M.getMetaModel().loaded(),p]).then(m.bind(s));});}}else{m.apply(s);}}}},_getFlexRuntimeInfoAPI:function(){return sap.ui.getCore().loadLibrary('sap.ui.fl',{async:true}).then(function(){return new Promise(function(r){sap.ui.require(["sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(F){r(F);});});});}};return a;},true);
