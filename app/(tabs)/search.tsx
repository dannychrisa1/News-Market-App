// app/search.tsx
import NewsCard from "@/components/NewsCard";
import { SearchBar } from "@/components/Searchbar";
import { images } from "@/constants/images";
import { useNewsStore } from "@/hooks/useNewsStore";
import { updateSearchCount } from "@/services/appwrite";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function SearchPage() {
    const {
        filteredNews,
        news,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        trackSearch,
    } = useNewsStore();

    const router = useRouter();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showNoResults = searchQuery && !filteredNews.length && !loading && !error;

    // Debounce function
    const debounce = (func: Function, delay: number) => {
        return (...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => func(...args), delay);
        };
    };

    // Debounced version of setSearchQuery
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setSearchQuery(query);
            if (query && news.length > 0) {
                updateSearchCount(query, news[0]);
            }
        }, 500), // 500ms delay
        [setSearchQuery, news]
    );

    // Handle local input changes
    const handleSearchChange = (text: string) => {
        setLocalSearchQuery(text);
        debouncedSearch(text);


    };
    useEffect(() => {
        // Only run if there's a search query AND filtered news items exist
        if (searchQuery && filteredNews.length > 0 && filteredNews[0]) {
          trackSearch(searchQuery, filteredNews[0]).catch(console.error);
        }
    }, [searchQuery, filteredNews, trackSearch]); 

    return (
        <View className="flex-1 bg-primary">
            <Stack.Screen options={{ headerShown: false }} />
            <Image source={images.bg} className="absolute w-full z-0" />

            <View className="pt-20 px-1">
                <SearchBar
                    placeholder="Search for a news"
                    value={localSearchQuery}
                    onChangeText={handleSearchChange}
                />

                {loading ? (
                    <ActivityIndicator
                        size="large" color="#ffffff"
                        className="mt-10 self-center"
                    />
                ) : error ? (
                    <Text className="text-white">Error: {error}</Text>
                ) : showNoResults ? (
                    <View className="mt-10 items-center">
                        <Text className="text-white text-lg">
                            No news with "{searchQuery}" found
                        </Text>
                        <Text className="text-white/70 mt-2">
                            Try different keywords
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredNews}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={{
                            justifyContent: 'space-between',
                            marginBottom: 10
                        }}
                        renderItem={({ item }) => (
                            <NewsCard
                                id={item.id}
                                headline={item.headline}
                                image={item.image}
                                source={item.source}
                                datetime={item.datetime}
                                url={item.url}
                                onPress={() => router.push({
                                    pathname: "/news/[id]",
                                    params: {
                                        id: item.id.toString(),
                                        headline: item.headline,
                                        image: item.image || '',
                                        source: item.source,
                                        datetime: item.datetime.toString(),
                                        url: item.url
                                    }
                                })}
                            />
                        )}
                        contentContainerStyle={{
                            paddingBottom: 20,
                            paddingHorizontal: 20
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}