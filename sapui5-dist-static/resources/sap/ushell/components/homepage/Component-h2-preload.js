//@ui5-bundle sap/ushell/components/homepage/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/components/homepage/Component',["sap/ui/core/UIComponent","sap/ushell/bootstrap/common/common.load.model","sap/ushell/components/HomepageManager","sap/ushell/components/SharedComponentUtils","sap/ushell/Config","sap/ushell/resources"],function(U,m,H,s,C,r){"use strict";return U.extend("sap.ushell.components.homepage.Component",{metadata:{manifest:"json",library:"sap.ushell"},init:function(){this.oModel=m.getModel();this.setModel(this.oModel);U.prototype.init.apply(this,arguments);var d={model:this.oModel,view:this.oDashboardView};this.oHomepageManager=new H("dashboardMgr",d);this.setModel(r.i18nModel,"i18n");sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.UsageAnalytics","usageAnalyticsStarted",function(){sap.ui.require(["sap/ushell/components/homepage/FLPAnalytics"]);});s.toggleUserActivityLog();s.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay","/core/home/enableHomePageSettings");C.on("/core/home/homePageGroupDisplay").do(function(n){this.oHomepageManager.handleDisplayModeChange(n);}.bind(this));s.getEffectiveHomepageSetting("/core/home/sizeBehavior","/core/home/sizeBehaviorConfigurable");C.on("/core/home/sizeBehavior").do(function(S){var M=this.oHomepageManager.getModel();M.setProperty("/sizeBehavior",S);}.bind(this));},createContent:function(){this.oDashboardView=sap.ui.view({viewName:"sap.ushell.components.homepage.DashboardContent",type:"JS",async:true});return this.oDashboardView;},exit:function(){this.oHomepageManager.destroy();}});});
sap.ui.require.preload({
	"sap/ushell/components/homepage/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ushell.components.homepage","applicationVersion":{"version":"1.88.1"},"i18n":{"bundleUrl":"../../renderers/fiori2/resources/resources.properties","supportedLocales":["","ar","bg","ca","cs","da","de","el","en","en_US","en_US_sappsd","en_US_saptrc","es","et","fi","fr","hi","hr","hu","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh_CN","zh_TW"],"fallbackLocale":"en"},"ach":"CA-FLP-FE-COR","type":"component","title":"{{Component.Homepage.Title}}","resources":"resources.json"},"sap.ui":{"fullWidth":true,"hideLightBackground":true,"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.components.homepage","dependencies":{"minUI5Version":"1.30","libs":{"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true}}}'
},"sap/ushell/components/homepage/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/components/homepage/ActionMode.js":["sap/m/Button.js","sap/m/library.js","sap/ui/thirdparty/jquery.js","sap/ushell/resources.js","sap/ushell/utils/WindowUtils.js"],
"sap/ushell/components/homepage/Component.js":["sap/ui/core/UIComponent.js","sap/ushell/Config.js","sap/ushell/bootstrap/common/common.load.model.js","sap/ushell/components/HomepageManager.js","sap/ushell/components/SharedComponentUtils.js","sap/ushell/resources.js"],
"sap/ushell/components/homepage/DashboardContent.controller.js":["sap/base/Log.js","sap/ui/Device.js","sap/ui/core/mvc/Controller.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/thirdparty/jquery.js","sap/ushell/EventHub.js","sap/ushell/Layout.js","sap/ushell/components/homepage/DashboardUIActions.js","sap/ushell/resources.js","sap/ushell/utils.js"],
"sap/ushell/components/homepage/DashboardContent.view.js":["sap/m/MessageStrip.js","sap/m/Page.js","sap/m/library.js","sap/ui/Device.js","sap/ui/core/AccessibleLandmarkRole.js","sap/ui/core/Component.js","sap/ui/core/mvc/View.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/thirdparty/jquery.js","sap/ushell/Config.js","sap/ushell/EventHub.js","sap/ushell/components/homepage/DashboardGroupsBox.js","sap/ushell/renderers/fiori2/AccessKeysHandler.js","sap/ushell/resources.js","sap/ushell/ui/launchpad/AnchorItem.js","sap/ushell/ui/launchpad/AnchorNavigationBar.js","sap/ushell/utils.js"],
"sap/ushell/components/homepage/DashboardGroupsBox.js":["sap/base/util/isEmptyObject.js","sap/m/Button.js","sap/m/GenericTile.js","sap/ui/Device.js","sap/ui/base/Object.js","sap/ui/core/Component.js","sap/ui/core/InvisibleMessage.js","sap/ui/core/library.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/performance/Measurement.js","sap/ui/thirdparty/jquery.js","sap/ushell/Config.js","sap/ushell/EventHub.js","sap/ushell/Layout.js","sap/ushell/renderers/fiori2/AccessKeysHandler.js","sap/ushell/resources.js","sap/ushell/ui/launchpad/AccessibilityCustomData.js","sap/ushell/ui/launchpad/DashboardGroupsContainer.js","sap/ushell/ui/launchpad/GroupHeaderActions.js","sap/ushell/ui/launchpad/LinkTileWrapper.js","sap/ushell/ui/launchpad/PlusTile.js","sap/ushell/ui/launchpad/Tile.js","sap/ushell/ui/launchpad/TileContainer.js"],
"sap/ushell/components/homepage/DashboardUIActions.js":["sap/base/Log.js","sap/ui/Device.js","sap/ui/base/Object.js","sap/ui/thirdparty/jquery.js","sap/ushell/Layout.js"],
"sap/ushell/components/homepage/FLPAnalytics.js":["sap/base/Log.js","sap/ui/thirdparty/jquery.js","sap/ushell/services/AppConfiguration.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map