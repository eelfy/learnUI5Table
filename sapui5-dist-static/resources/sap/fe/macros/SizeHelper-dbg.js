/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/Button", "sap/ui/dom/units/Rem"], function(Button, Rem) {
	"use strict";

	var SizeHelper = {
		init: function() {
			// Create a new button in static area sap.ui.getCore().getStaticAreaRef()
			this.oBtn = new Button().placeAt(sap.ui.getCore().getStaticAreaRef());
			// Hide button from accessibility tree
			this.oBtn.setVisible(false);
		},
		/**
		 * Method to calculate button's width from a temp created button placed in static area.
		 *
		 * @param {string} sText - text inside button.
		 * @returns {number} - measurement of the button's width.
		 */
		getButtonWidth: function(sText) {
			if (this.oBtn.getVisible() === false) {
				this.oBtn.setVisible(true);
			}
			this.oBtn.setText(sText);
			//adding missing styles from buttons inside a table
			this.oBtn.addStyleClass("sapMListTblCell");
			// for sync rendering
			this.oBtn.rerender();
			var nButtonWidth = Rem.fromPx(this.oBtn.getDomRef().scrollWidth);
			this.oBtn.setVisible(false);
			return nButtonWidth;
		},

		exit: function() {
			this.oBtn.destroy();
		}
	};
	return SizeHelper;
});
