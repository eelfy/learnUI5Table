/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata","sap/fe/core/templating/DataModelPathHelper","sap/fe/core/converters/ConverterContext","sap/fe/core/converters/MetaModelConverter","sap/fe/core/converters/controls/Common/DataVisualization"],function(M,D,C,a,b){"use strict";var T=M.extend("sap.fe.macros.Table",{name:"Table",namespace:"sap.fe.macros.internal",publicNamespace:"sap.fe.macros",publicName:"Table",fragment:"sap.fe.macros.Table",metadata:{stereotype:"xmlmacro",properties:{tableDefinition:{type:"sap.ui.model.Context"},metaPath:{type:"sap.ui.model.Context",isPublic:true},contextPath:{type:"sap.ui.model.Context",isPublic:true},collection:{type:"sap.ui.model.Context",required:true,$kind:["EntitySet","NavigationProperty"]},parentEntitySet:{type:"sap.ui.model.Context"},id:{type:"string",isPublic:true},rowsBindingInfo:{type:"object"},navigationPath:{type:"string"},displayMode:{type:"boolean",isPublic:true},disableAddRowButtonForEmptyData:{type:"boolean"},useCondensedTableLayout:{type:"boolean"},rowAction:{type:"string",defaultValue:null},selectionMode:{type:"string"},busy:{type:"string"},showFullScreen:{type:"boolean"},showDelete:{type:"boolean"},headerVisible:{type:"boolean"},noDataText:{type:"string"},creationMode:{type:"string"},createAtEnd:{type:"boolean"},createOutbound:{type:"string"},createOutboundDetail:{type:"string"},createNewAction:{type:"string"},p13nMode:{type:"array"},tableType:{type:"string"},enableExport:{type:"boolean"},selectionLimit:{type:"string"},filterBarId:{type:"string"},create:{type:"sap.ui.model.Context"},tableDelegate:{type:"string"},enableAutoScroll:{type:"boolean"},visible:{type:"string"},isAlp:{type:"boolean",defaultValue:false}},events:{variantSaved:{type:"function"},variantSelected:{type:"function"},onChange:{type:"function"},rowPress:{type:"function"},onDataReceived:{type:"function"},onContextChange:{type:"function"},onPatchSent:{type:"function"},onPatchCompleted:{type:"function"},onBeforeExport:{type:"function"},onSegmentedButtonPressed:{type:"function"}}},create:function(p,c,s){var t;var o=a.getInvolvedDataModelObjects(p.metaPath,p.contextPath);if(p.tableDefinition===undefined||p.tableDefinition===null){var d=this.getConverterContext(o,p.contextPath,s);var v=D.getContextRelativeTargetObjectPath(o);var V=b.getDataVisualizationConfiguration(v,p.useCondensedLayout,d);t=V.visualizations[0];p.tableDefinition=this.createBindingContext(t,s);}else{t=p.tableDefinition.getObject();}t.path=p.tableDefinition.getPath();this.setDefaultValue(p,"showFullScreen",t.control.enableFullScreen);this.setDefaultValue(p,"useCondensedTableLayout",t.control.useCondensedTableLayout);this.setDefaultValue(p,"disableAddRowButtonForEmptyData",t.control.disableAddRowButtonForEmptyData);this.setDefaultValue(p,"enableExport",t.control.enableExport);this.setDefaultValue(p,"headerVisible",t.control.headerVisible);this.setDefaultValue(p,"selectionLimit",t.control.selectionLimit);this.setDefaultValue(p,"tableType",t.control.type);this.setDefaultValue(p,"id",t.annotation.id);this.setDefaultValue(p,"selectionMode",t.annotation.selectionMode);this.setDefaultValue(p,"creationMode",t.annotation.create.mode);this.setDefaultValue(p,"createAtEnd",t.annotation.create.append);this.setDefaultValue(p,"createOutbound",t.annotation.create.outbound);this.setDefaultValue(p,"createNewAction",t.annotation.create.newAction);this.setDefaultValue(p,"createOutboundDetail",t.annotation.create.outboundDetail);this.setDefaultValue(p,"displayMode",t.annotation.displayMode);this.setDefaultValue(p,"showDelete",t.annotation.show.delete);this.setDefaultValue(p,"p13nMode",t.annotation.p13nMode);p.pasteEnabled=t.annotation.show.paste;p.showCreate=t.annotation.show.create||true;p.autoBindOnInit=t.annotation.autoBindOnInit;p.rowAction=t.annotation.row.action;p.rowPress=t.annotation.row.press;p.enableControlVM=t.annotation.enableControlVM;p.parentEntityDeleteEnabled=t.annotation.parentEntityDeleteEnabled;p.navigationPath=t.annotation.navigationPath;p.parentEntitySet=s.models.metaModel.createBindingContext("/"+(o.contextLocation.targetEntitySet?o.contextLocation.targetEntitySet.name:o.startingEntitySet.name));p.collection=s.models.metaModel.createBindingContext(t.annotation.collection);return p;}});return T;});
