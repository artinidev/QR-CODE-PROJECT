import { getDatabase } from '@/lib/mongodb';
import { Profile } from '@/types/models';
import { notFound } from 'next/navigation';
import ProfileView from '@/components/profile/ProfileView';
import { Metadata } from 'next';
import { ObjectId } from 'mongodb';

interface PageProps {
    params: Promise<{
        username: string;
    }>;
}

// Function to fetch profile data directly from DB (Server Component)
async function getProfile(identifier: string): Promise<Profile | null> {
    const db = await getDatabase();
    const profilesCollection = db.collection<Profile>('profiles');

    // Check if identifier is a valid ObjectId
    if (ObjectId.isValid(identifier)) {
        const profileById = await profilesCollection.findOne({ _id: new ObjectId(identifier) });
        if (profileById) return profileById;
    }

    // Fallback search by username
    const profileByUsername = await profilesCollection.findOne({ username: identifier });
    if (profileByUsername) return profileByUsername;

    // Fallback: Check if identifier matches custom slug/username field if implemented
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const profile = await getProfile(username);

    if (!profile) {
        return {
            title: 'Profile Not Found',
        }
    }

    return {
        title: `${profile.fullName} - SCANEX`,
        description: `${profile.jobTitle} at ${profile.company}`,
    }
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;

    if (!username) {
        notFound();
    }

    const profile = await getProfile(username);
    console.log(`[PublicProfile] Fetching for username: ${username}`, profile);

    if (!profile) {
        console.log(`[PublicProfile] Not found for username: ${username}`);
        notFound();
    }

    // Convert MongoDB ObjectIds to string/cleanup for client component
    const serializableProfile = {
        ...profile,
        _id: profile._id?.toString(),
        userId: profile.userId.toString(),
        createdAt: new Date(profile.createdAt).toISOString(),
        updatedAt: new Date(profile.updatedAt).toISOString(),
    };

    let themeConfig = profile.themeConfig;

    // Check for Brand Kit Override
    if (profile.brandKitId) {
        try {
            const db = await getDatabase();
            // Ensure ID is ObjectId
            const kitId = new ObjectId(profile.brandKitId.toString());
            const brandKit = await db.collection('brandKits').findOne({ _id: kitId });

            if (brandKit && brandKit.config) {
                console.log(`[PublicProfile] Applying Brand Kit: ${brandKit.name}`);
                themeConfig = brandKit.config;
            }
        } catch (e) {
            console.error("[PublicProfile] Error fetching Brand Kit", e);
        }
    }

    return <ProfileView profile={serializableProfile as any} themeConfig={themeConfig} />;
}
