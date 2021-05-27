/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/field/content/DefaultContent"],function(D){"use strict";var B=Object.assign({},D,{getEditMulti:function(){return[null];},getEditMultiLine:function(){return[null];},getUseDefaultFieldHelp:function(){return{name:"bool",oneOperatorSingle:true,oneOperatorMulti:true};},createEditMulti:function(){throw new Error("sap.ui.mdc.field.content.BooleanContent - createEditMulti not defined!");},createEditMultiLine:function(){throw new Error("sap.ui.mdc.field.content.BooleanContent - createEditMultiLine not defined!");}});return B;});
