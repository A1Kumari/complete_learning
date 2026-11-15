---
id: lesson-devops-bash
kind: lesson
topicId: devops-bash
title: Bash pipelines and reliable scripts
summary: Use quoting, exit codes, pipelines, and scheduled tasks to automate repeatable operations.
status: published
revision: 1
order: 10
tags: [bash, automation]
---

## Compose commands safely

Standard input, output, and error are separate streams. `command > output.txt` replaces a file, `>>` appends, and `2> errors.txt` redirects errors. A pipe sends one command's output to another's input. Quote expansions such as `"$path"` to preserve spaces and avoid unintended glob expansion. Use `$(command)` for command substitution and check exit status; zero conventionally indicates success.

```bash
#!/usr/bin/env bash
set -u
log_file=${1:?Provide a log file}
if [[ ! -r "$log_file" ]]; then
  printf 'Cannot read: %s\n' "$log_file" >&2
  exit 1
fi
grep -c 'ERROR' "$log_file" || status=$?
if [[ ${status:-0} -gt 1 ]]; then
  printf 'Search failed\n' >&2
  exit "$status"
fi
```

Here `grep` returns 1 for no matches, not an operational error. `set -e` has context-dependent exceptions and is not a substitute for explicit error handling; `set -o pipefail` changes pipeline exit behavior in Bash. Test scripts with representative inputs and tools such as ShellCheck.

## Scheduling

Cron runs with a restricted environment and different working directory from an interactive shell. Use absolute paths, explicit environment settings, logging, and a strategy to avoid overlapping runs. Test manually before scheduling and monitor failures; timezone and daylight-saving behavior depend on the scheduler.

## Practice

What happens when a filename contains spaces? An unquoted variable can split into multiple arguments. Why can a pipeline hide failure? By default Bash reports the last command's status, not necessarily an earlier failure.

## Further reading

- [Bash reference manual](https://www.gnu.org/software/bash/manual/bash.html)
