/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./calendar/CalendarUtils','./Calendar','./calendar/DatesRow','./calendar/MonthPicker','./calendar/YearPicker','./calendar/YearRangePicker','./calendar/CalendarDate','./library','sap/ui/Device',"./CalendarDateIntervalRenderer","sap/base/util/deepEqual","sap/m/Popover","sap/ui/core/Core","sap/base/Log","sap/ui/thirdparty/jquery","./DateRange"],function(C,a,D,M,Y,b,c,l,d,e,f,P,g,L,q,h){"use strict";var j=sap.ui.core.CalendarType;var k=a.extend("sap.ui.unified.CalendarDateInterval",{metadata:{library:"sap.ui.unified",properties:{startDate:{type:"object",group:"Data"},days:{type:"int",group:"Appearance",defaultValue:7},showDayNamesLine:{type:"boolean",group:"Appearance",defaultValue:true},pickerPopup:{type:"boolean",group:"Appearance",defaultValue:false}},designtime:"sap/ui/unified/designtime/CalendarDateInterval.designtime"}});k.prototype.init=function(){a.prototype.init.apply(this,arguments);this._iDaysMonthHead=35;};k.prototype.onBeforeRendering=function(){a.prototype.onBeforeRendering.apply(this,arguments);this._bPoupupMode=this.getPickerPopup();if(this._getSucessorsPickerPopup()){this.setProperty("_currentPicker","month");}};k.prototype._selectYearRange=function(){a.prototype._selectYearRange.apply(this,arguments);this.getAggregation("month")[0].setStartDate(this._getFocusedDate().toLocalJSDate());};k.prototype.exit=function(){a.prototype.exit.apply(this,arguments);if(this._oPopup){this._oPopup.destroy();this._oPopup=null;}if(this._oCalendar){this._oCalendar.removeDelegate(this._oFocusCalendarDelegate);this._oCalendar.destroy();this._oCalendar=null;}};k.prototype._initializeMonthPicker=function(){var o=this._createMonthPicker();o._bCalendar=true;this.setAggregation("monthPicker",o);o._setSelectedDatesControlOrigin(this);};k.prototype._initializeYearPicker=function(){var y=this._createYearPicker();y._bCalendar=true;this.setAggregation("yearPicker",y);y._setSelectedDatesControlOrigin(this);};k.prototype._initializeYearRangePicker=function(){this.setAggregation("yearRangePicker",this._createYearRangePicker());};k.prototype.setPickerPopup=function(p){this.setProperty("pickerPopup",p);var H=this.getAggregation("header"),o,y;if(p){if(this._getMonthPicker()){this._getMonthPicker().destroy();}if(this._getYearPicker()){this._getYearPicker().destroy();}H.setVisibleButton2(false);H.detachEvent("pressButton2",this._handleButton2,this);this._setHeaderText(this._getFocusedDate(true));}else{if(!this._getMonthPicker()){this.setAggregation("monthPicker",this._createMonthPicker());}if(!this._getYearPicker()){this.setAggregation("yearPicker",this._createYearPicker());}o=this._getMonthPicker();y=this._getYearPicker();o.setColumns(0);o.setMonths(6);y.setColumns(0);y.setYears(6);y._oMinDate.setYear(this._oMinDate.getYear());y._oMaxDate.setYear(this._oMaxDate.getYear());H.setVisibleButton2(true);H.detachEvent("pressButton2",this._handleButton2,this);H.attachEvent("pressButton2",this._handleButton2,this);}return this;};k.prototype._createMonthPicker=function(){var o=new M(this.getId()+"--MP");o.attachEvent("select",this._selectMonth,this);o._bNoThemeChange=true;o.setColumns(0);o.setMonths(3);o.attachEvent("pageChange",_,this);return o;};k.prototype._createYearPicker=function(){var y=new Y(this.getId()+"--YP");y.attachEvent("select",this._selectYear,this);y.setColumns(0);y.setYears(3);y.attachEvent("pageChange",m,this);return y;};k.prototype._createYearRangePicker=function(){var y=new b(this.getId()+"--YRP");y.attachEvent("select",this._selectYearRange,this);y.setPrimaryCalendarType(this.getPrimaryCalendarType());y.setYears(6);y.setRangeSize(this._getYearPicker().getYears());return y;};k.prototype._adjustYearRangeDisplay=function(){var y=this.getAggregation("yearRangePicker");if(!this._getSucessorsPickerPopup()){switch(this.getPrimaryCalendarType()){case j.Gregorian:y.setColumns(3);y.setYears(3);break;default:y.setColumns(2);y.setYears(2);}}else{a.prototype._adjustYearRangeDisplay.call(this,arguments);}};k.prototype._getCalendar=function(){var o;if(!this._oCalendar){o=new a(this.getId()+"--Cal");o.setPopupMode(true);o.attachEvent("select",this._handleCalendarPickerDateSelect,this);o.attachEvent("cancel",function(E){this._closeCalendarPicker();var i=this.getAggregation("header").getDomRef("B1");if(i){i.focus();}},this);this._oFocusCalendarDelegate={onAfterRendering:function(){this.focus();}};o.addDelegate(this._oFocusCalendarDelegate,o);this._oCalendar=o;}return this._oCalendar;};k.prototype._setAriaRole=function(r){var o=this.getAggregation("month")[0];o._setAriaRole(r);o.invalidate();return this;};k.prototype._handleButton1=function(E){if(this.getPickerPopup()){this._showCalendarPicker();this._showOverlay();}else{this._showMonthPicker();}};k.prototype._showOverlay=function(){this.$("contentOver").css("display","");};k.prototype._hideOverlay=function(){this.$("contentOver").css("display","none");};k.prototype._setHeaderText=function(o){var t=a.prototype._setHeaderText.apply(this,arguments);var T,A=t.sAriaLabel,H=this.getAggregation("header");var i=this._getLocaleData();var E=c.fromLocalJSDate(new Date(o.toLocalJSDate().getTime()+(this._getDays()-1)*24*60*60*1000),this.getPrimaryCalendarType());E.setDate(1);var s=i.getIntervalPattern().replace("{0}","").replace("{1}","");var n=this._oYearFormat.format(E.toUTCJSDate(),true);var p=t.sMonth;if(this.getPickerPopup()){if(i.oLocale.sLanguage.toLowerCase()==="ja"||i.oLocale.sLanguage.toLowerCase()==="zh"){if(n!=t.sYear){p=p.replace(s,s+n+" ");A=A.replace(s,s+n+" ");}T=t.sYear+" "+p;A=t.sYear+" "+A;}else{if(n!=t.sYear){p=p.replace(s," "+t.sYear+s);A=A.replace(s," "+t.sYear+s);}T=p+" "+n;A=A+" "+n;}H.setTextButton1(T,true);H.setAriaLabelButton1(A);}};k.prototype._showCalendarPicker=function(){var s=this.getStartDate(),o=this._getCalendar(),S=new h(),E=new Date(s.getTime());E.setDate(E.getDate()+this._getDays()-1);S.setStartDate(s);S.setEndDate(E);o.displayDate(this._getFocusedDate().toLocalJSDate());o.removeAllSelectedDates();o.addSelectedDate(S);o.setMinDate(this.getMinDate());o.setMaxDate(this.getMaxDate());this._openPickerPopup(o);};k.prototype._handleCalendarPickerDateSelect=function(E){var o=this._getCalendar(),s=o.getSelectedDates()[0].getStartDate(),n=c.fromLocalJSDate(s);this._setStartDate(n);this._setFocusedDate(n);this._closeCalendarPicker();};k.prototype._closeCalendarPicker=function(s){if(this._oPopup&&this._oPopup.isOpen()){this._oPopup.close();}if(!s){this._renderMonth();var n=this.getAggregation("month");for(var i=0;i<n.length;i++){var o=n[i];o._oItemNavigation.getItemDomRefs()[o._oItemNavigation.getFocusedIndex()].setAttribute("tabindex","0");}}this._getCalendar()._closePickers();};k.prototype._getDaysLarge=function(){return 10;};k.prototype._createMonth=function(i){var o=new D(i);o._bCalendar=true;return o;};k.prototype.setStartDate=function(s){C._checkJSDateObject(s);if(f(this.getStartDate(),s)){return this;}var y=s.getFullYear();C._checkYearInValidRange(y);var o=c.fromLocalJSDate(s,this.getPrimaryCalendarType());if(C._isOutside(o,this._oMinDate,this._oMaxDate)){throw new Error("Date must be in valid range (minDate and maxDate); "+this);}var i=this.getMinDate();if(i&&s.getTime()<i.getTime()){L.warning("startDate < minDate -> minDate as startDate set",this);s=new Date(i.getTime());}var n=this.getMaxDate();if(n&&s.getTime()>n.getTime()){L.warning("startDate > maxDate -> maxDate as startDate set",this);s=new Date(n.getTime());}this.setProperty("startDate",s,true);o=c.fromLocalJSDate(s,this.getPrimaryCalendarType());this._oStartDate=o;var p=this.getAggregation("month")[0];p.setStartDate(s);this._updateHeader(o);var r=this._getFocusedDate(true).toLocalJSDate();if(!p.checkDateFocusable(r)){this._setFocusedDate(o);p.displayDate(s);}return this;};k.prototype.getStartDate=function(){return this.getProperty("startDate");};k.prototype.setDays=function(i){var y=this.getAggregation("yearRangePicker");this.setProperty("days",i,true);i=this._getDays();var o=this.getAggregation("month")[0];o.setDays(i);if(!this.getPickerPopup()){var n=this._getMonthPicker();var p=Math.ceil(i/3);if(p>12){p=12;}n.setMonths(p);var r=this._getYearPicker();var s=Math.floor(i/2);if(s>20){s=20;}r.setYears(s);y.setRangeSize(s);}var S=this._getStartDate();this._updateHeader(S);if(this.getDomRef()){if(i>this._getDaysLarge()){this.$().addClass("sapUiCalIntLarge");}else{this.$().removeClass("sapUiCalIntLarge");}if(i>this._iDaysMonthHead){this.$().addClass("sapUiCalIntHead");}else{this.$().removeClass("sapUiCalIntHead");}}return this;};k.prototype._getDays=function(){var i=this.getDays();if(d.system.phone&&i>8){return 8;}else{return i;}};k.prototype.setShowDayNamesLine=function(s){this.setProperty("showDayNamesLine",s,true);var o=this.getAggregation("month")[0];o.setShowDayNamesLine(s);return this;};k.prototype._getShowMonthHeader=function(){var i=this._getDays();if(i>this._iDaysMonthHead){return true;}else{return false;}};k.prototype._getFocusedDate=function(F){if(!this._oFocusedDate||F){this._oFocusedDate=null;a.prototype._getFocusedDate.apply(this,arguments);var s=this.getStartDate();var o=this.getAggregation("month")[0];if(!s){this._setStartDate(this._oFocusedDate,false,true);}else if(!o.checkDateFocusable(this._oFocusedDate.toLocalJSDate())){this._oFocusedDate=c.fromLocalJSDate(s,this.getPrimaryCalendarType());}}return this._oFocusedDate;};k.prototype.setMonths=function(i){if(i==1){return this.setProperty("months",i,false);}else{throw new Error("Property months not supported "+this);}};k.prototype.setFirstDayOfWeek=function(F){if(F==-1){return this.setProperty("firstDayOfWeek",F,false);}else{throw new Error("Property firstDayOfWeek not supported "+this);}};k.prototype.focusDate=function(o){var i=this.getAggregation("month")[0];if(!i.checkDateFocusable(o)){this._focusDateExtend(c.fromLocalJSDate(o,this.getPrimaryCalendarType()),true,true);}a.prototype.focusDate.apply(this,arguments);return this;};k.prototype._focusOnShiftTab=function(){var H=this.getAggregation("header");if(this.getPickerPopup()&&H.getDomRef("B1")){H.getDomRef("B1").focus();}else if(!this.getPickerPopup()&&H.getDomRef("B2")){H.getDomRef("B2").focus();}};k.prototype.onsapescape=function(E){if(this.getPickerPopup()){this._closeCalendarPicker();this.fireCancel();}else{if(this._iMode===0){this.fireCancel();}this._closePickers();}this._updateHeadersButtons();this._setHeaderText(this._getFocusedDate());};k.prototype._focusDateExtend=function(o,O,n){if(O){var i=this._getFocusedDate(),p=this._getStartDate(),r=C._daysBetween(i,p),N=new c(o,this.getPrimaryCalendarType());N.setDate(N.getDate()-r);this._setStartDate(N,false,true);if(!n){return true;}}return false;};k.prototype._setMinMaxDateExtend=function(o){if(this._oStartDate){if(this._oStartDate.isBefore(this._oMinDate)){L.warning("start date < minDate -> minDate will be start date",this);this._setStartDate(new c(this._oMinDate,this.getPrimaryCalendarType()),true,true);}else{var E=new c(this._oStartDate);E.setDate(E.getDate()+this._getDays()-1);if(E.isAfter(this._oMaxDate)){L.warning("end date > maxDate -> start date will be changed",this);var s=new c(this._oMaxDate);s.setDate(s.getDate()-this._getDays()+1);this._setStartDate(s,true,true);}}}};k.prototype._updateHeader=function(o){this._setHeaderText(o);switch(this._iMode){case 0:this._togglePrevNext(o,true);break;case 1:this._togglePrevNext(o);break;case 2:case 3:this._togglePrevNexYearPicker();break;}};k.prototype._togglePrevNext=function(o,i){if(this._iMode>1||(this._iMode==1&&this.getPickerPopup())){return a.prototype._togglePrevNext.apply(this,arguments);}var y=this._oMaxDate.getYear();var n=this._oMinDate.getYear();var p=this._oMaxDate.getMonth();var r=this._oMinDate.getMonth();var s=this._oMinDate.getDate();var t=this._oMaxDate.getDate();var H=this.getAggregation("header");var u=this._getDays();var v;var S;var E;var w;var x;if(this._iMode==1&&!i){var z=this._getMonthPicker();var A=z.getMonths();var B=z.getProperty("_firstMonth");var F=B+A-1;v=o.getYear();if(B==0||(v==n&&B<=r)){H.setEnabledPrevious(false);}else{H.setEnabledPrevious(true);}if(F>10||(v==y&&F>=p)){H.setEnabledNext(false);}else{H.setEnabledNext(true);}return;}S=this._getStartDate();E=new c(S,this.getPrimaryCalendarType());E.setDate(E.getDate()+u-1);if(C._isOutside(o,S,E)){S=new c(o,this.getPrimaryCalendarType());E=new c(S,this.getPrimaryCalendarType());E.setDate(E.getDate()+u-1);}v=S.getYear();w=S.getMonth();x=S.getDate();if(v<n||(v==n&&(!i||w<r||(w==r&&x<=s)))){H.setEnabledPrevious(false);}else{H.setEnabledPrevious(true);}v=E.getYear();w=E.getMonth();x=E.getDate();if(v>y||(v==y&&(!i||w>p||(w==p&&x>=t)))){H.setEnabledNext(false);}else{H.setEnabledNext(true);}};k.prototype._shiftStartFocusDates=function(s,F,i){s.setDate(s.getDate()+i);F.setDate(F.getDate()+i);this._setFocusedDate(F);this._setStartDate(s,true);};k.prototype._handlePrevious=function(E){var F=new c(this._getFocusedDate(),this.getPrimaryCalendarType()),o,s,i;switch(this._iMode){case 0:s=new c(this._getStartDate(),this.getPrimaryCalendarType());i=this._getDays();this._shiftStartFocusDates(s,F,(i*-1));break;case 1:if(!this.getPickerPopup()){o=this._getMonthPicker();if(o.getMonths()<12){o.previousPage();this._togglePrevNext(F);}else{F.setYear(F.getYear()-1);var n=this._focusDateExtend(F,true,false);this._setFocusedDate(F);this._updateHeader(F);this._setDisabledMonths(F.getYear());if(n){this.fireStartDateChange();}}}break;case 2:if(!this.getPickerPopup()){this._getYearPicker().previousPage();m.call(this);}break;case 3:if(!this.getPickerPopup()){this.getAggregation("yearRangePicker").previousPage();m.call(this);}break;}};k.prototype._handleNext=function(E){var F=new c(this._getFocusedDate(),this.getPrimaryCalendarType()),o,s,i;switch(this._iMode){case 0:s=new c(this._getStartDate(),this.getPrimaryCalendarType());i=this._getDays();this._shiftStartFocusDates(s,F,i);break;case 1:if(!this.getPickerPopup()){o=this._getMonthPicker();if(o.getMonths()<12){o.nextPage();this._togglePrevNext(F);}else{F.setYear(F.getYear()+1);var n=this._focusDateExtend(F,true,false);this._setFocusedDate(F);this._updateHeader(F);this._setDisabledMonths(F.getYear());if(n){this.fireStartDateChange();}}}break;case 2:if(!this.getPickerPopup()){this._getYearPicker().nextPage();m.call(this);}break;case 3:if(!this.getPickerPopup()){this.getAggregation("yearRangePicker").nextPage();m.call(this);}break;}};k.prototype._getDisplayedMonths=function(o){var i=[];var n=o.getMonth();var p=this._getDays();i.push(n);if(p>this._getDaysLarge()){var E=new c(o,this.getPrimaryCalendarType());E.setDate(E.getDate()+p-1);var r=E.getMonth();while(n!=r){n=(n+1)%12;i.push(n);}}return i;};k.prototype._getDisplayedSecondaryMonths=function(p,s){var i=this._getDays();var S=new c(this._getStartDate(),s);var n=S.getMonth();var E=new c(S,this.getPrimaryCalendarType());E.setDate(E.getDate()+i-1);E=new c(E,s);var o=E.getMonth();return{start:n,end:o};};k.prototype._openPickerPopup=function(p){if(!this._oPopup){var o=new P({placement:"VerticalPreferredBottom",showHeader:false,showArrow:false,verticalScrolling:false});o.oPopup.setDurations(0,0);o.addEventDelegate({onsapescape:function(E){this._oCalendar.onsapescape(E);this._hideOverlay();}},this);this._oPopup=o;}this._oPopup.addContent(p);this._oPopup.attachAfterClose(function(){this._closeCalendarPicker(true);this._hideOverlay();},this);this._oPopup.attachAfterOpen(function(){var B=H.$("B1");var $=this._oPopup.$();var O=Math.floor(($.width()-B.width())/2);this._oPopup.setOffsetX(g.getConfiguration().getRTL()?O:-O);var i=B.height();this._oPopup.setOffsetY(this._oPopup._getCalculatedPlacement()==="Top"?i:-i);},this);var H=this.getAggregation("header");this._oPopup.openBy(H.getDomRef("B1"));};k.prototype._getMaxDateAlignedToMinDate=function(o,i){var n=new c(o,this.getPrimaryCalendarType());if(n.isBefore(i)){n=new c(i);n.setDate(n.getDate()+this._getDays()-1);}return n;};k.prototype._getStartDateAlignedToMinAndMaxDate=function(o,i,s){var n=new c(s,this.getPrimaryCalendarType());if(n.isBefore(i)){n=new c(i,this.getPrimaryCalendarType());}else if(n.isAfter(o)){n=o;}return n;};k.prototype._calculateStartDate=function(o,i,s){var n=new c(o,this.getPrimaryCalendarType());n.setDate(n.getDate()-this._getDays()+1);n=this._getMaxDateAlignedToMinDate(n,i);s=this._getStartDateAlignedToMinAndMaxDate(n,i,s);return s;};k.prototype._setStartDate=function(s,S,n){s=this._calculateStartDate(this._oMaxDate,this._oMinDate,s);var o=s.toLocalJSDate();this.setProperty("startDate",o,true);this._oStartDate=s;var i=this.getAggregation("month")[0];i.setStartDate(o);this._updateHeader(s);if(S){var p=this._getFocusedDate().toLocalJSDate();if(!i.checkDateFocusable(p)){this._setFocusedDate(s);i.setDate(o);}else{i.setDate(p);}}if(!n){this.fireStartDateChange();}};k.prototype._getStartDate=function(){if(!this._oStartDate){this._oStartDate=this._getFocusedDate();}return this._oStartDate;};function _(E){var F=new c(this._getFocusedDate(),this.getPrimaryCalendarType());this._togglePrevNext(F);}function m(E){this._togglePrevNexYearPicker();this._updateHeadersYearPrimaryText(this._getYearString());}return k;});