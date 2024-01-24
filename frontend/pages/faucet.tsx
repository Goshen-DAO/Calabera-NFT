import { FC } from 'react';

const Faucet: FC = () => {
  return (
    <div>
      <iframe
        title="Embedded Website"
        width="100%"
        height="670px"
        src="https://artio.faucet.berachain.com/"
        frameBorder="0"
      />
    </div>
  );
};

export default Faucet;
