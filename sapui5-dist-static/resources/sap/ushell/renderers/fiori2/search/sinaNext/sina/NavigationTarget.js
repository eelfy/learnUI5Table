// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sinaDefine(['./SinaObject'],function(S){"use strict";return S.derive({_meta:{properties:{targetUrl:{required:true},label:{required:true},target:{required:false}}},performNavigation:function(p){p=p||{};var t=p.trackingOnly||false;if(!t){if(this.target){this.openURL(this.targetUrl,this.target);}else{this.openURL(this.targetUrl);}}},openURL:function(U,t){if(jQuery&&jQuery.sap&&jQuery.sap.openWindow){return jQuery.sap.openWindow(U,t);}return window.open(U,t,'noopener,noreferrer');},isEqualTo:function(o){if(!o){return false;}return this.targetUrl==o.targetUrl;}});});
