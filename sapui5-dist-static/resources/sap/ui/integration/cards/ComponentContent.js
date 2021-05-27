/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/cards/BaseContent","./ComponentContentRenderer","sap/ui/core/ComponentContainer"],function(B,C,a){"use strict";var b=B.extend("sap.ui.integration.cards.ComponentContent",{metadata:{library:"sap.ui.integration"},renderer:C});b.prototype.setConfiguration=function(c){B.prototype.setConfiguration.apply(this,arguments);if(!c){return;}var o=new a({manifest:c.componentManifest,async:true,componentCreated:function(e){var d=e.getParameter("component"),f=this.getParent();if(d.onCardReady){d.onCardReady(f);}this.fireEvent("_actionContentReady");this.fireEvent("_updated");}.bind(this),componentFailed:function(){this.fireEvent("_actionContentReady");this._handleError("Card content failed to create component");}.bind(this)});this.setAggregation("_content",o);};return b;});
