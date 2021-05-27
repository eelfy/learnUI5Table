//@ui5-bundle sap/ushell/demo/AppPersSample/Component-h2-preload.js
sap.ui.predefine('sap/ushell/demo/AppPersSample/Component',["sap/ui/core/UIComponent"],function(U){"use strict";return U.extend("sap.ushell.demo.AppPersSample.Component",{oMainView:null,metadata:{manifest:"json"},createContent:function(){this.oMainView=sap.ui.xmlview("sap.ushell.demo.AppPersSample.App");return this.oMainView;}});});
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample/manifest.json":'{"_version":"1.21.0","sap.app":{"_version":"1.1.0","id":"sap.ushell.demo.AppPersSample","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"title":"{{title}}","subTitle":"{{subtitle}}","description":"{{description}}","applicationVersion":{"version":"1.1.0"},"ach":"CA-UI2-INT-FE","dataSources":{},"cdsViews":[],"offline":true,"crossNavigation":{"inbounds":{"inb":{"semanticObject":"Action","action":"toappperssample","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://undefined/favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"],"fullWidth":false},"sap.ui5":{"_version":"1.1.0","resources":{"js":[],"css":[{"uri":"css/custom.css","id":"sap.ushell.demo.AppPersSample.stylesheet"}]},"dependencies":{"minUI5Version":"1.28","libs":{"sap.m":{"minVersion":"1.28"}}},"models":{},"rootView":"","handleValidation":false,"config":{},"routing":{},"contentDensities":{"compact":false,"cozy":true},"services":{"Personalization":{"factoryName":"sap.ushell.ui5service.Personalization"}}}}'
},"sap/ushell/demo/AppPersSample/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppPersSample/App.controller.js":["sap/base/Log.js","sap/m/MessageToast.js"],
"sap/ushell/demo/AppPersSample/App.view.xml":["sap/m/Button.js","sap/m/CheckBox.js","sap/m/Panel.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppPersSample/App.controller.js"],
"sap/ushell/demo/AppPersSample/Component.js":["sap/ui/core/UIComponent.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map