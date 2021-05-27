/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/odata/MetadataAnalyser","sap/ui/comp/odata/ChartMetadata","sap/ui/comp/odata/FiscalMetadata","sap/ui/comp/odata/CalendarMetadata","sap/ui/comp/odata/ODataType","./ControlProvider","sap/ui/core/format/DateFormat"],function(M,C,F,a,O,b,D){"use strict";var c=function(p){if(p){this._oParentODataModel=p.model;this.sEntitySet=p.entitySet;this._sIgnoredFields=p.ignoredFields;this._bSkipAnnotationParse=p.skipAnnotationParse==="true";this._sChartQualifier=p.chartQualifier;this._sPresentationVariantQualifier=p.presentationVariantQualifier;this._oDefaultDropDownDisplayBehaviour=p.defaultDropDownDisplayBehaviour;this._bUseTimeseries=p.useTimeSeries;try{this._oDateFormatSettings=p.dateFormatSettings?JSON.parse(p.dateFormatSettings):undefined;if(!this._oDateFormatSettings.hasOwnProperty("UTC")){this._oDateFormatSettings["UTC"]=true;}}catch(e){}if(p.chartLibrary){C.feedWithChartLibrary(p.chartLibrary);}}this._aODataFieldMetadata=[];this._oChartViewMetadata=null;this._oChartDataPointMetadata=null;this._aIgnoredFields=[];this._oMetadataAnalyser=new M(this._oParentODataModel);this._intialiseMetadata();};c.prototype._intialiseMetadata=function(){var o,d=[],f,i,l=0;this._aODataFieldMetadata=this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntitySet);this._sFullyQualifiedEntityTypeName=this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.sEntitySet);if(!this._bSkipAnnotationParse){this._oPresentationVariant=this._oMetadataAnalyser.getPresentationVariantAnnotation(this._sFullyQualifiedEntityTypeName,this._sPresentationVariantQualifier);if(this._oPresentationVariant&&this._oPresentationVariant.chartAnnotation){this._oChartAnnotation=this._oPresentationVariant.chartAnnotation;}else{this._oChartAnnotation=this._oMetadataAnalyser.getChartAnnotation(this._sFullyQualifiedEntityTypeName,this._sChartQualifier);}}if(!this._oDefaultDropDownDisplayBehaviour){this._oDefaultDropDownDisplayBehaviour=this._oMetadataAnalyser.getTextArrangementValue(this._sFullyQualifiedEntityTypeName);}this._generateIgnoredFieldsArray();this._oControlProvider=new b({metadataAnalyser:this._oMetadataAnalyser,model:this._oParentODataModel,fieldsMetadata:this._aODataFieldMetadata,dateFormatSettings:this._oDateFormatSettings,defaultDropDownDisplayBehaviour:this._oDefaultDropDownDisplayBehaviour,enableDescriptions:false,entitySet:this.sEntitySet});if(this._aODataFieldMetadata){this._prepareHierarchy();l=this._aODataFieldMetadata.length;}for(i=0;i<l;i++){f=this._aODataFieldMetadata[i];if(this._aIgnoredFields.indexOf(f.name)>-1||!f.visible){continue;}if(f.type.indexOf("Edm.")===0){o=this._getFieldViewMetadata(f);this._enrichWithChartViewMetadata(f,o);d.push(f);}}if(this._oChartAnnotation){this._oChartViewMetadata=Object.assign({},this._oChartAnnotation);this._oChartViewMetadata.chartType=C.getChartType(this._oChartViewMetadata.chartType);this._oChartViewMetadata.fields=d;}};c.prototype._prepareHierarchy=function(){for(var i=0;i<this._aODataFieldMetadata.length;i++){if(this._aODataFieldMetadata[i].hierarchy){for(var j=0;j<this._aODataFieldMetadata.length;j++){this._aODataFieldMetadata[j].hierarchy=this._aODataFieldMetadata[j].hierarchy||{};this._aODataFieldMetadata[j].hierarchy.up=this._aODataFieldMetadata[j].hierarchy.up||{};if(this._aODataFieldMetadata[i].hierarchy.field===this._aODataFieldMetadata[j].name){this._aODataFieldMetadata[i].hierarchy.down=this._getFieldViewMetadata(this._aODataFieldMetadata[j]);this._aODataFieldMetadata[j].hierarchy.up[this._aODataFieldMetadata[i].hierarchy.type]=this._getFieldViewMetadata(this._aODataFieldMetadata[i]);}}}}};c.prototype._setAnnotationMetadata=function(f){if(f&&f.fullName){var s=this._oMetadataAnalyser.getSemanticObjectsFromAnnotation(f.fullName);if(s){f.semanticObjects=s;}}};c.prototype._getFieldViewMetadata=function(f){var o=this._oControlProvider.getFieldViewMetadata(f,false);this._setAnnotationMetadata(o);return o;};c.prototype._generateIgnoredFieldsArray=function(){if(this._sIgnoredFields){this._aIgnoredFields=this._sIgnoredFields.split(",");}};c.prototype._enrichWithChartViewMetadata=function(f,v){function i(R,d,o){if(d.aggregationRole){return d.aggregationRole===R;}if(o){var e=R=="dimension"?o.dimensionFields:o.measureFields;return e&&e.indexOf(d.name)!=-1;}return false;}f.isMeasure=i("measure",f,this._oChartAnnotation);f.isDimension=i("dimension",f,this._oChartAnnotation);f.isHierarchyDimension=f.hierarchy&&f.hierarchy.type===M.hierarchyType.nodeFor&&i("dimension",f.hierarchy.down,this._oChartAnnotation);f.quickInfo=v.quickInfo;f.modelType=v.modelType;f.hasValueListAnnotation=v.hasValueListAnnotation;f.fullName=v.fullName;f.timeUnitType=this._getTimeUnitType(f);f.dateFormatter=this._getDateFormatter(f);f.isTimeDimension=f.timeUnitType!==undefined;f.role=this._getRole(f);f.hierarchyLevel=this._getHierarchyLevel(f);f.dataPoint=this._getDataPoint(f);f.filterType=v.filterType;if(v.template){f.template=v.template;}if(f.isDimension){f.displayBehaviour=v.displayBehaviour;}else if(f.isHierarchyDimension){var r=f.hierarchy.up[M.hierarchyType.nodeExternalKeyFor]||v;f.displayBehaviour=r.displayBehaviour;f.description=r.description||r.name;}f.isSemanticObject=(v.semanticObjects)?true:false;this._setInResult(f);this._setSortOrder(f);};c.prototype._getTimeUnitType=function(f){var t;if(f.type==="Edm.String"){if(f.isCalendarDate){t="yearmonthday";}if(a.isYearWeek(f)){t="yearweek";}if(a.isYearMonth(f)){t="yearmonth";}if(a.isYearQuarter(f)){t="yearquarter";}if(F.isFiscalYear(f)){t="fiscalyear";}if(F.isFiscalYearPeriod(f)){t="fiscalyearperiod";}}return t;};c.prototype._getDateFormatter=function(f){var d,e;switch(f.type){case"Edm.Date":e=D.getDateInstance(this._oDateFormatSettings);break;case"Edm.Time":e=D.getTimeInstance(this._oDateFormatSettings);break;case"Edm.DateTimeOffset":case"Edm.DateTime":if(f.displayFormat==="Date"){e=D.getDateInstance(this._oDateFormatSettings);}else{e=D.getDateTimeInstance(this._oDateFormatSettings);}break;case"Edm.String":if(f.isCalendarDate&&this._oDateFormatSettings){var o;var s={isCalendarDate:true};if(!d){var S=O.getType("Edm.String",this._oDateFormatSettings,o,s);d=function(v){return S.formatValue(v,"string");};}}else if(!this._bUseTimeseries){var o;var s={isCalendarDate:true};d=this._getDateFormatterForAnnotation(f,o,s);}break;}if(e){d=function(t){if(!t){return null;}var g=new Date(t);return e.format(g);};}return d;};c.prototype._getDateFormatterForAnnotation=function(f,o,s){var d={};var p=this._getParserSettingsForAnnotation(f);var P=this._getParserPrefixForAnnotation(f);if(this._oDateFormatSettings){Object.assign(d,this._oDateFormatSettings);}d.pattern=this._getFormatterPatternForAnnotation(f);if(d.pattern){var S=O.getType("Edm.String",d,o,s);var e=function(v){v=D.getInstance({pattern:p}).parse(v);return P+S.formatValue(v,"string");};return e;}};c.prototype._getParserPrefixForAnnotation=function(f){if(a.isYearWeek(f)){return"CW ";}else if(a.isYearQuarter(f)){return"Q";}return"";};c.prototype._getParserSettingsForAnnotation=function(f){if(f.type==="Edm.String"){var s;if(a.isYearWeek(f)){s="yyyyww";}else if(a.isYearMonth(f)){s="yyyyMM";}else if(a.isYearQuarter(f)){s="yyyyQQQQQ";}return s;}};c.prototype._getFormatterPatternForAnnotation=function(f){if(f.type==="Edm.String"){var s;if(f.isCalendarDate){s="d MMMM y";}else if(a.isYearWeek(f)){s="ww y";}else if(a.isYearMonth(f)){s="MMMM y";}else if(a.isYearQuarter(f)){s="Q y";}return s;}};c.prototype._setInResult=function(f){if(this._oPresentationVariant){if(this._oPresentationVariant.requestAtLeastFields&&this._oPresentationVariant.requestAtLeastFields.indexOf(f.name)>-1){f.inResult=true;}}};c.prototype._setSortOrder=function(f){f.sorted=false;f.sortOrder="Ascending";var l;if(this._oPresentationVariant&&this._oPresentationVariant.sortOrderFields){l=this._oPresentationVariant.sortOrderFields.length;for(var i=0;i<l;i++){if(this._oPresentationVariant.sortOrderFields[i].name===f.name){f.sorted=true;f.sortOrder=this._oPresentationVariant.sortOrderFields[i].descending?"Descending":"Ascending";f.sortIndex=i;break;}}}};c.prototype._unmarkTextDimensions=function(f,t){var i,o;for(i=0;i<f.length;i++){o=f[i];if(o.isDimension){if(t.indexOf(o.name)>-1){o.isDimension=false;}}}};c.prototype._getRole=function(f){if(this._oChartAnnotation){if((f.isDimension||f.isHierarchyDimension)&&this._oChartAnnotation.dimensionAttributes[f.name]){return C.getDimensionRole(this._oChartAnnotation.dimensionAttributes[f.name].role);}else if(f.isMeasure&&this._oChartAnnotation.measureAttributes[f.name]){return C.getMeasureRole(this._oChartAnnotation.measureAttributes[f.name].role);}}};c.prototype._getHierarchyLevel=function(f){if(this._oChartAnnotation){if(f.isHierarchyDimension&&this._oChartAnnotation.dimensionAttributes[f.name]){var l=null;try{l=parseInt(this._oChartAnnotation.dimensionAttributes[f.name].hierarchyLevel);}catch(e){l=0;}return l;}return 0;}};c.prototype._getTextPropertyForHierachyDimension=function(f){var r=f.hierarchy.up[M.hierarchyType.nodeExternalKeyFor]||f;return r.description||r.name;};c.prototype._getDataPoint=function(f){if(this._oChartAnnotation&&f.isMeasure&&this._oChartAnnotation.measureAttributes[f.name]&&this._oChartAnnotation.measureAttributes[f.name].dataPoint){var d=this._oChartAnnotation.measureAttributes[f.name].dataPoint;var e=d.split("#");var q=e.length===2?e[1]:"";return this._getMeasureDataPoint(q,f.name);}return null;};c.prototype.getChartViewMetadata=function(){return this._oChartViewMetadata;};c.prototype.getViewField=function(d){var f=this._oChartViewMetadata.fields.filter(function(e){return e.name===d;})[0];return f;};c.prototype.getChartDataPointMetadata=function(){if(!this._oChartDataPointMetadata&&this._sFullyQualifiedEntityTypeName){this._oChartDataPointMetadata=this._oMetadataAnalyser.getDataPointAnnotation(this._sFullyQualifiedEntityTypeName);}return this._oChartDataPointMetadata;};c.prototype._getMeasureDataPoint=function(q,m){var o=this.getChartDataPointMetadata();if(o){var d=null;if(q){if(o.additionalAnnotations){d=o.additionalAnnotations[q];}}else if(o.primaryAnnotation){d=o.primaryAnnotation;}if(d!=null&&d.Value&&d.Value.Path==m){return d;}}return null;};c.prototype.getIsUTCDateHandlingEnabled=function(){return this._oDateFormatSettings?this._oDateFormatSettings.UTC:false;};c.prototype.destroy=function(){if(this._oMetadataAnalyser&&this._oMetadataAnalyser.destroy){this._oMetadataAnalyser.destroy();}this._oMetadataAnalyser=null;if(this._oControlProvider&&this._oControlProvider.destroy){this._oControlProvider.destroy();}this._oControlProvider=null;this._aODataFieldMetadata=null;this._oChartViewMetadata=null;this._oChartDataPointMetadata=null;this._sIgnoredFields=null;this.bIsDestroyed=true;};c.prototype.provideSemanticColoring=function(d){var o={};if(d.Criticality){if(d.Criticality.Path){o={Calculated:d.Criticality.Path};}else{o={Static:C.getCriticalityType(d.Criticality.EnumMember)};}}else{var t={};var e=this._buildThresholds(t,d.CriticalityCalculation);if(e){o={ConstantThresholds:t};}else{o={DynamicThresholds:t};}}return o;};c.prototype.calculateDimensionColoring=function(d){var v=C.getValueCriticality(d);if(!v){return null;}var V,o,e={Positive:{Values:[]},Critical:{Values:[]},Negative:{Values:[]},Neutral:{Values:[]}};for(var i=0;i<v.length;i++){o=v[i];V=C.calculateValue(o.Value);if(o.Criticality.EnumMember.endsWith("Positive")){e.Positive.Values.push(V);}else if(o.Criticality.EnumMember.endsWith("Critical")){e.Critical.Values.push(V);}else if(o.Criticality.EnumMember.endsWith("Negative")){e.Negative.Values.push(V);}else{e.Neutral.Values.push(V);}}return e;};c.prototype._buildThresholds=function(t,o){var d=true;t.ImprovementDirection=C.getImprovementDirectionType(o.ImprovementDirection.EnumMember);var v=C.getCriticalityThresholds();var l=v.length;var e={oneSupplied:false};var f={oneSupplied:false};for(var i=0;i<l;i++){e[v[i]]=o[v[i]]?o[v[i]].Path:undefined;e.oneSupplied=e.oneSupplied||e[v[i]];if(!e.oneSupplied){f[v[i]]=C.calculateConstantValue(o[v[i]]);f.oneSupplied=f.oneSupplied||f[v[i]];}}if(e.oneSupplied){d=false;for(var i=0;i<l;i++){if(e[v[i]]){t[v[i]]=e[v[i]];}}}else{var A;t.AggregationLevels=[];if(f.oneSupplied){A={VisibleDimensions:null};for(var i=0;i<l;i++){if(f[v[i]]){A[v[i]]=f[v[i]];}}t.AggregationLevels.push(A);}if(o.ConstantThresholds&&o.ConstantThresholds.length>0){for(var i=0;i<o.ConstantThresholds.length;i++){var g=o.ConstantThresholds[i];var V=g.AggregationLevel?[]:null;if(g.AggregationLevel&&g.AggregationLevel.length>0){for(var j=0;j<g.AggregationLevel.length;j++){V.push(g.AggregationLevel[j].PropertyPath);}}A={VisibleDimensions:V};for(var j=0;j<l;j++){var n=C.calculateConstantValue(g[v[j]]);if(n){A[v[j]]=n;}}t.AggregationLevels.push(A);}}}return d;};c.prototype.getMaxItems=function(){var m=-1;if(this._oPresentationVariant&&this._oPresentationVariant.maxItems){m=Math.min(this._oPresentationVariant.maxItems,100);}return m;};return c;},true);
