import {
	getCreateVisible,
	getTableManifestConfiguration,
	TableControlConfiguration,
	getSelectionMode,
	TableCapabilityRestriction
} from "sap/fe/core/converters/controls/Common/Table";
import path from "path";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";
import { compileCDS, getConverterContext, getMetaModel } from "sap/fe/test/JestTemplatingHelper";
import { ConverterContext, TemplateType } from "sap/fe/core/converters/templates/BaseConverter";
import { CreationMode, ListReportManifestSettings, TableManifestSettingsConfiguration } from "sap/fe/core/converters/ManifestSettings";
import { ConverterOutput } from "@sap-ux/vocabularies-types";
import { bindingExpression, compileBinding, constant } from "sap/fe/core/helpers/BindingExpression";
import { UI } from "sap/fe/core/converters/helpers/BindingHelper";

let convertedTypes: ConverterOutput;
let convertedTypesNoOa: ConverterOutput;
let convertedTypesAnalyticalService: ConverterOutput;
let convertedTypesOaTrue: ConverterOutput;
let convertedTypesOaFalse: ConverterOutput;
let convertedTypesSelectionMode: ConverterOutput;

beforeAll(async function() {
	const sMetadataUrl = compileCDS(path.join(__dirname, "../data/Table.cds"));
	const metaModel = await getMetaModel(sMetadataUrl);
	convertedTypes = convertTypes(metaModel);

	const sMetadataUrlSelectionMode = compileCDS(path.join(__dirname, "../data/TableGetSelectionMode.cds"));
	const metaModelSelectionMode = await getMetaModel(sMetadataUrlSelectionMode);
	convertedTypesSelectionMode = convertTypes(metaModelSelectionMode);

	const sMetadataUrlAnalyticalService = compileCDS(path.join(__dirname, "../data/AnalyticalService.cds"));
	const metaModelAnalyticalService = await getMetaModel(sMetadataUrlAnalyticalService);
	convertedTypesAnalyticalService = convertTypes(metaModelAnalyticalService);

	const sMetadataUrlNoOa = compileCDS(path.join(__dirname, "../data/TableNewActionNoOperationAvailable.cds"));
	const metaModelNoOa = await getMetaModel(sMetadataUrlNoOa);
	convertedTypesNoOa = convertTypes(metaModelNoOa);

	const sMetadataUrlOaTrue = compileCDS(path.join(__dirname, "../data/TableNewActionOperationAvailableTrue.cds"));
	const metaModelOaTrue = await getMetaModel(sMetadataUrlOaTrue);
	convertedTypesOaTrue = convertTypes(metaModelOaTrue);

	const sMetadataUrlOaFalse = compileCDS(path.join(__dirname, "../data/TableNewActionOperationAvailableFalse.cds"));
	const metaModelOaFalse = await getMetaModel(sMetadataUrlOaFalse);
	convertedTypesOaFalse = convertTypes(metaModelOaFalse);
});
const getTableConfigurationForTest = (
	manifestSettings: ListReportManifestSettings,
	templateType: TemplateType = TemplateType.ListReport,
	isCondensedLayoutCompliant: boolean = false,
	userContentDensities: string = "compact",
	converterOutput: ConverterOutput = convertedTypes
): TableControlConfiguration => {
	const basicContext = getConverterContext(converterOutput, manifestSettings, templateType, userContentDensities);
	return getTableManifestConfiguration(
		basicContext.getEntityType().annotations.UI?.LineItem,
		"@com.sap.vocabularies.UI.v1.LineItem",
		basicContext,
		isCondensedLayoutCompliant
	);
};
describe("Table Converter - #getTableManifestConfiguration ", function() {
	it("works with basic configuration", () => {
		const tableConfiguration = getTableConfigurationForTest({
			entitySet: "TestEntity"
		});
		expect(tableConfiguration).toMatchSnapshot();
		expect(tableConfiguration.type === "ResponsiveTable");
	});

	it("Influence the table type", () => {
		const tableConfiguration = getTableConfigurationForTest({
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						type: "GridTable"
					}
				}
			}
		});
		expect(tableConfiguration.type).toEqual("GridTable");
	});

	it("Export Option Default", () => {
		// If defined, then the value should be equal to the provided setting
		const manifestSettings = {
			entitySet: "TestEntity"
		};
		const tableConfiguration = getTableConfigurationForTest(manifestSettings);
		expect(tableConfiguration.enableExport).toBe(true);
		const tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
		expect(tableConfigurationOP.enableExport).toBe(true);
	});

	it("Influence the Export Option", () => {
		// If defined, then the value should be equal to the provided setting
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						enableExport: true
					}
				}
			}
		};
		const tableConfiguration = getTableConfigurationForTest(manifestSettings);
		expect(tableConfiguration.enableExport).toBe(true);
		const tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
		expect(tableConfigurationOP.enableExport).toBe(true);

		const noPasteManifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						enablePaste: false
					}
				}
			}
		};
		const tableConfigurationNoPaste = getTableConfigurationForTest(noPasteManifestSettings);
		expect(tableConfigurationNoPaste.enableExport).toBe(true);
		const tableConfigurationNoPasteOP = getTableConfigurationForTest(noPasteManifestSettings, TemplateType.ObjectPage);
		expect(tableConfigurationNoPasteOP.enableExport).toBe(false);
	});
});

