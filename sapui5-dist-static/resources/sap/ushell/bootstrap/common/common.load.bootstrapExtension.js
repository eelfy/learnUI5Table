// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/ObjectPath"],function(O){"use strict";function l(u){var p=O.get("bootstrap.extensionModule",u);if(!p||typeof p!=="string"){return;}p=p.replace(/\./g,"/");sap.ui.require([p],function(e){if(e&&typeof e==="function"){e();}});}return l;});
