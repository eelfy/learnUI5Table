/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/util/extend","sap/base/util/isPlainObject","sap/m/NavContainer","sap/f/FlexibleColumnLayout","sap/ui/core/UIComponent","sap/ui/model/base/ManagedObjectModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/ui/model/odata/MessageScope","sap/ui/model/resource/ResourceModel","sap/ui/generic/app/ApplicationController","sap/suite/ui/generic/template/genericUtilities/ProcessObserver","sap/suite/ui/generic/template/lib/Application","sap/suite/ui/generic/template/lib/BusyHelper","sap/suite/ui/generic/template/lib/DataLossHandler","sap/suite/ui/generic/template/lib/navigation/NavigationController","sap/suite/ui/generic/template/lib/TemplateAssembler","sap/suite/ui/generic/template/lib/CRUDHelper","sap/suite/ui/generic/template/lib/ViewDependencyHelper","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/support/lib/CommonMethods","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/suite/ui/generic/template/lib/navigation/startupParameterHelper"],function(e,a,N,F,U,M,b,c,J,d,R,A,P,f,B,D,g,T,C,V,t,h,j,s){"use strict";var k="lib.AppComponent";var l=new j(k).getLogger();A=t.observableConstructor(A);var m=sap.m.DraftIndicatorState;var r=T.getRegisterAppComponent();var o;function n(){o=o||new R({bundleName:"sap/suite/ui/generic/template/lib/i18n/i18n"}).getResourceBundle();return o.getText.apply(o,arguments);}function p(){return new P({processObservers:[]});}var q=sap.ui.getCore().getMessageManager().getMessageModel();var v=new b({path:"validation",operator:c.EQ,value1:true});function u(w,x){var y={oAppComponent:w,ghostapp:(function(){var i=w.getManifestEntry("sap.ui.generic.app");return!!(i&&i.settings&&i.settings.ghostapp);})(),componentRegistry:Object.create(null),aRunningSideEffectExecutions:[],getText:n,oTemplatePrivateGlobalModel:(new J()).setDefaultBindingMode("TwoWay"),aStateChangers:[],oPaginatorInfo:Object.create(null),oStatePreserversAvailablePromise:Promise.resolve(),oValidationMessageBinding:q.bindList("/",null,null,v)};y.oDataLossHandler=new D(y);y.oValidationMessageBinding.attachChange(Function.prototype);var z;var E;var G;function H(){var i=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("URLParsing");y.oTemplatePrivateGlobalModel.setProperty("/generic",{crossAppNavSupport:!!i&&i.isIntentUrl(document.URL),draftIndicatorState:m.Clear,shellServiceUnavailable:false,placeholdersShown:{"":true},placeholderValue:false,repeatPlaceholder:false,forceFullscreenCreate:false});w.setModel(y.oTemplatePrivateGlobalModel,"_templPrivGlobal");y.oShellServicePromise.catch(function(){y.oTemplatePrivateGlobalModel.setProperty("/generic/shellServiceUnavailable",true);});var q=sap.ui.getCore().getMessageManager().getMessageModel();w.setModel(q,"_templPrivMessage");}function I(){y.fnAddSideEffectPromise=function(k1){var i=0;for(;y.aRunningSideEffectExecutions[i];){i++;}y.aRunningSideEffectExecutions[i]=k1;var l1=function(){y.aRunningSideEffectExecutions[i]=null;};k1.then(l1,l1);};z.attachEvent("beforeSideEffectExecution",function(i){var k1=i.getParameter("promise");setTimeout(y.oBusyHelper.setBusy.bind(null,k1),1000);y.fnAddSideEffectPromise(k1);});var i1=w.getModel("_templPrivGlobal");var j1="/generic/draftIndicatorState";z.attachBeforeQueueItemProcess(function(i){if(i.draftSave){i1.setProperty(j1,m.Saving);}});z.attachOnQueueCompleted(function(){if(i1.getProperty(j1)===m.Saving){i1.setProperty(j1,m.Saved);}});z.attachOnQueueFailed(function(){if(i1.getProperty(j1)===m.Saving){i1.setProperty(j1,m.Clear);}});i1.setProperty("/generic/appComponentName",w.getMetadata().getComponentName());}function K(){var i={appComponent:w,oTemplateContract:y,application:new f(y),oViewDependencyHelper:new V(y)};y.oViewDependencyHelper=i.oViewDependencyHelper;y.oShellServicePromise=w.getService("ShellUIService").catch(function(){var l1=sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.ShellUIService");return((l1&&l1.createInstance())||Promise.reject());});y.oShellServicePromise.catch(function(){l.warning("No ShellService available");});var i1=c1().settings||Object.create(null);w.applySettings(i1);(U.prototype.init||Function.prototype).apply(w,arguments);y.appSettings=new M(w);y.oBusyHelper.setBusy(y.oShellServicePromise);G=r(i);var j1=w.getModel();y.bCreateRequestsCanonical=true;var k1=j1.messageScopeSupported();y.oBusyHelper.setBusy(k1);k1.then(function(l1){if(l1){j1.setPersistTechnicalMessages(true);j1.setMessageScope(d.BusinessObject);y.bCreateRequestsCanonical=false;}z=new A(j1);H();E=new g(y);I();C.enableAutomaticDraftSaving(y);if((!j1.oMetadata||!j1.oMetadata.isLoaded())||j1.oMetadata.isFailed()){j1.attachMetadataFailed(function(){E.navigateToMessagePage({title:n("ST_GENERIC_ERROR_TITLE"),text:n("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE"),icon:"sap-icon://message-error",description:n("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_DESC")});for(var n1 in y.componentRegistry){y.componentRegistry[n1].fnViewRegisteredResolve(true);}});}if(w&&w.getMetadata()&&w.getMetadata().getManifest()){h.setAppComponent(w);}h.setApplicationStatus(h.mApplicationStatus.LOADING);h.publishEvent("elements","ViewRenderingStarted",{});var m1=sap.ushell&&sap.ushell.Container;if(m1){m1.registerDirtyStateProvider(g1);}});}function L(){if(y.oNavigationHost){return"";}if(w.getFlexibleColumnLayout()){var i=new F();y.oNavigationHost=i;y.aNavigationObservers=[new P({processName:"BeginColumnNavigation",eventHandlers:{attachProcessStart:i.attachBeginColumnNavigate.bind(i),attachProcessStop:i.attachAfterBeginColumnNavigate.bind(i)}}),new P({processName:"MidColumnNavigation",eventHandlers:{attachProcessStart:i.attachMidColumnNavigate.bind(i),attachProcessStop:i.attachAfterMidColumnNavigate.bind(i)}}),new P({processName:"EndColumnNavigation",eventHandlers:{attachProcessStart:i.attachEndColumnNavigate.bind(i),attachProcessStop:i.attachAfterEndColumnNavigate.bind(i)}})];y.oNavigationObserver=new P({processObservers:y.aNavigationObservers});y.aHeaderLoadingObservers=[p(),p(),p()];}else{var i1=new N({id:w.getId()+"-appContent"});y.oNavigationHost=i1;y.oNavigationObserver=new P({processName:"Navigation",eventHandlers:{attachProcessStart:i1.attachNavigate.bind(i1),attachProcessStop:i1.attachAfterNavigate.bind(i1)}});}y.oHeaderLoadingObserver=new P({processObservers:y.aHeaderLoadingObservers||[]});y.oPagesDataLoadedObserver=new P({processObservers:[y.oHeaderLoadingObserver,y.oNavigationObserver]});y.oNavigationHost.addStyleClass(y.oApplicationProxy.getContentDensityClass());y.oBusyHelper=new B(y);y.oBusyHelper.setBusyReason("HashChange",true,true);y.oBusyHelper.getUnbusy().then(function(){y.oShellServicePromise.then(function(j1){j1.setBackNavigation(y.oApplicationProxy.onBackButtonPressed);});});return y.oNavigationHost;}function O(){var i=sap.ushell&&sap.ushell.Container;if(i){i.deregisterDirtyStateProvider(g1);}y.ghostapp=true;if(y.oNavigationHost){y.oNavigationHost.destroy();}if(z){z.destroy();}if(E){E.destroy();}if(y.oValidationMessageBinding){y.oValidationMessageBinding.destroy();}h.setAppComponent(null);(U.prototype.exit||Function.prototype).apply(w,arguments);G();t.endApp(x);}function Q(){var i=sap.ushell&&sap.ushell.Container;if(i){i.deregisterDirtyStateProvider(g1);}y.ghostapp=true;y.oNavigationControllerProxy.suspend();}function S(){var i=sap.ushell&&sap.ushell.Container;if(i){i.registerDirtyStateProvider(g1);}y.ghostapp=false;y.oNavigationControllerProxy.restore();}function W(i){var i1=Object.keys(i).map(function(j1){var k1=i[j1];if(k1.pages){k1.pages=W(k1.pages);}return i[j1];});return i1;}function X(b1){if(b1._version==="1.3.0"&&b1.pages&&a(b1.pages)){b1.pages=W(b1.pages);}}function Y(i1,j1){if(!i1){return;}for(var i=0;i<i1.length;i++){var k1=i1[i];if(k1.routingSpec&&k1.routingSpec.noOData){k1.entitySet=k1.routingSpec.routeName;if(j1>1){k1.navigationProperty=k1.routingSpec.routeName;}}Y(k1.pages,j1+1);if(k1.embeddedComponents){for(var l1 in k1.embeddedComponents){var m1=k1.embeddedComponents[l1];if(m1.pages){m1.pages=W(m1.pages);Y(m1.pages,j1+1);}}}if(k1.implementingComponent&&k1.implementingComponent.pages){k1.implementingComponent.pages=W(k1.implementingComponent.pages);Y(k1.implementingComponent.pages,j1+1);}}}function Z(b1){Y(b1.pages,0);}function $(i){if(i){var i1=i.entitySet;var j1=(i.component&&i.component.settings&&i.component.settings.quickVariantSelectionX&&i.component.settings.quickVariantSelectionX.variants)||{};var k1=function(j1){for(var l1 in j1){var m1=j1[l1];if(m1.entitySet){return true;}}return false;};if(k1(j1)){for(var l1 in j1){var m1=j1[l1];if(m1.entitySet===undefined){m1.entitySet=i1;}}}}}function _(b1){$(b1.pages[0]);}function a1(i){if(i&&i.objectPageDynamicHeaderTitleWithVM){i.objectPageHeaderType=i.objectPageHeaderType||"Dynamic";i.objectPageVariantManagement=i.objectPageVariantManagement||"VendorLayer";}}var b1;function c1(){if(!b1){var i=w.getMetadata();b1=i.getManifestEntry("sap.ui.generic.app");if(!b1){return Object.create(null);}X(b1);Z(b1);_(b1);a1(b1.settings);}return b1;}var d1;function e1(){if(!d1){d1=e({},w.getMetadata().getManifest());d1["sap.ui.generic.app"]=c1();}return d1;}function f1(){var i=w.getFlexibleColumnLayout()?"f":"m";return"sap."+i+".routing.Router";}function g1(i){return!y.ghostapp&&y.oDataLossHandler.getShellDataLossPopup(i);}var h1={init:K,createContent:L,exit:O,suspend:Q,restore:S,_getRouterClassName:f1,getConfig:c1,getInternalManifest:e1,getTransactionController:function(){return z.getTransactionController();},getApplicationController:function(){return z;},getNavigationController:function(){return E;},navigateBasedOnStartupParameter:function(i){y.oNavigationControllerProxy.clearHistory().then(s.parametersToNavigation.bind(null,y,i));}};var X=t.testable(X,"fnNormalizePagesMapToArray");c1=t.testable(c1,"getConfig");return h1;}return U.extend("sap.suite.ui.generic.template.lib.AppComponent",{metadata:{config:{title:"SAP UI Application Component",fullWidth:true},properties:{forceGlobalRefresh:{type:"boolean",defaultValue:true},considerAnalyticalParameters:{type:"boolean",defaultValue:false},showDraftToggle:{type:"boolean",defaultValue:false},objectPageHeaderType:{type:"string",defaultValue:"Static"},objectPageVariantManagement:{type:"string",defaultValue:"None"},flexibleColumnLayout:{type:"object",defaultValue:null},inboundParameters:{type:"object",defaultValue:null},tableColumnVerticalAlignment:{type:"string",defaultValue:"Middle"},useColumnLayoutForSmartForm:{type:"boolean",defaultValue:true},statePreservationMode:{type:"string",defaultValue:"discovery"},enableAutoColumnWidthForSmartTable:{type:"boolean",defaultValue:true}},events:{pageDataLoaded:{}},routing:{config:{async:true,viewType:"XML",viewPath:"",clearTarget:false},routes:[],targets:[]},library:"sap.suite.ui.generic.template"},suppressDataLossPopup:function(){return false;},constructor:function(){var i=t.startApp();e(this,u(this,i));(U.prototype.constructor||Function.prototype).apply(this,arguments);}});});