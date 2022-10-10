import { InjectionToken } from '@angular/core';

export let DATA_CONFIG = new InjectionToken('dataFactory');

export const DataFactory = {
    Status: {
        Approved: 5,
        Declined: 6,
        Pending: 7
    },
    Login: {
        CreatedByUserId: 1,
        UpdatedByUserId: 1,
        LoginId: 1
    },
    ClassType: {
        Breed: 1,
        ShedType: 2,
        Status: 3,
        Brokers: 4,
        Feed: 5,
        Alerts: 6,
        PaymentMode: 7,
        VaccinationType:8,
        Material:9,
        PaymentStatus:10,
        UOMType:11,
        Income:12,
        Expenses:13,
        DisposedType:14,
        PaymentTerms:15
        
    },
    PaymentStatus: {
        Paid: 27,
        Outstanding: 28
    },
    LookUp:{
        FeedBrokers:8,
        FeedTypes:9,
        MaterialType:18
    },
    ShedType:{
        ChickShed:2,
        GrowerShed:3,
        LayerShed:4
    },
    PaymentAmounts:{
        PaidAmount:27,
        OutstandingAmount:28
    },
    UOMs:{
        Tons:33,
        Units:34
    },
    paymentMOdes:{
        RTGS:11,
        Cheque:12,
        Cash:13,
        Net7:19,
        Net10:20,
        Net15:21,
        Net20:22,
        Net30:23,
        Net45:24,
        Growers:25,
        TrayBundles:26,
        Net60:29,
        Net90:30,
        Advance:31,
        Immediate:32,
        cash:51
    },
     ExpensesTypeData:[
         {
             Id:12,
             Name:'Income'
         },
         {
            Id:13,
            Name:'Expenses'
        }
     ],
     IncomeTypes:{
         Production:35,
         Others:38,
         ExpensiveOthers:45,
         Culling:49,
         Sale:50,
         culling:46
     },
     ExpensesTypes:{
         BatchCost:47,
         FeedPurchase:48
     },
     FarmIds:{
         BSP:1,
         BSPC:2
      },
     AllowedImgExtensions: {
        Extensions: '.jpg;.jpeg;.png;.bmp;',
        MaxFileSize: 5242880
    },
    MonthlyData:[
        {
            Id:1,
            Name:'Month'
        },
        {
           Id:2,
           Name:'Year'
       }
    ],

};


