// Formatters for the Object Page
import {
	and,
	ifElse,
	isEmpty,
	concat,
	annotationExpression,
	compileBinding,
	BindingExpression
} from "sap/fe/core/helpers/BindingExpression";
import { UI, Draft } from "sap/fe/core/converters/helpers/BindingHelper";
import { CommonUtils, ViewData } from "sap/fe/core";
import { HeaderInfoType } from "@sap-ux/vocabularies-types";
import { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import { addTextArrangementToBindingExpression, formatValueRecursively } from "sap/fe/macros/field/FieldTemplating";
import { DataFieldTypes } from "@sap-ux/vocabularies-types/dist/generated/UI";
import { isStickySessionSupported } from "sap/fe/core/templating/EntitySetHelper";

//```mermaid
// graph TD
// A[Object Page Title] -->|Get DataField Value| C{Evaluate Create Mode}
// C -->|In Create Mode| D{Is DataField Value empty}
// D -->|Yes| F{Is there a TypeName}
// F -->|Yes| G[Is there an custom title]
// G -->|Yes| G1[Show the custom title + 'TypeName']
// G -->|No| G2[Display the default title 'New + TypeName']
// F -->|No| H[Is there a custom title]
// H -->|Yes| I[Show the custom title]
// H -->|No| J[Show the default 'Unamned Object']
// D -->|No| E
// C -->|Not in create mode| E[Show DataField Value]
// ```
/**
 * Compute the title for the object page.
 *
 * @param oHeaderInfo the @UI.HeaderInfo annotation content
 * @param oViewData the view data object we're currently on
 * @param fullContextPath the full context path used to reach that object page
 * @returns the binding expression for the object page title
 */
export const getExpressionForTitle = function(
	oHeaderInfo: HeaderInfoType | undefined,
	oViewData: ViewData,
	fullContextPath: DataModelObjectPath
): BindingExpression<string> {
	const titleNoHeaderInfo = CommonUtils.getTranslatedText(
		"T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE_NO_HEADER_INFO",
		oViewData.resourceBundle,
		null,
		oViewData.entitySet
	);

	const titleWithHeaderInfo = CommonUtils.getTranslatedText(
		"T_ANNOTATION_HELPER_DEFAULT_OBJECT_PAGE_HEADER_TITLE",
		oViewData.resourceBundle,
		null,
		oViewData.entitySet
	);

	const titleValueExpression = formatValueRecursively(
		addTextArrangementToBindingExpression(annotationExpression((oHeaderInfo?.Title as DataFieldTypes)?.Value), fullContextPath),
		fullContextPath
	);

	return compileBinding(
		ifElse(
			// If Create Mode && Empty expression
			and(UI.IsCreateMode, titleValueExpression && isEmpty(titleValueExpression)),
			// If there is a TypeName defined, show the default title 'New + TypeName', otherwise show the custom title or the default 'Unnamed object'
			oHeaderInfo?.TypeName
				? concat(titleWithHeaderInfo, ": ", annotationExpression(oHeaderInfo.TypeName.toString()))
				: titleNoHeaderInfo,
			// Otherwise show the default expression
			titleValueExpression
		)
	);
};

/**
 * Retrieves the expression for the description of an object page.
 *
 * @param oHeaderInfo the @UI.HeaderInfo annotation content
 * @param fullContextPath the full context path used to reach that object page
 * @returns the binding string to bind
 */
export const getExpressionForDescription = function(
	oHeaderInfo: HeaderInfoType | undefined,
	fullContextPath: DataModelObjectPath
): BindingExpression<string> {
	return compileBinding(
		formatValueRecursively(
			addTextArrangementToBindingExpression(
				annotationExpression((oHeaderInfo?.Description as DataFieldTypes)?.Value),
				fullContextPath
			),
			fullContextPath
		)
	);
};

/**
 * Return the expression for the save button.
 *
 * @param oViewData the current view data
 * @param fullContextPath the path used up until here
 * @returns the binding expression that shows the right save button text
 */
export const getExpressionForSaveButton = function(oViewData: ViewData, fullContextPath: DataModelObjectPath): BindingExpression<string> {
	const saveButtonText = CommonUtils.getTranslatedText("T_OP_OBJECT_PAGE_SAVE", oViewData.resourceBundle);
	const createButtonText = CommonUtils.getTranslatedText("T_OP_OBJECT_PAGE_CREATE", oViewData.resourceBundle);
	let saveExpression;
	if (isStickySessionSupported(fullContextPath.startingEntitySet)) {
		// If we're in sticky mode AND the ui is in create mode, show Create, else show Save
		saveExpression = ifElse(UI.IsCreateModeSticky, createButtonText, saveButtonText);
	} else {
		// If we're in draft AND the draft is a new object (!IsActiveEntity && !HasActiveEntity), show create, else show save
		saveExpression = ifElse(Draft.IsNewObject, createButtonText, saveButtonText);
	}
	return compileBinding(saveExpression);
};
