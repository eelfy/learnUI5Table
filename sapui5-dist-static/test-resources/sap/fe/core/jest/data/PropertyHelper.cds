using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

entity TestEntity {
    key KeyProperty                        		: Integer;
    ComputedProperty : String @Core.Computed;
    ImmutableProperty : String @Core.Immutable;
    FieldControlReadOnly                            : String    @Common.FieldControl             : #ReadOnly;
    FieldControlInapplicable                        : String    @Common.FieldControl             : #Inapplicable;
    FieldControlDynamic : String @Common.FieldControl : FieldControlValue;
}

service JestService {
    entity TestEntity as projection on test.TestEntity;
}