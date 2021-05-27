/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/core/TemplateComponent",
		"sap/ui/model/odata/v4/ODataListBinding",
		"sap/fe/core/CommonUtils",
		"sap/base/Log",
		"sap/fe/core/library",
		"sap/fe/templates/ObjectPage/SectionLayout"
	],
	function(TemplateComponent, ODataListBinding, CommonUtils, Log, CoreLibrary, SectionLayout) {
		"use strict";

		var VariantManagement = CoreLibrary.VariantManagement,
			ObjectPageComponent = TemplateComponent.extend("sap.fe.templates.ObjectPage.Component", {
				metadata: {
					properties: {
						/**
						 * Defines if and on which level variants can be configured:
						 * 		None: no variant configuration at all
						 * 		Page: one variant configuration for the whole page
						 * 		Control: variant configuration on control level
						 */
						variantManagement: {
							type: "sap.fe.core.VariantManagement",
							defaultValue: VariantManagement.None
						},
						/**
						 * Defines how the sections are rendered
						 * 		Page: all sections are shown on one page
						 * 		Tabs: each top-level section is shown in an own tab
						 */
						sectionLayout: {
							type: "sap.fe.templates.ObjectPage.SectionLayout",
							defaultValue: SectionLayout.Page
						},
						/**
						 * Enables the related apps features
						 */
						showRelatedApps: {
							type: "boolean",
							defaultValue: false
						},

						additionalSemanticObjects: {
							type: "object"
						},
						/**
						 * Enables the editable object page header
						 */
						editableHeaderContent: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Enables the BreadCrumbs features
						 */
						showBreadCrumbs: {
							type: "boolean",
							defaultValue: true
						},
						/**
						 * Calls draftPrepare on draftEdit
						 */
						prepareOnEdit: {
							type: "boolean",
							defaultValue: false
						}
					},
					library: "sap.fe.templates",
					manifest: "json"
				},

				isContextExpected: function() {
					return true;
				},

				// TODO: this should be ideally be handled by the editflow/routing without the need to have this method in the
				// object page - for now keep it here
				createDeferredContext: function(sPath) {
					if (!this.DeferredContextCreated) {
						this.DeferredContextCreated = true;
						var oListBinding,
							that = this,
							oParamters = {
								"$$groupId": "$auto.Heroes",
								"$$updateGroupId": "$auto"
							};

						oListBinding = new ODataListBinding(
							this.getModel(),
							sPath.replace("(...)", ""),
							undefined,
							undefined,
							undefined,
							oParamters
						);

						// for now wait until the view and the controller is created
						that.getRootControl()
							.getController()
							.editFlow.createDocument(oListBinding, {
								creationMode: "Sync"
							})
							.finally(function() {
								that.DeferredContextCreated = false;
							})
							.catch(function() {
								// the creation failed or was aborted by the user - showing the object page doesn't make any sense
								// now - for now just use window.history.back to navigate back
								window.history.back();
							});
					}
				},

				setVariantManagement: function(sVariantManagement) {
					if (sVariantManagement === VariantManagement.Page) {
						Log.error("ObjectPage does not support Page-level variant management yet");
						sVariantManagement = VariantManagement.None;
					}

					this.setProperty("variantManagement", sVariantManagement);
				}
			});
		return ObjectPageComponent;
	},
	/* bExport= */ true
);
