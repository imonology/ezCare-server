#!/bin/bash
#~ echo This script deploys Hydra in a server with nodejs, mongodb, ImonCloud, and ffmpeg. Updated: 20150317
#~ git config --global credential.helper "cache --timeout=3600000"


# clone Hydra-Server
echo "##########"
echo "# Cloneing: Meety"
echo "##########"

git clone --depth=1 -b master https://3e473f85cf974a8bef21fdd913cd370c7698d454@github.com/BlueT/Meety.git


# install nodejs modules
echo "##########"
echo "# Installing nodejs modules for Meety"
echo "##########"

cd /Meety
npm install

cd /Meety/web/
npm install
node ./node_modules/webpack/bin/webpack.js --hot --inline -p


cp /root/ic-config.js /Meety/node_modules/imoncloud/config.js
cd /Meety/node_modules/imoncloud/lib/sockjs/
ln -s sockjs-0.3.min.js sockjs.min.js


# Clean-up
apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm/ /Meety/.git/
rm -rf /Meety/node_modules/imoncloud/.git/

exit 0;
