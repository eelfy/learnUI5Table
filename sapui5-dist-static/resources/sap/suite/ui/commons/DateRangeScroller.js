/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['./library','sap/ui/commons/library','./util/DateUtils','sap/ui/commons/Label','sap/ui/core/Control','sap/ui/core/format/DateFormat',"sap/base/Log","./DateRangeScrollerRenderer"],function(l,C,D,L,a,b,c,d){"use strict";var e=a.extend("sap.suite.ui.commons.DateRangeScroller",{metadata:{deprecated:true,library:"sap.suite.ui.commons",associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{dateRange:{type:"any"}}}}}});var f="d";var W="w";var M="m";var Y="y";var g="c";var w=7;e.getFormattedDate=function(r,o,h){var i;var F;switch(r){case(f):i=h||b.getDateInstance({pattern:"MMMM d, YYYY"});F=i.format(o.startDate,false);break;case(W):case(g):var s=h||b.getDateInstance({pattern:'MMMM d'});var E=h||b.getDateInstance({pattern:'MMMM d, YYYY'});if(o.startDate.getYear()!==o.endDate.getYear()){s=E;}else if(o.startDate.getMonth()===o.endDate.getMonth()){E=h||b.getDateInstance({pattern:'d, YYYY'});}var S=s.format(o.startDate,false);var j=E.format(o.endDate,false);F=S+" - "+j;break;case(M):i=h||b.getDateInstance({pattern:'MMMM YYYY'});F=i.format(o.startDate,false);break;case(Y):i=h||b.getDateInstance({pattern:'YYYY'});F=i.format(o.startDate,false);break;default:F=o.startDate+" - "+o.endDate;break;}return F;};e.updateDateRangeValue=function(r,o,R,h){R.setText(e.getFormattedDate(r,o,h));if(R.isActive()){R.rerender();}};e.adjustDateByStep=function(h,s){if(s===0){return;}h.setDate(h.getDate()+s);};e.adjustRangeByStep=function(r,s){var S=r.startDate;var E=r.endDate;S.setDate(S.getDate()+s);E.setDate(E.getDate()+s);};e.isValidDuration=function(i,u){var v=false;if(i===undefined){v=true;}else if(!isNaN(i)&&isFinite(i)){if((i>=1)&&(!u||i<=u)){v=true;}}if(!v){c.error("DateRangeScroller duration value ='"+i+"' is invalid.");}return v;};e.prototype.init=function(){this._sRangeType=f;this._iCustomDuration=1;this._oDateFormat=null;this._oDateRangeLabel=new L(this.getId()+"-dateRangeLabel",{labelFor:this.getId()});this._oDateRangeLabel.addStyleClass("sapSuiteUiCommonsDateRangeScrollerLabel");var s=new Date();D.resetDateToStartOfDay(s);var E=new Date();D.resetDateToEndOfDay(E);this._oDateRange={startDate:s,endDate:E};e.updateDateRangeValue(f,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);};e.prototype.setDateRangeDay=function(i){if(D.isValidDate(i)){this._oDateRange.startDate.setTime(i.getTime());this._oDateRange.endDate.setTime(i.getTime());D.resetDateToStartOfDay(this._oDateRange.startDate);D.resetDateToEndOfDay(this._oDateRange.endDate);e.updateDateRangeValue(f,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);this._sRangeType=f;}return this;};e.prototype.setDateRangeWeek=function(i,s){var h=w;var F=1;if(s){h=s.duration;F=s.firstDayOfWeek;}if(h===undefined){h=w;}else if(h&&!isNaN(h)){h=parseInt(h,10);}if(F===undefined){F=1;}else if(F&&!isNaN(F)){F=parseInt(F,10);}if((F===null)||F===""||isNaN(F)||F<0||F>6){c.error("DateRangeScroller oSettings.firstDayOfWeek value ='"+s.firstDayOfWeek+"' is invalid.");}else if(D.isValidDate(i)&&e.isValidDuration(h,w)){this._oDateRange.startDate.setTime(i.getTime());this._oDateRange.endDate.setTime(i.getTime());var j=h;var k=F;D.resetDateToStartOfWeek(this._oDateRange.startDate,F);D.resetDateToEndOfWeek(this._oDateRange.endDate,{iDuration:j,iFirstDayOfWeek:k});e.updateDateRangeValue(W,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);this._sRangeType=W;}return this;};e.prototype.setDateRangeMonth=function(i){if(D.isValidDate(i)){this._oDateRange.startDate.setTime(i.getTime());this._oDateRange.endDate.setTime(i.getTime());D.resetDateToStartOfMonth(this._oDateRange.startDate);D.resetDateToEndOfMonth(this._oDateRange.endDate);e.updateDateRangeValue(M,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);this._sRangeType=M;}return this;};e.prototype.setDateRangeYear=function(i){if(D.isValidDate(i)){this._oDateRange.startDate.setTime(i.getTime());this._oDateRange.endDate.setTime(i.getTime());D.resetDateToStartOfYear(this._oDateRange.startDate);D.resetDateToEndOfYear(this._oDateRange.endDate);e.updateDateRangeValue(Y,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);this._sRangeType=Y;}return this;};e.prototype.setDateRangeCustom=function(i,h){if(h===undefined){h=this._iCustomDuration;}else if(h&&!isNaN(h)){h=parseInt(h,10);}if(D.isValidDate(i)&&e.isValidDuration(h)){this._oDateRange.startDate.setTime(i.getTime());this._oDateRange.endDate.setTime(i.getTime());D.resetDateToStartOfDay(this._oDateRange.startDate);e.adjustDateByStep(this._oDateRange.endDate,h-1);D.resetDateToEndOfDay(this._oDateRange.endDate);e.updateDateRangeValue(g,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);this._sRangeType=g;this._iCustomDuration=h;}return this;};e.prototype.incrementDateRange=function(){switch(this._sRangeType){case(f):e.adjustRangeByStep(this._oDateRange,1);e.updateDateRangeValue(f,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(W):e.adjustRangeByStep(this._oDateRange,w);e.updateDateRangeValue(W,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(g):e.adjustRangeByStep(this._oDateRange,this._iCustomDuration);e.updateDateRangeValue(g,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(M):var s=this._oDateRange.startDate.getMonth()+1;this._oDateRange.startDate.setMonth(s);this._oDateRange.endDate.setTime(this._oDateRange.startDate.getTime());D.resetDateToEndOfMonth(this._oDateRange.endDate);e.updateDateRangeValue(M,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(Y):s=this._oDateRange.startDate.getFullYear()+1;this._oDateRange.startDate.setFullYear(s);this._oDateRange.endDate.setTime(this._oDateRange.startDate.getTime());D.resetDateToEndOfYear(this._oDateRange.endDate);e.updateDateRangeValue(Y,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;default:return this;}var o=this.getDateRange();this.fireChange({dateRange:o});return this;};e.prototype.decrementDateRange=function(){switch(this._sRangeType){case(f):e.adjustRangeByStep(this._oDateRange,-1);e.updateDateRangeValue(f,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(W):e.adjustRangeByStep(this._oDateRange,-w);e.updateDateRangeValue(W,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(g):e.adjustRangeByStep(this._oDateRange,-this._iCustomDuration);e.updateDateRangeValue(g,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(M):var s=this._oDateRange.startDate.getMonth()-1;this._oDateRange.startDate.setMonth(s);this._oDateRange.endDate.setTime(this._oDateRange.startDate.getTime());D.resetDateToEndOfMonth(this._oDateRange.endDate);e.updateDateRangeValue(M,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;case(Y):s=this._oDateRange.startDate.getFullYear()-1;this._oDateRange.startDate.setFullYear(s);this._oDateRange.endDate.setTime(this._oDateRange.startDate.getTime());D.resetDateToEndOfYear(this._oDateRange.endDate);e.updateDateRangeValue(Y,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);break;default:return this;}var o=this.getDateRange();this.fireChange({dateRange:o});return this;};e.prototype.getDateRange=function(){var o={startDate:new Date(this._oDateRange.startDate.getTime()),endDate:new Date(this._oDateRange.endDate.getTime())};return o;};e.prototype.setDateFormat=function(o){if(o&&o instanceof b){this._oDateFormat=o;}else{this._oDateFormat=null;}e.updateDateRangeValue(this._sRangeType,this._oDateRange,this._oDateRangeLabel,this._oDateFormat);};e.prototype.onclick=function(E){switch(E.target){case this.$('decrementScrollButton')[0]:this.decrementDateRange();break;case this.$('incrementScrollButton')[0]:this.incrementDateRange();break;default:break;}this.$("labelarea").focus();};e.prototype.onsapright=function(E){this.incrementDateRange();E.preventDefault();E.stopPropagation();};e.prototype.onsapleft=function(E){this.decrementDateRange();E.preventDefault();E.stopPropagation();};e.prototype.onsapup=function(E){this.incrementDateRange();E.preventDefault();E.stopPropagation();};e.prototype.onsapdown=function(E){this.decrementDateRange();E.preventDefault();E.stopPropagation();};return e;});
