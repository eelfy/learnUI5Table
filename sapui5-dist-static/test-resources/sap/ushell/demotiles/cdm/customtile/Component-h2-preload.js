//@ui5-bundle sap/ushell/demotiles/cdm/customtile/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demotiles/cdm/customtile/Component.js":function(){
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.demotiles.cdm.customtile.Component");sap.ui.define(["sap/ui/core/UIComponent"],function(U){return U.extend("sap.ushell.demotiles.cdm.customtile.Component",{metadata:{"manifest":"json"},tileSetVisible:function(n){this._controller.visibleHandler(n);},tileRefresh:function(){this._controller.refreshHandler(this._controller);},tileSetVisualProperties:function(n){this._controller.setVisualPropertiesHandler(n);},createContent:function(){sap.ui.require(["sap/m/Table","sap/m/TimePicker","sap/m/Tree"],function(){console.log("modules from core-ext-light.js have been loaded");});var t=sap.ui.view({viewName:"sap.ushell.demotiles.cdm.customtile.DynamicTile",type:sap.ui.core.mvc.ViewType.JS});this._controller=t.getController();return t;}});});}());
},
	"sap/ushell/demotiles/cdm/customtile/manifest.json":'{"_version":"1.1.0","sap.flp":{"type":"tile","tileSize":"1x1"},"sap.app":{"id":"sap.ushell.demotiles.cdm.customtile","_version":"1.0.0","type":"application","applicationVersion":{"version":"1.0.0"},"title":"Custom Dynamic App Launcher","description":"Custom Tile","tags":{"keywords":[]},"ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Action-customTile":{"semanticObject":"Action","action":"customTile","signature":{"parameters":{}}}}}},"sap.ui":{"_version":"1.1.0","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"_version":"1.1.0","componentName":"sap.ushell.demotiles.cdm.customtile","dependencies":{"minUI5Version":"1.38","libs":{"sap.m":{}}},"models":{},"rootView":{"viewName":"sap.ushell.demotiles.cdm.customtile.DynamicTile","type":"JS"},"handleValidation":false},"custom.namespace.of.tile":{"backgroundImageRelativeToComponent":"custom_tile.png"}}'
},"sap/ushell/demotiles/cdm/customtile/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demotiles/cdm/customtile/DynamicTile.controller.js":["sap/base/Log.js","sap/base/util/UriParameters.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ui/thirdparty/datajs.js","sap/ui/thirdparty/jquery.js","sap/ushell/Config.js","sap/ushell/components/tiles/utils.js","sap/ushell/components/tiles/utilsRT.js","sap/ushell/utils/WindowUtils.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map