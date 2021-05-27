// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/ui/Device","sap/ui/thirdparty/jquery"],function(C,D,q){"use strict";var a=function(s){this.init(s);};a.prototype={settings:null,tileWidth:0,tileHeight:0,tileMargin:0,curTouchMatrixCords:null,tilesInRow:null,groupsList:null,item:null,matrix:null,tiles:null,collisionLeft:false,startGroup:null,currentGroup:null,endGroup:null,init:function(s){this.curTouchMatrixCords={column:null,row:null};this.endGroup=null;this.groupSwitched=false;this.item=null;this.matrix=null;this.tiles=null;this.collisionLeft=false;this.startArea=null;this.currentArea=null;this.endArea=undefined;this.startGroup=null;this.draggedTileDomRef=null;this.sDragStartGroupModelId=undefined;this.sDragTargetGroupModelId=undefined;this.currentGroup=null;this.groupsList=null;this.allGroups=null;this.settings=this.settings||s;q.extend(this,this.settings);this.tileWidth=this.thisLayout.styleInfo.tileWidth;this.tileHeight=this.thisLayout.styleInfo.tileHeight;this.tileMargin=this.thisLayout.styleInfo.tileMarginWidth;this.aExcludedControlClass=this.aExcludedControlClass||[];this.reorderElementsCallback=this.reorderElementsCallback||function(){};this.rightToLeft=sap.ui.getCore().getConfiguration().getRTL();this.tabBarArrowCollisionRight=false;this.tabBarArrowCollisionLeft=false;this.collidedLinkAreas=[];this.intersectedLink=null;this.aLinksBoundingRects=[];this.intersectedLinkPlaceHolder=undefined;this.isLinkPersonalizationSupported=sap.ushell.Container?sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported():null;this.isLinkMarkerShown=false;this.bIsTabBarCollision=false;},isTabBarCollision:function(){return this.bIsTabBarCollision;},moveDraggable:function(m,c,t){var o=this.getCollisionObject(m,c,t),n;if(o){this._toggleAnchorItemHighlighting(false);if(o.collidedObjectType!=="TabBar"){this._toggleTabBarOverflowArrows(false);this.thisLayout.setOnTabBarElement(false);this._resetOverFlowButtonElements();this.bIsTabBarCollision=false;}else{this.bIsTabBarCollision=true;this._toggleTabBarOverflowArrows(true);this.removePlaceHolders();this._handleTabBarCollision(m,t);}if(this.isLinkPersonalizationSupported&&o.collidedObjectType==="Group-link"){n=this._handleLinkAreaIntersection(o.collidedObject,m,c);}else if(o.collidedObjectType==="Group-tile"){n=this._handleTileAreaIntersection(o.collidedObject,m,c);this._toggleTileCloneHoverOpacity(false);}if(n||this.endAreaChanged){this.handlePlaceHolder(o.collidedObject);}}else{this._removeEmptyLinkAreaMark();}},_toggleAnchorItemHighlighting:function(h){if(this.targetGroup){this.targetGroup.classList.toggle("sapUshellAnchorItemDropCollision",h);this.targetGroup.firstElementChild.classList.toggle("sapUshellAnchorInnerMarker",h);}},removePlaceHolders:function(){this._removeLinkDropMarker();this._removeEmptyLinkAreaMark();this._handleChangedGroup(this.currentGroup);},handlePlaceHolder:function(c){if(this.endArea==="tiles"){if(this.endAreaChanged){this._removeLinkDropMarker();}this.handlePlaceholderChange();}else if(this.endArea==="links"&&this.intersectedLink){this._changeLinkPlaceholder(this.intersectedLink,c);if(this.endAreaChanged){this.handlePlaceholderChange();}}},switchLinkWithClone:function(i){if(i){this.intersectedLinkPlaceHolder=i.getDomRef().cloneNode(true);this.intersectedLinkPlaceHolder.id="sapUshellIntersectedLinkPlaceHolder";q(i.getDomRef()).replaceWith(this.intersectedLinkPlaceHolder);}},_removeLinkDropMarker:function(){q("#sapUshellLinkDropMarker").remove();this.isLinkMarkerShown=false;},saveLinkBoundingRects:function(e){var l=sap.ui.getCore().byId(e.id);this.draggedLinkBoundingRects=l.getBoundingRects();},_getMarkerOffset:function(r,c){var n=q(c.getDomRef()).find(".sapUshellLineModeContainer")[0].getBoundingClientRect().left,d=q(c.getDomRef()).find(".sapUshellLineModeContainer")[0].getBoundingClientRect().top,e=this.rightToLeft?20:-1,f=this.rightToLeft?42:21,g=r[r.length-1].offset.x-n+r[r.length-1].width-e,l=r[this.rightToLeft?r.length-1:0].offset.x-n-f,t=r[this.rightToLeft?r.length-1:0].offset.y-d,h=r[this.rightToLeft?0:r.length-1].offset.y-d;if(q("body.sapUiSizeCompact").length){t-=6;h-=6;}if(this.rightToLeft){if(q(c.getDomRef()).find(".sapUshellLineModeContainer")[0].getBoundingClientRect().right-r[r.length-1].offset.x-r[r.length-1].width<16){g=g-8;}}else if(l<16){l=0;}return{right:g,left:l,topLeft:t,topRight:h};},_changeLinkPlaceholder:function(l,c){var o=this.aLinksBoundingRects[l.link.getId()],d=o.left,t=o.topLeft,e=o.topRight,r=o.right;if(q(c.getDomRef()).find("#sapUshellLinkDropMarker").length===0){this._removeLinkDropMarker();q(c.getDomRef()).find(".sapUshellLinksInnerContainer").prepend(this.LinkDropMarker);}q(this.LinkDropMarker).css({left:l.leftSide?d:r,top:l.leftSide?t:e});this.isLinkMarkerShown=true;},showTilePlaceholder:function(c,t,T){var d,r=this.curTouchMatrixCords.row,e=this.curTouchMatrixCords.column;this.domRef=this.item.getDomRef()?this.item.getDomRef():this.domRef;q(this.domRef).show();this.removeExcludedElementsFromMatrix(this.aExcludedControlClass);d=this.tiles||this.thisLayout.getGroupTiles(this.endGroup).slice(0);if(this.matrix[r]&&typeof this.matrix[r][e]==="object"){this.handleMatrixCollision(d,c,t,T);return;}this._handleMoveOutOfBorders(d,c);},removeTilePlaceholder:function(){this.domRef=this.item.getDomRef()?this.item.getDomRef():this.domRef;var c=this.thisLayout.getGroupTiles(this.currentGroup);c=c.slice(0);if(this.startArea!=="links"&&c.indexOf(this.item)>-1){c.splice(c.indexOf(this.item),1);}if(!q(this.domRef.parentNode).hasClass("sapUshellLinksInnerContainer")){q(this.domRef).hide();}this.thisLayout.initGroupDragMode(this.endGroup);var d=this.thisLayout.organizeGroup(c);this.thisLayout.renderLayoutGroup(this.currentGroup,d);},handlePlaceholderChange:function(){var c=this.currentGroup,t=(this.endGroup!==this.currentGroup),T=this.endAreaChanged&&this.endArea==="links",i=this.thisLayout.isTabBarActive()&&this.groupSwitched;this.tiles=this.thisLayout.getGroupTiles(this.endGroup).slice(0);this.matrix=this.thisLayout.organizeGroup(this.tiles);if(i){this.handleTabBarSwitch(c);}if(t){this._handleChangedGroup(c);}else if(T){this.removeTilePlaceholder();}if(!T){this.showTilePlaceholder(c,t,T);}},handleMatrixCollision:function(t,c,T,d){var r,e,f,n;r=this.matrix[this.curTouchMatrixCords.row][this.curTouchMatrixCords.column];e=t.indexOf(r);f=t.indexOf(this.item);if(this.rightToLeft){this.collisionLeft=!this.collisionLeft;}if(f>-1&&f<e){r=t[e+1];}if(r===this.item){if(T||d){t.splice(t.indexOf(this.item),1);}this._handleTileReplace(t,c);return;}n=this.changeTilesOrder(this.item,r,t,this.matrix);if(n&&!this.isLinkMarkerShown){this._handleTileReplace(n,c);}},handleTabBarSwitch:function(c){this._appendTargetGroupDomRefWithDraggedTile();if(!this.item.getDomRef()){this.endGroup.getInnerContainersDomRefs()[0].appendChild(this.draggedTileDomRef);}else{this.endGroup.getInnerContainersDomRefs()[0].appendChild(this.item.getDomRef());}this.currentGroup=this.endGroup;var d=this.thisLayout.getGroupTiles(c);this.thisLayout.initGroupDragMode(this.endGroup);var e=this.thisLayout.organizeGroup(d);this.thisLayout.renderLayoutGroup(c,e);},_handleMoveOutOfBorders:function(t,c){var m=this.findTileToPlaceAfter(this.matrix,t),r;if(t[m+1]==this.item){return;}if(t[m+1]){r=t[m+1];}else if(this.currentGroup.getShowPlaceholder()){r=t[0];}var n=this.changeTilesOrder(this.item,r,t,this.matrix);if(n){this._handleTileReplace(n,c);}},_handleChangedGroup:function(c){var d=this.thisLayout.getGroupTiles(this.currentGroup),i;if(this.currentGroup===this.startGroup&&(this.startArea==="tiles"||this.intersectedLinkPlaceHolder)){d=d.slice(0);if(d.indexOf(this.item)>-1){d.splice(d.indexOf(this.item),1);}}if(this.startGroup===this.endGroup&&this.startArea==="tiles"){this.tiles.splice(this.tiles.indexOf(this.item),1);}i=this.item.getDomRef()||this.domRef;if(this.startArea==="links"&&!this.intersectedLinkPlaceHolder){this.switchLinkWithClone(this.item);}if(this.endArea==="tiles"){this.endGroup.getInnerContainersDomRefs()[0].appendChild(i);}if(!q(i.parentNode).hasClass("sapUshellLinksInnerContainer")){q(i).hide();}this.currentGroup=this.endGroup;this.thisLayout.initGroupDragMode(this.endGroup);var e=this.thisLayout.organizeGroup(d);this.thisLayout.renderLayoutGroup(c,e);},_handleTileReplace:function(t,c){this.reorderElementsCallback({currentGroup:c,endGroup:this.endGroup,tiles:t,item:this.item});this.reorderTilesView(t,this.endGroup);this.reorderTilesInDom();this.thisLayout.renderLayoutGroup(this.endGroup,this.matrix);},_getIntersectedLink:function(c,m,d){var e=q(".sapUshellLinkTile")[0];if(!e){return;}var f=c.getDomRef().querySelector(".sapUshellLineModeContainer").getBoundingClientRect(),g=!q("body.sapUiSizeCompact").length,r=Math.floor((d-f.top)/(g?45:31)),h=this.collidedLinkAreas[c.getId()],i;if(this.rightToLeft){i=Math.floor((f.right-m)/20);}else{i=Math.floor((m-f.left)/20);}if(r<h.length&&h[r]&&i<h[r].length){return h[r][i];}else if(h.length){var l=h.length;if(r>=l){r=l-1;}if(!this.collidedLinkAreas[c.getId()][r]){return;}i=this.collidedLinkAreas[c.getId()][r].length;return this.collidedLinkAreas[c.getId()][r][i-1];}},_mapGroupLinks:function(c){var g=c.getId(),l,r,R=0;if(!this.collidedLinkAreas[g]||this.bElapseGroupLinksMap){this.bElapseGroupLinksMap=false;var d=c.getLinks(),e=[];this.collidedLinkAreas.push(c.getId());d.forEach(function(i){r=this._getLinkBoundingRects(i,c);r.forEach(function(o){if(o.offset.y>l){R++;}l=o.offset.y;this._addLinkToHashMap(e,c,o,R,i);}.bind(this));}.bind(this));this.collidedLinkAreas[g]=e;}},_getLinkBoundingRects:function(l,c){var r=l.getBoundingRects();if(this.item&&this.item.getId()===l.getId()){r=this.draggedLinkBoundingRects;}if(r.length){this.aLinksBoundingRects[l.getId()]=this._getMarkerOffset(r,c);}return r;},_addLinkToHashMap:function(c,d,r,e,l){if(!c[e]){c[e]=[];}for(var i=0;i<=(r.width+20)/20;i++){var f={link:l,leftSide:!this.rightToLeft};if(i>((r.width+20)/20)/2){f.leftSide=this.rightToLeft;}c[e].push(f);}},_isLinkAreaIntersection:function(c,m,d){var i=c.getInnerContainersDomRefs();if(i[1]){return this._isElementCollideByGivenCordinates(i[1],m,d);}return false;},_isLinksEquals:function(l,o){if(!l||!o){return false;}if(l.link.getId()!==o.link.getId()){return false;}return l.link.leftSide===o.link.leftSide;},_toggleTileCloneHoverOpacity:function(v){q(".sapUshellTile-clone").toggleClass("sapUshellTileDragOpacity",v);},_handleLinkAreaIntersection:function(c,m,d){var i,e=false;if(this.isLinkPersonalizationSupported){this._toggleTileCloneHoverOpacity(true);}this._mapGroupLinks(c);this.matrix=this.matrix||this.thisLayout.organizeGroup(this.thisLayout.getGroupTiles(c));i=this._getIntersectedLink(c,m,d);if(i){e=this._isLinksEquals(this.intersectedLink,i);this.intersectedLink=i;}else{this.removeTilePlaceholder();}this._markEmptyLinkArea(c);return e;},_markEmptyLinkArea:function(c){if(!c.getLinks().length){q(c.getDomRef()).find(".sapUshellLineModeContainer").addClass("sapUshellEmptyLinkAreaHover");}},_removeEmptyLinkAreaMark:function(){q(".sapUshellLineModeContainer").removeClass("sapUshellEmptyLinkAreaHover");},reorderTilesInDom:function(){var j=this.item.getDomRef()?this.item.getDomRef():this.domRef,s=q(j).index(),c=q(j).closest(".sapUshellTilesContainer-sortable"),d=this.calcDestIndexInGroup(),e=q(this.endGroup.getDomRef()).find(".sapUshellTilesContainer-sortable"),f=e.find(".sapUshellTile");if(this.startArea==="tiles"){c.find(f[s]).remove();}else if(!this.intersectedLinkPlaceHolder){this.switchLinkWithClone(this.item);}if(this.endArea!=="links"){f=e.find(".sapUshellTile");if(C.last("/core/home/gridContainer")){if(e[0].firstElementChild.children.length){e[0].firstElementChild.insertBefore(j,f[d]);}else{e[0].firstElementChild.appendChild(j);}}else{e[0].insertBefore(j,f[d]);}}},isLinkIntersected:function(){return this.intersectedLink!==undefined;},calcDestIndexInGroup:function(){var l,t=0,i,j,I=false;for(i=0;i<this.matrix.length&&!I;i++){for(j=0;j<this.matrix[i].length;j++){if(this.matrix[i][j]!==undefined){if(this.item.sId!==this.matrix[i][j].sId){if(l!==this.matrix[i][j].sId){l=this.matrix[i][j].sId;t++;}}else{I=true;break;}}}}return t;},layoutStartCallback:function(e){this.init();this.item=sap.ui.getCore().byId(e.id);this.tilesInRow=this.thisLayout.getTilesInRow();this.groupsList=this.thisLayout.getGroups();this.allGroups=this.thisLayout.getAllGroups();this.startGroup=this.currentGroup=this.item.getParent();if(C.last("/core/home/gridContainer")&&this.startGroup.getParent().getId()!=="dashboardGroups"){this.startGroup=this.currentGroup=this.startGroup.getParent();}this.groupSwitched=false;this.startArea=this.isLinkPersonalizationSupported&&this.item.getMode&&this.item.getMode()==="LineMode"?"links":"tiles";this.currentArea=this.startArea;this.thisLayout.initDragMode();if(this.isLinkPersonalizationSupported){this.LinkDropMarker=this._getLinkDropMarkerElement();}},_getLinkDropMarkerElement:function(){var e=document.createElement("DIV"),c=document.createElement("DIV"),d=document.createElement("DIV");e.setAttribute("id","sapUshellLinkDropMarker");c.setAttribute("id","sapUshellLinkDropMarkerDot");d.setAttribute("id","sapUshellLinkDropMarkerLine");e.appendChild(c);e.appendChild(d);return e;},isAreaChanged:function(){return(this.currentArea&&this.endArea)?this.currentArea!==this.endArea:false;},isOriginalAreaChanged:function(){return(this.startArea&&this.endArea)?this.startArea!==this.endArea:false;},_getDestinationIndex:function(t){if(t==="links"){if(this.intersectedLink){var i=this.endGroup.getLinks().indexOf(this.intersectedLink.link),d=this.endGroup.getLinks().indexOf(this.item);if(this.intersectedLink.leftSide){i=this.rightToLeft?i+1:i-1;}if(d<0||d>i){i=this.rightToLeft?i:i+1;}return i;}return this.endGroup.getLinks().length;}return this._getDestinationTileIndex();},layoutEndCallback:function(){var r,s,d;this._removeLinkDropMarker();if(this.endArea!=="links"&&!this.tiles){return{tile:this.item};}s=this._getDragSourceGroup();if(!b.isTabBarActive()||!this.bIsTabBarCollision){this.targetGroup="";}d=this._getDestGroupObject(this.targetGroup);r={srcGroup:s,dstGroup:d,dstGroupData:this._getDropTargetGroup(),tile:this.item,dstTileIndex:this._getDestinationIndex(this.endArea),tileMovedFlag:true,srcArea:this.startArea,dstArea:this.bIsTabBarCollision?undefined:this.endArea};return r;},_getDestGroupObject:function($){return $?sap.ui.getCore().byId(($.getAttribute("id"))):this.endGroup;},_getDragSourceGroup:function(){var s;s=this.startGroup;if(this.thisLayout.isTabBarActive()&&(this.groupSwitched===true)){s={groupId:this.sDragStartGroupModelId};}return s;},_getDropTargetGroup:function(){var d;if(this.thisLayout.isTabBarActive()&&this.thisLayout.isOnTabBarElement()){d={groupId:this.sDragTargetGroupModelId};}else{d=this.endGroup;}return d;},_getDestinationTileIndex:function(){var d,m;if(this.thisLayout.isTabBarActive()&&this.thisLayout.isOnTabBarElement()){d=this._getDropTargetGroup().groupId;m=this._getModelGroupById(d);return m.tiles.length;}return this.tiles.indexOf(this.item);},compareArrays:function(c,d){if(c.length!==d.length){return false;}for(var i=0;i<c.length;i++){if(c[i]!==d[i]){return false;}}return true;},reorderTilesView:function(t){this.tiles=t;this.matrix=this.thisLayout.organizeGroup(t);},changeTilesOrder:function(i,r,t,m){var n=t.slice(0),d=n.indexOf(i),c,e,f;if(d>-1){n.splice(d,1);}if(r){n.splice(n.indexOf(r),0,this.item);}else{n.push(i);}if(this.currentGroup==this.endGroup){if(this.compareArrays(t,n)){return false;}c=this.thisLayout.organizeGroup(n);e=this.thisLayout.getTilePositionInMatrix(i,m);f=this.thisLayout.getTilePositionInMatrix(i,c);if((e.row==f.row)&&(e.col==f.col)){return false;}}this.tiles=n;this.currentGroup=this.endGroup;return n;},setMatrix:function(n){this.matrix=n;},findTileToPlaceAfter:function(c,t){var x=(this.thisLayout.rightToLeft)?0:this.curTouchMatrixCords.column,I=(this.thisLayout.rightToLeft)?1:-1,m=0,i,j,d,r=c[0].length;for(i=this.curTouchMatrixCords.row;i>=0;i--){for(j=x;j>=0&&j<r;j+=I){if(!c[i]||typeof c[i][j]!=="object"){continue;}d=t.indexOf(c[i][j]);m=d>m?d:m;}x=c[0].length-1;}return m||(t.length-1);},_isElementCollideByGivenCordinates:function(e,m,c){var t=e.getBoundingClientRect(),i=false,d=false;if(t.height===0&&!e.classList.contains("sapUshellNoLinksAreaPresent")){t=e.parentNode.getBoundingClientRect();}i=t.right>=m&&t.left<=m;d=t.bottom>=c&&t.top<=c;return i&&d;},_getMatrixCordinatesOfTouchedTile:function(c,m,d){var e=q.extend({},this.curTouchMatrixCords),t=c.getInnerContainersDomRefs()[0].getBoundingClientRect();this.matrix=this.matrix||this.thisLayout.organizeGroup(this.thisLayout.getGroupTiles(c));var o=this.rightToLeft?(t.right+(-1)*m):(t.left*(-1)+m),f=(t.top*(-1)+d)/(this.tileHeight+this.tileMargin),g=o/(this.tileWidth+this.tileMargin);e={row:Math.floor(f),column:Math.floor(g)};return e;},_getCollidedGroup:function(m,c){for(var i=0;i<this.groupsList.length;i++){var g=this.groupsList[i],d=g.getInnerContainersDomRefs();if(!d){continue;}for(var j=0;j<d.length;j++){if(d[j]&&this._isElementCollideByGivenCordinates(d[j],m,c)){var e=!g.groupHasTiles();for(var f=this.groupsList.length-1;f>=i;f--){if(e){break;}if(!this.groupsList[f].groupHasTiles()){var Q=this.groupsList[f].$();if(!Q.hasClass("sapUshellInDragMode")){continue;}Q.find(".sapUshellInner").removeAttr("style");}}return g;}}}},_handleTileAreaIntersection:function(c,m,d){var e=this._getMatrixCordinatesOfTouchedTile(c,m,d);if((c===this.endGroup)&&(e.column===this.curTouchMatrixCords.column)&&(e.row===this.curTouchMatrixCords.row)){return false;}if(this.rightToLeft){this.collisionLeft=(this.curTouchMatrixCords.column-e.column)>0;}else{this.collisionLeft=(e.column-this.curTouchMatrixCords.column)>0;}if(e.column===this.curTouchMatrixCords.column){this.collisionLeft=false;}q.extend(this.curTouchMatrixCords,e);return true;},_getGroupCollisionObject:function(m,c){var d,l;d=this._getCollidedGroup(m,c);if(!d||d.getIsGroupLocked()){return undefined;}l=this._isLinkAreaIntersection(d,m,c);this.endGroup=d;if(!this.tiles){this.tiles=this.thisLayout.getGroupTiles(this.endGroup).slice(0);}this.endArea=l?"links":"tiles";this.endAreaChanged=this.isAreaChanged();this.currentArea=this.endArea;return{"collidedObjectType":l?"Group-link":"Group-tile","collidedObject":d};},getCollisionObject:function(m,c){if(this.thisLayout.oTabBarItemClickTimer){clearTimeout(this.thisLayout.oTabBarItemClickTimer);}if(this.thisLayout.isTabBarActive()&&this._isTabBarCollision(c)){return{"collidedObjectType":"TabBar"};}return this._getGroupCollisionObject(m,c);},_isTabBarScrollArea:function(m){var A=q("#anchorNavigationBar").height()||0,o=q("#anchorNavigationBar").offset(),i=o?o.top:0,y=A+i;return A>0&&(m>y)&&(m<y+30);},_cancelLongDropTimmer:function(){clearTimeout(this.thisLayout.oTabBarItemClickTimer);},_isTabBarCollision:function(m){var A=q("#anchorNavigationBar").height()||0,o=q("#anchorNavigationBar").offset(),i=o?o.top:0;return(m<A+i&&m>i);},_handleTabBarCollision:function(m,t){var c=this,h=this._getTabBarHoverItem(m,t),T,H,i,d,o;if(b.isTabBarActive()){this._toggleTileCloneHoverOpacity(true);}this.lastHighlitedTabItem=h;this.thisLayout.setOnTabBarElement(true);i=this._handleOverflowCollision(m);if(i){return;}if(!h){return;}this.targetGroup=h;this.sDragTargetGroupModelId=h.getAttribute("modelGroupId");T=this._getTabBarGroupIndexByModelId(this.sDragTargetGroupModelId);if(this.thisLayout.oTabBarItemClickTimer){clearTimeout(this.thisLayout.oTabBarItemClickTimer);}o=this._getModelGroupById(this._getDropTargetGroup().groupId);if(o.isGroupLocked){this._toggleTabBarOverflowArrows(false);this.thisLayout.setOnTabBarElement(false);this._resetOverFlowButtonElements();return;}this._toggleAnchorItemHighlighting(true);if(!this.sDragStartGroupModelId){this.sDragStartGroupModelId=this.startGroup.getGroupId();}this.thisLayout.oTabBarItemClickTimer=setTimeout(function(){var e=c._getSelectedTabBarItem();if(c.lastHighlitedTabItem===e){return;}c.draggedTileModelPath=c.item.getBindingContext().getPath();c._prepareDomForDragAndDrop();c.startGroup.removeAggregation("tiles",c.item,true);d=c.sDragStartGroupModelId===c.sDragTargetGroupModelId;c.item.getBindingContext().oModel.setProperty(c.draggedTileModelPath+"/draggedInTabBarToSourceGroup",d);c.groupSwitched=true;sap.ui.getCore().getEventBus().publish("launchpad","switchTabBarItem",{iGroupIndex:T});var f=c.thisLayout.getGroups();c.endGroup=f[0];c.bElapseGroupLinksMap=true;},800);if((this.tiles===null)&&(this.endGroup)){this.tiles=this.thisLayout.getGroupTiles(this.endGroup).slice(0);}H=q(".sapUshellTabBarHoverOn");H.removeClass("sapUshellTabBarHoverOn");h.classList.add("sapUshellTabBarHoverOn");return true;},_prepareDomForDragAndDrop:function(){if(D.system.tablet){var c=this.item.$().clone();var $=this.item.$();var d=$.parent();this.origItemId=$.attr("id");this.origItemDataSapUi=$.attr("data-sap-ui");$.removeAttr("id").removeAttr("data-sap-ui");$.hide();c.hide();q("#dashboardGroups").parent().append($);d.append(c);this.draggedTileDomRef=$.get(0);}else if(!this.draggedTileDomRef){this.draggedTileDomRef=this.item.getDomRef();}},_appendTargetGroupDomRefWithDraggedTile:function(){if(!this.item.getDomRef()){if(D.system.tablet){q(this.draggedTileDomRef).attr("id",this.origItemId);q(this.draggedTileDomRef).attr("data-sap-ui",this.origItemDataSapUi);q(this.draggedTileDomRef).show();}this.endGroup.getInnerContainerDomRef().appendChild(this.draggedTileDomRef);}else{this.endGroup.getInnerContainerDomRef().appendChild(this.item.getDomRef());if(D.system.tablet){q(this.item.getDomRef()).show();}}},_getSelectedTabBarItem:function(){return q(".sapUshellAnchorItemSelected")[0];},_getTabBarGroupIndexByModelId:function(g){var i,t;for(i=0;i<this.allGroups.length;i++){t=this.allGroups[i].groupId;if(g===t){return i;}}},_getModelGroupById:function(g){var m=this.thisLayout.getAllGroups(),i,t,T;for(i=0;i<m.length;i++){t=m[i];T=t.groupId;if(T===g){return t;}}},_handleOverflowCollision:function(m){var A=sap.ui.getCore().byId("anchorNavigationBar"),o=this._calculateOverflowButtonSideCollision(m);if(o=="right"){if(!this.tabBarArrowCollisionRight){A._scrollToGroupByGroupIndex(A.anchorItems.length-1,5000);this.tabBarArrowCollisionRight=true;}return true;}else if(o=="left"){if(!this.tabBarArrowCollisionLeft){A._scrollToGroupByGroupIndex(0,5000);this.tabBarArrowCollisionLeft=true;}return true;}this._resetOverFlowButtonElements();return false;},_calculateOverflowButtonSideCollision:function(m){var c=q(".sapUshellAnchorRightOverFlowButton"),d=c.offset().left,e=q(".sapUshellAnchorItemOverFlow"),f=e.offset().left,g=q(".sapUshellAnchorLeftOverFlowButton"),h=g.offset().left,i=32,j=q("#anchorNavigationBar"),k=j.offset().left;if(m>d&&m<f){return"right";}if(m>k&&(m<h+i)){return"left";}},_resetOverFlowButtonElements:function(){var t=D.system.tablet,c=q(t?".sapUshellAnchorNavigationBarItemsScroll":".sapUshellAnchorNavigationBarItems");c.stop();this.tabBarArrowCollisionRight=false;this.tabBarArrowCollisionLeft=false;},_toggleTabBarOverflowArrows:function(s){var c=q(".sapUshellAnchorRightOverFlowButton"),d=q(".sapUshellAnchorLeftOverFlowButton");d.toggleClass("sapUshellTabBarOverflowButton",s);c.toggleClass("sapUshellTabBarOverflowButton",s);},_getTabBarHoverItem:function(m,t){var n,l,h,T,H;l=q(".sapUshellAnchorItem:not(.sapUshellShellHidden)").eq(0).offset().left;if(m-l<=0){return;}n=Math.round((m-l)/10);if(n>=t.length){n=t.length-1;}h=t[n];T=q(".sapUshellAnchorItem");H=T[h];return H;},removeExcludedElementsFromMatrix:function(e){if(!e.length){return;}if(!this.matrix){return;}var n=this.matrix.map(function(r){return r.map(function(i){var c=e.some(function(d){return i instanceof d;});return(c)?undefined:i;});});this.setMatrix(n);},setExcludedControl:function(c){if(c){this.aExcludedControlClass.push(c);}},setReorderTilesCallback:function(f){if(typeof f==="function"){this.reorderElementsCallback=f;}}};var L=function(){};L.prototype={_initDeferred:q.Deferred(),init:function(c){var t=function(){var s=this.getStyleInfo(this.container);if(s.tileWidth>0){this.isInited=true;this.reRenderGroupsLayout();this.layoutEngine=new a({thisLayout:this});this._initDeferred.resolve();return;}setTimeout(t,100);}.bind(this);this.cfg=c||this.cfg;this.minTilesinRow=2;this.container=this.cfg.container||document.getElementById("dashboardGroups");this.oTabBarItemClickTimer=new Date();this.bTabBarModeActive=false;this.bOnTabBarElement=false;t();sap.ui.getCore().getEventBus().subscribe("launchpad","tabBarChange",this._onTabBarChange,this);return this.getInitPromise();},setOnTabBarElement:function(o){this.bOnTabBarElement=o;},isOnTabBarElement:function(){return this.bOnTabBarElement;},_onTabBarChange:function(c,e,d){if(d==="tabs"){this.bTabBarModeActive=true;}else{this.bTabBarModeActive=false;}},tabBarTileDropped:function(){if(this.oTabBarItemClickTimer){clearTimeout(this.oTabBarItemClickTimer);}},getInitPromise:function(){return this._initDeferred.promise();},getLayoutEngine:function(){return this.layoutEngine;},getStyleInfo:function(c){var t=document.createElement("div"),d=c.getAttribute("id");c=d?document.getElementById(d):c;t.className="sapUshellTile";var s=C.last("/core/home/sizeBehavior");if(s==="Small"){t.classList.add("sapUshellSmall");}t.setAttribute("style","position: absolute; visibility: hidden;");c.appendChild(t);var e=window.getComputedStyle(t);var i={"tileMarginHeight":parseFloat(e.marginBottom,10)+parseFloat(e.marginTop,10),"tileMarginWidth":parseFloat(e.marginLeft,10)+parseFloat(e.marginRight,10),"tileWidth":t.offsetWidth,"tileHeight":t.offsetHeight,"containerWidth":c.offsetWidth-(c.style.marginLeft?parseFloat(c.style.marginLeft,10):0)};c.removeChild(t);return i;},getGroups:function(){return this.cfg.getGroups();},getAllGroups:function(){return this.cfg.getAllGroups?this.cfg.getAllGroups():[];},isTabBarActive:function(){return this.cfg.isTabBarActive?this.cfg.isTabBarActive():false;},getTilesInRow:function(){return this.tilesInRow;},setTilesInRow:function(t){this.tilesInRow=t;},checkPlaceForTile:function(t,m,c,l,i){if(typeof m[c.y]==="undefined"){m.push(new Array(m[0].length));}if(typeof m[c.y+1]==="undefined"){m.push(new Array(m[0].length));}if(typeof m[c.y][c.x]!=="undefined"){return false;}var p=q.extend({},c);if(i||(t&&t.getLong&&!t.getLong())){return[p];}var d=[p];if(t&&t.getLong&&t.getLong()){if((c.x+1)>=m[0].length||(typeof m[p.y][p.x+1]!=="undefined")){return false;}d.push({y:p.y,x:p.x+1});}return d;},placeTile:function(t,m,c){for(var i=0;i<c.length;i++){m[c[i].y][c[i].x]=t;}},getTilePositionInMatrix:function(t,m){for(var r=0;r<m.length;r++){for(var c=0;c<m[0].length;c++){if(m[r][c]===t){return{row:r,col:c};}}}return false;},fillRowsInLine:function(m,t,r,i){if(!t.length){return 0;}var c;for(var j=0;j<m[0].length&&t.length;j++){c=this.checkPlaceForTile(t[0],m,{x:j,y:r},i);if(c){this.placeTile(t[0],m,c);t.shift();}}},organizeGroup:function(t,I){var c=t.slice(0);var d=[];var e=0;d.push(new Array(I?Math.floor(this.tilesInRow/2):this.tilesInRow));while(c.length){this.fillRowsInLine(d,c,e,I);e++;}if(this.rightToLeft){for(var i=0;i<d.length;i++){d[i].reverse();}}d=this.cleanRows(d);return d;},cleanRows:function(t){var d=false;for(var r=t.length-1;r>0&&!d;r--){for(var c=0;c<t[r].length&&!d;c++){if(typeof t[r][c]==="object"){d=true;}}if(!d){t.pop();}}return t;},setGroupsLayout:function(g,m){if(g.getIsGroupLocked()&&m.length>0){var p=g.getDomRef().parentElement;g.getDomRef().style.width="";p.style.width="";p.style.display="";}},calcTilesInRow:function(c,t,d){var e=Math.floor(c/(t+d));e=(e<this.minTilesinRow?this.minTilesinRow:e);return e;},getGroupTiles:function(g){var t=g.getTiles();if(g.getShowPlaceholder()){t.push(g.oPlusTile);}return t;},reRenderGroupsLayout:function(g){if(!this.isInited){return;}var s=this.getStyleInfo(this.container);if(!s.tileWidth){return;}this.styleInfo=s;this.tilesInRow=this.calcTilesInRow(s.containerWidth,s.tileWidth,s.tileMarginWidth);g=g||this.getGroups();for(var i=0;i<g.length;i++){if(g[i].getDomRef&&!g[i].getDomRef()){continue;}var t=this.getGroupTiles(g[i]);var c=this.organizeGroup(t);this.setGroupsLayout(g[i],c);}},initDragMode:function(){this.initGroupDragMode(this.layoutEngine.currentGroup);},endDragMode:function(){var g=this.getGroups();for(var i=0;i<g.length;i++){var c=g[i].$();if(!c.hasClass("sapUshellInDragMode")){continue;}c.removeClass("sapUshellInDragMode");var t=this.getGroupTiles(g[i]);for(var j=0;j<t.length;j++){t[j].$().removeAttr("style");}c.find(".sapUshellInner").removeAttr("style");}},initGroupDragMode:function(g){if(g.$().hasClass("sapUshellInDragMode")){return;}var t=this.getGroupTiles(g);var c=this.organizeGroup(t);g.$().addClass("sapUshellInDragMode");this.renderLayoutGroup(g,c);},calcTranslate:function(r,c){var t=c*(this.styleInfo.tileWidth+this.styleInfo.tileMarginWidth);var d=r*(this.styleInfo.tileHeight+this.styleInfo.tileMarginHeight);if(this.layoutEngine.rightToLeft){t=-t;}return{x:t,y:d};},renderLayoutGroup:function(g,c){var h=c.length*(this.styleInfo.tileHeight+this.styleInfo.tileMarginHeight);g.$().find(".sapUshellInner").height(h);var d;this.styleInfo=this.getStyleInfo(this.container);for(var i=0;i<c.length;i++){for(var j=0;j<c[i].length;j++){if(d===c[i][j]){continue;}else{d=c[i][j];}if(typeof d==="undefined"){break;}var t=this.calcTranslate(i,j);d.getDomRef().style.transform="translate("+t.x+"px,"+t.y+"px) translatez(0)";}}}};var b=new L();return b;},true);
