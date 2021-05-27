/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/documentation/sdk/util/Resources"],function(q,R){"use strict";var c;function _(C){if(c){return Promise.resolve(c);}return new Promise(function(r,a){q.ajax({async:true,url:R.getResourceOriginPath(C.docuPath+"index.json"),dataType:'json',success:function(d){c=d;r(d);},error:function(e){a(e);}});});}return{getDocuIndexPromise:_};});
