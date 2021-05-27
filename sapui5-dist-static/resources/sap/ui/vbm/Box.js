/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["./VoBase","./library"],function(V,l){"use strict";var B=V.extend("sap.ui.vbm.Box",{metadata:{library:"sap.ui.vbm",properties:{position:{type:"string",group:"Misc",defaultValue:'0;0;0'},scale:{type:"string",group:"Misc",defaultValue:'1;1;1'},color:{type:"string",group:"Misc",defaultValue:'RGB(255;0;0)'},colorBorder:{type:"string",group:"Misc",defaultValue:'RGB(255;0;0)'}},events:{}}});B.prototype.openDetailWindow=function(c,o,O){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:O},true);};B.prototype.openContextMenu=function(m){this.oParent.openContextMenu("Box",this,m);};B.prototype.getDataElement=function(){var e=V.prototype.getDataElement.apply(this,arguments);var b=this.oParent.mBindInfo;if(b.P){e.P=this.getPosition();}if(b.S){e.S=this.getScale();}if(b.C){e.C=this.getColor();}if(b.CB){e.CB=this.getColorBorder();}return e;};B.prototype.handleChangedData=function(e){if(e.P){this.setPosition(e.P);}if(e.S){this.setScale(e.S);}};return B;});
