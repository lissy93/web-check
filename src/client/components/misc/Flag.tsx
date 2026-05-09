interface Props {
  countryCode: string;
  width: number;
}

const Flag = ({ countryCode, width }: Props) => {
  const dimensions = `${width}x${width * 0.75}`;
  const country = countryCode.toLowerCase();
  const src = `https://flagcdn.com/${dimensions}/${country}.png`;
  return <img src={src} alt={countryCode} />;
};

export default Flag;
