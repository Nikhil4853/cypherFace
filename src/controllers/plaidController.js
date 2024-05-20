require('dotenv').config({ path: './config/.env' }); // Load environment variables from .env file
const User = require('../models/user.model');
const { getPlaidAccessToken } = require('../utils/authUtils');

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const plaidClientId = process.env.PLAID_CLIENT_ID;
const plaidSecret = process.env.PLAID_SECRET;

const plaidClient = new PlaidApi(new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': plaidClientId,
            'PLAID-SECRET': plaidSecret,
            'Content-Type': 'application/json'
        }
    }
}));

// GET ACCESS TOKEN FOR PLAID
async function getAccessToken( req, res) {
    try {

        const {  userId, publicToken  } = req.body;

        // const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
        //     client_id: plaidClientId,
        //     secret: plaidSecret,
        //     institution_id: 'ins_5',
        //     initial_products: ["auth", "transactions"]
        // });
        // console.error('✅✅✅ ❌', publicTokenResponse.data.public_token);

        // const publicTokens = publicTokenResponse.data.public_token;

        const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
            client_id: plaidClientId,
            secret: plaidSecret,
            public_token: publicToken,
        });

        const accessToken = accessTokenResponse.data.access_token;
        // const accessToken = exchangeResponse.data.access_token;
        console.error('accessToken ❌', accessToken);

        await storeAccessToken(userId, accessToken);

        res.json({ success: true });
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
 

// GET Account info

async function getAuthData(req, res) {
    try {
        const accessToken = await getPlaidAccessToken(req.headers['authorization']);
        const authResponse = await plaidClient.authGet({
            client_id: plaidClientId,
            secret: plaidSecret,
            access_token: accessToken
        });

        res.json(authResponse.data);
    } catch (error) {
        console.error('Error fetching Auth data:', error);

        let errorMessage = 'Internal server error';
        let statusCode = 500;

        if (error.response && error.response.data) {
            errorMessage = error.response.data.error_message || errorMessage;
            statusCode = error.response.status || statusCode;
        }

        res.status(statusCode).json({ error: errorMessage });
    }
}



async function createLinkToken(req, res) {
    const id = req.body.user.client_user_id
    const request = {
        client_id: plaidClientId,
        secret: plaidSecret,
        client_name: 'CypherFace',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
        user: {
            client_user_id: id 
        }
    }
    try {
        const response = await plaidClient.linkTokenCreate(request);
        const linkToken = response.data.link_token
        req.session.linkToken = linkToken;
        res.json({ link_token: linkToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getLinkToken(req, res) {
    const request = {
        link_token: req.session.linkToken,
        client_id: plaidClientId,
        secret: plaidSecret,
    };
    try {
        const response = await plaidClient.linkTokenGet(request);
        const responseData = {
            link_token: response.data.link_token,
            expiration: response.data.expiration, 
        };
        res.json(responseData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//Processor token

async function createProcessorToken(req, res) {
    try {
        const { accountId } = req.body;
        const accessToken = await getPlaidAccessToken(req.headers['authorization']);

        const processorTokenResponse = await plaidClient.processorTokenCreate({
            client_id: plaidClientId,
            secret: plaidSecret,
            access_token: accessToken,
            account_id: accountId,
            processor: 'finix' 
        });

        const processorToken = processorTokenResponse.data.processor_token;
        res.json({ processor_token: processorToken });
    } catch (error) {
        console.error('Error creating processor token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAccountBalances(req, res) {
    try {
        const { account_ids } = req.body;
        const accessToken = await getPlaidAccessToken(req.headers['authorization']);

        const balanceResponse = await plaidClient.accountsBalanceGet({
            client_id: plaidClientId,
            secret: plaidSecret,
            access_token: accessToken,
            options: {
                account_ids
            }
        });

        res.json(balanceResponse.data);
    } catch (error) {
        console.error('Error fetching account balances:', error);

        let errorMessage = 'Internal server error';
        let statusCode = 500;

        if (error.response && error.response.data) {
            errorMessage = error.response.data.error_message || errorMessage;
            statusCode = error.response.status || statusCode;
        }

        res.status(statusCode).json({ error: errorMessage });
    }
}

  const storeAccessToken = async (userId, accessToken) => {
    try {
      const user = await User.findById(userId);
      user.accessToken = accessToken;
      await user.save();
    } catch (error) {
      console.error('Error storing access token:', error);
      throw new Error('Failed to store access token');
    }
  };
  
  async function generatePublicToken(req, res) {
    try {
        // Create a sandbox public token
        const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
            institution_id: 'ins_5', // Use the institution ID for testing (e.g., 'ins_5')
            initial_products: ["auth", "transactions"] // Specify the initial products
        });

        // Extract the public token from the response
        const publicToken = publicTokenResponse.data.public_token;

        // Send the public token in the response
        res.json({ public_token: publicToken });
    } catch (error) {
        console.error('Error generating sandbox public token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = { getAuthData, getAccessToken, createLinkToken, getLinkToken, createProcessorToken, getAccountBalances, generatePublicToken };


