import { Button } from "@/features/shared/components/ui";

export default function HomePage() {
    return (
        <>
            <main>
                <h1>
                    <Button variant={"default"}>default</Button>
                    <Button variant={"secondary"}>secondary</Button>
                    <Button variant={"destructive"}>destructive</Button>
                    <Button variant={"outline"}>outline</Button>
                    <Button variant={"ghost"}>ghost</Button>
                    <Button variant={"link"}>link</Button>
                </h1>
            </main>
        </>
    );
}
