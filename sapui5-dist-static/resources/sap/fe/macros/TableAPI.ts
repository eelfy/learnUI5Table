import { APIClass, EventHandler, MacroContext } from "sap/fe/core/helpers/ClassSupport";
import { UI5Event } from "global";
import { parseDataForTablePaste } from "sap/fe/core/helpers/PasteHelper";
import { MessageBox } from "sap/m";
import { Device } from "sap/ui";
import { Log } from "sap/base";
import { PageController } from "sap/fe/core";
import { TableVisualization } from "sap/fe/core/converters/controls/Common/Table";
import MacroAPI from "./MacroAPI";

/**
 * @classdesc
 * Content of a Field
 *
 * @class sap.fe.macros.Table
 */
@APIClass("sap.fe.macros.TableAPI")
class TableAPI extends MacroAPI {
	@MacroContext()
	tableDefinition!: TableVisualization;

	@EventHandler
	onPaste(oEvent: UI5Event, oController: PageController) {
		// If paste is disable or if we're not in edit mode, we can't paste anything
		if (!this.tableDefinition.control.enablePaste || !this.getModel("ui").getProperty("/isEditable")) {
			return;
		}

		const aRawPastedData = oEvent.getParameter("data"),
			oTable = oEvent.getSource(),
			bPasteEnabled = oTable.data()["pasteEnabled"];
		let oResourceModel;

		if (bPasteEnabled === true || bPasteEnabled === "true") {
			parseDataForTablePaste(aRawPastedData, oTable)
				.then(aParsedData => {
					if (aParsedData && aParsedData.length > 0) {
						return oController.editFlow.createMultipleDocuments(
							oTable.getRowBinding(),
							aParsedData,
							this.tableDefinition.control.createAtEnd
						);
					}
				})
				.catch(oError => {
					Log.error("Error while pasting data", oError);
				});
		} else {
			oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
			MessageBox.error(oResourceModel.getText("T_OP_CONTROLLER_SAPFE_PASTE_DISABLED_MESSAGE"), {
				title: oResourceModel.getText("C_COMMON_SAPFE_ERROR")
			});
		}
	}

	@EventHandler
	onPasteButtonPressed() {
		const oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
			sDeviceOs = Device.os.name,
			sDeviceBrowser = Device.browser,
			sDeviceSystem = Device.system;
		// We need a default in case we fall through the crack
		let sMessageOnPasteButton: string = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP");
		// On mobile, there is no native paste trigger:
		if (sDeviceBrowser.mobile) {
			sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_TOUCH_DEVICE");
		} else if (sDeviceSystem.desktop) {
			switch (sDeviceOs) {
				case "win":
					sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP");
					break;
				case "mac":
					sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_IOS_DESKTOP");
					break;
			}
		}
		MessageBox.information(sMessageOnPasteButton, {
			onClose: () => {
				if (this.content) {
					// Set the focus on the inner table to allow paste
					(this.content.getAggregation("_content") as any)?.applyFocusInfo({ preventScroll: true });
				}
			}
		});
	}
}

export default TableAPI;
