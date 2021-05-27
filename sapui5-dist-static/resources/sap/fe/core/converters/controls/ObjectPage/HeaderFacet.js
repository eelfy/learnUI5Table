sap.ui.define(["sap/fe/core/converters/helpers/ConfigurableObject","sap/fe/core/converters/helpers/ID","sap/fe/core/helpers/BindingExpression","sap/fe/core/converters/helpers/Key","../Common/Form","sap/fe/core/converters/annotations/DataField"],function(C,I,B,K,F,D){"use strict";var _={};var g=D.getSemanticObjectPath;var a=F.getFormElementsFromManifest;var b=F.FormElementType;var c=K.KeyHelper;var n=B.not;var e=B.equal;var d=B.compileBinding;var f=B.annotationExpression;var H=I.HeaderFacetID;var h=I.HeaderFacetFormID;var j=I.HeaderFacetContainerID;var k=I.CustomHeaderFacetID;var P=C.Placement;var l=C.insertCustomElements;function o(i,N){var O=Object.keys(i);if(Object.getOwnPropertySymbols){var Q=Object.getOwnPropertySymbols(i);if(N)Q=Q.filter(function(R){return Object.getOwnPropertyDescriptor(i,R).enumerable;});O.push.apply(O,Q);}return O;}function m(N){for(var i=1;i<arguments.length;i++){var O=arguments[i]!=null?arguments[i]:{};if(i%2){o(Object(O),true).forEach(function(Q){p(N,Q,O[Q]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(N,Object.getOwnPropertyDescriptors(O));}else{o(Object(O)).forEach(function(Q){Object.defineProperty(N,Q,Object.getOwnPropertyDescriptor(O,Q));});}}return N;}function p(i,N,O){if(N in i){Object.defineProperty(i,N,{value:O,enumerable:true,configurable:true,writable:true});}else{i[N]=O;}return i;}var q;(function(q){q["Annotation"]="Annotation";q["XMLFragment"]="XMLFragment";})(q||(q={}));_.HeaderFacetType=q;var r;(function(r){r["Reference"]="Reference";r["Collection"]="Collection";})(r||(r={}));_.FacetType=r;var s;(function(s){s["Default"]="Default";s["NotAdaptable"]="not-adaptable";s["NotAdaptableTree"]="not-adaptable-tree";s["NotAdaptableVisibility"]="not-adaptable-visibility";})(s||(s={}));_.FlexDesignTimeType=s;var t;(function(t){t["ProgressIndicator"]="ProgressIndicator";t["RatingIndicator"]="RatingIndicator";t["Content"]="Content";})(t||(t={}));var T;(function(T){T["None"]="None";T["DataPoint"]="DataPoint";T["Chart"]="Chart";T["Identification"]="Identification";T["Contact"]="Contact";T["Address"]="Address";T["FieldGroup"]="FieldGroup";})(T||(T={}));function u(i){var N,O,Q;var R=[];(N=i.getEntityType().annotations)===null||N===void 0?void 0:(O=N.UI)===null||O===void 0?void 0:(Q=O.HeaderFacets)===null||Q===void 0?void 0:Q.forEach(function(S){var U=J(S,i);if(U){R.push(U);}});return R;}_.getHeaderFacetsFromAnnotations=u;function v(i){var N={};Object.keys(i).forEach(function(O){var Q=i[O];N[O]=M(Q,O);});return N;}_.getHeaderFacetsFromManifest=v;function w(i,N,O){var Q;var R=s.Default;var S=((Q=i.ID)===null||Q===void 0?void 0:Q.toString())||"";if(i.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"&&N.$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"){R=s.NotAdaptableTree;}else{var U=O.getManifestControlConfiguration("@com.sap.vocabularies.UI.v1.HeaderFacets");if(S){var V,W,X;var Y=U===null||U===void 0?void 0:(V=U.facets)===null||V===void 0?void 0:(W=V[S])===null||W===void 0?void 0:(X=W.flexSettings)===null||X===void 0?void 0:X.designtime;switch(Y){case s.NotAdaptable:case s.NotAdaptableTree:case s.NotAdaptableVisibility:R=Y;}}}return R;}_.getDesignTimeMetadata=w;function x(i,N,O){var Q,R,S;if(i.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"&&!(((Q=i.annotations)===null||Q===void 0?void 0:(R=Q.UI)===null||R===void 0?void 0:(S=R.Hidden)===null||S===void 0?void 0:S.valueOf())===true)){var U,V;var W=H({Facet:i}),X=function(i,c1){var d1,e1;return((d1=i.ID)===null||d1===void 0?void 0:d1.toString())||((e1=i.Label)===null||e1===void 0?void 0:e1.toString())||c1;},Y=i.Target.value,Z=z(i);var $;var a1;switch(Z){case T.FieldGroup:$=A(i,O);break;case T.DataPoint:a1=G(i);break;}var b1=i.annotations;return{type:q.Annotation,facetType:r.Reference,id:W,containerId:j({Facet:i}),key:X(i,W),flexSettings:{designtime:w(i,N,O)},visible:d(n(e(f(b1===null||b1===void 0?void 0:(U=b1.UI)===null||U===void 0?void 0:(V=U.Hidden)===null||V===void 0?void 0:V.valueOf()),true))),annotationPath:O.getEntitySetBasedAnnotationPath(i.fullyQualifiedName)+"/",targetAnnotationValue:Y,targetAnnotationType:Z,headerFormData:$,headerDataPointData:a1};}return undefined;}function y(i,N){if(i.$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"){var O,Q,R;var S=[],U=H({Facet:i}),V=function(W,X){var Y,Z;return((Y=W.ID)===null||Y===void 0?void 0:Y.toString())||((Z=W.Label)===null||Z===void 0?void 0:Z.toString())||X;};i.Facets.forEach(function(W){var X=x(W,i,N);if(X){S.push(X);}});return{type:q.Annotation,facetType:r.Collection,id:U,containerId:j({Facet:i}),key:V(i,U),flexSettings:{designtime:w(i,i,N)},visible:d(n(e(f((O=i.annotations)===null||O===void 0?void 0:(Q=O.UI)===null||Q===void 0?void 0:(R=Q.Hidden)===null||R===void 0?void 0:R.valueOf()),true))),annotationPath:N.getEntitySetBasedAnnotationPath(i.fullyQualifiedName)+"/",facets:S};}return undefined;}function z(i){var N=T.None;var O={"com.sap.vocabularies.UI.v1.DataPoint":T.DataPoint,"com.sap.vocabularies.UI.v1.Chart":T.Chart,"com.sap.vocabularies.UI.v1.Identification":T.Identification,"com.sap.vocabularies.Communication.v1.Contact":T.Contact,"com.sap.vocabularies.Communication.v1.Address":T.Address,"com.sap.vocabularies.UI.v1.FieldGroup":T.FieldGroup};if(i.$Type!=="com.sap.vocabularies.UI.v1.ReferenceURLFacet"&&i.$Type!=="com.sap.vocabularies.UI.v1.CollectionFacet"){var Q,R;N=O[(Q=i.Target)===null||Q===void 0?void 0:(R=Q.$target)===null||R===void 0?void 0:R.term]||T.None;}return N;}function A(i,N){var O;if(!i){throw new Error("Cannot get FieldGroup form data without facet definition");}var Q=l(E(i,N),a(i,N));return{id:h({Facet:i}),label:(O=i.Label)===null||O===void 0?void 0:O.toString(),formElements:Q};}function E(i,N){var O=[];if(i.$Type!=="com.sap.vocabularies.UI.v1.ReferenceURLFacet"&&i.$Type!=="com.sap.vocabularies.UI.v1.CollectionFacet"){var Q,R;(Q=i.Target)===null||Q===void 0?void 0:(R=Q.$target)===null||R===void 0?void 0:R.Data.forEach(function(S){var U,V,W;if(!(((U=S.annotations)===null||U===void 0?void 0:(V=U.UI)===null||V===void 0?void 0:(W=V.Hidden)===null||W===void 0?void 0:W.valueOf())===true)){var X=g(N,S);if(S.$Type==="com.sap.vocabularies.UI.v1.DataField"){var Y,Z,$,a1,b1,c1,d1,e1,f1,g1,h1;var i1=S.annotations;O.push({isValueMultilineText:((Y=S.Value)===null||Y===void 0?void 0:(Z=Y.$target)===null||Z===void 0?void 0:($=Z.annotations)===null||$===void 0?void 0:(a1=$.UI)===null||a1===void 0?void 0:(b1=a1.MultiLineText)===null||b1===void 0?void 0:b1.valueOf())===true,type:b.Annotation,key:c.generateKeyFromDataField(S),visible:d(n(e(f(i1===null||i1===void 0?void 0:(c1=i1.UI)===null||c1===void 0?void 0:(d1=c1.Hidden)===null||d1===void 0?void 0:d1.valueOf()),true))),label:((e1=S.Value)===null||e1===void 0?void 0:(f1=e1.$target)===null||f1===void 0?void 0:(g1=f1.annotations)===null||g1===void 0?void 0:(h1=g1.Common)===null||h1===void 0?void 0:h1.Label)||S.Label,idPrefix:h({Facet:i},S),annotationPath:N.getEntitySetBasedAnnotationPath(S.fullyQualifiedName)+"/",semanticObjectPath:X});}else if(S.$Type==="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"){var j1,k1,l1,m1,n1,o1,p1,q1,r1,s1,t1;var u1=S.annotations;O.push({isValueMultilineText:((j1=S.Target)===null||j1===void 0?void 0:(k1=j1.$target)===null||k1===void 0?void 0:(l1=k1.annotations)===null||l1===void 0?void 0:(m1=l1.UI)===null||m1===void 0?void 0:(n1=m1.MultiLineText)===null||n1===void 0?void 0:n1.valueOf())===true,type:b.Annotation,key:c.generateKeyFromDataField(S),visible:d(n(e(f(u1===null||u1===void 0?void 0:(o1=u1.UI)===null||o1===void 0?void 0:(p1=o1.Hidden)===null||p1===void 0?void 0:p1.valueOf()),true))),label:((q1=S.Target)===null||q1===void 0?void 0:(r1=q1.$target)===null||r1===void 0?void 0:(s1=r1.annotations)===null||s1===void 0?void 0:(t1=s1.Common)===null||t1===void 0?void 0:t1.Label)||S.Label,idPrefix:h({Facet:i},S),annotationPath:N.getEntitySetBasedAnnotationPath(S.fullyQualifiedName)+"/",semanticObjectPath:X});}}});}return O;}function G(i){var N=t.Content;if(i.$Type==="com.sap.vocabularies.UI.v1.ReferenceFacet"){var O,Q,R,S;if(((O=i.Target)===null||O===void 0?void 0:(Q=O.$target)===null||Q===void 0?void 0:Q.Visualization)==="UI.VisualizationType/Progress"){N=t.ProgressIndicator;}else if(((R=i.Target)===null||R===void 0?void 0:(S=R.$target)===null||S===void 0?void 0:S.Visualization)==="UI.VisualizationType/Rating"){N=t.RatingIndicator;}}return{type:N};}function J(i,N){var O;switch(i.$Type){case"com.sap.vocabularies.UI.v1.ReferenceFacet":O=x(i,i,N);break;case"com.sap.vocabularies.UI.v1.CollectionFacet":O=y(i,N);break;}return O;}function L(i){if(!i){return undefined;}var N=["Heroes","Decoration","Workers","LongRunners"].indexOf(i)!==-1?"$auto."+i:i;return"{ path : '', parameters : { $$groupId : '"+N+"' } }";}function M(i,N){var O=k(N);var Q=i.position;if(!Q){Q={placement:P.After};}return{facetType:r.Reference,facets:[],type:i.type,id:O,containerId:O,key:N,position:Q,visible:i.visible,fragmentName:i.name,title:i.title,subTitle:i.subTitle,stashed:i.stashed||false,flexSettings:m({},{designtime:s.Default},{},i.flexSettings),binding:L(i.requestGroupId)};}return _;},false);