describe("Table Converter - #getCreateVisible ", function() {
	const IS_INSERTABLE_FALSE = constant(false);
	const IS_INSERTABLE_TRUE = constant(true);
	const IS_INSERTABLE_DYNAMIC = bindingExpression("SomeDynamicExpression");
	let BASIC_CONTEXT_LR: ConverterContext;
	let BASIC_CONTEXT_OP: ConverterContext;
	let HIDDEN_CONTEXT_LR: ConverterContext;
	let HIDDEN_CONTEXT_OP: ConverterContext;
	let DYNAMIC_HIDDEN_CONTEXT_LR: ConverterContext;
	let DYNAMIC_HIDDEN_CONTEXT_OP: ConverterContext;
	let NEW_ACTION_NO_OA: ConverterContext;
	let NEW_ACTION_OA_TRUE: ConverterContext;
	let NEW_ACTION_OA_FALSE: ConverterContext;

	beforeAll(function() {
		BASIC_CONTEXT_LR = getConverterContext(convertedTypes, { entitySet: "TestEntity" }, TemplateType.ListReport);
		BASIC_CONTEXT_OP = getConverterContext(convertedTypes, { entitySet: "TestEntity" }, TemplateType.ObjectPage);
		HIDDEN_CONTEXT_LR = getConverterContext(convertedTypes, { entitySet: "CreateHiddenEntity" }, TemplateType.ListReport);
		HIDDEN_CONTEXT_OP = getConverterContext(convertedTypes, { entitySet: "CreateHiddenEntity" }, TemplateType.ObjectPage);
		DYNAMIC_HIDDEN_CONTEXT_LR = getConverterContext(
			convertedTypes,
			{ entitySet: "CreateHiddenDynamicEntity" },
			TemplateType.ListReport
		);
		DYNAMIC_HIDDEN_CONTEXT_OP = getConverterContext(
			convertedTypes,
			{ entitySet: "CreateHiddenDynamicEntity" },
			TemplateType.ObjectPage
		);
		NEW_ACTION_NO_OA = getConverterContext(convertedTypesNoOa, { entitySet: "TestEntity" }, TemplateType.ListReport);
		NEW_ACTION_OA_TRUE = getConverterContext(convertedTypesOaTrue, { entitySet: "TestEntity" }, TemplateType.ListReport);
		NEW_ACTION_OA_FALSE = getConverterContext(convertedTypesOaFalse, { entitySet: "TestEntity" }, TemplateType.ListReport);
	});

	it("If it's statically not insertable -> create is not visible", () => {
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("false");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, "External", IS_INSERTABLE_FALSE))).toEqual("false");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("false");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, "External", IS_INSERTABLE_FALSE))).toEqual("false");
	});

	it("If create is statically hidden -> create is not visible", () => {
		expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("false");
		expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_LR, "External", IS_INSERTABLE_TRUE))).toEqual("false");
		expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("false");
		expect(compileBinding(getCreateVisible(HIDDEN_CONTEXT_OP, "External", IS_INSERTABLE_TRUE))).toEqual("false");
	});

	it("Otherwise if the create mode is external -> create is visible", () => {
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, "External", IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, "External", IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_OP, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, "External", IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, "External", IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, "External", IS_INSERTABLE_DYNAMIC))).toEqual("true");
	});

	it("If we're on the list report -> create is visible", () => {
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(BASIC_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC))).toEqual("true");
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_LR, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC))).toEqual(
			"true"
		);
	});

	it("Otherwise this depends on the value of the the UI.IsEditable", () => {
		expect(getCreateVisible(BASIC_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_TRUE)).toEqual(UI.IsEditable);
		expect(getCreateVisible(BASIC_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC)).toEqual(UI.IsEditable);
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual(
			"{= (!%{hiddenCreate} && %{ui>/isEditable})}"
		);
		expect(compileBinding(getCreateVisible(DYNAMIC_HIDDEN_CONTEXT_OP, CreationMode.CreationRow, IS_INSERTABLE_DYNAMIC))).toEqual(
			"{= (!%{hiddenCreate} && %{ui>/isEditable})}"
		);
	});

	it("If a New Action exists create depends on the Core.OperationAvailable annotation", () => {
		expect(compileBinding(getCreateVisible(NEW_ACTION_NO_OA, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(NEW_ACTION_NO_OA, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("true");

		expect(compileBinding(getCreateVisible(NEW_ACTION_OA_TRUE, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("true");
		expect(compileBinding(getCreateVisible(NEW_ACTION_OA_TRUE, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("true");

		expect(compileBinding(getCreateVisible(NEW_ACTION_OA_FALSE, CreationMode.CreationRow, IS_INSERTABLE_TRUE))).toEqual("false");
		expect(compileBinding(getCreateVisible(NEW_ACTION_OA_FALSE, CreationMode.CreationRow, IS_INSERTABLE_FALSE))).toEqual("false");
	});
});

describe("Table Converter - #getSelectionMode ", function() {
	const getSelectionModeForTest = (
		isEntitySet: boolean,
		targetCapabilities: TableCapabilityRestriction,
		basicContext: ConverterContext,
		visualizationPath: string
	): string | undefined => {
		return getSelectionMode(
			basicContext.getEntityType().annotations.UI?.LineItem,
			visualizationPath,
			basicContext,
			isEntitySet,
			targetCapabilities
		);
	};

	it("If the LR is not deletable and its table has not action : the tableSelectionMode is 'None' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithoutActionOnTable" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("None");
	});
	it("If the LR is deletable and its table has not action : the tableSelectionMode is 'Multi' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithoutActionOnTable" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: true, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("Multi");
	});
	it("If the LR is not deletable and its table has at least 1 bound action : the tableSelectionMode is 'Multi' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithBoundActionOnTable" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("Multi");
	});
	it("If the LR is not deletable and its table has only unbound actions : the tableSelectionMode is 'None' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithUnBoundActionOnTable" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("None");
	});
	it("If the LR is not deletable and its table has 1 bound action without hidden annotation : the tableSelectionMode is 'Multi' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithBoundActionOnTable" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("Multi");
	});
	it("If the LR is not deletable and its table has 1 DataFieldForIntentBasedNavigation statically not hidden and requiring context : the tableSelectionMode is 'Multi' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithActionRequingContextOnTable" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("Multi");
	});
	it("If the LR is not deletable and its table has 1 DataFieldForIntentBasedNavigation requiring a context with Hidden binding exp : the tableSelectionMode is '{= %{isHidden} === false ? 'Multi' : 'None'}' ", () => {
		const basicContext_LR = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithActionRequingContextOnTableWithHiddenExp" },
			TemplateType.ListReport
		);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("{= %{isHidden} === false ? 'Multi' : 'None'}");
	});
	it("If the LR is not deletable and its table has 1 custom bound and statically visible action : the tableSelectionMode is 'Multi' ", () => {
		const manifestSettings = {
			entitySet: "EntityWithCustomActionOnTable",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						enableExport: false
					},
					actions: {
						"Action1": {
							press: "xx",
							visible: "true",
							enabled: "true",
							text: "Custom Action",
							enableOnSelect: "xx",
							requiresSelection: true
						}
					}
				}
			}
		};
		const basicContext_LR = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ListReport);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("Multi");
	});
	it("If the LR is not deletable and its table has several custom bound actions with visible key as an expression binding : the tableSelectionMode is 'Multi' in Edit Mode, 'None' otherwise", () => {
		const manifestSettings = {
			entitySet: "EntityWithCustomActionOnTable",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						enableExport: false
					},
					actions: {
						"Action1": {
							press: "xx",
							visible: "{= ${ui>/editMode} === 'Editable' }",
							enabled: "true",
							text: "Custom Action1",
							enableOnSelect: "xx",
							requiresSelection: true
						},
						"Action2": {
							press: "xx",
							visible: "{= %{OverallSDProcessStatus} === 'B' }",
							enabled: "true",
							text: "Custom Action2",
							enableOnSelect: "xx",
							requiresSelection: true
						}
					}
				}
			}
		};
		const basicContext_LR = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ListReport);
		const result = getSelectionModeForTest(
			true,
			{ isDeletable: false, isUpdatable: false },
			basicContext_LR,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("{= (( ${ui>/editMode} === 'Editable' ) || ( %{OverallSDProcessStatus} === 'B' )) ? 'Multi' : 'None'}");
	});
	it("If the OP is not deletable and and its table has not action : the tableSelectionMode is 'None' ", () => {
		const basicContext_OP = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithoutActionOnTable" },
			TemplateType.ObjectPage
		);
		const result = getSelectionModeForTest(
			false,
			{ isDeletable: false, isUpdatable: false },
			basicContext_OP,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("None");
	});
	it("If the OP is deletable and its table has not action : the tableSelectionMode is Multi in Edit Mode and None otherwise", () => {
		const basicContext_OP = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithoutActionOnTable" },
			TemplateType.ObjectPage
		);
		const result = getSelectionModeForTest(
			false,
			{ isDeletable: true, isUpdatable: false },
			basicContext_OP,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : 'None'}");
	});
	it("If the OP is deletable and its table has 1 DataFieldForIntentBasedNavigation requiring a context with Hidden binding exp with nav property", () => {
		const manifestSettings = {
			entitySet: "EntityWithBoundActionOnTableWithHiddenExp",
			controlConfiguration: {
				"_Item/@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						enableExport: false
					}
				}
			}
		};
		const basicContext_OP = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ObjectPage);
		const dataModelObjectPath = basicContext_OP.getDataModelObjectPath();
		dataModelObjectPath.targetObject._type = "NavigationProperty";
		dataModelObjectPath.targetObject.partner = "owner";
		const result = getSelectionModeForTest(
			false,
			{ isDeletable: true, isUpdatable: false },
			basicContext_OP,
			"_Item/@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : (%{Hidden} === false ? 'Multi' : 'None')}");
	});
	it("If the OP is deletable and its table has 1 DataFieldForIntentBasedNavigation requiring a context with an Hidden annotation (without navProp) : the tableSelectionMode is Multi in Edition, None otherwise", () => {
		const basicContext_OP = getConverterContext(
			convertedTypesSelectionMode,
			{ entitySet: "EntityWithBoundAction2OnTableWithHiddenExp" },
			TemplateType.ObjectPage
		);
		const result = getSelectionModeForTest(
			false,
			{ isDeletable: true, isUpdatable: false },
			basicContext_OP,
			"@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual("{= %{ui>/editMode} === 'Editable' ? 'Multi' : 'None'}");
	});
	it("If the OP is deletable and its table has a mix of visible actions with Hidden and visible binding exp with nav property", () => {
		const manifestSettings = {
			entitySet: "EntityWithMultipleActionsWithBindingExp",
			controlConfiguration: {
				"_Item/@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						enableExport: false
					},
					actions: {
						"Action1": {
							press: "xx",
							visible: "{= ${ui>/editMode} === 'Editable' }",
							enabled: "true",
							text: "Custom Action1",
							enableOnSelect: "xx",
							requiresSelection: true
						},
						"Action2": {
							press: "xx",
							visible: "{= %{OverallSDProcessStatus} === 'B' }",
							enabled: "true",
							text: "Custom Action2",
							enableOnSelect: "xx",
							requiresSelection: true
						}
					}
				}
			}
		};
		const basicContext_OP = getConverterContext(convertedTypesSelectionMode, manifestSettings, TemplateType.ObjectPage);
		const dataModelObjectPath = basicContext_OP.getDataModelObjectPath();
		dataModelObjectPath.targetObject._type = "NavigationProperty";
		dataModelObjectPath.targetObject.partner = "owner";
		const result = getSelectionModeForTest(
			false,
			{ isDeletable: true, isUpdatable: false },
			basicContext_OP,
			"_Item/@com.sap.vocabularies.UI.v1.LineItem"
		);
		expect(result).toEqual(
			"{= %{ui>/editMode} === 'Editable' ? 'Multi' : ((%{Hidden1} === false || %{Hidden2} === false || ( ${ui>/editMode} === 'Editable' ) || ( %{OverallSDProcessStatus} === 'B' )) ? 'Multi' : 'None')}"
		);
	});
});

