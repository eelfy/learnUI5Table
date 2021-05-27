/*! Buttons for DataTables 1.4.0
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
(function(f){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net'],function($){return f($,window,document);});}else if(typeof exports==='object'){module.exports=function(r,$){if(!r){r=window;}if(!$||!$.fn.dataTable){$=require('datatables.net')(r,$).$;}return f($,r,r.document);};}else{f(jQuery,window,document);}}(function($,w,b,u){'use strict';var D=$.fn.dataTable;var _=0;var c=0;var f=D.ext.buttons;var B=function(d,a){if(typeof(a)==='undefined'){a={};}if(a===true){a={};}if($.isArray(a)){a={buttons:a};}this.c=$.extend(true,{},B.defaults,a);if(a.buttons){this.c.buttons=a.buttons;}this.s={dt:new D.Api(d),buttons:[],listenKeys:'',namespace:'dtb'+(_++)};this.dom={container:$('<'+this.c.dom.container.tag+'/>').addClass(this.c.dom.container.className)};this._constructor();};$.extend(B.prototype,{action:function(a,d){var e=this._nodeToButton(a);if(d===u){return e.conf.action;}e.conf.action=d;return this;},active:function(a,d){var e=this._nodeToButton(a);var i=this.c.dom.button.active;var j=$(e.node);if(d===u){return j.hasClass(i);}j.toggleClass(i,d===u?true:d);return this;},add:function(a,d){var e=this.s.buttons;if(typeof d==='string'){var s=d.split('-');var j=this.s;for(var i=0,p=s.length-1;i<p;i++){j=j.buttons[s[i]*1];}e=j.buttons;d=s[s.length-1]*1;}this._expandButton(e,a,false,d);this._draw();return this;},container:function(){return this.dom.container;},disable:function(a){var d=this._nodeToButton(a);$(d.node).addClass(this.c.dom.button.disabled);return this;},destroy:function(){$('body').off('keyup.'+this.s.namespace);var a=this.s.buttons.slice();var i,d;for(i=0,d=a.length;i<d;i++){this.remove(a[i].node);}this.dom.container.remove();var e=this.s.dt.settings()[0];for(i=0,d=e.length;i<d;i++){if(e.inst===this){e.splice(i,1);break;}}return this;},enable:function(a,d){if(d===false){return this.disable(a);}var e=this._nodeToButton(a);$(e.node).removeClass(this.c.dom.button.disabled);return this;},name:function(){return this.c.name;},node:function(a){var d=this._nodeToButton(a);return $(d.node);},processing:function(a,d){var e=this._nodeToButton(a);if(d===u){return $(e.node).hasClass('processing');}$(e.node).toggleClass('processing',d);return this;},remove:function(a){var d=this._nodeToButton(a);var e=this._nodeToHost(a);var j=this.s.dt;if(d.buttons.length){for(var i=d.buttons.length-1;i>=0;i--){this.remove(d.buttons[i].node);}}if(d.conf.destroy){d.conf.destroy.call(j.button(a),j,$(a),d.conf);}this._removeKey(d.conf);$(d.node).remove();var p=$.inArray(d,e);e.splice(p,1);return this;},text:function(a,d){var e=this._nodeToButton(a);var i=this.c.dom.collection.buttonLiner;var j=e.inCollection&&i&&i.tag?i.tag:this.c.dom.buttonLiner.tag;var p=this.s.dt;var q=$(e.node);var t=function(r){return typeof r==='function'?r(p,q,e.conf):r;};if(d===u){return t(e.conf.text);}e.conf.text=d;if(j){q.children(j).html(t(d));}else{q.html(t(d));}return this;},_constructor:function(){var t=this;var d=this.s.dt;var a=d.settings()[0];var j=this.c.buttons;if(!a._buttons){a._buttons=[];}a._buttons.push({inst:this,name:this.c.name});for(var i=0,p=j.length;i<p;i++){this.add(j[i]);}d.on('destroy',function(){t.destroy();});$('body').on('keyup.'+this.s.namespace,function(e){if(!b.activeElement||b.activeElement===b.body){var q=String.fromCharCode(e.keyCode).toLowerCase();if(t.s.listenKeys.toLowerCase().indexOf(q)!==-1){t._keypress(q,e);}}});},_addKey:function(a){if(a.key){this.s.listenKeys+=$.isPlainObject(a.key)?a.key.key:a.key;}},_draw:function(a,d){if(!a){a=this.dom.container;d=this.s.buttons;}a.children().detach();for(var i=0,e=d.length;i<e;i++){a.append(d[i].inserter);if(d[i].buttons&&d[i].buttons.length){this._draw(d[i].collection,d[i].buttons);}}},_expandButton:function(a,d,e,j){var p=this.s.dt;var q=0;var r=!$.isArray(d)?[d]:d;for(var i=0,s=r.length;i<s;i++){var t=this._resolveExtends(r[i]);if(!t){continue;}if($.isArray(t)){this._expandButton(a,t,e,j);continue;}var v=this._buildButton(t,e);if(!v){continue;}if(j!==u){a.splice(j,0,v);j++;}else{a.push(v);}if(v.conf.buttons){var x=this.c.dom.collection;v.collection=$('<'+x.tag+'/>').addClass(x.className).attr('role','menu');v.conf._collection=v.collection;this._expandButton(v.buttons,v.conf.buttons,true,j);}if(t.init){t.init.call(p.button(v.node),p,$(v.node),t);}q++;}},_buildButton:function(a,i){var d=this.c.dom.button;var j=this.c.dom.buttonLiner;var p=this.c.dom.collection;var q=this.s.dt;var t=function(e){return typeof e==='function'?e(q,s,a):e;};if(i&&p.button){d=p.button;}if(i&&p.buttonLiner){j=p.buttonLiner;}if(a.available&&!a.available(q,a)){return false;}var r=function(e,q,s,a){a.action.call(q.button(s),e,q,s,a);$(q.table().node()).triggerHandler('buttons-action.dt',[q.button(s),q,s,a]);};var s=$('<'+d.tag+'/>').addClass(d.className).attr('tabindex',this.s.dt.settings()[0].iTabIndex).attr('aria-controls',this.s.dt.table().node().id).on('click.dtb',function(e){e.preventDefault();if(!s.hasClass(d.disabled)&&a.action){r(e,q,s,a);}s.blur();}).on('keyup.dtb',function(e){if(e.keyCode===13){if(!s.hasClass(d.disabled)&&a.action){r(e,q,s,a);}}});if(d.tag.toLowerCase()==='a'){s.attr('href','#');}if(j.tag){var v=$('<'+j.tag+'/>').html(t(a.text)).addClass(j.className);if(j.tag.toLowerCase()==='a'){v.attr('href','#');}s.append(v);}else{s.html(t(a.text));}if(a.enabled===false){s.addClass(d.disabled);}if(a.className){s.addClass(a.className);}if(a.titleAttr){s.attr('title',t(a.titleAttr));}if(!a.namespace){a.namespace='.dt-button-'+(c++);}var x=this.c.dom.buttonContainer;var y;if(x&&x.tag){y=$('<'+x.tag+'/>').addClass(x.className).append(s);}else{y=s;}this._addKey(a);return{conf:a,node:s.get(0),inserter:y,buttons:[],inCollection:i,collection:null};},_nodeToButton:function(a,d){if(!d){d=this.s.buttons;}for(var i=0,e=d.length;i<e;i++){if(d[i].node===a){return d[i];}if(d[i].buttons.length){var r=this._nodeToButton(a,d[i].buttons);if(r){return r;}}}},_nodeToHost:function(a,d){if(!d){d=this.s.buttons;}for(var i=0,e=d.length;i<e;i++){if(d[i].node===a){return d;}if(d[i].buttons.length){var r=this._nodeToHost(a,d[i].buttons);if(r){return r;}}}},_keypress:function(d,e){var r=function(a,i){if(!a.key){return;}if(a.key===d){$(i).click();}else if($.isPlainObject(a.key)){if(a.key.key!==d){return;}if(a.key.shiftKey&&!e.shiftKey){return;}if(a.key.altKey&&!e.altKey){return;}if(a.key.ctrlKey&&!e.ctrlKey){return;}if(a.key.metaKey&&!e.metaKey){return;}$(i).click();}};var j=function(a){for(var i=0,p=a.length;i<p;i++){r(a[i].conf,a[i].node);if(a[i].buttons.length){j(a[i].buttons);}}};j(this.s.buttons);},_removeKey:function(d){if(d.key){var e=$.isPlainObject(d.key)?d.key.key:d.key;var a=this.s.listenKeys.split('');var i=$.inArray(e,a);a.splice(i,1);this.s.listenKeys=a.join('');}},_resolveExtends:function(a){var d=this.s.dt;var i,e;var t=function(s){var v=0;while(!$.isPlainObject(s)&&!$.isArray(s)){if(s===u){return;}if(typeof s==='function'){s=s(d,a);if(!s){return false;}}else if(typeof s==='string'){if(!f[s]){throw'Unknown button type: '+s;}s=f[s];}v++;if(v>30){throw'Buttons: Too many iterations';}}return $.isArray(s)?s:$.extend({},s);};a=t(a);while(a&&a.extend){if(!f[a.extend]){throw'Cannot extend unknown button type: '+a.extend;}var j=t(f[a.extend]);if($.isArray(j)){return j;}else if(!j){return false;}var p=j.className;a=$.extend({},j,a);if(p&&a.className!==p){a.className=p+' '+a.className;}var q=a.postfixButtons;if(q){if(!a.buttons){a.buttons=[];}for(i=0,e=q.length;i<e;i++){a.buttons.push(q[i]);}a.postfixButtons=null;}var r=a.prefixButtons;if(r){if(!a.buttons){a.buttons=[];}for(i=0,e=r.length;i<e;i++){a.buttons.splice(i,0,r[i]);}a.prefixButtons=null;}a.extend=j.extend;}return a;}});B.background=function(s,a,d){if(d===u){d=400;}if(s){$('<div/>').addClass(a).css('display','none').appendTo('body').fadeIn(d);}else{$('body > div.'+a).fadeOut(d,function(){$(this).removeClass(a).remove();});}};B.instanceSelector=function(a,d){if(!a){return $.map(d,function(v){return v.inst;});}var r=[];var e=$.map(d,function(v){return v.name;});var p=function(j){if($.isArray(j)){for(var i=0,q=j.length;i<q;i++){p(j[i]);}return;}if(typeof j==='string'){if(j.indexOf(',')!==-1){p(j.split(','));}else{var s=$.inArray($.trim(j),e);if(s!==-1){r.push(d[s].inst);}}}else if(typeof j==='number'){r.push(d[j].inst);}};p(a);return r;};B.buttonSelector=function(d,s){var r=[];var e=function(a,t,v){var x;var y;for(var i=0,p=t.length;i<p;i++){x=t[i];if(x){y=v!==u?v+i:i+'';a.push({node:x.node,name:x.conf.name,idx:y});if(x.buttons){e(a,x.buttons,y+'-');}}}};var j=function(s,q){var i,p;var t=[];e(t,q.s.buttons);var x=$.map(t,function(v){return v.node;});if($.isArray(s)||s instanceof $){for(i=0,p=s.length;i<p;i++){j(s[i],q);}return;}if(s===null||s===u||s==='*'){for(i=0,p=t.length;i<p;i++){r.push({inst:q,node:t[i].node});}}else if(typeof s==='number'){r.push({inst:q,node:q.s.buttons[s].node});}else if(typeof s==='string'){if(s.indexOf(',')!==-1){var a=s.split(',');for(i=0,p=a.length;i<p;i++){j($.trim(a[i]),q);}}else if(s.match(/^\d+(\-\d+)*$/)){var y=$.map(t,function(v){return v.idx;});r.push({inst:q,node:t[$.inArray(s,y)].node});}else if(s.indexOf(':name')!==-1){var z=s.replace(':name','');for(i=0,p=t.length;i<p;i++){if(t[i].name===z){r.push({inst:q,node:t[i].node});}}}else{$(x).filter(s).each(function(){r.push({inst:q,node:this});});}}else if(typeof s==='object'&&s.nodeName){var A=$.inArray(s,x);if(A!==-1){r.push({inst:q,node:x[A]});}}};for(var i=0,p=d.length;i<p;i++){var q=d[i];j(s,q);}return r;};B.defaults={buttons:['copy','excel','csv','pdf','print'],name:'main',tabIndex:0,dom:{container:{tag:'div',className:'dt-buttons'},collection:{tag:'div',className:'dt-button-collection'},button:{tag:'a',className:'dt-button',active:'active',disabled:'disabled'},buttonLiner:{tag:'span',className:''}}};B.version='1.4.0';$.extend(f,{collection:{text:function(d){return d.i18n('buttons.collection','Collection');},className:'buttons-collection',action:function(e,d,a,i){var j=a;var p=j.offset();var t=$(d.table().container());var q=false;if($('div.dt-button-background').length){q=$('.dt-button-collection').offset();$('body').trigger('click.dtb-collection');}i._collection.addClass(i.collectionLayout).css('display','none').appendTo('body').fadeIn(i.fade);var r=i._collection.css('position');if(q&&r==='absolute'){i._collection.css({top:q.top,left:q.left});}else if(r==='absolute'){i._collection.css({top:p.top+j.outerHeight(),left:p.left});var s=t.offset().top+t.height();var v=p.top+j.outerHeight()+i._collection.outerHeight();var x=v-s;var y=p.top-i._collection.outerHeight();var z=t.offset().top;var A=z-y;if(x>A){i._collection.css('top',p.top-i._collection.outerHeight()-5);}var C=p.left+i._collection.outerWidth();var E=t.offset().left+t.width();if(C>E){i._collection.css('left',p.left-(C-E));}}else{var F=i._collection.height()/2;if(F>$(w).height()/2){F=$(w).height()/2;}i._collection.css('marginTop',F*-1);}if(i.background){B.background(true,i.backgroundClassName,i.fade);}setTimeout(function(){$('div.dt-button-background').on('click.dtb-collection',function(){});$('body').on('click.dtb-collection',function(e){var G=$.fn.addBack?'addBack':'andSelf';if(!$(e.target).parents()[G]().filter(i._collection).length){i._collection.fadeOut(i.fade,function(){i._collection.detach();});$('div.dt-button-background').off('click.dtb-collection');B.background(false,i.backgroundClassName,i.fade);$('body').off('click.dtb-collection');d.off('buttons-action.b-internal');}});},10);if(i.autoClose){d.on('buttons-action.b-internal',function(){$('div.dt-button-background').click();});}},background:true,collectionLayout:'',backgroundClassName:'dt-button-background',autoClose:false,fade:400},copy:function(d,a){if(f.copyHtml5){return'copyHtml5';}if(f.copyFlash&&f.copyFlash.available(d,a)){return'copyFlash';}},csv:function(d,a){if(f.csvHtml5&&f.csvHtml5.available(d,a)){return'csvHtml5';}if(f.csvFlash&&f.csvFlash.available(d,a)){return'csvFlash';}},excel:function(d,a){if(f.excelHtml5&&f.excelHtml5.available(d,a)){return'excelHtml5';}if(f.excelFlash&&f.excelFlash.available(d,a)){return'excelFlash';}},pdf:function(d,a){if(f.pdfHtml5&&f.pdfHtml5.available(d,a)){return'pdfHtml5';}if(f.pdfFlash&&f.pdfFlash.available(d,a)){return'pdfFlash';}},pageLength:function(d){var a=d.settings()[0].aLengthMenu;var v=$.isArray(a[0])?a[0]:a;var j=$.isArray(a[0])?a[1]:a;var t=function(d){return d.i18n('buttons.pageLength',{"-1":'Show all rows',_:'Show %d rows'},d.page.len());};return{extend:'collection',text:t,className:'buttons-page-length',autoClose:true,buttons:$.map(v,function(p,i){return{text:j[i],className:'button-page-length',action:function(e,d){d.page.len(p).draw();},init:function(d,e,q){var r=this;var s=function(){r.active(d.page.len()===p);};d.on('length.dt'+q.namespace,s);s();},destroy:function(d,e,q){d.off('length.dt'+q.namespace);}};}),init:function(d,e,i){var p=this;d.on('length.dt'+i.namespace,function(){p.text(t(d));});},destroy:function(d,e,i){d.off('length.dt'+i.namespace);}};}});D.Api.register('buttons()',function(a,s){if(s===u){s=a;a=u;}this.selector.buttonGroup=a;var r=this.iterator(true,'table',function(d){if(d._buttons){return B.buttonSelector(B.instanceSelector(a,d._buttons),s);}},true);r._groupSelector=a;return r;});D.Api.register('button()',function(a,s){var d=this.buttons(a,s);if(d.length>1){d.splice(1,d.length);}return d;});D.Api.registerPlural('buttons().active()','button().active()',function(a){if(a===u){return this.map(function(s){return s.inst.active(s.node);});}return this.each(function(s){s.inst.active(s.node,a);});});D.Api.registerPlural('buttons().action()','button().action()',function(a){if(a===u){return this.map(function(s){return s.inst.action(s.node);});}return this.each(function(s){s.inst.action(s.node,a);});});D.Api.register(['buttons().enable()','button().enable()'],function(a){return this.each(function(s){s.inst.enable(s.node,a);});});D.Api.register(['buttons().disable()','button().disable()'],function(){return this.each(function(s){s.inst.disable(s.node);});});D.Api.registerPlural('buttons().nodes()','button().node()',function(){var j=$();$(this.each(function(s){j=j.add(s.inst.node(s.node));}));return j;});D.Api.registerPlural('buttons().processing()','button().processing()',function(a){if(a===u){return this.map(function(s){return s.inst.processing(s.node);});}return this.each(function(s){s.inst.processing(s.node,a);});});D.Api.registerPlural('buttons().text()','button().text()',function(a){if(a===u){return this.map(function(s){return s.inst.text(s.node);});}return this.each(function(s){s.inst.text(s.node,a);});});D.Api.registerPlural('buttons().trigger()','button().trigger()',function(){return this.each(function(s){s.inst.node(s.node).trigger('click');});});D.Api.registerPlural('buttons().containers()','buttons().container()',function(){var j=$();var a=this._groupSelector;this.iterator(true,'table',function(d){if(d._buttons){var e=B.instanceSelector(a,d._buttons);for(var i=0,p=e.length;i<p;i++){j=j.add(e[i].container());}}});return j;});D.Api.register('button().add()',function(i,a){var d=this.context;if(d.length){var e=B.instanceSelector(this._groupSelector,d[0]._buttons);if(e.length){e[0].add(a,i);}}return this.button(this._groupSelector,i);});D.Api.register('buttons().destroy()',function(){this.pluck('inst').unique().each(function(i){i.destroy();});return this;});D.Api.registerPlural('buttons().remove()','buttons().remove()',function(){this.each(function(s){s.inst.remove(s.node);});return this;});var g;D.Api.register('buttons.info()',function(t,a,d){var e=this;if(t===false){$('#datatables_buttons_info').fadeOut(function(){$(this).remove();});clearTimeout(g);g=null;return this;}if(g){clearTimeout(g);}if($('#datatables_buttons_info').length){$('#datatables_buttons_info').remove();}t=t?'<h2>'+t+'</h2>':'';$('<div id="datatables_buttons_info" class="dt-button-info"/>').html(t).append($('<div/>')[typeof a==='string'?'html':'append'](a)).css('display','none').appendTo('body').fadeIn();if(d!==u&&d!==0){g=setTimeout(function(){e.buttons.info(false);},d);}return this;});D.Api.register('buttons.exportData()',function(a){if(this.context.length){return o(new D.Api(this.context[0]),a);}});D.Api.register('buttons.exportInfo()',function(a){if(!a){a={};}return{filename:h(a),title:l(a),messageTop:m(this,a.messageTop||a.message,'top'),messageBottom:m(this,a.messageBottom,'bottom')};});var h=function(a){var d=a.filename==='*'&&a.title!=='*'&&a.title!==u?a.title:a.filename;if(typeof d==='function'){d=d();}if(d===u||d===null){return null;}if(d.indexOf('*')!==-1){d=$.trim(d.replace('*',$('title').text()));}d=d.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,"");var e=k(a.extension);if(!e){e='';}return d+e;};var k=function(a){if(a===null||a===u){return null;}else if(typeof a==='function'){return a();}return a;};var l=function(a){var t=k(a.title);return t===null?null:t.indexOf('*')!==-1?t.replace('*',$('title').text()||'Exported data'):t;};var m=function(d,a,p){var e=k(a);if(e===null){return null;}var i=$('caption',d.table().container()).eq(0);if(e==='*'){var s=i.css('caption-side');if(s!==p){return null;}return i.length?i.text():'';}return e;};var n=$('<textarea/>')[0];var o=function(a,e){var p=$.extend(true,{},{rows:null,columns:'',modifier:{search:'applied',order:'applied'},orthogonal:'display',stripHtml:true,stripNewlines:true,decodeEntities:true,trim:true,format:{header:function(d){return s(d);},footer:function(d){return s(d);},body:function(d){return s(d);}}},e);var s=function(d){if(typeof d!=='string'){return d;}d=d.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'');if(p.stripHtml){d=d.replace(/<[^>]*>/g,'');}if(p.trim){d=d.replace(/^\s+|\s+$/g,'');}if(p.stripNewlines){d=d.replace(/\n/g,' ');}if(p.decodeEntities){n.innerHTML=d;d=n.value;}return d;};var q=a.columns(p.columns).indexes().map(function(d){var H=a.column(d).header();return p.format.header(H.innerHTML,d,H);}).toArray();var r=a.table().footer()?a.columns(p.columns).indexes().map(function(d){var H=a.column(d).footer();return p.format.footer(H?H.innerHTML:'',d,H);}).toArray():null;var t=a.rows(p.rows,p.modifier).indexes().toArray();var v=a.cells(t,p.columns);var x=v.render(p.orthogonal).toArray();var y=v.nodes().toArray();var z=q.length;var A=z>0?x.length/z:0;var C=new Array(A);var E=0;for(var i=0,F=A;i<F;i++){var G=new Array(z);for(var j=0;j<z;j++){G[j]=p.format.body(x[E],i,j,y[E]);E++;}C[i]=G;}return{header:q,footer:r,body:C};};$.fn.dataTable.Buttons=B;$.fn.DataTable.Buttons=B;$(b).on('init.dt plugin-init.dt',function(e,s){if(e.namespace!=='dt'){return;}var a=s.oInit.buttons||D.defaults.buttons;if(a&&!s._buttons){new B(s,a).container();}});D.ext.feature.push({fnInit:function(s){var a=new D.Api(s);var d=a.init().buttons||D.defaults.buttons;return new B(a,d).container();},cFeature:"B"});return B;}));