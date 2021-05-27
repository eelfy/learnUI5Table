/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device'],function(D){"use strict";var s=function(f,S){if(!f){return null;}var i=f.selectionStart,a=f.selectionEnd,v=f.value,r={start:i,end:a};if((D.browser.msie||D.browser.edge)&&S){r.start=v.length;r.end=v.length;}return r;};return s;});
