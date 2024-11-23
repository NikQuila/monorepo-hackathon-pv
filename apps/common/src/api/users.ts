import { supabase } from '../supabase';

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();
    if (userError) throw userError;
    return userData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<any>
) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update user profile');
  }
};
