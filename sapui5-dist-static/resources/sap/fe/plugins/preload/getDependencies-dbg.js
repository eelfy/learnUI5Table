/* eslint-disable no-console */
var fs = require("fs");

var XMLTemplateKeyWords = ["template", "FragmentDefinition"];

function pReaddir(dir) {
	"use strict";
	return new Promise(function(resolve, reject) {
		fs.readdir(dir, { withFileTypes: true }, function(err, items) {
			resolve(items);
		});
	});
}
function pWriteFile(sFileName, sData, oOption) {
	"use strict";
	return new Promise(function(resolve, reject) {
		fs.writeFile(sFileName, sData, oOption, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}
function pReadFile(sFile, options) {
	"use strict";
	return new Promise(function(resolve, reject) {
		fs.readFile(sFile, options, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

//list reccursively all files from a folder
function getFiles(dir) {
	"use strict";

	return pReaddir(dir, { withFileTypes: true })
		.then(function(items) {
			if (items) {
				var pAllFiles = [];
				items.forEach(function(item) {
					if (item.isDirectory()) {
						pAllFiles = pAllFiles.concat(getFiles(dir + "/" + item.name));
					} else {
						pAllFiles.push(Promise.resolve(dir + "/" + item.name));
					}
				});
				return Promise.all(pAllFiles);
			} else {
				return [];
			}
		})
		.then(function(items) {
			var afiles = [];
			items.forEach(function(item) {
				afiles = afiles.concat(item);
			});

			return afiles;
		});
}

//retrieve the libraries from a definition file and store it in a Map
function getLibrariesInDir(sDirectoryPath, mLibrairies) {
	"use strict";

	var sLibFileName = sDirectoryPath + "/.library";

	return pReadFile(sLibFileName, "utf8").then(function(sContent) {
		sContent.split("\n").forEach(function(sLine) {
			var aRes = sLine.match("<libraryName>(.*)</libraryName>");
			if (aRes !== null) {
				mLibrairies[aRes[1]] = "";
			}
		});
	});
}

// addJsFile add JS files into a Map
function addJsFile(file, oComponents) {
	"use strict";
	var sFileName = file.replace(/\\/g, "/");
	if ((sFileName.endsWith(".js") || sFileName.endsWith(".ts")) && sFileName.indexOf("library.js") === -1) {
		var sComponent = sFileName.substring(sFileName.indexOf("src/") + 4).replace(/\.[jt]s$/, "");
		oComponents[sComponent] = "";

		if (sFileName.endsWith(".js")) {
			return pReadFile(sFileName, "utf8").then(function(sJSCode) {
				process.stdout.write("Processing JS/TS file :" + file + "\n");
				var aModules = sJSCode.match(/sap.ui.define\(\s*\[([^\]]*)\]/);
				if (aModules) {
					var aModuleNames = aModules[1].split(",");
					aModuleNames.forEach(function(sName) {
						if (sName) {
							var a = sName.match(/"([^"]*)"/);
							if (a && a[1].indexOf(".") < 0) {
								process.stdout.write("\tComponent :" + a[1] + "\n");
								oComponents[a[1]] = "";
							}
						}
					});
				}
			});
		}
	}

	return null;
}

// addFragmentFile adds fragments files into a Map
function addFragmentFile(file, aFragmentFiles) {
	"use strict";
	var sFileName = file.replace(/\\/g, "/");
	if (sFileName.endsWith("fragment.xml")) {
		var sFragmentFileName = sFileName.substring(sFileName.indexOf("src/") + 4).replace(".fragment.xml", "");
		aFragmentFiles.push(sFragmentFileName);
	}
}

// getComponentsFromXMLView get all components from an XML view and store it into a Map
function getComponentsFromXMLView(file, oComponents) {
	"use strict";
	if (file.endsWith(".xml")) {
		return pReadFile(file, "utf8").then(function(sXml) {
			var aXmlSplitted = sXml.split("\n");
			process.stdout.write("Processing XML file :" + file + "\n");
			aXmlSplitted.forEach(function(sLine) {
				var aModule = sLine.match(/xmlns:{0,1}([a-zA-Z]*)="([a-zA-Z.]*)"/);
				if (aModule) {
					var sLibrary = aModule[2];
					var sLibraryAlias = aModule[1] ? aModule[1] + ":" : "";
					aXmlSplitted.forEach(function(sLine2) {
						var aComponent = sLine2.match("<" + sLibraryAlias + "([A-Z][a-zA-Z.]*)($| |>)");
						if (aComponent && XMLTemplateKeyWords.indexOf(aComponent[1]) === -1) {
							var sComponent = sLibrary.replace(/\./g, "/") + "/" + aComponent[1] + "";
							process.stdout.write("\tComponent :" + sComponent + "\n");
							if (sComponent.indexOf("sap/fe/macros/") === 0) {
								sComponent += ".metadata";
								//store components in the Map
								oComponents[sComponent] = sLibrary;
							} else if (sComponent.indexOf("sap/fe") === 0) {
								// Do Not store Components (sap/fe/xxx ) in the Map to prevent the loading
							} else {
								// other Component are stored in the Map
								oComponents[sComponent] = sLibrary;
							}
						}
					});
				}
			});
		});
	} else {
		return Promise.resolve();
	}
}

function main() {
	"use strict";

	if (process.argv.length < 3) {
		process.stdout.write("missing parameters. Please use --help\n");
		return;
	} else if (process.argv[2] === "--help") {
		process.stdout.write(
			"Usage: getDependencies <dir1> <dir2> ... , where <dirN> is a path to a directory to look for XML views and FE components (javascript files)\n"
		);
		return;
	}

	var aDirectories = [],
		sOutDir = "./",
		mComponents = { "sap/m/routing/router": "", "sap/f/routing/router": "", "sap/ui/model/odata/v4/ODataModel": "" },
		mLibrairies = { "sap.fe.templates": "" },
		aPromises = [],
		aFragmentFiles = [];

	for (var I = 2; I < process.argv.length; I++) {
		if (process.argv[I] !== "--out-dir") {
			aDirectories.push(process.argv[I]);
		} else if (I < process.argv.length - 1) {
			I++;
			sOutDir = process.argv[I];
		}
	}

	if (!sOutDir.endsWith("/")) {
		sOutDir += "/";
	}

	aDirectories.forEach(function(sDirectoryPath) {
		// Parse the .library file
		aPromises.push(getLibrariesInDir(sDirectoryPath, mLibrairies));

		// Parse other files in the directory
		aPromises.push(
			getFiles(sDirectoryPath).then(function(aFiles) {
				var aFilePromises = [];
				aFiles.forEach(function(file) {
					//for each XML views, add the nested component in the oComponents map
					aFilePromises.push(getComponentsFromXMLView(file, mComponents));
					//add js file in the oComponents map
					var jsPromise = addJsFile(file, mComponents);
					if (jsPromise) {
						aFilePromises.push(jsPromise);
					}
					addFragmentFile(file, aFragmentFiles);
				});

				return Promise.all(aFilePromises);
			})
		);
	});

	//Create output files
	Promise.all(aPromises)
		.then(function() {
			pWriteFile(sOutDir + "libraries.json", JSON.stringify(Object.keys(mLibrairies)), "utf-8");
			pWriteFile(sOutDir + "components.json", JSON.stringify(Object.keys(mComponents)), "utf-8");
			pWriteFile(sOutDir + "fragments.json", JSON.stringify(aFragmentFiles), "utf-8");
		})
		.catch(function(error) {
			process.stderr.write("Error (" + error.code + "): " + error.message + "\n");
		});
}

main();
