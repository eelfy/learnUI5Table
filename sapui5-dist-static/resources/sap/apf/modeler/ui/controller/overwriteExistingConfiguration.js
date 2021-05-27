/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");sap.ui.define(["sap/ui/core/mvc/Controller"],function(C){"use strict";var n=sap.apf.modeler.ui.utils.nullObjectChecker;return C.extend("sap.apf.modeler.ui.controller.overwriteExistingConfiguration",{setOverwriteConfirmationDialogText:function(t){sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfirmationDialog").setTitle(t("configAlreadyExists"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idConfirmationMessage").setText(t("overwriteDialogMsg"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfig").setText(t("overwriteConfig"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idDoNotOverwriteConfig").setText(t("doNotOverwriteConfig"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleLabel").setText(t("newConfigTitle"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOkButton").setText(t("ok"));sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idCancelButton").setText(t("cancel"));},handleOkButtonPress:function(){var s,N,o,c,a;o=sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfirmationDialog");c=o.getCustomData()[0].getValue().callbackOverwrite;a=o.getCustomData()[0].getValue().callbackCreateNew;s=sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfigRadioGroup").getSelectedButton();N=sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput");if(s===sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfig")){c();}else{if(n.checkIsNotNullOrUndefinedOrBlank(N.getValue().trim())){N.setValueState(sap.ui.core.ValueState.None);a(N.getValue());}else{N.setValueState(sap.ui.core.ValueState.Error);}}},handleCancelOfOverwriteDialog:function(){sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfirmationDialog").destroy();},handleChangeForOverwriteConfigOptions:function(){var s;s=sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idOverwriteConfigRadioGroup").getSelectedButton();if(s===sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idDoNotOverwriteConfig")){sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleLayout").setVisible(true);sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput").setEnabled(true);}else{if(n.checkIsNotNullOrUndefinedOrBlank(sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput").getValue().trim())){sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput").setEnabled(false);sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput").setValueState(sap.ui.core.ValueState.None);}else{sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleLayout").setVisible(false);}}}});});
