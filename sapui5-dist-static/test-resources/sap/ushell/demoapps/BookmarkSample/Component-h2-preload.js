//@ui5-bundle sap/ushell/demo/bookmark/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/bookmark/Component.js":function(){
/*
 * Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ushell.demo.bookmark.Component");jQuery.sap.require("sap.ui.core.UIComponent");sap.ui.core.UIComponent.extend("sap.ushell.demo.bookmark.Component",{metadata:{"manifest":"json"}});
},
	"sap/ushell/demo/bookmark/manifest.json":'{"_version":"1.4.0","sap.app":{"id":"sap.ushell.demo.bookmark","_version":"1.1.0","i18n":"i18n/i18n.properties","type":"application","applicationVersion":{"version":"1.0.0"},"title":"{{title}}","description":"{{description}}","tags":{"keywords":["{{keyword.sample}}","{{keyword.demo}}","{{keyword.flp}}"]},"ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"inb":{"semanticObject":"Action","action":"toBookmark","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://favorite"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"]},"sap.ui5":{"_version":"1.1.0","dependencies":{"minUI5Version":"1.28","libs":{"sap.m":{"minVersion":"1.28"}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"rootView":{"viewName":"sap.ushell.demo.bookmark.view.App","type":"XML"},"handleValidation":false,"contentDensities":{"compact":false,"cozy":true}}}'
},"sap/ushell/demo/bookmark/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/bookmark/Component.js":["sap/ui/core/UIComponent.js"],
"sap/ushell/demo/bookmark/controller/App.controller.js":["sap/m/MessageToast.js","sap/ui/core/ValueState.js","sap/ui/core/format/DateFormat.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ui/model/resource/ResourceModel.js","sap/ushell/utils/WindowUtils.js"],
"sap/ushell/demo/bookmark/view/App.view.xml":["sap/m/IconTabBar.js","sap/m/IconTabFilter.js","sap/m/Page.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/bookmark/controller/App.controller.js","sap/ushell/demo/bookmark/view/CustomAdd.fragment.xml","sap/ushell/demo/bookmark/view/CustomModify.fragment.xml","sap/ushell/demo/bookmark/view/StandardAdd.fragment.xml","sap/ushell/demo/bookmark/view/StandardModify.fragment.xml"],
"sap/ushell/demo/bookmark/view/CustomAdd.fragment.xml":["sap/m/Button.js","sap/m/Input.js","sap/m/Label.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/ui/ContentNodeSelector.js"],
"sap/ushell/demo/bookmark/view/CustomModify.fragment.xml":["sap/m/Button.js","sap/m/Input.js","sap/m/Label.js","sap/m/MessageStrip.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/demo/bookmark/view/StandardAdd.fragment.xml":["sap/m/Button.js","sap/m/Input.js","sap/m/Label.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/ui/ContentNodeSelector.js","sap/ushell/ui/footerbar/AddBookmarkButton.js"],
"sap/ushell/demo/bookmark/view/StandardModify.fragment.xml":["sap/m/Button.js","sap/m/Input.js","sap/m/Label.js","sap/m/MessageStrip.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/core/Icon.js","sap/ui/layout/form/SimpleForm.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map