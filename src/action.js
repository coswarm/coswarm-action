require('dotenv').config();
const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const CSW_URL = core.getInput('CSW_URL');
  const IMAGE_NAME = core.getInput('IMAGE_NAME');
  const CSW_APP_ID = core.getInput('CSW_APP_ID');
  const REGISTRY_URL = core.getInput('REGISTRY_URL');
  const REGISTRY_USER = core.getInput('REGISTRY_USER');
  const REGISTRY_PASSWORD = core.getInput('REGISTRY_PASSWORD');
  const CREATE_SUCCESS_ISSUE = core.getInput('CREATE_SUCCESS_ISSUE');
  const CREATE_FAILURE_ISSUE = core.getInput('CREATE_FAILURE_ISSUE');

  if (typeof GITHUB_TOKEN !== 'string') {
    throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
  }

  if (typeof CSW_URL !== 'string') {
    throw new Error('Invalid CSW_URL: did you forget to set it in your action config?');
  }

  if (typeof CSW_APP_ID !== 'string') {
    throw new Error('Invalid CSW_APP_ID: did you forget to set it in your action config?');
  }

  if (typeof IMAGE_NAME !== 'string') {
    throw new Error('Invalid IMAGE_NAME: did you forget to set it in your action config?');
  }

  const context = github.context;
  const octokit = github.getOctokit(GITHUB_TOKEN)

  const response = await axios.post(`${CSW_URL}/api/v1/apps/deploy`, {
    "image": `${IMAGE_NAME}`,
    "app_id": CSW_APP_ID,
    "registry": REGISTRY_URL,
    "registry_user": REGISTRY_USER,
    "registry_pass": REGISTRY_PASSWORD
  })

  if (response.status !== 200) {
    if (CREATE_FAILURE_ISSUE === 'true') {
      await octokit.issues.create({
        ...context.repo,
        title: 'Deployment failed',
        body: `Deployment failed for ${IMAGE_NAME}`,
        labels: ['deployment',
          {
            name: 'deployment-failed',
            color: '#B60205'
          }
        ]
      });
    }
    core.setFailed(`Deployment failed: please check the logs for more information`);
  } else {
    if (CREATE_SUCCESS_ISSUE === 'true') {
      await octokit.issues.create({
        ...context.repo,
        title: 'Deployment successful',
        body: `Deployment successful for ${IMAGE_NAME}`,
        labels: ['deployment',
          {
            name: 'deployment-success',
            color: '#0E8A16'
          }
        ]
      });
    }
    core.setOutput('deployment', "App deployed successfully");
  }
}

run().catch(e => core.setFailed(e.message));