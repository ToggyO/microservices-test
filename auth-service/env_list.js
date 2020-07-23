export default [
  'NODE_ENV',
  'NGINX_HOST',
  'NGINX_PORT',
  'MIC_ACCOUNT_HOST',
  'MIC_ACCOUNT_PORT',
  'API_VERSION',
  'AUTHORIZATION_HEADER',
  'CRON_CHECK_INVALID_TOKENS_DELAY_SECS',
  'CRYPTO_SECRET',
  'JWT_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'JWT_PUBLIC_KEY_BASE64',
  'PEPPER',
  'MIC_ACCOUNT_ROUTE_PREFIX',
  'MIC_ACCOUNT_POSTGRES_HOST',
  'MIC_ACCOUNT_POSTGRES_PORT',
  'MIC_ACCOUNT_POSTGRES_EXTERNAL_PORT',
  'MIC_ACCOUNT_POSTGRES_USER',
  'MIC_ACCOUNT_POSTGRES_DATABASE',
  'MIC_ACCOUNT_POSTGRES_PASSWORD',
  'TEMP_DIR',
  'UPLOAD_MAX_FILESIZE_MB',
]

// location /auth/swagger/v1/ {
//   access_log   /var/log/nginx/swagger_acces.log;
// error_log /var/log/nginx/swagger_error.log;
// proxy_pass http://microservices-auth-service-dev:3010/swagger/v1;
//   }
//
// location /auth {
//   access_log   /var/log/nginx/auth_acces.log;
//   error_log /var/log/nginx/auth_error.log;
//   proxy_pass http://microservices-auth-service-dev:3010;
//     }
