FROM python:3.7-alpine

WORKDIR /usr/tests

COPY tests/SimulatorTests.py ./SimulatorTests.py
COPY tests/minitwit_scenario_small.csv ./minitwit_scenario.csv

RUN pip install requests

ENTRYPOINT ["python", "SimulatorTests.py", "http://localhost:5001"]