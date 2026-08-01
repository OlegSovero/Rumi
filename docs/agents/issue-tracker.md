# Issue Tracker

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create an issue: `gh issue create --title "..." --body "..."`.
- Read an issue: `gh issue view <number> --comments`.
- List issues: `gh issue list --state open --json number,title,body,labels,comments`.
- Comment on an issue: `gh issue comment <number> --body "..."`.
- Apply or remove labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Close an issue: `gh issue close <number> --comment "..."`.

Infer the repository from the configured Git remote. The repository is `OlegSovero/Rumi`.

## Pull Requests

Pull requests are not treated as a request surface for triage. Review them only as part of normal code review or when explicitly requested.

## Published Specs And Tickets

When a skill says to publish to the issue tracker, create a GitHub issue. Use GitHub issue dependencies for blocking relationships when the workflow requires them.
