import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Map, Users, Dice6 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Campaign Chronicles
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Your ultimate toolkit for managing TTRPG campaigns. Create immersive
            stories, design interactive world maps, and chronicle your
            adventures.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/blog">Start Writing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/maps">Add Maps</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Campaign Management Tools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Campaign Blog</CardTitle>
                <CardDescription className="text-slate-400">
                  Document your adventures, NPCs, and world lore
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="text-blue-400">
                  <Link href="/blog">Write Stories</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Map className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Interactive Maps</CardTitle>
                <CardDescription className="text-slate-400">
                  Upload world maps and create interactive regions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="text-green-400">
                  <Link href="/maps">Design Maps</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Character Tracking</CardTitle>
                <CardDescription className="text-slate-400">
                  Keep track of NPCs, locations, and relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="text-purple-400">
                  <Link href="/characters">Manage NPCs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Dice6 className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle className="text-white">Session Notes</CardTitle>
                <CardDescription className="text-slate-400">
                  Record session summaries and player actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="text-red-400">
                  <Link href="/sessions">Track Sessions</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
