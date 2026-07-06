import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { SubmissionList } from '@/components/SubmissionList';

interface DeveloperDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DeveloperDetailPage({
  params,
}: DeveloperDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify the current user is a CEO
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!currentProfile || currentProfile.role !== 'ceo') {
    redirect('/dashboard');
  }

  // Fetch the developer profile (verify that the ID belongs to a developer)
  const { data: developer } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'developer')
    .single();

  if (!developer) {
    redirect('/dashboard/ceo');
  }

  // Fetch all submissions for this developer
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('developer_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard/ceo"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Team Overview
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-4">
          {developer.avatar_url ? (
            <img
              src={developer.avatar_url}
              alt={developer.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary ring-2 ring-border">
              {developer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {developer.name}
            </h2>
            <p className="text-sm text-muted">{developer.email}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Submissions ({submissions?.length || 0})
          </h3>
        </div>

        <SubmissionList
          submissions={submissions || []}
          showActions={true}
        />
      </main>
    </div>
  );
}
