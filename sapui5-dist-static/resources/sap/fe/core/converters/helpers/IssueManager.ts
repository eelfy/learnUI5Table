export enum IssueSeverity {
	High,
	Low,
	Medium
}

export const IssueCategoryType = {
	Facets: {
		MissingID: "MissingID",
		UnSupportedLevel: "UnsupportedLevel"
	}
};

export enum IssueCategory {
	Annotation = "Annotation",
	Template = "Template",
	Manifest = "Manifest",
	Facets = "Facets"
}
export const IssueType = {
	MISSING_LINEITEM: "We couldn't find a line item annotation for the current entitySet, you should consider adding one.",
	MISSING_SELECTIONFIELD: "Defined Selection Field is not found",
	MALFORMED_DATAFIELD_FOR_IBN: {
		REQUIRESCONTEXT: "DataFieldForIntentBasedNavigation cannot use requires context in form/header.",
		INLINE: "DataFieldForIntentBasedNavigation cannot use Inline in form/header."
	},
	FULLSCREENMODE_NOT_ON_LISTREPORT: "enableFullScreenMode is not supported on list report pages."
};
