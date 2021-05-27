/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element","sap/base/Log"],function(E,L){"use strict";var T=E.extend("sap.ui.vk.tools.Tool",{metadata:{properties:{targetViewportType:"any",toolid:"string",active:{type:"boolean",defaultValue:false},footprint:{type:"string[]"}},associations:{gizmoContainer:{type:"sap.ui.core.Control",cardinality:"0..1"}},aggregations:{gizmo:{type:"sap.ui.vk.tools.Gizmo",multiple:false}},events:{enabled:{parameters:{enabled:"boolean",reason:"string"}}}},constructor:function(i,s){E.apply(this,arguments);this._viewport=null;this._handler=null;}});T.prototype.init=function(){if(E.prototype.init){E.prototype.init.call(this);}};T.prototype.setViewport=function(v){var t=v&&v.getMetadata().getName();this._viewport=this.getFootprint().indexOf(t)>=0?v:null;};T.prototype.isViewportType=function(t){if(this._viewport&&this._viewport.getMetadata().getName()===t){return true;}return false;};T.prototype.getViewportImplementation=function(v){var r=v;if(v&&typeof v.getImplementation==="function"){r=v.getImplementation()||v;}return r;};T.prototype.setActive=function(v,a,g){var b=this.getViewportImplementation(a)||this._viewport;var t=b&&b.getMetadata().getName();var r;if(this.getFootprint().indexOf(t)>=0){this._viewport=b;this.setProperty("active",v,true);if(this.getGizmo()){g=g||b;this.setAssociation("gizmoContainer",g);if(g.getDomRef()){g.invalidate();}}this._viewport.setShouldRenderFrame();r=v?"":"Disabled by application logic";}else{this._viewport=null;this.setProperty("active",false,true);r="Tool does not support Viewport type: "+t;L.warning(r);}this.fireEnabled({enabled:this.getActive(),reason:r});};T.prototype.getGizmoForContainer=function(r){var _=this.getGizmo();if((r.getId()===this.getGizmoContainer())&&_&&this.getActive()){return _;}};T.prototype.destroy=function(){E.prototype.destroy.call(this);this._viewport=null;this._handler=null;};T.prototype._addLocoHandler=function(){if(!this._viewport||!this._viewport._loco){return false;}this._viewport._loco.addHandler(this._handler,this._handler._priority);return true;};T.prototype._removeLocoHandler=function(p){if(this._viewport&&this._viewport._loco){this._viewport._loco.removeHandler(this._handler);}};return T;});
