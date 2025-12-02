import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/hero";              
import UserDashboard from "@/components/dashboard"; 

export default async function MainContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (!user) {
    return <Hero />;          // Not logged in → show landing content
  }

  return <UserDashboard user={user} />; // Logged in → show dashboard
}