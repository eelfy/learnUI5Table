// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/renderers/fiori2/search/SearchConfiguration","jquery.sap.storage"],function(S){"use strict";var m={};jQuery.extend(m,{init:function(){sap.ushell.Container={getService:function(n){if(n==="Search"){return{queryApplications:function(p){return jQuery.when().then(function(){return{totalResults:0,searchTerm:p.searchTerm,getElements:function(){return[];}};});}};}else if(n==="URLParsing"){return{parseParameters:function(s){s=s.substr(1);var r={};var p=s.split("&");for(var i=0;i<p.length;i++){var b=p[i].split("=");if(!b[1]){b[1]="";}r[b[0]]=[b[1]];}return r;},splitHash:function(h){var r={};r.appSpecificRoute=h.substr(14);return r;}};}},getLogonSystem:function(n){return{getName:function(){return;},getClient:function(){return;},getPlatform:function(){return;}};}};sap.ushell.resources={};var u=navigator.language||navigator.userLanguage;var a=sap.ui.require.toUrl("sap/ushell/renderers/fiori2/resources/resources.properties");sap.ushell.resources.i18nModel=new sap.ui.model.resource.ResourceModel({bundleUrl:a,bundleLocale:u});sap.ushell.resources.i18n=sap.ushell.resources.i18nModel.getResourceBundle();}});return m;});
