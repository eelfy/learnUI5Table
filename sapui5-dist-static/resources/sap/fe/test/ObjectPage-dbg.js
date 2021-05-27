sap.ui.define(
	[
		"sap/base/util/merge",
		"./TemplatePage",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/Opa5",
		"sap/fe/test/Utils",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MacroFieldBuilder",
		"sap/fe/test/builder/OverflowToolbarBuilder",
		"sap/fe/test/api/FooterActionsOP",
		"sap/fe/test/api/FooterAssertionsOP",
		"sap/fe/test/api/HeaderActions",
		"sap/fe/test/api/HeaderAssertions",
		"sap/fe/test/api/FormActions",
		"sap/fe/test/api/FormAssertions"
	],
	function(
		mergeObjects,
		TemplatePage,
		OpaBuilder,
		Opa5,
		Utils,
		FEBuilder,
		FieldBuilder,
		OverflowToolbarBuilder,
		FooterActionsOP,
		FooterAssertionsOP,
		HeaderActions,
		HeaderAssertions,
		FormActions,
		FormAssertions
	) {
		"use strict";

		function getTableId(sNavProperty) {
			return "fe::table::" + sNavProperty.split("/").join("::") + "::LineItem";
		}

		function getChartId(sEntityType) {
			return "fe::Chart::" + sEntityType + "::Chart";
		}

		function _getOverflowToolbarBuilder(vOpaInstance, vFooterIdentifier) {
			return OverflowToolbarBuilder.create(vOpaInstance).hasId(vFooterIdentifier.id);
		}

		function _getHeaderBuilder(vOpaInstance, vHeaderIdentifier) {
			return FEBuilder.create(vOpaInstance).hasId(vHeaderIdentifier.id);
		}

		function _getFormBuilder(vOpaInstance, vFormIdentifier) {
			var oFormBuilder = FEBuilder.create(vOpaInstance);
			if (Utils.isOfType(vFormIdentifier, String)) {
				oFormBuilder.hasType("sap.uxap.ObjectPageSubSection");
				oFormBuilder.hasProperties({ title: vFormIdentifier });
			} else if (vFormIdentifier.fieldGroupId) {
				oFormBuilder.hasId(vFormIdentifier.fieldGroupId);
				if (vFormIdentifier.fullSubSectionId) {
					oFormBuilder.has(OpaBuilder.Matchers.ancestor(vFormIdentifier.fullSubSectionId, false));
				}
			} else {
				oFormBuilder.hasId(vFormIdentifier.id);
			}
			return oFormBuilder;
		}

		/**
		 * Constructs a new ObjectPage instance.
		 *
		 * @class Provides a test page definition for an object page with the corresponding parameters.
		 *
		 * Sample usage:
		 * <code><pre>
		 * var oObjectPageDefinition = new ObjectPage({ appId: "MyApp", componentId: "MyObjectPageId", entitySet: "MyEntitySet" });
		 * </pre></code>
		 *
		 * @param {object} oPageDefinition The required parameters
		 * @param {string} oPageDefinition.appId The app id (defined in the manifest root)
		 * @param {string} oPageDefinition.componentId The component id (defined in the target section for the list report within the manifest)
		 * @param {string} oPageDefinition.entitySet The entitySet (defined in the settings of the corresponding target component within the manifest)
		 * @param {...object} [aAdditionalPageDefinitions] Additional custom page functions, provided in an object containing <code>actions</code> and <code>assertions</code>
		 * @returns {sap.fe.test.ObjectPage} An object page page definition
		 * @name sap.fe.test.ObjectPage
		 * @extends sap.fe.test.TemplatePage
		 * @public
		 */
		function ObjectPage(oPageDefinition, aAdditionalPageDefinitions) {
			var sAppId = oPageDefinition.appId,
				sComponentId = oPageDefinition.componentId,
				ViewId = sAppId + "::" + sComponentId,
				ObjectPageLayoutId = ViewId + "--fe::ObjectPage",
				OPHeaderId = "fe::HeaderFacet",
				OPHeaderContentId = "fe::ObjectPage-OPHeaderContent",
				OPFooterId = "fe::FooterBar",
				OPSectionIdPrefix = "fe::FacetSubSection",
				OPFormIdPrefix = "fe::Form",
				OPFormContainerIdPrefix = "fe::FormContainer",
				OPFormContainerHeaderFacetsIdPrefix = "fe::HeaderFacet::FormContainer",
				BreadCrumbId = ViewId + "--fe::Breadcrumbs",
				AnchorBarId = "fe::ObjectPage-anchBar",
				PaginatorId = "fe::Paginator",
				Page_EditMode = {
					DISPLAY: "Display",
					EDITABLE: "Editable"
				},
				oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
				aAdditionalPages = Array.prototype.slice.call(arguments, 1);

			return TemplatePage.apply(
				TemplatePage,
				[
					ViewId,
					{
						/**
						 * ObjectPage actions
						 *
						 * @namespace sap.fe.test.ObjectPage.actions
						 * @extends sap.fe.test.TemplatePage.actions
						 * @public
						 */
						actions: {
							/**
							 * Returns a {@link sap.fe.test.api.TableActions} instance for the specified table.
							 *
							 * @param {string | sap.fe.test.api.TableIdentifier} vTableIdentifier The identifier of the table, or its header title
							 * @returns {sap.fe.test.api.TableActions} The available table actions
							 * @function
							 * @name sap.fe.test.ObjectPage.actions#onTable
							 * @public
							 */
							onTable: function(vTableIdentifier) {
								if (!Utils.isOfType(vTableIdentifier, String)) {
									vTableIdentifier = { id: getTableId(vTableIdentifier.property) };
								}
								return this._onTable(vTableIdentifier);
							},
							onChart: function(vChartIdentifier) {
								var sChartId;
								if (vChartIdentifier) {
									sChartId = !Utils.isOfType(vChartIdentifier, String)
										? getChartId(vChartIdentifier.property)
										: vChartIdentifier;
								}
								return this._onChart({
									id: sChartId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FooterActionsOP} instance.
							 *
							 * @returns {sap.fe.test.api.FooterActionsOP} The available footer actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onFooter
							 * @public
							 */
							onFooter: function() {
								return new FooterActionsOP(_getOverflowToolbarBuilder(this, { id: OPFooterId }), {
									id: OPFooterId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.HeaderActions} instance.
							 *
							 * @returns {sap.fe.test.api.HeaderActions} The available header actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onHeader
							 * @public
							 */
							onHeader: function() {
								return new HeaderActions(_getHeaderBuilder(this, { id: ObjectPageLayoutId }), {
									id: ObjectPageLayoutId,
									headerId: OPHeaderId,
									headerContentId: OPHeaderContentId,
									viewId: ViewId,
									paginatorId: PaginatorId,
									breadCrumbId: BreadCrumbId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FormActions} instance.
							 *
							 * @param {sap.fe.test.api.FormIdentifier | string} vFormIdentifier The identifier of the form, or its title
							 * @returns {sap.fe.test.api.FormActions} The available form actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.actions#onForm
							 * @public
							 */
							onForm: function(vFormIdentifier) {
								if (!Utils.isOfType(vFormIdentifier, String)) {
									if (vFormIdentifier.section) {
										vFormIdentifier.id = OPSectionIdPrefix + "::" + vFormIdentifier.section;
										vFormIdentifier.fullSubSectionId = ViewId + "--" + vFormIdentifier.id;
									}
									if (vFormIdentifier.fieldGroup) {
										if (vFormIdentifier.isHeaderFacet) {
											vFormIdentifier.fieldGroupId =
												OPFormContainerHeaderFacetsIdPrefix + "::" + vFormIdentifier.fieldGroup;
										} else {
											vFormIdentifier.fieldGroupId = OPFormContainerIdPrefix + "::" + vFormIdentifier.fieldGroup;
										}
									}
								}
								return new FormActions(_getFormBuilder(this, vFormIdentifier), vFormIdentifier);
							},
							/**
							 * Collapses or expands the page header.
							 *
							 * @param {boolean} [bCollapse] Defines whether header should be collapsed, else it gets expanded (default)
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 *
							 * @function
							 * @name sap.fe.test.ObjectPage.actions#iCollapseExpandPageHeader
							 * @public
							 */
							iCollapseExpandPageHeader: function(bCollapse) {
								return this._iCollapseExpandPageHeader(bCollapse);
							},
							iClickQuickViewMoreLinksButton: function() {
								return OpaBuilder.create(this)
									.hasType("sap.m.Button")
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
									.doPress()
									.description("Pressing 'More Links' button")
									.execute();
							},
							iClickLinkWithText: function(sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.hasProperties({ text: sText })
									.doPress()
									.description("Navigating via link '" + sText + "'")
									.execute();
							},
							iEnableLink: function(sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.ColumnListItem")
									.hasAggregationProperties("cells", { text: sText })
									.isDialogElement()
									.doPress("selectMulti")
									.description("The CheckBox for link " + sText + " is selected")
									.execute();
							},
							iPressKeyboardShortcutOnSection: function(sShortcut, mProperties) {
								return this._iPressKeyboardShortcut(undefined, sShortcut, mProperties, "sap.uxap.ObjectPageSection");
							},
							/**
							 * Navigates to or focuses on the defined section.
							 *
							 * @param {string} vSectionIdentifier The label of the section
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 *
							 * @function
							 * @name sap.fe.test.ObjectPage.actions#iGoToSection
							 * @public
							 */
							iGoToSection: function(vSectionIdentifier) {
								// TODO this function should support facetId as well as also work for subsections
								return this.iOpenSectionWithTitle(vSectionIdentifier);
							},
							/**
							 * TODO This function is only here for legacy reasons and therefore private. Use iGoToSection instead.
							 *
							 * @param {string} sName The name of the section
							 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
							 *
							 * @private
							 */
							iOpenSectionWithTitle: function(sName) {
								return OpaBuilder.create(this)
									.hasId(AnchorBarId)
									.has(
										OpaBuilder.Matchers.children(
											FEBuilder.Matchers.states({
												controlType: "sap.m.Button",
												text: sName
											})
										)
									)
									.doPress()
									.description("Selecting section " + sName)
									.execute();
							},
							iOpenVHDInDialog: function(sFieldId) {
								return OpaBuilder.create(this)
									.isDialogElement()
									.hasId(sFieldId + "-inner-vhi")
									.doPress()
									.description("Opening value help for '" + sFieldId + "' from within a dialog")
									.execute();
							},
							iConfirmVHDInDialog: function(sField) {
								return OpaBuilder.create(this)
									.isDialogElement()
									.hasId(sField + "-ok")
									.doPress()
									.description("Comfirmed VHD opened in dialog")
									.execute();
							},
							iEnterValueForFieldInCreateDialog: function(sFieldId, sValue) {
								return OpaBuilder.create(this)
									.isDialogElement()
									.hasId(sFieldId)
									.doEnterText(sValue)
									.description(
										"Entering Text in the field '" + sFieldId + "'in the create dialog with value '" + sValue + "'"
									)
									.execute();
							},
							iClickOnMessageButton: function() {
								return OpaBuilder.create(this)

									.hasType("sap.fe.templates.controls.messages.MessageButton")
									.doPress()
									.description("Clicked on Message Button")
									.execute();
							},
							iClickOnMessage: function(oMessageInfo) {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageListItem")
									.hasProperties({
										title: oMessageInfo.MessageText,
										groupAnnouncement: oMessageInfo.GroupLabel
									})
									.isDialogElement(true)
									.description("MessageItem with correct text and group label")
									.doOnChildren(
										OpaBuilder.create(this)
											.hasType("sap.m.Link")
											.hasProperties({ text: oMessageInfo.MessageText })
											.doPress()
											.description("Click on the message")
									)
									.execute();
							}
						},
						/**
						 * ObjectPage assertions
						 *
						 * @namespace sap.fe.test.ObjectPage.assertions
						 * @extends sap.fe.test.TemplatePage.assertions
						 * @public
						 */
						assertions: {
							/**
							 * Returns a {@link sap.fe.test.api.TableAssertions} instance for the specified table.
							 *
							 * @param {string | sap.fe.test.api.TableIdentifier} vTableIdentifier The identifier of the table, or its header title
							 * @returns {sap.fe.test.api.TableAssertions} The available table assertions
							 * @function
							 * @name sap.fe.test.ObjectPage.assertions#onTable
							 * @public
							 */
							onTable: function(vTableIdentifier) {
								if (!Utils.isOfType(vTableIdentifier, String)) {
									vTableIdentifier = { id: getTableId(vTableIdentifier.property) };
								}
								return this._onTable(vTableIdentifier);
							},
							onChart: function(vChartIdentifier) {
								var sChartId;
								if (vChartIdentifier) {
									sChartId = !Utils.isOfType(vChartIdentifier, String)
										? getChartId(vChartIdentifier.property)
										: vChartIdentifier;
								}
								return this._onChart({
									id: sChartId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FooterAssertionsOP} instance.
							 *
							 * @returns {sap.fe.test.api.FooterAssertionsOP} The available footer assertions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onFooter
							 * @public
							 */
							onFooter: function() {
								return new FooterAssertionsOP(_getOverflowToolbarBuilder(this, { id: OPFooterId }), { id: OPFooterId });
							},
							/**
							 * Returns a {@link sap.fe.test.api.HeaderAssertions} instance.
							 *
							 * @returns {sap.fe.test.api.HeaderAssertions} The available header assertions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onHeader
							 * @public
							 */
							onHeader: function() {
								return new HeaderAssertions(_getHeaderBuilder(this, { id: ObjectPageLayoutId }), {
									id: ObjectPageLayoutId,
									headerId: OPHeaderId,
									headerContentId: OPHeaderContentId,
									viewId: ViewId,
									paginatorId: PaginatorId,
									breadCrumbId: BreadCrumbId
								});
							},
							/**
							 * Returns a {@link sap.fe.test.api.FormAssertions} instance.
							 *
							 * @param {sap.fe.test.api.FormIdentifier | string} vFormIdentifier The identifier of the form, or its title
							 * @returns {sap.fe.test.api.FormAssertions} The available form actions
							 * @function
							 * @alias sap.fe.test.ObjectPage.assertions#onForm
							 * @public
							 */
							onForm: function(vFormIdentifier) {
								if (!Utils.isOfType(vFormIdentifier, String)) {
									if (vFormIdentifier.section) {
										vFormIdentifier.id = OPSectionIdPrefix + "::" + vFormIdentifier.section;
										vFormIdentifier.fullSubSectionId = ViewId + "--" + vFormIdentifier.id;
									}
									if (vFormIdentifier.fieldGroup) {
										vFormIdentifier.fieldGroupId = OPFormContainerIdPrefix + "::" + vFormIdentifier.fieldGroup;
									}
								}
								return new FormAssertions(_getFormBuilder(this, vFormIdentifier), vFormIdentifier);
							},

							iSeeLinkWithText: function(sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.hasProperties({ text: sText })
									.description("Seeing link with text '" + sText + "'")
									.execute();
							},
							iSeeTextWithText: function(sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Text")
									.hasProperties({ text: sText })
									.description("Seeing Text with text '" + sText + "'")
									.execute();
							},
							iSeeTitleWithText: function(sText) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasProperties({ text: sText })
									.description("Seeing Title with text '" + sText + "'")
									.execute();
							},
							iSeeContactDetailsPopover: function(sTitle) {
								return (
									OpaBuilder.create(this)
										.hasType("sap.ui.mdc.link.Panel")
										// .hasAggregation("items", [
										// 	function(oItem) {
										// 		return oItem instanceof sap.m.Label;
										// 	},
										// 	{
										// 		properties: {
										// 			text: sTitle
										// 		}
										// 	}
										// ])
										.description("Contact card with title '" + sTitle + "' is present")
										.execute()
								);
							},
							iSeeQuickViewPopover: function() {
								return OpaBuilder.create(this)
									.hasType("sap.ui.mdc.link.Panel")
									.description("Seeing Quick View Details in ObjectPage")
									.execute();
							},
							iSeeContactPopoverWithAvatarImage: function(sImageSource) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.mdc.link.Panel")
									.check(function(avatars) {
										var bFound = avatars.some(function(avatar) {
											return avatar.src === sImageSource;
										});
										return bFound === false;
									}, true)
									.description("Seeing Contact Card with Avatar Image in ObjectPage")
									.execute();
							},
							iSeeQuickViewMoreLinksButton: function() {
								return OpaBuilder.create(this)
									.isDialogElement(true)
									.hasType("sap.m.Button")
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.POPOVER_DEFINE_LINKS"))
									.description("The 'More Links' button found")
									.execute();
							},
							iSeeObjectPageInDisplayMode: function() {
								return this._iSeeObjectPageInMode(Page_EditMode.DISPLAY);
							},
							iSeeObjectPageInEditMode: function() {
								return this._iSeeObjectPageInMode(Page_EditMode.EDITABLE);
							},
							_iSeeObjectPageInMode: function(sMode) {
								return OpaBuilder.create(this)
									.hasId(ViewId)
									.viewId(null)
									.has(function(oObjectPage) {
										return oObjectPage.getModel("ui").getProperty("/editMode") === sMode;
									})
									.description("Object Page is in mode '" + sMode + "'")
									.execute();
							},
							iSeeSectionWithTitle: function(sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.uxap.ObjectPageSection")
									.hasProperties({ title: sTitle })
									.description("Seeing section with title '" + sTitle + "'")
									.execute();
							},
							iSeeSubSectionWithTitle: function(sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.uxap.ObjectPageSubSection")
									.hasProperties({ title: sTitle })
									.description("Seeing sub-section with title '" + sTitle + "'")
									.execute();
							},
							iSeeSectionButtonWithTitle: function(sTitle, mState) {
								return FEBuilder.create(this)
									.hasId(AnchorBarId)
									.has(
										OpaBuilder.Matchers.children(
											FEBuilder.Matchers.states(
												mergeObjects({}, { controlType: "sap.m.Button", text: sTitle }, mState)
											)
										)
									)
									.description(
										Utils.formatMessage("Seeing section button with title '{0}' and state='{1}'", sTitle, mState)
									)
									.execute();
							},
							iSeeFlpLink: function(sDescription) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.mdc.link.PanelListItem")
									.isDialogElement(true)
									.hasProperties({ text: sDescription })
									.description("FLP link with text '" + sDescription + "' is present")
									.execute();
							},
							iSeeSelectLinksDialog: function() {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.isDialogElement(true)
									.has(OpaBuilder.Matchers.resourceBundle("text", "sap.ui.mdc", "info.SELECTION_DIALOG_ALIGNEDTITLE"))
									.description("Seeing dialog open")
									.execute();
							},
							iDoNotSeeFlpLink: function(sDescription) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.isDialogElement(true)
									.check(function(links) {
										var bFound = links.some(function(link) {
											return link.getText() === sDescription;
										});
										return bFound === false;
									}, true)
									.description("FLP link with text '" + sDescription + "' is not found")
									.execute();
							},
							iSeeTitleLink: function(sDescription, sIntent) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Link")
									.isDialogElement(true)
									.hasProperties({ text: sDescription, href: sIntent })
									.description("QuickView Title link with text '" + sDescription + "' is found")
									.execute();
							},
							iSeeCreateConfirmation: function() {
								return this._iSeeTheMessageToast(oResourceBundleCore.getText("C_TRANSACTION_HELPER_OBJECT_CREATED"));
							},
							iSeeSaveConfirmation: function() {
								return this._iSeeTheMessageToast(oResourceBundleCore.getText("C_TRANSACTION_HELPER_OBJECT_SAVED"));
							},
							iSeeDeleteConfirmation: function() {
								return this._iSeeTheMessageToast(
									oResourceBundleCore.getText("C_TRANSACTION_HELPER_OBJECT_PAGE_DELETE_TOAST_SINGULAR")
								);
							},
							iSeeConfirmMessageBoxWithTitle: function(sTitle) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Dialog")
									.isDialogElement(true)
									.hasProperties({ title: sTitle })
									.description("Seeing Message dialog open")
									.execute();
							},
							iSeeMoreFormContent: function(sSectionId) {
								return OpaBuilder.create(this)
									.hasId(OPFormIdPrefix + "::" + sSectionId + "::MoreContent")
									.description("Seeing More Form Content in " + sSectionId)
									.execute();
							},
							iDoNotSeeMoreFormContent: function(sSectionId) {
								return OpaBuilder.create(this)
									.hasType("sap.ui.layout.form.Form")
									.check(function(aElements) {
										var bFound = aElements.some(function(oElement) {
											return oElement.getId().includes(sSectionId + "::MoreContent");
										});
										return bFound === false;
									})
									.description("Not Seeing More Form Content in " + sSectionId)
									.execute();
							},
							iSeeControlVMTableTitle: function(sTitle, sNavProperty) {
								return OpaBuilder.create(this)
									.hasType("sap.m.Title")
									.hasId(getTableId(sNavProperty) + "::VM-text")
									.hasProperties({ text: sTitle })
									.description("Seeing variant title '" + sTitle + "'")
									.execute();
							},
							iCheckValueOfFieldInCreateDialog: function(sFieldId, sValue, sAdditionalValue, bIsRequired) {
								return FieldBuilder.create(this)
									.isDialogElement()
									.hasId(sFieldId)
									.hasValue(sValue, sAdditionalValue)
									.hasProperties({ required: !!bIsRequired })
									.description(
										Utils.formatMessage(
											"Seeing field '{0}' with value '{1}'",
											sFieldId,
											[].concat(sValue, sAdditionalValue || [])
										)
									)
									.execute();
							},
							iSeeMessageView: function() {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.isDialogElement(true)
									.description("MessageView is visible")
									.execute();
							},
							iCheckMessageItemsOrder: function(aBoundMessagesInfo) {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.check(function(oMessageView) {
										var messages = oMessageView[0].getItems();
										return (
											messages[0].getGroupName() === aBoundMessagesInfo[0].GroupLabel &&
											messages[1].getGroupName() === aBoundMessagesInfo[1].GroupLabel &&
											messages[0].getTitle() === aBoundMessagesInfo[0].MessageText &&
											messages[1].getTitle() === aBoundMessagesInfo[1].MessageText
										);
									}, true)
									.isDialogElement(true)
									.description("MessageItems are correctly ordered")
									.execute();
							},
							iClickBackOnMessageView: function() {
								return OpaBuilder.create(this)
									.hasType("sap.m.MessageView")
									.isDialogElement(true)
									.doOnChildren(
										OpaBuilder.create(this)
											.hasType("sap.m.Button")
											.hasProperties({ icon: "sap-icon://nav-back" })
											.doPress()
											.description("Click on the message view back")
									)
									.execute();
							}
						}
					}
				].concat(aAdditionalPages)
			);
		}

		return ObjectPage;
	}
);
