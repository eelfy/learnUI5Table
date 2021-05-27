//@ui5-bundle sap/ushell/demo/AppPersSample2/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample2/Component.js":function(){
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
jQuery.sap.declare("sap.ushell.demo.AppPersSample2.Component");jQuery.sap.require("sap.ui.core.UIComponent");sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample2.Component",{oMainView:null,metadata:{manifest:"json"},createContent:function(){this.oMainView=sap.ui.xmlview("sap.ushell.demo.AppPersSample2.App");return this.oMainView;}});
},
	"sap/ushell/demo/AppPersSample2/manifest.json":'{"_version":"1.4.0","sap.app":{"_version":"1.1.0","id":"sap.ushell.demo.AppPersSample2","type":"application","i18n":"i18n/i18n.properties","title":"{{title}}","subTitle":"{{subtitle}}","description":"{{description}}","applicationVersion":{"version":"1.1.0"},"ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"inb":{"semanticObject":"Action","action":"toappperssample2","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://provision"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"_version":"1.1.0","dependencies":{"minUI5Version":"1.28","libs":{"sap.m":{"minVersion":"1.28"}}},"contentDensities":{"compact":false,"cozy":true},"services":{"Personalization":{"factoryName":"sap.ushell.ui5service.Personalization"}}}}'
},"sap/ushell/demo/AppPersSample2/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppPersSample2/App.controller.js":["sap/ushell/demo/AppPersSample2/util/TablePersonalizer.js"],
"sap/ushell/demo/AppPersSample2/App.view.xml":["sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Label.js","sap/m/Panel.js","sap/m/Table.js","sap/m/Text.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppPersSample2/App.controller.js"],
"sap/ushell/demo/AppPersSample2/Component.js":["sap/ui/core/UIComponent.js"],
"sap/ushell/demo/AppPersSample2/util/TablePersonalizer.js":["sap/m/TablePersoController.js","sap/ushell/services/Personalization.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map