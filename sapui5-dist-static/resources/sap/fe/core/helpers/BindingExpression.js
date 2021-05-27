sap.ui.define(["./AnnotationEnum"],function(A){"use strict";var _={};var r=A.resolveEnumValue;function c(a,i){return g(a)||f(a,i)||l(a,i)||d();}function d(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function f(a,i){if(typeof Symbol==="undefined"||!(Symbol.iterator in Object(a)))return;var b=[];var e=true;var j=false;var n=undefined;try{for(var o=a[Symbol.iterator](),_s;!(e=(_s=o.next()).done);e=true){b.push(_s.value);if(i&&b.length===i)break;}}catch(d1){j=true;n=d1;}finally{try{if(!e&&o["return"]!=null)o["return"]();}finally{if(j)throw n;}}return b;}function g(a){if(Array.isArray(a))return a;}function h(a){return p(a)||m(a)||l(a)||k();}function k(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function l(o,a){if(!o)return;if(typeof o==="string")return q(o,a);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(n);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return q(o,a);}function m(i){if(typeof Symbol!=="undefined"&&Symbol.iterator in Object(i))return Array.from(i);}function p(a){if(Array.isArray(a))return q(a);}function q(a,b){if(b==null||b>a.length)b=a.length;for(var i=0,e=new Array(b);i<b;i++){e[i]=a[i];}return e;}function s(a,b){if(a._type!==b._type){return false;}switch(a._type){case"Constant":case"EmbeddedBinding":case"EmbeddedExpressionBinding":return a.value===b.value;case"Not":return s(a.operand,b.operand);case"Set":return a.operator===b.operator&&a.operands.length===b.operands.length&&a.operands.every(function(j){return b.operands.some(function(n){return s(j,n);});});case"IfElse":return s(a.condition,b.condition)&&s(a.onTrue,b.onTrue)&&s(a.onFalse,b.onFalse);case"Comparison":return a.operator==b.operator&&s(a.operand1,b.operand1)&&s(a.operand2,b.operand2);case"Concat":var e=a.expressions;var i=b.expressions;if(e.length!==i.length){return false;}return e.every(function(j,n){return s(j,i[n]);});case"Binding":return a.modelName===b.modelName&&a.path===b.path&&a.targetEntitySet===b.targetEntitySet;case"DefaultBinding":return a.modelName===b.modelName&&a.path===b.path;case"Formatter":return a.fn===b.fn&&a.parameters.length===b.parameters.length&&a.parameters.every(function(j,n){return s(b.parameters[n],j);});case"ComplexType":return a.type===b.type&&a.bindingParameters.length===b.bindingParameters.length&&a.bindingParameters.every(function(j,n){return s(b.bindingParameters[n],j);});case"Function":var o=b;if(a.obj===undefined||o.obj===undefined){return a.obj===o;}return a.fn===o.fn&&s(a.obj,o.obj)&&a.parameters.length===o.parameters.length&&a.parameters.every(function(j,n){return s(o.parameters[n],j);});case"Ref":return a.ref===b.ref;}}_.expressionEquals=s;function t(a){return a.operands.reduce(function(b,o){var i=o._type==="Set"&&o.operator===a.operator?o.operands:[o];i.forEach(function(j){if(b.operands.every(function(e){return!s(e,j);})){b.operands.push(j);}});return b;},{_type:"Set",operator:a.operator,operands:[]});}function u(e){if(e.length<2){return false;}var i=e.length;while(i--){var a=e[i];var n=x(a);for(var j=0;j<i;j++){if(s(e[j],n)){return true;}}}return false;}function v(){for(var a=arguments.length,o=new Array(a),b=0;b<a;b++){o[b]=arguments[b];}var e=t({_type:"Set",operator:"&&",operands:o.map(E)}).operands;var i=false;var n=e.filter(function(d1){if(F(d1)&&!d1.value){i=true;}return!F(d1);});if(i){return z(false);}else if(n.length===0){var j=e.reduce(function(j,d1){return j&&F(d1)&&d1.value;},true);return z(j);}else if(n.length===1){return n[0];}else if(u(n)){return z(false);}else{return{_type:"Set",operator:"&&",operands:n};}}_.and=v;function w(){for(var a=arguments.length,o=new Array(a),b=0;b<a;b++){o[b]=arguments[b];}var e=t({_type:"Set",operator:"||",operands:o.map(E)}).operands;var i=false;var n=e.filter(function(d1){if(F(d1)&&d1.value){i=true;}return!F(d1)||d1.value;});if(i){return z(true);}else if(n.length===0){var j=e.reduce(function(j,d1){return j&&F(d1)&&d1.value;},true);return z(j);}else if(n.length===1){return n[0];}else if(u(n)){return z(true);}else{return{_type:"Set",operator:"||",operands:n};}}_.or=w;function x(o){o=E(o);if(F(o)){return z(!o.value);}else if(typeof o==="object"&&o._type==="Set"&&o.operator==="||"&&o.operands.every(function(e){return F(e)||G(e);})){return v.apply(void 0,h(o.operands.map(function(e){return x(e);})));}else if(typeof o==="object"&&o._type==="Set"&&o.operator==="&&"&&o.operands.every(function(e){return F(e)||G(e);})){return w.apply(void 0,h(o.operands.map(function(e){return x(e);})));}else if(G(o)){switch(o.operator){case"!==":return O(o.operand1,o.operand2);case"<":return Q(o.operand1,o.operand2);case"<=":return R(o.operand1,o.operand2);case"===":return P(o.operand1,o.operand2);case">":return S(o.operand1,o.operand2);case">=":return T(o.operand1,o.operand2);}}else if(o._type==="Not"){return o.operand;}else{return{_type:"Not",operand:o};}}_.not=x;function y(a,b){var e=arguments.length>2&&arguments[2]!==undefined?arguments[2]:[];var i=e.concat();i.push(a);return{_type:"Binding",modelName:b,path:i.join("/")};}_.bindingExpression=y;function z(a){var b;if(typeof a==="object"&&a!==null&&a!==undefined){if(Array.isArray(a)){b=a.map(E);}else if(H(a)){b=a.valueOf();}else{var e=a;var o=Object.keys(e).reduce(function(o,i){var a=E(e[i]);if(a._type!=="Constant"||a.value!==undefined){o[i]=a;}return o;},{});b=o;}}else{b=a;}return{_type:"Constant",value:b};}_.constant=z;function B(a,b){if(a!==undefined&&typeof a==="string"&&a.startsWith("{")){if(a.startsWith("{=")){return{_type:"EmbeddedExpressionBinding",value:a};}else{return{_type:"EmbeddedBinding",value:a};}}else{switch(b){case"boolean":if(typeof a==="string"&&(a==="true"||a==="false")){return z(a==="true");}return z(a);default:return z(a);}}}_.resolveBindingString=B;function C(C){return{_type:"Ref",ref:C};}_.ref=C;function D(a){return a!==null&&typeof a==="object"&&a._type!==undefined;}function E(a){if(D(a)){return a;}return z(a);}function F(a){return typeof a!=="object"||a._type==="Constant";}_.isConstant=F;function G(e){return e._type==="Comparison";}function H(o){switch(o.constructor.name){case"String":case"Number":case"Boolean":return true;default:return false;}}function I(J){return typeof J==="object"&&!H(J);}function J(J){var a=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];var b=arguments.length>2?arguments[2]:undefined;if(J===undefined){return E(b);}if(!I(J)){return z(J);}else{switch(J.type){case"Path":return y(J.path,undefined,a);case"If":return L(J.If);case"Apply":return M(J,a);}}}_.annotationExpression=J;function K(a){if(a===null||typeof a!=="object"){return z(a);}else if(a.hasOwnProperty("$Or")){return w.apply(void 0,h(a.$Or.map(K)));}else if(a.hasOwnProperty("$And")){return v.apply(void 0,h(a.$And.map(K)));}else if(a.hasOwnProperty("$Not")){return x(K(a.$Not[0]));}else if(a.hasOwnProperty("$Eq")){return O(K(a.$Eq[0]),K(a.$Eq[1]));}else if(a.hasOwnProperty("$Ne")){return P(K(a.$Ne[0]),K(a.$Ne[1]));}else if(a.hasOwnProperty("$Gt")){return R(K(a.$Gt[0]),K(a.$Gt[1]));}else if(a.hasOwnProperty("$Ge")){return Q(K(a.$Ge[0]),K(a.$Ge[1]));}else if(a.hasOwnProperty("$Lt")){return T(K(a.$Lt[0]),K(a.$Lt[1]));}else if(a.hasOwnProperty("$Le")){return S(K(a.$Le[0]),K(a.$Le[1]));}else if(a.hasOwnProperty("$Path")){return y(a.$Path);}else if(a.hasOwnProperty("$Apply")){return J({type:"Apply",Function:a.$Function,Apply:a.$Apply});}else if(a.hasOwnProperty("$If")){return J({type:"If",If:a.$If});}else if(a.hasOwnProperty("$EnumMember")){return z(r(a.$EnumMember));}else{return z(false);}}function L(L){return U(K(L[0]),K(L[1]),K(L[2]));}_.annotationIfExpression=L;function M(M,a){switch(M.Function){case"odata.concat":return $.apply(void 0,h(M.Apply.map(function(b){var e=b;if(b.hasOwnProperty("$Path")){e={type:"Path",path:b.$Path};}else if(b.hasOwnProperty("$If")){e={type:"If",If:b.$If};}else if(b.hasOwnProperty("$Apply")){e={type:"Apply",Function:b.$Function,Apply:b.$Apply};}return J(e,a);})));break;}}_.annotationApplyExpression=M;function N(o,a,b){var e=E(a);var i=E(b);if(F(e)&&F(i)){if(e.value===undefined||i.value===undefined){return z(e.value===i.value);}switch(o){case"!==":return z(e.value!==i.value);case"<":return z(e.value<i.value);case"<=":return z(e.value<=i.value);case">":return z(e.value>i.value);case">=":return z(e.value>=i.value);case"===":default:return z(e.value===i.value);}}else{return{_type:"Comparison",operator:o,operand1:e,operand2:i};}}function O(a,b){var e=E(a);var i=E(b);if(s(e,i)){return z(true);}if(e._type==="IfElse"&&s(e.onTrue,i)){return e.condition;}else if(e._type==="IfElse"&&s(e.onFalse,i)){return x(e.condition);}return N("===",e,i);}_.equal=O;function P(a,b){var e=E(a);var i=E(b);if(s(e,i)){return z(false);}if(e._type==="IfElse"&&s(e.onTrue,i)){return x(e.condition);}else if(e._type==="IfElse"&&s(e.onFalse,i)){return e.condition;}else if(e._type==="IfElse"&&e.onTrue._type===i._type&&!s(e.onTrue,i)&&e.onFalse._type===i._type&&!s(e.onFalse,i)){return z(true);}return N("!==",e,i);}_.notEqual=P;function Q(a,b){return N(">=",a,b);}_.greaterOrEqual=Q;function R(a,b){return N(">",a,b);}_.greaterThan=R;function S(a,b){return N("<=",a,b);}_.lessOrEqual=S;function T(a,b){return N("<",a,b);}_.lessThan=T;function U(a,o,b){var e=E(a);var i=E(o);var j=E(b);if(e._type==="Not"){var n=[j,i];i=n[0];j=n[1];e=x(e);}if(i._type==="IfElse"&&s(e,i.condition)){i=i.onTrue;}if(j._type==="IfElse"&&s(e,j.condition)){j=j.onFalse;}if(e._type==="IfElse"){if(F(e.onFalse)&&!e.onFalse.value&&F(e.onTrue)&&e.onTrue.value){e=e.condition;}else if(F(e.onFalse)&&e.onFalse.value&&F(e.onTrue)&&!e.onTrue.value){e=x(e.condition);}else if(F(e.onTrue)&&!e.onTrue.value&&!F(e.onFalse)){e=v(x(e.condition),e.onFalse);}}if(e._type==="Not"){var d1=[j,i];i=d1[0];j=d1[1];e=x(e);}if(F(e)){return e.value?i:j;}if(s(i,j)){return i;}if(F(j)&&j.value===false){return v(e,i);}if(F(i)&&i.value===false){return v(x(e),j);}return{_type:"IfElse",condition:e,onTrue:i,onFalse:j};}_.ifElse=U;function V(e){switch(e._type){case"Constant":case"Formatter":case"ComplexType":return false;case"Set":return e.operands.some(V);case"Binding":return e.modelName===undefined;case"Comparison":return V(e.operand1)||V(e.operand2);case"DefaultBinding":return true;case"IfElse":return V(e.condition)||V(e.onTrue)||V(e.onFalse);case"Not":return V(e.operand);default:return false;}}function W(a,b,e){var i=a.map(E);if(i.length===1&&F(i[0])&&!e){return i[0];}else if(!!e){if(!i.some(V)){e.keys.forEach(function(e1){return i.push(y(e1.name,""));});}}var j=b.__functionName.split("#"),n=c(j,2),o=n[0],d1=n[1];if(!!d1&&d1.length>0){i.unshift(z(d1));}return{_type:"Formatter",fn:o,parameters:i};}_.formatResult=W;function X(a,b,e){var i=a.map(E);if(i.length===1&&F(i[0])&&!e){return i[0];}else if(!!e){if(!i.some(V)){e.keys.forEach(function(j){return i.push(y(j.name,""));});}}return{_type:"ComplexType",type:b,formatOptions:{},parameters:{},bindingParameters:i};}_.addTypeInformation=X;function Y(Y,a,o){var b=typeof Y==="string"?Y:Y.__functionName;return{_type:"Function",obj:o!==undefined?E(o):undefined,fn:b,parameters:a.map(E)};}_.fn=Y;function Z(e){if(e._type==="Concat"){return w.apply(void 0,h(e.expressions.map(Z)));}return w(O(e,""),O(e,undefined),O(e,null));}_.isEmpty=Z;function $(){for(var a=arguments.length,i=new Array(a),b=0;b<a;b++){i[b]=arguments[b];}var e=i.map(E);if(e.every(F)){return z(e.reduce(function(j,n){return j+n.value.toString();},""));}return{_type:"Concat",expressions:e};}_.concat=$;function a1(i,e,a){var b=i;if(e===b._type){b=a(i);}else{switch(b._type){case"Function":b.parameters=b.parameters.map(function(b){return a1(b,e,a);});break;case"Concat":b.expressions=b.expressions.map(function(b){return a1(b,e,a);});break;case"ComplexType":b.bindingParameters=b.bindingParameters.map(function(b){return a1(b,e,a);});break;case"Formatter":b.parameters=b.parameters.map(function(b){return a1(b,e,a);});break;case"IfElse":b.onTrue=a1(b.onTrue,e,a);b.onFalse=a1(b.onFalse,e,a);break;case"Not":break;case"Set":break;case"Comparison":break;case"DefaultBinding":case"Ref":case"Binding":case"Constant":break;}}return b;}_.transformRecursively=a1;function b1(e){var a=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var b=E(e);var i="";switch(b._type){case"Constant":if(b.value===null){return"null";}if(b.value===undefined){return"undefined";}if(typeof b.value==="object"){if(Array.isArray(b.value)){var j=b.value.map(function(e){return b1(e,true);});return"[".concat(j.join(", "),"]");}else{var o=b.value;var n=Object.keys(o).map(function(h1){var i1=o[h1];return"".concat(h1,": ").concat(b1(i1,true));});return"{".concat(n.join(", "),"}");}}if(a){switch(typeof b.value){case"number":case"bigint":case"boolean":return b.value.toString();case"string":return"'".concat(b.value.toString(),"'");default:return"";}}else{return b.value.toString();}case"Ref":return b.ref||"null";case"Function":var d1="".concat(b.parameters.map(function(h1){return b1(h1,true);}).join(", "));return b.obj===undefined?"".concat(b.fn,"(").concat(d1,")"):"".concat(b1(b.obj,true),".").concat(b.fn,"(").concat(d1,")");case"EmbeddedExpressionBinding":if(a){return"(".concat(b.value.substr(2,b.value.length-3),")");}else{return"".concat(b.value);}case"EmbeddedBinding":if(a){return"%".concat(b.value);}else{return"".concat(b.value);}case"DefaultBinding":case"Binding":if(b.type||b.parameters||b.targetType){var e1="";if(a){e1+="%";}e1+="{path:'".concat(b.modelName?"".concat(b.modelName,">"):"").concat(b.path,"'");if(b.type){e1+=", type: '".concat(b.type,"'");}if(b.constraints&&Object.keys(b.constraints).length>0){e1+=", constraints: ".concat(b1(b.constraints));}if(b.formatOptions){e1+=", formatOptions: ".concat(b1(b.formatOptions));}if(b.parameters&&Object.keys(b.parameters).length>0){e1+=", parameters: ".concat(b1(b.parameters));}if(b.targetType){e1+=", targetType: '".concat(b.targetType,"'");}e1+="}";return e1;}else{if(a){return"%{".concat(b.modelName?"".concat(b.modelName,">"):"").concat(b.path,"}");}else{return"{".concat(b.modelName?"".concat(b.modelName,">"):"").concat(b.path,"}");}}case"Comparison":var f1="".concat(b1(b.operand1,true)," ").concat(b.operator," ").concat(b1(b.operand2,true));if(a){return f1;}return"{= ".concat(f1,"}");case"IfElse":if(a){return"(".concat(b1(b.condition,true)," ? ").concat(b1(b.onTrue,true)," : ").concat(b1(b.onFalse,true),")");}else{return"{= ".concat(b1(b.condition,true)," ? ").concat(b1(b.onTrue,true)," : ").concat(b1(b.onFalse,true),"}");}case"Set":if(a){return"(".concat(b.operands.map(function(e){return b1(e,true);}).join(" ".concat(b.operator," ")),")");}else{return"{= (".concat(b.operands.map(function(e){return b1(e,true);}).join(" ".concat(b.operator," ")),")}");}case"Concat":if(a){return"".concat(b.expressions.map(function(e){return b1(e,true);}).join(" + "));}else{return"{= ".concat(b.expressions.map(function(e){return b1(e,true);}).join(" + ")," }");}case"Not":if(a){return"!".concat(b1(b.operand,true));}else{return"{= !".concat(b1(b.operand,true),"}");}case"Formatter":if(b.parameters.length===1){i+="{".concat(c1(b.parameters[0],true),", formatter: '").concat(b.fn,"'}");}else{i+="{parts:[".concat(b.parameters.map(function(h1){return c1(h1);}).join(","),"], formatter: '").concat(b.fn,"'}");}if(a){i="$".concat(i);}return i;case"ComplexType":if(b.bindingParameters.length===1){i+="{".concat(c1(b.bindingParameters[0],true),", type: '").concat(b.type,"'}");}else{var g1;switch(b.type){case"sap.ui.model.odata.type.Unit":g1=",{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'";break;case"sap.ui.model.odata.type.Currency":g1=",{mode:'OneTime',path:'/##@@requestCurrencyCodes',targetType:'any'}],type:'sap.ui.model.odata.type.Currency'";break;default:g1="], type: '".concat(b.type,"'");}if(b.formatOptions&&Object.keys(b.formatOptions).length>0){g1+=", formatOptions: ".concat(b1(b.formatOptions));}if(b.parameters&&Object.keys(b.parameters).length>0){g1+=", parameters: ".concat(b1(b.parameters));}g1+="}";i+="{mode:'TwoWay', parts:[".concat(b.bindingParameters.map(function(h1){return c1(h1);}).join(",")).concat(g1);}if(a){i="$".concat(i);}return i;default:return"";}}_.compileBinding=b1;function c1(e){var a=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var o="";switch(e._type){case"Constant":switch(typeof e.value){case"number":case"bigint":o="value: ".concat(e.value.toString());break;case"string":case"boolean":o="value: '".concat(e.value.toString(),"'");break;default:o="value: ''";break;}if(a){return o;}return"{".concat(o,"}");case"DefaultBinding":case"Binding":o="path:'".concat(e.modelName?"".concat(e.modelName,">"):"").concat(e.path,"'");if(e.type){o+=", type : '".concat(e.type,"'");}else{o+=", targetType : 'any'";}if(e.constraints&&Object.keys(e.constraints).length>0){o+=", constraints: ".concat(b1(e.constraints));}if(e.formatOptions&&Object.keys(e.formatOptions).length>0){o+=", formatOptions: ".concat(b1(e.formatOptions));}if(a){return o;}return"{".concat(o,"}");default:return"";}}return _;},false);