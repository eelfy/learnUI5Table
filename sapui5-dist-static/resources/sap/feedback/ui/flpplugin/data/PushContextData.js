/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","../utils/Constants"],function(O,C){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.PushContextData",{_iSrcType:null,_sSrcAppId:null,_sSrcAppTrigger:null,constructor:function(s,S,i){this._sSrcAppId=s;this._sSrcAppTrigger=S;this._bIsPushedSurvey=true;this._iSrcType=i;},getSourceAppId:function(){return this._sSrcAppId;},getSourceAppTrigger:function(){return this._sSrcAppTrigger;},getSourceType:function(){return this._iSrcType;},getIsBackendPushedSurvey:function(){return this._iSrcType===C.E_PUSH_SRC_TYPE.backend;}});});
