/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/format/DateFormat"],function(D){"use strict";var E={getExcelDatefromJSDate:function(){var j=D.getDateInstance().oFormatOptions.pattern.toLowerCase();if(j){var r=/^[^y]*y[^y]*$/m;if(r.exec(j)){j=j.replace("y","yyyy");}}return j;},getExcelDateTimefromJSDateTime:function(){var j=D.getDateTimeInstance().oFormatOptions.pattern.toLowerCase();if(j){var r=/^[^y]*y[^y]*$/m;if(r.exec(j)){j=j.replace("y","yyyy");}if(j.includes("a")){j=j.replace("a","AM/PM");}}return j;},getExcelTimefromJSTime:function(){var j=D.getTimeInstance().oFormatOptions.pattern;if(j&&j.includes("a")){j=j.replace("a","AM/PM");}return j;}};return E;});
