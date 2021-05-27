sap.ui.define(["sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder"], function(Utils, OpaBuilder, FEBuilder) {
	"use strict";

	var APIHelper = {
		createSaveAsTileBuilder: function() {
			return new FEBuilder().isDialogElement().hasType("sap.ushell.ui.footerbar.AddBookmarkButton");
		},

		createSaveAsTileCheckBuilder: function(mState) {
			return APIHelper.createSaveAsTileBuilder()
				.hasState(mState)
				.description(Utils.formatMessage("Checking 'Save as Tile' action in state '{0}'", mState));
		},

		createSaveAsTileExecutorBuilder: function(sBookmarkTitle) {
			return APIHelper.createSaveAsTileBuilder()
				.doPress()
				.description("Executing 'Save as Tile' action")
				.success(
					FEBuilder.create()
						.isDialogElement()
						.hasType("sap.m.Input")
						.hasProperties({ id: "bookmarkTitleInput" })
						.doEnterText(sBookmarkTitle)
						.description(Utils.formatMessage("Enter '{0}' as Bookmark title", sBookmarkTitle))
						.success(
							FEBuilder.create()
								.isDialogElement()
								.hasType("sap.m.Button")
								.hasProperties({ id: "bookmarkOkBtn" })
								.doPress()
								.description("Confirm 'Save as Tile' dialog")
						)
				);
		},

		createSendEmailBuilder: function() {
			return new FEBuilder()
				.isDialogElement()
				.hasType("sap.m.Button")
				.hasProperties({ icon: "sap-icon://email" })
				.has(OpaBuilder.Matchers.resourceBundle("text", "sap.m", "SEMANTIC_CONTROL_SEND_EMAIL"));
		},

		createSendEmailCheckBuilder: function(mState) {
			return APIHelper.createSendEmailBuilder()
				.hasState(mState)
				.description(Utils.formatMessage("Checking 'Send Email' action in state '{0}'", mState));
		},

		createSendEmailExecutorBuilder: function() {
			return APIHelper.createSendEmailBuilder()
				.doPress()
				.description("Executing 'Send Email' action");
		},

		createMenuActionMatcher: function(vAction, bReturnAction) {
			var vActionMatcher;
			if (Utils.isOfType(vAction, String)) {
				vAction = { text: vAction };
			}
			if (Utils.isOfType(vAction, Object)) {
				if (vAction.visible === false) {
					var mStatesWOVisible = Object.assign(vAction);
					delete mStatesWOVisible.visible;
					vActionMatcher = OpaBuilder.Matchers.some(
						// either button is visible=false ...
						OpaBuilder.Matchers.aggregationMatcher("items", FEBuilder.Matchers.states(vAction)),
						// ... or it wasn't rendered at all (no match in the aggregation)
						OpaBuilder.Matchers.not(
							OpaBuilder.Matchers.aggregationMatcher("items", FEBuilder.Matchers.states(mStatesWOVisible))
						)
					);
				} else {
					vActionMatcher = bReturnAction
						? [OpaBuilder.Matchers.aggregation("items", FEBuilder.Matchers.states(vAction)), FEBuilder.Matchers.atIndex(0)]
						: OpaBuilder.Matchers.aggregationMatcher("items", FEBuilder.Matchers.states(vAction));
				}
			} else {
				throw new Error("vAction parameter must be a string or object");
			}
			return vActionMatcher;
		},

		createMenuActionExecutorBuilder: function(vAction) {
			if (!vAction) {
				throw new Error("vAction parameter missing");
			}

			return FEBuilder.create()
				.hasType("sap.ui.unified.Menu")
				.isDialogElement(true)
				.has(APIHelper.createMenuActionMatcher(vAction, true))
				.doPress()
				.description(Utils.formatMessage("Executing action '{0}' from currently open action menu", vAction));
		},

		createMenuActionCheckBuilder: function(vAction) {
			if (!vAction) {
				throw new Error("vAction parameter missing");
			}

			return FEBuilder.create()
				.hasType("sap.ui.unified.Menu")
				.isDialogElement(true)
				.has(APIHelper.createMenuActionMatcher(vAction))
				.description(Utils.formatMessage("Checking currently open action menu having action '{0}'", vAction));
		}
	};

	return APIHelper;
});
