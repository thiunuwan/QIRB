const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const { Octokit } = require('@octokit/rest');
const bodyParser = require('body-parser');

const app = express();
const webhook = new Webhooks({
  secret: '', // GitHub App's webhook secret
});

const octokit = new Octokit({
  auth: '', // JWT token generated for your GitHub App
});

app.use(bodyParser.json());

// Listen for issues event
webhook.on('issues.opened', async ({ id, name, payload }) => {
  const { owner, repo, number } = payload.repository;

  try {
    // Comment on the issue
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: 'Thanks for raising this issue, we will look into this ASAP.',
    });

    console.log(`Commented on issue #${number} in ${repo}`);
  } catch (error) {
    console.error('Error commenting on issue:', error);
  }
});

// GitHub will call this route to send events
app.post('/webhook', webhook.middleware);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
