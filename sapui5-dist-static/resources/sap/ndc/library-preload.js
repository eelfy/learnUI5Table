//@ui5-bundle sap/ndc/library-preload.js
/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/ndc/BarcodeScanner',["sap/base/Log"],function(L){"use strict";var B=(function(){var D="sap.ndc.BarcodeScanDialog";document.addEventListener("settingsDone",i);document.addEventListener("SettingCompleted",i);document.addEventListener("mockSettingsDone",i);var a={},s,S=new sap.ui.model.json.JSONModel({available:false}),o=null,b={},r=true,R=new sap.ui.model.resource.ResourceModel({bundleName:"sap.ndc.messagebundle"});function g(){try{s=cordova.plugins.barcodeScanner;if(s){L.debug("Cordova BarcodeScanner plugin is available!");}else{S.setProperty("/available",false);L.error("BarcodeScanner: cordova.plugins.barcodeScanner is not available");}}catch(e){S.setProperty("/available",false);L.info("BarcodeScanner: cordova.plugins is not available");return;}}function i(){c();s=null;S.setProperty("/available",true);if(sap.Settings===undefined){L.debug("No sap.Settings. No feature vector available.");g();}else if(sap.Settings&&typeof sap.Settings.isFeatureEnabled==="function"){sap.Settings.isFeatureEnabled("cordova.plugins.barcodeScanner",function(e){if(e){g();}else{S.setProperty("/available",false);L.warning("BarcodeScanner: Feature disabled");}},function(){L.warning("BarcodeScanner: Feature check failed");});}else{L.warning("BarcodeScanner: Feature vector (sap.Settings.isFeatureEnabled) is not available");}}function c(){if(self!=top&&typeof cordova==="undefined"){window.cordova=top.cordova;}}function d(f,l,t){var e;b.onSuccess=f;b.onLiveUpdate=l;if(!o){e=new sap.ui.model.json.JSONModel();o=sap.ui.xmlfragment(D,{onOK:function(E){a.closeScanDialog();if(typeof b.onSuccess==="function"){b.onSuccess({text:e.getProperty("/barcode"),cancelled:false});}},onCancel:function(E){a.closeScanDialog();if(typeof b.onSuccess==="function"){b.onSuccess({text:e.getProperty("/barcode"),cancelled:true});}},onLiveChange:function(E){if(typeof b.onLiveUpdate==="function"){b.onLiveUpdate({newValue:E.getParameter("newValue")});}},onAfterOpen:function(E){E.getSource().getContent()[0].focus();}});o.setModel(e);o.setModel(R,"i18n");}if(typeof t==="string"&&t!=null&&t.trim()!=""){o.setTitle(t);}return o;}a.scan=function(f,F,l,e){var h;if(!r){L.error("Barcode scanning is already in progress.");return;}r=false;if(S.getProperty("/available")==true&&s==null){g();}if(s){s.scan(function(j){if(j.cancelled==="false"||!j.cancelled){j.cancelled=false;if(typeof f==="function"){f(j);}}else{h=d(f,l,e);h.getModel().setProperty("/barcode","");h.getModel().setProperty("/isNoScanner",false);h.open();}r=true;},function(E){L.error("Barcode scanning failed.");if(typeof F==="function"){F(E);}r=true;});}else{h=d(f,l,e);h.getModel().setProperty("/barcode","");h.getModel().setProperty("/isNoScanner",true);h.open();}};a.closeScanDialog=function(){if(o){o.close();r=true;}};a.getStatusModel=function(){return S;};i();return a;}());return B;},true);
sap.ui.predefine('sap/ndc/BarcodeScannerButton',["sap/ui/thirdparty/jquery",'./BarcodeScanner','./library','sap/ui/core/Control','./BarcodeScannerButtonRenderer'],function(q,B,l,C){"use strict";
var a=C.extend("sap.ndc.BarcodeScannerButton",{metadata:{library:"sap.ndc",properties:{provideFallback:{type:"boolean",defaultValue:true},visible:{type:"boolean",defaultValue:true},width:{type:"sap.ui.core.CSSSize",defaultValue:null},dialogTitle:{type:"string",defaultValue:null}},aggregations:{_btn:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{scanSuccess:{parameters:{text:{type:"string"},format:{type:"string"},cancelled:{type:"boolean"}}},scanFail:{},inputLiveUpdate:{parameters:{newValue:{type:"string"}}}}}});
a.prototype.init=function(){var b;this.setAggregation("_btn",new sap.m.Button({icon:"sap-icon://bar-code",press:q.proxy(this._onBtnPressed,this),width:"100%"}));b=B.getStatusModel();this.setModel(b,"status");};
a.prototype._onBtnPressed=function(e){B.scan(q.proxy(this._onScanSuccess,this),q.proxy(this._onScanFail,this),q.proxy(this._onInputLiveUpdate,this),this.getProperty("dialogTitle"));};
a.prototype._onScanSuccess=function(A){this.fireScanSuccess(A);};
a.prototype._onScanFail=function(A){this.fireScanFail(A);};
a.prototype._onInputLiveUpdate=function(A){this.fireInputLiveUpdate(A);};
a.prototype.setProvideFallback=function(f){var v=this.getProvideFallback();var b;f=!!f;if(v!==f){this.setProperty("provideFallback",f);b=this.getAggregation("_btn");if(f){b.unbindProperty("visible");b.setVisible(true);}else{b.bindProperty("visible","status>/available");}}return this;};
return a;});
sap.ui.predefine('sap/ndc/BarcodeScannerButtonRenderer',[],function(){"use strict";var B={};
B.render=function(r,c){if(!c.getVisible()){return;}r.write("<span");r.writeControlData(c);r.write(" style=\"display:inline-block;width:"+c.getWidth()+";\">");r.renderControl(c.getAggregation("_btn"));r.write("</span>");};
return B;},true);
sap.ui.predefine('sap/ndc/library',['sap/m/library','sap/ui/core/library'],function(l,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.ndc",dependencies:["sap.ui.core","sap.m"],types:[],interfaces:[],controls:["sap.ndc.BarcodeScannerButton"],elements:[],noLibraryCSS:true,version:"1.88.0"});return sap.ndc;});
sap.ui.require.preload({
	"sap/ndc/BarcodeScanDialog.fragment.xml":'<Dialog xmlns="sap.m" title="{i18n&gt;BARCODE_DIALOG_TITLE}" class="sapUiContentPadding"><content><Input id="inp_barcode" value="{/barcode}" valueLiveUpdate="true" placeholder="{i18n&gt;BARCODE_DIALOG_PLACEHOLDER}" liveChange="onLiveChange" ariaLabelledBy="txt_barcode"/><Text id="txt_barcode" text="{i18n&gt;BARCODE_DIALOG_MSG}" visible="{/isNoScanner}"/></content><beginButton><Button id="btn_barcode_ok" text="{i18n&gt;BARCODE_DIALOG_OK}" press="onOK"/></beginButton><endButton><Button text="{i18n&gt;BARCODE_DIALOG_CANCEL}" press="onCancel"/></endButton></Dialog>',
	"sap/ndc/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.ndc","type":"library","embeds":[],"applicationVersion":{"version":"1.88.0"},"title":"SAPUI5 library with controls with native device capabilities.","description":"SAPUI5 library with controls with native device capabilities.","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.88","libs":{"sap.ui.core":{"minVersion":"1.88.0"},"sap.m":{"minVersion":"1.88.0"}}},"library":{"i18n":{"bundleUrl":"messagebundle.properties","supportedLocales":["","ar","bg","ca","cs","cy","da","de","el","en","en-GB","en-US-sappsd","en-US-saprigi","en-US-saptrc","es","es-MX","et","fi","fr","fr-CA","hi","hr","hu","id","it","iw","ja","kk","ko","lt","lv","ms","nl","no","pl","pt","pt-PT","ro","ru","sh","sk","sl","sv","th","tr","uk","vi","zh-CN","zh-TW"]},"css":false,"content":{"controls":["sap.ndc.BarcodeScannerButton"],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/ndc/library-preload"
);
//# sourceMappingURL=library-preload.js.map