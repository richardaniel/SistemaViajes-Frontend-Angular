import { Environments } from "@farsiman/idf-angular";

export const apis = {
  authAdmin: 'https://api.corporativo.grupofarsiman.io/staging/seguridad/identidad-farsiman-admin-api',
}

export const environment = {
  production: false,
  uat:true,
  requireAuthorization:true,
  authAdmin: apis.authAdmin,
  
  auth_config: {
    environment: Environments.Staging,
     
    require_authorization: false,
    public_pages_paths: [],
    public_main_page_path: '/public/inicio',
    authenticated_main_page_path: '/public/inicio'
  },
  
};
