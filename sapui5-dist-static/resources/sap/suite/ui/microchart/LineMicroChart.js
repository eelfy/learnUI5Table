/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/m/library","sap/ui/core/Control","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/events/KeyCodes","sap/base/Log","sap/suite/ui/microchart/MicroChartUtils","sap/suite/ui/microchart/LineMicroChartLine","./LineMicroChartRenderer"],function(q,l,M,C,D,R,K,L,a,b){"use strict";var c=C.extend("sap.suite.ui.microchart.LineMicroChart",{metadata:{library:"sap.suite.ui.microchart",properties:{size:{type:"sap.m.Size",group:"Appearance",defaultValue:"Auto"},threshold:{type:"float",group:"Appearance",defaultValue:0},showThresholdLine:{type:"boolean",group:"Appearance",defaultValue:true},showThresholdValue:{type:"boolean",group:"Appearance",defaultValue:false},thresholdDisplayValue:{type:"string",group:"Appearance"},minXValue:{type:"float",group:"Appearance"},maxXValue:{type:"float",group:"Appearance"},minYValue:{type:"float",group:"Appearance"},maxYValue:{type:"float",group:"Appearance"},leftTopLabel:{type:"string",group:"Data",defaultValue:null},rightTopLabel:{type:"string",group:"Data",defaultValue:null},leftBottomLabel:{type:"string",group:"Data",defaultValue:null},rightBottomLabel:{type:"string",group:"Data",defaultValue:null},showTopLabels:{type:"boolean",defaultValue:true},showBottomLabels:{type:"boolean",defaultValue:true},color:{type:"any",group:"Appearance",defaultValue:"Neutral"},showPoints:{type:"boolean",group:"Appearance",defaultValue:false},width:{type:"sap.ui.core.CSSSize",group:"Misc"},height:{type:"sap.ui.core.CSSSize",group:"Misc"},hideOnNoData:{type:"boolean",group:"Appearance",defaultValue:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},defaultAggregation:"points",aggregations:{points:{type:"sap.suite.ui.microchart.LineMicroChartPoint",multiple:true,bindable:"bindable",forwarding:{getter:"_getInternalLine",aggregation:"points"}},lines:{type:"sap.suite.ui.microchart.LineMicroChartLine",multiple:true,bindable:"bindable"},_line:{type:"sap.suite.ui.microchart.LineMicroChartLine",multiple:false,visibility:"hidden"}},events:{press:{}}}});c.THRESHOLD_LOOK_XS=1.125;c.THRESHOLD_LOOK_S=3.5;c.THRESHOLD_LOOK_M=4.5;c.THRESHOLD_LOOK_L=5.875;c.THRESHOLD_WIDTH_NO_LABEL=6;c.prototype.ontap=function(e){if(D.browser.msie){this.$().trigger("focus");}this.firePress();};c.prototype.onkeydown=function(e){if(e.which===K.SPACE){e.preventDefault();}};c.prototype.onkeyup=function(e){if(e.which===K.ENTER||e.which===K.SPACE){this.firePress();e.preventDefault();}};c.prototype.attachEvent=function(e,d,f,o){C.prototype.attachEvent.call(this,e,d,f,o);if(this.hasListeners("press")){this.$().attr("tabindex",0).addClass("sapSuiteUiMicroChartPointer");}return this;};c.prototype.detachEvent=function(e,f,o){C.prototype.detachEvent.call(this,e,f,o);if(!this.hasListeners("press")){this.$().removeAttr("tabindex").removeClass("sapSuiteUiMicroChartPointer");}return this;};c.prototype.onclick=function(){if(D.browser.msie||D.browser.edge){this.$().trigger("focus");}this.firePress();};c.prototype.onsapspace=c.prototype.onclick;c.prototype.onsapenter=c.prototype.onclick;c.prototype._getAccessibilityControlType=function(){return this._oRb.getText("ACC_CTR_TYPE_LINEMICROCHART");};c.prototype.getThreshold=function(){if(this._bThresholdNull){return null;}else{return this.getProperty("threshold");}};c.prototype.init=function(){this._minXScale=null;this._maxXScale=null;this._minYScale=null;this._maxYScale=null;this._fNormalizedThreshold=0;this._bScalingValid=false;this._bThresholdNull=false;this._bNoTopLabels=false;this._bNoBottomLabels=false;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart");this.setAggregation("tooltip","((AltText))",true);this._bThemeApplied=true;if(!sap.ui.getCore().isInitialized()){this._bThemeApplied=false;sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));}else{this._handleCoreInitialized();}};c.prototype._handleCoreInitialized=function(){this._bThemeApplied=sap.ui.getCore().isThemeApplied();if(!this._bThemeApplied){sap.ui.getCore().attachThemeChanged(this._handleThemeApplied,this);}};c.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this.invalidate();sap.ui.getCore().detachThemeChanged(this._handleThemeApplied,this);};c.prototype.onBeforeRendering=function(){if(this._hasData()){this._setModeFlags();this._normalizePoints();}this._unbindMouseEnterLeaveHandler();};c.prototype.onAfterRendering=function(){this._sResizeHandlerId=R.register(this,this._onResize.bind(this));this._onResize();this._bindMouseEnterLeaveHandler();};c.prototype.exit=function(){this._deregisterResizeHandler();};c.prototype.validateProperty=function(p,v){if(p==="threshold"){this._bThresholdNull=v===null;}if(v===null||v===undefined){return C.prototype.validateProperty.apply(this,[p,null]);}if(p==="color"&&!this.isColorCorrect(v)){L.warning("Color property of LineMicroChart must be of type sap.m.ValueCSSColor either as single value or as composite value (above: value, below: value)");v=null;}else if(["minXValue","maxXValue","minYValue","maxYValue"].indexOf(p)>=0){if(!q.isNumeric(v)){L.warning("Property "+p+" of LineMicroChart is not numeric and it will be reset to default");v=null;}}return C.prototype.validateProperty.apply(this,[p,v]);};c.prototype._getInternalLine=function(){var o=this.getAggregation("_line");if(!o){o=new b();this.setAggregation("_line",o);}return o;};c.prototype._getLines=function(){var o=this.getAggregation("_line");return(o&&o._getPoints().length>0)?[o]:this.getLines();};c.prototype._setModeFlags=function(){var p;this._minXScale=Infinity;this._maxXScale=-Infinity;if(this._bThresholdNull){this._minYScale=Infinity;this._maxYScale=-Infinity;}else{this._minYScale=this._maxYScale=this.getThreshold();}this._getLines().forEach(function(o){p=o._getPoints();o._bFocusMode=false;o._bSemanticMode=false;for(var i=0;i<p.length;i++){this._minXScale=Math.min(p[i].getX(),this._minXScale);this._maxXScale=Math.max(p[i].getX(),this._maxXScale);this._minYScale=Math.min(p[i].getY(),this._minYScale);this._maxYScale=Math.max(p[i].getY(),this._maxYScale);if(p[i].getMetadata().getName()==="sap.suite.ui.microchart.LineMicroChartEmphasizedPoint"){o._bFocusMode=true;if(p[i].getColor()!==M.ValueColor.Neutral&&p[i].getShow()){o._bSemanticMode=true;}}}if(!o._bFocusMode){o._bSemanticMode=(o.getColor()&&o.getColor().above&&o.getColor().below&&!this._bThresholdNull);}if(o._bFocusMode&&o._bSemanticMode&&o.getColor()!==M.ValueColor.Neutral){L.info("Property Color of LineMicroChart has no effect if EmphasizedPoints with colors different from Neutral are used.");}if(o._bFocusMode&&o.getShowPoints()){L.info("Property ShowPoints of LineMicroChart has no effect if EmphasizedPoints are used.");}if(o.getColor()&&o.getColor().above&&o.getColor().below&&this._bThresholdNull){L.info("Property Color of LineMicroChart has no effect if it is composed of colors for above and below when property Threshold is null");}},this);var s=this.getLeftTopLabel(),r=this.getRightTopLabel(),d=this.getLeftBottomLabel(),e=this.getRightBottomLabel();this._bNoBottomLabels=(e.length===0&&d.length===0);this._bNoTopLabels=(s.length===0&&r.length===0);};c.prototype._normalizePoints=function(){var m=this._minXScale,d=this._maxXScale,e=this._minYScale,f=this._maxYScale;if(q.isNumeric(this.getMinXValue())){this._minXScale=this.getMinXValue();if(!q.isNumeric(this.getMaxXValue())&&this._minXScale>d){L.error("Property minXValue of LineMicroChart must be smaller to at least one X value of the points aggregation if property maxXValue is not set");}}if(q.isNumeric(this.getMaxXValue())){this._maxXScale=this.getMaxXValue();if(!q.isNumeric(this.getMinXValue())&&this._maxXScale<m){L.error("Property maxXValue of LineMicroChart must be greater to at least one X value of the points aggregation if property minXValue is not set");}}if(q.isNumeric(this.getMinYValue())){this._minYScale=this.getMinYValue();if(!q.isNumeric(this.getMaxYValue())&&this._minYScale>f){L.error("Property minYValue of LineMicroChart must be greater to threshold or at least one Y value of the points aggregation if property maxYValue is not set");}}if(q.isNumeric(this.getMaxYValue())){this._maxYScale=this.getMaxYValue();if(!q.isNumeric(this.getMinYValue())&&this._maxYScale<e){L.error("Property maxYValue of LineMicroChart must be smaller to threshold or at least one Y value of the points aggregation if property minYValue is not set");}}if(this.getMaxYValue()<this.getMinYValue()){L.error("Property maxYValue of LineMicroChart must not be smaller to minYValue");}if(this.getMaxXValue()<this.getMinXValue()){L.error("Property maxXValue of LineMicroChart must not be smaller to minXValue");}var p,x=this._maxXScale-this._minXScale,y=this._maxYScale-this._minYScale,n,N;this._bScalingValid=x>=0&&y>=0;if(this._bScalingValid){this._getLines().forEach(function(o){p=o._getPoints();o._aNormalizedPoints=[];for(var i=0;i<p.length;i++){if(this._minXScale===this._maxXScale&&p[i].getX()===this._maxXScale){n=50;}else{n=(((p[i].getX()-this._minXScale)/x)*100);}if(this._minYScale===this._maxYScale&&p[i].getY()===this._maxYScale){N=50;}else{N=(((p[i].getY()-this._minYScale)/y)*100);}o._aNormalizedPoints.push({x:n,y:N});}},this);this._fNormalizedThreshold=((this.getThreshold()-this._minYScale)/y)*100;}};c.prototype._onResize=function(){var $=this.$(),i=parseInt($.width()),d=parseInt($.height()),t=$.find(".sapSuiteLMCLeftTopLabel, .sapSuiteLMCRightTopLabel"),T=$.find(".sapSuiteLMCThresholdLabel");$.removeClass("sapSuiteLMCNoLabels sapSuiteLMCLookM sapSuiteLMCLookS sapSuiteLMCLookXS");if(i<=this.convertRemToPixels(c.THRESHOLD_WIDTH_NO_LABEL)){$.addClass("sapSuiteLMCNoLabels");}if(this.getShowTopLabels()){$.removeClass("sapSuiteLMCNoTopLabels");}if(this.getShowBottomLabels()){$.removeClass("sapSuiteLMCNoBottomLabels");}if(d<this.convertRemToPixels(c.THRESHOLD_LOOK_S)){$.addClass("sapSuiteLMCLookXS");}else if(d<this.convertRemToPixels(c.THRESHOLD_LOOK_M)){$.addClass("sapSuiteLMCLookS");}else if(d<this.convertRemToPixels(c.THRESHOLD_LOOK_L)){$.addClass("sapSuiteLMCLookM");}if(this.getShowThresholdValue()){$.removeClass("sapSuiteLMCNoThresholdLabel");}if(this._isAnyLabelTruncated(t)){$.addClass("sapSuiteLMCNoTopLabels");}if(this._isAnyLabelTruncated(T)){$.addClass("sapSuiteLMCNoThresholdLabel");}this._adjustThresholdLabelPos();};c.prototype._adjustThresholdLabelPos=function(){var $=this.$();var i=$.find(".sapSuiteLMCThresholdLabelWrapper").height();var d=$.find(".sapSuiteLMCThresholdLabel");var e=d.outerHeight();var t=(i*(100-this._fNormalizedThreshold))*0.01;var f=t-(e/2);if(f<0){f=0;}else if(f+e>i){f=i-e;}d.css("top",f*100/i+"%");};c.prototype._getAltHeaderText=function(i){var t=this._oRb.getText("LINEMICROCHART");if(i){t+=" "+this._oRb.getText("IS_ACTIVE");}t+="\n";if(!this._hasData()){t+=this._oRb.getText("NO_DATA");return t;}var s=this.getLeftTopLabel();var S=this.getLeftBottomLabel();var e=this.getRightTopLabel();var E=this.getRightBottomLabel();var I=true;if(s||S){t+=this._oRb.getText(("LINEMICROCHART_START"))+": "+S+" "+s;I=false;}if(e||E){t+=(I?"":"\n")+this._oRb.getText(("LINEMICROCHART_END"))+": "+E+" "+e;}return t;};c.prototype._addTitleAttribute=function(){if(!this.$().attr("title")&&this._hasData()){this.$().attr("title",this.getTooltip_AsString());}};c.prototype._removeTitleAttribute=function(){if(this.$().attr("title")){this.$().removeAttr("title");}};c.prototype._bindMouseEnterLeaveHandler=function(){this.$().on("mouseenter.tooltip",this._addTitleAttribute.bind(this));this.$().on("mouseleave.tooltip",this._removeTitleAttribute.bind(this));};c.prototype._unbindMouseEnterLeaveHandler=function(){this.$().off("mouseenter.tooltip");this.$().off("mouseleave.tooltip");};c.prototype._deregisterResizeHandler=function(){if(this._sResizeHandlerId){R.deregister(this._sResizeHandlerId);this._sResizeHandlerId=null;}};c.prototype._hasData=function(){return this._getLines().length>0;};c.prototype.firePress=function(){if(this._hasData()){C.prototype.fireEvent.call(this,"press",arguments);}};a.extendMicroChart(c);return c;});
