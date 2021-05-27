/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/model/ClientPropertyBinding","sap/base/util/deepEqual","sap/base/util/deepClone"],function(J,C,d,a){"use strict";var O=J.extend("sap.ui.integration.model.ObservableModel",{constructor:function(D,o){J.apply(this,arguments);this._observedBinding=new C(this,"/",this.getContext("/"));this._observedBinding.attachChange(this._handleChange.bind(this));this._fireChangeBound=this._fireChange.bind(this);}});O.prototype.destroy=function(){this._observedBinding.destroy();this._observedBinding=null;clearTimeout(this._iFireChangeCallId);};O.prototype._handleChange=function(){this._scheduleFireChange();};O.prototype._scheduleFireChange=function(){if(this._iFireChangeCallId){clearTimeout(this._iFireChangeCallId);}this._iFireChangeCallId=setTimeout(this._fireChangeBound,0);};O.prototype._fireChange=function(){var D;if(!this._oOldData){D=true;}else{D=!d(this.oData,this._oOldData,100);}this._oOldData=a(this.oData);if(D){this.fireEvent("change");}};return O;});
