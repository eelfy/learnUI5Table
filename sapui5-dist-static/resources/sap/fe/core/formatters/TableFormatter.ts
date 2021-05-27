import { ManagedObject } from "sap/ui/base";
import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";

const rowHighlighting = function(criticalityValue: string | number): MessageType {
	let criticalityProperty;
	if (typeof criticalityValue === "string") {
		return (criticalityValue as unknown) as MessageType;
	}
	switch (criticalityValue) {
		case 1:
			criticalityProperty = MessageType.Error;
			break;
		case 2:
			criticalityProperty = MessageType.Warning;
			break;
		case 3:
			criticalityProperty = MessageType.Success;
			break;
		case 5:
			criticalityProperty = MessageType.Information;
			break;
		default:
			criticalityProperty = MessageType.None;
	}
	return criticalityProperty;
};
rowHighlighting.__functionName = "sap.fe.core.formatters.TableFormatter#rowHighlighting";

const navigatedRow = function(this: ManagedObject, sDeepestPath: string) {
	if (this.getBindingContext() && sDeepestPath) {
		return sDeepestPath.indexOf(this.getBindingContext().getPath()) === 0;
	} else {
		return false;
	}
};
navigatedRow.__functionName = "sap.fe.core.formatters.TableFormatter#navigatedRow";

// See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax
/**
 * Collection of table formatters.
 *
 * @param {object} this the context
 * @param {string} sName the inner function name
 * @param {object[]} oArgs the inner function parameters
 * @returns {object} the value from the inner function
 */
const tableFormatters = function(this: object, sName: string, ...oArgs: any[]): any {
	if (tableFormatters.hasOwnProperty(sName)) {
		return (tableFormatters as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

tableFormatters.rowHighlighting = rowHighlighting;
tableFormatters.navigatedRow = navigatedRow;
/**
 * @global
 */
export default tableFormatters;
