import { getCurrentSessionAction } from "@/features/shared/actions/get-current-session.action";
import { LogoutButton } from "@/features/shared/components/ui";

export default async function UserProfilePage() {
    const { currentUser } = await getCurrentSessionAction();

    return (
        <>
            <main>
              <h2>Datos del usuario</h2>
              <br />
              <br />
              <LogoutButton />
              <hr />
              <br />
              <br />
                <pre>{JSON.stringify(currentUser, null, 2)}</pre>
            </main>
        </>
    );
}
