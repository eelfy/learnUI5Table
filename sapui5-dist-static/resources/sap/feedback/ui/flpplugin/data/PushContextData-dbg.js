/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "../utils/Constants"],
	function(Object, Constants) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.data.PushContextData", {
			_iSrcType: null,
			_sSrcAppId: null,
			_sSrcAppTrigger: null,

			constructor: function(sSrcAppId, sSrcAppTrigger, iSrcType) {
				this._sSrcAppId = sSrcAppId;
				this._sSrcAppTrigger = sSrcAppTrigger;
				this._bIsPushedSurvey = true;
				this._iSrcType = iSrcType;
			},
			getSourceAppId: function() {
				return this._sSrcAppId;
			},
			getSourceAppTrigger: function() {
				return this._sSrcAppTrigger;
			},
			getSourceType: function() {
				return this._iSrcType;
			},
			getIsBackendPushedSurvey: function() {
				return this._iSrcType === Constants.E_PUSH_SRC_TYPE.backend;
			}
		});
	});