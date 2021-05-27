/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/ObjectPath"],function(O){"use strict";function _(e,d){if(e.operation!=="UPDATE"&&e.operation!=="UPSERT"){throw new Error("Only operation == 'UPDATE' and operation == 'UPSERT' are supported.");}var p=e.propertyPath.split("/");O.set(p,e.propertyValue,d);}var C={applyChange:function(m,c){if(m["sap.app"].dataSources){var o=c.getContent();var d=m["sap.app"].dataSources[o.dataSourceId];if(d){var e=o.entityPropertyChange;if(Array.isArray(e)){e.forEach(function(E){_(E,d);});}else{_(e,d);}}}else{throw Error("No sap.app/dataSource found in manifest.json");}return m;}};return C;},true);
