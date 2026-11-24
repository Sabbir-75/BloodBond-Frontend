// BloodBond - all 6 services, one source of truth.
// The Services list page and the detail pages (app/services/[slug]/page.js)
// both read from here, so a service is never a demo placeholder.

export const SERVICES = [
  {
    slug: 'find-blood-donors',
    icon: '♥',
    title: 'Find Blood Donors',
    short:
      'Search verified donors by blood group, division, district and upazila. Every donor card shows the blood group big and clear, with availability status — Available, Not Available, or Call to Confirm.',
    what: 'The donor search is the heart of BloodBond. Every approved donor is listed with their blood group, occupation and area. You can filter by blood group and by Division, District and Upazila to find someone close to the patient.',
    steps: [
      'Open the Available Donors page.',
      'Choose the blood group the patient needs.',
      'Choose Division, District and Upazila to search nearby.',
      'Login to see the donor contact details.',
      'Call the donor directly, or send a prefilled email request.',
    ],
    who: 'For patients, patient families and hospitals who need blood quickly.',
    cta: { label: 'Search Donors', href: '/donors' },
  },
  {
    slug: 'request-blood',
    icon: '✚',
    title: 'Request Blood',
    short:
      'Patients and hospitals (Acceptor) can request blood with group, number of bags, urgency and address. Admin reviews and approves every request.',
    what: 'If you need blood for a patient, you can send a formal blood request. The request has the blood group, how many bags you need, how urgent it is, the hospital name and the address. The admin reviews it and can give blood from the stock.',
    steps: [
      'Register as an Acceptor and wait for admin approval.',
      'Login and open the Request Blood page.',
      'Fill in blood group, bags, urgency, hospital and address.',
      'Submit the request — it stays Pending for the admin.',
      'The admin approves it and can give blood from stock.',
    ],
    who: 'For patients, patient families and hospitals (Acceptor accounts).',
    cta: { label: 'Request Blood', href: '/request' },
  },
  {
    slug: 'blood-stock-management',
    icon: '⬢',
    title: 'Blood Stock Management',
    short:
      'Admin keeps the stock of all 8 blood groups up to date. Every donation adds stock, every issue from stock removes it — with transactions, so stock never goes wrong.',
    what: 'BloodBond keeps the stock of all 8 blood groups in one place. The admin can see how many bags of each group are available and add or remove bags. Every donation and every issue from stock is recorded, and the database uses transactions so the stock can never go below zero or lose a bag by mistake.',
    steps: [
      'Admin opens the Admin Dashboard.',
      'The Blood Stock section shows all 8 groups with bag counts.',
      'To add or remove bags, choose the group and the number of units.',
      'To fulfil a request, use "Give from Stock" on a pending request.',
      'The stock updates at once, and the request becomes Fulfilled.',
    ],
    who: 'For the Admin who manages the blood bank stock.',
    cta: { label: 'See Stock on Home', href: '/' },
  },
  {
    slug: 'donor-registration',
    icon: '✓',
    title: 'Donor Registration',
    short:
      'Anyone can register as a donor with full details — blood group, address, occupation and availability status. Admin approves the account, then the donor appears in search.',
    what: 'Anyone who wants to give blood can register as a donor. You give your name, phone, email, blood group, occupation and address (Division, District, Upazila), and whether you can donate now. The admin checks and approves the account, and only then do you appear in the donor search.',
    steps: [
      'Open the Become a Donor page.',
      'Fill in your details and choose your blood group.',
      'Choose your Division, District and Upazila.',
      'Submit — your account stays Pending.',
      'After admin approval, login and manage your profile.',
    ],
    who: 'For anyone healthy who wants to donate blood and save lives.',
    cta: { label: 'Become a Donor', href: '/donor-form' },
  },
  {
    slug: '90-day-donation-rule',
    icon: '◷',
    title: '90-Day Donation Rule',
    short:
      'After donating, a donor cannot donate for 3 months. The system counts 90 days from the last donation date and makes the donor eligible again automatically.',
    what: 'After donating blood, the body needs time to recover. That is why a donor must wait 90 days before donating again. BloodBond counts 90 days from the last donation date and shows the next eligible date on the donor profile. The donor becomes eligible again automatically — nobody has to remember the date.',
    steps: [
      'Donate blood at a hospital or blood drive.',
      'Set your status to "No" and add the donation date on My Profile.',
      'BloodBond counts 90 days from that date.',
      'On the 91st day you become eligible again automatically.',
      'Your status shows "Available" and patients can find you.',
    ],
    who: 'For every donor — the rule protects the donor’s health.',
    cta: { label: 'See Eligible Donors', href: '/donors' },
  },
  {
    slug: 'direct-contact',
    icon: '☎',
    title: 'Direct Contact',
    short:
      'After login, you can call a donor directly (tel:) or send a prefilled email request (mailto:) with blood group, bags and address already written.',
    what: 'When every minute matters, you should not wait for messages. After login, you can call a donor directly from the donor card, or send an email request that already has the blood group, number of bags and address written in it. Contact details are hidden from guests — only logged-in users can see them.',
    steps: [
      'Login to your BloodBond account.',
      'Find the donor on the Available Donors page.',
      'Click "View Contact" on the donor card.',
      'Tap "Call" to phone the donor, or "Email Donor" to send a request.',
      'The email opens ready to send — just add your address and send.',
    ],
    who: 'For logged-in patients, families and hospitals who need a donor now.',
    cta: { label: 'Login', href: '/login' },
  },
];

// Find one service by its slug (used by the detail page).
export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug);
}
