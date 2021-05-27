sap.ui.define(["sap/base/util/LoaderExtensions", "sap/base/Log"], function(LoaderExtensions, Log) {
	"use strict";

	var CHUNK_SIZE = 5;
	var CHUNK_INTERVAL = 1000;

	var FilePreload = {
		/**
		 * Checks if a given module is already loaded by the UI5 loader.
		 *
		 * @param {string} sPath path of the module
		 * @returns {boolean} true or false
		 */
		_isModuleLoaded: function(sPath) {
			var aSegments = sPath.split("/"),
				oContext = window,
				i = 0;

			while (i < aSegments.length && oContext) {
				oContext = oContext[aSegments[i]];
				i++;
			}

			return oContext !== undefined;
		},

		/**
		 * Loads a collection of libraries.
		 *
		 * @param {Array} aLibraries array of libraiy names
		 * @returns {Promise} promise resolved once the libraries are loaded
		 */
		_loadLibraries: function(aLibraries) {
			return this._waitUntilHomeIsDisplayed().then(function() {
				return sap.ui.getCore().loadLibraries(aLibraries);
			});
		},

		/**
		 * Loads a collaction of modules using a chunked approach.
		 *
		 * @param {Array} aModuleList list of (modules) paths
		 * @returns {Promise} promise resolved when all chunks are loaded
		 */
		_loadModulesByChunks: function(aModuleList) {
			// Remove modules that are already loaded
			var i;
			for (i = aModuleList.length - 1; i >= 0; i--) {
				var sModuleName = aModuleList[i];
				if (this._isModuleLoaded(sModuleName)) {
					aModuleList.splice(i, 1);
				}
			}

			// Create chunks
			var aTotalSize = aModuleList.length,
				chunkCount = Math.ceil(aTotalSize / this.iChunkSize);

			if (chunkCount === 0) {
				return Promise.resolve();
			} else {
				var aChunks = [],
					that = this;
				for (i = 0; i < chunkCount; i++) {
					aChunks.push(aModuleList.slice(i * this.iChunkSize, i * this.iChunkSize + this.iChunkSize));
				}

				// Start the chunk load
				return new Promise(function(resolve, reject) {
					that._processChunk(aChunks, 0, resolve);
				});
			}
		},

		/**
		 * Loads a file chunk.
		 *
		 * @param {Array} aChunks all file chunks
		 * @param {number} iChunkIndex file chunk to load
		 * @param {Function} fnResolve resolve function to be called when all chunks are loaded
		 */
		_processChunk: function(aChunks, iChunkIndex, fnResolve) {
			var that = this;

			if (iChunkIndex >= aChunks.length) {
				fnResolve();
			} else {
				var aChunkData = aChunks[iChunkIndex];
				that._waitUntilHomeIsDisplayed()
					.then(function() {
						sap.ui.require(
							aChunkData,
							function(oEvent) {
								Log.debug(
									"sap.fe.plugins.preload: Chunk [" + iChunkIndex + "] loaded (" + JSON.stringify(aChunkData) + ")"
								);
								// Load next chunk after delay
								setTimeout(function() {
									that._processChunk(aChunks, iChunkIndex + 1, fnResolve);
								}, that.iChunkInterval);
							},
							function() {
								Log.error("sap.fe.plugins.preload: failed to load library chunk: " + JSON.stringify(aChunkData));
								// Load next chunk after delay
								setTimeout(function() {
									that._processChunk(aChunks, iChunkIndex + 1, fnResolve);
								}, that.iChunkInterval);
							}
						);
					})
					.catch(function() {
						// Unknown error, this shouldn't happen
						Log.error("sap.fe.plugins.preload: unknown error - Aborting");
						fnResolve();
					});
			}
		},

		/**
		 * Waits until the FLP home page is displayed on the screen.
		 *
		 * @returns {Promise} resolved when the Home page is displayed
		 */
		_waitUntilHomeIsDisplayed: function() {
			var fnResolve;

			function onAppLoaded() {
				var ALFService = sap.ushell.Container.getService("AppLifeCycle"),
					bIsHomePage = ALFService.getCurrentApplication().homePage;

				if (bIsHomePage) {
					// We're back on the home page, we can resume _processChunks
					ALFService.detachAppLoaded(onAppLoaded);
					Log.info("sap.fe.plugins.preload: preload resumed");

					fnResolve();
				}
			}

			if (sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().homePage === false) {
				// An app has been loaded --> return a Promise that will be resolved when the home page is displayed again
				Log.info("sap.fe.plugins.preload: preload paused");
				return new Promise(function(resolve, reject) {
					sap.ushell.Container.getService("AppLifeCycle").attachAppLoaded(onAppLoaded);
					fnResolve = resolve;
				});
			} else {
				return Promise.resolve();
			}
		},

		/**
		 * Starts the preload process.
		 *
		 * @param {number} iChunkSize size of the chunks (number of files loaded at the same time)
		 * @param {number} iChunkInterval interval (in ms) between 2 chunk load
		 * @returns {Promise} promise resolved when all files have been loaded
		 */
		start: function(iChunkSize, iChunkInterval) {
			this.iChunkSize = iChunkSize ? iChunkSize : CHUNK_SIZE;
			this.iChunkInterval = iChunkInterval ? iChunkInterval : CHUNK_INTERVAL;
			Log.info("sap.fe.plugins.preload: preload starting");

			var aPreloadList = LoaderExtensions.loadResource("/sap/fe/plugins/preload/data/components.json"),
				aLibraries = LoaderExtensions.loadResource("/sap/fe/plugins/preload/data/libraries.json"),
				that = this;

			return this._loadLibraries(aLibraries)
				.then(function() {
					return that._loadModulesByChunks(aPreloadList);
				})
				.then(function() {
					Log.info("sap.fe.plugins.preload: preload finished");
				})
				.catch(function(oError) {
					Log.error("sap.fe.plugins.preload: Error while preloading data");
				});
		}
	};

	return FilePreload;
});
