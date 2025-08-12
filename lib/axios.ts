import axios from 'axios';

const finnhubAxios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_APP_BASEURL,
  params: {
    token: process.env.EXPO_PUBLIC_APP_SECRET
  }
});

export default finnhubAxios;