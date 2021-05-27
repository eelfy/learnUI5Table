sap.ui.define(["sap/ui/test/OpaBuilder", "sap/ui/test/Opa5", "sap/fe/test/Utils"], function(OpaBuilder, Opa5, Utils) {
	"use strict";

	/**
	 * Constructs a test page definition for the shell.
	 *
	 * @class Provides a test page definition for the shell.
	 *
	 * When using {@link sap.fe.test.JourneyRunner}, this page is made available by default via <code>onTheShell</code>.
	 *
	 * @param {...object} [aAdditionalPageDefinitions] Additional custom page functions, provided in an object containing <code>actions</code> and <code>assertions</code>
	 * @returns {sap.fe.test.Shell} A shell page definition
	 * @name sap.fe.test.Shell
	 * @public
	 */
	function ShellPage(aAdditionalPageDefinitions) {
		aAdditionalPageDefinitions = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments, 0);
		return Utils.mergeObjects.apply(
			Utils,
			[
				{
					actions: {
						/**
						 * Navigates back via shell back button.
						 *
						 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
						 *
						 * @function
						 * @name sap.fe.test.Shell#iNavigateBack
						 * @public
						 */
						iNavigateBack: function() {
							return OpaBuilder.create(this)
								.hasId("backBtn")
								.doPress()
								.description("Navigating back via shell")
								.execute();
						},
						/**
						 * Navigates to the launch pad via home button.
						 *
						 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
						 *
						 * @function
						 * @name sap.fe.test.Shell#iNavigateHome
						 * @public
						 */
						iNavigateHome: function() {
							return OpaBuilder.create(this)
								.hasId("shell-header")
								.do(function() {
									// the logo is not a UI5 control
									var oTestWindow = Opa5.getWindow();
									oTestWindow.document.getElementById("shell-header-logo").click();
								})
								.description("Pressing Home button in Shell header")
								.execute();
						},
						/**
						 * Opens the navigation menu in the shell header.
						 *
						 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
						 *
						 * @function
						 * @name sap.fe.test.Shell#iOpenNavigationMenu
						 * @public
						 */
						iOpenNavigationMenu: function() {
							return OpaBuilder.create(this)
								.hasId("shellAppTitle")
								.doPress()
								.description("Expanding Shell Navigation Menu")
								.execute();
						},
						/**
						 * Navigates via a navigation item in the shell's navigation menu.
						 *
						 * @param {string} sItem The label of the navigation item
						 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
						 *
						 * @function
						 * @name sap.fe.test.Shell#iNavigateViaMenu
						 * @public
						 */
						iNavigateViaMenu: function(sItem) {
							return OpaBuilder.create(this)
								.hasId("sapUshellNavHierarchyItems")
								.doOnAggregation("items", OpaBuilder.Matchers.properties({ title: sItem }), OpaBuilder.Actions.press())
								.description(Utils.formatMessage("Navigating to '{0}' via Shell Navigation Menu", sItem))
								.execute();
						},
						/**
						 * Selecting a tile in the launchpad by its target app, for example <code>iPressTile("SalesOrder-manage")</code>.
						 *
						 * @param {string} sTarget The target application (hash)
						 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
						 *
						 * @function
						 * @name sap.fe.test.Shell#iPressTile
						 * @public
						 */
						iPressTile: function(sTarget) {
							return OpaBuilder.create(this)
								.hasType("sap.ushell.ui.launchpad.Tile")
								.hasProperties({
									target: "#" + sTarget
								})
								.doPress()
								.description(Utils.formatMessage("Clicking on tile with target '{0}'", sTarget))
								.execute();
						},
						iOpenDefaultValues: function() {
							return OpaBuilder.create(this)
								.hasId("meAreaHeaderButton")
								.hasProperties({
									icon: "sap-icon://person-placeholder"
								})
								.doPress()
								.description("Opening FLP Default Values dialog")
								.execute();
						},
						iEnterAValueForUserDefaults: function(oField, vValue) {
							return OpaBuilder.create(this)
								.hasProperties({
									name: oField.field
								})
								.isDialogElement()
								.doEnterText(vValue)
								.description("Entering text in the field '" + oField.field + "' with value '" + oField + "'")
								.execute();
						},
						iSelectAListItem: function(sOption) {
							return OpaBuilder.create(this)
								.hasType("sap.m.StandardListItem")
								.hasProperties({ title: sOption })
								.doPress()
								.description("Selecting item: " + sOption)
								.execute();
						},
						iLaunchExtendedParameterDialog: function(sProperty) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.isDialogElement()
								.hasProperties({
									text: "Additional Values"
								})
								.doPress()
								.description("Launching Extended Parameter Dialog")
								.execute();
						},
						iClickOnButtonWithText: function(sText) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.hasProperties({
									text: sText
								})
								.doPress()
								.description("Clicking on button with text: " + sText)
								.execute();
						},
						iClickOnButtonWithIcon: function(sIcon) {
							return OpaBuilder.create(this)
								.hasType("sap.m.Button")
								.hasProperties({
									icon: "sap-icon://" + sIcon
								})
								.doPress()
								.description("Clicking on button with icon: " + sIcon)
								.execute();
						}
					},
					assertions: {
						iSeeFlpDashboard: function() {
							return OpaBuilder.create(this)
								.hasId("sapUshellDashboardPage")
								.description("Seeing FLP Dashboard")
								.execute();
						},
						iShouldSeeTheAppTile: function(sTitle) {
							return OpaBuilder.create(this)
								.hasType("sap.ushell.ui.launchpad.Tile")
								.hasProperties({
									target: sTitle
								})
								.description("Seeing Tile " + sTitle)
								.execute();
						},
						iSeeShellNavHierarchyItem: function(sItemTitle, iItemPosition, iItemNumbers, sItemDesc) {
							return OpaBuilder.create(this)
								.viewId(null)
								.hasId("sapUshellNavHierarchyItems")
								.hasAggregationLength("items", iItemNumbers)
								.has(OpaBuilder.Matchers.aggregationAtIndex("items", iItemPosition - 1))
								.hasProperties({ title: sItemTitle, description: sItemDesc })
								.description(
									Utils.formatMessage(
										"Checking Navigation Hierarchy Items ({2}): Name={0}, Position={1}, Description={3}",
										sItemTitle,
										iItemPosition,
										iItemNumbers,
										sItemDesc
									)
								)
								.execute();
						},
						iSeeShellAppTitle: function(sTitle) {
							return OpaBuilder.create(this)
								.viewId(null)
								.hasId("shellAppTitle")
								.hasProperties({ text: sTitle })
								.description(sTitle + " is the Shell App Title")
								.execute();
						}
					}
				}
			].concat(aAdditionalPageDefinitions)
		);
	}

	return ShellPage;
});
