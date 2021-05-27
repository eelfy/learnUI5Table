import EmailType from "sap/fe/core/type/Email";

describe("Email type", function() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const emailType = new EmailType();
	it("can validate correct emails", () => {
		try {
			emailType.validateValue("me@sap.com");
			emailType.validateValue("me@sap");
			emailType.validateValue("me-and.friends@sap");
		} catch (e) {
			expect(e).toBeNull();
		}
	});
	it("will throw a validate exception otherwise", () => {
		expect(() => emailType.validateValue("me@sap.")).toThrow();
		expect(() => emailType.validateValue("me")).toThrow();
		expect(() => emailType.validateValue("me@you@.com")).toThrow();
	});
});
