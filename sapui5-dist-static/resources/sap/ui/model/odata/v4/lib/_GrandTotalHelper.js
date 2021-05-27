/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper"],function(_){"use strict";return{enhanceCacheWithGrandTotal:function(c,a,g){var f;c.getResourcePathWithQuery=function(s,e){var q=_.buildApply(a,Object.assign({},this.mQueryOptions,{$skip:s,$top:e-s}),1,f);f=true;return this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,q,false,true);};c.handleResponse=function(s,e,r,t){g(r.value.shift());r["@odata.count"]=r.value.shift().UI5__count;delete this.handleResponse;this.handleResponse(s,e,r,t);};}};},false);
