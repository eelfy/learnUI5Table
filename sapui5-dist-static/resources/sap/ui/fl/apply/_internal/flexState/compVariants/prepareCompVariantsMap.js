/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Change","sap/ui/fl/apply/_internal/flexObjects/CompVariant"],function(C,a){"use strict";function g(m,k){m[k]=m[k]||{variants:[],changes:[],defaultVariant:undefined,standardVariant:undefined};return m[k];}function b(c,s,B,m){var o=s==="variants"?a:C;var f=c[s].map(function(d){var F=new o(d);F.setState(C.states.PERSISTED);return F;});f.forEach(function(F){B[F.getId()]=F;var p=F.getSelector().persistencyKey;switch(s){case"defaultVariants":g(m,p)["defaultVariant"]=F;break;case"standardVariants":g(m,p)["standardVariant"]=F;break;default:g(m,p)[s].push(F);}});}return function(p){var B={};var c={};c._getOrCreate=g.bind(undefined,c);if(p.storageResponse.changes.comp){["variants","changes","defaultVariants","standardVariants"].forEach(function(s){b(p.storageResponse.changes.comp,s,B,c);});}return{map:c,byId:B};};});
