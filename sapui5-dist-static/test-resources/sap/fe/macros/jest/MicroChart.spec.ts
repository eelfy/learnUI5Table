import { getTemplatingResult, getControlAttribute, compileCDS, serializeXML, registerMacro } from "sap/fe/test/JestTemplatingHelper";
import MicroChartMetadata from "sap/fe/macros/MicroChart.metadata";
import * as path from "path";

describe("MicroChart", () => {
	beforeAll(() => {
		registerMacro(MicroChartMetadata);
	});
	const sMetadataUrl = compileCDS(path.join(__dirname, "./data/MicroChart.cds"));
	const mBindingContexts = {
		"collection": "/Items",
		"chartAnnotation": "/Items/$Type/@com.sap.vocabularies.UI.v1.Chart#RadialChart"
	};

	it("Bullet", async () => {
		const xml = `<macro:MicroChart xmlns:macro="sap.fe.macros"
						collection="{collection>}"
						chartAnnotation="{chartAnnotation>}"
		/>`;
		const domResult = await getTemplatingResult(xml, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/macroMicroChart:MicroChartContainer/microChart:BulletMicroChart");
	});

	it("Bullet for Analytics", async () => {
		const xml = `<macro:MicroChart xmlns:macro="sap.fe.macros"
						collection="{collection>}"
						chartAnnotation="{chartAnnotation>}"
						isAnalytics="true"
		/>`;
		const domResult = await getTemplatingResult(xml, sMetadataUrl, mBindingContexts, {});
		expect(domResult).toHaveControl("/control:ConditionalWrapper/control:contentTrue/macroMicroChart:MicroChartContainer");
		expect(domResult).toHaveControl("/control:ConditionalWrapper/control:contentFalse/m:Text");

		expect(getControlAttribute("/control:ConditionalWrapper", "condition", domResult)).toEqual("{= !!%{unit1}}");
		const currencyContentTrue = getControlAttribute(
			"/control:ConditionalWrapper/control:contentTrue/macroMicroChart:MicroChartContainer",
			"uomPath",
			domResult
		);
		expect(currencyContentTrue).toEqual("unit1");
		expect(currencyContentTrue).not.toBeFalsy();

		const currencyContentFalse = getControlAttribute("/control:ConditionalWrapper/control:contentFalse/m:Text", "text", domResult);
		expect(currencyContentFalse).toEqual("*");
	});
});
