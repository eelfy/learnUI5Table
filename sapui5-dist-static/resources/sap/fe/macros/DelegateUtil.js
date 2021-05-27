/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/mdc/TableDelegate","sap/ui/mdc/FilterBarDelegate","sap/ui/core/XMLTemplateProcessor","sap/ui/core/util/XMLPreprocessor","sap/ui/core/Fragment","sap/ui/core/Element","sap/ui/model/json/JSONModel","sap/fe/macros/CommonHelper","sap/fe/core/helpers/StableIdHelper","sap/fe/macros/field/FieldHelper","sap/fe/macros/internal/valuehelp/ValueHelpTemplating"],function(T,F,X,a,b,C,J,c,S,d,V){"use strict";var D={},N="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",m={"Edm.Boolean":{modelType:"Bool"},"Edm.Byte":{modelType:"Int"},"Edm.Date":{modelType:"Date"},"Edm.DateTime":{modelType:"Date"},"Edm.DateTimeOffset":{modelType:"DateTimeOffset"},"Edm.Decimal":{modelType:"Decimal"},"Edm.Double":{modelType:"Float"},"Edm.Float":{modelType:"Float"},"Edm.Guid":{modelType:"Guid"},"Edm.Int16":{modelType:"Int"},"Edm.Int32":{modelType:"Int"},"Edm.Int64":{modelType:"Int"},"Edm.SByte":{modelType:"Int"},"Edm.Single":{modelType:"Float"},"Edm.String":{modelType:"String"},"Edm.Time":{modelType:"TimeOfDay"},"Edm.TimeOfDay":{modelType:"TimeOfDay"},"Edm.Stream":{}};function _(){this.control.detachModelContextChange(_,this);var M=this.modelName,o=this.control.getModel(M);if(o){this.resolve(o);}else{this.control.attachModelContextChange(_,this);}}D.FilterRestrictions={REQUIRED_PROPERTIES:"RequiredProperties",NON_FILTERABLE_PROPERTIES:"NonFilterableProperties",ALLOWED_EXPRESSIONS:"FilterAllowedExpressions"};D.getLocalizedText=function(t,o){var M=/{([A-Za-z0-9_.|@]+)>([A-Za-z0-9_.|]+)}/.exec(t);if(M){var r=o.getModel(M[1]).getResourceBundle();return r.getText(M[2]);}return t;};D.getCustomData=function(o,p,M){if(M){var e=M.getAggregation(o,"customData").filter(function(f){return M.getProperty(f,"key")===p;});if(e.length===1){return M.getProperty(e[0],"value");}return undefined;}else{if(o&&p){if(o instanceof window.Element){return o.getAttributeNS(N,p);}if(o.data instanceof Function){return o.data(p);}}return undefined;}};D.setCustomData=function(o,p,v){if(o&&p){if(o instanceof window.Element){return o.setAttributeNS(N,"customData:"+p,v);}if(o.data instanceof Function){return o.data(p,v);}}};D.fetchPropertiesForEntity=function(e,M){return M.requestObject(e+"/");};D.fetchAnnotationsForEntity=function(e,M){return M.requestObject(e+"@");};D.fetchModel=function(o){return new Promise(function(r,e){var M=o.getDelegate().payload&&o.getDelegate().payload.modelName,f={modelName:M,control:o,resolve:r};_.call(f);});};D.loadMacroLibrary=function(){return new Promise(function(r,e){sap.ui.require(["sap/fe/macros/macroLibrary"],function(){r();});});};D.templateControlFragment=function(f,p,o,M){o=o||{};if(M){return M.templateControlFragment(f,p,o.view).then(function(e){return M.targets==="xmlTree"&&e.length>0?e[0]:e;});}else{return this.loadMacroLibrary().then(function(){return a.process(X.loadTemplate(f,"fragment"),{name:f},p);}).then(function(e){var g=e.firstElementChild;if(!!o.isXML&&g){return g;}return b.load({id:o.id,definition:e,controller:o.controller});});}};D.doesValueHelpExist=function(p){var P=p.sPropertyName||"",v=p.sValueHelpType||"",M=p.oMetaModel,o=p.oModifier,O=p.sBindingPath+"/"+P,e=M.createBindingContext(O),s=d.valueHelpProperty(e);if(s.indexOf("$Path")>-1){s=M.getObject(s);}var g=V.generateID(p.flexId,S.generate([o?o.getId(p.oControl):p.oControl.getId(),v]),c.getNavigationPath(O,true),c.getNavigationPath(s,true));var f=o?o.getAggregation(p.oControl,"dependents"):p.oControl.getAggregation("dependents");return Promise.resolve(f&&f.some(function(h){return o?o.getId(h)===g:h.getId()===g;}));};D.isValueHelpRequired=function(p,i){var P=p.sPropertyName||"",M=p.oMetaModel,s=p.sBindingPath+"/"+P,o=M.createBindingContext(s),v=d.valueHelpProperty(o,i);return Promise.all([M.requestObject(v+"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues"),M.requestObject(v+"@com.sap.vocabularies.Common.v1.ValueListReferences"),M.requestObject(v+"@com.sap.vocabularies.Common.v1.ValueListMapping"),M.requestObject(v+"@com.sap.vocabularies.Common.v1.ValueList")]).then(function(r){return r[0]||r[1]||r[2]||r[3];});};D.isTypeFilterable=function(t){return t&&t in m&&!!m[t].modelType;};D.getModelType=function(t){return t&&t in m&&m[t].modelType;};D.isMultiValue=function(p){var i=true;switch(p.filterExpression){case"SearchExpression":case"SingleRange":case"SingleValue":i=false;break;default:break;}if(p.type&&p.type.indexOf("Boolean")>0){i=false;}return i;};D.getFilterRestrictions=function(f,r){var e=D.FilterRestrictions;if(r===e.REQUIRED_PROPERTIES||r===e.NON_FILTERABLE_PROPERTIES){var p=[];if(f&&f[r]){p=f[r].map(function(P){return P.$PropertyPath;});}return p;}else if(r===e.ALLOWED_EXPRESSIONS){var A={};if(f&&f.FilterExpressionRestrictions){f.FilterExpressionRestrictions.forEach(function(P){A[P.Property.$PropertyPath]=P.AllowedExpressions;});}return A;}return f;};return D;});
