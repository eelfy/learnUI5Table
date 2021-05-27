sap.ui.define(["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ovp/cards/CommonUtils","sap/ui/Device","sap/ui/model/resource/ResourceModel","sap/ui/core/mvc/ViewType","sap/base/util/merge","sap/ovp/app/OVPUtils","sap/ovp/cards/ovpLogger","sap/ovp/cards/v4/V4AnnotationHelper"],function(U,J,C,D,R,V,m,O,o,a){"use strict";return U.extend("sap.ovp.cards.v4.generic.Component",{metadata:{properties:{"contentFragment":{"type":"string"},"controllerName":{"type":"string","defaultValue":"sap.ovp.cards.v4.generic.Card"},"headerExtensionFragment":{"type":"string"},"contentPosition":{"type":"string","defaultValue":"Middle"},"headerFragment":{"type":"string","defaultValue":"sap.ovp.cards.v4.generic.Header"},"footerFragment":{"type":"string"},"identificationAnnotationPath":{"type":"string","defaultValue":"com.sap.vocabularies.UI.v1.Identification"},"selectionAnnotationPath":{"type":"string"},"filters":{"type":"object"},"parameters":{"type":"object"},"addODataSelect":{"type":"boolean","defaultValue":false}},version:"1.88.0",library:"sap.ovp",includes:[],dependencies:{libs:[],components:[]},config:{}},setSelectionVariant:function(s,S){if(/^@/.test(s)){s=s.slice(1);}S.selectionAnnotationPath=s;},setPresentationVariant:function(p,s,e){if(/^@/.test(p)){p=p.slice(1);}s.presentationAnnotationPath=p;var b=p.split("/");var v=b.length===1?e[p].Visualizations:e[b[0]][b[1]][b[2]].Visualizations;var i;for(i=0;i<v.length;i++){var c=v[i].AnnotationPath;if(c){if(/^@/.test(c)){c=c.slice(1);}if(/.LineItem/.test(c)){s.annotationPath=c;break;}}}for(i=0;i<v.length;i++){var c=v[i].AnnotationPath;if(c){if(/^@/.test(c)){c=c.slice(1);}if(/.Chart/.test(c)){s.chartAnnotationPath=c;break;}}}},setDataPointAnnotationPath:function(d,s){if(/^@/.test(d)){d=d.slice(1);}s.dataPointAnnotationPath=d;},getCustomPreprocessor:function(){},getPreprocessors:function(p){var c=this.getComponentData(),s=c.settings,M=c.model,b,e,E,d;if(s.description&&!s.subTitle){s.subTitle=s.description;}b=M.getMetaModel();if(M&&M.getODataVersion){var f="/"+s.entitySet;var e=b.getObject(f);d=b.createBindingContext(f);E=b.createBindingContext("/"+e.$Type);}else{if(s.entitySet){var g=b.getODataEntitySet(s.entitySet);var h=b.getODataEntitySet(s.entitySet,true);e=b.getODataEntityType(g.entityType);d=b.createBindingContext(h);E=b.createBindingContext(e.$path);}}var j=this._getCardPropertyDefaults();var k=this._completeLayoutDefaults(j,s);var l,n;if(c.appComponent&&c.appComponent.getModel("ui")&&c.appComponent.getModel("ui").oData){var q=c.appComponent.getModel("ui").oData;l=q.showDateInRelativeFormat;n=q.disableTableCardFlexibility;}else{if(c.showDateInRelativeFormat){l=c.showDateInRelativeFormat;}if(c.disableTableCardFlexibility){n=c.disableTableCardFlexibility;}}var A={metaModel:b,entityType:e,webkitSupport:D.browser.webkit,layoutDetail:k&&k.cardLayout?k.cardLayout.containerLayout:'fixed',showDateInRelativeFormat:l,disableTableCardFlexibility:n,cardId:c.cardId};if(!!c&&!!c.cardId){var r=c.mainComponent;var t=null;if(!!r){t=r._getCardFromManifest(c.cardId)?r._getCardFromManifest(c.cardId).template:null;}else{t=c.template;}if(!!t){A.template=t;}}j.densityStyle=C._setCardpropertyDensityAttribute();if(c.errorReason){var u=c.errorReason;var P=u.getParameters?u.getParameters():u.mParameters;var v="sap-icon://message-error";if(P&&P.response){j.errorStatusCode=P.response.statusCode;j.errorStatusText=P.response.statusText;j.responseText=P.response.responseText;j.sMessageIcon=P.response.sIcon?P.response.sIcon:v;}}if(k){A.cardLayout=k.cardLayout;}if(j.state!=="Error"){if(s&&s.kpiAnnotationPath){var K=e[s.kpiAnnotationPath];var w=j.contentFragment;if(K&&(w==="sap.ovp.cards.v4.charts.analytical.analyticalChart"||w==="sap.ovp.cards.v4.charts.smart.analyticalChart")){var S=K.SelectionVariant&&K.SelectionVariant.Path?K.SelectionVariant.Path:s.kpiAnnotationPath+"/SelectionVariant";if(S){this.setSelectionVariant(S,s);}var x=K.Detail&&K.Detail.DefaultPresentationVariant&&K.Detail.DefaultPresentationVariant.Path?K.Detail.DefaultPresentationVariant.Path:s.kpiAnnotationPath+"/Detail/DefaultPresentationVariant";if(x){this.setPresentationVariant(x,s,e);}var y=K.DataPoint&&K.DataPoint.Path?K.DataPoint.Path:s.kpiAnnotationPath+"/DataPoint";if(y){this.setDataPointAnnotationPath(y,s);}}}else if(s&&s.selectionPresentationAnnotationPath){var z=e[s.selectionPresentationAnnotationPath];if(z){var S=z.SelectionVariant&&z.SelectionVariant.Path;if(S){this.setSelectionVariant(S,s);}var x=z.PresentationVariant&&z.PresentationVariant.Path;if(x){this.setPresentationVariant(x,s,e);}}}}if(c.ovpCardsAsApi&&s.ignoreSelectionVariant){s.selectionAnnotationPath="";var I=[];for(var B=0;!!s.filters&&B<s.filters.length;B++){I.push({id:"headerFilterText--"+(B+1),index:B});}s.idForExternalFilters=I;}if(!!A.entityType&&!!s.selectionAnnotationPath&&!!A.entityType[s.selectionAnnotationPath]){var F=A.entityType[s.selectionAnnotationPath].SelectOptions;for(var G=0;!!F&&G<F.length;G++){F[G].id="headerFilterText--"+(G+1);}A.entityType[s.selectionAnnotationPath].SelectOptions=F;}if(A.template==="sap.ovp.cards.v4.linklist"&&!!s.staticContent){for(var i=0;i<s.staticContent.length;i++){s.staticContent[i].id="linkListItem--"+(i+1);}}else if(A.template==='sap.ovp.cards.v4.charts.analytical'){s.dataStep=s.dataStep?s.dataStep:10;}j=O.merge(true,{},A,j,s);var H=new J(j);var L={xml:{bindingContexts:{entityType:E,entitySet:d},models:{device:C.deviceModel,entityType:b,entitySet:b,ovpMeta:b,ovpCardProperties:H,ovplibResourceBundle:p,ovpConstants:C.ovpConstantModel},ovpCardProperties:H,dataModel:M,_ovpCache:{}}};return m({},this.getCustomPreprocessor(),L);},_completeLayoutDefaults:function(c,s){var b={},d=this.getComponentData(),e=null,f=null;if(d.appComponent){e=d.appComponent.getOvpConfig();}if(!e){return null;}if(e.containerLayout==="resizable"&&d.cardId&&c.contentFragment!=="sap.ovp.cards.quickview.Quickview"){f=d.appComponent.getDashboardLayoutUtil();var g=d.cardId;var h=f.aCards.filter(function(i){return i.id===g;});b.cardLayout=h[0].dashboardLayout;b.cardLayout.containerLayout=e.containerLayout;b.cardLayout.iRowHeightPx=f.ROW_HEIGHT_PX;b.cardLayout.iCardBorderPx=f.CARD_BORDER_PX;b.cardLayout.headerHeight=h[0].dashboardLayout.headerHeight;}return b;},_getCardPropertyDefaults:function(){var c={};var p=this.getMetadata().getAllProperties();var P;for(var b in p){P=p[b];if(P.defaultValue!==undefined){c[P.name]=P.defaultValue;}}return c;},getOvplibResourceBundle:function(){if(!this.ovplibResourceBundle){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ovp");this.ovplibResourceBundle=r?new R({bundleUrl:r.oUrlInfo.url}):null;}return this.ovplibResourceBundle;},_getCacheKeys:function(){},createContent:function(){var c=this.getComponentData&&this.getComponentData();var M=c.model;var p;var P;var b=c&&c.mainComponent;var d=b&&b.oModelViewMap;var s=c&&c.modelName;var f=function(){if(M&&s){M.bIncludeInCurrentBatch=false;if(d&&s&&d[s]&&d[s][c.cardId]){delete d[s][c.cardId];if(Object.keys(d[s]).length>0){M.bIncludeInCurrentBatch=true;}}}};if(c&&c.mainComponent){p=c.mainComponent._getOvplibResourceBundle();}else{p=this.getOvplibResourceBundle();}P=this.getPreprocessors(p);var v={preprocessors:P,type:V.XML,viewName:"sap.ovp.cards.v4.generic.Card"};var e=this._getCacheKeys();if(e&&e.length&&e.length>0){v.async=true;v.cache={keys:e};}var l=this._getCardPropertyDefaults().state;var i=c.cardId+(l?l:"Original");if(!l){i=i+(c.settings.selectedKey?"_Tab"+c.settings.selectedKey:"");}if(M&&M.bUseBatch&&!v.async){f();}var g=new sap.ui.core.mvc.XMLView(c.containerId==="dialogCard"?undefined:i,v);if(v.async){var h=g.onControllerConnected;g.onControllerConnected=function(){if(M&&M.bUseBatch){f();}h.apply(g,arguments);};}g.setModel(M);if(c.i18n){g.setModel(c.i18n,"@i18n");}g.setModel(P.xml.ovpCardProperties,"ovpCardProperties");g.setModel(p,"ovplibResourceBundle");return g;}});});
