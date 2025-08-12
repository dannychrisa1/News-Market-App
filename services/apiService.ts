import finnhubAxios from '../lib/axios';

export type NewsCategory = 'general' | 'forex' | 'crypto' | 'merger';

export const fetchNews = async (category: NewsCategory = 'general', minId?:number) => {
  try {
    const response = await finnhubAxios.get('/news', {
      params: {
        category,
        ...(minId && {minId})
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
