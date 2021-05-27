/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./APIInfo',"sap/base/util/ObjectPath"],function(A,O){"use strict";function f(e){var v=sap.ui.getVersionInfo(),l,L,i;if(v&&Array.isArray(v.libraries)){L=v.libraries.length;for(i=0;i<L;i++){l=v.libraries[i];if(e===l.name||e.indexOf(l.name+".")===0){return l.name;}}}return"sap.ui.core";}function g(e,l){var E;if(!l){var c=O.get(e||"");if(c&&c.getMetadata){var m=c.getMetadata();if(m.getLibraryName){l=m.getLibraryName();}else{l="sap.ui.core";}}else{l=f(e);}}return A.getLibraryElementsJSONPromise(l).then(function(o){var a;for(var i=0,L=o.length;i<L;i++){if(o[i].name===e){a=o[i];break;}}if(a){E={baseType:a.extends,deprecation:a.deprecatedText?a.deprecatedText:null,doc:a.description,module:a.module,name:a.name,since:a.since,values:a.properties,uxGuidelinesLink:a.uxGuidelinesLink,uxGuidelinesLinkText:a.uxGuidelinesLinkText,docuLink:a.docuLink,docuLinkText:a.docuLinkText};}return E;});}return{getEntityDocuAsync:function(e,l){return g(e,l);}};},true);
