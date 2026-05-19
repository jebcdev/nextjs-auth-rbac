/**
 * Botón de cierre de sesión responsivo.
 * 
 * Muestra icono + texto en pantallas sm+, solo icono en pantallas menores.
 */

"use client";


import { LogoutAction } from "../../actions";
import { Button } from "./button";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <form action={LogoutAction}>
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
      >
        <LogOut className="size-4 shrink-0" />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </Button>
    </form>
  );
};
