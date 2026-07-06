import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the user is a developer
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'developer') {
      return NextResponse.json(
        { error: 'Forbidden: Only developers can create submissions' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { title, description, file_url, file_type } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!file_type || !['pdf', 'image', 'video', 'note'].includes(file_type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be pdf, image, video, or note.' },
        { status: 400 }
      );
    }

    // For non-note types, file_url is required
    if (file_type !== 'note' && !file_url) {
      return NextResponse.json(
        { error: 'File URL is required for non-note submissions' },
        { status: 400 }
      );
    }

    // Create the submission
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        title: title.trim(),
        description: description || null,
        file_url: file_url || null,
        file_type,
        developer_id: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the user's own submissions ordered by created_at desc
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('developer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submissions: submissions || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
