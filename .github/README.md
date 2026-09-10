<h1 align="center">Web-Check</h1>

<p align="center">
<img src="https://cdn.as93.net/logo/web-check/w256" width="96" /><br />
<b><i>Comprehensive, on-demand open source intelligence for any website</i></b>
<br />
<b>🌐 <a href="https://web-check.xyz/">web-check.xyz</a></b><br />

</p>


---

<p align="center">Kindly supported by:</p>

<table align="center">
  <tr>
    <td align="center" width="50%">
      <a href="https://nubela.co/?utm_source=github&utm_medium=sponsorship&utm_campaign=oss_sponsorships&utm_content=github_readme&utm_id=web_check_2026">
        <img src="https://pixelflare.cc/alicia/sponsors/ninja-pear.png" width="260" alt="NinjaPear"><br>
        <b>NinjaPear</b>
      </a><br>
      <sub>API to get a full B2B profiles from any URL</sub>
    </td>
    <td align="center" width="50%">
      <a href="https://go.warp.dev/web-check">
        <img src="https://github.com/warpdotdev/brand-assets/blob/main/Github/Sponsor/Warp-Github-LG-02.png?raw=true" width="260" alt="Warp"><br>
        <b>Warp</b>
      </a><br>
      <sub>Built for coding with multiple AI agents</sub>
    </td>
  </tr>
</table>

#### Contents

