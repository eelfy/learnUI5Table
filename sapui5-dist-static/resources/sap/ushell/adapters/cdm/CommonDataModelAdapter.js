// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/URI","sap/base/Log","sap/base/util/Version","sap/base/util/UriParameters","sap/ui/thirdparty/jquery"],function(U,L,V,a,q){"use strict";var C=function(u,p,A){this.oAdapterConfiguration=A;if(A&&A.config&&A.config.siteData){this.oCdmSiteDataRequestPromise=new q.Deferred().resolve(A.config.siteData);}else if(A&&A.config&&A.config.siteDataPromise){this.oCdmSiteDataRequestPromise=A.config.siteDataPromise;}else{var s=this._identifySiteUrlFromConfig(A);var b=this._normalizeUrl(s,location.href);this.oCdmSiteDataRequestPromise=this._requestSiteData(b);}};C.prototype._requestSiteData=function(u){var s=new q.Deferred();if(!u){return s.reject("Cannot load site: configuration property 'siteDataUrl' is missing for CommonDataModelAdapter.");}q.ajax({type:"GET",dataType:"json",url:u}).done(function(r){s.resolve(r);}).fail(function(e){L.error(e.responseText);s.reject("CDM Site was requested but could not be loaded.");});return s.promise();};C.prototype._normalizeUrl=function(u,c){if(typeof u!=="string"){return u;}if(u.indexOf("http")===0){return u;}var b=document.getElementsByTagName("base")[0];return(new U(u,b).absoluteTo(c)).toString();};C.prototype.getSite=function(){var d=new q.Deferred();this.oCdmSiteDataRequestPromise.done(function(s){var S=q.extend({},s);delete S.personalization;d.resolve(S);}).fail(function(m){d.reject(m);});return d.promise();};C.prototype.getPersonalization=function(){var d=new q.Deferred(),t=this;this.oCdmSiteDataRequestPromise.done(function(s){var S=q.extend({},s),b=S._version,p;if(t.oAdapterConfiguration&&t.oAdapterConfiguration.config&&t.oAdapterConfiguration.config.ignoreSiteDataPersonalization){delete S.personalization;}if(S.personalization){p=S.personalization._version;if(Object.keys(S.personalization).length>0&&!t._isPersonalizationVersionValid(b,p)){L.error("Personalization version is not compatible to the site version and will not be loaded. Please proceed to personalize the homepage again if needed. Personalization version: "+p+"; Site version: "+b);d.resolve();return;}d.resolve(S.personalization);}else{t._readPersonalizationDataFromStorage(b).done(function(P){p=P._version;if(Object.keys(P).length>0&&!t._isPersonalizationVersionValid(b,p)){L.error("Personalization version is not compatible to the site version and will not be loaded. Please proceed to personalize the homepage again if needed. Personalization version: "+p+"; Site version: "+b);d.resolve();return;}d.resolve(P);}).fail(function(m){d.reject(m);});}}).fail(function(m){d.reject(m);});return d.promise();};C.prototype._isPersonalizationVersionValid=function(s,p){if(!s){return false;}var S=new V(s).getMajor(),P=new V(p);if(S>=3){return P.getMajor()===S;}return P.getMajor()<3;};C.prototype.setPersonalization=function(p){var P=new q.Deferred(),o=sap.ushell.Container.getService("Personalization"),c,s={keyCategory:o.constants.keyCategory.FIXED_KEY,writeFrequency:o.constants.writeFrequency.LOW,clientStorageAllowed:true},b={container:"sap.ushell.cdm.personalization",item:"data"},d=new V(p.version);if(d.inRange("3.1.0","4.0.0")){b={container:"sap.ushell.cdm3-1.personalization",item:"data"};}var e=o.getPersonalizer(b,s,c);e.setPersData(p).done(function(){L.info("Personalization data has been stored successfully.");P.resolve();}).fail(function(){P.reject("Writing personalization data failed.");});return P.promise();};C.prototype._readPersonalizationDataFromStorage=function(c){var p=new q.Deferred();sap.ushell.Container.getServiceAsync("Personalization").then(function(P){var s={keyCategory:P.constants.keyCategory.FIXED_KEY,writeFrequency:P.constants.writeFrequency.LOW,clientStorageAllowed:true};var o={container:"sap.ushell.cdm.personalization",item:"data"};if(c){var v=new V(c);if(v&&v.inRange("3.1.0","4.0.0")){o={container:"sap.ushell.cdm3-1.personalization",item:"data"};}}P.getPersonalizer(o,s).getPersData().done(function(b){p.resolve(b||{});}).fail(function(){p.reject("Fetching personalization data failed.");});});return p.promise();};C.prototype._identifySiteUrlFromConfig=function(A){var p=new a(window.location.href);var s=p.get("sap-ushell-cdm-site-url");var c=A&&A.config;if((c&&!c.allowSiteSourceFromURLParameter)&&s){s=null;}if(c&&!s){s=c.siteDataUrl||c.cdmSiteUrl;}this.sCdmSiteUrl=s;return s;};return C;},true);
