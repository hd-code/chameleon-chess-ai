FROM jupyter/scipy-notebook
# FROM jupyter/tensorflow-notebook

USER root

RUN apt-get update && apt-get install -y nodejs

USER jovyan

RUN npm install -g tslab
RUN tslab install --python=python3

EXPOSE 8888

# start jupyter with password 'secret'
CMD [ "start-notebook.sh","--NotebookApp.password='sha1:6c2164fc2b22:ed55ecf07fc0f985ab46561483c0e888e8964ae6'" ]