/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ItemBaseFlex'],function(I){"use strict";var c=Object.assign({},I);c.beforeAddItem=function(D,d,C,p,o){return D.addItem.call(D,d,C,p,o.role);};c.findItem=function(m,i,n){return i.find(function(o){var k=m.getProperty(o,"key");var K=m.getProperty(o,"name");return(k===n||K===n);});};c.addItem=c.createAddChangeHandler();c.removeItem=c.createRemoveChangeHandler();c.moveItem=c.createMoveChangeHandler();return c;});
