/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/ui/Container","sap/ui/mdc/ui/ContainerItem","./ListView","./GroupView","sap/ui/model/Filter","sap/m/Button","sap/m/Bar","sap/m/ToolbarSpacer","sap/m/Select","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/SearchField","sap/m/OverflowToolbarLayoutData","sap/ui/core/Item","sap/base/util/UriParameters"],function(C,a,L,G,F,B,b,T,S,c,d,e,O,I,f){"use strict";var A=C.extend("sap.ui.mdc.p13n.panels.AdaptFiltersPanel",{metadata:{library:"sap.ui.mdc",properties:{itemFactory:{type:"function"},enableReorder:{type:"boolean",defaultValue:true}}},renderer:{}});A.prototype.GROUP_KEY="group";A.prototype.LIST_KEY="list";A.prototype.P13N_MODEL="$p13n";A.prototype.applySettings=function(s){this.addView(new a({key:this.GROUP_KEY,content:new G(this.getId()+"-groupView",{})}));this.addView(new a({key:this.LIST_KEY,content:new L(this.getId()+"-listView")}));var u=new f(window.location.search);this.setDefaultView(u.getAll("sap-ui-xx-newFilterDefault")[0]==="true"?this.LIST_KEY:this.GROUP_KEY);C.prototype.applySettings.apply(this,arguments);this.getView(this.LIST_KEY).getContent().setEnableReorder(this.getEnableReorder());var q=this._getQuickFilter();var v=this._getViewSwitch();var o=this._getShowHideBtn();var h=new b({contentMiddle:[new T(),q,o,v]});this.setHeader(h);this.setSubHeader(new b({contentMiddle:[this._getSearchField()]}));this.addStyleClass("sapUiMDCAdaptFiltersPanel");};A.prototype.setItemFactory=function(i){this.setProperty("itemFactory",i);this.getViews().forEach(function(v){var p=v.getContent();p.setItemFactory(i);});return this;};A.prototype.switchView=function(k){var s=k;C.prototype.switchView.call(this,s);this._getShowHideBtn().setVisible(!this._isCustomView());this._getViewSwitch().setSelectedKey(this.getCurrentViewKey());if(!this._isCustomView(k)){this.showFactory(this.getCurrentViewContent().getShowFactory());}this._filterByModeAndSearch();};A.prototype.addCustomView=function(v){var i=v.item;var k=i.getKey();var o=v.content;var g=v.search;var s=v.selectionChange;if(!k){throw new Error("Please provide an item of type sap.m.SegmentedButtonItem with a key");}if(this._oViewSwitch){this._oViewSwitch.attachSelectionChange(function(E){if(s){s(E.getParameter("item").getKey());}if(this._isCustomView()&&g){g(this._getSearchField().getValue());}}.bind(this));}if(g){this._getSearchField().attachLiveChange(function(E){if(this._isCustomView()){g(this._getSearchField().getValue());}}.bind(this));}this.addView(new a({key:k,content:o.addStyleClass("sapUiMDCPanelPadding")}));var V=this._getViewSwitch();V.addItem(i);};A.prototype.showFactory=function(s){if(this.getCurrentViewContent().showFactory){this.getCurrentViewContent().showFactory(s);}};A.prototype.getSelectedFields=function(){return this.getCurrentViewContent().getSelectedFields();};A.prototype.setGroupExpanded=function(g,E){this.getView(this.GROUP_KEY).getContent().setGroupExpanded(g,E);};A.prototype.setP13nModel=function(m){this.setModel(m,this.P13N_MODEL);this.getViews().forEach(function(o){var p=o.getContent();p.setP13nModel(m);});};A.prototype.restoreDefaults=function(){this._getSearchField().setValue("");this._filterByModeAndSearch();};A.prototype.getP13nModel=function(){return this.getModel(this.P13N_MODEL);};A.prototype._getShowHideBtn=function(){var s=this._getResourceText("filterbar.ADAPT_SHOW_VALUE");var h=this._getResourceText("filterbar.ADAPT_HIDE_VALUE");if(!this._oShowHideBtn){this._oShowHideBtn=new B({press:function(E){this.showFactory(!this.getCurrentViewContent().getShowFactory());var o=E.oSource;var n=o.getText()===s?h:s;o.setText(n);}.bind(this)});}this._oShowHideBtn.setText(!this._isCustomView()&&this.getCurrentViewContent().getShowFactory()?h:s);return this._oShowHideBtn;};A.prototype._getQuickFilter=function(){if(!this._oGroupModeSelect){this._oGroupModeSelect=new S({items:[new I({key:"all",text:this._getResourceText("p13nDialog.GROUPMODE_ALL")}),new I({key:"visible",text:this._getResourceText("p13nDialog.GROUPMODE_VISIBLE")}),new I({key:"active",text:this._getResourceText("p13nDialog.GROUPMODE_ACTIVE")}),new I({key:"visibleactive",text:this._getResourceText("p13nDialog.GROUPMODE_VISIBLE_ACTIVE")}),new I({key:"mandatory",text:this._getResourceText("p13nDialog.GROUPMODE_MANDATORY")})],tooltip:this._getResourceText("p13nDialog.QUICK_FILTER"),change:this._onGroupModeChange.bind(this)});}return this._oGroupModeSelect;};A.prototype._getSearchField=function(){if(!this._oSearchField){this._oSearchField=new e(this.getId()+"-searchField",{liveChange:[this._filterByModeAndSearch,this],width:"100%",layoutData:new O({shrinkable:true,moveToOverflow:true,priority:"High",maxWidth:"16rem"})});this._oSearchField.setPlaceholder(this._getResourceText("p13nDialog.ADAPT_FILTER_SEARCH"));}return this._oSearchField;};A.prototype._onGroupModeChange=function(E){this._sModeKey=E.getParameters().selectedItem.getKey();this._filterByModeAndSearch();};A.prototype._getViewSwitch=function(){if(!this._oViewSwitch){this._oViewSwitch=new c({items:[new d({tooltip:this._getResourceText("filterbar.ADAPT_LIST_VIEW"),icon:"sap-icon://list",key:this.LIST_KEY}),new d({tooltip:this._getResourceText("filterbar.ADAPT_GROUP_VIEW"),icon:"sap-icon://group-2",key:this.GROUP_KEY})],selectionChange:function(E){if(this.getCurrentViewKey()===this.LIST_KEY){this.getCurrentViewContent().removeMoveButtons();}var k=E.getParameter("item").getKey();this.switchView(k);}.bind(this)});}return this._oViewSwitch;};A.prototype._isCustomView=function(){return this._sCurrentView!=this.GROUP_KEY&&this._sCurrentView!=this.LIST_KEY;};A.prototype._filterByModeAndSearch=function(){if(this._isCustomView(this.getCurrentViewKey())){return;}this._sSearchString=this._getSearchField().getValue();var g=this._createFilterQuery();this._getSearchField().setValue(this._sSearchString);this.getCurrentViewContent().filterWithoutDestroy(g);return g;};A.prototype._createFilterQuery=function(){var g=[],o,h;if(this._sSearchString){g=[new F("label","Contains",this._sSearchString),new F("tooltip","Contains",this._sSearchString)];h=new F(g,false);}var i=function(){if(h){h=new F([new F(g),o],true);}else{h=o;}};if(this._sModeKey==="visible"){o=new F("visible","EQ",true);i();}if(this._sModeKey==="active"){o=new F("isFiltered","EQ",true);i();}if(this._sModeKey==="mandatory"){o=new F("required","EQ",true);i();}if(this._sModeKey==="visibleactive"){o=o=new F([new F("isFiltered","EQ",true),new F("visible","EQ",true)],true);i();}return h||[];};A.prototype.exit=function(){C.prototype.exit.apply(this,arguments);this._sModeKey=null;this._sSearchString=null;};return A;});
