'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Link2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
];
const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
];

interface HeaderProps {
  country?: string;
  language?: string;
  onCountryChange?: (value: string) => void;
  onLanguageChange?: (value: string) => void;
  showControls?: boolean;
}

export function Header({
  country,
  language,
  onCountryChange,
  onLanguageChange,
  showControls = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Link2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Savvi-AI</span>
        </Link>
        <nav className="flex items-center gap-4">
          {showControls && country && language && onCountryChange && onLanguageChange && (
            <div className="hidden items-center gap-4 md:flex">
              <Select value={country} onValueChange={onCountryChange}>
                <SelectTrigger className="w-auto border-0 bg-transparent shadow-none">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-auto border-0 bg-transparent shadow-none">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
