/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","../utils/Constants"],function(O,C){"use strict";return O.extend("sap.feedback.ui.flpplugin.data.Config",{_sQualtricsUri:null,_sTenantId:null,_sTenantRole:null,_sPushChannelPath:null,_bIsPushEnabled:false,_iDisplayFormat:null,_iDataFormat:null,_sProductName:null,_sPlatformType:null,_bIsLibraryLoadable:false,constructor:function(q,t,d){this.setQualtricUri(q);this.setTenantId(t);this.setDataFormat(d);},setQualtricUri:function(v){this._sQualtricsUri=v;this._iDisplayFormat=this._identifyDisplayFormat();},getQualtricsUri:function(){return this._sQualtricsUri;},setTenantId:function(v){this._sTenantId=v;},getTenantId:function(){return this._sTenantId;},setTenantRole:function(v){this._sTenantRole=v;},getTenantRole:function(){return this._sTenantRole;},setPushChannelPath:function(p){this._sPushChannelPath=p;},getPushChannelPath:function(){return this._sPushChannelPath;},setIsPushEnabled:function(i){if(i===true||i.toLowerCase()==="true"||i.toLowerCase()==="x"){this._bIsPushEnabled=true;}else{this._bIsPushEnabled=false;}},getIsPushEnabled:function(){return this._bIsPushEnabled;},getDisplayFormat:function(){return this._iDisplayFormat;},_identifyDisplayFormat:function(){if(this._sQualtricsUri&&!this._sQualtricsUri.includes("siteintercept")){return C.E_DISPLAY_FORMAT.iframe;}return C.E_DISPLAY_FORMAT.popover;},setDataFormat:function(d){this._iDataFormat=d;},getDataFormat:function(){return this._iDataFormat;},setProductName:function(p){this._sProductName=p;},getProductName:function(){return this._sProductName;},setPlatformType:function(p){this._sPlatformType=p;},getPlatformType:function(){return this._sPlatformType;},setIsLibraryLoadable:function(i){this._bIsLibraryLoadable=i;},getIsLibraryLoadable:function(){return this._bIsLibraryLoadable;}});});
