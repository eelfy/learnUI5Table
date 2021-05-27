/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_difference","sap/base/util/merge","sap/base/Log","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/dt/ElementUtil","sap/ui/dt/OverlayRegistry","sap/ui/dt/Util","sap/ui/fl/apply/api/DelegateMediatorAPI","sap/ui/fl/write/api/FieldExtensibility","sap/ui/fl/Utils","sap/ui/rta/plugin/Plugin","sap/ui/rta/Utils"],function(d,m,L,J,E,O,D,a,F,b,P,U){"use strict";function _(s,i,r){var t;var R=i;if(r){var u=["add.delegate","reveal","add.custom"].some(function(x){return r.isResponsibleElementActionAvailable(i,x);});if(u){R=r.getResponsibleElementOverlay(i);}}var v=R.getRelevantContainer(!s);var w=O.getOverlay(v);if(s){t=R.getParentElementOverlay();}else{t=R;}return{responsibleElementOverlay:R,relevantContainerOverlay:w,parentOverlay:t,relevantContainer:v,parent:t&&t.getElement()};}function c(i,C){return C.sParentAggregationName;}function e(i,s){var r=i.getElement();if(!r){return[];}var I=E.getAggregation(r,s).filter(function(C){var t=O.getOverlay(C);if(!this.hasStableId(t)){return false;}var R=i.getRelevantContainer(true);var u=O.getOverlay(R);var v=i;var w=false;do{w=!v.getElementVisibility();if(w){break;}if(v===u){break;}else{v=v.getParentElementOverlay();}}while(v);if(w){return true;}return t.getElementVisibility()===false;},this);return I;}function f(i){return(i["addViaDelegate"]&&i["addViaDelegate"].designTimeMetadata)||(i["addViaCustom"]&&i["addViaCustom"].designTimeMetadata);}var S=true;var g=false;function h(r,i,s,t,C){var N=[];var u;var v;if(i.addViaCustom||i.addViaDelegate){var w=i.aggregation;var x=f(i);u=x.getAggregationDescription(w,s);if(u){v=t?u.singular:u.plural;N.push(v);}}if(i.reveal){i.reveal.controlTypeNames.forEach(function(u){v=t?u.singular:u.plural;N.push(v);});}var y=N.reduce(function(z,B){if(z.indexOf(B)===-1){z.push(B);}return z;},[]);var T=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");if(y.length===1){v=y[0];}else if(C){v=C;}else{v=T.getText("MULTIPLE_CONTROL_NAME");}return T.getText(r,[v]);}function j(i,r){var R;i.reveal.elements.some(function(s){if(s.element.getId()===r.getId()){R=s;return false;}});return R;}function k(i,r){var R=r.responsibleElementOverlay.getParentAggregationOverlay().getAggregationName();return i.aggregation===R;}function l(C,i,r,s){var v=r.changeType&&s.hasStableId(C);if(v&&C!==i.relevantContainerOverlay){v=s.hasStableId(i.relevantContainerOverlay);}return v;}function n(i,r,s,t){return i.reduce(function(u,v){return u.then(function(w){var C=v.changeOnRelevantContainer?r.relevantContainer:r.parent;var x=O.getOverlay(C);var V=l(x,r,v,s);if(V){v.element=C;return a.getDelegateForControl({control:r.relevantContainer,modifier:J,supportsDefault:v.supportsDefaultDelegate}).then(function(y){if(y&&y.names&&y.names.length){var R=a.getRequiredLibrariesForDefaultDelegate({delegateName:y.names,control:r.relevantContainer});if(d(R,t.filter(Boolean)).length===0){v.delegateInfo=y;w.push(v);}}return w;});}return w;});},Promise.resolve([]));}function o(i,r){return this.hasChangeHandler(i.changeType,i.element).then(function(H){if(H){return{aggregationName:i.aggregation,addPropertyActionData:{designTimeMetadata:r,action:i,delegateInfo:{payload:i.delegateInfo.payload||{},delegate:i.delegateInfo.instance,modelType:i.delegateInfo.modelType,requiredLibraries:i.delegateInfo.requiredLibraries}}};}});}function p(C,r){var i=C.getManifestEntry("/sap.ui5/dependencies/libs");return Object.keys(r).some(function(R){return!i[R];});}function q(){var i=[];var r=a.getKnownDefaultDelegateLibraries();r.forEach(function(s){var t=sap.ui.getCore().loadLibrary(s,{async:true}).then(function(){return Promise.resolve(s);}).catch(function(v){L.warning("Required library not available: ",v);return Promise.resolve();});i.push(t);});return Promise.all(i);}var A=P.extend("sap.ui.rta.plugin.additionalElements.AdditionalElementsPlugin",{metadata:{library:"sap.ui.rta",properties:{analyzer:"object",dialog:"object",commandFactory:"object"},associations:{},events:{}},getContextMenuTitle:function(i,r){var s=_(i,r,this);var t=this._getActionsOrUndef(i,r);return h("CTX_ADD_ELEMENTS",t,s.parent,S);},isAvailable:function(i,r){return r.every(function(s){return this._isEditableByPlugin(s,i);},this);},isEnabled:function(i,r){if(r.length>1){return false;}var s=this.getResponsibleElementOverlay(r[0]);var t;var I;if(i){t=s.getParentElementOverlay();if(t){I=true;}else{I=false;}}else{var u=this._getActionsOrUndef(i,s);if((!u.reveal||u.reveal.elements.length===0)&&!u.addViaCustom&&!u.addViaDelegate){I=false;}else{I=true;}}var C=this.getCachedElements(i);var v=C&&C.length>0;I=I&&(v||this.getDialog().getCustomFieldEnabled());return I;},registerElementOverlay:function(i){var M=i.getElement().getModel();if(M){var r=M.getMetaModel();if(r&&r.loaded){r.loaded().then(function(){this.evaluateEditable([i],{onRegistration:true});}.bind(this));}}P.prototype.registerElementOverlay.apply(this,arguments);},_getRevealActions:function(s,i){var r=_(s,i,this);var t=[r.parentOverlay];if(r.relevantContainer!==r.parent){t=E.findAllSiblingsInContainer(r.parent,r.relevantContainer).map(function(w){return O.getOverlay(w);}).filter(function(w){return w;});}var u;if(s){var v=r.responsibleElementOverlay.getParentAggregationOverlay();u=v?[r.responsibleElementOverlay.getParentAggregationOverlay().getAggregationName()]:[];}else{u=r.parentOverlay.getAggregationOverlays().filter(function(w){return!w.getDesignTimeMetadata().isIgnored(r.parent);}).map(function(w){return w.getAggregationName();});}return u.reduce(function(w,x){return w.then(function(R){return this._getRevealActionFromAggregations(t,R,x);}.bind(this));}.bind(this),Promise.resolve({}));},_getRevealActionFromAggregations:function(i,r,s){var I=i.reduce(function(u,v){return v?u.concat(e.call(this,v,s)):u;}.bind(this),[]);var t={elements:[],controlTypeNames:[]};var R=I.reduce(function(u,v){return u.then(function(w){return this._invisibleToReveal(w,v);}.bind(this));}.bind(this),Promise.resolve(t));return R.then(function(u){if(u.elements.length>0){r[s]={reveal:u};}return r;});},_invisibleToReveal:function(r,i){return Promise.resolve().then(function(){var s;var R;var t=false;var H=Promise.resolve();var u=O.getOverlay(i);if(u){s=u.getDesignTimeMetadata();R=s&&s.getAction("reveal",i);if(R&&R.changeType){var v=i;if(R.changeOnRelevantContainer){v=u.getRelevantContainer();}H=this.hasChangeHandler(R.changeType,v).then(function(w){if(w){if(R.changeOnRelevantContainer){var x=_(true,u);t=this.hasStableId(x.relevantContainerOverlay)&&this.hasStableId(x.parentOverlay);}else{t=true;}if(!R.getAggregationName){R.getAggregationName=c;}}}.bind(this));}}return H.then(function(){if(t){r.elements.push({element:i,designTimeMetadata:s,action:R});var N=s.getName(i);if(N){r.controlTypeNames.push(N);}}return r;});}.bind(this));},_getAddViaDelegateActions:function(s,i){var r=_(s,i,this);var t=r.parentOverlay&&r.parentOverlay.getDesignTimeMetadata();return Promise.resolve().then(function(){var u=t?t.getActionDataFromAggregations("add",r.parent,undefined,"delegate"):[];if(u.length){return q().then(n.bind(this,u,r,this));}return[];}.bind(this)).then(function(u){return u.reduce(function(v,w){return v.then(function(R){return o.call(this,w,t).then(function(x){if(x){x.addPropertyActionData.relevantContainer=r.relevantContainer;if(!R[x.aggregationName]){R[x.aggregationName]={};}R[x.aggregationName].addViaDelegate=x.addPropertyActionData;}return R;});}.bind(this));}.bind(this),Promise.resolve({}));}.bind(this));},_checkInvalidAddActions:function(s,i){var r=_(s,i,this);var t=r.parentOverlay&&r.parentOverlay.getDesignTimeMetadata();var u=t?t.getActionDataFromAggregations("addODataProperty",r.parent):[];if(u.length>0){L.error("Outdated addODataProperty action in designtime metadata in "+t.getData().designtimeModule+" or propagated or via instance specific designtime metadata.");}},_getCustomAddActions:function(s,i){var r=_(s,i,this);var t=r.parentOverlay&&r.parentOverlay.getDesignTimeMetadata();var u=t&&t.getActionDataFromAggregations("add",r.parent,undefined,"custom")||[];function v(w,C){var I=[];return Promise.resolve().then(function(){if(w&&typeof w.getItems==="function"){var x=O.getOverlay(C);if(this.hasStableId(x)){return w.getItems(C);}}}.bind(this)).then(function(x){I=x;if(Array.isArray(I)){var y=I.reduce(function(z,B){if(B.changeSpecificData.changeOnRelevantContainer){C=r.relevantContainer;}if(B.changeSpecificData.changeType){z.push(this.hasChangeHandler(B.changeSpecificData.changeType,C));}return z;}.bind(this),[]);return Promise.all(y);}}.bind(this)).then(function(H){if(Array.isArray(H)&&I.length===H.length&&H.indexOf(false)===-1){return{aggregationName:w.aggregation,addViaCustom:{designTimeMetadata:t,action:w,items:I}};}});}var C=r.parent;return u.reduce(function(w,x){return w.then(function(R){return v.call(this,x,C).then(function(y){if(y){R[y.aggregationName]={addViaCustom:y.addViaCustom};}return R;});}.bind(this));}.bind(this),Promise.resolve({}));},_getActions:function(s,i,I){return new Promise(function(r,t){var u=s?"asSibling":"asChild";if(!I&&i._mAddActions){return r(i._mAddActions[u]);}var R=this._getRevealActions(s,i);var v=this._getAddViaDelegateActions(s,i);var C=this._getCustomAddActions(s,i);return Promise.all([R,v,C,this._checkInvalidAddActions(s,i)]).then(function(w){var x=m(w[0],w[1],w[2]);var y=Object.keys(x);if(y.length===0){x={};}else if(y.length>1){L.error("reveal or addViaDelegate or custom add action defined for more than 1 aggregation, that is not yet possible");}if(y.length>0){var z=y[0];x[z].aggregation=z;x=x[z];}i._mAddActions=i._mAddActions||{asSibling:{},asChild:{}};i._mAddActions[u]=x;r(x);}).catch(function(w){t(w);});}.bind(this));},_getActionsOrUndef:function(s,i){var r=s?"asSibling":"asChild";return i._mAddActions&&i._mAddActions[r];},_checkIfCreateFunctionIsAvailable:function(C){return!C||(C&&C.content&&C.content.createFunction);},showAvailableElements:function(i,r,I,C){var R=r[0];var s=_(i,R);var v=i&&R.getElement();var t;return this._getActions(i,R).then(function(u){t=u;}).then(function(){return this.getAllElements(i,[s.responsibleElementOverlay],I,C);}.bind(this)).then(function(u){this.getDialog().setElements(u);return this.getDialog().open().then(function(){return this._createCommands(s,v,t,I);}.bind(this)).then(function(){var w=O.getOverlay(v)||R;w.focus();}).catch(function(w){if(w instanceof Error){throw w;}});}.bind(this)).catch(function(u){if(u instanceof Error){throw u;}else{L.info("Service not up to date, skipping add dialog","sap.ui.rta");}});},_setDialogTitle:function(i,r,C){var s=h("HEADER_ADDITIONAL_ELEMENTS",i,r,g,C);this.getDialog().setTitle(s);if(C){this.getDialog()._oList.setNoDataText(this.getDialog()._oTextResources.getText("MSG_NO_FIELDS",C.toLowerCase()));}},_onOpenCustomField:function(){return F.onTriggerCreateExtensionData(this._oCurrentFieldExtInfo);},_createCommands:function(i,s,r,I){var t=this.getDialog().getSelectedElements();t.sort(function(u,v){if(u.label>v.label){return-1;}if(u.label<v.label){return 1;}return 0;});if(t.length>0){return this.getCommandFactory().getCommandFor(i.parent,"composite").then(function(C){var u=Promise.resolve();t.forEach(function(v){switch(v.type){case"invisible":u=u.then(this._createCommandsForInvisibleElement.bind(this,C,v,i,s,r,I));break;case"delegate":u=u.then(this._createCommandsForAddViaDelegate.bind(this,C,v,i,s,r,I));break;case"custom":u=u.then(this._createCommandsForCustomElement.bind(this,C,v,i,s,r,I));break;default:L.error("Can't create command for untreated element.type "+v.type);}},this);return u.then(function(){return C;});}.bind(this)).then(function(C){this.fireElementModified({command:C});}.bind(this)).catch(function(M){throw D.propagateError(M,"AdditionalElementsPlugin#_createCommands","Error occured during _createCommands execution","sap.ui.rta.plugin");});}return Promise.resolve();},_createCommandsForInvisibleElement:function(C,s,i,r,t,I){return this._createRevealCommandForInvisible(s,t,i).then(function(R){C.addCommand(R);return this._createMoveCommandForInvisible(s,i,r,I);}.bind(this)).then(function(M){if(M){C.addCommand(M);}else{L.warning("No move action configured for "+i.parent.getMetadata().getName()+", aggregation: "+t.aggregation,"sap.ui.rta");}return C;});},_createCommandForAddLibrary:function(i,r,s){if(r){var C=b.getAppComponentForControl(i.relevantContainer);var t=p(C,r);if(t){var M=C.getManifest();var R=M["sap.app"].id;return this.getCommandFactory().getCommandFor(i.publicParent,"addLibrary",{reference:R,parameters:{libraries:r},appComponent:C},s);}}return Promise.resolve();},_createRevealCommandForInvisible:function(s,i,r){var R=E.getElementInstance(s.elementId);var t=O.getOverlay(R);var u=j(i,R);var v=u.designTimeMetadata;var w=u.action;var V;if(t){V=this.getVariantManagementReference(t);}if(w.changeOnRelevantContainer){return this.getCommandFactory().getCommandFor(R,"reveal",{revealedElementId:R.getId(),directParent:r.parent},v,V);}return this.getCommandFactory().getCommandFor(R,"reveal",{},v,V);},_createMoveCommandForInvisible:function(s,i,r,I){var R=E.getElementInstance(s.elementId);var t=O.getOverlay(R);var u=t.getParentAggregationOverlay().getAggregationName();var v=t.getParentElementOverlay().getElement()||i.parent;var T=i.parent;var w=U.getIndex(i.parent,r,u);var x=U.getIndex(v,R,u)-1;w=I!==undefined?I:E.adjustIndexForMove(v,T,x,w);if(w!==x||i.parent!==R.getParent()){var y=O.getOverlay(R)?O.getOverlay(R).getParentAggregationOverlay():i.relevantContainerOverlay;var z=y.getDesignTimeMetadata();var V=this.getVariantManagementReference(t);return this.getCommandFactory().getCommandFor(i.relevantContainer,"move",{movedElements:[{element:R,sourceIndex:x,targetIndex:w}],source:{parent:v,aggregation:u},target:{parent:T,aggregation:u}},z,V);}return Promise.resolve();},_createCommandsForCustomElement:function(C,s,i,r,t,I){var u=i.parent;var v=i.parentOverlay.getAggregationOverlay(t.aggregation).getDesignTimeMetadata();var w=Object.assign({changeOnRelevantContainer:s.changeSpecificData.changeOnRelevantContainer,aggregationName:t.aggregation,changeType:s.changeSpecificData.changeType,addElementInfo:s.changeSpecificData.content,index:I||U.getIndex(i.parent,r,t.aggregation)},s.itemId&&{customItemId:s.itemId});var V;if(i.relevantContainerOverlay){V=this.getVariantManagementReference(i.relevantContainerOverlay);}return this.getCommandFactory().getCommandFor(u,"customAdd",w,v,V).then(function(x){if(x){C.addCommand(x);}return C;});},_createCommandsForAddViaDelegate:function(C,s,i,r,t,I){var u=t.addViaDelegate.action;var R=u.delegateInfo.requiredLibraries;var v=i.parentOverlay.getAggregationOverlay(t.aggregation);var w=v.getDesignTimeMetadata();return this._createCommandForAddLibrary(i,R,w).then(function(x){if(x){C.addCommand(x);}return this._createAddViaDelegateCommand(s,i,w,r,t,I);}.bind(this)).then(function(x){if(x){C.addCommand(x);}return C;});},_createAddViaDelegateCommand:function(s,i,r,t,u,I){var v=u.addViaDelegate.action;var w=v.changeOnRelevantContainer?i.relevantContainer:i.parent;var x=v.changeOnRelevantContainer?i.relevantContainerOverlay:i.parentOverlay;var V=this.getVariantManagementReference(x);var y=U.getIndex(i.parent,t,u.aggregation,r.getData().getIndex);var C="addDelegateProperty";var M=b.getAppComponentForControl(i.parent).getManifest();var z=b.getODataServiceUriFromManifest(M);return this.getCommandFactory().getCommandFor(i.parent,C,{newControlId:U.createFieldLabelId(w,s.entityType,s.bindingPath),index:I!==undefined?I:y,bindingString:s.bindingPath,entityType:s.entityType,parentId:i.parent.getId(),propertyName:s.name,oDataServiceVersion:s.oDataServiceVersion,oDataServiceUri:z,modelType:v.delegateInfo.modelType,relevantContainerId:i.relevantContainer.getId()},r,V);},_isEditable:function(i,r){return Promise.all([this._isEditableCheck(r.sourceElementOverlay,true),this._isEditableCheck(r.sourceElementOverlay,false)]).then(function(s){return{asSibling:s[0],asChild:s[1]};}).catch(function(v){L.error(v);});},_isEditableCheck:function(i,r){return Promise.resolve().then(function(){var s=_(r,i,this);if(!s.relevantContainerOverlay){return false;}return this._getActions(r,i,true).then(function(t){return U.doIfAllControlsAreAvailable([i,s.parentOverlay],function(){var u=false;if(r){u=k(t,s);}if(!u&&t.reveal){u=true;}if(!u&&!r){if(t.addViaDelegate){return this.checkAggregationsOnSelf(s.parentOverlay,"add",undefined,"delegate");}}if(!u&&!r&&t.addViaCustom){u=true;}return u;}.bind(this));}.bind(this)).then(function(t){if(t){t=this.hasStableId(i)&&this.hasStableId(s.parentOverlay);}return t;}.bind(this));}.bind(this));},getAllElements:function(i,r,I,C){var s=r[0];var t=_(i,s,this);var u;var v=[];var w=this.getCachedElements(i);if(w){return w;}return this._getActions(i,s).then(function(x){u=x;v.push(u.reveal?this.getAnalyzer().enhanceInvisibleElements(t.parent,u):Promise.resolve([]),u.addViaDelegate?this.getAnalyzer().getUnrepresentedDelegateProperties(t.parent,u.addViaDelegate):Promise.resolve([]),u.addViaCustom?this.getAnalyzer().getCustomAddItems(t.parent,u.addViaCustom,u.aggregation):Promise.resolve([]));if(u.aggregation||C){this._setDialogTitle(u,t.parent,C);}}.bind(this)).then(function(){if(u.addViaDelegate){return U.isServiceUpToDate(t.parent);}}).then(function(){if(u.addViaDelegate){return F.isExtensibilityEnabled(t.parent);}this.getDialog()._oCustomFieldButton.setVisible(false);}.bind(this)).then(function(x){if(u.addViaDelegate){this.getDialog()._oCustomFieldButton.setVisible(x);this.getDialog().setCustomFieldEnabled(false);return F.getExtensionData(t.parent);}}.bind(this)).then(function(x){if(x){this._oCurrentFieldExtInfo=x;this.getDialog().setCustomFieldEnabled(true);this.getDialog().addExtensionData(this._oCurrentFieldExtInfo.extensionData);this.getDialog().detachEvent("openCustomField",this._onOpenCustomField,this);this.getDialog().attachEvent("openCustomField",null,this._onOpenCustomField,this);}}.bind(this)).then(this._combineAnalyzerResults.bind(this,v)).then(function(x){this.setCachedElements(x,i);return x;}.bind(this)).catch(function(x){throw x;});},getMenuItems:function(r){var s=true;var t="CTX_ADD_ELEMENTS_AS_SIBLING";var R=20;var I="sap-icon://add";var M=[];this.clearCachedElements();return Promise.all([this.getAllElements(true,r),this.getAllElements(false,r)]).then(function(){for(var i=0;i<2;i++){if(this.isAvailable(s,r)){var G=this.getContextMenuTitle.bind(this,s);var u={id:t,text:G,handler:function(s,r){return this.showAvailableElements(s,r);}.bind(this,s),enabled:this.isEnabled.bind(this,s),rank:R,icon:I};M.push(this.enhanceItemWithResponsibleElement(u,r,["addViaDelegate","reveal","custom"]));}s=false;t="CTX_ADD_ELEMENTS_AS_CHILD";R=30;}return M;}.bind(this));},_combineAnalyzerResults:function(i){return Promise.all(i).then(function(r){return this.getAnalyzer().getFilteredItemsList(r);}.bind(this));},clearCachedElements:function(){this._aCachedElements=undefined;},setCachedElements:function(i,r){this._aCachedElements=this._aCachedElements||{};this._aCachedElements[r?"asSibling":"asChild"]=i;},getCachedElements:function(i){if(!this._aCachedElements){return undefined;}return this._aCachedElements[i?"asSibling":"asChild"];}});return A;});
