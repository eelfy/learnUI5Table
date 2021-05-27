const formatWithBrackets = function(firstPart?: string, secondPart?: string): string {
	if (secondPart) {
		return firstPart ? firstPart + " (" + secondPart + ")" : secondPart;
	} else {
		return firstPart ? firstPart : "";
	}
};
formatWithBrackets.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithBrackets";

/**
 * Collection of table formatters.
 *
 * @param {object} this the context
 * @param {string} sName the inner function name
 * @param {object[]} oArgs the inner function parameters
 * @returns {object} the value from the inner function
 */
const valueFormatters = function(this: object, sName: string, ...oArgs: any[]): any {
	if (valueFormatters.hasOwnProperty(sName)) {
		return (valueFormatters as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

valueFormatters.formatWithBrackets = formatWithBrackets;

/**
 * @global
 */
export default valueFormatters;
