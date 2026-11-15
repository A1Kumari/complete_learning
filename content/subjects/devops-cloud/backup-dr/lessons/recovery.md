---
id: lesson-devops-backup-dr
kind: lesson
topicId: devops-backup-dr
title: Backups and disaster recovery
summary: Design and test restoration against recovery point and recovery time objectives.
status: published
revision: 1
order: 10
tags: [backup, disaster-recovery]
---

## Set objectives

Recovery point objective (RPO) is the maximum acceptable data loss measured in time; recovery time objective (RTO) is the maximum acceptable time to restore service. Define them for each critical service and dependency. A database may meet its RPO while an application still cannot recover because credentials, configuration, or another service is unavailable.

Full backups provide a base; incremental or differential backups and transaction logs can reduce backup cost or support point-in-time recovery, depending on the product. Protect backups from accidental deletion and compromise, retain required encryption keys, and keep copies in a suitable independent failure domain. Replication improves availability but can propagate destructive changes and is not a backup.

## Test the whole recovery

Restore into an isolated environment, replay logs if required, validate consistency, start dependent services, and measure elapsed time. Record the actual recovery point and compare it with RPO/RTO. Exercise failover and failback, including DNS, credentials, traffic, and split-brain prevention. Automate repeatable steps but retain an accessible, tested runbook.

## Practice

If backups run nightly, can a 15-minute RPO be assumed? No; it requires an appropriate log or incremental strategy and tested restore. Is a successful backup job sufficient proof? No, verify restoration.

## Further reading

- [AWS disaster recovery guidance](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-architecture.html)
