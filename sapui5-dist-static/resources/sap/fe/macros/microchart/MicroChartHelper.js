/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","sap/m/library"],function(L,m){"use strict";var V=m.ValueColor;var M={getCriticalityCalculationBinding:function(i,v,d,t,a,A,T,D){var c=V.Neutral;v="%"+v;d=d||-Infinity;t=t||d;a=a||t;D=D||Infinity;T=T||D;A=A||T;d=d&&(+d?+d:"%"+d);t=t&&(+t?+t:"%"+t);a=a&&(+a?+a:"%"+a);A=A&&(+A?+A:"%"+A);T=T&&(+T?+T:"%"+T);D=D&&(+D?+D:"%"+D);if(i.indexOf("Minimize")>-1){c="{= "+v+" <= "+A+" ? '"+V.Good+"' : "+v+" <= "+T+" ? '"+V.Neutral+"' : "+"("+D+" && "+v+" <= "+D+") ? '"+V.Critical+"' : '"+V.Error+"' }";}else if(i.indexOf("Maximize")>-1){c="{= "+v+" >= "+a+" ? '"+V.Good+"' : "+v+" >= "+t+" ? '"+V.Neutral+"' : "+"("+d+" && "+v+" >= "+d+") ? '"+V.Critical+"' : '"+V.Error+"' }";}else if(i.indexOf("Target")>-1){c="{= ("+v+" <= "+A+" && "+v+" >= "+a+") ? '"+V.Good+"' : "+"(("+v+" >= "+t+" && "+v+" < "+a+") || ("+v+" > "+A+" && "+v+" <= "+T+")) ? '"+V.Neutral+"' : "+"(("+d+" && ("+v+" >= "+d+") && ("+v+" < "+t+")) || (("+v+" > "+T+") && "+D+" && ("+v+" <= "+D+"))) ? '"+V.Critical+"' : '"+V.Error+"' }";}else{L.warning("Case not supported, returning the default Value Neutral");}return c;},getCriticalityBinding:function(d){var c=V.Neutral,C=d.Criticality,s;if(C){if(C.$Path){s=C.$Path;c="{= (${"+s+"} === 'Negative' || ${"+s+"} === '1' || ${"+s+"} === 1 ) ? '"+V.Error+"' : "+"(${"+s+"} === 'Critical' || ${"+s+"} === '2' || ${"+s+"} === 2 ) ? '"+V.Critical+"' : "+"(${"+s+"} === 'Positive' || ${"+s+"} === '3' || ${"+s+"} === 3 ) ? '"+V.Good+"' : '"+V.Neutral+"'}";}else if(C.$EnumMember){c=M._getCriticalityFromEnum(C.$EnumMember);}else{L.warning("Case not supported, returning the default Value Neutral");}}else{L.warning("Case not supported, returning the default Value Neutral");}return c;},getThresholdColor:function(v,c){var C=c.context;var p=C.getPath();var t=V.Neutral;if(p.indexOf("DeviationRange")>-1){t=V.Error;}else if(p.indexOf("ToleranceRange")>-1){t=V.Critical;}return t;},_getCriticalityFromEnum:function(c){var i;if(c==="com.sap.vocabularies.UI.v1.CriticalityType/Negative"){i=V.Error;}else if(c==="com.sap.vocabularies.UI.v1.CriticalityType/Positive"){i=V.Good;}else if(c==="com.sap.vocabularies.UI.v1.CriticalityType/Critical"){i=V.Critical;}else{i=V.Neutral;}return i;},getMeasureAttributeIndex:function(i,c){var a=c.Measures,b=c.MeasureAttributes,s=a&&a[i]&&a[i].$PropertyPath,d=-1,C=function(f,o,g){if((o&&o.Measure&&o.Measure.$PropertyPath)===f){d=g;return true;}},e=b.some(C.bind(null,s));return e&&d>-1&&d;},getMeasurePropertyPaths:function(c,e,C){var p=[];if(!e){L.warning("FE:Macro:MicroChart : Couldn't find annotations for the DataPoint.");return;}c.Measures.forEach(function(s,i){var a=M.getMeasureAttributeIndex(i,c),o=a>-1&&c.MeasureAttributes&&c.MeasureAttributes[a],d=o&&e&&e[o.DataPoint.$AnnotationPath];if(d&&d.Value&&d.Value.$Path){p.push(d.Value.$Path);}else{L.warning("FE:Macro:MicroChart : Couldn't find DataPoint(Value) measure for the measureAttribute "+C+" MicroChart.");}});return p.join(",");},getMeasureAttributeForMeasure:function(c){var o=c.getModel(),s=c.getPath(),C=s.substring(0,s.lastIndexOf("Measure")),i=s.replace(/.*\//,"");return o.requestObject(C).then(function(a){var b=a.MeasureAttributes,d=M.getMeasureAttributeIndex(i,a);var e=d>-1&&b[d]&&b[d].DataPoint?C+"MeasureAttributes/"+d+"/":L.warning("DataPoint missing for the measure")&&undefined;return e?e+"DataPoint/$AnnotationPath/":e;});},getHiddenPathExpression:function(){if(!arguments[0]&&!arguments[1]){return true;}else if(arguments[0]===true||arguments[1]===true){return false;}else{var h=[];[].forEach.call(arguments,function(a){if(a&&a.$Path){h.push("%{"+a.$Path+"}");}});return"{= "+h.join(" || ")+" === true ? false : true }";}},isNotAlwaysHidden:function(c,v,s,a,b){if(a===true){this.logError(c,v);}if(b===true){this.logError(c,s);}if(a===undefined&&b===undefined){return true;}else{return((!a||a.$Path)&&a!==undefined)||((!b||b.$Path)&&b!==undefined)?true:false;}},logError:function(c,v){L.error("Measure Property "+v.$Path+" is hidden for the "+c+" Micro Chart");},formatDecimal:function(p,P,f){var c=[],F=["style: 'short'"],s=f||(P&&P.$Scale)||1,b;if(p){if(P.$Nullable!=undefined){c.push("nullable: "+P.$Nullable);}if(P.$Precision!=undefined){F.push("precision: "+(P.$Precision?P.$Precision:"1"));}c.push("scale: "+(s==="variable"?"'"+s+"'":s));b="{ path: '"+p+"'"+", type: 'sap.ui.model.odata.type.Decimal', constraints: { "+c.join(",")+" }, formatOptions: { "+F.join(",")+" } }";}return b;},getSelectParameters:function(){var p=[],c=arguments[1],P=[];if(arguments[0]){P.push("$$groupId : '"+arguments[0]+"'");}if(arguments[2]){p.push(arguments[2]);}else if(c){for(var k in c){if(!c[k].$EnumMember&&c[k].$Path){p.push(c[k].$Path);}}}for(var i=3;i<arguments.length;i++){if(arguments[i]){p.push(arguments[i]);}}if(p.length){P.push("$select : '"+p.join(",")+"'");}return P.join(",");},getDataPointQualifiersForMeasures:function(c,e,C){var q=[],a=c.MeasureAttributes,A=function(o){var s=o.$PropertyPath,Q;a.forEach(function(b){if(e&&(b&&b.Measure&&b.Measure.$PropertyPath)===s&&b.DataPoint&&b.DataPoint.$AnnotationPath){var d=b.DataPoint.$AnnotationPath;if(e[d]){Q=d.indexOf("#")?d.split("#")[1]:"";q.push(Q);}}});if(Q===undefined){L.warning("FE:Macro:MicroChart : Couldn't find DataPoint(Value) measure for the measureAttribute for "+C+" MicroChart.");}};if(!e){L.warning("FE:Macro:MicroChart : Couldn't find annotations for the DataPoint "+C+" MicroChart.");}c.Measures.forEach(A);return q.join(",");},logWarning:function(c,e){for(var k in e){var v=e[k];if(!v){L.warning(k+" parameter is missing for the "+c+" Micro Chart");}}},getDisplayValueForMicroChart:function(d,p,v,o){var s=d.ValueFormat&&d.ValueFormat.NumberOfFractionalDigits,r;if(p){r=M.formatDecimal(p["$Path"],v,s);}else{r=M.formatDecimal(d.Value["$Path"],o,s);}return r;},shouldMicroChartRender:function(c,d,D,C,o){var a=["Area","Column","Comparison"],s=d&&d.Value,h=D&&D["com.sap.vocabularies.UI.v1.Hidden"],b=C&&C.Dimensions&&C.Dimensions[0],f=a.indexOf(c)>-1?s&&b:s;if(c==="Harvey"){var e=d&&d.MaximumValue,g=o&&o["com.sap.vocabularies.UI.v1.Hidden"];return(s&&e&&M.isNotAlwaysHidden("Bullet",s,e,h,g));}return f&&M.isNotAlwaysHidden(c,s,undefined,h);},getdataPointQualifiersForMicroChart:function(u){if(u.indexOf("com.sap.vocabularies.UI.v1.DataPoint")===-1){return undefined;}if(u.indexOf("#")>-1){return u.split("#")[1];}return"";},getcolorPaletteForMicroChart:function(d){return d.Criticality?undefined:"sapUiChartPaletteQualitativeHue1, sapUiChartPaletteQualitativeHue2, sapUiChartPaletteQualitativeHue3,          sapUiChartPaletteQualitativeHue4, sapUiChartPaletteQualitativeHue5, sapUiChartPaletteQualitativeHue6, sapUiChartPaletteQualitativeHue7,          sapUiChartPaletteQualitativeHue8, sapUiChartPaletteQualitativeHue9, sapUiChartPaletteQualitativeHue10, sapUiChartPaletteQualitativeHue11";},getMeasureScaleForMicroChart:function(d){if(d.ValueFormat&&d.ValueFormat.NumberOfFractionalDigits){return d.ValueFormat.NumberOfFractionalDigits;}if(d.Value&&d.Value["$Path"]&&d.Value["$Path"]["$Scale"]){return d.Value["$Path"]["$Scale"];}return 1;},getBindingExpressionForMicrochart:function(c,o,t,C,u,d){var b=C["$isCollection"]||C["$kind"]==="EntitySet",p=b?"":u,s=M.getCurrencyOrUnit(o),D="";switch(c){case"Radial":s="";break;case"Harvey":D=d.Criticality?d.Criticality["$Path"]:"";break;}var f=M.getSelectParameters(t.groupId,"",D,s),B="{ path: '"+p+"'"+", parameters : {"+f+"} }";return B;},getUOMPathForMicrochart:function(r,o){var R;if(o&&r){R=(o["@Org.OData.Measures.V1.ISOCurrency"]&&o["@Org.OData.Measures.V1.ISOCurrency"].$Path)||(o["@Org.OData.Measures.V1.Unit"]&&o["@Org.OData.Measures.V1.Unit"].$Path);}return R?R:"";},getAggregationForMicrochart:function(a,c,d,u,D,o,s){var p=c["$kind"]==="EntitySet"?"/":"",p=p+u,g="",b="",e=d.Criticality?d.Criticality["$Path"]:"",C=M.getUOMPathForMicrochart(true,o),t="",f="";if(D&&D.$PropertyPath&&D.$PropertyPath["@com.sap.vocabularies.Common.v1.Text"]){f=D.$PropertyPath["@com.sap.vocabularies.Common.v1.Text"].$Path;}else{f=D.$PropertyPath;}switch(a){case"Points":b=d&&d.CriticalityCalculation;t=d&&d.TargetValue&&d.TargetValue["$Path"];e="";break;case"Columns":b=d&&d.CriticalityCalculation;break;case"LinePoints":e="";break;case"Bars":f="";break;}var F=M.getSelectParameters(g,b,e,C,t,f,s),A="{path:'"+p+"'"+", parameters : {"+F+"} }";return A;},getCurrencyOrUnit:function(o){if(o["@Org.OData.Measures.V1.ISOCurrency"]){return o["@Org.OData.Measures.V1.ISOCurrency"].$Path||o["@Org.OData.Measures.V1.ISOCurrency"];}else if(o["@Org.OData.Measures.V1.Unit"]){return o["@Org.OData.Measures.V1.Unit"].$Path||o["@Org.OData.Measures.V1.Unit"];}else{return"";}},hasValidAnalyticalCurrencyOrUnit:function(o){if(o["@Org.OData.Measures.V1.ISOCurrency"]){if(o["@Org.OData.Measures.V1.ISOCurrency"].$Path){return"{= !!%{"+o["@Org.OData.Measures.V1.ISOCurrency"].$Path+"}}";}else{return o["@Org.OData.Measures.V1.ISOCurrency"]?"true":"";}}else if(o["@Org.OData.Measures.V1.Unit"]){if(o["@Org.OData.Measures.V1.Unit"].$Path){return"{= !!%{"+o["@Org.OData.Measures.V1.Unit"].$Path+"}}";}else{return o["@Org.OData.Measures.V1.Unit"]?"true":"";}}else{return"";}}};return M;},true);