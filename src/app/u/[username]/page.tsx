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
        title: `${profile.fullName} - PDI Platform`,
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

    // Convert MongoDB ObjectIds to string/cleanup for client component if needed
    // (In this case ProfileView mostly uses primitive types, but usually we serialize)
    const serializableProfile = {
        ...profile,
        _id: profile._id?.toString(),
        userId: profile.userId.toString(),
        // Safely handle dates whether they are Strings or Date objects
        createdAt: new Date(profile.createdAt).toISOString(),
        updatedAt: new Date(profile.updatedAt).toISOString(),
    };

    // ProfileView expects the raw Profile type but with dates/IDs. 
    // We need to cast or adjust. For simplicity, we just pass what we have
    // creating a quick mapped type or just asserting `any` for the ID fields if strictness is an issue.
    // Actually, let's fix the interface to match fetch or transform carefully.
    // We can just cast for now as the logic is display-only.

    return <ProfileView profile={serializableProfile as any} />;
}
