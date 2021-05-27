/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/Device","./library","./ListBase","./ListItemBase","./CheckBox","./TableRenderer","sap/base/Log","sap/ui/core/ResizeHandler","sap/ui/core/util/PasteHelper","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/m/ListBaseRenderer","sap/ui/dom/jquery/Selectors"],function(C,D,l,L,a,b,T,c,R,P,K,q,d){"use strict";var e=l.ListKeyboardMode;var f=l.ListGrowingDirection;var B=l.BackgroundDesign;var g=l.PopinLayout;var S=l.ScreenSizes;var h=L.extend("sap.m.Table",{metadata:{library:"sap.m",properties:{backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:B.Translucent},fixedLayout:{type:"any",group:"Behavior",defaultValue:true},showOverlay:{type:"boolean",group:"Appearance",defaultValue:false},alternateRowColors:{type:"boolean",group:"Appearance",defaultValue:false},popinLayout:{type:"sap.m.PopinLayout",group:"Appearance",defaultValue:g.Block},contextualWidth:{type:"string",group:"Behavior",defaultValue:"Inherit"},autoPopinMode:{type:"boolean",group:"Behavior",defaultValue:false},hiddenInPopin:{type:"sap.ui.core.Priority[]",group:"Behavior"}},aggregations:{columns:{type:"sap.m.Column",multiple:true,singularName:"column",dnd:{draggable:true,droppable:true,layout:"Horizontal"}}},events:{beforeOpenContextMenu:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ColumnListItem"},column:{type:"sap.m.Column"}}},paste:{allowPreventDefault:true,parameters:{data:{type:"string[][]"}}},popinChanged:{parameters:{hasPopin:{type:"boolean"},hiddenInPopin:{type:"sap.m.Column[]"}}}},designtime:"sap/m/designtime/Table.designtime"}});h.prototype.sNavItemClass="sapMListTblRow";h.prototype.init=function(){this._iItemNeedsColumn=0;L.prototype.init.call(this);};h.prototype.setContextualWidth=function(w){var o=this.getContextualWidth();if(w==o){return this;}if(typeof w==="number"){this._sContextualWidth=w+"px";this._sContextualWidth=this._sContextualWidth.toLowerCase();}else{var i=w.toLowerCase(),W=S[i];if(W){this._sContextualWidth=W+"px";}else{this._sContextualWidth=w;}}var j=this._validateContextualWidth(this._sContextualWidth);this._iLastContextualWidth=o;if(j){this.setProperty("contextualWidth",w,true);}else{return this;}if(this._iLastContextualWidth.toLowerCase()==="auto"){this._deregisterResizeHandler();}if(this._sContextualWidth.toLowerCase()==="auto"){this._registerResizeHandler();this._applyContextualWidth(this.$().width());}else{this._applyContextualWidth(this._sContextualWidth);}return this;};h.prototype._validateContextualWidth=function(w){if(!w){return;}if(typeof w!="string"){throw new Error('expected string for property "contextualWidth" of '+this);}if(w.toLowerCase()==="auto"||w.toLowerCase()==="inherit"){return true;}if(!/^\d+(\.\d+)?(px)$/i.test(w)){throw new Error('invalid CSS size("px", "Auto", "auto", Inherit", "inherit" required) or sap.m.ScreenSize enumeration for property "contextualWidth" of '+this);}return true;};h.prototype._applyContextualWidth=function(w){w=parseFloat(w)||0;if(w&&this._oContextualSettings.contextualWidth!=w){this._applyContextualSettings({contextualWidth:w});}};h.prototype._onResize=function(p){this._applyContextualWidth(p.size.width);};h.prototype._registerResizeHandler=function(){if(!this._iResizeHandlerId){var t=this;window.requestAnimationFrame(function(){t._iResizeHandlerId=R.register(t,t._onResize.bind(t));});}};h.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};h.prototype.onBeforeRendering=function(){L.prototype.onBeforeRendering.call(this);this._bHasDynamicWidthCol=this._hasDynamicWidthColumn();if(this.getAutoPopinMode()){this._configureAutoPopin();}this._applyContextualWidth(this._sContextualWidth);this._ensureColumnsMedia();this._notifyColumns("ItemsRemoved");};h.prototype._hasDynamicWidthColumn=function(o,s){if(this.getFixedLayout()!="Strict"){return true;}return this.getColumns().some(function(i){if(i.getVisible()&&!i.isPopin()){var w=o&&o==i?s:i.getWidth();return!w||w=="auto";}});};h.prototype._ensureColumnsMedia=function(){this.getColumns().forEach(function(o){if(o._bShouldAddMedia){o._addMedia();}});};h.prototype.onAfterRendering=function(){L.prototype.onAfterRendering.call(this);this.updateSelectAllCheckbox();if(this.getFixedLayout()){this._forceStyleChange();}this._renderOverlay();if(this._bFirePopinChanged){this._firePopinChangedEvent();this._bFirePopinChanged=false;}else{var H=this._getHiddenInPopin();if(this._aHiddenInPopin&&this.getVisibleItems().length){if(H.length!==this._aHiddenInPopin.length||!H.every(function(p){return this._aHiddenInPopin.indexOf(p)>-1;},this)){this._aHiddenInPopin=H;this._firePopinChangedEvent();}}else if(this._aHiddenInPopin==null){this._aHiddenInPopin=H;}}};h.prototype._renderOverlay=function(){var $=this.$(),i=$.find(".sapMTableOverlay"),s=this.getShowOverlay();if(s&&i.length===0){i=q("<div>").addClass("sapUiOverlay sapMTableOverlay").css("z-index","1");$.append(i);}else if(!s){i.remove();}};h.prototype.setShowOverlay=function(s){this.setProperty("showOverlay",s,true);this._renderOverlay();return this;};h.prototype.exit=function(){L.prototype.exit.call(this);if(this._selectAllCheckBox){this._selectAllCheckBox.destroy();this._selectAllCheckBox=null;}};h.prototype.destroyItems=function(){this._notifyColumns("ItemsRemoved");return L.prototype.destroyItems.apply(this,arguments);};h.prototype.removeAllItems=function(){this._notifyColumns("ItemsRemoved");return L.prototype.removeAllItems.apply(this,arguments);};h.prototype.removeSelections=function(){L.prototype.removeSelections.apply(this,arguments);this.updateSelectAllCheckbox();return this;};h.prototype.selectAll=function(){L.prototype.selectAll.apply(this,arguments);this.updateSelectAllCheckbox();return this;};h.prototype.getColumns=function(s){var i=this.getAggregation("columns",[]);if(s){i.sort(function(j,k){return j.getOrder()-k.getOrder();});}return i;};h.prototype.setFixedLayout=function(F){if(F==undefined||F=="true"){F=true;}else if(F=="false"){F=false;}if(typeof F=="boolean"||F=="Strict"){return this.setProperty("fixedLayout",F);}throw new Error('"'+F+'" is an invalid value, expected false, true or "Strict" for the property fixedLayout of '+this);};h.prototype.onBeforePageLoaded=function(){if(this.getAlternateRowColors()){this._sAlternateRowColorsClass=this._getAlternateRowColorsClass();}L.prototype.onBeforePageLoaded.apply(this,arguments);};h.prototype.onAfterPageLoaded=function(){this.updateSelectAllCheckbox();if(this.getAlternateRowColors()&&this._sAlternateRowColorsClass!=this._getAlternateRowColorsClass()){var $=this.$("tblBody").removeClass(this._sAlternateRowColorsClass);$.addClass(this._getAlternateRowColorsClass());}L.prototype.onAfterPageLoaded.apply(this,arguments);};h.prototype.shouldRenderItems=function(){return this.getColumns().some(function(o){return o.getVisible();});};h.prototype.shouldGrowingSuppressInvalidation=function(){if(this.getAutoPopinMode()){return false;}return L.prototype.shouldGrowingSuppressInvalidation.call(this);};h.prototype.onItemTypeColumnChange=function(i,n){this._iItemNeedsColumn+=(n?1:-1);if(this._iItemNeedsColumn==1&&n){this._setTypeColumnVisibility(true);}else if(this._iItemNeedsColumn==0){this._setTypeColumnVisibility(false);}};h.prototype.onItemSelectedChange=function(i,s){L.prototype.onItemSelectedChange.apply(this,arguments);setTimeout(function(){this.updateSelectAllCheckbox();}.bind(this),0);};h.prototype.getTableDomRef=function(){return this.getDomRef("listUl");};h.prototype.getItemsContainerDomRef=function(){return this.getDomRef("tblBody");};h.prototype.setNavigationItems=function(i){var H=this.$("tblHeader");var F=this.$("tblFooter");var r=this.$("tblBody").children(".sapMLIB");var I=H.add(r).add(F).get();i.setItemDomRefs(I);if(i.getFocusedIndex()==-1){if(this.getGrowing()&&this.getGrowingDirection()==f.Upwards){i.setFocusedIndex(I.length-1);}else{i.setFocusedIndex(H[0]?1:0);}}};h.prototype.checkGrowingFromScratch=function(){if(this.hasPopin()){return false;}return this.getColumns().some(function(o){return o.getVisible()&&o.getMergeDuplicates();});};h.prototype.onColumnPress=function(o){this.bActiveHeaders&&this.fireEvent("columnPress",{column:o});};h.prototype.onColumnResize=function(o){if(!this.hasPopin()&&!this._mutex){var i=this.getColumns().some(function(k){return k.isPopin();});if(!i){o.setDisplay(this.getTableDomRef(),!o.isHidden());this._firePopinChangedEvent();return;}}this._dirty=this._getMediaContainerWidth()||window.innerWidth;if(!this._mutex){var j=this._getMediaContainerWidth()||window.innerWidth;this._mutex=true;this._bFirePopinChanged=true;this.rerender();setTimeout(function(){if(this._dirty!=j){this._dirty=0;this._bFirePopinChanged=true;this.rerender();}this._mutex=false;}.bind(this),200);}};h.prototype.setTableHeaderVisibility=function(i){if(!this.getDomRef()){return;}if(!this.shouldRenderItems()){return this.invalidate();}var $=this.$("tblHeader"),H=!$.hasClass("sapMListTblHeaderNone"),v=$.find(".sapMListTblCell:visible"),j=v.eq(0);if(v.length==1&&this.getFixedLayout()!="Strict"){j.width("");}else{v.each(function(){this.style.width=this.getAttribute("data-sap-width")||"";});}this._colCount=v.length+3+!!d.ModeOrder[this.getMode()];this.$("tblBody").find(".sapMGHLICell").attr("colspan",this.getColSpan());this.$("nodata-text").attr("colspan",this.getColCount());if(this.hasPopin()){this.$("tblBody").find(".sapMListTblSubRowCell").attr("colspan",this.getColSpan());}if(this.getFixedLayout()){this._forceStyleChange();}if(!i&&H){$[0].className="sapMListTblRow sapMLIBFocusable sapMListTblHeader";this._headerHidden=false;}else if(i&&!H&&!v.length){$[0].className="sapMListTblHeaderNone";this._headerHidden=true;}};h.prototype._forceStyleChange=function(){if(D.browser.msie||D.browser.edge){var t=this.getTableDomRef().style;t.listStyleType="circle";window.setTimeout(function(){t.listStyleType="none";},0);}};h.prototype._setTypeColumnVisibility=function(v){q(this.getTableDomRef()).toggleClass("sapMListTblHasNav",v);};h.prototype._notifyColumns=function(A,p,v){this.getColumns().forEach(function(o){o["on"+A](p,v);});};h.prototype._getSelectAllCheckbox=function(){if(this.bPreventMassSelection){return;}if(!this._selectAllCheckBox){this._selectAllCheckBox=new b({id:this.getId("sa"),activeHandling:false}).addStyleClass("sapMLIBSelectM").setParent(this,null,true).attachSelect(function(){if(this._selectAllCheckBox.getSelected()){this.selectAll(true);}else{this.removeSelections(false,true);}},this).setTabIndex(-1);}this._selectAllCheckBox.getEnabled=function(){return this._selectAllCheckBox.getProperty("enabled");}.bind(this);return this._selectAllCheckBox;};h.prototype.updateSelectAllCheckbox=function(){if(this._selectAllCheckBox&&this.getMode()==="MultiSelect"){var i=this.getItems(),s=this.getSelectedItems().length,j=i.filter(function(I){return I.isSelectable();}).length;this._selectAllCheckBox.setSelected(i.length>0&&s==j);}};h.prototype.enhanceAccessibilityState=function(E,A){if(E==this._selectAllCheckBox){var o=C.getLibraryResourceBundle("sap.m");A.label=o.getText("TABLE_CHECKBOX_SELECT_ALL");}};h.prototype.getColSpan=function(){var i=this.shouldRenderDummyColumn()?3:2;return(this._colCount||1)-i;};h.prototype.getColCount=function(){return(this._colCount||0);};h.prototype.shouldRenderDummyColumn=function(){return!this._bHasDynamicWidthCol&&this.shouldRenderItems();};h.prototype.hasPopin=function(){return!!this._hasPopin;};h.prototype.isHeaderRowEvent=function(E){var H=this.$("tblHeader");return!!q(E.target).closest(H,this.getTableDomRef()).length;};h.prototype.isFooterRowEvent=function(E){var F=this.$("tblFooter");return!!q(E.target).closest(F,this.getTableDomRef()).length;};h.prototype.getAccessibilityType=function(){return C.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_TABLE");};h.prototype._setHeaderAnnouncement=function(){var o=C.getLibraryResourceBundle("sap.m"),A=o.getText("ACC_CTR_TYPE_HEADER_ROW")+" ";if(this.isAllSelectableSelected()){A+=o.getText("LIST_ALL_SELECTED");}this.getColumns(true).forEach(function(j,i){if(!j.getVisible()){return;}var H=j.getHeader();if(H&&H.getVisible()){A+=a.getAccessibilityText(H)+" ";}});this.updateInvisibleText(A);};h.prototype._setFooterAnnouncement=function(){var A=C.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_FOOTER_ROW")+" ";this.getColumns(true).forEach(function(o,i){if(!o.getVisible()){return;}var F=o.getFooter();if(F&&F.getVisible()){var H=o.getHeader();if(H&&H.getVisible()){A+=a.getAccessibilityText(H)+" ";}A+=a.getAccessibilityText(F)+" ";}});this.updateInvisibleText(A);};h.prototype.onsapspace=function(E){if(E.isMarked()){return;}if(E.target.id==this.getId("tblHeader")){E.preventDefault();if(this._selectAllCheckBox){this._selectAllCheckBox.setSelected(!this._selectAllCheckBox.getSelected()).fireSelect();E.setMarked();}}};h.prototype.onsaptabnext=function(E){if(E.isMarked()||this.getKeyboardMode()==e.Edit){return;}var r=q();if(E.target.id==this.getId("nodata")){r=this.$("nodata");}else if(this.isHeaderRowEvent(E)){r=this.$("tblHeader");}else if(this.isFooterRowEvent(E)){r=this.$("tblFooter");}var o=r.find(":sapTabbable").get(-1)||r[0];if(E.target===o){this.forwardTab(true);E.setMarked();}};h.prototype.onsaptabprevious=function(E){if(E.isMarked()||this.getKeyboardMode()==e.Edit){return;}var t=E.target.id;if(t==this.getId("nodata")||t==this.getId("tblHeader")||t==this.getId("tblFooter")){this.forwardTab(false);}else if(t==this.getId("trigger")){this.focusPrevious();E.preventDefault();}};h.prototype.onfocusin=function(E){var t=E.target;if(t.id==this.getId("tblHeader")){if(!this.hasPopin()&&this.shouldRenderDummyColumn()){t.classList.add("sapMTableRowCustomFocus");}this._setHeaderAnnouncement();this._setFirstLastVisibleCells(t);}else if(t.id==this.getId("tblFooter")){this._setFooterAnnouncement();this._setFirstLastVisibleCells(t);}else if(t.id==this.getId("nodata")){this._setFirstLastVisibleCells(t);}if(this._bThemeChanged){this._bThemeChanged=false;this._forceStyleChange();}L.prototype.onfocusin.call(this,E);};h.prototype.onThemeChanged=function(){L.prototype.onThemeChanged.call(this);this._bThemeChanged=true;};h.prototype._getAlternateRowColorsClass=function(){if(this.isGrouped()){return"sapMListTblAlternateRowColorsGrouped";}if(this.hasPopin()){return"sapMListTblAlternateRowColorsPopin";}return"sapMListTblAlternateRowColors";};h.prototype.onpaste=function(E){if(E.isMarked()||(/^(input|textarea)$/i.test(E.target.tagName))){return;}var i=P.getPastedDataAs2DArray(E.originalEvent);if(!i||i.length===0||i[0].length===0){return;}this.firePaste({data:i});};h.prototype.onkeydown=function(E){L.prototype.onkeydown.apply(this,arguments);if(D.browser.msie&&E.ctrlKey&&E.which===K.V){this.onpaste(E);}};h.prototype.ondragenter=function(E){var o=E.dragSession;if(!o||!o.getDropControl()||!o.getDropControl().isA("sap.m.Column")){return;}o.setIndicatorConfig({height:this.getTableDomRef().clientHeight});};h.prototype._configureAutoPopin=function(){if(this._mutex){return;}var v=this.getColumns(true).filter(function(o){return o.getVisible();});if(!v.length){return;}var i=this.getItems();var p={High:[],Medium:[],Low:[]};v.forEach(function(o){var I=o.getImportance();if(I==="None"){I="Medium";}p[I].push(o);});var j=Object.keys(p).map(function(s){return p[s];});var m=j.find(String)[0];j.reduce(function(t,k){return h._updateAccumulatedWidth(k,m,t);},this._getInitialAccumulatedWidth(i));};h.prototype._getInitialAccumulatedWidth=function(i){var I=this.getInset()?4:0;var t=this.$().closest(".sapUiSizeCompact").length?2:3;var s=d.ModeOrder[this.getMode()]?t:0;var A=i.some(function(o){var j=o.getType();return j==="Detail"||j==="DetailAndActive"||j==="Navigation";})?t:0;return I+s+A+0.65;};h._updateAccumulatedWidth=function(i,m,A){i.forEach(function(o){var w=o.getWidth();var u=w.replace(/[^a-z]/ig,"");var s=parseFloat(l.BaseFontSize)||16;if(u==="px"){A+=parseFloat((parseFloat(w).toFixed(2)/s).toFixed(2));}else if(u==="em"||u==="rem"){A+=parseFloat(w);}else{A+=o.getAutoPopinWidth();}o.setDemandPopin(o!==m);o.setMinScreenWidth(o!==m?A+"rem":"");});return A;};h.prototype._getHiddenInPopin=function(){var v=this.getColumns().filter(function(o){return o.getVisible()&&o.getDemandPopin();});var H=v.filter(function(V){return V._media&&!V._media.matches&&!V.isPopin();});return H;};h.prototype._firePopinChangedEvent=function(){this.fireEvent("popinChanged",{hasPopin:this.hasPopin(),hiddenInPopin:this._getHiddenInPopin()});};h.prototype._fireUpdateFinished=function(i){L.prototype._fireUpdateFinished.apply(this,arguments);var v=this.getVisibleItems().length;if(!this._iVisibleItemsLength&&v>0){this._iVisibleItemsLength=v;this._firePopinChangedEvent();}else if(this._iVisibleItemsLength>0&&!v){this._iVisibleItemsLength=v;this._firePopinChangedEvent();}};h.prototype.onItemFocusIn=function(i,F){L.prototype.onItemFocusIn.apply(this,arguments);if(i!=F||!C.getConfiguration().getAccessibility()){return;}this._setFirstLastVisibleCells(i.getDomRef());};h.prototype._setFirstLastVisibleCells=function(o){var $=q(o);if(!$.hasClass("sapMTableRowCustomFocus")){return;}$.find(".sapMTblLastVisibleCell").removeClass("sapMTblLastVisibleCell");$.find(".sapMTblFirstVisibleCell").removeClass("sapMTblFirstVisibleCell");for(var F=o.firstChild;F&&!F.clientWidth;F=F.nextSibling){}for(var i=o.lastChild.previousSibling;i&&!i.clientWidth;i=i.previousSibling){}q(F).addClass("sapMTblFirstVisibleCell");q(i).addClass("sapMTblLastVisibleCell");};return h;});