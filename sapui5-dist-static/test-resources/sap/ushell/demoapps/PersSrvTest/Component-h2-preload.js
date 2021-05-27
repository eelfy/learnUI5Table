//@ui5-bundle sap/ushell/demo/PersSrvTest/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/PersSrvTest/Component.js":function(){jQuery.sap.declare("sap.ushell.demo.PersSrvTest.Component");jQuery.sap.require("sap.ui.core.UIComponent");sap.ui.core.UIComponent.extend("sap.ushell.demo.PersSrvTest.Component",{oMainView:null,metadata:{manifest:"json"},createContent:function(){"use strict";var c=this.getComponentData&&this.getComponentData();this.oMainView=sap.ui.xmlview("sap.ushell.demo.PersSrvTest.App");return this.oMainView;}});
},
	"sap/ushell/demo/PersSrvTest/manifest.json":'{"_version":"1.4.0","sap.app":{"_version":"1.1.0","id":"sap.ushell.demo.PersSrvTest","type":"application","i18n":"i18n/i18n.properties","title":"{{title}}","subTitle":"{{subtitle}}","description":"{{description}}","applicationVersion":{"version":"1.1.0"},"ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"inb":{"semanticObject":"Action","action":"toperssrvtest","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://past"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"_version":"1.1.0","dependencies":{"minUI5Version":"1.28","libs":{"sap.m":{"minVersion":"1.28"}}},"contentDensities":{"compact":false,"cozy":true},"services":{"Personalization":{"factoryName":"sap.ushell.ui5service.Personalization"}}}}'
},"sap/ushell/demo/PersSrvTest/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/PersSrvTest/AddItemDialog.fragment.xml":["sap/m/Button.js","sap/m/CheckBox.js","sap/m/Dialog.js","sap/m/Input.js","sap/ui/core/Fragment.js"],
"sap/ushell/demo/PersSrvTest/App.controller.js":["sap/m/MessageBox.js"],
"sap/ushell/demo/PersSrvTest/App.view.xml":["sap/m/Button.js","sap/m/CheckBox.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Input.js","sap/m/Label.js","sap/m/Page.js","sap/m/Panel.js","sap/m/Table.js","sap/m/Text.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/PersSrvTest/App.controller.js"],
"sap/ushell/demo/PersSrvTest/Component.js":["sap/ui/core/UIComponent.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map