import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, LockKeyhole, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppInstance } from "@/lib/models";

export default async function BrowserContainerPage({ params }: { params: Promise<{ instanceId: string }> }) {
  const user = await requireUser();
  const { instanceId } = await params;
  await connectToDatabase();
  const instance = await AppInstance.findOne({ _id: instanceId, userId: user.id }).populate("profileId").lean();

  if (!instance) notFound();
  const profile = typeof instance.profileId === "object" ? instance.profileId : null;
  const profileKey = profile && "profileKey" in profile ? String(profile.profileKey) : String(instance.profileId);

  return (
    <main className="mesh-bg min-h-screen p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4" />
              Reload
            </Button>
            <Button asChild>
              <a href={instance.launchUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Launch
              </a>
            </Button>
          </div>
        </div>

        <section className="overflow-hidden rounded-lg border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="ml-4 rounded-md border bg-background px-3 py-1 text-sm text-muted-foreground">
                {instance.launchUrl}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {instance.cookieStore}
            </div>
          </div>
          <div className="grid min-h-[620px] place-items-center bg-background/80 p-6">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-accent">
                <LockKeyhole className="h-7 w-7 text-primary" />
              </div>
              <h1 className="mt-5 text-2xl font-semibold">{instance.name} container</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                In production, this viewport is served by the container gateway. It launches the target site through a
                dedicated browser context keyed by profile, cookie store, local storage bucket, session storage bucket,
                and cache namespace.
              </p>
              <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4 text-sm">
                    <p className="font-medium">Profile ID</p>
                    <p className="mt-1 truncate text-muted-foreground">{profileKey}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-sm">
                    <p className="font-medium">Cookie store</p>
                    <p className="mt-1 truncate text-muted-foreground">{instance.cookieStore}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
