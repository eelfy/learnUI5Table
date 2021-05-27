sap.ui.define(["sap/fe/core/helpers/BindingExpression","sap/fe/core/converters/helpers/BindingHelper","sap/fe/core/CommonUtils","sap/fe/macros/field/FieldTemplating","sap/fe/core/templating/EntitySetHelper"],function(B,a,C,F,E){"use strict";var _={};var i=E.isStickySessionSupported;var f=F.formatValueRecursively;var b=F.addTextArrangementToBindingExpression;var D=a.Draft;var U=a.UI;var c=B.compileBinding;var d=B.annotationExpression;var e=B.concat;var g=B.isEmpty;var h=B.ifElse;var j=B.and;var k=function(H,v,n){var o;var t=C.getTranslatedText("T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO",v.resourceBundle,null,v.entitySet);var p=C.getTranslatedText("T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE",v.resourceBundle,null,v.entitySet);var q=f(b(d((o=H===null||H===void 0?void 0:H.Title)===null||o===void 0?void 0:o.Value),n),n);return c(h(j(U.IsCreateMode,q&&g(q)),(H===null||H===void 0?void 0:H.TypeName)?e(p,": ",d(H.TypeName.toString())):t,q));};_.getExpressionForTitle=k;var l=function(H,n){var o;return c(f(b(d((o=H===null||H===void 0?void 0:H.Description)===null||o===void 0?void 0:o.Value),n),n));};_.getExpressionForDescription=l;var m=function(v,n){var s=C.getTranslatedText("T_OP_OBJECT_PAGE_SAVE",v.resourceBundle);var o=C.getTranslatedText("T_OP_OBJECT_PAGE_CREATE",v.resourceBundle);var p;if(i(n.startingEntitySet)){p=h(U.IsCreateModeSticky,o,s);}else{p=h(D.IsNewObject,o,s);}return c(p);};_.getExpressionForSaveButton=m;return _;},false);
