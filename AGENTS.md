# Release Notes

After every successful task that changes repository behavior, automation, public documentation, package metadata, or release configuration, add a changeset with this repository's CLI:

```bash
node dist/index.js add --type patch --message "<short change summary>"
```

Use `minor` or `major` instead of `patch` when the change adds a feature or introduces a breaking change. Do not run `changeset apply` during normal task work; release automation applies pending changesets when preparing the release.
