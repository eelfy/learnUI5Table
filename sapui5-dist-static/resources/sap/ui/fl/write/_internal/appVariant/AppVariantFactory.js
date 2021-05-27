/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/appVariant/AppVariant","sap/ui/thirdparty/jquery","sap/ui/fl/descriptorRelated/internal/Utils","sap/ui/fl/write/_internal/connectors/LrepConnector","sap/base/util/merge"],function(A,q,U,L,m){"use strict";function _(p){if(!p.url){p.url="/sap/bc/lrep";}return L.appVariant.load(p);}var a={};a.load=function(p){if(p.id===undefined||typeof p.id!=="string"){throw new Error("Parameter "+p.id+" must be provided of type string");}return _({reference:p.id}).then(function(r){var o=r.response;if(!q.isPlainObject(o)){o=JSON.parse(o);}p=m({},p,o);return new A(p);});};a.prepareCreate=function(p){try{U.checkParameterAndType(p,"reference","string");U.checkParameterAndType(p,"id","string");if(p.version){U.checkParameterAndType(p,"version","string");}if(!p.layer){p.layer='CUSTOMER';}else{U.checkParameterAndType(p,"layer","string");}if(p.skipIam){U.checkParameterAndType(p,"skipIam","boolean");}if(p.transport){U.checkTransportRequest(p.transport);}if(p.package){U.checkPackage(p.package);}}catch(e){return Promise.reject(e);}p.content=[];var o=new A(p);o.setMode("NEW");return Promise.resolve(o);};a.prepareUpdate=function(p){return a.load(p).then(function(o){o.setMode("EXISTING");return o;});};a.prepareDelete=function(p){return((p.isForSmartBusiness)?Promise.resolve(new A(p)):a.load(p)).then(function(o){o.setMode("DELETION");return o;});};return a;},true);
