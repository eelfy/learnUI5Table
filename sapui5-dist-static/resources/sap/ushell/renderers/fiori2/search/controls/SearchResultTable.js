// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper'],function(S){"use strict";return sap.m.Table.extend('sap.ushell.renderers.fiori2.search.controls.SearchResultTable',{renderer:'sap.m.TableRenderer',onAfterRendering:function(){S.attachEventHandlersForTooltip(this.getDomRef());}});});
