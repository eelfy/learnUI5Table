/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved
 */
/*global sap:false, jQuery:false, sinon */

sap.ui.define([], function(){
	'use strict';

	function getSavedPaths() {
		return {
			paths: [{
				AnalysisPath: "5347CB9377CD1E59E10000000A445B6D",
				AnalysisPathName: "TestPath",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 2
				},
				CreationUtcDateTime: "2014-04-13T12:30:14.358Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "5347BF0277CD1E59E10000000A445B6D",
				AnalysisPathName: "qetest",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "RevenueandReceivablesoverTime",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "AgingofOpenReceivables",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 2
				},
				CreationUtcDateTime: "2014-04-11T15:37:56.442Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "53444D6EDC2C1E59E10000000A445B6D",
				AnalysisPathName: "t1",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 0
				},
				CreationUtcDateTime: "2014-04-09T09:06:02.395Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "53443AA3DC2C1E59E10000000A445B6D",
				AnalysisPathName: "test toggling",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 0
				},
				CreationUtcDateTime: "2014-04-09T06:15:02.010Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "53443826DC2C1E59E10000000A445B6D",
				AnalysisPathName: "sorttest",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 2
				},
				CreationUtcDateTime: "2014-04-09T05:49:29.966Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "533B002FC296076EE10000000A445B6D",
				AnalysisPathName: "selTest",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 1
				},
				CreationUtcDateTime: "2014-04-08T07:04:59.773Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "533B0025C296076EE10000000A445B6D",
				AnalysisPathName: "printtest",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 2
				},
				CreationUtcDateTime: "2014-04-08T07:04:39.764Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "533BD230C296076EE10000000A445B6D",
				AnalysisPathName: "test1",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}, {
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 4
				},
				CreationUtcDateTime: "2014-04-07T04:23:56.608Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}, {
				AnalysisPath: "533BD217C296076EE10000000A445B6D",
				AnalysisPathName: "sortTest",
				StructuredAnalysisPath: {
					steps: [{
						stepId: "stepTemplate1",
						selectedRepresentationId: "representationId1"
					}],
					indexOfActiveStep: 0
				},
				CreationUtcDateTime: "2014-04-07T04:22:11.829Z",
				LastChangeUTCDateTime: "/Date(1398852805307)/"
			}]
		};
	}

	sap.apf.testhelper.odata.getSavedPaths = getSavedPaths;
	return {
		getSavedPaths: getSavedPaths
	};
}, true /*GLOBAL_EXPORT*/);
