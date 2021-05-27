// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/eventlogging/EventConsumer','sap/ushell/renderers/fiori2/search/suggestions/SuggestionType'],function(E,S){"use strict";var m=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new E(),{init:function(){try{this.analytics=sap.ushell.Container.getService("UsageAnalytics");}catch(e){}},logEvent:function(e){if(!this.analytics){return;}switch(e.type){case this.eventLogger.RESULT_LIST_ITEM_NAVIGATE:this.analytics.logCustomEvent('FLP: Search','Launch Object',[e.targetUrl]);break;case this.eventLogger.SUGGESTION_SELECT:switch(e.suggestionType){case S.APPS:this.analytics.logCustomEvent('FLP: Search','Suggestion Select App',[e.suggestionTitle,e.targetUrl,e.searchTerm]);this.analytics.logCustomEvent('FLP: Application Launch point','Search Suggestions',[e.suggestionTitle,e.targetUrl,e.searchTerm]);break;case S.DATASOURCE:this.analytics.logCustomEvent('FLP: Search','Suggestion Select Datasource',[e.dataSourceKey,e.searchTerm]);break;case S.OBJECTDATA:this.analytics.logCustomEvent('FLP: Search','Suggestion Select Object Data',[e.suggestionTerm,e.dataSourceKey,e.searchTerm]);break;case S.HISTORY:this.analytics.logCustomEvent('FLP: Search','Suggestion Select Object Data',[e.suggestionTerm,e.dataSourceKey,e.searchTerm]);break;}break;case this.eventLogger.SEARCH_REQUEST:this.analytics.logCustomEvent('FLP: Search','Search',[e.searchTerm,e.dataSourceKey]);break;case this.eventLogger.RESULT_LIST_ITEM_NAVIGATE_CONTEXT:this.analytics.logCustomEvent('FLP: Search','Launch Related Object',[e.targetUrl]);break;case this.eventLogger.SUGGESTION_REQUEST:this.analytics.logCustomEvent('FLP: Search','Suggestion',[e.suggestionTerm,e.dataSourceKey]);break;case this.eventLogger.TILE_NAVIGATE:this.analytics.logCustomEvent('FLP: Search','Launch App',[e.tileTitle,e.targetUrl]);this.analytics.logCustomEvent('FLP: Application Launch point','Search Results',[e.titleTitle,e.targetUrl]);break;}}});return m;});
