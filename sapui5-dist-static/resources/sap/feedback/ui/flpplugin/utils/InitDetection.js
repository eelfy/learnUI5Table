/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object"],function(O){"use strict";return O.extend("sap.feedback.ui.flpplugin.utils.InitDetection",{_sUrl:null,constructor:function(u){this._sUrl=u;},isUrlLoadable:function(){return this._canLoadUrl(this._sUrl);},_canLoadUrl:function(u){return new Promise(function(r,R){var h={method:"HEAD",mode:"no-cors"};var v=new Request(u,h);fetch(v).then(function(o){return o;}).then(function(){r(true);}).catch(function(){R(false);});});}});});
