require('dotenv').config();
const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  // Get inputs from GitHub action
  const inputs = [
    'GITHUB_TOKEN',
    'CSW_URL',
    'IMAGE_NAME',
    'CSW_APP_ID',
    'REGISTRY_URL',
    'REGISTRY_USER',
    'REGISTRY_PASSWORD',
    'CREATE_SUCCESS_ISSUE',
    'CREATE_FAILURE_ISSUE'
  ];
  const values = inputs.map(input => core.getInput(input));

  // Validate inputs
  const validateInput = (name, value) => {
    if (typeof value !== 'string') {
      throw new Error(`Invalid ${name}: did you forget to set it in your action config?`);
    }
  }

  inputs.forEach((input, index) => validateInput(input, values[index]));

  // Deploy app using inputs provided by GitHub action
  const context = github.context;
  const octokit = github.getOctokit(GITHUB_TOKEN);

  // Send request to deploy app
  const response = await axios.post(`${CSW_URL}/api/v1/apps/deploy`, {
    "image": `${IMAGE_NAME}`,
    "app_id": CSW_APP_ID,
    "registry": REGISTRY_URL,
    "registry_user": REGISTRY_USER,
    "registry_pass": REGISTRY_PASSWORD
  });

  // Check response status and create issue if needed
  if (response.status === 200) {
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
  } else {
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
  }
}

run().catch(e => core.setFailed(e.message));