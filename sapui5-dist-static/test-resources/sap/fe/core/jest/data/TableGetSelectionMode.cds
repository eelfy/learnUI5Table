using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;
entity EntityWithoutActionOnTable {
    key ID                                : UUID;
        name                              : String;
        Prop1                             : String;
        Prop2                             : String;
        Hidden1                            : Boolean;
        Hidden2                           : Boolean;
        _Item                         : Composition of many EntityWithBoundActionOnTableWithHiddenExp
        on _Item.owner = $self;
        _Item2                        : Composition of many EntityWithMultipleActionsWithBindingExp
        on _Item2.owner = $self;
}

entity EntityWithCustomActionOnTable {
    key ID                                : Integer;
        name                              : String;
        Prop1                             : String;
        Prop2                             : String
}

entity EntityWithMultipleActionsWithBindingExp {
    key ID                                : UUID;
    name                                  : String;
    owner                                 : Association to EntityWithoutActionOnTable;
    Hidden                                : Boolean;
}

entity EntityWithHiddenBoundActionOnTable {
    key ID                                : Integer;
        name                              : String;
}

entity EntityWithBoundAction2OnTableWithHiddenExp {
    key ID                                : Integer;
        name                              : String;
        isHidden                            : Boolean
}

entity EntityWithBoundActionOnTableWithHiddenExp {
    key ID                                : UUID;
        name                              : String;
        Hidden                            : Boolean;
        owner                      : Association to EntityWithoutActionOnTable;
}

entity EntityWithActionRequingContextOnTable {
    key ID                                : Integer;
        name                              : String;
}

entity EntityWithBoundActionOnTable {
    key ID                                : Integer;
        name                              : String;
}

entity EntityWithUnBoundActionOnTable {
    key ID                                : Integer;
        name                              : String;
}

entity EntityWithActionRequingContextOnTableWithHiddenExp {
    key ID                                : Integer;
        name                              : String;
        isHidden                          : Boolean
}

annotate EntityWithoutActionOnTable with @(UI : {LineItem : [
    {
        $Type             : 'UI.DataField',
        Value             : Prop1,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : Prop2,
        ![@UI.Importance] : #High
    }
    
]},
    Capabilities : {
            DeleteRestrictions : {Deletable : false},
            NavigationRestrictions : {RestrictedProperties : [{
                NavigationProperty : _Item,
                
}]}},

Facets                                          : [
    {
        $Type  : 'UI.CollectionFacet',
        Label  : 'Header',
        ID     : 'HeaderInfo',
        Facets : [
            {
                $Type             : 'UI.ReferenceFacet',
        Label             : 'Items',
        ID                : 'EntityWithBoundActionOnTableWithHiddenExp',
        Target            : '_Item/@UI.LineItem',
        ![@UI.Importance] : #High
    }
        ]
    }
]
);


annotate EntityWithBoundActionOnTable with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForAction',
        Label  : 'Bound Action 1',
        Action : 'sap.fe.test.JestService.boundAction1'
    }
    
]});

annotate EntityWithHiddenBoundActionOnTable with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForAction',
        Label  : 'Hidden Bound Action 1',
        Action : 'sap.fe.test.JestService.hiddenBoundAction1',
        ![@UI.Hidden] : true,
    }
    
]});


annotate EntityWithMultipleActionsWithBindingExp with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForAction',
        Label  : 'Bound Action 2',
        Action : 'sap.fe.test.JestService.Action2',
        ![@UI.Hidden] : owner.Hidden1,
    },
    {
        $Type  : 'UI.DataFieldForIntentBasedNavigation',
        SemanticObject  : 'test',
        Label  : 'Action requiring context',
        Action : 'sap.fe.test.JestService.boundAction1',
        RequiresContext : true,
        ![@UI.Hidden]     : owner.Hidden2,
    }
    
]});

annotate EntityWithUnBoundActionOnTable with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForAction',
        Label  : 'UnBound Action 1',
        Action : 'sap.fe.test.JestService.unBoundAction1'
    }
    
]});

