import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a raw File object to Supabase Storage and returns the public URL.
 */
export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    // 1. Generate a unique filename so images don't overwrite each other
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    // 2. Upload the raw file directly to Supabase
    const { error: uploadError } = await supabase.storage
      .from('marketplace-images') // Make sure this exactly matches your bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      throw new Error('Failed to upload image');
    }

    // 3. Get the clean, public URL
    const { data } = supabase.storage
      .from('marketplace-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};