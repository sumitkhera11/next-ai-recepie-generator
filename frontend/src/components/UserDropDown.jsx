"use client";

import {
  UserButton,
} from "@clerk/nextjs";
import {Cookie,  Refrigerator} from "lucide-react";

export default function UserDropDown() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-8 h-8"
        }
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link 
          label="My Recipes"
          labelIcon= {<Cookie size = {16}/> }
          href = "/recipes"/>
        <UserButton.Link 
          label="My Pantry"
          labelIcon= {<Refrigerator size = {16}/> }
          href = "/pantry"/>
          <UserButton.Action label="manageAccount"/>
      </UserButton.MenuItems>
    </UserButton>
  );
}
