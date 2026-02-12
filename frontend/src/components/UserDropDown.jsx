"use client";

import {
  UserButton,
} from "@clerk/nextjs";

export default function UserDropDown() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-8 h-8"
        }
      }}
    />
  );
}
