/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./DragDropBase"],function(D){"use strict";var a=D.extend("sap.ui.core.dnd.DragInfo",{metadata:{library:"sap.ui.core",interfaces:["sap.ui.core.dnd.IDragInfo"],properties:{sourceAggregation:{type:"string",defaultValue:null}},events:{dragStart:{allowPreventDefault:true},dragEnd:{}}}});a.Mixin=function(){this.isDraggable=function(c){if(!this.getEnabled()){return false;}var d=this.getParent();if(!d){return false;}var s=this.getSourceAggregation();if(!this.checkMetadata(d,s,"draggable")){return false;}if(d===c&&!s){return true;}if(c.getParent()===d&&s===c.sParentAggregationName){return true;}return false;};this.fireDragStart=function(e){if(!e||!e.dragSession){return;}var d=e.dragSession;return this.fireEvent("dragStart",{dragSession:d,browserEvent:e.originalEvent,target:d.getDragControl()},true);};this.fireDragEnd=function(e){if(!e||!e.dragSession){return;}var d=e.dragSession;return this.fireEvent("dragEnd",{dragSession:d,browserEvent:e.originalEvent,target:d.getDragControl()});};};a.Mixin.apply(a.prototype);return a;});
