import path from "path";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";
import { compileCDS, getMetaModel } from "sap/fe/test/JestTemplatingHelper";
import { EntityType, Property } from "@sap-ux/annotation-converter";
import { isDisabledExpression, isReadOnlyExpression } from "sap/fe/core/templating/PropertyHelper";
import { compileBinding } from "sap/fe/core/helpers/BindingExpression";

let convertedTypes;
let entityType: EntityType;
const properties: Record<string, Property> = {};
beforeAll(async function() {
	const sMetadataUrl = compileCDS(path.join(__dirname, "../data/PropertyHelper.cds"));
	const metaModel = await getMetaModel(sMetadataUrl);
	convertedTypes = convertTypes(metaModel);
	const maybeEntityType = convertedTypes.entityTypes.find(et => et.name === "TestEntity");
	if (maybeEntityType) {
		entityType = maybeEntityType;
		entityType.entityProperties.forEach(prop => {
			properties[prop.name] = prop;
		});
	} else {
		throw new Error("Error in test setup");
	}
});

describe("PropertyHelper", function() {
	it("#isReadOnlyExpression", () => {
		expect(isReadOnlyExpression(properties["FieldControlReadOnly"])).toEqual(true);
		expect(isReadOnlyExpression(properties["FieldControlInapplicable"])).toEqual(false);
		expect(compileBinding(isReadOnlyExpression(properties["FieldControlDynamic"]))).toEqual("{= %{FieldControlValue} === 1}");
	});
	it("#isDisabledExpression", () => {
		expect(isDisabledExpression(properties["FieldControlReadOnly"])).toEqual(false);
		expect(isDisabledExpression(properties["FieldControlInapplicable"])).toEqual(true);
		expect(compileBinding(isDisabledExpression(properties["FieldControlDynamic"]))).toEqual("{= %{FieldControlValue} === 0}");
	});
});
