"use client";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Link } from 'next-view-transitions';
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "./ui/aurora-background";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { HeroHighlight } from "./ui/hero-highlight";
import { ModeToggle } from "./toggle-theme-button";
import { SearchBar } from "./ui/SearchBar";

export function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <div className="h-6 w-6" />
          <span className="text-lg font-semibold">Zeno</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            About Us
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary shadow transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Login as Museum
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <AuroraBackground>
          <div className="max-w-3xl rounded-xl text-white z-10 mx-auto space-y-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Streamline Your Museum Ticketing with Ease
            </h1>
            <p className="text-lg leading-relaxed">
              Ticket Maestro offers a comprehensive ticketing solution for museums, galleries, and cultural institutions. Our platform simplifies the ticketing process, enhances the visitor experience, and empowers your team to focus on what matters most.
            </p>
          </div>
          <SearchBar />
        </AuroraBackground>
        <section className="py-16 px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center gap-4 p-8 bg-muted rounded-lg">
                    <img
                      src="/placeholder.png" // Ensure this path is correct
                      width={64}
                      height={64}
                      alt="Customer Avatar"
                      className="rounded-full"
                      style={{ aspectRatio: "1" }} // Aspect ratio as 1 for square
                    />
                    <blockquote className="text-center text-lg leading-relaxed text-card-foreground">
                      &rdquo;Ticket Maestro has been a game-changer for our museum. The intuitive platform and excellent customer support have made our ticketing process a breeze.&rdquo;
                    </blockquote>
                    <div className="font-medium text-card-foreground">Jane Doe, Curator</div>
                    <div className="text-card-foreground text-sm">Metropolitan Museum of Art</div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center gap-4 p-8 bg-card rounded-lg">
                    <img
                      src="/placeholder.png" // Ensure this path is correct
                      width={64}
                      height={64}
                      alt="Customer Avatar"
                      className="rounded-full"
                      style={{ aspectRatio: "1" }} // Aspect ratio as 1 for square
                    />
                    <blockquote className="text-center text-lg leading-relaxed text-card-foreground">
                    &rdquo;Ticket Maestro has been a game-changer for our museum. The intuitive platform and excellent customer support have made our ticketing process a breeze.&rdquo;
                    </blockquote>
                    <div className="font-medium text-card-foreground">John Smith, Director</div>
                    <div className="text-card-foreground text-sm">Louvre Museum</div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col items-center justify-center gap-4 p-8 bg-card rounded-lg">
                    <img
                      src="/placeholder.png" // Ensure this path is correct
                      width={64}
                      height={64}
                      alt="Customer Avatar"
                      className="rounded-full"
                      style={{ aspectRatio: "1" }} // Aspect ratio as 1 for square
                    />
                    <blockquote className="text-center text-lg leading-relaxed text-card-foreground">
                    &rdquo;Ticket Maestro has been a game-changer for our museum. The intuitive platform and excellent customer support have made our ticketing process a breeze.&rdquo;
                    </blockquote>
                    <div className="font-medium text-card-foreground">Jane Doe, Curator</div>
                    <div className="text-card-foreground text-sm">Metropolitan Museum of Art</div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2">
                <ChevronLeftIcon className="h-6 w-6" />
              </CarouselPrevious>
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2">
                <ChevronRightIcon className="h-6 w-6" />
              </CarouselNext>
            </Carousel>
          </div>
        </section>
        <section className="bg-card py-16 px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing for Museums</h2>
              <p className="text-card-foreground text-lg leading-relaxed">
                Discover our flexible pricing options tailored to the needs of museums and cultural institutions.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg">
                  <CardTitle className="text-2xl font-bold">Basic</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl font-bold">$99</div>
                  <ul className="list-disc space-y-2 text-card-foreground">
                    <li>Basic Ticketing Features</li>
                    <li>Email Support</li>
                    <li>Up to 500 Tickets per Month</li>
                  </ul>
                  <Button variant="outline">Sign Up</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg">
                  <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl font-bold">$199</div>
                  <ul className="list-disc space-y-2 text-card-foreground">
                    <li>Advanced Ticketing Features</li>
                    <li>Priority Support</li>
                    <li>Up to 2000 Tickets per Month</li>
                  </ul>
                  <Button variant="outline">Sign Up</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg">
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl font-bold">Contact Us</div>
                  <ul className="list-disc space-y-2 text-card-foreground">
                    <li>Custom Ticketing Features</li>
                    <li>Dedicated Account Manager</li>
                    <li>Unlimited Tickets</li>
                  </ul>
                  <Button variant="outline">Contact Us</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-primary text-primary-foreground py-4 px-6 text-center">
        <p className="text-sm">© {currentYear} Ticket Maestro. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface props {
  className?: string;
}

function CheckIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function ChevronLeftIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}


function ChevronRightIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function MoonIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}


function SearchIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function SunIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}


function TicketIcon({ className }: props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  )
}