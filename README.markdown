1. `cp .env.local.example .env.local`
2. Fill out values in `.env.local`
3. `docker run --rm -it -p 3000:3000 -v "$(pwd)":/usr/src/app -w /usr/src/app node:18.12.1 npm run dev`