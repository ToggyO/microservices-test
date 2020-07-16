#/bin/bash
export $(cat .env | xargs) && docker-compose -f ./docker-compose.dev.yml up --build
export $(cat clean.env | xargs)
#export $(cat .env | xargs) && docker-compose -f ./docker-compose.local.yml up --build
#while read line; do export "$line";
#done < .env
#echo "done"
