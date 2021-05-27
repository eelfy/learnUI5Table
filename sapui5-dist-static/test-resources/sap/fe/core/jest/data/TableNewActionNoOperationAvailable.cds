using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

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
    @Common.DraftRoot.NewAction : 'sap.fe.test.JestService.myNewAction'
    @Capabilities : {InsertRestrictions : {
        $Type      : 'Capabilities.InsertRestrictionsType',
        Insertable : false
    }, }
    entity TestEntity as
        select from test.TestEntity {
            *
        } actions {
            @cds.odata.bindingparameter.collection
            action myNewAction() returns TestEntity;
        }
}