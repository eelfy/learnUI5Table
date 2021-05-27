sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/qunit/QUnitUtils"], function(Opa5, OpaBuilder, QUnitUtils) {
	"use strict";

	/**
	 * Creates a RegExp for HeaderFacetContainer Facet ID.
	 *
	 * @param {string} [sFacetId] the name of the Facet
	 * @returns {object} A RegExp matching the Facet ID.
	 *
	 * @private
	 */
	function getHeaderFacetContainerId(sFacetId) {
		var vId = new RegExp("fe::HeaderFacetContainer::" + sFacetId + "$");

		return vId;
	}

	/**
	 * Creates a RegExp for Section Facet ID.
	 *
	 * @param {string} [sId] the name of the Section Facet
	 * @returns {object} A RegExp matching the Section Facet ID
	 *
	 * @private
	 */
	function getSectionId(sId) {
		var vId = new RegExp("fe::FacetSection::" + sId + "-anchor$");

		return vId;
	}

	/**
	 * Creates a RegExp for FormElement ID for a field added via RTA.
	 *
	 * @param {string} [sId] the ID of the Field including the RTA specific part, i.e. GeneralInformation::Content_sap.fe.manageitems.TechnicalTestingService.LineItems_dataField
	 * @returns {object} A RegExp matching the FormElement ID.
	 *
	 * @private
	 */
	function getFormElementRTAId(sId) {
		return new RegExp("fe::Form::(.+)" + sId + "_FormElement" + "$");
	}

	/**
	 * Generates a matcher function to match the ID of the referenced control of an overlay.
	 *
	 * @param {string | RegExp} [vId] the name of the Facet
	 * @param {boolean} [bCheckParent] Set to true to check the parent element of the control
	 * @returns {object} A RegExp matching the Facet ID.
	 *
	 * @private
	 */
	function generateHasReferencedControlIdMatcher(vId, bCheckParent) {
		var fnHasReferencedControlId = function(oOverlay) {
			var oElement = bCheckParent ? oOverlay.getElementInstance().getParent() : oOverlay.getElementInstance(),
				sElementId = oElement && oElement.getId();

			return typeof vId === "string" ? sElementId === vId : vId.test(sElementId); // check ID of referenced control
		};

		return fnHasReferencedControlId;
	}

	return {
		actions: {
			iExecuteById: function(vId, sDescription) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasId(vId)
					.doPress()
					.description(sDescription)
					.execute();
			},

			iExecuteMeArea: function() {
				return this.iExecuteById("meAreaHeaderButton", "Me Area");
			},

			iExecuteAdaptUI: function() {
				return this.iExecuteById(/RTA_Plugin_ActionButton$/, "Adapt UI");
			},

			iExecuteAdaptation: function() {
				return this.iExecuteById(/adaptationSwitcherButton$/, "Adaptation");
			},

			iExecuteNavigation: function() {
				return this.iExecuteById(/navigationSwitcherButton$/, "Navigation");
			},

			iWaitUntilTheBusyIndicatorIsGone: function() {
				// switch to Adapt UI can take some time, so we explicitly wait for non-busy
				return OpaBuilder.create(this)
					.viewId(null)
					.hasId("mainShell")
					.has(function(oRootView) {
						return oRootView.getBusy() === false;
					})
					.timeout(180) // could take some time
					.description("Busy indicator is gone")
					.execute();
			},

			iExecuteRightContextMenuById: function(vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(fnHasReferencedControlId)
					.do(function(oOverlay) {
						oOverlay.$().trigger("contextmenu"); // right click
					})
					.description(sDescription)
					.execute();
			},

			iExecuteLeftContextMenuById: function(vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(fnHasReferencedControlId)
					.doPress()
					.description(sDescription)
					.execute();
			},

			iExecuteRightContextMenuOnHeaderContainer: function() {
				return this.iExecuteRightContextMenuById(/fe::HeaderContentContainer$/, "Context menu for Header Container");
			},

			iExecuteRightContextMenuOnVariantManagement: function() {
				return this.iExecuteRightContextMenuById(/fe::PageVariantManagement$/, "Context menu for Variant Management");
			},

			iExecuteRightContextMenuOnTable: function() {
				return this.iExecuteRightContextMenuById(/fe::table::SalesOrderManage::LineItem$/, "Context menu for Table");
			},

			iExecuteRightContextMenuOnFilterBar: function() {
				return this.iExecuteRightContextMenuById(/fe::FilterBar::SalesOrderManage$/, "Context menu for FilterBar");
			},

			/*
			iExecuteLeftContextMenuOnHeaderContainer: function() {
				return this.iExecuteLeftContextMenuById(/fe::HeaderContentContainer$/, "Left Context menu for Header Container");
			},
			*/

			iExecuteRightContextMenuOnHeaderFacet: function(sFacetId) {
				return this.iExecuteRightContextMenuById(getHeaderFacetContainerId(sFacetId), "Context menu for " + sFacetId, true);
			},

			iExecuteRightContextMenuOnSection: function(sId) {
				return this.iExecuteRightContextMenuById(getSectionId(sId), "Context menu for " + sId, false);
			},

			iExecuteRightContextMenuOnFormContainer: function(sId) {
				return this.iExecuteRightContextMenuById(
					new RegExp("fe::FormContainer::FieldGroup::" + sId + "$"),
					"Context menu for Form Container " + sId
				);
			},

			iExecuteLeftContextMenuOnSection: function(sId) {
				return this.iExecuteLeftContextMenuById(getSectionId(sId), "Left context menu for " + sId, false);
			},

			iExecuteLeftContextMenuOnHeaderFacet: function(sFacetId) {
				return this.iExecuteLeftContextMenuById(getHeaderFacetContainerId(sFacetId), "Left Context menu for " + sFacetId, true);
			},

			iExecuteRightContextMenuOnFieldAddedViaRTA: function(sId) {
				return this.iExecuteRightContextMenuById(getFormElementRTAId("_" + sId), "Context menu for Field " + sId);
			},

			iExecuteFocusOnAnchorBar: function() {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasId(/fe::ObjectPage-anchBar$/)
					.doPress()
					.description("Focus on AnchorBar")
					.execute();
			},

			iExecutePopOverActionByIcon: function(sIcon, sDescription) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.hasProperties({ icon: "sap-icon://" + sIcon }) // e.g. edit, add, rename, less (=remove), scissors (=cut), paste
					.isDialogElement()
					.doPress()
					.description(sDescription)
					.execute();
			},

			iExecutePopOverActionRename: function(sId) {
				return this.iExecutePopOverActionByIcon("edit", "Press rename on " + sId);
			},

			iExecutePopOverActionAdd: function(sDescription) {
				return this.iExecutePopOverActionByIcon("add", sDescription);
			},

			iExecutePopOverActionRemove: function(sDescription) {
				return this.iExecutePopOverActionByIcon("less", sDescription);
			},

			iExecutePopOverActionCut: function(sDescription) {
				return this.iExecutePopOverActionByIcon("scissors", sDescription);
			},

			iExecutePopOverActionPaste: function(sDescription) {
				return this.iExecutePopOverActionByIcon("paste", sDescription);
			},

			iExecutePopOverActionDuplicate: function(sDescription) {
				return this.iExecutePopOverActionByIcon("duplicate", "Duplicate Variant '" + sDescription + "'");
			},

			iExecutePopOverActionSettings: function(sDescription) {
				return this.iExecutePopOverActionByIcon("key-user-settings", "Open " + sDescription + " Settings");
			},

			iExecutePopOverActionEmbedContent: function(sDescription) {
				return this.iExecutePopOverActionByIcon("tnt/content-enricher", "Open " + sDescription + " Settings");
			},

			iSwitchToGroupViewInTheFilterBarDialog: function() {
				return this.iExecutePopOverActionByIcon("group-2", "Switch to grouped view in filter bar dialog");
			},

			iSelectExpandFiltersgroupInTheFilterBarDialog: function(sFiltersgroupName) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Panel")
					.hasChildren(
						OpaBuilder.create(this)
							.hasType("sap.m.Label")
							.hasProperties({ text: sFiltersgroupName })
					)
					.doOnChildren(
						OpaBuilder.create(this)
							.hasType("sap.m.Button")
							.doPress()
					)
					.description("Expanding filter group wiht name '" + sFiltersgroupName + "'")
					.execute();
			},

			iSelectCheckBoxInTheFilterBarDialog: function(sText) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.CustomListItem")
					.doOnChildren(
						OpaBuilder.create(this)
							.hasType("sap.m.CustomListItem")
							.hasChildren(
								OpaBuilder.create(this)
									.hasType("sap.m.Label")
									.hasProperties({ text: sText })
							)
							.doOnChildren(
								OpaBuilder.create(this)
									.hasType("sap.m.CheckBox")
									.doPress()
							)
					)
					.description("Selected Checkbox next to '" + sText + "'")
					.execute();
			},

			iChangeVisibilityFilter: function(sSelection) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Bar")
					.isDialogElement()
					.doOnChildren(
						OpaBuilder.create(this)
							.hasType("sap.m.Select")
							.checkNumberOfMatches(1)
							.doEnterText(sSelection)
					)
					.description("Changed displayed fields to '" + sSelection + "'")
					.execute();
			},

			iEnterUrlInTheTextArea: function(sUrl) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.TextArea")
					.hasId("sapUiRtaAddIFrameDialog_EditUrlTA")
					.isDialogElement()
					.doEnterText(sUrl)
					.description("Added URL '" + sUrl + "' to Text Area")
					.execute();
			},

			iSwitchToReorderOnDialog: function() {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.isDialogElement()
					.hasProperties({ text: "Reorder" })
					.doPress()
					.description("Switch to reorder view")
					.execute();
			},

			_iSelectALabelOnTheReorderDialog: function(sText) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Label")
					.isDialogElement()
					.hasProperties({ text: sText })
					.doPress()
					.execute();
			},

			/**
			 * Presses the according Button for the Reorder Process
			 *
			 * @param {string} [sLabel] label of column which should be reordered
			 * @param {number} [nNewPlace] which of the four reorder buttons should be pressed (0-3), effectively changes where the selected Label should move to
			 *
			 * @private
			 */

			iReorderTableColumn: function(sLabel, nNewPlace) {
				this._iSelectALabelOnTheReorderDialog(sLabel);
				var iconSpecific,
					Icon = "sap-icon://";

				if (nNewPlace === 0) {
					iconSpecific = "collapse-group";
				} else if (nNewPlace === 1) {
					iconSpecific = "slim-arrow-up";
				} else if (!nNewPlace === 2) {
					iconSpecific = "slim-arrow-down";
				} else if (!nNewPlace === 3) {
					iconSpecific = "expand-group";
				}
				Icon += iconSpecific;
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.isDialogElement()
					.hasProperties({ icon: Icon })
					.doPress()
					.description("Reorder '" + sLabel + "'")
					.execute();
			},

			iEnterTextInSearchfield: function(sNewText) {
				return OpaBuilder.create(this)
					.hasType("sap.m.SearchField")
					.checkNumberOfMatches(1)
					.doEnterText(sNewText)
					.description("Enter text: '" + sNewText + "'")
					.execute();
			},

			iEnterTextinFilterField: function(sText) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.mdc.field.FieldMultiInput")
					.checkNumberOfMatches(1)
					.doEnterText(sText)
					.description("Enter text: '" + sText + "'")
					.execute();
			},

			iSelectAFieldInTheDialog: function(sTooltipPart) {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.CustomListItem")
					.isDialogElement()
					.has(function(oListItem) {
						var sToolTip = oListItem.getTooltip(); // currently we check the tooltip
						return sToolTip.endsWith(sTooltipPart);
					})
					.doPress()
					.description("Select " + sTooltipPart)
					.execute();
			},

			iExecutePopOverOk: function() {
				return OpaBuilder.create(this)
					.viewId(null)
					.hasType("sap.m.Button")
					.hasProperties({ text: "OK" }) // .has(OpaBuilder.Matchers.resourceBundle("title", "sap.ui.rta", "BTN_FREP_OK")) does not work?
					.isDialogElement()
					.doPress()
					.description("OK Button")
					.execute();
			},

			iExecuteSaveAndExit: function() {
				return this.iExecuteById(/sapUiRta_exit$/, "Save&Exit");
			},

			iExecuteUndo: function() {
				return this.iExecuteById(/sapUiRta_undo$/, "Undo");
			},

			iEnterTextForRTAEditableField: function(sNewText) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(function(oOverlay) {
						if (oOverlay.$().hasClass("sapUiDtOverlaySelected")) {
							var $Overlay = oOverlay.$().find(".sapUiRtaEditableField");
							var oEditableFieldDomNode = $Overlay.children()[0];
							return oEditableFieldDomNode;
						}
						return null;
					})
					.do(function(oEditableFieldDomNode) {
						oEditableFieldDomNode.innerHTML = sNewText;
						QUnitUtils.triggerEvent("keypress", oEditableFieldDomNode, { which: 13, keyCode: 13 });
						oEditableFieldDomNode.blur();
					})
					.description("Enter text: " + sNewText)
					.execute();
			},

			iEnterTextForTitle: function(sNewText) {
				return this.iEnterTextForRTAEditableField(sNewText);
			},

			iEnterTextForViewField: function(sNewText) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Input")
					.isDialogElement()
					.doEnterText(sNewText, true)
					.description("Entering text: " + sNewText + " as variant name")
					.execute();
			}
		},

		assertions: {
			iSeeTheFLPToolbar: function() {
				return OpaBuilder.create(this)
					.hasType("sap.ushell.ui.ShellHeader")
					.hasId("shell-header")
					.description("Seeing the FLP toolbar")
					.execute();
			},

			iSeeTheRTAToolbar: function() {
				return OpaBuilder.create(this)
					.hasType("sap.ui.rta.toolbar.Fiori")
					.description("Seeing the RTA toolbar")
					.execute();
			},

			iSeeTheHeaderFacet: function(sFacetId) {
				return OpaBuilder.create(this)
					.hasType("sap.fe.templates.ObjectPage.controls.StashableHBox")
					.hasId(getHeaderFacetContainerId(sFacetId))
					.description("Seeing the Header Facet " + sFacetId)
					.execute();
			},

			iSeeTheFieldAddedViaRTA: function(sId) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.layout.form.FormElement")
					.hasId(getFormElementRTAId("_" + sId))
					.description("Seeing the Field " + sId)
					.execute();
			},

			iDoNotSeeTheHeaderFacet: function(sFacetId) {
				var vId = getHeaderFacetContainerId(sFacetId);

				return OpaBuilder.create(this)
					.hasType("sap.fe.templates.ObjectPage.controls.StashableHBox")
					.check(function(facets) {
						var bFound = facets.some(function(oFacet) {
							return typeof vId === "string" ? oFacet.getId() === vId : vId.test(oFacet.getId());
						});
						return bFound === false;
					}, true)
					.description("Not seeing the Header Facet " + sFacetId)
					.execute();
			},

			iDoNotSeeTheField: function(sId) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.layout.form.FormElement")
					.check(function(elements) {
						var bFound = elements.some(function(element) {
							return element.getId().indexOf(sId) > -1;
						});
						return bFound === false;
					}, true)
					.description("Not seeing the Field " + sId)
					.execute();
			},

			iSeeTheElementOverlayById: function(vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.ElementOverlay")
					.has(fnHasReferencedControlId)
					.description(sDescription)
					.execute();
			},

			iDoNotSeeTheElementOverlayById: function(vId, sDescription, bCheckParent) {
				var fnHasReferencedControlId = generateHasReferencedControlIdMatcher(vId, bCheckParent);

				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.ElementOverlay")
					.check(function(oOverlay) {
						var bFound = oOverlay.some(fnHasReferencedControlId);
						return bFound === false;
					}, true)
					.description(sDescription)
					.execute();
			},

			iSeeTheElementOverlayForTheApp: function() {
				return this.iSeeTheElementOverlayById(/component---appRootView--appContent$/, "Seeing the ElementOverlay for the App");
			},

			iSeeThePopover: function() {
				return OpaBuilder.create(this)
					.hasType("sap.m.Popover")
					.description("Seeing the Popover")
					.execute();
			},
			iDoNotSeeButtonByIcon: function(sIcon, sDescription) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Button")
					.isDialogElement()
					.check(function(aButtons) {
						var bFound = aButtons.some(function(oButton) {
							return oButton.getProperty("icon") === sIcon;
						});
						return bFound === false;
					}, true)
					.description("Not seeing " + sDescription)
					.execute();
			},

			iDoNotSeeTheVariantManagementPopover: function() {
				return this.iDoNotSeeButtonByIcon("sap-icon://duplicate", "The Popover");
			},

			iDoNotSeeTheRTAPopover: function() {
				return this.iDoNotSeeButtonByIcon("sap-icon://key-user-settings", "The RTAPopover");
			},

			iDoNotSeeTheRemoveButton: function() {
				return this.iDoNotSeeButtonByIcon("sap-icon://less", "the button 'remove'");
			},

			iSeeThePopoverDialog: function() {
				return OpaBuilder.create(this)
					.hasType("sap.m.Dialog")
					.description("Seeing the Popover Dialog")
					.execute();
			},

			iSeeThePopoverDialogWithId: function(sId) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Dialog")
					.hasId(sId)
					.description("Seeing the Popover Dialog with Id:", sId)
					.execute();
			},

			iSeeTheHeaderFacetOverlay: function(sFacetId) {
				return this.iSeeTheElementOverlayById(getHeaderFacetContainerId(sFacetId), "Seeing the Header Facet: " + sFacetId, true);
			},

			iDoNotSeeTheHeaderFacetOverlay: function(sFacetId) {
				return this.iDoNotSeeTheElementOverlayById(
					getHeaderFacetContainerId(sFacetId),
					"Not seeing the Header Facet: " + sFacetId,
					true
				);
			},

			iSeeTheTitleOnTheUI: function(sText) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Title")
					.hasProperties({ text: sText })
					.checkNumberOfMatches(1)
					.description("Seeing the Title " + sText)
					.execute();
			},

			iSeeTheLinkOnTheUI: function(sText) {
				return OpaBuilder.create(this)
					.hasType("sap.m.Link")
					.hasProperties({ text: sText })
					.checkNumberOfMatches(1)
					.description("Seeing the Link " + sText)
					.execute();
			},

			iCheckTheHeaderFacetTitle: function(sFacetId, sText) {
				return OpaBuilder.create(this)
					.hasType("sap.fe.templates.ObjectPage.controls.StashableHBox")
					.hasId(getHeaderFacetContainerId(sFacetId))
					.hasProperties({ title: sText })
					.description("The Header Facet  " + sFacetId + " has title " + sText)
					.execute();
			},

			iSeeTheSectionTextById: function(sId, sText) {
				var vId = getSectionId(sId);

				return OpaBuilder.create(this)
					.hasId(vId)
					.hasProperties({ text: sText })
					.description("Seeing the section " + sId + " with text " + sText)
					.execute();
			},

			iSeeTheSectionAtPosition: function(sId, iPosition) {
				var vId = getSectionId(sId);

				return OpaBuilder.create(this)
					.hasType("sap.m.Button") // (not for HeaderInfo which is of type sap.m.MenuButton)
					.hasId(vId)
					.has(function(oElement) {
						var aContent = oElement.getParent().getContent(), // anchBar content
							iFound = aContent.findIndex(function(oSection) {
								return vId.test(oSection.getId());
							});

						return iFound === iPosition;
					})
					.description("Seeing the section " + sId + " at position " + iPosition)
					.execute();
			},

			iSeeTheAddedIFrameInHeader: function(sUrlWithContentForIFrame) {
				return OpaBuilder.create(this)
					.hasType("sap.ui.dt.AggregationOverlay")
					.hasProperties({ aggregationName: "headerContent" })
					.doOnChildren(OpaBuilder.create(this).hasType("sap.ui.fl.util.IFrame"))
					.description("Seeing the application with URL: " + sUrlWithContentForIFrame + " in iFrame in header content container")
					.execute();
			},

			iSeeTheIFrameInSectionWithTitle: function(sSectionTitle) {
				return OpaBuilder.create(this)
					.hasType("sap.uxap.ObjectPageSection")
					.hasProperties({ title: sSectionTitle })

					.doOnChildren(OpaBuilder.create(this).hasType("sap.ui.fl.util.IFrame"))
					.description("Seeing iFrame in section with title '" + sSectionTitle + "'")
					.execute();
			}
		}
	};
});
