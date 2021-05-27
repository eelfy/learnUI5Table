sap.ui.define(["sap/ui/base/Object","sap/ui/base/Event","sap/ui/core/mvc/ControllerExtension","sap/ui/model/Context","sap/ui/model/Filter","sap/m/Table","sap/m/ListBase","sap/m/MessageBox","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/generic/app/navigation/service/NavError","sap/suite/ui/generic/template/genericUtilities/controlHelper","sap/suite/ui/generic/template/genericUtilities/metadataAnalyser","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/ui/model/analytics/odata4analytics","sap/base/util/extend","sap/base/util/deepExtend","sap/suite/ui/generic/template/genericUtilities/FeError","sap/suite/ui/generic/template/js/StableIdHelper"],function(B,E,C,a,F,R,L,M,S,N,c,m,t,b,o,d,f,g,h){"use strict";var s="lib.CommonUtils";var l=sap.ui.getCore();var n=new b(s).getLogger();function p(q,r,u){var v;var w=Object.create(null);var O=Object.create(null);function P(e){var i;if(c.isSmartTable(e)){i=e.getCustomToolbar();}else if(c.isSmartChart(e)){i=e.getToolbar();}if(i){var j=V(i);if(j&&j.annotatedActionIds){O[e.getId()]=JSON.parse(atob(j.annotatedActionIds));}if(j&&j.deleteButtonId){O[e.getId()].push({ID:j.deleteButtonId,RecordType:"CRUDActionDelete"});}}}function G(e){if(!O[e.getId()]){P(e);}return O[e.getId()];}function x(e){var i,j,k,K1;i=e.getEntitySet();j=q.getOwnerComponent().getModel().getMetaModel();k=j.getODataEntitySet(i);K1=j.getODataEntityType(k.entityType);return K1;}function y(e,i,j){var k=e instanceof E?e.getSource():e;var K1=k.getId();var L1=w[K1];if(!L1){if(j){return null;}L1={control:k,infoObject:Object.create(null),categories:[]};(i||Function.prototype)(L1.infoObject,L1.categories,k);w[K1]=L1;}return L1.infoObject;}function z(e,i){for(var j in w){var k=w[j];if(k.categories.indexOf(e)>=0){i(k.infoObject,k.control);}}}function A(e){r.oApplication.attachControlToParent(e,q.getView());}function D(e,j){var k="";var K1=q.getView();for(var i=0;i<e.length;i++){var L1=e[i];if(c.isElementVisibleOnView(L1,K1)){if(j){var M1=l.byId(L1);if(c.isSmartTable(M1)||c.isMTable(M1)||c.isUiTable(M1)){k=k||L1;continue;}}return L1;}}return k;}function H(e,i,j,k){return r.oApplication.getDialogFragmentForView(q.getView(),e,i,j,k);}function I(e,i,j,k,K1){return r.oApplication.getDialogFragmentForViewAsync(q.getView(),e,i,j,k,K1);}var J;function K(){var e=q.getOwnerComponent();J=J||e.getModel("i18n").getResourceBundle();return J.getText.apply(J,arguments);}function Q(k,e,i,j){var K1,L1,M1,N1;var O1=q.getOwnerComponent();var P1=e.indexOf("::"+O1.getEntitySet()+"--")+2;K1=e.substring(P1,e.lastIndexOf("::"));K1=K1.replace(/--/g,"|").replace(/::/g,"|");M1=i||k;L1=K1&&K1!='|'?k+"|"+K1:M1;N1=K(L1,j);if(N1===L1&&L1!=M1){N1=K(M1,j);}return N1;}function T(e,i){var i=i||e.getSelectionBehavior();if(i==="DATAPOINT"){return{"dataPoints":e.getSelectedDataPoints().dataPoints,"count":e.getSelectedDataPoints().count};}else if(i==="CATEGORY"){return{"dataPoints":e.getSelectedCategories().categories,"count":e.getSelectedCategories().count};}else if(i==="SERIES"){return{"dataPoints":e.getSelectedSeries().series,"count":e.getSelectedSeries().count};}}function U(e,j,k){var K1=[];if(c.isSmartTable(e)){e=e.getTable();}else if(c.isSmartChart(e)){e.getChartAsync().then(function(O1){e=O1;if(e&&e.getMetadata().getName()==="sap.chart.Chart"){var P1=false;j=j||e.getSelectionBehavior();k=k||T(e,j);if(k&&k.count>0){if(j==="DATAPOINT"){P1=true;}var Q1=k.dataPoints;var R1=[];for(var i=0;i<Q1.length;i++){if(P1){if(Q1[i].context){K1.push(Q1[i].context);}}else{R1.push(Q1[i].dimensions);}}if(!P1){K1[0]=R1;}}}});}if(e instanceof L){K1=e.getSelectedContexts();}else if(c.isUiTable(e)){var L1=e.getPlugins().filter(function(O1){return O1.isA("sap.ui.table.plugins.SelectionPlugin");})[0];var M1=L1?L1.getSelectedIndices():e.getSelectedIndices();if(M1){var N1;for(var i=0;i<M1.length;i++){N1=e.getContextByIndex(M1[i]);if(N1){K1.push(N1);}}}}return K1;}function V(e){var i={};if(e instanceof sap.ui.core.Element){e.getCustomData().forEach(function(j){i[j.getKey()]=j.getValue();});}return i;}function W(e){var j,k,K1;var L1=h1(e);if(!c.isSmartTable(L1)&&!c.isSmartChart(L1)){L1=L1.getParent();}var M1=U(L1);var N1=L1.getModel();k=e1(L1);c1(k,M1,N1,L1);j=G(L1);for(var i=0;i<j.length;i++){K1=j[i];X(K1,N1,M1,L1);}if(u.getParameterModelForTemplating().getData().templateSpecific.multiEdit){var O1=b1(M1,L1);var P1=h.getStableId({type:"ListReportAction",subType:"MultiEdit"});Z(P1,"enabled",O1.length>0);}}function X(e,i,j,k){var K1;if(e.RecordType==="CRUDActionDelete"){var L1=_(i,j,k);u.getTemplatePrivateModel().setProperty("/listReport/deleteEnabled",L1);K1=Promise.resolve(L1);}else if(e.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||e.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){var M1=i.getMetaModel();K1=$(i,M1,j,e.RecordType,e.Action,k);}var N1=q.getView().byId(e.ID);if(N1&&/generic\/controlProperties/.test(N1.getBindingPath("enabled"))){K1.then(Z.bind(null,e.ID,"enabled"));}}function Y(e){var i;var j=h1(e);var k=U(j);var K1=e.getModel();i=f1();c1(i,k,K1,j);}function Z(i,e,j){var k=u.getTemplatePrivateModel();var K1=k.getProperty("/generic/controlProperties/"+i);if(!K1){K1={};K1[e]=j;k.setProperty("/generic/controlProperties/"+i,K1);}else{k.setProperty("/generic/controlProperties/"+i+"/"+e,j);}}function $(e,i,k,K1,L1,M1){var N1,O1,P1,Q1;var R1=false;if(K1==="com.sap.vocabularies.UI.v1.DataFieldForAction"){N1=i.getODataFunctionImport(L1);P1=N1&&N1["sap:action-for"];if(P1&&P1!==""&&P1!==" "){if(k.length>0){Q1=N1["sap:applicable-path"];if(Q1&&Q1!==""&&Q1!==" "){for(var j=0;j<k.length;j++){if(!k[j]){continue;}O1=e.getObject(k[j].getPath());if(O1&&O1[Q1]){R1=true;break;}}}else{R1=true;}}}else{R1=true;}}else if(K1==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){if(k.length>0){R1=true;}else if(c.isSmartChart(M1)){return M1.getChartAsync().then(function(){return M1.getDrillStackFilters().length>0;});}}return Promise.resolve(R1);}function _(e,i,j){if(i.length===0){return false;}var k=a1(j);var K1=k&&k.Deletable&&k.Deletable.Path;return i.some(function(L1){var M1=e.getObject(L1.getPath()+"/DraftAdministrativeData");var N1=!(M1&&M1.InProcessByUser&&!M1.DraftIsProcessedByMe);return N1&&!(K1&&!e.getProperty(K1,L1));});}function a1(e){var i=e.getModel()&&e.getModel().getMetaModel();var j=i&&i.getODataEntitySet(e.getEntitySet());var k=j&&j["Org.OData.Capabilities.V1.DeleteRestrictions"];return k;}function b1(e,i){if(e.length===0){return[];}var j=[];var k=i.getModel();var K1=k.getMetaModel();var L1=K1.getODataEntitySet(i.getEntitySet());var M1=L1["Org.OData.Capabilities.V1.UpdateRestrictions"]&&L1["Org.OData.Capabilities.V1.UpdateRestrictions"].Updatable;if(M1){if(M1.Path){j=e.filter(function(N1){return!!k.getProperty(M1.Path,N1);});}else if(M1.Bool!=="false"){j=e;}}return j;}function c1(e,i,j,k){var K1=g1(k);var L1=u.getTemplatePrivateModel();var M1=L1.getProperty("/generic/listCommons/breakoutActionsEnabled");if(K1){var N1=q.byId("template::IconTabBar");var O1="";if(N1){O1=N1.getSelectedKey();}d1(M1,K1,e,i,j,O1,k);}L1.setProperty("/generic/listCommons/breakoutActionsEnabled",M1);}function d1(e,i,j,k,K1,L1,M1){var N1;for(var O1 in i){N1=true;var P1=i[O1].id+((L1&&!i[O1].determining)?"-"+L1:"");if(M1&&M1.getId().indexOf("AnalyticalListPage")>-1){N1=!!e[P1].enabled;}if(i[O1].requiresSelection){if(k.length>0){if(M1&&c.isSmartChart(M1)){if(i[O1].filter==="chart"){N1=true;}}else if(M1&&c.isSmartTable(M1)){if(i[O1].filter!=="chart"){N1=true;}}if(i[O1].applicablePath!==undefined&&i[O1].applicablePath!==""){N1=false;for(var Q1=0;Q1<k.length;Q1++){var R1="";var S1=i[O1].applicablePath.split("/");if(S1.length>1){for(var T1=0;T1<S1.length-1;T1++){R1+="/"+S1[T1];}}var U1=K1.getObject(k[Q1].getPath()+R1);var V1=S1[S1.length-1];if(U1[V1]===true){N1=true;break;}}}}else if(c.isSmartChart(M1)){if((M1.getId().indexOf("AnalyticalListPage")>-1?i[O1].filter==="chart":true)){if(M1.getDrillStackFilters().length>0){N1=true;}else{N1=false;}}}else{if(i[O1].filter!=="chart"){N1=false;}}}e[P1]={enabled:N1};}}function e1(e){var i=[];var j=g1(e);for(var k in j){i.push(j[k].id);}return i;}function f1(){var e=[];var i=g1();for(var j in i){if(i[j].determining){e.push(j);}}return e;}function g1(e){var i=u.getControllerExtensions();var j=V(e).sectionId;if(!j){return i&&i["Actions"];}else{return i&&i.Sections&&i.Sections[j]&&i.Sections[j].Actions;}}function h1(e){var i=e;while(i){if(i instanceof R||c.isUiTable(i)||c.isSmartTable(i)||c.isSmartChart(i)){return i;}i=i.getParent&&i.getParent();}return null;}function i1(e){if(c.isSmartTable(e)){e=e.getTable();}if(c.isUiTable(e)){return e.getBindingInfo("rows");}else if(e instanceof R){return e.getBindingInfo("items");}return null;}function j1(e,i,j){var k=i1(e);if(k&&k.binding){if(i){k.binding.refresh(i);}else{k.binding.refresh();}if(!j&&q.getView().getModel("ui").getProperty("/editable")){u.messagesRefresh();}}else if(e&&e.rebindTable){e.rebindTable();}}function k1(e,i){var j=q.getOwnerComponent();var k=j.getModel();var K1,L1;var M1=!r.oApplication.checkEtags();if(M1){L1=i1(e);if(L1){K1=L1.path;var N1=e.getEntitySet();var O1=k.getMetaModel();var P1=O1.getODataEntitySet(N1);if(q.getMetadata().getName()==='sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage'&&l1(k,P1)){k.invalidateEntityType(P1.entityType);}else{k.invalidate(m1.bind(null,K1));}var Q1=j.getId();var R1=Object.create(null);R1[Q1]=true;r.oApplication.refreshAllComponents(R1);return true;}}return false;}function l1(e,i){var j=new o.Model(o.Model.ReferenceByModel(e));var k=j.findQueryResultByName(i.name);var K1=k&&k.getParameterization();return!!K1;}function m1(e,k,i){var j=e[0]==="/"?e.substr(1):e;if(k.split("(")[0]===j){return true;}else{return false;}}function n1(e,i){var j;if(u.isDraftEnabled()){j=r.oDraftController.isActiveEntity(e)?1:6;}else{var k=q.getOwnerComponent();j=k.getModel("ui").getProperty("/editable")?6:1;}u.navigateAccordingToContext(e,j,i);}function o1(e){if(e instanceof N){if(e.getErrorCode()==="NavigationHandler.isIntentSupported.notSupported"){M.show(K("ST_NAV_ERROR_NOT_AUTHORIZED_DESC"),{title:K("ST_GENERIC_ERROR_TITLE")});}else{M.show(e.getErrorCode(),{title:K("ST_GENERIC_ERROR_TITLE")});}}}function p1(e,i){B1(function(){v=r.oApplication.getNavigationHandler();var j={semanticObject:e.semanticObject,action:e.action};var k=v.mixAttributesAndSelectionVariant(e.parameters);if(typeof q.adaptNavigationParameterExtension==="function"){q.adaptNavigationParameterExtension(k,j);}v.navigate(e.semanticObject,e.action,k.toJSONString(),null,o1);},Function.prototype,i,"LeavePage");}function q1(e){var K1=[],L1,M1,N1;var O1=q.getOwnerComponent();var P1=O1.getModel().getMetaModel();if(!e){return{};}var Q1=O1.getAppComponent().getConfig().pages[0];if(!Q1){return{};}var R1=function(i){N1=P1.getODataEntitySet(i.entitySet).entityType;M1=P1.getODataEntityType(N1);L1={};L1={entitySet:i.entitySet,aKeys:P1.getODataEntityType(N1).key.propertyRef,navigationProperty:i.navigationProperty};for(var j=0,T1=L1.aKeys.length;j<T1;j++){var k=0,U1=M1.property.length;for(k;k<U1;k++){if(L1.aKeys[j].name===M1.property[k].name){L1.aKeys[j].type=M1.property[k].type;break;}}}};var S1=function(e,Q1){if(!Q1.pages){return K1;}for(var i=0,j=Q1.pages.length;i<j;i++){if(!Q1.pages[i]){break;}if(e===Q1.pages[i].entitySet){R1(Q1.pages[i]);K1.splice(0,0,L1);break;}K1=S1(e,Q1.pages[i]);if(K1.length>0){R1(Q1.pages[i]);K1.splice(0,0,L1);}}return K1;};return S1(e,Q1);}function r1(k,e){var K1,L1,i,M1;for(i=0,M1=k.length;i<M1;i++){if(k[i].navigationProperty){L1+="/"+k[i].navigationProperty;}else{L1="/"+k[i].entitySet;}for(var j=0,N1=k[i].aKeys.length;j<N1;j++){if(j===0){L1+="(";K1="";}else{K1=",";}switch(k[i].aKeys[j].type){case"Edm.Guid":if(e.DraftAdministrativeData&&e.DraftAdministrativeData.DraftIsCreatedByMe){L1+=K1+k[i].aKeys[j].name+"="+"guid'"+e.DraftAdministrativeData.DraftUUID+"'";}else{L1+=K1+k[i].aKeys[j].name+"="+"guid'"+e[k[i].aKeys[j].name]+"'";}break;case"Edm.Boolean":if(e.DraftAdministrativeData&&e.DraftAdministrativeData.DraftIsCreatedByMe){L1+=K1+k[i].aKeys[j].name+"="+false;}else{L1+=K1+k[i].aKeys[j].name+"="+e[k[i].aKeys[j].name];}break;default:if(typeof e[k[i].aKeys[j].name]==="string"){L1+=K1+k[i].aKeys[j].name+"="+"'"+e[k[i].aKeys[j].name]+"'";}else{L1+=K1+k[i].aKeys[j].name+"="+e[k[i].aKeys[j].name];}break;}if(j===(N1-1)){L1+=")";}}}return L1;}function s1(e,k,q){var K1,L1,M1,N1,O1,P1,Q1;var R1={semanticObject:"",action:""};var S1=e.getParameters();v=r.oApplication.getNavigationHandler();K1=v.mixAttributesAndSelectionVariant({},k);for(N1 in S1.semanticAttributesOfSemanticObjects){for(M1 in S1.semanticAttributesOfSemanticObjects[N1]){if(!K1.getSelectOption(M1)){K1.addParameter(M1,"");}}O1=K1.getPropertyNames();R1.semanticObject=N1;P1=K1.getSelectOptionsPropertyNames();Q1=K1.getParameterNames();for(var i=0,T1=O1.length;i<T1;i++){if(P1.indexOf(O1[i])<0&&Q1.indexOf(O1[i])<0){delete S1.semanticAttributesOfSemanticObjects[N1][O1[i]];K1.removeSelectOption(O1[i]);}}if(N1===S1.semanticObject){var U1=S1.semanticAttributesOfSemanticObjects[""];for(var j=0,T1=Q1.length;j<T1;j++){K1.removeParameter(Q1[j]);if(!(Q1[j]in U1)){var V1=S1.semanticAttributesOfSemanticObjects[S1.semanticObject][Q1[j]];V1=(typeof V1==="undefined"||V1===null)?"":String(V1);K1.addParameter(Q1[j],V1);}}K1=v.mixAttributesAndSelectionVariant(S1.semanticAttributesOfSemanticObjects[N1],K1.toJSONString());K1=t1(K1,e.getSource());q.adaptNavigationParameterExtension(K1,R1);L1=K1.toJSONString();}}delete S1.semanticAttributes;v.processBeforeSmartLinkPopoverOpens(S1,L1);}function t1(e,i){var j;if(!c.isSemanticObjectController(i)&&!c.isSmartTable(i)){var k=h1(i)&&h1(i).getParent();if(c.isSmartTable(k)){i=k;j=i.getEntitySet();}else{j=q.getOwnerComponent().getEntitySet();}}else{j=i.getEntitySet();}var K1=i.getModel().getMetaModel();var L1=K1.getODataEntityType(K1.getODataEntitySet(j).entityType);e.getPropertyNames().forEach(function(M1){var N1=K1.getODataProperty(L1,M1);if(N1&&((N1["com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"]&&N1["com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"].Bool!=="false")||(N1["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]&&N1["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"].Bool!=="false"))){e.removeSelectOption(M1);}});return e;}function u1(e,j){var k=function(O1){for(var i=0;i<O1.length;i++){j(O1[i].name);}};var K1=q.getView().getModel().getMetaModel();var L1=K1.getODataEntitySet(e,false);var M1=K1.getODataEntityType(L1.entityType,false);k(M1.key.propertyRef);var N1=r.oDraftController.getDraftContext();if(N1.isDraftEnabled(e)){k(N1.getSemanticKey(e));j("IsActiveEntity");j("HasDraftEntity");j("HasActiveEntity");}}function v1(i,j,k,K1){if(K1&&k&&k.getAnalyticBindingPath&&k.getConsiderAnalyticalParameters()){try{var L1=k.getAnalyticBindingPath();var M1=i.getEntitySet();var N1=i.getModel();var O1=N1.getMetaModel();var P1=O1.getODataEntitySet(M1);var Q1=q.getOwnerComponent();var R1=Q1.getAppComponent();var S1=m.getParametersByEntitySet(R1.getModel(),M1);if(j){L1=j(P1,S1);}if(L1){K1(L1);}}catch(e){n.warning("Mandatory parameters have no values");}}}function w1(e,j,k){for(var i=0;i<j.length;i++){var K1=j[i];var L1=K1.lastIndexOf("/");var M1;if(L1<0){if(r.oApplication.getNavigationProperty(e,K1)){M1=K1;}else{continue;}}else{M1=K1.substring(0,L1);}if(k.indexOf(M1)===-1){k.push(M1);}}}function x1(e,i,j){var k=e.getParameter("bindingParams"),K1=e.getSource().getId();k.parameters=k.parameters||{};k.parameters.transitionMessagesOnly=u.getNoStateMessagesForTables();var L1=function(S1,T1,K1){if(i&&i[S1]){var U1=true;var V1=function(){var W1=arguments[0];if(!(W1 instanceof C)){throw new g(s,"Please provide a valid ControllerExtension in order to execute extension "+S1);}if(!U1){throw new g(s,"Extension "+S1+" must be executed synchronously");}var X1=Array.prototype.slice.call(arguments,1);T1.apply(null,X1);};i[S1](V1,K1);U1=false;}};var M1=function(S1){if(!K1||q.byId(K1)===e.getSource()){k.filters.push(S1);}};if(i.addTemplateSpecificFilters){i.addTemplateSpecificFilters(k.filters);}L1("addExtensionFilters",M1,K1);var N1=e.getSource();if(q.getMetadata().getName()!=='sap.suite.ui.generic.template.ObjectPage.view.Details'){v1(N1,i.resolveParamaterizedEntitySet,j,i.setBindingPath);}var O1=N1.getEntitySet();var P1=k.parameters.select&&k.parameters.select.split(",")||[];var Q1=k.parameters.expand&&k.parameters.expand.split(",")||[];var R1=function(S1,K1){if(S1&&(!K1||q.byId(K1)===e.getSource())){var T1=S1.split(',');T1.forEach(function(U1){if(U1&&P1.indexOf(U1)===-1){P1.push(U1);}});}};if(i.isMandatoryFiltersRequired){u1(O1,R1);}L1("ensureExtensionFields",R1,K1);(i.addNecessaryFields||Function.prototype)(P1,R1,O1);w1(O1,P1,Q1);if(Q1.length>0){k.parameters.expand=Q1.join(",");}if(P1.length>0){k.parameters.select=P1.join(",");}}function y1(e,i,j){if(!e){return K("DRAFT_OBJECT");}else if(i){return K(j?"LOCKED_OBJECT":"UNSAVED_CHANGES");}else{return"";}}function z1(){return new Promise(function(e){var i;I("sap.suite.ui.generic.template.fragments.DraftAdminDataPopover",{formatText:function(){var j=Array.prototype.slice.call(arguments,1);var k=arguments[0];if(!k){return"";}if(j.length>0&&(j[0]===null||j[0]===undefined||j[0]==="")){if(j.length>3&&(j[3]===null||j[3]===undefined||j[3]==="")){return(j.length>2&&(j[1]===null||j[1]===undefined||j[1]===""))?"":j[2];}else{return K(k,j[3]);}}else{return K(k,j[0]);}},closeDraftAdminPopover:function(){i.close();},formatDraftLockText:y1},"admin").then(function(j){i=j;e(i);});});}function A1(e,i,j,k){return r.oDataLossHandler.performIfNoDataLoss(e,i,k,true,true);}function B1(e,i,j,k,K1){return r.oDataLossHandler.performIfNoDataLoss(e,i,k,K1,false);}function C1(e,i){i=f({busy:{set:true,check:true},dataloss:{popup:true,navigation:false}},i);var j,k;var K1=new Promise(function(O1,P1){j=O1;k=P1;});var L1=i.busy.set?function(){r.oApplication.getBusyHelper().setBusy(K1,false,{actionLabel:i.sActionLabel});return e();}:e;var M1=i.mConsiderObjectsAsDeleted?function(O1){r.oApplication.prepareDeletion(i.mConsiderObjectsAsDeleted);return L1();}:L1;var N1=function(){var O1=(i.dataloss.popup?B1(M1,k,null,(i.dataloss.navigation?"LeavePage":"Proceed"),true):M1());if(O1 instanceof Promise){O1.then(j,k);}else{j(O1);}};r.oApplication.performAfterSideEffectExecution(N1,i.busy.check&&k);return K1;}function D1(e){var i=e.getId()+"-variant";var j=sap.ui.getCore().byId(i);var k=j.getDefaultVariantKey();return k===j.STANDARDVARIANTKEY?"":k;}function E1(e){var i=e.getId()+"-variant";var j=sap.ui.getCore().byId(i);var k=j.getDefaultVariantKey();return k===j.STANDARDVARIANTKEY?"":k;}function F1(e){var j;var k=u.getTemplatePrivateModel();var K1=q.getOwnerComponent();var L1,M1,N1,O1,P1,Q1=[],R1=[],i,S1,T1,U1,V1,W1,X1;var Y1,Z1;L1=K1.getAppComponent();M1=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");N1=k.getProperty("/generic/supportedIntents/");if(c.isSmartChart(e)){j=e.getToolbar();}else if(c.isSmartTable(e)){j=e.getCustomToolbar();}O1=j.getContent();P1=O1.length;for(i=0;i<P1;i++){S1=V(O1[i]);if(S1.hasOwnProperty("SemanticObject")&&S1.hasOwnProperty("Action")){T1=S1.SemanticObject;U1=S1.Action;V1={semanticObject:T1,action:U1,ui5Component:L1};Q1.push([V1]);W1=d({},V1);W1.bLinkIsSupported=false;R1.push(W1);}}if(Q1.length>0&&M1){X1=M1.getLinks(Q1);X1.done(function($1){N1=k.getProperty("/generic/supportedIntents/");Y1=$1.length;for(i=0;i<Y1;i++){if($1[i][0].length>0){R1[i].bLinkIsSupported=true;}T1=R1[i].semanticObject;U1=R1[i].action;Z1=k.getProperty("/generic/supportedIntents/"+T1);if(!Z1){N1[T1]={};N1[T1][U1]={"visible":R1[i].bLinkIsSupported};}else if(!Z1[U1]){Z1[U1]={"visible":R1[i].bLinkIsSupported};}else{Z1[U1]["visible"]=R1[i].bLinkIsSupported;}}k.updateBindings();});}}function G1(e,i){var j=i&&q.byId(i);var k=(i&&!j)?Promise.reject():new Promise(function(K1,L1){r.oApplication.performAfterSideEffectExecution(function(){var M1=r.oApplication.getBusyHelper();if(M1.isBusy()){L1();return;}if(j&&(!j.getVisible()||(j.getEnabled&&!j.getEnabled()))){L1();return;}var k=j?e(j):e();if(k instanceof Promise){k.then(K1,L1);M1.setBusy(k);}else{K1(k);}});});k.catch(Function.prototype);return k;}function H1(e,i){var j=typeof i==="string"?JSON.parse(i):i;var k=j&&j.SortOrder;if(e.oSmartTable){I1(e.oSmartTable,k);}if(e.oSmartChart){I1(e.oSmartChart,k);}}function I1(e,i){var j=e.getUiState();var k=j.getPresentationVariant();if(!k.SortOrder&&e.isA("sap.ui.comp.smarttable.SmartTable")){var K1=e.getCustomData().find(function(Q1){return Q1.getKey()==="TemplateSortOrder";});var L1=K1&&K1&&K1.getValue();if(L1){k.SortOrder=[];var M1=L1.split(", ");M1.forEach(function(Q1){var R1=Q1.split(" ");if(R1.length>1){k.SortOrder.push({Property:R1[0],Descending:R1[1]==="true"});}});}}var N1=function(Q1){var R1=e.getModel().getMetaModel();var S1=R1.getODataEntitySet(e&&e.getEntitySet());var T1=R1.getODataEntityType(S1.entityType);var U1=T1.property;return U1.some(function(V1){return V1.name===Q1.Property;});};var O1=i.filter(function(Q1){return N1(Q1);});var P1=O1.concat(k.SortOrder);P1=P1.filter(function(Q1){return Q1!==undefined;});k.SortOrder=P1;j.setPresentationVariant(k);e.setUiState(j);}function J1(e,i,j,k,K1){var L1,M1={};if(!i){L1=[];}else if(Array.isArray(i)){L1=i;}else{L1=[i];}if(j){M1.urlParameters=j;}if(k&&k.bInvocationGroupingChangeSet){M1.operationGrouping="com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet";}M1.triggerChanges=u.isDraftEnabled();u.executeBeforeInvokeActionFromExtensionAPI(K1);var N1=r.oApplicationController.invokeActions(e,L1,M1);if(k&&k.bSetBusy){u.getBusyHelper().setBusy(N1);}N1.then(u.executeAfterInvokeActionFromExtensionAPI.bind(null,K1));return N1;}var c1=t.testable(c1,"fillEnabledMapForBreakoutActions");var e1=t.testable(e1,"getBreakoutActionIds");var h1=t.testable(h1,"getOwnerControl");var U=t.testable(U,"getSelectedContexts");var G=t.testable(G,"fnGetToolbarCutomData");var t1=t.testable(t1,"removePropertiesFromNavigationContext");return{getPositionableControlId:D,getMetaModelEntityType:x,getText:K,getContextText:Q,getNavigationKeyProperties:q1,mergeNavigationKeyPropertiesWithValues:r1,executeGlobalSideEffect:function(){if(u.isDraftEnabled()){var e=q.getView();var i=q.getOwnerComponent();var j=i.getAppComponent();var k=j.getForceGlobalRefresh();var K1=i.getModel("ui");e.attachBrowserEvent("keydown",function(L1){var M1=L1.target.type==="search";var N1=L1.target.type==="textarea";var O1=L1.target.id.indexOf("rowAction")>-1;var P1=L1.target.id.indexOf("ColumnListItem")>-1;if(L1.keyCode===13&&L1.ctrlKey!==true&&K1.getProperty("/editable")&&!M1&&!N1&&!O1&&!P1){r.oApplication.addSideEffectPromise(new Promise(function(Q1,R1){setTimeout(function(){var S1=r.oApplicationController.executeSideEffects(e.getBindingContext(),null,null,k);S1.then(function(){Q1();setTimeout(function(){var T1=document.getElementById(L1.target.id);if(T1){T1.focus();}});},R1);});}));}});}},setEnabledToolbarButtons:W,setEnabledFooterButtons:Y,fillEnabledMapForBreakoutActions:c1,getBreakoutActions:g1,getSelectedContexts:U,getSelectionPoints:T,getDeleteRestrictions:a1,getSmartTableDefaultVariant:D1,getSmartChartDefaultVariant:E1,setPrivateModelControlProperty:Z,removePropertiesFromNavigationContext:t1,navigateFromListItem:n1,navigateExternal:p1,semanticObjectLinkNavigation:s1,getCustomData:function(e){var j=e.getSource().getCustomData();var k={};for(var i=0;i<j.length;i++){k[j[i].getKey()]=j[i].getValue();}return k;},getCustomDataText:function(e){return new Promise(function(j,k){e.getCustomData().forEach(function(K1){var L1=K1.getKey();if(L1==="text"){var M1=K1.getBinding("value");var N1=!M1&&K1.getBindingInfo("value");if(!M1&&!N1){j(K1.getValue());return;}var O1=function(P1){j(P1.getSource().getExternalValue());return;};if(M1){M1.attachChangeOnce(O1);}else{N1.events={change:O1};for(var i=0;i<N1.parts.length;i++){N1.parts[i].targetType="string";}}}});});},onBeforeRebindTableOrChart:x1,formatDraftLockText:y1,showDraftPopover:function(e,i){z1().then(function(j){var k=j.getModel("admin");k.setProperty("/IsActiveEntity",e.getProperty("IsActiveEntity"));k.setProperty("/HasDraftEntity",e.getProperty("HasDraftEntity"));j.bindElement({path:e.getPath()+"/DraftAdministrativeData"});if(j.getBindingContext()){j.openBy(i);}else{j.getObjectBinding().attachDataReceived(function(){j.openBy(i);});}});},getContentDensityClass:function(){return r.oApplication.getContentDensityClass();},attachControlToView:A,getDialogFragment:H,getDialogFragmentAsync:I,processDataLossConfirmationIfNonDraft:B1,processDataLossTechnicalErrorConfirmation:A1,securedExecution:C1,getOwnerControl:h1,getTableBindingInfo:i1,refreshSmartTable:j1,refreshModel:k1,getElementCustomData:V,triggerAction:function(e,i,j,k,K1){B1(function(){r.oCRUDManager.callAction({functionImportPath:j.Action,contexts:e,sourceControl:k,label:j.Label,operationGrouping:""}).then(function(L1){if(L1&&L1.length>0){var M1=L1[0];if(M1.response&&M1.response.context&&(!M1.actionContext||M1.actionContext&&M1.response.context.getPath()!==M1.actionContext.getPath())){r.oApplication.getBusyHelper().getUnbusy().then(r.oViewDependencyHelper.setMeToDirty.bind(null,q.getOwnerComponent(),i));}}});},Function.prototype,K1,"Proceed");},checkToolbarIntentsSupported:F1,executeIfControlReady:G1,getControlInformation:y,executeForAllInformationObjects:z,setControlSortOrder:H1,invokeActionsForExtensionAPI:J1,filterUpdatableContexts:b1};}return B.extend("sap.suite.ui.generic.template.lib.CommonUtils",{constructor:function(e,i,j){d(this,p(e,i,j));}});});
