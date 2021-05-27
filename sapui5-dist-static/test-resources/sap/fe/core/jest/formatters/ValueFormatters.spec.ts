import valueFormatters from "sap/fe/core/formatters/ValueFormatter";

describe("Value Formatters", () => {
	it("can handled being badly called", () => {
		expect(valueFormatters.call(valueFormatters, "", "text", "description")).toEqual("");
		expect(valueFormatters.call(valueFormatters, "xxxx", "text", "description")).toEqual("");
	}),
		it("can display text + textarrangement properly", () => {
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "text", "description")).toEqual("text (description)");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "text", "")).toEqual("text");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "text", undefined)).toEqual("text");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "text", null)).toEqual("text");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "text")).toEqual("text");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "")).toEqual("");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets")).toEqual("");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", "", "description")).toEqual("description");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", undefined, "description")).toEqual("description");
			expect(valueFormatters.call(valueFormatters, "formatWithBrackets", null, "description")).toEqual("description");
		});
});
