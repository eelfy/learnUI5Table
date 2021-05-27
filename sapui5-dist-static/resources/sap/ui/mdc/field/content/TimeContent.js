/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/field/content/DateContent"],function(D){"use strict";var T=Object.assign({},D,{getEditOperator:function(){return{"EQ":{name:"sap/m/TimePicker",create:this._createDatePickerControl}};},createEditMultiLine:function(){throw new Error("sap.ui.mdc.field.content.TimeContent - createEditMultiLine not defined!");}});return T;});
