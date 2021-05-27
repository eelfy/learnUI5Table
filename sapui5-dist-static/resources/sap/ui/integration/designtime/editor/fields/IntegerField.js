/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/editor/fields/BaseField","sap/m/Input"],function(B,I){"use strict";var a=B.extend("sap.ui.integration.designtime.editor.fields.IntegerField",{renderer:B.getMetadata().getRenderer()});a.prototype.initVisualization=function(c){var v=c.visualization;var f=c.formatter;if(!v){v={type:I,settings:{value:{path:'currentSettings>value',type:'sap.ui.model.type.Integer',formatOptions:f},editable:{path:'currentSettings>editable'}}};}this._visualization=v;};return a;});
