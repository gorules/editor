import { message } from 'antd';
import { match, P } from 'ts-pattern';

export const errorMessage = (e: unknown): string => {
  return match(e)
    .with({ message: P.string }, ({ message }) => message)
    .with(
      P.when((d) => typeof d === 'object' && 'toString' in (d as object)),
      (data: object) => data.toString(),
    )
    .otherwise(() => 'Unknown error');
};

export const displayError = (e: unknown) => message.error(errorMessage(e));
