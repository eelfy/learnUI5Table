/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides object sap.ui.vk.matai.MataiLoader.
sap.ui.define([
	"sap/base/Log",
	"sap/ui/base/ManagedObject",
	"../getResourceBundle",
	"../threejs/SceneBuilder",
	"../svg/SceneBuilder",
	"../helpers/WorkerScriptLoader",
	"../DownloadManager"
], function(
	Log,
	ManagedObject,
	getResourceBundle,
	SceneBuilderThreeJs,
	SceneBuilderSVG,
	WorkerScriptLoader,
	DownloadManager
) {
	"use strict";

	var ProgressPhase = {
		FinishedTree: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_TREE"),
		LoadingGeometries: getResourceBundle().getText("SCENE_CONTEXT_LOADING_GEOMETRIES"),
		LoadingTextures: getResourceBundle().getText("SCENE_CONTEXT_LOADING_TEXTURES"),
		LoadingModelViews: getResourceBundle().getText("SCENE_CONTEXT_LOADING_MODEL_VIEWS")
	};

	var MataiLoader = ManagedObject.extend("sap.ui.vk.matai.MataiLoader", {
		metadata: {
			events: {
				contentChangesProgress: {
					parameters: {
						source: "any",
						phase: "string",
						percent: "float"
					}
				},
				contentLoadingFinished: {
					parameters: {
						source: "any",
						node: "any"
					}
				}
			}
		}
	});

	function updateProgress(sceneBuilder, phase, count) {
		var progress = sceneBuilder._progress;
		progress.phase = phase;
		progress.count = count;
		var percentage = 40 + 60 * (progress.totalCount ? progress.count / progress.totalCount : 1);
		// console.log(progress.phase, percentage, progress.count, progress.totalCount);

		sceneBuilder._loader.fireContentChangesProgress({
			source: sceneBuilder._contentResource.getSource(),
			phase: phase,
			percentage: Math.min(percentage, 100)
		});
	}

	var getWorker = (function() {
		var promise;
		return function() {
			return promise || (promise = new Promise(function(resolve, reject) {
				var mataiLib = "sap/ui/vk/ve/matai.js";
				if (sap.ui.Device.browser.internet_explorer) {
					// In case of IE we will load asmjs version of Matai as IE does not support web assemblies
					mataiLib = "sap/ui/vk/ve/matai_asm.js";
				}
				var worker = WorkerScriptLoader.loadScript(
					"sap/ui/vk/matai/MataiLoaderWorker.js",
					[ mataiLib ]
				);

				worker.onmessage = function(event) {
					var data = event.data;
					if (data.ready) {
						resolve(this);
					} else {
						// console.log(data.method, data.args);
						var sceneBuilder = this._sceneBuilders[ data.sceneBuilderId ];
						try {
							sceneBuilder[ data.method ].apply(sceneBuilder, data.args);
						} catch (e) {
							Log.error("SceneBuilder." + data.method + "()", e);
						}

						switch (data.method) {
							case "setScene":
								var info = data.args[ 0 ];
								sceneBuilder._progress.totalCount = info.meshCount + info.imageCount + info.modelViewCount;
								updateProgress(sceneBuilder, ProgressPhase.FinishedTree, 0);
								break;
							case "setGeometry":
								updateProgress(sceneBuilder, ProgressPhase.LoadingGeometries, sceneBuilder._progress.count + 1);
								break;
							case "createImage":
								updateProgress(sceneBuilder, ProgressPhase.LoadingTextures, sceneBuilder._progress.count + 1);
								break;
							case "createThumbnail":
								updateProgress(sceneBuilder, ProgressPhase.LoadingModelViews, sceneBuilder._progress.count + 1);
								break;
							default: break;
						}
					}
				};
				worker.onerror = function(err) {
					reject(err);
				};

				var wasmDirectory = WorkerScriptLoader.absoluteUri("sap/ui/vk/ve").toString() + "/";
				worker.postMessage({ method: "createRuntime", scriptDirectory: wasmDirectory });
			}));
		};
	})();

	function loadContent(loader, buffer, url, parentNode, contentResource, resolve, reject) {
		getWorker().then(
			// onFulfilled
			function(worker) {
				worker.onerror = function(event) {
					Log.error("Error in WebWorker", event);
					reject(getResourceBundle().getText("LOADER_ERRORREADINGFILE"));
				};

				var sceneBuilder = new (parentNode.isObject3D ? SceneBuilderThreeJs : SceneBuilderSVG)(parentNode, contentResource, resolve, reject);
				sceneBuilder._loader = loader;
				sceneBuilder._progress = {};

				worker._sceneBuilders = worker._sceneBuilders || [];
				sceneBuilder._id = worker._sceneBuilders.length;
				worker._sceneBuilders.push(sceneBuilder);

				worker.postMessage(
					{
						method: "loadSceneFromArrayBuffer",
						sceneBuilderId: sceneBuilder._id,
						buffer: buffer,
						fileName: url,
						sourceLocation: "remote"
					},
					[ buffer ]
				);
			},
			// onRejected
			function(reason) {
				reject(reason);
			}
		);
	}

	MataiLoader.prototype.load = function(parentNode, contentResource) {
		var that = this;
		return new Promise(function(resolve, reject) {
			// download contentResource.source
			// pass it to worker
			if (typeof contentResource.getSource() === "string") {
				var url = contentResource.getSource();
				new DownloadManager([ url ])
					.attachItemSucceeded(function(event) {
						var source = event.getParameter("source");
						var response = event.getParameter("response");

						loadContent(that, response, source, parentNode, contentResource, resolve, reject);
					}, this)
					.attachItemFailed(function(event) {
						var error = event.getParameter("statusText");
						if (error == "") {
							error = getResourceBundle().getText("VIEWER_SOURCE_FAILED_TO_DOWNLOAD_CAUSE");
						}
						reject(error);
					}, this)
					.start();
			} else if (contentResource.getSource() instanceof File) {
				var reader = new FileReader();
				reader.onload = function(e) {
					loadContent(that, e.target.result, contentResource.getSource().name, parentNode, contentResource, resolve, reject);
				};
				reader.onerror = function(err) {
					reject(err);
				};
				reader.readAsArrayBuffer(contentResource.getSource());
			}
		});
	};

	return MataiLoader;
});
