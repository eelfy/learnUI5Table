/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/util/isValidBindingString"],function(B,i){"use strict";var E=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.enumStringEditor.EnumStringEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.enumStringEditor.EnumStringEditor",metadata:{library:"sap.ui.integration"},renderer:B.getMetadata().getRenderer().render});E.configMetadata=Object.assign({},B.configMetadata,{allowBindings:{defaultValue:true,mergeStrategy:"mostRestrictiveWins"},allowCustomValues:{defaultValue:false,mergeStrategy:"mostRestrictiveWins",mostRestrictiveValue:true}});E.prototype.getDefaultValidators=function(){var c=this.getConfig();return Object.assign({},B.prototype.getDefaultValidators.call(this),{isValidBinding:{type:"isValidBinding",isEnabled:c.allowBindings},notABinding:{type:"notABinding",isEnabled:!c.allowBindings},isSelectedKey:{type:"isSelectedKey",config:{keys:function(p){return p.getConfig().enum;}},isEnabled:!c.allowCustomValues}});};E.prototype._onChange=function(){var c=this.getContent();var s=c.getSelectedKey();var v=c.getValue();this.setValue(s||v);};return E;});