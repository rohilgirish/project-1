import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, preferredDate, plotNumber, type, budget } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    const lead = {
      id: Date.now().toString(),
      fullName,
      phone,
      email: email || '',
      preferredDate: preferredDate || '',
      plotNumber: plotNumber || '',
      type: type || 'enquiry',
      budget: budget || '',
      createdAt: new Date().toISOString()
    };

    let supabaseSynced = false;

    // Persist to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('leads').insert([
          {
            full_name: lead.fullName,
            phone: lead.phone,
            email: lead.email,
            preferred_date: lead.preferredDate,
            plot_number: lead.plotNumber,
            type: lead.type,
            budget: lead.budget,
            created_at: lead.createdAt
          }
        ]);

        if (error) {
          console.error('Supabase insert error:', error.message);
        } else {
          supabaseSynced = true;
        }
      } catch (dbErr) {
        console.error('Supabase connection error:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead recorded successfully',
        lead,
        supabaseSynced
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Internal server error processing lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // Format snake_case from Postgres to camelCase for the frontend
      const mapped = (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id || ''),
        fullName: String(row.full_name || row.fullName || ''),
        phone: String(row.phone || ''),
        email: String(row.email || ''),
        preferredDate: String(row.preferred_date || row.preferredDate || ''),
        plotNumber: String(row.plot_number || row.plotNumber || ''),
        type: String(row.type || 'enquiry'),
        budget: String(row.budget || ''),
        createdAt: String(row.created_at || row.createdAt || new Date().toISOString())
      }));

      return NextResponse.json({
        success: true,
        source: 'supabase',
        leads: mapped
      });
    }

    return NextResponse.json({
      success: true,
      source: 'local_mode',
      leads: [],
      message: 'Supabase credentials not detected; falling back to client local storage.'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error fetching leads' },
      { status: 500 }
    );
  }
}
