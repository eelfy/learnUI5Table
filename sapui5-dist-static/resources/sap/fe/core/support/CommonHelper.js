sap.ui.define(["sap/ui/support/library","sap/fe/core/converters/helpers/IssueManager"],function(S,I){"use strict";var _={};var a=I.IssueSeverity;var b=I.IssueCategory;
/*!
   * ${copyright}
   */
var C=S.Categories,c=S.Severity,A=S.Audiences;_.Categories=C;_.Audiences=A;_.Severity=c;var g=function(s){switch(s){case a.Low:return c.Low;case a.High:return c.High;case a.Medium:return c.Medium;}};_.getSeverity=g;var d=function(i,o,e,f){var m=o.getComponents();var h;Object.keys(m).forEach(function(k){var l,n;var p=m[k];if((p===null||p===void 0?void 0:(l=p.getMetadata())===null||l===void 0?void 0:(n=l.getParent())===null||n===void 0?void 0:n.getName())==="sap.fe.core.AppComponent"){h=p;}});if(h){var j=h.getDiagnostics().getIssuesByCategory(b[e],f);j.forEach(function(E){i.addIssue({severity:g(E.severity),details:E.details,context:{id:E.category}});});}};_.getIssueByCategory=d;return _;},false);
