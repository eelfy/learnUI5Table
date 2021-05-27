/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var B=C.extend("sap.f.cards.BaseHeader",{metadata:{library:"sap.f","abstract":true,aggregations:{toolbar:{type:"sap.ui.core.Control",multiple:false}}}});B.prototype.onBeforeRendering=function(){var t=this.getToolbar();if(t){t.addStyleClass("sapFCardHeaderToolbar");}};return B;});
