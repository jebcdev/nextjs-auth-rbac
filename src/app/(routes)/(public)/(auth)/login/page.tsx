import { LoginForm } from "@/features/auth/components";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui";

export default function AuthLoginPage() {
    return (
        <Card className="rounded-xl border">
            <CardHeader className="space-y-1 rounded-2xl">
                <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
                <CardDescription className="text-center">
                    Ingresa tu email y contraseña para acceder
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
    );
}
