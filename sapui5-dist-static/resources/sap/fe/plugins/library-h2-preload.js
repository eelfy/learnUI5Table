//@ui5-bundle sap/fe/plugins/library-h2-preload.js
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/fe/plugins/library',["sap/ui/core/Core"],function(){"use strict";sap.ui.getCore().initLibrary({name:"sap.fe.plugins",dependencies:["sap.ui.core","sap.fe.templates"],types:[],interfaces:[],controls:[],elements:[],version:"1.88.0",noLibraryCSS:true});return sap.fe.plugins;});
sap.ui.require.preload({
	"sap/fe/plugins/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fe.plugins","type":"library","embeds":[],"applicationVersion":{"version":"1.88.0"},"title":"UI5 library: sap.fe.plugins","description":"UI5 library: sap.fe.plugins","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.88","libs":{"sap.ui.core":{"minVersion":"1.88.0"}}},"library":{"i18n":false,"css":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/fe/plugins/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/fe/plugins/library.js":["sap/ui/core/Core.js"],
"sap/fe/plugins/preload/Component.js":["sap/base/util/UriParameters.js","sap/fe/plugins/preload/FilePreload.js","sap/ui/core/Component.js"],
"sap/fe/plugins/preload/FilePreload.js":["sap/base/Log.js","sap/base/util/LoaderExtensions.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map