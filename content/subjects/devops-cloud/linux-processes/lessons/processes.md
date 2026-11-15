---
id: lesson-devops-linux-processes
kind: lesson
topicId: devops-linux-processes
title: Linux processes, signals, and services
summary: Inspect process state, manage signals and jobs, and troubleshoot systemd services.
status: published
revision: 1
order: 10
tags: [linux, systemd]
---

## Processes and jobs

A process has a PID, parent, credentials, resources, and one or more threads. Use `ps aux`, `ps -ef`, `top`, or `ps -o pid,ppid,stat,cmd -p PID` to inspect. A zombie has exited but awaits its parent's collection of exit status; it is not a running process to kill. Shell jobs (`jobs`, `fg`, `bg`) are distinct from system services and are managed by the current shell.

Signals request or cause behavior. `kill -TERM PID` asks a process to terminate and permits graceful cleanup if handled. `kill -KILL PID` cannot be caught and prevents cleanup; use it only when appropriate after identifying the process. `SIGHUP` often triggers reload, but the application defines its behavior. A signal sent to the wrong PID can interrupt unrelated work.

## systemd workflow

`systemctl status example.service` shows state and recent messages; `journalctl -u example.service` examines its journal. `systemctl start`, `stop`, `restart`, and `reload` have different effects; `enable` configures startup and does not necessarily start the service now. A unit describes an executable, user, dependencies, environment, and restart policy. After changing a unit file, `systemctl daemon-reload` reloads unit definitions; it does not restart the service.

## Practice

A service immediately restarts after exit: inspect its unit's restart policy and journal rather than repeatedly killing its PID. If the service is active but unhealthy, inspect its application health and dependencies; active is not proof that requests succeed.

## Further reading

- [systemctl manual](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)
