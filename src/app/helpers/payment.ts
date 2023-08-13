import got from 'got';
import { FlutterWaveTypes } from 'flutterwave-react-v3';
import { WaveLinkResponse } from '@/types';

export const createFlutterWavePayment = async (
  config: FlutterWaveTypes.FlutterwaveConfig
): Promise<WaveLinkResponse | null> => {
  console.log({ config });
  try {
    console.log({ FLW_SECRET_KEY: process.env.FLW_SECRET_KEY });
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
    console.log({ err });
    console.log(err?.code);
    console.log(err?.response?.body);
    return null;
  }
};
