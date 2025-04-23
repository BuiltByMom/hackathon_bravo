/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { getNewChallenge } from '../utils/helpers';
import { convertChallenge } from '../utils/helpers';
import SimpleWebAuthnServer from '@simplewebauthn/server';
const users: any = {};
const challenges: any = {};
const rpId = 'localhost';
const expectedOrigin = ['http://localhost:3000'];

export const registerPasskey = (req: Request, res: Response) => {
  console.log('registerPasskey', req.body);
  const username = req.body.username;
  const challenge = getNewChallenge();
  challenges[username] = convertChallenge(challenge);
  const pubKey = {
    challenge: challenge,
    rp: { id: rpId, name: 'webauthn-app' },
    user: { id: username, name: username, displayName: username },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },
      { type: 'public-key', alg: -257 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'preferred',
      requireResidentKey: false,
    },
  };
  res.json(pubKey);
  return res.status(200).send(true);
};

export const finishPasskey = async (req: Request, res: Response) => {
  const username = req.body.username;
  // Verify the attestation response
  let verification;
  try {
    verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
      response: req.body.data,
      expectedChallenge: challenges[username],
      expectedOrigin: expectedOrigin,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: (error as Error).message });
  }
  const { verified, registrationInfo } = verification;
  if (verified) {
    users[username] = registrationInfo;
    return res.status(200).send(true);
  }
  return res.status(500).send(false);
};

export const loginPasskey = async (req: Request, res: Response) => {
  const username = req.body.username;
  if (!users[username]) {
    return res.status(404).send(false);
  }
  const challenge = getNewChallenge();
  challenges[username] = convertChallenge(challenge);
  res.json({
    challenge,
    rpId,
    allowCredentials: [
      {
        type: 'public-key',
        id: users[username].credentialID,
        transports: ['internal'],
      },
    ],
    userVerification: 'preferred',
  });
  return res.status(200).send(true);
};

export const loginFinishPasskey = async (req: Request, res: Response) => {
  const username = req.body.username;
  if (!users[username]) {
    return res.status(404).send(false);
  }
  let verification;
  try {
    const user = users[username];
    verification = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      expectedChallenge: challenges[username],
      response: req.body.data,
      credential: user,
      expectedRPID: rpId,
      expectedOrigin,
      requireUserVerification: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: (error as Error).message });
  }
  const { verified } = verification;
  return res.status(200).send({
    res: verified,
  });
};
