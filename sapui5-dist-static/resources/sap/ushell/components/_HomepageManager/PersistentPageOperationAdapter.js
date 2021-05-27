// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/Object","sap/ushell/Config","sap/ushell/resources","sap/ushell/components/MessagingHelper","sap/m/GenericTile","sap/base/util/uid","sap/base/Log","sap/ui/performance/Measurement","sap/m/library","sap/base/util/deepEqual"],function(q,B,C,r,m,G,g,L,M,a,d){"use strict";var b=a.GenericTileMode;var c=a.LoadState;var e={PERSONALIZATION:"FLP: Personalization",RENAME_GROUP:"FLP: Rename Group",MOVE_GROUP:"FLP: Move Group",DELETE_GROUP:"FLP: Delete Group",RESET_GROUP:"FLP: Reset Group",DELETE_TILE:"FLP: Delete Tile",ADD_TILE:"FLP: Add Tile",MOVE_TILE:"FLP: Move Tile"};function _(E,p){sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function(u){u.logCustomEvent(e.PERSONALIZATION,E,p);});}var P=B.extend("sap.ushell.components._HomepageManager.PersistentPageOperationAdapter",{constructor:function(){B.call(this);this.oPageBuilderService=sap.ushell.Container.getService("LaunchPage");},_getIsAppBox:function(o){if(!sap.ushell.Container){return false;}var s=this.oPageBuilderService,i=!!(s.getCatalogTileTargetURL(o)&&(s.getCatalogTilePreviewTitle(o)||s.getCatalogTilePreviewSubtitle(o)));return i;},getCurrentHiddenGroupIds:function(o){var h=o.getProperty("/groups"),H=[],s,i,j;for(i=0;i<h.length;i++){j=h[i]?h[i].isGroupVisible:true;if(h[i].object){s=this.oPageBuilderService.getGroupId(h[i].object);}if(!j&&s!==undefined){H.push(s);}}return H;},getPreparedTileModel:function(t,i,T){var s=this.oPageBuilderService,h=g(),o,S=s.getTileSize(t),l=[],j;T=T||s.getTileType(t);if(T==="link"){l=[new G({mode:sap.m.GenericTileMode.LineMode})];}o={"isCustomTile":!this._getIsAppBox(t),"object":t,"originalTileId":s.getTileId(t),"uuid":h,"tileCatalogId":encodeURIComponent(s.getCatalogTileId(t)),"content":l,"long":S==="1x2","target":s.getTileTarget(t)||"","debugInfo":s.getTileDebugInfo(t),"isTileIntentSupported":s.isTileIntentSupported(t),"rgba":"","isLocked":i,"showActionsIcon":C.last("/core/home/enableTileActionsIcon"),"isLinkPersonalizationSupported":s.isLinkPersonalizationSupported(t),"navigationMode":undefined};if(T==="card"){j=s.getCardManifest(t);o.isCard=true;if(j){o.manifest=j;}}return o;},getPreparedGroupModel:function(o,D,l,h){var s=this.oPageBuilderService,j=(o&&s.getGroupTiles(o))||[],k=[],n=[],i,p=C.last("/core/shell/model/personalization"),H=C.last("/core/extension/enableHelp");var I=!!(o&&s.isGroupLocked(o)),t=!!(o&&s.isGroupFeatured(o));for(i=0;i<j.length;++i){var T=j[i],u=s.getTileType(T).toLowerCase();if(u==="tile"||u==="card"){k.push(this.getPreparedTileModel(j[i],I,u));}else if(u==="link"){n.push(this.getPreparedTileModel(j[i],I,u));}else{L.error("Unknown tile type: '"+u+"'",undefined,"sap.ushell.components.HomepageManager");}}return{title:(D&&m.getLocalizedText("my_group"))||(o&&s.getGroupTitle(o))||(h&&h.title)||"",object:o,groupId:g(),helpId:(H&&o)?s.getGroupId(o):null,links:n,pendingLinks:[],tiles:k,isDefaultGroup:!!D,editMode:!o,isGroupLocked:I,isFeatured:t,visibilityModes:[true,true],removable:!o||s.isGroupRemovable(o),sortable:p,isGroupVisible:!o||s.isGroupVisible(o),isEnabled:!D,isLastGroup:l||false,isRendered:!!(h&&h.isRendered),isGroupSelected:false};},getPage:function(){M.start("FLP:DashboardManager.loadPersonalizedGroups","loadPersonalizedGroups","FLP");return this._getGroupsFromServer().then(this.loadGroupsFromArray.bind(this));},_getGroupsFromServer:function(){var t=this;return new Promise(function(h,i){t.oPageBuilderService.getGroups().done(function(j){M.end("FLP:DashboardManager.loadPersonalizedGroups");h(j);}).fail(i);});},loadGroupsFromArray:function(h){var t=this;M.start("FLP:DashboardManager.loadGroupsFromArray","loadGroupsFromArray","FLP");M.start("FLP:DashboardManager.getDefaultGroup","getDefaultGroup","FLP");return new Promise(function(j,k){t.oPageBuilderService.getDefaultGroup().done(function(D){M.end("FLP:DashboardManager.getDefaultGroup");if(h.length===0&&D===undefined){j([]);return;}var i=0,n,N=[],l,o;h=t._sortGroups(D,h);o=h.findIndex(function(p){return d(p,D);});l=h.length;M.start("FLP:DashboardManager._getGroupModel","_getGroupModel","FLP");for(i=0;i<l;++i){n=t.getPreparedGroupModel(h[i],i===o,i===l-1);n.index=i;N.push(n);}M.end("FLP:DashboardManager._getGroupModel");M.end("FLP:DashboardManager.loadGroupsFromArray");j(N);}).fail(k);});},_sortGroups:function(D,h){var i=0,t=this,j=h.findIndex(function(o){return d(o,D);}),l=[],k,o,n;if(j>-1){h.splice(j,1);}while(i<h.length){o=h[i];n=this.oPageBuilderService.isGroupLocked(o);if(n){l.push(o);h.splice(i,1);}else{i++;}}if(!C.last("/core/home/disableSortedLockedGroups")){l.sort(function(x,y){var p=t.oPageBuilderService.getGroupTitle(x).toLowerCase(),s=t.oPageBuilderService.getGroupTitle(y).toLowerCase();return p<s?-1:1;});}l.sort(function(x,y){var I=t.oPageBuilderService.isGroupFeatured(x),p=t.oPageBuilderService.isGroupFeatured(y);if(I===p){return 0;}else if(I>p){return-1;}return 1;});k=l;k.push(D);k.push.apply(k,h);return k;},addGroupAt:function(o,i,I){var t=this;return new Promise(function(h,j){try{if(i===undefined){t.oPageBuilderService.addGroup(o.title).done(function(n){var s=t.oPageBuilderService.getGroupId(n);_(e.RENAME_GROUP,[null,o.title,s]);h(t.getPreparedGroupModel(n,I,o.isLastGroup,undefined));}).fail(j);}else{t.oPageBuilderService.addGroupAt(o.title,i).done(function(n){var s=t.oPageBuilderService.getGroupId(n);_(e.RENAME_GROUP,[null,o.title,s]);h(t.getPreparedGroupModel(n,I,o.isLastGroup,undefined));}).fail(j);}}catch(k){j();}});},renameGroup:function(o,n,O){var t=this;return new Promise(function(h,i){try{t.oPageBuilderService.setGroupTitle(o.object,n).done(function(){var s=t.oPageBuilderService.getGroupId(o.object);_(e.RENAME_GROUP,[O,n,s]);h();}).fail(i);}catch(E){i();}});},deleteGroup:function(o){var t=this,s=o.object,h=this.oPageBuilderService.getGroupId(s),i=this.oPageBuilderService.getGroupTitle(s);return new Promise(function(j,k){try{t.oPageBuilderService.removeGroup(s).done(function(){_(e.DELETE_GROUP,[i,h]);j();}).fail(k);}catch(l){k();}});},moveGroup:function(o,t,i){var h=this;return new Promise(function(j,k){try{h.oPageBuilderService.moveGroup(o.object,t).done(function(){var s=h.oPageBuilderService.getGroupId(o.object);_(e.MOVE_GROUP,[o.title,i.iFromIndex,i.iToIndex,s]);j();}).fail(k);}catch(l){k();}});},resetGroup:function(o,i){var t=this,s=o.object,h=this.oPageBuilderService.getGroupId(s),j=this.oPageBuilderService.getGroupTitle(s);return new Promise(function(k,l){try{t.oPageBuilderService.resetGroup(s).done(function(R){_(e.RESET_GROUP,[j,h]);k(t.getPreparedGroupModel(R||s,i,o.isLastGroup,undefined));}).fail(l);}catch(n){l();}});},refreshGroup:function(s){var t=this,E="Failed to refresh group with id:"+s+" in the model";return new Promise(function(h){t.oPageBuilderService.getGroups().fail(function(){L.error(E,null,"sap.ushell.components.HomepageManager");h(null);}).done(function(j){var S=null;for(var i=0;i<j.length;i++){if(t.oPageBuilderService.getGroupId(j[i])===s){S=j[i];break;}}if(S){t.oPageBuilderService.getDefaultGroup().done(function(D){var I=s===D.getId(),o=t.getPreparedGroupModel(S,I,false,{isRendered:true});h(o);});}else{h(null);}});});},getIndexOfGroup:function(h,s){var n=-1,t=this,i=this.oPageBuilderService.getGroupId(s);h.every(function(o,j){var k=t.oPageBuilderService.getGroupId(o.object);if(k===i){n=j;return false;}return true;});return n;},getOriginalGroupIndex:function(o){var s=this.oPageBuilderService,S=o.object,h=this.oPageBuilderService.getGroups();return new Promise(function(j,k){h.done(function(l){var n;for(var i=0;i<l.length;i++){if(s.getGroupId(l[i])===s.getGroupId(S)){n=i;break;}}j(n);}).fail(k);});},moveTile:function(t,i,s,T,h){var j=this,S,p=new Promise(function(k,l){try{var R=j.oPageBuilderService.moveTile(t.object,i.tileIndex,i.newTileIndex,s.object,T.object,h);R.done(function(o){var u=[j.oPageBuilderService.getTileTitle(t.object),j.oPageBuilderService.getGroupTitle(s.object),j.oPageBuilderService.getGroupTitle(T.object),t.uuid];_(e.MOVE_TILE,u);S=o;k(o);});R.fail(l);}catch(n){l();}});return p.then(this._getTileViewAsPromise.bind(this)).then(function(v){return Promise.resolve({content:v,originalTileId:j.oPageBuilderService.getTileId(S),object:S});});},removeTile:function(o,t){var h=this,s=t.object,T=h.oPageBuilderService.getTileTitle(s),i=h.oPageBuilderService.getCatalogTileId(s),j=h.oPageBuilderService.getCatalogTileTitle(s),k=h.oPageBuilderService.getTileId(s),p;p=new Promise(function(l,n){try{h.oPageBuilderService.removeTile(o.object,s).done(function(){m.showLocalizedMessage("tile_deleted_msg",[T,o.title]);_(e.DELETE_TILE,[T||k,i,j,o.title]);l();}).fail(n);}catch(u){n();}});return p;},_getTileViewAsPromise:function(t){var h=this,p=new Promise(function(i,j){var k=h.oPageBuilderService.getTileView(t);k.done(i);k.fail(j);});return p;},refreshTile:function(s){this.oPageBuilderService.refreshTile(s);},setTileVisible:function(s,v){this.oPageBuilderService.setTileVisible(s,v);},getTileType:function(s){return this.oPageBuilderService.getTileType(s);},getTileSize:function(s){return this.oPageBuilderService.getTileSize(s);},getTileTitle:function(t){return this.oPageBuilderService.getTileTitle(t.object);},getTileId:function(s){return this.oPageBuilderService.getTileId(s);},isLinkPersonalizationSupported:function(s){return this.oPageBuilderService.isLinkPersonalizationSupported(s);},getTileTarget:function(t){return this.oPageBuilderService.getTileTarget(t.object);},getTileView:function(t){return this.oPageBuilderService.getTileView(t.object);},getTileActions:function(t){return this.oPageBuilderService.getTileActions(t);},getFailedLinkView:function(t){var s=this.oPageBuilderService.getCatalogTilePreviewSubtitle(t.object);var h=this.oPageBuilderService.getCatalogTilePreviewTitle(t.object);if(!h&&!s){h=r.i18n.getText("cannotLoadLinkInformation");}return new G({mode:b.LineMode,state:c.Failed,header:h,subheader:s});},getTileModelByCatalogTileId:function(s){L.error("Cannot get tile with id "+s+": Method is not supported");},transformGroupModel:function(){return;}});var f=null;return{getInstance:function(){if(!f){f=new P();}return f;},destroy:function(){f=null;}};});
