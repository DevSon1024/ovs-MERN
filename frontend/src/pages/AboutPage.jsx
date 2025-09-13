import React from 'react';

const teamMembers = [
  {
    name: 'Dev Son',
    roleNumber: '12345',
    contributions: 'Lead Developer - Worked on backend architecture, database design, and API development. Implemented user authentication and voting logic.',
    avatarUrl: 'https://placehold.co/128x128/667eea/ffffff?text=DS'
  },
  {
    name: 'Partner Two',
    roleNumber: '67890',
    contributions: 'Frontend Developer - Designed and developed the user interface, created reusable React components, and handled state management.',
    avatarUrl: 'https://placehold.co/128x128/764ba2/ffffff?text=P2'
  },
  {
    name: 'Partner Three',
    roleNumber: '11223',
    contributions: 'UI/UX Designer & Tester - Created wireframes and mockups, ensured a user-friendly experience, and performed quality assurance testing.',
    avatarUrl: 'https://placehold.co/128x128/5a67d8/ffffff?text=P3'
  }
];

const technologies = [
  { name: 'React', description: 'For building the user interface' },
  { name: 'Node.js', description: 'For the server-side runtime' },
  { name: 'Express', description: 'As the backend framework' },
  { name: 'MongoDB', description: 'For the database' },
  { name: 'Tailwind CSS', description: 'For styling the application' },
  { name: 'JWT', description: 'For user authentication' },
  { name: 'Vite', description: 'As the frontend build tool' },
  { name: 'Recharts', description: 'For displaying election results charts' }
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="elevated-card rounded-2xl p-8 mb-8 text-center">
        <h1 className="text-5xl font-bold text-gradient mb-3">About VoteChain</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          This project is a secure, transparent, and reliable online voting system built using the MERN stack. Our goal is to provide an accessible and trustworthy platform for conducting elections.
        </p>
      </div>

      <div className="professional-card p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Technologies Used</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech) => (
            <div key={tech.name} className="bg-white/60 p-4 rounded-xl text-center hover-lift">
              <h3 className="font-bold text-lg text-indigo-700">{tech.name}</h3>
              <p className="text-sm text-gray-600">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="professional-card p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Team</h2>
        <div className="space-y-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="glass-card p-6 rounded-2xl md:flex md:items-center md:gap-8">
              <div className="md:w-1/4 flex-shrink-0 text-center mb-4 md:mb-0">
                <img src={member.avatarUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg" />
              </div>
              <div className="md:w-3/4">
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-semibold mb-2">Roll No: {member.roleNumber}</p>
                <p className="text-gray-700">{member.contributions}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
