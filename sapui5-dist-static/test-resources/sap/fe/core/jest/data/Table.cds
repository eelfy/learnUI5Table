using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity TestEntity {
    key ID                                : Integer;
        name                              : String;
}


entity CreateHiddenEntity {
    key ID                                : Integer;
        name                              : String;
}

entity CreateHiddenDynamicEntity {
    key ID                                : Integer;
        name                              : String;
        hiddenCreate                              : Boolean;
}

annotate CreateHiddenEntity with @(UI : { CreateHidden: true });
annotate CreateHiddenDynamicEntity with @(UI : { CreateHidden: hiddenCreate });
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
	 entity CreateHiddenEntity      as
			select from test.CreateHiddenEntity {
			*
			};
	entity CreateHiddenDynamicEntity      as
	select from test.CreateHiddenDynamicEntity {
	*
	};
}