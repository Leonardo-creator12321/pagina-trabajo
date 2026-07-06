import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 text-6xl">🎮</div>

        <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
          Game Dev
          <span className="block text-primary">Work Review</span>
        </h1>

        <p className="mb-8 text-lg text-muted">
          Plataforma de revision de trabajo para equipos de desarrollo de
          videojuegos. Gestiona entregas, sube evidencias y mantiene al equipo
          sincronizado.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Iniciar Sesion
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 text-2xl">📋</div>
            <h3 className="text-sm font-medium text-foreground">
              Gestiona entregas
            </h3>
            <p className="mt-1 text-xs text-muted">
              Organiza y revisa el trabajo del equipo
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 text-2xl">📁</div>
            <h3 className="text-sm font-medium text-foreground">
              Sube evidencias
            </h3>
            <p className="mt-1 text-xs text-muted">
              PDFs, imagenes, videos y notas
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 text-2xl">✅</div>
            <h3 className="text-sm font-medium text-foreground">
              Aprueba o revisa
            </h3>
            <p className="mt-1 text-xs text-muted">
              Control de estado de cada entrega
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
