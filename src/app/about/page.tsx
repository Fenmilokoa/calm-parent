export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Our story
        </p>

        <h1 className="text-3xl font-semibold text-foreground mb-10">
          About Calm Parent
        </h1>

        <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>
            I built this because I was scared of myself.
          </p>

          <p>
            Not in a dramatic way. In the quiet, 3am way where you replay a moment
            with your child and wonder if you got it wrong. If you said too much.
            If you said it too sharply. If the pattern you're trying to break
            is still somehow repeating.
          </p>

          <p>
            I have ADHD and OCD. Parenting with a brain that won't slow down —
            that loops, that catastrophises, that wants to get everything right —
            is its own kind of hard. I love my child fiercely. I also know what
            it's like to feel one bad moment away from becoming the parent you
            promised yourself you wouldn't be.
          </p>

          <p>
            My husband is a teacher. Between us, we've spent a lot of time
            thinking about what children actually need — not in theory, but in the
            middle of a meltdown, a slammed door, a moment where everyone's
            flooded and nobody knows what to do next.
          </p>

          <p>
            We didn't want gentle parenting without limits, or discipline
            without warmth. We wanted something in the middle — compassionate,
            boundaried, human. Parenting that holds the child and holds the line.
          </p>

          <p>
            Calm Parent is what I wished I'd had in those moments. Something
            trauma-informed. Something that understood why I react the way I do,
            and helped me respond differently anyway.
          </p>

          <p>
            You caught yourself. That's the whole thing. That's already
            the beginning of something different.
          </p>
        </div>

        <div className="mt-12 pl-5 border-l-2 border-accent">
          <p className="text-muted-foreground italic">
            — Danni, parent
          </p>
        </div>

      </div>
    </main>
  );
}
