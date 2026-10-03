import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
  applicationId: 'd0e1adca-7d3c-4c0f-9971-f7fae2ea3253',
  clientToken: 'pubb7df7442a5e31ae1c8d78f0be514ffb7',
  site: 'datadoghq.com',

  service: 'checkout-frontend',
  env: 'dev',
  version: '1.0.0',

  sessionSampleRate: 100,
  sessionReplaySampleRate: 0,

  trackResources: true,
  trackUserInteractions: true,
  trackLongTasks: true,

  defaultPrivacyLevel: 'mask',
  plugins: [reactPlugin({ router: false })],
});