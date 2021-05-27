import { APIClass, Aggregation, Property } from "sap/fe/core/helpers/ClassSupport";
import { Control } from "sap/ui/core";
import { UI5Event } from "global";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { createConverterContextForMacro } from "sap/fe/core/converters/ConverterContext";
import { merge, uid } from "sap/base/util";
import { PhantomUtil } from "sap/fe/macros";
import { XMLPreprocessor } from "sap/ui/core/util";

@APIClass("sap.fe.macros.MacroAPI")
class MacroAPI extends Control {
	static namespace: string = "sap.fe.macros";
	static macroName: string = "Macro";
	static fragment: string = "sap.fe.macros.Macro";
	static hasValidation: boolean = true;

	/**
	 * Defines the path of the context used in the current page or block.
	 * This setting is defined by the framework.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	contextPath!: string;

	/**
	 * Defines the relative path of the property in the metamodel, based on the current contextPath.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	metaPath!: string;

	@Aggregation({ type: "sap.ui.core.Control", multiple: false, isDefault: true })
	content!: Control;

	rerender() {
		this.content.rerender();
	}

	getDomRef() {
		const oContent = this.content;
		return oContent ? oContent.getDomRef() : super.getDomRef();
	}
	private metadata: any;
	private modelResolved: boolean = false;
	propagateProperties(vName: string | boolean) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super.propagateProperties(vName);
		if (this.metadata.macroContexts && !this.modelResolved) {
			const oPageModel = this.getModel("_pageModel");
			if (oPageModel) {
				Object.keys(this.metadata.macroContexts).forEach((macroKeyName: string) => {
					this[macroKeyName as keyof MacroAPI] = oPageModel.getObject(this[macroKeyName as keyof MacroAPI] as string);
				});
				this.modelResolved = true;
			}
		}
	}

	static getAPI(oEvent: UI5Event): MacroAPI {
		let oSource = oEvent.getSource();
		while (oSource && !oSource.isA("sap.fe.macros.MacroAPI")) {
			oSource = oSource.getParent();
		}
		return oSource && oSource.isA("sap.fe.macros.MacroAPI") && oSource;
	}

	static setDefaultValue(oProps: any, sPropName: string, oOverrideValue: any) {
		if (oProps[sPropName] === undefined) {
			oProps[sPropName] = oOverrideValue;
		}
	}
	static getConverterContext = function(oDataModelPath: DataModelObjectPath, contextPath: string, mSettings: any) {
		const oAppComponent = mSettings.appComponent;
		const viewData = mSettings.models.viewData && mSettings.models.viewData.getData();
		const oConverterContext = createConverterContextForMacro(
			oDataModelPath.startingEntitySet.name,
			mSettings.models.metaModel,
			viewData.converterType,
			oAppComponent && oAppComponent.getShellServices(),
			oAppComponent && oAppComponent.getDiagnostics(),
			merge,
			oDataModelPath.contextLocation,
			viewData
		);
		return oConverterContext;
	};
	static createBindingContext = function(oData: object, mSettings: any) {
		const sContextPath = "/" + uid();
		mSettings.models.converterContext.setProperty(sContextPath, oData);
		return mSettings.models.converterContext.createBindingContext(sContextPath);
	};
	static register() {
		PhantomUtil.register(this);
	}
	static unregister() {
		(XMLPreprocessor as any).plugIn(null, this.namespace, this.macroName);
	}
}

export default MacroAPI;
