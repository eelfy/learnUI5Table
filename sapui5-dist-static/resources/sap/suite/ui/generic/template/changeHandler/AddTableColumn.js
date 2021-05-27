/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/m/changeHandler/AddTableColumn","sap/suite/ui/generic/template/changeHandler/generic/AddElement","sap/suite/ui/generic/template/genericUtilities/testableHelper"],function(U,A,a,t){"use strict";var b={};var L="com.sap.vocabularies.UI.v1.LineItem";var D="com.sap.vocabularies.UI.v1.DataField";var I="com.sap.vocabularies.UI.v1.Importance";var c="com.sap.vocabularies.UI.v1.ImportanceType/High";var u=-1;var g=function(o,d){var p=o.getAggregation("columns");var h=p[u];var i=U.getLineItemRecordIndex(h,d);if(!i||i<0){i=p.length;}return i;};b.applyChange=function(C,o,p){var d=C.getDefinition();if(!d.transferred){var P=C.getContent().customChanges[0].oParentSelector;var s=p.modifier.bySelector(P);a.applyChange(C,s,p);}};b.revertChange=function(C,o,p){};b.completeChangeContent=function(C,s,p){var m=U.getMetaModel(s,p),T=p.modifier.bySelector(s.parentId,p.appComponent),e=U.getEntityType(T),E=m.getODataEntityType(e),n;for(var i=0;i<E.property.length;i++){if(E.property[i].name===s.bindingPath){n=E.property[i];break;}}var N={Value:{Path:s.bindingPath},RecordType:D,EdmType:n&&n.type};N[I]={EnumMember:c};u=s.index;s.custom={};s.custom.annotation=L;s.custom.oAnnotationTermToBeAdded=N;s.custom.AddConcreteElement=A;s.custom.fnGetAnnotationIndex=g;a.completeChangeContent(C,s,p);};t.testableStatic(g,"AddTableColumn_getAnnotationIndex");return b;},true);
