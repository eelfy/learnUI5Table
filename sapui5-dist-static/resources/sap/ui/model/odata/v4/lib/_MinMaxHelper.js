/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache"],function(_,a){"use strict";return{createCache:function(r,R,A,q){var m={},c,f=false,M,b;if(A.groupLevels.length){throw new Error("Unsupported group levels together with min/max");}c=a.create(r,R,q,true);M=new Promise(function(d){b=d;});c.getMeasureRangePromise=function(){return M;};c.getResourcePathWithQuery=function(s,e){var Q=_.buildApply(A,Object.assign({},this.mQueryOptions,{$skip:s,$top:e-s}),1,f,m);f=true;return this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,Q,false,true);};c.handleResponse=function(s,e,o,t){var d,g={},h=o.value.shift();function i(j){g[j]=g[j]||{};return g[j];}o["@odata.count"]=h.UI5__count;for(d in m){i(m[d].measure)[m[d].method]=h[d];}b(g);delete this.handleResponse;this.handleResponse(s,e,o,t);};return c;}};},false);
