import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">← Back</Link>
      </Button>
      <div className="mt-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Privacy &amp; data
        </h1>
        <p className="text-muted-foreground">
          Calm Parent is designed to feel safe: transparent, controllable, and respectful.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What we collect</CardTitle>
            <CardDescription>We keep it minimal.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            When you use the app without signing in, we may store your inputs and guidance
            for the current session on your device. We do not sell or share this data with
            third parties for advertising.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">How we use it</CardTitle>
            <CardDescription>To make guidance better, not noisier.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Session data may be used to improve guidance quality. If you sign in, we may
            store your history to personalise future guidance. You can delete your data at
            any time from Settings.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data retention</CardTitle>
            <CardDescription>How long we keep data.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            When you do not sign in, session data may be held only for the duration of your
            visit and in local storage on your device; we do not retain it on our servers.
            If you sign in, we retain your account and history until you delete your account
            or request deletion. You can request deletion at any time via Settings or by
            contacting us.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Third-party processors</CardTitle>
            <CardDescription>Who we use to run the service.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We use Vercel for hosting and Google (Generative AI / Gemini) to generate
            guidance. Requests you make are sent to these providers in accordance with
            their privacy policies. We do not pass your data to other third parties for
            advertising or profiling.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Children&apos;s data</CardTitle>
            <CardDescription>This app is for parents.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Calm Parent is intended for use by parents and caregivers. We do not knowingly
            collect personal data from children. If you are under 13 (or the applicable
            age in your region), please do not use this service. Compliance with
            regulations such as COPPA and GDPR-K is important to us; this policy may be
            updated as we add features. Please review with legal counsel for your context.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security</CardTitle>
            <CardDescription>Industry-standard protections.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We use encryption in transit and at rest. We do not store sensitive payment
            details on our servers; payments are handled by a payment provider.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            For privacy requests or questions, contact{" "}
            <a className="underline" href="mailto:privacy@calmparent.example.com">
              privacy@calmparent.example.com
            </a>
            .
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          This summary is not legal advice. We recommend reviewing our full policy and
          consulting legal counsel for your compliance needs.
        </p>
      </div>
    </div>
  );
}
