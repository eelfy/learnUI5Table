import { Context } from "sap/ui/model";
import { ManagedObject } from "sap/ui/base";
import { View } from "sap/ui/core/mvc";
import { PageController } from "sap/fe/core";

const customIsEnabledCheck = function(this: ManagedObject, oView: View, modulePath: string, aSelectedContexts: Context[]): Promise<void> {
	const oExtensionAPI = (oView.getController() as PageController).getExtensionAPI();
	const parts = modulePath.split(".");
	const methodName = parts.pop() as string;
	const moduleName = parts.join("/");

	return new Promise(resolve => {
		sap.ui.require([moduleName], (module: any) => {
			resolve(module[methodName].bind(oExtensionAPI)(this.getBindingContext(), aSelectedContexts || []));
		});
	});
};
customIsEnabledCheck.__functionName = "sap.fe.core.formatters.FPMFormatter#customIsEnabledCheck";

/**
 * Collection of table formatters.
 *
 * @param {object} this the context
 * @param {string} sName the inner function name
 * @param {object[]} oArgs the inner function parameters
 * @returns {object} the value from the inner function
 */
const fpmFormatter = function(this: object, sName: string, ...oArgs: any[]): any {
	if (fpmFormatter.hasOwnProperty(sName)) {
		return (fpmFormatter as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

fpmFormatter.customIsEnabledCheck = customIsEnabledCheck;

/**
 * @global
 */
export default fpmFormatter;
