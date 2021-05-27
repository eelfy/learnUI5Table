sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/base/Log",
		"sap/base/util/merge",
		"sap/ui/fl/apply/api/ControlVariantApplyAPI",
		"sap/ui/mdc/p13n/StateUtil",
		"sap/fe/navigation/library"
	],
	function(ControllerExtension, OverrideExecution, Log, mergeObjects, ControlVariantApplyAPI, StateUtil, NavLibrary) {
		"use strict";

		// additionalStates are stored next to control IDs, so name clash avoidance needed. Fortunately IDs have restrictions:
		// "Allowed is a sequence of characters (capital/lowercase), digits, underscores, dashes, points and/or colons."
		// Therefore adding a symbol like # or @
		var ADDITIONAL_STATES_KEY = "#additionalStates",
			NavType = NavLibrary.NavType;

		///////////////////////////////////////////////////////////////////
		// methods to retrieve & apply states for the different controls //
		///////////////////////////////////////////////////////////////////

		var _mControlStateHandlerMap = {
			"sap.ui.fl.variants.VariantManagement": {
				retrieve: function(oVM) {
					return {
						"variantId": oVM.getModified() ? oVM.getId() : oVM.getCurrentVariantKey()
					};
				},
				apply: function(oVM, oControlState) {
					if (oControlState && oControlState.variantId !== undefined && oControlState.variantId !== oVM.getCurrentVariantKey()) {
						return ControlVariantApplyAPI.activateVariant({
							element: oVM,
							variantReference: oControlState.variantId
						});
					}
				}
			},
			"sap.m.IconTabBar": {
				retrieve: function(oTabBar) {
					return {
						selectedKey: oTabBar.getSelectedKey()
					};
				},
				apply: function(oTabBar, oControlState) {
					if (oControlState && oControlState.selectedKey) {
						var oSelectedItem = oTabBar.getItems().find(function(oItem) {
							return oItem.getKey() === oControlState.selectedKey;
						});
						if (oSelectedItem) {
							oTabBar.setSelectedItem(oSelectedItem);
						}
					}
				}
			},
			"sap.ui.mdc.FilterBar": {
				retrieve: function(oFilterBar) {
					return StateUtil.retrieveExternalState(oFilterBar).then(function(mFilterBarState) {
						// remove sensitive or view state irrelevant fields
						var aPropertiesInfo = oFilterBar.getPropertyInfoSet(),
							mFilter = mFilterBarState.filter || {};
						aPropertiesInfo
							.filter(function(oPropertyInfo) {
								return (
									mFilter[oPropertyInfo.path] &&
									(oPropertyInfo.removeFromAppState || mFilter[oPropertyInfo.path].length === 0)
								);
							})
							.forEach(function(oPropertyInfo) {
								delete mFilter[oPropertyInfo.path];
							});
						return mFilterBarState;
					});
				},
				apply: function(oFilterBar, oControlState) {
					if (oControlState) {
						return StateUtil.applyExternalState(oFilterBar, oControlState);
					}
				}
			},
			"sap.ui.mdc.Table": {
				retrieve: function(oTable) {
					return StateUtil.retrieveExternalState(oTable);
				},
				apply: function(oTable, oControlState) {
					if (oControlState) {
						return StateUtil.applyExternalState(oTable, oControlState);
					}
				}
			},
			"sap.uxap.ObjectPageLayout": {
				retrieve: function(oOPLayout) {
					return {
						selectedSection: oOPLayout.getSelectedSection()
					};
				},
				apply: function(oOPLayout, oControlState) {
					oControlState && oOPLayout.setSelectedSection(oControlState.selectedSection);
				}
			},
			"sap.m.SegmentedButton": {
				retrieve: function(oSegmentedButton) {
					return {
						selectedKey: oSegmentedButton.getSelectedKey()
					};
				},
				apply: function(oSegmentedButton, oControlState) {
					oControlState && oSegmentedButton.setSelectedKey(oControlState.selectedKey);
				}
			},
			"sap.m.Select": {
				retrieve: function(oSelect) {
					return {
						selectedKey: oSelect.getSelectedKey()
					};
				},
				apply: function(oSelect, oControlState) {
					oControlState && oSelect.setSelectedKey(oControlState.selectedKey);
				}
			},
			"sap.f.DynamicPage": {
				retrieve: function(oDynamicPage) {
					return {
						headerExpanded: oDynamicPage.getHeaderExpanded()
					};
				},
				apply: function(oDynamicPage, oControlState) {
					oControlState && oDynamicPage.setHeaderExpanded(oControlState.headerExpanded);
				}
			},
			"sap.ui.core.mvc.View": {
				retrieve: function(oView) {
					var oController = oView.getController();
					if (oController && oController.viewState) {
						return oController.viewState.retrieveViewState();
					}
					return {};
				},
				apply: function(oView, oControlState, oNavParameters) {
					var oController = oView.getController();
					if (oController && oController.viewState) {
						return oController.viewState.applyViewState(oControlState, oNavParameters);
					}
				}
			},
			"sap.ui.core.ComponentContainer": {
				retrieve: function(oComponentContainer) {
					var oComponent = oComponentContainer.getComponentInstance();
					if (oComponent) {
						return this.retrieveControlState(oComponent.getRootControl());
					}
					return {};
				},
				apply: function(oComponentContainer, oControlState, oNavParameters) {
					var oComponent = oComponentContainer.getComponentInstance();
					if (oComponent) {
						return this.applyControlState(oComponent.getRootControl(), oControlState, oNavParameters);
					}
				}
			}
		};

		/**
		 * @class A controller extension offering hooks for state handling
		 *
		 * If you need to maintain a specific state for your application, you can use the controller extension.
		 *
		 * @name sap.fe.core.controllerextensions.ViewState
		 * @hideconstructor
		 * @public
		 * @since 1.85.0
		 */
		var ViewState = ControllerExtension.extend("sap.fe.core.controllerextensions.ViewState", {
			metadata: {
				methods: {
					collectResults: { "public": false, "final": true },
					adaptControlStateHandler: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					getControlStateHandler: { "public": false, "final": true },
					adaptStateControls: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					retrieveAdditionalStates: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					retrieveViewState: { "public": true, "final": true },
					retrieveControlState: { "public": false, "final": true },
					applyInitialStateOnly: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.Instead
					},
					applyViewState: { "public": true, "final": true },
					applyControlState: { "public": false, "final": true },
					applyAdditionalStates: {
						"public": false,
						"final": false,
						overrideExecution: OverrideExecution.After
					},
					applyNavigationParameters: { "public": false, "final": false, overrideExecution: OverrideExecution.After },
					onBeforeStateApplied: { "public": false, "final": false, overrideExecution: OverrideExecution.After },
					onAfterStateApplied: { "public": false, "final": false, overrideExecution: OverrideExecution.After }
				}
			},

			/**
			 * Constructor.
			 */
			constructor: function() {
				ControllerExtension.apply(this);
				var that = this;
				that._iRetrievingStateCounter = 0;
				this._pInitialStateApplied = new Promise(function(resolve) {
					that._pInitialStateAppliedResolve = resolve;
				});
			},

			/**
			 * @private
			 * @name sap.fe.core.controllerextensions.ViewState.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.core.controllerextensions.ViewState.extend
			 * @function
			 */

			/**
			 * Destructor method for objects.
			 */
			destroy: function() {
				delete this._pInitialStateApplied;
				delete this._pInitialStateAppliedResolve;
				delete this._iRetrievingStateCounter;
				ControllerExtension.prototype.destroy.apply(this);
			},

			/**
			 * Helper function to enable multi override. It is adding an additional parameter (array) to the provided
			 * function (and its parameters), that will be evaluated via <code>Promise.all</code>.
			 *
			 * @param {Function} fnCall the function to be called
			 * @returns {Promise} a promise to be resolved with the result of all overrides
			 */
			collectResults: function(fnCall) {
				var aResults = [],
					aArguments = Array.prototype.slice.call(arguments, 1);
				aArguments.push(aResults);
				fnCall.apply(this, aArguments);
				return Promise.all(aResults);
			},

			/**
			 * Customize the <code>retrieve</code> and <code>apply</code> functions for a certain control.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl the control to get state handler for
			 * @param {Array<object>} aControlHandler a list of plain objects with two functions: <code>retrieve</code> and <code>apply</code>
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#adaptControlStateHandler
			 * @protected
			 */
			adaptControlStateHandler: function(oControl, aControlHandler) {
				// to be overridden if needed
			},

			/**
			 * Returns a map of <code>retrieve</code> and <code>apply</code> functions for a certain control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl the control to get state handler for
			 * @returns {object} a plain object with two functions: <code>retrieve</code> and <code>apply</code>
			 */
			getControlStateHandler: function(oControl) {
				var aInternalControlStateHandler = [],
					aCustomControlStateHandler = [];
				if (oControl) {
					for (var sType in _mControlStateHandlerMap) {
						if (oControl.isA(sType)) {
							// avoid direct manipulation of internal _mControlStateHandlerMap
							aInternalControlStateHandler.push(Object.assign({}, _mControlStateHandlerMap[sType]));
							break;
						}
					}
				}
				this.adaptControlStateHandler(oControl, aCustomControlStateHandler);
				return aInternalControlStateHandler.concat(aCustomControlStateHandler);
			},

			/**
			 * This function should add all controls for given view that should be considered for the state handling to the provided control array.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {Array<sap.ui.base.ManagedObject>} aCollectedControls the collected controls
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#adaptStateControls
			 * @protected
			 */
			adaptStateControls: function(aCollectedControls) {
				// to be overridden if needed
			},

			/**
			 * Returns the key to be used for given control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl the control to get state key for
			 * @returns {string} the key to be used for storing the controls state
			 */
			getStateKey: function(oControl) {
				return this.getView().getLocalId(oControl.getId()) || oControl.getId();
			},

			/**
			 * Retrieve the view state of this extensions view.
			 * When this function is called more than once before finishing, all but the final response will resolve to <code>undefined</code>.
			 *
			 * @returns {Promise} a promise resolving the view state
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#retrieveViewState
			 * @public
			 */
			retrieveViewState: function() {
				var that = this;
				++that._iRetrievingStateCounter;
				return that._pInitialStateApplied
					.then(function() {
						return that.collectResults(that.adaptStateControls);
					})
					.then(function(aControls) {
						return Promise.all(
							aControls
								.filter(function(oControl) {
									return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
								})
								.map(function(oControl) {
									return that.retrieveControlState(oControl).then(function(vResult) {
										return {
											key: that.getStateKey(oControl),
											value: vResult
										};
									});
								})
						);
					})
					.then(function(aResolvedStates) {
						return aResolvedStates.reduce(function(oStates, mState) {
							var oCurrentState = {};
							oCurrentState[mState.key] = mState.value;
							return mergeObjects(oStates, oCurrentState);
						}, {});
					})
					.then(function(oViewState) {
						return Promise.resolve(that._retrieveAdditionalStates()).then(function(mAdditionalStates) {
							if (mAdditionalStates && Object.keys(mAdditionalStates).length) {
								oViewState[ADDITIONAL_STATES_KEY] = mAdditionalStates;
							}
							return oViewState;
						});
					})
					.finally(function() {
						--that._iRetrievingStateCounter;
					})
					.then(function(oViewState) {
						return that._iRetrievingStateCounter === 0 ? oViewState : undefined;
					});
			},

			/**
			 * Extend the map of additional states (not control bound) to be added to the current view state of the given view.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {object} mAdditionalStates the additional state
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#retrieveAdditionalStates
			 * @protected
			 */
			retrieveAdditionalStates: function(mAdditionalStates) {
				// to be overridden if needed
			},

			/**
			 * Returns a map of additional states (not control bound) to be added to the current view state of the given view.
			 *
			 * @returns {object | Promise<object>} additional view states
			 */
			_retrieveAdditionalStates: function() {
				var mAdditionalStates = {};
				this.retrieveAdditionalStates(mAdditionalStates);
				return mAdditionalStates;
			},

			/**
			 * Returns the current state for the given control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl the object to get the state for
			 * @returns {Promise<object>} the state for the given control
			 */
			retrieveControlState: function(oControl) {
				var aControlStateHandlers = this.getControlStateHandler(oControl);
				return Promise.all(
					aControlStateHandlers.map(function(mControlStateHandler) {
						if (typeof mControlStateHandler.retrieve !== "function") {
							throw new Error(
								"controlStateHandler.retrieve is not a function for control: " + oControl.getMetadata().getName()
							);
						}
						return mControlStateHandler.retrieve.call(this, oControl);
					})
				).then(function(aStates) {
					return aStates.reduce(function(oFinalState, oCurrentState) {
						return mergeObjects(oFinalState, oCurrentState);
					}, {});
				});
			},

			/**
			 * Returns whether view state should only applied once initially.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.Instead}.
			 *
			 * @returns {boolean} whether applyViewState calls should be performed for current view
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyInitialStateOnly
			 * @protected
			 */
			applyInitialStateOnly: function() {
				return false;
			},

			/**
			 * Applies the given view state to this extensions view.
			 *
			 * @param {object} oViewState the view state to apply (can be undefined)
			 * @param {object} oNavParameter the current navigation parameter
			 * @param {sap.fe.navigation.NavType} oNavParameter.navigationType the actual navigation type
			 * @param {object} [oNavParameter.selectionVariant] the selectionVariant from the navigation
			 * @param {object} [oNavParameter.selectionVariantDefaults] the selectionVariant defaults from the navigation
			 * @param {boolean} [oNavParameter.requiresStandardVariant] defines whether standard variant must be used in VM
			 *
			 * @returns {Promise} promise for async state handling
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyViewState
			 * @public
			 */
			applyViewState: function(oViewState, oNavParameter) {
				var that = this;
				if (this.applyInitialStateOnly() && this._getInitialStateApplied()) {
					return Promise.resolve();
				}
				return this.collectResults(this.onBeforeStateApplied)
					.then(function() {
						return that.collectResults(that.adaptStateControls);
					})
					.then(function(aControls) {
						var oPromiseChain = Promise.resolve();
						aControls
							.filter(function(oControl) {
								return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
							})
							.forEach(function(oControl) {
								var sKey = that.getStateKey(oControl);
								oPromiseChain = oPromiseChain.then(
									that.applyControlState.bind(that, oControl, oViewState ? oViewState[sKey] : undefined, oNavParameter)
								);
							});
						return oPromiseChain;
					})
					.then(function() {
						if (oNavParameter.navigationType === NavType.iAppState) {
							return that.collectResults(
								that.applyAdditionalStates,
								oViewState ? oViewState[ADDITIONAL_STATES_KEY] : undefined
							);
						} else {
							return that.collectResults(that.applyNavigationParameters, oNavParameter);
						}
					})
					.finally(function() {
						return that.collectResults(that.onAfterStateApplied).then(that._setInitialStateApplied.bind(that));
					});
			},

			_setInitialStateApplied: function() {
				if (this._pInitialStateAppliedResolve) {
					var pInitialStateAppliedResolve = this._pInitialStateAppliedResolve;
					delete this._pInitialStateAppliedResolve;
					pInitialStateAppliedResolve();
				}
			},

			_getInitialStateApplied: function() {
				return !this._pInitialStateAppliedResolve;
			},

			/**
			 * Hook to react before a state for given view is applied.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {Promise} aPromises extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#onBeforeStateApplied
			 * @protected
			 */
			onBeforeStateApplied: function(aPromises) {},

			/**
			 * Hook to react when state for given view was applied.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {Promise} aPromises extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#onAfterStateApplied
			 * @protected
			 */
			onAfterStateApplied: function(aPromises) {},

			/**
			 * Applying additional, not control related, states - is called only if navigation type is iAppState.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {object} oViewState the current view state
			 * @param {Promise} aPromises extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyAdditionalStates
			 * @protected
			 */
			applyAdditionalStates: function(oViewState, aPromises) {
				// to be overridden if needed
			},

			/**
			 * Apply navigation parameters - is called only if navigation type is not iAppState.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
			 *
			 * @param {object} oNavParameter the current navigation parameter
			 * @param {sap.fe.navigation.NavType} oNavParameter.navigationType the actual navigation type
			 * @param {object} [oNavParameter.selectionVariant] the selectionVariant from the navigation
			 * @param {object} [oNavParameter.selectionVariantDefaults] the selectionVariant defaults from the navigation
			 * @param {boolean} [oNavParameter.requiresStandardVariant] defines whether standard variant must be used in VM
			 * @param {Promise} aPromises extensible array of promises to be resolved before continuing
			 *
			 * @alias sap.fe.core.controllerextensions.ViewState#applyNavigationParameters
			 * @protected
			 */
			applyNavigationParameters: function(oNavParameter, aPromises) {
				// to be overridden if needed
			},

			/**
			 * Applying the given state to the given control.
			 *
			 * @param {sap.ui.base.ManagedObject} oControl the object to apply the given state
			 * @param {object} oControlState the state for the given control
			 * @param {object} oNavParameters the current navigation parameters
			 * @returns {any} return a promise for async state handling
			 */
			applyControlState: function(oControl, oControlState, oNavParameters) {
				var aControlStateHandlers = this.getControlStateHandler(oControl),
					oPromiseChain = Promise.resolve(),
					that = this;
				aControlStateHandlers.forEach(function(mControlStateHandler) {
					if (typeof mControlStateHandler.apply !== "function") {
						throw new Error("controlStateHandler.apply is not a function for control: " + oControl.getMetadata().getName());
					}
					oPromiseChain = oPromiseChain.then(mControlStateHandler.apply.bind(that, oControl, oControlState, oNavParameters));
				});
				return oPromiseChain;
			}
		});

		return ViewState;
	}
);
