/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/m/Button','sap/m/List','sap/m/StandardListItem','sap/m/ResponsivePopover','sap/ui/core/Core','sap/ui/core/Control','sap/ui/core/delegate/ScrollEnablement','sap/ui/Device','sap/ui/core/InvisibleText','sap/ui/core/ResizeHandler','./TokenizerRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/core/EnabledPropagator","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control","sap/ui/dom/jquery/scrollLeftRTL"],function(l,B,L,S,R,C,c,d,D,I,e,T,f,K,g,E,q,s){"use strict";var h="sapUiNoContentPadding";var j=l.TokenizerRenderMode;var P=l.PlacementType;var k=l.ListMode;var m=l.ButtonType;var n=c.extend("sap.m.Tokenizer",{metadata:{library:"sap.m",properties:{editable:{type:"boolean",group:"Misc",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},renderMode:{type:"string",group:"Misc",defaultValue:j.Loose},hiddenTokensCount:{type:"int",group:"Misc",defaultValue:0,visibility:"hidden"}},defaultAggregation:"tokens",aggregations:{tokens:{type:"sap.m.Token",multiple:true,singularName:"token"},_tokensInfo:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tokenChange:{parameters:{type:{type:"string"},token:{type:"sap.m.Token"},tokens:{type:"sap.m.Token[]"},addedTokens:{type:"sap.m.Token[]"},removedTokens:{type:"sap.m.Token[]"}}},tokenUpdate:{allowPreventDefault:true,parameters:{type:{type:"string"},addedTokens:{type:"sap.m.Token[]"},removedTokens:{type:"sap.m.Token[]"}}},tokenDelete:{parameters:{tokens:{type:"sap.m.Token[]"},keyCode:{type:"number"}}}}}});var r=C.getLibraryResourceBundle("sap.m");E.apply(n.prototype,[true]);n.prototype.init=function(){this.allowTextSelection(false);this._oTokensWidthMap={};this._oIndicator=null;this._oScroller=new d(this,this.getId()+"-scrollContainer",{horizontal:true,vertical:false,nonTouchScrolling:true});if(C.getConfiguration().getAccessibility()){var a=new I({text:r.getText("TOKENIZER_ARIA_NO_TOKENS")});this.setAggregation("_tokensInfo",a);}this.attachEvent("delete",function(o){var t=o.getSource();var b=this.getSelectedTokens();this.fireTokenChange({type:sap.m.Tokenizer.TokenChangeType.Removed,token:t,tokens:b.length?b:[t],addedTokens:[],removedTokens:b.length?b:[t]});this.fireTokenUpdate({type:sap.m.Tokenizer.TokenChangeType.Removed,addedTokens:[],removedTokens:b.length?b:[t]});this.fireEvent("tokenDelete",{tokens:[t]});},this);};n.prototype._handleNMoreIndicatorPress=function(){this._togglePopup(this.getTokensPopup());};n.prototype._getTokensList=function(){if(!this._oTokensList){this._oTokensList=new L({width:"auto",mode:k.Delete}).attachDelete(this._handleListItemDelete,this);}return this._oTokensList;};n.prototype._setPopoverMode=function(M){var o={},p=this.getTokensPopup();switch(M){case k.Delete:o={showArrow:false,placement:P.VerticalPreferredBottom};break;default:o={showArrow:true,placement:P.Auto};break;}p.setShowArrow(o.showArrow);p.setPlacement(o.placement);this._getTokensList().setMode(M);};n.prototype._fillTokensList=function(o,F){o.destroyItems();F=F?F:function(){return true;};this.getTokens().filter(F).forEach(function(t){o.addItem(this._mapTokenToListItem(t));},this);};n.prototype._handleListItemDelete=function(o){var a=o.getParameter("listItem");var b=a&&a.data("tokenId");var t;t=this.getTokens().filter(function(i){return(i.getId()===b)&&i.getEditable();})[0];if(t){this.fireTokenUpdate({addedTokens:[],removedTokens:[t],type:n.TokenUpdateType.Removed});this.fireTokenDelete({tokens:[t]});this._adjustTokensVisibility();}};n.prototype.getTokensPopup=function(){if(this._oPopup){return this._oPopup;}this._oPopup=new R({showArrow:false,showHeader:D.system.phone,placement:P.Auto,offsetX:0,offsetY:3,horizontalScrolling:false,title:this._getDialogTitle(),content:this._getTokensList()}).attachBeforeOpen(function(){var w=this.getEditable()?120:32,p=this._oPopup;if(p.getContent&&!p.getContent().length){p.addContent(this._getTokensList());}this._fillTokensList(this._getTokensList());w+=Object.keys(this._oTokensWidthMap).map(function(a){return this._oTokensWidthMap[a];},this).sort(function(a,b){return a-b;}).pop()||0;p.setContentWidth(w+"px");},this);this.addDependent(this._oPopup);this._oPopup.addStyleClass(h);if(D.system.phone){this._oPopup.setEndButton(new B({text:r.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON"),type:m.Emphasized,press:function(){this._oPopup.close();}.bind(this)}));}return this._oPopup;};n.prototype._getDialogTitle=function(){var o=C.getLibraryResourceBundle("sap.m");var a=this.getAriaLabelledBy().map(function(b){return C.byId(b);});return a.length?a[0].getText():o.getText("COMBOBOX_PICKER_TITLE");};n.prototype._togglePopup=function(p){var o,a=this.getDomRef(),b=p.isOpen(),i=this.getEditable();this._setPopoverMode(i?k.Delete:k.None);if(b){p.close();}else{o=i||this.hasOneTruncatedToken()?a:this._oIndicator[0];o=o&&o.className.indexOf("sapUiHidden")===-1?o:a;p.openBy(o||a);}};n.prototype._mapTokenToListItem=function(t){if(!t){return null;}var o=new S({selected:true}).data("tokenId",t.getId());o.setTitle(t.getText());return o;};n.prototype._getPixelWidth=function(){var M=this.getMaxWidth(),t,o=this.getDomRef(),p;if(!o){return;}p=parseInt(this.$().css("padding-left"));if(M.indexOf("px")===-1){t=o.clientWidth;}else{t=parseInt(this.getMaxWidth());}return t-p;};n.prototype._adjustTokensVisibility=function(){if(!this.getDomRef()){return;}var t=this._getPixelWidth(),a=this._getVisibleTokens().reverse(),i=a.length,b,F,o,p=-1;a.some(function(u,v){t=t-this._oTokensWidthMap[u.getId()];if(t<0){p=v;return true;}else{F=t;}},this);if(i===1&&p!==-1){this.setFirstTokenTruncated(true);return;}else if(i===1&&a[0].getTruncated()){this.setFirstTokenTruncated(false);}if(p>-1){for(o=0;o<i;o++){if(o>=p){a[o].addStyleClass("sapMHiddenToken");}else{a[o].removeStyleClass("sapMHiddenToken");}}this._handleNMoreIndicator(i-p);b=this._oIndicator.width();if(b>=F){p=p-1;this._handleNMoreIndicator(i-p);a[p].addStyleClass("sapMHiddenToken");}this._setHiddenTokensCount(i-p);}else{this._setHiddenTokensCount(0);this._showAllTokens();}};n.prototype.setFirstTokenTruncated=function(v){var t=this.getTokens()[0];t&&t.setTruncated(v);if(v){this.addStyleClass("sapMTokenizerOneLongToken");}else{this.removeStyleClass("sapMTokenizerOneLongToken");this.scrollToEnd();}return this;};n.prototype.hasOneTruncatedToken=function(){return this.getTokens().length===1&&this.getTokens()[0].getTruncated();};n.prototype._handleNMoreIndicator=function(H){if(!this.getDomRef()){return this;}if(H){var a="MULTIINPUT_SHOW_MORE_TOKENS";if(H===this._getVisibleTokens().length){if(H===1){a="TOKENIZER_SHOW_ALL_ITEM";}else{a="TOKENIZER_SHOW_ALL_ITEMS";}}this._oIndicator.html(r.getText(a,H));}return this;};n.prototype._getVisibleTokens=function(){return this.getTokens().filter(function(t){return t.getVisible();});};n.prototype._showAllTokens=function(){this._getVisibleTokens().forEach(function(t){t.removeStyleClass("sapMHiddenToken");});};n.prototype.getScrollDelegate=function(){return this._oScroller;};n.prototype.scrollToEnd=function(){var a=this.getDomRef(),b=C.getConfiguration().getRTL(),i,o;if(!this.getDomRef()){return;}o=this.$().find(".sapMTokenizerScrollContainer")[0];i=o.scrollWidth;if(b){i*=-1;}if(D.browser.msie){setTimeout(function(){a.scrollLeft=i;});}else{a.scrollLeft=i;}};n.prototype._registerResizeHandler=function(){if(!this._sResizeHandlerId){this._sResizeHandlerId=e.register(this.getDomRef(),this._handleResize.bind(this));}};n.prototype._handleResize=function(){this._useCollapsedMode(this.getRenderMode());this.scrollToEnd();};n.prototype.setPixelWidth=function(a){if(typeof a!=="number"){g.warning("Tokenizer.setPixelWidth called with invalid parameter. Expected parameter of type number.");return;}this.setWidth(a+"px");if(this._oScroller){this._oScroller.refresh();}};n.prototype.scrollToStart=function(){var a=this.getDomRef();if(!a){return;}a.scrollLeft=0;};n.prototype.getScrollWidth=function(){if(!this.getDomRef()){return 0;}return this.$().children(".sapMTokenizerScrollContainer")[0].scrollWidth;};n.prototype.onBeforeRendering=function(){var t=this.getTokens();if(t.length===0){this.setFirstTokenTruncated(false);}t.forEach(function(o,i){o.setProperty("editableParent",this.getEditable()&&this.getEnabled(),true);o.setProperty("posinset",i+1,true);o.setProperty("setsize",t.length,true);},this);this._setTokensAria();};n.prototype.onAfterRendering=function(){var a=this.getRenderMode();this._oIndicator=this.$().find(".sapMTokenizerIndicator");if(C.isThemeApplied()){this._storeTokensSizes();}this._useCollapsedMode(a);this._registerResizeHandler();if(a===j.Loose){this.scrollToEnd();}};n.prototype.onThemeChanged=function(){this._storeTokensSizes();this._useCollapsedMode(this.getRenderMode());};n.prototype._storeTokensSizes=function(){var t=this.getTokens();t.forEach(function(o){if(o.getDomRef()&&!o.$().hasClass("sapMHiddenToken")&&!o.getTruncated()){this._oTokensWidthMap[o.getId()]=o.$().outerWidth(true);}},this);};n.prototype._useCollapsedMode=function(a){var t=this._getVisibleTokens();if(!t.length){return;}if(a===j.Narrow){this._adjustTokensVisibility();}else{this._setHiddenTokensCount(0);this._showAllTokens();}};n.prototype.onsapfocusleave=function(o){if(document.activeElement===this.getDomRef()||!this._checkFocus()){this._changeAllTokensSelection(false);this._oSelectionOrigin=null;}};n.prototype.onsapbackspace=function(o){var a=this.getSelectedTokens();var F=this.getTokens().filter(function(t){return t.getFocusDomRef()===document.activeElement;})[0];var b=a.length?a:[F];o.preventDefault();return this.fireTokenDelete({tokens:b,keyCode:o.which});};n.prototype.onsapdelete=n.prototype.onsapbackspace;n.prototype.onkeydown=function(o){var b;if(!this.getEnabled()){return;}if(o.which===K.TAB){this._changeAllTokensSelection(false);}if((o.ctrlKey||o.metaKey)&&o.which===K.A){b=this.getSelectedTokens().length<this._getVisibleTokens().length;if(this._getVisibleTokens().length>0){this.focus();this._changeAllTokensSelection(b);o.preventDefault();o.stopPropagation();}}if((o.ctrlKey||o.metaKey)&&(o.which===K.C||o.which===K.INSERT)){this._copy();}if(((o.ctrlKey||o.metaKey)&&o.which===K.X)||(o.shiftKey&&o.which===K.DELETE)){if(this.getEditable()){this._cut();}else{this._copy();}}};n.prototype.onsappreviousmodifiers=function(o){this.onsapprevious(o);};n.prototype.onsapnextmodifiers=function(o){this.onsapnext(o);};n.prototype.onsaphomemodifiers=function(o){this._selectRange(false);};n.prototype.onsapendmodifiers=function(o){this._selectRange(true);};n.prototype._selectRange=function(F){var o={},t=this._getVisibleTokens(),a=q(document.activeElement).control()[0],b=t.indexOf(a);if(!a||!a.isA("sap.m.Token")){return;}if(F){o.start=b;o.end=t.length-1;}else{o.start=0;o.end=b;}if(o.start<o.end){for(var i=o.start;i<=o.end;i++){t[i].setSelected(true);}}};n.prototype._copy=function(){this._fillClipboard("copy");};n.prototype._fillClipboard=function(a){var b=this.getSelectedTokens();var t=b.map(function(o){return o.getText();}).join("\r\n");var i=function(o){if(o.clipboardData){o.clipboardData.setData('text/plain',t);}else{o.originalEvent.clipboardData.setData('text/plain',t);}o.preventDefault();};if(D.browser.msie&&window.clipboardData){window.clipboardData.setData("text",t);}else{document.addEventListener(a,i);document.execCommand(a);document.removeEventListener(a,i);}};n.prototype._cut=function(){var a=this.getSelectedTokens();this._fillClipboard("cut");this.fireTokenChange({type:sap.m.Tokenizer.TokenChangeType.Removed,token:a,tokens:a,addedTokens:[],removedTokens:a});this.fireTokenUpdate({type:sap.m.Tokenizer.TokenChangeType.Removed,addedTokens:[],removedTokens:a});this.fireTokenDelete({tokens:a});};n.prototype._ensureTokenVisible=function(t){if(!t||!t.getDomRef()||!this.getDomRef()){return;}var i=this.$().offset().left,a=this.$().width(),b=t.$().offset().left,o=C.getConfiguration().getRTL(),p=o?parseInt(t.$().css("margin-left")):parseInt(t.$().css("margin-right")),u=parseInt(t.$().css("border-left-width"))+parseInt(t.$().css("border-right-width")),v=t.$().width()+p+u,w=o?this.$().scrollLeftRTL():this.$().scrollLeft(),x=w-i+b,y=w+(b-i+v-a);if(this._getVisibleTokens().indexOf(t)===0){this.$().scrollLeft(0);return;}if(b<i){o?this.$().scrollLeftRTL(x):this.$().scrollLeft(x);}if(b-i+v>a){o?this.$().scrollLeftRTL(y):this.$().scrollLeft(y);}};n.prototype.ontap=function(o){var b=o.shiftKey,a=(o.ctrlKey||o.metaKey),t=o.getMark("tokenTap"),p=o.getMark("tokenDeletePress"),u=this._getVisibleTokens(),v=u[u.length-1],F,w,x,M,y;if(p||!t||(!b&&a)){this._oSelectionOrigin=null;return;}if(D.browser.msie&&t===v){this.scrollToEnd();}if(!b){this._oSelectionOrigin=t;this._changeAllTokensSelection(false,t,true);}F=t;if(this._oSelectionOrigin){F=this._oSelectionOrigin;}else{this._oSelectionOrigin=F;}if(t&&this.hasOneTruncatedToken()){this._handleNMoreIndicatorPress();return;}w=this.indexOfToken(F);x=this.indexOfToken(t);M=Math.min(w,x);y=Math.max(w,x);u.forEach(function(z,i){if(i>=M&&i<=y){z.setSelected(true);}else if(!a){z.setSelected(false);}});};n.prototype.onsapprevious=function(o){var t=this._getVisibleTokens(),i=t.length;if(i===0){return;}var F=q(document.activeElement).control()[0];var a=F?t.indexOf(F):-1;if(a===0){o.setMarked("forwardFocusToParent");return;}var b,p;if(a>0){b=t[a-1];this._ensureTokenVisible(b);b.focus();}else{b=t[t.length-1];this._ensureTokenVisible(b);b.focus({preventScroll:true});}if(o.shiftKey){p=t[a];b.setSelected(true);p.setSelected(true);}o.setMarked();o.preventDefault();};n.prototype.onsapnext=function(o){var t=this._getVisibleTokens(),i=t.length;if(i===0){return;}var F=q(document.activeElement).control()[0];var a=F?t.indexOf(F):-1;var N=t[a+1];this._ensureTokenVisible(N);if(a<i-1){var b=t[a];N.focus();if(o.shiftKey){N.setSelected(true);b.setSelected(true);}}else{o.setMarked("forwardFocusToParent");return;}o.setMarked();o.preventDefault();};n.prototype.addValidator=function(v){g.warning("[Warning]:","You are attempting to use deprecated method 'addValidator()', please use MultiInput.prototype.addValidator instead.",this);};n.prototype.removeValidator=function(v){g.warning("[Warning]:","You are attempting to use deprecated method 'addValidator()', please use MultiInput.prototype.addValidator instead.",this);};n.prototype.removeAllValidators=function(){g.warning("[Warning]:","You are attempting to use deprecated method 'addValidator()', please use MultiInput.prototype.addValidator instead.",this);};n.prototype.addValidateToken=function(p){g.warning("[Warning]:","You are attempting to use deprecated method 'addValidator()', please use MultiInput.prototype.addValidator instead.",this);};n.prototype._parseString=function(a){return a.split(/\r\n|\r|\n/g);};n.prototype._checkFocus=function(){return this.getDomRef()&&f(this.getDomRef(),document.activeElement);};n.prototype.selectAllTokens=function(b){if(b===undefined){b=true;}this._changeAllTokensSelection(b);return this;};n.prototype._changeAllTokensSelection=function(b,t,a){var i=this._getVisibleTokens();i.filter(function(o){return o!==t;}).forEach(function(o){o.setSelected(b);});if(!a){this._doSelect();}return this;};n.prototype.getSelectedTokens=function(){return this._getVisibleTokens().filter(function(t){return t.getSelected();});};n.prototype.onsaphome=function(o){var a=this.getTokens().filter(function(t){return t.getDomRef()&&!t.getDomRef().classList.contains("sapMHiddenToken");});a.length&&a[0].focus();this.scrollToStart();o.preventDefault();};n.prototype.onsapend=function(o){var t=this._getVisibleTokens(),a=t[t.length-1];if(a.getDomRef()!==document.activeElement){a.focus();this.scrollToEnd();o.stopPropagation();}else{o.setMarked("forwardFocusToParent");}o.preventDefault();};n.prototype.onclick=function(o){var F;if(!this.getEnabled()){return;}F=!this.hasStyleClass("sapMTokenizerIndicatorDisabled")&&o.target.classList.contains("sapMTokenizerIndicator");if(F){this._handleNMoreIndicatorPress();}};n.prototype.ontouchstart=function(o){o.setMarked();if(D.browser.chrome&&window.getSelection()){window.getSelection().removeAllRanges();}};n.prototype.exit=function(){this._deregisterResizeHandler();if(this._oTokensList){this._oTokensList.destroy();this._oTokensList=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._oPopup){this._oPopup.destroy();this._oPopup=null;}this._oTokensWidthMap=null;this._oIndicator=null;this._aTokenValidators=null;};n.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){e.deregister(this._sResizeHandlerId);delete this._sResizeHandlerId;}};n.prototype._setTokensAria=function(){var t=this._getVisibleTokens().length;var i;var a="";var b="";var o={0:"TOKENIZER_ARIA_NO_TOKENS",1:"TOKENIZER_ARIA_CONTAIN_ONE_TOKEN"};if(C.getConfiguration().getAccessibility()){i=this.getAggregation("_tokensInfo");b=o[t]?o[t]:"TOKENIZER_ARIA_CONTAIN_SEVERAL_TOKENS";a=r.getText(b,t);i.setText(a);}};n.prototype._doSelect=function(){if(this._checkFocus()&&this._bCopyToClipboardSupport){var F=document.activeElement;var o=window.getSelection();o.removeAllRanges();if(this.getSelectedTokens().length){var a=document.createRange();a.selectNodeContents(this.getDomRef("clip"));o.addRange(a);}if(window.clipboardData&&F.id===this.getId()+"-clip"&&this.getDomRef()){this.getDomRef().focus();}}};n.prototype._setHiddenTokensCount=function(i){i=this.validateProperty("hiddenTokensCount",i);return this.setProperty("hiddenTokensCount",i);};n.prototype.getHiddenTokensCount=function(){return this.getProperty("hiddenTokensCount");};n.prototype.getTokensInfoId=function(){return this.getAggregation("_tokensInfo").getId();};n.prototype._handleBackspace=function(i,F){var t=this.getTokens();if(t[i-1]){return t[i-1].focus();}return F();};n.prototype._handleDelete=function(i,F){var t=this.getTokens();if(t[i+1]){return t[i+1].focus();}return F();};n.prototype.focusToken=function(i,o,F){var t=this.getTokens();var b=o.keyCode;var a=o.keyCode===K.BACKSPACE;if(t.length===0){return;}if(!b){return;}if(a){return this._handleBackspace(i,F);}return this._handleDelete(i,F);};n.TokenChangeType={Added:"added",Removed:"removed",RemovedAll:"removedAll",TokensChanged:"tokensChanged"};n.TokenUpdateType={Added:"added",Removed:"removed"};return n;});
