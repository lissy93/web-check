
import styled from 'styled-components';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return formatter.format(date);
}

const DataRow = (props: { lbl: string, val: string }) => {
  const { lbl, val } = props;
  return (
  <Row>
    <span className="lbl">{lbl}</span>
    <span className="val" title={val}>{val}</span>
  </Row>
  );
};


function getExtendedKeyUsage(oids: string[]) {
  const oidMap: { [key: string]: string } = {
    "1.3.6.1.5.5.7.3.1": "TLS Web Server Authentication",
    "1.3.6.1.5.5.7.3.2": "TLS Web Client Authentication",
    "1.3.6.1.5.5.7.3.3": "Code Signing",
    "1.3.6.1.5.5.7.3.4": "Email Protection (SMIME)",
    "1.3.6.1.5.5.7.3.8": "Time Stamping",
    "1.3.6.1.5.5.7.3.9": "OCSP Signing",
    "1.3.6.1.5.5.7.3.5": "IPSec End System",
    "1.3.6.1.5.5.7.3.6": "IPSec Tunnel",
    "1.3.6.1.5.5.7.3.7": "IPSec User",
    "1.3.6.1.5.5.8.2.2": "IKE Intermediate",
    "2.16.840.1.113730.4.1": "Netscape Server Gated Crypto",
    "1.3.6.1.4.1.311.10.3.3": "Microsoft Server Gated Crypto",
    "1.3.6.1.4.1.311.10.3.4": "Microsoft Encrypted File System",
    "1.3.6.1.4.1.311.20.2.2": "Microsoft Smartcard Logon",
    "1.3.6.1.4.1.311.10.3.12": "Microsoft Document Signing",
    "0.9.2342.19200300.100.1.3": "Email Address (in Subject Alternative Name)",
  };
  const results = oids.map(oid => oidMap[oid] || oid);
  return results.filter((item, index) => results.indexOf(item) === index);
}


const ListRow = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h3" size="small" align="left" color={colors.primary}>{title}</Heading>
    { list.map((entry: string, index: number) => {
      return (
      <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry }</span></Row>
      )}
    )}
  </>
);
}

const SslCertCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const sslCert = props.data;
  const { subject, issuer, fingerprint, serialNumber, asn1Curve, nistCurve, valid_to, valid_from, ext_key_usage } = sslCert;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { subject && <DataRow lbl="Subject" val={subject?.CN} /> }
      { issuer?.O && <DataRow lbl="Issuer" val={issuer.O} /> }
      { asn1Curve && <DataRow lbl="ASN1 Curve" val={asn1Curve} /> }
      { nistCurve && <DataRow lbl="NIST Curve" val={nistCurve} /> }
      { valid_to && <DataRow lbl="Expires" val={formatDate(valid_to)} /> }
      { valid_from && <DataRow lbl="Renewed" val={formatDate(valid_from)} /> }
      { serialNumber && <DataRow lbl="Serial Num" val={serialNumber} /> }
      { fingerprint && <DataRow lbl="Fingerprint" val={fingerprint} /> }
      { fingerprint && <DataRow lbl="Fingerprint" val={fingerprint} /> }
      { ext_key_usage && <ListRow title="Extended Key Usage" list={getExtendedKeyUsage(ext_key_usage)} /> }
      
    </Card>
  );
}

export default SslCertCard;
