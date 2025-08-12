import { TrendingNews } from "@/lib/types";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";


type TrendingCardProps = {
    news: TrendingNews | null | undefined
    index: number
}

export const TrendingCard = ({ news, index }: TrendingCardProps) => {
    const router = useRouter(); 
    if (!news || typeof news !== 'object') {
        return (
            <View style={{ width: 160, marginRight: 16 }}>
                <View style={{
                    width: '100%',
                    height: 200,
                    backgroundColor: '#374151',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ color: 'white' }}>Loading...</Text>
                </View>
            </View>
        );
    }

    return (
          <Link
            href={{
                pathname: "/news/[id]", 
                params: {
                    id: String(news.$id || news.id),
                    headline: news.headline,
                    image: news.image,
                    source: news.source,
                    datetime: news.datetime,
                    url: news.url,
                   
                },
            }}
            asChild
        >
            <TouchableOpacity style={{ width: 160, marginRight: 16 }}>
                <View style={{ position: "relative" }}>
                    {news.image ? (
                        <Image
                            source={{ uri: news.image }}
                            style={{ width: "100%", height: 200, borderRadius: 8 }}
                            contentFit="cover"
                        />
                    ) : (
                        <View
                            style={{
                                width: "100%",
                                height: 200,
                                backgroundColor: "#374151",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ color: "white" }}>No Image</Text>
                        </View>
                    )}

                    <View
                        style={{
                            position: "absolute",
                            left: -8,
                            bottom: 16,
                            zIndex: 10,
                            width: 50,
                            height: 50,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                color: "white",
                                fontSize: 36,
                                textAlign: "center",
                            }}
                        >
                            {index + 1}
                        </Text>
                    </View>
                </View>

                <Text
                    style={{ color: "white", marginTop: 8, fontSize: 14 }}
                    numberOfLines={2}
                >
                    {news.headline}
                </Text>
            </TouchableOpacity>
        </Link>

    )
}