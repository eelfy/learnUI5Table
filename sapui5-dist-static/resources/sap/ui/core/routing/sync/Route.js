/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/extend"],function(L,e){"use strict";return{_routeMatched:function(a,i,n){var r=this._oRouter,p,P,t,c,E,v=null,T=null,o,C,V,b,d;r._oMatchedRoute=this;r._bMatchingProcessStarted=true;if(this._oParent){p=this._oParent._routeMatched(a);}else if(this._oNestingParent){this._oNestingParent._routeMatched(a,false,this);}c=e({},r._oConfig,this._oConfig);o=Object.assign({},a);o.routeConfig=c;E={name:c.name,arguments:a,config:c};if(n){E.nestedRoute=n;}this.fireBeforeMatched(E);r.fireBeforeRouteMatched(E);if(this._oTarget){t=this._oTarget;t._updateOptions(this._convertToTargetOptions(c));if(t._isValid(p,false)){P=t._place(p);}P=P||{};v=P.oTargetParent;T=P.oTargetControl;E.view=v;E.targetControl=T;}else{V=[];b=[];C=function(f){V.push(f.getParameter("view"));b.push(f.getParameter("control"));};if(Array.isArray(this._oConfig.target)){d=this._oConfig.target;}else{d=[this._oConfig.target];}d.forEach(function(s){var t=r._oTargets.getTarget(s);if(t){t.attachEventOnce("display",C);}});r._oTargets._display(this._oConfig.target,o,this._oConfig.titleTarget);E.view=V[0];E.targetControl=b[0];E.views=V;E.targetControls=b;}r._bMatchingProcessStarted=false;if(c.callback){c.callback(this,a,c,T,v);}this.fireEvent("matched",E);r.fireRouteMatched(E);if(i){L.info("The route named '"+c.name+"' did match with its pattern",this);this.fireEvent("patternMatched",E);r.fireRoutePatternMatched(E);}return P;}};});
