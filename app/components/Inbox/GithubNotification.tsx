"use client";

import { GithubNotificationProps } from "@/types/github";
import { getCleanLink } from "@/utils/Shared";
import { Tag, Tooltip } from "antd";
import Image from "next/image";
import { BiRightArrowAlt } from "react-icons/bi";
import { HiExternalLink } from "react-icons/hi";
import { remark } from "remark";
import html from "remark-html";

const sample = {
  body: '<!-- If necessary, assign reviewers that know the area or changes well. Feel free to tag any additional reviewers you see fit. -->\r\n\r\n### Details\r\n<!-- Explanation of the change or anything fishy that is going on -->\r\n\r\n### Fixed Issues\r\n<!---\r\n1. Please postfix `$` with a URL link to the GitHub issue this Pull Request is fixing. For example, `$ https://github.com/Expensify/App/issues/<issueID>`.\r\n2. Please postfix  `PROPOSAL:` with a URL link to your GitHub comment, which contains the approved proposal (i.e. the proposal that was approved by Expensify).  For example, `PROPOSAL: https://github.com/Expensify/App/issues/<issueID>#issuecomment-1369752925`\r\n\r\nDo NOT add the special GH keywords like `fixed` etc, we have our own process of managing the flow.\r\nIt MUST be an entire link to the github issue and your comment proposal ; otherwise, the linking and its automation will not work as expected.\r\n\r\nMake sure this section looks similar to this (you can link multiple issues using the same formatting, just add a new line):\r\n\r\n$ https://github.com/Expensify/App/issues/<issueID>\r\n$ https://github.com/Expensify/App/issues/<issueID(comment)>\r\n\r\nDo NOT only link the issue number like this: $ #<issueID>\r\n--->\r\n$ \r\nPROPOSAL: \r\n\r\n\r\n### Tests\r\n<!---\r\nAdd a numbered list of manual tests you performed that validates your changes work on all platforms, and that there are no regressions present.\r\nAdd any additional test steps if test steps are unique to a particular platform.\r\nManual test steps should be written so that your reviewer can repeat and verify one or more expected outcomes in the development environment.\r\n\r\nFor example:\r\n1. Click on the text input to bring it into focus\r\n2. Upload an image via copy paste\r\n3. Verify a modal appears displaying a preview of that image\r\n--->\r\n\r\n- [ ] Verify that no errors appear in the JS console\r\n\r\n### Offline tests\r\n<!---\r\nAdd any relevant steps that validate your changes work as expected in a variety of network states e.g. "offline", "spotty connection", "slow internet", etc. Manual test steps should be written so that your reviewer and QA testers can repeat and verify one or more expected outcomes. If you are unsure how the behavior should work ask for advice in the `#expensify-open-source` Slack channel.\r\n--->\r\n\r\n### QA Steps\r\n<!---\r\nAdd a numbered list of manual tests that can be performed by our QA engineers on the staging environment to validate that your changes work on all platforms, and that there are no regressions present.\r\nAdd any additional QA steps if test steps are unique to a particular platform.\r\nManual test steps should be written so that the QA engineer can repeat and verify one or more expected outcomes in the staging environment.\r\n\r\nFor example:\r\n1. Click on the text input to bring it into focus\r\n2. Upload an image via copy paste\r\n3. Verify a modal appears displaying a preview of that image\r\n--->\r\n\r\n- [ ] Verify that no errors appear in the JS console\r\n\r\n### PR Author Checklist\r\n<!--\r\nThis is a checklist for PR authors. Please make sure to complete all tasks and check them off once you do, or else your PR will not be merged!\r\n-->\r\n\r\n- [ ] I linked the correct issue in the `### Fixed Issues` section above\r\n- [ ] I wrote clear testing steps that cover the changes made in this PR\r\n    - [ ] I added steps for local testing in the `Tests` section\r\n    - [ ] I added steps for the expected offline behavior in the `Offline steps` section\r\n    - [ ] I added steps for Staging and/or Production testing in the `QA steps` section\r\n    - [ ] I added steps to cover failure scenarios (i.e. verify an input displays the correct error message if the entered data is not correct)\r\n    - [ ] I turned off my network connection and tested it while offline to ensure it matches the expected behavior (i.e. verify the default avatar icon is displayed if app is offline)\r\n    - [ ] I tested this PR with a [High Traffic account](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md#high-traffic-accounts) against the staging or production API to ensure there are no regressions (e.g. long loading states that impact usability).\r\n- [ ] I included screenshots or videos for tests on [all platforms](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md#make-sure-you-can-test-on-all-platforms)\r\n- [ ] I ran the tests on **all platforms** & verified they passed on:\r\n    - [ ] Android / native\r\n    - [ ] Android / Chrome\r\n    - [ ] iOS / native\r\n    - [ ] iOS / Safari\r\n    - [ ] MacOS / Chrome / Safari\r\n    - [ ] MacOS / Desktop\r\n- [ ] I verified there are no console errors (if there\'s a console error not related to the PR, report it or open an issue for it to be fixed)\r\n- [ ] I followed proper code patterns (see [Reviewing the code](https://github.com/Expensify/App/blob/main/contributingGuides/PR_REVIEW_GUIDELINES.md#reviewing-the-code))\r\n    - [ ] I verified that any callback methods that were added or modified are named for what the method does and never what callback they handle (i.e. `toggleReport` and not `onIconClick`)\r\n    - [ ] I verified that the left part of a conditional rendering a React component is a boolean and NOT a string, e.g. `myBool && <MyComponent />`.\r\n    - [ ] I verified that comments were added to code that is not self explanatory\r\n    - [ ] I verified that any new or modified comments were clear, correct English, and explained "why" the code was doing something instead of only explaining "what" the code was doing.\r\n    - [ ] I verified any copy / text shown in the product is localized by adding it to `src/languages/*` files and using the [translation method](https://github.com/Expensify/App/blob/4bd99402cebdf4d7394e0d1f260879ea238197eb/src/components/withLocalize.js#L60)\r\n      - [ ] If any non-english text was added/modified, I verified the translation was requested/reviewed in #expensify-open-source and it was approved by an internal Expensify engineer. Link to Slack message:\r\n    - [ ] I verified all numbers, amounts, dates and phone numbers shown in the product are using the [localization methods](https://github.com/Expensify/App/blob/4bd99402cebdf4d7394e0d1f260879ea238197eb/src/components/withLocalize.js#L60-L68)\r\n    - [ ] I verified any copy / text that was added to the app is grammatically correct in English. It adheres to proper capitalization guidelines (note: only the first word of header/labels should be capitalized), and is approved by marketing by adding the `Waiting for Copy` label for a copy review on the original GH to get the correct copy.\r\n    - [ ] I verified proper file naming conventions were followed for any new files or renamed files. All non-platform specific files are named after what they export and are not named "index.js". All platform-specific files are named for the platform the code supports as outlined in the README.\r\n    - [ ] I verified the JSDocs style guidelines (in [`STYLE.md`](https://github.com/Expensify/App/blob/main/contributingGuides/STYLE.md#jsdocs)) were followed\r\n- [ ] If a new code pattern is added I verified it was agreed to be used by multiple Expensify engineers\r\n- [ ] I followed the guidelines as stated in the [Review Guidelines](https://github.com/Expensify/App/blob/main/contributingGuides/PR_REVIEW_GUIDELINES.md)\r\n- [ ] I tested other components that can be impacted by my changes (i.e. if the PR modifies a shared library or component like `Avatar`, I verified the components using `Avatar` are working as expected)\r\n- [ ] I verified all code is DRY (the PR doesn\'t include any logic written more than once, with the exception of tests)\r\n- [ ] I verified any variables that can be defined as constants (ie. in CONST.js or at the top of the file that uses the constant) are defined as such\r\n- [ ] I verified that if a function\'s arguments changed that all usages have also been updated correctly\r\n- [ ] If a new component is created I verified that:\r\n    - [ ] A similar component doesn\'t exist in the codebase\r\n    - [ ] All props are defined accurately and each prop has a `/** comment above it */`\r\n    - [ ] The file is named correctly\r\n    - [ ] The component has a clear name that is non-ambiguous and the purpose of the component can be inferred from the name alone\r\n    - [ ] The only data being stored in the state is data necessary for rendering and nothing else\r\n    - [ ] If we are not using the full Onyx data that we loaded, I\'ve added the proper selector in order to ensure the component only re-renders when the data it is using changes\r\n    - [ ] For Class Components, any internal methods passed to components event handlers are bound to `this` properly so there are no scoping issues (i.e. for `onClick={this.submit}` the method `this.submit` should be bound to `this` in the constructor)\r\n    - [ ] Any internal methods bound to `this` are necessary to be bound (i.e. avoid `this.submit = this.submit.bind(this);` if `this.submit` is never passed to a component event handler like `onClick`)\r\n    - [ ] All JSX used for rendering exists in the render method\r\n    - [ ] The component has the minimum amount of code necessary for its purpose, and it is broken down into smaller components in order to separate concerns and functions\r\n- [ ] If any new file was added I verified that:\r\n    - [ ] The file has a description of what it does and/or why is needed at the top of the file if the code is not self explanatory\r\n- [ ] If a new CSS style is added I verified that:\r\n    - [ ] A similar style doesn\'t already exist\r\n    - [ ] The style can\'t be created with an existing [StyleUtils](https://github.com/Expensify/App/blob/main/src/styles/StyleUtils.js) function (i.e. `StyleUtils.getBackgroundAndBorderStyle(themeColors.componentBG)`)\r\n- [ ] If the PR modifies code that runs when editing or sending messages, I tested and verified there is no unexpected behavior for all supported markdown - URLs, single line code, code blocks, quotes, headings, bold, strikethrough, and italic.\r\n- [ ] If the PR modifies a generic component, I tested and verified that those changes do not break usages of that component in the rest of the App (i.e. if a shared library or component like `Avatar` is modified, I verified that `Avatar` is working as expected in all cases)\r\n- [ ] If the PR modifies a component related to any of the existing Storybook stories, I tested and verified all stories for that component are still working as expected.\r\n- [ ] If the PR modifies a component or page that can be accessed by a direct deeplink, I verified that the code functions as expected when the deeplink is used - from a logged in and logged out account.\r\n- [ ] If a new page is added, I verified it\'s using the `ScrollView` component to make it scrollable when more elements are added to the page.\r\n- [ ] If the `main` branch was merged into this PR after a review, I tested again and verified the outcome was still expected according to the `Test` steps.\r\n- [ ] I have checked off every checkbox in the PR author checklist, including those that don\'t apply to this PR.\r\n\r\n### Screenshots/Videos\r\n<details>\r\n<summary>Web</summary>\r\n\r\n<!-- add screenshots or videos here -->\r\n\r\n</details>\r\n\r\n<details>\r\n<summary>Mobile Web - Chrome</summary>\r\n\r\n<!-- add screenshots or videos here -->\r\n\r\n</details>\r\n\r\n<details>\r\n<summary>Mobile Web - Safari</summary>\r\n\r\n<!-- add screenshots or videos here -->\r\n\r\n</details>\r\n\r\n<details>\r\n<summary>Desktop</summary>\r\n\r\n<!-- add screenshots or videos here -->\r\n\r\n</details>\r\n\r\n<details>\r\n<summary>iOS</summary>\r\n\r\n<!-- add screenshots or videos here -->\r\n\r\n</details>\r\n\r\n<details>\r\n<summary>Android</summary>\r\n\r\n<!-- add screenshots or videos here -->\r\n\r\n</details>',
  head: {
    label: "Servcy:inbox-page",
    ref: "inbox-page",
    sha: "f1bba07cd97e34b91013520127c930aca0e27ecc",
    user: {
      login: "Servcy",
      id: 117988210,
      node_id: "O_kgDOBwhbcg",
      avatar_url: "https://avatars.githubusercontent.com/u/117988210?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/Servcy",
      html_url: "https://github.com/Servcy",
      followers_url: "https://api.github.com/users/Servcy/followers",
      following_url:
        "https://api.github.com/users/Servcy/following{/other_user}",
      gists_url: "https://api.github.com/users/Servcy/gists{/gist_id}",
      starred_url: "https://api.github.com/users/Servcy/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/Servcy/subscriptions",
      organizations_url: "https://api.github.com/users/Servcy/orgs",
      repos_url: "https://api.github.com/users/Servcy/repos",
      events_url: "https://api.github.com/users/Servcy/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/Servcy/received_events",
      type: "Organization",
      site_admin: false,
    },
    repo: {
      id: 629833928,
      node_id: "R_kgDOJYqAyA",
      name: "Client",
      full_name: "Servcy/Client",
      private: false,
      owner: {
        login: "Servcy",
        id: 117988210,
        node_id: "O_kgDOBwhbcg",
        avatar_url: "https://avatars.githubusercontent.com/u/117988210?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/Servcy",
        html_url: "https://github.com/Servcy",
        followers_url: "https://api.github.com/users/Servcy/followers",
        following_url:
          "https://api.github.com/users/Servcy/following{/other_user}",
        gists_url: "https://api.github.com/users/Servcy/gists{/gist_id}",
        starred_url:
          "https://api.github.com/users/Servcy/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/Servcy/subscriptions",
        organizations_url: "https://api.github.com/users/Servcy/orgs",
        repos_url: "https://api.github.com/users/Servcy/repos",
        events_url: "https://api.github.com/users/Servcy/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/Servcy/received_events",
        type: "Organization",
        site_admin: false,
      },
      html_url: "https://github.com/Servcy/Client",
      description:
        "A Next.js, TailwindCSS dashboard client for app.servcy.com which intends to save time & money for freelance agencies",
      fork: false,
      url: "https://api.github.com/repos/Servcy/Client",
      forks_url: "https://api.github.com/repos/Servcy/Client/forks",
      keys_url: "https://api.github.com/repos/Servcy/Client/keys{/key_id}",
      collaborators_url:
        "https://api.github.com/repos/Servcy/Client/collaborators{/collaborator}",
      teams_url: "https://api.github.com/repos/Servcy/Client/teams",
      hooks_url: "https://api.github.com/repos/Servcy/Client/hooks",
      issue_events_url:
        "https://api.github.com/repos/Servcy/Client/issues/events{/number}",
      events_url: "https://api.github.com/repos/Servcy/Client/events",
      assignees_url:
        "https://api.github.com/repos/Servcy/Client/assignees{/user}",
      branches_url:
        "https://api.github.com/repos/Servcy/Client/branches{/branch}",
      tags_url: "https://api.github.com/repos/Servcy/Client/tags",
      blobs_url: "https://api.github.com/repos/Servcy/Client/git/blobs{/sha}",
      git_tags_url: "https://api.github.com/repos/Servcy/Client/git/tags{/sha}",
      git_refs_url: "https://api.github.com/repos/Servcy/Client/git/refs{/sha}",
      trees_url: "https://api.github.com/repos/Servcy/Client/git/trees{/sha}",
      statuses_url: "https://api.github.com/repos/Servcy/Client/statuses/{sha}",
      languages_url: "https://api.github.com/repos/Servcy/Client/languages",
      stargazers_url: "https://api.github.com/repos/Servcy/Client/stargazers",
      contributors_url:
        "https://api.github.com/repos/Servcy/Client/contributors",
      subscribers_url: "https://api.github.com/repos/Servcy/Client/subscribers",
      subscription_url:
        "https://api.github.com/repos/Servcy/Client/subscription",
      commits_url: "https://api.github.com/repos/Servcy/Client/commits{/sha}",
      git_commits_url:
        "https://api.github.com/repos/Servcy/Client/git/commits{/sha}",
      comments_url:
        "https://api.github.com/repos/Servcy/Client/comments{/number}",
      issue_comment_url:
        "https://api.github.com/repos/Servcy/Client/issues/comments{/number}",
      contents_url:
        "https://api.github.com/repos/Servcy/Client/contents/{+path}",
      compare_url:
        "https://api.github.com/repos/Servcy/Client/compare/{base}...{head}",
      merges_url: "https://api.github.com/repos/Servcy/Client/merges",
      archive_url:
        "https://api.github.com/repos/Servcy/Client/{archive_format}{/ref}",
      downloads_url: "https://api.github.com/repos/Servcy/Client/downloads",
      issues_url: "https://api.github.com/repos/Servcy/Client/issues{/number}",
      pulls_url: "https://api.github.com/repos/Servcy/Client/pulls{/number}",
      milestones_url:
        "https://api.github.com/repos/Servcy/Client/milestones{/number}",
      notifications_url:
        "https://api.github.com/repos/Servcy/Client/notifications{?since,all,participating}",
      labels_url: "https://api.github.com/repos/Servcy/Client/labels{/name}",
      releases_url: "https://api.github.com/repos/Servcy/Client/releases{/id}",
      deployments_url: "https://api.github.com/repos/Servcy/Client/deployments",
      created_at: "2023-04-19T05:56:34Z",
      updated_at: "2023-09-01T10:17:46Z",
      pushed_at: "2023-10-06T10:58:22Z",
      git_url: "git://github.com/Servcy/Client.git",
      ssh_url: "git@github.com:Servcy/Client.git",
      clone_url: "https://github.com/Servcy/Client.git",
      svn_url: "https://github.com/Servcy/Client",
      homepage: "https://web.servcy.com",
      size: 947,
      stargazers_count: 0,
      watchers_count: 0,
      language: "TypeScript",
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: false,
      has_pages: false,
      has_discussions: false,
      forks_count: 1,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 3,
      license: null,
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: [
        "flowbite",
        "freelancing",
        "nextjs",
        "productivity-tools",
        "tailwindcss",
      ],
      visibility: "public",
      forks: 1,
      open_issues: 3,
      watchers: 0,
      default_branch: "main",
      allow_squash_merge: true,
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      delete_branch_on_merge: false,
      allow_update_branch: false,
      use_squash_pr_title_as_default: false,
      squash_merge_commit_message: "COMMIT_MESSAGES",
      squash_merge_commit_title: "COMMIT_OR_PR_TITLE",
      merge_commit_message: "PR_TITLE",
      merge_commit_title: "MERGE_MESSAGE",
    },
  },
  base: {
    label: "Servcy:main",
    ref: "main",
    sha: "6c4c1b3020276cefba56f3edbb332de5a367f484",
    user: {
      login: "Servcy",
      id: 117988210,
      node_id: "O_kgDOBwhbcg",
      avatar_url: "https://avatars.githubusercontent.com/u/117988210?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/Servcy",
      html_url: "https://github.com/Servcy",
      followers_url: "https://api.github.com/users/Servcy/followers",
      following_url:
        "https://api.github.com/users/Servcy/following{/other_user}",
      gists_url: "https://api.github.com/users/Servcy/gists{/gist_id}",
      starred_url: "https://api.github.com/users/Servcy/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/Servcy/subscriptions",
      organizations_url: "https://api.github.com/users/Servcy/orgs",
      repos_url: "https://api.github.com/users/Servcy/repos",
      events_url: "https://api.github.com/users/Servcy/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/Servcy/received_events",
      type: "Organization",
      site_admin: false,
    },
    repo: {
      id: 629833928,
      node_id: "R_kgDOJYqAyA",
      name: "Client",
      full_name: "Servcy/Client",
      private: false,
      owner: {
        login: "Servcy",
        id: 117988210,
        node_id: "O_kgDOBwhbcg",
        avatar_url: "https://avatars.githubusercontent.com/u/117988210?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/Servcy",
        html_url: "https://github.com/Servcy",
        followers_url: "https://api.github.com/users/Servcy/followers",
        following_url:
          "https://api.github.com/users/Servcy/following{/other_user}",
        gists_url: "https://api.github.com/users/Servcy/gists{/gist_id}",
        starred_url:
          "https://api.github.com/users/Servcy/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/Servcy/subscriptions",
        organizations_url: "https://api.github.com/users/Servcy/orgs",
        repos_url: "https://api.github.com/users/Servcy/repos",
        events_url: "https://api.github.com/users/Servcy/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/Servcy/received_events",
        type: "Organization",
        site_admin: false,
      },
      html_url: "https://github.com/Servcy/Client",
      description:
        "A Next.js, TailwindCSS dashboard client for app.servcy.com which intends to save time & money for freelance agencies",
      fork: false,
      url: "https://api.github.com/repos/Servcy/Client",
      forks_url: "https://api.github.com/repos/Servcy/Client/forks",
      keys_url: "https://api.github.com/repos/Servcy/Client/keys{/key_id}",
      collaborators_url:
        "https://api.github.com/repos/Servcy/Client/collaborators{/collaborator}",
      teams_url: "https://api.github.com/repos/Servcy/Client/teams",
      hooks_url: "https://api.github.com/repos/Servcy/Client/hooks",
      issue_events_url:
        "https://api.github.com/repos/Servcy/Client/issues/events{/number}",
      events_url: "https://api.github.com/repos/Servcy/Client/events",
      assignees_url:
        "https://api.github.com/repos/Servcy/Client/assignees{/user}",
      branches_url:
        "https://api.github.com/repos/Servcy/Client/branches{/branch}",
      tags_url: "https://api.github.com/repos/Servcy/Client/tags",
      blobs_url: "https://api.github.com/repos/Servcy/Client/git/blobs{/sha}",
      git_tags_url: "https://api.github.com/repos/Servcy/Client/git/tags{/sha}",
      git_refs_url: "https://api.github.com/repos/Servcy/Client/git/refs{/sha}",
      trees_url: "https://api.github.com/repos/Servcy/Client/git/trees{/sha}",
      statuses_url: "https://api.github.com/repos/Servcy/Client/statuses/{sha}",
      languages_url: "https://api.github.com/repos/Servcy/Client/languages",
      stargazers_url: "https://api.github.com/repos/Servcy/Client/stargazers",
      contributors_url:
        "https://api.github.com/repos/Servcy/Client/contributors",
      subscribers_url: "https://api.github.com/repos/Servcy/Client/subscribers",
      subscription_url:
        "https://api.github.com/repos/Servcy/Client/subscription",
      commits_url: "https://api.github.com/repos/Servcy/Client/commits{/sha}",
      git_commits_url:
        "https://api.github.com/repos/Servcy/Client/git/commits{/sha}",
      comments_url:
        "https://api.github.com/repos/Servcy/Client/comments{/number}",
      issue_comment_url:
        "https://api.github.com/repos/Servcy/Client/issues/comments{/number}",
      contents_url:
        "https://api.github.com/repos/Servcy/Client/contents/{+path}",
      compare_url:
        "https://api.github.com/repos/Servcy/Client/compare/{base}...{head}",
      merges_url: "https://api.github.com/repos/Servcy/Client/merges",
      archive_url:
        "https://api.github.com/repos/Servcy/Client/{archive_format}{/ref}",
      downloads_url: "https://api.github.com/repos/Servcy/Client/downloads",
      issues_url: "https://api.github.com/repos/Servcy/Client/issues{/number}",
      pulls_url: "https://api.github.com/repos/Servcy/Client/pulls{/number}",
      milestones_url:
        "https://api.github.com/repos/Servcy/Client/milestones{/number}",
      notifications_url:
        "https://api.github.com/repos/Servcy/Client/notifications{?since,all,participating}",
      labels_url: "https://api.github.com/repos/Servcy/Client/labels{/name}",
      releases_url: "https://api.github.com/repos/Servcy/Client/releases{/id}",
      deployments_url: "https://api.github.com/repos/Servcy/Client/deployments",
      created_at: "2023-04-19T05:56:34Z",
      updated_at: "2023-09-01T10:17:46Z",
      pushed_at: "2023-10-06T10:58:22Z",
      git_url: "git://github.com/Servcy/Client.git",
      ssh_url: "git@github.com:Servcy/Client.git",
      clone_url: "https://github.com/Servcy/Client.git",
      svn_url: "https://github.com/Servcy/Client",
      homepage: "https://web.servcy.com",
      size: 947,
      stargazers_count: 0,
      watchers_count: 0,
      language: "TypeScript",
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: false,
      has_pages: false,
      has_discussions: false,
      forks_count: 1,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 3,
      license: null,
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: [
        "flowbite",
        "freelancing",
        "nextjs",
        "productivity-tools",
        "tailwindcss",
      ],
      visibility: "public",
      forks: 1,
      open_issues: 3,
      watchers: 0,
      default_branch: "main",
      allow_squash_merge: true,
      allow_merge_commit: true,
      allow_rebase_merge: true,
      allow_auto_merge: false,
      delete_branch_on_merge: false,
      allow_update_branch: false,
      use_squash_pr_title_as_default: false,
      squash_merge_commit_message: "COMMIT_MESSAGES",
      squash_merge_commit_title: "COMMIT_OR_PR_TITLE",
      merge_commit_message: "PR_TITLE",
      merge_commit_title: "MERGE_MESSAGE",
    },
  },
};

