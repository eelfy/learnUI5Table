/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/m/library","sap/m/Button","sap/m/NavContainer","sap/ui/core/Configuration","sap/ui/core/theming/Parameters",'sap/ui/dom/units/Rem',"./FlexibleColumnLayoutRenderer","sap/base/Log","sap/base/assert","sap/base/util/isEmptyObject","sap/base/util/merge"],function(q,l,D,R,C,m,B,N,a,P,b,F,L,c,d,e){"use strict";var f=l.LayoutType;var g=C.extend("sap.f.FlexibleColumnLayout",{metadata:{properties:{autoFocus:{type:"boolean",group:"Behavior",defaultValue:true},layout:{type:"sap.f.LayoutType",defaultValue:f.OneColumn},defaultTransitionNameBeginColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameMidColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameEndColumn:{type:"string",group:"Appearance",defaultValue:"slide"},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:m.BackgroundDesign.Transparent},restoreFocusOnBackNavigation:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{beginColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getBeginColumn",aggregation:"pages"}},midColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getMidColumn",aggregation:"pages"}},endColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getEndColumn",aggregation:"pages"}},_beginColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_midColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_endColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_beginColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_endColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{initialBeginColumnPage:{type:"sap.ui.core.Control",multiple:false},initialMidColumnPage:{type:"sap.ui.core.Control",multiple:false},initialEndColumnPage:{type:"sap.ui.core.Control",multiple:false}},events:{stateChange:{parameters:{layout:{type:"sap.f.LayoutType"},maxColumnsCount:{type:"int"},isNavigationArrow:{type:"boolean"},isResize:{type:"boolean"}}},beginColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterBeginColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},midColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterMidColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},endColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterEndColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},columnResize:{parameters:{beginColumn:{type:"boolean"},midColumn:{type:"boolean"},endColumn:{type:"boolean"}}}}}});g.COLUMN_RESIZING_ANIMATION_DURATION=560;g.PINNED_COLUMN_CLASS_NAME="sapFFCLPinnedColumn";g.COLUMN_ORDER=["begin","mid","end"];g.prototype.init=function(){this._iWidth=0;this._oColumnFocusInfo={begin:{},mid:{},end:{}};this._initNavContainers();this._initButtons();this._oLayoutHistory=new h();this._oAnimationEndListener=new A();this._oRenderedColumnPagesBoolMap={};this._iNavigationArrowWidth=b.toPx(P.get("_sap_f_FCL_navigation_arrow_width"));this._oColumnWidthInfo={begin:0,mid:0,end:0};};g.prototype._onNavContainerRendered=function(E){var o=E.srcControl,H=o.getPages().length>0,i=this._hasAnyColumnPagesRendered();this._setColumnPagesRendered(o.getId(),H);if(this._hasAnyColumnPagesRendered()!==i){this._hideShowArrows();}};g.prototype._createNavContainer=function(s){var i=s.charAt(0).toUpperCase()+s.slice(1);var n=new N(this.getId()+"-"+s+"ColumnNav",{autoFocus:this.getAutoFocus(),navigate:function(E){this._handleNavigationEvent(E,false,s);}.bind(this),afterNavigate:function(E){this._handleNavigationEvent(E,true,s);}.bind(this),defaultTransitionName:this["getDefaultTransitionName"+i+"Column"]()});n.addDelegate({"onAfterRendering":this._onNavContainerRendered},this);this["_"+s+'ColumnFocusOutDelegate']={onfocusout:function(E){this._oColumnFocusInfo[s]=E.target;}};n.addEventDelegate(this["_"+s+'ColumnFocusOutDelegate'],this);return n;};g.prototype._handleNavigationEvent=function(E,i,s){var j,k;if(i){j="after"+(s.charAt(0).toUpperCase()+s.slice(1))+"ColumnNavigate";}else{j=s+"ColumnNavigate";}k=this.fireEvent(j,E.mParameters,true);if(!k){E.preventDefault();}};g.prototype._getColumnByStringName=function(s){if(s==='end'){return this._getEndColumn();}else if(s==='mid'){return this._getMidColumn();}else{return this._getBeginColumn();}};g.prototype._getBeginColumn=function(){return this.getAggregation("_beginColumnNav");};g.prototype._getMidColumn=function(){return this.getAggregation("_midColumnNav");};g.prototype._getEndColumn=function(){return this.getAggregation("_endColumnNav");};g.prototype._flushColumnContent=function(s){var o=this.getAggregation("_"+s+"ColumnNav"),r=sap.ui.getCore().createRenderManager();r.renderControl(o);r.flush(this._$columns[s].find(".sapFFCLColumnContent")[0],undefined,true);r.destroy();};g.prototype.setLayout=function(n){n=this.validateProperty("layout",n);var s=this.getLayout();if(s===n){return this;}var r=this.setProperty("layout",n,true);this._oLayoutHistory.addEntry(n);this._hideShowArrows();this._resizeColumns();return r;};g.prototype.setAutoFocus=function(n){n=this.validateProperty("autoFocus",n);var i=this.getAutoFocus();if(i===n){return this;}this._getNavContainers().forEach(function(o){o.setAutoFocus(n);});return this.setProperty("autoFocus",n,true);};g.prototype.onBeforeRendering=function(){this._deregisterResizeHandler();this._oAnimationEndListener.cancelAll();};g.prototype.onAfterRendering=function(){this._measureControlWidth();this._registerResizeHandler();this._cacheDOMElements();this._hideShowArrows();this._resizeColumns();this._flushColumnContent("begin");this._flushColumnContent("mid");this._flushColumnContent("end");this._fireStateChange(false,false);};g.prototype._restoreFocusToColumn=function(s){var E=this._oColumnFocusInfo[s];if(!E||d(E)){E=this._getFirstFocusableElement(s);}q(E).trigger("focus");};g.prototype._getFirstFocusableElement=function(s){var o=this._getColumnByStringName(s),i=o.getCurrentPage();if(i){return i.$().firstFocusableDomRef();}return null;};g.prototype._isFocusInSomeOfThePreviousColumns=function(){var i=g.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)-1,o;for(;i>=0;i--){o=this._getColumnByStringName(g.COLUMN_ORDER[i]);if(o&&o._isFocusInControl(o)){return true;}}return false;};g.prototype._getControlWidth=function(){if(this._iWidth===0){this._measureControlWidth();}return this._iWidth;};g.prototype._measureControlWidth=function(){if(this.$().is(":visible")){this._iWidth=this.$().width();}else{this._iWidth=0;}};g.prototype.exit=function(){this._removeNavContainersFocusOutDelegate();this._oRenderedColumnPagesBoolMap=null;this._oColumnFocusInfo=null;this._deregisterResizeHandler();this._handleEvent(q.Event("Destroy"));};g.prototype._removeNavContainersFocusOutDelegate=function(){g.COLUMN_ORDER.forEach(function(s){this._getColumnByStringName(s).removeEventDelegate(this["_"+s+"ColumnFocusOutDelegate"]);},this);};g.prototype._registerResizeHandler=function(){c(!this._iResizeHandlerId,"Resize handler already registered");this._iResizeHandlerId=R.register(this,this._onResize.bind(this));};g.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};g.prototype._initNavContainers=function(){this.setAggregation("_beginColumnNav",this._createNavContainer("begin"),true);this.setAggregation("_midColumnNav",this._createNavContainer("mid"),true);this.setAggregation("_endColumnNav",this._createNavContainer("end"),true);};g.prototype._getNavContainers=function(){return[this._getBeginColumn(),this._getMidColumn(),this._getEndColumn()];};g.prototype._initButtons=function(){var o=new B(this.getId()+"-beginBack",{icon:"sap-icon://slim-arrow-left",tooltip:g._getResourceBundle().getText("FCL_BEGIN_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_beginColumnBackArrow",o,true);var M=new B(this.getId()+"-midForward",{icon:"sap-icon://slim-arrow-right",tooltip:g._getResourceBundle().getText("FCL_MID_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_midColumnForwardArrow",M,true);var i=new B(this.getId()+"-midBack",{icon:"sap-icon://slim-arrow-left",tooltip:g._getResourceBundle().getText("FCL_MID_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_midColumnBackArrow",i,true);var E=new B(this.getId()+"-endForward",{icon:"sap-icon://slim-arrow-right",tooltip:g._getResourceBundle().getText("FCL_END_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_endColumnForwardArrow",E,true);};g.prototype._cacheDOMElements=function(){this._cacheColumns();if(!D.system.phone){this._cacheArrows();}};g.prototype._cacheColumns=function(){this._$columns={begin:this.$("beginColumn"),mid:this.$("midColumn"),end:this.$("endColumn")};};g.prototype._cacheArrows=function(){this._oColumnSeparatorArrows={beginBack:this.$("beginBack"),midForward:this.$("midForward"),midBack:this.$("midBack"),endForward:this.$("endForward")};};g.prototype._getVisibleColumnsCount=function(){return g.COLUMN_ORDER.filter(function(s){return this._getColumnSize(s)>0;},this).length;};g.prototype._getVisibleArrowsCount=function(){if(!this._oColumnSeparatorArrows){return 0;}return Object.keys(this._oColumnSeparatorArrows).filter(function(s){return this._oColumnSeparatorArrows[s].data("visible");},this).length;};g.prototype._getTotalColumnsWidth=function(H){var s=this._getVisibleArrowsCount();if(H){s++;}return this._getControlWidth()-s*this._iNavigationArrowWidth;};g.prototype._resizeColumns=function(){var p,i,j=g.COLUMN_ORDER.slice(),r=sap.ui.getCore().getConfiguration().getRTL(),s=sap.ui.getCore().getConfiguration().getAnimationMode(),H=s!==a.AnimationMode.none&&s!==a.AnimationMode.minimal,k,v,n,o,t,I,u,w={};if(!this.isActive()){return;}v=this._getVisibleColumnsCount();if(v===0){return;}o=this.getLayout();n=this._getMaxColumnsCountForLayout(o,g.DESKTOP_BREAKPOINT);t=j[n-1];u=this.getRestoreFocusOnBackNavigation()&&this._isNavigatingBackward(t)&&!this._isFocusInSomeOfThePreviousColumns();I=(v===3)&&(o===f.ThreeColumnsEndExpanded);i=this._getTotalColumnsWidth(I);if(H){j.forEach(function(x){var S=this._shouldConcealColumn(n,x),y=this._shouldRevealColumn(n,x===t),z=this._$columns[x];z.toggleClass(g.PINNED_COLUMN_CLASS_NAME,S||y);},this);j.forEach(function(x){w[x]=this._oAnimationEndListener.isWaitingForColumnResizeEnd(this._$columns[x]);},this);this._oAnimationEndListener.cancelAll();}j.forEach(function(x){var y=this._$columns[x],z=y.get(0),E,G,S,J,K,M,O;p=this._getColumnSize(x);E=Math.round(i*(p/100));if([100,0].indexOf(p)!==-1){G=p+"%";}else{G=E+"px";}O={previousAnimationCompleted:!w[y],iNewWidth:E,shouldRestoreFocus:u&&(x===t),hidden:p===0&&this._oColumnWidthInfo[x]===0};if(H){S=this._shouldRevealColumn(n,x===t);J=this._shouldConcealColumn(n,x);K=S||J;O=e(O,{hasAnimations:true,shouldConcealColumn:J,pinned:K});M=this._canResizeColumnWithAnimation(x,O);}if(!J){y.toggleClass("sapFFCLColumnActive",p>0);}y.toggleClass("sapFFCLColumnInset",I&&(x==="mid"));y.removeClass("sapFFCLColumnHidden");y.removeClass("sapFFCLColumnOnlyActive");y.removeClass("sapFFCLColumnLastActive");y.removeClass("sapFFCLColumnFirstActive");if(M){R.suspend(z);this._oAnimationEndListener.waitForColumnResizeEnd(y).then(function(){R.resume(z);}).catch(function(){R.resume(z);});}if(!J){y.width(G);}else{this._oAnimationEndListener.waitForAllColumnsResizeEnd().then(function(){y.width(G);}).catch(function(){});}if(M||K){this._oAnimationEndListener.waitForAllColumnsResizeEnd().then(this._afterColumnResize.bind(this,x,O)).catch(function(){});}else{this._afterColumnResize(x,O);}if(!D.system.phone){this._updateColumnContextualSettings(x,E);this._updateColumnCSSClasses(x,E);}},this);k=j.filter(function(x){return this._getColumnSize(x)>0;},this);if(r){j.reverse();}if(k.length===1){this._$columns[k[0]].addClass("sapFFCLColumnOnlyActive");}if(k.length>1){this._$columns[k[0]].addClass("sapFFCLColumnFirstActive");this._$columns[k[k.length-1]].addClass("sapFFCLColumnLastActive");}this._storePreviousResizingInfo(n,t);};g.prototype._afterColumnResize=function(s,o){var i=this._$columns[s],S=o.shouldConcealColumn,n=o.iNewWidth,j=o.shouldRestoreFocus;i.toggleClass(g.PINNED_COLUMN_CLASS_NAME,false);if(S){i.removeClass("sapFFCLColumnActive");}i.toggleClass("sapFFCLColumnHidden",n===0);this._cacheColumnWidth(s,n);if(j){this._restoreFocusToColumn(s);}};g.prototype._getColumnWidth=function(s){var o=this._$columns[s].get(0),i=o.style.width,j=parseInt(i),p;if(/px$/.test(i)){return j;}p=/%$/.test(i);if(p&&(j===100)){return this._getControlWidth();}if(p&&(j===0)){return 0;}return o.offsetWidth;};g.prototype._cacheColumnWidth=function(s,n){var E;if(this._oColumnWidthInfo[s]!==n){E={};g.COLUMN_ORDER.forEach(function(i){E[i+"Column"]=i===s;});this.fireColumnResize(E);}this._oColumnWidthInfo[s]=n;};g.prototype._storePreviousResizingInfo=function(v,s){var o=this.getLayout();this._iPreviousVisibleColumnsCount=v;this._bWasFullScreen=o===f.MidColumnFullScreen||o===f.EndColumnFullScreen;this._sPreviuosLastVisibleColumn=s;};g.prototype._isNavigatingBackward=function(s){return this._bWasFullScreen||g.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)>g.COLUMN_ORDER.indexOf(s);};g.prototype._shouldRevealColumn=function(v,i){return(v>this._iPreviousVisibleColumnsCount)&&!this._bWasFullScreen&&i;};g.prototype._shouldConcealColumn=function(v,s){return(v<this._iPreviousVisibleColumnsCount&&s===this._sPreviuosLastVisibleColumn&&!this._bWasFullScreen&&this._getColumnSize(s)===0);};g.prototype._canResizeColumnWithAnimation=function(s,o){var i,j,n=o.iNewWidth,H=o.hasAnimations,p=o.pinned,k=o.hidden,w=!o.previousAnimationCompleted;if(!H||p||k){return false;}i=this._$columns[s];if(w){return i.width()!==n;}j=!i.get(0).style.width;if(j){return false;}return this._getColumnWidth(s)!==n;};g.prototype._propagateContextualSettings=function(){};g.prototype._updateColumnContextualSettings=function(s,w){var o,i;o=this.getAggregation("_"+s+"ColumnNav");if(!o){return;}i=o._getContextualSettings();if(!i||i.contextualWidth!==w){o._applyContextualSettings({contextualWidth:w});}};g.prototype._updateColumnCSSClasses=function(s,w){var n="";this._$columns[s].removeClass("sapUiContainer-Narrow sapUiContainer-Medium sapUiContainer-Wide sapUiContainer-ExtraWide");if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0]){n="Narrow";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1]){n="Medium";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2]){n="Wide";}else{n="ExtraWide";}this._$columns[s].addClass("sapUiContainer-"+n);};g.prototype._getColumnSize=function(s){var i=this.getLayout(),j=this._getColumnWidthDistributionForLayout(i),S=j.split("/"),M={begin:0,mid:1,end:2},k=S[M[s]];return parseInt(k);};g.prototype.getMaxColumnsCount=function(){return this._getMaxColumnsCountForWidth(this._getControlWidth());};g.prototype._getMaxColumnsCountForWidth=function(w){if(w>=g.DESKTOP_BREAKPOINT){return 3;}if(w>=g.TABLET_BREAKPOINT&&w<g.DESKTOP_BREAKPOINT){return 2;}if(w>0){return 1;}return 0;};g.prototype._getMaxColumnsCountForLayout=function(s,w){var i=this._getMaxColumnsCountForWidth(w),j=this._getColumnWidthDistributionForLayout(s,false,i),S=j.split("/"),M={begin:0,mid:1,end:2},k,n,o=0;Object.keys(M).forEach(function(p){k=S[M[p]];n=parseInt(k);if(n){o++;}});return o;};g.prototype._onResize=function(E){var o=E.oldSize.width,n=E.size.width,O,M;this._iWidth=n;if(n===0){return;}O=this._getMaxColumnsCountForWidth(o);M=this._getMaxColumnsCountForWidth(n);this._resizeColumns();if(M!==O){this._hideShowArrows();this._fireStateChange(false,true);}};g.prototype._setColumnPagesRendered=function(i,H){this._oRenderedColumnPagesBoolMap[i]=H;};g.prototype._hasAnyColumnPagesRendered=function(){return Object.keys(this._oRenderedColumnPagesBoolMap).some(function(k){return this._oRenderedColumnPagesBoolMap[k];},this);};g.prototype._onArrowClick=function(s){var i=this.getLayout(),I=typeof g.SHIFT_TARGETS[i]!=="undefined"&&typeof g.SHIFT_TARGETS[i][s]!=="undefined",n;c(I,"An invalid layout was used for determining arrow behavior");n=I?g.SHIFT_TARGETS[i][s]:f.OneColumn;this.setLayout(n);if(g.ARROWS_NAMES[n][s]!==g.ARROWS_NAMES[i][s]&&I){var o=s==='right'?'left':'right';this._oColumnSeparatorArrows[g.ARROWS_NAMES[n][o]].focus();}this._fireStateChange(true,false);};g.prototype._hideShowArrows=function(){var s=this.getLayout(),M={},n=[],i,I;if(!this.isActive()||D.system.phone){return;}i=this.getMaxColumnsCount();if(i>1){M[f.TwoColumnsBeginExpanded]=["beginBack"];M[f.TwoColumnsMidExpanded]=["midForward"];M[f.ThreeColumnsMidExpanded]=["midForward","midBack"];M[f.ThreeColumnsEndExpanded]=["endForward"];M[f.ThreeColumnsMidExpandedEndHidden]=["midForward","midBack"];M[f.ThreeColumnsBeginExpandedEndHidden]=["beginBack"];if(typeof M[s]==="object"){n=M[s];}}I=this._hasAnyColumnPagesRendered();Object.keys(this._oColumnSeparatorArrows).forEach(function(k){this._toggleButton(k,n.indexOf(k)!==-1,I);},this);};g.prototype._toggleButton=function(s,S,r){this._oColumnSeparatorArrows[s].toggle(S&&r);this._oColumnSeparatorArrows[s].data("visible",S);};g.prototype._fireStateChange=function(i,I){if(this._getControlWidth()===0){return;}this.fireStateChange({isNavigationArrow:i,isResize:I,layout:this.getLayout(),maxColumnsCount:this.getMaxColumnsCount()});};g.prototype.setInitialBeginColumnPage=function(p){this._getBeginColumn().setInitialPage(p);this.setAssociation('initialBeginColumnPage',p,true);return this;};g.prototype.setInitialMidColumnPage=function(p){this._getMidColumn().setInitialPage(p);this.setAssociation('initialMidColumnPage',p,true);return this;};g.prototype.setInitialEndColumnPage=function(p){this._getEndColumn().setInitialPage(p);this.setAssociation('initialEndColumnPage',p,true);return this;};g.prototype.to=function(p,t,o,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().to(p,t,o,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().to(p,t,o,T);}else{this._getEndColumn().to(p,t,o,T);}return this;};g.prototype.backToPage=function(p,o,t){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().backToPage(p,o,t);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().backToPage(p,o,t);}else{this._getEndColumn().backToPage(p,o,t);}return this;};g.prototype._safeBackToPage=function(p,t,i,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn()._safeBackToPage(p,t,i,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn()._safeBackToPage(p,t,i,T);}else{this._getEndColumn()._safeBackToPage(p,t,i,T);}};g.prototype.toBeginColumnPage=function(p,t,o,T){this._getBeginColumn().to(p,t,o,T);return this;};g.prototype.toMidColumnPage=function(p,t,o,T){this._getMidColumn().to(p,t,o,T);return this;};g.prototype.toEndColumnPage=function(p,t,o,T){this._getEndColumn().to(p,t,o,T);return this;};g.prototype.backBeginColumn=function(i,t){return this._getBeginColumn().back(i,t);};g.prototype.backMidColumn=function(i,t){return this._getMidColumn().back(i,t);};g.prototype.backEndColumn=function(i,t){return this._getEndColumn().back(i,t);};g.prototype.backBeginColumnToPage=function(p,i,t){return this._getBeginColumn().backToPage(p,i,t);};g.prototype.backMidColumnToPage=function(p,i,t){return this._getMidColumn().backToPage(p,i,t);};g.prototype.backEndColumnToPage=function(p,i,t){return this._getEndColumn().backToPage(p,i,t);};g.prototype.backToTopBeginColumn=function(o,t){this._getBeginColumn().backToTop(o,t);return this;};g.prototype.backToTopMidColumn=function(o,t){this._getMidColumn().backToTop(o,t);return this;};g.prototype.backToTopEndColumn=function(o,t){this._getEndColumn().backToTop(o,t);return this;};g.prototype.getCurrentBeginColumnPage=function(){return this._getBeginColumn().getCurrentPage();};g.prototype.getCurrentMidColumnPage=function(){return this._getMidColumn().getCurrentPage();};g.prototype.getCurrentEndColumnPage=function(){return this._getEndColumn().getCurrentPage();};g.prototype.setDefaultTransitionNameBeginColumn=function(t){this.setProperty("defaultTransitionNameBeginColumn",t,true);this._getBeginColumn().setDefaultTransitionName(t);return this;};g.prototype.setDefaultTransitionNameMidColumn=function(t){this.setProperty("defaultTransitionNameMidColumn",t,true);this._getMidColumn().setDefaultTransitionName(t);return this;};g.prototype.setDefaultTransitionNameEndColumn=function(t){this.setProperty("defaultTransitionNameEndColumn",t,true);this._getEndColumn().setDefaultTransitionName(t);return this;};g.prototype._getLayoutHistory=function(){return this._oLayoutHistory;};g.prototype._getColumnWidthDistributionForLayout=function(s,i,M){var o={},r;M||(M=this.getMaxColumnsCount());if(M===0){r="0/0/0";}else{o[f.OneColumn]="100/0/0";o[f.MidColumnFullScreen]="0/100/0";o[f.EndColumnFullScreen]="0/0/100";if(M===1){o[f.TwoColumnsBeginExpanded]="0/100/0";o[f.TwoColumnsMidExpanded]="0/100/0";o[f.ThreeColumnsMidExpanded]="0/0/100";o[f.ThreeColumnsEndExpanded]="0/0/100";o[f.ThreeColumnsMidExpandedEndHidden]="0/0/100";o[f.ThreeColumnsBeginExpandedEndHidden]="0/0/100";}else{o[f.TwoColumnsBeginExpanded]="67/33/0";o[f.TwoColumnsMidExpanded]="33/67/0";o[f.ThreeColumnsMidExpanded]=M===2?"0/67/33":"25/50/25";o[f.ThreeColumnsEndExpanded]=M===2?"0/33/67":"25/25/50";o[f.ThreeColumnsMidExpandedEndHidden]="33/67/0";o[f.ThreeColumnsBeginExpandedEndHidden]="67/33/0";}r=o[s];}if(i){r=r.split("/").map(function(j){return parseInt(j);});}return r;};g.DESKTOP_BREAKPOINT=1280;g.TABLET_BREAKPOINT=960;g.ARROWS_NAMES={TwoColumnsBeginExpanded:{"left":"beginBack"},TwoColumnsMidExpanded:{"right":"midForward"},ThreeColumnsMidExpanded:{"left":"midBack","right":"midForward"},ThreeColumnsEndExpanded:{"right":"endForward"},ThreeColumnsMidExpandedEndHidden:{"left":"midBack","right":"midForward"},ThreeColumnsBeginExpandedEndHidden:{"left":"beginBack"}};g._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.f");};g.SHIFT_TARGETS={TwoColumnsBeginExpanded:{"left":f.TwoColumnsMidExpanded},TwoColumnsMidExpanded:{"right":f.TwoColumnsBeginExpanded},ThreeColumnsMidExpanded:{"left":f.ThreeColumnsEndExpanded,"right":f.ThreeColumnsMidExpandedEndHidden},ThreeColumnsEndExpanded:{"right":f.ThreeColumnsMidExpanded},ThreeColumnsMidExpandedEndHidden:{"left":f.ThreeColumnsMidExpanded,"right":f.ThreeColumnsBeginExpandedEndHidden},ThreeColumnsBeginExpandedEndHidden:{"left":f.ThreeColumnsMidExpandedEndHidden}};function h(){this._aLayoutHistory=[];}h.prototype.addEntry=function(s){if(typeof s!=="undefined"){this._aLayoutHistory.push(s);}};h.prototype.getClosestEntryThatMatches=function(j){var i;for(i=this._aLayoutHistory.length-1;i>=0;i--){if(j.indexOf(this._aLayoutHistory[i])!==-1){return this._aLayoutHistory[i];}}};function A(){this._oListeners={};this._aPendingPromises=[];this._oPendingPromises={};this._oCancelPromises={};this._oPendingPromiseAll=null;}A.prototype.waitForColumnResizeEnd=function($){var i=$.get(0).id,p;if(!this._oPendingPromises[i]){p=new Promise(function(r,j){L.debug("FlexibleColumnLayout","wait for column "+i+" to resize");this._attachTransitionEnd($,function(){L.debug("FlexibleColumnLayout","completed column "+i+" resize");this._cleanUp($);r();}.bind(this));this._oCancelPromises[i]={cancel:function(){L.debug("FlexibleColumnLayout","cancel column "+i+" resize");this._cleanUp($);j();}.bind(this)};}.bind(this));this._aPendingPromises.push(p);this._oPendingPromises[i]=p;}return this._oPendingPromises[i];};A.prototype.waitForAllColumnsResizeEnd=function(){if(!this._oPendingPromiseAll){this._oPendingPromiseAll=new Promise(function(r,i){this.iTimer=setTimeout(function(){Promise.all(this._aPendingPromises).then(function(){L.debug("FlexibleColumnLayout","completed all columns resize");r();},0).catch(function(){i();});this.iTimer=null;}.bind(this));}.bind(this));}return this._oPendingPromiseAll;};A.prototype.isWaitingForColumnResizeEnd=function($){var i=$.get(0).id;return!!this._oListeners[i];};A.prototype.cancelAll=function(){Object.keys(this._oCancelPromises).forEach(function(i){this._oCancelPromises[i].cancel();},this);this._oPendingPromises={};this._aPendingPromises=[];this._oCancelPromises={};this._oPendingPromiseAll=null;if(this.iTimer){clearTimeout(this.iTimer);this.iTimer=null;}L.debug("FlexibleColumnLayout","detached all listeners for columns resize");};A.prototype._attachTransitionEnd=function($,i){var I=$.get(0).id;if(!this._oListeners[I]){$.on("webkitTransitionEnd transitionend",i);this._oListeners[I]=i;}};A.prototype._detachTransitionEnd=function($){var i=$.get(0).id;if(this._oListeners[i]){$.off("webkitTransitionEnd transitionend",this._oListeners[i]);this._oListeners[i]=null;}};A.prototype._cleanUp=function($){if($.length){var i=$.get(0).id;this._detachTransitionEnd($);delete this._oPendingPromises[i];delete this._oCancelPromises[i];}};return g;});
