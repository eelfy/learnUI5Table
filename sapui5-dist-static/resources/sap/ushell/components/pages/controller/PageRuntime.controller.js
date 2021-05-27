//Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/library","sap/ushell/library","sap/ui/core/mvc/Controller","sap/ui/events/KeyCodes","sap/m/GenericTile","sap/ushell/resources","sap/ui/model/json/JSONModel","sap/ushell/Config","sap/m/library","sap/m/MessageToast","sap/ushell/components/pages/StateManager","sap/ushell/EventHub","sap/ushell/utils","sap/m/Button","sap/base/strings/capitalize","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(c,u,C,K,G,r,J,a,l,M,s,E,U,B,b,F,d){"use strict";var I=c.InvisibleMessageMode;var L=l.LoadState;var D=u.DisplayFormat;return C.extend("sap.ushell.components.pages.controller.Pages",{onInit:function(){var p=a.last("/core/shell/enablePersonalization");this._oVisualizationInstantiationServicePromise=sap.ushell.Container.getServiceAsync("VisualizationInstantiation");this._oURLParsingService=sap.ushell.Container.getServiceAsync("URLParsing");this._oViewSettingsModel=new J({sizeBehavior:a.last("/core/home/sizeBehavior"),actionModeActive:false,showHideButton:a.last("/core/catalog/enableHideGroups"),personalizationEnabled:p,showPageTitle:false});this.getView().setModel(this._oViewSettingsModel,"viewSettings");this._aConfigListeners=a.on("/core/home/sizeBehavior").do(function(S){this._oViewSettingsModel.setProperty("/sizeBehavior",S);}.bind(this));this._oErrorPageModel=new J({icon:"sap-icon://documents",text:"",description:"",details:""});this.getView().setModel(this._oErrorPageModel,"errorPage");this.oInitFinishedPromise=Promise.all([this._oVisualizationInstantiationServicePromise,this.getOwnerComponent().getPagesService()]).then(function(S){this._oVisualizationInstantiationService=S[0];this.getView().setModel(S[1].getModel());}.bind(this));this.sCurrentTargetPageId="";this._openFLPPage();var R=sap.ushell.Container.getRenderer();this.oContainerRouter=R.getRouter();this.oContainerRouter.getRoute("home").attachMatched(this._onPageComponentNavigation,this);this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._onPageComponentNavigation,this);this.bIsHomeIntentRootIntent=U.isFlpHomeIntent(R.getShellConfig().rootIntent);this.oErrorPage=this.byId("errorPage");this.oPagesNavContainer=this.byId("pagesNavContainer");this.oPagesRuntimeNavContainer=this.byId("pagesRuntimeNavContainer");s.init(this.oPagesRuntimeNavContainer,this.oPagesNavContainer);this.oEventHubListener=E.once("PagesRuntimeRendered").do(function(){if(p){this._createActionModeButton();}E.emit("firstSegmentCompleteLoaded",true);}.bind(this));this._oEventBus=sap.ui.getCore().getEventBus();this._oEventBus.subscribe("launchpad","shellFloatingContainerIsDocked",this._handleUshellContainerDocked,this);this._oEventBus.subscribe("launchpad","shellFloatingContainerIsUnDocked",this._handleUshellContainerDocked,this);this.oVisualizationInstantiationListener=E.on("VizInstanceLoaded").do(function(){this._setPerformanceMark();if(!this.oVisualizationInstantiationListenerTimeout){this.oVisualizationInstantiationListenerTimeout=setTimeout(function(){this.oVisualizationInstantiationListener.off();}.bind(this),5000);}}.bind(this));},_onPageComponentNavigation:function(){this._openFLPPage();var A=sap.ui.getCore().byId("ActionModeBtn");if(A&&!this.bIsHomeIntentRootIntent){var R=sap.ushell.Container.getRenderer("fiori2");if(R.getShellConfig().moveEditHomePageActionToShellHeader){R.showHeaderEndItem(A.getId(),true);}else{R.showActionButton(A.getId(),true);}}},_setPerformanceMark:function(){U.setPerformanceMark("FLP-TTI-Homepage",{bUseUniqueMark:true,bUseLastMark:true});},_getPageAndSpaceId:function(){return this._oURLParsingService.then(function(e){var h=e.parseShellHash(window.hasher.getHash());var i={semanticObject:h.semanticObject||"",action:h.action||""};var H=h.params||{};var p=H.pageId||[];var S=H.spaceId||[];return this._parsePageAndSpaceId(p,S,i);}.bind(this));},_parsePageAndSpaceId:function(p,e,i){if(p.length<1&&e.length<1){if(i.semanticObject==="Shell"&&i.action==="home"){return this._getUserDefaultPage();}return Promise.reject(r.i18n.getText("PageRuntime.NoPageIdAndSpaceIdProvided"));}if(p.length===1&&e.length===0){return Promise.reject(r.i18n.getText("PageRuntime.OnlyPageIdProvided"));}if(p.length===0&&e.length===1){return Promise.reject(r.i18n.getText("PageRuntime.OnlySpaceIdProvided"));}if(p.length>1||e.length>1){return Promise.reject(r.i18n.getText("PageRuntime.MultiplePageOrSpaceIdProvided"));}if(p[0]===""){return Promise.reject(r.i18n.getText("PageRuntime.InvalidPageId"));}if(e[0]===""){return Promise.reject(r.i18n.getText("PageRuntime.InvalidSpaceId"));}return Promise.resolve({pageId:p[0],spaceId:e[0]});},_getUserDefaultPage:function(){return sap.ushell.Container.getServiceAsync("Menu").then(function(m){return m.getSpacesPagesHierarchy();}).then(function(S){if(S.spaces.length===0){return Promise.reject(r.i18n.getText("PageRuntime.NoAssignedSpace"));}var o=S.spaces.find(function(e){return(!!(e.id&&e.pages&&e.pages[0]&&e.pages[0].id));});if(!o){return Promise.reject(r.i18n.getText("PageRuntime.NoAssignedPage"));}return{spaceId:o.id,pageId:o.pages[0].id};});},_openFLPPage:function(){var p,S;return this._getPageAndSpaceId().then(function(i){p=i.pageId;S=i.spaceId;this.sCurrentTargetPageId=p;return this.oInitFinishedPromise.then(function(){return this.getOwnerComponent().getPagesService();}.bind(this)).then(function(e){return e.loadPage(p);}).then(function(){this._showActionModeButton();if(this.sCurrentTargetPageId===p){return this._navigate(p,S);}return Promise.resolve();}.bind(this)).then(this._notifyOnPageRuntimeRendered).catch(function(e){if(e instanceof Error){this._oErrorPageModel.setProperty("/text",r.i18n.getText("PageRuntime.GeneralError.Text"));}else{var f=r.i18n.getText("PageRuntime.CannotLoadPage.Description")+JSON.stringify(e);this._oErrorPageModel.setProperty("/icon","sap-icon://documents");this._oErrorPageModel.setProperty("/text",r.i18n.getText("PageRuntime.CannotLoadPage.Text",[p,S]));this._oErrorPageModel.setProperty("/description","");this._oErrorPageModel.setProperty("/details",f);}this.oPagesRuntimeNavContainer.to(this.oErrorPage);this._hideActionModeButton();this._cancelActionMode();this._notifyOnPageRuntimeRendered();}.bind(this));}.bind(this)).catch(function(e){this._oErrorPageModel.setProperty("/icon","sap-icon://documents");this._oErrorPageModel.setProperty("/text",e||"");this._oErrorPageModel.setProperty("/description","");this._oErrorPageModel.setProperty("/details","");this.oPagesRuntimeNavContainer.to(this.oErrorPage);this._hideActionModeButton();this._cancelActionMode();this._notifyOnPageRuntimeRendered();}.bind(this));},_navigate:function(t,e){var p=this.oPagesNavContainer.getPages().find(function(o){return t===o.data("pageId");});if(!p){return Promise.reject();}return sap.ushell.Container.getServiceAsync("Menu").then(function(m){return m.hasMultiplePages(e);}).then(function(h){var S=this.oPagesNavContainer.getCurrentPage()===p;this._oViewSettingsModel.setProperty("/showPageTitle",h);this.oPagesNavContainer.to(p);this.oPagesRuntimeNavContainer.to(this.oPagesNavContainer);if(!S){this._cancelActionMode();}}.bind(this));},_notifyOnPageRuntimeRendered:function(){E.emit("PagesRuntimeRendered");if(E.last("AppRendered")!==undefined){E.emit("AppRendered",undefined);}},_pressViewDetailsButton:function(){var e=this._oErrorPageModel.getProperty("/details")||"";this._oErrorPageModel.setProperty("/description",e);},_copyToClipboard:function(){var t=document.createElement("textarea");try{t.contentEditable=true;t.readonly=false;t.textContent=this._oErrorPageModel.getProperty("/description");document.documentElement.appendChild(t);t.select();document.execCommand("copy");M.show(r.i18n.getText("PageRuntime.CannotLoadPage.CopySuccess"),{closeOnBrowserNavigation:false});}catch(e){M.show(r.i18n.getText("PageRuntime.CannotLoadPage.CopyFail"),{closeOnBrowserNavigation:false});}finally{t.parentNode.removeChild(t);}},_visualizationFactory:function(i,e){if(this._oVisualizationInstantiationService){var o=e.getObject();var p=e.getPath();var S=p.replace(/\/visualizations\/\d*\/?$/,"");var f=e.getModel().getProperty(S);var v=e.getModel().getProperty("/vizTypes/"+o.vizType);var V=this._oVisualizationInstantiationService.instantiateVisualization(o,v);V.attachPress(this.onVisualizationPress,this);V.bindEditable("viewSettings>/actionModeActive");if(!f.default){this._addTileActions(V);}var P=e.getPath().split("/")[2];var A=!!s.getPageVisibility("/pages/"+P);V.setActive(A);return V;}return new G({state:L.Failed});},_addTileActions:function(v){var A=v.getAvailableDisplayFormats();for(var i=0;i<A.length;i++){v.addTileAction(new B({text:r.i18n.getText("VisualizationInstance.ConvertTo"+b(A[i])+"Action"),press:[A[i],this._updateVisualizationDisplayFormat,this]}));}v.addTileAction(new B({text:r.i18n.getText("moveTileDialog_action"),press:[v,this._openMoveVisualizationDialog,this]}));},_openMoveVisualizationDialog:function(e,v){this._oVizInstanceToBeMoved=v;var V=v.getBindingContext().getPath();var f=V.split("/");var g="/pages/"+f[2]+"/sections";if(!this._oMoveVisualizationDialog){sap.ui.require(["sap/ui/core/Fragment"],function(h){h.load({name:"sap.ushell.components.pages.MoveVisualization",controller:this}).then(function(o){this._oMoveVisualizationDialog=o;this.getView().addDependent(o);o.bindObject({path:g});o.open();}.bind(this));}.bind(this));}else{this._oMoveVisualizationDialog.bindObject({path:g});this._oMoveVisualizationDialog.open();}},_confirmSelect:function(e){var o=new F("default",d.EQ,false);var i=e.getSource().getBinding("items");i.filter([o]);var v=this._oVizInstanceToBeMoved.getBindingContext().getPath();var V=v.split("/");var p=V[2];var f=V[4];var g=V[6];var t=e.getParameter("selectedItem").getBindingContext().getPath();var T=t.split("/");var h=T[4];var S=this._getAncestorControl(this._oVizInstanceToBeMoved,"sap.ushell.ui.launchpad.Section");var P=this._getAncestorControl(this._oVizInstanceToBeMoved,"sap.ushell.ui.launchpad.Page");var j=P.getSections();var k=j[h];var A=S.getItemPosition(this._oVizInstanceToBeMoved).area;this._oVizInstanceToBeMoved=null;var m=this.getOwnerComponent();return m.getPagesService().then(function(n){return n.moveVisualization(p,f,g,h,-1);}).then(function(R){var n=k.getVisualizations()[R.visualizationIndex];if(n){k.focusVisualization(n);}var q=this._getVizMoveAnnouncement(A,A);m.getInvisibleMessageInstance().announce(q,I.Polite);}.bind(this));},_onMoveTileSearch:function(e){var v=e.getParameter("value");var f=new F("title",d.Contains,v);var o=new F("default",d.EQ,false);var g=e.getParameter("itemsBinding");g.filter([f,o]);},_onMoveTileDialogClose:function(e){this._oVizInstanceToBeMoved=null;var o=new F("default",d.EQ,false);e.getSource().getBinding("items").filter([o]);},_updateVisualizationDisplayFormat:function(e,n){var o=e.getSource().getBindingContext();var p=o.getPath();var P=p.split("/");var O;var f=this.getOwnerComponent();return f.getPagesService().then(function(g){O=g.getModel().getProperty(p).displayFormatHint;var v={displayFormatHint:n};return g.updateVisualization(P[2],P[4],P[6],v);}).then(function(){var i=this._getVizMoveAnnouncement(O,n);f.getInvisibleMessageInstance().announce(i,I.Polite);}.bind(this));},onVisualizationPress:function(e){var S=e.getParameter("scope");var A=e.getParameter("action");var v=e.getSource();var o=v.getBindingContext();var p=o.getPath();var P=p.split("/");var f=this._getAncestorControl(v,"sap.ushell.ui.launchpad.Section");if(S==="Actions"&&A==="Remove"){return this.getOwnerComponent().getPagesService().then(function(g){var O=f.getItemPosition(v);g.deleteVisualization(P[2],P[4],P[6]);M.show(r.i18n.getText("PageRuntime.MessageToast.TileRemoved"));f._focusItem(O);});}return Promise.resolve();},onExit:function(){this.oContainerRouter.getRoute("home").detachMatched(this._openFLPPage,this);this.oContainerRouter.getRoute("openFLPPage").detachMatched(this._openFLPPage,this);this._aConfigListeners.off();this.oEventHubListener.off();this._oEventBus.unsubscribe("launchpad","shellFloatingContainerIsDocked",this._handleUshellContainerDocked,this);this._oEventBus.unsubscribe("launchpad","shellFloatingContainerIsUnDocked",this._handleUshellContainerDocked,this);s.exit();var A=sap.ui.getCore().byId("ActionModeBtn");if(A){A.destroy();}},_hideActionModeButton:function(){var A=sap.ui.getCore().byId("ActionModeBtn");if(A){A.setVisible(false);}},_showActionModeButton:function(){var A=sap.ui.getCore().byId("ActionModeBtn");if(A){A.setVisible(true);}},_createActionModeButton:function(){var A={id:"ActionModeBtn",text:r.i18n.getText("PageRuntime.EditMode.Activate"),tooltip:r.i18n.getText("PageRuntime.EditMode.Activate"),icon:"sap-icon://edit",press:[this.pressActionModeButton,this]};var R=sap.ushell.Container.getRenderer("fiori2");var m=R.getShellConfig().moveEditHomePageActionToShellHeader;if(m){this._createHeaderActionModeButton(A);}else{this._createUserActionModeButton(A);}},_createHeaderActionModeButton:function(A){sap.ui.require(["sap/ushell/ui/shell/ShellHeadItem"],function(S){var t=new S(A);if(a.last("/core/extension/enableHelp")){t.addStyleClass("help-id-ActionModeBtn");}var R=sap.ushell.Container.getRenderer("fiori2");if(this.bIsHomeIntentRootIntent){R.showHeaderEndItem(t.getId(),false,["home"]);}else{R.showHeaderEndItem(t.getId(),true);}}.bind(this));},_createUserActionModeButton:function(A){var o={controlType:"sap.ushell.ui.launchpad.ActionItem",oControlProperties:A,bIsVisible:true,aStates:["home"]};if(!this.bIsHomeIntentRootIntent){o.aStates=null;o.bCurrentState=true;}sap.ushell.Container.getRenderer("fiori2").addUserAction(o).done(function(e){if(a.last("/core/extension/enableHelp")){e.addStyleClass("help-id-ActionModeBtn");}});},pressActionModeButton:function(){var A=this.getView().getModel("viewSettings").getProperty("/actionModeActive");sap.ui.require(["sap/ushell/components/pages/ActionMode"],function(e){if(A){e.cancel();}else{e.start(this);}}.bind(this));},_cancelActionMode:function(){var A=this.getView().getModel("viewSettings").getProperty("/actionModeActive");if(A){sap.ui.require(["sap/ushell/components/pages/ActionMode"],function(e){e.cancel();});}},handleEditModeAction:function(h,e,S,p){sap.ui.require(["sap/ushell/components/pages/ActionMode"],function(A){A[h](e,S,p);});},_getAncestorControl:function(e,f){if(e&&e.isA&&e.isA(f)){return e;}else if(e&&e.getParent){return this._getAncestorControl(e.getParent(),f);}return null;},moveVisualization:function(e){var o=e.getParameter("draggedControl"),f=e.getParameter("droppedControl"),g=e.getParameter("dropPosition"),h=e.getParameter("browserEvent"),k=h&&h.keyCode,p=this._getAncestorControl(o,"sap.ushell.ui.launchpad.Page"),P=parseInt(o.getBindingContext().getPath().split("/")[2],10),i=this._getAncestorControl(o,"sap.ushell.ui.launchpad.Section"),j=p.indexOfSection(i),m=i.indexOfVisualization(o),n=i.getVisualizations()[m],q=i.getItemPosition(n),t,T,v,w,x;if(!f){var y=e.mParameters.browserEvent.keyCode===K.ARROW_UP,S=p.getSections();T=j;while(true){T=y?--T:++T;t=S[T];if(!t||t.getDefault()){n.invalidate();return Promise.resolve();}if(t.getShowSection()||t.getEditable()){v=t.getClosestCompactItemIndex(o.getDomRef(),y);w=t.getVisualizations()[v];x=t.getItemPosition(w);if(x.area!==q.area){x=q;}break;}}}else{if(f.isA("sap.ushell.ui.launchpad.section.CompactArea")){var z=f.getItems();if(z.length){f=z[z.length-1];g="After";}}t=this._getAncestorControl(f,"sap.ushell.ui.launchpad.Section");T=p.indexOfSection(t);if(t.getDefault()&&!i.getDefault()){n.invalidate();return Promise.resolve();}v=t.indexOfVisualization(f);w=t.getVisualizations()[v];x=t.getItemPosition(w);if(x.index===-1){x.area=q.area;}if(j===T){if(g==="Before"&&m<v){v--;}else if(g==="After"&&m>v){v++;}if(m===v&&x.area===q.area){n.invalidate();return Promise.resolve();}}else if(g==="After"){v++;}}if((j!==T)&&(k===K.ARROW_UP||k===K.ARROW_DOWN)&&(q.index>x.index)){v++;}var A;var H=this.getOwnerComponent();return H.getPagesService().then(function(N){A=N;A.enableImplicitSave(false);return A.moveVisualization(P,j,m,T,v);}).then(function(R){v=R.visualizationIndex;if(q.area!==x.area){var V={displayFormatHint:x.area};return A.updateVisualization(P,T,v,V);}return Promise.resolve();}).then(function(){return A.savePersonalization();}).then(function(){var V=t.getVisualizations()[v];if(V){t.focusVisualization(V);V.invalidate();}var N=this._getVizMoveAnnouncement(q.area,x.area);H.getInvisibleMessageInstance().announce(N,I.Polite);}.bind(this)).finally(function(){A.enableImplicitSave(true);});},_getVizMoveAnnouncement:function(f,t){if(f===t){if(t===D.Compact){return r.i18n.getText("PageRuntime.Message.LinkMoved");}return r.i18n.getText("PageRuntime.Message.TileMoved");}else if(f===D.Compact){return r.i18n.getText("PageRuntime.Message.LinkConverted");}return r.i18n.getText("PageRuntime.Message.TileConverted");},onDragEnter:function(e){var t=e.getParameter("dragSession").getDropControl();if(t.getDefault()){e.preventDefault();}},onAreaDragEnter:function(e){var S=e.getParameter("sourceArea");var t=e.getParameter("targetArea");if(S===t){return;}var v=e.getParameter("dragControl");var A=v.getAvailableDisplayFormats();if(A.indexOf(t)===-1){e.getParameter("originalEvent").preventDefault();}},_handleUshellContainerDocked:function(e,f){this._oViewSettingsModel.setProperty("/ushellContainerDocked",f==="shellFloatingContainerIsDocked");}});});
