import { getTemplatingResult, getControlAttribute, compileCDS, serializeXML } from "sap/fe/test/JestTemplatingHelper";

import * as path from "path";

describe("MacroField for a value help", () => {
	const sMetadataUrl = compileCDS(path.join(__dirname, "./data/FieldMacroWithValueHelp.cds"));
	const mBindingContexts = {
		"entitySet": "/Items"
	};

	it("with a navigation property as a property", async () => {
		const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="toSubItems/subvhReference"
									vhIdPrefix="VH"
									>
									</internalMacro:Field>`;

		const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
		expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual(
			"VH::toSubItems::subvhReference"
		);
	});

	it("with a navigation property as a property and a flexId", async () => {
		const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									_flexId="MyCustomFlexID"
									entitySet="{entitySet>}"
									dataField="toSubItems/subvhReference"
									vhIdPrefix="VH"
									>
									</internalMacro:Field>`;

		const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
		expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual(
			"MyCustomFlexID-content_VH"
		);
	});

	it("with a navigation property as a datafield", async () => {
		const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1"
									vhIdPrefix="VH"
									>
									</internalMacro:Field>`;

		const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
		expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual(
			"VH::toSubItems::subvhReference"
		);
	});

	it("with a navigation property as a datafield and a flexId", async () => {
		const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									_flexId="MyCustomFlexID"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1"
									vhIdPrefix="VH"
									>
									</internalMacro:Field>`;

		const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field");
		expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/mdc:Field", "fieldHelp", domResult)).toEqual(
			"MyCustomFlexID-content_VH"
		);
	});
});
