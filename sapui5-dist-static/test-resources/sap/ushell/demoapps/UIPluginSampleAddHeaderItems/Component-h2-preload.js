//@ui5-bundle sap/ushell/demo/UIPluginSampleAddHeaderItems/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/demo/UIPluginSampleAddHeaderItems/Component',["sap/ui/core/Component"],function(C){"use strict";var c="sap.ushell.demo.UIPluginSampleAddHeaderItems";return C.extend(c+".Component",{metadata:{manifest:"json"},_getRenderer:function(){var t=this,d=new jQuery.Deferred(),r;t._oShellContainer=jQuery.sap.getObject("sap.ushell.Container");if(!t._oShellContainer){d.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");}else{r=t._oShellContainer.getRenderer();if(r){d.resolve(r);}else{t._onRendererCreated=function(e){r=e.getParameter("renderer");if(r){d.resolve(r);}else{d.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");}};t._oShellContainer.attachRendererCreatedEvent(t._onRendererCreated);}}return d.promise();},init:function(){var t=this;this._getRenderer().fail(function(e){jQuery.sap.log.error(e,undefined,c);}).done(function(r){var f=jQuery.sap.getUriParameters().get("plugin-full");if(f){r.addSubHeader("sap.m.Bar",{contentLeft:[new sap.m.Button({text:"Button left"})],contentRight:[new sap.m.Button({text:"Button right"})],contentMiddle:[new sap.m.Button({text:"Button center"})]},true,true);r.setFooterControl("sap.m.Bar",{contentLeft:[new sap.m.Button({text:"Button left"})],contentRight:[new sap.m.Button({text:"Button right"})],contentMiddle:[new sap.m.Button({text:"Button center"})]},true,true);var b=new sap.ushell.ui.shell.ToolAreaItem({icon:"sap-icon://business-card"});r.showToolAreaItem(b.getId(),false,["home","app"]);r.setHeaderTitle("Custom Header Title");r.addHeaderItem("sap.ushell.ui.shell.ShellHeadItem",{id:"testBtn",icon:"sap-icon://pdf-attachment"},true,true);r.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem",{id:"testBtn1",icon:"sap-icon://documents"},true,true);r.addActionButton("sap.m.Button",{id:"testBtn3",text:"Custom button",icon:"sap-icon://action"},true,true);var e={title:"My custom settings",icon:"sap-icon://wrench",value:function(){return jQuery.Deferred().resolve("more specific description");},content:function(){return jQuery.Deferred().resolve(new sap.m.Panel({content:[new sap.m.VBox({items:[new sap.m.Label({text:"Some feature switch"}),new sap.m.Switch("userPrefEntryButton")]})]}));},onSave:function(){return jQuery.Deferred().resolve();}};r.addUserPreferencesEntry(e);return;}var p=t.getComponentData().config,R;if(p.position==="end"){R="addHeaderEndItem";}else if(p.position==="begin"){R="addHeaderItem";}else{jQuery.sap.log.warning("Invalid 'position' parameter, must be one of <begin, end>. Defaulting to 'end'.",undefined,c);R="addHeaderEndItem";}if(typeof r[R]==="function"){r[R]({tooltip:p.tooltip||"",ariaLabel:p.tooltip||"",icon:sap.ui.core.IconPool.getIconURI(p.icon||"question-mark"),press:function(){sap.m.MessageToast.show(p.message||"Default Toast Message");}},true,false);}else{jQuery.sap.log.error("Extension method '"+R+"' not supported by shell renderer",undefined,c);return;}});},exit:function(){if(this._oShellContainer&&this._onRendererCreated){this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);}}});});
sap.ui.require.preload({
	"sap/ushell/demo/UIPluginSampleAddHeaderItems/manifest.json":'{"_version":"1.21.0","sap.app":{"_version":"1.1.0","i18n":{"bundleUrl":"messagebundle.properties","supportedLocales":[""],"fallbackLocale":""},"id":"sap.ushell.demo.UIPluginSampleAddHeaderItems","type":"component","embeddedBy":"","title":"{{title}}","description":"{{description}}","applicationVersion":{"version":"1.1.0"},"ach":"CA-UI2-INT-FE","crossNavigation":{"inbounds":{"Shell-plugin":{"semanticObject":"Shell","action":"plugin","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"componentName":"sap.ushell.demo.UIPluginSampleAddHeaderItems","dependencies":{"minUI5Version":"1.28","libs":{"sap.m":{"minVersion":"1.28"}}},"contentDensities":{"compact":true,"cozy":true}},"sap.flp":{"type":"plugin"}}'
},"sap/ushell/demo/UIPluginSampleAddHeaderItems/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/UIPluginSampleAddHeaderItems/Component.js":["sap/ui/core/Component.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map