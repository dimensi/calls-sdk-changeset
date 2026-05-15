**v1.5.1**

* (🐛 patch, 2026-05-15) Automate release preparation from GitHub Actions and document changeset follow-up instructions


**v1.5.0**

* (✨ minor, 2026-05-15) Add non-interactive changeset creation for CI and scripts
* (🐛 patch, 2026-05-15) Update npm publish workflow to Node 24-compatible GitHub Actions
* (🐛 patch, 2026-05-15) Add npm Trusted Publishing automation with GitHub Release notes


**v1.4.0**

* (✨ minor, 2025-07-25) Enhance apply command to support filtering changesets by date.
* (🐛 patch, 2025-07-25) Update package-lock.json and package.json to reflect new package name and add chokidar dependency.


**v1.3.0**

* (✨ minor, 2025-07-25) Refactor package.json and enhance command options. Update main entry point and add files to package.json. Improve error handling in apply command and add save functionality for processed files. Standardize string quotes in types and commands.


**v1.2.1**

* (🐛 patch, 2025-07-24) Update changelog format to use asterisks for entries and ensure consistent formatting in utils.ts


**v1.2.0**

* (✨ minor, 2025-07-24) Enhance apply command to support full changelog preview and update README with new options


**v1.1.0**

* (✨ minor, 2025-07-24) Add publishConfig for public access in package.json, remove message field from ChangesetYaml, and standardize string quotes in utils.ts


**v1.0.0**

* (🚨 major) Initial release of changeset CLI tool
* (✨ minor) Implement compact changelog format with emoji prefixes
* (✨ minor) Add --use-current-version option for apply command
* (✨ minor) Add Markdown format with YAML headers for changeset files
* (🐛 patch) Fix SWC configuration for ES modules support
* (🐛 patch) Add comprehensive documentation and usage examples
* (🐛 patch) Simplify interface by removing additional description field
* (🐛 patch) Refactor changelog format, update package name, and enhance apply command functionality