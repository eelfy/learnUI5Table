// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/m/ButtonRenderer","sap/m/library","sap/ui/core/Icon","sap/ui/core/IconPool","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ui/thirdparty/jquery","sap/ushell/library","sap/ushell/resources","sap/ushell/services/AppConfiguration","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ushell/ui/launchpad/ActionItem","sap/ushell/utils"],function(L,B,m,I,a,D,J,q,u,r,A,b,c,d){"use strict";var e=m.ButtonType;var E=c.extend("sap.ushell.ui.footerbar.EndUserFeedback",{metadata:{library:"sap.ushell",properties:{showAnonymous:{type:"boolean",group:"Misc",defaultValue:true},anonymousByDefault:{type:"boolean",group:"Misc",defaultValue:true},showLegalAgreement:{type:"boolean",group:"Misc",defaultValue:true},showCustomUIContent:{type:"boolean",group:"Misc",defaultValue:true},feedbackDialogTitle:{type:"string",group:"Misc",defaultValue:null},textAreaPlaceholder:{type:"string",group:"Misc",defaultValue:null}},aggregations:{customUIContent:{type:"sap.ui.core.Control",multiple:true,singularName:"customUIContent"}}},renderer:"sap.m.ButtonRenderer"});E.prototype.init=function(){if(c.prototype.init){c.prototype.init.apply(this,arguments);}var f=sap.ushell.Container.getUser(),F=d.getFormFactor();this.oUserDetails={userId:f.getId(),eMail:f.getEmail()};this.translationBundle=r.i18n;this.appConfiguration=A;this.oEndUserFeedbackModel=new J();this.oEndUserFeedbackModel.setData({feedbackViewTitle:this.translationBundle.getText("userFeedback_title"),legalAgreementViewTitle:this.translationBundle.getText("userFeedbackLegal_title"),textAreaPlaceholderText:this.translationBundle.getText("feedbackPlaceHolderHeader"),presentationStates:{showAnonymous:this.getShowAnonymous(),showLegalAgreement:this.getShowLegalAgreement(),showCustomUIContent:this.getShowCustomUIContent()},clientContext:{userDetails:q.extend(true,{},this.oUserDetails),navigationData:{formFactor:F,applicationInformation:{},navigationHash:null}},isAnonymous:this.getAnonymousByDefault(),applicationIconPath:"",leftButton:{feedbackView:this.translationBundle.getText("sendBtn"),legalAgreementView:this.translationBundle.getText("approveBtn")},rightButton:{feedbackView:this.translationBundle.getText("cancelBtn"),legalAgreementView:this.translationBundle.getText("declineBtn")},states:{isLegalAgreementChecked:false,isRatingSelected:false,isInFeedbackView:true},technicalLink:{state:0,title:[this.translationBundle.getText("technicalDataLink"),this.translationBundle.getText("technicalDataLinkHide")]},textArea:{inputText:""},contextText:"",ratingButtons:[{text:r.i18n.getText("ratingExcellentText"),color:"sapUshellRatingLabelFeedbackPositiveText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-very-happy",id:"rateBtn1",index:1},{text:r.i18n.getText("ratingGoodText"),color:"sapUshellRatingLabelFeedbackPositiveText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-happy",id:"rateBtn2",index:2},{text:r.i18n.getText("ratingAverageText"),color:"sapUshellRatingLabelFeedbackNeutralText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-neutral",id:"rateBtn3",index:3},{text:r.i18n.getText("ratingPoorText"),color:"sapUshellRatingLabelFeedbackCriticalText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-bad",id:"rateBtn4",index:4},{text:r.i18n.getText("ratingVeyPoorText"),color:"sapUshellRatingLabelFeedbackNegativeText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-very-bad",id:"rateBtn5",index:5}],selectedRating:{text:"",color:"",index:0}});this.setIcon("sap-icon://marketing-campaign");this.setText(r.i18n.getText("endUserFeedbackBtn"));this.attachPress(this.ShowEndUserFeedbackDialog);this.setEnabled();};E.prototype.ShowEndUserFeedbackDialog=function(){sap.ui.require(["sap/ui/layout/form/SimpleForm","sap/ui/layout/form/SimpleFormLayout","sap/ui/layout/HorizontalLayout","sap/ui/layout/VerticalLayout","sap/m/TextArea","sap/m/Link","sap/m/Label","sap/m/Text","sap/m/Dialog","sap/m/Button","sap/m/Image","sap/m/Bar","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/CheckBox"],function(S,f,H,V,T,g,h,i,j,k,l,n,o,p,C){var s,t,v,w,x,M,y,z;this.oEndUserFeedbackService=sap.ushell.Container.getService("EndUserFeedback");s=function(){var G=[],K=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/formFactor"),U=this.oEndUserFeedbackModel.getProperty("/clientContext/userDetails/userId"),N=this.oEndUserFeedbackModel.getProperty("/clientContext/userDetails/eMail"),O=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/applicationInformation/url"),P=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/applicationInformation/applicationType"),Q=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/applicationInformation/additionalInformation"),R=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/navigationHash"),W=this.getModel().getProperty("/currentState/stateName"),X=!(W==="home"||W==="catalog");G.push(new i({text:this.translationBundle.getText("loginDetails")}).addStyleClass("sapUshellContactSupportHeaderInfoText"));G.push(U?new h({text:this.translationBundle.getText("userFld")}):null);G.push(U?new i("technicalInfoUserIdTxt",{text:"{/clientContext/userDetails/userId}"}):null);G.push(N?new h({text:this.translationBundle.getText("eMailFld")}):null);G.push(N?new i({text:"{/clientContext/userDetails/eMail}"}):null);G.push(K?new h({text:this.translationBundle.getText("formFactorFld")}):null);G.push(K?new i({text:"{/clientContext/navigationData/formFactor}"}):null);G.push(new i({text:""}));G.push(new i({text:this.translationBundle.getText(this.currentApp?"applicationInformationFld":"feedbackHeaderText")}).addStyleClass("sapUshellEndUserFeedbackHeaderInfoText").addStyleClass("sapUshellEndUserFeedbackInfoTextSpacing"));G.push(O&&X?new h({text:this.translationBundle.getText("urlFld")}):null);G.push(O&&X?new i({text:"{/clientContext/navigationData/applicationInformation/url}"}):null);G.push(P?new h({text:this.translationBundle.getText("applicationTypeFld")}):null);G.push(P?new i({text:"{/clientContext/navigationData/applicationInformation/applicationType}"}):null);G.push(Q?new h({text:this.translationBundle.getText("additionalInfoFld")}):null);G.push(Q?new i({text:"{/clientContext/navigationData/applicationInformation/additionalInformation}"}):null);G.push(R&&X?new h({text:this.translationBundle.getText("hashFld")}):null);G.push(R&&X?new i({text:"{/clientContext/navigationData/navigationHash}"}):null);return G.filter(Boolean);}.bind(this);t=function(){this.oTechnicalInfoBox=new S("feedbackTechnicalInfoBox",{layout:f.ResponsiveLayout,content:s()});if(D.os.ios&&D.system.phone){this.oTechnicalInfoBox.addStyleClass("sapUshellContactSupportFixWidth");}var G=this.oTechnicalInfoBox.onAfterRendering;this.oTechnicalInfoBox.onAfterRendering=function(){G.apply(this,arguments);var K=q(this.getDomRef());K.attr("tabIndex",0);setTimeout(function(){this.focus();}.bind(K),700);};return new H("technicalInfoBoxLayout",{visible:{path:"/technicalLink/state",formatter:function(K){return K===1;}},content:[this.oTechnicalInfoBox]});}.bind(this);x=function(){this.oTechnicalInfoBox.destroyContent();this.oTechnicalInfoBox.removeAllContent();var G=s(),K;for(K in G){this.oTechnicalInfoBox.addContent(G[K]);}this.oRatingButtons.setSelectedButton("none");}.bind(this);M=sap.ui.require.toUrl("sap/ushell");y=M+"/themes/base/img/launchpadDefaultIcon.jpg";z=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/formFactor")==="desktop";this.updateModelContext();if(this.oDialog){x();this.oDialog.open();return;}this.oLegalAgreementInfoLayout=null;this.oPopoverTitle=new i("PopoverTitle",{text:{parts:[{path:"/states/isInFeedbackView"},{path:"/feedbackViewTitle"}],formatter:function(G){return this.oEndUserFeedbackModel.getProperty(G?"/feedbackViewTitle":"/legalAgreementViewTitle");}.bind(this)}});this.oBackButton=new k("endUserFeedbackBackBtn",{visible:{path:"/states/isInFeedbackView",formatter:function(G){return!G;}},icon:a.getIconURI("nav-back"),press:function(){this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);this.bBackNavigationHappened=true;}.bind(this),tooltip:r.i18n.getText("feedbackGoBackBtn_tooltip"),ariaDescribedBy:this.oPopoverTitle});this.oHeadBar=new n({contentLeft:[this.oBackButton],contentMiddle:[this.oPopoverTitle]});this.oLogoImg=new l("sapFeedbackLogo",{src:y,width:"4.5rem",height:"4.5rem",visible:{path:"/applicationIconPath",formatter:function(G){return!G;}}});this.oAppIcon=new I("sapFeedbackAppIcon",{src:"{/applicationIconPath}",width:"4.5rem",height:"4.5rem",visible:{path:"/applicationIconPath",formatter:function(G){return!!G;}}}).addStyleClass("sapUshellFeedbackAppIcon");this.oContextName=new i("contextName",{text:"{/contextText}"});this.oContextLayout=new H("contextLayout",{allowWrapping:true,content:[this.oLogoImg,this.oAppIcon,this.oContextName]});this.oRatingLabel=new h("ratingLabel",{required:true,text:r.i18n.getText("ratingLabelText")});this.oRatingSelectionText=new i("ratingSelectionText",{text:{path:"/selectedRating",formatter:function(G){if(this.lastSelectedColor){this.removeStyleClass(this.lastSelectedColor);}if(G.color){this.addStyleClass(G.color);}this.lastSelectedColor=G.color;return G.text;}}});this.oRatingButtonTemplate=new p({icon:"{iconSymbol}",height:"100%",width:"20%",tooltip:"{text}"});this.oRatingButtonTemplate.addCustomData(new b({key:"aria-label",value:"{text}",writeToDom:true}));this.oRatingButtons=new o("ratingButton",{items:{path:"/ratingButtons",template:this.oRatingButtonTemplate},selectionChange:function(G){var P=G.getParameters().item.getBindingContext().getPath(),K=this.oEndUserFeedbackModel.getProperty(P);this.oEndUserFeedbackModel.setProperty("/selectedRating",{text:K.text,color:K.color,index:K.index});this.oEndUserFeedbackModel.setProperty("/states/isRatingSelected",true);}.bind(this),width:"100%"});this.oRatingButtons.setSelectedButton("none");this.oRatingButtons.addAriaLabelledBy("ratingLabel");this.oRatingButtons.addCustomData(new b({key:"aria-required",value:"true",writeToDom:true}));if(z){this.oRatingIndicationLayout=new H("ratingIndicationLayout",{content:[this.oRatingLabel,this.oRatingSelectionText]});}else{this.oRatingIndicationLayout=new V("ratingIndicationLayoutMob",{content:[this.oRatingLabel,this.oRatingSelectionText]});}this.oRatingLayout=new V("ratingLayout",{width:"100%",content:[this.oRatingIndicationLayout,this.oRatingButtons]});this.oAnonymousCheckbox=new C("anonymousCheckbox",{name:"anonymousCheckbox",visible:"{/presentationStates/showAnonymous}",text:r.i18n.getText("feedbackSendAnonymousText"),selected:!this.oEndUserFeedbackModel.getProperty("/isAnonymous"),select:function(G){var K=G.getParameter("selected");this._handleAnonymousSelection(!K);}.bind(this)});var F=(!this.oEndUserFeedbackModel.getProperty("/presentationStates/showAnonymous")||this.oEndUserFeedbackModel.getProperty("/isAnonymous"));this._handleAnonymousSelection(F);this.oLegalAgreementCheckbox=new C("legalAgreement",{name:"legalAgreement",visible:"{/presentationStates/showLegalAgreement}",selected:"{/states/isLegalAgreementChecked}",text:this.translationBundle.getText("agreementAcceptanceText")});this.oLegalAgreementLink=new g("legalAgreementLink",{text:this.translationBundle.getText("legalAgreementLinkText"),visible:"{/presentationStates/showLegalAgreement}",press:function(){var P=this.oEndUserFeedbackService.getLegalText();P.done(v.bind(this));}.bind(this)});this.oLegalAgreementLink.addEventDelegate({onAfterRendering:function(){if(this.bBackNavigationHappened){this.oLegalAgreementLink.focus();}}.bind(this)});this.aCustomUIContent=q.extend([],this.getCustomUIContent());this.oCustomUILayout=new V("customUILayout",{visible:{path:"/presentationStates/showCustomUIContent",formatter:function(G){return!(G&&this.aCustomUIContent.length);}.bind(this)},content:this.getCustomUIContent(),width:"100%"});this.oLegalLayout=new V("legalLayout",{content:[this.oAnonymousCheckbox,this.oLegalAgreementCheckbox,this.oLegalAgreementLink]});this.oTechnicalDataLink=new g("technicalDataLink",{text:{path:"/technicalLink/state",formatter:function(G){return this.getModel().getProperty("/technicalLink/title/"+G);}},press:function(){var _=this.oEndUserFeedbackModel.getProperty("/technicalLink/state");this.oEndUserFeedbackModel.setProperty("/technicalLink/state",Math.abs(_-1));this.oDialog.rerender();}.bind(this)});this.oTechnicalDataLayout=new H("technicalDataLayout",{content:[this.oTechnicalDataLink]});this.leftButton=new k("EndUserFeedbackLeftBtn",{text:{path:"/states/isInFeedbackView",formatter:function(G){return this.getModel().getProperty("/leftButton/"+(G?"feedbackView":"legalAgreementView"));}},enabled:{parts:[{path:"/states/isInFeedbackView"},{path:"/states/isLegalAgreementChecked"},{path:"/states/isRatingSelected"},{path:"/presentationStates/showLegalAgreement"}],formatter:function(G,K,N,O){return!G||(N&&(K||!O));}},type:e.Emphasized,press:function(){var G=this.oEndUserFeedbackModel.getProperty("/states/isInFeedbackView");if(G){var K={feedbackText:this.oEndUserFeedbackModel.getProperty("/textArea/inputText"),ratings:[{questionId:"Q10",value:this.oEndUserFeedbackModel.getProperty("/selectedRating/index")}],clientContext:this.oEndUserFeedbackModel.getProperty("/clientContext"),isAnonymous:this.oEndUserFeedbackModel.getProperty("/isAnonymous")},N=this.oEndUserFeedbackService.sendFeedback(K);N.done(function(){sap.ushell.Container.getServiceAsync("Message").then(function(O){O.info(this.translationBundle.getText("feedbackSendToastTxt"));}.bind(this));}.bind(this));N.fail(function(){sap.ushell.Container.getServiceAsync("Message").then(function(O){O.error(this.translationBundle.getText("feedbackFailedToastTxt"));}.bind(this));}.bind(this));this.oDialog.close();}else{this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);this.oEndUserFeedbackModel.setProperty("/states/isLegalAgreementChecked",true);}}.bind(this)});this.rightButton=new k("EndUserFeedbackRightBtn",{text:{path:"/states/isInFeedbackView",formatter:function(G){return this.getModel().getProperty("/rightButton/"+(G?"feedbackView":"legalAgreementView"));}},press:function(){var G=this.oEndUserFeedbackModel.getProperty("/states/isInFeedbackView");if(G){this.oDialog.close();}else{this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);this.oEndUserFeedbackModel.setProperty("/states/isLegalAgreementChecked",false);}}.bind(this)});this.oTextArea=new T("feedbackTextArea",{rows:6,value:"{/textArea/inputText}",placeholder:"{/textAreaPlaceholderText}"});this.oDialog=new j({id:"UserFeedbackDialog",contentWidth:"25rem",leftButton:this.leftButton,rightButton:this.rightButton,stretch:D.system.phone,initialFocus:"ratingButton",afterOpen:function(){q("#textArea").on("focusout",function(){window.scrollTo(0,0);});},afterClose:function(){if(window.document.activeElement&&window.document.activeElement.tagName==="BODY"){window.document.getElementById("meAreaHeaderButton").focus();}this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);}.bind(this)}).addStyleClass("sapUshellEndUserFeedbackDialog").addStyleClass("sapContrastPlus");this.oDialog.setModel(this.oEndUserFeedbackModel);this.oDialog.setCustomHeader(this.oHeadBar);this.oDialog.addCustomData(new b({key:"aria-label",value:this.translationBundle.getText("endUserFeedbackAreaLabel"),writeToDom:true}));this.oTechnicalInfoBoxLayout=t();this.oFeedbackLayout=new V("feedbackLayout",{visible:"{/states/isInFeedbackView}",content:[this.oContextLayout,this.oRatingLayout,this.oTextArea,this.oTechnicalDataLayout,this.oTechnicalInfoBoxLayout,this.oLegalLayout,this.oCustomUILayout]}).addStyleClass("sapUshellFeedbackLayout");this.oMainLayout=new V("mainLayout",{editable:false,content:[this.oFeedbackLayout]});this.oDialog.addContent(this.oMainLayout);this.oDialog.open();v=function(G){this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",false);if(!this.oLegalAgreementInfoLayout){w(G);}else{this.oBackButton.focus();}};w=function(G){this.oLegalText=new T("legalText",{cols:50,rows:22});this.oLegalText.setValue([G]);this.oLegalText.setEditable(false);var K=this.oLegalText.onAfterRendering;var N=this.oBackButton;this.oLegalText.onAfterRendering=function(){if(K){K.apply(this,arguments);}var O=q(this.getDomRef());O.find("textarea").attr("tabindex","0");N.focus();};this.oLegalAgreementInfoLayout=new V("legalAgreementInfoLayout",{visible:{path:"/states/isInFeedbackView",formatter:function(O){return!O;}},content:[this.oLegalText]});this.oMainLayout.addContent(this.oLegalAgreementInfoLayout);}.bind(this);}.bind(this));};E.prototype._handleAnonymousSelection=function(i){var f=this.translationBundle.getText("feedbackAnonymousTechFld");this.oEndUserFeedbackModel.setProperty("/isAnonymous",i);this.oEndUserFeedbackModel.setProperty("/clientContext/userDetails/eMail",i?f:this.oUserDetails.eMail);this.oEndUserFeedbackModel.setProperty("/clientContext/userDetails/userId",i?f:this.oUserDetails.userId);};E.prototype.addCustomUIContent=function(C){var i=C&&C.getMetadata&&C.getMetadata().getStereotype&&C.getMetadata().getStereotype()==="control";if(i){if(this.getShowCustomUIContent()){this.oEndUserFeedbackModel.setProperty("/presentationStates/showCustomUIContent",true);}this.addAggregation("customUIContent",C);}};E.prototype.setShowAnonymous=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/presentationStates/showAnonymous",v);this.setProperty("showAnonymous",v,true);}};E.prototype.setAnonymousByDefault=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/isAnonymous",v);this.setProperty("anonymousByDefault",v,true);}};E.prototype.setShowLegalAgreement=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/presentationStates/showLegalAgreement",v);this.setProperty("showLegalAgreement",v,true);}};E.prototype.setShowCustomUIContent=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/presentationStates/showCustomUIContent",v);this.setProperty("showCustomUIContent",v,true);}};E.prototype.setFeedbackDialogTitle=function(v){if(typeof v==="string"){this.oEndUserFeedbackModel.setProperty("/feedbackViewTitle",v);this.setProperty("feedbackDialogTitle",v,true);}};E.prototype.setTextAreaPlaceholder=function(v){if(typeof v==="string"){this.oEndUserFeedbackModel.setProperty("/textAreaPlaceholderText",v);this.setProperty("textAreaPlaceholder",v,true);}};E.prototype.updateModelContext=function(){var U=sap.ushell.Container.getService("URLParsing"),h,p,i,f,s,g;h=U.getShellHash(window.location);p=U.parseShellHash(h);i=(p!==undefined)?p.semanticObject+"-"+p.action:"";f=this.getModel().getProperty("/currentState/stateName");if(f==="home"||f==="catalog"){s=this.translationBundle.getText(f+"_title");}this.currentApp=this.appConfiguration.getCurrentApplication();this.bHasAppName=(this.currentApp&&this.appConfiguration.getMetadata(this.currentApp)&&this.appConfiguration.getMetadata(this.currentApp).title);this.sAppIconPath=(this.currentApp&&this.appConfiguration.getMetadata(this.currentApp)&&this.appConfiguration.getMetadata(this.currentApp).icon);this.oEndUserFeedbackModel.setProperty("/contextText",this.bHasAppName?this.appConfiguration.getMetadata(this.currentApp).title:this.translationBundle.getText("feedbackHeaderText"));g=null;if(this.currentApp&&this.currentApp.url){g=this.currentApp.url.split("?")[0];}else if(f){g=this.translationBundle.getText("flp_page_name");}this.oEndUserFeedbackModel.setProperty("/clientContext/navigationData/applicationInformation",{url:g,additionalInformation:(this.currentApp&&this.currentApp.additionalInformation)?this.currentApp.additionalInformation:null,applicationType:(this.currentApp&&this.currentApp.applicationType)?this.currentApp.applicationType:null});this.oEndUserFeedbackModel.setProperty("/clientContext/navigationData/navigationHash",s||i);this.oEndUserFeedbackModel.setProperty("/selectedRating",{text:"",color:"",index:0});this.oEndUserFeedbackModel.setProperty("/states/isRatingSelected",false);this.oEndUserFeedbackModel.setProperty("/states/isLegalAgreementChecked",false);this.oEndUserFeedbackModel.setProperty("/technicalLink/state",0);this.oEndUserFeedbackModel.setProperty("/textArea/inputText","");this.oEndUserFeedbackModel.setProperty("/applicationIconPath",this.sAppIconPath);this._handleAnonymousSelection(this.oEndUserFeedbackModel.getProperty("/isAnonymous"));};E.prototype.setEnabled=function(f){if(!sap.ushell.Container){if(this.getEnabled()){L.warning("Disabling 'End User Feedback' button: unified shell container not initialized",null,"sap.ushell.ui.footerbar.EndUserFeedback");}f=false;}c.prototype.setEnabled.call(this,f);};return E;});
