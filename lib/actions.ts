'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from './supabase-server';

export type CreatePollInput = {
  title: string;
  description?: string;
  options: { text: string }[];
};

export async function createPoll(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const options = formData.get('options') as string;

    if (!title?.trim()) {
      throw new Error('Poll title is required');
    }

    // Parse options from form data
    const optionsArray = JSON.parse(options || '[]');
    if (!Array.isArray(optionsArray) || optionsArray.length < 2) {
      throw new Error('At least 2 options are required');
    }

    // Create poll in database
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        created_by: 'anonymous', // TODO: Replace with actual user ID when auth is implemented
      })
      .select()
      .single();

    if (pollError) {
      throw new Error('Failed to create poll');
    }

    // Create poll options
    const optionsToInsert = optionsArray.map((option: { text: string }) => ({
      poll_id: poll.id,
      text: option.text.trim(),
      votes: 0,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) {
      throw new Error('Failed to create poll options');
    }

    revalidatePath('/polls');
    redirect(`/polls/${poll.id}`);
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
}

export async function submitVote(pollId: string, optionId: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get current vote count and increment it
    const { data: currentOption, error: fetchError } = await supabase
      .from('poll_options')
      .select('votes')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single();

    if (fetchError || !currentOption) {
      throw new Error('Failed to fetch current vote count');
    }

    // Increment vote count for the selected option
    const { error } = await supabase
      .from('poll_options')
      .update({ votes: currentOption.votes + 1 })
      .eq('id', optionId)
      .eq('poll_id', pollId);

    if (error) {
      throw new Error('Failed to submit vote');
    }

    revalidatePath(`/polls/${pollId}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}
