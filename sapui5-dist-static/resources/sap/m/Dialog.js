/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Bar","./InstanceManager","./AssociativeOverflowToolbar","./ToolbarSpacer","./Title","./library","sap/m/Image","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/Popup","sap/ui/core/delegate/ScrollEnablement","sap/ui/core/RenderManager","sap/ui/core/InvisibleText","sap/ui/core/ResizeHandler","sap/ui/core/util/ResponsivePaddingsEnablement","sap/ui/Device","sap/ui/core/library","sap/ui/events/KeyCodes","./TitlePropagationSupport","./DialogRenderer","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/core/Core","sap/ui/core/Configuration","sap/ui/dom/units/Rem","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Focusable"],function(B,I,A,T,a,l,b,C,c,P,S,R,d,f,g,D,h,K,j,k,L,q,m,n,o){"use strict";var O=h.OpenState;var p=l.DialogType;var r=l.DialogRoleType;var V=h.ValueState;var s=l.TitleAlignment;var t=m.getConfiguration().getAnimationMode();var u=t!==n.AnimationMode.none&&t!==n.AnimationMode.minimal;var v=u?300:10;var w=17;var x=o.toPx(1);var y=C.extend("sap.m.Dialog",{metadata:{interfaces:["sap.ui.core.PopupInterface"],library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},title:{type:"string",group:"Appearance",defaultValue:null},showHeader:{type:"boolean",group:"Appearance",defaultValue:true},type:{type:"sap.m.DialogType",group:"Appearance",defaultValue:p.Standard},state:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:V.None},stretchOnPhone:{type:"boolean",group:"Appearance",defaultValue:false,deprecated:true},stretch:{type:"boolean",group:"Appearance",defaultValue:false},contentWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},contentHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},horizontalScrolling:{type:"boolean",group:"Behavior",defaultValue:true},verticalScrolling:{type:"boolean",group:"Behavior",defaultValue:true},resizable:{type:"boolean",group:"Behavior",defaultValue:false},draggable:{type:"boolean",group:"Behavior",defaultValue:false},escapeHandler:{type:"function",group:"Behavior",defaultValue:null},role:{type:"sap.m.DialogRoleType",group:"Data",defaultValue:r.Dialog,visibility:"hidden"},closeOnNavigation:{type:"boolean",group:"Behavior",defaultValue:true},titleAlignment:{type:"sap.m.TitleAlignment",group:"Misc",defaultValue:s.Auto}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},subHeader:{type:"sap.m.IBar",multiple:false},customHeader:{type:"sap.m.IBar",multiple:false},beginButton:{type:"sap.m.Button",multiple:false},endButton:{type:"sap.m.Button",multiple:false},buttons:{type:"sap.m.Button",multiple:true,singularName:"button"},_header:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_icon:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_toolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"},_valueState:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}},associations:{leftButton:{type:"sap.m.Button",multiple:false,deprecated:true},rightButton:{type:"sap.m.Button",multiple:false,deprecated:true},initialFocus:{type:"sap.ui.core.Control",multiple:false},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{beforeOpen:{},afterOpen:{},beforeClose:{parameters:{origin:{type:"sap.m.Button"}}},afterClose:{parameters:{origin:{type:"sap.m.Button"}}}},designtime:"sap/m/designtime/Dialog.designtime"}});g.call(y.prototype,{header:{suffix:"header"},subHeader:{selector:".sapMDialogSubHeader .sapMIBar"},content:{selector:".sapMDialogScrollCont"},footer:{suffix:"footer"}});j.call(y.prototype,"content",function(){return this._headerTitle?this._headerTitle.getId():false;});y._bPaddingByDefault=(m.getConfiguration().getCompatibilityVersion("sapMDialogWithPadding").compareTo("1.16")<0);y._mIcons={};y._mIcons[V.Success]=c.getIconURI("message-success");y._mIcons[V.Warning]=c.getIconURI("message-warning");y._mIcons[V.Error]=c.getIconURI("message-error");y._mIcons[V.Information]=c.getIconURI("hint");y.prototype.init=function(){var e=this;this._oManuallySetSize=null;this._oManuallySetPosition=null;this._bRTL=m.getConfiguration().getRTL();this._scrollContentList=["sap.m.NavContainer","sap.m.Page","sap.m.ScrollContainer","sap.m.SplitContainer","sap.m.MultiInput","sap.m.SimpleFixFlex"];this.oPopup=new P();this.oPopup.setShadow(true);this.oPopup.setNavigationMode("SCOPE");this.oPopup.setModal(true);this.oPopup.setAnimations(q.proxy(this._openAnimation,this),q.proxy(this._closeAnimation,this));this.oPopup._applyPosition=function(i,F){e._setDimensions();e._adjustScrollingPane();if(e._oManuallySetPosition){i.at={left:e._oManuallySetPosition.x,top:e._oManuallySetPosition.y};}else{i.at=e._calcCenter();}e._deregisterContentResizeHandler();P.prototype._applyPosition.call(this,i);e._registerContentResizeHandler();};if(y._bPaddingByDefault){this.addStyleClass("sapUiPopupWithPadding");}this._initTitlePropagationSupport();this._initResponsivePaddingsEnablement();};y.prototype.onBeforeRendering=function(){var H=this.getCustomHeader()||this._header;if(!y._bPaddingByDefault&&this.hasStyleClass("sapUiPopupWithPadding")){L.warning("Usage of CSS class 'sapUiPopupWithPadding' is deprecated. Use 'sapUiContentPadding' instead",null,"sap.m.Dialog");}if(this._hasSingleScrollableContent()){this.setVerticalScrolling(false);this.setHorizontalScrolling(false);L.info("VerticalScrolling and horizontalScrolling in sap.m.Dialog with ID "+this.getId()+" has been disabled because there's scrollable content inside");}else if(!this._oScroller){this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling()});}if(this._oScroller){this._oScroller.setVertical(this.getVerticalScrolling());this._oScroller.setHorizontal(this.getHorizontalScrolling());}this._createToolbarButtons();if(m.getConfiguration().getAccessibility()&&this.getState()!=V.None){var e=new d({text:this.getValueStateString(this.getState())});this.setAggregation("_valueState",e);this.addAriaLabelledBy(e.getId());}if(H&&H.setTitleAlignment){H.setProperty("titleAlignment",this.getTitleAlignment(),true);}};y.prototype.onAfterRendering=function(){this._$scrollPane=this.$("scroll");this._$content=this.$("cont");this._$dialog=this.$();if(this.isOpen()){this._setInitialFocus();}};y.prototype.exit=function(){I.removeDialogInstance(this);this._deregisterContentResizeHandler();this._deregisterResizeHandler();if(this.oPopup){this.oPopup.detachOpened(this._handleOpened,this);this.oPopup.detachClosed(this._handleClosed,this);this.oPopup.destroy();this.oPopup=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._header){this._header.destroy();this._header=null;}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null;}if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}if(this._toolbarSpacer){this._toolbarSpacer.destroy();this._toolbarSpacer=null;}};y.prototype.open=function(){var e=this.oPopup;e.setInitialFocusId(this.getId());var i=e.getOpenState();switch(i){case O.OPEN:case O.OPENING:return this;case O.CLOSING:this._bOpenAfterClose=true;break;default:}this._oCloseTrigger=null;this.fireBeforeOpen();e.attachOpened(this._handleOpened,this);this._iLastWidthAndHeightWithScroll=null;e.setContent(this);e.open();this._registerResizeHandler();I.addDialogInstance(this);return this;};y.prototype.close=function(){this._bOpenAfterClose=false;this.$().removeClass('sapDialogDisableTransition');this._deregisterResizeHandler();var e=this.oPopup;var i=this.oPopup.getOpenState();if(!(i===O.CLOSED||i===O.CLOSING)){l.closeKeyboard();this.fireBeforeClose({origin:this._oCloseTrigger});e.attachClosed(this._handleClosed,this);this._bDisableRepositioning=false;this._oManuallySetPosition=null;this._oManuallySetSize=null;e.close();this._deregisterContentResizeHandler();}return this;};y.prototype.isOpen=function(){return!!this.oPopup&&this.oPopup.isOpen();};y.prototype.setIcon=function(i){this._bHasCustomIcon=true;return this.setProperty("icon",i);};y.prototype.setState=function(e){var i;this.setProperty("state",e);if(this._bHasCustomIcon){return this;}if(e===V.None){i="";}else{i=y._mIcons[e];}this.setProperty("icon",i);return this;};y.prototype._handleOpened=function(){this.oPopup.detachOpened(this._handleOpened,this);this._setInitialFocus();this.fireAfterOpen();};y.prototype._handleClosed=function(){if(!this.oPopup){return;}this.oPopup.detachClosed(this._handleClosed,this);if(this.getDomRef()){R.preserveContent(this.getDomRef());this.$().remove();}I.removeDialogInstance(this);this.fireAfterClose({origin:this._oCloseTrigger});if(this._bOpenAfterClose){this._bOpenAfterClose=false;this.open();}};y.prototype.onfocusin=function(e){var i=e.target;if(i.id===this.getId()+"-firstfe"){var E=this.$("footer").lastFocusableDomRef()||this.$("cont").lastFocusableDomRef()||(this.getSubHeader()&&this.getSubHeader().$().firstFocusableDomRef())||(this._getAnyHeader()&&this._getAnyHeader().$().lastFocusableDomRef());if(E){E.focus();}}else if(i.id===this.getId()+"-lastfe"){var F=this._getFocusableHeader()||(this._getAnyHeader()&&this._getAnyHeader().$().firstFocusableDomRef())||(this.getSubHeader()&&this.getSubHeader().$().firstFocusableDomRef())||this.$("cont").firstFocusableDomRef()||this.$("footer").firstFocusableDomRef();if(F){F.focus();}}};y.prototype._getPromiseWrapper=function(){var e=this;return{reject:function(){e.currentPromise.reject();},resolve:function(){e.currentPromise.resolve();}};};y.prototype.onsapescape=function(e){var E=this.getEscapeHandler(),i={},F=this;if(this._isSpaceOrEnterPressed){return;}if(e.originalEvent&&e.originalEvent._sapui_handledByControl){return;}this._oCloseTrigger=null;if(typeof E==='function'){new Promise(function(G,H){i.resolve=G;i.reject=H;F.currentPromise=i;E(F._getPromiseWrapper());}).then(function(G){F.close();}).catch(function(){L.info("Disallow dialog closing");});}else{this.close();}e.stopPropagation();};y.prototype.onkeyup=function(e){if(this._isSpaceOrEnter(e)){this._isSpaceOrEnterPressed=false;}};y.prototype.onkeydown=function(e){if(this._isSpaceOrEnter(e)){this._isSpaceOrEnterPressed=true;}this._handleKeyboardDragResize(e);};y.prototype._handleKeyboardDragResize=function(e){if(e.target!==this._getFocusableHeader()||[K.ARROW_LEFT,K.ARROW_RIGHT,K.ARROW_UP,K.ARROW_DOWN].indexOf(e.keyCode)===-1){return;}if((!this.getResizable()&&e.shiftKey)||(!this.getDraggable()&&!e.shiftKey)){return;}var $=this._$dialog,i=$.offset(),W=window.innerWidth,E=window.innerHeight,F=$.width(),G=$.height(),H=$.outerHeight(true),J=e.shiftKey,M,N;this._bDisableRepositioning=true;$.addClass('sapDialogDisableTransition');if(J){this._oManuallySetSize=true;this.$('cont').height('').width('');}switch(e.keyCode){case K.ARROW_LEFT:if(J){F-=x;}else{i.left-=x;}break;case K.ARROW_RIGHT:if(J){F+=x;}else{i.left+=x;}break;case K.ARROW_UP:if(J){G-=x;}else{i.top-=x;}break;case K.ARROW_DOWN:if(J){G+=x;}else{i.top+=x;}break;}if(J){N=E-i.top-H+G;if(e.keyCode===K.ARROW_DOWN){N-=x;}M={width:Math.min(F,W-i.left),height:Math.min(G,N)};}else{M={left:Math.min(Math.max(0,i.left),W-F),top:Math.min(Math.max(0,i.top),E-H)};}$.css(M);};y.prototype._isSpaceOrEnter=function(e){var i=e.which||e.keyCode;return i==K.SPACE||i==K.ENTER;};y.prototype._openAnimation=function($,i,e){$.addClass("sapMDialogOpen");$.css("display","block");setTimeout(e,v);};y.prototype._closeAnimation=function($,i,e){$.removeClass("sapMDialogOpen");setTimeout(e,v);};y.prototype._setDimensions=function(){var $=this.$(),e=this.getStretch(),i=this.getStretchOnPhone()&&D.system.phone,M=this.getType()===p.Message,E={};if(!e){if(!this._oManuallySetSize){E.width=this.getContentWidth()||undefined;E.height=this.getContentHeight()||undefined;}else{E.width=this._oManuallySetSize.width;E.height=this._oManuallySetSize.height;}}if(E.width=='auto'){E.width=undefined;}if(E.height=='auto'){E.height=undefined;}if((e&&!M)||(i)){this.$().addClass('sapMDialogStretched');}$.css(E);if(!e&&!this._oManuallySetSize&&!this._bDisableRepositioning){this._centerDialog();}if(window.navigator.userAgent.toLowerCase().indexOf("chrome")!==-1&&this.getStretch()){$.find('> footer').css({bottom:'0.001px'});}};y.prototype._adjustScrollingPane=function(){if(this._oScroller){this._oScroller.refresh();}};y.prototype._reposition=function(){};y.prototype._repositionAfterOpen=function(){};y.prototype._reapplyPosition=function(){this._adjustScrollingPane();};y.prototype._onResize=function(){var $=this.$(),e=this.$('cont'),i,E=this.getContentHeight(),F=this.getContentWidth(),G,H=Math.floor(window.innerWidth*0.9),J=2,M=D.browser,N=0;if(this._oManuallySetSize){e.css({width:'auto'});return;}if(!E||E=='auto'){i=e.scrollTop();e.css({height:'auto'});$.children().each(function(){N+=q(this).outerHeight(true);});if(this.getStretch()||N>$.innerHeight()){G=parseFloat($.height())+J;e.height(Math.round(G));}e.scrollTop(i);}if(D.system.desktop&&!M.chrome){var Q=e.width()+"x"+e.height(),U=$.css("min-width")!==$.css("width");if(Q!==this._iLastWidthAndHeightWithScroll&&U){if(this._hasVerticalScrollbar()&&(!F||F=='auto')&&!this.getStretch()&&e.width()<H){$.addClass("sapMDialogVerticalScrollIncluded");e.css({"padding-right":w});this._iLastWidthAndHeightWithScroll=Q;}else{$.removeClass("sapMDialogVerticalScrollIncluded");e.css({"padding-right":""});this._iLastWidthAndHeightWithScroll=null;}}}if(!this.getStretch()&&!this._oManuallySetSize&&!this._bDisableRepositioning){this._centerDialog();}};y.prototype._hasVerticalScrollbar=function(){var $=this.$('cont');if(D.browser.msie){return $[0].clientWidth<$.outerWidth();}return $[0].clientHeight<$[0].scrollHeight;};y.prototype._centerDialog=function(){this.$().css(this._calcCenter());};y.prototype._calcCenter=function(){var e=window.innerWidth,i=window.innerHeight,$=this.$(),E=$.outerWidth(),F=$.outerHeight();return{left:Math.round((e-E)/2),top:Math.round((i-F)/2)};};y.prototype._createHeader=function(){if(!this._header){this._header=new B(this.getId()+"-header",{titleAlignment:this.getTitleAlignment()});this._header._setRootAccessibilityRole("heading");this._header._setRootAriaLevel("2");this.setAggregation("_header",this._header);}};y.prototype._applyTitleToHeader=function(){var e=this.getProperty("title");if(this._headerTitle){this._headerTitle.setText(e);}else{this._headerTitle=new a(this.getId()+"-title",{text:e,level:"H2"}).addStyleClass("sapMDialogTitle");this._header.addContentMiddle(this._headerTitle);}};y.prototype._hasSingleScrollableContent=function(){var e=this.getContent();while(e.length===1&&e[0]instanceof C&&e[0].isA("sap.ui.core.mvc.View")){e=e[0].getContent();}if(e.length===1&&e[0]instanceof C&&e[0].isA(this._scrollContentList)){return true;}return false;};y.prototype._getFocusDomRef=function(){var i=this.getInitialFocus();if(i){return document.getElementById(i);}return this._getFocusableHeader()||this._getFirstFocusableContentSubHeader()||this._getFirstFocusableContentElement()||this._getFirstVisibleButtonDomRef()||this.getDomRef();};y.prototype._getFirstVisibleButtonDomRef=function(){var e=this.getBeginButton(),E=this.getEndButton(),F=this.getButtons(),G;if(e&&e.getVisible()){G=e.getDomRef();}else if(E&&E.getVisible()){G=E.getDomRef();}else if(F&&F.length>0){for(var i=0;i<F.length;i++){if(F[i].getVisible()){G=F[i].getDomRef();break;}}}return G;};y.prototype._getFocusableHeader=function(){if(!this._isDraggableOrResizable()){return null;}return this.$().find('header.sapMDialogTitle')[0];};y.prototype._getFirstFocusableContentSubHeader=function(){var $=this.$().find('.sapMDialogSubHeader');return $.firstFocusableDomRef();};y.prototype._getFirstFocusableContentElement=function(){var $=this.$("cont");return $.firstFocusableDomRef();};y.prototype._setInitialFocus=function(){var F=this._getFocusDomRef(),e;if(F&&F.id){e=m.byId(F.id);}if(e){if(e.getVisible&&!e.getVisible()){this.focus();return;}F=e.getFocusDomRef();}if(!F){this.setInitialFocus("");F=this._getFocusDomRef();}if(!this.getInitialFocus()){this.setAssociation('initialFocus',F?F.id:this.getId(),true);}if(D.system.desktop||(F&&!/input|textarea|select/i.test(F.tagName))){if(F){F.focus();}}else{this.focus();}};y.prototype.getScrollDelegate=function(){return this._oScroller;};y.prototype._composeAggreNameInHeader=function(e){var H;if(e==="Begin"){H="contentLeft";}else if(e==="End"){H="contentRight";}else{H="content"+e;}return H;};y.prototype._isToolbarEmpty=function(){var e=this._oToolbar.getContent().filter(function(i){return i.getMetadata().getName()!=='sap.m.ToolbarSpacer';});return e.length===0;};y.prototype._setButton=function(e,i,E){return this;};y.prototype._getButton=function(e){var i=e.toLowerCase()+"Button",E="_o"+this._firstLetterUpperCase(e)+"Button";if(D.system.phone){return this.getAggregation(i,null,true);}else{return this[E];}};y.prototype._getButtonFromHeader=function(e){if(this._header){var H=this._composeAggreNameInHeader(this._firstLetterUpperCase(e)),i=this._header.getAggregation(H);return i&&i[0];}else{return null;}};y.prototype._firstLetterUpperCase=function(e){return e.charAt(0).toUpperCase()+e.slice(1);};y.prototype._getAnyHeader=function(){var e=this.getCustomHeader();if(e){e._setRootAriaLevel("2");return e._setRootAccessibilityRole("heading");}else{var i=this.getShowHeader();if(!i){return null;}this._createHeader();this._applyTitleToHeader();this._applyIconToHeader();return this._header;}};y.prototype._deregisterResizeHandler=function(){if(this._resizeListenerId){f.deregister(this._resizeListenerId);this._resizeListenerId=null;}D.resize.detachHandler(this._onResize,this);};y.prototype._registerResizeHandler=function(){var _=this.$("scroll");this._resizeListenerId=f.register(_.get(0),q.proxy(this._onResize,this));D.resize.attachHandler(this._onResize,this);this._onResize();};y.prototype._deregisterContentResizeHandler=function(){if(this._sContentResizeListenerId){f.deregister(this._sContentResizeListenerId);this._sContentResizeListenerId=null;}};y.prototype._registerContentResizeHandler=function(){if(!this._sContentResizeListenerId){this._sContentResizeListenerId=f.register(this.getDomRef("scrollCont"),q.proxy(this._onResize,this));}this._onResize();};y.prototype._attachHandler=function(e){var i=this;if(!this._oButtonDelegate){this._oButtonDelegate={ontap:function(){i._oCloseTrigger=this;},onkeyup:function(){i._oCloseTrigger=this;},onkeydown:function(){i._oCloseTrigger=this;}};}if(e){e.addDelegate(this._oButtonDelegate,true,e);}};y.prototype._createToolbarButtons=function(){var e=this._getToolbar();var i=this.getButtons();var E=this.getBeginButton();var F=this.getEndButton(),G=this,H=[E,F];H.forEach(function(J){if(J&&G._oButtonDelegate){J.removeDelegate(G._oButtonDelegate);}});e.removeAllContent();if(!("_toolbarSpacer"in this)){this._toolbarSpacer=new T();}e.addContent(this._toolbarSpacer);H.forEach(function(J){G._attachHandler(J);});if(i&&i.length){i.forEach(function(J){e.addContent(J);});}else{if(E){e.addContent(E);}if(F){e.addContent(F);}}};y.prototype._getToolbar=function(){if(!this._oToolbar){this._oToolbar=new A(this.getId()+"-footer").addStyleClass("sapMTBNoBorders");this._oToolbar.addDelegate({onAfterRendering:function(){if(this.getType()===p.Message){this.$("footer").removeClass("sapContrast sapContrastPlus");}}},false,this);this.setAggregation("_toolbar",this._oToolbar);}return this._oToolbar;};y.prototype.getValueStateString=function(e){var i=m.getLibraryResourceBundle("sap.m");switch(e){case(V.Success):return i.getText("LIST_ITEM_STATE_SUCCESS");case(V.Warning):return i.getText("LIST_ITEM_STATE_WARNING");case(V.Error):return i.getText("LIST_ITEM_STATE_ERROR");case(V.Information):return i.getText("LIST_ITEM_STATE_INFORMATION");default:return"";}};y.prototype._isDraggableOrResizable=function(){return!this.getStretch()&&(this.getDraggable()||this.getResizable());};y.prototype.setSubHeader=function(e){this.setAggregation("subHeader",e);if(e){e.setVisible=function(i){e.setProperty("visible",i);this.invalidate();}.bind(this);}return this;};y.prototype.setLeftButton=function(e){if(typeof e==="string"){e=m.byId(e);}this.setBeginButton(e);return this.setAssociation("leftButton",e);};y.prototype.setRightButton=function(e){if(typeof e==="string"){e=m.byId(e);}this.setEndButton(e);return this.setAssociation("rightButton",e);};y.prototype.getLeftButton=function(){var e=this.getBeginButton();return e?e.getId():null;};y.prototype.getRightButton=function(){var e=this.getEndButton();return e?e.getId():null;};y.prototype.setBeginButton=function(e){if(e&&e.isA("sap.m.Button")){e.addStyleClass("sapMDialogBeginButton");}return this.setAggregation("beginButton",e);};y.prototype.setEndButton=function(e){if(e&&e.isA("sap.m.Button")){e.addStyleClass("sapMDialogEndButton");}return this.setAggregation("endButton",e);};y.prototype.getAggregation=function(e,i,E){var F=C.prototype.getAggregation.apply(this,Array.prototype.slice.call(arguments,0,2));if(e==='buttons'&&F&&F.length===0){this.getBeginButton()&&F.push(this.getBeginButton());this.getEndButton()&&F.push(this.getEndButton());}return F;};y.prototype.getAriaLabelledBy=function(){var H=this._getAnyHeader(),e=this.getAssociation("ariaLabelledBy",[]).slice();var i=this.getSubHeader();if(i){e.unshift(i.getId());}if(H){var E=H.findAggregatedObjects(true,function(F){return F.isA("sap.m.Title");});if(E.length){e=E.map(function(F){return F.getId();}).concat(e);}else{e.unshift(H.getId());}}return e;};y.prototype._applyIconToHeader=function(){var i=this.getIcon();if(!i){if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}return;}if(!this._iconImage){this._iconImage=c.createControlByURI({id:this.getId()+"-icon",src:i,useIconTooltip:false},b).addStyleClass("sapMDialogIcon");this._header.insertAggregation("contentMiddle",this._iconImage,0);}this._iconImage.setSrc(i);};y.prototype.setInitialFocus=function(i){return this.setAssociation("initialFocus",i,true);};y.prototype.forceInvalidate=C.prototype.invalidate;y.prototype.invalidate=function(e){if(this.isOpen()){this.forceInvalidate(e);}};function z(e){var $=q(e);var i=$.control(0);if($.parents('.sapMDialogSection').length){return false;}if(!i||i.getMetadata().getInterfaces().indexOf("sap.m.IBar")>-1){return true;}return $.hasClass('sapMDialogTitle');}if(D.system.desktop){y.prototype.ondblclick=function(e){if(z(e.target)){var $=this.$('cont');this._bDisableRepositioning=false;this._oManuallySetPosition=null;this._oManuallySetSize=null;this.oPopup&&this.oPopup._applyPosition(this.oPopup._oLastPosition,true);$.css({height:'100%'});}};y.prototype.onmousedown=function(e){if(e.which===3){return;}if(!this._isDraggableOrResizable()){return;}var i;var E=this;var $=q(document);var F=q(e.target);var G=F.hasClass('sapMDialogResizeHandler')&&this.getResizable();var M=function(a1){i=i?clearTimeout(i):setTimeout(function(){a1();},0);};var H=window.innerWidth;var J=window.innerHeight;var N={x:e.pageX,y:e.pageY,width:E._$dialog.width(),height:E._$dialog.height(),outerHeight:E._$dialog.outerHeight(),offset:{x:e.offsetX?e.offsetX:e.originalEvent.layerX,y:e.offsetY?e.offsetY:e.originalEvent.layerY},position:{x:E._$dialog.offset().left,y:E._$dialog.offset().top}};var Q;function U(){var a1=E.$(),b1=E.$('cont'),c1,d1;$.off("mouseup",U);$.off("mousemove",Q);if(G){E._$dialog.removeClass('sapMDialogResizing');c1=parseInt(a1.height());d1=parseInt(a1.css("border-top-width"))+parseInt(a1.css("border-bottom-width"));b1.height(c1+d1);}}if((z(e.target)&&this.getDraggable())||G){E._bDisableRepositioning=true;E._$dialog.addClass('sapDialogDisableTransition');E._oManuallySetPosition={x:N.position.x,y:N.position.y};E._$dialog.css({left:Math.min(Math.max(0,E._oManuallySetPosition.x),H-N.width),top:Math.min(Math.max(0,E._oManuallySetPosition.y),J-N.height),width:N.width});}if(z(e.target)&&this.getDraggable()){Q=function(a1){a1.preventDefault();if(a1.buttons===0){U();return;}M(function(){E._bDisableRepositioning=true;E._oManuallySetPosition={x:Math.max(0,Math.min(a1.pageX-e.pageX+N.position.x,H-N.width)),y:Math.max(0,Math.min(a1.pageY-e.pageY+N.position.y,J-N.outerHeight))};E._$dialog.css({left:E._oManuallySetPosition.x,top:E._oManuallySetPosition.y});});};$.on("mousemove",Q);}else if(G){E._$dialog.addClass('sapMDialogResizing');var W={};var X=parseInt(E._$dialog.css('min-width'));var Y=N.x+N.width-X;var Z=F.width()-e.offsetX;var _=F.height()-e.offsetY;Q=function(a1){M(function(){E._bDisableRepositioning=true;E.$('cont').height('').width('');if(a1.pageY+_>J){a1.pageY=J-_;}if(a1.pageX+Z>H){a1.pageX=H-Z;}E._oManuallySetSize={width:N.width+a1.pageX-N.x,height:N.height+a1.pageY-N.y};if(E._bRTL){W.left=Math.min(Math.max(a1.pageX,0),Y);E._oManuallySetSize.width=N.width+N.x-Math.max(a1.pageX,0);}W.width=E._oManuallySetSize.width;W.height=E._oManuallySetSize.height;E._$dialog.css(W);});};$.on("mousemove",Q);}else{return;}$.on("mouseup",U);e.stopPropagation();};}y.prototype._applyContextualSettings=function(){C.prototype._applyContextualSettings.call(this);};return y;});
