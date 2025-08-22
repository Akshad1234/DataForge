-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    global_rank INTEGER,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    selected_domains TEXT[] DEFAULT '{}',
    social_handles JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    domain_slug TEXT NOT NULL,
    description TEXT,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community memberships
CREATE TABLE community_memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, community_id)
);

-- Community posts
CREATE TABLE community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    post_type TEXT DEFAULT 'text',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post interactions (likes, bookmarks, etc.)
CREATE TABLE post_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- 'like', 'bookmark', 'share'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id, interaction_type)
);

-- Comments on posts
CREATE TABLE post_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges system
CREATE TABLE badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
    criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges (earned badges)
CREATE TABLE user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Mentorship relationships
CREATE TABLE mentorships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    domain_slug TEXT,
    status TEXT DEFAULT 'active', -- active, completed, cancelled
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(mentor_id, mentee_id, domain_slug)
);

-- User activities for tracking engagement and streaks
CREATE TABLE user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- post_created, comment_added, login, etc.
    activity_date DATE DEFAULT CURRENT_DATE,
    xp_earned INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI feedback and recommendations
CREATE TABLE ai_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL, -- skill, project, resource, mentor
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending', -- pending, accepted, dismissed
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_xp ON user_profiles(xp DESC);
CREATE INDEX idx_user_profiles_streak ON user_profiles(streak_count DESC);
CREATE INDEX idx_community_posts_community ON community_posts(community_id, created_at DESC);
CREATE INDEX idx_community_posts_user ON community_posts(user_id, created_at DESC);
CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, activity_date DESC);
CREATE INDEX idx_community_memberships_user ON community_memberships(user_id);
CREATE INDEX idx_mentorships_mentor ON mentorships(mentor_id, status);
CREATE INDEX idx_mentorships_mentee ON mentorships(mentee_id, status);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for community_posts
CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Policies for post_interactions
CREATE POLICY "Users can view all interactions" ON post_interactions FOR SELECT USING (true);
CREATE POLICY "Users can manage own interactions" ON post_interactions FOR ALL USING (auth.uid() = user_id);

-- Policies for post_comments
CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_badges
CREATE POLICY "Users can view all badges" ON user_badges FOR SELECT USING (true);

-- Policies for mentorships
CREATE POLICY "Users can view mentorships they're part of" ON mentorships FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Users can update mentorships they're part of" ON mentorships FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Policies for user_activities
CREATE POLICY "Users can view own activities" ON user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for ai_recommendations
CREATE POLICY "Users can view own recommendations" ON ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_user_xp(user_uuid UUID, xp_to_add INTEGER)
RETURNS VOID AS $$
DECLARE
    current_xp INTEGER;
    new_level INTEGER;
BEGIN
    -- Get current XP
    SELECT xp INTO current_xp FROM user_profiles WHERE id = user_uuid;
    
    -- Update XP
    UPDATE user_profiles 
    SET xp = xp + xp_to_add,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Calculate new level (every 1000 XP = 1 level)
    new_level := FLOOR((current_xp + xp_to_add) / 1000) + 1;
    
    -- Update level if changed
    UPDATE user_profiles 
    SET level = new_level
    WHERE id = user_uuid AND level < new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    last_activity DATE;
    current_streak INTEGER;
BEGIN
    -- Get last activity date and current streak
    SELECT last_activity_date, streak_count 
    INTO last_activity, current_streak 
    FROM user_profiles WHERE id = user_uuid;
    
    -- Check if activity is consecutive
    IF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Continue streak
        UPDATE user_profiles 
        SET streak_count = streak_count + 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = user_uuid;
    ELSIF last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
        -- Reset streak
        UPDATE user_profiles 
        SET streak_count = 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = user_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE communities 
        SET member_count = member_count + 1 
        WHERE id = NEW.community_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE communities 
        SET member_count = member_count - 1 
        WHERE id = OLD.community_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_community_member_count_trigger
    AFTER INSERT OR DELETE ON community_memberships
    FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Function to update post interaction counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.interaction_type = 'like' THEN
            UPDATE community_posts 
            SET likes_count = likes_count + 1 
            WHERE id = NEW.post_id;
        ELSIF NEW.interaction_type = 'bookmark' THEN
            UPDATE community_posts 
            SET bookmarks_count = bookmarks_count + 1 
            WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.interaction_type = 'like' THEN
            UPDATE community_posts 
            SET likes_count = likes_count - 1 
            WHERE id = OLD.post_id;
        ELSIF OLD.interaction_type = 'bookmark' THEN
            UPDATE community_posts 
            SET bookmarks_count = bookmarks_count - 1 
            WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_post_counts_trigger
    AFTER INSERT OR DELETE ON post_interactions
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();
