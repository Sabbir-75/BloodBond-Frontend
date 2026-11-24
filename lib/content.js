// BloodBond - shared page content (Home + About pages use the same data).
// Photos are randomuser.me portraits (verified to load).
// Names are sample names for the demo site.

export const TESTIMONIALS = [
  {
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Arif Hossain',
    role: 'Blood Recipient, Dhaka',
    quote:
      'My father needed O+ blood urgently after surgery. I searched on BloodBond, found a donor in Dhanmondi, and called him directly. He came to the hospital the same evening.',
  },
  {
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Mitu Rahman',
    role: 'Regular Donor, Chattogram',
    quote:
      'I donate blood every 4 months. BloodBond reminds me when I become eligible again after 90 days, and hospitals can find me by my blood group and area.',
  },
  {
    photo: 'https://randomuser.me/api/portraits/men/54.jpg',
    name: 'Sakib Hasan',
    role: 'Donor, Sylhet',
    quote:
      'Registering took only a few minutes. After the admin approved my account, patients started calling me. Knowing my blood saved a life is the best feeling.',
  },
  {
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    name: 'Farhana Akter',
    role: "Patient's Family, Khulna",
    quote:
      'When my mother needed B+ blood, we had no donor in the family. BloodBond showed us available donors in Khulna with their status. We found help the same day.',
  },
];

// Upcoming blood drives in Bangladesh (planned events, not past claims).
export const DRIVES = [
  {
    title: 'Dhaka University Blood Drive',
    date: '5 December 2026',
    time: '9:00 AM – 3:00 PM',
    venue: 'TSC, University of Dhaka, Dhaka',
  },
  {
    title: 'Chattogram City Blood Camp',
    date: '12 December 2026',
    time: '10:00 AM – 4:00 PM',
    venue: 'Chattogram Medical College Hospital, Chattogram',
  },
  {
    title: 'Northern University Blood Donation Day',
    date: '19 December 2026',
    time: '10:00 AM – 2:00 PM',
    venue: 'Northern University Bangladesh, Dhaka',
  },
];

// FAQ - real answers about how BloodBond works.
export const FAQS = [
  {
    q: 'Who can donate blood?',
    a: 'Any healthy adult can donate blood. You register as a donor with your blood group and address, the admin approves your account, and then patients and hospitals can find you by blood group and area.',
  },
  {
    q: 'What is the 90-day donation rule?',
    a: 'After you donate blood, you must wait 90 days before donating again. BloodBond counts 90 days from your last donation date and makes you eligible again automatically. You can see your next eligible date on My Profile.',
  },
  {
    q: 'Is donating blood safe?',
    a: 'Yes. Donating blood is safe for a healthy adult. Only a small amount is taken, your body replaces it quickly, and trained staff use clean, single-use equipment. If you feel unwell, set your status to "No" on My Profile.',
  },
  {
    q: 'How do I request blood for a patient?',
    a: 'Register as an Acceptor, wait for admin approval, then login and fill in the Request Blood form with blood group, bags needed, urgency, hospital name and address. The admin reviews the request and can give blood from stock.',
  },
  {
    q: 'Who approves new accounts and requests?',
    a: 'The Admin approves every new Donor and Acceptor account, and every blood request. This keeps the donor list real and safe. Your account stays Pending until the admin approves it.',
  },
  {
    q: 'What if no donor is found in my area?',
    a: 'Try a wider search — remove the upazila or district filter, or try a nearby district. You can also submit a blood request so the admin can check the stock and help you find a donor.',
  },
];
