using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

@Aggregation.ApplySupported : {
    PropertyRestrictions: true
}

entity TestEntity {
    key ID                                : Integer;
        name                              : String;
}

annotate TestEntity with @(UI : {
    LineItem                           : [
    	{Value : ID},
    	{Value : name}
    ]
});

service JestService {
    @odata.draft.enabled
    entity TestEntity      as
        select from test.TestEntity {
        *
        };
}