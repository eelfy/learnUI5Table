/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/m/Button","sap/m/FormattedText","sap/m/MultiInput","./Settings","sap/m/Token","sap/ui/core/Core","sap/ui/integration/util/BindingHelper","sap/ui/core/ListItem"],function(C,B,F,M,S,T,a,c,L){"use strict";var r=a.getLibraryResourceBundle("sap.ui.integration"),s="sap/ui/integration/designtime/editor/fields/viz";var d=C.extend("sap.ui.integration.designtime.editor.fields.BaseField",{metadata:{properties:{configuration:{type:"object"},specialButton:{type:"object"},mode:{type:"string"},host:{type:"object"},visible:{type:"boolean",defaultValue:true}},aggregations:{_field:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_settingsButton:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_dynamicField:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_hint:{type:"sap.m.FormattedText",multiple:false,visibility:"hidden"}},associations:{_messageIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{afterInit:{}}},renderer:function(R,o){var f=o.getAggregation("_field"),b=o.getAggregation("_settingsButton"),D=o._getDynamicField();R.openStart("div");R.addClass("sapUiIntegrationCardEditorItemField");if(f&&f.getWidth&&!b){}if(!o.getVisible()){R.addStyle("display","none");}R.writeClasses();R.writeStyles();R.writeElementData(o);R.openEnd();if(o.getVisible()){R.openStart("span");R.writeClasses();R.openEnd();R.openStart("span");R.addClass("sapUiIntegrationCardEditorEditor");if(o._hasDynamicValue()){R.addStyle("width","1px");R.addStyle("opacity","0");}R.writeStyles();R.writeClasses();R.openEnd();R.renderControl(f);R.close("span");R.close("span");if(b||o._hasDynamicValue()){R.openStart("span");R.addClass("sapUiIntegrationCardEditorSettings");R.writeClasses();R.openEnd();R.openStart("span");R.addClass("sapUiIntegrationCardEditorSettingsField");if(o._hasDynamicValue()){R.addStyle("width","calc(100% - 2.5rem)");R.addStyle("opacity","1");}R.writeClasses();R.writeStyles();R.openEnd();R.renderControl(D);R.close("span");R.openStart("span");R.addClass("sapUiIntegrationCardEditorSettingsButton");R.writeClasses();R.openEnd();R.renderControl(b);R.close("span");R.close("span");}R.openStart("div");R.writeAttribute("id",o.getId()+"-ms");R.addStyle("height","0");R.writeStyles();R.openEnd();R.close("div");if(o.getMode()!=="translation"){var h=o.getAggregation("_hint");if(h){R.openStart("div");R.addClass("sapUiIntegrationCardEditorHint");R.writeClasses();R.openEnd();R.renderControl(h);R.close("div");}}}R.close("div");}});d.prototype.init=function(){this._readyPromise=new Promise(function(b){this._fieldResolver=b;}.bind(this));};d.prototype.setConfiguration=function(o,b){if(o!==this.getConfiguration()){this._sanitizeValidationSettings(o);this.setProperty("configuration",o,b);if(o){Promise.resolve().then(function(){this.initEditor(o);if(o.hint&&o.type!=="boolean"){this._addHint(o.hint);}else if(o.hint&&o.type==="boolean"&&o.cols&&o.cols===1){this._addHint(o.hint);}}.bind(this));}}return this;};d.prototype._addHint=function(h){h=h.replace(/<a href/g,"<a target='blank' href");var f=new F({htmlText:h});this.setAggregation("_hint",f);};d.prototype._sanitizeValidationSettings=function(o){o.validations=o.validations||[];if(o.validation&&o.validations&&Array.isArray(o.validations)){o.validations.push(o.validation);delete o.validation;}if(o.validation&&!o.validations){o.validations=[o.validation];delete o.validation;}if(o.required){o.validations.unshift({"required":true,"type":"error"});}};d.prototype._triggerValidation=function(v){var o=this.getConfiguration();var b=false;if(o.required){b=true;}else if(o.type==="string"&&v){b=true;}else if((o.type==="integer"||o.type==="number")&&!isNaN(v)){if(v!==""){b=true;}}if(o.validations&&Array.isArray(o.validations)&&b){for(var i=0;i<o.validations.length;i++){if(!this._handleValidation(o.validations[i],v)){return false;}}}this._hideValueState();return true;};d.validations={string:{maxLength:function(v,m){return v.length<=m;},maxLengthTxt:"CARDEDITOR_VAL_MAXLENGTH",minLength:function(v,m){return v.length>=m;},minLengthTxt:"CARDEDITOR_VAL_MINLENGTH",pattern:function(v,b){var p=new RegExp(b);return p.test(v);},patternTxt:"CARDEDITOR_VAL_NOMATCH",required:function(v,b){return b&&!!v;},requiredTxt:"CARDEDITOR_VAL_TEXTREQ",validateTxt:"CARDEDITOR_VAL_NOMATCH"},integer:{maximum:function(v,b,e){if(e.exclusiveMaximum){e._txt="maximumExclusiveTxt";return v<b;}return v<=b;},maximumTxt:"CARDEDITOR_VAL_MAX",maximumExclusiveTxt:"CARDEDITOR_VAL_MAX_E",minimum:function(v,b,e){if(e.exclusiveMinimum){e._txt="minimumExclusiveTxt";return v>b;}return v>=b;},minimumTxt:"CARDEDITOR_VAL_MIN",minimumExclusiveTxt:"CARDEDITOR_VAL_MIN_E",multipleOf:function(v,b){return(v%b)===0;},multipleOfTxt:"CARDEDITOR_VAL_MULTIPLE",required:function(v,b){return!isNaN(v)&&v!=="";},requiredTxt:"CARDEDITOR_VAL_NUMBERREQ",validateTxt:"CARDEDITOR_VAL_NOMATCH"},number:{maximum:function(v,b,e){if(e.exclusiveMaximum){e._txt="maximumExclusiveTxt";return v<b;}return v<=b;},maximumTxt:"CARDEDITOR_VAL_MAX",maximumExclusiveTxt:"CARDEDITOR_VAL_MAX_E",minimum:function(v,b,e){if(e.exclusiveMinimum){e._txt="minimumExclusiveTxt";return v>b;}return v>=b;},minimumTxt:"CARDEDITOR_VAL_MIN",minimumExclusiveTxt:"CARDEDITOR_VAL_MAX_E",multipleOf:function(v,b){return(v%b)===0;},multipleOfTxt:"CARDEDITOR_VAL_MULTIPLE",required:function(v,b){return!isNaN(v)&&v!=="";},requiredTxt:"CARDEDITOR_VAL_NUMBERREQ",validateTxt:"CARDEDITOR_VAL_NOMATCH"}};d.prototype._handleValidation=function(o,v){var b=this.getConfiguration(),V=d.validations[b.type];for(var n in o){if(V){var f=V[n];o._txt="";if(f){if(!f(v,o[n],o)){var e;if(typeof o.message==="function"){e=o.message(v,b);}else{e=o.message;}if(!e){if(o._txt){e=r.getText(V[o._txt],[o[n]]);}else{e=r.getText(V[n+"Txt"],[o[n]]);}}this._showValueState(o.type||"error",e);return false;}}}if(n==="validate"){if(!o[n](v,b)){var e;if(typeof o.message==="function"){e=o.message(v,b);}else{e=o.message;}if(!e){if(o._txt){e=r.getText(V[o._txt],[o[n]]);}else{e=r.getText(V[n+"Txt"],[o[n]]);}}this._showValueState(o.type||"error",e);return false;}}}return true;};d.prototype.onAfterRendering=function(){this._applyMessage();var m=this.getParent().getAggregation("_messageStrip")||this.getParent().getParent().getAggregation("_messageStrip");if(m&&m.getDomRef()){m.getDomRef().style.opacity="0";}};d.prototype._applyMessage=function(){var i=a.byId(this.getAssociation("_messageIcon"));if(this.getAssociation("_messageIcon")&&i){var I=i.getDomRef();if(I){I.classList.remove("error");I.classList.remove("warning");I.classList.remove("success");if(this._message){I.classList.add(this._message.type);}}}};d.prototype._showValueState=function(t,m){var f=this.getAggregation("_field"),e=t.substring(0,1).toUpperCase()+t.substring(1);this._message={"enum":e,"type":t,"message":m,"atControl":false};var o=this.getParent().getAggregation("_messageStrip")||this.getParent().getParent().getAggregation("_messageStrip");if(f.setValueState){this._message.atControl=true;if(f.setShowValueStateMessage){f.setShowValueStateMessage(false);}f.setValueState(e);f.setValueStateText(m);}else if(o&&o.getVisible()){this._showMessage();}this._applyMessage();};d.prototype._hideValueState=function(){if(!this.getParent()){return;}var m=this.getParent().getAggregation("_messageStrip")||this.getParent().getParent().getAggregation("_messageStrip");if(this._message){var f=this.getAggregation("_field");this._message={"enum":"Success","type":"success","message":"Corrected","atControl":this._message.atControl};if(this._messageto){clearTimeout(this._messageto);}this._messageto=setTimeout(function(){this._messageto=null;this._applyMessage();if(!this._message&&f.setValueState){f.setValueState("None");}}.bind(this),1500);this._applyMessage();if(m.getDomRef()){m.getDomRef().style.opacity="0";}if(f.setValueState){f.setValueState("Success");}m.onAfterRendering=null;this._message=null;}};d.prototype.onfocusin=function(e){if(e&&e.target.classList.contains("sapMBtn")){return;}this._showMessage();};d.prototype.onfocusout=function(e){this._hideMessage();};d.prototype._showMessage=function(){if(!this.getParent()){return;}var m=this.getParent().getAggregation("_messageStrip")||this.getParent().getParent().getAggregation("_messageStrip");if(this._message){m.applySettings({type:this._message.enum,text:this._message.message});var t=this;m.onAfterRendering=function(){m.getDomRef().style.opacity="1";t.getDomRef("ms").appendChild(m.getDomRef());var f=t.getAggregation("_field");if(t._message&&!t._message.atControl){m.getDomRef().style.marginTop="0";m.getDomRef().style.marginLeft="0";}m.getDomRef().style.width=(f.getDomRef().offsetWidth-2)+"px";};m.rerender();}};d.prototype._hideMessage=function(){var m=this.getParent().getAggregation("_messageStrip")||this.getParent().getParent().getAggregation("_messageStrip");var f=this.getAggregation("_field"),b=f.getDomRef().contains(window.document.activeElement);if(!b&&m.getDomRef()){m.getDomRef().style.opacity="0";}m.onAfterRendering=null;};d.prototype.initEditor=function(o){var b;this.initVisualization&&this.initVisualization(o);if(this._visualization.editor){b=this._visualization.editor;}else if(this._visualization.type){if(typeof this._visualization.type==="string"){if(this._visualization.type.indexOf("/")===-1){this._visualization.type=s+"/"+this._visualization.type;this._visualization.settings=this._visualization.settings||{value:"{currentSettings>value}",editable:"{currentSettings>editable}"};}sap.ui.require([this._visualization.type],function(f){this._visualization.type=f;this.initEditor(o);}.bind(this));return;}b=new this._visualization.type(this._visualization.settings||{});}if(b instanceof C){this.setAggregation("_field",b);if(b.attachChange){b.attachChange(function(E){this._triggerValidation(E.getParameter("value"));}.bind(this));}var e=this.getModel("currentSettings").bindProperty("value",this.getBindingContext("currentSettings"));e.attachChange(function(){this._triggerValidation(o.value);}.bind(this));this._triggerValidation(o.value);}var m=this.getMode();o.allowSettings=o.allowSettings||o.allowSettings!==false&&m==="admin";o.allowDynamicValues=o.allowDynamicValues||o.allowDynamicValues!==false;o._changeDynamicValues=o.visible&&o.editable&&(o.allowDynamicValues||o.allowSettings)&&m!=="translation";if(o._changeDynamicValues){this._addSettingsButton();}this._applySettings(o);this.fireAfterInit();};d.prototype.initVisualization=function(){};d.prototype._hasDynamicValue=function(){var v=this._getCurrentProperty("value");var D=typeof v==="string"&&(v.indexOf("{context>")===0||v.indexOf("{{parameters")===0);this._setCurrentProperty("_hasDynamicValue",D);return D;};d.prototype._hasSettings=function(){var o=this.getConfiguration();if(o._next){o._hasSettings=(o._next.editable===false||o._next.visible===false||o._next.allowDynamicValues===false);}else{o._hasSettings=false;}return o._hasSettings;};d.prototype._getDynamicField=function(){var f=this.getAggregation("_dynamicField");if(!f){var f=new M({showValueHelp:false});this.setAggregation("_dynamicField",f);}return f;};d.prototype._hideDynamicField=function(){var D=this._getDynamicField(),f=this.getAggregation("_field");if(D.getDomRef()){var o=D.getDomRef().parentNode.style;o.width="1px";o.opacity=0;o=f.getDomRef().parentNode.style;f.getDomRef().style.visibility="visible";o.width="calc(100% - 2.5rem)";o.opacity=1;}};d.prototype._showDynamicField=function(){var D=this._getDynamicField(),f=this.getAggregation("_field");if(D.getDomRef()){var o=D.getDomRef().parentNode.style;o.width="calc(100% - 2.5rem)";o.opacity=1;o=f.getDomRef().parentNode.style;f.getDomRef().style.visibility="hidden";o.width="1px";o.opacity=0;}};d.prototype._getSettingsPanel=function(){if(!this._oSettingsPanel){this._oSettingsPanel=new S();}return this._oSettingsPanel;};d.prototype._openSettingsDialog=function(D){var o=this._getSettingsPanel();window.setTimeout(function(){o.setConfiguration(this.getConfiguration());var p=this.getParent().getParent().getAggregation("_preview")||this.getParent().getParent().getParent().getAggregation("_preview")||this.getParent().getParent().getParent().getParent().getAggregation("_preview");o.open(this.getAggregation("_settingsButton"),this.getAggregation("_settingsButton"),p,this.getHost(),this,this._applySettings.bind(this),this._cancelSettings.bind(this));}.bind(this),D||600);};d.prototype._addSettingsButton=function(){this._getDynamicField();this.setAggregation("_settingsButton",new B({icon:"{= ${currentSettings>_hasDynamicValue} ? 'sap-icon://display-more' : 'sap-icon://enter-more'}",type:"Transparent",tooltip:r.getText("CARDEDITOR_FIELD_MORE_SETTINGS"),press:function(){this._openSettingsDialog(200);}.bind(this)}));};d.prototype._setCurrentProperty=function(p,v){if(this._getCurrentProperty(p)!==v){this.getModel("currentSettings").setProperty(p,v,this.getBindingContext("currentSettings"));}};d.prototype._getCurrentProperty=function(p){return this.getModel("currentSettings").getProperty(p,this.getBindingContext("currentSettings"));};d.prototype._applySettings=function(D){var b=this._getDynamicField(),o=this.getModel("contextflat")._getValueObject(D.value);b.removeAllTokens();if(!this._getCurrentProperty("_changeDynamicValues")){b.setEnabled(false);}if(o&&o.path!=="empty"){if(o.object.value&&o.object.value.indexOf("{{")==0){this._setCurrentProperty("value",o.object.value);}else{this._setCurrentProperty("value",o.value);}b.addToken(new T({text:o.object.label,"delete":function(){this._setCurrentProperty("value","");if(!this._hasDynamicValue()){this._hideDynamicField();}this._applyButtonStyles();window.setTimeout(function(){this.getAggregation("_field").focus();}.bind(this),100);}.bind(this)}));}else{this._setCurrentProperty("value",D.value);this._setCurrentProperty("_changed",D._changed);this._hideDynamicField();}this._setCurrentProperty("_next",D._next);this._applyButtonStyles();if(!this._hasDynamicValue()){this._hideDynamicField();}else{this._showDynamicField();}this._fieldResolver&&this._fieldResolver();this._fieldResolver=null;};d.prototype._cancelSettings=function(){this._applyButtonStyles();if(!this._hasDynamicValue()){this._hideDynamicField();}};d.prototype._applyButtonStyles=function(){if(!this._hasDynamicValue()){this.removeStyleClass("dynamicvalue");}else{this.addStyleClass("dynamicvalue");}if(!this._hasSettings()){this.removeStyleClass("settings");}else{this.addStyleClass("settings");}};d.prototype.isFilterBackend=function(o){var i=false;if(o&&o.values&&o.values.data){if(o.values.data.request&&o.values.data.request.parameters&&o.values.data.request.parameters.$filter&&o.values.data.request.parameters.$filter.indexOf("{currentSettings>suggestValue}")>-1){i=true;}else if(o.values.data.request&&o.values.data.request.url&&o.values.data.request.url.indexOf("{currentSettings>suggestValue}")>-1){i=true;}}return i;};d.prototype.formatListItem=function(i){var I=new L();for(var k in i){I.bindProperty(k,c.createBindingInfos(i[k]));}return I;};return d;});
