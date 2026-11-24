# BloodBond — Step 3: Frontend Website (Next.js)

Red brand on white body. Pages: Home, Available Donors, Services, Contact Us,
Login / Register, Become a Donor form, Request Blood form, My Profile, Admin Dashboard.
All data comes from the Step 2 backend (http://localhost:5000/api) — no fake data.

## File gulo ki ki

| File / Folder | Kaj |
|---|---|
| `app/page.js` | Home: Hero, Blood Stock, Our Services, Donors preview, How It Works |
| `app/donors/page.js` | Available Donors: search by Blood Group / Division / District / Upazila |
| `app/services/page.js` | Our Services page |
| `app/contact/page.js` | Contact Us page |
| `app/login/page.js` | Login (JWT token) |
| `app/register/page.js` | Register (Donor / Acceptor) |
| `app/donor-form/page.js` | Become a Donor — professional form, cascading location, status Yes/No/NotSure |
| `app/request/page.js` | Request Blood (Acceptor login) + my requests |
| `app/profile/page.js` | Donor profile + status update (90-day rule shown) |
| `app/admin/page.js` | Admin Dashboard: counts, approve users, approve requests, give from stock, update stock |
| `app/layout.js` | Navbar + Footer on every page |
| `components/Navbar.js` | Top menu (links change by role) |
| `components/Footer.js` | Footer |
| `components/DonorCard.js` | Donor card — big red blood group, View Contact (login lagbe), tel: + mailto: |
| `components/LocationSelects.js` | Division > District > Upazila cascading selects |
| `components/AuthContext.js` | Login state for the whole website |
| `lib/api.js` | Backend call helper (token auto-sent) |
| `lib/locations.js` | Bangladesh Division / District / Upazila list |
| `sql/make_admin.sql` | Demo Admin login banano (Step 3A) |
| `.env.local.example` | `.env.local` file-er nomuna |

## Demo login (shudhu test-er jonno)

- **Admin:** Email `admin@bloodbond.test` — Password `Admin123!`
  (Step 3A-er `make_admin.sql` chalalei ei login kaj korbe. Asol kaje password bodle nio.)
- **Demo donor-ra** (Rahim, Karim, Nusrat) login korte parbe NA — tader password asol hash na.
  Website theke Register kore, Admin approve korle, tarpor login korte parba.

## Run korar niyom — ekta ekta kore (Step 3A → 3B → 3C → 3D)

### Step 3A — Demo Admin login banano (SSMS)
1. SSMS kholo (localhost, Windows Authentication).
2. `frontend/sql/make_admin.sql` kholo, **F5** chapo.
3. Niche result-e dekhba: `admin@bloodbond.test`, Role `Admin`, Status `Approved`.
4. Amake bolo: **"3A done"**

### Step 3B — Frontend folder + package install (VS Code terminal)
1. `Desktop > BloodBond` folder-e `frontend` folder-ta rakho (zip theke).
2. VS Code-e `frontend` folder kholo. Terminal kholo (Terminal > New Terminal).
3. Chalao: `npm install` (2-3 minute lagte pare)
4. Seshe kono laal error na ashle amake bolo: **"3B done"**

### Step 3C — `.env.local` file banano
1. `frontend` folder-e `.env.local.example` file-ta copy kore notun file banayo, nam: `.env.local`
2. Vitore lekha ache: `NEXT_PUBLIC_API_URL=http://localhost:5000/api` — kichu bodlaba na, sudhu save koro.
3. Amake bolo: **"3C done"**

### Step 3D — Website chalano + test
1. **Backend age chalao:** backend folder-er terminal-e `npm start` (cholte thakbe).
2. **Frontend terminal-e** (notun terminal) chalao: `npm run dev`
3. Dekhba: `http://localhost:3000` — browser-e oi link kholo.
4. Home page dekhabe: Hero, Blood Stock (8 ta group), Services, Donors.
5. Amake bolo: **"3D done"**

## Test korar flow (Step 3D-er por)
1. **Admin login:** `admin@bloodbond.test` / `Admin123!` → Admin Dashboard dekhabe.
2. **Donor register:** Become a Donor form puron koro (notun email diye) → Pending thakbe.
3. **Admin approve:** Admin Dashboard-e Pending Users-e Approve chapo.
4. **Donor login:** oi notun donor diye login → My Profile dekhabe, status bodlate parba.
5. **Donor search:** Available Donors page-e Blood Group + Division diye search koro.
6. **Contact:** Donor card-e View Contact → Call (tel:) ar Email (mailto: ready lekha) dekhabe.
7. **Request:** Acceptor diye register → approve → login → Request Blood form puron koro → Admin Dashboard-e request approve / stock theke dewa jabe.

## Mone rakhar kotha
- Backend (`npm start`, port 5000) na cholle website-e data asbe na — age backend, tarpor frontend.
- `.env.local` file kokhono GitHub-e jabe na, kauke pathaba na.
- Donor-er phone/email public list-e ashe na — sudhu login-er por View Contact-e ashe.
- Email button server theke mail pathay na — click korle mail app khulbe, request lekha ready thakbe, Send chaplei jabe.
