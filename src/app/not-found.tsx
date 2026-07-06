import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 text-8xl font-bold text-primary">404</div>

      <h1 className="mb-3 text-3xl font-bold text-foreground">
        Nivel no encontrado
      </h1>

      <p className="mb-8 max-w-md text-muted">
        Parece que te has salido del mapa. Esta zona del juego aun no ha sido
        desbloqueada o no existe en nuestro universo.
      </p>

      <div className="mb-8 text-6xl">🎮</div>

      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
