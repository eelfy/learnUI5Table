import FieldMetadata from "sap/fe/macros/internal/Field.metadata";
import { PhantomUtil } from "sap/fe/macros";
import { _MetadataRequestor } from "sap/ui/model/odata/v4/lib";
import { ODataMetaModel } from "sap/ui/model/odata/v4";
import { XMLPreprocessor } from "sap/ui/core/util";
import { Log } from "sap/base";
import xpath from "xpath";
import * as fs from "fs";
import { compactModel, compileSources, to } from "@sap/cds-compiler";
import { format } from "prettier";
import { BindingParser } from "sap/ui/base";
import { ConverterOutput, EntitySet, Property } from "@sap-ux/annotation-converter";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { JSONModel } from "sap/ui/model/json";
import { InvisibleText } from "sap/ui/core";
import { BaseManifestSettings } from "sap/fe/core/converters/ManifestSettings";
import { IssueCategory, IssueSeverity } from "sap/fe/core/converters/helpers/IssueManager";
import { IDiagnostics } from "sap/fe/core/converters/TemplateConverter";
import { IShellServicesProxy, TemplateType } from "sap/fe/core/converters/templates/BaseConverter";
import { createConverterContext } from "sap/fe/core/converters/ConverterContext";
import { merge } from "sap/base/util";
import * as path from "path";

PhantomUtil.register(FieldMetadata);

Log.setLevel(1, "sap.ui.core.util.XMLPreprocessor");
jest.setTimeout(40000);

const nameSpaceMap = {
	"macros": "sap.fe.macros",
	"control": "sap.fe.core.controls",
	"core": "sap.ui.core",
	"m": "sap.m",
	"mdc": "sap.ui.mdc",
	"mdcField": "sap.ui.mdc.field",
	"u": "sap.ui.unified",
	"macroMicroChart": "sap.fe.macros.microchart",
	"microChart": "sap.suite.ui.microchart"
};
const select = xpath.useNamespaces(nameSpaceMap);

export const registerMacro = function(macroMetadata: any) {
	PhantomUtil.register(macroMetadata);
};
export const runXPathQuery = function(selector: string, xmldom: Node | undefined) {
	return select(selector, xmldom);
};

expect.extend({
	toHaveControl(xmldom, selector) {
		const nodes = runXPathQuery(`/root${selector}`, xmldom);
		return {
			message: () => {
				const outputXml = serializeXML(xmldom);
				return `did not find controls matching ${selector} in generated xml:\n ${outputXml}`;
			},
			pass: nodes && nodes.length >= 1
		};
	},
	toNotHaveControl(xmldom, selector) {
		const nodes = runXPathQuery(`/root${selector}`, xmldom);
		return {
			message: () => {
				const outputXml = serializeXML(xmldom);
				return `There is a control matching ${selector} in generated xml:\n ${outputXml}`;
			},
			pass: nodes && nodes.length === 0
		};
	}
});

export const getControlAttribute = function(controlSelector: string, attributeName: string, xmlDom: Node) {
	const selector = `string(/root${controlSelector}/@${attributeName})`;
	return runXPathQuery(selector, xmlDom);
};

