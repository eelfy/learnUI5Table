/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/core/library','sap/m/HyphenationSupport','./library'],function(R,c,H,m){"use strict";var T=c.TextDirection;var W=m.WrappingType;var E={apiVersion:2};E.render=function(r,t){var d=t._getDisplayedText(),s=t.getTextDirection(),a=t.getTooltip_AsString(),w=t.getWrappingType(),b=t.getTextAlign(),e=t.getRenderWhitespace(),f=t._isExpandable(),g=t.getProperty("expanded"),h=g?"&nbsp;&nbsp;":" ... ";r.openStart("div",t);r.class("sapMExText");r.class("sapUiSelectable");if(w!==W.Hyphenated){if(d&&d.length>0&&!/\s/.test(d)){r.class("sapMExTextBreakWord");}}r.attr("dir",s!==T.Inherit?s.toLowerCase():"auto");if(a){r.attr("title",a);}if(b){b=R.getTextAlign(b,s);if(b){r.style("text-align",b);}}if(e){r.class("sapMExTextRenderWhitespaceWrap");}H.writeHyphenationClass(r,t);r.openEnd();r.openStart("span",t.getId()+"-string");r.class("sapMExTextString");r.openEnd();r.text(H.getTextForRender(t,"main"));r.close("span");if(f){r.openStart("span");r.class("sapMExTextEllipsis");r.openEnd();r.unsafeHtml(h);r.close("span");r.renderControl(t._getShowMoreLink());}r.close("div");};return E;},true);
