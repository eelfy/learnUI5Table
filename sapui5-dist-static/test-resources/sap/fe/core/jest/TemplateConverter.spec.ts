import { _MetadataRequestor } from "sap/ui/model/odata/v4/lib";
import { ODataMetaModel, ODataModel } from "sap/ui/model/odata/v4";
import { Button } from "sap/m";
import { convertTypes } from "sap/fe/core/converters/MetaModelConverter";
import path from "path";

import fs from "fs";
import { compactModel, compileSources, to } from "@sap/cds-compiler";

describe("TemplateConverter UT", function() {
	it("Can Render a Control", async function() {
		const button = new Button("Yolo56");
		const div = document.createElement("div");
		div.setAttribute("id", "content");
		document.body.appendChild(div);
		button.placeAt("content");
		sap.ui.getCore().applyChanges();
		const domRef = (button.getDomRef() as unknown) as Element;
		expect(domRef.outerHTML).toMatchSnapshot();
	});

	it("can generate XML from CDS", async function() {
		const cdsString = `namespace foo.bar;
			service C
			{
				entity A (P1: String(100), P2:Decimal(10,5), P3: Integer)
				{
				  key id : Integer;
				  toA: association to A;
				};
				entity B {
					key toA: association to A;
				};
				entity C {
					key id : Integer;
					toA: association to A on id = toA.id;
				};
			};`;
		const csn = compileSources({ "string.cds": cdsString }, {});
		const csnModel = compactModel(csn);
		const xsml = to.edmx(csnModel, { service: "foo.bar.C" });

		expect(xsml).toMatchSnapshot();
	});

	it("Can mock an odatamodel", function() {
		sap.ui.registerMockMetadata("/fake/salesOrder/", fs.readFileSync(path.join(__dirname, "./data/salesOrderMetadata.xml")).toString());
		const oDataModel = new ODataModel({
			serviceUrl: "/fake/salesOrder/",
			synchronizationMode: "None"
		});
		const oMetaModel = oDataModel.getMetaModel();
		return oMetaModel.fetchEntityContainer().then(() => {
			expect(oMetaModel.getObject("/$")).toMatchSnapshot();
			const oConvertedTypes = convertTypes(oMetaModel);
			expect(oConvertedTypes.entitySets[0]).toMatchSnapshot();
			return oMetaModel;
		});
	});

	it("can fake a metamodel", function() {
		const sMetadataUrl = path.join(__dirname, "./data/salesOrderMetadata.xml");
		const oRequestor = _MetadataRequestor.create({}, "4.0", {});
		const oMetaModel = new ODataMetaModel(oRequestor, sMetadataUrl, undefined, null);
		return oMetaModel.fetchEntityContainer().then(() => {
			expect(oMetaModel.getObject("/$")).toMatchSnapshot();
			const oConvertedTypes = convertTypes(oMetaModel);
			expect(oConvertedTypes.entitySets[0]).toMatchSnapshot();
			return oMetaModel;
		});
	});
});
