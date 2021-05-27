/*!
 * SAPUI5

(c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";var B=(function(){var D="sap.ndc.BarcodeScanDialog";document.addEventListener("settingsDone",i);document.addEventListener("SettingCompleted",i);document.addEventListener("mockSettingsDone",i);var a={},s,S=new sap.ui.model.json.JSONModel({available:false}),o=null,b={},r=true,R=new sap.ui.model.resource.ResourceModel({bundleName:"sap.ndc.messagebundle"});function g(){try{s=cordova.plugins.barcodeScanner;if(s){L.debug("Cordova BarcodeScanner plugin is available!");}else{S.setProperty("/available",false);L.error("BarcodeScanner: cordova.plugins.barcodeScanner is not available");}}catch(e){S.setProperty("/available",false);L.info("BarcodeScanner: cordova.plugins is not available");return;}}function i(){c();s=null;S.setProperty("/available",true);if(sap.Settings===undefined){L.debug("No sap.Settings. No feature vector available.");g();}else if(sap.Settings&&typeof sap.Settings.isFeatureEnabled==="function"){sap.Settings.isFeatureEnabled("cordova.plugins.barcodeScanner",function(e){if(e){g();}else{S.setProperty("/available",false);L.warning("BarcodeScanner: Feature disabled");}},function(){L.warning("BarcodeScanner: Feature check failed");});}else{L.warning("BarcodeScanner: Feature vector (sap.Settings.isFeatureEnabled) is not available");}}function c(){if(self!=top&&typeof cordova==="undefined"){window.cordova=top.cordova;}}function d(f,l,t){var e;b.onSuccess=f;b.onLiveUpdate=l;if(!o){e=new sap.ui.model.json.JSONModel();o=sap.ui.xmlfragment(D,{onOK:function(E){a.closeScanDialog();if(typeof b.onSuccess==="function"){b.onSuccess({text:e.getProperty("/barcode"),cancelled:false});}},onCancel:function(E){a.closeScanDialog();if(typeof b.onSuccess==="function"){b.onSuccess({text:e.getProperty("/barcode"),cancelled:true});}},onLiveChange:function(E){if(typeof b.onLiveUpdate==="function"){b.onLiveUpdate({newValue:E.getParameter("newValue")});}},onAfterOpen:function(E){E.getSource().getContent()[0].focus();}});o.setModel(e);o.setModel(R,"i18n");}if(typeof t==="string"&&t!=null&&t.trim()!=""){o.setTitle(t);}return o;}a.scan=function(f,F,l,e){var h;if(!r){L.error("Barcode scanning is already in progress.");return;}r=false;if(S.getProperty("/available")==true&&s==null){g();}if(s){s.scan(function(j){if(j.cancelled==="false"||!j.cancelled){j.cancelled=false;if(typeof f==="function"){f(j);}}else{h=d(f,l,e);h.getModel().setProperty("/barcode","");h.getModel().setProperty("/isNoScanner",false);h.open();}r=true;},function(E){L.error("Barcode scanning failed.");if(typeof F==="function"){F(E);}r=true;});}else{h=d(f,l,e);h.getModel().setProperty("/barcode","");h.getModel().setProperty("/isNoScanner",true);h.open();}};a.closeScanDialog=function(){if(o){o.close();r=true;}};a.getStatusModel=function(){return S;};i();return a;}());return B;},true);