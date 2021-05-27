sap.ui.define(["sap/ui/base/Object","sap/ui/core/mvc/ControllerExtension","sap/ui/generic/app/navigation/service/NavError","sap/suite/ui/generic/template/listTemplates/listUtils","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/comp/state/UIState","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/base/util/deepEqual","sap/base/util/extend","sap/suite/ui/generic/template/genericUtilities/FeError","sap/suite/ui/generic/template/js/placeholderHelper"],function(B,C,N,l,S,U,F,d,e,a,p){"use strict";var c="ListReport.controller.IappStateHandler";var f=new F(c);var L=f.getLogger();var o=f.Level;var b="sap.suite.ui.generic.template.customData",g="sap.suite.ui.generic.template.extensionData",h="sap.suite.ui.generic.template.genericData";var I=["INIT","DATA_SUITE","CANCEL","RESET","SET_VM_ID"];function n(O){if(O){for(var P in O){O[P]=null;}}}function j(m,D){if(sap.ui.support){var i=L.getLevel();if(i<o.INFO){L.setLevel(o.INFO);}}var s;if(typeof D==="string"){s=D;}else{s="";var q="";for(var K in D){s=s+q+K+": "+D[K];q="; ";}}L.info(m,s,"sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");}function k(s,m,t){var q=t.oServices.oApplication.getNavigationHandler();var r=m.getOwnerComponent().getSmartVariantManagement();var u=false;var v;var w;var x=t.oComponentUtils.getSettings();var R;var A=Promise.resolve();var D=false;s.oSmartFilterbar.setSuppressSelection(true);var y=(function(){var i;return function(){i=i||s.oSmartFilterbar.getNonVisibleCustomFilterNames();return i;};})();function z(){var i=t.oComponentUtils.getTemplatePrivateModel();return i.getProperty("/generic/bDataAreShownInTable");}function E(){var u1={};var v1=[];var w1=y();for(var i=0;i<w1.length;i++){var x1=w1[i];if(s.oSmartFilterbar.isVisibleInFilterBarByName(x1)){v1.push(x1);}}var y1={suppressDataSelection:!z(),visibleCustomFields:v1,variantDirty:m.byId('template::PageVariant')&&m.byId('template::PageVariant').currentVariantGetModified()};u1[h]=y1;if(t.oComponentUtils.isDraftEnabled()){var z1=t.oComponentUtils.getTemplatePrivateModel();y1.editStateFilter=z1.getProperty("/listReport/vDraftState");var A1=z1.getProperty("/listReport/activeObjectEnabled");y1.activeStateFilter=A1;}var B1=s.oMultipleViewsHandler.getSelectedKeyPropertyName();if(B1){var C1=s.oMultipleViewsHandler.getContentForIappState();if(C1){y1[B1]=C1.state;}}if(s.oWorklistData.bWorkListEnabled){var D1=s.oWorklistData.oSearchField?s.oWorklistData.oSearchField.getValue():"";var E1={"searchString":D1};y1.Worklist=E1;}var F1={};u1[b]=F1;m.getCustomAppStateDataExtension(F1);var G1;var H1=true;var I1=function(J1,K1){if(!(J1 instanceof C)){throw new a(c,"State must always be set with respect to a ControllerExtension");}if(!H1){throw new a(c,"State must always be provided synchronously");}if(K1){G1=G1||Object.create(null);var L1=J1.getMetadata().getNamespace();G1[L1]=K1;}};m.templateBaseExtension.provideExtensionAppStateData(I1);H1=false;if(G1){u1[g]=G1;}return u1;}function G(){var u1=s.oSmartFilterbar.getUiState();var v1=JSON.stringify(u1.getSelectionVariant());var w1=new S(v1);var x1=m.getVisibleSelectionsWithDefaults();for(var i=0;i<x1.length;i++){if(!w1.getValue(x1[i])){w1.addSelectOption(x1[i],"I","EQ","");}}if(m.byId('template::PageVariant')&&m.byId('template::PageVariant').currentVariantGetModified()&&w1.getID()){w1.setID("");}if(s.oWorklistData.bWorkListEnabled){var y1=s.oWorklistData.oSearchField?s.oWorklistData.oSearchField.getValue():"";w1.addSelectOption("Worklist.SearchField","I","EQ",y1);}return{selectionVariant:w1.toJSONString(),tableVariantId:(!r&&s.oSmartTable.getCurrentVariantId())||"",customData:E(),semanticDates:u1.getSemanticDates()};}function H(u1,v1){var w1=t.oComponentUtils.getTemplatePrivateModel();if(u1&&t.oComponentUtils.isDraftEnabled()){w1.setProperty("/listReport/vDraftState",u1.editStateFilter||"0");w1.setProperty("/listReport/activeObjectEnabled",!!u1.activeStateFilter);s.oMultipleViewsHandler.restoreActiveButtonState(u1);}var x1=u1&&u1.visibleCustomFields;if(x1&&x1.length>0){var y1=s.oSmartFilterbar.getAllFilterItems();for(var i=0;i<y1.length;i++){var z1=y1[i];var A1=z1.getName();if(x1.indexOf(A1)!==-1){z1.setVisibleInFilterBar(true);}}}Q(v1&&!(u1&&u1.suppressDataSelection));if(z()&&!s.oWorklistData.bWorkListEnabled){s.oSmartFilterbar.search();m1();}var B1=s.oMultipleViewsHandler.getSelectedKeyPropertyName();if(B1&&u1[B1]){s.oMultipleViewsHandler.restoreFromIappState(u1[B1]);}}function J(i,r){if(r){var u1=i['sap-ui-fe-variant-id'];if(u1&&u1[0]){s.oSmartFilterbar.getSmartVariant().setCurrentVariantId(u1[0]);}}else{var v1=i['sap-ui-fe-variant-id'],w1=i['sap-ui-fe-filterbar-variant-id'],x1=i['sap-ui-fe-chart-variant-id'],y1=i['sap-ui-fe-table-variant-id'];K(w1&&w1[0],x1&&x1[0],y1&&y1[0],v1&&v1[0]);}}function K(i,u1,v1,w1){if(i||w1){s.oSmartFilterbar.getSmartVariant().setCurrentVariantId(i||w1);}if(s.oSmartTable&&(v1||w1)){s.oSmartTable.attachAfterVariantInitialise(function(x1){s.oSmartTable.setCurrentVariantId(v1||w1);});s.oSmartTable.setCurrentVariantId(v1||w1);}s.oMultipleViewsHandler.setControlVariant(u1,v1,w1);}function M(i){m.restoreCustomAppStateDataExtension(i||{});}function O(i){if(!i){return;}var u1=true;var v1=function(w1){if(!(w1 instanceof C)){throw new a(c,"State must always be retrieved with respect to a ControllerExtension");}var x1=w1.getMetadata().getNamespace();if(!u1){throw new a(c,"State must always be restored synchronously");}return i[x1];};m.templateBaseExtension.restoreExtensionAppStateData(v1);u1=false;}function P(i,u1){i=i||{};if(i.hasOwnProperty(b)&&i.hasOwnProperty(h)){O(i[g]);M(i[b]);H(i[h],u1);}else{if(i._editStateFilter!==undefined){H({editStateFilter:i._editStateFilter});delete i._editStateFilter;}M(i);}s.oSmartFilterbar.fireFilterChange();if(i[h]){if(i[h].variantDirty===undefined){i[h].variantDirty=true;}m.byId('template::PageVariant')&&m.byId('template::PageVariant').currentVariantSetModified(i[h].variantDirty);}}function Q(i){var u1=t.oComponentUtils.getTemplatePrivateModel();u1.setProperty("/generic/bDataAreShownInTable",i);}function T(i,u1){j("changeIappState called",{bFilterOrSettingsChange:i,bDataAreShown:u1,bDataAreShownInTable:z(),bIgnoreFilterChange:u});if(s.oSmartFilterbar.isDialogOpen()){return;}if(u){return;}Q(u1);t.oComponentUtils.stateChanged();}function V(i){var u1=s.oSmartFilterbar.determineMandatoryFilterItems(),v1;for(var w1=0;w1<u1.length;w1++){if(u1[w1].getName().indexOf("P_DisplayCurrency")!==-1){if(i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0]&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low){v1=i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;if(v1){i.oSelectionVariant.addParameter("P_DisplayCurrency",v1);}}break;}}}function W(){var u1=s.oSmartFilterbar.determineMandatoryFilterItems();var v1=s.oSmartFilterbar.getFiltersWithValues();for(var i=0;i<u1.length;i++){if(v1.indexOf(u1[i])===-1){return true;}}return false;}function X(i){var u1=(typeof i.semanticDates==="string"?JSON.parse(i.semanticDates):i.semanticDates)||{};if(!s.oWorklistData.bWorkListEnabled){s1(i.oSelectionVariant||"",i.selectionVariant||"",true,u1,false);}if(!r&&i.tableVariantId){s.oSmartTable.setCurrentVariantId(i.tableVariantId);}i.customData=i.customData||{};if(s.oWorklistData.bWorkListEnabled){var v1=i.customData[h]&&i.customData[h].Worklist?i.customData[h].Worklist:{};s.oWorklistHandler.restoreWorklistStateFromIappState(v1);}t1(z());P(i.customData,true);}function Y(i,u1){J(u1||{},r);if(i.presentationVariant!==undefined){t.oCommonUtils.setControlSortOrder(s,i.presentationVariant);}if((i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(i.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency")===-1)){V(i);}var v1={selectionVariant:i.oSelectionVariant,urlParameters:u1,selectedQuickVariantSelectionKey:"",semanticDates:(typeof i.semanticDates==="string"?JSON.parse(i.semanticDates):i.semanticDates)||{}};if(!s.oWorklistData.bWorkListEnabled){m.modifyStartupExtension(v1);s1(v1.selectionVariant,i.selectionVariant||"",true,v1.semanticDates,false);}if(!r&&i.tableVariantId){s.oSmartTable.setCurrentVariantId(i.tableVariantId);}i.customData=i.customData||{};if(s.oWorklistData.bWorkListEnabled){var w1=i.customData[h]&&i.customData[h].Worklist?i.customData[h].Worklist:{};s.oWorklistHandler.restoreWorklistStateFromIappState(w1);}P(i.customData,true);s.oMultipleViewsHandler.handleStartUpObject(v1);var x1;if(!s.oWorklistData.bWorkListEnabled){if(s.oSmartFilterbar.isCurrentVariantStandard()){x1=s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;}else{x1=s.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();}if(x1===null||s.oSmartFilterbar.getLiveMode()){x1=true;}Q(x1);if(x1){s.oSmartFilterbar.search();m1();}t1(x1);}T(true,x1);}function Z(){var i={selectionVariant:"",urlParameters:{},selectedQuickVariantSelectionKey:"",semanticDates:{}};var u1=s.oSmartFilterbar.getUiState();var v1=new S(JSON.stringify(u1.getSelectionVariant()));o1(v1);var w1=JSON.parse(JSON.stringify(v1));var x1=u1.getSemanticDates();i.selectionVariant=v1;i.semanticDates=x1;m.modifyStartupExtension(i);if(!(d(JSON.parse(JSON.stringify(i.selectionVariant)),w1)&&d(i.semanticDates,x1))){s1(i.selectionVariant,"",true,i.semanticDates,true);}s.oMultipleViewsHandler.handleStartUpObject(i);var y1;if(s.oWorklistData.bWorkListEnabled){if(s.oSmartFilterbar.isCurrentVariantStandard()){s.oWorklistHandler.restoreWorklistStateFromIappState();}}else{if(s.oSmartFilterbar.isCurrentVariantStandard()){y1=s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;}else{y1=s.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();}if(y1===null||s.oSmartFilterbar.getLiveMode()){if(!s.bLoadListAndFirstEntryOnStartup){var z1=s.oMultipleViewsHandler.getOriginalEnableAutoBinding();var A1=W();var B1=x.dataLoadSettings&&x.dataLoadSettings.loadDataOnAppLaunch;if((B1===null||B1===undefined)&&(z1!==null&&z1!==undefined)){y1=z1&&!A1;}else{y1=j1(B1,A1);}}else{y1=true;}if(!y1&&s.oSmartFilterbar.isCurrentVariantStandard()&&!s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser&&s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML){s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML=false;y1=false;}}Q(y1);if(y1){s.oSmartFilterbar.search();m1();}t1(y1);}m.byId('template::PageVariant')&&m.byId('template::PageVariant').currentVariantSetModified(false);T(true,y1);}function $(i,u1){J(u1,r);var v1={selectionVariant:i.oSelectionVariant,urlParameters:u1,selectedQuickVariantSelectionKey:"",semanticDates:(typeof i.semanticDates==="string"?JSON.parse(i.semanticDates):i.semanticDates)||{}};if(i.presentationVariant!==undefined){t.oCommonUtils.setControlSortOrder(s,i.presentationVariant);}var w1=s.oSmartFilterbar.getUiState();var x1=new S(JSON.stringify(w1.getSelectionVariant()));var y1=JSON.parse(JSON.stringify(x1));var z1=w1.getSemanticDates();if((i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(i.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency")===-1)){V(i);}if(!s.oWorklistData.bWorkListEnabled){if(s.oSmartFilterbar.isCurrentVariantStandard()){m.modifyStartupExtension(v1);s1(l.getMergedVariants([x1,v1.selectionVariant]),i.selectionVariant,true,v1.semanticDates,false);}else{o1(x1);v1.selectionVariant=x1;v1.semanticDates=z1;m.modifyStartupExtension(v1);if(!(d(JSON.parse(JSON.stringify(v1.selectionVariant)),y1)&&d(v1.semanticDates,z1))){s1(v1.selectionVariant,i.selectionVariant,true,v1.semanticDates,false);}}}if(!r&&i.tableVariantId){s.oSmartTable.setCurrentVariantId(i.tableVariantId);}i.customData=i.customData||{};if(s.oWorklistData.bWorkListEnabled){var A1=i.customData[h]&&i.customData[h].Worklist?i.customData[h].Worklist:{};s.oWorklistHandler.restoreWorklistStateFromIappState(A1);}P(i.customData,true);s.oMultipleViewsHandler.handleStartUpObject(v1);var B1;if(!s.oWorklistData.bWorkListEnabled){if(s.oSmartFilterbar.isCurrentVariantStandard()){B1=s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser;}else{B1=s.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();}if(B1===null||s.oSmartFilterbar.getLiveMode()){if(!s.bLoadListAndFirstEntryOnStartup){var C1=s.oMultipleViewsHandler.getOriginalEnableAutoBinding();var D1=W();var E1=x.dataLoadSettings&&x.dataLoadSettings.loadDataOnAppLaunch;if((E1===null||E1===undefined)&&(C1!==null&&C1!==undefined)){B1=C1&&!D1?true:false;}else{B1=j1(E1,D1);}}else{B1=true;}if(!B1&&s.oSmartFilterbar.isCurrentVariantStandard()&&!s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardByUser&&s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML){s.oSmartFilterbar.getSmartVariant().bExecuteOnSelectForStandardViaXML=false;B1=false;}}Q(B1);if(B1){s.oSmartFilterbar.search();m1();}t1(B1);}m.byId('template::PageVariant')&&m.byId('template::PageVariant').currentVariantSetModified(false);T(true,B1);}function _(i,u1,v1){j("fnAdaptToAppState called",{sNavType:v1});s.oSmartFilterbar.setSuppressSelection(false);switch(v1){case sap.ui.generic.app.navigation.service.NavType.iAppState:X(i);break;case sap.ui.generic.app.navigation.service.NavType.initial:Z();break;case sap.ui.generic.app.navigation.service.NavType.xAppState:case sap.ui.generic.app.navigation.service.NavType.URLParams:if(i.bNavSelVarHasDefaultsOnly){$(i,u1);}else{Y(i,u1);}break;default:_.apply(this,arguments);}}function a1(s){if(!s){return;}var i=e({oDefaultedSelectionVariant:new S(),oSelectionVariant:new S(s&&s.selectionVariant)},s);_(i,{},sap.ui.generic.app.navigation.service.NavType.iAppState);}function b1(){var i=new Promise(function(u1){try{var v1=q.parseNavigation();v1.done(function(x1,y1,z1){if(z1!==sap.ui.generic.app.navigation.service.NavType.iAppState){_(x1,y1,z1);}u1();});v1.fail(function(x1,y1,z1){L.warning(x1.getErrorCode()+"app state could not be parsed - continuing with empty state");_({},y1,sap.ui.generic.app.navigation.service.NavType.initial);u1();});}catch(w1){_({},{},sap.ui.generic.app.navigation.service.NavType.initial);u1();}});return i;}function c1(){u=true;D=m.byId('template::PageVariant')&&m.byId('template::PageVariant').currentVariantGetModified();var i=G();s.oSmartFilterbar.setCustomFilterData(i.customData);u=false;}function d1(){T(true,z());}function e1(i){var u1=i.getParameter("context");var v1=s.oSmartFilterbar.getFilterData(true);if(v1._CUSTOM!==undefined){if(s.oWorklistData.bWorkListEnabled){var w1=v1._CUSTOM[h]["Worklist"];s.oSmartFilterbar.setSuppressSelection(false);s.oWorklistData.oSearchField.setValue(w1.searchString);s.oWorklistData.oSearchField.fireSearch();}else{P(v1._CUSTOM);}}else{var x1=E();n(x1[b]);n(x1[h]);P(x1);}if(I.indexOf(u1)<0){Q(i.getParameter("executeOnSelect"));m1();T(true,z());}if(u1==="RESET"&&D){A.then(T.bind(null,true,false));}}function f1(){A=new Promise(function(i){R=i;});}function g1(){R();}function h1(){if(!r){T(true,z());}}function i1(){if(!r){T(true,z());}}function j1(i,u1){var v1;var w1=s.oSmartFilterbar.getFiltersWithValues();switch(i){case"always":v1=!u1?true:false;break;case"never":v1=false;break;default:v1=w1.length&&!u1?true:false;}return v1;}function k1(){v=s.oSmartTable.getEnableAutoBinding();s.oSmartFilterbar.attachFiltersDialogClosed(t.oComponentUtils.stateChanged);}function l1(){var i=x.dataLoadSettings&&x.dataLoadSettings.loadDataOnAppLaunch;var u1=s.oMultipleViewsHandler.getSelectedKeyPropertyName();var v1=u1==="tableTabData"||u1==="tableViewData"?true:false;w=v1?false:true;var w1=i===null||i===undefined?s.oMultipleViewsHandler.getEnableAutoBinding():true;v=w||w1;if(v){var x1=new sap.ui.core.CustomData({key:"executeStandardVariantOnSelect",value:true});s.oSmartFilterbar.addCustomData(x1);}}function m1(){var i=m.getOwnerComponent().getModel("_templPriv");i.setProperty("/listReport/isHeaderExpanded",!z()||W());}function n1(i,u1,v1,w1){var x1=new U({selectionVariant:i,semanticDates:w1});s.oSmartFilterbar.setUiState(x1,{replace:u1,strictMode:v1});}function o1(i){i.removeSelectOption(b);i.removeSelectOption(h);}function p1(u1,v1,w1){if(u1&&(v1!==""||w1)){var x1=u1.getParameterNames().concat(u1.getSelectOptionsPropertyNames());for(var i=0;i<x1.length;i++){s.oSmartFilterbar.addFieldToAdvancedArea(x1[i]);}}}function q1(i,u1,v1){if(i.getParameter(u1)&&!i.getParameter(v1)){i.addParameter(v1,i.getParameter(u1));}if(i.getSelectOption(u1)&&!i.getSelectOption(v1)){var w1=i.getSelectOption(u1);w1.forEach(function(x1){i.addSelectOption(v1,x1.Sign,x1.Option,x1.Low,x1.High);});}}function r1(i){var u1=m.getOwnerComponent().getModel().getMetaModel();var v1=m.getOwnerComponent().getEntitySet();var w1=u1.getODataEntityType(u1.getODataEntitySet(v1).entityType);w1.property.forEach(function(x1){if(x1["com.sap.vocabularies.Common.v1.EditableFieldFor"]){var y1=x1["com.sap.vocabularies.Common.v1.EditableFieldFor"].PropertyPath||x1["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;var z1=x1.name;q1(i,y1,z1);q1(i,z1,y1);}});}function s1(i,u1,v1,w1,x1){r1(i);if(v1){s.oSmartFilterbar.clearVariantSelection();}p1(i,u1,x1);n1(i.toJSONObject(),v1,false,w1);}function t1(i){if(!i){var u1=['FE-DATA-LOADED','FE-DATA-LOADED-FIRSTTIMEONLY','FE-HEADER-LOADED','FE-HEADER-LOADED-FIRSTTIMEONLY'];p.resetPlaceHolders(t,u1);}}return{areDataShownInTable:z,setDataShownInTable:Q,parseUrlAndApplyAppState:b1,changeIappState:T,onFiltersDialogBeforeOpen:f1,onFiltersDialogClosed:g1,onSmartFilterBarInitialise:k1,onBeforeSFBVariantFetch:c1,onAfterSFBVariantSave:d1,onAfterSFBVariantLoad:e1,onAfterTableVariantSave:h1,onAfterApplyTableVariant:i1,onSFBVariantInitialise:l1,applyState:a1,getCurrentAppState:G,setFiltersUsingUIState:n1};}return B.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler",{constructor:function(s,i,t){e(this,k(s,i,t));}});});
