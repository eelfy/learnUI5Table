/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["./ClusterBase","./library"],function(C,l){"use strict";var a=C.extend("sap.ui.vbm.ClusterGrid",{metadata:{library:"sap.ui.vbm",properties:{gridSize:{type:"string",group:"Behaviour",defaultValue:"256;256"},limit:{type:"int",group:"Behaviour",defaultValue:2},limitTotal:{type:"int",group:"Behaviour",defaultValue:2},orderIndex:{type:"int",group:"Behaviour",defaultValue:null},offset:{type:"string",group:"Appearance",defaultValue:"0;0"},cellSpacing:{type:"int",group:"Appearance",defaultValue:"4"}},aggregations:{},events:{}}});a.prototype.getClusterDefinition=function(){var d=C.prototype.getClusterDefinition.apply(this,arguments);d.type="grid";d.limit=this.getLimit().toString();d.limitOnSum=this.getLimitTotal().toString();d.order=this.getOrderIndex().toString();d.areabordersize=-this.getCellSpacing().toString();var g=this.getGridSize().split(";");d.distanceX=g[0];d.distanceY=g[1];var o=this.getOffset().split(";");d.offsetX=o[0];d.offsetY=o[1];return d;};return a;});
