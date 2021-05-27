import { DataFieldAbstractTypes } from "@sap-ux/vocabularies-types";
import { getStableIdPartFromDataField } from "../../helpers/StableIdHelper";

/**
 * The KeyHelper is used for dealing with Key in the concern of the flexible programming model
 */
export class KeyHelper {
	/**
	 * Returns a generated key for DataFields to be used in the flexible programming model.
	 *
	 * @param {DataFieldAbstractTypes} oDataField dataField to generate the key for
	 * @returns {string} Returns a through StableIdHelper generated key
	 */
	static generateKeyFromDataField(oDataField: DataFieldAbstractTypes): string {
		return getStableIdPartFromDataField(oDataField)!;
	}

	/**
	 * Throws a Error if any other character then aA-zZ, 0-9, ':', '_' or '-' is used.
	 *
	 * @param {string} key string to check validity on
	 */
	static validateKey(key: string) {
		const pattern = /[^A-Za-z0-9_\-:]/;
		if (pattern.exec(key)) {
			throw new Error("Invalid key: " + key + " - only 'A-Za-z0-9_-:' are allowed");
		}
	}

	/**
	 * Returns the key for a selection field required for adaption.
	 *
	 * @param fullPropertyPath the full property path (without entityType)
	 * @returns {string} the key of the selection field
	 */
	static getSelectionFieldKeyFromPath(fullPropertyPath: string) {
		return fullPropertyPath.replace(/(\*|\+)?\//g, "::");
	}

	/**
	 * Returns the path for a selection field required for adaption.
	 *
	 * @param selectionFieldKey the key of the selection field
	 * @returns {string} the full property path
	 */
	static getPathFromSelectionFieldKey(selectionFieldKey: string) {
		return selectionFieldKey.replace(/::\//g, "/");
	}
}