describe("Condensed Layout", () => {
	it("Default Value", () => {
		const manifestSettings = {
			entitySet: "TestEntity"
		};
		const tableConfiguration = getTableConfigurationForTest(manifestSettings);
		expect(tableConfiguration.useCondensedTableLayout).toBe(false);
		const tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
		expect(tableConfigurationOP.useCondensedTableLayout).toBe(false);
	});
	it("Manifest Forces to true", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			}
		};
		// Even if defined, the value should be used only in cases where the setting is compatible
		const tableConfiguration = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport);
		expect(tableConfiguration.useCondensedTableLayout).toBe(false);
		const tableConfigurationOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage);
		expect(tableConfigurationOP.useCondensedTableLayout).toBe(false);

		// In a Condensed Layout Compliant Setting, the value should be true
		const tableConfigurationCL = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport, true);
		expect(tableConfigurationCL.useCondensedTableLayout).toBe(true);
		const tableConfigurationCLOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage, true);
		expect(tableConfigurationCLOP.useCondensedTableLayout).toBe(true);
	});
	it("Manifest Forces to true in incorrect setting from manifest", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			},
			contentDensities: {
				cozy: true,
				compact: false
			}
		};
		// In a Condensed Layout Compliant Setting, the value should be true
		const tableConfigurationCL = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport, true);
		expect(tableConfigurationCL.useCondensedTableLayout).toBe(false);
		const tableConfigurationCLOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage, true);
		expect(tableConfigurationCLOP.useCondensedTableLayout).toBe(false);
	});

	it("Manifest Forces to true in incorrect setting from environment", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			}
		};
		// In a Condensed Layout Compliant Setting, the value should be true
		const tableConfigurationCL = getTableConfigurationForTest(manifestSettings, TemplateType.ListReport, true, "cozy");
		expect(tableConfigurationCL.useCondensedTableLayout).toBe(false);
		const tableConfigurationCLOP = getTableConfigurationForTest(manifestSettings, TemplateType.ObjectPage, true, "cozy");
		expect(tableConfigurationCLOP.useCondensedTableLayout).toBe(false);
	});
});

