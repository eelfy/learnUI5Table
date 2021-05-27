import ValueHelpMetadata from "sap/fe/macros/ValueHelp.metadata";
import { compileCDS, getTemplatingResult, registerMacro, serializeXML, getControlAttribute } from "sap/fe/test/JestTemplatingHelper";
import path from "path";

describe("Value Help templating", () => {
	beforeEach(() => {
		registerMacro(ValueHelpMetadata);
	});

	const sMetadataUrl = compileCDS(path.join(__dirname, "./data/ValueHelpMacro.cds"));
	const mBindingContexts = {
		"entitySet": "/Items"
	};

	describe("- check control templating - ", () => {
		it("Properties without value help and outside the filter bar (no condition panel) ", async () => {
			let xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									property="ID"
									/>`;

			let domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");

			xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									property="stringValue"
									/>`;

			domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");

			xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									property="decimalValue"
									/>`;

			domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");
		});

		it("Properties of type date will have a value help ", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									property="decimalValue"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toNotHaveControl("/mdcField:FieldValueHelp");
			expect(serializeXML(domResult)).toMatchSnapshot();
		});

		it("Properties with unit will have a value help on that unit ", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									property="quantity"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/mdcField:FieldValueHelp");
			expect(serializeXML(domResult)).toMatchSnapshot();
		});

		it("Properties with unit will have not have value help on that unit in the filter field ", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									property="quantity"
									filterFieldValueHelp="true"
									forceValueHelp="true"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/mdcField:FieldValueHelp");
			expect(getControlAttribute("/mdcField:FieldValueHelp", "id", domResult)).toEqual("ValueHelp::quantity");
			expect(getControlAttribute("/mdcField:FieldValueHelp", "showConditionPanel", domResult)).toEqual("true");
			expect(serializeXML(domResult)).toMatchSnapshot();
		});

		it("Value with value help", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									idPrefix="VH"
									property="vhReference"
									conditionModel="$conditions"
									filterFieldValueHelp="false"
									requestGroupId="Yolo"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(serializeXML(domResult)).toMatchSnapshot();

			const xmlFieldInFilterField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									idPrefix="VH"
									property="vhReference"
									conditionModel="$conditions"
									filterFieldValueHelp="false"
									requestGroupId="Yolo"
									/>`;

			const domResultInFilterField = await getTemplatingResult(xmlFieldInFilterField, sMetadataUrl, mBindingContexts, {});
			expect(serializeXML(domResultInFilterField)).toMatchSnapshot();
			expect(serializeXML(domResultInFilterField)).toEqual(serializeXML(domResult));
		});

		it("Value with value help with fixed values", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									idPrefix="VH"
									property="vhReferenceWithFixedValues"
									conditionModel="$conditions"
									filterFieldValueHelp="false"
									requestGroupId="Yolo"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(serializeXML(domResult)).toMatchSnapshot();
		});

		it("Value with value help following navproperty", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									idPrefix="VH"
									property="toSubItems/subvhReference"
									conditionModel="$conditions"
									filterFieldValueHelp="false"
									requestGroupId="Yolo"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(serializeXML(domResult)).toMatchSnapshot();
			expect(getControlAttribute("/mdcField:FieldValueHelp", "id", domResult)).toEqual("VH::toSubItems::subvhReference");
		});

		it("Value with value help following navproperty", async () => {
			const xmlField = `<macro:ValueHelp xmlns:macro="sap.fe.macros"
									_flexId="MyFlexID"
									property="toSubItems/subvhReference"
									conditionModel="$conditions"
									filterFieldValueHelp="false"
									requestGroupId="Yolo"
									/>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(serializeXML(domResult)).toMatchSnapshot();
			expect(getControlAttribute("/mdcField:FieldValueHelp", "id", domResult)).toEqual("MyFlexID");
		});
	});
});
