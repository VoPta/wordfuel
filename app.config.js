import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    router: {
      origin: 'https://vopta.github.io',
    },
  },
}); 