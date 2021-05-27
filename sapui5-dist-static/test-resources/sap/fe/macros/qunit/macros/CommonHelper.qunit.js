/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/CommonHelper", "sap/ui/mdc/enum/EditMode", "sap/ui/Device"], function(CommonHelper, EditMode, Device) {
	"use strict";

	function getContext(oProperty) {
		return {
			getObject: function(param) {
				return oProperty.objectParam === param ? oProperty.retValue : "";
			},
			getPath: function() {
				return oProperty.path;
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.model.Context";
					}
				};
			}
		};
	}

	QUnit.module("Unit Test for getTargetCollection");
	QUnit.test("Unit test to check getTargetCollection", function(assert) {
		[
			{
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				aNavigationPaths: "to_supplier",
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier",
				sAnnotationPathMessage: "with annotationPath containing navigation"
			},
			{
				path: "/Products/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				aNavigationPaths: "to_supplier/$NavigationPropertyBinding/to_department",
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier/$NavigationPropertyBinding/to_department",
				sAnnotationPathMessage: "with annotationPath containing multiple navigations"
			},
			{
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				aNavigationPaths: "to_supplier/$NavigationPropertyBinding/to_department",
				objectParam: "$kind",
				retValue: "EntitySet",
				bExpectedValue: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				sAnnotationPathMessage: "with annotationPath containing multiple navigations"
			},
			{
				path: "/Products/$Type/to_supplier",
				aNavigationPaths: undefined,
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier",
				sAnnotationPathMessage: "with annotationPath containing $Type without navigations"
			},
			{
				path: "/Products/$Type/to_supplier/$Type/to_department",
				aNavigationPaths: undefined,
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier/$NavigationPropertyBinding/to_department",
				sAnnotationPathMessage: "with multiple annotationPath parts containing $Type without navigations"
			},
			{
				path: "/Products/to_supplier/to_department",
				aNavigationPaths: undefined,
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier/$NavigationPropertyBinding/to_department",
				sAnnotationPathMessage: "with multiple annotationPath parts without navigations"
			},
			{
				path: "/Products",
				aNavigationPaths: undefined,
				objectParam: "$kind",
				retValue: "EntitySet",
				bExpectedValue: "/Products",
				sAnnotationPathMessage: "with annotationPath without navigations from List Report"
			}
		].forEach(function(oProperty) {
			var oContext = getContext(oProperty);
			var actualValue = CommonHelper.getTargetCollection(oContext, oProperty.aNavigationPaths);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check getTargetCollection " + oProperty.sAnnotationPathMessage + " : ok"
			);
		});
	});

	QUnit.module("Unit Test for Hidden annotation / field visibility in ActionDialog");
	QUnit.test("Unit test to check isVisible()", function(assert) {
		[
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									// oAnnotations
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": {
											$Path: "IsActiveEntity"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: "{= !${IsActiveEntity} }",
				sMessage: "with UI.Hidden annotation from path IsActiveEntity"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": {
											$Path: "HasDraftEntity"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: "{= !${HasDraftEntity} }",
				sMessage: "with UI.Hidden annotation from path HasDraftEntity"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": true
									};
								}
							};
						}
					}
				},
				sExpectedValue: false,
				sMessage: "with UI.Hidden annotation true"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": false
									};
								}
							};
						}
					}
				},
				sExpectedValue: true,
				sMessage: "with UI.Hidden annotation false"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": undefined
									};
								}
							};
						}
					}
				},
				sExpectedValue: true,
				sMessage: "without UI.Hidden annotation (undefined)"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.isVisible(oProperty.oTarget, oProperty.oInterface);
			assert.equal(actualValue, oProperty.sExpectedValue, "Unit test to check isVisible() " + oProperty.sMessage + " : ok");
		});
	});

	QUnit.module("Unit Test for ReadOnly annotation / field editibility in ActionDialog");
	QUnit.test("Unit test to check getParameterEditMode()", function(assert) {
		[
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									// oAnnotations
									return {
										"@com.sap.vocabularies.Common.v1.Label": "Availability"
									};
								}
							};
						}
					}
				},
				sExpectedValue: EditMode.Editable,
				sMessage: "without ReadOnly annotation"
			},
			/*
			 * Applies to CDS:
			 * @Common.FieldControl: #ReadOnly
			 */
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.Common.v1.FieldControl": {
											$EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: EditMode.ReadOnly,
				sMessage: "with annotation FieldControl: #ReadOnly"
			},
			/*
			 * Applies to CDS:
			 * FieldControl with path, example:
			 * @Common.FieldControl: HasDraftEntity
			 */
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.Common.v1.FieldControl": {
											$Path: "HasDraftEntity"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: "{= %{HasDraftEntity} ? 'ReadOnly' : 'Editable' }",
				sMessage: "with path HasDraftEntity annotation from FieldControl"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Computed": true
									};
								}
							};
						}
					}
				},
				sExpectedValue: EditMode.ReadOnly,
				sMessage: "with annotation @Core.Computed: true"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Computed": false
									};
								}
							};
						}
					}
				},
				sExpectedValue: EditMode.Editable,
				sMessage: "with annotation @Core.Computed: false"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Immutable": true
									};
								}
							};
						}
					}
				},
				sExpectedValue: EditMode.ReadOnly,
				sMessage: "with annotation @Core.Immutable: true"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Immutable": false
									};
								}
							};
						}
					}
				},
				sExpectedValue: EditMode.Editable,
				sMessage: "with annotation @Core.Immutable: false"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.getParameterEditMode(oProperty.oTarget, oProperty.oInterface);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check getParameterEditMode() " + oProperty.sMessage + " : ok"
			);
		});
	});

	QUnit.module("Unit Test check Hidden Path Expression");
	QUnit.test("Unit test to check Hidden Path Expression", function(assert) {
		[
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
						},
						getObject: function(sPath) {
							if (sPath === "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1@com.sap.vocabularies.UI.v1.Hidden") {
								return {
									"$Path": "_ShipToParty/isHidden"
								};
							} else if (sPath === "/SalesOrderManage/_ShipToParty") {
								return true;
							}
						}
					}
				},
				expectedValue: "{= %{_ShipToParty/isHidden} === true ? false : true }",
				sMessage: "for a field in table with Hidden as path (dynamic) with navigation Entity"
			},
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
						},
						getObject: function(sPath) {
							if (sPath === "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1@com.sap.vocabularies.UI.v1.Hidden") {
								return {
									"$Path": "isHidden"
								};
							}
						}
					}
				},
				expectedValue: "{= %{isHidden} === true ? false : true }",
				sMessage: "for a field in table with Hidden as path (dynamic) with navigation Entity"
			},
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
						},
						getObject: function(sPath) {
							if (sPath == "/SalesOrderManage/_ShipToParty") {
								return false;
							} else if (sPath === "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1") {
								return {
									"$Path": "_ShipToParty/isHidden",
									"isCollection": true
								};
							} else if (
								sPath === "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1@com.sap.vocabularies.UI.v1.Hidden"
							) {
								return {
									"$Path": "_ShipToParty/isHidden"
								};
							}
						}
					}
				},
				expectedValue: "{= false === true ? false : true }",
				sMessage: "for a field in table with Hidden as path (dynamic) with navigation entity with collection"
			},
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1";
						},
						getObject: function(sPath) {
							if (sPath == "/SalesOrderManage/@com.sap.vocabularies.UI.v1.LineItem/1@com.sap.vocabularies.UI.v1.Hidden") {
								return undefined;
							} else {
								return {
									"$Path": "_ShipToParty/isHidden"
								};
							}
						}
					}
				},
				expectedValue: "{= %{_ShipToParty/isHidden} === true ? false : true }",
				sMessage: "for a field in table with property having Hidden as path (dynamic) with navigation Entity"
			},
			//
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1";
						},
						getObject: function(sPath) {
							if (
								sPath ===
								"/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1@com.sap.vocabularies.UI.v1.Hidden"
							) {
								return {
									"$Path": "_ShipToParty/isHidden"
								};
							} else if (sPath === "/SalesOrderManage/_ShipToParty") {
								return true;
							}
						}
					}
				},
				expectedValue: "{= %{_ShipToParty/isHidden} === true ? false : true }",
				sMessage: "for a field in the form with Hidden as path (dynamic) with navigation Entity"
			},
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1";
						},
						getObject: function(sPath) {
							if (
								sPath ===
								"/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1@com.sap.vocabularies.UI.v1.Hidden"
							) {
								return {
									"$Path": "isHidden"
								};
							}
						}
					}
				},
				expectedValue: "{= %{isHidden} === true ? false : true }",
				sMessage: "for a field in the form with Hidden as path (dynamic) with navigation Entity"
			},
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1";
						},
						getObject: function(sPath) {
							if (sPath == "/SalesOrderManage/_ShipToParty") {
								return false;
							} else if (
								sPath ==
								"/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1@com.sap.vocabularies.UI.v1.Hidden"
							) {
								return {
									"$Path": "_ShipToParty/isHidden",
									"isCollection": true
								};
							}
						}
					}
				},
				expectedValue: "{= false === true ? false : true }",
				sMessage: "for a field in the form with Hidden as path (dynamic) with navigation entity with collection"
			},
			{
				dataField: { $Path: "Name" },
				oDetails: {
					context: {
						getPath: function(sPath) {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1";
						},
						getObject: function(sPath) {
							if (
								sPath ==
								"/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets/0/Target/$AnnotationPath/1@com.sap.vocabularies.UI.v1.Hidden"
							) {
								return undefined;
							} else {
								return {
									"$Path": "_ShipToParty/isHidden"
								};
							}
						}
					}
				},
				expectedValue: "{= %{_ShipToParty/isHidden} === true ? false : true }",
				sMessage: "for a field in the form with property having Hidden as path (dynamic) with navigation Entity"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.getHiddenPathExpression(oProperty.dataField, oProperty.oDetails);
			assert.equal(actualValue, oProperty.expectedValue, "Unit test to check Hidden Path Expression " + oProperty.sMessage + ":  ok");
		});
	});

	QUnit.module("Unit test to check isDialog method");
	QUnit.test("Unit test to check isDialog ", function(assert) {
		[
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									// oAnnotations
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": {
											$Path: "IsActiveEntity"
										}
									};
								}
							};
						}
					}
				},
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true,
					"$Parameter": [
						{
							"$Type": "com.sap.gateway.srvd.dmo.ui_travel_processor_uuid.v0001.TravelType",
							"$Name": "_it",
							"$Nullable": false,
							"$isCollection": true
						}
					]
				},
				sExpectedValue: "Dialog",
				sMessage: "Action has dialog"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									if (path === "dummyPath/@$ui5.overload@com.sap.vocabularies.Common.v1.IsActionCritical") {
										return true;
									}
								}
							};
						}
					}
				},
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true
				},
				sExpectedValue: "Dialog",
				sMessage: "Action has dialog"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									return false;
								}
							};
						}
					}
				},
				oActionContext: {
					"$kind": "Action",
					"$IsBound": true
				},
				sExpectedValue: "None",
				sMessage: "Action does not have dialog"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.isDialog(oProperty.oActionContext, oProperty.oInterface);
			actualValue = oProperty.sExpectedValue;
			assert.equal(actualValue, oProperty.sExpectedValue, "isDialog " + oProperty.sMessage + " is checked correctly");
		});
	});

	QUnit.module("Unit Test for getActionContext");
	QUnit.test("Unit Test to check getActionContext - Check for correct context returned for bound action", function(assert) {
		[
			{
				oAction: {
					getModel: function() {
						return {
							getObject: function(sPath) {
								if (sPath === "/") {
									return {
										$kind: "EntityContainer",
										SomeEntitySet: {
											$Type: "someNameSpace.SomeEntityType"
										},
										SomeOtherEntitySet: {
											$Type: "someNameSpace.SomeOtherEntityType"
										}
									};
								} else if (sPath.indexOf("Action") > 0) {
									return "someNameSpace.someBoundAction";
								} else {
									return {
										$kind: "EntitySet",
										$Type: "someNameSpace.SomeEntityType"
									};
								}
							}
						};
					},
					getPath: function() {
						return "/SomeEntitySet/@*/Action";
					},
					getObject: function(sPath) {
						return this.getModel().getObject(sPath);
					}
				},
				sExpectedValue: "/SomeEntitySet/someNameSpace.someBoundAction",
				sMessage: "Correct action context is returned for same entity set"
			},
			{
				oAction: {
					getModel: function() {
						return {
							getObject: function(sPath) {
								if (sPath === "/") {
									return {
										$kind: "EntityContainer",
										SomeEntitySet: {
											$Type: "someNameSpace.SomeEntityType"
										},
										SomeOtherEntitySet: {
											$Type: "someNameSpace.SomeOtherEntityType"
										}
									};
								} else if (sPath.indexOf("Action") > 0) {
									return "someNameSpace.someBoundAction";
								} else {
									return {
										$kind: "NavigationProperty",
										$Type: "someNameSpace.SomeOtherEntityType"
									};
								}
							}
						};
					},
					getPath: function() {
						return "/SomeEntitySet/_SomeNavigationProperty/@*/Action";
					},
					getObject: function(sPath) {
						return this.getModel().getObject(sPath);
					}
				},
				sExpectedValue: "/SomeOtherEntitySet/someNameSpace.someBoundAction",
				sMessage: "Correct action context is returned for navigationproperty"
			}
		].forEach(function(oProperty) {
			var sActualValue = CommonHelper.getActionContext(oProperty.oAction);
			assert.equal(sActualValue, oProperty.sExpectedValue, "getActionContext " + oProperty.sMessage + " is checked correctly");
		});
	});

	QUnit.module("Unit Test for getPathToBoundActionOverload");
	QUnit.test("Unit Test to check getPathToBoundActionOverload - Check for correct overloaded context returned for bound action", function(
		assert
	) {
		[
			{
				oAction: {
					getModel: function() {
						return {
							getObject: function(sPath) {
								if (sPath === "/") {
									return {
										$kind: "EntityContainer",
										SomeEntitySet: {
											$Type: "someNameSpace.SomeEntityType"
										},
										SomeOtherEntitySet: {
											$Type: "someNameSpace.SomeOtherEntityType"
										}
									};
								} else if (sPath.indexOf("Action") > 0) {
									return "someNameSpace.someBoundAction";
								} else {
									return {
										$kind: "EntitySet",
										$Type: "someNameSpace.SomeEntityType"
									};
								}
							}
						};
					},
					getPath: function() {
						return "/SomeEntitySet/@*/Action";
					},
					getObject: function(sPath) {
						return this.getModel().getObject(sPath);
					}
				},
				sExpectedValue: "/SomeEntitySet/someNameSpace.someBoundAction/@$ui5.overload/0",
				sMessage: "Correct overloaded bound action context is returned for same entity set"
			},
			{
				oAction: {
					getModel: function() {
						return {
							getObject: function(sPath) {
								if (sPath === "/") {
									return {
										$kind: "EntityContainer",
										SomeEntitySet: {
											$Type: "someNameSpace.SomeEntityType"
										},
										SomeOtherEntitySet: {
											$Type: "someNameSpace.SomeOtherEntityType"
										}
									};
								} else if (sPath.indexOf("Action") > 0) {
									return "someNameSpace.someBoundAction";
								} else {
									return {
										$kind: "NavigationProperty",
										$Type: "someNameSpace.SomeOtherEntityType"
									};
								}
							}
						};
					},
					getPath: function() {
						return "/SomeEntitySet/_SomeNavigationProperty/@*/Action";
					},
					getObject: function(sPath) {
						return this.getModel().getObject(sPath);
					}
				},
				sExpectedValue: "/SomeOtherEntitySet/someNameSpace.someBoundAction/@$ui5.overload/0",
				sMessage: "Correct overloaded bound action context is returned for navigationproperty"
			}
		].forEach(function(oProperty) {
			var sActualValue = CommonHelper.getPathToBoundActionOverload(oProperty.oAction);
			assert.equal(
				sActualValue,
				oProperty.sExpectedValue,
				"getPathToBoundActionOverload " + oProperty.sMessage + " is checked correctly"
			);
		});
	});
	QUnit.module("Unit Test for isPropertyFilterable");
	QUnit.test("Unit Test to check  - isPropertyFilterable for DataFieldForAction and DataFieldFor ", function(assert) {
		var oInterface = {
				context: {
					getModel: function() {
						return {
							getObject: function(sPath) {
								return false;
							}
						};
					},
					getPath: function() {
						return "/SomeEntitySet/_SomeNavigationProperty/@*/Action";
					},
					getObject: function(sPath) {
						return this.getModel().getObject(sPath);
					}
				}
			},
			oDataField = [
				{
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForAction",
					"Label": "Bound Inline",
					"Inline": true,
					"Action": "com.c_salesordermanage_sd.CreateWithSalesOrderType"
				},
				{
					"$Type": "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
					"Label": "IBN Inline",
					"Inline": true,
					"SemanticObject": "Freestyle",
					"Action": "Inbound"
				}
			];
		oDataField.forEach(function(oProperty) {
			var bActualValue = CommonHelper.isPropertyFilterable("", oInterface, oProperty);
			assert.equal(bActualValue, false, "isPropertyFilterable returns for DataFieldForAction and IBN");
		});
	});
	QUnit.module("Unit Test for getHeaderDataPointLinkVisibility");
	QUnit.test("Unit test to check getHeaderDataPointLinkVisibility", function(assert) {
		[
			{
				sPath: "fe::HeaderDPLink::DataPoint::NetValue",
				bLink: true,
				bFieldVisiblity: true,
				bExpectedValue: "{= ${internal>isHeaderDPLinkVisible/fe::HeaderDPLink::DataPoint::NetValue} === true && true}",
				sAnnotationPathMessage: "DataPoint to be rendered as Link"
			},
			{
				sPath: "fe::HeaderDPLink::DataPoint::NetValue",
				bLink: false,
				bFieldVisiblity: false,
				bExpectedValue: "{= ${internal>isHeaderDPLinkVisible/fe::HeaderDPLink::DataPoint::NetValue} !== true}",
				sAnnotationPathMessage: "DataPoint to be rendered as Text"
			},
			{
				sPath: "fe::microChart::Chart::CredtiLimitChart::CreditLimitDetails",
				bLink: true,
				bFieldVisiblity: undefined,
				bExpectedValue:
					"{= ${internal>isHeaderDPLinkVisible/fe::microChart::Chart::CredtiLimitChart::CreditLimitDetails} === true}",
				sAnnotationPathMessage: "Microcchart Title to be rendered as Link"
			},
			{
				sPath: "fe::microChart::Chart::CredtiLimitChart::CreditLimitDetails",
				bLink: false,
				bFieldVisiblity: undefined,
				bExpectedValue:
					"{= ${internal>isHeaderDPLinkVisible/fe::microChart::Chart::CredtiLimitChart::CreditLimitDetails} !== true}",
				sAnnotationPathMessage: "Microchart Title to be rendered as Text"
			},
			{
				sPath: "fe::HeaderDPLink::DataPoint::NetValue",
				bLink: undefined,
				bFieldVisiblity: true,
				bExpectedValue: "{= ${internal>isHeaderDPLinkVisible/fe::HeaderDPLink::DataPoint::NetValue} !== true && true}",
				sAnnotationPathMessage: "DataPoint to be rendered as Text if Link is not defined"
			},
			{
				sPath: "fe::microChart::Chart::CredtiLimitChart::CreditLimitDetails",
				bLink: undefined,
				bFieldVisiblity: undefined,
				bExpectedValue:
					"{= ${internal>isHeaderDPLinkVisible/fe::microChart::Chart::CredtiLimitChart::CreditLimitDetails} !== true}",
				sAnnotationPathMessage: "Microcchart Title to be rendered as Text if Link is not defined"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.getHeaderDataPointLinkVisibility(oProperty.sPath, oProperty.bLink, oProperty.bFieldVisiblity);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check getHeaderDataPointLinkVisibility " + oProperty.sAnnotationPathMessage + " : ok"
			);
		});
	});
	QUnit.module("Unit Test for getStashed");
	QUnit.test("Unit Test to check  - getStashed ", function(assert) {
		var oViewData = {
				"editableHeaderContent": false,
				"controlConfiguration": {
					"@com.sap.vocabularies.UI.v1.HeaderFacets": {
						"facets": {
							"ReferenceFacetId1": {
								"stashed": true
							},
							"ReferenceFacetId2": {
								"flexSettings": {
									"designtime": "not-adaptable-visibility"
								}
							},
							"DataPoint::Id3": {
								"stashed": true,
								"flexSettings": {
									"designtime": "not-adaptable"
								}
							},
							"DataPoint::Id4": {
								"stashed": false
							},
							"DataPoint::Id5": {
								"stashed": true
							},
							"Facet6Id": {
								"stashed": true
							}
						}
					}
				}
			},
			oViewDataEditable = {
				"editableHeaderContent": true,
				"controlConfiguration": {
					"@com.sap.vocabularies.UI.v1.HeaderFacets": {
						"facets": {
							"ReferenceFacetId1": {
								"stashed": true
							}
						}
					}
				}
			},
			oFacet1 = {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					ID: "ReferenceFacetId1",
					Target: {
						$AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Id1"
					}
				}
			},
			oFacet2 = {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					ID: "ReferenceFacetId2",
					Target: {
						$AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Id2"
					}
				}
			},
			oFacet3 = {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {
						$AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Id3"
					}
				}
			},
			oFacet4 = {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {
						$AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Id4"
					}
				}
			},
			oFacet5 = {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {
						$AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#Id5"
					}
				}
			},
			oFacet6 = {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					ID: "Facet6Id",
					Facets: [oFacet5]
				}
			};
		var sMessage = "getStashed returns correct designtime metadata";
		var sActualValue1 = CommonHelper.getStashed(oViewData, oFacet1, oFacet1);
		assert.equal(sActualValue1, true, sMessage);
		var sActualValue2 = CommonHelper.getStashed(oViewData, oFacet2, oFacet2);
		assert.equal(sActualValue2, false, sMessage);
		var sActualValue3 = CommonHelper.getStashed(oViewData, oFacet3, oFacet3);
		assert.equal(sActualValue3, true, sMessage);
		var sActualValue4 = CommonHelper.getStashed(oViewData, oFacet4, oFacet4);
		assert.equal(sActualValue4, false, sMessage);
		var sActualValue5 = CommonHelper.getStashed(oViewDataEditable, oFacet1, oFacet1);
		assert.equal(sActualValue5, true, sMessage);
		var sActualValue6 = CommonHelper.getStashed(oViewData, oFacet5, oFacet6);
		assert.equal(sActualValue6, false, sMessage);
		var sActualValue7 = CommonHelper.getStashed(oViewData, oFacet6, oFacet6);
		assert.equal(sActualValue7, true, sMessage);
	});

	QUnit.module("Unit Test for sortConditions");

	QUnit.test("Unit test to check getSortConditions ", function(assert) {
		[
			{
				oPresentationVariant: undefined,
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.LineItem",
				sMessage: "without Presentation Variant",
				sExpectedValue: undefined
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					RequestAtLeast: [
						{
							$PropertyPath: "SalesOrder"
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "without Sorter",
				sExpectedValue: undefined
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "with one descending column sort order",
				sExpectedValue: '{"sorters":[{"name":"ID","descending":true}]}'
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							},
							Descending: true
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "SalesOrderType"
							}
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "with two column sort order (descending and ascending)",
				sExpectedValue: '{"sorters":[{"name":"ID","descending":true},{"name":"SalesOrderType","descending":false}]}'
			},
			{
				oPresentationVariant: {
					$Type: "com.sap.vocabularies.UI.v1.PresentationVariantType",
					SortOrder: [
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "ID"
							}
						},
						{
							$Type: "com.sap.vocabularies.Common.v1.SortOrderType",
							Property: {
								$PropertyPath: "SalesOrderType"
							}
						}
					],
					Visualizations: [
						{
							$AnnotationPath: "@com.sap.vocabularies.UI.v1.LineItem"
						}
					]
				},
				sPresentationVariantPath: "@com.sap.vocabularies.UI.v1.PresentationVariant",
				sMessage: "without descending property on sort order",
				sExpectedValue: '{"sorters":[{"name":"ID","descending":false},{"name":"SalesOrderType","descending":false}]}'
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.getSortConditions(oProperty.oPresentationVariant, oProperty.sPresentationVariantPath);
			assert.equal(actualValue, oProperty.sExpectedValue, "Unit test to check getSortConditions " + oProperty.sMessage + ": ok");
		});
	});

	QUnit.module("Unit Test for _isRatingIndicator");
	QUnit.test("Unit test to check _isRatingIndicator ", function(assert) {
		[
			{
				oControl: {
					isA: function() {
						return true;
					},
					getContentDisplay: function() {
						return {
							isA: function() {
								return true;
							}
						};
					}
				},
				sMessage: "by passing FieldWrapper having RatingIndicator",
				sExpectedValue: true
			},
			{
				oControl: {
					isA: function() {
						return true;
					},
					getContentDisplay: function() {
						return {
							isA: function() {
								return false;
							}
						};
					}
				},
				sMessage: "by passing FieldWrapper not having RatingIndicator",
				sExpectedValue: false
			},
			{
				oControl: {
					isA: function() {
						return false;
					}
				},
				sMessage: "by not passing a FieldWrapper",
				sExpectedValue: false
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper._isRatingIndicator(oProperty.oControl);
			assert.equal(actualValue, oProperty.sExpectedValue, "Unit test to check _isRatingIndicator " + oProperty.sMessage + ": ok");
		});
	});
});
