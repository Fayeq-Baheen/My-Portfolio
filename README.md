# Portfolio CMS with a real backend (React + Supabase)

Changes made in the admin panel are saved in a database and appear for every visitor immediately.

## 1. Create the backend (free, ~10 minutes)
1. Sign up at https://supabase.com and create a new project (remember the database password).
2. Open **SQL Editor -> New query**, paste all of `supabase/schema.sql`, click **Run**.
   This creates the tables, security rules, an image bucket and some starter content.
3. Open **Authentication -> Users -> Add user**: enter YOUR email + a strong password
   (tick "auto confirm" if offered). This is your admin login.
4. IMPORTANT: in **Authentication** settings turn OFF "Allow new users to sign up".
   Otherwise strangers could register and edit your site.
5. Open **Project Settings -> API** and copy the Project URL and the `anon` public key.
   (Menu names can differ slightly between Supabase versions.)

## 2. Run locally
```bash
npm install
cp .env.example .env     # paste the URL and anon key into .env
npm run dev
```
- Site: http://localhost:5173/#/
- Admin: http://localhost:5173/#/admin  (log in with the user from step 3)

## 3. Deploy (Vercel or Netlify)
Push to GitHub, import the repo, add the same two variables
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the project's Environment Variables,
build command `npm run build`, output directory `dist`.

## How security works
- The anon key is public by design. Safety comes from the Row Level Security rules in `schema.sql`:
  visitors can only READ content and SEND messages; only a logged-in admin can write or read messages.
- Never put the `service_role` key in this project.
- Contact messages are stored in the database (Admin -> Messages). Email notifications are not included.
