/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "../utils/Constants"],
	function(Object, Constants) {
		"use strict";
		/* global sap */

		return Object.extend("sap.feedback.ui.flpplugin.data.Config", {
			_sQualtricsUri: null,
			_sTenantId: null,
			_sTenantRole: null,
			_sPushChannelPath: null,
			_bIsPushEnabled: false,
			_iDisplayFormat: null,
			_iDataFormat: null,
			_sProductName: null,
			_sPlatformType: null,
			_bIsLibraryLoadable: false,

			constructor: function(sQualtricsUri, sTenantId, iDataFormat) {
				this.setQualtricUri(sQualtricsUri);
				this.setTenantId(sTenantId);
				this.setDataFormat(iDataFormat);
			},
			setQualtricUri: function(sValue) {
				this._sQualtricsUri = sValue;
				this._iDisplayFormat = this._identifyDisplayFormat();
			},
			getQualtricsUri: function() {
				return this._sQualtricsUri;
			},
			setTenantId: function(sValue) {
				this._sTenantId = sValue;
			},
			getTenantId: function() {
				return this._sTenantId;
			},
			setTenantRole: function(sValue) {
				this._sTenantRole = sValue;
			},
			getTenantRole: function() {
				return this._sTenantRole;
			},
			setPushChannelPath: function(sPushChannelPath) {
				this._sPushChannelPath = sPushChannelPath;
			},
			getPushChannelPath: function() {
				return this._sPushChannelPath;
			},
			setIsPushEnabled: function(bIsPushEnabled) {
				if (bIsPushEnabled === true || bIsPushEnabled.toLowerCase() === "true" || bIsPushEnabled.toLowerCase() ===
					"x") {
					this._bIsPushEnabled = true;
				} else {
					this._bIsPushEnabled = false;
				}
			},
			getIsPushEnabled: function() {
				return this._bIsPushEnabled;
			},
			getDisplayFormat: function() {
				return this._iDisplayFormat;
			},
			_identifyDisplayFormat: function() {
				/* eslint-disable */
				if (this._sQualtricsUri && !this._sQualtricsUri.includes("siteintercept")) {
					return Constants.E_DISPLAY_FORMAT.iframe;
				}
				/* eslint-enable */
				return Constants.E_DISPLAY_FORMAT.popover;
			},
			setDataFormat: function(iDataFormat) {
				this._iDataFormat = iDataFormat;
			},
			getDataFormat: function() {
				return this._iDataFormat;
			},
			setProductName: function(sProductName) {
				this._sProductName = sProductName;
			},
			getProductName: function() {
				return this._sProductName;
			},
			setPlatformType: function(sPlatformType) {
				this._sPlatformType = sPlatformType;
			},
			getPlatformType: function() {
				return this._sPlatformType;
			},
			setIsLibraryLoadable: function(bIsLoadable) {
				this._bIsLibraryLoadable = bIsLoadable;
			},
			getIsLibraryLoadable: function() {
				return this._bIsLibraryLoadable;
			}
		});
	});