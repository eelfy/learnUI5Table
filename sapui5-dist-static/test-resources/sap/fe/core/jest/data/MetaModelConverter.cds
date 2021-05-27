using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity TestEntity
  @(Common       : {
        SemanticKey                              : [ID]
        }) {
    key ID                                : Integer;
        name                              : String;
        propWithText					  : String @(
		Common        : {
						Text            : propWithTextText,
						TextArrangement : #TextFirst
					});
        propWithTextText                              : String;
        imageURL                          : String      @UI         : {IsImageURL : true};
        imageURLStream                    : String      @(
            Core.MediaType : 'image/jpg',
            Core.IsURL
        );
        mediaType                         : String      @Core.isMediaType;
        imageStream                       : LargeBinary @(
            Core.MediaType : 'image/png',
            Core.Computed
        );
        stream                       		: LargeBinary;
        preferredItem                     : Boolean;
        creationDate                      : Timestamp;
        usageStartTime                    : Time;
        usageCoefficient                  : Double;
        usageCounter                      : Integer64;
        usageProgress                     : Decimal(4, 2);
        usageDuration                     : String      @odata.Type : 'Edm.Duration';
        emailAddress                      : String      @Communication.IsEmailAddress;
        phoneNumber                       : String      @Communication.IsPhoneNumber;
        headerDate                        : Date;
        quantity1                    	  : Integer64	@Measures.Unit : unit1;
        quantity2                         : Decimal(10, 2)	@Measures.Unit : unit2;
        quantityWithStaticUnit			  : Integer64	@Measures.Unit : 'mol';
        amount1							  : Integer64	@Measures.ISOCurrency : unit1;
        unit1                             : String;
		@readonly unit2                   : String;
		multiline						  : String @UI.MultiLineText: true;
}

annotate Items with @(UI : {
    LineItem                           : [
    {Value : ID},
    {Value : name},
    {Value : imageURL},
    {Value : imageURLStream},
    {Value : imageStream},
    {Value : preferredItem},
    {Value : creationDate},
 	{Value: usageProgress},
   	{Value : usageStartTime},
    {Value : usageCoefficient},
    {Value : usageCounter},
    {Value : emailAddress},
    {Value : phoneNumber},
    {Value : headerDate},
    {Value : quantity1},
    {Value : quantity2},
    {Value : amount1},
    {Value : quantityWithStaticUnit}
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

},
Common        : {
	SemanticObject                  : 'LineItems'
});




service JestService {
    @odata.draft.enabled
    entity TestEntity      as
        select from test.TestEntity {
        *
        }
}