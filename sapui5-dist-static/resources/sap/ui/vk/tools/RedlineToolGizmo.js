/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Gizmo","./RedlineToolGizmoRenderer"],function(G,R){"use strict";var a=G.extend("sap.ui.vk.tools.RedlineToolGizmo",{metadata:{library:"sap.ui.vk",aggregations:{redlineElements:{type:"sap.ui.vk.RedlineElement"},activeElement:{type:"sap.ui.vk.RedlineElement",multiple:false,visibility:"hidden"}}}});a.prototype.init=function(){if(G.prototype.init){G.prototype.init.apply(this);}this._activeElement=null;this._virtualLeft=0;this._virtualTop=0;this._virtualSideLength=1;};a.prototype.show=function(){this.getParent()._viewport.attachEvent("resize",null,this._onResize,this);this.addStyleClass("sapUiVizkitRedlineInteractionMode");};a.prototype.hide=function(){this.getParent()._viewport.detachEvent("resize",this._onResize,this);this.removeStyleClass("sapUiVizkitRedlineDesignMode");this.removeStyleClass("sapUiVizkitRedlineInteractionMode");};a.prototype._startAdding=function(e){this._activeElement=e;this._activeElement.attachElementClicked(this.getParent().onElementClicked,this.getParent());this.setAggregation("activeElement",this._activeElement);this.removeStyleClass("sapUiVizkitRedlineInteractionMode");this.addStyleClass("sapUiVizkitRedlineDesignMode");};a.prototype.removeRedlineElement=function(b){var e;var c=this.getRedlineElements();switch(typeof b){case"string":for(var i=0;i<c.length;i++){if(c[i].getId()==b){e=c[i];break;}}break;case"object":for(var j=0;j<c.length;j++){if(c[j]==b){e=c[j];break;}}break;case"number":e=c[b];break;default:break;}e.detachElementClicked(this.getParent().onElementClicked,this.getParent());this.removeAggregation("redlineElements",e);};a.prototype.removeAllRedlineElements=function(){};a.prototype._stopAdding=function(){this.setAggregation("activeElement",null);this._activeElement=null;this.removeStyleClass("sapUiVizkitRedlineDesignMode");this.addStyleClass("sapUiVizkitRedlineInteractionMode");};a.prototype._toVirtualSpace=function(x,y){if(arguments.length===1){return x/this._virtualSideLength;}else{return{x:(x-this._virtualLeft)/this._virtualSideLength,y:(y-this._virtualTop)/this._virtualSideLength};}};a.prototype._toPixelSpace=function(x,y){if(arguments.length===1){return x*this._virtualSideLength;}else{return{x:x*this._virtualSideLength+this._virtualLeft,y:y*this._virtualSideLength+this._virtualTop};}};a.prototype._onResize=function(){if(this.getDomRef()){this.rerender();}};a.prototype._getPanningRatio=function(){var c=this.getDomRef().getBoundingClientRect(),h=c.height,w=c.width;if(this._virtualLeft===0&&(h<w&&this._virtualTop<0||(h>w&&this._virtualTop>0))){return h/w;}return 1;};a.prototype.onBeforeRendering=function(){var v=this.getParent()._viewport;if(v&&v.getDomRef()){var b=v.getOutputSize();this._virtualLeft=b.left;this._virtualTop=b.top;this._virtualSideLength=b.sideLength;}};return a;});
