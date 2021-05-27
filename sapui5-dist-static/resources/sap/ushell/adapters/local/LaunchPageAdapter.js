// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ui/model/resource/ResourceModel","sap/m/GenericTile","sap/m/ImageContent","sap/m/TileContent","sap/m/NumericContent","sap/m/library","sap/ui/core/ComponentContainer","sap/ui/thirdparty/datajs","sap/ui/core/library","sap/ui/thirdparty/jquery","sap/ushell/Config","sap/ushell/services/AppType","sap/base/Log","sap/ushell/utils/WindowUtils"],function(r,R,G,I,T,N,m,C,O,c,q,a,A,L,W){"use strict";var V=c.mvc.ViewType;var b=m.GenericTileMode;function _(t){var p={};p[t.namespace.replace(/\./g,"/")]=t.path||".";sap.ui.loader.config({paths:p});}var d=function(u,p,o){var f=q.extend(true,[],o.config.groups),g=o.config.catalogs||[],F=0,h=10,M=10,j=10,k,l,s,t;var v={};for(s=0;s<f.length;s++){if(f[s].isDefaultGroup===true){t=f[s];break;}}if(!t&&f.length>0){t=f[0];t.isDefaultGroup=true;}this.translationBundle=r.i18n;this.TileType={Tile:"tile",Link:"link",Card:"card"};if(!k&&o.config.pathToLocalizedContentResources){k=new R({bundleUrl:o.config.pathToLocalizedContentResources,bundleLocale:sap.ui.getCore().getConfiguration().getLanguage()});l=k.getResourceBundle();}function w(K){if(l){return l.getText(K);}return K;}q.each(g,function(i,e){if(l){e.title=w(e.title);}q.each(e.tiles,function(i,n){n.getTitle=function(){return n.title;};});});q.each(f,function(i,e){if(l){e.title=w(e.title);}q.each(e.tiles,function(i,n){H(n,true);});});function x(){return(100*Math.random())<F;}function y(){return(100*Math.random())<h;}function z(){return M+j*Math.random();}function B(e,i){var n;for(n=0;n<e.tiles.length;n=n+1){if(i.id===e.tiles[n].id){return n;}}return-1;}function D(e,i){var n;for(n=0;n<e.length;n=n+1){if(i.id===e[n].id){return n;}}return-1;}function E(e){var i=q.Deferred();window.setTimeout(function(){i.resolve(e);},z());return i.promise();}function H(e,n){if(e.tileType!=="sap.ushell.ui.tile.DynamicTile"||!e.properties||!e.properties.serviceUrl){return;}if(e.intervalTimer){window.clearInterval(e.intervalTimer);e.intervalTimer=undefined;}if(n){var i=e.serviceRefreshInterval;if(i){i=i*1000;}else{i=10000;}e.intervalTimer=window.setInterval(function(){O.read(e.properties.serviceUrl+"?id="+e.id+"&t="+new Date().getTime(),function(){L.debug("Dynamic tile service call succeed for tile "+e.id);},function(J){L.debug("Dynamic tile service call failed for tile "+e.id+", error message:"+J);});},i);}}this.getGroups=function(){var e=q.Deferred();window.setTimeout(function(){e.resolve(f.slice(0));},z());return e.promise();};this.getDefaultGroup=function(){var e=new q.Deferred();e.resolve(t);return e.promise();};this.addGroup=function(e){var i=q.Deferred(),n=x(),J=this;window.setTimeout(function(){if(!n){var K={id:"group_"+f.length,title:e,tiles:[]};f.push(K);i.resolve(K);}else{J.getGroups().done(function(P){i.reject(P);}).fail(function(){i.reject();});}},z());return i.promise();};this.getGroupTitle=function(e){return e.title;};this.setGroupTitle=function(e,n){var i=q.Deferred(),J=x();window.setTimeout(function(){if(!J){e.title=n;i.resolve();}else{E(e).done(function(K){i.reject(K.title);}).fail(function(){i.reject();});}},z());return i.promise();};this.getGroupId=function(e){return e.id;};this.hideGroups=function(e){if(e&&f){for(var i=0;i<f.length;i++){if(e.indexOf(f[i].id)!==-1){f[i].isVisible=false;}else{f[i].isVisible=true;}}}return q.Deferred().resolve();};this.isGroupVisible=function(e){return e&&(e.isVisible===undefined?true:e.isVisible);};this.moveGroup=function(e,n){var i=q.Deferred(),J=x(),K=this;window.setTimeout(function(){if(!J){f.splice(n,0,f.splice(D(f,e),1)[0]);i.resolve();}else{K.getGroups().done(function(P){i.reject(P);}).fail(function(){i.reject();});}},z());return i.promise();};this.removeGroup=function(e){var i=q.Deferred(),n=x(),J=this;window.setTimeout(function(){if(!n){f.splice(D(f,e),1);q.each(e.tiles,function(K,P){H(P,false);});i.resolve();}else{J.getGroups().done(function(K){i.reject(K);}).fail(function(){i.reject();});}},z());return i.promise();};this.resetGroup=function(e){var i=q.Deferred(),n=x(),J=this;window.setTimeout(function(){if(!n){q.each(e.tiles,function(K,P){H(P,false);});e=q.extend(true,{},o.config.groups[D(o.config.groups,e)]);f.splice(D(f,e),1,e);q.each(e.tiles,function(K,P){H(P,true);});i.resolve(e);}else{J.getGroups().done(function(K){i.reject(K);}).fail(function(){i.reject();});}},z());return i.promise();};this.isGroupRemovable=function(e){return e&&!e.isPreset;};this.isGroupLocked=function(e){return e.isGroupLocked;};this.isGroupFeatured=function(e){return e.isFeatured;};this.getGroupTiles=function(e){return e.tiles;};this.getLinkTiles=function(e){return e.links;};this.getTileTitle=function(e){return e.title;};this.getTileType=function(e){if(e.isLink){return this.TileType.Link;}if(e.isCard){return this.TileType.Card;}return this.TileType.Tile;};this.getTileId=function(e){return e.id;};this.getTileSize=function(e){return e.size;};this.getTileTarget=function(e){var U;if(e.properties){U=e.properties.href||e.properties.targetURL;}return e.target_url||U||"";};this.isTileIntentSupported=function(e){if(e&&e.formFactor){var i=e.formFactor;var S=sap.ui.Device.system;var n;if(S.desktop){n="Desktop";}else if(S.tablet){n="Tablet";}else if(S.phone){n="Phone";}if(i.indexOf(n)===-1){return false;}}return true;};this.isLinkPersonalizationSupported=function(e){if(e){return e.isLinkPersonalizationSupported;}return true;};this.getTileView=function(e){var i=q.Deferred(),n=x(),J=this;if(y()){window.setTimeout(function(){if(!n){J._getTileView(e).done(function(K){i.resolve(K);});}else{i.reject();}},z());}else if(!n){J._getTileView(e).done(function(K){i.resolve(K);});}else{i.reject();}return i.promise();};this._getTileView=function(i){var n="unknown error",J,K,P=this.getTileType(i)==="link",Q=q.Deferred(),S=this;this._translateTileProperties(i);if(i.namespace&&i.path&&i.moduleType){_(i);if(i.moduleType==="UIComponent"){J=new C({component:sap.ui.getCore().createComponent({componentData:{properties:i.properties},name:i.moduleName}),height:"100%",width:"100%"});}else{J=sap.ui.view({viewName:i.moduleName,type:V[i.moduleType],viewData:{properties:i.properties},height:"100%"});}Q.resolve(J);return Q.promise();}else if(i.tileType){K=P?"Link":i.tileType;if(K){try{this._createTileInstance(i,K).done(function(U){J=U;S._handleTilePress(J);S._applyDynamicTileIfoState(J);Q.resolve(J);});return Q.promise();}catch(e){Q.resolve(new G({header:e&&(e.name+": "+e.message)||this.translationBundle.getText("failedTileCreationMsg"),frameType:this._parseTileSizeToGenericTileFormat(i.size)}));return Q.promise();}}else{n="TileType: "+i.tileType+" not found!";}}else{n="No TileType defined!";}Q.resolve(new G({header:n,frameType:this._parseTileSizeToGenericTileFormat(i.size)}));return Q.promise();};this._getCatalogTileViewAsync=function(i){var n=new q.Deferred(),J=this,K,P="unknown error",Q,S,U=this.getTileType(i)==="link";this._translateTileProperties(i);if(i.namespace&&i.path&&i.moduleType){_(i);if(i.moduleType==="UIComponent"){Q=new C({component:sap.ui.getCore().createComponent({componentData:{properties:i.properties},name:i.moduleName}),height:"100%",width:"100%"});}else{Q=sap.ui.view({viewName:i.moduleName,type:V[i.moduleType],viewData:{properties:i.properties},height:"100%"});}n.resolve(Q);return n.promise();}else if(i.tileType){S=U?"Link":i.tileType;if(S){try{K=this._createCatalogTileInstanceAsync(i,S);K.done(function(X){J._handleTilePress(X);J._applyDynamicTileIfoState(X);n.resolve(X);});}catch(e){n.resolve(new G({header:e&&(e.name+": "+e.message)||this.translationBundle.getText("failedTileCreationMsg"),frameType:this._parseTileSizeToGenericTileFormat(i.size)}));}}else{P="TileType: "+i.tileType+" not found!";}return n.promise();}P="No TileType defined!";n.resolve(new G({header:P,frameType:this._parseTileSizeToGenericTileFormat(i.size)}));return n.promise();};this._getCatalogTileView=function(i){var n="unknown error",J,K,P=this.getTileType(i)==="link";this._translateTileProperties(i);if(i.namespace&&i.path&&i.moduleType){_(i);if(i.moduleType==="UIComponent"){J=new C({component:sap.ui.getCore().createComponent({componentData:{properties:i.properties},name:i.moduleName}),height:"100%",width:"100%"});}else{J=sap.ui.view({viewName:i.moduleName,type:V[i.moduleType],viewData:{properties:i.properties},height:"100%"});}return J;}else if(i.tileType){K=P?"Link":i.tileType;if(K){try{J=this._createCatalogTileInstance(i,K);this._handleTilePress(J);this._applyDynamicTileIfoState(J);return J;}catch(e){return new G({header:e&&(e.name+": "+e.message)||this.translationBundle.getText("failedTileCreationMsg"),frameType:this._parseTileSizeToGenericTileFormat(i.size)});}}else{n="TileType: "+i.tileType+" not found!";}}else{n="No TileType defined!";}return new G({header:n,frameType:this._parseTileSizeToGenericTileFormat(i.size)});};this._createTileInstance=function(e,i){var n,J=q.Deferred(),K=this._getImageContent({src:e.properties.icon});K.addStyleClass("sapUshellFullWidth");switch(i){case"sap.ushell.ui.tile.DynamicTile":n=new G({header:e.properties.title,subheader:e.properties.subtitle,frameType:this._parseTileSizeToGenericTileFormat(e.size),url:W.getLeanURL(e.properties.targetURL),tileContent:new T({frameType:this._parseTileSizeToGenericTileFormat(e.size),footer:e.properties.info,unit:e.properties.numberUnit,content:new N({scale:e.properties.numberFactor,value:e.properties.numberValue,truncateValueTo:5,indicator:e.properties.stateArrow,valueColor:this._parseTileValueColor(e.properties.numberState),icon:e.properties.icon,width:"100%"})}),press:this._genericTilePressHandler.bind(this,e)});v[e.id]=n;J.resolve(n);break;case"sap.ushell.ui.tile.StaticTile":n=new G({mode:e.mode||(e.properties.icon?b.ContentMode:b.HeaderMode),header:e.properties.title,subheader:e.properties.subtitle,frameType:this._parseTileSizeToGenericTileFormat(e.size),url:W.getLeanURL(e.properties.targetURL),tileContent:new T({frameType:this._parseTileSizeToGenericTileFormat(e.size),footer:e.properties.info,content:K}),press:this._genericTilePressHandler.bind(this,e)});v[e.id]=n;J.resolve(n);break;case"Link":n=new G({mode:b.LineMode,subheader:e.properties.subtitle,header:e.properties.title,url:W.getLeanURL(e.properties.targetURL,e.properties.href),press:function(Q){this._genericTilePressHandler(e,Q);}.bind(this)});v[e.id]=n;J.resolve(n);break;default:var P=e.tileType.replace(/\./g,"/");sap.ui.require([P],function(){var Q=q.sap.getObject(e.tileType);n=new Q(e.properties||{});v[e.id]=n;J.resolve(n);});}return J.promise();};this.getCardManifest=function(e){var i=JSON.parse(JSON.stringify(e.manifest));return i;};this._createCatalogTileInstanceAsync=function(e,i){var n=new q.Deferred(),J,K=this._getImageContent({src:e.properties.icon});K.addStyleClass("sapUshellFullWidth");switch(i){case"sap.ushell.ui.tile.DynamicTile":J=new G({header:e.properties.title,subheader:e.properties.subtitle,frameType:this._parseTileSizeToGenericTileFormat(e.size),url:W.getLeanURL(e.properties.targetURL),tileContent:new T({frameType:this._parseTileSizeToGenericTileFormat(e.size),footer:e.properties.info,unit:e.properties.numberUnit,content:new N({scale:e.properties.numberFactor,value:e.properties.numberValue,truncateValueTo:5,indicator:e.properties.stateArrow,valueColor:this._parseTileValueColor(e.properties.numberState),icon:e.properties.icon,width:"100%"})}),press:function(P){this._genericTilePressHandler(e,P);}.bind(this)});break;case"sap.ushell.ui.tile.StaticTile":J=new G({mode:e.mode||(e.properties.icon?b.ContentMode:b.HeaderMode),header:e.properties.title,subheader:e.properties.subtitle,frameType:this._parseTileSizeToGenericTileFormat(e.size),url:W.getLeanURL(e.properties.targetURL),tileContent:new T({frameType:this._parseTileSizeToGenericTileFormat(e.size),footer:e.properties.info,content:K}),press:function(P){this._genericTilePressHandler(e,P);}.bind(this)});break;case"Link":J=new G({mode:b.LineMode,subheader:e.properties.subtitle,header:e.properties.title,url:W.getLeanURL(e.properties.targetURL,e.properties.href),press:function(P){this._genericTilePressHandler(e,P);}.bind(this)});break;default:i=e.tileType&&e.tileType.replace(/\./g,"/");sap.ui.require([i],function(P){J=new P(e.properties||{});n.resolve(J);});}n.resolve(J);return n.promise();};this._createCatalogTileInstance=function(e,i){var n,J,K,P=this._getImageContent({src:e.properties.icon});P.addStyleClass("sapUshellFullWidth");switch(i){case"sap.ushell.ui.tile.DynamicTile":n=new G({header:e.properties.title,subheader:e.properties.subtitle,frameType:this._parseTileSizeToGenericTileFormat(e.size),url:W.getLeanURL(e.properties.targetURL),tileContent:new T({frameType:this._parseTileSizeToGenericTileFormat(e.size),footer:e.properties.info,unit:e.properties.numberUnit,content:new N({scale:e.properties.numberFactor,value:e.properties.numberValue,truncateValueTo:5,indicator:e.properties.stateArrow,valueColor:this._parseTileValueColor(e.properties.numberState),icon:e.properties.icon,width:"100%"})}),press:function(Q){this._genericTilePressHandler(e,Q);}.bind(this)});break;case"sap.ushell.ui.tile.StaticTile":n=new G({mode:e.mode||(e.properties.icon?b.ContentMode:b.HeaderMode),header:e.properties.title,subheader:e.properties.subtitle,frameType:this._parseTileSizeToGenericTileFormat(e.size),url:W.getLeanURL(e.properties.targetURL),tileContent:new T({frameType:this._parseTileSizeToGenericTileFormat(e.size),footer:e.properties.info,content:P}),press:function(Q){this._genericTilePressHandler(e,Q);}.bind(this)});break;case"Link":n=new G({mode:b.LineMode,subheader:e.properties.subtitle,header:e.properties.title,url:W.getLeanURL(e.properties.targetURL,e.properties.href),press:function(Q){this._genericTilePressHandler(e,Q);}.bind(this)});break;default:J=e.tileType.replace(/\./g,"/");K=sap.ui.require(J);if(!K){if(!q.sap.getObject(e.tileType)){q.sap.require(e.tileType);}K=q.sap.getObject(e.tileType);}n=new K(e.properties||{});}return n;};this._genericTilePressHandler=function(e,i){if(i.getSource().getScope&&i.getSource().getScope()==="Display"){if(e.properties.targetURL){if(e.properties.targetURL[0]==="#"){hasher.setHash(e.properties.targetURL);}else{var n=a.last("/core/shell/enableRecentActivity")&&a.last("/core/shell/enableRecentActivityLogging");if(n){var J={title:e.properties.title,appType:A.URL,url:e.properties.targetURL,appId:e.properties.targetURL};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(J);}W.openURL(e.properties.targetURL,"_blank");}}}};this._parseTileSizeToGenericTileFormat=function(e){return e==="1x2"?"TwoByOne":"OneByOne";};this._parseTileValueColor=function(e){var i=e;switch(e){case"Positive":i="Good";break;case"Negative":i="Critical";break;}return i;};this._applyDynamicTileIfoState=function(e){var i=e.onAfterRendering;e.onAfterRendering=function(){if(i){i.apply(this,arguments);}var n=this.getModel(),J,K,P;if(!n){return;}J=n.getProperty("/data/display_info_state");K=this.getDomRef();P=K.getElementsByClassName("sapMTileCntFtrTxt")[0];switch(J){case"Negative":P.classList.add("sapUshellTileFooterInfoNegative");break;case"Neutral":P.classList.add("sapUshellTileFooterInfoNeutral");break;case"Positive":P.classList.add("sapUshellTileFooterInfoPositive");break;case"Critical":P.classList.add("sapUshellTileFooterInfoCritical");break;default:return;}};};this._handleTilePress=function(e){if(typeof e.attachPress==="function"){e.attachPress(function(){if(typeof e.getTargetURL==="function"){var i=e.getTargetURL();if(i){if(i[0]==="#"){hasher.setHash(i);}else{W.openURL(i,"_blank");}}}});}};this._translateTileProperties=function(e){if(this.translationBundle&&l&&!e._isTranslated){var i=e.properties,n=e.keywords;i.title=w(i.title);i.subtitle=w(i.subtitle);i.info=w(i.info);if(n){for(var J=0;J<n.length;J++){n[J]=w(n[J]);}}e._isTranslated=true;}};this.refreshTile=function(){};this.setTileVisible=function(e,n){H(e,n);};this.addTile=function(e,i){if(!i){i=t;}var n=q.Deferred(),J=x(),K=this;window.setTimeout(function(){if(!J){var P=q.extend(true,{title:"A new tile was added",size:"1x1"},e,{id:"tile_0"+e.chipId});i.tiles.push(P);H(P,true);n.resolve(P);}else{K.getGroups().done(function(Q){n.reject(Q);}).fail(function(){n.reject();});}},z());return n.promise();};this.removeTile=function(e,i){var n=q.Deferred(),J=x(),K=this;window.setTimeout(function(){if(!J){e.tiles.splice(B(e,i),1);H(i,false);n.resolve();}else{K.getGroups().done(function(P){n.reject(P);}).fail(function(){n.reject();});}},z());return n.promise();};this.moveTile=function(e,i,n,S,J,K){var P=q.Deferred(),Q=x(),U=this;window.setTimeout(function(){if(!Q){if(J===undefined){J=S;}e.isLink=K?(K===U.TileType.Link):e.isLink;S.tiles.splice(i,1);J.tiles.splice(n,0,e);P.resolve(e);}else{U.getGroups().done(function(X){P.reject(X);}).fail(function(){P.reject();});}},z());return P.promise();};this.getTile=function(){var e=q.Deferred();return e.promise();};this.getCatalogs=function(){var e=q.Deferred();g.forEach(function(i){window.setTimeout(function(){e.notify(i);},300);});window.setTimeout(function(){e.resolve(g);},1500);return e.promise();};this.isCatalogsValid=function(){return true;};this.getCatalogError=function(){return;};this.getCatalogId=function(e){return e.id;};this.getCatalogTitle=function(e){return e.title;};this.getCatalogTiles=function(e){var i=q.Deferred();window.setTimeout(function(){i.resolve(e.tiles);},z());return i.promise();};this.getCatalogTileId=function(e){if(e.chipId){return e.chipId;}return"UnknownCatalogTileId";};this.getCatalogTileTitle=function(e){return e.title;};this.getCatalogTileSize=function(e){return e.size;};this.getCatalogTileViewControl=function(e){return this._getCatalogTileViewAsync(e);};this.getCatalogTileView=function(e){return this._getCatalogTileView(e);};this.getCatalogTileTargetURL=function(e){return(e.properties&&e.properties.targetURL)||null;};this.getCatalogTilePreviewTitle=function(e){return(e.properties&&e.properties.title)||null;};this.getCatalogTilePreviewInfo=function(e){return(e.properties&&e.properties.info)||null;};this.getCatalogTilePreviewIndicatorDataSource=function(e){var i;if(e.properties&&e.properties.serviceUrl){i={path:e.properties.serviceUrl,refresh:e.properties.serviceRefreshInterval};}return i;};this.getCatalogTilePreviewSubtitle=function(e){return(e.properties&&e.properties.subtitle)||null;};this.getCatalogTilePreviewIcon=function(e){return(e.properties&&e.properties.icon)||null;};this.getCatalogTileKeywords=function(e){return q.merge([],q.grep(q.merge([e.title,e.properties&&e.properties.subtitle,e.properties&&e.properties.info],(e&&e.keywords)||[]),function(n){return n!==""&&n;}));};this.getCatalogTileTags=function(e){return(e&&e.tags)||[];};this.addBookmark=function(P,e){var i=e||t,n=q.Deferred(),J=x(),K=this,Q=P.title,S=P.subtitle,U=P.info,X=P.url,Y=this.isLinkPersonalizationSupported();window.setTimeout(function(){if(!J){var Z={title:Q,size:"1x1",chipId:"tile_0"+i.tiles.length,tileType:"sap.ushell.ui.tile.StaticTile",id:"tile_0"+i.tiles.length,isLinkPersonalizationSupported:Y,keywords:[],properties:{icon:"sap-icon://time-entry-request",info:U,subtitle:S,title:Q,targetURL:X}};i.tiles.push(Z);H(Z,true);n.resolve(Z);}else{K.getGroups().done(function($){n.reject($);}).fail(function(){n.reject();});}},z());return n.promise();};this.updateBookmarks=function(U,P){var e=new q.Deferred(),i=0,n=this.getGroups();n.done(function(J){J.forEach(function(K){K.tiles.forEach(function(Q){if(Q.properties&&Q.properties.targetURL===U){for(var S in P){if(P.hasOwnProperty(S)){Q.properties[S]=P[S];}}var X=v[Q.id];if(X!==undefined){X.setHeader(Q.properties.title);X.setSubheader(Q.properties.subtitle);}i++;}});});e.resolve(i);});n.fail(function(){e.reject();});return e.promise();};this.deleteBookmarks=function(U){var e=q.Deferred();var i=0;var n,J,K,P;for(K=0;K<f.length;K++){n=f[K];for(P=n.tiles.length-1;P>=0;P--){J=n.tiles[P];if(J.properties.targetURL===U){n.tiles.splice(P,1);i++;}}}e.resolve(i);return e.promise();};this.countBookmarks=function(U){var e=q.Deferred();var i=0;var n,J,K,P;for(K=0;K<f.length;K++){n=f[K];for(P=0;P<n.tiles.length;P++){J=n.tiles[P];if(J.properties.targetURL===U){i++;}}}e.resolve(i);return e.promise();};this._getImageContent=function(e){return new I(e);};this.onCatalogTileAdded=function(){};this.getTileActions=function(e){return(e&&e.actions)||null;};d.prototype._getCatalogTileIndex=function(){var e={};return Promise.resolve(e);};this.getCatalogTileNumberUnit=function(e){return(e.properties?e.properties.numberUnit:undefined);};};return d;},true);
