---
id: lesson-devops-linux-networking
kind: lesson
topicId: devops-linux-networking
title: Diagnose Linux network connectivity
summary: Trace DNS, routes, listeners, firewalls, and SSH when a service cannot be reached.
status: published
revision: 1
order: 10
tags: [linux, networking]
---

## Trace a request layer by layer

First establish the source, destination, protocol, port, and expected result. `getent hosts example.com` checks configured name resolution; DNS answers can differ by host or resolver. `ip addr` shows interfaces, `ip route` shows routes, and `ip route get DESTINATION` shows the selected route. A valid DNS answer does not establish network reachability.

On the server, `ss -lnt` lists TCP listeners and their bind addresses. A service bound to `127.0.0.1` is not directly reachable through the host's external interface. `curl -v --connect-timeout 5 https://example.com/` reveals connection and TLS details; an HTTP error means the connection reached an HTTP responder, not necessarily the intended application. `ping` can help, but blocked ICMP does not prove TCP is unavailable.

## Access and filtering

Check host firewall rules, cloud firewalls/security groups, subnet routes, and the application's bind address. TCP timeout can indicate filtering or an unreachable route; connection refused usually means a reachable endpoint rejected the connection, but intermediaries can affect both signals. SSH authenticates a remote user and encrypts transport; verify host keys, use key-based authentication where appropriate, and restrict access. `ssh -v user@host` gives diagnostic detail.

## Practice

If local `curl` succeeds but remote `curl` times out, compare listener address, routes, and firewall rules before changing application code. Avoid exposing a previously private port just to make a test pass.

## Further reading

- [ss manual](https://man7.org/linux/man-pages/man8/ss.8.html)
