"use client";

import { Menu, Layers3 } from "lucide-react";
import { useState } from "react";
import { MobileSidebar } from "./mobile-sidebar";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-700 bg-black px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
            <Layers3 className="h-5 w-5 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Paylance</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
