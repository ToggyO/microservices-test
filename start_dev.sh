#/bin/bash
export $(cat .env.development | xargs)
#cd account-service && npm run dev
#cd file-storage-service && npm run dev
cd file-storage-service && npm run dev
export $(cat clean.env | xargs)
