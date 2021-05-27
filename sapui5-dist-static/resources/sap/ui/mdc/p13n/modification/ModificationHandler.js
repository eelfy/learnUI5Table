/*
* ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["sap/ui/base/Object"],function(B){"use strict";var m;var M=B.extend("sap.ui.mdc.p13n.modification.ModificationHandler");M.prototype.processChanges=function(c,o){return Promise.resolve();};M.prototype.waitForChanges=function(p,o){return Promise.resolve();};M.prototype.reset=function(p,o){return Promise.resolve();};M.prototype.isModificationSupported=function(p,o){return false;};M.getInstance=function(){if(!m){m=new M();}return m;};return M;});
