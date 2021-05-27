/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP AG. All rights reserved
 */
sap.ui.define(['sap/apf/ui/utils/constants','sap/apf/core/constants','sap/apf/ui/reuse/view/analysisPath.view','sap/apf/ui/reuse/view/carousel.view','sap/apf/utils/trace'],function(u,c,A,C,t){'use strict';function s(o,f,S){var l=o.getLayoutView();var a=l.byId("subHeader");var b=l.byId("idSplitterLayoutData");a.addContent(f);if(!(f instanceof sap.ui.comp.smartfilterbar.SmartFilterBar)){b.setSize("65px");}f.addEventDelegate({onAfterRendering:function(){a.setBusy(false);if(f instanceof sap.ui.comp.smartfilterbar.SmartFilterBar){a.setHeight("");a.addStyleClass(S);}}});}function r(o){o.getLayoutView().byId("subHeader").setBusy(false);}function I(i){i.uiApi=this;var o=i.oCoreApi;var S=i.oStartFilterHandler;var a;var m;var b;var d;var e;var f;var p;var g;var h;var F,j;var k=o.getUriGenerator().getApfLocation();this.oEventCallbacks={};var l;jQuery.sap.includeStyleSheet(k+"resources/css/apfUi.css","apfCss");jQuery.sap.includeStyleSheet(k+"resources/css/apfPrint.css","printCss");jQuery("#printCss").attr("media","print");this.getAddAnalysisStepButton=function(){return this.getAnalysisPath().getCarouselView().getAddStepButton();};this.getAnalysisPath=function(){if(a===undefined){a=sap.ui.view({viewName:"sap.apf.ui.reuse.view.analysisPath",type:sap.ui.core.mvc.ViewType.JS,viewData:i,async:true});}return a;};this.getNotificationBar=function(){if(m===undefined){m=sap.ui.view({viewName:"sap.apf.ui.reuse.view.messageHandler",type:sap.ui.core.mvc.ViewType.JS,viewData:i,async:true});}return m;};this.getStepContainer=function(){if(b===undefined){b=sap.ui.view({viewName:"sap.apf.ui.reuse.view.stepContainer",type:sap.ui.core.mvc.ViewType.JS,viewData:i,async:true});}return b;};this.getToolbar=function(){if(d===undefined){d=sap.ui.view({viewName:"sap.apf.ui.reuse.view.toolbar",type:sap.ui.core.mvc.ViewType.JS,viewData:i,async:true});}return d;};this.createCarouselSingleton=function(){if(i&&i.functions&&i.functions.createCarouselSingleton){e=i.functions.createCarouselSingleton();}if(e===undefined){e=sap.ui.view({viewName:"sap.apf.ui.reuse.view.carousel",type:sap.ui.core.mvc.ViewType.JS,viewData:{oInject:i},async:true});}return e;};this.getStepGallery=function(){if(f===undefined){f=sap.ui.view({type:sap.ui.core.mvc.ViewType.JS,viewName:"sap.apf.ui.reuse.view.stepGallery",viewData:i,async:true});}return f;};this.getPathGallery=function(){if(p===undefined){p=sap.ui.view({viewName:"sap.apf.ui.reuse.view.pathGallery",type:sap.ui.core.mvc.ViewType.JS,viewData:{oInject:i},async:true});}return p;};this.getDeleteAnalysisPath=function(){if(g===undefined){g=sap.ui.view({viewName:"sap.apf.ui.reuse.view.deleteAnalysisPath",type:sap.ui.core.mvc.ViewType.JS,viewData:{oInject:i},async:true});}return g;};this.getLayoutView=function(){if(h===undefined){h=sap.ui.view({viewName:"sap.apf.ui.reuse.view.layout",type:sap.ui.core.mvc.ViewType.XML,viewData:i,async:true});}return h;};this.selectionChanged=function(R){t.logCall("ui/Instance.selectionChanged",", bRefreshAllSteps: ",R,"--------");var w;var x=this;function y(){if(h){h.getController().enableDisableOpenIn();}}w=o.getSteps().indexOf(o.getActiveStep());var z=0;w=o.getSteps().indexOf(o.getActiveStep());if(!R){z=w+1;}t.logCall("...",", nActiveStepIndex: ",w,", indexOfRefresh",z);x.getAnalysisPath().getController().refresh(z);x.getAnalysisPath().getController().getView().getCarouselView().getController().setBusyFromIndex(z);o.updatePath(x.getAnalysisPath().getController().callBackForUpdatePath.bind(x.getAnalysisPath().getController()),function(){y();});t.logReturn("ui/Instance.selectionChanged");};var n=false;this.createApplicationLayout=function(w){var x=this;return new Promise(function(y){if(!n){var z=x.getStepGallery().loaded();var B=x.getToolbar().loaded();var D=x.getPathGallery().loaded();var E=x.getDeleteAnalysisPath().loaded();var G=x.getStepContainer().loaded();var H=Promise.all([z]).then(function(){return x.createCarouselSingleton().loaded();});var J=Promise.all([B,H,D,E]).then(function(){return x.getAnalysisPath().loaded();});var K=Promise.all([G,J]).then(function(){return x.getLayoutView().loaded();});K.then(function(){w.addPage(h);n=true;l=w;y(w);});}else{y(l);}});};this.addDetailFooterContent=function(w){this.getLayoutView().getController().addDetailFooterContentLeft(w);};this.addMasterFooterContentRight=function(w){this.getLayoutView().getController().addMasterFooterContentRight(w);};this.setEventCallback=function(E,w){this.oEventCallbacks[E]=w;};this.getEventCallback=function(E){return this.oEventCallbacks[E];};this.getCustomFormatExit=function(){return i.exits;};this.setCustomFormatExit=function(w){var x=this.getCustomFormatExit();x.customFormat=w;};this.drawSmartFilterBar=function(w){var x=this;function y(z){o.getSmartFilterbarDefaultFilterValues().done(function(B){j=sap.ui.view({viewName:"sap.apf.ui.reuse.view.smartFilterBar",type:sap.ui.core.mvc.ViewType.JS,viewData:{oCoreApi:o,oUiApi:x,oSmartFilterBarConfiguration:z,controlConfiguration:B,parent:x.getLayoutView()},async:true});j.loaded().then(function(V){s(x,V.byId("idAPFSmartFilterBar"),"smartFilterBarContainer");});});}if(w){if(w.entitySet){y(w);}else{o.getMetadata(w.service).done(function(z){w.entitySet=z.getEntitySetByEntityType(w.entityType);delete w.entityType;y(w);});}}else{r(x);}};this.drawFacetFilter=function(w){if(w.length>0){var x=this;F=sap.ui.view({viewName:"sap.apf.ui.reuse.view.facetFilter",type:sap.ui.core.mvc.ViewType.JS,viewData:{oCoreApi:o,oUiApi:this,aConfiguredFilters:w,oStartFilterHandler:S},async:true});F.loaded().then(function(V){s(x,V.byId("idAPFFacetFilter"));});}else{r(this);}};this.contextChanged=function(R){var w=this.getEventCallback(c.eventTypes.contextChanged);if(typeof w==="function"){w();}};this.getFacetFilterForPrint=function(){if(F){return F.byId("idAPFFacetFilter");}};this.getSmartFilterForPrint=function(){if(j){return j.byId("idAPFSmartFilterBar");}};this.handleStartup=function(w){var x=this;var y=jQuery.Deferred();o.getSmartFilterBarConfigurationAsPromise().done(function(z){if(z){x.drawSmartFilterBar(z);}w.done(function(B){var D=S.getStartFilters();D.done(function(E){x.contextChanged();if(!z){x.drawFacetFilter(E);}if(B.navigationMode==="backward"){x.getAnalysisPath().getController().isBackNavigation=true;o.updatePath(x.getAnalysisPath().getController().callBackForUpdatePath.bind(x.getAnalysisPath().getController()));x.getLayoutView().getController().setPathTitle();}if(B.navigationMode==="forward"){if(o.getStartParameterFacade().getSteps()){var G=o.getStartParameterFacade().getSteps()[0].stepId;var H=o.getStartParameterFacade().getSteps()[0].representationId;var J=x.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(x.getAnalysisPath().getController());o.createFirstStep(G,H,J);}if(sap.ui.core.BusyIndicator){sap.ui.core.BusyIndicator.hide();}}x.getNotificationBar().loaded().then(function(M){x.getLayoutView().byId("applicationPage").addContent(M);var K=M.getController().showMessage;o.setCallbackForMessageHandling(K.bind(M.getController()));y.resolve();});});});});return y.promise();};this.destroy=function(){F=undefined;j=undefined;if(a){var w=this.getAnalysisPath().getToolbar().getController();q(w.saveDialog);q(w.newOpenDialog);q(w.newDialog);q(w.confirmDialog);q(w.errorMsgDialog);q(w.noPathAddedDialog);if(w.deleteAnalysisPath!==undefined){q(w.deleteAnalysisPath.getController().oDialog);}if(w.pathGallery!==undefined){q(w.pathGallery.getController().oDialog);}var x=this.getAnalysisPath().getCarouselView().getStepGallery().getController();q(x.oHierchicalSelectDialog);}if(b){var y=this.getStepContainer().getController();q(y.selectionDisplayDialog);v(this);}};function q(w){if(w!==undefined){if(w instanceof sap.m.ViewSettingsDialog){w.destroy();}else if(w.isOpen()){w.close();}}}function v(w){var x=false;var y=false;var z;if(w.getStepContainer().getViewData().oCoreApi.getActiveStep()!==undefined){x=true;}if(x){z=w.getStepContainer().getViewData().oCoreApi.getActiveStep().getSelectedRepresentation();if(z!==undefined){y=true;}}if(y){if(z.type!==u.representationTypes.TABLE_REPRESENTATION){if(z.toggleInstance!==undefined){q(z.toggleInstance.viewSettingsDialog);}}else{q(z.viewSettingsDialog);}}}}sap.apf.ui.Instance=I;return I;},true);