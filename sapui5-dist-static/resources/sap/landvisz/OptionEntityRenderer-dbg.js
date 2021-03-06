/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/landvisz/library"
], function(landviszLibrary) {
	"use strict";

	// shortcut for sap.landvisz.OptionType
	var OptionType = landviszLibrary.OptionType;

	/**
	 * ConnectionEntity renderer.
	 * @namespace
	 */
	var OptionEntityRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render
	 *            output buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	OptionEntityRenderer.render = function(oRm, oControl) {
		// write the HTML into the render manager
		if (!this.initializationDone) {
			oControl.initControls();
			oControl.initializationDone = true;
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapLandviszOptionButton");
			oRm.writeClasses();
			if (oControl.left != 0)
				oRm.addStyle("left", oControl.left + "px");
			if (oControl.top != 0)
				oRm.addStyle("top", oControl.top + "px");
			if (oControl.optionOn == OptionType.ENTITY)
				oRm.addStyle("position", "absolute");
			if (oControl.getEnable() == false) {
				oRm.addStyle("cursor", "default");
				oRm.addStyle("color", "#999999");
			} else {
				oRm.addStyle("cursor", "pointer");
				oRm.addStyle("color", "#00669c");
			}
			oRm.writeStyles();
			oRm.write(" >");
			oControl.optionBtn.addStyleClass("viewBtn");
			oControl.optionBtn.setText("");
			oControl.optionBtn.setTooltip(oControl.getOptionTextTooltip());
			oControl.optionBtn.setEnabled(oControl.getEnable());
			oControl.optionBtn.setSelected(oControl.getSelected());
			oRm.renderControl(oControl.optionBtn);
			oControl.optionTextView.addStyleClass("viewText");
			oControl.optionTextView.setText(oControl.getLabel());
			oControl.optionTextView.setTooltip(oControl.getOptionTextTooltip());
			oControl.optionTextView.setEnabled(oControl.getEnable());
			oRm.renderControl(oControl.optionTextView);
			oRm.write("</div>");
		}

	};

	return OptionEntityRenderer;

}, /* bExport = */ true);
