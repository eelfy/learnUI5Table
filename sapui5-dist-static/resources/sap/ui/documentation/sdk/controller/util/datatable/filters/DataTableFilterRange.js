/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global",'sap/ui/core/Control','./DataTableFilterRangeRenderer'],function($,C,D){"use strict";var a=C.extend("sap.ui.documentation.sdk.DataTableFilterRange",{metadata:{aggregations:{from:{type:"sap.m.Input",multiple:false},to:{type:"sap.m.Input",multiple:false}}},renderer:D});a.M_EVENTS={LIVECHANGE:'liveChange'};a.prototype.onBeforeRendering=function(){this.attachEvents();};a.prototype.attachEvents=function(){var v,f,t;if(!this.bEventsAttached){this.bEventsAttached=true;f=this.getAggregation("from");t=this.getAggregation("to");[f,t].forEach(function(c){c.attachLiveChange(function(){v={from:f.getValue(),to:t.getValue()};this.fireEvent("liveChange",{value:v});},this);},this);}};return a;});
