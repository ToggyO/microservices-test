#/bin/bash
export $(cat .env.development | xargs)
cd auth-service && npm run dev
export $(cat clean.env | xargs)
