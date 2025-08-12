import { NewsItem, TrendingNews } from "@/lib/types";
import { fetchNews, NewsCategory } from '@/services/apiService';
import { getTrendingNews, updateSearchCount } from "@/services/appwrite";
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface NewsState {
  news: NewsItem[];
  categoryNews: NewsItem[];
  filteredNews: NewsItem[];
  trendingNews: TrendingNews[];
  currentPage: number;
  itemsPerPage: number;
  paginatedNews: NewsItem[];



  categories: NewsCategory[]
  currentCategory: NewsCategory
  loading: boolean;
  trendingLoading: boolean;   // Separate loading state for trending news
  error: string | null;
  trendingError: string | null; // Separate error state for trending news
  searchQuery: string;
  fetchNews: () => Promise<void>;
  fetchCategoryNews: (category: string) => Promise<void>;
  setSearchQuery: (query: string) => void;

  updatePaginatedNews: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  trackSearch: (query: string, newsItem: NewsItem) => Promise<void>;
  fetchTrendingNews: () => Promise<void>

}

export const useNewsStore = create<NewsState>()(
  devtools(
    (set, get) => ({
      news: [],
      categoryNews: [],
      filteredNews: [],
      trendingNews: [],
      categories: ['general', 'forex', 'crypto', 'merger'],
      currentCategory: 'general',
      loading: false,
      trendingLoading: false,
      error: null,
      trendingError: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      paginatedNews: [],

      trackSearch: async (query: string, newsItem: NewsItem) => {
        try {
          await updateSearchCount(query, newsItem);
        } catch (error) {
          console.error('Failed to track search:', error);
          // You might want to handle this error differently
        }
      },

      fetchTrendingNews: async () => {
        set({ trendingLoading: true, trendingError: null }, false, 'fetchTrendingNews/pending');
        try {
          const trendingData = await getTrendingNews();
          if (trendingData) {
            set({ trendingNews: trendingData, trendingLoading: false }, false, 'fetchTrendingNews/fulfilled');
          } else {
            set({
              trendingError: 'Failed to fetch trending news',
              trendingLoading: false
            }, false, 'fetchTrendingNews/rejected');
          }
        } catch (error) {
          set({
            trendingError: (error as Error).message,
            trendingLoading: false
          }, false, 'fetchTrendingNews/rejected');
        }
      },

      fetchCategoryNews: async (category: NewsCategory) => {
        set({ loading: true, currentCategory: category, currentPage: 1 }, false, 'fetchCategoryNews/pending');
        try {
          const data = await fetchNews(category);
          set({ categoryNews: data, loading: false }, false, 'fetchCategoryNews/fulfilled');
          get().updatePaginatedNews();

        } catch (error) {
          set({ error: (error as Error).message, loading: false }, false, 'fetchCategoryNews/rejected');
        }
      },


      fetchNews: async () => {
        if (get().news.length > 0) return;
        set({ loading: true, error: null }, false, 'fetchNews/pending');
        try {
          const news = await fetchNews();
          set({ news, loading: false }, false, 'fetchNews/fulfilled');
        } catch (error) {
          set(
            {
              error: (error as Error).message,
              loading: false
            },
            false,
            'fetchNews/rejected'
          );
        }
      },
      setSearchQuery: (query: string) => {
        const { news } = get();
        const filtered = news.filter(item =>
          item.headline.toLowerCase().includes(query.toLowerCase()) ||
          item.source.toLowerCase().includes(query.toLowerCase())
        );
        set({
          searchQuery: query,
          filteredNews: query ? filtered : news
        });
      },
      updatePaginatedNews: () => {
        const { categoryNews, currentPage, itemsPerPage } = get();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        set({
          paginatedNews: categoryNews.slice(startIndex, endIndex)
        });
      },
      goToPage: (page) => {
        set({ currentPage: page }, false, 'goToPage');
        get().updatePaginatedNews();
      },
      nextPage: () => {
        const { currentPage, categoryNews, itemsPerPage } = get();
        const maxPage = Math.ceil(categoryNews.length / itemsPerPage);
        if (currentPage < maxPage) {
          set({ currentPage: currentPage + 1 }, false, 'nextPage');
          get().updatePaginatedNews();
        }
      },

      prevPage: () => {
        const { currentPage } = get();
        if (currentPage > 1) {
          set({ currentPage: currentPage - 1 }, false, 'prevPage');
          get().updatePaginatedNews();
        }
      },

    }),
    {
      name: 'NewsStore',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);