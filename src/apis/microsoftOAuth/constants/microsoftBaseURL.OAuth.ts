export function getOAuthBaseURL(tenant_id: string) {
  const baseURL = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/authorize`;
  return baseURL;
}

export function getOAuthTokeURL(tenant_id: string) {
  const baseURL = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;
  return baseURL;
}

export function getOPENID_ConfigURL(tenant_id: string) {
  return `https://login.microsoftonline.com/${tenant_id}/v2.0/.well-known/openid-configuration`;
}
