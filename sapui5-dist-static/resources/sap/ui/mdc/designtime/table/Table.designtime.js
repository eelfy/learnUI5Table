/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/p13n/Engine"],function(E){"use strict";return{name:"{name}",description:"{description}",actions:{settings:function(){return{handler:function(c,p){return E.getInstance().getRTASettingsActionHandler(c,p,"Column");}};}}};});
