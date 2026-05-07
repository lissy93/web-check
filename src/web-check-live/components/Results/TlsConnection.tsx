import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

const yesNo = (v: boolean) => (v ? '✅ Yes' : '❌ No');

const formatEphemeralKey = (k: any): string => {
  if (!k?.type) return '';
  const parts = [k.type];
  if (k.name) parts.push(`(${k.name})`);
  if (k.size) parts.push(`${k.size}-bit`);
  return parts.join(' ');
};

const TlsConnectionCard = (props: {
  data: any;
  title: string;
  actionButtons: any;
}): JSX.Element => {
  const d = props.data || {};
  const cipherName = d.cipher?.standardName || d.cipher?.name || '';
  const ephemeral = formatEphemeralKey(d.ephemeralKey);
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {d.protocol && <Row lbl="Protocol" val={d.protocol} />}
      {cipherName && <Row lbl="Cipher Suite" val={cipherName} />}
      {d.cipher?.version && <Row lbl="Cipher Version" val={d.cipher.version} />}
      {ephemeral && <Row lbl="Ephemeral Key" val={ephemeral} />}
      {d.alpnProtocol && <Row lbl="ALPN" val={d.alpnProtocol} />}
      <Row lbl="Forward Secrecy" val={yesNo(!!d.forwardSecrecy)} />
      <Row lbl="Session Resumption" val={yesNo(!!d.sessionResumption)} />
      <Row lbl="OCSP Stapling" val={yesNo(!!d.ocspStapled)} />
      <Row
        lbl="Certificate Trust"
        val={d.authorized ? '✅ Trusted' : `❌ ${d.authError || 'Untrusted'}`}
      />
    </Card>
  );
};

export default TlsConnectionCard;
