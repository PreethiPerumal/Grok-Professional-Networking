import React, { useState } from 'react';

const mockUserInfo = {
  bio: 'Passionate software engineer with 7+ years of experience building scalable web applications.',
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'],
  experience: [
    {
      company: 'TechCorp',
      title: 'Senior Software Engineer',
      period: '2021 - Present',
      description: 'Leading a team of 5 to build cloud-native solutions.'
    },
    {
      company: 'Webify',
      title: 'Frontend Developer',
      period: '2018 - 2021',
      description: 'Developed and maintained the main customer portal.'
    }
  ],
  education: [
    {
      school: 'Stanford University',
      degree: 'M.S. Computer Science',
      period: '2016 - 2018'
    },
    {
      school: 'UCLA',
      degree: 'B.S. Computer Science',
      period: '2012 - 2016'
    }
  ],
  contact: {
    email: 'john.doe@email.com',
    phone: '+1 555-123-4567',
    website: 'https://johndoe.dev'
  }
};

const Section: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        className="w-full flex justify-between items-center font-semibold text-lg py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 md:cursor-default md:bg-transparent md:hover:bg-transparent"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {title}
        <span className="ml-2 md:hidden">{open ? '-' : '+'}</span>
      </button>
      <div className={`mt-2 ${open ? '' : 'hidden md:block'}`}>{children}</div>
    </div>
  );
};

const ProfileInfo: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <Section title="Bio" defaultOpen>
        <p>{mockUserInfo.bio}</p>
      </Section>
      <Section title="Skills" defaultOpen>
        <ul className="flex flex-wrap gap-2">
          {mockUserInfo.skills.map(skill => (
            <li key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</li>
          ))}
        </ul>
      </Section>
      <Section title="Work Experience">
        <ul>
          {mockUserInfo.experience.map((exp, idx) => (
            <li key={idx} className="mb-2">
              <div className="font-semibold">{exp.title} @ {exp.company}</div>
              <div className="text-gray-500 text-sm">{exp.period}</div>
              <div>{exp.description}</div>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Education">
        <ul>
          {mockUserInfo.education.map((edu, idx) => (
            <li key={idx} className="mb-2">
              <div className="font-semibold">{edu.degree} - {edu.school}</div>
              <div className="text-gray-500 text-sm">{edu.period}</div>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Contact Information">
        <div>Email: <a href={`mailto:${mockUserInfo.contact.email}`} className="text-blue-600 underline">{mockUserInfo.contact.email}</a></div>
        <div>Phone: <a href={`tel:${mockUserInfo.contact.phone}`} className="text-blue-600 underline">{mockUserInfo.contact.phone}</a></div>
        <div>Website: <a href={mockUserInfo.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{mockUserInfo.contact.website}</a></div>
      </Section>
    </div>
  );
};

export default ProfileInfo; 