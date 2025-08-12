export interface NewsItem {
    id: number;
    image: string;
    source: string;
    datetime: number;
    headline: string;
    url: string;
}
export interface TrendingNews {
    id: number;
    $id: string; 
    image: string;
    source: string;
    datetime: number;
    headline: string;
    url: string;
    searchQuery:string
}
