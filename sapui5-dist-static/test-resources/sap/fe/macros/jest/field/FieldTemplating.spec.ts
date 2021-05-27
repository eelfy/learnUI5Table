import { getBindingWithTextArrangement, addTextArrangementToBindingExpression } from "sap/fe/macros/field/FieldTemplating";
import path from "path";
import { compileCDS, getMetaModel, getDataModelObjectPathForProperty, evaluateBindingWithModel } from "sap/fe/test/JestTemplatingHelper";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";
import { EntitySet, EntityType, Property } from "@sap-ux/annotation-converter";
import { bindingExpression, compileBinding, ifElse } from "sap/fe/core/helpers/BindingExpression";

describe("Field Templating Testing", () => {
	let convertedTypes;
	let entitySet: EntitySet;
	let entityType: EntityType;
	const properties: Record<string, Property> = {};
	beforeAll(async () => {
		const sMetadataUrl = compileCDS(path.join(__dirname, "./FieldTemplating.cds"));
		const metaModel = await getMetaModel(sMetadataUrl);
		convertedTypes = convertTypes(metaModel);
		const maybeEntitySet = convertedTypes.entitySets.find(et => et.name === "getBindingWithTextArrangement");
		if (maybeEntitySet) {
			entitySet = maybeEntitySet;
			entityType = maybeEntitySet.entityType;
			entityType.entityProperties.forEach(prop => {
				properties[prop.name] = prop;
			});
		} else {
			throw new Error("Error in test setup");
		}
	});

	it("#getBindingWithTextArrangement", () => {
		// Cases to consider

		// TextOnly
		const textOnlyBinding = getBindingWithTextArrangement(
			getDataModelObjectPathForProperty(entitySet, properties["textOnly"]),
			bindingExpression("textOnly")
		);
		expect(textOnlyBinding).toMatchSnapshot();
		expect(compileBinding(textOnlyBinding)).toContain("targetText");
		expect(evaluateBindingWithModel(compileBinding(textOnlyBinding), { targetText: "Yolo" })).toEqual("Yolo");

		// No text arrangement
		const noTextBinding = getBindingWithTextArrangement(
			getDataModelObjectPathForProperty(entitySet, properties["noText"]),
			bindingExpression("noText")
		);
		expect(noTextBinding).toMatchSnapshot();
		expect(compileBinding(noTextBinding)).toContain("noText");
		expect(evaluateBindingWithModel(compileBinding(noTextBinding), { noText: "Yolo" })).toEqual("Yolo");

		// TextFirst
		const textFirstBinding = getBindingWithTextArrangement(
			getDataModelObjectPathForProperty(entitySet, properties["textFirst"]),
			bindingExpression("textFirst")
		);
		expect(textFirstBinding).toMatchSnapshot();
		expect(compileBinding(textFirstBinding)).toContain("textFirst");
		expect(compileBinding(textFirstBinding)).toContain("targetText");
		expect(
			evaluateBindingWithModel(compileBinding(textFirstBinding), { textFirst: "Yolo Last", targetText: "Yolo Description" })
		).toEqual("Yolo Description (Yolo Last)");

		// TextLast
		const textLastBinding = getBindingWithTextArrangement(
			getDataModelObjectPathForProperty(entitySet, properties["textLast"]),
			bindingExpression("textLast")
		);
		expect(textLastBinding).toMatchSnapshot();
		expect(compileBinding(textLastBinding)).toContain("textLast");
		expect(compileBinding(textLastBinding)).toContain("targetText");
		expect(
			evaluateBindingWithModel(compileBinding(textLastBinding), { textLast: "Yolo First", targetText: "Yolo Description" })
		).toEqual("Yolo First (Yolo Description)");
	});

	it("#addTextArrangementToBindingExpression", () => {
		const fullContext = getDataModelObjectPathForProperty(entitySet);

		const otherModelBinding = addTextArrangementToBindingExpression(bindingExpression("textLast", "otherModel"), fullContext);
		expect(otherModelBinding).toMatchSnapshot();
		expect(compileBinding(otherModelBinding)).toContain("textLast");
		expect(compileBinding(otherModelBinding)).not.toContain("targetText");

		const addTextLastBinding = addTextArrangementToBindingExpression(bindingExpression("textLast"), fullContext);
		expect(addTextLastBinding).toMatchSnapshot();
		expect(compileBinding(addTextLastBinding)).toContain("textLast");
		expect(compileBinding(addTextLastBinding)).toContain("targetText");
		expect(
			evaluateBindingWithModel(compileBinding(addTextLastBinding), { textLast: "Yolo First", targetText: "Yolo Description" })
		).toEqual("Yolo First (Yolo Description)");

		const complexTextBinding = addTextArrangementToBindingExpression(
			ifElse(bindingExpression("testProp"), bindingExpression("textLast"), bindingExpression("noText")),
			fullContext
		);
		expect(complexTextBinding).toMatchSnapshot();
		expect(compileBinding(complexTextBinding)).toContain("textLast");
		expect(compileBinding(complexTextBinding)).toContain("targetText");
		const modelContent = {
			testProp: true,
			textLast: "Yolo First",
			targetText: "Yolo Description",
			noText: "Not Yolo"
		};
		expect(evaluateBindingWithModel(compileBinding(complexTextBinding), modelContent)).toEqual("Yolo First (Yolo Description)");

		modelContent.testProp = false;
		expect(evaluateBindingWithModel(compileBinding(complexTextBinding), modelContent)).toEqual("Not Yolo");
	});
});
