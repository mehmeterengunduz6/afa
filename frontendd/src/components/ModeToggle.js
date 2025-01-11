"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
                <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}