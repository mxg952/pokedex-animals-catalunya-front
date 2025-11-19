import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-2">
      
      {/* ESQUERRA: LOGO + EXPLICACIÓ (igual que en Login) */}
      <div className="relative flex flex-col items-center justify-center bg-muted px-8 text-center">

        {/* Logo GEGANT */}
        <Image
          src="/logo.png"
          alt="Logo Animaldex"
          width={350}
          height={350}
          className="opacity-90 drop-shadow-2xl mb-8"
          priority
        />

        {/* Títol EXPOSITIU */}
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Benvingut a la <span className="text-primary">Pokédex-Cat</span>
        </h1>

        {/* Text EXPLICATIU IMPORTANT */}
        <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
          Descobreix animals reals, desbloqueja fitxes úniques i completa
          la teva pròpia enciclopèdia interactiva. Observa, aprèn i competeix
          amb els teus amics per veure qui pot capturar més espècies!
        </p>
      </div>

      {/* DRETA: CONTINGUT PRINCIPAL */}
      <div className="flex items-center justify-center px-8 py-12 bg-background">
        <div className="w-full max-w-md text-center">

          <h2 className="mb-2 font-serif text-4xl font-bold text-foreground">
            Catàleg d'Animals de Catalunya
          </h2>
          
          <p className="mb-8 text-muted-foreground">
            Descobreix, desbloqueja i cataloga la fauna autòctona de Catalunya
          </p>

          <div className="rounded-lg border border-border bg-background p-8 shadow-sm space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Comença la teva aventura
              </h3>
              
              <p className="text-sm text-muted-foreground">
                Uneix-te a la comunitat i comença a catalogar els animals de Catalunya
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button size="lg" className="w-full text-base">
                  Iniciar sessió
                </Button>
              </Link>
              
              <Link href="/register" className="w-full">
                <Button size="lg" variant="outline" className="w-full text-base bg-transparent">
                  Registrar-se
                </Button>
              </Link>
            </div>



          </div>
        </div>
      </div>

    </div>
  )
}