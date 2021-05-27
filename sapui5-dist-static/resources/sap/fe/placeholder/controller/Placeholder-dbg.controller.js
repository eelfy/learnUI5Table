sap.ui.define(
	["sap/ui/core/mvc/Controller"],
	function(Controller) {
		"use strict";

		return Controller.extend("sap.fe.placeholder.controller.Placeholder", {
			isPlaceholder: function() {
				return true;
			},
			setPlaceholderOption: function(oOptions) {
				this.oOptions = oOptions;
			},
			getOptions: function(sKeyName) {
				return this.oOptions[sKeyName];
			},
			istargetNavigated: function(oTarget) {
				if (!this.aTargetNavigated) {
					this.aTargetNavigated = [];
				}
				if (this.aTargetNavigated.indexOf(oTarget.id) === -1) {
					this.sCurrentTargetId = oTarget.id;
					return false;
				} else {
					return true;
				}
			},
			currentTargetNavigated: function() {
				if (!this.aTargetNavigated) {
					this.aTargetNavigated = [];
				}
				if (this.aTargetNavigated && this.aTargetNavigated.indexOf(this.sCurrentTargetId) === -1) {
					this.aTargetNavigated.push(this.sCurrentTargetId);
				}
			}
		});
	},
	true
);
