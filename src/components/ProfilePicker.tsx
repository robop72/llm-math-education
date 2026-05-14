import React from 'react';
import { StoredProfile } from '../hooks/useStudentProfile';

interface Props {
  profiles: StoredProfile[];
  onSelect: (id: string) => void;
  onAddStudent: () => void;
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
];

function avatarColor(id: string) {
  let hash = 0;
  for (const c of id) hash = (hash + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export default function ProfilePicker({ profiles, onSelect, onAddStudent }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-10">
          <img src="/voxii-logo.png" alt="Voxii AI" className="h-9 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Who's learning today?</h1>
        <p className="text-sm text-gray-400 text-center mb-10">Each student has their own private session history and progress.</p>

        <div className={`grid gap-4 ${profiles.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'} max-w-lg mx-auto`}>
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500 hover:bg-gray-800 transition-all"
            >
              <div className={`w-16 h-16 rounded-full ${avatarColor(p.id)} flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {initial(p.student_name || 'S')}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                  {p.student_name || 'Student'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Year {p.year_level}</p>
                {p.selected_subjects.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                    {p.selected_subjects.join(' · ')}
                  </p>
                )}
              </div>
            </button>
          ))}

          {/* Add student card */}
          <button
            onClick={onAddStudent}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-900 border border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
              <svg className="w-7 h-7 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-blue-400 transition-colors">Add student</p>
          </button>
        </div>
      </div>
    </div>
  );
}
