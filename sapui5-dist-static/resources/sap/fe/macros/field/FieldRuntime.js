/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/ResourceModel","sap/fe/core/helpers/SideEffectsUtil","sap/base/Log","sap/fe/core/CommonUtils","sap/fe/macros/DelegateUtil","sap/ui/util/openWindow","sap/fe/macros/FieldAPI"],function(R,S,L,C,D,o,F){"use strict";function _(s,b){var B=s.getBindingContext(),m=B.getModel().getMetaModel(),M=m.getMetaPath(B.getPath()),e=m.getObject(M)["$Type"],c=B;if(b!==e){c=B.getBinding().getContext();if(c){M=m.getMetaPath(c.getPath());e=m.getObject(M)["$Type"];if(b!==e){c=c.getBinding().getContext();if(c){M=m.getMetaPath(c.getPath());e=m.getObject(M)["$Type"];if(b!==e){return undefined;}}}}}return c||undefined;}var a={formatDraftOwnerTextInPopover:function(h,d,s,b,c){if(h){var u=b||d||c||s;if(!u){return R.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_UNSAVED_CHANGES_BY_UNKNOWN");}else{return d?R.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_LOCKED_BY_KNOWN",u):R.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_UNSAVED_CHANGES_BY_KNOWN",u);}}else{return R.getText("M_FIELD_RUNTIME_DRAFT_POPOVER_NO_DATA_TEXT");}},onDataFieldWithNavigationPath:function(s,c,b){var B=s.getBindingContext();if(c.routing){c._routing.navigateToTarget(B,b);}else{L.error("FieldRuntime: No routing listener controller extension found. Internal navigation aborted.","sap.fe.macros.field.FieldRuntime","onDataFieldWithNavigationPath");}},_initSideEffectsQueue:function(c,b){this.sideEffectsRequestsQueue=this.sideEffectsRequestsQueue||{};this.sideEffectsRequestsQueue[c]=this.sideEffectsRequestsQueue[c]||{};this.sideEffectsRequestsQueue[c]["context"]=this.sideEffectsRequestsQueue[c]["context"]||b;this.sideEffectsRequestsQueue[c]["pathExpressions"]=this.sideEffectsRequestsQueue[c]["pathExpressions"]||[];if(this.aFailedSideEffects&&this.aFailedSideEffects[c]){this.sideEffectsRequestsQueue[c]["pathExpressions"]=this.sideEffectsRequestsQueue[c]["pathExpressions"].concat(this.aFailedSideEffects[c]["pathExpressions"]);delete this.aFailedSideEffects[c];}},_feedSideEffectsQueue:function(s,b,c){var t=this,B=c.getBindingContext(),m=B.getModel().getMetaModel(),d,p=[],P,q,e,Q,g=function(h){return h["$PropertyPath"];},G=function(h){return h["$NavigationPropertyPath"];},f=_(c,b);if(!f){return Promise.resolve();}d=f.getPath();p=p.concat(s.TargetProperties).concat(s.TargetEntities);p=S.addTextProperties(p,m,b);if(p.length){t._initSideEffectsQueue(d,f);q=t.sideEffectsRequestsQueue[d]["pathExpressions"].filter(g).map(g);Q=t.sideEffectsRequestsQueue[d]["pathExpressions"].filter(G).map(G);P=p.map(g).filter(function(h){return h&&q.indexOf(h)<0;}).map(function(h){return{"$PropertyPath":h};});e=p.map(G).filter(function(h){return(h||h==="")&&Q.indexOf(h)<0;}).map(function(h){return{"$NavigationPropertyPath":h};});p=P.concat(e);t.sideEffectsRequestsQueue[d]["pathExpressions"]=t.sideEffectsRequestsQueue[d]["pathExpressions"].concat(p);t.sideEffectsRequestsQueue[d]["triggerAction"]=s.TriggerAction;}return Promise.resolve();},prepareForSideEffects:function(f,s){var t=this,w=f.indexOf("#")>-1,b=(w&&f.split("#")[0])||f,q=(w&&f.split("#")[1])||"",c="/"+b+"@com.sap.vocabularies.Common.v1.SideEffects",B=s.getBindingContext(),m=B.getModel().getMetaModel(),d,c=(w&&c+"#"+q)||c;d=S.convertSideEffect(m.getObject(c));if(d&&t.aPendingSideEffects.indexOf(f)>-1){this._feedSideEffectsQueue(d,b,s);t.aPendingSideEffects.splice(t.aPendingSideEffects.indexOf(f),1);}return Promise.resolve();},prepareForAppSideEffects:function(s){var A,v=C.getTargetView(s);if(v){var c=v.getController(),e="/"+v.getViewData().entitySet+"/",b=v.getModel().getMetaModel().getObject(e+"$Type"),f=D.getCustomData(s,"sourcePath").replace(e,"");A=c.sideEffects.getEntitySideEffects(b)[f];if(A){this._feedSideEffectsQueue(A,b,s);}}return Promise.resolve(A);},requestSideEffects:function(){if(!this.sideEffectsRequestsQueue){return;}var t=this,s=this.sideEffectsRequestsQueue,b=this.oSideEffectQueuePromise||Promise.resolve(),T;this.sideEffectsRequestsQueue=null;return b.then(function(){var m=Object.keys(s).map(function(p){var c=s[p];S.logRequest(c);if(c.triggerAction){T=c.context.getModel().bindContext(c.triggerAction+"(...)",c.context);T.execute(c.context.getBinding().getUpdateGroupId());}return c["context"].requestSideEffects(c["pathExpressions"]).then(function(){},function(){L.info("FieldRuntime: Failed to request side effect - "+p,"sap.fe.macros.field.FieldRuntime","requestSideEffects");t.aFailedSideEffects[p]=c;});});t.oSideEffectQueuePromise=Promise.all(m);});},requestTextIfRequired:function(s){var A=s.getBindingInfo("additionalValue");if(!A){return;}if(s.getBinding("value").getPath()){var m=s.getModel().getMetaModel(),p=s.getBindingContext().getPath()+"/"+s.getBinding("value").getPath(),v=m.getValueListType(p);if(v==="Standard"||v==="Fixed"){return;}}var P=A.parts.map(function(b){return S.determinePathOrNavigationPath(b.path);}),c=s.getBindingContext();if(P.length){c.requestSideEffects(P).then(function(){}).catch(function(){L.info("FieldRuntime: Failed to request Text association - "+(P[0]&&P[0]["$PropertyPath"]),"sap.fe.macros.field.FieldRuntime","requestTextIfRequired");});}},hasTargets:function(s){return s?s:false;},handleChange:function(c,e){var t=this,s=e.getSource(),i=s&&s.getBindingContext().isTransient(),p=e.getParameter("promise")||Promise.resolve(),b=p,A=false,f=s.getFieldGroupIds()||[],d=e.getSource(),v=e.getParameter("valid");p.then(function(V){e.oSource=d;e.mParameters={valid:v};F.handleChange(e,c);}).catch(function(E){e.oSource=d;e.mParameters={valid:false};F.handleChange(e,c);});if(c.isA("sap.fe.templates.ExtensionAPI")){c._controller.editFlow.syncTask(p);}else{c.editFlow.syncTask(p);}if(i){return;}this.aPendingSideEffects=this.aPendingSideEffects||[];this.mFieldGroupResolves=this.mFieldGroupResolves||{};this.aFailedSideEffects=this.aFailedSideEffects||{};f.forEach(function(g){var I=g.indexOf("$$ImmediateRequest")>-1;if(I){A=true;g=g.substr(0,g.indexOf("$$ImmediateRequest"));}else if(t.mFieldGroupResolves.hasOwnProperty(g)){t.mFieldGroupResolves[g].push(p);}else{t.mFieldGroupResolves[g]=[p];}if(t.aPendingSideEffects.indexOf(g)===-1){t.aPendingSideEffects.push(g);}if(I){b=b.then(function(){return t.prepareForSideEffects(g,s);});}});b=b.then(function(){return t.prepareForAppSideEffects(s);}).then(function(g){if(g){A=true;}});b.then(function(){if(A){t.requestSideEffects();}}).catch(function(E){L.error("Error while processing side effects",E);});},handleSideEffect:function(e){if(!this.aPendingSideEffects||this.aPendingSideEffects.length===0){return;}var t=this,f=e.getParameter("fieldGroupIds"),s=e.getSource(),p=Promise.resolve();f=f||[];f.forEach(function(b){var c=[Promise.resolve()];if(t.mFieldGroupResolves&&t.mFieldGroupResolves[b]){c=t.mFieldGroupResolves[b];delete(t.mFieldGroupResolves&&t.mFieldGroupResolves[b]);}p=p.then(function(){return Promise.all(c);}).then(t.prepareForSideEffects.bind(t,b,s));});p.then(this.requestSideEffects.bind(this)).catch(function(E){L.error("Error while requesting side effects",E);});},handlePatchEvents:function(b){if(!b){return;}var t=this;b=(b.getBinding&&b.getBinding())||b;b.attachEvent("patchCompleted",function(e){if(e.getParameter("success")!==false&&t.aFailedSideEffects){Object.keys(t.aFailedSideEffects).forEach(function(c){t._initSideEffectsQueue(c,t.aFailedSideEffects[c]["context"]);});t.requestSideEffects();}});},formatWithBrackets:function(t,T){if(T){return t?t+" ("+T+")":T;}else{return t?t:"";}},formatWithPercentage:function(v){return v!==null&&v!==undefined?v+" %":"";},_fnSetFieldWidth:function(f){var b=function(f,A,v){var c=A?A.getDomRef():undefined;var w=0;if(c){w=parseInt(getComputedStyle(c).marginRight,10)+parseInt(getComputedStyle(c).marginLeft,10)+A.getDomRef().offsetWidth;}var V=v.getDomRef().offsetWidth;var i=V-w;f.getModel("internal").setProperty("/QuickViewLinkContainerWidth",i+"px");};var A=f.findElements(true,function(e){return e.isA("sap.m.Avatar");})[0];var v=f.findElements(true,function(e){return e.isA("sap.m.VBox");})[0];if(v.getDomRef().offsetWidth===0){v.onAfterRendering=function(){b(f,A,v);};}else{b(f,A,v);}},popoverAfterOpen:function(e){var l=e.getSource();if(l.getDependents()&&l.getDependents().length>0){var f=l.getDependents()[0];if(f&&f.isA("sap.m.ResponsivePopover")){a._fnSetFieldWidth(f);}}},pressLink:function(e){var l=e.getSource();if(l.getDependents()&&l.getDependents().length>0){var f=l.getDependents()[0];if(f&&f.isA("sap.ui.mdc.Link")){f.getTriggerHref().then(function(h){if(!h){f.open(l).then(function(){a._fnSetFieldWidth(f);}).catch(function(E){L.error("Cannot retrieve the QuickView Popover dialog",E);});}else{var v=sap.ui.fl.Utils.getViewForControl(l);var A=C.getAppComponent(v);var s=A.getShellServices();var b=s.parseShellHash(h);var n={target:{semanticObject:b.semanticObject,action:b.action},params:b.params};if(C.isStickyEditMode(l)!==true){s.toExternal(n,A);}else{var N=s.hrefForExternal(n,A,false);o(N);}}}).catch(function(E){L.error("Error triggering link Href",E);});}}}};return a;},true);