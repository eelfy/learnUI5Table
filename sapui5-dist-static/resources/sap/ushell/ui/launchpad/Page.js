// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Button","sap/m/library","sap/m/Text","sap/ui/core/Control","sap/ui/core/dnd/DragDropInfo","sap/ui/core/InvisibleMessage","sap/ui/core/library","sap/ushell/library","sap/ushell/resources","sap/ushell/ui/launchpad/ExtendedChangeDetection","./PageRenderer"],function(B,l,T,C,D,I,c,u,r,E,P){"use strict";var a=l.ButtonType;var b=c.TextAlign;var d=c.InvisibleMessageMode;var e=C.extend("sap.ushell.ui.launchpad.Page",{metadata:{library:"sap.ushell",properties:{edit:{type:"boolean",group:"Misc",defaultValue:false},enableSectionReordering:{type:"boolean",group:"Misc",defaultValue:false},dataHelpId:{type:"string",group:"Misc",defaultValue:""},noSectionsText:{type:"string",group:"Misc",defaultValue:""},showNoSectionsText:{type:"boolean",group:"Misc",defaultValue:true},showTitle:{type:"boolean",group:"Misc",defaultValue:false},title:{type:"string",group:"Misc",defaultValue:""}},defaultAggregation:"sections",aggregations:{sections:{type:"sap.ushell.ui.launchpad.Section",multiple:true,dnd:true},_addSectionButtons:{type:"sap.m.Button",multiple:true,visibility:"hidden"},_noSectionText:{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{addSectionButtonPressed:{parameters:{index:{type:"int"}}},sectionDrop:{parameters:{draggedControl:{type:"sap.ushell.ui.launchpad.Section"},droppedControl:{type:"sap.ushell.ui.launchpad.Section"},dropPosition:{type:"string"}}}}},renderer:P});e.prototype.init=function(){this.setAggregation("_noSectionText",new T({text:r.i18n.getText("Page.NoSectionText"),width:"100%",textAlign:b.Center}));this._oDragDropInfo=new D({sourceAggregation:"sections",targetAggregation:"sections",dropPosition:"Between",dragStart:function(o){if(o.getParameter("target").getDefault()){o.preventDefault();}},dragEnter:function(o){if(o.getParameter("target").getDefault()){o.preventDefault();}},drop:function(i){this.fireSectionDrop(i.getParameters());}.bind(this)});this.addDelegate({onsappageup:this._handleKeyboardPageNavigation.bind(this),onsappagedown:this._handleKeyboardPageNavigation.bind(this),onsapdown:this._handleKeyboardArrowNavigation.bind(this,false),onsapdownmodifiers:this._handleKeyboardArrowNavigation.bind(this,true),onsapup:this._handleKeyboardArrowNavigation.bind(this,false),onsapupmodifiers:this._handleKeyboardArrowNavigation.bind(this,true),onsaphome:this._handleKeyboardHomeEndNavigation.bind(this,false),onsaphomemodifiers:this._handleKeyboardHomeEndNavigation.bind(this,false),onsapend:this._handleKeyboardHomeEndNavigation.bind(this,true),onsapendmodifiers:this._handleKeyboardHomeEndNavigation.bind(this,true),onfocusin:this._saveFocus.bind(this),onsapskipback:this._handleSkipBack.bind(this),onsapskipforward:this._handleSkipForward.bind(this),onBeforeFastNavigationFocus:this._handleBeforeFastNavigationFocus.bind(this)});this._oSectionsChangeDetection=new E("sections",this);this._oSectionsChangeDetection.attachItemDeleted(this.invalidate,this);this._oSectionsChangeDetection.attachItemsReordered(this.invalidate,this);this._oInvisibleMessageInstance=I.getInstance();};e.prototype._saveFocus=function(o){var p=o.srcControl;if(p.isA("sap.m.VBox")){var s=p.getParent();if(s){if(s.indexOfVisualization(this._oLastFocusedViz)===-1){this._oLastFocusedViz=s.getVisualizations()[0];this._oLastFocusedSection=this._oLastFocusedViz?undefined:s;}}else{this._oLastFocusedViz=undefined;this._oLastFocusedSection=undefined;}}if(p.isA("sap.f.GridContainer")){var g=p.getItems();var v=g.find(function(f){var h=f.getDomRef();return h&&h.parentNode===o.target;});this._oLastFocusedViz=v;this._oLastFocusedSection=undefined;}};e.prototype._handleSkipBack=function(o){var t;var p=o.srcControl;if(p.isA("sap.f.GridContainer")&&this.getEdit()){t=this._getAncestorSection(p);}if(t){o.preventDefault();t.focus();}};e.prototype._handleSkipForward=function(o){var t;var p=o.srcControl;if(p.isA("sap.m.VBox")){var s=p.getParent();if(s){if(s.indexOfVisualization(this._oLastFocusedViz)!==-1){t=this._oLastFocusedViz;}else{t=s.getVisualizations()[0];}}if(t){o.preventDefault();t.getDomRef().parentElement.focus();}}};e.prototype._handleBeforeFastNavigationFocus=function(o){var s=this.getSections();var f=this.getEdit();if(f&&this._oLastFocusedSection){this._oLastFocusedSection.focus();o.preventDefault();}else if(f&&o.forward&&this._oLastFocusedViz){this._getAncestorSection(this._oLastFocusedViz).focus();o.preventDefault();}else if(this._oLastFocusedViz&&this._oLastFocusedViz.getDomRef()){this._oLastFocusedViz.getDomRef().parentElement.focus();o.preventDefault();}else if(f&&o.forward&&s.length){s[0].focus();o.preventDefault();}else if(f&&!o.forward&&s.length){if(s[0].getVisualizations().length===0){s[0].focus();o.preventDefault();}else{s[0].getVisualizations()[0].getDomRef().parentElement.focus();o.preventDefault();}}else{var S=s.find(function(g){return g.getDomRef()&&g.getVisualizations().length;});S.getVisualizations()[0].getDomRef().parentElement.focus();o.preventDefault();}};e.prototype._getAncestorSection=function(o){if(o.isA("sap.ushell.ui.launchpad.Section")){return o;}else if(o.getParent){return this._getAncestorSection(o.getParent());}return null;};e.prototype.exit=function(){this._oDragDropInfo.destroy();this._oSectionsChangeDetection.destroy();};e.prototype.onBeforeRendering=function(){var n=this.getSections().length,A=this.getAggregation("_addSectionButtons")||[],o;for(var i=A.length;i<n+1;i++){o=new B({type:a.Transparent,icon:"sap-icon://add",text:r.i18n.getText("Page.Button.AddSection"),press:this.fireAddSectionButtonPressed.bind(this,{index:i})});o.addStyleClass("sapUshellPageAddSectionButton");this.addAggregation("_addSectionButtons",o);}};e.prototype.getFocusDomRef=function(){var A=this.getAggregation("_addSectionButtons")||[];if(!this.getSections().length&&A.length&&this.getEdit()){return A[0].getFocusDomRef();}return this.getDomRef();};e.prototype.setEnableSectionReordering=function(v){if(v===undefined||this.getEnableSectionReordering()===v){return this;}else{this.setProperty("enableSectionReordering",!!v,true);if(v){this.addDragDropConfig(this._oDragDropInfo);}else{this.removeDragDropConfig(this._oDragDropInfo);}return this;}};e.prototype.setNoSectionsText=function(t){if(t===undefined||this.getNoSectionsText()===t){return this;}else{this.setProperty("noSectionsText",t,true);var n=this.getAggregation("_noSectionText");n.setText(t||r.i18n.getText("Page.NoSectionText"));return this;}};e.prototype._focusNextVisualization=function(i){var s=this.getSections(),S=this.indexOfSection(i.section),o=i.event.getParameter?i.event.getParameter("event"):i.event,f=o.target.firstElementChild,g,F;while(true){if(i.direction==="up"){S--;}else{S++;}g=s[S];if(!g){return;}F=g.focusVisualization({keycode:o.keyCode,ref:f});if(F){o.preventDefault();return;}}};e.prototype._handleKeyboardPageNavigation=function(o){var s=this.getSections();for(var i=0;i<s.length;i++){var S=s[i].getDomRef();if(S.contains(window.document.activeElement)){this._focusNextVisualization({event:o,section:s[i],direction:o.type==="sappagedown"?"down":"up",prefIndex:0});return;}}};e.prototype._handleKeyboardArrowNavigation=function(m,o){if((m&&!this.getEnableSectionReordering())||(m&&!o.ctrlKey)){return;}var s=this.getSections();for(var i=0;i<s.length;i++){if(window.document.activeElement===s[i].getFocusDomRef()){if(o.type==="sapup"&&i>0){s[i-1].focus();}else if(o.type==="sapdown"&&(i+1)<s.length){s[i+1].focus();}else if(o.type==="sapupmodifiers"&&i>0){if(s[i-1].getDefault()){return;}this.fireSectionDrop({draggedControl:s[i],droppedControl:s[i-1],dropPosition:"Before"});o.preventDefault();o.stopPropagation();s[i-1].focus();}else if(o.type==="sapdownmodifiers"&&(i+1)<s.length){if(s[i].getDefault()){return;}this.fireSectionDrop({draggedControl:s[i],droppedControl:s[i+1],dropPosition:"After"});o.preventDefault();o.stopPropagation();s[i+1].focus();}return;}}};e.prototype._isFocusInInput=function(){var t=(document.activeElement||{}).tagName;return t==="INPUT"||t==="TEXTAREA";};e.prototype._handleKeyboardHomeEndNavigation=function(L,o){var s=this.getSections(),v=[],f=this.getEdit(),S;if(this._isFocusInInput()){return;}for(var i=0;i<s.length;i++){if(o.type==="saphomemodifiers"||o.type==="sapendmodifiers"){S=s[i];if(S.getShowSection()||S.getEditable()){v=v.concat(S.getVisualizations());}}else if(f&&s[i].getDomRef().contains(window.document.activeElement)){v=s[i].getVisualizations();break;}}if(v.length){var V=L?v[v.length-1]:v[0],g=V.getDomRef().parentNode;g.focus();o.preventDefault();o.stopPropagation();}};e.prototype._handleSectionBorderReached=function(i){this._focusNextVisualization(i.getParameters());};e.prototype.addAggregation=function(A,o){C.prototype.addAggregation.apply(this,arguments);if(A==="sections"){o.attachEvent("borderReached",this._handleSectionBorderReached.bind(this));}return this;};e.prototype.insertAggregation=function(A,o){C.prototype.insertAggregation.apply(this,arguments);if(A==="sections"){o.attachEvent("borderReached",this._handleSectionBorderReached.bind(this));}return this;};e.prototype.announceMove=function(){var s=r.i18n.getText("PageRuntime.Message.SectionMoved");this._oInvisibleMessageInstance.announce(s,d.Polite);};return e;});
