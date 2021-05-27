/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/CommonHelper"],function(C){"use strict";var F={checkIfBasicSearchIsVisible:function(h,s){return h!=="true"&&(!s||s.Searchable)?true:false;},getTargetEntityContext:function(c,p){var f=p||c.getPath(),s=f.substring(0,f.indexOf("/",1)),n=C.getNavigationPath(f),b=s;if(n){b=s+"/$NavigationPropertyBinding/"+n.split("/").join("/$NavigationPropertyBinding/")+"/$";}return c.getModel().createBindingContext(b);}};return F;},true);
