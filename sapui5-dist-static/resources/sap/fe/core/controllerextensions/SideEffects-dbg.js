sap.ui.define(["sap/ui/core/mvc/ControllerExtension"], function(ControllerExtension) {
	"use strict";

	/**
	 * {@link sap.ui.core.mvc.ControllerExtension Controller extension}
	 *
	 * @namespace
	 * @alias sap.fe.core.controllerextensions.SideEffects
	 *
	 * @ui5-restricted
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.SideEffects", {
		metadata: {
			methods: {
				"addControlSideEffects": { "public": true, "final": true },
				"getEntitySideEffects": { "public": true, "final": true },
				"getControlSideEffects": { "public": false, "final": true },
				"getEmptyPropertySideEffects": { "public": false, "final": true },
				"removeControlSideEffects": { "public": true, "final": true },
				"setControlSideEffects": { "public": false, "final": true }
			}
		},

		/**
		 * Destructor method for objects.
		 */
		destroy: function() {
			delete this._mAppSideEffects;
			ControllerExtension.prototype.destroy.apply(this);
		},
		/**
		 * Get an empty Property Side Effect.
		 *
		 * @memberof sap.fe.core.ControllerExtension
		 * @returns {object} Empty Property Side Effect.
		 * @final
		 */
		getEmptyPropertySideEffects: function() {
			return {
				TargetEntities: [],
				TargetProperties: []
			};
		},

		/**
		 * Get  App Side Effects related to an entity type.
		 *
		 * @param {string} [sEntityType] Entity Type
		 * @returns {object} Side Effects relate to the entity Type
		 * @memberof sap.fe.core.ControllerExtension
		 * @final
		 */
		getEntitySideEffects: function(sEntityType) {
			var mEntitySideEffets = {},
				that = this;
			Object.keys(this._mAppSideEffects).forEach(function(sControlId) {
				var mControlSideEffects = that._mAppSideEffects[sControlId],
					mControlEntitySideEffects = mControlSideEffects[sEntityType];
				if (mControlEntitySideEffects) {
					mEntitySideEffets = that._aggregateEntitySideEffects(mControlEntitySideEffects, mEntitySideEffets);
				}
			});
			return mEntitySideEffets;
		},

		getControlSideEffects: function(sControlId) {
			return this._mAppSideEffects[sControlId] || {};
		},

		/**
		 * Set App Side Effects related to aControl (overriden).
		 *
		 * @param {string} [sControlId] UI5 Controld Id
		 * @param {object} [mControlSideEffects] new App Side Effect
		 * @memberof sap.fe.core.ControllerExtension
		 * @final
		 */
		setControlSideEffects: function(sControlId, mControlSideEffects) {
			this._mAppSideEffects[sControlId] = mControlSideEffects;
		},

		/**
		 * Add Control Side Effects.
		 *
		 * @memberof sap.fe.core.ControllerExtension
		 * @param {object} [mAttributes] Contain the following  mandatory attributes.
		 * @param {string} [mAttributes.entityType] Entity Type where SideEffect request must be executed
		 * @param {string} [mAttributes.property] Entity property where SideEffect request must be executed
		 * @param {Array} [mAttributes.TargetEntities] Array of entities to request (object: {$NavigationPropertyPath: "..."})
		 * @param {Array} [mAttributes.TargetProperties] Array of properties to request (string)
		 * @param {object} [oControl] UI5 Control related to App Side Effects
		 * @final
		 */
		addControlSideEffects: function(mAttributes, oControl) {
			var bValidControl = this._isValidControl(oControl),
				sSourceEntityType = mAttributes.entityType,
				sSourceProperty = mAttributes.property;

			if (bValidControl && sSourceEntityType && mAttributes.property) {
				var sControlId = oControl.getId(),
					mControlSideEffects = this.getControlSideEffects(sControlId),
					mEntitySideEffects = mControlSideEffects[sSourceEntityType] || {};
				mEntitySideEffects[sSourceProperty] = this._aggregatePropertySideEffects(mAttributes, mEntitySideEffects[sSourceProperty]);
				mControlSideEffects[sSourceEntityType] = mEntitySideEffects;
				this.setControlSideEffects(sControlId, mControlSideEffects);
			}
		},

		/**
		 * Remove Control Side Effects.
		 *
		 * @memberof sap.fe.core.ControllerExtension
		 * @param {object} [oControl] UI5 Control related to App Side Effects
		 * @final
		 */

		removeControlSideEffects: function(oControl) {
			if (this._isValidControl(oControl)) {
				delete this._mAppSideEffects[oControl.getId()];
			}
		},

		_aggregateEntitySideEffects: function(mNewEntitySideEffects, mTargetEntitySideEffects) {
			var that = this,
				mAggregatedEntityProperty = {},
				mTarget = mTargetEntitySideEffects || {};
			Object.keys(mNewEntitySideEffects).forEach(function(sEntityProperty) {
				mAggregatedEntityProperty[sEntityProperty] = that._aggregatePropertySideEffects(
					mNewEntitySideEffects[sEntityProperty],
					mTarget[sEntityProperty]
				);
			});
			return mAggregatedEntityProperty;
		},

		_aggregatePropertySideEffects: function(mNewPropertiesSideEffects, mTargetPropertySideEffects) {
			var mAggregatedProperty = this.getEmptyPropertySideEffects(),
				mTarget = mTargetPropertySideEffects || this.getEmptyPropertySideEffects();
			Object.keys(mAggregatedProperty).forEach(function(sTarget) {
				var aAttributesTarget = mNewPropertiesSideEffects[sTarget],
					aTarget = mTarget[sTarget] || [];
				if (aAttributesTarget) {
					mAggregatedProperty[sTarget] = aTarget.concat(
						aAttributesTarget.filter(function(vTarget) {
							if (vTarget.$NavigationPropertyPath) {
								// --> TargetEntities
								return aTarget
									.map(function(oTarget) {
										return oTarget.$NavigationPropertyPath;
									})
									.indexOf(vTarget.$NavigationPropertyPath);
							} else if (typeof vTarget === "string") {
								// --> TargetProperties
								return aTarget.indexOf(vTarget) < 0;
							} else {
								throw new Error("Unsupported SideEffect type for " + sTarget);
							}
						})
					);
				}
			});
			return mAggregatedProperty;
		},
		_isValidControl: function(oControl) {
			return oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject");
		},
		override: {
			onInit: function() {
				this._mAppSideEffects = {};
			}
		}
	});
});
