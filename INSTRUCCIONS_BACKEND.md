# Configuració del Backend per v0

## Problema

El frontend de v0 s'executa al núvol i no pot accedir directament al teu `localhost:8080`. Necessites exposar el backend a internet temporalment per poder desenvolupar.

## Solució: Utilitzar ngrok

### 1. Instal·la ngrok

**Opció A - Descarregar de la web:**
- Ves a https://ngrok.com/download
- Descarrega i instal·la per al teu sistema operatiu

**Opció B - Amb Homebrew (macOS/Linux):**
\`\`\`bash
brew install ngrok/ngrok/ngrok
\`\`\`

**Opció C - Amb Chocolatey (Windows):**
\`\`\`bash
choco install ngrok
\`\`\`

### 2. Registra't a ngrok (gratuït)

- Crea un compte a https://dashboard.ngrok.com/signup
- Copia el teu authtoken des de https://dashboard.ngrok.com/get-started/your-authtoken
- Configura l'authtoken:
\`\`\`bash
ngrok config add-authtoken EL_TEU_TOKEN_AQUI
\`\`\`

### 3. Exposa el backend

Amb el backend Spring Boot corrent al port 8080, executa:

\`\`\`bash
ngrok http 8080
\`\`\`

Veuràs una sortida com aquesta:

\`\`\`
Session Status                online
Account                       el_teu_compte (Plan: Free)
Version                       3.x.x
Region                        Europe (eu)
Forwarding                    https://abc123.ngrok.io -> http://localhost:8080
\`\`\`

### 4. Configura la variable d'entorn a v0

1. A la interfície de v0, ves a la secció **Vars** (variables d'entorn) al sidebar esquerre
2. Afegeix una nova variable:
   - **Nom:** `NEXT_PUBLIC_API_URL`
   - **Valor:** L'URL que ngrok et dona (per exemple: `https://abc123.ngrok.io`)
3. Guarda els canvis

### 5. Actualitza CORS al Backend

Afegeix l'URL de ngrok als origins permesos al teu `SecurityConfig.java`:

\`\`\`java
source.registerCorsConfiguration("/**", configuration);
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://abc123.ngrok.io"  // Afegeix la teva URL de ngrok aquí
));
\`\`\`

## Alternativa: Desplegar el Backend

Si prefereixes no utilitzar ngrok, pots desplegar el backend a:
- **Railway** (https://railway.app) - Gratuït per començar
- **Render** (https://render.com) - Té un tier gratuït
- **Fly.io** (https://fly.io) - Gratuït per aplicacions petites

Un cop desplegat, utilitza l'URL pública com a `NEXT_PUBLIC_API_URL`.

## Verificació

Després de configurar ngrok i la variable d'entorn:

1. El banner groc hauria de desaparèixer
2. Hauries de poder registrar-te i fer login
3. Comprova la consola del navegador (F12) per veure els logs `[v0]`
