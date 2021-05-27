/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/util/isValidBindingString"],function(B,i){"use strict";var a=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor",metadata:{library:"sap.ui.integration"},renderer:B.getMetadata().getRenderer().render});a.prototype.getDefaultValidators=function(){var c=this.getConfig();return Object.assign({},B.prototype.getDefaultValidators.call(this),{isValidBinding:{type:"isValidBinding",isEnabled:c.allowBindings},notABinding:{type:"notABinding",isEnabled:!c.allowBindings},isBoolean:{type:"isBoolean"}});};a.prototype._onChange=function(){var c=this.getContent();var v=c.getSelectedKey()||c.getValue();if(v==="false"){v=false;}else if(v==="true"){v=true;}this.setValue(v);};a.configMetadata=Object.assign({},B.configMetadata,{allowBindings:{defaultValue:true,mergeStrategy:"mostRestrictiveWins"}});return a;});
