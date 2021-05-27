// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(function () {
	"use strict";

	function createRendererMock () {
		return {
			addActionButton: function (sId, mPropertyBag) {
				this.mAddActionParameters = mPropertyBag;
			}.bind(this),
			LaunchpadState: {
				App: {}
			}
		};
	}

	function createContainerObject (sApplicationType, bNoRenderer, bNoRendererAfterCallback, assert, bFlexEnabled, fnAttachAppLoaded) {
		var mReturn = {
			getService: function () {
				return {
					attachAppLoaded: fnAttachAppLoaded || function () {},
					detachAppLoaded: function () {},
					getCurrentApplication: function () {
						return {
							applicationType: sApplicationType,
							componentInstance: {
								getAggregation: function () {},
								getMetadata: function () {
									return {
										getManifest: function () {
											return {
												"sap.ui5": {
													flexEnabled: bFlexEnabled
												}
											};
										}
									};
								}
							}
						};
					},
					getHash: function () {},
					parseShellHash: function (oReturn) {
						return oReturn || {
							semanticObject: "a",
							action: "b",
							appSpecificRoute: "c"
						};
					}
				};
			},
			registerDirtyStateProvider: function () {}
		};
		if (bNoRenderer) {
			mReturn.getRenderer = function () {};
			mReturn.attachRendererCreatedEvent = function (fnCallback, oContext) {
				this.fnAttachCallback = fnCallback;
				this.oAttachContext = oContext;
				fnCallback.call(this, {
					getParameter: function () {
						return !bNoRendererAfterCallback ? createRendererMock.call(this) : undefined;
					}.bind(this)
				});
			}.bind(this);
			mReturn.detachRendererCreatedEvent = function (fnCallback, oContext) {
				this.fnDetachCallback = fnCallback;
				this.oDetachContext = oContext;
				assert.ok(true, "the event got detached");
			}.bind(this);
		} else {
			mReturn.getRenderer = function () {
				return createRendererMock.call(this);
			}.bind(this);
		}
		return mReturn;
	}

	function createComponentData () {
		var fnEmpty = function (vParam) { return vParam || new jQuery.Deferred().resolve(); };
		return {
			componentData: {
				oPostMessageInterface: {
					createPostMessageResult: this.oCreatePostMessageResultStub || fnEmpty,
					postMessageToFlp: this.oPostMessageToFlpStub || fnEmpty,
					postMessageToApp: this.oPostMessageToAppStub || fnEmpty,
					registerPostMessageAPIs: this.oRegisterPostMessageAPIsStub || fnEmpty
				}
			}
		};
	}

	return {
		createContainerObject: createContainerObject,
		createComponentData: createComponentData
	};
});
