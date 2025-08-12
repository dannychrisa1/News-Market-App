import NewsCard from "@/components/NewsCard";
import { SearchBar } from "@/components/Searchbar";
import { TrendingCard } from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useNewsStore } from "@/hooks/useNewsStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {
   const router = useRouter();
   const { news, fetchNews, fetchTrendingNews, trendingNews, trendingLoading, trendingError, loading, error, searchQuery, setSearchQuery } = useNewsStore();



   useEffect(() => {
      fetchTrendingNews();
   }, []);

   useEffect(() => {
      fetchNews();
   }, []);

   return (
      <View className="flex-1 bg-primary">
         <Image source={images.bg} className="absolute w-full h-full z-0" />

         {/* Scrollable Content */}
         <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
         >
            {/* Fixed Header */}
            <View className="pt-20 px-1">
               <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />

               {loading || trendingLoading ? (
                  <ActivityIndicator
                     size="large" color="#ffffff"
                     className="mt-10 self-center"
                  />
               ) : error || trendingError ? (
                  <Text className="text-white">Error: {error || trendingError}</Text>
               ) : (
                  <View>
                     <SearchBar
                        onPress={() => router.push("/search")}
                        placeholder="Search for a news"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                     />

                     {/* Trending News Section */}
                     {trendingNews && trendingNews.length > 0 ? (
                        <View className="mt-10">
                           <Text className="text-lg ml-4 text-white font-bold mb-3">
                              Trending News
                           </Text>
                           <FlatList
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              data={trendingNews}
                              keyExtractor={(item) => item.$id || item.id?.toString() || Math.random().toString()}
                              renderItem={({ item, index }) => (
                                 <View className="">
                                    <TrendingCard news={item} index={index} />
                                 </View>
                              )}
                              contentContainerStyle={{
                                 paddingHorizontal: 16,
                                 paddingRight: 32
                              }}
                           />
                        </View>
                     ) : (
                        <View className="mt-10">
                           <Text className="text-lg ml-4 text-white font-bold mb-3">
                              Trending News
                           </Text>
                           <Text className="text-gray-400">No trending news available</Text>
                        </View>
                     )}

                     {/* Latest News Section */}
                     <View className="mt-6">
                        <Text className="text-lg text-white font-bold ml-4 mb-5">Latest News</Text>
                        <FlatList
                           scrollEnabled={false}
                           data={news.slice(0, 9)}
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
                              paddingBottom: 40,
                              paddingHorizontal: 16
                           }}
                        />
                     </View>
                  </View>
               )}
            </View>
         </ScrollView>
      </View>
   );
} 