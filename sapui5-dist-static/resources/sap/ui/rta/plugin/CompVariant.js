/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_omit","sap/base/util/isEmptyObject","sap/ui/dt/Util","sap/ui/rta/plugin/Plugin","sap/ui/rta/plugin/RenameHandler","sap/ui/rta/Utils","sap/ui/fl/write/api/ContextSharingAPI"],function(_,i,D,P,R,U,C){"use strict";var a=P.extend("sap.ui.rta.plugin.CompVariant",{metadata:{library:"sap.ui.rta",properties:{oldValue:{type:"string"}}}});function b(o){return o.getElement().getMetadata().getName()==="sap.ui.comp.smartvariants.SmartVariantManagement";}function c(v){return v.isSpecialVariant(v.getPresentVariantId());}function d(o,n,p){var l=o.getDesignTimeMetadata();var t=o.getElement();return this.getCommandFactory().getCommandFor(t,n,p,l).then(function(m){this.fireElementModified({command:m});}.bind(this)).catch(function(m){throw D.createError(n,m,"sap.ui.rta.plugin.CompVariant");});}function g(o){return o.getElement().getAllVariants();}function r(o){this.startEdit(o[0]);}a.prototype.startEdit=function(o){var v=o.getDesignTimeMetadata().getData().variantRenameDomRef;R.startEdit.call(this,{overlay:o,domRef:v,pluginMethodName:"plugin.CompVariant.startEdit"});};a.prototype.stopEdit=function(l){R._stopEdit.call(this,l,"plugin.CompVariant.stopEdit");};a.prototype._emitLabelChangeEvent=function(){var o=this._oEditedOverlay;var v=o.getElement().getPresentVariantId();var t=R._getCurrentEditableFieldText.call(this);var p={newVariantProperties:{}};p.newVariantProperties[v]={name:t};d.call(this,o,"compVariantUpdate",p);};function e(o){var v=o[0].getElement();var l=C.createComponent(this.getCommandFactory().getFlexSettings());v.openManageViewsDialogForKeyUser(U.getRtaStyleClassName(),function(m){if(!i(m)){d.call(this,o[0],"compVariantUpdate",{newVariantProperties:_(m,["default"]),newDefaultVariantId:m.default,oldDefaultVariantId:v.getDefaultVariantId()});}}.bind(this),l);}function f(o){return g(o[0]).length>1;}function s(o,p){var v=o[0].getElement();var E=p.eventItem.data();d.call(this,o[0],"compVariantSwitch",{targetVariantId:E.key,sourceVariantId:v.getPresentVariantId()});}function h(o){var v=o[0].getElement();v.getPresentVariantContent().then(function(l){var p={onlySave:true,newVariantProperties:{}};p.newVariantProperties[v.getPresentVariantId()]={content:l};d.call(this,o[0],"compVariantUpdate",p);}.bind(this));}function j(o){return o[0].getElement().currentVariantGetModified();}function k(o){var v=o[0].getElement();var l=C.createComponent(this.getCommandFactory().getFlexSettings());v.openSaveAsDialogForKeyUser(U.getRtaStyleClassName(),function(m){if(m){d.call(this,o[0],"compVariantSaveAs",{newVariantProperties:{"default":m.default,executeOnSelect:m.executeOnSelect,content:m.content,type:m.type,text:m.text,contexts:m.contexts},previousDirtyFlag:v.getModified(),previousVariantId:v.getPresentVariantId(),previousDefault:v.getDefaultVariantId()});}}.bind(this),l);}a.prototype._isEditable=function(o){return b(o)&&this.hasStableId(o);};a.prototype.getMenuItems=function(E){var o=E[0];var v=o.getElement();var m=[];if(this._isEditable(o)){var l=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");if(!c(v)){m.push({id:"CTX_COMP_VARIANT_RENAME",text:l.getText("CTX_RENAME"),handler:r.bind(this),enabled:true,rank:210,icon:"sap-icon://edit"});m.push({id:"CTX_COMP_VARIANT_SAVE",text:l.getText("CTX_VARIANT_SAVE"),handler:h.bind(this),enabled:j,rank:220,icon:"sap-icon://save"});}m.push({id:"CTX_COMP_VARIANT_SAVE_AS",text:l.getText("CTX_VARIANT_SAVEAS"),handler:k.bind(this),enabled:true,rank:230,icon:"sap-icon://duplicate"});m.push({id:"CTX_COMP_VARIANT_MANAGE",text:l.getText("CTX_VARIANT_MANAGE"),handler:e.bind(this),enabled:true,rank:240,icon:"sap-icon://action-settings"});var V=g(o);var S=V.map(function(n){var p=v.getPresentVariantId()===n.getId();var I={id:n.getId(),text:n.getText("variantName"),icon:p?"sap-icon://accept":"blank",enabled:!p};return I;});m.push({id:"CTX_COMP_VARIANT_SWITCH",text:l.getText("CTX_VARIANT_SWITCH"),handler:s.bind(this),enabled:f,submenu:S,rank:250,icon:"sap-icon://switch-views"});}return m;};a.prototype.getActionName=function(){return"compVariant";};return a;});
