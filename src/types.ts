export type ActionError = string | null;
type NullableString = string | null;

type CustomArray = [NullableString, any];

export type NextActionReturn = CustomArray;

export type NextAction = () => Promise<NextActionReturn>;

export type WaveLinkResponse = {
  status: string;
  message: string;
  data: {
    link: string;
  };
};
