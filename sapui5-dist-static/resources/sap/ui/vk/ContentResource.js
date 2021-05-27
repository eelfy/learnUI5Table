/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./ContentResourceSourceTypeToCategoryMap"],function(M,C){"use strict";var a=M.extend("sap.ui.vk.ContentResource",{metadata:{properties:{source:"any",sourceType:"string",sourceId:"string",localMatrix:"sap.ui.vk.TransformationMatrix",name:"string",password:"string",useSecureConnection:{type:"boolean",defaultValue:true},veid:"string",includeHidden:"boolean",includeAnimation:"boolean",pushPMI:"boolean",metadataFilter:"string",activateView:"string",enableLogger:"boolean",pushViewGroups:"boolean",includeBackground:"boolean",includeParametric:"boolean"},aggregations:{contentResources:"sap.ui.vk.ContentResource"}},constructor:function(i,s,S){M.apply(this,arguments);}});a.prototype.isTreeBinding=function(n){return n==="contentResources";};a.prototype.destroy=function(){M.prototype.destroy.call(this);};a.prototype.setLocalMatrix=function(v){var n=this.getNodeProxy();if(n){n.setLocalMatrix(v);}this.setProperty("localMatrix",v,true);return this;};a.prototype.getSourceProperties=function(){return this._shadowContentResource&&this._shadowContentResource.sourceProperties||{};};a.prototype.getNodeProxy=function(){return this._shadowContentResource&&this._shadowContentResource.nodeProxy||null;};a.collectCategories=function(r){var c=[];var m={};function g(b){var s=(b.getSourceType()||"").toLowerCase();if(s){var d=C[s]||"unknown";if(!m.hasOwnProperty(d)){m[d]=true;c.push(d);}}b.getContentResources().forEach(g);}r.forEach(g);return c;};return a;});