export const serializeXML = function(xmlDom: Node) {
	const serializer = new window.XMLSerializer();
	const xmlString = serializer
		.serializeToString(xmlDom)
		.replace(/(?:[\t ]*(?:\r?\n|\r))+/g, "\n")
		.replace(/\\"/g, '"');
	return format(xmlString, { parser: "html" });
};

/**
 * Compile a CDS file into an EDMX file.
 *
 * @param sCDSUrl {string} the path to the file containing the CDS definition. This file MUST declare the namespace
 * sap.fe.test and a service JestService
 * @returns {string} edmxUrl the path of the generated EDMX
 */
export const compileCDS = function(sCDSUrl: string) {
	const cdsString = fs.readFileSync(sCDSUrl, "utf-8");
	const csn = compileSources({ "string.cds": cdsString }, {});
	const csnModel = compactModel(csn);
	const edmxContent = to.edmx(csnModel, { service: "sap.fe.test.JestService" });
	const dir = path.resolve(sCDSUrl, "..", "gen");
	const edmxUrl = path.resolve(dir, path.basename(sCDSUrl).replace(".cds", ".xml"));

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	fs.writeFileSync(edmxUrl, edmxContent);
	return edmxUrl;
};

export const getFakeShellService = function(contentDensities: string = "compact"): IShellServicesProxy {
	return {
		getContentDensity(): string {
			return contentDensities;
		}
	};
};

export const getFakeDiagnostics = function(): IDiagnostics {
	const issues: any[] = [];
	return {
		addIssue(issueCategory: IssueCategory, issueSeverity: IssueSeverity, details: string): void {
			issues.push({
				issueCategory,
				issueSeverity,
				details
			});
		},
		getIssues(): any[] {
			return issues;
		},
		checkIfIssueExists(issueCategory: IssueCategory, issueSeverity: IssueSeverity, details: string): boolean {
			return issues.find(issue => {
				issue.issueCategory === issueCategory && issue.issueSeverity === issueSeverity && issue.details === details;
			});
		}
	};
};

export const getConverterContext = function(
	convertedTypes: ConverterOutput,
	manifestSettings: BaseManifestSettings,
	templateType: TemplateType,
	userContentDensities: string = "compact"
) {
	const entitySet = convertedTypes.entitySets.find(es => es.name === manifestSettings.entitySet);
	const dataModelPath = getDataModelObjectPathForProperty(entitySet as EntitySet, entitySet);
	return createConverterContext(
		convertedTypes,
		manifestSettings,
		templateType,
		getFakeShellService(userContentDensities),
		getFakeDiagnostics(),
		merge,
		dataModelPath
	);
};
export const getMetaModel = async function(sMetadataUrl: string) {
	const oRequestor = _MetadataRequestor.create({}, "4.0", {});
	const oMetaModel = new ODataMetaModel(oRequestor, sMetadataUrl, undefined, null);
	await oMetaModel.fetchEntityContainer();
	return oMetaModel;
};

export const getDataModelObjectPathForProperty = function(entitySet: EntitySet, property?: Property | EntitySet): DataModelObjectPath {
	const targetPath: DataModelObjectPath = {
		startingEntitySet: entitySet,
		navigationProperties: [],
		targetObject: property,
		targetEntitySet: entitySet,
		targetEntityType: entitySet.entityType
	};
	targetPath.contextLocation = targetPath;
	return targetPath;
};

export const evaluateBinding = function(bindingString: string, ...args: any[]) {
	const bindingElement = BindingParser.complexParser(bindingString);
	return bindingElement.formatter.apply(undefined, args);
};

export const evaluateBindingWithModel = function(bindingString: string | undefined, modelContent: any) {
	const bindingElement = BindingParser.complexParser(bindingString);
	const jsonModel = new JSONModel(modelContent);
	const text = new InvisibleText();
	text.bindProperty("text", bindingElement);
	text.setModel(jsonModel);
	text.setBindingContext(jsonModel.createBindingContext("/"));
	return text.getText();
};

export const getTemplatingResult = async function(
	xmlInput: string,
	sMetadataUrl: string,
	mBindingContexts: { [x: string]: any; entitySet?: string },
	mModels: { [x: string]: ODataMetaModel }
) {
	const templatedXml = `<root>${xmlInput}</root>`;
	const parser = new window.DOMParser();
	const xmlDoc = parser.parseFromString(templatedXml, "text/xml");

	const oMetaModel = await getMetaModel(sMetadataUrl);
	const oPreprocessorSettings: any = {
		models: Object.assign(
			{
				metaModel: oMetaModel
			},
			mModels
		),
		bindingContexts: {}
	};

	//Inject models and bindingContexts
	Object.keys(mBindingContexts).forEach(function(sKey) {
		/* Assert to make sure the annotations are in the test metadata -> avoid misleading tests */
		expect(typeof oMetaModel.getObject(mBindingContexts[sKey])).toBeDefined();
		const oModel = mModels[sKey] || oMetaModel;
		oPreprocessorSettings.bindingContexts[sKey] = oModel.createBindingContext(mBindingContexts[sKey]); //Value is sPath
		oPreprocessorSettings.models[sKey] = oModel;
	});

	//This context for macro testing
	if (oPreprocessorSettings.models["this"]) {
		oPreprocessorSettings.bindingContexts["this"] = oPreprocessorSettings.models["this"].createBindingContext("/");
	}

	return XMLPreprocessor.process(xmlDoc.firstElementChild!, { name: "Test Fragment" }, oPreprocessorSettings);
};
