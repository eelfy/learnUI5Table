// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/m/Text","sap/ui/base/ManagedObject","sap/ui/core/Control","sap/ui/core/Icon","sap/ui/thirdparty/jquery","sap/ushell/library","sap/ushell/resources","sap/ushell/ui/launchpad/AccessibilityCustomData","./TileRenderer"],function(L,T,M,C,I,q,u,r,A){"use strict";var a=C.extend("sap.ushell.ui.launchpad.Tile",{metadata:{library:"sap.ushell",properties:{long:{type:"boolean",group:"Misc",defaultValue:false},uuid:{type:"string",group:"Misc",defaultValue:null},tileCatalogId:{type:"string",group:"Misc",defaultValue:null},isCustomTile:{type:"boolean",group:"Misc",defaultValue:false},target:{type:"string",group:"Misc",defaultValue:null},debugInfo:{type:"string",group:"Misc",defaultValue:null},rgba:{type:"string",group:"Misc",defaultValue:null},animationRendered:{type:"boolean",group:"Misc",defaultValue:false},isLocked:{type:"boolean",group:"Misc",defaultValue:false},showActionsIcon:{type:"boolean",group:"Misc",defaultValue:false},tileActionModeActive:{type:"boolean",group:"Misc",defaultValue:false},ieHtml5DnD:{type:"boolean",group:"Misc",defaultValue:false},navigationMode:{type:"string",group:"Misc",defaultValue:null},isDraggedInTabBarToSourceGroup:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{tileViews:{type:"sap.ui.core.Control",multiple:true,singularName:"tileView"},pinButton:{type:"sap.ui.core.Control",multiple:true,singularName:"pinButton"}},events:{press:{},coverDivPress:{},afterRendering:{},showActions:{},deletePress:{}}}});a.prototype.init=function(){this.addEventDelegate({onsapenter:this._launchTileViaKeyboard.bind(this),onsapspace:this._launchTileViaKeyboard.bind(this)});};a.prototype.exit=function(){if(this.actionSheetIcon){this.actionSheetIcon.destroy();}if(this.actionIcon){this.actionIcon.destroy();}if(this.failedToLoadViewText){this.failedToLoadViewText.destroy();}};a.prototype.getFailedtoLoadViewText=function(){if(!this.failedToLoadViewText){this.failedToLoadViewText=new T({text:r.i18n.getText("Tile.failedToLoadView")});}return this.failedToLoadViewText;};a.prototype.getActionSheetIcon=function(){if(!this.getTileActionModeActive()){return undefined;}if(!this.actionSheetIcon){this.actionSheetIcon=new I({src:"sap-icon://overflow",tooltip:r.i18n.getText("configuration.category.tile_actions")}).addStyleClass("sapUshellTileActionIconDivBottomInner");}return this.actionSheetIcon;};a.prototype.ontap=function(){L.info("Tile clicked:",this.getDebugInfo(),"sap.ushell.ui.launchpad.Tile");this.firePress();};a.prototype.destroy=function(s){this.destroyTileViews();C.prototype.destroy.call(this,s);};a.prototype.addTileView=function(o,s){o.setParent(null);M.prototype.addAggregation.call(this,"tileViews",o,s);};a.prototype.destroyTileViews=function(){if(this.mAggregations.tileViews){this.mAggregations.tileViews.length=0;}};a.prototype.onBeforeRendering=function(){var d=this.getDomRef();if(d){var i=d.querySelector("a.sapUshellTileInner");if(i){i.onclick=null;}}};a.prototype.onAfterRendering=function(){if(this.getIsDraggedInTabBarToSourceGroup()){var t=this.getParent();t.removeAggregation("tiles",this,false);}this._redrawRGBA();this._disableInnerLink();this.fireAfterRendering();};a.prototype._disableInnerLink=function(){var d=this.getDomRef();var i=d.querySelector("a.sapUshellTileInner");if(i){i.onclick=function(e){e.preventDefault();};}};a.prototype._launchTileViaKeyboard=function(e){if(this.getTileActionModeActive()){this.fireCoverDivPress({id:this.getId()});}else{this._announceLoadingApplication();if(e.target.tagName!=="BUTTON"){var t=this.getTileViews()[0],p=false,c,o;if(t.firePress){t.firePress({id:this.getId()});}else if(t.getComponentInstance){c=t.getComponentInstance();if(c._oController&&c._oController.oView.getContent()){o=c._oController.oView.getContent()[0];if(o&&o.firePress){o.firePress({id:this.getId()});}}}else{while(t.getContent&&!p){t=t.getContent()[0];if(t.firePress){t.firePress({id:this.getId()});p=true;}}}}}};a.prototype.onfocusin=function(){var t=this.getDomRef();if(!t.classList.contains("sapUshellPlusTile")){var j=this.$().prevUntil("h3"),c;if(j.length>0){c=j[j.length-1].previousSibling;}else{c=t.previousSibling;}var o=t.querySelector(".sapUshellTileInner");if(o&&o.children&&o.children[0]){var l=[];if(c){l.push("sapUshellCatalogAccessibilityTileText");}else{l.push("sapUshellDashboardAccessibilityTileText");}var n=this.getNavigationMode();if(n){var N=r.i18n.getText(n+"NavigationMode");if(N){var s=this.getId()+"-navigationMode";if(!document.getElementById(s)){var b=document.createElement("div");b.setAttribute("id",s);b.style.display="none";b.innerText=N;o.appendChild(b);}l.push(s);}else{L.warning("The navigation mode is of a unkown mode, it can not be read!");}}l.push(o.children[0].getAttribute("id"));var d=t.querySelector(".sapUshellTileDeleteClickArea .sapUiIcon");if(d){l.push(d.id);}if(c){l.push(c.getAttribute("id"));}if(this.getTileActionModeActive()){l.push("sapUshellDashboardAccessibilityTileEditModeText");}t.setAttribute("aria-labelledby",l.join(" "));}}};a.prototype.onclick=function(e){if(this.getTileActionModeActive()){var s=e.originalEvent.srcElement;if(q(s).closest(".sapUshellTileDeleteClickArea").length>0){this.fireDeletePress();}else{this.fireCoverDivPress({id:this.getId()});}}else{this._announceLoadingApplication();}};a.prototype._announceLoadingApplication=function(){var o=document.getElementById("sapUshellLoadingAccessibilityHelper-appInfo"),l=r.i18n.getText("screenReaderNavigationLoading");if(o){o.setAttribute("role","alert");o.innerText=l;setTimeout(function(){o.removeAttribute("role");o.innerText="";},0);}};a.prototype._initDeleteAction=function(){var t=this;if(!this.deleteIcon){this.deleteIcon=new I({src:"sap-icon://decline",tooltip:r.i18n.getText("removeButtonTitle")});this.deleteIcon.addEventDelegate({onclick:function(e){t.fireDeletePress();e.stopPropagation();}});this.deleteIcon.addStyleClass("sapUshellTileDeleteIconInnerClass");this.deleteIcon.addCustomData(new A({key:"aria-label",value:r.i18n.getText("removeButtonLabel"),writeToDom:true}));}return this.deleteIcon;};a.prototype.setShowActionsIcon=function(s){if(s){if(!this.actionIcon){this.actionIcon=new I({size:"1rem",src:"sap-icon://overflow",press:function(){this.fireShowActions();this.addStyleClass("showTileActionsIcon");var e=sap.ui.getCore().getEventBus(),b=function(n,c,t){t.removeStyleClass("showTileActionsIcon");e.unsubscribe("dashboard","actionSheetClose",b);};e.subscribe("dashboard","actionSheetClose",b);}.bind(this)}).addStyleClass("sapUshellTileActionsIconClass");}}this.setProperty("showActionsIcon",s);};a.prototype.setIsDraggedInTabBarToSourceGroup=function(d){this.setProperty("isDraggedInTabBarToSourceGroup",d);this.setVisible(!d);};a.prototype.setRgba=function(v){this.setProperty("rgba",v);this._redrawRGBA();};a.prototype._redrawRGBA=function(){var R=this.getRgba(),j=this.$();if(R&&j){var m=this.getModel();j.css("background-color",R);j.unbind("mouseenter mouseleave");var b,t=j.css("border").split("px")[0];if(t>0){b=j.css("border-color");}else{b=R;}j.hover(function(){if(m&&!m.getProperty("/tileActionModeActive")){var o=j.css("box-shadow"),s=o?o.split(") ")[1]:null;if(s){j.css("box-shadow",s+" "+b);}}},function(){j.css("box-shadow","");});}};return a;});