/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/Context","sap/ui/model/PropertyBinding","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/InvisibleText","sap/ui/core/Control","sap/ui/core/Icon","sap/ui/layout/HorizontalLayout","sap/ui/layout/Grid","sap/m/SearchField","sap/m/RadioButton","sap/m/ColumnListItem","sap/m/Column","sap/m/Text","sap/m/Bar","sap/m/Table","sap/m/Page","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Button","sap/m/ToggleButton","sap/m/CheckBox","sap/m/Dialog","sap/m/Input","sap/m/Label","sap/m/Title","sap/m/ResponsivePopover","sap/m/SelectList","sap/m/ObjectIdentifier","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/m/VBox","sap/ui/events/KeyCodes","sap/ui/core/library","sap/m/library","sap/ui/fl/Utils","sap/ui/fl/registry/Settings"],function(C,P,J,F,a,D,I,b,c,H,G,S,R,d,f,T,B,g,h,i,j,k,l,m,n,o,L,p,q,r,O,s,t,V,K,u,v,w,x){"use strict";var y=v.OverflowToolbarPriority;var z=v.ButtonType;var A=v.PlacementType;var E=v.PopinDisplay;var M=v.ScreenSize;var N=u.ValueState;var Q=u.TextAlign;var U=b.extend("sap.ui.fl.variants.VariantManagement",{metadata:{interfaces:["sap.m.IOverflowToolbarContent"],library:"sap.ui.fl",designtime:"sap/ui/fl/designtime/variants/VariantManagement.designtime",properties:{showSetAsDefault:{type:"boolean",group:"Misc",defaultValue:true},manualVariantKey:{type:"boolean",group:"Misc",defaultValue:false},inErrorState:{type:"boolean",group:"Misc",defaultValue:false},editable:{type:"boolean",group:"Misc",defaultValue:true},modelName:{type:"string",group:"Misc",defaultValue:null},updateVariantInURL:{type:"boolean",group:"Misc",defaultValue:false},resetOnContextChange:{type:"boolean",group:"Misc",defaultValue:true},executeOnSelectionForStandardDefault:{type:"boolean",group:"Misc",defaultValue:false},displayTextForExecuteOnSelectionForStandardVariant:{type:"string",group:"Misc",defaultValue:""}},associations:{"for":{type:"sap.ui.core.Control",multiple:true}},events:{save:{parameters:{name:{type:"string"},overwrite:{type:"boolean"},key:{type:"string"},execute:{type:"boolean"},def:{type:"boolean"}}},cancel:{},manage:{},initialized:{},select:{parameters:{key:{type:"string"}}}}},renderer:{apiVersion:2,render:function(e,W){e.openStart("div",W).class("sapUiFlVarMngmt").attr("title",W._oRb.getText("VARIANT_MANAGEMENT_TRIGGER_TT")).openEnd();e.renderControl(W.oVariantLayout);e.close("div");}}});U.INNER_MODEL_NAME="$sapUiFlVariants";U.MAX_NAME_LEN=100;U.COLUMN_FAV_IDX=0;U.COLUMN_NAME_IDX=1;U.COLUMN_EXEC_IDX=3;U.prototype.init=function(){this._sModelName=w.VARIANT_MODEL_NAME;this.attachModelContextChange(this._setModel,this);this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");this._createInnerModel();this.oVariantInvisibleText=new I();this.oVariantText=new p(this.getId()+"-text",{text:{path:'currentVariant',model:this._sModelName,formatter:function(W){var X="";if(W){X=this.getSelectedVariantText(W);this._setInvisibleText(X,this.getModified());}return X;}.bind(this)}});this.oVariantText.addStyleClass("sapUiFlVarMngmtClickable");this.oVariantText.addStyleClass("sapUiFlVarMngmtTitle");if(D.system.phone){this.oVariantText.addStyleClass("sapUiFlVarMngmtTextPhoneMaxWidth");}else{this.oVariantText.addStyleClass("sapUiFlVarMngmtTextMaxWidth");}var e=new L(this.getId()+"-modified",{text:"*",visible:{path:"modified",model:this._sModelName,formatter:function(W){var X=this.getCurrentVariantKey();if(X){this._setInvisibleText(this.getSelectedVariantText(X),W);}return((W===null)||(W===undefined))?false:W;}.bind(this)}});e.setVisible(false);e.addStyleClass("sapUiFlVarMngmtModified");e.addStyleClass("sapUiFlVarMngmtClickable");e.addStyleClass("sapMTitleStyleH4");this.oVariantPopoverTrigger=new l(this.getId()+"-trigger",{icon:"sap-icon://slim-arrow-down",type:z.Transparent,tooltip:this._oRb.getText("VARIANT_MANAGEMENT_TRIGGER_TT"),press:function(W){this._oCtrlRef=W.getParameter("pressed")?this.oVariantPopoverTrigger:null;}.bind(this)});this.oVariantPopoverTrigger.addAriaLabelledBy(this.oVariantInvisibleText);this.oVariantPopoverTrigger.addStyleClass("sapUiFlVarMngmtTriggerBtn");this.oVariantPopoverTrigger.addStyleClass("sapMTitleStyleH4");this.oVariantLayout=new H({content:[this.oVariantText,e,this.oVariantPopoverTrigger]});this.oVariantLayout.addStyleClass("sapUiFlVarMngmtLayout");e.setVisible(false);this.oVariantModifiedText=e;this.oVariantInvisibleText.toStatic();this.addDependent(this.oVariantLayout);};U.prototype.getOverflowToolbarConfig=function(){var e={canOverflow:false,invalidationEvents:["save","manage","select"]};return e;};U.prototype.getTitle=function(){return this.oVariantText;};U.prototype._setInvisibleText=function(e,W){var X;if(e){if(W){X="VARIANT_MANAGEMENT_SEL_VARIANT_MOD";}else{X="VARIANT_MANAGEMENT_SEL_VARIANT";}this.oVariantInvisibleText.setText(this._oRb.getText(X,[e]));}};U.prototype._createInnerModel=function(){var e=new J({showExecuteOnSelection:false,showSetAsDefault:true,editable:true,popoverTitle:this._oRb.getText("VARIANT_MANAGEMENT_VARIANTS")});this.setModel(e,U.INNER_MODEL_NAME);this._bindProperties();this._updateInnerModelWithShowSaveAsProperty();};U.prototype._bindProperties=function(){this.bindProperty("showSetAsDefault",{path:"/showSetAsDefault",model:U.INNER_MODEL_NAME});this.bindProperty("editable",{path:"/editable",model:U.INNER_MODEL_NAME});};U.prototype._updateInnerModelWithShowSaveAsProperty=function(){x.getInstance().then(function(e){this.getModel(U.INNER_MODEL_NAME).setProperty("/showSaveAs",e.isVariantPersonalizationEnabled());}.bind(this));};U.prototype._getShowExecuteOnSelection=function(){var e=this.getModel(U.INNER_MODEL_NAME);if(e){return e.getProperty("/showExecuteOnSelection");}return false;};U.prototype._setShowExecuteOnSelection=function(e){var W=this.getModel(U.INNER_MODEL_NAME);if(W){W.setProperty("/showExecuteOnSelection",e);}};U.prototype.setExecuteOnSelection=function(e){var W=this.getModel(this._sModelName);if(W&&this.oContext){W.setProperty(this.oContext+"/executeOnSelection",e);}};U.prototype.getOriginalDefaultVariantKey=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/originalDefaultVariant");}return null;};U.prototype.setDefaultVariantKey=function(e){var W=this.getModel(this._sModelName);if(W&&this.oContext){W.setProperty(this.oContext+"/defaultVariant",e);}};U.prototype.getDefaultVariantKey=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/defaultVariant");}return null;};U.prototype.setCurrentVariantKey=function(e){var W=this.getModel(this._sModelName);if(W&&this.oContext){W.setProperty(this.oContext+"/currentVariant",e);}return this;};U.prototype.getCurrentVariantKey=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/currentVariant");}return null;};U.prototype._assignPopoverTitle=function(){var e;var W;var X=this.getModel(this._sModelName);if(X&&this.oContext){e=X.getProperty(this.oContext+"/popoverTitle");}if(e!==undefined){W=this.getModel(U.INNER_MODEL_NAME);if(W){W.setProperty("/popoverTitle",e);}}};U.prototype.getVariants=function(){return this._getItems();};U.prototype.setModified=function(e){var W=this.getModel(this._sModelName);if(W&&this.oContext){W.setProperty(this.oContext+"/modified",e);}};U.prototype.getModified=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/modified");}return false;};U.prototype.getSelectedVariantText=function(e){var W=this._getItemByKey(e);if(W){return W.title;}return"";};U.prototype.getStandardVariantKey=function(){var e=this._getItems();if(e&&e[0]){return e[0].key;}return null;};U.prototype.getShowFavorites=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/showFavorites");}return false;};U.prototype._clearDeletedItems=function(){this._aDeletedItems=[];};U.prototype._addDeletedItem=function(e){this._aDeletedItems.push(e);};U.prototype._getDeletedItems=function(){return this._aDeletedItems;};U.prototype._getItems=function(){var e=[];if(this.oContext&&this.oContext.getObject()){e=this.oContext.getObject().variants.filter(function(W){if(!W.hasOwnProperty("visible")){return true;}return W.visible;});}return e;};U.prototype._getItemByKey=function(e){var W=null;var X=this._getItems();X.some(function(Y){if(Y.key===e){W=Y;}return(W!==null);});return W;};U.prototype._rebindControl=function(){this.oVariantText.unbindProperty("text");this.oVariantText.bindProperty("text",{path:'currentVariant',model:this._sModelName,formatter:function(e){var W="";if(e){W=this.getSelectedVariantText(e);this._setInvisibleText(W,this.getModified());}return W;}.bind(this)});this.oVariantModifiedText.unbindProperty("visible");this.oVariantModifiedText.bindProperty("visible",{path:"modified",model:this._sModelName,formatter:function(e){var W=this.getCurrentVariantKey();if(W){this._setInvisibleText(this.getSelectedVariantText(W),e);}return((e===null)||(e===undefined))?false:e;}.bind(this)});};U.prototype.setModelName=function(e){if(this.getModelName()){this.oContext=null;}this.setProperty("modelName",e);this._sModelName=e;this._rebindControl();return this;};U.prototype._setBindingContext=function(){var e;var W;if(!this.oContext){e=this.getModel(this._sModelName);if(e){W=this._getLocalId(e);if(W){this.oContext=new C(e,"/"+W);this.setBindingContext(this.oContext,this._sModelName);if(!this.getModelName()&&e.registerToModel){e.registerToModel(this);}this._assignPopoverTitle();this._registerPropertyChanges(e);this.fireInitialized();}}}};U.prototype._getLocalId=function(e){if(this.getModelName()&&(this._sModelName!==w.VARIANT_MODEL_NAME)){return this.getId();}return e.getVariantManagementReferenceForControl(this);};U.prototype._setModel=function(){this._setBindingContext();};U.prototype._registerPropertyChanges=function(e){var W=new P(e,this.oContext+"/showExecuteOnSelection");W.attachChange(function(X){if(X&&X.oSource&&X.oSource.oModel&&X.oSource.sPath){var Y=X.oSource.oModel.getProperty(X.oSource.sPath);if(Y!==undefined){this._setShowExecuteOnSelection(Y);}}}.bind(this));W=new P(e,this.oContext+"/variantsEditable");W.attachChange(function(X){if(X&&X.oSource&&X.oSource.oModel&&X.oSource.sPath){var Y;var Z=X.oSource.oModel.getProperty(X.oSource.sPath);Y=this.getModel(U.INNER_MODEL_NAME);if(Y&&(Z!==undefined)){Y.setProperty("/editable",Z);}}}.bind(this));};U.prototype.handleOpenCloseVariantPopover=function(){if(!this.bPopoverOpen){this._openVariantList();}else if(this.oVariantPopOver&&this.oVariantPopOver.isOpen()){this.oVariantPopOver.close();}else if(this.getInErrorState()&&this.oErrorVariantPopOver&&this.oErrorVariantPopOver.isOpen()){this.oErrorVariantPopOver.close();}};U.prototype.getFocusDomRef=function(){if(this.oVariantPopoverTrigger){return this.oVariantPopoverTrigger.getFocusDomRef();}};U.prototype.onclick=function(){if(this.oVariantPopoverTrigger&&!this.bPopoverOpen){this.oVariantPopoverTrigger.focus();}this.handleOpenCloseVariantPopover();};U.prototype.onkeyup=function(e){if(e.which===K.F4||e.which===K.SPACE||e.altKey===true&&e.which===K.ARROW_UP||e.altKey===true&&e.which===K.ARROW_DOWN){this._openVariantList();}};U.prototype.onAfterRendering=function(){this.oVariantText.$().off("mouseover").on("mouseover",function(){this.oVariantPopoverTrigger.addStyleClass("sapUiFlVarMngmtTriggerBtnHover");}.bind(this));this.oVariantText.$().off("mouseout").on("mouseout",function(){this.oVariantPopoverTrigger.removeStyleClass("sapUiFlVarMngmtTriggerBtnHover");}.bind(this));};U.prototype._openInErrorState=function(){var W;if(!this.oErrorVariantPopOver){W=new V({fitContainer:true,alignItems:sap.m.FlexAlignItems.Center,items:[new c({size:"4rem",color:"lightgray",src:"sap-icon://message-error"}),new p({titleStyle:sap.ui.core.TitleLevel.H2,text:this._oRb.getText("VARIANT_MANAGEMENT_ERROR_TEXT1")}),new T({textAlign:sap.ui.core.TextAlign.Center,text:this._oRb.getText("VARIANT_MANAGEMENT_ERROR_TEXT2")})]});W.addStyleClass("sapUiFlVarMngmtErrorPopover");this.oErrorVariantPopOver=new q(this.getId()+"-errorpopover",{title:{path:"/popoverTitle",model:U.INNER_MODEL_NAME},contentWidth:"400px",placement:A.VerticalPreferredBottom,content:[new h(this.getId()+"-errorselpage",{showSubHeader:false,showNavButton:false,showHeader:false,content:[W]})],afterOpen:function(){this.bPopoverOpen=true;}.bind(this),afterClose:function(){if(this.bPopoverOpen){setTimeout(function(){this.bPopoverOpen=false;}.bind(this),200);}}.bind(this),contentHeight:"300px"});this.oErrorVariantPopOver.attachBrowserEvent("keyup",function(e){if(e.which===32){this.oErrorVariantPopOver.close();}}.bind(this));}if(this.bPopoverOpen){return;}this.oErrorVariantPopOver.openBy(this.oVariantLayout);};U.prototype._createVariantList=function(){if(this.oVariantPopOver){return;}this.oVariantManageBtn=new k(this.getId()+"-manage",{text:this._oRb.getText("VARIANT_MANAGEMENT_MANAGE"),enabled:true,press:function(){this._openManagementDialog();}.bind(this),layoutData:new t({priority:y.Low})});this.oVariantSaveBtn=new k(this.getId()+"-mainsave",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),press:function(){this._handleVariantSave();}.bind(this),visible:{path:"modified",model:this._sModelName,formatter:function(W){return W;}},type:z.Emphasized,layoutData:new t({priority:y.Low})});this.oVariantSaveAsBtn=new k(this.getId()+"-saveas",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVEAS"),press:function(){this._openSaveAsDialog();}.bind(this),layoutData:new t({priority:y.Low}),visible:{path:"/showSaveAs",model:U.INNER_MODEL_NAME}});this._oVariantList=new r(this.getId()+"-list",{selectedKey:{path:"currentVariant",model:this._sModelName},itemPress:function(W){var X=null;if(W&&W.getParameters()){var Y=W.getParameters().item;if(Y){X=Y.getKey();}}if(X){this.setCurrentVariantKey(X);this.fireEvent("select",{key:X});this.oVariantPopOver.close();}}.bind(this)});this._oVariantList.setNoDataText(this._oRb.getText("VARIANT_MANAGEMENT_NODATA"));var e=new sap.ui.core.Item({key:'{'+this._sModelName+">key}",text:'{'+this._sModelName+">title}"});this._oVariantList.bindAggregation("items",{path:"variants",model:this._sModelName,template:e});this._oSearchField=new S(this.getId()+"-search");this._oSearchField.attachLiveChange(function(W){this._triggerSearch(W,this._oVariantList);}.bind(this));this.oVariantSelectionPage=new h(this.getId()+"-selpage",{subHeader:new i({content:[this._oSearchField]}),content:[this._oVariantList],footer:new s({content:[new j(this.getId()+"-spacer"),this.oVariantSaveBtn,this.oVariantSaveAsBtn,this.oVariantManageBtn]}),showNavButton:false,showHeader:false,showFooter:{path:"/editable",model:U.INNER_MODEL_NAME}});this.oVariantPopOver=new q(this.getId()+"-popover",{title:{path:"/popoverTitle",model:U.INNER_MODEL_NAME},titleAlignment:"Auto",contentWidth:"400px",placement:A.VerticalPreferredBottom,content:[this.oVariantSelectionPage],afterOpen:function(){this.bPopoverOpen=true;this.oVariantPopoverTrigger.setPressed(true);}.bind(this),afterClose:function(){this.oVariantPopoverTrigger.setPressed(false);if(this.bPopoverOpen){setTimeout(function(){this.bPopoverOpen=false;}.bind(this),200);}}.bind(this),contentHeight:"300px"});this.oVariantPopOver.addStyleClass("sapUiFlVarMngmtPopover");if(this.oVariantLayout.$().closest(".sapUiSizeCompact").length>0){this.oVariantPopOver.addStyleClass("sapUiSizeCompact");}this.addDependent(this.oVariantPopOver);};U.prototype.showSaveButton=function(e){if(e===false){this.oVariantSaveAsBtn.setType(z.Emphasized);this.oVariantSaveBtn.setVisible(false);}else{this.oVariantSaveAsBtn.setType(z.Default);this.oVariantSaveBtn.setVisible(true);}};U.prototype._openVariantList=function(){var e;if(this.getInErrorState()){this._openInErrorState();return;}if(this.bPopoverOpen){return;}if(!this.oContext){return;}this._createVariantList();this._oSearchField.setValue("");this._oVariantList.getBinding("items").filter(this._getFilters());this.oVariantSelectionPage.setShowSubHeader(this._oVariantList.getItems().length>9);this.showSaveButton(false);if(this.getModified()){e=this._getItemByKey(this.getCurrentVariantKey());if(e&&e.change){this.showSaveButton(true);}}var W=this._oCtrlRef?this._oCtrlRef:this.oVariantLayout;this._oCtrlRef=null;this.oVariantPopOver.openBy(W);};U.prototype._triggerSearch=function(e,W){if(!e){return;}var X=e.getParameters();if(!X){return;}var Y=X.newValue?X.newValue:"";var Z=new F({path:"title",operator:a.Contains,value1:Y});W.getBinding("items").filter(this._getFilters(Z));};U.prototype._createSaveAsDialog=function(){if(!this.oSaveAsDialog){this.oInputName=new o(this.getId()+"-name",{liveChange:function(){this._checkVariantNameConstraints(this.oInputName);}.bind(this)});var e=new L(this.getId()+"-namelabel",{text:this._oRb.getText("VARIANT_MANAGEMENT_NAME")});e.setLabelFor(this.oInputName);e.addStyleClass("sapUiFlVarMngmtSaveDialogLabel");this.oDefault=new m(this.getId()+"-default",{text:this._oRb.getText("VARIANT_MANAGEMENT_SETASDEFAULT"),visible:{path:"/showSetAsDefault",model:U.INNER_MODEL_NAME},width:"100%"});this.oExecuteOnSelect=new m(this.getId()+"-execute",{text:this._oRb.getText("VARIANT_MANAGEMENT_EXECUTEONSELECT"),visible:{path:"/showExecuteOnSelection",model:U.INNER_MODEL_NAME},width:"100%"});this.oInputManualKey=new o(this.getId()+"-key",{liveChange:function(){this._checkVariantNameConstraints(this.oInputManualKey);}.bind(this)});this.oLabelKey=new L(this.getId()+"-keylabel",{text:this._oRb.getText("VARIANT_MANAGEMENT_KEY"),required:true});this.oLabelKey.setLabelFor(this.oInputManualKey);this.oSaveSave=new k(this.getId()+"-variantsave",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),type:z.Emphasized,press:function(){if(!this._bSaveOngoing){this._checkVariantNameConstraints(this.oInputName);if(this.oInputName.getValueState()==="Error"){return;}this._bSaveOngoing=true;this._bSaveCanceled=false;this._handleVariantSaveAs(this.oInputName.getValue());}}.bind(this),enabled:true});var W=new G({defaultSpan:"L12 M12 S12"});if(this.getShowSetAsDefault()){W.addContent(this.oDefault);}if(this._getShowExecuteOnSelection()){W.addContent(this.oExecuteOnSelect);}this.oSaveAsDialog=new n(this.getId()+"-savedialog",{title:this._oRb.getText("VARIANT_MANAGEMENT_SAVEDIALOG"),afterClose:function(){this._bSaveOngoing=false;if(this._sStyleClass){this.oSaveAsDialog.removeStyleClass(this._sStyleClass);this._sStyleClass=undefined;}}.bind(this),beginButton:this.oSaveSave,endButton:new k(this.getId()+"-variantcancel",{text:this._oRb.getText("VARIANT_MANAGEMENT_CANCEL"),press:this._cancelPressed.bind(this)}),content:[e,this.oInputName,this.oLabelKey,this.oInputManualKey,W],stretch:D.system.phone});this.oSaveAsDialog.isPopupAdaptationAllowed=function(){return false;};this.oSaveAsDialog.addStyleClass("sapUiContentPadding");this.oSaveAsDialog.addStyleClass("sapUiFlVarMngmtSaveDialog");if(this.oVariantLayout.$().closest(".sapUiSizeCompact").length>0){this.oSaveAsDialog.addStyleClass("sapUiSizeCompact");}this.addDependent(this.oSaveAsDialog);}};U.prototype._cancelPressed=function(){this._bSaveCanceled=true;this.fireCancel();this.oSaveAsDialog.close();};U.prototype.openSaveAsDialogForKeyUser=function(e){this._openSaveAsDialog(e);this.oSaveAsDialog.addStyleClass(e);this._sStyleClass=e;};U.prototype._openSaveAsDialog=function(){this._createSaveAsDialog();this.oInputName.setValue(this.getSelectedVariantText(this.getCurrentVariantKey()));this.oInputName.setEnabled(true);this.oInputName.setValueState(N.None);this.oInputName.setValueStateText(null);this.oDefault.setSelected(false);this.oExecuteOnSelect.setSelected(false);if(this.oVariantPopOver){this.oVariantPopOver.close();}if(this.getManualVariantKey()){this.oInputManualKey.setVisible(true);this.oInputManualKey.setEnabled(true);this.oInputManualKey.setValueState(N.None);this.oInputManualKey.setValueStateText(null);this.oLabelKey.setVisible(true);}else{this.oInputManualKey.setVisible(false);this.oLabelKey.setVisible(false);}this.oSaveAsDialog.open();};U.prototype._handleVariantSaveAs=function(e){var W=null;var X=e.trim();var Y=this.oInputManualKey.getValue().trim();if(X===""){this.oInputName.setValueState(N.Error);this.oInputName.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));return;}if(this.getManualVariantKey()){if(Y===""){this.oInputManualKey.setValueState(N.Error);this.oInputManualKey.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));return;}W=Y;}if(this.oSaveAsDialog){this.oSaveAsDialog.close();}if(this.oDefault.getSelected()){this.setDefaultVariantKey(W);}this.setModified(false);this.fireSave({key:W,name:X,overwrite:false,def:this.oDefault.getSelected(),execute:this.oExecuteOnSelect.getSelected()});};U.prototype._handleVariantSave=function(){var e=this._getItemByKey(this.getCurrentVariantKey());var W=false;if(this.getDefaultVariantKey()===e.key){W=true;}if(this.oVariantPopOver){this.oVariantPopOver.close();}this.fireSave({name:e.title,overwrite:true,key:e.key,def:W});this.setModified(false);};U.prototype.openManagementDialog=function(e,W){if(e&&this.oManagementDialog){this.oManagementDialog.destroy();this.oManagementDialog=undefined;}this._openManagementDialog(W);};U.prototype._triggerSearchInManageDialog=function(e,W){if(!e){return;}var X=e.getParameters();if(!X){return;}var Y=X.newValue?X.newValue:"";var Z=[this._getVisibleFilter(),new F({filters:[new F({path:"title",operator:a.Contains,value1:Y}),new F({path:"author",operator:a.Contains,value1:Y})],and:false})];W.getBinding("items").filter(Z);this._bDeleteOccured=true;};U.prototype.getManageDialog=function(){return this.oManagementDialog;};U.prototype._createManagementDialog=function(){if(!this.oManagementDialog||this.oManagementDialog.bIsDestroyed){this.oManagementTable=new g(this.getId()+"-managementTable",{contextualWidth:"Auto",growing:true,columns:[new f({width:"3rem",visible:{path:"showFavorites",model:this._sModelName}}),new f({header:new T({text:this._oRb.getText("VARIANT_MANAGEMENT_NAME")}),width:"14rem"}),new f({header:new T({text:this._oRb.getText("VARIANT_MANAGEMENT_DEFAULT"),wrappingType:"Hyphenated"}),hAlign:Q.Begin,demandPopin:true,popinDisplay:E.Block,minScreenWidth:M.Tablet,visible:{path:"/showSetAsDefault",model:U.INNER_MODEL_NAME}}),new f({header:new T({text:this._oRb.getText("VARIANT_MANAGEMENT_EXECUTEONSELECT"),wrappingType:"Hyphenated"}),hAlign:Q.Center,demandPopin:true,popinDisplay:E.Block,minScreenWidth:M.Tablet,visible:{path:"/showExecuteOnSelection",model:U.INNER_MODEL_NAME}}),new f({header:new T({text:this._oRb.getText("VARIANT_MANAGEMENT_AUTHOR")}),demandPopin:true,popinDisplay:E.Block,minScreenWidth:M.Tablet}),new f({hAlign:Q.Center}),new f({visible:false})]});this.oManagementSave=new k(this.getId()+"-managementsave",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),enabled:true,type:z.Emphasized,press:function(){this._handleManageSavePressed();}.bind(this)});this.oManagementCancel=new k(this.getId()+"-managementcancel",{text:this._oRb.getText("VARIANT_MANAGEMENT_CANCEL"),press:function(){this._resumeManagementTableBinding();this.oManagementDialog.close();this._handleManageCancelPressed();}.bind(this)});this.oManagementDialog=new n(this.getId()+"-managementdialog",{contentWidth:"64%",resizable:true,draggable:true,title:this._oRb.getText("VARIANT_MANAGEMENT_MANAGEDIALOG"),beginButton:this.oManagementSave,endButton:this.oManagementCancel,content:[this.oManagementTable],stretch:D.system.phone});this.oManagementDialog.isPopupAdaptationAllowed=function(){return false;};this._oSearchFieldOnMgmtDialog=new S();this._oSearchFieldOnMgmtDialog.attachLiveChange(function(W){this._triggerSearchInManageDialog(W,this.oManagementTable);}.bind(this));var e=new B(this.getId()+"-mgmHeaderSearch",{contentMiddle:[this._oSearchFieldOnMgmtDialog]});this.oManagementDialog.setSubHeader(e);if(this.oVariantLayout.$().closest(".sapUiSizeCompact").length>0){this.oManagementDialog.addStyleClass("sapUiSizeCompact");}this.addDependent(this.oManagementDialog);this.oManagementTable.bindAggregation("items",{path:"variants",model:this._sModelName,factory:this._templateFactoryManagementDialog.bind(this),filters:this._getVisibleFilter()});this._bDeleteOccured=false;}};U.prototype._setFavoriteIcon=function(e,W){if(e){e.setSrc(W?"sap-icon://favorite":"sap-icon://unfavorite");e.setTooltip(this._oRb.getText(W?"VARIANT_MANAGEMENT_FAV_DEL_TOOLTIP":"VARIANT_MANAGEMENT_FAV_ADD_TOOLTIP"));e.setAlt(this._oRb.getText(W?"VARIANT_MANAGEMENT_FAV_DEL_ACC":"VARIANT_MANAGEMENT_FAV_ADD_ACC"));}};U.prototype._templateFactoryManagementDialog=function(e,W){var X=null;var Y;var Z;var $;var _;var a1=W.getObject();if(!a1){return undefined;}var b1=function(j1){this._checkVariantNameConstraints(j1.oSource,j1.oSource.getBindingContext(this._sModelName).getObject().key);}.bind(this);var c1=function(j1){this._handleManageTitleChanged(j1.oSource.getBindingContext(this._sModelName).getObject());}.bind(this);var d1=function(j1){if(j1.getParameters().selected===true){this._handleManageDefaultVariantChange(j1.oSource,j1.oSource.getBindingContext(this._sModelName).getObject());}}.bind(this);var e1=function(j1){this._handleManageExecuteOnSelectionChanged(j1.oSource.getBindingContext(this._sModelName).getObject());}.bind(this);var f1=function(j1){this._handleManageDeletePressed(j1.oSource.getBindingContext(this._sModelName).getObject());var k1=j1.oSource.getParent();if(k1){k1.setVisible(false);}this._reCheckVariantNameConstraints();}.bind(this);var g1=function(j1){this._handleManageFavoriteChanged(j1.oSource,j1.oSource.getBindingContext(this._sModelName).getObject());}.bind(this);if(a1.rename){$=new o({liveChange:b1,change:c1,value:'{'+this._sModelName+">title}"});}else{$=new O({title:'{'+this._sModelName+">title}"});if(X){$.setTooltip(X);}}Y=new k({icon:"sap-icon://decline",enabled:true,type:z.Transparent,press:f1,tooltip:this._oRb.getText("VARIANT_MANAGEMENT_DELETE"),visible:a1.remove});this._assignColumnInfoForDeleteButton(Y);Z=this.oContext.getPath();var h1=new c({src:{path:"favorite",model:this._sModelName,formatter:function(j1){return j1?"sap-icon://favorite":"sap-icon://unfavorite";}},tooltip:{path:'favorite',model:this._sModelName,formatter:function(j1){return this._oRb.getText(j1?"VARIANT_MANAGEMENT_FAV_DEL_TOOLTIP":"VARIANT_MANAGEMENT_FAV_ADD_TOOLTIP");}.bind(this)},press:g1});h1.addStyleClass("sapUiFlVarMngmtFavColor");if(this.getDisplayTextForExecuteOnSelectionForStandardVariant()&&(this.getStandardVariantKey()===a1.key)){_=new T({text:this.getDisplayTextForExecuteOnSelectionForStandardVariant(),textAlign:"Center"});}else{_=new m({select:e1,selected:'{'+this._sModelName+">executeOnSelect}"});}var i1=new d({cells:[h1,$,new R({groupName:this.getId(),select:d1,selected:{path:Z+"/defaultVariant",model:this._sModelName,formatter:function(j1){return a1.key===j1;}}}),_,new T({text:'{'+this._sModelName+">author}",textAlign:"Begin"}),Y,new T({text:'{'+this._sModelName+">key}"})]});return i1;};U.prototype._openManagementDialog=function(e){this._createManagementDialog();if(this.oVariantPopOver){this.oVariantPopOver.close();}this._suspendManagementTableBinding();this._clearDeletedItems();this._oSearchFieldOnMgmtDialog.setValue("");if(this._bDeleteOccured){this._bDeleteOccured=false;this.oManagementTable.bindAggregation("items",{path:"variants",model:this._sModelName,factory:this._templateFactoryManagementDialog.bind(this),filters:this._getVisibleFilter()});}if(e){this.oManagementDialog.addStyleClass(e);}this.oManagementDialog.open();};U.prototype._assignColumnInfoForDeleteButton=function(e){if(!this._oInvisibleDeleteColumnName){this._oInvisibleDeleteColumnName=new I({text:this._oRb.getText("VARIANT_MANAGEMENT_ACTION_COLUMN")});this.oManagementDialog.addContent(this._oInvisibleDeleteColumnName);}if(this._oInvisibleDeleteColumnName){e.addAriaLabelledBy(this._oInvisibleDeleteColumnName);}};U.prototype._handleManageDefaultVariantChange=function(e,W){var X=W.key;if(this.getShowFavorites()&&!W.favorite&&e){W.favorite=true;this._setFavoriteIcon(e.getParent().getCells()[U.COLUMN_FAV_IDX],true);}this.setDefaultVariantKey(X);};U.prototype._handleManageCancelPressed=function(){var e;var W;this._getDeletedItems().forEach(function(X){X.visible=true;});this._getItems().forEach(function(X){X.title=X.originalTitle;X.favorite=X.originalFavorite;X.executeOnSelection=X.originalExecuteOnSelection;});e=this.getOriginalDefaultVariantKey();if(e!==this.getDefaultVariantKey()){this.setDefaultVariantKey(e);}W=this.getModel(this._sModelName);if(W){W.checkUpdate();}};U.prototype._handleManageFavoriteChanged=function(e,W){if((this.getDefaultVariantKey()===W.key)&&W.favorite){return;}W.favorite=!W.favorite;this._setFavoriteIcon(e,W.favorite);};U.prototype._getRowForKey=function(e){var W=null;if(this.oManagementTable){this.oManagementTable.getItems().some(function(X){if(e===X.getCells()[0].getBindingContext(this._sModelName).getObject().key){W=X;}return W!==null;}.bind(this));}return W;};U.prototype._handleManageDeletePressed=function(e){var W;var X=e.key;if(this.oManagementTable.getItems().length===1){return;}e.visible=false;this._addDeletedItem(e);if((X===this.getDefaultVariantKey())){this.setDefaultVariantKey(this.getStandardVariantKey());if(this.getShowFavorites()){var Y=this._getItemByKey(this.getStandardVariantKey());if(Y&&!Y.favorite){var Z=this._getRowForKey(this.getStandardVariantKey());if(Z){Y.favorite=true;this._setFavoriteIcon(Z.getCells()[U.COLUMN_FAV_IDX],true);}}}}W=this.getModel(this._sModelName);if(W){W.checkUpdate();}this.oManagementCancel.focus();};U.prototype._handleManageExecuteOnSelectionChanged=function(){};U.prototype._handleManageTitleChanged=function(){};U.prototype._handleManageSavePressed=function(){if(this._anyInErrorState(this.oManagementTable)){return;}this._getDeletedItems().some(function(e){if(e.key===this.getCurrentVariantKey()){var W=this.getStandardVariantKey();this.setModified(false);this.setCurrentVariantKey(W);this.fireEvent("select",{key:W});return true;}return false;}.bind(this));this.fireManage();this._resumeManagementTableBinding();this.oManagementDialog.close();};U.prototype._resumeManagementTableBinding=function(){if(this.oManagementTable){var e=this.oManagementTable.getBinding("items");if(e){e.resume();}}};U.prototype._suspendManagementTableBinding=function(){if(this.oManagementTable){var e=this.oManagementTable.getBinding("items");if(e){e.suspend();}}};U.prototype._anyInErrorState=function(e){var W;var X;var Y=false;if(e){W=e.getItems();W.some(function(Z){X=Z.getCells()[U.COLUMN_NAME_IDX];if(X&&X.getValueState&&(X.getValueState()===N.Error)){Y=true;}return Y;});}return Y;};U.prototype._getFilters=function(e){var W=[];if(e){W.push(e);}W.push(this._getVisibleFilter());if(this.getShowFavorites()){W.push(this._getFilterFavorites());}return W;};U.prototype._getVisibleFilter=function(){return new F({path:"visible",operator:a.EQ,value1:true});};U.prototype._getFilterFavorites=function(){return new F({path:"favorite",operator:a.EQ,value1:true});};U.prototype._verifyVariantNameConstraints=function(e,W){if(!e){return;}var X=e.getValue();X=X.trim();if(!this._checkIsDuplicate(X,W)){if(X===""){e.setValueState(N.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));}else if(X.indexOf('{')>-1){e.setValueState(N.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_NOT_ALLOWED_CHAR",["{"]));}else if(X.length>U.MAX_NAME_LEN){e.setValueState(N.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_MAX_LEN",[U.MAX_NAME_LEN]));}else{e.setValueState(N.None);e.setValueStateText(null);}}else{e.setValueState(N.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE"));}};U.prototype._checkVariantNameConstraints=function(e,W){this._verifyVariantNameConstraints(e,W);if(this.oManagementDialog&&this.oManagementDialog.isOpen()){this._reCheckVariantNameConstraints();}};U.prototype._reCheckVariantNameConstraints=function(){var e;var W=false;if(this.oManagementTable){e=this.oManagementTable.getItems();e.some(function(X){var Y=X.getBindingContext(this._sModelName).getObject();if(Y&&Y.visible){var Z=X.getCells()[U.COLUMN_NAME_IDX];if(Z&&Z.getValueState&&(Z.getValueState()===N.Error)){this._verifyVariantNameConstraints(Z,Y.key);if(Z.getValueState()===N.Error){W=true;}}}return W;}.bind(this));}return W;};U.prototype._checkIsDuplicate=function(e,W){if(this.oManagementDialog&&this.oManagementDialog.isOpen()){return this._checkIsDuplicateInManageTable(e,W);}return this._checkIsDuplicateInModel(e,W);};U.prototype._checkIsDuplicateInModel=function(e,W){var X=false;var Y=this._getItems();var Z=e.toLowerCase();Y.some(function($){if($.title.toLowerCase()===Z){if(W&&(W===$.key)){return false;}X=true;}return X;});return X;};U.prototype._checkIsDuplicateInManageTable=function(e,W){var X;var Y=false;var Z=e.toLowerCase();if(this.oManagementTable){X=this.oManagementTable.getItems();X.some(function($){var _;var a1=$.getBindingContext(this._sModelName).getObject();if(a1&&a1.visible){var b1=$.getCells()[U.COLUMN_NAME_IDX];if(b1&&(a1.key!==W)){if(b1.isA("sap.m.Input")){_=b1.getValue().toLowerCase();}else{_=b1.getTitle().toLowerCase();}if(_===Z){Y=true;}}}return Y;}.bind(this));}return Y;};U.prototype.exit=function(){var e;if(this.oVariantInvisibleText){this.oVariantInvisibleText.destroy(true);this.oVariantInvisibleText=undefined;}if(this.oDefault&&!this.oDefault._bIsBeingDestroyed){this.oDefault.destroy();}this.oDefault=undefined;if(this.oExecuteOnSelect&&!this.oExecuteOnSelect._bIsBeingDestroyed){this.oExecuteOnSelect.destroy();}this.oExecuteOnSelect=undefined;this._oRb=undefined;this.oContext=undefined;this._oVariantList=undefined;this.oVariantSelectionPage=undefined;this.oVariantLayout=undefined;this.oVariantText=undefined;this.oVariantModifiedText=undefined;this.oVariantPopoverTrigger=undefined;this._oSearchField=undefined;this._oSearchFieldOnMgmtDialog=undefined;e=this.getModel(U.INNER_MODEL_NAME);if(e){e.destroy();}if(this._sStyleClass){this._sStyleClass=undefined;}};return U;});
