// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
(function(){"use strict";if(typeof jQuery==="function"&&jQuery.sap){jQuery.sap.declare("sap.ui2.srvc.contracts.preview");jQuery.sap.require("sap.ui2.srvc.chip");}sap.ui2.srvc.contracts=sap.ui2.srvc.contracts||{};sap.ui2.srvc.contracts.preview=sap.ui2.srvc.contracts.preview||{environment:null};sap.ui2.srvc.contracts.preview.setEnvironmentType=function(e){if(e!=="runtime"&&e!=="designtime"){throw new Error("setEnvironmentType only accepts the values 'runtime' or 'designtime'");}this.environment=e;};sap.ui2.srvc.contracts.preview.getEnvironmentType=function(){return this.environment;};sap.ui2.srvc.Chip.addContract("preview",function(c){var e=false,p,P,s,t;this.getDescription=function(){return c.getChip().getDescription();};this.getTitle=function(){return c.getTitle();};this.isEnabled=function(){return e;};this.getEnvironmentType=function(){return sap.ui2.srvc.contracts.preview.getEnvironmentType();};this.setPreviewIcon=function(n){p=n;};this.setPreviewSubtitle=function(n){P=n;};this.setPreviewTitle=function(n){s=n;};this.setTargetUrl=function(n){t=n;};return{getPreviewIcon:function(){return p;},getPreviewSubtitle:function(){return P;},getPreviewTitle:function(){return s;},getTargetUrl:function(){return t;},setEnabled:function(n){e=n;}};});}());
