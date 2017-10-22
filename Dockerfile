FROM httpd:latest
MAINTAINER Samitha Hewawasa <samithahewawasam@gmail.com>

RUN apt-get update && apt-get install curl -y && curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get install -y nodejs && npm install -g grunt-cli
RUN npm install -g bower
RUN apt-get install git -y
VOLUME ["/usr/local/apache2/htdocs/reports"]
ADD / .
RUN npm install && grunt  --gruntfile Gruntfile.js
