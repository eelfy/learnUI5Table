/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([
    "jquery.sap.global"
],  function(jQuery) {
		"use strict";

	/**
	 * OdataDecisionTable renderer.
	 * @namespace
	 */
	var DecisionTableRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *            the control to be rendered
	 */
	DecisionTableRenderer.render = function(oRm, oControl) {

		//oRm.addClass("sapUiSizeCozy");
		if (oControl.getParent() instanceof jQuery){
			jQuery.sap.syncStyleClass("sapUiSizeCozy", oControl.getParent(), this.oControl);
		}

		var bAccessibility = sap.ui.getCore().getConfiguration().getAccessibility();
			
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapRULDecisionTable");
		oRm.writeClasses();
		// some controls need to have accessibility attributes applied one level up than the input
		this.writeAccAttributes(oRm, oControl);
		

		// accessibility states
		if (bAccessibility) {
			this.writeAccessibilityState(oRm, oControl);
		}

		oRm.write(">");
		
        oRm.renderControl(oControl.getAggregation("_toolbar"));
		oRm.renderControl(oControl.getAggregation("_errorsText"));
        oRm.renderControl(oControl.getAggregation("_table"));
		// finish outer
		oRm.write("</div>");
		
	};

	/**
	 * Writes the accessibility state of the control.
	 * Hook for the subclasses.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	DecisionTableRenderer.writeAccessibilityState = function(oRm, oControl) {
		oRm.writeAccessibilityState(oControl, this.getAccessibilityState(oControl));
	};

	/**
	 * Returns the accessibility state of the control.
	 * Hook for the subclasses.
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control.
	 * @returns {Object}
	 */
	DecisionTableRenderer.getAccessibilityState = function(oControl) {
		    var sAriaRoleDescription = this.getRoleDescription(oControl),
			sRole = this.getAriaRole(oControl),
		    mAccessibilityState = { };

			if (sRole) {
				mAccessibilityState.role = sRole;
			}

			if (sAriaRoleDescription) {
				mAccessibilityState.roledescription = {
					value: sAriaRoleDescription.trim(),
					append: true
				};
			}

		return mAccessibilityState;
	};

	/**
	 * Returns aria accessibility role for the control.
	 * Hook for the subclasses.
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control
	 * @returns {String}
	 */
	DecisionTableRenderer.getAriaRole = function(oControl) {
		return "grid";
	};

	DecisionTableRenderer.getRoleDescription = function(oControl) {
		this.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		return this.oBundle.getText("decisionTableReadOutString");
    };

	/**
	 * This method is reserved for derived class to add extra attributes for the container one level upper of input.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	DecisionTableRenderer.writeAccAttributes = function(oRm, oControl) {};

	/**
	 * Renders the hidden aria labelledby node for the accessibility.
	 * Hook for the subclasses.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	DecisionTableRenderer.renderAriaRoleDescription = function(oRm, oControl) {
		var sAnnouncement = this.getDescribedByAnnouncement(oControl);
		if (sAnnouncement) {
			oRm.write("<span");
			oRm.writeAttribute("id", oControl.getId() + "-roledescription");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addClass("sapUiInvisibleText");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sAnnouncement.trim());
			oRm.write("</span>");
		}
	};


	/**
	 * This method is reserved for derived class to add extra attributes for input container.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	DecisionTableRenderer.writeOuterAttributes = function(oRm, oControl) {};

	/**
	 * Returns the inner aria describedby announcement texts for the accessibility.
	 * Hook for the subclasses.
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control.
	 * @returns {String}
	 */
	DecisionTableRenderer.getDescribedByAnnouncement = function(oControl) {
		return "";
	};

	return DecisionTableRenderer;

}, /* bExport= */ true);