/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/ui/fl/changeHandler/MoveControls","sap/suite/ui/generic/template/changeHandler/generic/MoveElements"],function(U,A,M,a){"use strict";var b={};var I="com.sap.vocabularies.UI.v1.Identification";b.applyChange=function(c,C,p){M.applyChange(c,C,p);};b.revertChange=function(c,C,p){};b.completeChangeContent=function(c,s,p){s.custom={};s.custom.annotation=I;s.custom.fnGetAnnotationIndex=U.getIndexFromInstanceMetadataPath;s.custom.MoveConcreteElement=M;a.completeChangeContent(c,s,p);};return b;},true);
