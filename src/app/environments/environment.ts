

import { Environments } from "@farsiman/idf-angular";

export const environments={
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

