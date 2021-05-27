sap.ui.define(
	["sap/m/HBox", "sap/m/HBoxRenderer", "sap/ui/core/StashedControlSupport"],
	function(HBox, HBoxRenderer, StashedControlSupport) {
		"use strict";

		var StashableHBox = HBox.extend("sap.fe.templates.ObjectPage.controls.StashableHBox", {
			metadata: {
				properties: {
					/*
					 * Title of the Header Facet. Not visible on the UI. Visible on the UI is the Title or Link control inside the items aggregation of the Header Facet.
					 * Must always be in sync with the visible Title or Link control.
					 */
					title: {
						type: "string"
					}
				},
				designtime: "sap/fe/templates/ObjectPage/designtime/StashableHBox.designtime"
			},
			renderer: {
				render: function(oRm, oControl) {
					HBoxRenderer.render.apply(this, [oRm, oControl]);
				}
			}
		});

		/*
		 * Set title of visible Title/Link control and own title property.
		 */
		StashableHBox.prototype.setTitle = function(sTitle) {
			var oControl = this.getTitleControl();
			if (oControl) {
				oControl.setText(sTitle);
			}
			this.title = sTitle;

			return this;
		};

		/*
		 * Return the title property.
		 */
		StashableHBox.prototype.getTitle = function() {
			return this.title;
		};

		/*
		 * In case of UI changes, Title/Link text needs to be set to new value after Header Facet control and inner controls are rendered.
		 * Else: title property needs to be initialized.
		 */
		StashableHBox.prototype.onAfterRendering = function() {
			if (this.title) {
				this.setTitle(this.title);
			} else {
				var oControl = this.getTitleControl();
				if (oControl) {
					this.title = oControl.getText();
				}
			}
		};

		/*
		 * Retrieves Title/Link control from items aggregation.
		 */
		StashableHBox.prototype.getTitleControl = function() {
			var aItems = [],
				i;
			if (this.getItems && this.getItems()[0] && this.getItems()[0].getItems) {
				aItems = this.getItems()[0].getItems();
			} else if (this.getItems && this.getItems()[0] && this.getItems()[0].getMicroChartTitle) {
				aItems = this.getItems()[0].getMicroChartTitle();
			}
			for (i = 0; i < aItems.length; i++) {
				if (aItems[i].isA("sap.m.Title") || aItems[i].isA("sap.m.Link")) {
					return aItems[i];
				}
			}
			return null;
		};

		StashedControlSupport.mixInto(StashableHBox);

		return StashableHBox;
	},
	/* bExport= */ true
);
