/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/CardRenderer"],function(F){"use strict";var M={TYPE:"/sap.card/type"};return F.extend("sap.ui.integration.widgets.CardRenderer",{apiVersion:2,renderContainerAttributes:function(r,c){F.renderContainerAttributes.apply(this,arguments);r.class("sapUiIntCard");var C=c._oCardManifest;if(C&&C.get(M.TYPE)&&C.get(M.TYPE).toLowerCase()==="analytical"){r.class("sapUiIntCardAnalytical");}},renderContentSection:function(r,c){var f=c.getAggregation("_filterBar");if(f){r.openStart("div").class("sapFCardFilterBar").openEnd();r.renderControl(f);r.close("div");}F.renderContentSection.apply(this,arguments);}});});
