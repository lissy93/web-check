<h1 align="center">Web-Check</h1>


<p align="center">
<img src="https://i.ibb.co/q1gZN2p/web-check-logo.png" width="96" /><br />
<b><i>Comprehensive, on-demand open source intelligence for any website</i></b>
<br />
<b>🌐 <a href="https://web-check.as93.net/">web-check.as93.net</a></b><br />

</p>

---

## About

_Get info on a websites SSL certs, domain, headers, cookies, DNS records, technologies used, performance, hostnames, crawl rules, server info and more_

#### Screenshot
[![Screenshot](https://i.ibb.co/9ZcMVbP/web-check-screenshot3.png)](https://web-check.as93.net/)

#### Live Demo
A hosted version can be accessed at: **[web-check.as93.net](https://web-check.as93.net)**

#### Mirror
The source for this repo is mirrored to CodeBerg, available at: **[codeberg.org/alicia/web-check](https://codeberg.org/alicia/web-check)**

#### Motivation
Often when I'm looking into a website, there's several things I always check first.
None of this is hard, and can usually be done with a series of curl commands, or using a combination of online tools.
But it's so much easier to have everything presented clearly and visible in one place.

#### Features
- Server Location
- SSL Info
- Headers
- Associated hostnames
- Domain Whois
- DNS records
- Cookies
- Server info
- Crawl rules
- Performance metrics
- Screenshot
- Tech stack
- Site response times

_Note that not all checks will work for all sites. Sometimes it's not possible to determine some information, and there are limitations imposed by Netlify for the lambda functions._

#### Architecture
It's just a very simple web app (React + TypeScript), with results calculated using a series of Lambda functions. Everything is deployed on Netlify. Most things are done with the native http interface, but there's a few instances where this wasn't possible alone, so is combined with some external APIs, like Shodan for hostnames, IP Info for geolocation, and Google Cloud for performance metrics.

---

## Building

### Developing

You'll need [Node.js](https://nodejs.org/en) (V 18.16.1 or later) installed.

1. Clone the repo, `git clone git@github.com:Lissy93/web-check.git`
2. Cd into it, `cd web-check`
3. Install dependencies: `npm i`
4. Populate environmental variables, in the `.env`
5. Start the dev server, with `npx netlify-cli dev`

### Deploying

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-%2330c8c9?style=for-the-badge&logo=netlify&labelColor=1e0e41 'Deploy Web-Check to Netlify, via 1-Click Script')](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check)

---

## Community

### Contributing

Contributions of any kind are very welcome, and would be much appreciated.
For Code of Conduct, see [Contributor Convent](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

To get started, fork the repo, make your changes, add, commit and push the code, then come back here to open a pull request. If you're new to GitHub or open source, [this guide](https://www.freecodecamp.org/news/how-to-make-your-first-pull-request-on-github-3#let-s-make-our-first-pull-request-) or the [git docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) may help you get started, but feel free to reach out if you need any support.

[![Submit a PR](https://img.shields.io/badge/Submit_a_PR-GitHub-%23060606?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/Lissy93/web-check/compare)


### Found a Bug

If you've found something that doesn't work as it should, or would like to suggest a new feature, then go ahead and raise a ticket on GitHub.
For bugs, please outline the steps needed to reproduce, and include relevant info like system info and resulting logs.

[![Raise an Issue](https://img.shields.io/badge/Raise_an_Issue-GitHub-%23060606?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/Lissy93/web-check/issues/new/choose)

### Supporting

[![Sponsor Lissy93 on GitHub](https://img.shields.io/badge/Sponsor_on_GitHub-Lissy93-%23ff4dda?style=for-the-badge&logo=githubsponsors&logoColor=ff4dda)](https://github.com/sponsors/Lissy93)


---


## License


> _**[Lissy93/Web-Check](https://github.com/Lissy93/web-check)** is licensed under [MIT](https://github.com/Lissy93/web-check/blob/HEAD/LICENSE) © [Alicia Sykes](https://aliciasykes.com) 2023._<br>
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

</details>

<!-- License + Copyright -->
<p  align="center">
  <i>© <a href="https://aliciasykes.com">Alicia Sykes</a> 2023</i><br>
  <i>Licensed under <a href="https://gist.github.com/Lissy93/143d2ee01ccc5c052a17">MIT</a></i><br>
  <a href="https://github.com/lissy93"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" /></a><br>
  <sup>Thanks for visiting :)</sup>
</p>

<!-- Dinosaur -->
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

