sap.ui.define([], function() {
	"use strict";

	/* This class contains helpers to be used at runtime to retrieve further information on the model */

	var ModelHelper = {
		/**
		 * Method to determine if the programming model is sticky.
		 *
		 * @function
		 * @name isStickySessionSupported
		 * @param {sap.ui.model.odata.v4.MetaModel} oMetaModel meta model to check for sticky enabled entity
		 * @returns {boolean} - returns true if sticky, else false
		 */
		isStickySessionSupported: function(oMetaModel) {
			var oEntityContainer = oMetaModel.getObject("/");
			for (var sEntitySet in oEntityContainer) {
				if (
					oEntityContainer[sEntitySet].$kind === "EntitySet" &&
					oMetaModel.getObject("/" + sEntitySet + "@com.sap.vocabularies.Session.v1.StickySessionSupported")
				) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Method to determine if the programming model is draft.
		 *
		 * @function
		 * @name isDraftSupported
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which draft support shall be checked
		 * @returns {boolean} - returns true if draft, else false
		 */
		isDraftSupported: function(oContext) {
			var oMetaModel = oContext.getModel().getMetaModel(),
				oMetaContext = oMetaModel.getMetaContext(oMetaModel.getMetaPath(oContext.getPath())),
				sTargetEntitySet = this.getTargetEntitySet(oMetaContext),
				oEntityContext = oMetaModel.getMetaContext(sTargetEntitySet);

			if (
				oEntityContext.getObject("@com.sap.vocabularies.Common.v1.DraftRoot") ||
				oEntityContext.getObject("@com.sap.vocabularies.Common.v1.DraftNode")
			) {
				return true;
			}
			return false;
		},

		/**
		 * Returns path to the target entity set via using navigation property binding.
		 *
		 * @function
		 * @name getTargetEntitySet
		 * @param {sap.ui.model.odata.v4.Context} oContext context for which the target entity set shall be determined
		 * @returns {string} - returns path to the target entity set
		 */
		getTargetEntitySet: function(oContext) {
			var sPath = oContext.getPath();
			if (
				oContext.getObject("$kind") === "EntitySet" ||
				oContext.getObject("$kind") === "Action" ||
				oContext.getObject("0/$kind") === "Action"
			) {
				return sPath;
			}
			var sEntitySetPath = ModelHelper.getEntitySetPath(sPath);
			return "/" + oContext.getObject(sEntitySetPath);
		},

		/**
		 * Returns complete path to the entity set via using navigation property binding.
		 *
		 * @function
		 * @name getEntitySetPath
		 * @param {string}  sPath for which complete entitySet path needs to be determined
		 * @returns {string} - returns complete path to the entity set
		 */
		getEntitySetPath: function(sPath) {
			return (
				"/" +
				sPath
					.split("/")
					.filter(function(sPathPart) {
						return sPathPart !== "" && sPathPart !== "$NavigationPropertyBinding";
					})
					.join("/$NavigationPropertyBinding/")
			);
		},

		/**
		 * Adds a setProperty to the created binding contexts of the internal JSON model.
		 *
		 * @function
		 * @name enhanceInternalJSONModel
		 * @param {sap.ui.model.json.JSONModel} Internal JSON Model which is enhanced
		 */

		enhanceInternalJSONModel: function(oInternalModel) {
			var fnBindContext = oInternalModel.bindContext;
			oInternalModel.bindContext = function(sPath, oContext, mParameters) {
				var oContext = fnBindContext.apply(this, arguments);
				var fnGetBoundContext = oContext.getBoundContext;

				oContext.getBoundContext = function() {
					var oBoundContext = fnGetBoundContext.apply(this, arguments);
					if (oBoundContext && !oBoundContext.setProperty) {
						oBoundContext.setProperty = function(sPath, value) {
							if (this.getObject() === undefined) {
								// initialize
								this.getModel().setProperty(this.getPath(), {});
							}
							this.getModel().setProperty(sPath, value, this);
						};
					}
					return oBoundContext;
				};
				return oContext;
			};
		}
	};
	return ModelHelper;
});
