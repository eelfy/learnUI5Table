/*
 * ! SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/comp/library','sap/ui/core/Item'],function(l,I){"use strict";var V=I.extend("sap.ui.comp.variants.VariantItem",{metadata:{library:"sap.ui.comp",properties:{executeOnSelection:{type:"boolean",group:"Misc",defaultValue:false},readOnly:{type:"boolean",group:"Misc",defaultValue:false},lifecycleTransportId:{type:"string",group:"Misc",defaultValue:null},global:{type:"boolean",group:"Misc",defaultValue:null},lifecyclePackage:{type:"string",group:"Misc",defaultValue:null},namespace:{type:"string",group:"Misc",defaultValue:null},accessOptions:{type:"string",group:"Misc",defaultValue:null,deprecated:true},labelReadOnly:{type:"boolean",group:"Misc",defaultValue:false},author:{type:"string",group:"Misc",defaultValue:null},favorite:{type:"boolean",group:"Misc",defaultValue:false},_contexts:{type:"object",group:"Misc",visibility:"hidden",defaultValue:{}}},events:{change:{parameters:{propertyName:{type:"string"}}}}}});V.prototype.setText=function(t){this.setProperty("text",t);this.fireChange({propertyName:"text"});return this;};V.prototype.setContexts=function(c){this.setProperty("_contexts",c);};V.prototype.getContexts=function(){return this.getProperty("_contexts");};return V;});
