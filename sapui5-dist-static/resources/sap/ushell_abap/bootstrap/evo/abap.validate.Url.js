// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";return v;function v(u,a){var r=/^((.*)\/)?[A-Za-z0-9_]+\.json$/.exec(u),R;if(!r){return"name of configuration URL is not valid. Url is:\""+u+"\"";}R=typeof r[1]==="undefined"?"":r[1];if(!a||!a.hasOwnProperty(R)||!a[R]){return"URL for config file does not match restrictions. Url is:\""+u+"\"";}return undefined;}});