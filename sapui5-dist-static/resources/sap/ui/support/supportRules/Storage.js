/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/support/supportRules/RuleSerializer","sap/ui/support/supportRules/Constants"],function(R,a){"use strict";function e(D){return window.btoa(unescape(encodeURIComponent(D)));}function d(D){return decodeURIComponent(escape(window.atob(D)));}var _=localStorage,b={get cookie(){return document.cookie;},set cookie(v){document.cookie=v;}};return{getRules:function(){var t=[],r;try{r=_.getItem(a.LOCAL_STORAGE_TEMP_RULES_KEY);if(!r){return null;}t=JSON.parse(d(r));t=t.map(function(c){return R.deserialize(c,true);});}catch(E){}return t;},setRules:function(r){var s=e(JSON.stringify(r));_.setItem(a.LOCAL_STORAGE_TEMP_RULES_KEY,s);},getSelectedRules:function(){var r=_.getItem(a.LOCAL_STORAGE_SELECTED_RULES_KEY);if(!r){return null;}return JSON.parse(r);},setSelectedRules:function(s){_.setItem(a.LOCAL_STORAGE_SELECTED_RULES_KEY,JSON.stringify(s));},setSelectedContext:function(s){_.setItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_KEY,JSON.stringify(s));},getSelectedContext:function(){return JSON.parse(_.getItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_KEY));},setSelectedScopeComponents:function(c){_.setItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_COMPONENT_KEY,JSON.stringify(c));},getSelectedScopeComponents:function(){var c=_.getItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_COMPONENT_KEY);return JSON.parse(c);},removeSelectedRules:function(s){this.setRules(s);},setVisibleColumns:function(v){_.setItem(a.LOCAL_STORAGE_SELECTED_VISIBLE_COLUMN_KEY,JSON.stringify(v));},getVisibleColumns:function(){return JSON.parse(_.getItem(a.LOCAL_STORAGE_SELECTED_VISIBLE_COLUMN_KEY));},getSelectionPresets:function(){return JSON.parse(_.getItem(a.LOCAL_STORAGE_SELECTION_PRESETS_KEY));},getCustomPresets:function(){return JSON.parse(_.getItem(a.LOCAL_STORAGE_CUSTOM_PRESETS_KEY));},setSelectionPresets:function(s){_.setItem(a.LOCAL_STORAGE_SELECTION_PRESETS_KEY,JSON.stringify(s));},setCustomPresets:function(c){_.setItem(a.LOCAL_STORAGE_CUSTOM_PRESETS_KEY,JSON.stringify(c));},removeAllData:function(){_.removeItem(a.LOCAL_STORAGE_TEMP_RULES_KEY);_.removeItem(a.LOCAL_STORAGE_SELECTED_RULES_KEY);_.removeItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_KEY);_.removeItem(a.LOCAL_STORAGE_SELECTED_CONTEXT_COMPONENT_KEY);_.removeItem(a.LOCAL_STORAGE_SELECTED_VISIBLE_COLUMN_KEY);_.removeItem(a.LOCAL_STORAGE_SELECTION_PRESETS_KEY);_.removeItem(a.LOCAL_STORAGE_CUSTOM_PRESETS_KEY);},createPersistenceCookie:function(c,C){b.cookie=c+"="+C;},readPersistenceCookie:function(C){var n=C+"=",f=decodeURIComponent(b.cookie),g=f.split(';'),o="";for(var i=0;i<g.length;i++){var c=g[i];while(c.charAt(0)==' '){c=c.substring(1);}if(c.indexOf(n)==0){o=c.substring(n.length,c.length);return o;}}return o;},deletePersistenceCookie:function(c){b.cookie=c+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';},_setStorage:function(s){_=s;},_getStorage:function(){return _;},_setCookieInterface:function(c){b=c;},_getCookieInterface:function(){return b;}};},true);
