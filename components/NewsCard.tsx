import { Image } from 'expo-image';
import { Text, TouchableOpacity, View } from "react-native";

interface NewsCardProps {
    id: number;
    headline: string;
    image: string;
    source: string;
    datetime: number;
    url: string;
    summary?: string;
    onPress: (id: number) => void
}

const NewsCard = ({
    id,
    headline,
    image,
    source,
    datetime,
    onPress
}: NewsCardProps) => {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            onPress={() => onPress(id)}
            className="flex-1 m-1 rounded-lg overflow-hidden bg-white/10"
            style={{ maxWidth: '48%' }}
        >
            <View className="h-40 relative">
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: 200 }}
                        contentFit="cover"
                    />
                ) : (
                    <View className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <Text className="text-gray-500">No Image</Text>
                    </View>
                )}
            </View>
            <View style={{ paddingTop: 20, paddingBottom: 20 }} className="px-1">
                <View style={{ marginBottom: 10, width: "100%" }} className="flex-row justify-between items-center mb-2">
                    <Text style={{ width: "40%" }} className="text-sm text-white/70">{source}</Text>
                    <Text style={{ width: "40%" }} className="text-sm text-white/70">{formatDate(datetime)}</Text>
                </View>
                <Text
                    className="text-base font-semibold text-white"
                    numberOfLines={2}
                >
                    {headline}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default NewsCard;