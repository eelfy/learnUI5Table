sap.ui.define(["sap/base/Log"], function(Log) {
	"use strict";
	var SemanticKeyHelper = {
		getSemanticKeys: function(oMetaModel, sEntitySetName) {
			return oMetaModel.getObject("/" + sEntitySetName + "/@com.sap.vocabularies.Common.v1.SemanticKey");
		},
		getSemanticObjectInformation: function(oMetaModel, sEntitySetName) {
			var oSemanticObject = oMetaModel.getObject("/" + sEntitySetName + "/@com.sap.vocabularies.Common.v1.SemanticObject");
			var aSemanticKeys = this.getSemanticKeys(oMetaModel, sEntitySetName);
			return {
				semanticObject: oSemanticObject,
				semanticKeys: aSemanticKeys
			};
		},
		getSemanticPath: function(oContext) {
			var oMetaModel = oContext.getModel().getMetaModel(),
				sEntitySetName = oMetaModel.getMetaContext(oContext.getPath()).getObject("@sapui.name"),
				oSemanticObjectInformation = this.getSemanticObjectInformation(oMetaModel, sEntitySetName),
				sTechnicalPath,
				sSemanticPath;

			if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding") && oContext.isRelative()) {
				sTechnicalPath = oContext.getHeaderContext().getPath();
			} else {
				sTechnicalPath = oContext.getPath();
			}

			if (this._isPathForSemantic(sTechnicalPath) && oSemanticObjectInformation.semanticKeys) {
				var aSemanticKeys = oSemanticObjectInformation.semanticKeys,
					oEntityType = oMetaModel.getObject("/" + oMetaModel.getObject("/" + sEntitySetName).$Type);

				try {
					var sSemanticKeysPart = aSemanticKeys
						.map(function(oSemanticKey) {
							var sPropertyPath = oSemanticKey.$PropertyPath,
								sKeyValue = oContext.getProperty(sPropertyPath);

							if (sKeyValue === undefined || sKeyValue === null) {
								throw new Error("Couldn't resolve semantic key value for " + sPropertyPath);
							} else {
								if (oEntityType[sPropertyPath].$Type === "Edm.String") {
									sKeyValue = "'" + encodeURIComponent(sKeyValue) + "'";
								}
								if (aSemanticKeys.length > 1) {
									// Several semantic keys --> path should be entitySet(key1=value1, key2=value2, ...)
									// Otherwise we keep entitySet(keyValue)
									sKeyValue = sPropertyPath + "=" + sKeyValue;
								}
								return sKeyValue;
							}
						})
						.join(",");

					sSemanticPath = "/" + sEntitySetName + "(" + sSemanticKeysPart + ")";
				} catch (e) {
					Log.info(e);
				}
			}

			return sSemanticPath || sTechnicalPath;
		},

		// ==============================
		// INTERNAL METHODS
		// ==============================

		_isPathForSemantic: function(sPath) {
			// Only path on root objects allow semantic keys, i.e. sPath = xxx(yyy)
			return /^[^\(\)]+\([^\(\)]+\)$/.test(sPath);
		}
	};
	return SemanticKeyHelper;
});
