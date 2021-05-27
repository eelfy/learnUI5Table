sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils","sap/suite/ui/generic/template/designtime/virtualProperties/ChartMeasures","sap/suite/ui/generic/template/designtime/virtualProperties/ChartType","sap/base/util/deepExtend","./library.designtime"],function(U,D,C,a,d){"use strict";var H="com.sap.vocabularies.UI.v1.HeaderFacets";var F="com.sap.vocabularies.UI.v1.FieldGroup";var b="com.sap.vocabularies.UI.v1.DataPoint";var I="com.sap.vocabularies.UI.v1.Identification",c="com.sap.vocabularies.Communication.v1.Contact",A="com.sap.vocabularies.Communication.v1.Address",e="Chart",f="RatingIndicator_Aggregated",g="RatingIndicator_NonAggregated",h="ProgressIndicator",i="Form",j="KeyValue",k="Contact",l="Address",m="com.sap.vocabularies.UI.v1.Chart";var n={};n.getFacetType=function(E){var t=U.getTemplatingInfo(E),T=t&&t.value;if(T){if(T.indexOf(F)>-1||T.indexOf(I)>-1){return i;}else if(T.indexOf(A)>-1){return l;}else if(T.indexOf(c)>-1){return k;}else if(T.indexOf(b)>-1){var o=U.getEntityTypeFromAnnotationPath(E,T);var q=T.search("#");var Q=T.substring(q);var s=Q?b+Q:b;var p=o[s];if(p){if(p.Visualization&&p.Visualization.EnumMember==="com.sap.vocabularies.UI.v1.VisualizationType/Rating"){if(p.SampleSize){return f;}else{return g;}}else if(p.Visualization&&p.Visualization.EnumMember==="com.sap.vocabularies.UI.v1.VisualizationType/Progress"){return h;}else{return j;}}}else if(T.indexOf(m)>-1){return e;}}};n.getHeaderFacetProperties=function(o){var p=D.ignoreAllProperties(o);var P={visible:{ignore:false},vMeasures:{name:"Measures and Attributes",virtual:true,type:"Collection",ignore:function(o){var t=n.getFacetType(o);return t!==e;},visible:false,multiple:true,possibleValues:C.getMeasureDefinition.bind(o),get:function(o){return C.getMeasures.bind(o);},set:function(o,N,q){return C.setMeasures.bind(o,N,q);}}};return d({},p,P);};n.getDesigntime=function(E,o){var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();var p={actions:null,name:{singular:function(){return r.getText("FE_OBJECT_PAGE_HEADER_FACET");}}};if(o){p.properties=D.ignoreAllProperties(E);return p;}p.properties=n.getHeaderFacetProperties(E);if(E.getId().indexOf("Extension")>=0){return p;}var q={getCommonInstanceData:function(E){var t=U.getTemplatingInfo(E);if(t&&t.path){var T=t.target+'/'+t.path.substr(t.path.indexOf(H));return{target:T,annotation:t.annotation,qualifier:null};}},links:{developer:[{href:"/topic/17dbd5b7a61e4cdcb079062e976cd63f",text:function(){return r.getText("FE_OBJECT_PAGE_HEADER_FACETS");}}]},actions:{remove:{changeType:"removeHeaderFacet",changeOnRelevantContainer:true},reveal:{changeType:"revealHeaderFacet",changeOnRelevantContainer:true}},annotations:{referenceFacetForm:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","Label","ID"],expressionTypes:{Label:["String"]},mandatory:["Target"]},ignore:function(){var t=this.getFacetType(E);return t!==i;}.bind(this),links:{developer:[{href:"/topic/ebe05d52c43241c19aaf79dd5f1c69f1.html",text:function(){return r.getText("FE_SDK_GUIDE_FORM_FACET");}}]}},referenceFacetDataPoint:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},links:{developer:[{href:"/topic/c312735b7417423ea239394b3b4f4018",text:function(){return r.getText("FE_SDK_GUIDE_KEYVALUE_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==j;}.bind(this),refersTo:[{annotation:"dataPoint",referredBy:"Target"}]},referenceFacetRatingAggregated:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},links:{developer:[{href:"/topic/bcc12cbe038146a2a586ac021a20f3a7",text:function(){return r.getText("FE_SDK_GUIDE_RATING_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==f;}.bind(this),refersTo:[{annotation:"dataPointRatingAggregated",referredBy:"Target"}]},referenceFacetRatingNonAggregated:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},links:{developer:[{href:"/topic/bcc12cbe038146a2a586ac021a20f3a7",text:function(){return r.getText("FE_SDK_GUIDE_RATING_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==g;}.bind(this),refersTo:[{annotation:"dataPointRatingNonAggregated",referredBy:"Target"}]},referenceFacetChartDimensions:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},ignore:function(){var t=this.getFacetType(E);return t!==e;}.bind(this),refersTo:[{annotation:"chartWithDimensions",referredBy:"Target"}],links:{developer:[{href:"/topic/e219fd0c85b842c69ac3a514e712ece5",text:function(){return r.getText("FE_SDK_GUIDE_CHART_FACET");}}]}},referenceFacetChartNoDimensions:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},ignore:function(){var t=this.getFacetType(E);return t!==e;}.bind(this),refersTo:[{annotation:"chartNoDimensions",referredBy:"Target"}],links:{developer:[{href:"/topic/e219fd0c85b842c69ac3a514e712ece5",text:function(){return r.getText("FE_SDK_GUIDE_CHART_FACET");}}]}},chartWithDimensions:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Chart",ignore:function(){var s=a.getChartType(E);return s===undefined||s!=="Area";},target:["EntityType"],whiteList:{properties:["Title","Description","Dimensions","vMeasures"],mandatory:["Dimensions","vMeasures"]},links:{developer:[{href:"/topic/e219fd0c85b842c69ac3a514e712ece5",text:function(){return r.getText("FE_SDK_GUIDE_CHART_FACET");}}]}},chartNoDimensions:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Chart",ignore:function(){var s=a.getChartType(E);return s===undefined||s==="Area";},target:["EntityType"],whiteList:{properties:["Title","Description","vMeasures"],mandatory:["vMeasures"]},links:{developer:[{href:"/topic/e219fd0c85b842c69ac3a514e712ece5",text:function(){return r.getText("FE_SDK_GUIDE_CHART_FACET");}}]}},referenceFacetProgress:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},links:{developer:[{href:"/topic/3b5e01c647f44ea98655b8c08feba780",text:function(){return r.getText("FE_SDK_GUIDE_PROGRESS_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==h;}.bind(this),refersTo:[{annotation:"dataPointProgress",referredBy:"Target"}]},referenceFacetContact:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},links:{developer:[{href:"/topic/214dc25fb47f42c6a0091dfe71e87950",text:function(){return r.getText("FE_SDK_GUIDE_CONTACT_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==k;}.bind(this),refersTo:[{annotation:"contact",referredBy:"Target"}]},referenceFacetAddress:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","ID"],mandatory:["Target"]},links:{developer:[{href:"/topic/0b73cbbeda344d88b5d0f8bea4d4498e",text:function(){return r.getText("FE_SDK_GUIDE_ADDRESS_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==l;}.bind(this),refersTo:[{annotation:"address",referredBy:"Target"}]},dataPointRatingAggregated:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPoint",target:["EntityType"],links:{developer:[{href:"/topic/bcc12cbe038146a2a586ac021a20f3a7",text:function(){return r.getText("FE_SDK_GUIDE_RATING_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==f;}.bind(this),whiteList:{properties:["Value","Title","TargetValue","SampleSize"],mandatory:["Value","Title"]}},dataPointRatingNonAggregated:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPoint",target:["EntityType"],links:{developer:[{href:"/topic/a797173b84724ef1bc54d59dc575e52f",text:function(){return r.getText("FE_SDK_GUIDE_RATING_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==g;}.bind(this),whiteList:{properties:["Value","Title","TargetValue","Description"],mandatory:["Value","Title"]}},dataPointProgress:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPoint",target:["EntityType"],links:{developer:[{href:"/topic/3b5e01c647f44ea98655b8c08feba780",text:function(){return r.getText("FE_SDK_GUIDE_PROGRESS_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return t!==h;}.bind(this),whiteList:{properties:["Value","TargetValue"],mandatory:["Value"],expressionTypes:{Value:["Path"],TargetValue:["Path","String","Int","Decimal"]}}},dataPoint:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataPoint",target:["EntityType"],links:{developer:[{href:"/topic/c312735b7417423ea239394b3b4f4018",text:function(){return r.getText("FE_SDK_GUIDE_KEYVALUE_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return(t!==j);}.bind(this),whiteList:{properties:["Value","Title"],mandatory:["Value","Title"]}},contact:{namespace:"com.sap.vocabularies.Communication.v1",annotation:"Contact",target:["EntityType"],links:{developer:[{href:"/topic/214dc25fb47f42c6a0091dfe71e87950",text:function(){return r.getText("FE_SDK_GUIDE_CONTACT_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return(t!==k);}.bind(this),whiteList:{properties:["fn","n","tel","email","photo","title","org","role"],expressionTypes:{fn:["Path"],photo:["Path"],title:["Path"],org:["Path"],role:["Path"]}}},address:{namespace:"com.sap.vocabularies.Communication.v1",annotation:"Address",target:["EntityType"],links:{developer:[{href:"/topic/0b73cbbeda344d88b5d0f8bea4d4498e",text:function(){return r.getText("FE_SDK_GUIDE_ADDRESS_FACET");}}]},ignore:function(){var t=this.getFacetType(E);return(t!==l);}.bind(this),whiteList:{properties:["label"],mandatory:["label"]}}}};return d(p,q);};return n;});