describe("Analytical Table", () => {
	const getTableConfigurationForAnalyticalTest = (
		manifestSettings: ListReportManifestSettings,
		templateType: TemplateType = TemplateType.ListReport,
		converterOutput: ConverterOutput = convertedTypes,
		tableType?: TableManifestSettingsConfiguration
	): TableControlConfiguration => {
		const basicContext = getConverterContext(converterOutput, manifestSettings, templateType);
		basicContext.getManifestControlConfiguration("@com.sap.vocabularies.UI.v1.LineItem").tableSettings.type =
			tableType?.type || undefined;
		return getTableManifestConfiguration(
			basicContext.getEntityType().annotations.UI?.LineItem,
			"@com.sap.vocabularies.UI.v1.LineItem",
			basicContext
		);
	};
	it("If not specified, the default table type is 'AnalyticalTable' on a desktop when the service is Analytical compliant", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			},
			isDesktop: true
		};
		const tableConfigurationALP = getTableConfigurationForAnalyticalTest(
			manifestSettings,
			TemplateType.AnalyticalListPage,
			convertedTypesAnalyticalService
		);
		expect(tableConfigurationALP.type).toEqual("AnalyticalTable");
	});
	it("If not specified, the default table type is 'ResponsiveTable' on a desktop when the service is NOT Analytical compliant", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			},
			isDesktop: true
		};
		const tableConfigurationALP = getTableConfigurationForAnalyticalTest(
			manifestSettings,
			TemplateType.AnalyticalListPage,
			convertedTypes
		);
		expect(tableConfigurationALP.type).toEqual("ResponsiveTable");
	});
	it("If not specified, the default table type is 'ResponsiveTable' on a mobile/tablet device no matter the service", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			},
			isDesktop: false
		};
		const tableConfigurationALP = getTableConfigurationForAnalyticalTest(
			manifestSettings,
			TemplateType.AnalyticalListPage,
			convertedTypesAnalyticalService
		);
		expect(tableConfigurationALP.type).toEqual("ResponsiveTable");
	});
	it("If the tableType is set to AnalyticalTable, but the service is NOT Analytical compliant, the tableType is forced to 'GridTable'", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			},
			isDesktop: true
		};
		const tableType: TableManifestSettingsConfiguration = { type: "AnalyticalTable" };
		const tableConfigurationALP = getTableConfigurationForAnalyticalTest(
			manifestSettings,
			TemplateType.AnalyticalListPage,
			convertedTypes,
			tableType
		);
		expect(tableConfigurationALP.type).toEqual("GridTable");
	});
	it("If the tableType is set to AnalyticalTable, with a service Analytical compliant, the tableType is 'AnalyticalTable'", () => {
		const manifestSettings = {
			entitySet: "TestEntity",
			controlConfiguration: {
				"@com.sap.vocabularies.UI.v1.LineItem": {
					tableSettings: {
						condensedTableLayout: true
					}
				}
			},
			isDesktop: true
		};
		const tableType: TableManifestSettingsConfiguration = { type: "AnalyticalTable" };
		const tableConfigurationALP = getTableConfigurationForAnalyticalTest(
			manifestSettings,
			TemplateType.AnalyticalListPage,
			convertedTypesAnalyticalService,
			tableType
		);
		expect(tableConfigurationALP.type).toEqual("AnalyticalTable");
	});
});
