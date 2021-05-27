sap.ui.define(["sap/ui/core/CommandExecution", "sap/base/Log", "sap/ui/core/Element", "sap/ui/core/Shortcut"], function(
	CommandExecution,
	Log,
	Element,
	Shortcut
) {
	"use strict";
	return CommandExecution.extend("sap.fe.core.controls.CommandExecution", {
		setParent: function(oParent) {
			var aExcludedSingleKey = ["escape"],
				aCommands;
			CommandExecution.prototype.setParent.apply(this, arguments);
			aCommands = oParent.data("sap.ui.core.Shortcut");
			if (Array.isArray(aCommands) && aCommands.length > 0) {
				var oCommand = oParent.data("sap.ui.core.Shortcut")[aCommands.length - 1],
					oShortcut = oCommand.shortcutSpec;
				if (oShortcut && aExcludedSingleKey.indexOf(oShortcut.key) > -1) {
					// Check if single key shortcut
					for (var key in oShortcut) {
						if (oShortcut[key] && key !== "key") {
							return this;
						}
					}
					// Need to disable ShortCut when user press single shortcut key into an input
					oParent.addDelegate(
						{
							"onkeydown": function(oEvent) {
								if (aExcludedSingleKey.indexOf(oEvent.key.toLowerCase()) > -1) {
									var sElement = oEvent.target ? oEvent.target.tagName.toLowerCase() : undefined;
									if (sElement === "input") {
										oEvent.setMarked();
									}
								}
							}
						},
						true,
						undefined,
						true
					);
				}
				return this;
			}
		},

		destroy: function() {
			var oParent = this.getParent();
			if (oParent) {
				var oCommand = this._getCommandInfo();
				if (oCommand) {
					Shortcut.unregister(this.getParent(), oCommand.shortcut);
				}
				this._cleanupContext(oParent);
			}
			Element.prototype.destroy.apply(this, arguments);
		},

		setVisible: function(bValue) {
			var oCommand = this._getCommandInfo();
			if (oCommand) {
				CommandExecution.prototype.setVisible.apply(this, arguments);
			} else {
				Log.info("There is no shortcut definition registered in the manifest for the command : " + this.getCommand());
			}
		}
	});
});
