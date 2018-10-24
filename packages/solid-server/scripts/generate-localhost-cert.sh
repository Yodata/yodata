#!/bin/bash
openssl genrsa -out key.pem 2048
openssl req -x509 -new -nodes -key key.pem -sha256 -days 1825 -out cert.pem
