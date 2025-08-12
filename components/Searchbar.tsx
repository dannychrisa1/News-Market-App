import { icons } from "@/constants/icons"
import { Image, TextInput, View } from "react-native"


interface SearchBarProps {
    placeholder: string
    value?: string
    onChangeText?: (text: string) => void
    onPress?: () => void
}
export const SearchBar = ({ onPress, placeholder, value, onChangeText }: SearchBarProps) => {

    return (
        <View
            className="flex-row items-center rounded-full px-5 py-4"
            style={{ backgroundColor: '#0f0d23' }}
        >
            <Image source={icons.search} className="size-5 ml-2" resizeMode="contain"
                tintColor="#ab8bff" />
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#a8b5db"
                className="flex-1 ml-2 text-white"

            />
        </View>
    )
}