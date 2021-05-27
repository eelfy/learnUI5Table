sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/m/MessageBox","sap/ovp/support/lib/Documentation","sap/ui/thirdparty/jquery","sap/ovp/cards/ovpLogger"],function(C,M,a,D,q,o){"use strict";var l=new o("OVP.controller.DiagnosticsTool");function O(){this.getView().attachAfterRendering(function(){A();});}function f(){var m=this.getView().getModel("data");if(m.getProperty("/status")==="Loading"){M.show("Application is still loading");return;}var t=new Date().toLocaleTimeString([],{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});m.setData({properties:null,retrieval:t,copyEnabled:false});m.updateBindings();this.getView().getViewData().plugin.onRefresh();}function b(){var n="\r\n";var p="- ";var e=this.getView().getModel("data").getData();if(!(e&&e.properties&&e.url)){a.error("Could not copy data to your clipboard! No data collected",{title:"Error"});return;}var P=e.properties;var g="*************+Extracted by SAP Fiori Elements Diagnostics Plugin [FEDiagnosticOVP]+*************"+n;g+=p+"Extracted on "+new Date().toUTCString()+n;g+=p+"Host: "+e.origin+n;g+=p+"Application status: "+e.status+n;if(e.statusMessage){g+=p+"Notice: "+e.statusMessage+n;}g+=p+"Documentation: "+D.getDocuURL()+n;g+=n;g+="APP DATA"+n;for(var i=0,h=P.length;i<h;i++){if(P[i].type==="string"){g+=p+P[i].name+": "+P[i].value+n;}else if(P[i].type==="link"){g+=p+P[i].name+": "+P[i].target+n;}else if(P[i].type==="group"){g+="Group: "+P[i].name+n;}}g+=n;g+="**************************"+n;g+=n;g+=n;g+="PROVIDE"+n;g+=p+"User/Password: <user>/<password>"+n;g+=p+"Steps to recreate the issue: <maybe also provide master data, pictures or video…>"+n;var t=this.getView().byId("CopyDataTextArea").getId();var T=document.getElementById(t);T.style.display="block";T.value=g;T.select();try{var S=document.execCommand("copy");if(S){M.show("Ticket relevant information copied to clip board");}else{a.error("Could not copy data to your clipboard! You can copy it manually from here: "+n+n+g,{title:"Error"});}}catch(j){a.error("Could not copy data to your clipboard! You can copy it manually from here: "+n+n+g,{title:"Error"});}finally{T.style.display="none";}}function c(){var n="<br/>",S="</span>"+n,e="<span>",p=e+"- ",g=this.getView().getModel("data").getData();if(!(g&&g.properties&&g.url)){a.error("Could not copy data to your clipboard! No data collected",{title:"Error"});return;}var P=g.properties,$=document.getElementById(this.getView().byId("CopyDataHTML").getId()),h=$[0];var j=e+"*************+Extracted by SAP Fiori Elements Diagnostics Plugin [FEDiagnosticOVP]+*************"+S;j+=p+"Extracted on "+new Date().toUTCString()+S;j+=p+"Host: <a href=\""+g.url+"\" rel=\"noopener noreferrer\">"+g.origin+"</a>"+S;j+=p+"Application status: "+g.status+S;if(g.statusMessage){j+=p+"Notice: "+g.statusMessage+S;}j+=p+"Documentation: "+"<a href=\""+D.getDocuURL()+"\" rel=\"noopener noreferrer\">"+D.getDocuURL()+"</a>"+S;j+=n;j+=e+"APP DATA"+S;for(var i=0,k=P.length;i<k;i++){if(P[i].type==="string"){j+=p+P[i].name+": "+P[i].value+S;}else if(P[i].type==="link"){j+=p+P[i].name+": <a href=\""+P[i].target+"\" rel=\"noopener noreferrer\">"+P[i].value+"</a>"+S;}else if(P[i].type==="group"){j+=e+"Group: "+P[i].name+S;}}j+=e+"**************************"+S;j+=n;j+=e+"PROVIDE"+S;j+=e+"User/Password: &lt;user&gt;/&lt;password&gt;"+S;j+=e+"Steps to recreate the issue: &lt;maybe also provide master data, pictures or video…&gt;"+S;function r(){try{document.getSelection().removeAllRanges();}catch(t){return function(){};}}$.empty();h.insertAdjacentHTML('beforeend',j);try{var m=document.createRange();r();m.selectNode(h);document.getSelection().addRange(m);document.execCommand("copy");r();M.show("Ticket relevant information copied to clip board with HTML format");}catch(t){r();b();}finally{$.empty();}}function d(){D.openDocumentation();}function A(){var g=q(".diagnosticPropertiesGroupHeaderContent");if(g.length===0){l.debug("No headers found which should be customized");return;}var G,$,e;for(var i=0;i<g.length;i++){G=q(g[i]);$=G.parents("td:first");e=q("#"+$[0].id);e.addClass("diagnosticPropertiesGroupHeader");e.attr("colspan",2);e.next().remove();}}function u(t,S){var m=this.getView().getModel("data");m.setData({timeLeft:t,status:S});}function s(){if(window.fioriElementsPluginID){var v=document.getElementById(window.fioriElementsPluginID);if(v&&v.parent()&&!v.parent().hasClass("sapUiSupportHidden")){M.show("Data refreshed");}}}return C.extend("sap.ovp.support.DiagnosticsTool.controller.DiagnosticsTool",{onInit:O,onRefreshData:f,onCopyDataPlain:b,onCopyDataHTML:c,onShowDocumentation:d,updateStatus:u,showDataRefreshed:s});});
