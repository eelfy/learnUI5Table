/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2020 SAP SE. All rights reserved
    
 */
/**
 * Defines support rules of the ObjectPageHeader control of sap.uxap library.
 */
import SupportLib from "sap/ui/support/library";
import { IssueCategory, IssueSeverity } from "sap/fe/core/converters/helpers/IssueManager";
import { IssueDefinition } from "sap/fe/core/support/Diagnostics";
import { AppComponent } from "sap/fe/core";

export const Categories = SupportLib.Categories, // Accessibility, Performance, Memory, ...
	Severity = SupportLib.Severity, // Hint, Warning, Error
	Audiences = SupportLib.Audiences; // Control, Internal, Application

//**********************************************************
// Rule Definitions
//**********************************************************

// Rule checks if objectPage componentContainer height is set

export const getSeverity = function(oSeverity: IssueSeverity) {
	switch (oSeverity) {
		case IssueSeverity.Low:
			return Severity.Low;
		case IssueSeverity.High:
			return Severity.High;
		case IssueSeverity.Medium:
			return Severity.Medium;
	}
};

export const getIssueByCategory = function(
	oIssueManager: any,
	oCoreFacade: any /*oScope: any*/,
	issueCategoryType: IssueCategory,
	issueSubCategoryType?: string
) {
	const mComponents = oCoreFacade.getComponents();
	let oAppComponent!: AppComponent;
	Object.keys(mComponents).forEach(sKey => {
		const oComponent = mComponents[sKey];
		if (
			oComponent
				?.getMetadata()
				?.getParent()
				?.getName() === "sap.fe.core.AppComponent"
		) {
			oAppComponent = oComponent;
		}
	});
	if (oAppComponent) {
		const aIssues = oAppComponent.getDiagnostics().getIssuesByCategory(IssueCategory[issueCategoryType], issueSubCategoryType);

		aIssues.forEach(function(oElement: IssueDefinition) {
			oIssueManager.addIssue({
				severity: getSeverity(oElement.severity),
				details: oElement.details,
				context: {
					id: oElement.category
				}
			});
		});
	}
};
