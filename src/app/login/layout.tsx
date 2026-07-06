import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesion - Game Dev Work Review',
  description: 'Inicia sesion para acceder a tu espacio de trabajo',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
