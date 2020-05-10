## Lessons learned

### Working in an unfamiliar environment

A few of us have never touched Linux before as an operating system,
this meant we had to figure out and learn Linux as an OS and the commands
as well as learning parrellel with the course material of DevOps.
This meant we had to learn fast and seek out information even faster.
In hindsight we can confidently say we have gotten a better familiarity
with package managers and Linux' built-in terminal.

### Servers are not black magic

We had never really spent that much time in the Operations aspect of DevOps before this course. Therefore, figuring out exactly how to get our code up and running on another machine seemed a bit daunting, especially when we considered how to do it in a portable fashion.

However, when we learned basic concepts such as SSH, SCP, Unix commands, etc. it quickly turned out to not be that different running our code on a server than on our own local machines.

DevOps allowed us to strengthen this link between our code on our local machines and the code running on our server even more. Virtualization through Docker made it as easy as running the command `docker-compose up -d` on the server.

### 'It works on my machine'

A common problem which we ourselves weren't free from. Several times during
the project we had the problem that it worked on one machine, but none
of the others. One of the supposed reasons at some point was that we were
working in between operating systems. This included Mac, Linux and Windows.
This occoured more than once. Which led to the group having to try and
figure out why it broke on certain machines and not others. From this
we have learnt to be vigilant when it comes to rolling builds, as a successfull
build on one end, may not be successful on the other.

### Distributed DevOps

Due to conflicting schedules, and later COVID-19, we had to use tools related to working in a distributed environment to a larger degree than we were used to. This made Slack and our Git-Flow strategy even more important, and made CI/CD even more beneficial than normally, as it made sure that we caught issues and automated things that might have slipped by or have been forgotten when no one was around to catch it.

### Deployment strategies, load-balancing and scaling

Before starting this course none of us knew how to properly scale and load-balance a service. Therefore we believed that integrating such a feature into existing applications would require major reconstruction.

However, we learned just how much Docker Swarm provides out of the box (rolling updates, load-balanncing and scaling) and how simply it was to actually integrate with our services. As seen in the [pull-request merge](https://github.com/minitwit-tdb/DevOps/commit/e587f900f1ed05fa671fa6bde5b04a05c47fbc28) then the feature only included 12 lines of new code and some minor configurations on our servers.

### Logging and monitoring

We learned about a lot regarding monitoring and logging. A standard format of logs to help make them easily digestible and more tool friendly. Logs are generated based on the use of a system and this can cause parts of the system to become memory starved.

When we had to add logging to our system, the potential for sensitive data to show up in logs was a previously unknown factor.

In these times where GDPR exists, there needs to be some way of handling this sensitive data. We opted to minimise the sensitive data we store.
Monitoring is about more than looking at the speed or usage of a system. Merely having tools that observe your system is insufficient to be called monitoring as the output needs to be observed to have influence. Monitoring lets DevOps employees find errors in the system, realise a service isn't running and lets these issues be fixed quicker.

## Reflection

We never had a big focus on Operations before, but in this project it has been a major focus, and hence we have learned a lot about it and applied tools to help with Operations. In particular we ended up actually getting to deploy our code, which is rarely done in other courses.

Secondly we have seen just how much our CI/CD pipeline could provide for us, as developers. It provided confidence in the code we wrote, and it relieved us of a lot of work with many DevOps aspects such that we could focus on other matters. Some configuration and "it just works".

Monitoring also has proved useful as a means of getting a better and more systemized overview of how the project has worked while it was in production. It also helps more quickly solve potential issues as they arise.

Finally, in regular projects, writing maintainable and extendable code is of course good practice. However in this course and this project writing maintainable code appeared as a must. With a constant rolling out of new builds it became important to be able to maintain and extend them on the fly in anticipation of new features or likewise new implementations.

We will be keeping all these learnings in mind for the future.
