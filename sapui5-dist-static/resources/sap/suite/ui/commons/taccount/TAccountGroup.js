sap.ui.define(["sap/ui/thirdparty/jquery","sap/suite/ui/commons/library","sap/ui/core/Control","sap/ui/core/theming/Parameters","./TAccountPanel","sap/ui/core/IconPool","sap/ui/core/Icon","sap/m/Button","sap/base/security/encodeXML","sap/ui/core/Configuration","sap/ui/core/delegate/ItemNavigation","./TAccountUtils","sap/ui/core/ResizeHandler","sap/ui/thirdparty/bignumber"],function(q,l,C,P,T,I,a,B,e,b,c,d,R,f){"use strict";var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var g=C.extend("sap.suite.ui.commons.taccount.TAccountGroup",{metadata:{library:"sap.suite.ui.commons",properties:{title:{type:"string",group:"Misc",defaultValue:null},collapsed:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{accounts:{type:"sap.suite.ui.commons.taccount.TAccount",multiple:true,singularName:"account"}},events:{}},renderer:function(o,G){if(!G._bThemeApplied){return;}o.write("<div");o.addClass("sapSuiteUiCommonsAccountGroup");if(G.getCollapsed()){o.addClass("sapSuiteUiCommonsAccountGroupCollapsed");}o.writeClasses(G);o.writeControlData(G);o.writeAttributeEscaped("aria-label",G._getSumText());o.write(">");o.write("<div class=\"sapSuiteUiCommonsGroupHeader\">");o.write("<div class=\"sapSuiteUiCommonsGroupHeaderExpandWrapper\">");o.renderControl(G._getExpandCollapse());o.write("</div>");o.write("<div class=\"sapSuiteUiCommonsGroupHeaderFirst\">");o.write("<span class=\"sapSuiteUiCommonsGroupHeaderTitle\">"+e(G.getTitle())+"</span>");o.write("<span id=\""+G.getId()+"-sum\" class=\"sapSuiteUiCommonsGrouptHeaderSUM\">"+G._getSumText()+"</span>");o.write("<div id=\"\" class=\"sapSuiteUiCommonsGroupInfoIconWrapper sapSuiteUiCommonsTAccountBaseInfoIconWrapper\" title=\""+r.getText("TACCOUNT_SELECTED")+"\">");o.write("<span class=\"sapSuiteUiCommonsInfoIcon\">");o.write("!");o.write("</span>");o.write("</div>");o.write("</div>");o.write("<div class=\"sapSuiteUiCommonsGroupHeaderSecond\">");o.renderControl(G._getExpandAllAccounts());o.renderControl(G._getCollapseAllAccounts());o.write("</div>");o.write("</div>");o.write("<div id=\""+G.getId()+"-content\" class=\"sapSuiteUiCommonsAccountGroupContent\">");G.getAccounts().forEach(function(i){o.renderControl(i);});o.write("</div>");o.write("</div>");}});g.prototype.init=function(){sap.ui.getCore().attachThemeChanged(function(){this._bThemeApplied=true;this.invalidate();},this);this._bThemeApplied=sap.ui.getCore().isThemeApplied();if(!this._sResizeHandlerId){this._sResizeHandlerId=R.register(this,this._adjustUI.bind(this));}};g.prototype.exit=function(){if(this._oIconExpand){this._oIconExpand.destroy();}if(this._oIconCollapse){this._oIconCollapse.destroy();}if(this._sResizeHandlerId){R.deregister(this._sResizeHandlerId);this._sResizeHandlerId="";}};g.prototype.onBeforeRendering=function(){this._bRendered=false;this._oSum=null;this._iColumnCount=-1;};g.prototype.onAfterRendering=function(){this._adjustUI();this._bRendered=true;var p=this.getParent();if(p&&this._hasPanelParent(p)&&p._bRendered){p._recalculate();}if(this.getCollapsed()){this.$("content").hide();}};g.prototype.reset=function(){this._oSum=null;};g.prototype.updateBindingContext=function(){this.reset();return C.prototype.updateBindingContext.apply(this,arguments);};g.prototype._hasPanelParent=function(p){return(p||this.getParent())instanceof T;};g.prototype._getExpandCollapse=function(){var h=this.getCollapsed(),t=this._getExpandAltText(!h);if(!this._oArrowDown){this._oArrowDown=new a({src:h?"sap-icon://navigation-right-arrow":"sap-icon://navigation-down-arrow",alt:t,tooltip:t,press:function(){this._expandCollapse();}.bind(this)});}return this._oArrowDown;};g.prototype._getExpandAltText=function(h){return(h?r.getText("TACCOUNT_COLLAPSE"):r.getText("TACCOUNT_EXPAND"))+" "+r.getText("TACCOUNT_GROUP_TITLE");};g.prototype._expandCollapse=function(){var h=this.getCollapsed(),t=this._getExpandAltText(h);this._getExpandCollapse().$().attr("aria-label",t);this._getExpandCollapse().setTooltip(t);this._getExpandCollapse().setSrc(h?"sap-icon://navigation-down-arrow":"sap-icon://navigation-right-arrow");this.setProperty("collapsed",!h,true);this._bIsExpanding=true;this.$("content")[h?"show":"hide"]("medium",function(){this._bIsExpanding=false;}.bind(this));this.$()[!h?"addClass":"removeClass"]("sapSuiteUiCommonsAccountGroupCollapsed");};g.prototype._expandCollapseAllAccounts=function(E){this.getAccounts().forEach(function(A){A.setCollapsed(!!E);});};g.prototype._getExpandAllAccounts=function(){if(!this._oIconExpand){this._oIconExpand=new B({icon:"sap-icon://expand-all",type:"Transparent",tooltip:r.getText("TACCOUNT_EXPAND"),press:this._expandCollapseAllAccounts.bind(this,false)}).addStyleClass("sapSuiteUiCommonsGroupHeaderIcon");}return this._oIconExpand;};g.prototype._getCollapseAllAccounts=function(){if(!this._oIconCollapse){this._oIconCollapse=new B({icon:"sap-icon://collapse-all",type:"Transparent",tooltip:r.getText("TACCOUNT_COLLAPSE"),press:this._expandCollapseAllAccounts.bind(this,true)}).addStyleClass("sapSuiteUiCommonsGroupHeaderIcon");}return this._oIconCollapse;};g.prototype._getSum=function(F){var A=this.getAccounts(),s=new f("0"),m="",h=true;if(!this._oSum||F){for(var i=0;i<A.length;i++){var o=A[i];if(m&&m!==o.getMeasureOfUnit()){h=false;break;}m=o.getMeasureOfUnit();s=s.plus(o._getSum());}this._oSum={sum:s,measure:m,correct:h};}return this._oSum;};g.prototype._getSumText=function(){var s=this._getSum();if(s&&s.correct){var v=d.formatCurrency(s.sum,s.measure);return(s.sum>0?r.getText("TACCOUNT_CREDIT"):r.getText("TACCOUNT_DEBIT"))+": "+v+" "+e(s.measure);}return"-";};g.prototype._getAriaText=function(){return"T Account Group "+e(this.getTitle())+" "+this._getSumText();};g.prototype._adjustUI=function(){var h=320,S=16,j=h+S;var $=this.$("content"),w=$.width(),m=Math.max(Math.ceil(w/(j))-1,1);if(m===this._iColumnCount){return;}if(this._bIsExpanding||(this._bRendered&&this.getCollapsed())){return;}var n=q("<div id=\""+this.getId()+"-content\" class=\"sapSuiteUiCommonsAccountGroupContent\"></div>"),H=Array.apply(null,Array(m)).map(Number.prototype.valueOf,0);var o=this.$().find(".sapSuiteUiCommonsAccount"),p=0;this._iColumnCount=m;this._iDivs=[];var D="<div class=\"sapSuiteUiCommonsAccountGroupDroppingArea\"><div class=\"sapSuiteUiCommonsAccountGroupDroppingAreaInner\">"+"</div><div class=\"sapSuiteUiCommonsAccountGroupDroppingAreaInnerBall\"></div><div class=\"sapSuiteUiCommonsAccountGroupDroppingAreaInnerText\">"+r.getText("TACCOUNT_DROP_HERE")+"</div></div>";for(var i=0;i<m;i++){var s="<div class=\"sapSuiteUiCommonsAccountGroupColumn\">"+D+"</div>",t=q(s);n.append(t);this._iDivs.push(t);}for(var i=0;i<o.length;i++){var u=q(o[i]),v=u.height(),x=this._iDivs[p];var M=Number.MAX_VALUE,y=0;for(var k=0;k<m;k++){var z=H[k];if(z<M){M=z;y=k;}}var x=this._iDivs[y];u.detach().appendTo(x);q(D).appendTo(x);H[y]+=v;}$.detach();this.$().append(n);this._setupDroppable();};g.prototype._setupDroppable=function(){var G=function(o){var $=q(o);return $.hasClass("sapSuiteUiCommonsTAccountDropZoneTop")?$.parent().prev():$.parent().next();};var D=function($,u){var j=u.draggable,k=j.next();if(k[0]!==$[0]){k.detach().insertAfter($);j.detach().insertAfter($);}else{j.detach().insertBefore($);}$.removeClass("sapSuiteUiCommonsAccountGroupDroppingAreaActiveSide");j.css("left",0);j.css("top",0);};var i=this.$().find(".sapSuiteUiCommonsAccountGroupDroppingArea");i.droppable({scope:this.getId()+"-content",tolerance:"pointer",activeClass:"sapSuiteUiCommonsAccountGroupDroppingAreaActive",hoverClass:"sapSuiteUiCommonsAccountGroupDroppingAreaActive",drop:function(E,u){var $=q(this);D($,u);}});var h=this.$().find(".sapSuiteUiCommonsTAccountDropZoneBottom, .sapSuiteUiCommonsTAccountDropZoneTop");h.droppable({scope:this.getId()+"-content",tolerance:"pointer",drop:function(j,u){var $=q(this);$=$.hasClass("sapSuiteUiCommonsTAccountDropZoneTop")?$.parent().prev():$.parent().next();D($,u);},over:function(j,u){G(this).addClass("sapSuiteUiCommonsAccountGroupDroppingAreaActiveSide");},out:function(j,u){G(this).removeClass("sapSuiteUiCommonsAccountGroupDroppingAreaActiveSide");}});};g.prototype._valueChanged=function(D,i){if(this._oSum){if(i){this._oSum.sum=this._oSum.sum.minus(D);}else{this._oSum.sum=this._oSum.sum.plus(D);}this.$("sum").text(this._getSumText());var p=this.getParent();if(this._hasPanelParent(p)){p._valueChanged(D,i);}}};g.prototype._measureChanged=function(m){if(this._oSum){if(this._oSum.measure===m&&!this._oSum.correct){this._recalculate();return;}if(this._oSum.measure!==m&&this._oSum.correct){var p=this.getParent();this._oSum.correct=false;if(this._hasPanelParent(p)){p._setInvalid();}}this.$("sum").text(this._getSumText());}};g.prototype._recalculate=function(){this._oSum=this._getSum(true);this.$("sum").text(this._getSumText());var p=this.getParent();if(this._hasPanelParent(p)){p._recalculate();}};g.prototype._hasPanelParent=function(p){return(p||this.getParent())instanceof T;};g.prototype.invalidate=function(){this._bRendered=false;C.prototype.invalidate.apply(this,arguments);};return g;});
