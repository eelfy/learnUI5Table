import { Categories, getIssueByCategory, Audiences } from "sap/fe/core/support/CommonHelper";
import { IssueCategory } from "sap/fe/core/converters/helpers/IssueManager";

const oAnnotationIssue = {
	id: "annotationIssue",
	title: "Annotations: Incorrect path or target",
	minversion: "1.85",
	audiences: [Audiences.Application],
	categories: [Categories.Usage],
	description:
		"This rule identifies the incorrect path or targets defined in the metadata of the annotation.xml file or CDS annotations.",
	resolution: "Please review the message details for more information.",
	resolutionurls: [{ "text": "CDS Annotations reference", "href": "https://cap.cloud.sap/docs/cds/common" }],
	check: function(oIssueManager: any, oCoreFacade: any /*oScope: any*/) {
		getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Annotation);
	}
};
export function getRules() {
	return [oAnnotationIssue];
}
