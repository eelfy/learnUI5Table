/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/cards/BaseContent","sap/ui/integration/util/BindingResolver","sap/ui/integration/library","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/base/Log"],function(B,a,l,F,b,L){"use strict";var c=B.extend("sap.ui.integration.cards.BaseListContent",{metadata:{library:"sap.ui.integration"},renderer:{apiVersion:2}});c.prototype.init=function(){B.prototype.init.apply(this,arguments);this._oAwaitingPromise=null;};c.prototype.exit=function(){B.prototype.exit.apply(this,arguments);this._oAwaitingPromise=null;};c.prototype.setConfiguration=function(C,t){B.prototype.setConfiguration.apply(this,arguments);if(!C){return this;}var o=this.getInnerList(),m=C.maxItems;if(o&&m){o.setGrowing(true);o.setGrowingThreshold(parseInt(m));o.addStyleClass("sapFCardMaxItems");}return this;};c.prototype.getInnerList=function(){return null;};c.prototype._filterHiddenNavigationItems=function(i,o){if(!i.actions){return;}var A=i.actions[0];if(!(A&&A.service&&A.type==="Navigation")){return;}var f=new F("_card_item_hidden",b.EQ,false);this._awaitEvent("_filterNavItemsReady");o.filters=[f];};c.prototype._checkHiddenNavigationItems=function(i){if(!i.actions){return;}if(!this.getInnerList()){return;}var o=this.getInnerList().getBinding("items"),m=o.getModel(),p=o.getPath(),I=m.getProperty(p),P=[],A=i.actions[0],s=p.trim().replace(/\/$/,""),d;if(!(A&&A.service&&A.type==="Navigation")){return;}if(A.service==="object"){d=A.service.name;}else{d=A.service;}I.forEach(function(e,f){var g=a.resolveValue(A.parameters,this,s+"/"+f);if(e._card_item_hidden===undefined){e._card_item_hidden=false;}P.push(this._oServiceManager.getService(d).then(function(n){if(!n.hidden){return false;}return n.hidden({parameters:g});}).then(function(h){e._card_item_hidden=!!h;m.checkUpdate(true);}).catch(function(M){L.error(M);}));}.bind(this));m.checkUpdate(true);this._awaitPromises(P);};c.prototype._awaitPromises=function(p){var d=this._oAwaitingPromise=Promise.all(p);d.then(function(){if(this._oAwaitingPromise===d){this.fireEvent("_filterNavItemsReady");}}.bind(this));};return c;});
