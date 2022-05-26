# Coswarm Action

Action is a tool for new app image deployment on the [Coswarm](https://coswarm.dev) platform.

## Getting Started

- Set your [Coswarm](https://coswarm.dev) server
- Create CSW_URL and CSW_APP_ID environment variables
- If you want to use a custom image registry, create REGISTRY_URL , REGISTRY_USERNAME and REGISTRY_PASSWORD environment variables

```
name: Coswarm Deploy

on:
  release:
    types: [published]

jobs:
  coswarm-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: coswarm/action-coswarm
        with:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
          CSW_URL: ${{secrets.CSW_URL}}
          CSW_APP_ID: ${{secrets.CSW_URL}}
          IMAGE_NAME: <image_name example: "coswarm/coswarm-next:latest">
          REGISTRY_URL: ${{secrets.REGISTRY_URL}}
          REGISTRY_USERNAME: ${{secrets.REGISTRY_USERNAME}}
          REGISTRY_PASSWORD: ${{secrets.REGISTRY_PASSWORD}}
          CREATE_SUCCESS_ISSUE: < true | false >
          CREATE_FAILURE_ISSUE: < true | false >
```