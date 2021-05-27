//@ui5-bundle sap/feedback/ui/library-h2-preload.js
/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/feedback/ui/library',["sap/ui/core/library"],function(l){"use strict";sap.ui.getCore().initLibrary({name:"sap.feedback.ui",dependencies:["sap.ui.core"],interfaces:[],elements:[],noLibraryCSS:true,version:"1.88.0"});return sap.feedback.ui;});
sap.ui.require.preload({
	"sap/feedback/ui/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.feedback.ui","type":"library","embeds":["flpplugin"],"applicationVersion":{"version":"1.88.0"},"title":"UI5 library: sap.feedback.ui","description":"UI5 library: sap.feedback.ui","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.88","libs":{"sap.ui.core":{"minVersion":"1.88.0"},"sap.ushell":{"minVersion":"1.88.0","lazy":true}}},"library":{"i18n":false,"css":false,"content":{"elements":[],"interfaces":[]}}}}'
},"sap/feedback/ui/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/feedback/ui/flpplugin/Component.js":["sap/base/Log.js","sap/feedback/ui/flpplugin/controller/PluginController.js","sap/feedback/ui/flpplugin/data/Config.js","sap/feedback/ui/flpplugin/utils/Constants.js","sap/feedback/ui/flpplugin/utils/InitDetection.js","sap/ui/core/Component.js","sap/ui/thirdparty/jquery.js"],
"sap/feedback/ui/flpplugin/controller/ContextDataController.js":["sap/base/util/extend.js","sap/feedback/ui/flpplugin/data/AppContextData.js","sap/feedback/ui/flpplugin/data/PushContextData.js","sap/feedback/ui/flpplugin/utils/Constants.js","sap/ui/base/Object.js"],
"sap/feedback/ui/flpplugin/controller/PluginController.js":["sap/feedback/ui/flpplugin/controller/ContextDataController.js","sap/feedback/ui/flpplugin/controller/PushClient.js","sap/feedback/ui/flpplugin/controller/WebAppFeedbackLoader.js","sap/feedback/ui/flpplugin/ui/IFrameVisual.js","sap/feedback/ui/flpplugin/ui/PopOverVisual.js","sap/feedback/ui/flpplugin/ui/ShellBarButton.js","sap/feedback/ui/flpplugin/utils/Constants.js","sap/ui/base/Object.js","sap/ui/thirdparty/jquery.js"],
"sap/feedback/ui/flpplugin/controller/PushClient.js":["sap/base/Log.js","sap/feedback/ui/flpplugin/data/PushContextData.js","sap/feedback/ui/flpplugin/utils/Constants.js","sap/feedback/ui/flpplugin/utils/Utils.js","sap/ui/base/Object.js","sap/ui/core/EventBus.js","sap/ui/core/ws/ReadyState.js","sap/ui/core/ws/WebSocket.js"],
"sap/feedback/ui/flpplugin/controller/WebAppFeedbackLoader.js":["sap/base/Log.js","sap/feedback/ui/flpplugin/utils/Constants.js","sap/ui/base/Object.js"],
"sap/feedback/ui/flpplugin/data/AppContextData.js":["sap/base/Log.js","sap/feedback/ui/flpplugin/utils/Constants.js","sap/feedback/ui/flpplugin/utils/Utils.js","sap/ui/VersionInfo.js","sap/ui/base/Object.js"],
"sap/feedback/ui/flpplugin/data/Config.js":["sap/feedback/ui/flpplugin/utils/Constants.js","sap/ui/base/Object.js"],
"sap/feedback/ui/flpplugin/data/PushContextData.js":["sap/feedback/ui/flpplugin/utils/Constants.js","sap/ui/base/Object.js"],
"sap/feedback/ui/flpplugin/ui/IFrameVisual.js":["sap/m/Button.js","sap/m/Dialog.js","sap/ui/base/Object.js","sap/ui/core/HTML.js"],
"sap/feedback/ui/flpplugin/ui/PopOverVisual.js":["sap/ui/base/Object.js","sap/ui/thirdparty/jquery.js"],
"sap/feedback/ui/flpplugin/ui/ShellBarButton.js":["sap/feedback/ui/flpplugin/utils/Constants.js","sap/feedback/ui/flpplugin/utils/Utils.js","sap/ui/base/Object.js","sap/ui/core/InvisibleText.js"],
"sap/feedback/ui/flpplugin/utils/InitDetection.js":["sap/ui/base/Object.js"],
"sap/feedback/ui/library.js":["sap/ui/core/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map