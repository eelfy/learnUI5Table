using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity TestEntity {
    key ID                                : Integer;
        name                              : String;
}

entity SecondEntity {
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
    @Capabilities               : {InsertRestrictions : {
        $Type      : 'Capabilities.InsertRestrictionsType',
        Insertable : false
    }, }
    entity TestEntity as
        select from test.TestEntity {
            *
        } actions {
            @cds.odata.bindingparameter.collection
            @Core.OperationAvailable : true
            action myNewAction() returns TestEntity;
        };

    entity secondEntity as
        select from test.SecondEntity {
            *
        } actions {
            @Core.OperationAvailable : false        
            action myBoundAction( );
        }
}