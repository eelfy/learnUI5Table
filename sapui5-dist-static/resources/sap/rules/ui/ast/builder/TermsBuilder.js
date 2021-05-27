sap.ui.define(["sap/rules/ui/ast/util/AstUtil","sap/rules/ui/ast/provider/TermsProvider","sap/rules/ui/ast/constants/Constants"],function(a,t,c){"use strict";var i;var T=function(){this._dataObjects=[];this._visitorAssociations=new a.prototype.HashSet();this.termsProviderInstance=t.getInstance();};T.prototype._getDataObjectType=function(d){if(d){if(d==="Structure"){return"S";}if(d==="Table"){return"T";}if(d==="Element"){return"E";}}return d;};T.prototype._getBusinessDataType=function(b){if(b){if(b.toLocaleLowerCase()==="Number".toLocaleLowerCase()){return"N";}if(b.toLocaleLowerCase()==="String".toLocaleLowerCase()){return"S";}if(b.toLocaleLowerCase()==="Boolean".toLocaleLowerCase()){return"B";}if(b.toLocaleLowerCase()==="Date".toLocaleLowerCase()){return"D";}if(b.toLocaleLowerCase()==="Timestamp".toLocaleLowerCase()){return"U";}if(b.toLocaleLowerCase()==="Time".toLocaleLowerCase()){return"T";}if(b.toLocaleLowerCase()==="Geometry".toLocaleLowerCase()){return"G";}if(b.toLocaleLowerCase()==="Amount".toLocaleLowerCase()){return"A";}}return b;};T.prototype._generateTermsFromAssociations=function(b,s,v,p,d,e,f){var g,h,j,k,l,m,n,o;if(b){if(!f[b.TargetDataObjectId]){f[b.TargetDataObjectId]=true;}else{return;}m=s.Name;if(s.Label&&s.Label!=""){m=s.Label;}n=b.Name;if(b.Label&&b.Label!=""){n=b.Label;}l=this.termsProviderInstance.createTerm(p+c.DOT+b.Name,d+c.DOT+b.Id,null,v,'AO',n,false,b.Cardinality);g=this._getDataObject(b.TargetDataObjectId);this.termsProviderInstance.addToTermsIdMap(d+c.DOT+b.Id,l);this.termsProviderInstance.addToTermsNameMap(p+c.DOT+b.Name,l);this.termsProviderInstance.addToTermsLabelMap(e+c.DOT+n,l);if(g){h=g.Attributes;for(var q=0;q<h.length;q++){j=h[q];o=j.Name;if(j.Label&&j.Label!=""){o=j.Label;}l=this.termsProviderInstance.createTerm(p+c.DOT+b.Name+c.DOT+j.Name,d+c.DOT+b.Id+c.DOT+j.Id,this._getBusinessDataType(j.BusinessDataType),v,'E',o,j.HasValueSource);this.termsProviderInstance.addToTermsIdMap(d+c.DOT+b.Id+c.DOT+j.Id,l);this.termsProviderInstance.addToTermsNameMap(p+c.DOT+b.Name+c.DOT+j.Name,l);this.termsProviderInstance.addToTermsLabelMap(e+c.DOT+n+c.DOT+o,l);}k=g.Associations;var r;for(var u=0;u<k.length;u++){r=k[u];this._generateTermsFromAssociations(r,g,v,p+c.DOT+b.Name,d+c.DOT+b.Id,e+c.DOT+n,f);}}}};T.prototype._generateTermsFromRules=function(j){var r,_,b,d,e,f,g,h,k,l,m,v;if(j.d&&j.d.DataObjects){m=j.d.DataObjects;v=j.d.Id;}else if(j.DataObjects){m=j.DataObjects;v=j.Id;}if(j.d&&j.d.Rules){_=j.d.Rules;}else if(j.Rules){_=j.Rules;}for(var n=0;n<_.length;n++){r=_[n];b=r.Name;if(r.Label&&r.Label!=""){b=r.Label;}d=this.termsProviderInstance.createTerm(r.Name,r.Id,null,r.VocabularyId,null,b);d.ResultDataObjectId=r.ResultDataObjectId;d.Status=r.Status;d.Type=c.RULE;var o=this.termsProviderInstance.getTermByTermId(d.ResultDataObjectId);if(o&&o.getIsDataObjectElement()){d.isResultDataObjectElement=true;var p=this.termsProviderInstance._getAllAttrsAndAssocsForDataObject(d.ResultDataObjectId);d._bussinessDataType=p[0]._bussinessDataType;d._hasValueSource=p[0]._hasValueSource;}this.termsProviderInstance.addToTermsIdMap(r.Id,d);this.termsProviderInstance.addToTermsNameMap(r.Name,d);this.termsProviderInstance.addToTermsLabelMap(b,d);for(var q=0;q<m.length;q++){e=m[q];if(e.Id===d.ResultDataObjectId){var s={};s[e.Id]=true;f=e.Attributes;for(var u=0;u<f.length;u++){g=f[u];l=g.Name;if(g.Label&&g.Label!=""){l=g.Label;}d=this.termsProviderInstance.createTerm(g.Name,r.Id+c.DOT+g.Id,this._getBusinessDataType(g.BusinessDataType),v,'E',l);this.termsProviderInstance.addToTermsIdMap(r.Id+c.DOT+g.Id,d);this.termsProviderInstance.addToTermsNameMap(r.Name+c.DOT+g.Name,d);this.termsProviderInstance.addToTermsLabelMap(b+c.DOT+l,d);}k=e.Associations;for(var w=0;w<k.length;w++){h=k[w];this._generateTermsFromAssociations(h,e,v,r.Name,r.Id,b,s);}}}}};T.prototype._getDataObject=function(b){for(var d=0;d<this._dataObjects.length;d++){if(b===this._dataObjects[d].Id){return this._dataObjects[d];}}};T.prototype.construct=function(j){this._dataObjects=j.DataObjects;this._rules=j.Rules;var v=j.Id;this.termsProviderInstance.reset();this.termsProviderInstance.setVocabularyId(v);var d,b,e,f,g,h,k,l;for(var m=0;m<this._dataObjects.length;m++){d=this._dataObjects[m];k=d.Name;if(d.Label&&d.Label!=""){k=d.Label;}var n=false;if(d.Type==="Element"){n=true}h=this.termsProviderInstance.createTerm(d.Name,d.Id,null,v,this._getDataObjectType(d.Type),k);h.setIsDataObjectElement(n);this.termsProviderInstance.addToTermsIdMap(d.Id,h);this.termsProviderInstance.addToTermsNameMap(d.Name,h);this.termsProviderInstance.addToTermsLabelMap(k,h);b=d.Attributes;for(var o=0;o<b.length;o++){e=b[o];l=e.Name;if(e.Label&&e.Label!=""){l=e.Label;}h=this.termsProviderInstance.createTerm(d.Name+c.DOT+e.Name,d.Id+c.DOT+e.Id,this._getBusinessDataType(e.BusinessDataType),v,'E',l,e.HasValueSource);this.termsProviderInstance.addToTermsIdMap(d.Id+c.DOT+e.Id,h);this.termsProviderInstance.addToTermsNameMap(d.Name+c.DOT+e.Name,h);this.termsProviderInstance.addToTermsLabelMap(k+c.DOT+l,h);}g=d.Associations;for(var p=0;p<g.length;p++){f=g[p];var q={};q[d.Id]=true;this._generateTermsFromAssociations(f,d,v,d.Name,d.Id,k,q);}}if(this._rules&&this._rules.length>0){this._generateTermsFromRules(j);}};return{getInstance:function(){if(!i){i=new T();i.constructor=null;}return i;}};},true);
