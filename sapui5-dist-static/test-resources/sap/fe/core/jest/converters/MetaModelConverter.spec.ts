import path from "path";
import { getMetaModel, compileCDS } from "sap/fe/test/JestTemplatingHelper";
import { ODataMetaModel } from "sap/ui/model/odata/v4";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";

describe("MetaModel Converter can transform the metamodel into a pure object construct", function() {
	let metaModel: ODataMetaModel;
	beforeAll(async function() {
		const sMetadataUrl = compileCDS(path.join(__dirname, "../data/MetaModelConverter.cds"));
		metaModel = await getMetaModel(sMetadataUrl);
	});

	it("can convert it", function() {
		const convertedType = convertTypes(metaModel);
		expect(convertedType.entitySets.length).toEqual(1);
		expect(convertedType.entitySets[0].annotations.Common?.DraftRoot).not.toBeNull();
		expect(convertedType.entitySets[0].annotations.Common?.DraftRoot).not.toBeUndefined();
		expect(convertedType.entityTypes.length).toEqual(2);
		expect(convertedType.entityTypes[1].name).toEqual("TestEntity");
		expect(convertedType.entityTypes[1].entityProperties.length).toEqual(29);
	});
});

describe("MetaModel Converter - handling of bound actions ", function() {
	let oMetaModel: ODataMetaModel;

	beforeAll(async function() {
		const sMetadataUrl = compileCDS(path.join(__dirname, "../data/MetaModelConverterBoundAction.cds"));
		oMetaModel = await getMetaModel(sMetadataUrl);
	});

	it("builds the fully qualified name of bound actions correctly", () => {
		const convertedType = convertTypes(oMetaModel);
		expect(convertedType.actions.find(x => x.name === "myNewAction")?.fullyQualifiedName).toEqual(
			"sap.fe.test.JestService.myNewAction(Collection(sap.fe.test.JestService.TestEntity))"
		);
		expect(convertedType.actions.find(x => x.name === "myNewAction")?.sourceEntityType).not.toBeUndefined();
		expect(convertedType.actions.find(x => x.name === "myBoundAction")?.fullyQualifiedName).toEqual(
			"sap.fe.test.JestService.myBoundAction(sap.fe.test.JestService.secondEntity)"
		);
		expect(convertedType.actions.find(x => x.name === "myBoundAction")?.sourceEntityType).not.toBeUndefined();
	});
});
