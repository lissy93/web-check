
import { AreaChart, Area, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
.rank-average {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
}
.chart-container {
  margin-top: 1rem;
}
`;

const makeRankStats = (data: {date: string, rank: number }[]) => {
  const average = Math.round(data.reduce((acc, cur) => acc + cur.rank, 0) / data.length);
  const today = data[0].rank;
  const yesterday = data[1].rank;
  const percentageChange = ((today - yesterday) / yesterday) * 100;
  return {
    average,
    percentageChange
  };
};

const makeChartData = (data: {date: string, rank: number }[]) => {
  return data.map((d) => {
    return {
      date: d.date,
      uv: d.rank
    };
  });
};

const RankCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data.ranks || [];
  const { average, percentageChange } = makeRankStats(data);
  const chartData = makeChartData(data);
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <div className="rank-average">{data[0].rank.toLocaleString()}</div>
      <Row lbl="Change since Yesterday" val={`${percentageChange > 0 ? '+':''} ${percentageChange.toFixed(2)}%`} />
      <Row lbl="Historical Average Rank" val={average.toLocaleString()} />
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart width={400} height={100} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#0f1620" stopOpacity={0.8}/>
                <stop offset="80%" stopColor="#0f1620" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4" strokeWidth={0.25} verticalPoints={[50,100,150,200,250,300,350]} horizontalPoints={[25,50,75]} />
            <Tooltip contentStyle={{background: colors.background, color: colors.textColor, borderRadius: 4 }}
                labelFormatter={(value) => ['Date : ', data[value].date]}/>
            <Area type="monotone" dataKey="uv" stroke="#9fef00" fillOpacity={1} name="Rank" fill={`${colors.backgroundDarker}a1`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* { domain.Domain_Name && <Row lbl="Registered Domain" val={domain.Domain_Name} /> }
      { domain.Creation_Date && <Row lbl="Creation Date" val={domain.Creation_Date} /> }
      { domain.Updated_Date && <Row lbl="Updated Date" val={domain.Updated_Date} /> }
      { domain.Registry_Expiry_Date && <Row lbl="Registry Expiry Date" val={domain.Registry_Expiry_Date} /> }
      { domain.Registry_Domain_ID && <Row lbl="Registry Domain ID" val={domain.Registry_Domain_ID} /> }
      { domain.Registrar_WHOIS_Server && <Row lbl="Registrar WHOIS Server" val={domain.Registrar_WHOIS_Server} /> }
      { domain.Registrar && <Row lbl="" val="">
        <span className="lbl">Registrar</span>
        <span className="val"><a href={domain.Registrar_URL || '#'}>{domain.Registrar}</a></span>
      </Row> }
      { domain.Registrar_IANA_ID && <Row lbl="Registrar IANA ID" val={domain.Registrar_IANA_ID} /> } */}

      {/* <Row lbl="" val="">
        <span className="lbl">Is Up?</span>
        { serverStatus.isUp ? <span className="val up">✅ Online</span> : <span className="val down">❌ Offline</span>}
      </Row>
      <Row lbl="Status Code" val={serverStatus.responseCode} />
      { serverStatus.responseTime && <Row lbl="Response Time" val={`${Math.round(serverStatus.responseTime)}ms`} /> } */}
    </Card>
  );
}

export default RankCard;
