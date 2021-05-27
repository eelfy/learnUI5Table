/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/m/library','sap/ui/core/Control','sap/m/ActionSheet',"sap/ui/Device","./LinkActionSheetRenderer"],function(q,M,C,A,D,L){"use strict";var a=A.extend("sap.suite.ui.commons.LinkActionSheet",{metadata:{deprecated:true,library:"sap.suite.ui.commons",aggregations:{items:{type:"sap.ui.core.Control",multiple:true,singularName:"item"}},events:{itemPress:{allowPreventDefault:true,parameters:{item:{type:"sap.ui.core.Control"}}}}}});a.prototype.init=function(){if(D.system.desktop){A.prototype.init.apply(this);this.getButtons=this.getItems;}else{this._setItemNavigation=function(){};this.attachBeforeOpen(function(){this.onclick=function(e){e.preventDefault();};}).attachAfterOpen(function(){this.onclick=function(e){};});}};a.prototype._preProcessActionItem=function(i){if(i.getType&&i.getType()!==M.ButtonType.Accept&&i.getType()!==M.ButtonType.Reject){i.setType(M.ButtonType.Transparent);i.addStyleClass("sapMBtnInverted");}i.onsapenter=function(){this._bEnterWasPressed=true;};return this;};a.prototype._itemSelected=function(e){var i=e.getSource();if(this.fireItemPress({item:i})){if(!(D.os.ios&&D.system.ipad||(!D.system.phone))&&this._parent){this._parent._oCloseTrigger=this;}this.close();}i._bEnterWasPressed=undefined;};a.prototype.addItem=function(i){this.addAggregation("items",i,false);this._preProcessActionItem(i);i.attachPress(this._itemSelected,this);return this;};a.prototype.insertItem=function(i,I){this.insertAggregation("items",i,I,false);this._preProcessActionItem(i);i.attachPress(this._itemSelected,this);return this;};a.prototype.removeItem=function(i){var r=this.removeAggregation("items",i,false);if(r){r.detachPress(this._itemSelected,this);i.onsapenter=undefined;}return r;};a.prototype.removeAllItems=function(){var r=this.removeAllAggregation("items",false);q.each(r,function(i,I){I.detachPress(this._itemSelected,this);I.onsapenter=undefined;}.bind(this));return r;};a.prototype.clone=function(){var I=this.getItems(),o,i;for(i=0;i<I.length;i++){o=I[i];o.detachPress(this._itemSelected,this);}var c=C.prototype.clone.apply(this,arguments);for(i=0;i<I.length;i++){o=I[i];o.attachPress(this._itemSelected,this);}return c;};return a;});
