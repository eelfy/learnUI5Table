/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ListItemBaseRenderer','sap/ui/core/Renderer','sap/m/library','sap/ui/core/library'],function(L,R,l,c){"use strict";var T=c.TextDirection;var a=l.ListType;var M=R.extend(L);M.apiVersion=2;M.openItemTag=function(r,o){if(o.getStartsSection()){r.openStart("li");r.attr("role","separator");r.class("sapUiMnuDiv");r.openEnd();r.openStart("div");r.class("sapUiMnuDivL");r.openEnd();r.close("div");r.voidStart("hr").voidEnd();r.openStart("div");r.class("sapUiMnuDivR");r.openEnd();r.close("div");r.close("li");}L.openItemTag(r,o);};M.renderLIAttributes=function(r,o){r.class("sapMSLI");if(o.getIcon()){r.class("sapMSLIIcon");}if(o.getType()==a.Detail||o.getType()==a.DetailAndActive){r.class("sapMSLIDetail");}if(o._hasSubItems()){r.class("sapMMenuLIHasChildren");}};M.renderLIContent=function(r,o){var t=o.getTitleTextDirection();if(o.getIcon()){r.renderControl(o._getImage((o.getId()+"-img"),"sapMMenuLIImgThumb",o.getIcon(),o.getIconDensityAware()));}r.openStart("div");r.class("sapMSLIDiv");r.class("sapMSLITitleDiv");r.openEnd();if(o._bNoFlex){r.openStart("div");r.class("sapMLIBNoFlex");r.openEnd();}r.openStart("div");r.class("sapMSLITitleOnly");if(t!==T.Inherit){r.attr("dir",t.toLowerCase());}r.openEnd();r.text(o.getTitle());r.close("div");if(o._bNoFlex){r.close('div');}r.close("div");if(o._hasSubItems()){r.renderControl(o._getIconArrowRight());}};return M;},true);
