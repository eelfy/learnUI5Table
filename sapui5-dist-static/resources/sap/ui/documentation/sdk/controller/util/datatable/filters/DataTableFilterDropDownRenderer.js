/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var D={apiVersion:2};D.render=function(r,c){r.openStart("div",c);r.class("selectWrapper");r.openEnd();r.openStart("a",c.getId()+"-filterBtn");r.class("filterBtn");r.attr("tabindex",0);r.openEnd();r.text('Filter');r.close('a');r.openStart("ul",c.getId()+"-optionsList");if(!c.getProperty("expanded")){r.style("display","none");}r.openEnd();this.renderDefaultOptions(r,c);this.renderOptions(r,c);r.close("ul");r.close("div");};D.renderOptions=function(r,c){var o=c.getOptions(),C=c.getChecked();o.forEach(function(O,i){r.openStart("li");r.openEnd("li");r.voidStart("input");if(C[i].value){r.attr("checked","true");}r.attr("type","checkbox");r.attr("index",i);r.voidEnd();r.text(O);r.close("li");});};D.renderDefaultOptions=function(r,c){c.getDefaultOptions().forEach(function(o){r.openStart("li");r.openEnd("li");r.openStart("a");r.attr("tabindex",0);r.class(o.key);r.openEnd();r.text(o.text);r.close("a");r.close("li");});};return D;},true);
