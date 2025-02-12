/// <reference types="@types/google.maps" />

"use client";

import { CreatePlanPageContent } from "./components/CreatePlanPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return <CreatePlanPageContent />;
}
