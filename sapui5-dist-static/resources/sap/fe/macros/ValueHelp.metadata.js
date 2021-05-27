/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata","sap/fe/core/converters/MetaModelConverter"],function(M,a){"use strict";var V=M.extend("sap.fe.macros.ValueHelp",{name:"ValueHelp",namespace:"sap.fe.macros",fragment:"sap.fe.macros.internal.valuehelp.ValueHelp",metadata:{stereotype:"xmlmacro",designtime:"sap/fe/macros/internal/valuehelp/ValueHelp.designtime",properties:{idPrefix:{type:"string",defaultValue:"ValueHelp"},property:{type:"sap.ui.model.Context",required:true,$kind:"Property"},conditionModel:{type:"string",defaultValue:""},filterFieldValueHelp:{type:"boolean",defaultValue:false},useSemanticDateRange:{type:"boolean",defaultValue:true},requestGroupId:{type:"string",defaultValue:""},navigationPrefix:{type:"string"}},events:{}},create:function(p,c,A){var t=this;Object.keys(this.metadata.properties).forEach(function(P){var o=t.metadata.properties[P];if(o.type==="boolean"){if(typeof p[P]==="string"){p[P]=p[P]==="true";}}});return p;}});return V;});
