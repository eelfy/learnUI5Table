/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BasePanel","sap/m/Label","sap/m/ColumnListItem","sap/m/HBox","sap/m/VBox","sap/ui/core/Icon","sap/m/Text","sap/m/Column","sap/m/Table","sap/m/library"],function(B,L,C,H,V,I,T,a,b,l){"use strict";var c=l.ListKeyboardMode;var F=l.FlexJustifyContent;var d=l.ListType;var e=B.extend("sap.ui.mdc.p13n.panels.ListView",{metadata:{library:"sap.ui.mdc",properties:{enableReorder:{type:"boolean",defaultValue:true}}},renderer:{}});e.prototype.applySettings=function(){B.prototype.applySettings.apply(this,arguments);this.addStyleClass("sapUiMDCListView");this._aInitializedFields=[];this._bShowFactory=false;this.displayColumns();this.setTemplate(this._getListTemplate());};e.prototype._getListTemplate=function(){return new C({selected:"{"+this.P13N_MODEL+">visible}",visible:"{"+this.P13N_MODEL+">visibleInDialog}",type:d.Active,cells:[new V({items:[new L({wrapping:true,required:"{"+this.P13N_MODEL+">required}",tooltip:"{"+this.P13N_MODEL+">tooltip}",text:"{"+this.P13N_MODEL+">label}"})]}),new H({justifyContent:F.Center,items:[new I({src:"sap-icon://circle-task-2",size:"0.5rem",color:sap.ui.core.IconColor.Neutral,visible:{path:this.P13N_MODEL+">isFiltered",formatter:function(i){if(i){return true;}else{return false;}}}})]})]});};e.prototype.setEnableReorder=function(E){var o=this.getTemplate();if(E){o.addEventDelegate({onmouseover:this._hoverHandler.bind(this)});}else{o=this._getListTemplate();}this._setMoveButtonVisibility(true);this.setTemplate(o);this.setProperty("enableReorder",E);return this;};e.prototype._hoverHandler=function(E){if(this._oSelectedItem&&!this._oSelectedItem.bIsDestroyed){return;}var h=sap.ui.getCore().byId(E.currentTarget.id);this._handleHover(h);};e.prototype._handleHover=function(h){this.removeMoveButtons();if(this._oHoveredItem&&this._oHoveredItem.getBindingContextPath()){var v=!!this.getP13nModel().getProperty(this._oHoveredItem.getBindingContextPath()).isFiltered;var o=this._oHoveredItem.getCells()[1].getItems()[0];o.setVisible(v);}var i=h.getCells()[1].getItems()[0];i.setVisible(false);this._oHoveredItem=h;this._updateEnableOfMoveButtons(h,false);this._addMoveButtons(h);};e.prototype.removeMoveButtons=function(){var m=this._getMoveButtonContainer();if(m){m.removeItem(this._getMoveTopButton());m.removeItem(this._getMoveUpButton());m.removeItem(this._getMoveDownButton());m.removeItem(this._getMoveBottomButton());}};e.prototype._getMoveButtonContainer=function(){if(this._oMoveBottomButton&&this._oMoveBottomButton.getParent()&&this._oMoveBottomButton.getParent().isA("sap.m.FlexBox")){return this._oMoveBottomButton.getParent();}};e.prototype.showFactory=function(s){this._bShowFactory=s;this.displayColumns();if(s){this.removeStyleClass("listViewHover");this._addFactoryControl();}else{this.addStyleClass("listViewHover");this._removeFactoryControl();}};e.prototype.setP13nModel=function(m){this.setModel(m,"$p13n");this.setPanelMode(true);this._getDragDropConfig().setEnabled(this.getEnableReorder());};e.prototype._removeFactoryControl=function(){this._oListControl.getItems().forEach(function(i){var f=i.getCells()[0];if(f.getItems().length>1){f.removeItem(f.getItems()[1]);}});this.removeStyleClass("sapUiMDCAFLabelMarkingList");return this._aInitializedFields;};e.prototype._onItemPressed=function(E){var t=E.getParameter('listItem');if(t.getBindingContext(this.P13N_MODEL).getProperty("visible")){B.prototype._onItemPressed.apply(this,arguments);if(this.getEnableReorder()){this._handleHover(t);}}};e.prototype._moveSelectedItem=function(){this._oSelectedItem=this._getMoveButtonContainer().getParent();B.prototype._moveSelectedItem.apply(this,arguments);};e.prototype._moveTableItem=function(){B.prototype._moveTableItem.apply(this,arguments);this._handleHover(this._oSelectedItem);};e.prototype.getShowFactory=function(){return this._bShowFactory;};e.prototype.displayColumns=function(){var f=[this.getResourceText("p13nDialog.LIST_VIEW_COLUMN")];if(!this._bShowFactory){f.push(new a({width:"25%",hAlign:"Center",vAlign:"Middle",header:new T({text:this.getResourceText("p13nDialog.LIST_VIEW_ACTIVE")})}));}this.setPanelColumns(f);};e.prototype._addFactoryControl=function(o){this._oListControl.getItems().forEach(function(i){var f=i.getBindingContext(this.P13N_MODEL);var g=this.getItemFactory().call(this,f);var h=i.getCells()[0];h.addItem(g);}.bind(this));this.addStyleClass("sapUiMDCAFLabelMarkingList");};e.prototype._createInnerListControl=function(){return new b(this.getId()+"-innerListViewTable",Object.assign({keyboardMode:c.Edit,growing:true,updateStarted:function(){this.removeMoveButtons();this._removeFactoryControl();}.bind(this),updateFinished:function(){if(this.getShowFactory()){this._addFactoryControl();}}.bind(this)},this._getListControlConfig()));};e.prototype.getSelectedFields=function(){var s=[];this._loopItems(this._oListControl,function(i,k){if(i.getSelected()){s.push(k);}});return s;};e.prototype._loopItems=function(o,i){o.getItems().forEach(function(f){var p=f.getBindingContextPath();var k=this.getP13nModel().getProperty(p).name;i.call(this,f,k);}.bind(this));};e.prototype.filterWithoutDestroy=function(f){if(this._oListControl.getBinding("items")){this._oListControl.getBinding("items").filter(f,true);}};e.prototype._addMoveButtons=function(i){var t=i;if(!t){return;}var f=this.getP13nModel().getProperty(t.getBindingContextPath()).visible;if(f){t.getCells()[1].addItem(this._getMoveTopButton());t.getCells()[1].addItem(this._getMoveUpButton());t.getCells()[1].addItem(this._getMoveDownButton());t.getCells()[1].addItem(this._getMoveBottomButton());}};e.prototype.exit=function(){B.prototype.exit.apply(this,arguments);this._aInitializedFields=null;this._oHoveredItem=null;this._bShowFactory=null;};return e;});
