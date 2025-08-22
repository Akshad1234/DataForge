-- Genesis Platform Database Schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career domains table
CREATE TABLE career_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User domains (many-to-many relationship)
CREATE TABLE user_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES career_domains(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, domain_id)
);

-- Social platforms table
CREATE TABLE social_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(20) UNIQUE NOT NULL,
    icon VARCHAR(50),
    base_url VARCHAR(255)
);

-- User social handles
CREATE TABLE user_social_handles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES social_platforms(id) ON DELETE CASCADE,
    handle VARCHAR(100) NOT NULL,
    url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform_id)
);

-- Communities table
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    domain_id UUID REFERENCES career_domains(id),
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community memberships
CREATE TABLE community_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- member, moderator, admin
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, community_id)
);

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'text', -- text, project, achievement, question
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post interactions
CREATE TABLE post_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- like, bookmark, share
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id, interaction_type)
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    criteria JSONB, -- Criteria for earning the badge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Mentorship relationships
CREATE TABLE mentorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES career_domains(id),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(mentor_id, mentee_id, domain_id)
);

-- User activities for streak tracking
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- post_created, comment_added, project_shared, etc.
    activity_date DATE DEFAULT CURRENT_DATE,
    xp_earned INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboards (materialized view for performance)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.avatar_url,
    u.level,
    u.xp,
    u.streak_count,
    d.name as primary_domain,
    ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.streak_count DESC) as global_rank
FROM users u
LEFT JOIN user_domains ud ON u.id = ud.user_id
LEFT JOIN career_domains d ON ud.domain_id = d.id
WHERE u.xp > 0;

-- Create indexes for better performance
CREATE INDEX idx_users_xp ON users(xp DESC);
CREATE INDEX idx_users_streak ON users(streak_count DESC);
CREATE INDEX idx_posts_community ON posts(community_id, created_at DESC);
CREATE INDEX idx_posts_user ON posts(user_id, created_at DESC);
CREATE INDEX idx_user_activities_date ON user_activities(user_id, activity_date DESC);
CREATE INDEX idx_community_memberships_user ON community_memberships(user_id);
CREATE INDEX idx_mentorships_mentor ON mentorships(mentor_id, status);
CREATE INDEX idx_mentorships_mentee ON mentorships(mentee_id, status);

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp(user_uuid UUID, xp_to_add INTEGER)
RETURNS VOID AS $$
DECLARE
    current_xp INTEGER;
    new_level INTEGER;
BEGIN
    -- Get current XP
    SELECT xp INTO current_xp FROM users WHERE id = user_uuid;
    
    -- Update XP
    UPDATE users 
    SET xp = xp + xp_to_add,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Calculate new level (every 500 XP = 1 level)
    new_level := FLOOR((current_xp + xp_to_add) / 500) + 1;
    
    -- Update level if changed
    UPDATE users 
    SET level = new_level
    WHERE id = user_uuid AND level < new_level;
END;
$$ LANGUAGE plpgsql;

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
    FROM users WHERE id = user_uuid;
    
    -- Check if activity is consecutive
    IF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Continue streak
        UPDATE users 
        SET streak_count = streak_count + 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = user_uuid;
    ELSIF last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
        -- Reset streak
        UPDATE users 
        SET streak_count = 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = user_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql;
