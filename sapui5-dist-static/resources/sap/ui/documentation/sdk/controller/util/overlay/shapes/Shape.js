/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function S(){this.oContainer=null;}S.extend=function(){var c=function(){};c.prototype=new S();c.prototype.constructor=c;return c;};S.prototype.createShape=function(s,a){this.oContainer=document.createElementNS(s,a);this.oContainer.setAttribute("class",['shape',a].join(" "));return this;};S.prototype.setPosition=function(c){};S.prototype.show=function(){this.oContainer.style.opacity='1';};S.prototype.hide=function(){this.oContainer.style.opacity='0';};return S;});
