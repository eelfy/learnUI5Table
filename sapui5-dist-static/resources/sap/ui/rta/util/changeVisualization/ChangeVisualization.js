/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/rta/util/changeVisualization/ChangeIndicator","sap/ui/rta/util/changeVisualization/ChangeIndicatorRegistry","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/write/api/PersistenceWriteAPI","sap/ui/fl/Layer","sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/base/util/restricted/_difference","sap/ui/fl/Utils","sap/ui/fl/apply/_internal/changes/Utils","sap/ui/dt/OverlayRegistry","sap/base/util/deepEqual","sap/ui/events/KeyCodes","sap/m/ButtonType","sap/ui/dt/ElementUtil"],function(C,a,b,J,P,L,F,c,R,d,e,f,O,g,K,B,E){"use strict";var V={add:["createContainer","addDelegateProperty","reveal","addIFrame"],move:["move"],rename:["rename"],combinesplit:["combine","split"],remove:["remove"]};var h="all";var i=C.extend("sap.ui.rta.util.changeVisualization.ChangeVisualization",{metadata:{properties:{rootControlId:{type:"string"},isActive:{type:"boolean",defaultValue:false}},aggregations:{popover:{type:"sap.m.Popover",multiple:false}}},constructor:function(){C.prototype.constructor.apply(this,arguments);this._oChangeIndicatorRegistry=new b({commandCategories:V});this._oTextBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");this.setModel(new R({bundle:this._oTextBundle}),"i18n");this._oPopoverModel=new c();this._oPopoverModel.setDefaultBindingMode("OneWay");this._oChangeIndicatorModel=new c({active:this.getIsActive()});this._oChangeIndicatorModel.setDefaultBindingMode("OneWay");}});i.prototype.setRootControlId=function(r){if(this.getRootControlId()&&this.getRootControlId()!==r){this._reset();}this.setProperty("rootControlId",r);};i.prototype._getComponent=function(){return e.getAppComponentForControl(E.getElementInstance(this.getRootControlId()));};i.prototype.setIsActive=function(A){if(A===this.getIsActive()){return;}this.setProperty("isActive",A);if(this._oChangeIndicatorModel){this._updateIndicatorModel({active:A});}if(this._oToolbarButton){this._oToolbarButton.setType(A?B.Emphasized:B.Transparent);this._oToolbarButton.setTooltip(this._oTextBundle.getText(A?"BUT_CHANGEVISUALIZATION_HIDECHANGES":"BUT_CHANGEVISUALIZATION_SHOWCHANGES"));}};i.prototype.exit=function(){this._oChangeIndicatorRegistry.destroy();};i.prototype._reset=function(){this._oChangeIndicatorRegistry.reset();};i.prototype.toggleActive=function(o){if(!this._oToolbarButton){this._oToolbarButton=sap.ui.getCore().byId(o.getParameter("id"));}var I=this.getIsActive();if(I){this.setIsActive(false);}else{this._togglePopover();}};i.prototype._updatePopoverModel=function(){var j=Object.keys(V).map(function(s){return{key:s,count:this._getChangesForCommandCategory(s).length,title:this._getCommandCategoryLabel(s)};}.bind(this));j.unshift({key:h,count:this._getChangesForCommandCategory(h).length,title:this._getCommandCategoryLabel(h)});this._oPopoverModel.setData(j);};i.prototype._getChangesForCommandCategory=function(s){var r=this._oChangeIndicatorRegistry.getChanges();return r.filter(function(o){return s===h?o.commandCategory!==undefined:s===o.commandCategory;});};i.prototype._getCommandCategoryLabel=function(s){var l="TXT_CHANGEVISUALIZATION_OVERVIEW_"+s.toUpperCase();return this._oTextBundle.getText(l);};i.prototype._togglePopover=function(){var p=this.getPopover();if(!(p&&p.isOpen())){this._updateChangeRegistry().then(this._updatePopoverModel.bind(this));}if(!p){F.load({name:"sap.ui.rta.util.changeVisualization.ChangesListPopover",id:this._getComponent().createId("changeVisualization_changesListPopover"),controller:this}).then(function(p){this._oToolbarButton.addDependent(p);p.setModel(this._oPopoverModel,"commandModel");p.openBy(this._oToolbarButton);this.setPopover(p);}.bind(this));return;}if(p.isOpen()){p.close();}else{p.openBy(this._oToolbarButton);}};i.prototype.onCommandCategorySelection=function(o){var s=o.getSource().getBindingContext("commandModel").getObject().key;this._selectCommandCategory(s);};i.prototype._selectCommandCategory=function(s){this.getPopover().close();this.setIsActive(true);var r=this._getChangesForCommandCategory(s);this._updateIndicatorModel({selectedChange:undefined,commandCategory:s});return Promise.all(r.map(function(o){return this._getChangedElements(o).then(function(S){this._oChangeIndicatorRegistry.addSelectorsForChangeId(o.change.getId(),S);}.bind(this));}.bind(this))).then(function(){this._updateChangeIndicators();this._setFocusedIndicator();}.bind(this));};i.prototype._getChangedElements=function(o){var j=this._getComponent();function k(s){if(!s){return undefined;}return s.map(function(S){var l=typeof S.getId==="function"?S:J.bySelector(S,j);return l&&l.getId();}).filter(Boolean);}return this._getInfoFromChangeHandler(j,o.change).then(function(I){var v=I||{};var A=(k(v.affectedControls||[o.change.getSelector()]));return{affectedElementIds:A,dependentElementIds:k(v.dependentControls)||[],displayElementIds:k(v.displayControls)||A};});};i.prototype._getCommandForChange=function(o){var s=o.getDefinition().support.command;if(s){return s;}var j=this._getComponent();var S=J.bySelector(o.getSelector(),j);var l=o.getDependentSelectorList().slice(-1)[0];var k=J.bySelector(l,j);function m(n,A){var p=n.getElement();var s=n.getDesignTimeMetadata().getCommandName(o.getChangeType(),p,A);if(s){return s;}var q=n.getParentElementOverlay();var r=n.getParentAggregationOverlay();if(n.getElement().getId()===S.getId()||!q){return undefined;}return m(q,r&&r.getAggregationName());}return S&&k&&m(O.getOverlay(k));};i.prototype._getInfoFromChangeHandler=function(A,o){var j=J.bySelector(o.getSelector(),A);if(j){var p={modifier:J,appComponent:A,view:e.getViewForControl(j)};var m=f.getControlIfTemplateAffected(o,j,p);return f.getChangeHandler(o,m,p).then(function(k){if(k&&typeof k.getChangeVisualizationInfo==="function"){return k.getChangeVisualizationInfo(o,A);}});}return Promise.resolve();};i.prototype._collectChanges=function(){var o=this._getComponent();var p={oComponent:o,selector:o,invalidateCache:false,includeVariants:true,currentLayer:L.CUSTOMER};return P._getUIChanges(p);};i.prototype._updateChangeRegistry=function(){return this._collectChanges().then(function(j){var r=this._oChangeIndicatorRegistry.getChangeIds();var o=j.reduce(function(l,m){l[m.getId()]=m;return l;},{});var k=Object.keys(o);d(r,k).forEach(function(s){this._oChangeIndicatorRegistry.removeChange(s);}.bind(this));d(k,r).forEach(function(s){var l=o[s];var m=this._getCommandForChange(l);this._oChangeIndicatorRegistry.registerChange(l,m);}.bind(this));}.bind(this));};i.prototype.selectChange=function(o){var s=o.getParameter("changeId");this._selectChange(s);};i.prototype._selectChange=function(s){this._updateIndicatorModel({selectedChange:s});this._updateChangeIndicators();};i.prototype._updateIndicatorModel=function(D){this._oChangeIndicatorModel.setData(Object.assign({},this._oChangeIndicatorModel.getData(),D));};i.prototype._updateChangeIndicators=function(){var s=this._oChangeIndicatorRegistry.getChangeIndicatorData();var I={};Object.keys(s).forEach(function(S){var j=s[S];var o=O.getOverlay(S);if(!o||!o.getDomRef()){return undefined;}var k=o.getDomRef().getClientRects()[0]||{left:0,top:0};I[S]={posX:parseInt(k.left),posY:parseInt(k.top),changes:this._filterRelevantChanges(j)};if(!this._oChangeIndicatorRegistry.hasChangeIndicator(S)){this._createChangeIndicator(o,S);}}.bind(this));if(!g(I,this._oChangeIndicatorModel.getData().content)){this._updateIndicatorModel({content:I});}};i.prototype._filterRelevantChanges=function(j){if(!Array.isArray(j)){return j;}var r=this._oChangeIndicatorModel.getData();return j.filter(function(o){return((!r.selectedChange&&!o.dependent&&(r.commandCategory==='all'||r.commandCategory===o.commandCategory))||(!!r.selectedChange&&o.id===r.selectedChange));});};i.prototype._createChangeIndicator=function(o,s){var j=new a({changes:"{changes}",mode:{path:"changes",formatter:function(k){var S=this.getModel().getData().selectedChange;return(!!S&&(k||[]).some(function(l){return l.dependent;}))?"dependent":"change";}},posX:"{posX}",posY:"{posY}",visible:"{= ${/active} && (${changes} || []).length > 0}",overlayId:o.getId(),selectorId:s,selectChange:this.selectChange.bind(this),keyPress:this._onIndicatorKeyPress.bind(this)});j.setModel(this._oChangeIndicatorModel);j.bindElement("/content/"+s);j.setModel(this.getModel("i18n"),"i18n");j.placeAt(sap.ui.getCore().getStaticAreaRef());this._oChangeIndicatorRegistry.registerChangeIndicator(s,j);};i.prototype._onIndicatorKeyPress=function(o){var j=o.getParameter("originalEvent");var k=j.keyCode;var I=o.getSource();if(k===K.ARROW_UP||k===K.ARROW_LEFT||(k===K.TAB&&j.shiftKey)){j.stopPropagation();j.preventDefault();this._setFocusedIndicator(I,-1);}else if(k===K.ARROW_DOWN||k===K.ARROW_RIGHT||k===K.TAB){j.stopPropagation();j.preventDefault();this._setFocusedIndicator(I,1);}else if(k===K.ESCAPE){this.setIsActive(false);}};i.prototype._setFocusedIndicator=function(s,D){var v=this._oChangeIndicatorRegistry.getChangeIndicators().filter(function(o){return o.getVisible();}).sort(function(o,j){var k=o.getPosY()-j.getPosY();var l=o.getPosX()-j.getPosX();return k||l;});if(v.length===0){return;}var I=s?(v.length+v.indexOf(s)+D)%v.length:0;v[I].focus();};return i;});