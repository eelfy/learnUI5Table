/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/registry/ChangeRegistry","sap/ui/fl/Utils","sap/ui/fl/Layer","sap/ui/fl/LayerUtils","sap/ui/fl/Change","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/write/_internal/Versions","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/controlVariants/URLHandler","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/util/reflection/XmlTreeModifier","sap/ui/core/Component","sap/base/Log"],function(C,U,L,a,b,c,V,d,A,R,e,J,X,f,g){"use strict";function r(o,i){return Promise.resolve().then(function(){if(i.length!==0){i.reverse();return R.revertMultipleChanges(i,{appComponent:o,modifier:J,flexController:this});}}.bind(this)).then(function(){if(o){var m=o.getModel(U.VARIANT_MODEL_NAME);if(m){i.forEach(function(k){var v=k.getVariantReference();if(v){m.removeChange(k);}});e.update({parameters:[],updateURL:true,updateHashEntry:true,model:m});}}return i;});}var F=function(s){this._oChangePersistence=undefined;this._sComponentName=s||"";if(this._sComponentName){this._createChangePersistence();}};F.prototype.getComponentName=function(){return this._sComponentName;};F.prototype.setVariantSwitchPromise=function(p){this._oVariantSwitchPromise=p;};F.prototype.waitForVariantSwitch=function(){if(!this._oVariantSwitchPromise){this._oVariantSwitchPromise=Promise.resolve();}return this._oVariantSwitchPromise;};F.prototype.createBaseChange=function(o,i){var k;var l;if(!i){throw new Error("No application component found. To offer flexibility a valid relation to its owning component must be present.");}o.reference=this.getComponentName();o.packageName="$TMP";k=b.createInitialFileContent(o);l=new b(k);if(o.variantReference){l.setVariantReference(o.variantReference);}return l;};F.prototype._createChange=function(o,i,k){var s=k&&(k.controlType||U.getControlType(k));var l=this.createBaseChange(o,i);return this._getChangeHandler(l,s,k,J).then(function(m){if(m){m.completeChangeContent(l,o,{modifier:J,appComponent:i,view:U.getViewForControl(k)});}else{throw new Error("Change handler could not be retrieved for change "+JSON.stringify(o)+".");}return l;}).catch(function(E){return Promise.reject(E);});};F.prototype.createChangeWithExtensionPointSelector=function(o,E){return Promise.resolve().then(function(){if(!E){throw new Error("A flexibility change on extension point cannot be created without a valid extension point reference.");}var v=E.view;var i=U.getAppComponentForControl(v);o.selector={name:E.name,viewSelector:J.getSelector(v.getId(),i)};return i;}).then(function(i){return this._createChange(o,i);}.bind(this));};F.prototype.createChangeWithControlSelector=function(o,i){var k;return new U.FakePromise().then(function(){if(!i){throw new Error("A flexibility change cannot be created without a targeted control.");}var s=i.id||i.getId();if(!o.selector){o.selector={};}k=i.appComponent||U.getAppComponentForControl(i);if(!k){throw new Error("No application component found. To offer flexibility, the control with the ID '"+s+"' has to have a valid relation to its owning application component.");}Object.assign(o.selector,J.getSelector(s,k));return k;}).then(function(k){return this._createChange(o,k,i);}.bind(this));};F.prototype.addChange=function(o,i){return this.createChangeWithControlSelector(o,i).then(function(k){var l=U.getAppComponentForControl(i);k._ignoreOnce=true;this.addPreparedChange(k,l);k.setQueuedForApply();return k;}.bind(this));};F.prototype.addPreparedChange=function(o,i){if(o.getVariantReference()){var m=i.getModel(U.VARIANT_MODEL_NAME);m.addChange(o);}this._oChangePersistence.addChange(o,i);return o;};F.prototype.deleteChange=function(o,i){this._oChangePersistence.deleteChange(o);if(o.getVariantReference()){i.getModel(U.VARIANT_MODEL_NAME).removeChange(o);}};F.prototype.applyChange=function(o,i){var p={modifier:J,appComponent:U.getAppComponentForControl(i),view:U.getViewForControl(i)};return A.applyChangeOnControl(o,i,p).then(function(k){if(!k.success){var E=k.error||new Error("The change could not be applied.");this._oChangePersistence.deleteChange(o,true);throw E;}return o;}.bind(this));};function h(o,D,m,k,l){var p=j(o,k);if(!p){return[];}l.push(o);var s=o.getId();var q=D[s]&&D[s].dependencies||[];for(var i=0,n=q.length;i<n;i++){var t=U.getChangeFromChangesMap(m,q[i]);p=h(t,D,m,k,l);if(p.length===0){l=[];break;}delete D[s];}return l;}function j(o,i){var s=o.getDependentControlSelectorList();s.push(o.getSelector());return!s.some(function(S){return!J.bySelector(S,i);});}F.prototype.waitForChangesToBeApplied=function(s){var S;if(Array.isArray(s)){S=s;}else{S=[s];}var p=S.map(function(v){return this._waitForChangesToBeApplied(v);}.bind(this));return Promise.all(p).then(function(){return undefined;});};F.prototype._waitForChangesToBeApplied=function(s){var o=s.id&&sap.ui.getCore().byId(s.id)||s;var m=this._oChangePersistence.getChangesMapForComponent();var p=[];var D=Object.assign({},m.mDependencies);var i=m.mChanges;var k=i[o.getId()]||[];var n=k.filter(function(t){return!t.isCurrentProcessFinished();},this);var l=s.appComponent||U.getAppComponentForControl(o);var q=[];n.forEach(function(t){var u=h(t,D,m.mChanges,l,[]);u.forEach(function(v){if(q.indexOf(v)===-1){q.push(v);}});});q.forEach(function(t){p=p.concat(t.addChangeProcessingPromises());},this);p.push(this.waitForVariantSwitch());return Promise.all(p);};F.prototype.saveAll=function(o,s,D){var n=D?V.getVersionsModel({reference:U.normalizeReference(this._sComponentName),layer:L.CUSTOMER}).getProperty("/persistedVersion"):undefined;return this._oChangePersistence.saveDirtyChanges(o,s,undefined,n).then(function(i){if(D&&i&&i.response){var v=i.response;if(Array.isArray(v)){v=v[0];}V.onAllChangesSaved({reference:v.reference,layer:v.layer});}return i;});};F.prototype.processXmlView=function(v,p){var o=f.get(p.componentId);var i=U.getAppComponentForControl(o);p.appComponent=i;p.modifier=X;p.view=v;return this._oChangePersistence.getChangesForView(p).then(A.applyAllChangesForXMLView.bind(A,p)).catch(this._handlePromiseChainError.bind(this,p.view));};F.prototype._handlePromiseChainError=function(v,E){g.error("Error processing view "+E+".");return v;};F.prototype._getChangeHandler=function(o,s,i,m){var k=o.getChangeType();var l=o.getLayer();return this._getChangeRegistry().getChangeHandler(k,s,i,m,l);};F.prototype._getChangeRegistry=function(){var i=C.getInstance();i.initSettings();return i;};F.prototype.getComponentChanges=function(p,i){return this._oChangePersistence.getChangesForComponent(p,i);};F.prototype.checkForOpenDependenciesForControl=function(s,o){return this._oChangePersistence.checkForOpenDependenciesForControl(s,o);};F.prototype._createChangePersistence=function(){this._oChangePersistence=c.getChangePersistenceForComponent(this.getComponentName());return this._oChangePersistence;};F.prototype.resetChanges=function(l,G,o,s,i){return this._oChangePersistence.resetChanges(l,G,s,i).then(r.bind(this,o));};F.prototype.removeDirtyChanges=function(l,o,i,G,k){return this._oChangePersistence.removeDirtyChanges(l,o,i,G,k).then(r.bind(this,o));};F.prototype.applyVariantChanges=function(i,o){var k;return i.reduce(function(p,l){return p.then(function(){var P={modifier:J,appComponent:o};this._oChangePersistence._addRunTimeCreatedChangeAndUpdateDependencies(o,l);k=P.modifier.bySelector(l.getSelector(),o);if(k){return A.applyChangeOnControl(l,k,P);}g.error("A flexibility change tries to change a nonexistent control.");}.bind(this));}.bind(this),new U.FakePromise());};F.prototype.saveSequenceOfDirtyChanges=function(D,o){return this._oChangePersistence.saveDirtyChanges(o,false,D);};F.prototype.getResetAndPublishInfo=function(p){p.reference=this._sComponentName;return this._oChangePersistence.getResetAndPublishInfo(p);};return F;},true);
