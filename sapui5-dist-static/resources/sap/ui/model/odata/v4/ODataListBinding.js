/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Context","./ODataParentBinding","./lib/_AggregationCache","./lib/_AggregationHelper","./lib/_Cache","./lib/_GroupLock","./lib/_Helper","./lib/_Parser","sap/base/Log","sap/base/util/uid","sap/ui/base/SyncPromise","sap/ui/model/Binding","sap/ui/model/ChangeReason","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/FilterProcessor","sap/ui/model/FilterType","sap/ui/model/ListBinding","sap/ui/model/Sorter","sap/ui/model/odata/OperationMode"],function(C,a,_,b,c,d,e,f,L,u,S,B,g,F,h,j,k,l,m,O){"use strict";var s="sap.ui.model.odata.v4.ODataListBinding",n={AggregatedDataStateChange:true,change:true,createCompleted:true,createSent:true,dataReceived:true,dataRequested:true,DataStateChange:true,patchCompleted:true,patchSent:true,refresh:true};var o=l.extend("sap.ui.model.odata.v4.ODataListBinding",{constructor:function(M,p,i,v,q,P){l.call(this,M,p);a.call(this);if(p.endsWith("/")){throw new Error("Invalid path: "+p);}P=e.clone(P)||{};this.checkBindingParameters(P,["$$aggregation","$$canonicalPath","$$groupId","$$operationMode","$$ownRequest","$$patchWithoutSideEffects","$$sharedRequest","$$updateGroupId"]);this.aApplicationFilters=e.toArray(q);this.sChangeReason=M.bAutoExpandSelect&&!P.$$aggregation?"AddVirtualContext":undefined;this.oDiff=undefined;this.aFilters=[];this.sGroupId=P.$$groupId;this.bHasAnalyticalInfo=false;this.oHeaderContext=this.bRelative?null:C.createNewContext(M,this,p);this.sOperationMode=P.$$operationMode||M.sOperationMode;this.mPreviousContextsByPath={};this.aPreviousData=[];this.bSharedRequest=P.$$sharedRequest||M.bSharedRequests;this.aSorters=e.toArray(v);this.sUpdateGroupId=P.$$updateGroupId;if(!this.sOperationMode&&(this.aSorters.length||this.aApplicationFilters.length)){throw new Error("Unsupported operation mode: "+this.sOperationMode);}this.applyParameters(P);if(!this.bRelative||i&&!i.fetchValue){this.createReadGroupLock(this.getGroupId(),true);}this.setContext(i);M.bindingCreated(this);}});a(o.prototype);o.prototype.attachCreateCompleted=function(i,p){this.attachEvent("createCompleted",i,p);};o.prototype.detachCreateCompleted=function(i,p){this.detachEvent("createCompleted",i,p);};o.prototype.attachCreateSent=function(i,p){this.attachEvent("createSent",i,p);};o.prototype.detachCreateSent=function(i,p){this.detachEvent("createSent",i,p);};o.prototype._delete=function(G,E,p,q){var D,r=false,P=p.iIndex===undefined?e.getRelativePath(p.getPath(),this.oHeaderContext.getPath()):String(p.iIndex),R=false,t=this;return this.deleteFromCache(G,E,P,q,function(I,v){var w,i,x,y,z;if(p.isKeepAlive()){p.resetKeepAlive();D=true;}if(p.created()){t.destroyCreated(p,true);r=true;}else if(I>=0){for(i=I;i<t.aContexts.length;i+=1){p=t.aContexts[i];if(p){t.mPreviousContextsByPath[p.getPath()]=p;}}y=t.getResolvedPath();t.aContexts.splice(I,1);for(i=I;i<t.aContexts.length;i+=1){if(t.aContexts[i]){z=i-t.iCreatedContexts;x=e.getPrivateAnnotation(v[i],"predicate");w=y+(x||"/"+z);p=t.mPreviousContextsByPath[w];if(p){delete t.mPreviousContextsByPath[w];if(p.iIndex===z){p.checkUpdate();}else{p.iIndex=z;}}else{p=C.create(t.oModel,t,w,z);}t.aContexts[i]=p;}}t.iMaxLength-=1;r=true;}else if(t.bLengthFinal){R=true;}}).then(function(){var i=t.iMaxLength;if(R){t.iMaxLength=t.fetchValue("$count",undefined,true).getResult()-t.iCreatedContexts;r=i!==t.iMaxLength;}if(r){t._fireChange({reason:g.Remove});}else if(D){delete t.mPreviousContextsByPath[p.getPath()];p.destroy();}});};o.prototype.adjustPredicate=function(t,p,i){var q=this;function r(v,N){var I=q.aPreviousData.indexOf(v);if(I>=0){q.aPreviousData[I]=N;}}if(i){i.adjustPredicate(t,p,r);}else{this.oHeaderContext.adjustPredicate(t,p);this.aContexts.forEach(function(i){i.adjustPredicate(t,p,r);});this.fetchCache(this.oContext);}};o.prototype.applyParameters=function(p,i){var A,q=this.mParameters&&this.mParameters.$$aggregation,r=this.mQueryOptions&&this.mQueryOptions.$apply;if("$$aggregation"in p){if("$apply"in p){throw new Error("Cannot combine $$aggregation and $apply");}A=b.buildApply(p.$$aggregation).$apply;}this.mQueryOptions=this.oModel.buildQueryOptions(p,true);this.mParameters=p;if(A){this.mQueryOptions.$apply=A;}if(i===""){if(this.mQueryOptions.$apply===r&&(!this.mParameters.$$aggregation||!q||e.deepEqual(this.mParameters.$$aggregation,q))){return;}i=this.bHasAnalyticalInfo?g.Change:g.Filter;}if(this.isRootBindingSuspended()){this.setResumeChangeReason(i);return;}this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(i);};o.prototype.attachEvent=function(E){if(!(E in n)){throw new Error("Unsupported event '"+E+"': v4.ODataListBinding#attachEvent");}return l.prototype.attachEvent.apply(this,arguments);};o.prototype._checkDataStateMessages=function(D,r){if(r){D.setModelMessages(this.oModel.getMessagesByPath(r,true));}};o.prototype.checkKeepAlive=function(i){if(this.isRelative()&&!this.mParameters.$$ownRequest){throw new Error("Missing $$ownRequest at "+this);}if(i===this.oHeaderContext){throw new Error("Unsupported header context "+i);}if(this.mParameters.$$aggregation){throw new Error("Unsupported $$aggregation at "+this);}};o.prototype.collapse=function(p){var q=this.aContexts,r=this.oCache.collapse(e.getRelativePath(p.getPath(),this.oHeaderContext.getPath())),M=p.getModelIndex(),i,t=this;if(r>0){q.splice(M+1,r).forEach(function(p){t.mPreviousContextsByPath[p.getPath()]=p;});for(i=M+1;i<q.length;i+=1){if(q[i]){q[i].iIndex=i;}}this.iMaxLength-=r;this._fireChange({reason:g.Change});}};o.prototype.create=function(i,p,A){var q,r=this.fetchResourcePath(),t,G,R=this.getResolvedPath(),T="($uid="+u()+")",v=R+T,w=this;if(!R){throw new Error("Binding is unresolved: "+this);}this.checkSuspended();A=!!A;if(A&&!(this.bLengthFinal||this.mParameters.$count)){throw new Error("Must know the final length to create at the end. Consider setting $count");}if(this.bCreatedAtEnd!==undefined&&this.bCreatedAtEnd!==A){throw new Error("Creating entities at the start and at the end is not supported.");}this.bCreatedAtEnd=A;G=this.lockGroup(undefined,true,true,function(){w.destroyCreated(q,true);return Promise.resolve().then(function(){w._fireChange({reason:g.Remove});});});t=this.createInCache(G,r,R,T,i,function(E){w.oModel.reportError("POST on '"+r+"' failed; will be repeated automatically",s,E);w.fireEvent("createCompleted",{context:q,success:false});},function(){w.fireEvent("createSent",{context:q});}).then(function(x){var y,P;if(!(i&&i["@$ui5.keepTransientPath"])){P=e.getPrivateAnnotation(x,"predicate");if(P){w.adjustPredicate(T,P,q);w.oModel.checkMessages();}}w.fireEvent("createCompleted",{context:q,success:true});if(!p){y=w.getGroupId();if(!w.oModel.isDirectGroup(y)&&!w.oModel.isAutoGroup(y)){y="$auto";}return w.refreshSingle(q,w.lockGroup(y));}},function(E){G.unlock(true);throw E;});this.iCreatedContexts+=1;q=C.create(this.oModel,this,v,-this.iCreatedContexts,t);this.aContexts.unshift(q);this._fireChange({reason:g.Add});return q;};o.prototype.createContexts=function(p,r){var q=false,t,v,i,w=r.$count,x,y=this.bLengthFinal,M=this.oModel,P=this.getResolvedPath(),z,A=p>this.aContexts.length,D=this;function E(){var i,N=D.iMaxLength+D.iCreatedContexts;if(N>=D.aContexts.length){return;}for(i=N;i<D.aContexts.length;i+=1){if(D.aContexts[i]){D.aContexts[i].destroy();}}while(N>0&&!D.aContexts[N-1]){N-=1;}D.aContexts.length=N;q=true;}for(i=p;i<p+r.length;i+=1){if(this.aContexts[i]===undefined&&r[i-p]){q=true;x=i-this.iCreatedContexts;z=e.getPrivateAnnotation(r[i-p],"predicate")||e.getPrivateAnnotation(r[i-p],"transientPredicate");v=P+(z||"/"+x);t=this.mPreviousContextsByPath[v];if(t&&(!t.created()||t.isTransient())){delete this.mPreviousContextsByPath[v];t.iIndex=x;t.checkUpdate();}else{t=C.create(M,this,v,x);}this.aContexts[i]=t;}}if(Object.keys(this.mPreviousContextsByPath).length){M.addPrerenderingTask(this.destroyPreviousContexts.bind(this));}if(w!==undefined){this.bLengthFinal=true;this.iMaxLength=w-this.iCreatedContexts;E();}else{if(!r.length){this.iMaxLength=p-this.iCreatedContexts;E();}else if(this.aContexts.length>this.iMaxLength+this.iCreatedContexts){this.iMaxLength=Infinity;}if(!(A&&r.length===0)){this.bLengthFinal=this.aContexts.length===this.iMaxLength+this.iCreatedContexts;}}if(this.bLengthFinal!==y){q=true;}return q;};o.prototype.destroy=function(){if(this.bHasAnalyticalInfo&&this.aContexts===undefined){return;}this.aContexts.forEach(function(i){i.destroy();});this.destroyPreviousContexts(true);if(this.oHeaderContext){this.oHeaderContext.destroy();}this.oModel.bindingDestroyed(this);this.aApplicationFilters=undefined;this.aContexts=undefined;this.oDiff=undefined;this.aFilters=undefined;this.oHeaderContext=undefined;this.mPreviousContextsByPath=undefined;this.aPreviousData=undefined;this.mQueryOptions=undefined;this.aSorters=undefined;a.prototype.destroy.call(this);l.prototype.destroy.call(this);};o.prototype.destroyCreated=function(p,D){var i,I=p.getModelIndex();this.iCreatedContexts-=1;for(i=0;i<I;i+=1){this.aContexts[i].iIndex+=1;}if(!this.iCreatedContexts){this.bCreatedAtEnd=undefined;}this.aContexts.splice(I,1);if(D&&this.iCurrentEnd){this.mPreviousContextsByPath[p.getPath()]=p;}else{p.destroy();}};o.prototype.destroyPreviousContexts=function(A){var p=this.mPreviousContextsByPath;if(p){Object.keys(p).forEach(function(P){var i=p[P];if(A||!i.isKeepAlive()){i.destroy();delete p[P];}else{i.iIndex=undefined;}});}};o.prototype.doCreateCache=function(r,q,i,D){return _.create(this.oModel.oRequestor,r,D,this.mParameters.$$aggregation,this.inheritQueryOptions(q,i),this.oModel.bAutoExpandSelect,this.bSharedRequest);};o.prototype.doFetchQueryOptions=function(i){var t=this;return this.fetchResolvedQueryOptions(i).then(function(q){return t.fetchFilter(i,q.$filter).then(function(p){return e.mergeQueryOptions(q,t.getOrderby(q.$orderby),p);});});};o.prototype.doSetProperty=function(){};o.prototype.expand=function(p){var D=false,t=this;this.checkSuspended();return this.oCache.expand(this.lockGroup(),e.getRelativePath(p.getPath(),this.oHeaderContext.getPath()),function(){D=true;t.fireDataRequested();}).then(function(q){var r=t.aContexts,M,v,i;if(q>0){M=p.getModelIndex();for(i=r.length-1;i>M;i-=1){v=r[i];if(v){v.iIndex+=q;r[i+q]=v;delete r[i];}}t.iMaxLength+=q;t._fireChange({reason:g.Change});}if(D){t.fireDataReceived({});}},function(E){if(D){t.fireDataReceived({error:E});}throw E;});};o.prototype.fetchCache=function(){var i=this.oCache,p=this.getResolvedPath(),K,t=this;a.prototype.fetchCache.apply(this,arguments);if(i){this.oCachePromise.then(function(q){Object.keys(t.mPreviousContextsByPath).forEach(function(P){var r=t.mPreviousContextsByPath[P];if(r.isKeepAlive()){q.addKeptElement(i.getValue(e.getRelativePath(P,p)));r.checkUpdate();K=true;}});if(K){q.setLateQueryOptions(i.getLateQueryOptions());}});}};o.prototype.fetchContexts=function(i,p,M,G,A,D){var P,t=this;if(this.bCreatedAtEnd){i+=this.iCreatedContexts;}G=G||this.lockGroup();P=this.fetchData(i,p,M,G,D);if(A){P=Promise.resolve(P);}return P.then(function(r){return r&&t.createContexts(i,r.value);},function(E){G.unlock(true);throw E;});};o.prototype.fetchData=function(i,p,M,G,D){var q=this.oContext,t=this;return this.oCachePromise.then(function(r){if(t.bRelative&&q!==t.oContext){return undefined;}if(r){return r.read(i,p,M,G,D).then(function(R){t.assertSameCache(r);return R;});}G.unlock();return q.fetchValue(t.sReducedPath).then(function(R){var v;R=R||[];v=R.$count;R=R.slice(i,i+p);R.$count=v;return{value:R};});});};o.prototype.fetchDownloadUrl=function(){var U=this.oModel.mUriParameters;if(!this.isResolved()){throw new Error("Binding is unresolved");}return this.withCache(function(i,p){return i.getDownloadUrl(p,U);});};o.prototype.fetchFilter=function(i,p){var q,r,M,t;function v(z,E,W){var A,D,T,V;function G(H){return T?"tolower("+H+")":H;}T=E==="Edm.String"&&z.bCaseSensitive===false;D=G(decodeURIComponent(z.sPath));V=G(e.formatLiteral(z.oValue1,E));switch(z.sOperator){case h.BT:A=D+" ge "+V+" and "+D+" le "+G(e.formatLiteral(z.oValue2,E));break;case h.NB:A=y(D+" lt "+V+" or "+D+" gt "+G(e.formatLiteral(z.oValue2,E)),W);break;case h.EQ:case h.GE:case h.GT:case h.LE:case h.LT:case h.NE:A=D+" "+z.sOperator.toLowerCase()+" "+V;break;case h.Contains:case h.EndsWith:case h.NotContains:case h.NotEndsWith:case h.NotStartsWith:case h.StartsWith:A=z.sOperator.toLowerCase().replace("not","not ")+"("+D+","+V+")";break;default:throw new Error("Unsupported operator: "+z.sOperator);}return A;}function w(z,A,W){var R;if(!z){return S.resolve();}if(z.aFilters){return S.all(z.aFilters.map(function(D){return w(D,A,z.bAnd);})).then(function(D){return y(D.join(z.bAnd?" and ":" or "),W&&!z.bAnd);});}R=M.resolve(x(z.sPath,A),t);return M.fetchObject(R).then(function(P){var D,E,G;if(!P){throw new Error("Type cannot be determined, no metadata for path: "+R);}G=z.sOperator;if(G===h.All||G===h.Any){D=z.oCondition;E=z.sVariable;if(G===h.Any&&!D){return z.sPath+"/any()";}A=Object.create(A);A[E]=x(z.sPath,A);return w(D,A).then(function(H){return z.sPath+"/"+z.sOperator.toLowerCase()+"("+E+":"+H+")";});}return v(z,P.$Type,W);});}function x(P,z){var A=P.split("/");A[0]=z[A[0]];return A[0]?A.join("/"):P;}function y(z,W){return W?"("+z+")":z;}q=j.combineFilters(this.aFilters,this.aApplicationFilters);if(!q){return S.resolve([p]);}r=b.splitFilter(q,this.mParameters.$$aggregation);M=this.oModel.getMetaModel();t=M.getMetaContext(this.oModel.resolve(this.sPath,i));return S.all([w(r[0],{},p).then(function(z){return z&&p?z+" and ("+p+")":z||p;}),w(r[1],{})]);};o.prototype.fetchValue=function(p,i,q){var r=q&&this.oCache!==undefined?S.resolve(this.oCache):this.oCachePromise,t=this;return r.then(function(v){var G,R;if(v){G=q?d.$cached:t.lockGroup();R=t.getRelativePath(p);if(R!==undefined){return v.fetchValue(G,R,undefined,i);}}if(t.oContext){return t.oContext.fetchValue(p,i,q);}});};o.prototype.filter=function(v,i){if(this.sOperationMode!==O.Server){throw new Error("Operation mode has to be sap.ui.model.odata.OperationMode.Server");}if(this.hasPendingChanges()){throw new Error("Cannot filter due to pending changes");}if(i===k.Control){this.aFilters=e.toArray(v);}else{this.aApplicationFilters=e.toArray(v);}if(this.isRootBindingSuspended()){this.setResumeChangeReason(g.Filter);return this;}this.createReadGroupLock(this.getGroupId(),true);this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(g.Filter);return this;};o.prototype.getContexts=function(i,p,M,K){var q,r,D=false,t=false,G,P,R=!!this.sChangeReason,v=this.getResolvedPath(),V,w=this;L.debug(this+"#getContexts("+i+", "+p+", "+M+")",undefined,s);this.checkSuspended();i=i||0;if(i!==0&&this.bUseExtendedChangeDetection){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" iStart must be 0 if extended change detection is enabled, but is "+i);}if(this.bUseExtendedChangeDetection){if(M!==undefined){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" iMaximumPrefetchSize must not be set if extended change detection is"+" enabled");}if(K){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" must not use bKeepCurrent if extended change detection is enabled");}}if(M&&K){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" must not use both iMaximumPrefetchSize and bKeepCurrent");}if(!this.isResolved()){this.aPreviousData=[];return[];}q=this.sChangeReason||g.Change;this.sChangeReason=undefined;if(q==="AddVirtualContext"){this.oModel.addPrerenderingTask(function(){var x=w.bUseExtendedChangeDetection;if(w.aContexts===undefined){V.destroy();return;}if(!w.isRootBindingSuspended()){w.bUseExtendedChangeDetection=false;w.getContexts(i,p,M);w.bUseExtendedChangeDetection=x;}w.oModel.addPrerenderingTask(function(){if(w.aContexts&&!w.isRootBindingSuspended()){w.sChangeReason="RemoveVirtualContext";w._fireChange({detailedReason:"RemoveVirtualContext",reason:g.Change});w.reset(g.Refresh);}V.destroy();});},true);V=C.create(this.oModel,this,v+"/"+C.VIRTUAL,C.VIRTUAL);return[V];}if(q==="RemoveVirtualContext"||(this.oContext&&this.oContext.iIndex===C.VIRTUAL)){return[];}p=p||this.oModel.iSizeLimit;if(!M||M<0){M=0;}G=this.oReadGroupLock;this.oReadGroupLock=undefined;if(!this.oDiff){P=this.fetchContexts(i,p,M,G,R,function(){D=true;w.fireDataRequested();});this.resolveRefreshPromise(P);P.then(function(x){if(w.bUseExtendedChangeDetection){w.oDiff={aDiff:w.getDiff(p),iLength:p};}if(t){if(x||(w.oDiff&&w.oDiff.aDiff.length)){w._fireChange({reason:q});}else{w.oDiff=undefined;}}if(D){w.fireDataReceived({data:{}});}},function(E){if(D){w.fireDataReceived(E.canceled?{data:{}}:{error:E});}throw E;}).catch(function(E){w.oModel.reportError("Failed to get contexts for "+w.oModel.sServiceUrl+v.slice(1)+" with start index "+i+" and length "+p,s,E);});t=true;}if(!K){this.iCurrentBegin=i;this.iCurrentEnd=i+p;}r=this.getContextsInViewOrder(i,p);if(this.bUseExtendedChangeDetection){if(this.oDiff&&p!==this.oDiff.iLength){throw new Error("Extended change detection protocol violation: Expected "+"getContexts(0,"+this.oDiff.iLength+"), but got getContexts(0,"+p+")");}r.dataRequested=!this.oDiff;r.diff=this.oDiff?this.oDiff.aDiff:[];}this.oDiff=undefined;return r;};o.prototype.getContextsInViewOrder=function(p,q){var r,i,t;if(this.bCreatedAtEnd){r=[];t=Math.min(q,this.getLength()-p);for(i=0;i<t;i+=1){r[i]=this.aContexts[this.getModelIndex(p+i)];}}else{r=this.aContexts.slice(p,p+q);}return r;};o.prototype.getCurrentContexts=function(){var i,p=Math.min(this.iCurrentEnd,this.iMaxLength+this.iCreatedContexts)-this.iCurrentBegin;i=this.getContextsInViewOrder(this.iCurrentBegin,p);while(i.length<p){i.push(undefined);}return i;};o.prototype.getDependentBindings=function(){var t=this;return this.oModel.getDependentBindings(this).filter(function(D){return D.oContext.isKeepAlive()||!(D.oContext.getPath()in t.mPreviousContextsByPath);});};o.prototype.getDiff=function(i){var p=this.aPreviousData,t=this;this.aPreviousData=this.getContextsInViewOrder(0,i).map(function(q){return t.getContextData(q);});return this.diffData(p,this.aPreviousData);};o.prototype.getDistinctValues=function(){throw new Error("Unsupported operation: v4.ODataListBinding#getDistinctValues");};o.prototype.getDownloadUrl=e.createGetMethod("fetchDownloadUrl",true);o.prototype.getEntryData=function(i){return JSON.stringify(i.getValue());};o.prototype.getEntryKey=function(i){return i.getPath();};o.prototype.getFilterInfo=function(i){var p=j.combineFilters(this.aFilters,this.aApplicationFilters),r=null,q;if(p){r=p.getAST(i);}if(this.mQueryOptions.$filter){q={expression:this.mQueryOptions.$filter,syntax:"OData "+this.oModel.getODataVersion(),type:"Custom"};if(r){r={left:r,op:"&&",right:q,type:"Logical"};}else{r=q;}}return r;};o.prototype.getGeneration=function(){return this.oHeaderContext.getGeneration(true)||a.prototype.getGeneration.call(this);};o.prototype.getHeaderContext=function(){return this.isResolved()?this.oHeaderContext:null;};o.prototype.getModelIndex=function(v){if(!this.bCreatedAtEnd){return v;}if(!this.bLengthFinal){return this.aContexts.length-v-1;}return v<this.getLength()-this.iCreatedContexts?v+this.iCreatedContexts:this.getLength()-v-1;};o.prototype.getLength=function(){if(this.bLengthFinal){return this.iMaxLength+this.iCreatedContexts;}return this.aContexts.length?this.aContexts.length+10:0;};o.prototype.getOrderby=function(i){var p=[],t=this;this.aSorters.forEach(function(q){if(q instanceof m){p.push(q.sPath+(q.bDescending?" desc":""));}else{throw new Error("Unsupported sorter: "+q+" - "+t);}});if(i){p.push(i);}return p.join(',');};o.prototype.getQueryOptions=function(w){var r={},t=this;if(w){throw new Error("Unsupported parameter value: bWithSystemQueryOptions: "+w);}Object.keys(this.mQueryOptions).forEach(function(K){if(K[0]!=="$"){r[K]=e.clone(t.mQueryOptions[K]);}});return r;};o.prototype.getQueryOptionsFromParameters=function(){return this.mQueryOptions;};o.prototype.hasPendingChangesForPath=function(i){if(this.oCache===undefined){return this.iCreatedContexts>0;}return a.prototype.hasPendingChangesForPath.apply(this,arguments);};o.prototype.inheritQueryOptions=function(q,i){var I;if(!Object.keys(this.mParameters).length){I=this.getQueryOptionsForPath("",i);if(q.$orderby&&I.$orderby){q.$orderby+=","+I.$orderby;}if(q.$filter&&I.$filter){q.$filter="("+q.$filter+") and ("+I.$filter+")";}q=Object.assign({},I,q);e.aggregateQueryOptions(q,I);}return q;};o.prototype.initialize=function(){if(this.isResolved()){if(this.getRootBinding().isSuspended()){this.sResumeChangeReason=this.sChangeReason==="AddVirtualContext"?g.Change:g.Refresh;}else if(this.sChangeReason==="AddVirtualContext"){this._fireChange({detailedReason:"AddVirtualContext",reason:g.Change});}else{this.sChangeReason=g.Refresh;this._fireRefresh({reason:g.Refresh});}}};o.prototype.isLengthFinal=function(){return this.bLengthFinal;};o.prototype.refreshInternal=function(r,G,i,K){var p,t=this;function q(P){var w=t.getResolvedPath();t.mPreviousContextsByPath[w+P].resetKeepAlive();}function v(w){return w.map(function(x){return x.refreshInternal(r,G,false,K);});}if(this.isRootBindingSuspended()){this.refreshSuspended(G);return S.all(v(t.getDependentBindings()));}this.createReadGroupLock(G,this.isRoot());return this.oCachePromise.then(function(w){var x=t.iCreatedContexts,D,P=t.oRefreshPromise;if(w&&!P){t.removeCachesAndMessages(r);t.fetchCache(t.oContext);p=t.oCachePromise.then(function(N){return N.refreshKeptElements(t.lockGroup(G),q);});P=t.createRefreshPromise();if(K){P=P.catch(function(E){if(E.canceled){throw E;}return t.fetchResourcePath(t.oContext).then(function(R){if(!t.bRelative||w.$resourcePath===R){t.oCache=w;t.oCachePromise=S.resolve(w);t.iCreatedContexts=x;w.setActive(true);t._fireChange({reason:g.Change});}throw E;});});}}D=t.getDependentBindings();t.reset(g.Refresh);return S.all(v(D).concat(P,p));});};o.prototype.refreshSingle=function(p,G,A){var q=p.getPath(),r=q.slice(1),t=this;if(p===this.oHeaderContext){throw new Error("Unsupported header context: "+p);}return this.withCache(function(v,P,w){var D=false,x=false,K=p.isKeepAlive(),y=e.getRelativePath(q,t.oHeaderContext.getPath()),z=[];function E(i){if(D){t.fireDataReceived(i);}}function H(){D=true;t.fireDataRequested();}function I(J){var i,M=p.getModelIndex();if(p.created()){t.destroyCreated(p);x=true;}else{if(M===undefined){delete t.mPreviousContextsByPath[q];}else{t.aContexts.splice(M,1);t.iMaxLength-=1;for(i=M;i<t.aContexts.length;i+=1){if(t.aContexts[i]){t.aContexts[i].iIndex-=1;}}if(J){t.mPreviousContextsByPath[q]=p;}}if(!J){x=true;p.destroy();}}if(M!==undefined){t._fireChange({reason:g.Remove});}}z.push((A?v.refreshSingleWithRemove(G,P,p.getModelIndex(),y,K,H,I):v.refreshSingle(G,P,p.getModelIndex(),y,K,H)).then(function(i){var U=[];E({data:{}});if(!x){U.push(p.checkUpdate());if(A){U.push(t.refreshDependentBindings(r,G.getGroupId()));}}return S.all(U).then(function(){return i;});},function(i){E({error:i});throw i;}).catch(function(i){G.unlock(true);t.oModel.reportError("Failed to refresh entity: "+p,s,i);}));if(!A){z.push(t.refreshDependentBindings(r,G.getGroupId()));}return S.all(z).then(function(R){return R[0];});});};o.prototype.requestContexts=function(i,p,G){var t=this;if(!this.isResolved()){throw new Error("Unresolved binding: "+this.sPath);}this.checkSuspended();this.oModel.checkGroupId(G);i=i||0;p=p||this.oModel.iSizeLimit;return Promise.resolve(this.fetchContexts(i,p,0,this.lockGroup(G,true))).then(function(q){if(q){t._fireChange({reason:g.Change});}return t.getContextsInViewOrder(i,p);},function(E){t.oModel.reportError("Failed to get contexts for "+t.oModel.sServiceUrl+t.getResolvedPath().slice(1)+" with start index "+i+" and length "+p,s,E);throw E;});};o.prototype.requestDownloadUrl=e.createRequestMethod("fetchDownloadUrl");o.prototype.requestFilterForMessages=function(i){var M=this.oModel.getMetaModel(),p,r=this.oHeaderContext&&this.oHeaderContext.getPath(),t=this;if(!r){return Promise.resolve(null);}p=M.getMetaPath(r);return M.requestObject(p+"/").then(function(E){var q,P={};t.oModel.getMessagesByPath(r,true).filter(function(v){return!i||i(v);}).forEach(function(v){v.getTargets().forEach(function(T){var w=T.slice(r.length).split("/")[0];if(!w.startsWith("($uid=")){P[w]=true;}});});q=Object.keys(P).map(function(v){return o.getFilterForPredicate(v,E,M,p);});if(q.length===0){return null;}return q.length===1?q[0]:new F({filters:q});});};o.prototype.requestSideEffects=function(G,p,i){var A,q,M,r=this.oModel,N={},P,t,R=this.oHeaderContext.getPath().length,v=i&&i!==this.oHeaderContext,w=this;function x(y){return y.catch(function(E){r.reportError("Failed to request side effects",s,E);throw E;});}if(this.mParameters.$$aggregation){if(v){throw new Error("Must not request side effects for a context of a binding with $$aggregation");}if(b.isAffected(this.mParameters.$$aggregation,this.aFilters.concat(this.aApplicationFilters),p)){return this.refreshInternal("",G,false,true);}return S.resolve();}if(p.indexOf("")<0){if(v){q=[i];}else{q=this.getCurrentContexts().filter(function(y){return!y.isTransient();});Object.keys(this.mPreviousContextsByPath).forEach(function(y){var z=w.mPreviousContextsByPath[y];if(z.isKeepAlive()){q.push(z);}});}P=q.map(function(i){return i.getPath().slice(R);});M=P.some(function(y){return y[0]!=="(";});if(!M){t=[this.oCache.requestSideEffects(this.lockGroup(G),p,N,P,v)];this.visitSideEffects(G,p,v?i:undefined,N,t);return S.all(t.map(x)).then(function(){return w.refreshDependentListBindingsWithoutCache();});}}if(v){return this.refreshSingle(i,this.lockGroup(G),false);}if(this.aContexts.length){A=this.aContexts.every(function(i){return i.isTransient();});if(A){return S.resolve();}}return this.refreshInternal("",G,false,true);};o.prototype.reset=function(i){var E=this.iCurrentEnd===0,t=this;if(this.aContexts){this.aContexts.forEach(function(p){t.mPreviousContextsByPath[p.getPath()]=p;});}this.aContexts=[];this.iCreatedContexts=0;this.bCreatedAtEnd=undefined;this.iCurrentBegin=this.iCurrentEnd=0;this.iMaxLength=Infinity;this.bLengthFinal=false;if(i&&!(E&&i===g.Change)){this.sChangeReason=i;this._fireRefresh({reason:i});}if(this.getHeaderContext()){this.oModel.getDependentBindings(this.oHeaderContext).forEach(function(p){p.checkUpdate();});}};o.prototype.resetKeepAlive=function(){var p=this.mPreviousContextsByPath;function r(i){if(i.isKeepAlive()){i.resetKeepAlive();}}Object.keys(p).forEach(function(P){r(p[P]);});this.aContexts.forEach(r);};o.prototype.resumeInternal=function(i,p){var q=this.getDependentBindings(),r=this.sResumeChangeReason,R=p||r;this.sResumeChangeReason=undefined;if(R){this.removeCachesAndMessages("");this.reset();this.fetchCache(this.oContext,!p);}q.forEach(function(D){D.resumeInternal(!R,!!r);});if(this.sChangeReason==="AddVirtualContext"){this._fireChange({detailedReason:"AddVirtualContext",reason:r});}else if(r){this._fireRefresh({reason:r});}this.oModel.getDependentBindings(this.oHeaderContext).forEach(function(t){t.checkUpdate();});};o.prototype.setAggregation=function(A){var p;if(this.hasPendingChanges()){throw new Error("Cannot set $$aggregation due to pending changes");}p=Object.assign({},this.mParameters);if(A===undefined){delete p.$$aggregation;}else{p.$$aggregation=e.clone(A);this.resetKeepAlive();}this.applyParameters(p,"");};o.prototype.setContext=function(p){var i,r,t=this;if(this.oContext!==p){if(this.bRelative){this.checkSuspended();for(i=0;i<t.iCreatedContexts;i+=1){if(t.aContexts[i].isTransient()){throw new Error("setContext on relative binding is forbidden if a "+"transient entity exists: "+t);}}this.reset();this.resetKeepAlive();this.fetchCache(p);if(p){r=this.oModel.resolve(this.sPath,p);if(this.oHeaderContext&&this.oHeaderContext.getPath()!==r){this.oHeaderContext.destroy();this.oHeaderContext=null;}if(!this.oHeaderContext){this.oHeaderContext=C.create(this.oModel,this,r);}if(this.bHasPathReductionToParent&&this.oModel.bAutoExpandSelect&&!this.mParameters.$$aggregation){this.sChangeReason="AddVirtualContext";}}B.prototype.setContext.call(this,p,{detailedReason:this.sChangeReason});}else{this.oContext=p;}}};o.prototype.sort=function(v){if(this.sOperationMode!==O.Server){throw new Error("Operation mode has to be sap.ui.model.odata.OperationMode.Server");}if(this.hasPendingChanges()){throw new Error("Cannot sort due to pending changes");}this.aSorters=e.toArray(v);if(this.isRootBindingSuspended()){this.setResumeChangeReason(g.Sort);return this;}this.createReadGroupLock(this.getGroupId(),true);this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(g.Sort);return this;};o.prototype.updateAnalyticalInfo=function(A){var i={aggregate:{},group:{}},H=false,t=this;A.forEach(function(p){var D={};if("total"in p){if("grouped"in p){throw new Error("Both dimension and measure: "+p.name);}if(p.as){D.name=p.name;i.aggregate[p.as]=D;}else{i.aggregate[p.name]=D;}if(p.min){D.min=true;H=true;}if(p.max){D.max=true;H=true;}if(p.with){D.with=p.with;}}else if(!("grouped"in p)||p.inResult||p.visible){i.group[p.name]=D;}});this.bHasAnalyticalInfo=true;this.setAggregation(i);if(H){return{measureRangePromise:Promise.resolve(this.getRootBindingResumePromise().then(function(){return t.oCachePromise;}).then(function(p){return p.getMeasureRangePromise();}))};}};o.getFilterForPredicate=function(p,E,M,i){var q,v=f.parseKeyPredicate(p);if(""in v){v[E.$Key[0]]=v[""];delete v[""];}q=E.$Key.map(function(K){var r,t;if(typeof K==="string"){t=r=K;}else{r=Object.keys(K)[0];t=K[r];}return new F(t,h.EQ,e.parseLiteral(decodeURIComponent(v[r]),M.getObject(i+"/"+t+"/$Type"),t));});return q.length===1?q[0]:new F({and:true,filters:q});};return o;});
