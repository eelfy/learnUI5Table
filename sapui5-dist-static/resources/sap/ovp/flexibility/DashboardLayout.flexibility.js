sap.ui.define(["sap/ovp/flexibility/changeHandler/CardChangeHandler","sap/ovp/flexibility/changeHandler/RemoveCardContainer","sap/ui/dt/OverlayRegistry","sap/ui/core/ComponentContainer","sap/m/MessageToast","sap/ovp/cards/rta/SettingsDialogConstants","sap/ovp/cards/SettingsUtils","sap/ovp/cards/CommonUtils","sap/ovp/app/resources","sap/base/util/merge"],function(C,R,O,a,M,S,b,c,d,m){"use strict";return{"moveControls":{"changeHandler":"default","layers":{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"unhideControl":C.UnhideControlConfig,"unhideCardContainer":C.UnhideCardContainer,"hideCardContainer":C.HideCardContainer,"removeCardContainer":R,"editCardSettings":{changeHandler:{applyChange:function(o,e,p){var f=p.appComponent.getRootControl(),g=f.getController(),h=o.getContent(),i=h.newAppDescriptor,j=f.byId(i.id),k=g.getLayout(),l=k.getDashboardLayoutModel(),L=k.getDashboardLayoutUtil(),n=l.getCardById(i.id),q=L.calculateCardProperties(i.id),N=i.settings.defaultSpan&&i.settings.defaultSpan.rows,r=i.settings.defaultSpan&&i.settings.defaultSpan.cols,s=l.getColCount()+1,t=[],F=false;o.setRevertData(h.oldAppDescriptor);if(j){if(i.settings.tabs){var D=i.settings.selectedKey;if(!D||D<1){D=1;}S.tabFields.forEach(function(v){var w=i.settings.tabs[D-1][v];if(v!=='entitySet'||(v==='entitySet'&&w)){delete i.settings[v];}if(w){i.settings[v]=w;}});}if(typeof N==='number'){if(N===0){n.dashboardLayout.showOnlyHeader=true;N=Math.ceil((q.headerHeight+2*L.CARD_BORDER_PX)/L.getRowHeightPx());}else{n.dashboardLayout.showOnlyHeader=false;if(i.template==='sap.ovp.cards.list'||i.template==='sap.ovp.cards.table'){n.dashboardLayout.noOfItems=N;}}}if(r){if(n.dashboardLayout.column+r>s){n.dashboardLayout.maxColSpan=r;r=s-n.dashboardLayout.column;}F=true;}if(F){l._arrangeCards(n,{row:N,column:r},'resize',t);l._removeSpaceBeforeCard(t);L._positionCards(l.aCards);F=false;}var u=j.getComponentInstance();u.destroy();}g.recreateRTAClonedCard(i);return true;},getCondenserInfo:function(o){return{affectedControl:o.getSelector(),classification:sap.ui.fl.condenser.Classification.LastOneWins,uniqueKey:o.getSelector().id+'-'+o.getDefinition().changeType};},revertChange:function(o,e,p){var f=p.appComponent.getRootControl(),g=f.getController(),h=o.getRevertData(),i=f.byId(h.id),j=g.getLayout(),l=j.getDashboardLayoutModel(),L=j.getDashboardLayoutUtil(),k=l.getCardById(h.id),n=h.settings.defaultSpan&&h.settings.defaultSpan.rowSpan,q=h.settings.defaultSpan&&h.settings.defaultSpan.colSpan,s=h.settings.defaultSpan&&h.settings.defaultSpan.showOnlyHeader,r=[];if(i){k.dashboardLayout.rowSpan=n;k.dashboardLayout.colSpan=q;k.dashboardLayout.showOnlyHeader=s;l._arrangeCards(k,{row:n,column:q},'resize',r);l._removeSpaceBeforeCard(r);L._positionCards(l.aCards);var t=i.getComponentInstance();t.destroy();}g.recreateRTAClonedCard(h);o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"newCardSettings":{changeHandler:{applyChange:function(o,e,p){var f=p.appComponent.getRootControl(),g=f.getController(),h=o.getContent();o.setRevertData(h.id);var n=new a(f.getId()+"--"+h.id),A=p.appComponent,u=g.getUIModel(),j=u.getProperty("/cards"),k=g.getLayout(),l=k.getDashboardLayoutUtil(),L=k.getDashboardLayoutModel(),N=(h.id.indexOf("newStaticLinkListCard_N")!==-1)&&!b.checkClonedCard(h.id),q=(h.id.indexOf("newKPICard_N")!==-1)&&!b.checkClonedCard(h.id),r=(h.id.indexOf("newCard_N")!==-1)&&!b.checkClonedCard(h.id),s=b.newDataSource;if(q){var t=h.settings.selectedKPI,v=new sap.ui.model.odata.v2.ODataModel(t.ODataURI,{'annotationURI':t.ModelURI,'defaultCountMode':sap.ui.model.odata.CountMode.None}),w=h.model;if(h.settings["sAnnoKey"]){b.setDataSources(h.settings["sAnnoKey"],t.ModelURI);}f.setModel(v,w);A.setModel(v,w);}if(s&&!A.getModel(h.model)){var x=new sap.ui.model.odata.v2.ODataModel(b.newDataSourceModel.serviceURI,{'annotationURI':b.newDataSourceModel.serviceAnnotationURI,'defaultCountMode':sap.ui.model.odata.CountMode.None}),w=h.model;b.setDataSources(b.newDataSourceModel.serviceAnnotation,b.newDataSourceModel.serviceAnnotationURI);f.setModel(x,w);A.setModel(x,w);}h.settings.baseUrl=g._getBaseUrl();if(N||q||r){h.settings.newCard=true;L._setCardSpanFromDefault(h);h.dashboardLayout.row=1;h.dashboardLayout.column=1;}else{h.settings.cloneCard=true;}var I=-1,i;for(i=0;i<j.length;i++){if(h.id.lastIndexOf(c._getLayerNamespace()+"."+j[i].id,0)===0){I=i;var y=L.getCardById(j[i].id);h.dashboardLayout=m({},y.dashboardLayout);var z=h.dashboardLayout.column+h.dashboardLayout.colSpan;h.dashboardLayout.column=z<L.getColCount()?z:1;break;}}j.splice(I+1,0,h);l.getCards().splice(I+1,0,h);u.setProperty("/cards",j);k.insertContent(n,I+1);setTimeout(function(){var B=O.getOverlay(n);B.setSelected(true);B.focus();var D=(N||q||r)?d.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_NEW"):d.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_CLONE");M.show(D,{duration:10000});},0);g.recreateRTAClonedCard(h);return true;},getCondenserInfo:function(o){return{affectedControl:o.getSelector(),classification:sap.ui.fl.condenser.Classification.LastOneWins,uniqueKey:o.getSelector().id+'-'+o.getDefinition().changeType};},revertChange:function(o,e,p){var f=p.appComponent.getRootControl(),A=p.appComponent,g=f.getController(),s=o.getRevertData(),h=o.getContent();var k=f.byId(s),u=g.getUIModel(),l=u.getProperty("/cards"),n=g.getLayout(),L=n.getDashboardLayoutUtil(),q=n.getDashboardLayoutModel(),r=L.getCards();var I=-1,i,j,t=-1;for(i=0;i<l.length;i++){if(s===l[i].id){I=i;break;}}l.splice(I,1);for(j=0;j<r.length;j++){if(s===r[j].id){t=j;break;}}r.splice(t,1);q._removeSpaceBeforeCard();u.setProperty("/cards",l);if(k){var v=k.getComponentInstance(),w=v.getComponentData(),N=(w.cardId.indexOf("newKPICard_N")!==-1)&&!b.checkClonedCard(s);if(N){var x=w.modelName,y=f.getModel(x);y.destroy();if(h.settings["sAnnoKey"]){b.removeDataSources(h.settings["sAnnoKey"]);}f.setModel(null,x);A.setModel(null,x);}v.destroy();}n.removeContent(I);k.destroy();o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"dragAndDropUI":{changeHandler:{applyChange:function(o,p,P){var e=P.appComponent.getRootControl().getController(),f=o.getContent(),g=e.getLayout(),l=g.getDashboardLayoutUtil(),L=g.getDashboardLayoutModel(),h=L.getCardById(f.cardId),s='C'+L.getColCount(),i=[];o.setRevertData(f);L._arrangeCards(h,{row:f.dashboardLayout[s].row,column:f.dashboardLayout[s].column},'drag',i);L._removeSpaceBeforeCard(i);l._positionCards(L.aCards);return true;},getCondenserInfo:function(o){return{affectedControl:o.getSelector(),classification:sap.ui.fl.condenser.Classification.LastOneWins,uniqueKey:o.getSelector().id+'-'+o.getDefinition().changeType};},revertChange:function(o,e,p){var f=p.appComponent.getRootControl().getController(),g=o.getContent(),h=f.getLayout(),l=h.getDashboardLayoutUtil(),L=h.getDashboardLayoutModel(),i=L.getCardById(g.cardId),s='C'+L.getColCount(),j=[];L._arrangeCards(i,{row:g.dashboardLayout[s].oldRow,column:g.dashboardLayout[s].oldColumn},'drag',j);if(g.dashboardLayout[s].oldColSpan){L._arrangeCards(i,{row:g.dashboardLayout[s].rowSpan,column:g.dashboardLayout[s].oldColSpan},'resize',j);}L._removeSpaceBeforeCard(j);l._positionCards(L.aCards);o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"viewSwitch":C.PersonalizationDefaultConfig,"visibility":C.PersonalizationDefaultConfig,"dragOrResize":C.PersonalizationDefaultConfig};},true);
