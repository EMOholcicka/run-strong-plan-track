
import { supabase } from '@/integrations/supabase/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    profile: UserProfile;
  };
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  goals?: string;
  stravaConnected?: boolean;
  stravaUserId?: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('No user returned from login');
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        profile: {
          firstName: profile?.first_name || undefined,
          lastName: profile?.last_name || undefined,
          dateOfBirth: profile?.date_of_birth || undefined,
          height: profile?.height || undefined,
          weight: profile?.weight ? Number(profile.weight) : undefined,
          activityLevel: profile?.activity_level || undefined,
          goals: profile?.goals || undefined,
          stravaConnected: profile?.strava_connected || false,
          stravaUserId: profile?.strava_user_id || undefined,
        }
      }
    };
  }

  async signUp(credentials: SignUpRequest): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('No user returned from signup');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        profile: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          stravaConnected: false,
        }
      }
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      profile: {
        firstName: profile?.first_name || undefined,
        lastName: profile?.last_name || undefined,
        dateOfBirth: profile?.date_of_birth || undefined,
        height: profile?.height || undefined,
        weight: profile?.weight ? Number(profile.weight) : undefined,
        activityLevel: profile?.activity_level || undefined,
        goals: profile?.goals || undefined,
        stravaConnected: profile?.strava_connected || false,
        stravaUserId: profile?.strava_user_id || undefined,
      }
    };
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to update profile');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        date_of_birth: updates.dateOfBirth,
        height: updates.height,
        weight: updates.weight,
        activity_level: updates.activityLevel as any,
        goals: updates.goals,
        strava_connected: updates.stravaConnected,
        strava_user_id: updates.stravaUserId,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      throw error;
    }
  }

  isAuthenticated(): boolean {
    // This will be handled by the auth context
    return false;
  }
}

export const authService = new AuthService();
