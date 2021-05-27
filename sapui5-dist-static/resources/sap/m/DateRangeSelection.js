/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.getCore().loadLibrary("sap.ui.unified");sap.ui.define(['sap/ui/Device','./DatePicker','./library','sap/ui/core/LocaleData','sap/ui/core/format/DateFormat','sap/ui/core/date/UniversalDate','./DateRangeSelectionRenderer',"sap/ui/unified/calendar/CustomMonthPicker","sap/ui/unified/calendar/CustomYearPicker","sap/base/util/deepEqual","sap/base/Log","sap/base/assert","sap/ui/dom/jquery/cursorPos"],function(D,a,l,L,b,U,c,C,d,f,g,h){"use strict";var j=a.extend("sap.m.DateRangeSelection",{metadata:{library:"sap.m",properties:{delimiter:{type:"string",group:"Misc",defaultValue:'-'},secondDateValue:{type:"object",group:"Data",defaultValue:null},from:{type:"object",group:"Misc",defaultValue:null,deprecated:true},to:{type:"object",group:"Misc",defaultValue:null,deprecated:true}},designtime:"sap/m/designtime/DateRangeSelection.designtime",dnd:{draggable:false,droppable:true}}});var H=String.fromCharCode(45),E=String.fromCharCode(8211),k=String.fromCharCode(8212);j.prototype.init=function(){a.prototype.init.apply(this,arguments);this._bIntervalSelection=true;};j.prototype._createPopupContent=function(){a.prototype._createPopupContent.apply(this,arguments);var e=this._getCalendar();if(e instanceof C){e._getMonthPicker().setIntervalSelection(true);}if(e instanceof d){e._getYearPicker().setIntervalSelection(true);}this._getCalendar().attachWeekNumberSelect(this._handleWeekSelect,this);this._getCalendar().getSelectedDates()[0].setStartDate(this._oDateRange.getStartDate());this._getCalendar().getSelectedDates()[0].setEndDate(this._oDateRange.getEndDate());};j.prototype.onkeypress=function(e){if(!e.charCode||e.metaKey||e.ctrlKey){return;}var F=r.call(this);var i=q.call(this);var A=F.sAllowedCharacters+i+" ";var v=String.fromCharCode(e.charCode);if(v&&F.sAllowedCharacters&&A.indexOf(v)<0){e.preventDefault();}};j.prototype._getPlaceholder=function(){var P=this.getPlaceholder(),B,e,i,v;if(!P){B=this.getBinding("value");i=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();v=L.getInstance(i);if(B&&B.getType()instanceof sap.ui.model.type.DateInterval){e=B.getType();if(e.oFormatOptions&&e.oFormatOptions.format){P=v.getCustomDateTimePattern(e.oFormatOptions.format);}else{P=v.getDatePattern("medium");}}else{P=this.getDisplayFormat();if(!P){P="medium";}if(this._checkStyle(P)){P=v.getDatePattern(P);}}var w=q.call(this);if(w&&w!==""){P=P+" "+w+" "+P;}}return P;};j.prototype.setValue=function(v){if(v!==this.getValue()){this.setLastValue(v);}else{return this;}this.setProperty("value",v);this._bValid=true;var e=[undefined,undefined];if(v){e=this._parseValue(v);if(!o.call(this,e[0],e[1])[0]){this._bValid=false;g.warning("Value can not be converted to a valid dates",this);}}this.setProperty("dateValue",_(e[0]));this.setProperty("secondDateValue",_(e[1]));if(this.getDomRef()){var O=this._formatValue(e[0],e[1]);if(this._$input.val()!==O){this._$input.val(O);this._curpos=this._$input.cursorPos();}}return this;};function _(B){return(typeof B==='number')?new Date(B):B;}function m(B){return(B&&B.getTime)?B.getTime():B;}j.prototype.setValueFormat=function(v){this.setProperty("valueFormat",v,true);g.warning("Property valueFormat is not supported in sap.m.DateRangeSelection control.",this);return this;};j.prototype.setDisplayFormat=function(e){this.setProperty("displayFormat",e,true);var O=this._formatValue(this.getDateValue(),this.getSecondDateValue());this.setProperty("value",O,true);if(this.getDomRef()&&(this._$input.val()!==O)){this._$input.val(O);this._curpos=this._$input.cursorPos();}return this;};j.prototype.setFrom=function(F){this.setDateValue(F);return this;};j.prototype.getFrom=function(){return this.getDateValue();};j.prototype.setTo=function(T){this.setSecondDateValue(T);return this;};j.prototype.getTo=function(){return this.getSecondDateValue();};j.prototype.setDateValue=function(e){if(!this._isValidDate(e)){throw new Error("Date must be a JavaScript date object; "+this);}if(f(this.getDateValue(),e)){return this;}a.prototype._dateValidation.call(this,e);this._syncDateObjectsToValue(e,this.getSecondDateValue());return this;};j.prototype.setSecondDateValue=function(S){if(!this._isValidDate(S)){throw new Error("Date must be a JavaScript date object; "+this);}if(f(this.getSecondDateValue(),S)){return this;}this._bValid=true;if(S&&(S.getTime()<this._oMinDate.getTime()||S.getTime()>this._oMaxDate.getTime())){this._bValid=false;h(this._bValid,"Date must be in valid range");}this.setProperty("secondDateValue",S);this._syncDateObjectsToValue(this.getDateValue(),S);return this;};j.prototype.setMinDate=function(e){a.prototype.setMinDate.apply(this,arguments);if(e){var S=this.getSecondDateValue();if(S&&S.getTime()<this._oMinDate.getTime()){g.warning("SecondDateValue not in valid date range",this);}}return this;};j.prototype.setMaxDate=function(e){a.prototype.setMaxDate.apply(this,arguments);if(e){var S=this.getSecondDateValue();if(S&&S.getTime()>this._oMaxDate.getTime()){g.warning("SecondDateValue not in valid date range",this);}}return this;};j.prototype._checkMinMaxDate=function(){a.prototype._checkMinMaxDate.apply(this,arguments);var S=this.getSecondDateValue();if(S&&(S.getTime()<this._oMinDate.getTime()||S.getTime()>this._oMaxDate.getTime())){g.error("secondDateValue "+S.toString()+"(value="+this.getValue()+") does not match "+"min/max date range("+this._oMinDate.toString()+" - "+this._oMaxDate.toString()+"). App. "+"developers should take care to maintain secondDateValue/value accordingly.",this);}};j.prototype._parseValue=function(v){var F;var i=[];var w,x;var B=this.getBinding("value");if(B&&B.getType()instanceof sap.ui.model.type.DateInterval){try{i=B.getType().parseValue(v,"string");}catch(e){return[undefined,undefined];}if(B.getType().oFormatOptions&&B.getType().oFormatOptions.UTC){i=i.map(function(A){return new Date(A.getUTCFullYear(),A.getUTCMonth(),A.getUTCDate(),A.getUTCHours(),A.getUTCMinutes(),A.getUTCSeconds());});}return i;}var y=q.call(this);if(y&&v){v=v.trim();v=u(v,[y," "]);i=this._splitValueByDelimiter(v,y);if(i.length===2){if(i[0].slice(i[0].length-1,i[0].length)==" "){i[0]=i[0].slice(0,i[0].length-1);}if(i[1].slice(0,1)==" "){i[1]=i[1].slice(1);}}else{i=v.split(" "+y+" ");}if(v.indexOf(y)===-1){var z=v.split(" ");if(z.length===2){i=z;}}}if(v&&i.length<=2){F=r.call(this);if((!y||y==="")||i.length===1){w=F.parse(v);}else if(i.length===2){w=F.parse(i[0]);x=F.parse(i[1]);if(!w||!x){w=undefined;x=undefined;}}}return[w,x];};j.prototype._splitValueByDelimiter=function(v,e){var w=[H,E,k],i;if(e){if(w.indexOf(e)===-1){return v.split(e);}}for(i=0;i<w.length;i++){if(v.indexOf(w[i])>0){return v.split(w[i]);}}return v?v.split(" "):[];};j.prototype._formatValue=function(e,S){var v="",i=q.call(this),F,B,w,x;w=e;x=S;if(w){B=this.getBinding("value");if(B&&B.getType()instanceof sap.ui.model.type.DateInterval){if(B.getType().oFormatOptions&&B.getType().oFormatOptions.source&&B.getType().oFormatOptions.source.pattern==="timestamp"){v=B.getType().formatValue([m(e),m(S)],"string");}else{if(B.getType().oFormatOptions&&B.getType().oFormatOptions.UTC){w=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds()));if(S){x=new Date(Date.UTC(S.getFullYear(),S.getMonth(),S.getDate(),S.getHours(),S.getMinutes(),S.getSeconds()));}}v=B.getType().formatValue([w,x],"string");}}else{F=r.call(this);if(i&&i!==""&&x){v=F.format(w)+" "+i+" "+F.format(x);}else{v=F.format(w);}}}return v;};j.prototype.onChange=function(){if(!this.getEditable()||!this.getEnabled()){return;}var v=this._$input.val();var e=[undefined,undefined];if(this.getShowFooter()&&this._oPopup&&!v){this._oPopup.getBeginButton().setEnabled(false);}this._bValid=true;if(v!=""){e=this._parseValue(v);e[1]&&e[1].setHours(23,59,59,999);e=o.call(this,e[0],e[1]);if(e[0]){v=this._formatValue(e[0],e[1]);}else{this._bValid=false;}}if(v!==this.getLastValue()){if(this.getDomRef()&&(this._$input.val()!==v)){this._$input.val(v);this._curpos=this._$input.cursorPos();}this.setLastValue(v);this.setProperty("value",v,true);if(this._bValid){this.setProperty("dateValue",_(e[0]),true);this.setProperty("secondDateValue",_(e[1]),true);}if(this._oPopup&&this._oPopup.isOpen()){var S=this.getDateValue();if(S){if(!this._oDateRange.getStartDate()||this._oDateRange.getStartDate().getTime()!==S.getTime()){this._oDateRange.setStartDate(new Date(S.getTime()));this._getCalendar().focusDate(S);}}else{if(this._oDateRange.getStartDate()){this._oDateRange.setStartDate(undefined);}}var i=this.getSecondDateValue();if(i){if(!this._oDateRange.getEndDate()||this._oDateRange.getEndDate().getTime()!==i.getTime()){this._oDateRange.setEndDate(new Date(i.getTime()));this._getCalendar().focusDate(i);}}else{if(this._oDateRange.getEndDate()){this._oDateRange.setEndDate(undefined);}}}n.call(this,this._bValid);}};j.prototype._getInputValue=function(v){v=(typeof v=="undefined")?this._$input.val():v.toString();if(!v){return"";}var e=this._parseValue(v);v=this._formatValue(e[0],e[1]);return v;};j.prototype.updateDomValue=function(v){this._bCheckDomValue=true;v=(typeof v=="undefined")?this._$input.val():v.toString();this._curpos=this._$input.cursorPos();var e=this._parseValue(v);v=this._formatValue(e[0],e[1]);if(this.isActive()&&(this._$input.val()!==v)){this._$input.val(v);this._$input.cursorPos(this._curpos);}return this;};j.prototype._fillDateRange=function(){a.prototype._fillDateRange.apply(this,arguments);var e=this.getSecondDateValue();if(e&&e.getTime()>=this._oMinDate.getTime()&&e.getTime()<=this._oMaxDate.getTime()){if(!this._oDateRange.getEndDate()||this._oDateRange.getEndDate().getTime()!==e.getTime()){this._oDateRange.setEndDate(new Date(e.getTime()));}}else{if(this._oDateRange.getEndDate()){this._oDateRange.setEndDate(undefined);}}};j.prototype._selectDate=function(){var S=this._getCalendar().getSelectedDates();if(S.length>0){var e=S[0].getStartDate();var i=S[0].getEndDate();if(e&&i){var v=this.getDateValue();var w=this.getSecondDateValue();i.setHours(23,59,59,999);var V;if(!f(e,v)||!f(i,w)){if(f(i,w)){this.setDateValue(e);}else{this.setProperty("dateValue",e,true);this.setSecondDateValue(i);}V=this.getValue();n.call(this,true);if(D.system.desktop||!D.support.touch){this._curpos=V.length;this._$input.cursorPos(this._curpos);}}else if(!this._bValid){V=this._formatValue(e,i);if(V!=this._$input.val()){this._bValid=true;if(this.getDomRef()){this._$input.val(V);}n.call(this,true);}}this._oDateRange.setStartDate(this._getCalendar().getSelectedDates()[0].getStartDate());this._oDateRange.setEndDate(this._getCalendar().getSelectedDates()[0].getEndDate());this._oPopup.close();}}};j.prototype._handleCalendarSelect=function(){var S=this._getCalendar().getSelectedDates(),e=S[0].getStartDate(),i=S[0].getEndDate();if(this.getShowFooter()){this._oPopup.getBeginButton().setEnabled(!!(e&&i));return;}this._selectDate();};j.prototype._handleWeekSelect=function(e){var S=e.getParameter("weekDays"),i=S.getStartDate(),v=S.getEndDate();if(this.getShowFooter()){this._oPopup.getBeginButton().setEnabled(!!(i&&v));return;}this._getCalendar().getSelectedDates()[0].setStartDate(i);this._getCalendar().getSelectedDates()[0].setEndDate(v);this._oDateRange.setStartDate(i);this._oDateRange.setEndDate(v);this._selectDate();};j.prototype.getAccessibilityInfo=function(){var R=this.getRenderer();var i=a.prototype.getAccessibilityInfo.apply(this,arguments);var v=this.getValue()||"";if(this._bValid){var e=this.getDateValue();if(e){v=this._formatValue(e,this.getSecondDateValue());}}i.type=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_DATERANGEINPUT");i.description=[v,R.getLabelledByAnnouncement(this),R.getDescribedByAnnouncement(this)].join(" ").trim();return i;};j.prototype._syncDateObjectsToValue=function(e,S){var v=this._formatValue(e,S);if(v!==this.getValue()){this.setLastValue(v);}this.setProperty("value",v);if(this.getDomRef()){var O=this._formatValue(e,S);if(this._$input.val()!==O){this._$input.val(O);this._curpos=this._$input.cursorPos();}}};function n(v){this.fireChangeEvent(this.getValue(),{from:this.getDateValue(),to:this.getSecondDateValue(),valid:v});}function o(e,S){var F,i;if(e&&e.getTime){F=e.getTime();}else if(typeof e==='number'){F=e;}if(S&&S.getTime){i=S.getTime();}else if(typeof S==='number'){i=S;}if(e&&S&&F>i){var T=e;e=S;S=T;}if((e&&(F<this._oMinDate.getTime()||F>this._oMaxDate.getTime()))||(S&&(i<this._oMinDate.getTime()||i>this._oMaxDate.getTime()))){return[undefined,undefined];}else{return[e,S];}}j.prototype._increaseDate=function(N,e){var v=this._$input.val(),i=this._parseValue(v),F=i[0],S=i[1],w=r.call(this),x=q.call(this),y,z,A,V,B,G,I;if(!F||!this.getEditable()||!this.getEnabled()){return;}if(!o.call(this,F,S)[0]){g.warning("Value can not be converted to a valid dates or dates are outside of the min/max range",this);this._bValid=false;n.call(this,this._bValid);return;}v=u(v,[x," "]);y=this._$input.cursorPos();z=F?w.format(F).length:0;A=S?w.format(S).length:0;V=v.length;B=y<=z+1;G=y>=V-A-1&&y<=V;if(B&&F){I=p.call(this,F,N,e);if(!f(this.getDateValue(),I.getJSDate())){this.setDateValue(new Date(I.getTime()));this._curpos=y;this._$input.cursorPos(this._curpos);this.fireChangeEvent(this.getValue(),{valid:this._bValid});}}else if(G&&S){I=p.call(this,S,N,e);if(!f(this.getSecondDateValue(),I.getJSDate())){this.setSecondDateValue(new Date(I.getTime()));this._curpos=y;this._$input.cursorPos(this._curpos);this.fireChangeEvent(this.getValue(),{valid:this._bValid});}}};function p(O,N,e){var B=this.getBinding("value"),i,M,v,w;if(B&&B.oType&&B.oType.oOutputFormat){i=B.oType.oOutputFormat.oFormatOptions.calendarType;}else if(B&&B.oType&&B.oType.oFormat){i=B.oType.oFormat.oFormatOptions.calendarType;}if(!i){i=this.getDisplayFormatType();}v=U.getInstance(new Date(O.getTime()),i);w=v.getMonth();switch(e){case"day":v.setDate(v.getDate()+N);break;case"month":v.setMonth(v.getMonth()+N);M=(w+N)%12;if(M<0){M=12+M;}while(v.getMonth()!=M){v.setDate(v.getDate()-1);}break;case"year":v.setFullYear(v.getFullYear()+N);while(v.getMonth()!=w){v.setDate(v.getDate()-1);}break;default:break;}if(v.getTime()<this._oMinDate.getTime()){v=new U(this._oMinDate.getTime());}else if(v.getTime()>this._oMaxDate.getTime()){v=new U(this._oMaxDate.getTime());}return v;}function q(){var e=this.getDelimiter();if(!e){if(!this._sLocaleDelimiter){var i=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();var v=L.getInstance(i);var P=v.getIntervalPattern();var I=P.indexOf("{0}")+3;var w=P.indexOf("{1}");e=P.slice(I,w);if(e.length>1){if(e.slice(0,1)==" "){e=e.slice(1);}if(e.slice(e.length-1,e.length)==" "){e=e.slice(0,e.length-1);}}this._sLocaleDelimiter=e;}else{e=this._sLocaleDelimiter;}}return e;}function r(){var P=(this.getDisplayFormat()||"medium");var F;var e=this.getDisplayFormatType();if(P==this._sUsedDisplayPattern&&e==this._sUsedDisplayCalendarType){F=this._oDisplayFormat;}else{if(this._checkStyle(P)){F=b.getInstance({style:P,strictParsing:true,calendarType:e});}else{F=b.getInstance({pattern:P,strictParsing:true,calendarType:e});}this._sUsedDisplayPattern=P;this._sUsedDisplayCalendarType=e;this._oDisplayFormat=F;}return F;}function s(v,e){return v&&e&&v.lastIndexOf(e)===v.length-e.length;}function t(v,S){return v&&S&&v.indexOf(S)===0;}function u(v,P){var i=0,T=P;if(!T){T=[" "];}while(i<T.length){if(s(v,T[i])){v=v.substring(0,v.length-T[i].length);i=0;continue;}i++;}i=0;while(i<T.length){if(t(v,T[i])){v=v.substring(T[i].length);i=0;continue;}i++;}return v;}return j;});
