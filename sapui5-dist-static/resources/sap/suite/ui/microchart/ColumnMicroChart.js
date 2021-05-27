/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","sap/m/Size","sap/ui/Device","sap/ui/core/ResizeHandler","sap/base/Log","sap/ui/events/KeyCodes","sap/suite/ui/microchart/MicroChartUtils","sap/m/library","./ColumnMicroChartRenderer","sap/ui/dom/jquery/Selectors"],function(q,l,C,S,D,R,L,K,M,m){"use strict";var V=m.ValueColor;var a=C.extend("sap.suite.ui.microchart.ColumnMicroChart",{metadata:{library:"sap.suite.ui.microchart",properties:{size:{group:"Misc",type:"sap.m.Size",defaultValue:"Auto"},width:{group:"Misc",type:"sap.ui.core.CSSSize"},height:{group:"Misc",type:"sap.ui.core.CSSSize"},isResponsive:{type:"boolean",group:"Appearance",defaultValue:false},showTopLabels:{type:"boolean",defaultValue:true},showBottomLabels:{type:"boolean",defaultValue:true},allowColumnLabels:{type:"boolean",group:"Appearance",defaultValue:false},hideOnNoData:{type:"boolean",group:"Appearance",defaultValue:false}},events:{press:{}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},defaultAggregation:"columns",aggregations:{columns:{multiple:true,type:"sap.suite.ui.microchart.ColumnMicroChartData",defaultValue:null,bindable:"bindable"},leftTopLabel:{multiple:false,type:"sap.suite.ui.microchart.ColumnMicroChartLabel",defaultValue:null},rightTopLabel:{multiple:false,type:"sap.suite.ui.microchart.ColumnMicroChartLabel",defaultValue:null},leftBottomLabel:{multiple:false,type:"sap.suite.ui.microchart.ColumnMicroChartLabel",defaultValue:null},rightBottomLabel:{multiple:false,type:"sap.suite.ui.microchart.ColumnMicroChartLabel",defaultValue:null}}}});a.THRESHOLD_LOOK_XS=1.125;a.THRESHOLD_LOOK_S=3.5;a.THRESHOLD_LOOK_M=4.5;a.THRESHOLD_LOOK_L=5.875;a.THRESHOLD_WIDTH_NO_LABEL=6;a.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");this.setAggregation("tooltip","((AltText))",true);this._bThemeApplied=true;if(!sap.ui.getCore().isInitialized()){this._bThemeApplied=false;sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));}else{this._handleCoreInitialized();}};a.prototype._handleCoreInitialized=function(){this._bThemeApplied=sap.ui.getCore().isThemeApplied();if(!this._bThemeApplied){sap.ui.getCore().attachThemeChanged(this._handleThemeApplied,this);}};a.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this.invalidate();sap.ui.getCore().detachThemeChanged(this._handleThemeApplied,this);};a.prototype.onBeforeRendering=function(){this.$().off("mouseenter");this.$().off("mouseleave");};a.prototype.onAfterRendering=function(){if(this._sChartResizeHandlerId){R.deregister(this._sChartResizeHandlerId);}l._checkControlIsVisible(this,this._onControlIsVisible);this.$().on("mouseenter",this._addTitleAttribute.bind(this));this.$().on("mouseleave",this._removeTitleAttribute.bind(this));};a.prototype._onControlIsVisible=function(){this._fChartHeight=undefined;this._aBars=[];var c=this.getColumns().length;for(var i=0;i<c;i++){this._aBars.push({});}this._onResize();this._sChartResizeHandlerId=R.register(this,this._onResize.bind(this));};a.prototype.exit=function(){R.deregister(this._sChartResizeHandlerId);};a.prototype._onResize=function(){this._calcColumns();var c=this.$(),i=parseInt(c.width()),b=parseInt(c.height()),t=c.find(".sapSuiteClMCPositionTop").children(),$=c.find(".sapSuiteClMCLabelColumn.sapSuiteClMCLabelColumnTop,.sapSuiteClMCLabelColumn.sapSuiteClMCLabelColumnBottom"),B=c.find(".sapSuiteClMCBars")[0],d=this.getColumns(),e=d.length;c.removeClass("sapSuiteClMCNoLabels sapSuiteClMCNoColumnLabels sapSuiteClMCNoTopLabels sapSuiteClMCLookM sapSuiteClMCLookS sapSuiteClMCLookXS");if(i<=this.convertRemToPixels(a.THRESHOLD_WIDTH_NO_LABEL)){c.addClass("sapSuiteClMCNoLabels");}if(b<this.convertRemToPixels(a.THRESHOLD_LOOK_S)){c.addClass("sapSuiteClMCLookXS");}else if(b<this.convertRemToPixels(a.THRESHOLD_LOOK_M)){if(this.getAllowColumnLabels()){c.addClass("sapSuiteClMCNoColumnLabels");}c.addClass("sapSuiteClMCLookS");}else if(b<this.convertRemToPixels(a.THRESHOLD_LOOK_L)){c.addClass("sapSuiteClMCLookM");}if(this._isAnyLabelTruncated(t)){c.addClass("sapSuiteClMCNoTopLabels");}if(this.getAllowColumnLabels()&&this._isAnyLabelTruncated($)){c.addClass("sapSuiteClMCNoColumnLabels");}if(e>0&&B){c.find(".sapSuiteClMCBar").show();while(B.scrollWidth>B.offsetWidth){d[--e].$().hide();L.warning(this.toString()+" Chart overflow","Column "+e+" was not rendered");}}};a.prototype._calcColumns=function(){var c=this.getColumns();if(c&&c.length===this._aBars.length){var f=parseFloat(this.$().css("height"));if(f!==this._fChartHeight){this._fChartHeight=f;this._calcColumnsHeight(f,this._aBars);}for(var i=0;i<c.length;i++){c[i].$().css(this._aBars[i]);}}};a.prototype._calcColumnsHeight=function(c,b){var d=this.getColumns().length;if(d!==b.length){return;}var f,e,v;f=e=0;for(var i=0;i<d;i++){var o=this.getColumns()[i];if(f<o.getValue()){f=o.getValue();}else if(e>o.getValue()){e=o.getValue();}}if(f===0&&e===0){for(var g=0;g<d;g++){b[g].top="calc(100% - 1px)";b[g].height="1px";}return;}var h=f-e;var O=h/c;var j,t;j=t=0;for(var k=0;k<d;k++){v=this.getColumns()[k].getValue();if(Math.abs(v)<O){if(v>=0){if(v===f){t=O-v;}}else if(v===e){j=O+v;}}}if(t){f+=t;e-=t;}if(j){f-=j;e+=j;}var n=0-O;for(var p=0;p<d;p++){v=this.getColumns()[p].getValue();var r=v;if(v>=0){r=Math.max(r+t-j,O);}else{r=Math.min(r+t-j,n);}b[p].value=r;}function s(v){return(v/h*100).toFixed(2)+"%";}var z=s(f);for(var g=0;g<d;g++){v=b[g].value;b[g].top=(v<0)?z:s(f-v);b[g].height=s(Math.abs(v));}};a.prototype.attachEvent=function(e,d,f,o){C.prototype.attachEvent.call(this,e,d,f,o);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapSuiteUiMicroChartPointer");}return this;};a.prototype.detachEvent=function(e,f,o){C.prototype.detachEvent.call(this,e,f,o);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");}return this;};a.prototype.getLocalizedColorMeaning=function(c){return V[c]?this._oRb.getText(("SEMANTIC_COLOR_"+c).toUpperCase()):"";};a.prototype.setSize=function(s){if(this.getSize()!==s){if(s===S.Responsive){this.setProperty("isResponsive",true);}else{this.setProperty("isResponsive",false);}this.setProperty("size",s,false);}return this;};a.prototype.setIsResponsive=function(i){var s,c=this.getSize();this.setProperty("isResponsive",i);if(i){s=S.Responsive;}else{s=c===S.Responsive?S.Auto:c;}this.setProperty("size",s);return this;};a.prototype._getAltHeaderText=function(i){var A=this._oRb.getText("COLUMNMICROCHART");if(i){A+=" "+this._oRb.getText("IS_ACTIVE");}if(!this._hasData()){A+="\n"+this._oRb.getText("NO_DATA");return A;}var o=this.getLeftTopLabel();var r=this.getRightTopLabel();var b=this.getLeftBottomLabel();var c=this.getRightBottomLabel();var s;if(o&&o.getLabel()||b&&b.getLabel()){if(o){s=o.getColor();}else if(b){s=b.getColor();}else{s="";}A+="\n"+this._oRb.getText(("COLUMNMICROCHART_START"))+": "+(b?b.getLabel()+" ":"")+(o?o.getLabel()+" ":"")+this.getLocalizedColorMeaning(s);}if(r&&r.getLabel()||c&&c.getLabel()){if(r){s=r.getColor();}else if(c){s=c.getColor();}else{s="";}A+="\n"+this._oRb.getText(("COLUMNMICROCHART_END"))+": "+(c?c.getLabel()+" ":"")+(r?r.getLabel()+" ":"")+this.getLocalizedColorMeaning(s);}return A;};a.prototype._getAltSubText=function(I){var A="";var c=this.getColumns();for(var i=0;i<c.length;i++){var b=c[i],s=b.getTooltip_AsString(),d="";if(!s){continue;}d+=(I?"":"\n")+this._getBarAltText(b);d=s.split("((AltText))").join(d);if(d){A+=d;I=false;}}return A;};a.prototype._getAccessibilityControlType=function(){return this._oRb.getText("ACC_CTR_TYPE_COLUMNMICROCHART");};a.prototype.ontap=function(e){if(D.browser.edge){this.onclick(e);}};a.prototype.onclick=function(e){if(!this.fireBarPress(e)){if(D.browser.msie||D.browser.edge){this.$().trigger("focus");}this.firePress();}};a.prototype.onkeydown=function(e){var t,f;switch(e.keyCode){case K.SPACE:e.preventDefault();break;case K.ARROW_LEFT:case K.ARROW_UP:f=this.$().find(":focusable");t=f.index(e.target);if(f.length>1){if(t===-1){f.eq(f.length-2).get(0).focus();}else{f.eq((t-1>=0)?t-1:f.length-1).get(0).focus();}e.preventDefault();e.stopPropagation();}break;case K.ARROW_DOWN:case K.ARROW_RIGHT:f=this.$().find(":focusable");t=f.index(e.target);if(f.length>0){f.eq((t+1<f.length)?t+1:0).get(0).focus();e.preventDefault();e.stopPropagation();}break;default:}};a.prototype.onkeyup=function(e){if(e.which===K.ENTER||e.which===K.SPACE){if(!this.fireBarPress(e)){this.firePress();e.preventDefault();}}};a.prototype.fireBarPress=function(e){var c=e.srcControl;if(c&&c.isA("sap.suite.ui.microchart.ColumnMicroChartData")){if(c.hasListeners("press")){c.firePress();e.preventDefault();e.stopPropagation();if(D.browser.msie){c.$().trigger("focus");}return true;}}return false;};a.prototype._getBarAltText=function(b){var s=this.getLocalizedColorMeaning(b.getColor());return b.getLabel()+" "+b.getValue()+" "+s;};a.prototype.setBarPressable=function(b,p){var $=b.$();if(p){var B=this._getBarAltText(b);$.addClass("sapSuiteUiMicroChartPointer").attr("tabindex",0).attr("title",B).attr("role","presentation").attr("aria-label",B);}else{$.removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer").removeAttr("title").removeAttr("role").removeAttr("aria-label");}};a.prototype.onsaptabnext=function(e){var o=this.$().find(":focusable").last();if(o){this._bIgnoreFocusEvt=true;o.get(0).focus();}};a.prototype.onsaptabprevious=function(e){if(e.target.id!==e.currentTarget.id){var f=this.$().find(":focusable").first();if(f){f.get(0).focus();}}};a.prototype.onfocusin=function(e){if(this._bIgnoreFocusEvt){this._bIgnoreFocusEvt=false;return;}if(this.getId()+"-hidden"===e.target.id){this.$().trigger("focus");e.preventDefault();e.stopPropagation();}};a.prototype._addTitleAttribute=function(){if(!this.$().attr("title")&&this._hasData()){this.$().attr("title",this.getTooltip_AsString());}};a.prototype._removeTitleAttribute=function(){if(this.$().attr("title")){this.$().removeAttr("title");}};a.prototype._hasData=function(){return this.getColumns().length>0;};a.prototype.firePress=function(){if(this._hasData()){C.prototype.fireEvent.call(this,"press",arguments);}};M.extendMicroChart(a);return a;});
