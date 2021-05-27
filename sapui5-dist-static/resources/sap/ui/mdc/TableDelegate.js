/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/AggregationBaseDelegate"],function(A){"use strict";var T=Object.assign({},A);T.addItem=function(p,t,P){return Promise.resolve(null);};T.removeItem=function(p,t,P){return Promise.resolve(true);};T.updateBindingInfo=function(m,M,b){};T.rebindTable=function(m,r){if(m&&m._oTable&&r){m._oTable.bindRows(r);}};T.getFilterDelegate=function(){return{addItem:function(p,t){return Promise.resolve(null);}};};return T;});
