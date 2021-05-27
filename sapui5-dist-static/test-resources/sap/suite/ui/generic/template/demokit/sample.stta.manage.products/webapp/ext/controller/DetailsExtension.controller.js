sap.ui.define("STTA_MP.ext.controller.DetailsExtension", [
	"sap/base/Log",
	"sap/m/MessageBox",
	"sap/ui/core/message/Message"
], function(Log, MessageBox, Message) {
	"use strict";

	return {
		onInit: function(){
			// Example to show consumption of attachAfterLineItemDelete extension API
			var oApi = this.extensionAPI.getTransactionController();
			var fnFunction = function (oEvent) {
				var tableId = oEvent.sUiElementId;
				// var item = oEvent.aContexts[0].getObject().SalesOrderItem;      -- Use of aContexts property of oEvent
				var myId = "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable";
				if(tableId === myId ) {
					oEvent.deleteEntitiesPromise.then(
						function() { MessageBox.success("Example of attachAfterLineItemDelete extension API"); },
						function() { MessageBox.error("Unsuccessful"); }
					); 
				}  
			};
			if (oApi.attachAfterLineItemDelete) {
			  oApi.attachAfterLineItemDelete(fnFunction);
			}
		},
		onObjectPageCustomAction: function() {
			MessageBox.success("Hello from ObjectPage custom action!", {});
		},
		onMySmartTableValidation: function() {
			var aDescriptions = this.extensionAPI.getSelectedContexts("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table");
			for (var i = 0; i < aDescriptions.length; i++) {
				if (aDescriptions[i].getProperty("ActiveLanguage") !== "EN") {
					MessageBox.success("Language " + aDescriptions[i].getProperty("ActiveLanguage") + " not yet supported", {});
					return;
				}
			}
		},
		onMySmartChartHello: function() {
			var aSelectedDataPoints = this.extensionAPI.getSelectedContexts("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart");
			MessageBox.success(aSelectedDataPoints.count + " DataPoints have been selected.", {});
		},
		onShowDetailsExt: function() {
			var oApi = this.extensionAPI;
			var aContext = oApi.getSelectedContexts("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			var oContext = aContext[0];
			var oNavController = oApi.getNavigationController();
			var oNavInfo = {
					navigationProperty: "to_ProductText"
			};
			oNavController.navigateInternal(oContext, oNavInfo);
		},
		onFormButtonPressed: function() {
			MessageBox.success("Hello from SmartForm breakout!", {});
		},

		onCustomFilterChange: function(oEvent) {
			var smartTable = sap.ui.getCore().byId("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table");
			smartTable.rebindTable();
		},

		onBeforeRebindTableExtension: function (oEvent) {
			var customFilter = sap.ui.getCore().byId("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--CustomFilter-Language");
			if (customFilter) {
				var oBindingParams = oEvent.getParameter("bindingParams");
				oBindingParams.parameters = oBindingParams.parameters || {};
				var key = customFilter.getSelectedKey();
				switch (key) {
					case "0" :
						oBindingParams.filters.push(new sap.ui.model.Filter("Language", "EQ", "EN"));
						break;	 
					case "1" :
						oBindingParams.filters.push(new sap.ui.model.Filter("Language", "EQ", "ZH"));
						break;
					default:
						return;
				}
			}
			var oID = oEvent.getSource().getId();
			var tableId = "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table";
			// to select only one specific table
			switch (oID) {
				case tableId:
					// implement your logic for table here
					Log.info("Table extension point!");
					break;
				default:
					return;
			}
		},

		onGridTableBreakoutButtonPress: function() {
			MessageBox.success("Hello from onGridTableBreakoutButtonPress breakout!", {});
		},
		onAnalyticalTableBreakoutButtonPress: function() {
			MessageBox.success("Hello from onAnalyticalTableBreakoutButtonPress breakout!", {});
		},
		onSourceValidationFailed: function(oEvent) {
			oEvent.preventDefault();
		},
		customizeMsgModelforTransientMessagesExtension:function() {
			if(sap.ui.getCore().getMessageManager().getMessageModel().oData.length) {
				return new Promise(function(resolve,reject) {
					var msgText = "This is the new Transient Message" ;
					var msgDesc = msgText+" added after altering the Message Model."
					var InfoMessage = new Message({
						message: msgText,
						description: msgDesc,
						type: sap.ui.core.MessageType.Information,
						target: '',
						persistent: true
					});
					sap.ui.getCore().getMessageManager().addMessages(InfoMessage);
					resolve("customizeMsgModelforTransientMessagesExtension is completed");
				});
			}
		}
	};
});
