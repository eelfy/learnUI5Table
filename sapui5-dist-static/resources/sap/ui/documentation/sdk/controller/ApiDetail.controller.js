/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/CustomData","sap/ui/documentation/sdk/controller/util/ControlsInfo","sap/ui/documentation/sdk/util/ToggleFullScreenHandler","sap/ui/documentation/sdk/controller/util/APIInfo","sap/ui/documentation/sdk/model/formatter","sap/ui/core/mvc/XMLView","sap/ui/core/library","sap/base/Log"],function(B,J,C,c,T,A,f,X,d,L){"use strict";return B.extend("sap.ui.documentation.sdk.controller.ApiDetail",{NOT_AVAILABLE:'N/A',NOT_FOUND:'Not found',onInit:function(){this.getRouter().getRoute("apiSpecialRoute").attachPatternMatched(this._onTopicMatched,this);this._oModel=new J();this._oModel.setSizeLimit(10000);this._oContainerPage=this.getView().byId("apiDetailPageContainer");},_onTopicMatched:function(e){var a,o;a=this.getRouter()._decodeSpecialRouteArguments(e);o=this.getOwnerComponent();if(this._sTopicid===a.id){return;}this._sTopicid=a.id;this._sEntityType=a.entityType;this._sEntityId=a.entityId;if(this._oView&&!this._oView.bIsDestroyed){this._oView.destroy();this._oContainerPage.setBusy(true);}o.loadVersionInfo().then(function(){this._aAllowedMembers=this.getModel("versionData").getProperty("/allowedMembers");}.bind(this)).then(A.getIndexJsonPromise).then(this._processApiIndexAndLoadApiJson.bind(this)).then(this._findEntityInApiJsonData.bind(this)).then(this._addMissingNodesToControlData.bind(this)).then(this._buildBorrowedModel.bind(this)).then(this._createModelAndSubView.bind(this)).then(this._initSubView.bind(this)).catch(function(r){if(r===this.NOT_FOUND){this._oContainerPage.setBusy(false);this.onRouteNotFound();}else if(typeof r==="string"){L.error(r);}else if(r.name){L.error(r.name,r.message);}else if(r.message){L.error(r.message);}}.bind(this));},_initSubView:function(v){var o=v.getController();if(v.data("topicid")!==this._sTopicid){v.destroy();return;}this._oView=v;this._oContainerPage.addContent(v);this._oContainerPage.setBusy(false);o.initiate({sTopicId:this._sTopicid,oModel:this._oModel,aApiIndex:this._aApiIndex,aAllowedMembers:this._aAllowedMembers,oEntityData:this._oEntityData,sEntityType:this._sEntityType,sEntityId:this._sEntityId,oOwnerComponent:this.getOwnerComponent(),oContainerView:this.getView(),oContainerController:this});},_createModelAndSubView:function(b){this._oControlData.borrowed=b;this._bindData(this._sTopicid);return X.create({height:"100%",customData:new C({key:"topicid",value:this._sTopicid}),viewName:"sap.ui.documentation.sdk.view.SubApiDetail",async:true,preprocessors:{xml:{models:{data:this._oModel}}}});},_buildBorrowedModel:function(o){this._oControlData=o;return this.buildBorrowedModel(o);},_addMissingNodesToControlData:function(o){var l,n,N,s,e;if(this._oEntityData.kind==="namespace"){e=Array.isArray(this._oEntityData.nodes)&&this._oEntityData.nodes;l=Array.isArray(o.nodes)&&o.nodes;if(e&&l&&e.length>l.length){l.sort(this._compareStringsCaseInsensitive);e.forEach(function(a,i){n=a.name;s=l[i]&&l[i].name;if(n!==s){N={};N.name=n;N.description="";N.href="api/"+n;if(a.deprecated){N.deprecated=true;}l.splice(i,0,N);}});}}return o;},_compareStringsCaseInsensitive:function(a,b){var l=a.name.toLowerCase(),e=b.name.toLowerCase();if(l<e){return-1;}if(l>e){return 1;}return 0;},_filterEntityByVisibilityInApiJsonData:function(l){var v=this.getModel("versionData"),i=v.getProperty("/isInternal");if(!i){l=(l||[]).filter(function(n){return!n.hasOwnProperty('visibility')||n.visibility!=='restricted';});}return l;},_findEntityInApiJsonData:function(l){var o,a,i;for(i=0,a=l.length;i<a;i++){o=l[i];if(o.name===this._sTopicid){if(o.visibility===undefined||this._aAllowedMembers.indexOf(o.visibility)>=0){return o;}else{return Promise.reject(this.NOT_FOUND);}}}return Promise.reject(this.NOT_FOUND);},_processApiIndexAndLoadApiJson:function(D){var e,m,t=this._sTopicid;this._aApiIndex=D;function b(a){return a.some(function(o){var F=o.name===t;if(!F&&o.nodes){return b(o.nodes);}else if(F){e=o;return true;}return false;});}b(D);if(e){this._oEntityData=e;if(e.deprecated||e.bAllContentDeprecated){m=this.getOwnerComponent().getConfigUtil().getMasterView("apiId").getController();m.selectDeprecatedSymbol(this._sTopicid);}e.nodes=this._filterEntityByVisibilityInApiJsonData(e.nodes);return A.getLibraryElementsJSONPromise(e.lib).then(function(D){return Promise.resolve(D);});}return Promise.reject(this.NOT_FOUND);},_bindData:function(t){var o=this._oControlData,m,u,s=function(a,b){a=a.toLowerCase();b=b.toLowerCase();if(a>b){return 1;}else if(a<b){return-1;}return 0;};u=o['ui5-metadata'];o.hasProperties=false;o.hasOwnMethods=false;o.hasControlProperties=false;o.hasAssociations=false;o.hasAggregations=false;o.hasSpecialSettings=false;o.hasAnnotations=false;var i=function(e){return(this._aAllowedMembers.indexOf(e.visibility)>=0);}.bind(this);var F=function(e){e.name&&(e.name=f.apiRefEntityName(e.name));e.code&&(e.code=f.apiRefEntityName(e.code));if(e.name){var p=e.name.replace(/[$#/]/g,".");e.placeholderId=p+"_method";e.subPlaceholderId=p+"__method";}return e;};if(o.borrowed.properties.length){u=u||(o['ui5-metadata']={});u.properties=(u.properties||[]).concat(o.borrowed.properties);}if(o.borrowed.aggregations.length){u=u||(o['ui5-metadata']={});u.aggregations=(u.aggregations||[]).concat(o.borrowed.aggregations);}if(o.borrowed.associations.length){u=u||(o['ui5-metadata']={});u.associations=(u.associations||[]).concat(o.borrowed.associations);}if(o.properties){o.properties=this.transformElements(o.properties,i,F);o.hasProperties=!!o.properties.length;}if(o.methods){o.methods=this.transformElements(o.methods,i,F);o.hasOwnMethods=!!o.methods.length;}if(u){o.dnd=u.dnd;o.hasControlProperties=!!(u.properties&&u.properties.length);o.hasAssociations=!!(u.associations&&u.associations.length);o.hasAggregations=!!(u.aggregations&&u.aggregations.length);o.hasSpecialSettings=!!(u.specialSettings&&u.specialSettings.length);o.hasAnnotations=!!(u.annotations&&u.annotations.length);if(o.hasControlProperties){u.properties=this.transformElements(u.properties,i).sort(function(a,b){return s(a.name,b.name);});}if(o.hasAssociations){u.associations=this.transformElements(u.associations,i).sort(function(a,b){return s(a.name,b.name);});}if(o.hasAggregations){u.aggregations=this.transformElements(u.aggregations,i).sort(function(a,b){return s(a.name,b.name);});o.hasAggregationAltTypes=u.aggregations.some(function(e){return!!e.altTypes;});}if(o.hasSpecialSettings){u.specialSettings=this.transformElements(u.specialSettings,i).sort(function(a,b){return s(a.name,b.name);});}if(o.hasAnnotations){u.annotations=(u.annotations).sort(function(a,b){return s(a.annotation,b.annotation);});}}o.nodes=this.transformElements(o.nodes||[],i).sort(function(a,b){return s(a.name,b.name);});o.hasChildren=o.nodes&&!!o.nodes.length;o.hasConstructor=o.hasOwnProperty("constructor")&&!!o.constructor;o.hasOwnEvents=!!o.events;o.hasEvents=!!(o.hasOwnEvents||(o.borrowed&&o.borrowed.events.length>0));o.hasMethods=!!(o.hasOwnMethods||(o.borrowed&&o.borrowed.methods.length>0));if(o.implements&&o.implements.length){o.implementsParsed=o.implements.map(function(a,b,e){var D=a.split("."),g=D[D.length-1];return{href:a,name:g};});o.hasImplementsData=true;}else{o.hasImplementsData=false;}o.isFunction=o.kind==="function";o.isClass=o.kind==="class";o.isNamespace=o.kind==="namespace";o.isDerived=!!o.extends;o.extendsText=o.extends||this.NOT_AVAILABLE;o.sinceText=o.since||this.NOT_AVAILABLE;o.module=o.module||this.NOT_AVAILABLE;this._oModel.setData(o);if(this.extHookbindData){this.extHookbindData(t,m);}},buildBorrowedModel:function(b){var e,g,h,j,k,s,l,m,M,p,P,n,q,r,t,I,R=[],S;if(!b){return Promise.resolve({events:[],methods:[],properties:[],aggregations:[],associations:[]});}l={methods:[],events:[],properties:[],aggregations:[],associations:[]};s=b.extends;var v=function(i){return this._aAllowedMembers.indexOf(i.visibility)!==-1;}.bind(this);m=b.methods||[];M=m.map(function(o){return o.name;});p=b["ui5-metadata"]&&b["ui5-metadata"].properties||[];P=p.map(function(o){return o.name;});n=b["ui5-metadata"]&&b["ui5-metadata"].aggregations||[];q=n.map(function(a){return a.name;});r=b["ui5-metadata"]&&b["ui5-metadata"].associations||[];t=r.map(function(a){return a.name;});var O=function(i){return M.indexOf(i.name)===-1;};var u=function(i){return P.indexOf(i.name)===-1&&!i.borrowedFrom&&!l.properties.some(function(o){return o.name===i.name;});};var w=function(i){return q.indexOf(i.name)===-1&&!i.borrowedFrom;};var x=function(i){return t.indexOf(i.name)===-1&&!i.borrowedFrom;};function y(a,i){S=null;return a.some(function(o){var F=o.name===i;if(!F&&o.nodes){return y(o.nodes,i);}else if(F){S=o;return true;}return false;});}I=[s];while(s){y(this._aApiIndex,s);if(S){s=S.extends;if(s){I.push(s);}if(R.indexOf(S.lib)===-1){R.push(S.lib);}}else{s=false;break;}}var z=R.map(function(a){return A.getLibraryElementsJSONPromise(a);});return Promise.all(z).then(function(a){var o=[],D;a.forEach(function(i){o=o.concat(i);});I.forEach(function(s){var E,i=o.length;while(i--){if(o[i].name===s){E=o[i];break;}}var F=function(K){return{name:K.name,link:"api/"+s+"#methods/"+K.name};};var G=function(K){return{name:K.name,link:"api/"+s+"#events/"+K.name};};var H=function(K){return Object.assign({},K,{borrowedFrom:s});};if(E){D=E["ui5-metadata"]||[];e=(E.methods||[]).filter(v).filter(O).map(F);if(e.length){l.methods.push({name:s,methods:e});}g=(E.events||[]).filter(v).map(G);if(g.length){l.events.push({name:s,events:g});}h=(D.properties||[]).filter(v).filter(u).map(H);if(h.length){l.properties=l.properties.concat(h);}j=(D.aggregations||[]).filter(v).filter(w).map(H);if(j.length){l.aggregations=l.aggregations.concat(j);}k=(D.associations||[]).filter(v).filter(x).map(H);if(k.length){l.associations=l.associations.concat(k);}}});return l;});},transformElements:function(e,F,a){var i,l=e.length,n=[],E;for(i=0;i<l;i++){E=e[i];if(F&&!F(E)){continue;}if(a){a(E);}n.push(E);}return n;}});});