annotate EntityWithActionRequingContextOnTable with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForIntentBasedNavigation',
        SemanticObject  : 'test',
        Label  : 'Action requiring context',
        Action : 'sap.fe.test.JestService.Action2',
        RequiresContext : true,
        ![@UI.Hidden]     : false,
    }
    
]});

annotate EntityWithActionRequingContextOnTableWithHiddenExp with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForIntentBasedNavigation',
        SemanticObject  : 'test',
        Label  : 'Action requiring context',
        Action : 'sap.fe.test.JestService.Action2',
        RequiresContext : true,
        ![@UI.Hidden]     : isHidden,
    }
    
]});

annotate EntityWithBoundAction2OnTableWithHiddenExp with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForIntentBasedNavigation',
        SemanticObject  : 'test',
        Label  : 'Action requiring context',
        Action : 'sap.fe.test.JestService.Action2',
        RequiresContext : true,
        ![@UI.Hidden]     : isHidden,
    }
    
]});

annotate EntityWithBoundActionOnTableWithHiddenExp with @(UI : {LineItem : [
    {
        $Type  : 'UI.DataFieldForIntentBasedNavigation',
        SemanticObject  : 'test',
        Label  : 'Action requiring context',
        Action : 'sap.fe.test.JestService.boundAction1',
        RequiresContext : true,
        ![@UI.Hidden]     : owner.Hidden,
    }
    
]});

annotate EntityWithCustomActionOnTable with @(UI : {LineItem : [
    {
        $Type             : 'UI.DataField',
        Value             : Prop1,
        ![@UI.Importance] : #High
    },
    {
        $Type             : 'UI.DataField',
        Value             : Prop2,
        ![@UI.Importance] : #High
    }
    
]});

service JestService {
    //entity TestEntity as projection on test.TestEntity;
    entity EntityWithoutActionOnTable      as projection on
        test.EntityWithoutActionOnTable {
        *
        };
    entity EntityWithUnBoundActionOnTable      as
        select from test.EntityWithUnBoundActionOnTable {
        *
        };
    entity EntityWithBoundActionOnTable    as
        select from test.EntityWithBoundActionOnTable {
        *
        } actions {
            @cds.odata.bindingparameter.name : '_it'
            action boundAction1() returns EntityWithBoundActionOnTable;
        };
    entity EntityWithHiddenBoundActionOnTable    as
        select from test.EntityWithHiddenBoundActionOnTable {
        *
        } actions {
            @cds.odata.bindingparameter.name : '_it'
            action hiddenBoundAction1() returns EntityWithHiddenBoundActionOnTable;
        };
    entity EntityWithActionRequingContextOnTable    as
        select from test.EntityWithActionRequingContextOnTable {
        *
        } actions {
            @cds.odata.bindingparameter.name : '_it'
            action Action2() returns EntityWithActionRequingContextOnTable;
        };
        
    entity EntityWithBoundAction2OnTableWithHiddenExp    as
        select from test.EntityWithBoundAction2OnTableWithHiddenExp {
        *
        } actions {
            @cds.odata.bindingparameter.name : '_it'
            action Action2() returns EntityWithBoundAction2OnTableWithHiddenExp;
        };
    entity EntityWithCustomActionOnTable    as
        select from test.EntityWithCustomActionOnTable {
        *
        };
    entity EntityWithActionRequingContextOnTableWithHiddenExp    as
        select from test.EntityWithActionRequingContextOnTableWithHiddenExp {
        *
        };
    entity EntityWithBoundActionOnTableWithHiddenExp    as projection on
        test.EntityWithBoundActionOnTableWithHiddenExp {
        *
        } actions {
            @cds.odata.bindingparameter.name : '_it'
            action boundAction1() returns EntityWithBoundActionOnTableWithHiddenExp;
        };
    entity EntityWithMultipleActionsWithBindingExp as projection on
        test.EntityWithMultipleActionsWithBindingExp {
        *
        } actions {
            @cds.odata.bindingparameter.name : '_it'
            action boundAction1() returns EntityWithMultipleActionsWithBindingExp;
            action Action2() returns EntityWithMultipleActionsWithBindingExp
        };
    action
        unBoundAction1() returns EntityWithUnBoundActionOnTable;
}