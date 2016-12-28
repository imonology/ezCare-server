#!/bin/bash
set -e

#~ bash /root/wait_mongo_port.sh

mv /root/setup-rethinkdb.js /Meety/
node /Meety/setup-rethinkdb.js

cd /Meety/node_modules/imoncloud/monitor/ && ./start
cd /Meety/ && npm start

#~ if [ "$1" = 'postgres' ]; then
    #~ chown -R postgres "$PGDATA"

    #~ if [ -z "$(ls -A "$PGDATA")" ]; then
        #~ gosu postgres initdb
    #~ fi

    #~ exec gosu postgres "$@"
#~ fi

#~ exec "$@"