- **[About](#about)**
  - [Screenshot](#screenshot)
  - [Live Demo](#live-demo)
  - [Mirror](#mirror)
  - [Features](#features)
- **[Usage](#usage)**
  - [Deployment](#deployment)
    - [Option#1: Netlify](#deploying---option-1-netlify)
    - [Option#2: Vercel](#deploying---option-2-vercel)
    - [Option#3: Docker](#deploying---option-3-docker)
    - [Option#4: Render](#deploying---option-4-render)
    - [Option#5: Source](#deploying---option-5-from-source)
  - [Configuration Options](#configuring)
  - [Developer Setup](#developing)
- **[Community](#community)**
  - [Contributing](#contributing)
  - [Bugs](#reporting-bugs)
  - [Support](#supporting)
- **[License](#license)**

---

## About

Get an insight into the inner-workings of a given website: uncover potential attack vectors, analyse server architecture, view security configurations, and learn what technologies a site is using.

The aim is to help you easily understand, optimize and secure your website.

### Screenshot

<details>
      <summary>Expand Screenshot</summary>

[![Screenshot](https://raw.githubusercontent.com/Lissy93/web-check/master/.github/screenshots/web-check-screenshot1.png)](https://web-check.as93.net/)

</details>

[![Screenshot](https://i.ibb.co/r0jXN6s/web-check.png)](https://github.com/Lissy93/web-check/tree/master/.github/screenshots)

### Live Demo

A hosted version can be accessed at: **[web-check.as93.net](https://web-check.as93.net)**

### Mirror

The source for this repo is mirrored to CodeBerg, available at: **[codeberg.org/alicia/web-check](https://codeberg.org/alicia/web-check)**

### Status

Build & Deploys: [![Netlify Status](https://api.netlify.com/api/v1/badges/c43453c1-5333-4df7-889b-c1d2b52183c0/deploy-status)](https://app.netlify.com/sites/web-check/deploys)
[![Vercel Status](https://therealsujitk-vercel-badge.vercel.app/?app=web-check-ten)](https://vercel.com/as93/web-check/)
[![🐳 Build + Publish Docker Image](https://github.com/Lissy93/web-check/actions/workflows/docker.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/docker.yml)
[![🚀 Deploy to AWS](https://github.com/Lissy93/web-check/actions/workflows/deploy-aws.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/deploy-aws.yml)
<br />
Repo Management & Miscellaneous: [![🪞 Mirror to Codeberg](https://github.com/Lissy93/web-check/actions/workflows/mirror.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/mirror.yml)
[![💓 Inserts Contributors & Sponsors](https://github.com/Lissy93/web-check/actions/workflows/credits.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/credits.yml)

### Features

See **[web-check.xyz/about](https://web-check.xyz/about)** for the full list of checks, and what each one does

---

## Usage

### Deployment

### Deploying - Option #1: Netlify

Click the button below, to deploy to Netlify 👇

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-%2330c8c9?style=for-the-badge&logo=netlify&labelColor=1e0e41 "Deploy Web-Check to Netlify, via 1-Click Script")](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check)

### Deploying - Option #2: Vercel

Click the button below, to deploy to Vercel 👇

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-%23ffffff?style=for-the-badge&logo=vercel&labelColor=1e0e41)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flissy93%2Fweb-check&project-name=web-check&repository-name=web-check-fork&demo-title=Web-Check%20Demo&demo-description=Check%20out%20web-check.xyz%20to%20see%20a%20live%20demo%20of%20this%20application%20running.&demo-url=https%3A%2F%2Fweb-check.xyz&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FLissy93%2Fweb-check%2Fmaster%2F.github%2Fscreenshots%2Fweb-check-screenshot10.png)

### Deploying - Option #3: Docker

Run `docker run -p 3000:3000 lissy93/web-check`, then open [`localhost:3000`](http://localhost:3000)

<details>
<summary>Docker Options</summary>

You can get the Docker image from:

- DockerHub: [`lissy93/web-check`](https://hub.docker.com/r/lissy93/web-check)
- GHCR: [`ghcr.io/lissy93/web-check`](https://github.com/Lissy93/web-check/pkgs/container/web-check)
- Or build the image yourself by cloning the repo and running `docker build -t web-check .`

</details>

### Deploying - Option #4: Render

Click the button below, to deploy to Render 👇

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Lissy93/web-check)

Uses the official [`lissy93/web-check`](https://hub.docker.com/r/lissy93/web-check) image on a Standard web service. Optional enrichment API keys can be added after deploy.

### Deploying - Option #5: From Source

Install the prerequisites listed in the [Developing](#developing) section, then run:

```bash
git clone https://github.com/Lissy93/web-check.git  # Download the code from GitHub
cd web-check                                        # Navigate into the project dir
yarn install                                        # Install the NPM dependencies
yarn build                                          # Build the app for production
yarn start                                          # Start the app (API and GUI)
```

---

### Configuring

By default, no configuration is needed.

But there are some optional environmental variables that you can set to give you access to some additional checks, or to increase rate-limits for some checks that use external APIs.

**API Keys & Credentials**:

| Key                        | Value                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_CLOUD_API_KEY`     | A Google API key with the PageSpeed Insights API enabled ([get here](https://developers.google.com/speed/docs/insights/v5/get-started)). This can be used to return quality metrics for a site |
| `REACT_APP_SHODAN_API_KEY` | A Shodan API key ([get here](https://account.shodan.io/)). This will show associated host names for a given domain                                    |
| `REACT_APP_WHO_API_KEY`    | A WhoAPI key ([get here](https://whoapi.com/)). This will show more comprehensive WhoIs records than the default job                                  |

<details>
  <summary><small>Full / Upcoming Vals</small></summary>

- `GOOGLE_CLOUD_API_KEY` - A Google API key with the PageSpeed Insights API enabled ([get here](https://developers.google.com/speed/docs/insights/v5/get-started)). This can be used to return quality metrics for a site
- `REACT_APP_SHODAN_API_KEY` - A Shodan API key ([get here](https://account.shodan.io/)). This will show associated host names for a given domain
- `REACT_APP_WHO_API_KEY` - A WhoAPI key ([get here](https://whoapi.com/)). This will show more comprehensive WhoIs records than the default job
- `SECURITY_TRAILS_API_KEY` - A Security Trails API key ([get here](https://securitytrails.com/corp/api)). This will show org info associated with the IP
- `CLOUDMERSIVE_API_KEY` - API key for Cloudmersive ([get here](https://account.cloudmersive.com/)). This will show known threats associated with the IP
- `TRANCO_USERNAME` - A Tranco email ([get here](https://tranco-list.eu/)). This will show the rank of a site, based on traffic
- `TRANCO_API_KEY` - A Tranco API key ([get here](https://tranco-list.eu/)). This will show the rank of a site, based on traffic
- `URL_SCAN_API_KEY` - A URLScan API key ([get here](https://urlscan.io/)). This will fetch miscalanious info about a site
- `BUILT_WITH_API_KEY` - A BuiltWith API key ([get here](https://api.builtwith.com/)). This will show the main features of a site
- `TORRENT_IP_API_KEY` - A torrent API key ([get here](https://iknowwhatyoudownload.com/en/api/)). This will show torrents downloaded by an IP

</details>

**Configuration Settings**:

| Key                        | Value                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| `PORT`                     | Port to serve the API, when running server.js (e.g. `3000`)                |
| `API_ENABLE_RATE_LIMIT`    | Enable rate-limiting for the /api endpoints (e.g. `true`)                  |
| `PUBLIC_API_TIMEOUT_LIMIT` | The timeout limit for API requests, in milliseconds (e.g. `25000`)         |
| `API_CORS_ORIGIN`          | Enable CORS, by setting your allowed hostname(s) here (e.g. `example.com`) |
| `API_DISABLED_CHECKS`      | Comma-separated list of checks to disable (e.g. `trace-route,ports`)       |
| `API_ENABLED_CHECKS`       | If set, only these checks will run (e.g. `get-ip,ssl,dns,headers`)         |
| `API_BLOCKED_HOSTS`        | Hosts that must never be scanned (e.g. `lan.example.com,192.168.0.0/16`)   |
| `CHROME_PATH`              | The path the Chromium executable (e.g. `/usr/bin/chromium`)                |
| `DISABLE_GUI`              | Disable the GUI, and only serve the API (e.g. `false`)                     |
| `REACT_APP_API_ENDPOINT`   | The endpoint for the API, either local or remote (e.g. `/api`)             |

All values are optional.

You can add these as environmental variables. Either put them directly into an `.env` file in the projects root, or via the Netlify / Vercel UI, or by passing to the Docker container with the --env flag, or using your own environmental variable management system

Note that keys that are prefixed with `REACT_APP_` are used client-side, and as such they must be scoped correctly with minimum privileges, since may be made visible when intercepting browser <-> server network requests

---

### Developing

1. Clone the repo, `git clone git@github.com:Lissy93/web-check.git`
2. Cd into it, `cd web-check`
3. Install dependencies: `yarn`
4. Start the dev server, with `yarn dev`

You'll need [Node.js](https://nodejs.org/en) (v22.22 or later) installed, plus [yarn](https://yarnpkg.com/getting-started/install) as well as [git](https://git-scm.com/).
Some checks also require `chromium`, `traceroute` and `dns` to be installed within your environment. These jobs will just be skipped if those packages aren't present.

---

## Community

### Contributing

Contributions of any kind are very welcome, and would be much appreciated.
For Code of Conduct, see [Contributor Convent](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

To get started, fork the repo, make your changes, add, commit and push the code, then come back here to open a pull request. If you're new to GitHub or open source, [this guide](https://www.freecodecamp.org/news/how-to-make-your-first-pull-request-on-github-3#let-s-make-our-first-pull-request-) or the [git docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) may help you get started, but feel free to reach out if you need any support.

[![Submit a PR](https://img.shields.io/badge/Submit_a_PR-GitHub-%23060606?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/Lissy93/web-check/compare)

### Reporting Bugs

If you've found something that doesn't work as it should, or would like to suggest a new feature, then go ahead and raise a ticket on GitHub.
For bugs, please outline the steps needed to reproduce, and include relevant info like system info and resulting logs.

[![Raise an Issue](https://img.shields.io/badge/Raise_an_Issue-GitHub-%23060606?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/Lissy93/web-check/issues/new/choose)

### Supporting

The app will remain 100% free and open source.
But due to the amount of traffic that the hosted instance gets, the lambda function usage is costing about $25/month.
Any help with covering the costs via GitHub Sponsorship would be much appreciated.
It's thanks to the support of the community that this project is able to be freely available for everyone :)

[![Sponsor Lissy93 on GitHub](https://img.shields.io/badge/Sponsor_on_GitHub-Lissy93-%23ff4dda?style=for-the-badge&logo=githubsponsors&logoColor=ff4dda)](https://github.com/sponsors/Lissy93)

### Contributors

Credit to the following users for contributing to Web-Check

[![contributors badge](https://readme-contribs.as93.net/contributors/lissy93/web-check?perRow=10&shape=squircle)](https://github.com/lissy93/web-check/graphs/contributors)

### Sponsors

Huge thanks to these wonderful people, who sponsor me on GitHub, their support helps cover the costs required to keep Web-Check and my other projects free for everyone. Consider joining them, by [sponsoring me on GitHub](https://github.com/sponsors/Lissy93) if you're able.

[![sponsors badge](https://readme-contribs.as93.net/sponsors/lissy93?perRow=10&shape=squircle)](https://github.com/sponsors/lissy93)

---

## License

> _**[Lissy93/Web-Check](https://github.com/Lissy93/web-check)** is licensed under [MIT](https://github.com/Lissy93/web-check/blob/HEAD/LICENSE) © [Alicia Sykes](https://aliciasykes.com) 2023 - 2026._<br>
> <sup align="right">For information, see <a href="https://tldrlegal.com/license/mit-license">TLDR Legal > MIT</a></sup>

<details>
<summary>Expand License</summary>

```
The MIT License (MIT)
Copyright (c) Alicia Sykes <alicia@omg.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sub-license, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included install
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANT ABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

[![View Dependency Licenses & SBOM on FOSSA](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLissy93%2Fweb-check.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FLissy93%2Fweb-check?ref=badge_large&issueType=license)

</details>

<!-- License + Copyright -->
<p  align="center">
  <i>© <a href="https://aliciasykes.com">Alicia Sykes</a> 2026</i><br>
  <i>Licensed under <a href="https://gist.github.com/Lissy93/143d2ee01ccc5c052a17">MIT</a></i><br>
  <a href="https://github.com/lissy93"><img src="https://pixelflare.cc/alicia/images/octoface.webp?w=64" /></a><br>
  <sup>Thanks for visiting :)</sup>
</p>

<!-- Dinosaurs are Awesome -->
<!--
                        . - ~ ~ ~ - .
      ..     _      .-~               ~-.
     //|     \ `..~                      `.
    || |      }  }              /       \  \
(\   \\ \~^..'                 |         }  \
 \`.-~  o      /       }       |        /    \
 (__          |       /        |       /      `.
  `- - ~ ~ -._|      /_ - ~ ~ ^|      /- _      `.
              |     /          |     /     ~-.     ~- _
              |_____|          |_____|         ~ - . _ _~_-_
-->
