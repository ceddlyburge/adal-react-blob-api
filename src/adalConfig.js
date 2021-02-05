import { AuthenticationContext, adalFetch, withAdalLogin, adalGetToken } from 'react-adal'
// import {
//   turbinesEndpoint,
//   projectsEndpoint,
//   energyYieldsEndpoint,
//   layoutsEndpoint
// } from './api/apiEndpoints'

export const tenant = '90610670-1a80-434a-88c3-e568bce39bc5'
// export const turbineApiClientId = '4e7e6e03-790b-4d40-ad3b-6b704f6ebbec'
// export const layoutApiClientId = '0edc92fe-5663-4dd7-a94a-9b3f831916dc'
// export const projectApiClientId = '32426fce-8689-48db-81cd-b9535220215c'
// export const yieldApiClientId = '113519de-6613-40f6-8412-c5e53d541d7f'
export const ramClientId = '7189c18a-5c52-4a52-afc4-25bf36fa2175'

export const adalConfig = {
  tenant: tenant,
  clientId: ramClientId,
  redirectUri: window.location.origin,
  endpoints: {
    // [turbinesEndpoint.API]: turbineApiClientId,
    // [projectsEndpoint.API]: projectApiClientId,
    // [energyYieldsEndpoint.API]: yieldApiClientId,
    storageApi: "https://archiebackup.blob.core.windows.net"
  }
}

export const authContext = new AuthenticationContext(adalConfig)

// tslint:disable-next-line
export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.storageApi, fetch, url, options)

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.storageApi)
  
//export const getToken = () => authContext.getCachedToken("https://storage.azure.com");

export const getToken = () => adalGetToken(authContext, adalConfig.endpoints.storageApi);

export const getAuthenticationToken = () => {
  return new Promise(function (resolve, reject) {
    authContext.acquireToken(
      adalConfig.endpoints.storageApi,
      function (errorDesc, token, error) {
        if (error) {
          // The possible errors can be cleaned from the source code of the adal library
          // https://github.com/AzureAD/azure-activedirectory-library-for-js/blob/
          //  61c3177c106ce4e415c3e464df36f3718a8d9c67/lib/adal.js
          // They are 'resource is required', 'login required', 'Token Renewal Failed'.
          // Annoyingly 'interaction_required' is returned in production, I don't understand why.
          if (error === 'login_required' || error === 'interaction_required') {
            // acquireToken(...) will not perform user interation, so start redirect flow
            // Once it redirects back to us, the token will be in the cache, so the next
            // call to acquireToken() will work
            authContext.acquireTokenRedirect(adalConfig.endpoints.storageApi, null, null)
          }
          reject(error)
        } else {
          resolve(token || '')
        }
      }
    )
  })
}