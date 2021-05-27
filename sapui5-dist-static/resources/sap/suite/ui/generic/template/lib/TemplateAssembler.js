sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/ui/core/mvc/OverrideExecution","sap/ui/core/mvc/View","sap/ui/model/base/ManagedObjectModel","sap/suite/ui/generic/template/lib/TemplateViewController","sap/suite/ui/generic/template/lib/TemplateComponent","sap/suite/ui/generic/template/lib/CRUDManager","sap/suite/ui/generic/template/lib/CommonUtils","sap/suite/ui/generic/template/lib/ComponentUtils","sap/suite/ui/generic/template/lib/CommonEventHandlers","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/support/lib/CommonMethods","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/base/util/deepExtend"],function(C,O,V,M,T,a,b,c,d,e,t,f,F,g){"use strict";var l=new F("lib.TemplateAssembler").getLogger();var m=Object.create(null);var A=Object.create(null);var r=function(o){var s=o.appComponent.getId();A[s]=o;return function(){delete A[s];};};function h(o){var s=o.getId();var R=A[s];return R;}function i(o){return h(o.getAppComponent()).oTemplateContract.componentRegistry[o.getId()];}function j(o){while(o&&!(o instanceof V)){o=o.getParent();}return o;}function G(o){while(o){var v=j(o);var p=v&&v.getController();var q=p&&p.getOwnerComponent();if(q instanceof a){var s=i(q);return s;}else{o=q&&q.oContainer;}}}function k(s,o,p){var R=m[s];if(R){return R;}o=g({},o);p=g({},p);p.metadata=p.metadata||{};p.metadata.methods=p.metadata.methods||{};for(var q in p){if(typeof p[q]==="function"){var u=p.metadata.methods[q];if(!u){u={};p.metadata.methods[q]=u;}u.public=u.public!==false;u.final=u.final||false;u.overrideExecution=u.overrideExecution||O.After;}}p.metadata.methods.getExtensionAPI={"public":true,"final":true};p.getExtensionAPI=function(){var v=this.getView().getController();return v.extensionAPI;};o.templateBaseExtension=C.extend(s+"BaseExtension",p);R=T.extend(s,o);m[s]=R;return R;}function n(o){var p=o.methods.oControllerSpecification;return p?function(){var q=o.oComponent.getAppComponent();var s=h(q);var u=q.getTransactionController();var N=q.getNavigationController();var v={oComponentUtils:o.utils,oServices:{oTemplateCapabilities:{},oApplicationController:q.getApplicationController(),oTransactionController:u,oNavigationController:N,oDraftController:u.getDraftController(),oApplication:s.application,oViewDependencyHelper:s.oViewDependencyHelper}};o.viewRegistered.catch(function(E){l.debug(E.message);N.navigateToMessagePage({viewLevel:o.viewLevel,title:o.oTemplateContract.getText("ST_ERROR"),text:o.oTemplateContract.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),description:E.message});});o.oControllerUtils=v;var w=o.oComponent.getTemplateName();var x=k(w,p.oControllerDefinition,p.oControllerExtensionDefinition);var R=new x();o.oController=R;var y=p.getMethods(v,R);R._templateEventHandlers=Object.freeze(y.handlers||{});R._templateFormatters=Object.freeze(y.formatters||{});R.extensionAPI=Object.freeze(y.extensionAPI||{});var z;R.onInit=function(){var B=R.getView();z=B.getId();l.info("Init view "+z+" of template "+w);v.oServices.oApplicationController.registerView(B);v.oServices.oDataLossHandler=s.oTemplateContract.oDataLossHandler;v.oCommonUtils=new c(R,v.oServices,v.oComponentUtils);v.oServices.oCRUDManager=new b(R,v.oComponentUtils,v.oServices,v.oCommonUtils,s.oTemplateContract.oBusyHelper);v.oCommonEventHandlers=new e(R,v.oComponentUtils,v.oServices,v.oCommonUtils);var D=new M(B);o.oComponent.setModel(D,"_templPrivView");(y.onInit||Function.prototype)();};R.onExit=function(){s.oTemplateContract.oApplicationProxy.destroyView(z);(y.onExit||Function.prototype)();l.info("View "+z+" of template "+w+" exited");};return R;}:Function.prototype;}r=t.testableStatic(r,"TemplateComponent_RegisterAppComponent");return{getTemplateComponent:function(o,s,p){var q=s+".Component";p=p||{};p.init=function(){var u=this.getComponentData();var v=u.registryEntry;var w=h(v.oAppComponent);var x=w.oTemplateContract;var y=w.oTemplateContract.mRoutingTree[v.route];v.viewRegistered=new Promise(function(R,z){v.fnViewRegisteredResolve=function(E){if(E){v.fnViewRegisteredResolve=Function.prototype;z(E);}else{delete v.fnViewRegisteredResolve;R();}};});v.oViewRenderedPromise=new Promise(function(R){v.fnViewRenderdResolve=R;});v.oViewRenderedPromise.then(function(){f.setApplicationStatus(f.mApplicationStatus.RENDERED);f.publishEvent("elements","ViewRendered",{});});v.reuseComponentProxies=Object.create(null);v.componentName=q;v.oComponent=this;v.aKeys=[];v.oTemplateContract=w.oTemplateContract;(a.prototype.init||Function.prototype).apply(this,arguments);v.utils=new d(this,v);v.methods=o(this,v.utils)||{};v.oGenericData={};v.mRefreshInfos=Object.create(null);y.componentId=this.getId();x.componentRegistry[y.componentId]=v;y.willBeDisplayed.then(x.oBusyHelper.setBusy.bind(null,v.viewRegistered,true));v.oApplication=w.application;v.createViewController=n(v);y.componentCreatedResolve(this);delete y.componentCreatedResolve;delete u.registryEntry;(v.methods.init||Function.prototype)();};p.exit=function(){var u=this.getId();var v=i(this);var w=h(this.getAppComponent());var x=v.methods;(x.exit||Function.prototype)();delete w.oTemplateContract.componentRegistry[u];(a.prototype.exit||Function.prototype).apply(this,arguments);};p.onBeforeRendering=function(){var u=i(this);(a.prototype.onBeforeRendering||Function.prototype).bind(this,u).apply(this,arguments);var v=u.methods;(v.onBeforeRendering||Function.prototype)();};p.onAfterRendering=function(){var u=i(this);if(u.fnViewRenderdResolve&&!u.fnViewRegisteredResolve){u.fnViewRenderdResolve();delete u.fnViewRenderdResolve;}(a.prototype.onAfterRendering||Function.prototype).bind(this,u).apply(this,arguments);var v=u.methods;(v.onAftereRendering||Function.prototype)();};p.setIsRefreshRequired=function(I){if(I===this.getProperty("isRefreshRequired")){return;}this.setProperty("isRefreshRequired",I);var u=i(this);if(I&&!u.oTemplateContract.oNavigationControllerProxy.isNavigating()){u.oTemplateContract.oNavigationObserver.getProcessFinished(true).then(function(){if(this.getProperty("isRefreshRequired")&&u.utils.isComponentActive()){u.utils.refreshBinding(true,{});}}.bind(this));}};p.onDeactivate=Function.prototype;return a.extend(q,p);},getRegisterAppComponent:function(){var R=r;r=null;return R;},getExtensionAPIPromise:function(o){var p=G(o);if(!p){return Promise.reject();}return p.viewRegistered.then(function(){return p.oController.extensionAPI;});},getExtensionAPI:function(o){var p=G(o);return p&&p.oController&&p.oController.extensionAPI;}};});
