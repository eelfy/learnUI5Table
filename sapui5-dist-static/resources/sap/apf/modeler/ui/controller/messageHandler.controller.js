/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.m.MessageBox");(function(){'use strict';var c;function _(m){var t=m.getMessage();while(m.getPrevious()){m=m.getPrevious();t=t+'\n'+m.getMessage();}return t;}function a(C,D){var c=C.getView().getViewData();var h=c.getGenericExit("closeFatalErrorDialog");if(h){h(c,C,D);}else{window.history.go(-1);}}function b(m){sap.m.MessageBox.error(m.getMessage(),{styleClass:sap.ui.Device.system.desktop?"sapUiSizeCompact":""});}function d(m){sap.m.MessageBox.information(m.getMessage(),{styleClass:sap.ui.Device.system.desktop?"sapUiSizeCompact":""});}function e(m){sap.m.MessageToast.show(m.getMessage(),{width:"20em"});}function f(C,m){var D=new sap.m.Dialog(C.createId("idShowDetailsDialog"),{contentWidth:jQuery(window).height()*0.6+"px",contentHeight:jQuery(window).height()*0.6+"px",title:c.getText("error"),type:sap.m.DialogType.Message,state:sap.ui.core.ValueState.Error,content:new sap.ui.core.HTML({content:['<div><p> '+jQuery.sap.encodeHTML(_(m))+'</p></div>'].join(""),sanitizeContent:true}),beginButton:new sap.m.Button({text:c.getText("close"),press:function(){D.close();}}),afterClose:function(){D.destroy();}}).addStyleClass("dialogContentPadding");D.setInitialFocus(D);D.open();}function g(C,m){var D=new sap.m.Dialog(C.createId("idFatalDialog"),{title:c.getText("error"),type:sap.m.DialogType.Message,state:sap.ui.core.ValueState.Error,content:[new sap.m.Text({text:c.getText("fatalErrorMessage")}),new sap.m.VBox({alignItems:sap.m.FlexAlignItems.End,items:[new sap.m.Link({text:c.getText("showDetailsLink"),press:function(){f(C,m);}})]})],beginButton:new sap.m.Button({text:c.getText("close"),press:function(){a(C,D);}}),afterClose:function(){D.destroy();}});D.setInitialFocus(D);D.open();}sap.ui.core.mvc.Controller.extend("sap.apf.modeler.ui.controller.messageHandler",{onInit:function(){c=this.getView().getViewData();},showMessage:function(m){var C=this;var s=m.getSeverity();var S=sap.apf.core.constants.message.severity;switch(s){case S.fatal:g(C,m);break;case S.error:b(m);break;case S.success:e(m);break;case S.information:d(m);break;default:jQuery.sap.log.error("Error type not defined");break;}}});})();
