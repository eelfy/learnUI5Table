using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity getBindingWithTextArrangement {
	key ID                       : Integer;
	noText		                 : String;
	textOnly	                 : String @(
                                          	Common : {
                                          		Text            : targetText,
                                          		TextArrangement : #TextOnly
                                          	});
	textFirst		             : String @(
											Common : {
												Text            : targetText,
												TextArrangement : #TextFirst
											});
	textLast	                 : String @(
											Common : {
												Text            : targetText,
												TextArrangement : #TextLast
											});
	textSeparate                 : String @(
											Common : {
												Text            : targetText,
												TextArrangement : #TextSeparate
											});
	targetText	                 : String;
}

service JestService {
    @odata.draft.enabled
    entity getBindingWithTextArrangement      as
        select from test.getBindingWithTextArrangement {
        *
        }
}