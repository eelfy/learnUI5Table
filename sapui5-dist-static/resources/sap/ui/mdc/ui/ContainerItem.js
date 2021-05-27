/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element'],function(E){"use strict";var C=E.extend("sap.ui.mdc.ui.ContainerItem",{metadata:{library:"sap.ui.mdc",properties:{key:{type:"string",defaultValue:null}},aggregations:{content:{type:"sap.ui.core.Control",multiple:false}}}});C.prototype.setContent=function(c){this.setAggregation("content",c);if(c){this._oContent=c;}return this;};C.prototype.getContent=function(){return this._oContent;};C.prototype.exit=function(){E.prototype.exit.apply(this,arguments);this._oContent=null;};return C;});
