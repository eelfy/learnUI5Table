// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/eventlogging/EventConsumer'],function(E){"use strict";var m=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new E(),{init:function(s){this.sinaNext=s;},logEvent:function(e){this.sinaNext.logUserEvent(e);}});return m;});
