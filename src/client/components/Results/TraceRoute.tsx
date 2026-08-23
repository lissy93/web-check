import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import { useLanguage } from 'client/i18n';

const RouteRow = styled.div`
  text-align: center;
  width: fit-content;
  margin: 0 auto;
  .ipName {
    font-size: 1rem;
  }
`;

const RouteTimings = styled.div`
  p {
    margin: 0 auto;
  }
  .arrow {
    font-size: 2.5rem;
    color: ${colors.primary};
    margin-top: -1rem;
  }
  .times {
    font-size: 0.85rem;
    color: ${colors.textColorSecondary};
  }
  .completed {
    text-align: center;
    font-weight: bold;
  }
`;

const cardStyles = ``;

const TraceRouteCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { language } = useLanguage();
  const traceRouteResponse = props.data;
  const routes = traceRouteResponse.result;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {routes
        .filter((x: any) => x)
        .map((route: any, index: number) => (
          <RouteRow key={index}>
            <span className="ipName">{Object.keys(route)[0]}</span>
            <RouteTimings>
              {route[Object.keys(route)[0]].map((time: any, packetIndex: number) => (
                <p className="times" key={`timing-${packetIndex}-${time}`}>
                  {route[Object.keys(route)[0]].length > 1 && (
                    <>
                      {language === 'zh-CN' ? '数据包' : 'Packet'} #{packetIndex + 1}:{' '}
                    </>
                  )}
                  {language === 'zh-CN' ? `耗时 ${time} 毫秒` : `Took ${time} ms`}
                </p>
              ))}
              <p className="arrow">↓</p>
            </RouteTimings>
          </RouteRow>
        ))}
      <RouteTimings>
        <p className="completed">
          {language === 'zh-CN'
            ? `往返完成，耗时 ${traceRouteResponse.timeTaken} 毫秒`
            : `Round trip completed in ${traceRouteResponse.timeTaken} ms`}
        </p>
      </RouteTimings>
    </Card>
  );
};

export default TraceRouteCard;
