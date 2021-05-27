using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity Items
  @(Common       : {
        SemanticKey                              : [ID]
        }) {
    key ID                                : Integer;
        name                              : String;
        integer                      : Integer64;
        decimal                     : Decimal(4, 2);
        quantity1                    	  : Integer64	@Measures.Unit : unit1;
        quantity2                         : Decimal(10, 2)	@Measures.Unit : unit2;
        quantityWithStaticUnit			  : Integer64	@Measures.Unit : 'mol';
        amount1							  : Integer64	@Measures.ISOCurrency : unit1;
        unit1                             : String;
		@readonly unit2                   : String;
}

annotate Items with @(UI : {
 Chart #RadialChart                     : {
        $Type             : 'UI.ChartDefinitionType',
        Title             : 'MicroChart',
        ChartType         : #Bullet,
        Measures          : [amount1],
        Dimensions        : [ID],
        MeasureAttributes : [{
            $Type     : 'UI.ChartMeasureAttributeType',
            Measure   : amount1,
            Role      : #Axis1,
            DataPoint : '@UI.DataPoint#RadialPath'
        }]
	},
 DataPoint #RadialPath                  : {
        Value       : amount1,
        Title       : 'Net Amount',
        Criticality : integer
    },
},
Common        : {
	SemanticObject                  : 'LineItems'
});




service JestService {
    @odata.draft.enabled
    entity Items      as
        select from test.Items {
        *
        }
}