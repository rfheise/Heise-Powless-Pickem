FROM python:3
WORKDIR /usr/src/pickem
ADD requirements.txt /usr/src/pickem
RUN pip install -r requirements.txt
ADD . /usr/src/pickem
ENTRYPOINT [ "python3" ]
