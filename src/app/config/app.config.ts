import { InjectionToken } from '@angular/core';

import { IAppConfig } from './iapp.config';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: IAppConfig = { 
  
    serviceBase_Url: {  
      //Live
      // base_Url:'http://183.82.111.111/PoultryAPI/api/'
          //base_Url:'http://localhost:5467/api/' 

      //Test
      //  base_Url:'http://183.82.111.111/PoultryAPI_Test/api/'  
      base_Url:'http://182.18.157.215/Poultry/API/api/' 
    },
    weatherApiKey:{
      apiKey :'048f0493892d57f4b1e545da3d925595'
   },
   weatherApiUrl:{
     apiUrl:'http://api.openweathermap.org/data/2.5'
    
   }
  };