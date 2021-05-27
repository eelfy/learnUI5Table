/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/mdc/odata/v4/TableDelegate","sap/fe/macros/table/TableDelegateBaseMixin","sap/fe/macros/CommonHelper","sap/fe/macros/DelegateUtil"],function(B,T,C,D){"use strict";var A=Object.assign({},B,T,{_getDelegateParentClass:function(){return B;},fetchPropertyExtensions:function(t){var c=C.parseCustomData(D.getCustomData(t,"aggregates"));return Promise.resolve(c||{});}});return A;},false);
