/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/comp/library','sap/ui/comp/variants/VariantItem','sap/ui/comp/state/UIState','sap/ui/core/Element'],function(l,V,U,E,A,C){"use strict";var S=E.extend("sap.ui.comp.smartvariants.SmartVariantManagementAdapter",{metadata:{library:"sap.ui.comp",properties:{selectionPresentationVariants:{type:"object",group:"Misc",defaultValue:false}}}});S.prototype.getUiState=function(k){var c,s=null,K=k.substring(1);this.getSelectionPresentationVariants().some(function(o){if(o.qualifier===K){s=o;}return s!==null;});if(s){if(s.uiStateContent){c=s.uiStateContent;}else{c=U.createFromSelectionAndPresentationVariantAnnotation(s.text,s.selectionVariant?s.selectionVariant.annotation:null,s.presentationVariant?s.presentationVariant.annotation:null);s.uiStateContent=c;}}return c;};S.prototype.getODataVariants=function(){var k="#",v=[];var s=this.getSelectionPresentationVariants();if(s){s.forEach(function(o){if(o.qualifier){var a=k+o.qualifier;v.push({id:a,favorite:true,name:o.text});}});}return v;};S.prototype._getExecuteOnSelection=function(v,k){var a=v.getProperty("adaptationInfo");if(a&&a.executeOnSelect){return!!a.executeOnSelect[k];}return false;};S.prototype.destroy=function(){E.prototype.destroy.apply(this,arguments);};return S;});
