

import { Environments } from "@farsiman/idf-angular";


export const apis = {
  authAdmin: 'https://api.corporativo.grupofarsiman.io/staging/seguridad/identidad-farsiman-admin-api',
}
export const environment={

    production :false ,
    uat:false,
    requireAuthorization:false,
    environment: Environments.Development,
    baseUri: 'http://localhost:4200',
    authServer: 'https://auth-server-staging.grupofarsiman.com',
    authAdmin: apis.authAdmin,

    auth_config: {
        environment: Environments.Staging,
        url: 'http://localhost:4200',
        client_id: 'clientdemo',
        api_resources: [
          'http://localhost:5648',
          'http://localhost:7138',
          'https://localhost:7041'
        ],
        require_authorization: false,
        public_pages_paths: [],
        
        public_main_page_path: '/public/inicio',
        authenticated_main_page_path: '/home'
      },
}

