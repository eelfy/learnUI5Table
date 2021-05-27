//@ui5-bundle sap/ushell/demo/AppStateSample/Component-h2-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppStateSample/Component.js":function(){(function(){"use strict";jQuery.sap.declare("sap.ushell.demo.AppStateSample.Component");jQuery.sap.require("sap.ui.core.UIComponent");sap.ui.core.UIComponent.extend("sap.ushell.demo.AppStateSample.Component",{metadata:{manifest:"json"},getAutoPrefixId:function(){return true;},createContent:function(){var m=sap.ui.view({type:sap.ui.core.mvc.ViewType.XML,viewName:"sap.ushell.demo.AppStateSample.Main"});this.oMainView=m;return m;},extractInnerAppStateFromURL:function(i,c){var t=this;if(i===this.getInnerAppStateKey()){this.oInnerAppStatePromise.resolve(c);return;}t.createANewAppStateModel();jQuery.sap.log.info("applying inner app state "+i+" in instance #"+t.INSTANCECOUNTER);this.oCrossAppStatePromise.done(function(){sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(t,i).done(function(s){t.updateModelFromAppstate(t.oAppStateModel,s,"Setting filter value from InnerAppState");t.oInnerAppStatePromise.resolve(c);});});t.oInnerAppStatePromise.done(function(){t.setInnerAppStateIntoInnerAppHash(c);});},getInnerAppStateKey:function(){return(this.oAppState&&this.oAppState.getKey())||" key not set yet ";},updateModelFromAppstate:function(m,a,c){var t=this,d=a.getData();if(d&&(JSON.stringify(d)!==JSON.stringify(m.getProperty("/appState")))&&m){jQuery.sap.log.info(c+" in instance #"+t.INSTANCECOUNTER);m.setProperty("/appState",d);return true;}return false;},updateAppStateFromAppStateModel:function(){var d;d=this.oAppStateModel.getProperty("/appState");this.oAppState.setData(d);this.oAppState.save().fail(function(){jQuery.sap.log.error("saving of application state failed");});},markOurComponent:function(){sap.ushell.demo.AppStateSample.Component.INSTANCECOUNTER=(sap.ushell.demo.AppStateSample.Component.INSTANCECOUNTER||0)+1;this.INSTANCECOUNTER=sap.ushell.demo.AppStateSample.Component.INSTANCECOUNTER;},createANewAppStateModel:function(){this.oAppState=sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this);this.calculateCrossAppLinks();jQuery.sap.log.info("Create a new appstate model "+this.oAppState.getKey()+" in instance #"+this.INSTANCECOUNTER);},init:function(){var t=this,h,c=sap.ushell.Container.getService("CrossApplicationNavigation");jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);this.markOurComponent();this.oAppStateModel=new sap.ui.model.json.JSONModel({appState:{filter:"",CollectionName:(sap.ui.core.IconPool.getIconCollectionNames())[0]||"no collection name"}});this.setModel(this.oAppStateModel,"AppState");this.oNavTargetsModel=new sap.ui.model.json.JSONModel({toOurAppWithState:"",toOurAppNoState:""});this.setModel(this.oNavTargetsModel,"navTargets");sap.ui.core.UIComponent.prototype.init.apply(this,arguments);this.oCrossAppStatePromise=new jQuery.Deferred();this.oInnerAppStatePromise=new jQuery.Deferred();this.oAppState=sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this);this.calculateCrossAppLinks();sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function(s){t.updateModelFromAppstate(t.oAppStateModel,s,"Set Model from StartupAppState");t.oCrossAppStatePromise.resolve();});jQuery.sap.log.info("Router initialized for instance #"+t.INSTANCECOUNTER);this.getRouter().getRoute("toCatIcons").attachMatched(function(e){t.extractInnerAppStateFromURL(e.getParameter("arguments").iAppState,e.getParameter("name"));});this.getRouter().initialize();this.oInnerAppStatePromise.done(function(i){t.updateAppStateFromAppStateModel();t.oAppStateModel.bindTree("/").attachChange(function(){t.updateAppStateFromAppStateModel();});});},setInnerAppStateIntoInnerAppHash:function(i){var t=this;if(i==="catchall"){i="toCatIcons";}setTimeout(function(){jQuery.sap.log.info("Setting inner app hash "+t.getInnerAppStateKey()+" in URL in instance #"+t.INSTANCECOUNTER);t.navTo(i,true);},0);},calculateCrossAppLinks:function(){var h,c=sap.ushell.Container.getService("CrossApplicationNavigation");h=c.hrefForExternal({target:{semanticObject:"Action",action:"toappstatesample"},params:{"zdate":Number(new Date())},appStateKey:this.oAppState.getKey()},this)||"";this.oNavTargetsModel.setProperty("/toOurAppWithState",h);h=c.hrefForExternal({target:{semanticObject:"Action",action:"toappstatesample"},params:{"date":Number(new Date())}},this)||"";this.oNavTargetsModel.setProperty("/toOurAppNoState",h);h=c.hrefForExternal({target:{semanticObject:"Action",action:"tocrossappstatesample"},params:{"date":Number(new Date())},appStateKey:this.oAppState.getKey()},this)||"";this.oNavTargetsModel.setProperty("/toCrossAppWithState",h);},navTo:function(r,n){jQuery.sap.log.info("NavTo "+r+"with AppStateKey"+this.getInnerAppStateKey()+" in URL in instance #"+this.INSTANCECOUNTER);if(this.getRouter()){this.getRouter().navTo(r,{iAppState:this.getInnerAppStateKey()},n);}}});}());
},
	"sap/ushell/demo/AppStateSample/manifest.json":'{"_version":"1.4.0","sap.app":{"_version":"1.1.0","i18n":"i18n/i18n.properties","id":"sap.ushell.demo.AppStateSample","type":"application","title":"{{title}}","description":"{{description}}","applicationVersion":{"version":"1.1.0"},"ach":"CA-UI2-INT-FE","dataSources":{},"cdsViews":[],"offline":true,"crossNavigation":{"inbounds":{"inb":{"semanticObject":"Action","action":"toAppStateSampleIcon","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"_version":"1.1.0","technology":"UI5","icons":{"icon":"sap-icon://Fiori2/F0005"},"deviceTypes":{"desktop":true,"tablet":true,"phone":true},"supportedThemes":["sap_hcb","sap_bluecrystal"],"fullWidth":false},"sap.ui5":{"_version":"1.1.0","resources":{"js":[],"css":[{"uri":"css/custom.css","id":"sap.ushell.demo.AppStateSample.stylesheet"}]},"dependencies":{"minUI5Version":"1.28","libs":{"sap.m":{"minVersion":"1.28"}}},"models":{},"rootView":"","handleValidation":false,"config":{},"routing":{"config":{"viewType":"XML","viewPath":"","targetControl":"app","targetAggregation":"detailPages","clearTarget":false,"transition":"slide"},"routes":[{"pattern":"ShowCollection/sap-iapp-state={iAppState}","view":"sap.ushell.demo.AppStateSample.view.CatIcons","name":"toCatIcons"},{"pattern":":all*:","view":"sap.ushell.demo.AppStateSample.view.CatIcons","name":"catchall"}]},"contentDensities":{"compact":false,"cozy":true}}}'
},"sap/ushell/demo/AppStateSample/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppStateSample/Component.js":["sap/ui/core/UIComponent.js"],
"sap/ushell/demo/AppStateSample/Main.view.xml":["sap/m/SplitApp.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppStateSample/Main.controller.js"],
"sap/ushell/demo/AppStateSample/view/CatIcons.view.xml":["sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Input.js","sap/m/Page.js","sap/m/Table.js","sap/m/Text.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/Icon.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppStateSample/view/CatIcons.controller.js"],
"sap/ushell/demo/AppStateSample/view/List.controller.js":["sap/ui/commons/Panel.js","sap/ushell/ui/footerbar/AddBookmarkButton.js","sap/ushell/ui/footerbar/JamDiscussButton.js","sap/ushell/ui/footerbar/JamShareButton.js"],
"sap/ushell/demo/AppStateSample/view/List.view.xml":["sap/m/Link.js","sap/m/List.js","sap/m/Page.js","sap/m/Panel.js","sap/m/StandardListItem.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppStateSample/view/List.controller.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map