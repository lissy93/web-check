
import { useState, useEffect } from 'react';
import { Card } from 'components/Form/Card';
import Button from 'components/Form/Button';
import { ExpandableRow } from 'components/Form/Row';

const makeCipherSuites = (results: any) => {
  if (!results || !results.connection_info || (results.connection_info.ciphersuite || [])?.length === 0) {
    return [];
  }
  return results.connection_info.ciphersuite.map((ciphersuite: any) => {
    return {
      title: ciphersuite.cipher,
      fields: [
      { lbl: 'Code', val: ciphersuite.code },
      { lbl: 'Protocols', val: ciphersuite.protocols.join(', ') },
      { lbl: 'Pubkey', val: ciphersuite.pubkey },
      { lbl: 'Sigalg', val: ciphersuite.sigalg },
      { lbl: 'Ticket Hint', val: ciphersuite.ticket_hint },
      { lbl: 'OCSP Stapling', val: ciphersuite.ocsp_stapling ? '✅ Enabled' : '❌ Disabled' },
      { lbl: 'PFS', val: ciphersuite.pfs },
      ciphersuite.curves ? { lbl: 'Curves', val: ciphersuite.curves.join(', ') } : {},
    ]};
  });
};

const TlsCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {

  const [cipherSuites, setCipherSuites] = useState(makeCipherSuites(props.data));
  const [loadState, setLoadState] = useState<undefined | 'loading' | 'success' | 'error'>(undefined);

  useEffect(() => { // Update cipher suites when data changes
    setCipherSuites(makeCipherSuites(props.data));
  }, [props.data]);

  const updateData = (id: number) => {
    setCipherSuites([]);
    setLoadState('loading');
    const fetchUrl = `https://tls-observatory.services.mozilla.com/api/v1/results?id=${id}`;
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setCipherSuites(makeCipherSuites(data));
        setLoadState('success');
    }).catch((error) => {
      setLoadState('error');
    });
  };
  
  const scanId = props.data?.id;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { cipherSuites.length && cipherSuites.map((cipherSuite: any, index: number) => {
        return (
          <ExpandableRow lbl={cipherSuite.title} val="" rowList={cipherSuite.fields} />
        );
      })}
      { !cipherSuites.length && (
        <div>
          <p>No cipher suites found.<br />
            This sometimes happens when the report didn't finish generating in-time, you can try re-requesting it.
          </p>
          <Button loadState={loadState} onClick={() => updateData(scanId)}>Refetch Report</Button>
        </div>
      )}
    </Card>
  );
}

export default TlsCard;
