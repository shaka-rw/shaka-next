import got from 'got';
import fetch from 'node-fetch';

import { FlutterWaveTypes } from 'flutterwave-react-v3';
import { WaveLinkResponse } from '@/types';

export type PayMethod = 'flutterwave' | 'ubudasa';

export const createFlutterWavePayment = async (
  config: FlutterWaveTypes.FlutterwaveConfig
): Promise<WaveLinkResponse | null> => {
  try {
    const response = await got
      .post('https://api.flutterwave.com/v3/payments', {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
        json: config,
      })
      .json();
    return response as WaveLinkResponse;
  } catch (err: any) {
    return null;
  }
};

export type UbudaPayment = {
  clientOrderId: string;
  amount: number;
  success_url: string;
  callback: string;
};

export const createUbudasaPayment = async (payInfo: UbudaPayment) => {
  const api_key = process.env.UBUDASA_KEY;

  const body = new URLSearchParams();
  body.append('api_key', api_key as string);
  body.append('clientOrderId', payInfo.clientOrderId);
  body.append('amount', payInfo.amount.toString());
  body.append('success_url', payInfo.success_url);
  body.append('callback', payInfo.callback);

  try {
    const response = await fetch('https://ubudasa.rw/initiate_payment.php', {
      method: 'POST',
      body,
    });
    const data = await response.text();

    return data.trim();
  } catch (error) {
    console.log({ ubudasaError: error });
  }
};
