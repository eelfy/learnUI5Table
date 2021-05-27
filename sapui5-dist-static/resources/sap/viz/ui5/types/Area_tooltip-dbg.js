/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */

// Provides element sap.viz.ui5.types.Area_tooltip.
sap.ui.define(['sap/viz/library', 'sap/viz/ui5/core/BaseStructuredType'],
	function(library, BaseStructuredType) {
		"use strict";

	/**
	 * Constructor for a new sap.viz.ui5.types.Area_tooltip
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @classdesc Settings for the tooltip
	 * @extends sap.viz.ui5.core.BaseStructuredType
	 *
	 * @constructor
	 * @public
	 * @since 1.7.2
	 * @deprecated Since version 1.12.
	 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
	 * @alias sap.viz.ui5.types.Area_tooltip
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Area_tooltip = BaseStructuredType.extend("sap.viz.ui5.types.Area_tooltip", /** @lends sap.viz.ui5.types.Area_tooltip.prototype */ { metadata: {

		library: "sap.viz",


		properties : {

			/**
			 * Set whether the tooltip is enabled
			 */
			enabled : {type : "boolean", defaultValue : true}
		}
	}});


	return Area_tooltip;

});
