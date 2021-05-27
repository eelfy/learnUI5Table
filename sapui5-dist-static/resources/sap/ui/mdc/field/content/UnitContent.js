/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/field/content/DefaultContent","sap/ui/model/Filter","sap/base/util/isEmptyObject","sap/base/util/merge","sap/base/util/ObjectPath","sap/ui/mdc/enum/EditMode"],function(D,F,i,m,O,E){"use strict";var U=Object.assign({},D,{getEditMulti:function(){return["sap/ui/mdc/field/FieldMultiInput","sap/ui/mdc/field/FieldInput","sap/m/Token"];},getEditMultiLine:function(){return[null];},getUseDefaultFieldHelp:function(){return false;},createEdit:function(c,C,I){c.setIsMeasure(true);var a=C[0];var o=c.getConditionsType();this._adjustDataTypeForUnit(c);var b=[];var d=new a(I,{value:{path:"$field>/conditions",type:o},placeholder:"{$field>/placeholder}",textAlign:"{$field>/textAlign}",textDirection:"{$field>/textDirection}",valueHelpIconSrc:"sap-icon://slim-arrow-down",required:"{$field>/required}",editable:{path:"$field>/editMode",formatter:c.getMetadata()._oClass._getEditable},enabled:{path:"$field>/editMode",formatter:c.getMetadata()._oClass._getEnabled},valueState:"{$field>/valueState}",valueStateText:"{$field>/valueStateText}",showValueHelp:false,width:"70%",tooltip:"{$field>/tooltip}",fieldGroupIds:[c.getField().getId()],change:c.getHandleContentChange(),liveChange:c.getHandleContentLiveChange()});d._setPreferUserInteraction(true);c.setAriaLabelledBy(d);b.push(d);b=this._addUnitControl(c,b,I,a);c.setBoundProperty("value");return b;},createEditMulti:function(c,C,I){c.setIsMeasure(true);var M=C[0];var T=C[2];var a=C[1];var o=c.getConditionType();this._adjustDataTypeForUnit(c);var b=[];var t=new T(I+"-token",{text:{path:'$field>',type:o}});var f=new F({path:"values",test:function(v){if(!Array.isArray(v[0])||v[0][0]){return true;}else{return false;}}});var d=new M(I,{placeholder:"{$field>/placeholder}",textAlign:"{$field>/textAlign}",textDirection:"{$field>/textDirection}",required:"{$field>/required}",editable:{path:"$field>/editMode",formatter:c.getMetadata()._oClass._getEditable},enabled:{path:"$field>/editMode",formatter:c.getMetadata()._oClass._getEnabled},valueState:"{$field>/valueState}",valueStateText:"{$field>/valueStateText}",showValueHelp:false,width:"70%",tooltip:"{$field>/tooltip}",fieldGroupIds:[c.getField().getId()],tokens:{path:"$field>/conditions",template:t,filters:[f]},dependents:[t],change:c.getHandleContentChange(),liveChange:c.getHandleContentLiveChange(),tokenUpdate:c.getHandleTokenUpdate()});d._setPreferUserInteraction(true);c.setAriaLabelledBy(d);b.push(d);b=this._addUnitControl(c,b,I,a);c.setBoundProperty("value");return b;},createEditMultiLine:function(){throw new Error("sap.ui.mdc.field.content.UnitContent - createEditMultiLine not defined!");},_addUnitControl:function(c,C,I,a){var u=c.getUnitConditionsType();if(c.getField().getEditMode()===E.EditableDisplay){C[0].bindProperty("description",{path:"$field>/conditions",type:u});C[0].setWidth("100%");C[0].setFieldWidth("70%");}else{var o=new a(I+"-unit",{value:{path:"$field>/conditions",type:u},placeholder:"{$field>/placeholder}",textAlign:"{$field>/textAlign}",textDirection:"{$field>/textDirection}",required:"{$field>/required}",editable:{path:"$field>/editMode",formatter:c.getMetadata()._oClass._getEditableUnit},enabled:{path:"$field>/editMode",formatter:c.getMetadata()._oClass._getEnabled},valueState:"{$field>/valueState}",valueHelpIconSrc:c.getFieldHelpIcon(),valueStateText:"{$field>/valueStateText}",showValueHelp:"{$field>/_fieldHelpEnabled}",ariaAttributes:"{$field>/_ariaAttributes}",width:"30%",tooltip:"{$field>/tooltip}",fieldGroupIds:[c.getField().getId()],change:c.getHandleContentChange(),liveChange:c.getHandleContentLiveChange(),valueHelpRequest:c.getHandleValueHelpRequest()});o._setPreferUserInteraction(true);c.setAriaLabelledBy(o);C.push(o);}return C;},_adjustDataTypeForUnit:function(c){var f=c.getField();var t=c.retrieveDataType();var n=t.getMetadata().getName();var o=t.getFormatOptions();var C=i(t.getConstraints())?undefined:t.getConstraints();if(!o||!o.hasOwnProperty("showMeasure")||o.showMeasure){o=m({},o);o.showMeasure=false;o.strictParsing=true;var T=O.get(n);c.setUnitOriginalType(c.getDataType());c.setDataType(new T(o,C));f.getControlDelegate().initializeInternalUnitType(f.getPayload(),c.getDataType(),c.getFieldTypeInitialization());c.updateConditionType();}}});return U;});
