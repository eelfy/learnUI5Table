/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function s(a,b){var r=new RegExp("^([a-zA-Z]*)(.*)"),m=r.exec(a),M=r.exec(b),f=m[1],F=M[1];if(f>F){return 1;}if(f<F){return-1;}return parseInt(m[2])-parseInt(M[2]);}return{sortAlphaNumeric:s};});
