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
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('You must be logged in to create a poll');
    }
    
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
        created_by: user.id,
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
    redirect(`/polls/${pollId}`);
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}

export async function deletePoll(pollId: string) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Delete the poll (this will cascade delete poll options due to foreign key constraint)
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);

    if (error) {
      throw new Error('Failed to delete poll');
    }

    revalidatePath('/polls');
    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    throw error;
  }
}

export async function updatePoll(updateData: {
  pollId: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
}) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Update poll details
    const { error: pollError } = await supabase
      .from('polls')
      .update({
        title: updateData.title,
        description: updateData.description || null,
      })
      .eq('id', updateData.pollId);

    if (pollError) {
      throw new Error('Failed to update poll');
    }

    // Get existing options to compare
    const { data: existingOptions, error: fetchError } = await supabase
      .from('poll_options')
      .select('id, text')
      .eq('poll_id', updateData.pollId);

    if (fetchError) {
      throw new Error('Failed to fetch existing options');
    }

    // Update existing options and add new ones
    for (const option of updateData.options) {
      if (option.id.startsWith('new_')) {
        // This is a new option
        const { error: insertError } = await supabase
          .from('poll_options')
          .insert({
            poll_id: updateData.pollId,
            text: option.text,
            votes: 0,
          });

        if (insertError) {
          throw new Error('Failed to add new option');
        }
      } else {
        // This is an existing option - update if text changed
        const existingOption = existingOptions?.find(opt => opt.id === option.id);
        if (existingOption && existingOption.text !== option.text) {
          const { error: updateError } = await supabase
            .from('poll_options')
            .update({ text: option.text })
            .eq('id', option.id);

          if (updateError) {
            throw new Error('Failed to update option');
          }
        }
      }
    }

    // Remove options that are no longer in the list
    const currentOptionIds = updateData.options
      .filter(opt => !opt.id.startsWith('new_'))
      .map(opt => opt.id);

    const optionsToRemove = existingOptions?.filter(opt => !currentOptionIds.includes(opt.id)) || [];
    
    for (const option of optionsToRemove) {
      const { error: deleteError } = await supabase
        .from('poll_options')
        .delete()
        .eq('id', option.id);

      if (deleteError) {
        throw new Error('Failed to remove option');
      }
    }

    revalidatePath('/polls');
    revalidatePath(`/polls/${updateData.pollId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating poll:', error);
    throw error;
  }
}
