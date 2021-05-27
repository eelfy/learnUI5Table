// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/m/MessageToast','sap/ushell/renderers/fiori2/search/SearchShellHelper'],function(M,S){"use strict";return sap.ui.controller("sap.ushell.renderers.fiori2.search.container.App",{onInit:function(){this.oShellNavigation=sap.ushell.Container.getService("ShellNavigation");this.oShellNavigation.hashChanger.attachEvent("hashChanged",this.hashChanged);if(S.oSearchFieldGroup===undefined){S.init();}S.setSearchState('EXP_S');},hashChanged:function(e){var m=sap.ushell.renderers.fiori2.search.getModelSingleton();m.parseURL();},onExit:function(){this.oShellNavigation.hashChanger.detachEvent("hashChanged",this.hashChanged);if(sap.ui.getCore().byId('searchContainerResultsView')&&sap.ui.getCore().byId('searchContainerResultsView').oTablePersoController&&sap.ui.getCore().byId('searchContainerResultsView').oTablePersoController.getTablePersoDialog()){sap.ui.getCore().byId('searchContainerResultsView').oTablePersoController.getTablePersoDialog().destroy();}if(S.getDefaultOpen()!==true){S.setSearchStateSync('COL');}else{S.setSearchState('EXP');}if(this.oView.oPage.oFacetDialog){this.oView.oPage.oFacetDialog.destroy();}}});});
