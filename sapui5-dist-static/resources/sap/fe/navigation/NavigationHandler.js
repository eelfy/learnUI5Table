/*
 * ! @copyright@
 */
sap.ui.define(["./NavError","./SelectionVariant","./library","sap/ui/base/Object","sap/ui/core/UIComponent","sap/ui/core/routing/HashChanger","sap/base/util/extend","sap/base/util/isEmptyObject","sap/base/Log","sap/base/assert","sap/base/util/merge","sap/ui/thirdparty/URI","sap/ui/util/openWindow"],function(N,S,a,B,U,H,e,b,L,c,m,d,o){"use strict";var f=a.NavType;var P=a.ParamHandlingMode;var g=a.SuppressionBehavior;var M=a.Mode;var h=B.extend("sap.fe.navigation.NavigationHandler",{metadata:{publicMethods:["navigate","parseNavigation","storeInnerAppState","storeInnerAppStateWithImmediateReturn","processBeforeSmartLinkPopoverOpens","processBeforeSemanticLinkPopoverOpens","mixAttributesAndSelectionVariant","setModel","getTechnicalParameters","setTechnicalParameters","replaceHash","constructContextUrl"]},constructor:function(C,s,p){if(!C){throw new N("NavigationHandler.INVALID_INPUT");}if(C instanceof U){this.oRouter=C.getRouter();this.oComponent=C;}else{if(typeof C.getOwnerComponent!=="function"){throw new N("NavigationHandler.INVALID_INPUT");}this.oRouter=this._getRouter(C);this.oComponent=C.getOwnerComponent();}if(this.oComponent&&this.oComponent.getAppComponent){this.oComponent=this.oComponent.getAppComponent();}if(typeof this.oRouter==="undefined"||typeof this.oComponent==="undefined"||typeof this.oComponent.getComponentData!=="function"){throw new N("NavigationHandler.INVALID_INPUT");}try{this.oCrossAppNavService=this._getAppNavigationService();if(!this.oCrossAppNavService){L.error("NavigationHandler: CrossApplicationNavigation is not available.");throw new N("NavigationHandler.NO.XAPPSERVICE");}}catch(i){L.error("NavigationHandler: UShell service API for CrossApplicationNavigation is not available.");}this.IAPP_STATE="sap-iapp-state";this.sDefaultedParamProp="sap-ushell-defaultedParameterNames";this.sSAPSystemProp="sap-system";this._aTechnicalParamaters=["hcpApplicationId"];this._oLastSavedInnerAppData={sAppStateKey:"",oAppData:{},iCacheHit:0,iCacheMiss:0};this._rIAppStateOld=new RegExp("/"+this.IAPP_STATE+"=([^/?]+)");this._rIAppStateOldAtStart=new RegExp("^"+this.IAPP_STATE+"=([^/?]+)");this._rIAppStateNew=new RegExp("[?&]"+this.IAPP_STATE+"=([^&]+)");if(p===P.URLParamWins||p===P.InsertInSelOpt){this.sParamHandlingMode=p;}else{this.sParamHandlingMode=P.SelVarWins;}if(s===M.ODataV2){this._sMode=s;}},_getAppNavigationService:function(){return sap.ushell.Container.getService("CrossApplicationNavigation");},_getRouter:function(C){return U.getRouterFor(C);},navigate:function(s,A,n,i,O,E,j){var k,p,x,C,l,q=false,t={};C=this.oComponent.getComponentData();if(C){l=C.startupParameters;if(l&&l["sap-ushell-next-navmode"]&&l["sap-ushell-next-navmode"].length>0){q=l["sap-ushell-next-navmode"][0]==="explace";}}if(j&&(j==="inplace"||j==="explace")){q=j==="explace";}else if(j){throw new N("NavigationHandler.INVALID_NAV_MODE");}if(E===undefined||E===null){x={};}else{x=E;}if(typeof n==="string"){k=n;}else if(typeof n==="object"){var r=this._splitInboundNavigationParameters(new S(),n,[]).oNavigationSelVar;k=r.toJSONString();}else{throw new N("NavigationHandler.INVALID_INPUT");}t.selectionVariant=new S(k).toJSONObject();t=this._removeMeasureBasedInformation(t);t=this._checkIsPotentiallySensitive(t);if(t.selectionVariant){p=this._getURLParametersFromSelectionVariant(new S(t.selectionVariant));k=new S(t.selectionVariant).toJSONString();}else{p={};k=null;}var u=this;var v={target:{semanticObject:s,action:A},params:p||{}};if(j){v.params["sap-ushell-navmode"]=q?"explace":"inplace";}var w=u.oCrossAppNavService.isNavigationSupported([v],u.oComponent);w.done(function(T){if(T[0].supported){var R;if(!q){R=u.storeInnerAppStateWithImmediateReturn(i,true);if(R&&R.appStateKey){u.replaceHash(R.appStateKey);}}if(!x.selectionVariant){x.selectionVariant=k;}x=u._removeMeasureBasedInformation(x);R=u._saveAppStateWithImmediateReturn(x,O);if(R){v.appStateKey=R.appStateKey;if(j=="explace"){var y=u.oCrossAppNavService.hrefForExternal(v,u.oComponent,false);o(y);}else{u.oCrossAppNavService.toExternal(v,u.oComponent);}}}else{if(O){var z=new N("NavigationHandler.isIntentSupported.notSupported");O(z);}}});if(O){w.fail(function(){var y=u._createTechnicalError("NavigationHandler.isIntentSupported.failed");O(y);});}},parseNavigation:function(){var A=H.getInstance().getHash();var i=this._getInnerAppStateKey(A);var C=this.oComponent.getComponentData();if(C===undefined){L.warning("The navigation Component's data was not set properly; assuming instead that no parameters are provided.");C={};}var s=C.startupParameters;var D=[];if(s&&s[this.sDefaultedParamProp]&&s[this.sDefaultedParamProp].length>0){D=JSON.parse(s[this.sDefaultedParamProp][0]);}var j=jQuery.Deferred();var n=this;if(i){this._loadAppState(i,j);}else{var I=C["sap-xapp-state"]!==undefined;if(I){var k=this.oCrossAppNavService.getStartupAppState(this.oComponent);k.done(function(q){var p=q.getData();if(p){try{p=JSON.parse(JSON.stringify(p));}catch(x){var E=n._createTechnicalError("NavigationHandler.AppStateData.parseError");j.reject(E,s,f.xAppState);return j.promise();}}if(p){var r=new S(p.selectionVariant);var l=n._splitInboundNavigationParameters(r,s,D);p.selectionVariant=l.oNavigationSelVar.toJSONString();p.oSelectionVariant=l.oNavigationSelVar;p.oDefaultedSelectionVariant=l.oDefaultedSelVar;p.bNavSelVarHasDefaultsOnly=l.bNavSelVarHasDefaultsOnly;j.resolve(p,s,f.xAppState);}else{E=n._createTechnicalError("NavigationHandler.getDataFromAppState.failed");j.reject(E,s||{},f.xAppState);}});k.fail(function(){var E=n._createTechnicalError("NavigationHandler.getStartupState.failed");j.reject(E,{},f.xAppState);});}else{if(s){var l=n._splitInboundNavigationParameters(new S(),s,D);if(l.oNavigationSelVar.isEmpty()&&l.oDefaultedSelVar.isEmpty()){j.resolve({},s,f.initial);}else{var p={};p.selectionVariant=l.oNavigationSelVar.toJSONString();p.oSelectionVariant=l.oNavigationSelVar;p.oDefaultedSelectionVariant=l.oDefaultedSelVar;p.bNavSelVarHasDefaultsOnly=l.bNavSelVarHasDefaultsOnly;j.resolve(p,s,f.URLParams);}}else{j.resolve({},{},f.initial);}}}return j.promise();},setTechnicalParameters:function(t){if(!t){t=[];}if(!Array.isArray(t)){L.error("NavigationHandler: parameter incorrect, array of strings expected");throw new N("NavigationHandler.INVALID_INPUT");}this._aTechnicalParamaters=t;},getTechnicalParameters:function(){return this._aTechnicalParamaters.concat([]);},_isTechnicalParameter:function(p){if(p){if(p.toLowerCase().indexOf("sap-")===0){return true;}else if(this._aTechnicalParamaters.indexOf(p)>=0){return true;}}return false;},_splitInboundNavigationParameters:function(s,j,D){if(!Array.isArray(D)){throw new N("NavigationHandler.INVALID_INPUT");}var p,i;var k={};for(p in j){if(!j.hasOwnProperty(p)){continue;}if(this._isTechnicalParameter(p)){continue;}if(typeof j[p]==="string"){k[p]=j[p];}else if(Array.isArray(j[p])&&j[p].length===1){k[p]=j[p][0];}else if(Array.isArray(j[p])&&j[p].length>1){k[p]=j[p];}else{throw new N("NavigationHandler.INVALID_INPUT");}}var l=new S();var n=new S();var q=s.getParameterNames().concat(s.getSelectOptionsPropertyNames());for(i=0;i<q.length;i++){p=q[i];if(p in k){if(D.indexOf(p)>-1){n.massAddSelectOption(p,s.getValue(p));this._addParameterValues(l,p,"I","EQ",k[p]);}else{switch(this.sParamHandlingMode){case P.SelVarWins:n.massAddSelectOption(p,s.getValue(p));break;case P.URLParamWins:this._addParameterValues(n,p,"I","EQ",k[p]);break;case P.InsertInSelOpt:n.massAddSelectOption(p,s.getValue(p));this._addParameterValues(n,p,"I","EQ",k[p]);break;default:throw new N("NavigationHandler.INVALID_INPUT");}}}else{if(D.indexOf(p)>-1){l.massAddSelectOption(p,s.getValue(p));}else{n.massAddSelectOption(p,s.getValue(p));}}}for(p in k){if(q.indexOf(p)>-1){continue;}if(D.indexOf(p)>-1){this._addParameterValues(l,p,"I","EQ",k[p]);}else{this._addParameterValues(n,p,"I","EQ",k[p]);}}var r=false;if(n.isEmpty()){r=true;var t=l.getSelectOptionsPropertyNames();for(i=0;i<t.length;i++){n.massAddSelectOption(t[i],l.getValue(t[i]));}}return{oNavigationSelVar:n,oDefaultedSelVar:l,bNavSelVarHasDefaultsOnly:r};},_addParameterValues:function(s,p,j,O,v){if(Array.isArray(v)){for(var i=0;i<v.length;i++){s.addSelectOption(p,j,O,v[i]);}}else{s.addSelectOption(p,j,O,v);}},replaceHash:function(A){var i=this.oRouter.oHashChanger?this.oRouter.oHashChanger:H.getInstance();var s=i.getHash();var j=this._replaceInnerAppStateKey(s,A);i.replaceHash(j);},storeInnerAppState:function(i,I){if(typeof I!=="boolean"){I=true;}var n=this;var j=jQuery.Deferred();var r=function(s){var p=n.oRouter.oHashChanger?n.oRouter.oHashChanger:H.getInstance();var q=p.getHash();var t=n._replaceInnerAppStateKey(q,s);p.replaceHash(t);};if(b(i)){j.resolve("");return j.promise();}var A=this._oLastSavedInnerAppData.sAppStateKey;var k=JSON.stringify(i)===JSON.stringify(this._oLastSavedInnerAppData.oAppData);if(k&&A){this._oLastSavedInnerAppData.iCacheHit++;r(A);j.resolve(A);return j.promise();}this._oLastSavedInnerAppData.iCacheMiss++;var O=function(s){if(!I){r(s);}n._oLastSavedInnerAppData.oAppData=i;n._oLastSavedInnerAppData.sAppStateKey=s;j.resolve(s);};var l=function(E){j.reject(E);};var s=this._saveAppState(i,O,l);if(s!==undefined){if(I){r(s);}}return j.promise();},storeInnerAppStateWithImmediateReturn:function(i,I){if(typeof I!=="boolean"){I=false;}var t=this;var A=jQuery.Deferred();if(b(i)){return{appStateKey:"",promise:A.resolve("")};}var s=this._oLastSavedInnerAppData.sAppStateKey;var j=JSON.stringify(i)===JSON.stringify(this._oLastSavedInnerAppData.oAppData);if(j&&s){this._oLastSavedInnerAppData.iCacheHit++;return{appStateKey:s,promise:A.resolve(s)};}this._oLastSavedInnerAppData.iCacheMiss++;var O=function(l){if(!I){t.replaceHash(l);}t._oLastSavedInnerAppData.oAppData=i;t._oLastSavedInnerAppData.sAppStateKey=l;A.resolve(l);};var k=function(E){A.reject(E);};var l=this._saveAppState(i,O,k);return{appStateKey:l,promise:A.promise()};},processBeforeSmartLinkPopoverOpens:function(t,s,i,E){var j=jQuery.Deferred();var k;if(t!=undefined){k=t.semanticAttributes;}var x,n=this;if(E===undefined){x={};}else{x=E;}var l=function(k,s){s=x.selectionVariant||s||"{}";var q=g.raiseErrorOnNull|g.raiseErrorOnUndefined;var r=n.mixAttributesAndSelectionVariant(k,s,q);s=r.toJSONString();var T={};T.selectionVariant=r.toJSONObject();T=n._removeMeasureBasedInformation(T);T=n._checkIsPotentiallySensitive(T);k=T.selectionVariant?n._getURLParametersFromSelectionVariant(new S(T.selectionVariant)):{};var O=function(A){if(t===undefined){j.resolve(k,A);}else{t.setSemanticAttributes(k);t.setAppStateKey(A);t.open();j.resolve(t);}};var u=function(v){j.reject(v);};x.selectionVariant=s;x=n._removeMeasureBasedInformation(x);n._saveAppState(x,O,u);};if(i){var p=this.storeInnerAppState(i,true);p.done(function(){l(k,s);});p.fail(function(q){j.reject(q);});}else{l(k,s);}return j.promise();},_getAppStateKeyAndUrlParameters:function(s){return this.processBeforeSmartLinkPopoverOpens(undefined,s,undefined,undefined);},_mixAttributesToSelVariant:function(s,i,j){for(var p in s){if(s.hasOwnProperty(p)){var v=s[p];if(v instanceof Date){v=v.toJSON();}else if(Array.isArray(v)||(v&&typeof v==="object")){v=JSON.stringify(v);}else if(typeof v==="number"||typeof v==="boolean"){v=v.toString();}if(v===""){if(j&sap.fe.navigation.SuppressionBehavior.ignoreEmptyString){L.info("Semantic attribute "+p+" is an empty string and due to the chosen Suppression Behiavour is being ignored.");continue;}}if(v===null){if(j&sap.fe.navigation.SuppressionBehavior.raiseErrorOnNull){throw new N("NavigationHandler.INVALID_INPUT");}else{L.warning("Semantic attribute "+p+" is null and ignored for mix in to selection variant");continue;}}if(v===undefined){if(j&sap.fe.navigation.SuppressionBehavior.raiseErrorOnUndefined){throw new N("NavigationHandler.INVALID_INPUT");}else{L.warning("Semantic attribute "+p+" is undefined and ignored for mix in to selection variant");continue;}}if(typeof v==="string"||v instanceof String){i.addSelectOption(p,"I","EQ",v);}else{throw new N("NavigationHandler.INVALID_INPUT");}}}return i;},mixAttributesAndSelectionVariant:function(s,k,l){var n=new S(k);var p=new S();var t=this;if(n.getFilterContextUrl()){p.setFilterContextUrl(n.getFilterContextUrl());}if(n.getParameterContextUrl()){p.setParameterContextUrl(n.getParameterContextUrl());}if(Array.isArray(s)){s.forEach(function(v){t._mixAttributesToSelVariant(v,p,l);});}else{this._mixAttributesToSelVariant(s,p,l);}var q=n.getParameterNames();for(var i=0;i<q.length;i++){if(!p.getSelectOption(q[i])){p.addSelectOption(q[i],"I","EQ",n.getParameter(q[i]));}}var r=n.getSelectOptionsPropertyNames();for(i=0;i<r.length;i++){var u=n.getSelectOption(r[i]);if(!p.getSelectOption(r[i])){for(var j=0;j<u.length;j++){p.addSelectOption(r[i],u[j].Sign,u[j].Option,u[j].Low,u[j].High);}}}return p;},_ensureSelectionVariantFormatString:function(s){if(s===undefined){return undefined;}var C=s;if(typeof s==="object"){C=JSON.stringify(s);}return C;},_saveAppState:function(A,O,i){var r=this._saveAppStateWithImmediateReturn(A,i);if(r){r.promise.done(function(){if(O){O(r.appStateKey);}});if(i){var n=this;r.promise.fail(function(){var E=n._createTechnicalError("NavigationHandler.AppStateSave.failed");i(E);});}return r.appStateKey;}return undefined;},_saveAppStateWithImmediateReturn:function(A,O){var i=this.oCrossAppNavService.createEmptyAppState(this.oComponent);var s=i.getKey();var j={};if(A.hasOwnProperty("selectionVariant")){j.selectionVariant=A.selectionVariant;if(A.selectionVariant){if(typeof A.selectionVariant==="string"){try{j.selectionVariant=JSON.parse(A.selectionVariant);}catch(x){var E=this._createTechnicalError("NavigationHandler.AppStateSave.parseError");if(O){O(E);}return undefined;}}}}if(this._sMode===M.ODataV2){j=e({selectionVariant:{},tableVariantId:"",customData:{}},j);if(A.tableVariantId){j.tableVariantId=A.tableVariantId;}if(A.customData){j.customData=A.customData;}if(A.presentationVariant){j.presentationVariant=A.presentationVariant;}if(A.valueTexts){j.valueTexts=A.valueTexts;}if(A.semanticDates){j.semanticDates=A.semanticDates;}}else{var k=Object.assign({},A);j=m(k,j);}j=this._checkIsPotentiallySensitive(j);i.setData(j);var l=i.save();return{appStateKey:s,promise:l.promise()};},_loadAppState:function(A,D){var i=this.oCrossAppNavService.getAppState(this.oComponent,A);var n=this;i.done(function(j){var k={};var l=j.getData();if(typeof l==="undefined"){var E=n._createTechnicalError("NavigationHandler.getDataFromAppState.failed");D.reject(E,{},f.iAppState);}else{if(n._sMode===M.ODataV2){k={selectionVariant:"{}",oSelectionVariant:new S(),oDefaultedSelectionVariant:new S(),bNavSelVarHasDefaultsOnly:false,tableVariantId:"",customData:{},appStateKey:A,presentationVariant:{},valueTexts:{},semanticDates:{}};if(l.selectionVariant){k.selectionVariant=n._ensureSelectionVariantFormatString(l.selectionVariant);k.oSelectionVariant=new S(k.selectionVariant);}if(l.tableVariantId){k.tableVariantId=l.tableVariantId;}if(l.customData){k.customData=l.customData;}if(l.presentationVariant){k.presentationVariant=l.presentationVariant;}if(l.valueTexts){k.valueTexts=l.valueTexts;}if(l.semanticDates){k.semanticDates=l.semanticDates;}}else{k=m(k,l);if(l.selectionVariant){k.selectionVariant=n._ensureSelectionVariantFormatString(l.selectionVariant);k.oSelectionVariant=new S(k.selectionVariant);}}}D.resolve(k,{},f.iAppState);});i.fail(function(){var E=n._createTechnicalError("NavigationHandler.getAppState.failed");D.reject(E,{},f.iAppState);});},_getInnerAppStateKey:function(A){if(!A){return undefined;}var i=this._rIAppStateNew.exec(A);if(i===null){i=this._rIAppStateOld.exec(A);}if(i===null){i=this._rIAppStateOldAtStart.exec(A);}if(i===null){return undefined;}return i[1];},_replaceInnerAppStateKey:function(A,s){var n=this.IAPP_STATE+"="+s;if(!A){return"?"+n;}var i=function(A){if(A.indexOf("?")!==-1){return A+"&"+n;}return A+"?"+n;};if(!this._getInnerAppStateKey(A)){return i(A);}if(this._rIAppStateNew.test(A)){return A.replace(this._rIAppStateNew,function(j){return j.replace(/\=.*/gi,"="+s);});}var r=function(j,A){A=A.replace(j,"");return i(A);};if(this._rIAppStateOld.test(A)){return r(this._rIAppStateOld,A);}if(this._rIAppStateOldAtStart.test(A)){return r(this._rIAppStateOldAtStart,A);}c(false,"internal inconsistency: Approach of sap-iapp-state not known, but _getInnerAppStateKey returned it");return undefined;},_getURLParametersFromSelectionVariant:function(s){var u={};var i=0;if(typeof s==="string"){var j=new S(s);}else if(typeof s==="object"){j=s;}else{throw new N("NavigationHandler.INVALID_INPUT");}var k=j.getSelectOptionsPropertyNames();for(i=0;i<k.length;i++){var l=j.getSelectOption(k[i]);if(l.length===1&&l[0].Sign==="I"&&l[0].Option==="EQ"){u[k[i]]=l[0].Low;}}var p=j.getParameterNames();for(i=0;i<p.length;i++){var n=j.getParameter(p[i]);u[p[i]]=n;}return u;},_createTechnicalError:function(E){return new N(E);},setModel:function(i){this._oModel=i;},_getModel:function(){return this._oModel||this.oComponent.getModel();},_removeAllProperties:function(D){if(D){if(D.selectionVariant){D.selectionVariant=null;}if(D.valueTexts){D.valueTexts=null;}if(D.semanticDates){D.semanticDates=null;}}},_removeProperties:function(F,p,D){if(F.length&&D&&(D.selectionVariant||D.valueTexts||D.semanticDates)){F.forEach(function(n){if(D.selectionVariant.SelectOptions){D.selectionVariant.SelectOptions.some(function(v,i){if(n===v.PropertyName){D.selectionVariant.SelectOptions.splice(i,1);return true;}return false;});}if(D.valueTexts&&D.valueTexts.Texts){D.valueTexts.Texts.forEach(function(t){if(t.PropertyTexts){t.PropertyTexts.some(function(v,i){if(n===v.PropertyName){t.PropertyTexts.splice(i,1);return true;}return false;});}});}if(D.semanticDates&&D.semanticDates.Dates){D.semanticDates.Dates.forEach(function(i,j){if(n===i.PropertyName){D.semanticDates.Dates.splice(j,1);}});}});}if(p.length&&D&&D.selectionVariant&&D.selectionVariant.Parameters){p.forEach(function(n){D.selectionVariant.Parameters.some(function(v,i){if(n===v.PropertyName||"$Parameter."+n===v.PropertyName){D.selectionVariant.Parameters.splice(i,1);return true;}return false;});});}},_isTermTrue:function(p,t){var i=function(T){if(T){return T.Bool?T.Bool!=="false":true;}return false;};return!!p[t]&&i(p[t]);},_isExcludedFromNavigationContext:function(p){return this._isTermTrue(p,"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext");},_isPotentiallySensitive:function(p){return this._isTermTrue(p,"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive");},_isMeasureProperty:function(p){return this._isTermTrue(p,"com.sap.vocabularies.Analytics.v1.Measure");},_isToBeExcluded:function(p){return this._isPotentiallySensitive(p)||this._isExcludedFromNavigationContext(p);},constructContextUrl:function(E,i){if(!E){throw new N("NavigationHandler.NO_ENTITY_SET_PROVIDED");}if(i===undefined){i=this._getModel();}return this._constructContextUrl(i)+"#"+E;},_constructContextUrl:function(i){var s;if(i&&i.isA("sap.ui.model.odata.v2.ODataModel")){s=i._getServerUrl();}else if(i&&i.isA("sap.ui.model.odata.v4.ODataModel")){var j=new d(i.sServiceUrl).absoluteTo(document.baseURI);s=new d("/").absoluteTo(j).toString();}if(s&&s.lastIndexOf("/")===s.length-1){s=s.substr(0,s.length-1);}return s+i.sServiceUrl+"/$metadata";},_checkIsPotentiallySensitive:function(D){var A=D;if(D&&D.selectionVariant&&((D.selectionVariant.FilterContextUrl&&D.selectionVariant.SelectOptions)||(D.selectionVariant.ParameterContextUrl&&D.selectionVariant.Parameters))){var k=this._getModel();if(this.oComponent&&k&&k.isA("sap.ui.model.odata.v2.ODataModel")){var s=[],l=[],i,n,E,p,q,r,F=[],t=[];n=k.getMetaModel();if(k.getServiceMetadata()&&n&&n.oModel){if(D.selectionVariant.FilterContextUrl){F=D.selectionVariant.FilterContextUrl.split("#");}if(F.length===2&&D.selectionVariant.SelectOptions&&this._constructContextUrl(k).indexOf(F[0])===0){E=n.getODataEntitySet(F[1]);if(E){p=n.getODataEntityType(E.entityType);}else{p=n.getODataEntityType(F[1]);}if(p){if(p&&p.property){for(i=0;i<p.property.length;i++){if(this._isToBeExcluded(p.property[i])){s.push(p.property[i].name);}}}if(p.navigationProperty){for(i=0;i<p.navigationProperty.length;i++){r=n.getODataAssociationEnd(p,p.navigationProperty[i].name);if(!r||r.type===D.selectionVariant.FilterContextUrl){continue;}if(r.multiplicity==="1"||r.multiplicity==="0..1"){q=n.getODataEntityType(r.type);if(q&&q.property){for(var j=0;j<q.property.length;j++){if(this._isToBeExcluded(q.property[j])){s.push(p.navigationProperty[i].name+"."+q.property[j].name);}}}}}}}}if(D.selectionVariant.ParameterContextUrl){t=D.selectionVariant.ParameterContextUrl.split("#");}if(t.length===2&&D.selectionVariant.Parameters&&this._constructContextUrl(k).indexOf(t[0])===0){E=n.getODataEntitySet(t[1]);if(E){p=n.getODataEntityType(E.entityType);}else{p=n.getODataEntityType(F[1]);}if(p){if(p.property){for(i=0;i<p.property.length;i++){if(this._isToBeExcluded(p.property[i])){l.push(p.property[i].name);}}}}}if(s.length||l.length){A=e(true,{},A);this._removeProperties(s,l,A);}}else{this._removeAllProperties(A);L.error("NavigationHandler: oMetadata are not fully loaded!");}}else if(this.oComponent&&k&&k.isA("sap.ui.model.odata.v4.ODataModel")){return this._removeSensitiveDataForODataV4(A);}}return A;},_removeMeasureBasedInformation:function(A){var i=A;if(A.selectionVariant){if(typeof A.selectionVariant==="string"){try{i.selectionVariant=JSON.parse(A.selectionVariant);}catch(x){L.error("NavigationHandler: _removeMeasureBasedInformation parse error");}}i=this._removeMeasureBasedProperties(i);}return i;},_removeMeasureBasedProperties:function(D){var A=D,k=[],l=[];var i,n,p,E,q,s,r,F=[],t=[];if(D&&D.selectionVariant&&((D.selectionVariant.FilterContextUrl&&D.selectionVariant.SelectOptions)||(D.selectionVariant.ParameterContextUrl&&D.selectionVariant.Parameters))){n=this._getModel();if(this.oComponent&&n&&n.isA("sap.ui.model.odata.v2.ODataModel")){p=n.getMetaModel();if(n.getServiceMetadata()&&p&&p.oModel){if(D.selectionVariant.FilterContextUrl){F=D.selectionVariant.FilterContextUrl.split("#");}if(F.length===2&&D.selectionVariant.SelectOptions&&this._constructContextUrl(n).indexOf(F[0])===0){E=p.getODataEntitySet(F[1]);if(E){q=p.getODataEntityType(E.entityType);}else{q=p.getODataEntityType(F[1]);}if(q){if(q&&q.property){for(i=0;i<q.property.length;i++){if(this._isMeasureProperty(q.property[i])){k.push(q.property[i].name);}}}if(q.navigationProperty){for(i=0;i<q.navigationProperty.length;i++){r=p.getODataAssociationEnd(q,q.navigationProperty[i].name);if(!r||r.type===D.selectionVariant.FilterContextUrl){continue;}if(r.multiplicity==="1"||r.multiplicity==="0..1"){s=p.getODataEntityType(r.type);if(s&&s.property){for(var j=0;j<s.property.length;j++){if(this._isMeasureProperty(s.property[j])){k.push(q.navigationProperty[i].name+"."+s.property[j].name);}}}}}}}}if(D.selectionVariant.ParameterContextUrl){t=D.selectionVariant.ParameterContextUrl.split("#");}if(t.length===2&&D.selectionVariant.Parameters&&this._constructContextUrl(n).indexOf(t[0])===0){E=p.getODataEntitySet(t[1]);if(E){q=p.getODataEntityType(E.entityType);}else{q=p.getODataEntityType(F[1]);}if(q){if(q.property){for(i=0;i<q.property.length;i++){if(this._isMeasureProperty(q.property[i])){l.push(q.property[i].name);}}}}}if(k.length||l.length){A=e(true,{},A);this._removeProperties(k,l,A);}}else{this._removeAllProperties(A);L.error("NavigationHandler: oMetadata are not fully loaded!");}}else if(this.oComponent&&n&&n.isA("sap.ui.model.odata.v4.ODataModel")){return this._removeSensitiveDataForODataV4(A,true);}}return A;},_removeSensitiveDataForODataV4:function(D,i){var t=this,F,s=new S(D.selectionVariant),j=this._getModel();if(!j.getMetaModel().getObject("/")){this._removeAllProperties(D);L.error("NavigationHandler: oMetadata are not fully loaded!");return D;}if(D.selectionVariant.FilterContextUrl){F=D.selectionVariant.FilterContextUrl.split("#");}if(F.length===2&&D.selectionVariant.SelectOptions&&this._constructContextUrl(j).indexOf(F[0])===0){s.removeSelectOption("@odata.context");s.removeSelectOption("@odata.metadataEtag");s.removeSelectOption("SAP__Messages");var E=F[1],l=j.getMetaModel(),n=s.getPropertyNames()||[],I=function(x,u,y){var z;u=u||E;y=y;z=l.getObject("/"+u+"/"+x+"@");if(z){if((i&&z["@com.sap.vocabularies.Analytics.v1.Measure"])||t._checkPropertyAnnotationsForSensitiveData(z)){return true;}else if(z["@com.sap.vocabularies.Common.v1.FieldControl"]){var A=z["@com.sap.vocabularies.Common.v1.FieldControl"];if(A["$EnumMember"]&&A["$EnumMember"].split("/")[1]==="Inapplicable"){return true;}}}return false;};var q=l.getObject("/"+E+"/");for(var k=0;k<n.length;k++){var r=n[k];if(q[r]&&q[r].$kind&&q[r].$kind==="Property"&&I(r,E)){s.removeSelectOption(r);}else if(q[r]&&q[r].$kind&&q[r].$kind==="NavigationProperty"){var u="/"+l.getObject("/"+E+"/$NavigationPropertyBinding/"+r),v=JSON.parse(s.getSelectOption(r)[0].Low),w=Object.keys(v);for(var p=0;p<w.length;p++){var x=w[p];if(I(x,u)){delete v[x];s.removeSelectOption(r);s.addSelectOption(r,"I","EQ",JSON.stringify(v));}}}}D.selectionVariant=s.toJSONObject();}return D;},_checkPropertyAnnotationsForSensitiveData:function(p){return(p["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]||p["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"]);}});return h;});
