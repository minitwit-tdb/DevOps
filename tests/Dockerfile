FROM python:3.7-alpine
RUN pip install requests

WORKDIR /usr/tests

COPY SimulatorTests.py ./SimulatorTests.py
COPY minitwit_scenario_small.csv ./minitwit_scenario.csv

ENTRYPOINT ["python", "SimulatorTests.py", "http://server:5001"]