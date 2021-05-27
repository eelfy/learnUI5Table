// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/services/_ClientSideTargetResolution/SystemContext","sap/ushell/services/_ClientSideTargetResolution/Utils","sap/ushell/services/AppConfiguration","sap/ushell/services/_ClientSideTargetResolution/InboundProvider","sap/ushell/services/_ClientSideTargetResolution/InboundIndex","sap/ushell/services/_ClientSideTargetResolution/VirtualInbounds","sap/ushell/services/_ClientSideTargetResolution/Search","sap/ushell/services/_ClientSideTargetResolution/StagedLogger","sap/ushell/services/_ClientSideTargetResolution/Formatter","sap/ushell/services/_ClientSideTargetResolution/ParameterMapping","sap/ushell/services/_ClientSideTargetResolution/PrelaunchOperations","sap/ushell/services/_ClientSideTargetResolution/XAppStateProcessing","sap/ushell/navigationMode","sap/ushell/Config","sap/ushell/ApplicationType","sap/ui/thirdparty/URI","sap/ushell/_ApplicationType/systemAlias","sap/ushell/TechnicalParameters","sap/base/util/ObjectPath","sap/ui/thirdparty/jquery","sap/base/util/isPlainObject","sap/base/Log"],function(u,S,c,a,I,b,V,s,l,f,p,P,x,n,C,A,U,d,T,O,q,i,L){"use strict";function g(o,e,h,j){this._init.apply(this,arguments);}g.prototype._init=function(o,e,h,j){this._iLogId=0;if(!this._implementsServiceInterface(o)){L.error("Cannot get Inbounds","ClientSideTargetResolutionAdapter should implement getInbounds method","sap.ushell.services.ClientSideTargetResolution");return;}this._oInboundProvider=new I(o.getInbounds.bind(o));this._oHaveEasyAccessSystemsDeferreds={userMenu:null,sapMenu:null};this._oServiceConfiguration=j;this._oAdapter=o;sap.ushell.Container.getServiceAsync("URLParsing").then(function(k){this._oURLParsing=k;}.bind(this));};g.prototype._implementsServiceInterface=function(o){if(typeof o.getInbounds==="function"){return true;}return false;};g.prototype._getURLParsing=function(){if(!this._oURLParsing){L.error("ClientSideTargetResolution.js: sap.ushell.Container.getSerivce() - sync call triggered.");this._oURLParsing=sap.ushell.Container.getService("URLParsing");}return this._oURLParsing;};g.prototype._extractInboundFilter=function(o){if(!this._oAdapter.hasSegmentedAccess){return undefined;}if(typeof o!=="string"){return undefined;}var F=o.indexOf("#")===0?o:"#"+o;var e=this._getURLParsing().parseShellHash(F);if(!e||!e.semanticObject||!e.action){return undefined;}return[{semanticObject:e.semanticObject,action:e.action}];};g.prototype.resolveHashFragment=function(h){var t=this,D=new q.Deferred(),B=this._oAdapter.resolveHashFragmentFallback&&this._oAdapter.resolveHashFragmentFallback.bind(this._oAdapter),e=this._extractInboundFilter(h);this._oInboundProvider.getInbounds(e).then(function(j){t._resolveHashFragment(h,B,j).done(function(o){return D.resolve(o);}).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype.resolveTileIntent=function(h){var t=this,D=new q.Deferred(),e=this._extractInboundFilter(h);this._oInboundProvider.getInbounds(e).then(function(o){t._resolveTileIntent(h,undefined,o).done(D.resolve.bind(D)).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype.resolveTileIntentInContext=function(e,h){var o,D=new q.Deferred();o=b.createIndex(e.concat(V.getInbounds()));this._resolveTileIntent(h,undefined,o).done(D.resolve.bind(D)).fail(D.reject.bind(D));return D.promise();};g.prototype._resolveHashFragment=function(h,B,e){var j=this._getURLParsing(),t=this,D=new q.Deferred(),F=h.indexOf("#")===0?h:"#"+h,k=j.parseShellHash(F);if(k===undefined){L.error("Could not parse shell hash '"+h+"'","please specify a valid shell hash","sap.ushell.services.ClientSideTargetResolution");return D.reject().promise();}k.formFactor=u.getFormFactor();this._getMatchingInbounds(k,e,{bExcludeTileInbounds:true}).fail(function(E){L.error("Could not resolve "+h,"_getMatchingInbounds promise rejected with: "+E,"sap.ushell.services.ClientSideTargetResolution");D.reject(E);}).done(function(m){var M;if(m.length===0){L.warning("Could not resolve "+h,"rejecting promise","sap.ushell.services.ClientSideTargetResolution");D.reject("Could not resolve navigation target");return;}m=t._applySapNavigationScopeFilter(m,k);M=m[0];c.whenDebugEnabled(function(){function o(K,w){return this[K]===undefined?"<undefined>":w;}function r(w,y){return(w==="_original")?undefined:o.call(this,w,y);}var v=JSON.stringify(M,r,"   ");L.debug("The following target will now be resolved",v,"sap.ushell.services.ClientSideTargetResolution");});t._resolveSingleMatchingTarget(M,B,F).done(function(o){D.resolve(o);}).fail(D.reject.bind(D));});return D.promise();};g.prototype._applySapNavigationScopeFilter=function(m,o){var e=o&&o.params&&o.params["sap-navigation-scope-filter"];if(!e){return m;}var F=m.filter(function(M){var h=O.get("inbound.signature.parameters",M);var j=h&&h["sap-navigation-scope"];if(j){return e[0]===j.defaultValue.value;}return undefined;});return F.length>0?F:m;};g.prototype._resolveSingleMatchingTarget=function(m,B,F){var t=this,D=new q.Deferred(),o=this._getURLParsing(),e=o.parseShellHash(F),h=[e.semanticObject,e.action].join("-"),j=(m.inbound.resolutionResult||{}).applicationType;var E;if(this._oAdapter.resolveSystemAlias){E=this._oAdapter.resolveSystemAlias.bind(this._oAdapter);}var H=!!m.inbound.templateContext;var k=A.getEasyAccessMenuResolver(h,j);if(k&&!H){k(e,m,E).then(function(R){var N=n.compute(O.get("inbound.resolutionResult.applicationType",m),(m.intentParamsPlusAllDefaults["sap-ushell-next-navmode"]||[])[0],(m.intentParamsPlusAllDefaults["sap-ushell-navmode"]||[])[0],(a.getCurrentApplication()||{}).applicationType,C.last("/core/navigation/enableInPlaceForClassicUIs"));u.shallowMergeObject(R,N);R.inboundPermanentKey=m.inbound.permanentKey||m.inbound.id;D.resolve(R);},function(v){D.reject(v);});return D.promise();}var r=this._getReservedParameters(m);p.mapParameterNamesAndRemoveObjects(m);x.mixAppStateIntoResolutionResultAndRename(m,sap.ushell.Container.getService("AppState")).done(function(m){var R=function(){return t._constructFallbackResolutionResult.call(t,m,B,F);};if(A[j]){R=A[j].generateResolutionResult;}delete m.intentParamsPlusAllDefaults["sap-tag"];delete m.mappedIntentParamsPlusSimpleDefaults["sap-tag"];m.mappedDefaultedParamNames=m.mappedDefaultedParamNames.filter(function(w){return w!=="sap-tag";});var v=O.get("inbound.resolutionResult.url",m);P.executePrelaunchOperations(m,r["sap-prelaunch-operations"]).then(function(){return R(m,v,E);}).then(function(w){w.reservedParameters=r;w.inboundPermanentKey=m.inbound.permanentKey||m.inbound.id;return w;}).then(function(w){L.debug("Intent was resolved to the following target",JSON.stringify(m.resolutionResult,null,3),"sap.ushell.services.ClientSideTargetResolution");u.shallowMergeObject(m.resolutionResult,w);D.resolve(m.resolutionResult);},function(M){if(typeof M==="string"&&M.indexOf("fallback:")>=0){t._constructFallbackResolutionResult.call(this,m,B,F).then(function(w){u.shallowMergeObject(m.resolutionResult,w);D.resolve(m.resolutionResult);},D.reject.bind(D));}else{D.reject(M);}});});return D.promise();};g.prototype._getReservedParameters=function(m){var r=T.getParameters({injectFrom:"startupParameter"}).map(function(o){return o.name;});var R=c.extractParameters(r,m.intentParamsPlusAllDefaults);T.getParameters({injectFrom:"inboundParameter"}).forEach(function(o){var e=o.name;var h=m.inbound&&m.inbound.signature&&m.inbound.signature.parameters;if(h&&Object.keys(h).length>0){var j=h[e];var k=j&&j.defaultValue&&j.defaultValue.hasOwnProperty("value");var t=j&&j.filter&&j.filter.hasOwnProperty("value");if(j&&(t||k)){if(k){R[e]=j.defaultValue.value;}else{R[e]=j.filter.value;}}else{delete R[e];}delete m.intentParamsPlusAllDefaults[e];var v=m.defaultedParamNames.indexOf(e);if(v>=0){m.defaultedParamNames.splice(v,1);}}});return R;};g.prototype._resolveTileIntent=function(h,B,o){var e=this._getURLParsing(),t=this,D=new q.Deferred(),F=h.indexOf("#")===0?h:"#"+h,j=e.parseShellHash(F);if(j===undefined){L.error("Could not parse shell hash '"+h+"'","please specify a valid shell hash","sap.ushell.services.ClientSideTargetResolution");return D.reject("Cannot parse shell hash").promise();}j.formFactor=u.getFormFactor();this._getMatchingInbounds(j,o,{bExcludeTileInbounds:false}).fail(function(E){L.error("Could not resolve "+h,"_getMatchingInbounds promise rejected with: "+E,"sap.ushell.services.ClientSideTargetResolution");D.reject(E);}).done(function(m){var M;if(m.length===0){L.warning("Could not resolve "+h,"no matching targets were found","sap.ushell.services.ClientSideTargetResolution");D.reject("No matching targets found");return;}M=m[0];t._resolveSingleMatchingTileIntent(M,B,F).done(D.resolve.bind(D)).fail(D.reject.bind(D));});return D.promise();};g.prototype._resolveSingleMatchingTileIntent=function(m,B,F){var D=new q.Deferred(),e=(m.inbound.resolutionResult||{}).applicationType,t=this;var E;if(this._oAdapter.resolveSystemAlias){E=this._oAdapter.resolveSystemAlias.bind(this._oAdapter);}p.mapParameterNamesAndRemoveObjects(m);x.mixAppStateIntoResolutionResultAndRename(m,sap.ushell.Container.getService("AppState")).done(function(m){var r=function(){return t._constructFallbackResolutionResult.call(t,m,B,F);};if(A[e]){r=A[e].generateResolutionResult;}delete m.intentParamsPlusAllDefaults["sap-tag"];delete m.mappedIntentParamsPlusSimpleDefaults["sap-tag"];m.mappedDefaultedParamNames=m.mappedDefaultedParamNames.filter(function(j){return j!=="sap-tag";});var h=O.get("inbound.resolutionResult.url",m);r(m,h,E).then(function(R){u.shallowMergeObject(m.resolutionResult,R);var o=q.extend(true,{},m.inbound.tileResolutionResult);o.startupParameters=m.effectiveParameters;o.navigationMode=m.resolutionResult.navigationMode;if(!o.navigationMode){o.navigationMode=n.getNavigationMode(m.resolutionResult);}D.resolve(o);L.debug("Tile Intent was resolved to the following target",JSON.stringify(o,null,3),"sap.ushell.services.ClientSideTargetResolution");},function(M){D.reject(M);});});return D.promise();};g.prototype._constructFallbackResolutionResult=function(m,B,F){var e={},D;Object.keys(m.intentParamsPlusAllDefaults).forEach(function(h){if(Array.isArray(m.intentParamsPlusAllDefaults[h])){e[h]=m.intentParamsPlusAllDefaults[h];}});D=m.mappedDefaultedParamNames||m.defaultedParamNames;if(D.length>0){e["sap-ushell-defaultedParameterNames"]=[JSON.stringify(D)];}if(typeof B!=="function"){L.error("Cannot resolve hash fragment",F+" has matched an inbound that cannot be resolved client side and no resolveHashFragmentFallback method was implemented in ClientSideTargetResolutionAdapter","sap.ushell.services.ClientSideTargetResolution");return Promise.reject("Cannot resolve hash fragment: no fallback provided.");}L.warning("Cannot resolve hash fragment client side",F+" has matched an inbound that cannot be resolved client side. Using fallback logic","sap.ushell.services.ClientSideTargetResolution");return new Promise(function(r,R){B(F,q.extend(true,{},m.inbound),e).done(function(o){var h={};["applicationType","additionalInformation","url","applicationDependencies","text"].forEach(function(j){if(o.hasOwnProperty(j)){h[j]=o[j];}});r(h);}).fail(R.bind(null));});};g.prototype.getDistinctSemanticObjects=function(){var D=new q.Deferred();this._oInboundProvider.getInbounds().then(function(o){var e={};o.getAllInbounds().forEach(function(h){if(typeof h.semanticObject==="string"&&h.semanticObject!=="*"&&!h.hideIntentLink&&h.semanticObject.length>0){e[h.semanticObject]=true;}});D.resolve(Object.keys(e).sort());},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype.getLinks=function(o){var N,t=this,e,m,h,D=new q.Deferred(),j;if(arguments.length===1&&i(arguments[0])){N=arguments[0];j=q.extend(true,{},N);["action","semanticObject"].forEach(function(k){if(N.hasOwnProperty(k)){j[k]=N[k];}});if(j.appStateKey){j.params=j.params||{};j.params["sap-xapp-state"]=[j.appStateKey];delete j.appStateKey;}}else if(arguments.length<=3){L.warning("Passing positional arguments to getLinks is deprecated","Please use nominal arguments instead","sap.ushell.services.ClientSideTargetResolution");e=arguments[0];m=arguments[1];h=arguments[2];j={semanticObject:e,params:m,ignoreFormFactor:h};}else{return D.reject("invalid arguments for getLinks").promise();}this._oInboundProvider.getInbounds().then(function(k){t._getLinks(j,k).done(D.resolve.bind(D)).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype._validateGetSemanticObjectLinksArgs=function(o){var e=o.semanticObject,h=o.action,j=!o.hasOwnProperty("action");if(typeof e!=="undefined"||j){if(typeof e!=="string"){L.error("invalid input for _getLinks","the semantic object must be a string, got "+Object.prototype.toString.call(e)+" instead","sap.ushell.services.ClientSideTargetResolution");return"invalid semantic object";}if(j&&e.match(/^\s+$/)){L.error("invalid input for _getLinks","the semantic object must be a non-empty string, got '"+e+"' instead","sap.ushell.services.ClientSideTargetResolution");return"invalid semantic object";}if(!j&&e.length===0){L.error("invalid input for _getLinks","the semantic object must not be an empty string, got '"+e+"' instead","sap.ushell.services.ClientSideTargetResolution");return"invalid semantic object";}}if(typeof h!=="undefined"){if(typeof h!=="string"){L.error("invalid input for _getLinks","the action must be a string, got "+Object.prototype.toString.call(h)+" instead","sap.ushell.services.ClientSideTargetResolution");return"invalid action";}if(h.length===0){L.error("invalid input for _getLinks","the action must not be an empty string, got '"+h+"' instead","sap.ushell.services.ClientSideTargetResolution");return"invalid action";}}return undefined;};g.prototype._getLinks=function(o,e){var h=o.semanticObject,j=o.action,m=o.params,w=!!o.withAtLeastOneUsedParam,t=!!o.treatTechHintAsFilter,k=o.ignoreFormFactor,r=o.hasOwnProperty("sortResultsBy")?o.sortResultsBy:"intent";if(o.hasOwnProperty("sortResultOnTexts")){L.warning("the parameter 'sortResultOnTexts' was experimantal and is no longer supported","getLinks results will be sorted by '"+r+"'","sap.ushell.services.ClientsideTargetResolution");}var v={bExcludeTileInbounds:true};var E=this._validateGetSemanticObjectLinksArgs(o);if(o.tags){v.tags=o.tags;}if(E){return new q.Deferred().reject(E).promise();}if(h==="*"){return q.when([]);}function y(z,H){var J=z.paramsToString(H);return J?"?"+J:"";}var z=this._getURLParsing(),D=new q.Deferred(),F=u.getFormFactor(),B=z.parseParameters(y(z,m)),G={semanticObject:(h===""?undefined:h),action:j,formFactor:(k?undefined:F),params:B};if(t){G.treatTechHintAsFilter=true;}this._getMatchingInbounds(G,e,v).done(function(M){var H={},R=M.map(function(N){var Q=h||N.inbound.semanticObject,W="#"+Q+"-"+N.inbound.action,X;if(Q==="*"){return undefined;}if(N.inbound.action==="*"){return undefined;}if(N.inbound&&N.inbound.hasOwnProperty("hideIntentLink")&&N.inbound.hideIntentLink===true){return undefined;}if(!H.hasOwnProperty(W)){H[W]={matchingInbound:N.inbound,count:1};if(N.inbound.signature.additionalParameters==="ignored"){X=c.filterObjectKeys(B,function(a1){return(a1.indexOf("sap-")===0)||N.inbound.signature.parameters.hasOwnProperty(a1);},false);}else{X=B;}if(w){var Y=Object.keys(X).some(function(a1){return a1.indexOf("sap-")!==0;});if(!Y){H[W].hideReason="getLinks called with 'withAtLeastOneUsedParam = true', but the inbound had no business parameters defined.";return undefined;}}var Z=c.inboundSignatureMeetsParameterOptions(N.inbound.signature.parameters,o.paramsOptions||[]);if(!Z){H[W].hideReason="inbound signature does not meet the requested parameter filter options";return undefined;}var $={intent:W+y(z,X),text:N.inbound.title};if(N.inbound.icon){$.icon=N.inbound.icon;}if(N.inbound.subTitle){$.subTitle=N.inbound.subTitle;}if(N.inbound.shortTitle){$.shortTitle=N.inbound.shortTitle;}var _=O.get("inbound.signature.parameters.sap-tag.defaultValue.value",N);if(_){$.tags=[_];}return $;}H[W].count++;return undefined;}).filter(function(N){return typeof N==="object";});if(r!=="priority"){R.sort(function(N,Q){return N[r]<Q[r]?-1:1;});}if(R.length===0){L.debug("_getLinks returned no results");}else if(L.getLevel()>=L.Level.DEBUG){if(L.getLevel()>=L.Level.TRACE){var J=[];var K=[];R.forEach(function(N){var Q=N.intent.split("?")[0];if(H[Q].hideReason){K.push(["-",Q+"("+H[Q].hideReason+")\n"," text:",N.text+"\n"," full intent:",N.intent].join(" "));}else{J.push(["-",Q,H[Q].count>1?"("+(H[Q].count-1)+" others matched)\n":"\n","text:",N.text+"\n","full intent:",N.intent].join(" "));}});L.debug("_getLinks filtered to the following unique intents:","\n"+J.join("\n"),"sap.ushell.services.ClientSideTargetResolution");L.debug("_getLinks would have also returned the following unique intents, but something prevented this:",K.join("\n"),"sap.ushell.services.ClientSideTargetResolution");}else{L.debug("_getLinks filtered to unique intents.","Reporting histogram: \n - "+Object.keys(H).join("\n - "),"sap.ushell.services.ClientSideTargetResolution");}}D.resolve(R);}).fail(D.reject.bind(D));return D.promise();};g.prototype._getMatchingInbounds=function(o,e,h){var t=this,j,k,m,r,v,E,w,D=new q.Deferred();if(h){j=h.tags;E=h.bExcludeTileInbounds;}c.whenDebugEnabled(function(){m=++t._iLogId;});l.begin(function(){function y(M){var B=M.action||(typeof M.action==="undefined"?"<any>":"<invalid-value>");var F=M.semanticObject||(typeof M.semanticObject==="undefined"?"<any>":"<invalid-value>");return t._getURLParsing().constructShellHash({semanticObject:F,action:B,params:M.params});}var z=y(o);return{logId:m,title:"Matching Intent '"+z+"' to inbounds (form factor: "+(o.formFactor||"<any>")+")",moduleName:"sap.ushell.services.ClientSideTargetResolution",stages:["STAGE1: Find matching inbounds","STAGE2: Resolve references","STAGE3: Rematch with references","STAGE4: Sort matched targets"]};});v=o.semanticObject;k=o.action;this._oShellHash=o;r=j?e.getSegmentByTags(j):e.getSegment(v,k);if(E){w=r.filter(function(y){return!y.tileResolutionResult||!y.tileResolutionResult.isCustomTile;});}else{w=r;}var G=null;if(this._oAdapter.getContentProviderDataOriginsLookup){G=this._oAdapter.getContentProviderDataOriginsLookup.bind(this._oAdapter);}s.match(o,w,{},G,c.isDebugEnabled()).then(function(y){l.log(function(){return{logId:m,stage:1,prefix:"\u2718",lines:Object.keys(y.noMatchReasons||{}).map(function(B){return B+" "+y.noMatchReasons[B];})};});l.log(function(){var B=y.matchResults.map(function(F){return f.formatInbound(F.inbound);});return{logId:m,stage:1,prefix:B.length>0?"\u2705":"\u2718",lines:B.length>0?B:["No inbound was matched"]};});var M={};var N=false;var z=Object.keys(y.missingReferences);z.forEach(function(B){var F=Object.keys(y.missingReferences[B]);N=N||F.length>0;M[B]=F;});z=z.filter(function(B){if(M[B].length>0){return true;}delete M[B];});if(!N){l.log(function(){return{logId:m,stage:2,prefix:"\u2705",line:"No need to resolve references"};});return new q.Deferred().resolve({matchResults:y.matchResults,referencesToInclude:null}).promise();}z.forEach(function(B){l.log(function(){return{logId:m,stage:2,line:"@ Must resolve the following references with contentProviderId = \""+B+"\":",prefix:"\u2022",lines:M[B]};});});var R=new q.Deferred();sap.ushell.Container.getServiceAsync("ReferenceResolver").then(function(B){var F=z.map(function(H){return this.getSystemContext(H);}.bind(this));return Promise.all(F).then(function(H){var J=z.map(function(K,Q){return new Promise(function(W,X){B.resolveReferences(M[K],H[Q]).done(W).fail(X);});});return Promise.all(J);});}.bind(this)).then(function(B){var F={matchResults:y.matchResults,referencesToInclude:{}};z.forEach(function(H,J){var K=B[J];F.referencesToInclude[H]=K;if(Object.keys(K).length>0){l.log(function(){return{logId:m,stage:2,line:"\u2705 resolved references with contentProviderId = \""+H+"\" to the following values:",prefix:"\u2022",lines:Object.keys(K).map(function(Q){return Q+": '"+K[Q]+"'";})};});}});R.resolve(F);}).catch(function(B){l.log(function(){return{logId:m,stage:2,prefix:"\u274c",line:"Failed to resolve references: "+B};});D.resolve([]);});return R.promise();}.bind(this)).then(function(y){var M,z,R=y.referencesToInclude;if(!R){l.log(function(){return{logId:m,stage:3,line:"rematch was skipped (no references to resolve)",prefix:"\u2705"};});return new q.Deferred().resolve(y).promise();}z=y.matchResults;M=z.map(function(B){return B.inbound;});return s.match(o,M,R,G,0).then(function(F){l.log(function(){var z=F.matchResults||[];if(z.length>=1){return{logId:m,stage:3,line:"The following inbounds re-matched:",lines:z.map(function(B){return f.formatInbound(B.inbound);}),prefix:"\u2705"};}return{logId:m,stage:3,line:"No inbounds re-matched",prefix:"-"};});return F;});}).then(function(F){var M=F.matchResults||[];if(M.length<=1){l.log(function(){return{logId:m,stage:4,line:"Nothing to sort"};});D.resolve(M);return;}var y=s.sortMatchingResultsDeterministic(F.matchResults||[]);l.log(function(){var z=y.map(function(B){return f.formatInbound(B.inbound||{})+(B.matchesVirtualInbound?" (virtual)":"")+"\n[ Sort Criteria ] "+"\n * 1 * sap-priority: '"+B["sap-priority"]+"'"+"\n * 2 * Sort string: '"+B.priorityString+"\n * 3 * Deterministic blob: '"+s.serializeMatchingResult(B)+"'";});return{logId:m,stage:4,line:"Sorted inbounds as follows:",lines:z,prefix:".",number:true};});D.resolve(y);});return D.promise().then(function(M){l.end(function(){return{logId:m};});return M;});};g.prototype._isIntentSupportedOne=function(e,o){var D=new q.Deferred(),h=this._getURLParsing().parseShellHash(e);if(e==="#"){D.resolve(true);return D.promise();}if(h===undefined){return D.reject("Could not parse shell hash '"+e+"'").promise();}h.formFactor=u.getFormFactor();this._getMatchingInbounds(h,o,{bExcludeTileInbounds:true}).done(function(t){D.resolve(t.length>0);}).fail(function(){D.reject();});return D.promise();};g.prototype.isIntentSupported=function(e){var t=this,D=new q.Deferred();this._oInboundProvider.getInbounds().then(function(o){t._isIntentSupported(e,o).done(D.resolve.bind(D)).fail(D.reject.bind(D));},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype._isIntentSupported=function(e,o){var t=this,D=new q.Deferred(),m={};D.resolve();function h(j,k){m[j]={supported:k};}var r=[];e.forEach(function(j){var N=t._isIntentSupportedOne(j,o);N.fail(function(E){r.push(E);});N.done(function(k){h(j,k);});D=q.when(D,N);});var R=new q.Deferred();D.done(function(){R.resolve(m);}).fail(function(){R.reject("One or more input intents contain errors: "+r.join(", "));});return R.promise();};g.prototype.getUserDefaultParameterNames=function(o){var t=this,D=new q.Deferred();this._oInboundProvider.getInbounds().then(function(h){var r;try{r=t._getUserDefaultParameterNames(h.getAllInbounds(),o);D.resolve(r);}catch(e){D.reject("Cannot get user default parameters from inbounds: "+e);}},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype._getUserDefaultParameterNames=function(e,o){var r={simple:{},extended:{}};e=e.filter(function(h){if(h.contentProviderId===undefined&&o.id===""){return true;}return h.contentProviderId===o.id;});e.forEach(function(t){var h=t.signature&&t.signature.parameters||[];Object.keys(h).forEach(function(j){var k=h[j],R,E,m,v;if(k){if(k.filter&&k.filter.format==="reference"){m=k.filter.value;}else if(k.defaultValue&&k.defaultValue.format==="reference"){m=k.defaultValue.value;}if(typeof m==="string"){v=sap.ushell.Container.getService("ReferenceResolver");R=v.extractUserDefaultReferenceName(m);if(typeof R==="string"){r.simple[R]={};}E=v.extractExtendedUserDefaultReferenceName(m);if(typeof E==="string"){r.extended[E]={};}}}});});return r;};g.prototype.getEasyAccessSystems=function(m){var r={},o,v,D;m=m||"sapMenu";if(this._oHaveEasyAccessSystemsDeferreds[m]){return this._oHaveEasyAccessSystemsDeferreds[m].promise();}this._oHaveEasyAccessSystemsDeferreds[m]=new q.Deferred();D=this._oHaveEasyAccessSystemsDeferreds[m];function e(h,j,v){if(!h){return false;}var k=[h.semanticObject,h.action].join("-");return v[m][k]&&h.deviceTypes&&j!==undefined&&h.deviceTypes[j];}o=A.getEasyAccessMenuDefinitions().reduce(function(R,E){var h=E.easyAccessMenu.intent.split("-")[1];R[h]={appType:E.type,priority:E.easyAccessMenu.systemSelectionPriority};return R;},{});v={userMenu:A.getEasyAccessMenuDefinitions().reduce(function(h,E){var j=E.easyAccessMenu.intent;h[j]=E.easyAccessMenu.showSystemSelectionInUserMenu;return h;},{}),sapMenu:A.getEasyAccessMenuDefinitions().reduce(function(h,E){var j=E.easyAccessMenu.intent;h[j]=E.easyAccessMenu.showSystemSelectionInSapMenu;return h;},{})};this._oInboundProvider.getInbounds().then(function(h){var j={};h.getAllInbounds().filter(function(k){return e(k,u.getFormFactor(),v);}).forEach(function(E){var k;if(i(E.signature.parameters["sap-system"])&&E.signature.parameters["sap-system"].hasOwnProperty("filter")){k=O.get("signature.parameters.sap-system.filter.value",E);}if(typeof k==="string"){var t=o[E.action].priority;var w=o[E.action].appType;if(!r[k]){j[k]=-1;r[k]={appType:{}};}if(j[k]<t){r[k].text=E.title;j[k]=t;}r[k].appType[w]=true;}else{L.warning("Cannot extract sap-system from easy access menu inbound: "+f.formatInbound(E),"This parameter is supposed to be a string. Got '"+k+"' instead.","sap.ushell.services.ClientSideTargetResolution");}});D.resolve(r);},function(){D.reject.apply(D,arguments);});return D.promise();};g.prototype.getSystemContext=function(e){var h=e===undefined?"":e;return new Promise(function(r,j){var o;this._oAdapter.resolveSystemAlias(h).done(function(R){o=S.createSystemContextFromSystemAlias(R);r(o);}).fail(function(E){j(E);});}.bind(this));};g.hasNoAdapter=false;return g;},true);
