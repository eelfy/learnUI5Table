/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/TreeItemBaseRenderer','sap/ui/core/Core','sap/ui/core/Renderer'],function(T,C,R){"use strict";var D=R.extend(T);D.apiVersion=2;D.renderEntityType=function(r,c){var t=c.getEntityType(),s=t?t[0].toUpperCase():"";if(!t){return;}r.openStart('span').class("sapUiDemoKitTreeItemIcon").class("sapUiDemoKitTreeItem"+s).openEnd().text(s).close('span');};D.renderTooltip=function(r,c){var t=c.getEntityType(),s=c.getTarget();if(t&&s){r.attr("title",t+" "+s);}};D.renderLIContent=function(r,c){var o;this.renderEntityType(r,c);r.openStart('a').attr("href",c.getHref()).openEnd();r.openStart('span').class("sapDemokitTreeItemTitle").class("sapUiTinyMarginEnd").openEnd().text(c.getTitle()).close('span');r.close('a');if(c.getDeprecated()){o=C.getLibraryResourceBundle("sap.ui.documentation");r.openStart('span').class("sapDemokitTreeItemLabel").openEnd().text(o.getText("API_MASTER_DEPRECATED")).close('span');}};return D;},true);
