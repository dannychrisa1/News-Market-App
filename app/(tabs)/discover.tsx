import NewsCard from "@/components/NewsCard";
import { images } from "@/constants/images";
import { useNewsStore } from "@/hooks/useNewsStore";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DiscoverPage() {
    const {
        paginatedNews, // Use paginatedNews instead of categoryNews
        currentPage,
        itemsPerPage,
        categoryNews,
        currentCategory,
        categories,
        loading,
        error,
        fetchCategoryNews,
        nextPage,
    } = useNewsStore();

    const router = useRouter();
    const totalPages = Math.ceil(categoryNews.length / itemsPerPage);

    // Fetch initial category data (general)
    useEffect(() => {
        fetchCategoryNews(currentCategory);
    }, []);

    return (
        <View className="flex-1 bg-primary">
            <Stack.Screen options={{ headerShown: false }} />
            <Image source={images.bg} className="absolute w-full z-0" />

            {/* Category Selector */}
            <ScrollView
                horizontal
                className="mb-6 mt-20 ml-4 pb-4"
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => fetchCategoryNews(category)}
                        style={{ width: "50%", height: 40 }}
                        className={`py-2 mr-2 flex items-center justify-center rounded-full ${currentCategory === category ? "bg-accent" : "bg-white/10"
                            }`}
                    >
                        <Text style={{ width: '50%' }} className="text-white capitalize">
                            {category === 'forex' ? 'Forex' :
                                category === 'crypto' ? 'Crypto' :
                                    category === 'merger' ? 'Mergers' :
                                        'General'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* News List */}
            {loading ? (
                <ActivityIndicator size="large" color="#ffffff" className="mt-10" />
            ) : error ? (
                <Text className="text-white">Error: {error}</Text>
            ) : (
                <>
                    <FlatList
                        data={paginatedNews}
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
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        onEndReached={() => {
                            // Trigger load more when user scrolls near bottom
                            if (!loading && currentPage < totalPages) {
                                nextPage();
                            }
                        }}
                        onEndReachedThreshold={0.5} // triggers when 50% from bottom
                        ListFooterComponent={
                            loading ? <ActivityIndicator size="large" color="#ffffff" /> : null
                        }
                    />


                </>
            )}
        </View>
    );
}