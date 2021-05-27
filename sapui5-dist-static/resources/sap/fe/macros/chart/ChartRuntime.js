/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/json/JSONModel","sap/fe/macros/CommonHelper","sap/fe/macros/chart/ChartUtils","sap/fe/macros/DelegateUtil"],function(J,C,a,D){"use strict";var b={fnUpdateChart:function(e){var m=e.getSource(),I=m.getAggregation("_chart"),A={},s,c=[];m.getCustomData().forEach(function(l){if(l.getKey()==="operationAvailableMap"){A=JSON.parse(D.getCustomData(m,"operationAvailableMap")&&D.getCustomData(m,"operationAvailableMap").customData);}else if(l.getKey()==="multiSelectDisabledActions"){s=l.getValue();c=s?s.split(","):[];}});var o=m.getBindingContext("internal");var S=[];var M;var d=a.getChartSelectedData(I);for(var i=0;i<d.length;i++){S.push(d[i].context);}o.setProperty("selectedContexts",S);o.getModel().setProperty(o.getPath()+"/numberOfSelectedContexts",I.getSelectedDataPoints().count);for(var j=0;j<S.length;j++){var f=S[j];var g=f.getObject();for(var k in g){if(k.indexOf("#")===0){var h=k;h=h.substring(1,h.length);M=o.getObject();M[h]=true;o.setProperty("",M);}}M=o.getObject();}this.setActionEnablement(o,A,S);if(S.length>1){c.forEach(function(l){o.setProperty(l,false);});}},setActionEnablement:function(I,A,s){for(var c in A){I.setProperty(c,false);var p=A[c];for(var i=0;i<s.length;i++){var S=s[i];var o=S.getObject();if(p===null&&!!o["#"+c]){I.setProperty(c,true);break;}else if(!!S.getObject(p)){I.setProperty(c,true);break;}}}}};return b;},true);
