"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export default function Navbar() {
  const lawsuitCount = 3;

  return (
    <nav className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 transition-colors hover:text-gray-600"
        >
          legaldash.ai
        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 cursor-pointer text-gray-600 transition-colors hover:text-gray-800" />
            {lawsuitCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 px-2 py-1 text-xs"
              >
                {lawsuitCount}
              </Badge>
            )}
          </div>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-slate-600 text-black">
              AM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
