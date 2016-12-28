#!/bin/bash
# This script starts rethinkdb instance, then starts meety container

sudo apt-get install mongodb-clients

RETHINKDB_CID=$(docker run -d --name rethinkdb rethinkdb);
MONGO_CID=$(docker run -d --name mongodb mongo:2.4);

RETHINKDB_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $RETHINKDB_CID);
MONGO_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $MONGO_CID);

echo -n "waiting for TCP connection to rethinkdb $MONGO_IP:27017..."
while ! nc -w 1 $RETHINKDB_IP 28015 2>/dev/null
do
  echo -n .
  sleep 1
done
echo 'ok'

echo -n "waiting for TCP connection to mongodb $MONGO_IP:27017..."
while ! nc -w 1 $MONGO_IP 27017 2>/dev/null
do
  echo -n .
  sleep 1
done
echo 'ok'

echo -n "Setup MongoDB Admin $MONGOIP:27017..."
mongo --host $MONGO_IP <<EOF
use admin
db.addUser("dbadmin", "dbadmin-pass");
quit();
EOF


MEETY_CID=$(docker run -d --name meety \
	--link rethinkdb:rethinkdb \
	--link mongodb:mongodb \
	meety);
MEETY_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $MEETY_CID);

echo "Meety is now ready."
echo "Now you can open http://$MEETY_IP:38130/web/ in your browser."
