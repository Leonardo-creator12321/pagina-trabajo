import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { DeveloperPanelContent } from './DeveloperPanelContent';

export default async function MyPanelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  if (profile.role === 'ceo') {
    redirect('/dashboard/ceo');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome, {profile.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Upload your work evidence and track your submissions
          </p>
        </div>

        <DeveloperPanelContent />
      </main>
    </div>
  );
}
