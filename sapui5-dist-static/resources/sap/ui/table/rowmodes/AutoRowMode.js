/*
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library","../utils/TableUtils","./RowMode","sap/ui/Device","sap/base/Log"],function(l,T,R,D,L){"use strict";var _=T.createWeakMapFacade();var A=R.extend("sap.ui.table.rowmodes.AutoRowMode",{metadata:{library:"sap.ui.table",properties:{minRowCount:{type:"int",defaultValue:5,group:"Appearance"},maxRowCount:{type:"int",defaultValue:-1,group:"Appearance"},fixedTopRowCount:{type:"int",defaultValue:0,group:"Appearance"},fixedBottomRowCount:{type:"int",defaultValue:0,group:"Appearance"},rowContentHeight:{type:"int",defaultValue:0,group:"Appearance"},hideEmptyRows:{type:"boolean",defaultValue:false,group:"Appearance"}}},constructor:function(i){Object.defineProperty(this,"bLegacy",{value:typeof i==="boolean"?i:false});R.apply(this,arguments);}});var a={};function g(r){var t=r.getTable();var o=t?t.getDomRef("tableCCnt"):null;if(o&&D.browser.chrome&&window.devicePixelRatio!==1){var d=document.createElement("table");var e=d.insertRow();var i=r.getRowContentHeight();var n;d.classList.add("sapUiTableCtrl");e.classList.add("sapUiTableTr");if(i>0){e.style.height=r.getBaseRowHeightOfTable()+"px";}o.appendChild(d);n=e.getBoundingClientRect().height;o.removeChild(d);return n;}else{return r.getBaseRowHeightOfTable();}}A.prototype.init=function(){R.prototype.init.apply(this,arguments);_(this).iPendingStartTableUpdateSignals=0;_(this).bRowCountAutoAdjustmentActive=false;_(this).iLastAvailableSpace=0;_(this).rowCount=-1;_(this).bTableIsFlexItem=false;_(this).adjustRowCountToAvailableSpaceAsync=T.throttleFrameWise(this.adjustRowCountToAvailableSpace.bind(this));};A.prototype.attachEvents=function(){R.prototype.attachEvents.apply(this,arguments);T.addDelegate(this.getTable(),a,this);};A.prototype.detachEvents=function(){R.prototype.detachEvents.apply(this,arguments);T.removeDelegate(this.getTable(),a);};A.prototype.cancelAsyncOperations=function(){R.prototype.cancelAsyncOperations.apply(this,arguments);this.stopAutoRowMode();};A.prototype.registerHooks=function(){R.prototype.registerHooks.apply(this,arguments);T.Hook.register(this.getTable(),T.Hook.Keys.Table.RefreshRows,this._onTableRefreshRows,this);T.Hook.register(this.getTable(),T.Hook.Keys.Table.UpdateSizes,this._onUpdateTableSizes,this);};A.prototype.deregisterHooks=function(){R.prototype.deregisterHooks.apply(this,arguments);T.Hook.deregister(this.getTable(),T.Hook.Keys.Table.RefreshRows,this._onTableRefreshRows,this);T.Hook.deregister(this.getTable(),T.Hook.Keys.Table.UpdateSizes,this._onUpdateTableSizes,this);};A.prototype.getFixedTopRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getFixedRowCount():0;}return this.getProperty("fixedTopRowCount");};A.prototype.getFixedBottomRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getFixedBottomRowCount():0;}return this.getProperty("fixedBottomRowCount");};A.prototype.getMinRowCount=function(){if(this.bLegacy){var t=this.getTable();return t?t.getMinAutoRowCount():0;}return this.getProperty("minRowCount");};A.prototype.getRowContentHeight=function(){if(this.bLegacy){var t=this.getTable();return t?t.getRowHeight():0;}return this.getProperty("rowContentHeight");};A.prototype.setHideEmptyRows=function(h){this.setProperty("hideEmptyRows",h);if(h){this.disableNoData();}else{this.enableNoData();}return this;};A.prototype._getMinRowCount=function(){var m=this.getMinRowCount();var M=this.getMaxRowCount();if(M>=0){return Math.min(m,M);}else{return m;}};A.prototype.getMinRequestLength=function(){var t=this.getTable();var r=this.getConfiguredRowCount();if(c(this)||(t&&!t._bContextsAvailable)){var e=Math.ceil(D.resize.height/T.DefaultRowHeight.sapUiSizeCondensed);r=Math.max(r,e);}return r;};A.prototype.getComputedRowCounts=function(){if(c(this)){return{count:0,scrollable:0,fixedTop:0,fixedBottom:0};}var r=this.getConfiguredRowCount();var f=this.getFixedTopRowCount();var F=this.getFixedBottomRowCount();if(this.getHideEmptyRows()){r=Math.min(r,this.getTotalRowCountOfTable());}return this.computeStandardizedRowCounts(r,f,F);};A.prototype.getTableStyles=function(){var h="0px";if(c(this)){h="auto";}else{var r=this.getConfiguredRowCount();if(r===0||r===this._getMinRowCount()){h="auto";}}return{height:h};};A.prototype.getTableBottomPlaceholderStyles=function(){if(!this.getHideEmptyRows()){return undefined;}var r;if(c(this)){r=this._getMinRowCount();}else{r=this.getConfiguredRowCount()-this.getComputedRowCounts().count;}return{height:r*this.getBaseRowHeightOfTable()+"px"};};A.prototype.getRowContainerStyles=function(){return{height:this.getComputedRowCounts().count*Math.max(this.getBaseRowHeightOfTable(),g(this))+"px"};};A.prototype.renderRowStyles=function(r){var i=this.getRowContentHeight();if(i>0){r.style("height",this.getBaseRowHeightOfTable()+"px");}};A.prototype.renderCellContentStyles=function(r){var i=this.getRowContentHeight();if(!this.bLegacy&&i<=0){i=this.getDefaultRowContentHeightOfTable();}if(i>0){r.style("max-height",i+"px");}};A.prototype.getBaseRowContentHeight=function(){return Math.max(0,this.getRowContentHeight());};A.prototype._onTableRefreshRows=function(){var C=this.getConfiguredRowCount();if(C>0){if(!c(this)){this.initTableRowsAfterDataRequested(C);}this.getRowContexts(C,true);}};A.prototype.getConfiguredRowCount=function(){var r=Math.max(0,this.getMinRowCount(),_(this).rowCount);var m=this.getMaxRowCount();if(m>=0){r=Math.min(r,m);}return r;};A.prototype.startAutoRowMode=function(){_(this).adjustRowCountToAvailableSpaceAsync(T.RowsUpdateReason.Render,true);};A.prototype.stopAutoRowMode=function(){this.deregisterResizeHandler();_(this).adjustRowCountToAvailableSpaceAsync.cancel();_(this).bRowCountAutoAdjustmentActive=false;b(this);};A.prototype.registerResizeHandler=function(o){var t=this.getTable();if(t){T.registerResizeHandler(t,"AutoRowMode",this.onResize.bind(this),null,o===true);T.registerResizeHandler(t,"AutoRowMode-BeforeTable",this.onResize.bind(this),"before");T.registerResizeHandler(t,"AutoRowMode-AfterTable",this.onResize.bind(this),"after");}};A.prototype.deregisterResizeHandler=function(){var t=this.getTable();if(t){T.deregisterResizeHandler(t,["AutoRowMode, AutoRowMode-BeforeTable, AutoRowMode-AfterTable"]);}};A.prototype.onResize=function(e){var o=e.oldSize.height;var n=e.size.height;if(o!==n){s(this);_(this).adjustRowCountToAvailableSpaceAsync(T.RowsUpdateReason.Resize);}};A.prototype._onUpdateTableSizes=function(r){if(r===T.RowsUpdateReason.Resize||r===T.RowsUpdateReason.Render){return;}if(_(this).bRowCountAutoAdjustmentActive){s(this);_(this).adjustRowCountToAvailableSpaceAsync(r);}};A.prototype.adjustRowCountToAvailableSpace=function(r,S){S=S===true;var t=this.getTable();var o=t?t.getDomRef():null;if(!t||t._bInvalid||!o||!sap.ui.getCore().isThemeApplied()){b(this);return;}_(this).bTableIsFlexItem=window.getComputedStyle(o.parentNode).display==="flex";if(o.scrollHeight===0){if(S){this.registerResizeHandler(!_(this).bTableIsFlexItem);_(this).bRowCountAutoAdjustmentActive=true;}b(this);return;}var n=this.determineAvailableSpace();var O=this.getConfiguredRowCount();var N=Math.floor(n/g(this));var i=this.getComputedRowCounts().count;var d;_(this).rowCount=N;d=this.getComputedRowCounts().count;if(this.bLegacy){t.setProperty("visibleRowCount",d,true);}if(i!==d){this.updateTable(r);}else{if(O!==N||r===T.RowsUpdateReason.Zoom){this.applyTableStyles();this.applyRowContainerStyles();this.applyTableBottomPlaceholderStyles();}if(!this._bFiredRowsUpdatedAfterRendering&&t.getRows().length>0){this.fireRowsUpdated(r);}}if(S){this.registerResizeHandler(!_(this).bTableIsFlexItem);_(this).bRowCountAutoAdjustmentActive=true;}b(this);};A.prototype.determineAvailableSpace=function(){var t=this.getTable();var o=t?t.getDomRef():null;var r=t?t.getDomRef("tableCCnt"):null;var p=t?t.getDomRef("placeholder-bottom"):null;if(!o||!r||!o.parentNode){return 0;}var u=0;var d=r.clientHeight;var P=p?p.clientHeight:0;if(_(this).bTableIsFlexItem){var C=o.childNodes;for(var i=0;i<C.length;i++){u+=C[i].offsetHeight;}u-=d-P;}else{u=o.scrollHeight-d-P;}var S=t._getScrollExtension();if(!S.isHorizontalScrollbarVisible()){var m={};m[D.browser.BROWSER.CHROME]=16;m[D.browser.BROWSER.FIREFOX]=16;m[D.browser.BROWSER.INTERNET_EXPLORER]=18;m[D.browser.BROWSER.EDGE]=16;m[D.browser.BROWSER.SAFARI]=16;m[D.browser.BROWSER.ANDROID]=8;u+=m[D.browser.name];}var e=_(this).bTableIsFlexItem?o:o.parentNode;var n=Math.max(0,Math.floor(jQuery(e).height()-u));var f=Math.abs(n-_(this).iLastAvailableSpace);if(f>=5){_(this).iLastAvailableSpace=n;}return _(this).iLastAvailableSpace;};a.onBeforeRendering=function(e){var r=e&&e.isMarked("renderRows");if(!r){this.stopAutoRowMode();this.updateTable(T.RowsUpdateReason.Render);}};a.onAfterRendering=function(e){var r=e&&e.isMarked("renderRows");if(!r){this.startAutoRowMode();}};function s(r){_(r).iPendingStartTableUpdateSignals++;T.Hook.call(r.getTable(),T.Hook.Keys.Signal,"StartTableUpdate");}function b(r){for(var i=0;i<_(r).iPendingStartTableUpdateSignals;i++){T.Hook.call(r.getTable(),T.Hook.Keys.Signal,"EndTableUpdate");}_(r).iPendingStartTableUpdateSignals=0;}function c(r){return _(r).rowCount===-1;}return A;});
