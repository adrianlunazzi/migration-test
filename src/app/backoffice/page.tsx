import { requireAdmin } from "@/shared/lib/auth";
import { logoutAction } from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";

export default async function BackofficePage() {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4">
      <p className="text-foreground">Hola, {admin.name}</p>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
