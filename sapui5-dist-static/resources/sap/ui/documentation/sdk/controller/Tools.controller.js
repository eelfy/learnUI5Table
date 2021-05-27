/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/documentation/sdk/controller/BaseController","sap/base/Log","sap/ui/documentation/sdk/model/formatter","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/ToolsInfo"],function(D,B,L,f,J,T){"use strict";return B.extend("sap.ui.documentation.sdk.controller.Tools",{formatter:f,onInit:function(){B.prototype.onInit.call(this);this._onOrientationChange({landscape:D.orientation.landscape});this._oModel=new J();this.getView().setModel(this._oModel);T.getToolsConfig().then(this._onToolConfigLoaded.bind(this));this.getRouter().getRoute("tools").attachPatternMatched(this._onMatched,this);},_onToolConfigLoaded:function(r){var d={};r.forEach(function(e){d[e.id]=e;},this);this._oModel.setData(d);this.setModel(new J({inspectorHomeLink:"topic/b24e72443eb34d0fb7bf6940f2d697eb",supportAssistantHomeLink:d.supportAssistant.href,iconExplorerHomeLink:"topic/21ea0ea94614480d9a910b2e93431291"}),"newWindowLinks");},onBeforeRendering:function(){this._deregisterOrientationChange();},onAfterRendering:function(){this._registerOrientationChange();},onExit:function(){this._deregisterOrientationChange();},_onMatched:function(){try{this.hideMasterSide();}catch(e){L.error(e);}}});});