/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/field/FieldValueHelpDelegate','sap/ui/model/FilterType','sap/ui/mdc/odata/v4/TypeUtil'],function(F,a,T){"use strict";var _=function(b){return new Promise(function(r){var c=false;var h=function(p){if(p.mParameters.detailedReason){return;}if(!c){c=true;b.detachEvent("change",h);r(p);}};b.attachEvent("change",h);b.attachEventOnce("dataReceived",h);});};var O=Object.assign({},F);O.isSearchSupported=function(p,l){return!!l.changeParameters;};O.executeSearch=function(p,l,s){if(s){l.changeParameters({$search:s});}else{l.changeParameters({$search:undefined});}return _(l);};O.executeFilter=function(p,l,f,c,r){var b=_(l).then(function n(d){c();});l.initialize();l.filter(f,a.Application);l.getContexts(0,r);return b;};O.checkBindingsPending=function(p,b){var P=[];for(var i=0;i<b.length;i++){var B=b[i];if(B&&B.requestValue){P.push(B.requestValue());}}if(P.length>0){return Promise.all(P);}return null;};O.getTypeUtil=function(p){return T;};return O;});
