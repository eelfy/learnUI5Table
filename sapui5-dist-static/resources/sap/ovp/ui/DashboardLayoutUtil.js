sap.ui.define(["sap/ovp/ui/DashboardLayoutRearrange","sap/ovp/ui/DashboardLayoutModel","sap/ovp/cards/CommonUtils","sap/ui/Device","sap/ui/thirdparty/jquery","sap/base/util/merge","sap/ovp/cards/ovpLogger","sap/ovp/cards/jUtils"],function(R,D,C,a,q,m,o,u){"use strict";var l=new o("OVP.ui.DashboardLayoutUtil");var b=function(c){this.aCards=null;this.ROW_HEIGHT_PX=16;this.MIN_COL_WIDTH_PX=320;this.CARD_BORDER_PX=8;this.EXTRA_MARGIN=8;this.oLayoutData={layoutWidthPx:1680,contentWidthPx:1600,colCount:5,previousColCount:0,colWidthPx:this.MIN_COL_WIDTH_PX,rowHeightPx:this.ROW_HEIGHT_PX,marginPx:this.convertRemToPx(3)-this.CARD_BORDER_PX};this.dashboardLayoutModel=new D(c,this.oLayoutData.colCount,this.ROW_HEIGHT_PX,this.CARD_BORDER_PX);this.layoutDomId="";this.oLayoutCtrl={};this.componentDomId="";this.lastTriggeredColWidth=0.0;this.changedCards={};this.isRTLEnabled=sap.ui.getCore().getConfiguration().getRTL();switch(true){case a.browser.webkit:this.cssVendorTransition="-webkit-transition";this.cssVendorTransform="-webkit-transform";break;case a.browser.msie:this.cssVendorTransition="-ms-transition";this.cssVendorTransform="-ms-transform";break;case a.browser.mozilla:this.cssVendorTransition="-moz-transition";this.cssVendorTransform="-moz-transform";break;default:this.cssVendorTransition="transition";this.cssVendorTransform="transform";}};b.prototype.setLayout=function(c){this.oLayoutCtrl=c;this.layoutDomId=c.getId();this.componentDomId=this.layoutDomId.split("--")[0];};b.prototype.getDashboardLayoutModel=function(){return this.dashboardLayoutModel;};b.prototype.updateCardVisibility=function(c){this.dashboardLayoutModel.updateCardVisibility(c);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);this.dashboardLayoutModel._removeSpaceBeforeCard();this._setCardsCssValues(this.aCards);this._positionCards(this.aCards);};b.prototype.updateLayoutData=function(d){var i=this.oLayoutData.marginPx,e=0,s=320,M=1024,c=this.CARD_BORDER_PX,f=this.EXTRA_MARGIN,n=d+i,g,h;this.oLayoutData.layoutWidthPx=d;if(n<=s){i=this.convertRemToPx(0.5)-c;e=a.system.desktop?16:0;}else if(n<=M){i=this.convertRemToPx(1)-c;e=a.system.desktop?8:0;}else{i=this.convertRemToPx(3)-c;}if(i!==this.oLayoutData.marginPx){this.oLayoutData.marginPx=i;q(".sapUshellEasyScanLayout").css({"margin-left":i+"px"});}this.oLayoutData.contentWidthPx=d-i-e;this.oLayoutData.previousColCount=this.oLayoutData.colCount;this.oLayoutData.colCount=Math.round(this.oLayoutData.contentWidthPx/this.MIN_COL_WIDTH_PX);if(this.oLayoutData.colCount===0){this.oLayoutData.colCount=1;}this.oLayoutData.colWidthPx=this.oLayoutData.contentWidthPx/this.oLayoutData.colCount;if(q(".sapOvpDashboardDragAndDrop").length>0&&q(".easyScanLayoutItemWrapper").length>0){g=q(".sapOvpDashboardDragAndDrop")[0].offsetLeft+f;if(q(".sapOvpDashboardDragAndDrop")[0].offsetLeft<40){h=g+8;}else{h=g;}}else{g=i+f;h=i+e+f;}q('.sapFDynamicPageTitle').css({"margin-left":g+"px","margin-right":h+"px","visibility":"visible"});q('.sapFDynamicPageHeader').css({"margin-left":g+"px","margin-right":h+"px"});return this.oLayoutData;};b.prototype.getRearrange=function(s){var d={containerSelector:".sapUshellEasyScanLayoutInner",wrapper:".sapUshellEasyScanLayout",draggableSelector:".easyScanLayoutItemWrapper",placeHolderClass:"dashboardLayoutItemWrapper-placeHolder",cloneClass:"easyScanLayoutItemWrapperClone",moveTolerance:10,switchModeDelay:500,isTouch:!a.system.desktop,debug:false,aCards:this.aCards,layoutUtil:this,rowHeight:this.oLayoutData.rowHeightPx,colWidth:this.oLayoutData.colWidthPx};return new R(m(d,s));};b.prototype.resizeLayout=function(w){var B=this.oLayoutData.colCount;var t=false;if(this.oLayoutData.layoutWidthPx!==w&&w!==0){this.updateLayoutData(w);t=Math.abs(this.lastTriggeredColWidth-this.oLayoutData.colWidthPx)>this.convertRemToPx(0.5);this.aCards=this.dashboardLayoutModel.getCards(this.oLayoutData.colCount);for(var i=0;i<this.aCards.length;i++){var c=this.aCards[i];this.setCardCssValues(c);var e=document.getElementById(this.getCardDomId(c.id));if(e){e.style.width=c.dashboardLayout.width;e.style.height=c.dashboardLayout.height;if(B!==this.oLayoutData.colCount){e.style[this.cssVendorTransition]='all 0.25s ease';}else{e.style[this.cssVendorTransition]='';}e.style[this.cssVendorTransform]='translate3d('+c.dashboardLayout.left+' ,'+c.dashboardLayout.top+', 0px)';this.setKpiNumericContentWidth(e);}if(B!==this.oLayoutData.colCount&&t){this._triggerCardResize(c);}}this.dashboardLayoutModel._removeSpaceBeforeCard();this.oLayoutCtrl.fireAfterDragEnds();if(t){this.lastTriggeredColWidth=this.oLayoutData.colWidthPx;}}};b.prototype.getCards=function(c){if(this.aCards&&this.oLayoutData.previousColCount===c){return this.aCards;}this._setColCount(c);this.aCards=this.dashboardLayoutModel.getCards(c);this._setCardsCssValues(this.aCards);return this.aCards;};b.prototype.resetToManifest=function(){this.aCards=[];this.dashboardLayoutModel.resetToManifest();};b.prototype.getCardDomId=function(c){return this.layoutDomId+"--"+c;};b.prototype.getCardId=function(c){return c?c.split("--")[2]:'';};b.prototype.getCardIdFromComponent=function(c){return c?c.split("--")[1]:'';};b.prototype.isCardAutoSpan=function(c){return this.dashboardLayoutModel.getCardById(c).dashboardLayout.autoSpan;};b.prototype.setAutoCardSpanHeight=function(e,c,h){var r,d,f;if(!c&&e&&e.target.parentElement){c=e.target.parentElement.parentElement.id.split("--")[1];}var H=h;if(!H&&e){H=e.size.height;}if(this.isCardAutoSpan(c)){f=this.dashboardLayoutModel.getCardById(c);if(f.dashboardLayout.showOnlyHeader){r=Math.ceil((H+2*this.CARD_BORDER_PX)/this.getRowHeightPx());}else{r=Math.round((H+2*this.CARD_BORDER_PX)/this.getRowHeightPx());}d=this.dashboardLayoutModel.resizeCard(c,{rowSpan:r,colSpan:1},false);this._sizeCard(d.resizeCard);this._positionCards(d.affectedCards);}};b.prototype.calculateCardProperties=function(c){var g=this._getCardController(c);var d=this.dashboardLayoutModel.getCardById(c);var i=250,h,e,L,f,H;if(g){H=g.getItemHeight(g,'ovpCardHeader');h=H===0?d.dashboardLayout.headerHeight:H;e=g.getItemHeight(g,'toolbar');if(d.template==='sap.ovp.cards.list'||d.template==='sap.ovp.cards.v4.list'){H=g.getItemHeight(g,'ovpList',true);L=H===0?d.dashboardLayout.itemHeight:H;f=h+e+L;}else if(d.template==='sap.ovp.cards.table'||d.template==='sap.ovp.cards.v4.table'){L=d.dashboardLayout.itemHeight;f=h+e+2*L;}else if(d.template==='sap.ovp.cards.linklist'){if(d.settings.listFlavor==='carousel'){f=h+u.getOuterHeight(document.querySelector('.sapOvpCarouselContentHeader'))+240+u.getOuterHeight(document.querySelector('.sapMCrslControlsBottom.sapMCrslControls'));}else{L=g.getItemHeight(g,'ovpLinkList',true);var j=g.getView().getModel('ovpCardProperties').getProperty('/densityStyle');if(j==='cozy'){f=h+e+L+8;}else{f=h+e+L+4;}}}else if(d.template==='sap.ovp.cards.charts.analytical'){var B=g.getView().byId('bubbleText')?43:0;f=h+e+i+B+50;}else{f=h+e;}return{headerHeight:h,dropDownHeight:e,itemHeight:L,minCardHeight:f,leastHeight:h};}};b.prototype._sizeCard=function(c){if(!c){return;}var $=document.getElementById(this.getCardDomId(c.id));c.dashboardLayout.width=c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx+"px";c.dashboardLayout.height=c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx+"px";if($){$.style.height=c.dashboardLayout.height;$.style.width=c.dashboardLayout.width;this._triggerCardResize(c);}this.dashboardLayoutModel._removeSpaceBeforeCard();var i=(this.dashboardLayoutModel._findHighestOccupiedRow()*this.ROW_HEIGHT_PX)+32;q(".sapUshellEasyScanLayoutInner").css({"height":i+"px"});q(".sapUshellEasyScanLayout").css({"height":i+"px"});};b.prototype._triggerCardResize=function(c){var d=c.dashboardLayout,e=c.id,f=this._getCardComponentDomId(e),$=document.getElementById(f),g=this._getCardController(e),h,i,j;try{if((d.autoSpan||!d.visible)&&g){i=g.getCardItemsBinding();h=this.calculateCardProperties(e);if(i&&h){var n=i.getLength();var k=n?Math.min(n,c.dashboardLayout.noOfItems):c.dashboardLayout.noOfItems;var A=(n===0)?c.dashboardLayout.noOfItems:k;var p=d.rowSpan*this.ROW_HEIGHT_PX;var r=p-(h.headerHeight+2*this.CARD_BORDER_PX);if(c.template==='sap.ovp.cards.table'||c.template==='sap.ovp.cards.v4.table'){g.addColumnInTable($,d);}else if(c.template==='sap.ovp.cards.list'||c.template==='sap.ovp.cards.v4.list'){j=A*h.itemHeight+h.dropDownHeight;$.style.height=Math.min(j,r)+c.dashboardLayout.headerHeight+"px";}}return;}}catch(s){l.warning("Card auto span failed for card "+e+" and error is  "+s.toString());}d.iRowHeightPx=this.getRowHeightPx();d.iCardBorderPx=this.CARD_BORDER_PX;try{if(g){h=this.calculateCardProperties(e);g.resizeCard(d,h);}else{l.warning("OVP resize: no controller found for "+e);}}catch(t){l.warning("OVP resize: "+e+" catch "+t.toString());}};b.prototype._positionCards=function(c){if(!c){return;}var p={},s=false;c.forEach(function(d){if(!d.dashboardLayout.visible){return;}p=this._mapGridToPositionPx(d.dashboardLayout);d.dashboardLayout.top=p.top;d.dashboardLayout.left=p.left;var e=document.getElementById(this.getCardDomId(d.id));if(e){e.classList.remove('sapOvpNotResizableLeftRight','sapOvpNotResizableRight','sapOvpNotResizableDown');e.style[this.cssVendorTransition]='all 0.15s ease';e.style[this.cssVendorTransform]='translate3d('+p.left+' ,'+p.top+', 0px)';s=d.dashboardLayout.column+d.dashboardLayout.colSpan===this.oLayoutData.colCount+1;if(s){if(d.dashboardLayout.colSpan===1){e.classList.add('sapOvpNotResizableLeftRight');}else{e.classList.add('sapOvpNotResizableRight');}}if(((d.template==="sap.ovp.cards.list"||d.template==="sap.ovp.cards.v4.list")&&d.dashboardLayout.colSpan===2)||(d.template==="sap.ovp.cards.linklist"&&d.settings.listFlavor==='carousel'&&d.dashboardLayout.colSpan===3)){e.classList.add('sapOvpNotResizableRight');}if(d.template==="sap.ovp.cards.linklist"&&d.settings.listFlavor==='carousel'&&d.dashboardLayout.rowSpan===45){e.classList.add('sapOvpNotResizableDown');}}}.bind(this));};b.prototype.updateCardSize=function(c,g,d){var e=this.dashboardLayoutModel.getCardById(c);var f=this._getCardController(c);var $=document.getElementById(this.getCardDomId(c));$.style.height=g+'px';$.style.width=d+'px';$.style[this.cssVendorTransition]='none';$.style.zIndex=10;if(e.template==='sap.ovp.cards.linklist'&&e.settings.listFlavor==='carousel'){f.getView().byId('pictureCarousel').$().css('height',g-(e.dashboardLayout.headerHeight+2*this.CARD_BORDER_PX)+'px');}};b.prototype.resizeCard=function(c,s,d){this.changedCards=this.dashboardLayoutModel.resizeCard(this.getCardId(c),s,true,d);this._positionCards(this.changedCards.affectedCards);};b.prototype._mapGridToPositionPx=function(g){var L=(g.column-1)*this.getColWidthPx();var p={top:(g.row-1)*this.getRowHeightPx()+"px",left:(this.isRTLEnabled?-L:L)+"px"};return p;};b.prototype._getCardComponentDomId=function(c){return this.componentDomId+"--"+c;};b.prototype._getCardController=function(c){var d=null;var e=sap.ui.getCore().byId(this._getCardComponentDomId(c));if(e){var f=e.getComponentInstance();if(f){d=f.getAggregation("rootControl").getController();}}return d;};b.prototype._setCardsCssValues=function(c){var i=0;for(i=0;i<c.length;i++){this.setCardCssValues(c[i]);}};b.prototype.setCardCssValues=function(c){var L=(c.dashboardLayout.column-1)*this.oLayoutData.colWidthPx;c.dashboardLayout.top=((c.dashboardLayout.row-1)*this.oLayoutData.rowHeightPx)+'px';c.dashboardLayout.width=(c.dashboardLayout.colSpan*this.oLayoutData.colWidthPx)+'px';c.dashboardLayout.height=(c.dashboardLayout.rowSpan*this.oLayoutData.rowHeightPx)+'px';c.dashboardLayout.left=(this.isRTLEnabled?-L:L)+'px';};b.prototype.convertRemToPx=function(v){var c=v;if(typeof v==="string"||v instanceof String){c=v.length>0?parseInt(v.split("rem")[0],10):0;}return c*C.getPixelPerRem();};b.prototype.convertPxToRem=function(v){var c=v;if(typeof v==="string"||v instanceof String){c=v.length>0?parseFloat(v.split("px")[0],10):0;}return c/C.getPixelPerRem();};b.prototype.setKpiNumericContentWidth=function($){var O=$.getElementsByClassName("sapOvpKpiContent");if(!!O&&O.length>0){var c=O[0];var i=8;var p=16;c.style.width=(this.getColWidthPx()-(2*i+2*p))+"px";}};b.prototype.getLayoutWidthPx=function(){return this.oLayoutData.colCount*this.oLayoutData.colWidthPx;};b.prototype.getColWidthPx=function(){return this.oLayoutData.colWidthPx;};b.prototype.getRowHeightPx=function(){return this.oLayoutData.rowHeightPx;};b.prototype._setColCount=function(c){this.oLayoutData.colCount=c;};return b;},true);
