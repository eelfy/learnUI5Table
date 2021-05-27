//@ui5-bundle sap/ushell/components/shell/MenuBar/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/components/shell/MenuBar/Component',["sap/ui/core/UIComponent","sap/ushell/Config"],function(U,C){"use strict";return U.extend("sap.ushell.components.shell.MenuBar.Component",{metadata:{manifest:"json",library:"sap.ushell"},init:function(){U.prototype.init.apply(this,arguments);sap.ushell.Container.getServiceAsync("Menu").then(function(m){return Promise.all([m.isMenuEnabled(),m.getMenuModel()]);}).then(function(r){var c;var i=r[0];var m=r[1];this.setModel(m,"menu");if(i){c=sap.ui.getCore().byId("menuBarComponentContainer");}if(c){c.setComponent(this);}sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function(A){var o=A.getCurrentApplication();if(!o||!o.homePage){this.setVisible(false);}}.bind(this));}.bind(this));},setVisible:function(v){v=v||C.last("/core/menu/visibleInAllStates");sap.ui.getCore().byId("menuBarComponentContainer").setVisible(!!v);}});});
sap.ui.require.preload({
	"sap/ushell/components/shell/MenuBar/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ushell.components.shell.MenuBar","applicationVersion":{"version":"1.88.1"},"i18n":{"bundleUrl":"../../../renderers/fiori2/resources/resources.properties","supportedLocales":["","ar","bg","ca","cs","da","de","el","en","en_US","en_US_sappsd","en_US_saptrc","es","et","fi","fr","hi","hr","hu","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh_CN","zh_TW"],"fallbackLocale":"en"},"type":"component","title":"","resources":"resources.json"},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ushell.components.shell.MenuBar.view.MenuBar","type":"XML","async":true},"dependencies":{"minUI5Version":"1.72","libs":{"sap.m":{}}},"models":{},"contentDensities":{"compact":true,"cozy":true}}}'
},"sap/ushell/components/shell/MenuBar/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/components/shell/MenuBar/Component.js":["sap/ui/core/UIComponent.js","sap/ushell/Config.js"],
"sap/ushell/components/shell/MenuBar/controller/MenuBar.controller.js":["sap/base/util/ObjectPath.js","sap/m/IconTabFilter.js","sap/ui/core/CustomData.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/EventHub.js","sap/ushell/resources.js","sap/ushell/utils.js","sap/ushell/utils/WindowUtils.js"],
"sap/ushell/components/shell/MenuBar/view/MenuBar.view.xml":["sap/m/IconTabHeader.js","sap/ui/core/CustomData.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/MenuBar/controller/MenuBar.controller.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map