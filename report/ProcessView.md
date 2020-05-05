## Process's Perspective


###### How do you interact as developers?

Prior to the Corona lockdown, we met up once a week for the lectures and would discuss/allocate tasks afterwards. For communication between lectures, we used Slack where we would discuss details and ask for advice and help as needed.
After the lockdown happened, we've been more active on Slack regarding organization and still asking for advice and help. More communication was a clear reaction to the lockdown.

###### How is the team organized?

We are 4 team members with varying skills.
Most worthwhile to note would be Lasse, as he was the primary drive force behind choosing NodeJs and TypeScript as well as getting progress made on the project. Lasse became the defacto expert primarily because he was the only member with experience regarding NodeJs and TypeScript.

###### A complete description of stages and tools included in the CI/CD chains.
 - That is, including deployment and release of your systems.

The CI/CD chains use GitHub, Docker, DockerHub and Yarn, which is a package manager.

We have two different CI/CD chains.
One is called 'commit' and has the two jobs/stages called 'lint' and 'api_test'.
The other is called 'deploy' and has the 4 jobs/stages called 'api_test', 'lint', 'build' and 'deploy'.
The 'deploy' chain only runs on commits to the master branch but the 'commit' chain runs on commits to any branch.

All non-test job/stage spins up a docker VM with the image circleci/node:13.8.0 whereas the test job/stage uses the image circleci/python:3.8 because the tests are written in Python.
The 'lint' job/stage runs `yarn install` to install dependencies and then `yarn lint` to lint the code.
The 'api_test' job/stage moves to the test directory and run `docker-compose run tests` followed by `docker-compose down`.
The 'build' job/stage logs onto DockerHub before running `docker build` to build the latest version of the application before pushing it to DockerHub using `docker push`.
The 'deploy' job/stage uses SSH to connect to the Docker Swarm host machine and executes the script in update.sh supplying the relevant Docker credentials.

- Have Lasse confirm stages and tools when this section is done.

###### Organization of your repositor(ies).
 - That is, either the structure of of mono-repository or organization of artifacts across repositories.
 - In essence, it has to be be clear what is stored where and why.

Originally, we had a mono-repository on github.itu.dk with all artifacts. However, when it was time to add CI/CD tools to the project, our choice of tool did not work with GitHub repositories on GitHub Enterprise setups and we had to migrate it all to standard github.com which would link to the CI tool properly.
The artifacts stored on the repository include Docker configuration files, Prometheus configuration file, Yarn configuration file, CircleCI configuration file, a pdf of our security report, test files and all the NodeJs server files as TypeScript, HTML and CSS.

###### Applied branching strategy.

We barely needed to discuss branching strategy as it became apparently very quickly that we all liked the concept of Git-Flow, whether or not we had much experience with it. As such, the employed strategy is Git-Flow.

mere (locked branches, reviews etc.)

###### Applied development process and tools supporting it
 -  For example, how did you use issues, Kanban boards, etc. to organize open tasks

Part way through the project there was an attempt at using GitHub Issues to track tasks but partly due to the migration needed for the CI/CD tool and the migration not including the issues, this naturally fell apart.
From the beginning, the group had discussed and allocated tasks after lectures and it was almost always the case that the number of tasks was sufficiently small that this agreement was enough for us. The use of Git-Flow and feature branches also meant an easy way to track the progress from an overview perspective.

###### How do you monitor your systems and what precisely do you monitor?

Monitoring the system is done with Prometheus and Grafana.
We monitor the total number of HTTP responses, the average request duration across all requests, the average response time for requests to the /latest route, the average response time for requests about the followers of a given user, the average response time for requests for the messages made by a given user, the average response time for requests for registering a user, and the average response time for requests for the frontpage.

[Add picture of our grafana dashboard. Can be found on slack.]

###### What do you log in your systems and how do you aggregate logs?

We log ...
[what do we log? briefly summarized.]


For aggregating logs, we use ELK. With Logstash for the aggregation itself, ElasticSearch for converting the stash of logs to a more readable format and Kibana for visualization of the logs.
Using these services in combination we log [insert Lasse here] With a focus on the following levels of messages [see session 08 for an overview of the message levels.]

###### Brief results of the security assessment.

Brief overview of our security flaws:
- The information of our users is publicly available on our site.
- Our password hashing configuration is currently available in our source code to the public at the moment. Allowing malicious agents to crack user passwords.
- Our API is currently exposed, allowing malicious agents to act on behalf of registered users allowing the bypassing of our limited security of passwords.
- Our server is not protected beyond that of a regular server, meaning malicious agents would be able to erase logs or their own tracks.

As for our risk matrix:
- **Medium Risk with high impact** is expected to be quite low since the access to the server is only through ssh. But our site is running on http, therefore it would be easy to sniff internet traffic for sensitive information such as raw passwords.
- **High Risk with medium impact** The risk of a hacker acquiring access to our hashing configuration is as simple as accessing the public repository on git.
- **Medium Risk with medium impact** Since we don't really protect our API it is possible for malicious agents to send additional messages that can bypass password security.
- **Low Risk with high impact** Any access to our servers from malicious agents would give access to the production server. Allowing them to alter data in the production database. including passwords and usernames.

###### Pen testing our system
Following the OWASP ZAP and top 10. We have attempted to test our own system, this is in short the results of such testing.

- **OWASP ZAP and injection** running OWASP ZAP we discovered that we have exposed our tech stack, allowing for malicious agents to make targeted attacks, or use known exploits on certain systems. We did conclude however, that our system is very resilient to injection due to ORM sanitation and not handling user input directly.

- **Broken Authentication** We have implemented slight mitigation by limiting by IP-addresses, meaning that repeated attempts from the same IP, will be locked out of the system for a short while thus limiting a rapid fire brute force approach. Furthermore we have also implemented countermeasures against giving information to an attempted intrusion. Our first implementation gave individual errors regarding username or password and which of them was wrong. We have since then implemented a singular error to portray only a single error alerting the user that either or, could be wrong.


###### Applied strategy for scaling and load balancing.

The strategy for scaling and load balancing that was decided on is Docker Swarm, as this was considered more easily scalable than a hot and standby server setup. This is due to more easily adding nodes in the Swarm cluster and Swarm already handling load balancing without additional work. Another benefit to using Swarm is that it automatically restarts services that go down.

[How many docker nodes do we have and how many can we survive to lose?]

As an upgrade strategy, we're using rolling updates. [More details? Remove this part?]
