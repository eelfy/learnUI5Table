import { createConverterContext } from "sap/fe/core/converters/ConverterContext";
import { ConverterOutput, UIAnnotationTerms } from "@sap-ux/vocabularies-types";
import path from "path";
import {
	compileCDS,
	getMetaModel,
	getFakeShellService,
	getDataModelObjectPathForProperty,
	getFakeDiagnostics
} from "sap/fe/test/JestTemplatingHelper";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";
import { ConverterContext, TemplateType } from "sap/fe/core/converters/templates/BaseConverter";
import { merge } from "sap/base/util";

describe("Converter Context", function() {
	let converterContext: ConverterContext;
	let convertedTypes: ConverterOutput;
	beforeAll(async () => {
		const sMetadataUrl = compileCDS(path.join(__dirname, "../data/MetaModelConverter.cds"));
		const metaModel = await getMetaModel(sMetadataUrl);
		convertedTypes = convertTypes(metaModel);
		const entitySet = convertedTypes.entitySets[0];
		converterContext = createConverterContext(
			convertedTypes,
			{
				entitySet: entitySet.name,
				navigation: {},
				viewLevel: 1,
				fclEnabled: false,
				contentDensities: {
					cozy: false,
					compact: false
				}
			},
			TemplateType.ListReport,
			getFakeShellService(),
			getFakeDiagnostics(),
			merge,
			getDataModelObjectPathForProperty(entitySet)
		);
	});

	it("#getEntitySet / getEntityType", () => {
		expect(converterContext.getEntitySet()).toEqual(convertedTypes.entitySets[0]);
		expect(converterContext.getEntityType()).toEqual(convertedTypes.entityTypes[1]);
	});

	it("getAnnotationsByTerm ", () => {
		const SemanticKey = converterContext.getAnnotationEntityType().annotations?.Common?.SemanticKey;
		expect(converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey")[0]).toEqual(SemanticKey);
	});
});
