// BloodBond Frontend - Avatar (gol profile photo)
// Photo thakle chobi dekhabe, na thakle nam-er prothom okkhor (initials)
// lal background-e. Navbar, My Profile, ar team card - shob jaygay eki.
// className diye size bodlano jay: "w-10 h-10 text-sm" ba "w-24 h-24 text-3xl".

// "Md. Sabbir Hossain" -> "MS" ; "Rahim" -> "R"
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
}

export default function Avatar({ photo, name, className }) {
  const base = 'shrink-0 rounded-full object-cover ' + (className || 'w-10 h-10 text-sm');
  if (photo) {
    return <img src={photo} alt={name || 'Profile photo'} className={base} />;
  }
  return (
    <span className={base + ' bg-brand-500 text-white flex items-center justify-center font-bold select-none'}>
      {getInitials(name)}
    </span>
  );
}
