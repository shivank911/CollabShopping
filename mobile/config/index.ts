import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const config = {
  apiUrl: API_URL,
  socketUrl: API_URL.replace('/api', ''),
};