const GithubNotification = ({
  data,
  cause,
  event,
  timestamp,
}: GithubNotificationProps) => {
  let link = "#null";
  let linkLabel = "View in Github";
  const { login, avatar_url } = JSON.parse(cause);
  const cleanImageLink = getCleanLink(avatar_url);

  const renderGithubEvent = () => {
    switch (event) {
      case "pull_request_review_thread": {
        link = data.thread?.comments[0]?.html_url ?? "#null";
        linkLabel = "View thread in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                <a
                  href={data.pull_request?.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <HiExternalLink
                    className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                    size="18"
                  />
                </a>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                  {data.pull_request?.state}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Labels:
              </div>
              <div>
                {data.pull_request?.labels?.map((label) => (
                  <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                    {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Thread:
              </div>
              <div
                className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.thread?.comments[0]?.body)
                    .toString(),
                }}
              />
            </div>
          </>
        );
      }
      case "pull_request_review_comment": {
        link = data.comment?.html_url ?? "#null";
        linkLabel = "View comment in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                <a
                  href={data.pull_request?.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <HiExternalLink
                    className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                    size="18"
                  />
                </a>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                  {data.pull_request?.state}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Labels:
              </div>
              <div>
                {data.pull_request?.labels?.map((label) => (
                  <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                    {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comment:
              </div>
              <div
                className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.comment?.body)
                    .toString(),
                }}
              />
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Reactions:
              </div>
              <div className="text-xs font-semibold text-servcy-black">
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👍 {data.comment?.reactions["+1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👎 {data.comment?.reactions["-1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😄 {data.comment?.reactions.laugh}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🎉 {data.comment?.reactions.hooray}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😕 {data.comment?.reactions.confused}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  ❤️ {data.comment?.reactions.heart}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🚀 {data.comment?.reactions.rocket}
                </span>
                <span className="border-1 rounded-lg bg-servcy-white p-1">
                  👀 {data.comment?.reactions.eyes}
                </span>
              </div>
            </div>
          </>
        );
      }
      case "pull_request_review": {
        link = data.review?.html_url ?? "#null";
        linkLabel = "View review in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                <a
                  href={data.pull_request?.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <HiExternalLink
                    className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                    size="18"
                  />
                </a>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                  {data.pull_request?.state}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Labels:
              </div>
              <div>
                {data.pull_request?.labels?.map((label) => (
                  <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                    {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Review State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.review?.state}
                </Tag>
              </div>
            </div>
            {data.review?.body && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Review comment:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.review.body)
                      .toString(),
                  }}
                />
              </div>
            )}
          </>
        );
      }
      case "projects_v2": {
        link = `https://github.com/orgs/${data.organization.login}/projects/${data.projects_v2?.number}`;
        linkLabel = "View project in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Project:
              </div>
              <div>
                {data.projects_v2?.title} [#{data.projects_v2?.number}]{" "}
              </div>
            </div>
            {data.projects_v2?.short_description && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div>{data.projects_v2.short_description}</div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.projects_v2?.owner && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Owner:
                </div>
                <div>
                  <Image
                    src={data.projects_v2.owner.avatar_url}
                    alt={data.projects_v2.owner.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() => data.projects_v2?.owner.avatar_url ?? "#null"}
                  />
                  {data.projects_v2.owner.login}
                </div>
              </div>
            )}
            {data.projects_v2?.creator && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Creator:
                </div>
                <div>
                  <Image
                    src={data.projects_v2.creator.avatar_url}
                    alt={data.projects_v2.creator.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() =>
                      data.projects_v2?.creator.avatar_url ?? "#null"
                    }
                  />
                  {data.projects_v2.creator.login}
                </div>
              </div>
            )}
          </>
        );
      }
      case "projects_v2_item": {
        linkLabel = "";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                ContentType:
              </div>
              <div>
                {data.projects_v2_item?.content_type} [#
                {data.projects_v2_item?.id}]
              </div>
            </div>
            {data.projects_v2_item?.creator && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Creator:
                </div>
                <div>
                  <Image
                    src={data.projects_v2_item.creator.avatar_url}
                    alt={data.projects_v2_item.creator.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() =>
                      data.projects_v2_item?.creator.avatar_url ?? "#null"
                    }
                  />
                  {data.projects_v2_item.creator.login}
                </div>
              </div>
            )}
          </>
        );
      }
      case "milestone": {
        link = data.milestone?.html_url ?? "#null";
        linkLabel = "View milestone in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Milestone:
              </div>
              <div>
                {data.milestone?.title} [#
                {data.milestone?.number}]
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.milestone?.due_on && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Due On:
                </div>
                <div>
                  {new Date(
                    parseFloat(data.milestone.due_on) * 1000
                  ).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              </div>
            )}
            {data.milestone?.closed_at && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Due On:
                </div>
                <div>
                  {new Date(
                    parseFloat(data.milestone.closed_at) * 1000
                  ).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Issues Closed:
              </div>
              <div>{data.milestone?.closed_issues}</div>
            </div>
            {data.milestone?.description && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div>{data.milestone.description}</div>
              </div>
            )}
            {data.milestone?.creator && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Creator:
                </div>
                <div>
                  <Image
                    src={data.milestone.creator.avatar_url}
                    alt={data.milestone.creator.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() => data.milestone?.creator.avatar_url ?? "#null"}
                  />
                  {data.milestone.creator.login}
                </div>
              </div>
            )}
          </>
        );
      }
      case "issues": {
        link = data.issue?.html_url ?? "#null";
        linkLabel = "View issue in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Issue:
              </div>
              <div>
                {data.issue?.title} [#
                {data.issue?.number}]
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.issue?.state && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  State:
                </div>
                <div>
                  <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                    {data.issue.state.charAt(0).toUpperCase() +
                      data.issue.state.slice(1)}
                  </Tag>
                </div>
              </div>
            )}
            {data.issue?.closed_at && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Closed On:
                </div>
                <div>
                  {new Date(
                    parseFloat(data.issue.closed_at) * 1000
                  ).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comments:
              </div>
              <div>{data.issue?.comments}</div>
            </div>
            {data.issue?.body && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.issue.body)
                      .toString(),
                  }}
                />
              </div>
            )}
            {data.issue?.assignees && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Assignees:
                </div>
                <div>
                  {data.issue.assignees.map((assignee) => (
                    <Tooltip title={assignee.login} key={assignee.id}>
                      <Image
                        src={assignee.avatar_url}
                        alt={assignee.login}
                        className="mr-2 inline h-5 w-5 rounded-full"
                        width={20}
                        height={20}
                        loader={() => assignee.avatar_url}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {data.issue?.labels && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Labels:
                </div>
                <div>
                  {data.issue.labels.map((label) => (
                    <Tag
                      key={label.id}
                      className="m-1"
                      color={`#${label.color}`}
                    >
                      {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            {data.issue?.milestone && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Milestone:
                </div>
                <div>
                  <a
                    href={data.issue.milestone.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                  >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    {data.issue.milestone.title}
                  </a>
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Reactions:
              </div>
              <div className="text-xs font-semibold text-servcy-black">
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👍 {data.issue?.reactions["+1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👎 {data.issue?.reactions["-1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😄 {data.issue?.reactions.laugh}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🎉 {data.issue?.reactions.hooray}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😕 {data.issue?.reactions.confused}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  ❤️ {data.issue?.reactions.heart}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🚀 {data.issue?.reactions.rocket}
                </span>
                <span className="border-1 rounded-lg bg-servcy-white p-1">
                  👀 {data.issue?.reactions.eyes}
                </span>
              </div>
            </div>
          </>
        );
      }
      case "issue_comment": {
        link = data.comment?.html_url ?? "#null";
        linkLabel = "View comment in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comment:
              </div>
              <div
                className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.comment?.body)
                    .toString(),
                }}
              />
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Issue:
              </div>
              <div>
                {data.issue?.title} [#
                {data.issue?.number}]
              </div>
            </div>
            <div className="mb-2 mt-4 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Reactions:
              </div>
              <div className="text-xs font-semibold text-servcy-black">
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👍 {data.comment?.reactions["+1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👎 {data.comment?.reactions["-1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😄 {data.comment?.reactions.laugh}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🎉 {data.comment?.reactions.hooray}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😕 {data.comment?.reactions.confused}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  ❤️ {data.comment?.reactions.heart}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🚀 {data.comment?.reactions.rocket}
                </span>
                <span className="border-1 rounded-lg bg-servcy-white p-1">
                  👀 {data.comment?.reactions.eyes}
                </span>
              </div>
            </div>
          </>
        );
      }
      case "pull_request": {
        link = data.pull_request?.html_url ?? "#null";
        linkLabel = "View PR in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}] [
                <a
                  href={data.pull_request?.diff_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-servcy-light hover:text-servcy-wheat"
                >
                  Diff
                  <HiExternalLink className="my-auto inline" size="18" />
                </a>
                ]&nbsp;[
                <a
                  href={data.pull_request?.patch_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-servcy-wheat"
                >
                  Patch
                  <HiExternalLink className="my-auto inline" size="18" />
                </a>
                ]
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Branch:
              </div>
              <div className="font-semibold">
                {data.pull_request?.base.ref}{" "}
                <BiRightArrowAlt className="inline" />{" "}
                {data.pull_request?.head.ref}
              </div>
            </div>
            {data.pull_request?.state && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  State:
                </div>
                <div>
                  <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                    {data.pull_request.state.charAt(0).toUpperCase() +
                      data.pull_request.state.slice(1)}
                  </Tag>
                </div>
              </div>
            )}
            {data.pull_request?.draft && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Is Draft:
                </div>
                <div>✅</div>
              </div>
            )}
            {data.pull_request?.milestone && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Milestone:
                </div>
                <div>
                  <a
                    href={data.pull_request.milestone.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                  >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    {data.pull_request.milestone.title} [#
                    {data.pull_request.milestone.number}]
                  </a>
                </div>
              </div>
            )}
            {data.pull_request?.issue_url && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Issue Url:
                </div>
                <div>
                  <a
                    href={data.pull_request.issue_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                  >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    {data.pull_request.issue_url.slice(
                      data.pull_request.issue_url.length - 6
                    )}
                    ...
                  </a>
                </div>
              </div>
            )}
            {data.pull_request?.assignees && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Assignees:
                </div>
                <div>
                  {data.pull_request.assignees.map((assignee) => (
                    <Tooltip title={assignee.login} key={assignee.id}>
                      <Image
                        src={assignee.avatar_url}
                        alt={assignee.login}
                        className="mr-2 inline h-5 w-5 rounded-full"
                        width={20}
                        height={20}
                        loader={() => assignee.avatar_url}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {data.pull_request?.requested_reviewers && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Reviewers:
                </div>
                <div>
                  {data.pull_request.requested_reviewers.map((reviewer) => (
                    <Tooltip title={reviewer.login} key={reviewer.id}>
                      <Image
                        src={reviewer.avatar_url}
                        alt={reviewer.login}
                        className="mr-2 inline h-5 w-5 rounded-full"
                        width={20}
                        height={20}
                        loader={() => reviewer.avatar_url}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {data.pull_request?.merged_by && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Merged By:
                </div>
                <div>
                  <Tooltip title={data.pull_request.merged_by.login}>
                    <Image
                      src={data.pull_request.merged_by.avatar_url}
                      alt={data.pull_request.merged_by.login}
                      className="mr-2 inline h-5 w-5 rounded-full"
                      width={20}
                      height={20}
                      loader={() =>
                        data.pull_request?.merged_by.avatar_url ?? "#null"
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.pull_request?.labels &&
              data.pull_request.labels.length > 0 && (
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Labels:
                  </div>
                  <div>
                    {data.pull_request.labels.map((label) => (
                      <Tag
                        key={label.id}
                        className="m-1"
                        color={`#${label.color}`}
                      >
                        {label.name.charAt(0).toUpperCase() +
                          label.name.slice(1)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comments:
              </div>
              <div>{data.pull_request?.comments}</div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Commits:
              </div>
              <div>{data.pull_request?.commits}</div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Additions:
              </div>
              <div className="text-servcy-light">
                + {data.pull_request?.additions}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Deletions:
              </div>
              <div className="text-red-400">
                - {data.pull_request?.deletions}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Files Changed:
              </div>
              <div>{data.pull_request?.changed_files}</div>
            </div>
            {data.pull_request?.body && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Body:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.pull_request.body)
                      .toString(),
                  }}
                />
              </div>
            )}
          </>
        );
      }
      default:
        return <div>Event not supported</div>;
    }
  };

  return (
    <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
      <div className="mb-4 min-h-[75px] text-servcy-white">
        {renderGithubEvent()}
      </div>
      <div className="flex justify-between">
        {linkLabel && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-servcy-wheat hover:text-servcy-silver hover:underline"
          >
            <HiExternalLink className="mr-1 inline" size="18" />
            {linkLabel}
          </a>
        )}

        <div className="flex flex-col text-xs text-servcy-wheat">
          <div className="mb-2 flex-row">
            <Image
              src={cleanImageLink}
              alt={login}
              className="mr-2 inline h-5 w-5 rounded-full"
              loader={() => cleanImageLink}
              width={20}
              height={20}
            />
            {login}
          </div>
          <div className="flex-row">
            {new Date(parseFloat(timestamp) * 1000).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubNotification;
