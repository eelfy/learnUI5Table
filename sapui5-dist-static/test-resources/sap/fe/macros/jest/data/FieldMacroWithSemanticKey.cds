using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity Items
  @(Common       : {
        SemanticKey                              : [ID, keyWithSemanticObject]
        }) {
    key ID                                : Integer;
        name                              : String;
         keyWithSemanticObject : String @(
        			Common        : {
        				SemanticObject                  : 'SubItems'
        			});
		toSubItems                 : Association to SubItems on toSubItems.lineItem = $self;
}

@cds.autoexpose
entity SubItems
 @(Common       : {
        SemanticKey                              : [ID]
        }) {
    key ID       : Integer @(title : 'ID');
        name     : String  @(title : 'Name');
        keyWithSemanticObject : String @(
			Common        : {
				SemanticObject                  : 'SubItems'
			});
	lineItem : Association to one Items;
}

annotate Items with @(UI : {
    LineItem                           : [
    {Value : ID},
    {Value : keyWithSemanticObject}
    ],
    DataPoint #withValueFormat			: {
    	Value: usageProgress,
    	ValueFormat: {
    		NumberOfFractionalDigits: 1
    	},
    	Title: 'Usage Progress (Decimal)'
    },
     FieldGroup #foo   : {Data : [
     {Value : ID},
     {Value : keyWithSemanticObject}
     ]},
	  QuickViewFacets             : [{
			 $Type  : 'UI.ReferenceFacet',
			 Label  : 'foo',
			 Target : '@UI.FieldGroup#foo'
		}]

},


Common        : {
	SemanticObject                  : 'LineItems'
});
annotate SubItems with @(UI : {
    LineItem                           : [
    {Value: lineItem_ID},
    {Value:ID}]
    });



service JestService {
    @odata.draft.enabled
    entity Items      as
        select from test.Items {
        *
        }
}