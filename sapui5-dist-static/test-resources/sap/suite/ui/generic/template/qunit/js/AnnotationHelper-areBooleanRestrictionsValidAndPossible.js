sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {

		module("Tests for areBooleanRestrictionsValidAndPossible", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				var that = this;
				var oModel = {
					getODataProperty: function (oType, vName, bAsPath) {
						var oODataProperty = null;
						if (oType.name === "STTA_C_MP_ProductType" && vName === "CanDelete") {
							oODataProperty = {name: "CanDelete", type: "Edm.Boolean"};
						} else if (oType.name === "STTA_C_MP_ProductRestrictionType" && vName === "CanDelete") {
							oODataProperty = {name: "CanDelete", type: "Edm.Boolean"};
						}
						return oODataProperty;
					},
					getODataEntityType: function (sQualifiedName, bAsPath) {
						var oODataEntityType = null;
						if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
							oODataEntityType = {name: "STTA_C_MP_ProductType"};
						} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType") {
							oODataEntityType = {name: "STTA_C_MP_ProductRestrictionType"};
						}
						return oODataEntityType;
					},
					getODataAssociationEnd: function (oEntityType, sName) {
						var oODataAssociationEnd = null;
						if (sName === "to_ProductText") {
							oODataAssociationEnd = {
								entitySet: "STTA_C_MP_ProductText",
								type: "STTA_PROD_MAN.STTA_C_MP_ProductRestrictionType",
								multiplicity: "0..*"
							};
						}
						return oODataAssociationEnd;
					},
					getODataAssociationSetEnd: function (oEntityType, sName) {
						if (sName === "to_ProductText") {
							oODataAssociationEnd = {
								entitySet: "STTA_C_MP_ProductText"
							};
						}
						return oODataAssociationEnd;
					},
					getODataEntitySet: function(sName) {
						return that.oSourceEntitySet;
					}
				};
				this.oInterface = {
					getInterface: function (i) {
						return (i === 0) && {
							getModel: function () {
								return oModel;
							}
						};
					}
				};
				this.oRelatedEntitySet = undefined;
				this.sSourceEntitySet = undefined;
				this.mRestrictions = undefined;

				var Log = sap.ui.require("sap/base/Log");
				this.stubLogError = sinon.stub(Log, "error");
			},
			afterEach: function () {
				this.oAnnotationHelper = null;

				this.stubLogError.restore();
			}
		});

		QUnit.test("Function areBooleanRestrictionsValidAndPossible is available", function () {
			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible);
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN neither deletable nor deletable-path are annotated", function () {
			this.mRestrictions = undefined;
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Deletable is set to true", function () {
			this.mRestrictions = {
				"Deletable": {
					"Bool": "true"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN Deletable contains value and path", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDelete",
					"Bool": "false"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(this.stubLogError.called, "Error log should be called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN Deletable is set to false", function () {
			this.mRestrictions = {
				"Deletable": {
					"Bool": "false"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Deletable is set to false, but only validity should be checked", function () {
			this.mRestrictions = {
				"Deletable": {
					"Bool": "false"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable", undefined, true));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN deletable-path is set to a valid path", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDelete"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN deletable-path is set to a property that is not Edm.Boolean", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDeleteBad"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(this.stubLogError.calledOnce, "Error log should be called once");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN deletable-path is set to a property that is not found", function () {
			this.mRestrictions = {
				"Deletable": {
					"Path": "CanDeleteDoesNotExist"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};

			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Deletable"));
			ok(this.stubLogError.calledOnce, "Error log should be called once");
		});

		/*
			Tests for InsertRestrictions set via Navigation Restrictions
		*/

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Insertable is set to true via Navigation Restrictions", function () {
			this.mRestrictions = {
				"Insertable": {
					"Bool": "false" //This should be ignored as NavRestrictions get the priority
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
				"name": "STTA_C_MP_ProductText"
			};
			this.sSourceEntitySet = "STTA_C_MP_Product";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.NavigationRestrictions": {
					"RestrictedProperties": [
						{
							"InsertRestrictions": {
								"Insertable": {
									"Bool": "true"
								}
							},
							"NavigationProperty": {
								"NavigationPropertyPath": "to_ProductText"
							}
						}
					]
				}
			};
			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Insertable", this.sSourceEntitySet));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Insertable is set to a valid path via Navigation Restrictions", function () {
			this.mRestrictions = {
				"Insertable": {
					"Bool": "false" //This should be ignored as NavRestrictions get the priority
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
				"name": "STTA_C_MP_ProductText"
			};
			this.sSourceEntitySet = "STTA_C_MP_Product";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.NavigationRestrictions": {
					"RestrictedProperties": [
						{
							"InsertRestrictions": {
								"Insertable": {
									"Path": "CanDelete"
								}
							},
							"NavigationProperty": {
								"NavigationPropertyPath": "to_ProductText"
							}
						}
					]
				}
			};
			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Insertable", this.sSourceEntitySet));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN Insertable is set to an invalid path via Navigation Restrictions", function () {
			this.mRestrictions = {
				"Insertable": {
					"Bool": "false" //This should be ignored as NavRestrictions get the priority
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
				"name": "STTA_C_MP_ProductText"
			};
			this.sSourceEntitySet = "STTA_C_MP_Product";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
				"Org.OData.Capabilities.V1.NavigationRestrictions": {
					"RestrictedProperties": [
						{
							"InsertRestrictions": {
								"Insertable": {
									"Path": "CanDeleteBad"
								}
							},
							"NavigationProperty": {
								"NavigationPropertyPath": "to_ProductText"
							}
						}
					]
				}
			};
			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Insertable", this.sSourceEntitySet));
			ok(this.stubLogError.calledOnce, "Error log should be called once");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN insertable property is undefined for the NavigationRestrictions of the root collection, but Insertable is set to true via the navigation collection", function () {
			this.mRestrictions = {
				"Insertable": {
					"Bool": "true"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
				"name": "STTA_C_MP_ProductText"
			};
			this.sSourceEntitySet = "STTA_C_MP_Product";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};
			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Insertable", this.sSourceEntitySet));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns false WHEN insertable property is undefined for the NavigationRestrictions of the root collection, but Insertable is set to false via the navigation collection", function () {
			this.mRestrictions = {
				"Insertable": {
					"Bool": "false"
				}
			};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
				"name": "STTA_C_MP_ProductText"
			};
			this.sSourceEntitySet = "STTA_C_MP_Product";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};
			ok(!this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Insertable", this.sSourceEntitySet));
			ok(!this.stubLogError.called, "Error log should not called");
		});

		QUnit.test("areBooleanRestrictionsValidAndPossible returns true WHEN insertable property is undefined both for the NavigationRestrictions of the root collection and navigation collection", function () {
			this.mRestrictions = {};
			this.oRelatedEntitySet = {
				"entityType": "STTA_PROD_MAN.STTA_C_MP_ProductTextType",
				"name": "STTA_C_MP_ProductText"
			};
			this.sSourceEntitySet = "STTA_C_MP_Product";

			this.oSourceEntitySet = {
				name: "STTA_C_MP_Product",
				entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
			};
			ok(this.oAnnotationHelper.areBooleanRestrictionsValidAndPossible(this.oInterface, this.mRestrictions, this.oRelatedEntitySet, "Insertable", this.sSourceEntitySet));
			ok(!this.stubLogError.called, "Error log should not called");
		});
});
