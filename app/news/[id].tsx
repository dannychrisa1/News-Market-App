import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const NewsDetails = () => {
    const {
        id,
        headline,
        image,
        source,
        datetime,
        url,
        summary
    } = useLocalSearchParams();

    const router = useRouter();

    const formatDate = (timestamp: string) => {
        if (!timestamp) return '';
        
        // If timestamp is a number string (e.g., UNIX seconds)
        if (/^\d+$/.test(timestamp)) {
            return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Otherwise try to parse it as ISO date
        const date = new Date(timestamp);
        return !isNaN(date.getTime())
            ? date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : '';
    };

    return (
        <ScrollView className="flex-1 bg-primary">
            <View className="p-5">
                <TouchableOpacity
                    className="mb-4"
                    onPress={() => router.back()}
                >
                    <ArrowLeft color="#ffffff" size={24} />
                </TouchableOpacity>

                <View className="bg-white/10 rounded-lg overflow-hidden">
                    {image ? (
                        <View className="h-64 relative">
                            <Image
                                source={{ uri: image as string }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                        </View>
                    ) : (
                        <View className="h-64 bg-gray-700 items-center justify-center">
                            <Text className="text-white">No Image Available</Text>
                        </View>
                    )}

                    <View className="p-5">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-sm font-medium text-blue-400">{source}</Text>
                            <Text className="text-sm text-white/70">
                                {formatDate(datetime as string)}
                            </Text>
                        </View>

                        <Text className="text-2xl font-bold mb-4 text-white">{headline}</Text>

                        {summary && (
                            <View className="mb-6">
                                <Text className="text-white/80">{summary}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default NewsDetails;
