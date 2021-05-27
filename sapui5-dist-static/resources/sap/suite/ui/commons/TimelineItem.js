/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/m/Text","sap/m/Toolbar","sap/m/Link","sap/m/TextArea","sap/m/Popover","sap/m/ToolbarSpacer","sap/m/Button","sap/ui/Device","sap/suite/ui/commons/util/ManagedObjectRegister","sap/suite/ui/commons/util/DateUtils","sap/ui/core/Icon","sap/m/library","sap/ui/core/format/DateFormat","sap/ui/base/Object","sap/ui/dom/containsOrEquals","sap/base/security/encodeXML","./TimelineItemRenderer"],function(q,C,T,a,L,b,P,c,B,D,M,d,I,l,e,f,g,h,j){"use strict";var k=l.PlacementType;var m=l.ToolbarDesign;var A=l.Avatar;var n=l.AvatarShape;var o=l.AvatarSize;var p=C.extend("sap.suite.ui.commons.TimelineItem",{metadata:{library:"sap.suite.ui.commons",properties:{dateTime:{type:"any",group:"Misc",defaultValue:null},filterValue:{type:"string",group:"Misc",defaultValue:null},icon:{type:"string",group:"Misc",defaultValue:null},iconDisplayShape:{type:"sap.m.AvatarShape",defaultValue:n.Circle},iconInitials:{type:"string",defaultValue:""},iconSize:{type:"sap.m.AvatarSize",defaultValue:o.XS},iconTooltip:{type:"string",group:"Misc",defaultValue:null},useIconTooltip:{type:"boolean",group:"Accessibility",defaultValue:true},maxCharacters:{type:"int",group:"Behavior",defaultValue:null},replyCount:{type:"int",group:"Misc",defaultValue:null},status:{type:"string",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},text:{type:"string",group:"Misc",defaultValue:null},userName:{type:"string",group:"Misc",defaultValue:null},userNameClickable:{type:"boolean",group:"Misc",defaultValue:false},userPicture:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null}},defaultAggregation:"embeddedControl",aggregations:{customAction:{type:"sap.ui.core.CustomData",multiple:true,singularName:"customAction"},customReply:{type:"sap.ui.core.Control",multiple:false},embeddedControl:{type:"sap.ui.core.Control",multiple:false},replyList:{type:"sap.m.List",multiple:false},suggestionItems:{type:"sap.m.StandardListItem",multiple:true,singularName:"suggestionItem",deprecated:true}},events:{userNameClicked:{parameters:{uiElement:{type:"sap.ui.core.Control"}}},replyPost:{parameters:{value:{type:"string"}}},replyListOpen:{},customActionClicked:{parameters:{value:{type:"string"},key:{type:"string"},linkObj:{type:"sap.m.Link"}}},suggest:{deprecated:true,parameters:{suggestValue:{type:"string"}}},suggestionItemSelected:{deprecated:true,parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}}});var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons"),S={"Warning":"sapSuiteUiCommonsTimelineStatusWarning","Error":"sapSuiteUiCommonsTimelineStatusError","Success":"sapSuiteUiCommonsTimelineStatusSuccess","Information":"sapSuiteUiCommonsTimelineStatusInformation"};p.prototype.init=function(){this._customReply=false;this._objects=new M();this._nMaxCharactersMobile=500;this._nMaxCharactersDesktop=800;this._sTextShowMore=r.getText("TIMELINE_TEXT_SHOW_MORE");this._registerControls();this._registerPopup();this._orientation="V";};p.prototype.setCustomMessage=function(i){this._objects.getInfoText().setText(i);this._objects.getInfoBar().setVisible(i&&i.length>0);this.invalidate();};p.prototype.setDateTime=function(i){i=d.parseDate(i);this.setProperty("dateTime",i);return this;};p.prototype.applyFocusInfo=function(){this.focus();this.getParent()._moveScrollBar(true);};p.prototype.getFocusDomRef=function(){return this.$("outline")[0];};p.prototype._replyPost=function(){var i=this._objects.getReplyInputArea().getValue();this.fireReplyPost({value:i});};p.prototype._registerPopup=function(){var t=this;this._objects.register("fullText",function(){var i=new T(t.getId()+"-fullText",{text:t.getText()});i.addStyleClass("sapSuiteUiCommonsTimelineItemPopoverText");return i;});this._objects.register("fullTextPopover",function(){var i=new P({placement:k.Bottom,showArrow:false,showHeader:false,contentMinWidth:'300px',contentWidth:'450px',resizable:true,content:[t._objects.getFullText()]});i.addStyleClass("sapSuiteUiCommonsTimelineItemShowMorePopover");return i;});};p.prototype._openReplyDialog=function(){if(this._customReply){this.getCustomReply().openBy(this._objects.getReplyLink());this.fireReplyListOpen();}else{this.fireReplyListOpen();this._objects.getReplyInputArea().setValue('');this._oldReplyInputArea='';this._list=this.getReplyList();if(this._list!==null){this.setAggregation("replyList",null,true);this._objects.getReplyPop().addContent(this._list);}this._objects.getReplyPop().addContent(this._objects.getReplyInputArea());this._objects.getReplyPop().openBy(this._objects.getReplyLink());}};p.prototype._callParentFn=function(){var i=Array.prototype.slice.call(arguments),N=i.shift(),s=this.getParent();if(s&&(typeof s[N]==="function")){return s[N].apply(s,i);}};p.prototype._getCorrectGroupIcon=function(){var i="",s=function(){return this.getParent()&&this.getParent()._renderDblSided;}.bind(this),t=this._isGroupCollapsed();if(this._orientation==="H"){i="sap-icon://navigation-right-arrow";if(!t){i=this._callParentFn("_isLeftAlignment")||s()?"sap-icon://navigation-down-arrow":"sap-icon://navigation-up-arrow";}}else{i="sap-icon://navigation-down-arrow";if(t){i=this._callParentFn("_isLeftAlignment")||s()?"sap-icon://navigation-right-arrow":"sap-icon://navigation-left-arrow";}}return i;};p.prototype.onclick=function(E){var t=this;if(g(this.$("outline").get(0),E.target)){if(this._isGroupHeader){t._performExpandCollapse(t._groupID);}}};p.prototype._performExpandCollapse=function(G){var i=false,E=this._isGroupCollapsed(G);var s=function(K,N){var O=K.find(".sapSuiteUiCommonsTimelineItemBarV"),Q,R;if(N.get(0)){Q=N.attr("groupId");R=!this._isGroupCollapsed(Q);if(R){O.addClass("sapSuiteUiCommonsTimelineGroupNextExpanded");}else{O.removeClass("sapSuiteUiCommonsTimelineGroupNextExpanded");}}}.bind(this),t=function(){var K,N,O;if(!i){K=this._objects.getGroupCollapseIcon&&this._objects.getGroupCollapseIcon();N=this.$();O=this._isGroupCollapsed();if(!O){N.removeClass("sapSuiteUiCommonsTimelineGroupCollapsed");N.addClass("sapSuiteUiCommonsTimelineGroupExpanded");}else{N.addClass("sapSuiteUiCommonsTimelineGroupCollapsed");N.removeClass("sapSuiteUiCommonsTimelineGroupExpanded");}K.setSrc(this._getCorrectGroupIcon());i=true;}}.bind(this),u=function(){if(this.getParent()){this.getParent()._collapsedGroups[G]=!E;}}.bind(this),$=this.$(),v=this,w=$.parent(),x,y,z,F,H,J;u();if(this._orientation==="H"){x=this.$("line");}else{x=$.find(".sapSuiteUiCommonsTimelineGroupHeaderBarWrapper");y=w.next().children("li").first();z=w.prev().children(":visible:last");if(z.get(0)){s(z,$);}if(E){F=w.children().last();s(F,y);}else{s($,y);}}if(E){x.hide();}else{x.show();}J=$.find(".sapSuiteUiCommonsTimelineGroupHeaderMainWrapper");J.attr("aria-expanded",!!E);if(E){J.attr("aria-label",r.getText("TIMELINE_ACCESSIBILITY_GROUP_HEADER")+": "+J.prevObject[0].outerText+" "+r.getText("TIMELINE_ACCESSIBILITY_GROUP_EXPAND"),true);}else{J.attr("aria-label",r.getText("TIMELINE_ACCESSIBILITY_GROUP_HEADER")+": "+J.prevObject[0].outerText+" "+r.getText("TIMELINE_ACCESSIBILITY_GROUP_COLLAPSE"),true);}if(this._orientation!=="H"||E){t();}H=this._callParentFn("_performExpandCollapse",G,E,this);if(H){return new Promise(function(K,N){H.then(function(){t();v._callParentFn("_performUiChanges");K();});});}};p.prototype._getStatusColorClass=function(){var s=this.getStatus();return S[s]||"";};p.prototype._getLineIcon=function(){var t=this,i;this._objects.register("lineIcon",function(){var s="sap-icon://circle-task",u=t.getText()==="GroupHeader";if(!u){s=t.getIcon()?t.getIcon():"sap-icon://activity-items";}i=new I(t.getId()+'-icon',{src:s,tooltip:t.getIconTooltip(),useIconTooltip:t.getUseIconTooltip()});i.addStyleClass("sapSuiteUiCommonsTimelineBarIcon");return i;});return this._objects.getLineIcon();};p.prototype._isGroupCollapsed=function(i){var s=this.getParent();i=i||this._groupID;return s&&s._collapsedGroups&&s._collapsedGroups[i];};p.prototype._getCollapsedText=function(){var s=this.getText().substring(0,this._nMaxCollapsedLength);var i=s.lastIndexOf(" ");if(i>0){this._sShortText=s.substr(0,i);}else{this._sShortText=s;}return this._sShortText;};p.prototype._toggleTextExpanded=function(E){var t=this,i=E.getSource(),$=i.$(),s=this.$("realtext"),u=$.height(),v=$.position().top,w=s.parent().position().top,x=$.parent().prev(),y,z,N=this.getParent()&&this.getParent()._noAnimation,O=8,F=function(){return t.getParent()&&t.getParent()._renderDblSided;},G=function(V,Q,R){x.css("-webkit-line-clamp",R);if(F()||N){x.css("height",V);t._callParentFn("_performUiChanges");}else{x.animate({height:Q},250,t._callParentFn("_performUiChanges"));}};if(this._orientation==="V"){z=this.$("threeDots");y=x.children().first();if(!this._expanded){this._textProperties={height:x.css("height"),clamp:x.css("-webkit-line-clamp"),text:y.html()};x.attr("expanded",true);z.hide();y.html(this._encodeHTMLAndLineBreak(this.getText()));var H=r.getText("TIMELINE_TEXT_SHOW_LESS");i.setText(H);i.rerender();G("",y.height(),"");}else{x.attr("expanded",false);i.setText(this._sTextShowMore);i.rerender();z.show();y.html(this._textProperties.text);G(this._textProperties.height,this._textProperties.height,this._textProperties.clamp);}t._expanded=!t._expanded;}else{var J=w-v-u-O,W=q(window).height()-$.offset().top,K=200;if(W<K){J-=(K-W);}this._objects.getFullText().setText(this.getText());this._objects.getFullTextPopover().setOffsetY(Math.floor(J));this._objects.getFullTextPopover().openBy(this._objects.getExpandButton());}};p.prototype._getButtonExpandCollapse=function(){var t=this;this._objects.register("expandButton",function(){return new L(t.getId()+"-fullTextBtn",{text:t._sTextShowMore,press:t._toggleTextExpanded.bind(t)});});return this._objects.getExpandButton();};p.prototype._checkTextIsExpandable=function(){this._nMaxCollapsedLength=this.getMaxCharacters();if(this._nMaxCollapsedLength===0){this._nMaxCollapsedLength=D.system.phone?this._nMaxCharactersMobile:this._nMaxCharactersDesktop;}return this.getText().length>this._nMaxCollapsedLength;};p.prototype.onBeforeRendering=function(){var t=this;if(!this._list){this._list=this.getReplyList();}if(this.getReplyCount()>0){this._objects.getReplyLink().setText(r.getText("TIMELINE_REPLY")+" ("+this.getReplyCount()+")");}else if(this._list&&this._list.getItems().length>0){this._objects.getReplyLink().setText(r.getText("TIMELINE_REPLY")+" ("+this._list.getItems().length+")");}this._objects.getSocialBar().removeAllContent();if(this._callParentFn("getEnableSocial")){this._objects.getSocialBar().addContent(this._objects.getReplyLink());}this._actionList=this.getCustomAction();function F(E,w){t.fireCustomActionClicked({"value":w.value,"key":w.key,"linkObj":this});}for(var i=0;i<this._actionList.length;i++){var s=this._actionList[i].getKey();var v=this._actionList[i].getValue();var u=new L({text:v,tooltip:s});u.addStyleClass("sapSuiteUiCommonsTimelineItemActionLink");u.attachPress({"value":v,"key":s},F);this._objects.getSocialBar().addContent(u);}};p.prototype._encodeHTMLAndLineBreak=function(t){return h(t).replace(/&#xa;/g,"<br>");};p.prototype._getUserPictureControl=function(){var u=this.getUserPicture(),i=this.getIconInitials(),s=this.getIconDisplayShape(),t=this.getIconSize();if(!u){return null;}this._objects.register("userPictureControl",function(){var v=new A({src:u,initials:i,displayShape:s,displaySize:t,tooltip:r.getText("TIMELINE_USER_PICTURE")});return v;});return this._objects.getUserPictureControl();};p.prototype._getUserNameLinkControl=function(){var t=this;if(this.getUserNameClickable()){this._objects.register("userNameLink",function(){var i=new L(t.getId()+"-userNameLink",{text:t.getUserName(),press:function(E){t.fireUserNameClicked({uiElement:this});}});i.addStyleClass("sapUiSelectable");return i;});return this._objects.getUserNameLink();}};p.prototype.onAfterRendering=function(){this._expanded=false;this._callParentFn("_itemRendered");};p.prototype._registerControls=function(){var t=this;this._objects.register("infoText",new T(this.getId()+"-infoText",{maxLines:1,width:"100%"}));this._objects.register("infoBar",new a(this.getId()+"-infoBar",{id:this.getId()+"-customMessageInfoBar",content:[this._objects.getInfoText()],design:m.Info,visible:false}));this._objects.register("replyLink",function(){var i=new L(t.getId()+"-replyLink",{text:r.getText("TIMELINE_REPLY"),press:[t._openReplyDialog,t]});i.addStyleClass("sapSuiteUiCommonsTimelineItemActionLink");return i;});this._objects.register("socialBar",function(){var s=new a(t.getId()+"-socialBar",{});s.data("sap-ui-fastnavgroup",null);return s;});this._objects.register("replyInputArea",new b(this.getId()+"-replyInputArea",{height:"4rem",width:"100%"}));this._objects.register("replyPop",function(){return new P(t.getId()+"-replyPop",{initialFocus:t._objects.getReplyInputArea(),title:r.getText("TIMELINE_REPLIES"),placement:k.Vertical,footer:new a({content:[new c(),new B(t.getId()+"-replyButton",{text:r.getText("TIMELINE_REPLY"),press:function(){t._replyPost();t._objects.getReplyPop().close();}})]}),contentHeight:"15rem",contentWidth:"20rem"});});};p.prototype.exit=function(){this._objects.destroyAll();};p.prototype.getDateTimeWithoutStringParse=function(){var i=this.getProperty("dateTime");return d.parseDate(i,false)||"";};p.prototype.setCustomReply=function(R){if(R){this._customReply=true;this.setAggregation("customReply",R,true);}else{this._customReply=false;}return this;};p.prototype.setReplyList=function(i){if(i===null){return this;}this.setAggregation("replyList",i,true);var t=this;this.getReplyList().attachUpdateFinished(function(E){var F=t._objects.getReplyInputArea().getDomRef("inner");if(F){q(F.id).focus();}});return this;};p.prototype.getDateTime=function(){var i=this.getProperty("dateTime");i=d.parseDate(i);if(typeof(i)==="string"&&this instanceof sap.suite.ui.commons.TimelineItem&&this.getBindingPath("dateTime")&&this.getBindingContext()){var s=this.getBindingPath("dateTime");var t=this.getBindingContext().getProperty(s);if(t instanceof Date){return t;}else{return i;}}else{return i;}};return p;});
