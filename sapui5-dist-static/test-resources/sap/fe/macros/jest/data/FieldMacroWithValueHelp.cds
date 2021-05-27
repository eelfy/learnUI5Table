using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity Items {
	key ID                       : Integer;
	stringValue                  : String;
	booleanValue                 : Boolean;
	timestampValue               : Timestamp;
	timeValue                    : Time;
	doubleValue                  : Double;
	int64Value                   : Integer64;
	decimalValue                 : Decimal(4, 2);
	dateValue                    : Date;

	quantity          : Integer @Measures.Unit : quantityUnit;
	quantityUnit      : String(40)        @(Common : {
		Label        : 'Quantity Unit',
		ValueList    : {
			Label          : 'Quantity Unit',
			CollectionPath : 'ValueHelpEntity',
			 Parameters     : [
			  {
				  $Type             : 'Common.ValueListParameterInOut',
				  LocalDataProperty : vhReference,
				  ValueListProperty : 'VHKey'
			  },
			  {
				  $Type             : 'Common.ValueListParameterDisplayOnly',
				  ValueListProperty : 'VH_Text'
			  }
			  ]
		}
	});


	vhReference				 : String @(
	  Common         : {
		  Label                    : 'Value with Value Help',
		  ValueList                : {
			  Label          : 'Value with Value Help',
			  CollectionPath : 'ValueHelpEntity',
			  Parameters     : [
			  {
				  $Type             : 'Common.ValueListParameterInOut',
				  LocalDataProperty : vhReference,
				  ValueListProperty : 'VHKey'
			  },
			  {
				  $Type             : 'Common.ValueListParameterDisplayOnly',
				  ValueListProperty : 'VH_Text'
			  }
			  ]
		  }
	  });
	vhReferenceWithFixedValues				 : String @(
    	  Common         : {
    		  Label                    : 'Value with Value Help',
    		  ValueListWithFixedValues : true,
    		  ValueList                : {
    			  Label          : 'Value with Value Help',
    			  CollectionPath : 'ValueHelpEntity',
    			  Parameters     : [
    			  {
    				  $Type             : 'Common.ValueListParameterInOut',
    				  LocalDataProperty : vhReference,
    				  ValueListProperty : 'VHKey'
    			  },
    			  {
    				  $Type             : 'Common.ValueListParameterDisplayOnly',
    				  ValueListProperty : 'VH_Text'
    			  }
    			  ]
    		  }
    	  }

  );
  toSubItems  : Association to SubItems on toSubItems.lineItem = $self;
}

@cds.autoexpose
entity SubItems {
    key ID       : Integer @(title : 'ID');
    name     : String  @(title : 'Name');
    subvhReference	 : String @(
	  Common         : {
		  Label                    : 'Value with Value Help',
		  ValueList                : {
			  Label          : 'Value with Value Help',
			  CollectionPath : 'ValueHelpEntity',
			  Parameters     : [
			  {
				  $Type             : 'Common.ValueListParameterInOut',
				  LocalDataProperty : vhReference,
				  ValueListProperty : 'VHKey'
			  },
			  {
				  $Type             : 'Common.ValueListParameterDisplayOnly',
				  ValueListProperty : 'VH_Text'
			  }
			  ]
		  }
	  });
 	lineItem : Association to one Items;
}

entity ValueHelpEntity @(
    cds.autoexpose,
    title : 'Value Help Reference'
) {
    key VHKey      : String(1) @(
		Common : {
			Text            : VH_Text,
			TextArrangement : #TextFirst
		},
		title  : 'Value Help Key'
	);
	VH_Text : String(20)@(
		Core.Immutable : true,
		Common         : {
			Label     : 'Value Help Description'
		}
	);
}

annotate Items with @(UI : {
    LineItem                           : [
		{Value : ID},
		{Value : toSubItems.subvhReference}
    ]
});

service JestService {
    @odata.draft.enabled
    entity Items      as
        select from test.Items {
        *
        }
}