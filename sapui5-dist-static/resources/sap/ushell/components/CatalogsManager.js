// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/base/Object","sap/ushell/ui/launchpad/TileState","sap/ushell/EventHub","sap/ushell/utils","sap/ushell/components/DestroyHelper","sap/ushell/components/GroupsHelper","sap/ushell/components/MessagingHelper","sap/ushell/components/HomepageManager","sap/ushell/resources","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement","sap/base/Log","sap/ushell/Config"],function(B,T,e,u,d,g,m,H,r,q,M,L,C){"use strict";var c=B.extend("sap.ushell.components.CatalogsManager",{metadata:{publicMethods:["createGroup","createGroupAndSaveTile","createTile","deleteCatalogTileFromGroup","notifyOnActionFailure","resetAssociationOnFailure"]},analyticsConstants:{PERSONALIZATION:"FLP: Personalization",RENAME_GROUP:"FLP: Rename Group",MOVE_GROUP:"FLP: Move Group",DELETE_GROUP:"FLP: Delete Group",RESET_GROUP:"FLP: Reset Group",DELETE_TILE:"FLP: Delete Tile",ADD_TILE:"FLP: Add Tile",MOVE_TILE:"FLP: Move Tile"},_aDoableObjects:[],constructor:function(i,s){this.oLaunchPageService=sap.ushell.Container.getService("LaunchPage");this.oTileCatalogToGroupsMap={};this.skippedProcessCatalogs=0;this.tagsPool=[];this.iInitialLoad=100;this.oModel=s.model;var h={model:this.oModel};if(typeof sap.ushell.components.getHomepageManager==="function"){this.oHomepageManager=sap.ushell.components.getHomepageManager();}else{this.oHomepageManager=new H("dashboardMgr",h);}var I=this.getInterface();sap.ushell.components.getCatalogsManager=function(){return I;};this.registerEvents();},registerEvents:function(){var E=sap.ui.getCore().getEventBus();E.subscribe("renderCatalog",this.loadAllCatalogs,this);this._aDoableObjects=[e.on("showCatalog").do(this.updateTilesAssociation.bind(this)),e.on("updateGroups").do(this.updateTilesAssociation.bind(this))];},unregisterEvents:function(){var E=sap.ui.getCore().getEventBus();E.unsubscribe("renderCatalog",this.loadAllCatalogs,this);this._aDoableObjects.forEach(function(D){D.off();});},getModel:function(){return this.oModel;},loadAllCatalogs:function(){var G=new q.Deferred();var t=this;var s;G.resolve();s=function(){G.done(function(){var a=t.getModel().getProperty("/groups");if(a&&a.length!==0){t.updateTilesAssociation();}});};if(!this.oModel.getProperty("/catalogs")){if(!this.oModel.getProperty("/groups")||this.oModel.getProperty("/groups").length===0){if(!C.last("/core/spaces/enabled")){G=this.oHomepageManager.loadPersonalizedGroups();}}d.destroyFLPAggregationModels(this.oModel.getProperty("/catalogs"));d.destroyTileModels(this.oModel.getProperty("/catalogTiles"));this.oModel.setProperty("/catalogs",[]);this.oModel.setProperty("/catalogSearchEntity",{appBoxes:[],customTiles:[]});this.aPromises=[];M.start("FLP:DashboardManager.GetCatalogsRequest","GetCatalogsRequest","FLP");M.start("FLP:DashboardManager.getCatalogTiles","getCatalogTiles","FLP");M.pause("FLP:DashboardManager.getCatalogTiles");M.start("FLP:DashboardManager.BuildCatalogModelWithRendering","BuildCatalogModelWithRendering","FLP");M.pause("FLP:DashboardManager.BuildCatalogModelWithRendering");this.oLaunchPageService.getCatalogs().done(function(a){var i=a.slice(0,this.iInitialLoad);M.end("FLP:DashboardManager.GetCatalogsRequest");this.aPromises=i.map(this.addCatalogToModel.bind(this));Promise.all(this.aPromises).then(this.processPendingCatalogs.bind(this)).then(function(){this.aPromises=a.slice(this.iInitialLoad).map(this.addCatalogToModel.bind(this));Promise.all(this.aPromises).then(this.processPendingCatalogs.bind(this));}.bind(this)).then(this.onDoneLoadingCatalogs.bind(this,a)).then(s);}.bind(this)).fail(m.showLocalizedErrorHelper("fail_to_load_catalog_msg"));}else{s();}},updateTilesAssociation:function(){this.mapCatalogTilesToGroups();this.updateCatalogTilesToGroupsMap();},mapCatalogTilesToGroups:function(){this.oTileCatalogToGroupsMap={};var G=this.oModel.getProperty("/groups");var t,a,b,f,h;var i=this;G.forEach(function(o){["tiles","links"].forEach(function(A){a=o[A];if(a){for(t=0;t<a.length;++t){b=encodeURIComponent(i.oLaunchPageService.getCatalogTileId(a[t].object));f=i.oTileCatalogToGroupsMap[b]||[];h=i.oLaunchPageService.getGroupId(o.object);if(f.indexOf(h)===-1&&(typeof(o.isGroupVisible)==="undefined"||o.isGroupVisible)&&!o.isGroupLocked){f.push(h);}i.oTileCatalogToGroupsMap[b]=f;}}});});},updateCatalogTilesToGroupsMap:function(){var a=this.getModel().getProperty("/catalogs");var i,t,b,G,f,h,j,k,A,o;if(a){for(i=0;i<a.length;i++){h=a[i].appBoxes;if(h){for(k=0;k<h.length;k++){A=h[k];t=encodeURIComponent(this.oLaunchPageService.getCatalogTileId(A.src));G=this.oTileCatalogToGroupsMap[t];b=(G||[]);A.associatedGroups=b;}}f=a[i].customTiles;if(f){for(j=0;j<f.length;j++){o=f[j];t=encodeURIComponent(this.oLaunchPageService.getCatalogTileId(o.src));G=this.oTileCatalogToGroupsMap[t];b=(G||[]);o.associatedGroups=b;}}}}this.getModel().setProperty("/catalogs",a);},addCatalogToModel:function(o){var a={title:this.oLaunchPageService.getCatalogTitle(o),id:this.oLaunchPageService.getCatalogId(o),numberTilesSupportedOnCurrectDevice:0,static:false,customTiles:[],appBoxes:[]};M.resume("FLP:DashboardManager.getCatalogTiles");return this.oLaunchPageService.getCatalogTiles(o).then(function(b){M.pause("FLP:DashboardManager.getCatalogTiles");return{oCatalogEntry:b,oCatalogModel:a};}).fail(m.showLocalizedErrorHelper("fail_to_load_catalog_tiles_msg"));},getTagList:function(f){var i={};var h=0;var t=[];var j,o,s;if(this.oModel.getProperty("/tagList")&&this.oModel.getProperty("/tagList").length>0){this.tagsPool.concat(this.oModel.getProperty("/tagList"));}for(h=0;h<this.tagsPool.length;h++){o=this.tagsPool[h];if(i[o]){i[o]++;}else{i[o]=1;}}for(j in i){t.push({tag:j,occ:i[j]});}s=t.sort(function(a,b){return b.occ-a.occ;});if(f){this.oModel.setProperty("/tagList",s.slice(0,f));}else{this.oModel.setProperty("/tagList",s);}},processPendingCatalogs:function(p){var a=this.oModel.getProperty("/catalogs");var P,o,b,E,i,f;var h=sap.ui.getCore().getEventBus();var A=this.oModel.getProperty("/masterCatalogs")||[{title:m.getLocalizedText("all")}];M.end("FLP:DashboardManager.getCatalogTiles");M.resume("FLP:DashboardManager.BuildCatalogModelWithRendering");this.skippedProcessCatalogs=0;while(p.length>0){P=p.shift();o=P.oCatalogEntry;b=P.oCatalogModel;E=this.searchModelCatalogByTitle(b.title);if(E.result){f=this.oModel.getProperty("/catalogs")[E.indexOfPreviousInstanceInModel];i=false;}else{i=true;f=b;}var j=function(k,l){var n;if(this._getIsIntentSupported(l)){if(this._getIsAppBox(l)){n=this.createCatalogAppBoxes(l,true);k.appBoxes.push(n);}else{var s=this.createCatalogTiles(l);k.customTiles.push(s);if(!this.aFnToGetTileView){this.aFnToGetTileView=[];}}}}.bind(this,f);o.forEach(j);if(f.appBoxes.length>0||f.customTiles.length>0){if(i){a.push(b);A.push({title:b.title});}}if(this.oModel.getProperty("/enableCatalogTagFilter")===true){this.getTagList();}}this.oModel.setProperty("/masterCatalogs",A);this.oModel.setProperty("/catalogs",a);h.publish("launchpad","afterCatalogSegment");setTimeout(function(){u.setPerformanceMark("FLP-TTI-AppFinder",{bUseUniqueMark:true});},0);M.pause("FLP:DashboardManager.BuildCatalogModelWithRendering");},loadCustomTilesKeyWords:function(){var f;if(this.aFnToGetTileView){while(this.aFnToGetTileView.length>0){f=this.aFnToGetTileView.pop();f();}}},searchModelCatalogByTitle:function(a){var b=this.oModel.getProperty("/catalogs");var f=false;var i;var n=0;var G=false;q.each(b,function(h,t){if(t.title===r.i18n.getText("catalogsLoading")){G=true;}else if(a===t.title){i=h;n=t.numberOfTiles;f=true;return false;}return undefined;});return{result:f,indexOfPreviousInstanceInModel:i,indexOfPreviousInstanceInPage:G?i-1:i,numOfTilesInCatalog:n};},createCatalogAppBoxes:function(o,G){var a=encodeURIComponent(this.oLaunchPageService.getCatalogTileId(o));var b=this.oTileCatalogToGroupsMap[a]||[];var t=this.oLaunchPageService.getCatalogTileTags(o)||[];if(t.length>0){this.tagsPool=this.tagsPool.concat(t);}var n;if(o.tileResolutionResult){n=o.tileResolutionResult.navigationMode;}return{id:a,associatedGroups:b,src:o,title:this.oLaunchPageService.getCatalogTilePreviewTitle(o),subtitle:this.oLaunchPageService.getCatalogTilePreviewSubtitle(o),icon:this.oLaunchPageService.getCatalogTilePreviewIcon(o),keywords:G?(this.oLaunchPageService.getCatalogTileKeywords(o)||[]).join(","):[],tags:t,navigationMode:n,url:this.oLaunchPageService.getCatalogTileTargetURL(o)};},onDoneLoadingCatalogs:function(a){var i;var b=[];var t=this;for(i=0;i<a.length;i++){b.push(this.oLaunchPageService.getCatalogTiles(a[i]));}Promise.all(b).then(function(R){var I;var n=true;for(I=0;I<R.length;I++){if(R[I].length!==0){n=false;break;}}if(n||!a.length){t.oModel.setProperty("/catalogsNoDataText",r.i18n.getText("noCatalogs"));}});var E=sap.ui.getCore().getEventBus();E.publish("launchpad","catalogContentLoaded");var l=a.filter(function(o){var s=t.oLaunchPageService.getCatalogError(o);if(s){L.error("A catalog could not be loaded",s,"sap.ushell.components.CatalogsManager");}return!s;});if(l.length!==a.length){m.showLocalizedError("partialCatalogFail");}u.handleTilesVisibility();},createCatalogTiles:function(o){var t,a;var b=encodeURIComponent(this.oLaunchPageService.getCatalogTileId(o));var f=this.oTileCatalogToGroupsMap[b]||[];var h=this.oLaunchPageService.getCatalogTileTags(o)||[];if(h.length>0){this.tagsPool=this.tagsPool.concat(h);}t=new T({state:"Loading"});var s=o.getChip&&o.getChip().getBaseChipId&&o.getChip().getBaseChipId();if(s&&["X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER","X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER"].indexOf(s)===-1){this.oLaunchPageService.getCatalogTileView(o);}a=this.oLaunchPageService.getCatalogTilePreviewTitle(o);if(!a){a=this.oLaunchPageService.getCatalogTileTitle(o);}return{associatedGroups:f,src:o,catalog:o.title,catalogId:o.id,title:a,tags:h,keywords:(this.oLaunchPageService.getCatalogTileKeywords(o)||[]).join(","),id:b,size:this.oLaunchPageService.getCatalogTileSize(o),content:[t],isTileIntentSupported:this.oLaunchPageService.isTileIntentSupported(o),tileType:o.tileType};},createGroupAndSaveTile:function(D){var t=this;var o=D.catalogTileContext;var n=D.newGroupName;var a=new q.Deferred();var R={};if(u.validHash(n)&&o){this.createGroup(n).then(function(b){var p=t.createTile({catalogTileContext:o,groupContext:b});p.done(function(f){R={group:f.group,status:1,action:"addTileToNewGroup"};a.resolve(R);}).fail(function(f){R={group:f.group,status:0,action:"addTileToNewGroup"};a.resolve(R);});});}return a.promise();},createGroup:function(t){var a=this;var D=new q.Deferred();if(!u.validHash(t)){return D.reject({status:0,action:"createNewGroup"});}var R=this.oLaunchPageService.addGroup(t);R.done(function(G){var o=a.oHomepageManager.addGroupToModel(G);D.resolve(o);});R.fail(function(){m.showLocalizedError("fail_to_create_group_msg");var o={status:0,action:"createNewGroup"};D.resolve(o);});return D.promise();},createTile:function(D){var t=this;var o=D.catalogTileContext;var a=D.groupContext;var G=this.oModel.getProperty(a.getPath());var s=G.groupId;var R;var b=new q.Deferred();var f={};var E;E=sap.ui.getCore().getEventBus();E.publish("launchpad","addTile",{catalogTileContext:o,groupContext:a});if(!o){L.warning("CatalogsManager: Did not receive catalog tile object. Abort.",this);f={group:G,status:0,action:"add"};return Promise.resolve(f);}R=this.oLaunchPageService.addTile(o.getProperty("src"),a.getProperty("object"));R.done(function(h){var i=t.oModel.getProperty("/groups");var j=g.getModelPathOfGroup(i,s);var k=t.oLaunchPageService.getTileTitle(h);t.oHomepageManager.addTileToGroup(j,h);f={group:G,status:1,action:"add"};sap.ushell.Container.getService("UsageAnalytics").logCustomEvent(t.analyticsConstants.PERSONALIZATION,t.analyticsConstants.ADD_TILE,[G.title,k]);b.resolve(f);}).fail(function(){m.showLocalizedError("fail_to_add_tile_msg");f={group:G,status:0,action:"add"};b.resolve(f);});return b.promise();},deleteCatalogTileFromGroup:function(D){var t=this;var s=decodeURIComponent(D.tileId);var G=D.groupIndex;var o=this.oModel.getProperty("/groups/"+G);var a=new q.Deferred();var b=[];var R=[];var p,f;["tiles","links"].forEach(function(A){o[A].forEach(function(h){var i=t.oLaunchPageService.getCatalogTileId(h.object);if(i===s){p=new q.Deferred();f=t.oLaunchPageService.removeTile(o.object,h.object);f.done((function(j){return function(){R.push(h.uuid);j.resolve({status:true});};})(p));f.fail((function(j){return function(){j.resolve({status:false});};})(p));b.push(p);}});});q.when.apply(q,b).done(function(h){var S=b.length===R.length;t.oHomepageManager.deleteTilesFromGroup(o.groupId,R);t.updateTilesAssociation();a.resolve({group:o,status:S,action:"remove"});});return a.promise();},calculateCatalogTileIndex:function(a,n,t){var b=parseInt(a*100000,10);b+=(n!==undefined?n:0)+t;return b;},notifyOnActionFailure:function(s,p){m.showLocalizedError(s,p);},resetAssociationOnFailure:function(s,p){this.notifyOnActionFailure(s,p);this.updateTilesAssociation();},_getIsIntentSupported:function(o){return!!(this.oLaunchPageService.isTileIntentSupported(o));},_getIsAppBox:function(o){var a,i;if(!sap.ushell.Container){return false;}a=this.oModel.getProperty("/appFinderDisplayMode");if(a==="tiles"){i=false;}else{i=!!(this.oLaunchPageService.getCatalogTileTargetURL(o)&&(this.oLaunchPageService.getCatalogTilePreviewTitle(o)||this.oLaunchPageService.getCatalogTilePreviewSubtitle(o)));}return i;},destroy:function(){this.unregisterEvents();}});return c;});
