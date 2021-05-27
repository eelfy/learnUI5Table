/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(r,f){"use strict";if(self.sap&&self.sap.ui&&typeof self.sap.ui.define==='function'){sap.ui.define(['sap/ui/thirdparty/URI'],f);}else if(typeof self.exports==='object'&&typeof self.exports.nodeName!=='string'){self.exports["ResourcesUtil"]=f();}else{r["ResourcesUtil"]=f();}}(self,function(U,b){"use strict";var R={getResourceOriginPath:function(p){var c,o,u=U(p);if(u&&u.is("absolute")){return p;}c=self['sap-ui-documentation-config'];o=(c&&c.demoKitResourceOrigin)||'.';return o+this._formatPath(p);},_formatPath:function(p){p=p.replace(/^\.\//,'/');if(!p.match(/^\//)){p="/"+p;}return p;}};return R;}));
