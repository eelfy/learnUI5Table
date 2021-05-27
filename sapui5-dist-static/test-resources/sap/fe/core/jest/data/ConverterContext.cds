using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity TestEntity
    key ID                                : Integer;
        name                              : String;
}

annotate Items with @(UI : {
    LineItem                           : [
    {Value : ID},
    {Value : name}
    ],
    LineItem#bis:[
    {Value : multiline},
    {
                $Type : 'UI.DataFieldWithUrl',
                Value : ID
            }
    ],
    DataPoint #withValueFormat			: {
    	Value: usageProgress,
    	ValueFormat: {
    		NumberOfFractionalDigits: 1
    	},
    	Title: 'Usage Progress (Decimal)'
    },
     FieldGroup #foo   : {Data : [{
            $Type : 'UI.DataField',
            Value : ID
        }]},

}



service JestService {
    @odata.draft.enabled
    entity TestEntity      as
        select from test.TestEntity {
        *
        }
}