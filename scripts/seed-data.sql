-- Insert initial badges
INSERT INTO badges (name, slug, description, icon, rarity) VALUES
('Early Adopter', 'early-adopter', 'One of the first users to join Genesis', '🚀', 'rare'),
('Streak Master', 'streak-master', 'Maintained a 7-day activity streak', '🔥', 'common'),
('Community Helper', 'community-helper', 'Helped 10 community members', '🤝', 'common'),
('Top Contributor', 'top-contributor', 'Made 50+ valuable posts', '⭐', 'rare'),
('Mentor', 'mentor', 'Successfully mentored 5+ people', '👨‍🏫', 'epic'),
('AI Expert', 'ai-expert', 'Demonstrated expertise in AI field', '🧠', 'rare'),
('Security Guru', 'security-guru', 'Cybersecurity expert with proven track record', '🛡️', 'epic'),
('Design Master', 'design-master', 'Created outstanding design work', '🎨', 'rare'),
('Code Ninja', 'code-ninja', 'Exceptional programming skills', '⚡', 'epic'),
('Data Wizard', 'data-wizard', 'Master of data analysis and insights', '🔮', 'rare'),
('Growth Hacker', 'growth-hacker', 'Achieved remarkable growth metrics', '📈', 'epic'),
('Innovation Leader', 'innovation-leader', 'Led innovative projects and initiatives', '💡', 'legendary'),
('First Post', 'first-post', 'Created your first community post', '✍️', 'common'),
('Networking Pro', 'networking-pro', 'Connected with 50+ professionals', '🌐', 'rare'),
('Knowledge Seeker', 'knowledge-seeker', 'Completed 10+ learning modules', '📚', 'common');

-- Insert sample communities (these will be created automatically when users select domains)
INSERT INTO communities (name, domain_slug, description, member_count) VALUES
('AI/ML Community', 'ai-ml', 'Connect with AI and Machine Learning enthusiasts and professionals', 1250),
('Cybersecurity Community', 'cybersecurity', 'Share knowledge and stay updated on cybersecurity trends', 890),
('UI/UX Design Community', 'ui-ux', 'Showcase designs and discuss user experience best practices', 1100),
('Software Development Community', 'development', 'Code, collaborate, and grow as developers', 2100),
('Digital Marketing Community', 'marketing', 'Growth strategies, campaigns, and marketing insights', 750),
('Law & Legal Community', 'law', 'Legal professionals and law students networking hub', 420),
('Medicine & Healthcare Community', 'medicine', 'Healthcare professionals sharing knowledge and experiences', 680),
('Politics & Policy Community', 'politics', 'Discuss policy, governance, and political developments', 340),
('Film & Media Community', 'film', 'Filmmakers, content creators, and media professionals', 560),
('Music & Audio Community', 'music', 'Musicians, producers, and audio engineers collaboration space', 380),
('Business & Finance Community', 'business', 'Business leaders, entrepreneurs, and finance professionals', 920),
('Education & Teaching Community', 'teaching', 'Educators sharing resources and teaching methodologies', 640),
('Agriculture & Sustainability Community', 'agriculture', 'Sustainable farming, food tech, and environmental solutions', 290);

-- Insert sample posts for demonstration
INSERT INTO community_posts (user_id, community_id, content, post_type, likes_count, comments_count) VALUES
-- We'll use placeholder UUIDs for now - these would be real user IDs in production
('00000000-0000-0000-0000-000000000001', 
 (SELECT id FROM communities WHERE domain_slug = 'ai-ml' LIMIT 1),
 'Just completed my first machine learning project using TensorFlow! Built a recommendation system that achieved 87% accuracy. The journey from data preprocessing to model deployment was incredible. Key learnings: feature engineering is crucial, and proper validation prevents overfitting. Next up: exploring transformer architectures! 🤖✨',
 'project',
 24,
 8),

('00000000-0000-0000-0000-000000000002',
 (SELECT id FROM communities WHERE domain_slug = 'cybersecurity' LIMIT 1),
 'Sharing insights from my recent penetration testing engagement. Discovered a critical SQL injection vulnerability that could have exposed sensitive customer data. This reinforces why security should be built into the development process from day one, not added as an afterthought. Remember: security is everyone''s responsibility! 🔒',
 'text',
 31,
 12),

('00000000-0000-0000-0000-000000000003',
 (SELECT id FROM communities WHERE domain_slug = 'ui-ux' LIMIT 1),
 'Excited to share my latest UI design for a fintech mobile app! Focused heavily on accessibility and inclusive design principles. Used high contrast ratios, clear typography, and intuitive navigation patterns. The client was thrilled with the user testing results - 95% task completion rate! Design is not just about aesthetics, it''s about creating meaningful experiences. 🎨📱',
 'project',
 18,
 5),

('00000000-0000-0000-0000-000000000004',
 (SELECT id FROM communities WHERE domain_slug = 'development' LIMIT 1),
 'Just deployed my first full-stack application using Next.js 14 and Supabase! The new App Router is a game-changer for performance and developer experience. Implemented real-time features, authentication, and a responsive design. The learning curve was steep but totally worth it. Open to feedback and collaboration opportunities! 💻🚀',
 'project',
 42,
 15),

('00000000-0000-0000-0000-000000000005',
 (SELECT id FROM communities WHERE domain_slug = 'marketing' LIMIT 1),
 'Growth hack alert! 📈 Increased our SaaS signup rate by 340% using a combination of personalized email sequences, social proof optimization, and strategic A/B testing. The key was understanding our user journey and removing friction at every touchpoint. Happy to share the detailed playbook with anyone interested!',
 'text',
 67,
 23);

-- Insert sample AI recommendations
INSERT INTO ai_recommendations (user_id, recommendation_type, title, description, priority, metadata) VALUES
('00000000-0000-0000-0000-000000000001', 'skill', 'Learn React Native', 'Based on your web development skills, learning React Native would allow you to build mobile applications and increase your market value.', 1, '{"estimated_time": "4-6 weeks", "difficulty": "intermediate"}'),
('00000000-0000-0000-0000-000000000001', 'project', 'Build a Portfolio Website', 'Create a personal portfolio website to showcase your projects and skills to potential employers and clients.', 2, '{"technologies": ["Next.js", "Tailwind CSS", "Vercel"], "estimated_time": "1-2 weeks"}'),
('00000000-0000-0000-0000-000000000002', 'resource', 'Cybersecurity Certification', 'Consider pursuing the CISSP certification to advance your cybersecurity career and increase earning potential.', 1, '{"provider": "ISC2", "cost": "$749", "duration": "6 months prep"}'),
('00000000-0000-0000-0000-000000000003', 'mentor', 'Connect with Senior UX Designer', 'We found a senior UX designer in your area who specializes in fintech applications and is available for mentorship.', 3, '{"mentor_name": "Sarah Johnson", "experience": "8 years", "company": "Stripe"});
