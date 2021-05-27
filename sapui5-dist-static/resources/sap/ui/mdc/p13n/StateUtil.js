/*
* ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define([],function(){"use strict";var S={applyExternalState:function(c,s){return c.getEngine().applyState(c,S._internalizeKeys(s));},retrieveExternalState:function(c){return c.getEngine().retrieveState(c).then(function(e){return S._externalizeKeys(e);});},_externalizeKeys:function(i){var k={Sort:"sorters",Group:"groupLevels",Aggregate:"aggregations",Filter:"filter",Item:"items",Column:"items"};var t={};Object.keys(i).forEach(function(p){var e=k[p];var T=e||p;t[T]=i[p];});return t;},_internalizeKeys:function(e){var k={sorters:["Sort"],groupLevels:["Group"],aggregations:["Aggregate"],filter:["Filter"],items:["Item","Column"]};var t={};Object.keys(e).forEach(function(p){if(k[p]){k[p].forEach(function(T){t[T]=e[p];});}});return t;}};return S;});
