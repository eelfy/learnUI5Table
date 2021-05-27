/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/field/content/DateContent"],function(D){"use strict";var a=Object.assign({},D,{getEditOperator:function(){return{"EQ":{name:"sap/m/DateTimePicker",create:this._createDatePickerControl}};},createEditMultiLine:function(){throw new Error("sap.ui.mdc.field.content.DateTimeContent - createEditMultiLine not defined!");}});return a;});
