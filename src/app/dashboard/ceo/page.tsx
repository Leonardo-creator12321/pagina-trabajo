import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { DeveloperCard } from '@/components/DeveloperCard';

export default async function CeoDashboardPage() {
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

  if (!profile || profile.role !== 'ceo') {
    redirect('/dashboard');
  }

  // Fetch all developer profiles
  const { data: developers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'developer');

  // Fetch submission counts for each developer
  const { data: submissions } = await supabase
    .from('submissions')
    .select('developer_id');

  const submissionCounts: Record<string, number> = {};
  if (submissions) {
    submissions.forEach((s) => {
      submissionCounts[s.developer_id] = (submissionCounts[s.developer_id] || 0) + 1;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Team Overview</h2>
          <p className="mt-1 text-sm text-muted">
            View and manage your development team&apos;s submissions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {developers?.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              submissionCount={submissionCounts[developer.id] || 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
