/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * ContainerBase renderer.
	 * @namespace
	 * @static
	 */
	var ContainerBaseRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ContainerBaseRenderer.render = function(oRm, oControl) {
		// console.log( "sap.ui.vk.ContainerBaseRenderer.render.....\r\n");
		var sTooltip = oControl.getTooltip_AsString();
		var sTitle = oControl.getTitle();
		var aLabelledBy = oControl.getAriaLabelledBy();
		var aDescribedBy = oControl.getAriaDescribedBy();

		// write the HTML into the render manager
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.writeAttribute("role", sap.ui.core.AccessibleRole.Group);

		if (sTitle) {
			oRm.writeAttributeEscaped("aria-label", sTitle);
		} else if (sTooltip) {
			oRm.writeAttributeEscaped("aria-label", sTooltip);
		}

		// aria-labelledby references
		if (aLabelledBy && aLabelledBy.length > 0) {
			oRm.writeAttributeEscaped("aria-labelledby", aLabelledBy.join(" "));
		}
		// aria-describedby references
		if (aDescribedBy && aDescribedBy.length > 0) {
			oRm.writeAttributeEscaped("aria-describedby", aDescribedBy.join(" "));
		}

		oRm.addClass("sapUiVkContainerBase");
		oRm.writeClasses(oControl);
		oRm.write(">");

		// wrapper
		oRm.write("<div");
		oRm.writeAttributeEscaped("id", oControl.getId() + "-wrapper");
		oRm.writeAttribute("role", sap.ui.core.AccessibleRole.Presentation);
		oRm.addClass("sapUiVkContainerBaseWrapper");
		oRm.writeClasses();
		oRm.write(">");

		this.writeContentArea(oRm, oControl);

		this.writeToolbarArea(oRm, oControl);

		oRm.write("</div>"); // end wrapper

		oRm.write("</div>");
	};

	ContainerBaseRenderer.writeContentArea = function(oRm, oControl) {
		// content part
		var selectedContent = oControl.getSelectedContent();

		oRm.write("<div");
		oRm.addClass("sapUiVkContainerBaseContentArea");
		oRm.writeAttribute("role", sap.ui.core.AccessibleRole.Img);
		oRm.writeClasses();
		oRm.write(">");

		if (selectedContent !== null) {
			oRm.renderControl(selectedContent);
		} else if (oControl.getContent().length > 0) {
			selectedContent = oControl.getContent()[0];
			oRm.renderControl(selectedContent);
		}

		oRm.write("</div>");// end contentArea
	};

	ContainerBaseRenderer.writeToolbarArea = function(oRm, oControl) {
		oRm.write("<div");
		oRm.addClass("sapUiVkContainerBaseToolbarArea");
		oRm.writeAttribute("role", sap.ui.core.AccessibleRole.Group);
		oRm.writeClasses();
		oRm.write(">");
		// toolbar
		oRm.renderControl(oControl._oToolbar);
		oRm.write("</div>");// end toolbar
	};

	return ContainerBaseRenderer;

}, /* bExport= */true);
