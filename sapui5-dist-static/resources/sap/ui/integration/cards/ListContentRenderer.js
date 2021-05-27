/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseContentRenderer"],function(B){"use strict";var L=B.extend("sap.ui.integration.cards.ListContentRenderer",{apiVersion:2});L.renderContent=function(r,l){r.renderControl(l.getAggregation("_content"));if(l.getAggregation("_legend")){r.renderControl(l.getAggregation("_legend"));}};L.getMinHeight=function(c,C){if(!c){return this.DEFAULT_MIN_HEIGHT;}if(!c.maxItems||!c.item){return this.DEFAULT_MIN_HEIGHT;}var i=this.isCompact(C),a=parseInt(c.maxItems)||0,t=c.item,I=i?2:2.75;if(t.description||t.chart){I=5;}if(t.description&&t.chart){I=6;}return(a*I)+"rem";};return L;});
