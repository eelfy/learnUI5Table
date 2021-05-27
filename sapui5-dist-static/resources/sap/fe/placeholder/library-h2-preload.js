//@ui5-bundle sap/fe/placeholder/library-h2-preload.js
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/fe/placeholder/library',["sap/ui/core/Core","sap/ui/core/library"],function(){"use strict";sap.ui.getCore().initLibrary({name:"sap.fe.placeholder",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.88.0",noLibraryCSS:false,extensions:{}});return sap.fe.placeholder;});
sap.ui.require.preload({
	"sap/fe/placeholder/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fe.placeholder","type":"library","embeds":[],"applicationVersion":{"version":"1.88.0"},"title":"UI5 library: sap.fe.placeholder","description":"UI5 library: sap.fe.placeholder","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_hcb","sap_belize_hcw","sap_belize_plus","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.88","libs":{"sap.ui.core":{"minVersion":"1.88.0"}}},"library":{"i18n":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/fe/placeholder/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/fe/placeholder/controller/Placeholder.controller.js":["sap/ui/core/mvc/Controller.js"],
"sap/fe/placeholder/library.js":["sap/ui/core/Core.js","sap/ui/core/library.js"],
"sap/fe/placeholder/view/PlaceholderLR.view.xml":["sap/fe/placeholder/controller/Placeholder.controller.js","sap/ui/core/mvc/XMLView.js"],
"sap/fe/placeholder/view/PlaceholderOP.view.xml":["sap/fe/placeholder/controller/Placeholder.controller.js","sap/ui/core/mvc/XMLView.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map