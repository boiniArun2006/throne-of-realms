import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.throneofrealms.game',
  appName: 'Throne of Realms',
  webDir: 'public',
  // Android-specific settings
  android: {
    allowMixedContent: true,
  },
  // Server config for development
  server: {
    // When running on device, point to dev server
    // url: 'http://YOUR_LOCAL_IP:3000',
    // cleartext: true,
  },
};

export default config;
