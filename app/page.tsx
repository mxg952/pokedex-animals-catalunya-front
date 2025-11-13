import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 py-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[url('/paisatge-natural-de-catalunya-amb-muntanyes-i-bosc.jpg')] bg-cover bg-center opacity-10" />

        <h1 className="mb-6 text-balance font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Pokédex d'Animals de Catalunya
        </h1>

        <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Descobreix, desbloqueja i cataloga la fauna autòctona de Catalunya. Una enciclopèdia viva dels animals que
          habiten el nostre territori.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="text-base">
              Iniciar sessió
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Registrar-se
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">Com funciona</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">Descobreix animals</h3>
              <p className="text-muted-foreground">
                Explora el catàleg complet d'animals de Catalunya. Cada espècie espera ser descoberta.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">Puja fotografies</h3>
              <p className="text-muted-foreground">
                Quan trobis un animal, puja una fotografia per desbloquejar la seva informació completa.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">Completa el catàleg</h3>
              <p className="text-muted-foreground">
                Segueix el teu progrés i converteix-te en un expert de la fauna catalana.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
