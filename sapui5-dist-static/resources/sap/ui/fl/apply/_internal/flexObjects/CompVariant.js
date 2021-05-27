/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/restricted/_pick","sap/ui/fl/Change","sap/ui/fl/Layer","sap/ui/fl/registry/Settings","sap/ui/fl/LayerUtils","sap/ui/fl/Utils"],function(_,C,L,S,a,U){"use strict";function i(A){var u=U.getUshellContainer();var o=u&&u.getUser();return!o||o.getId().toUpperCase()===A.toUpperCase();}function b(l,u){if(l===L.USER){return true;}var s=S.getInstanceOrUndef();var A;if(a.isSapUiLayerParameterProvided()){A=a.getCurrentLayer();}else{A=s.isPublicLayerAvailable()?L.PUBLIC:L.CUSTOMER;}var f=l===A;var g=s.isKeyUser()||i(u);return f&&g;}function c(o){if(!o){return false;}return U.getCurrentLanguage()!==o;}function d(s,f){var o=S.getInstanceOrUndef();if(!o){return true;}if(!s||!f){return true;}var g=o.getSystem();var h=o.getClient();return g===s&&f===h;}var e=C.extend("sap.ui.fl.apply._internal.flexObjects.Variant",{metadata:{properties:{favorite:{type:"boolean",defaultValue:false},executeOnSelection:{type:"boolean",defaultValue:false},contexts:{type:"object",defaultValue:{}}},aggregations:{revertInfo:{type:"sap.ui.fl.apply._internal.flexObjects.CompVariantRevertData",multiple:true,singularName:"revertInfo",defaultValue:[]}}},constructor:function(f){C.apply(this,arguments);if(f.content&&f.content.favorite){this.setFavorite(f.content.favorite);}if(f.content&&f.content.executeOnSelect){this.setExecuteOnSelection(f.content.executeOnSelect);}if(f.content&&f.content.executeOnSelection){this.setExecuteOnSelection(f.content.executeOnSelection);}if(f.contexts){this.setProperty("contexts",f.contexts);}}});e.prototype.isReadOnly=function(){return!d(this.getSourceSystem(),this.getSourceClient())||!b(this.getLayer(),this.getOwnerId());};e.prototype.isLabelReadOnly=function(){return this.isReadOnly()||c(this.getOriginalLanguage());};e.createInitialFileContent=function(p){var n=C.createInitialFileContent(p);n.contexts=p.contexts||{};return _(n,["changeType","namespace","service","content","reference","fileName","fileType","packageName","layer","favorite","executeOnSelect","selector","texts","support","contexts"]);};e.prototype.setContexts=function(m){this.setProperty("contexts",m);this._oDefinition.contexts=m;this.setState(C.states.DIRTY);};return e;});