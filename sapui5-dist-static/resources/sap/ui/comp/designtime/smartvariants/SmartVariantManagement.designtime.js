/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/comp/variants/VariantManagement"],function(V){"use strict";return{actions:{compVariant:function(v){return{validators:["noEmptyText",{validatorFunction:function(n){return!v.isNameDuplicate(n);},errorMessage:v.oResourceBundle.getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE")},{validatorFunction:function(n){return!v.isNameTooLong(n);},errorMessage:v.oResourceBundle.getText("VARIANT_MANAGEMENT_MAX_LEN",[V.MAX_NAME_LEN])}]};}},aggregations:{personalizableControls:{propagateMetadata:function(){return{actions:"not-adaptable"};}}},annotations:{},properties:{persistencyKey:{ignore:true},entitySet:{ignore:true},adaptationInfo:{ignore:true},displayTextForExecuteOnSelectionForStandardVariant:{ignore:false}},variantRenameDomRef:function(v){return v.getTitle().getDomRef("inner");},tool:{start:function(v){},stop:function(v){}},customData:{}};});
