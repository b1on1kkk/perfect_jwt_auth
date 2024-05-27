"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  input_picture: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, input_picture, ...props }, ref) => {
    const [focus, setFocus] = React.useState<boolean>(false);

    return (
      <div
        className={`flex items-center px-3 py-1 border-[1px] rounded-lg ${
          focus ? "border-indigo-500" : "border-white"
        } transition-colors`}
      >
        <div>{input_picture}</div>

        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md px-3 py-2 text-sm outline-none bg-[#393E46] text-white transition-all",
            className
          )}
          ref={ref}
          {...props}
          onBlur={() => setFocus(!focus)}
          onFocus={() => setFocus(!focus)}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
