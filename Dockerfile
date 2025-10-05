FROM ubuntu:latest
LABEL authors="wizard"

ENTRYPOINT ["top", "-b"]