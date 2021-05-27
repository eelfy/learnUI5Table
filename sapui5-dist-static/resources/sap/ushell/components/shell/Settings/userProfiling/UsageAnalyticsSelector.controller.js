// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ushell/resources"],function(C,J,r){"use strict";return C.extend("sap.ushell.components.shell.Settings.userProfiling.UsageAnalyticsSelector",{onInit:function(){this.oUser=sap.ushell.Container.getUser();this.oUsageAnalyticsService=sap.ushell.Container.getService("UsageAnalytics");this.getView().setModel(new J({isTrackingUsageAnalytics:this.oUser.getTrackUsageAnalytics(),legalText:this.oUsageAnalyticsService.getLegalText()}));this.getView().setModel(r.getTranslationModel(),"i18n");},onSave:function(){var c=this.getView().getModel().getProperty("/isTrackingUsageAnalytics");return this.oUsageAnalyticsService.setTrackUsageAnalytics(c);},onCancel:function(){this.getView().getModel().setProperty("/isTrackingUsageAnalytics",this.oUser.getTrackUsageAnalytics());}});});
