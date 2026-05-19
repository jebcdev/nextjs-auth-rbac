import { ProfileCard } from "@/features/private/user/profile/profile-card";
import { getCurrentSessionAction } from "@/features/shared/actions/get-current-session.action";

export default async function UserProfilePage() {
    const { currentUser } = await getCurrentSessionAction();

    return (
        <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4 sm:p-6 md:p-8">
            <ProfileCard data={currentUser!} />
        </main>
    );
}