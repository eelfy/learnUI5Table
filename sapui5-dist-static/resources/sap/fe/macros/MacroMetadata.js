/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/converters/ConverterContext","sap/base/util/merge","sap/base/util/uid"],function(C,m,u){"use strict";var g=function(c,i){var p={};if(c){var o=c[i];if(o){Object.keys(o).forEach(function(a){p[a]=o[a];});}}return p;};var s=function(p,P,o){if(p[P]===undefined){p[P]=o;}};var M={metadata:{properties:{_flexId:{type:"string"}}},extend:function(n,c){c.metadata.properties._flexId=M.metadata.properties._flexId;c.hasValidation=true;c.getOverrides=g.bind(c);c.setDefaultValue=s.bind(c);c.getConverterContext=function(v,a,S){var A=S.appComponent;var b=S.models.viewData&&S.models.viewData.getData();var o=C.createConverterContextForMacro(v.startingEntitySet.name,S.models.metaModel,b.converterType,A&&A.getShellServices(),A&&A.getDiagnostics(),m,v.contextLocation,b);return o;};c.createBindingContext=function(d,S){var a="/"+u();S.models.converterContext.setProperty(a,d);return S.models.converterContext.createBindingContext(a);};return c;}};return M;});
