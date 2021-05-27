import { getTemplatingResult, getControlAttribute, compileCDS, serializeXML } from "sap/fe/test/JestTemplatingHelper";

import * as path from "path";

describe("MacroField - DataField Types - ", () => {
	const sMetadataUrl = compileCDS(path.join(__dirname, "./data/FieldMacroDataFieldTypes.cds"));
	const mBindingContexts = {
		"entitySet": "/Items"
	};
	describe("DataFieldForAnnotation - ", () => {
		it("Datapoint without visualization", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#DataPoint/0"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectStatus");
		});
		it("Datapoint visualization Number", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#DataPoint/1"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectStatus");
		});
		it("Datapoint visualization RatingIndicator", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#DataPoint/2"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:RatingIndicator");
		});
		it("Datapoint visualization ProgressIndicator", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#DataPoint/3"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ProgressIndicator");
		});
		it("Contact", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#Contact/0"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/mdc:Field/mdc:fieldinfo/mdc:Link");
			expect(getControlAttribute("/macros:FieldAPI/mdc:Field/mdc:fieldinfo/mdc:Link", "binding", domResult)).toEqual(
				"@com.sap.vocabularies.Communication.v1.Contact"
			);
		});
	});
	describe("DataFieldForAction - ", () => {
		it("Dummy dataFieldForAction", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#Action/0"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/m:Button");
			expect(getControlAttribute("/macros:FieldAPI/m:Button", "text", domResult)).toEqual("Dummy Action");
		});
	});

	describe("DataFieldWithNavigationPath - ", () => {
		it("simple one", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#NavigationPath/0"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link", "press", domResult)).toEqual(
				"FieldRuntime.onDataFieldWithNavigationPath(${$source>/}, $controller, 'toSubItems')"
			);
		});
	});

	describe("DataFieldForIntentBasedNavigation - ", () => {
		it("simple one", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#IntentBasedNav/0"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/m:Button");
			expect(getControlAttribute("/macros:FieldAPI/m:Button", "press", domResult)).toEqual(
				"._intentBasedNavigation.navigate('SubItems', 'test', { navigationContexts: ${$source>/}.getBindingContext()})"
			);
			expect(getControlAttribute("/macros:FieldAPI/m:Button", "text", domResult)).toEqual("Intent");
		});
	});
});
