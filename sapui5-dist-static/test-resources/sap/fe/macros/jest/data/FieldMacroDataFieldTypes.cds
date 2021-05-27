using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity Items
  @(Common       : {
        SemanticKey                              : [ID]
        },
        Communication.Contact : {
        			email : [{
        				type    : #work,
        				address : name
        			}],
        			fn    : name,
        			tel   : [{
        				type : #fax,
        				uri  : name
        			}]
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
		toSubItems                 : Association to SubItems on toSubItems.lineItem = ID;
}

@cds.autoexpose
entity SubItems @(
		Communication.Contact : {
			email : [{
				type    : #work,
				address : name
			}],
			fn    : name,
			tel   : [{
				type : #fax,
				uri  : name
			}]
		}){
    key ID       : Integer @(title : 'ID');
        name     : String  @(title : 'Name');
	lineItem : Integer;
}
annotate Items with @(UI : {
    LineItem #DataPoint                         : [
{
        $Type  : 'UI.DataFieldForAnnotation',
        Target : '@UI.DataPoint#withValueFormat'
    },
    {
		$Type  : 'UI.DataFieldForAnnotation',
		Target : '@UI.DataPoint#number'
	},
	{
		$Type  : 'UI.DataFieldForAnnotation',
		Target : '@UI.DataPoint#Rating'
	},
	{
		$Type  : 'UI.DataFieldForAnnotation',
		Target : '@UI.DataPoint#Progress'
	},
    ],
    LineItem #Action : [
    {
		$Type              : 'UI.DataFieldForAction',
		Label              : 'Dummy Action',
		Action             : 'CatalogService.testBound',
		InvocationGrouping : #ChangeSet
	}
    ],
    LineItem #NavigationPath: [
    {
		Value  : toSubItems.name,
		Target : 'toSubItems',
		$Type  : 'UI.DataFieldWithNavigationPath',
		Label  : 'DataFieldWithNavigationPath'
	}
    ],
    LineItem #IntentBasedNav: [
    {
    		Value  : toSubItems.name,
    		$Type  : 'UI.DataFieldForIntentBasedNavigation',
    		SemanticObject : 'SubItems',
			Action: 'test',
    		Label  : 'Intent'
    	}
    ],
    LineItem #Contact: [
    	{
    		$Type  : 'UI.DataFieldForAnnotation',
			Target : '@Communication.Contact',
			Label  : 'DataFieldDefault - DataFieldForAnnotationContact'
    	}
    ],
    DataPoint #withValueFormat			: {
    	Value: decimal,
    	ValueFormat: {
    		NumberOfFractionalDigits: 1
    	},
    	Title: 'Usage Progress (Decimal)'
    },
    DataPoint #number			: {
		Value: decimal,
		Title: 'Usage Progress (Decimal)',
		Visualization        : #Number
	},
	DataPoint #Rating                               : {
		Value                : integer,
		TargetValue          : 5.0,
		Title                : 'Rating',
		Visualization        : #Rating,
		![@Common.QuickInfo] : 'Rating Indicator '
	},
	DataPoint #Progress                             : {
		Value         : decimal,
		TargetValue   : 100,
		Title         : 'Progress',
		Visualization : #Progress
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