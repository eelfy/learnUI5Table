/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/BaseController","sap/fe/core/controllerextensions/InternalRouting","sap/fe/core/controllerextensions/Routing","sap/fe/core/controllerextensions/PageReady"],function(C,I,R,P){"use strict";return C.extend("sap.fe.core.PageController",{routing:R,_routing:I,pageReady:P,onInit:function(){var u=this.getAppComponent().getModel("ui"),i=this.getAppComponent().getModel("internal"),p="/pages/"+this.getView().getId();u.setProperty(p,{controls:{}});i.setProperty(p,{controls:{}});this.getView().bindElement({path:p,model:"ui"});this.getView().bindElement({path:p,model:"internal"});this.getView().bindElement({path:p,model:"pageInternal"});this.getView().setModel(i,"pageInternal");this.getView().setModel(u,"ui");this.getView().setModel(i,"internal");},_onTableRowPress:function(c,p){if(c&&c.isA("sap.ui.model.odata.v4.Context")&&typeof c.getProperty("@$ui5.node.isExpanded")==="boolean"){return;}else{this._routing.navigateForwardToContext(c,p);}}});});
