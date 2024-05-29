"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex gap-5 items-center p-10">
      <div className="text-white">Home page</div>
      <div>
        <Button onClick={() => {}}>Log out</Button>
      </div>
    </main>
  );
}
