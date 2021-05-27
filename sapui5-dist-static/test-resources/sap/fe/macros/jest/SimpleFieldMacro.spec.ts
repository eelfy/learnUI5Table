import { getTemplatingResult, getControlAttribute, compileCDS, serializeXML } from "sap/fe/test/JestTemplatingHelper";

import * as path from "path";

describe("MacroField", () => {
	const sMetadataUrl = compileCDS(path.join(__dirname, "./data/simpleFieldMacro.cds"));
	const mBindingContexts = {
		"entitySet": "/Items"
	};

	describe("- with annotations on the dataField's Value property (except semantic) ", () => {
		it("Image identified by IsImageURL ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/2"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FormElementWrapper/m:Avatar");
		});
		it("Image identified by imageURLStream ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/3"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FormElementWrapper/m:Avatar");
		});
		it("Image identified by isMediaType ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/4"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FormElementWrapper/m:Avatar");
		});

		it("Simple DataField on an email address property", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/11"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link");
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
		});
		it("Simple DataField on a phone number property", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/12"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Link");
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
		});
		it("Simple DataField on a Quantity with currency property ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/16"
									parentControl="Table"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/u:Currency"
			);
		});
		it("Simple DataField on a Quantity with currency property for Analytics", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/16"
									parentControl="Table">
									<internalMacro:formatOptions isAnalytics="true" />
                              </internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/control:ConditionalWrapper/control:contentTrue/u:Currency"
			);
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/control:ConditionalWrapper/control:contentFalse/u:Currency"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/control:ConditionalWrapper",
					"condition",
					domResult
				)
			).toEqual("{= !!%{unit1} || !%{amount1}}");
			const currencyContentTrue = getControlAttribute(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/control:ConditionalWrapper/control:contentTrue/u:Currency",
				"currency",
				domResult
			);
			expect(currencyContentTrue).not.toEqual("*");
			expect(currencyContentTrue).not.toBeFalsy();

			const currencyContentFalse = getControlAttribute(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/control:ConditionalWrapper/control:contentFalse/u:Currency",
				"currency",
				domResult
			);
			expect(currencyContentFalse).toEqual("*");

			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/control:ConditionalWrapper/control:contentFalse/u:Currency",
					"stringValue",
					domResult
				)
			).toEqual("");
		});
		it("Simple DataField on a Quantity with unit of measure (text) property for analytics", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
								entitySet="{entitySet>}"
								dataField="@com.sap.vocabularies.UI.v1.LineItem/14"
								parentControl="Table">
								<internalMacro:formatOptions isAnalytics="true" />
							</internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper/control:contentTrue/m:Text"
			);
			expect(domResult).toHaveControl(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper/control:contentFalse/m:Text"
			);
			expect(
				getControlAttribute(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper",
					"condition",
					domResult
				)
			).toEqual("{= !!%{unit1} || !%{quantity1}}");
			const unitContentTrue = getControlAttribute(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper/control:contentTrue/m:Text",
				"text",
				domResult
			);
			expect(unitContentTrue).not.toEqual("*");
			expect(unitContentTrue).not.toBeFalsy();

			const unitContentFalse = getControlAttribute(
				"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:ConditionalWrapper/control:contentFalse/m:Text",
				"text",
				domResult
			);
			expect(unitContentFalse).toEqual("*");
		});
		it("Simple DataField on a Multi Line text property ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#bis/0"
									parentControl="Table"
									>
									<internalMacro:formatOptions textLinesDisplay="42" textLinesEdit="31"/>
                              </internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
			expect(
				getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "maxLines", domResult)
			).toEqual("42");

			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:TextArea");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:TextArea", "rows", domResult)).toEqual(
				"31"
			);
		});
		it("DataField with hardcode string Value ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#bis/2"
									parentControl="Table"
									>
                              </internalMacro:Field>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "text", domResult)).toEqual(
				"DataField with hardcoded string"
			);
		});
	});

	describe("- when it uses directly a property - ", () => {
		it("Property with text arrangement ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="propWithText">
                              </internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "text", domResult)).toEqual(
				"{parts:[{value: 'formatWithBrackets'},{path:'propWithTextText', targetType : 'any'},{path:'propWithText', type : 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}}], formatter: 'sap.fe.core.formatters.ValueFormatter'}"
			);
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "value", domResult)).toEqual(
				"{path:'propWithText', type: 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}}"
			);
		});
		it("Property with text arrangement and override ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="propWithText">
									<internalMacro:formatOptions displayMode="Value"/>
                              </internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "text", domResult)).toEqual(
				"{path:'propWithText', type: 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}}"
			);
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "value", domResult)).toEqual(
				"{path:'propWithText', type: 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}}"
			);
		});
		it("Boolean property", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="preferredItem"
									/>`;
			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:CheckBox");
		});
	});

	describe("- check control templating for basic types and input alignment- ", () => {
		describe("- for table - ", () => {
			it("Simple DataField on a string property ", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "textAlign", domResult)
				).toEqual("Begin");
			});

			it("Simple DataField on a boolean property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/5"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:CheckBox");
			});

			it("Simple DataField on a Timestamp property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/6"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:DateTimePicker");
				expect(
					getControlAttribute(
						"/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:DateTimePicker",
						"textAlign",
						domResult
					)
				).toEqual("End");
			});

			it("Simple DataField on a Decimal property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/7"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "textAlign", domResult)
				).toEqual("End");
			});

			it("Simple DataField on a Time property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/8"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:TimePicker");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:TimePicker", "textAlign", domResult)
				).toEqual("End");
			});

			it("Simple DataField on a Double property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/9"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "textAlign", domResult)
				).toEqual("End");
			});

			it("Simple DataField on a Integer property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/10"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "textAlign", domResult)
				).toEqual("End");
			});

			it("Simple DataField on a Date property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/13"
									>
									<internalMacro:formatOptions valueFormat="long"/>
                              </internalMacro:Field>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "text", domResult)
				).toEqual("{path:'headerDate', type: 'sap.ui.model.odata.type.Date', formatOptions: {style: 'long'}}");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:DatePicker");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:DatePicker", "textAlign", domResult)
				).toEqual("End");
			});
			it("Simple DataField on a Quantity with unit property where unit is also editable", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/14"
									parentControl="Table"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "text", domResult)
				).toEqual(
					"{mode:'TwoWay', parts:[{path:'quantity1', type : 'sap.ui.model.odata.type.Int64'},{path:'unit1', type : 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}"
				);
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "width", domResult)
				).toEqual("70%");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "description", domResult)
				).toBeFalsy();
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]", "width", domResult)
				).toEqual("30%");
			});
			it("Simple DataField on a Quantity with unit property where unit is readonly", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/15"
									parentControl="Table"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text", "text", domResult)
				).toEqual(
					"{mode:'TwoWay', parts:[{path:'quantity2', type : 'sap.ui.model.odata.type.Decimal', constraints: {scale: 2, precision: 10}},{path:'unit2', type : 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'}"
				);
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "width", domResult)
				).toEqual("100%");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "description", domResult)
				).toEqual("{unit2}");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "value", domResult)
				).toEqual(
					"{mode:'TwoWay', parts:[{path:'quantity2', type : 'sap.ui.model.odata.type.Decimal', constraints: {scale: 2, precision: 10}},{path:'unit2', type : 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}},{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit', formatOptions: {showMeasure: false}}"
				);
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]", "visible", domResult)
				).toEqual("false");
			});
			it("Simple DataField on a Quantity with currency property ", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/16"
									parentControl="Table"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl(
					"/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/control:FormElementWrapper/u:Currency"
				);

				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "width", domResult)
				).toEqual("70%");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "description", domResult)
				).toBeFalsy();
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]", "width", domResult)
				).toEqual("30%");
			});
			it("Simple DataField on a Quantity with static unit annotation", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/17"
									parentControl="Table"
									/>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "width", domResult)
				).toEqual("100%");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[1]", "description", domResult)
				).toEqual("mol");
				expect(domResult).toNotHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input[2]");
			});
		});
		describe("- for form - ", () => {
			it("Simple DataField on a string property ", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1">
									<internalMacro:formatOptions textAlignMode="Form"/>
                              </internalMacro:Field>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "textAlign", domResult)
				).toEqual("Begin");
			});

			it("Simple DataField on a Integer property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/10">
									<internalMacro:formatOptions textAlignMode="Form"/>
                              </internalMacro:Field>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:Input", "textAlign", domResult)
				).toEqual("{= %{ui>/isEditable} ? 'End' : 'Begin'}");
			});

			it("Simple DataField on a Date property", async () => {
				const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/13">
									<internalMacro:formatOptions textAlignMode="Form"/>
								</internalMacro:Field>`;
				const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:Text");
				expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:DatePicker");
				expect(
					getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentEdit/m:DatePicker", "textAlign", domResult)
				).toEqual("Begin");
			});
		});
	});

	describe("- check control templating for empty placeHolder trigger- ", () => {
		it("when there is no formatOptions/showEmptyIndicator ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1">
                              </internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper", "emptyIndicatorTrigger", domResult)).toEqual("inactive");
		});

		it("when there is formatOptions/showEmptyIndicator for a Datafield ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem/1">
									<internalMacro:formatOptions showEmptyIndicator="true"/>
                              </internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper", "emptyIndicatorTrigger", domResult)).toEqual(
				"{path:'name', type: 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}}"
			);
		});

		it("when there is formatOptions/showEmptyIndicator for a property ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="propWithText">
									<internalMacro:formatOptions showEmptyIndicator="true"/>
                              </internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(getControlAttribute("/macros:FieldAPI/control:FieldWrapper", "emptyIndicatorTrigger", domResult)).toEqual(
				"{parts:[{value: 'formatWithBrackets'},{path:'propWithTextText', targetType : 'any'},{path:'propWithText', type : 'sap.ui.model.odata.type.String', formatOptions: {parseKeepsEmptyString: true}}], formatter: 'sap.fe.core.formatters.ValueFormatter'}"
			);
		});
	});

	describe("- dataField annotation- ", () => {
		it("criticality ", async () => {
			const xmlField = `<internalMacro:Field xmlns:internalMacro="sap.fe.macros.internal"
									entitySet="{entitySet>}"
									dataField="@com.sap.vocabularies.UI.v1.LineItem#DataFields/0">
                              </internalMacro:Field>`;

			const domResult = await getTemplatingResult(xmlField, sMetadataUrl, mBindingContexts, {});
			expect(domResult).toHaveControl("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectStatus");
			expect(
				getControlAttribute("/macros:FieldAPI/control:FieldWrapper/control:contentDisplay/m:ObjectStatus", "icon", domResult)
			).toEqual(
				"{= (${usageCounter} === 'com.sap.vocabularies.UI.v1.CriticalityType/Negative') || (${usageCounter} === '1') || (${usageCounter} === 1) ? 'sap-icon://message-error' : (${usageCounter} === 'com.sap.vocabularies.UI.v1.CriticalityType/Critical') || (${usageCounter} === '2') || (${usageCounter} === 2) ? 'sap-icon://message-warning' : (${usageCounter} === 'com.sap.vocabularies.UI.v1.CriticalityType/Positive') || (${usageCounter} === '3') || (${usageCounter} === 3) ? 'sap-icon://message-success' : (${usageCounter} === 'com.sap.vocabularies.UI.v1.CriticalityType/Information') || (${usageCounter} === '5') || (${usageCounter} === 5) ? 'sap-icon://message-information' : '' }"
			);
		});
	});
});
