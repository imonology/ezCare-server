# Hydra Container
FROM ubuntu:14.04
MAINTAINER BlueT - Matthew Lien - 練喆明 "BlueT@BlueT.org"

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root

# upload files
COPY sources.list /etc/apt/
COPY step-* ic-config.js wait_mongo_port.sh setup-rethinkdb.js /root/
COPY ./docker-entrypoint.sh /


RUN /root/step-01-install-system-package.sh


# install Meety
RUN /root/step-20-install-Meety.sh


RUN /root/step-90-system-tunning.sh

# Clean-up
RUN apt-get -q clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm/

ENTRYPOINT ["/docker-entrypoint.sh"]

#~ CMD ["/sbin/my_init"]
EXPOSE 80 443 8888 38130
