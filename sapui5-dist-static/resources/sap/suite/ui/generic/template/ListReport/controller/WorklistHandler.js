sap.ui.define(["sap/ui/base/Object","sap/base/util/extend"],function(B,e){"use strict";function g(s,c,t){function r(W){var W=W||{};if(W.searchString){f();s.oWorklistData.oSearchField.setValue(W.searchString);s.oWorklistData.bVariantDirty=false;s.oWorklistData.oSearchField.fireSearch();return;}s.oSmartFilterbar.search();s.oIappStateHandler.changeIappState(true,true);}function f(){var S=s.oSmartTable;var T=S.getCustomToolbar().getContent();for(var i in T){if(T[i].getId().indexOf("SearchField")>-1){s.oWorklistData.oSearchField=T[i];break;}}}function C(){var S=s.oWorklistData.oSearchField.getValue()||"";if(S){s.oSmartTable.data("allowSearchWorkListLight",true);}s.oWorklistData.oWorklistState={"searchString":S};}function w(E){var P=c.byId("template::PageVariant");if(P){if(E&&E.getId()==="liveChange"||(!s.oWorklistData.bVariantDirty)){P.currentVariantSetModified(true);}}s.oWorklistData.bVariantDirty=true;s.oSmartTable.rebindTable();s.oIappStateHandler.changeIappState(true,true);}function o(E){C();var S=s.oSmartTable;var d=E.getSource().getIcon().split("//");d=d[d.length-1];if(S&&d){switch(d){case"sort":S.openPersonalisationDialog("Sort");break;case"filter":S.openPersonalisationDialog("Filter");break;case"group-2":S.openPersonalisationDialog("Group");break;case"action-settings":S.openPersonalisationDialog("Columns");break;}}}function p(E){f();C();s.oSmartTable.data("searchString",E.getSource().getValue());w(E);}return{openWorklistPersonalisation:o,performWorklistSearch:p,restoreWorklistStateFromIappState:r,fetchAndSaveWorklistSearchField:f};}return B.extend("sap.suite.ui.generic.template.ListReport.controller.WorklistHandler",{constructor:function(s,c,t){e(this,g(s,c,t));}});});
