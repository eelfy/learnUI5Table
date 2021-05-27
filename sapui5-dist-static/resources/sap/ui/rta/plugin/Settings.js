/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/rta/plugin/Plugin","sap/ui/rta/Utils","sap/ui/dt/Util","sap/base/Log"],function(P,U,D,B){"use strict";var S=P.extend("sap.ui.rta.plugin.Settings",{metadata:{library:"sap.ui.rta",properties:{commandStack:{type:"any"}},associations:{},events:{}}});var p="CTX_SETTINGS";S.prototype._isEditable=function(o){var s=this.getAction(o);if(s){if(s.handler){return this.hasStableId(o);}var h=Object.keys(s).some(function(a){var b=s[a];return b.handler&&this._checkRelevantContainerStableID(b,o);}.bind(this));if(h){return this.hasStableId(o);}}return false;};S.prototype.isEnabled=function(e){var E=e[0];var a=this.getAction(E);if(!a){return false;}if(typeof a.isEnabled!=="undefined"){if(typeof a.isEnabled==="function"){return a.isEnabled(E.getElement());}return a.isEnabled;}return true;};S.prototype._getUnsavedChanges=function(i,c){var e;var u=this.getCommandStack().getAllExecutedCommands().filter(function(C){e=C.getElementId&&C.getElementId()||C.getElement&&C.getElement().getId();if(e===i&&c.indexOf(C.getChangeType())>=0){return true;}}).map(function(C){return C.getPreparedChange();});return u;};S.prototype._handleFlexChangeCommand=function(c,s,C,r){var m=c.changeSpecificData;var v;var a=c.selectorElement||c.selectorControl;var b;var o;if(a.controlType){b=a.controlType;}else{o=a;}return this.hasChangeHandler(m.changeType,o,b).then(function(h){if(s[0].getVariantManagement&&h){v=s[0].getVariantManagement();}return this.getCommandFactory().getCommandFor(a,"settings",m,undefined,v);}.bind(this)).then(function(d){if(r){d.setRuntimeOnly(r);}return C.addCommand(d);});};S.prototype._handleAppDescriptorChangeCommand=function(c,e,C){var m=c.changeSpecificData;var o=c.appComponent;var M=o.getManifest();var r=M["sap.app"].id;return this.getCommandFactory().getCommandFor(e,"appDescriptor",{reference:r,appComponent:o,changeType:m.appDescriptorChangeType,parameters:m.content.parameters,texts:m.content.texts}).then(function(a){return C.addCommand(a);});};S.prototype._handleCompositeCommand=function(e,E,c,r){var C;return this.getCommandFactory().getCommandFor(E,"composite").then(function(_){C=_;}).then(function(){return c.map(function(m){var a=m.changeSpecificData;if(a.changeType){return this._handleFlexChangeCommand(m,e,C,r);}else if(a.appDescriptorChangeType){return this._handleAppDescriptorChangeCommand(m,E,C);}},this);}.bind(this)).then(function(a){return Promise.all(a);}).then(function(){if(C.getCommands().length>0){this.fireElementModified({command:C});}}.bind(this));};S.prototype.handler=function(e,m,r){m=m||{};var E=e[0].getElement();var h=m.fnHandler;if(!h){h=e[0].getDesignTimeMetadata().getAction("settings").handler;if(!h){throw new Error("Handler not found for settings action");}}m.getUnsavedChanges=this._getUnsavedChanges.bind(this);m.styleClass=U.getRtaStyleClassName();return h(E,m).then(function(c){if(c.length>0){return this._handleCompositeCommand(e,E,c,r);}}.bind(this)).catch(function(v){throw D.propagateError(v,"Settings#handler","Error occured during handler execution","sap.ui.rta.plugin");});};S.prototype.getMenuItems=function(e){var E=e[0];var s=this.getAction(E);var m=[];if(s){var r=110;if(s.handler){s={settings:s};}var a=Object.keys(s);a.forEach(function(b,i,A){var o=s[b];if(o.handler&&this._checkRelevantContainerStableID(o,E)&&this.isAvailable([E])){var c=A.length===1;m.push({id:c?p:p+i,rank:c?r:r+i,text:this.getActionText(E,o,p),icon:g(o),enabled:(typeof o.isEnabled==="function"&&function(e){return o.isEnabled(e[0].getElement());}||o.isEnabled||this.isEnabled([E])),handler:function(h,e,d){d=d||{};d.fnHandler=h;return this.handler(e,d,o.runtimeOnly);}.bind(this,o.handler),submenu:f(o.submenu)});}else{B.warning("Handler not found for settings action '"+b+"' or relevant container has no stable id");}},this);}return m;};function f(s){if(s){return s.map(function(o,i){return{id:o.key||p+"_SUB_"+i,icon:o.icon||"blank",text:o.name||"",enabled:o.hasOwnProperty("enabled")?o.enabled:true};});}}function g(s){var d="sap-icon://key-user-settings";var a=s.icon;if(!a){return d;}if(typeof a!=="string"){B.error("Icon setting for settingsAction should be a string");return d;}return a;}S.prototype.getActionName=function(){return"settings";};return S;});
