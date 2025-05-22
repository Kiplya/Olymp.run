FROM judge0/judge0:latest

USER root
RUN mkdir -p /box && chown -R judge0:judge0 /box && chmod -R 700 /box
USER judge0