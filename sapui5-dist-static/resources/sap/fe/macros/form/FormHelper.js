/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/odata/v4/AnnotationHelper","sap/fe/macros/CommonHelper"],function(O,C){"use strict";var F={checkIfCollectionFacetNeedsToBeRendered:function(c,p){if(c.$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"&&c.Facets.length){var f=function(a,R){var b=R["@com.sap.vocabularies.UI.v1.PartOfPreview"];return((a!=="false"&&b!==false)||(a==="false"&&b===false));};var r=c.Facets;return r.some(f.bind(null,p));}return false;},isReferenceFacetPartOfPreview:function(r,p){if(r.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"){var a=r["@com.sap.vocabularies.UI.v1.PartOfPreview"];return((p==="true"&&a!==false)||(p==="false"&&a===false));}return false;},create$Select:function(s){var S="";s.forEach(function(o){S+=S?","+o.$PropertyPath:o.$PropertyPath;});return S;},generateBindingExpression:function(n,s){if(!n&&!s){return"";}var b={path:n||""};if(s){b.parameters={$select:F.create$Select(s)};}return JSON.stringify(b);},getNavigationPath:function(e){var p=e.getPath?e.getPath():e;return p;}};return F;},true);
