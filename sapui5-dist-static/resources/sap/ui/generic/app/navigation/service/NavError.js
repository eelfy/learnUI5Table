/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/navigation/NavError"],function(F){"use strict";var N=F.extend("sap.ui.generic.app.navigation.service.NavError",{metadata:{publicMethods:["getErrorCode"],properties:{},library:"sap.ui.generic.app"},constructor:function(e){F.apply(this);this._sErrorCode=e;}});N.prototype.getErrorCode=function(){return this._sErrorCode;};return N;});
