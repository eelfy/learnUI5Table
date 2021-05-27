import path from "path";
import { getMetaModel } from "sap/fe/test/JestTemplatingHelper";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";
import { EntityType, Property } from "@sap-ux/annotation-converter";
import { annotationExpression, compileBinding } from "sap/fe/core/helpers/BindingExpression";
import { BindingParser } from "sap/ui/base";

describe("Binding Expressions - Annotation Expression Support", function() {
	let convertedTypes;
	let entityType: EntityType;
	const properties: Record<string, Property> = {};
	beforeAll(async () => {
		const metaModel = await getMetaModel(path.resolve(__dirname, "data", "BindingExpression-AnnotationExpression.xml"));
		convertedTypes = convertTypes(metaModel);
		const maybeEntityType = convertedTypes.entityTypes.find(et => et.name === "Items");
		if (maybeEntityType) {
			entityType = maybeEntityType;
			entityType.entityProperties.forEach(prop => {
				properties[prop.name] = prop;
			});
		} else {
			throw new Error("Error in test setup");
		}
	});

	it("Basic tests", () => {
		expect(compileBinding(annotationExpression(properties.constantValue.annotations.UI?.Hidden))).toEqual("true");
		expect(compileBinding(annotationExpression(properties.pathValue.annotations.UI?.Hidden))).toEqual("{constantValue}");
	});

	it("Concat tests", () => {
		expect(compileBinding(annotationExpression(properties.concatValue.annotations.Common?.Text))).toEqual("YoLo");
		expect(compileBinding(annotationExpression(properties.concatPathValue.annotations.Common?.Text))).toEqual(
			"{= 'Yo' + %{constantValue} + 'Lo' }"
		);
		expect(compileBinding(annotationExpression(properties.concatIfValue.annotations.Common?.Text))).toEqual(
			"{= 'Yo' + (%{constantValue} === 'Yolo' ? 'Lo' : 'NotLo') }"
		);
		expect(compileBinding(annotationExpression(properties.ifValue.annotations.Common?.Text))).toEqual(
			"{= %{constantValue} === 'Yolo' ? 'true' : 'false'}"
		);
		expect(compileBinding(annotationExpression(properties.ifConcatValue.annotations.Common?.Text))).toEqual(
			"{= %{constantValue} === 'Yo' + %{pathValue} ? 'True' : 'False'}"
		);
	});

	it("Concat Value tests", () => {
		const concatPathValue = compileBinding(annotationExpression(properties.concatPathValue.annotations.Common?.Text));
		const concatPathValueExpression = BindingParser.complexParser(concatPathValue);
		expect(concatPathValueExpression.formatter("John")).toEqual("YoJohnLo");

		const concatIfValue = compileBinding(annotationExpression(properties.concatIfValue.annotations.Common?.Text));
		const concatIfValueExpression = BindingParser.complexParser(concatIfValue);
		expect(concatIfValueExpression.formatter("Yolo")).toEqual("YoLo");
		expect(concatIfValueExpression.formatter("NotYolo")).toEqual("YoNotLo");

		const ifValue = compileBinding(annotationExpression(properties.ifValue.annotations.Common?.Text));
		const ifValueExpression = BindingParser.complexParser(ifValue);
		expect(ifValueExpression.formatter("Yolo")).toEqual("true");
		expect(ifValueExpression.formatter("NotYolo")).toEqual("false");

		const ifConcatValue = compileBinding(annotationExpression(properties.ifConcatValue.annotations.Common?.Text));
		const ifConcatValueExpression = BindingParser.complexParser(ifConcatValue);
		expect(ifConcatValueExpression.formatter("John", "Doe")).toEqual("False");
		expect(ifConcatValueExpression.formatter("YoDoe", "Doe")).toEqual("True");
	});
});
