import { getTemplatingResult, getControlAttribute, compileCDS, serializeXML } from "sap/fe/test/JestTemplatingHelper";

import * as path from "path";
const sMetadataUrl = compileCDS(path.join(__dirname, "./data/FieldMacroWithSemanticKey.cds"));

describe("MacroField for a semantic Key", () => {
	const mBindingContexts = {
		"entitySet": "/Items"
	};

	describe("- semanticKeyStyle = ObjectIdentifier ", () => {
		it("Semantic Key and non -draft root", async () => {
			const nonDraftBindingContext = {
				"entitySet": "/SubItems"
			};
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1"
									>
									<internalMacro:formatOptions semanticKeyStyle="ObjectIdentifier"/>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, nonDraftBindingContext, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectIdentifier");
		});
		it("Semantic Key and draft root", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/0"
									>
									<internalMacro:formatOptions semanticKeyStyle="ObjectIdentifier"/>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectIdentifier"
			);
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectMarker"
			);
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
		});

		it("Semantic Key with a semantic Object ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1"
									>
									<internalMacro:formatOptions semanticKeyStyle="ObjectIdentifier"/>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectIdentifier/m:dependents/mdc:Link"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectIdentifier",
					"titleActive",
					domResult
				)
			).toEqual(
				//"{parts:[{path:'" + sBindingPath + "'}], formatter:'FieldRuntime.hasTargets'}";
				"{parts:[{path:'pageInternal>semanticsTargets/SubItems/_Items_keyWithSemanticObject/HasTargetsNotFiltered'}], formatter:'FieldRuntime.hasTargets'}"
			);

			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectMarker"
			);
		});
		it("property with a semantic key", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="keyWithSemanticObject">
									<internalMacro:formatOptions semanticKeyStyle="ObjectIdentifier"/>
									</internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectIdentifier/m:dependents/mdc:Link"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectIdentifier",
					"titleActive",
					domResult
				)
			).toEqual(
				//"{parts:[{path:'" + sBindingPath + "'}], formatter:'FieldRuntime.hasTargets'}";
				"{parts:[{path:'pageInternal>semanticsTargets/SubItems/_Items_keyWithSemanticObject/HasTargetsNotFiltered'}], formatter:'FieldRuntime.hasTargets'}"
			);

			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectMarker"
			);
		});
	});
	describe("- semanticKeyStyle = Label (in Table except ResponsiveTable) ", () => {
		it("Semantic Key on draft root entity", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/0"
									>
									<internalMacro:formatOptions semanticKeyStyle="Label"/>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:Label"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:Label",
					"design",
					domResult
				)
			).toEqual("Bold");
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:Vbox/m:ObjectMarker"
			);
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
		});

		it("Semantic Key with a semantic Object ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1"
									>
									<internalMacro:formatOptions semanticKeyStyle="Label"/>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:VBox/control:ConditionalWrapper/control:contentTrue/m:Link/m:dependents/mdc:Link"
			);
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:VBox/control:ConditionalWrapper/control:contentFalse/m:Label"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:VBox/control:ConditionalWrapper",
					"condition",
					domResult
				)
			).toEqual(
				"{parts:[{path:'pageInternal>semanticsTargets/SubItems/_Items_keyWithSemanticObject/HasTargetsNotFiltered'}], formatter:'FieldRuntime.hasTargets'}"
			);
		});
		it("property with a semantic key", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="keyWithSemanticObject">
									<internalMacro:formatOptions semanticKeyStyle="Label"/>
									</internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:VBox/control:ConditionalWrapper/control:contentTrue/m:Link/m:dependents/mdc:Link"
			);
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:VBox/control:ConditionalWrapper/control:contentFalse/m:Label"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/m:VBox/control:ConditionalWrapper",
					"condition",
					domResult
				)
			).toEqual(
				"{parts:[{path:'pageInternal>semanticsTargets/SubItems/_Items_keyWithSemanticObject/HasTargetsNotFiltered'}], formatter:'FieldRuntime.hasTargets'}"
			);
		});
	});
	describe("- semanticKeyStyle = None (Forms) ", () => {
		it("Semantic Key on draft root entity", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.FieldGroup#foo/Data/0"
									>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
		});
		it("Semantic Key with a semantic Object ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.FieldGroup#foo/Data/1"
									>
									</internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper/control:contentTrue/m:Link/m:dependents/mdc:Link"
			);
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper/control:contentFalse/m:Text"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper",
					"condition",
					domResult
				)
			).toEqual(
				"{parts:[{path:'pageInternal>semanticsTargets/SubItems/_Items_keyWithSemanticObject/HasTargetsNotFiltered'}], formatter:'FieldRuntime.hasTargets'}"
			);
		});
		it("property with a semantic key", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="ID">
									</internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toNotHaveControl("/mdc:Field/mdc:contentDisplay");
		});
	});
});

describe("MacroField for a property used in a navigation to entity with QuickViewFacets", () => {
	const mBindingContexts = {
		"entitySet": "/SubItems"
	};
	it("- works", async () => {
		const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/0"
									>
									<internalMacro:formatOptions semanticKeyStyle="ObjectIdentifier"/>
									</internalMacro:Field>`;

		const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link/m:dependents/mdc:Link");
		expect(
			getControlAttribute(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link/m:dependents/mdc:Link",
				"delegate",
				domResult
			)
		).toEqual(
			'{"name":"sap/fe/macros/field/QuickViewLinkDelegate","payload":{"entityType":"/SubItems/lineItem","semanticObjectUnavailableActions":[],"semanticObjectMappings":[],"semanticPrimaryActions":[],"navigationPath":"{lineItem}"}}'
		);
	});
});

describe("DraftPopoverAdminData", () => {
	const sMetadataUrl = compileCDS(path.join(__dirname, "./data/AdminDataPopOver.cds"));
	const mBindingContexts = {
		"entityType": "/Items/$Type",
		"prop": "/"
	};
	it("Popover text has a valid binding", async () => {
		const xml = `<core:Fragment xmlns:core="sap.ui.core" fragmentName="sap.fe.macros.field.DraftPopOverAdminData" type="XML" />`;
		const domResult = await getTemplatingResult(xml, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/m:Popover/m:VBox/m:VBox/m:Text");
		expect(getControlAttribute("/m:Popover/m:VBox/m:VBox[3]/m:Text[1]", "text", domResult)).toEqual(
			"{parts: [{path: 'HasDraftEntity', targetType: 'any'}, {path: 'DraftAdministrativeData/InProcessByUser'}, {path: 'DraftAdministrativeData/LastChangedByUser'} ], formatter: 'sap.fe.macros.field.FieldRuntime.formatDraftOwnerTextInPopover'}"
		);
	});
});
