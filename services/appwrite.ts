import { NewsItem, TrendingNews } from '@/lib/types';
import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)

//track search count

export const updateSearchCount = async (query: string, newie: NewsItem) => {
    try {
         const compositeKey = `${query}-${newie.id}`;
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
               Query.equal('compositeKey', compositeKey)
            // Query.equal('searchQuery', query)
        ])

        // check if record of the search has been stored
        if (result.documents.length > 0) {
            const existingNews = result.documents[0]

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingNews.$id,
                // if a document is found, increment the searchCount field
                {
                    count: existingNews.count + 1
                }
            )
        } else {

            //if no document is found , Create a new doucment in appwrite database
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                compositeKey,
                searchQuery: query,
                newsId: newie.id,
                count: 1,
                headline: newie.headline,
                image: newie.image || null,
                source: newie.source || "Unknown",
                url: newie.url || "#"
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getTrendingNews = async (): Promise<TrendingNews[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
            Query.select(['$id', 'headline', 'count', 'image', 'source', 'url'])
        ])

        // console.log('Raw Appwrite response:', JSON.stringify(result, null, 2));
        

        return result.documents as unknown as TrendingNews[]

    } catch (error) {
        console.log(error)
        return undefined
    }
}