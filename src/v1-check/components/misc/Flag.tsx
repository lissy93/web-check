interface Props {
  countryCode: string,
  width: number,
};

const Flag = ({ countryCode, width }: Props): JSX.Element => {

  const getFlagUrl = (code: string, w: number = 64) => {
    const protocol = 'https';
    const cdn = 'flagcdn.com';
    const dimensions = `${width}x${width * 0.75}`;
    const country = countryCode.toLowerCase();
    const ext = 'png';
    return `${protocol}://${cdn}/${dimensions}/${country}.${ext}`;
  };

  return (<img src={getFlagUrl(countryCode, width)} alt={countryCode} />);
}

export default Flag;
