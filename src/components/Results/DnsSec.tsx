import { Card } from 'components/Form/Card';
import Row, { ExpandableRow, RowProps } from 'components/Form/Row';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';



const parseDNSKeyData = (data: string) => {
  const dnsKey = data.split(' ');

  const flags = parseInt(dnsKey[0]);
  const protocol = parseInt(dnsKey[1]);
  const algorithm = parseInt(dnsKey[2]);

  let flagMeaning = '';
  let protocolMeaning = '';
  let algorithmMeaning = '';

  // Flags
  if (flags === 256) {
    flagMeaning = 'Zone Signing Key (ZSK)';
  } else if (flags === 257) {
    flagMeaning = 'Key Signing Key (KSK)';
  } else {
    flagMeaning = 'Unknown';
  }

  // Protocol
  protocolMeaning = protocol === 3 ? 'DNSSEC' : 'Unknown';

  // Algorithm
  switch (algorithm) {
    case 5: 
      algorithmMeaning = 'RSA/SHA-1';
      break;
    case 7: 
      algorithmMeaning = 'RSASHA1-NSEC3-SHA1';
      break;
    case 8: 
      algorithmMeaning = 'RSA/SHA-256';
      break;
    case 10: 
      algorithmMeaning = 'RSA/SHA-512';
      break;
    case 13: 
      algorithmMeaning = 'ECDSA Curve P-256 with SHA-256';
      break;
    case 14: 
      algorithmMeaning = 'ECDSA Curve P-384 with SHA-384';
      break;
    case 15: 
      algorithmMeaning = 'Ed25519';
      break;
    case 16: 
      algorithmMeaning = 'Ed448';
      break;
    default: 
      algorithmMeaning = 'Unknown';
      break;
  }

  return {
    flags: flagMeaning,
    protocol: protocolMeaning,
    algorithm: algorithmMeaning,
    publicKey: dnsKey[3]
  };
}

const getRecordTypeName = (typeCode: number): string => {
  switch(typeCode) {
      case 1: return 'A';
      case 2: return 'NS';
      case 5: return 'CNAME';
      case 6: return 'SOA';
      case 12: return 'PTR';
      case 13: return 'HINFO';
      case 15: return 'MX';
      case 16: return 'TXT';
      case 28: return 'AAAA';
      case 33: return 'SRV';
      case 35: return 'NAPTR';
      case 39: return 'DNAME';
      case 41: return 'OPT';
      case 43: return 'DS';
      case 46: return 'RRSIG';
      case 47: return 'NSEC';
      case 48: return 'DNSKEY';
      case 50: return 'NSEC3';
      case 51: return 'NSEC3PARAM';
      case 52: return 'TLSA';
      case 53: return 'SMIMEA';
      case 55: return 'HIP';
      case 56: return 'NINFO';
      case 57: return 'RKEY';
      case 58: return 'TALINK';
      case 59: return 'CDS';
      case 60: return 'CDNSKEY';
      case 61: return 'OPENPGPKEY';
      case 62: return 'CSYNC';
      case 63: return 'ZONEMD';
      default: return 'Unknown';
  }
}

const parseDSData = (dsData: string) => {
  const parts = dsData.split(' ');
  
  const keyTag = parts[0];
  const algorithm = getAlgorithmName(parseInt(parts[1], 10));
  const digestType = getDigestTypeName(parseInt(parts[2], 10));
  const digest = parts[3];

  return {
      keyTag,
      algorithm,
      digestType,
      digest
  };
}

const getAlgorithmName = (code: number) => {
  switch(code) {
      case 1: return 'RSA/MD5';
      case 2: return 'Diffie-Hellman';
      case 3: return 'DSA/SHA1';
      case 5: return 'RSA/SHA1';
      case 6: return 'DSA/NSEC3/SHA1';
      case 7: return 'RSASHA1/NSEC3/SHA1';
      case 8: return 'RSA/SHA256';
      case 10: return 'RSA/SHA512';
      case 12: return 'ECC/GOST';
      case 13: return 'ECDSA/CurveP256/SHA256';
      case 14: return 'ECDSA/CurveP384/SHA384';
      case 15: return 'Ed25519';
      case 16: return 'Ed448';
      default: return 'Unknown';
  }
}

const getDigestTypeName = (code: number) => {
  switch(code) {
      case 1: return 'SHA1';
      case 2: return 'SHA256';
      case 3: return 'GOST R 34.11-94';
      case 4: return 'SHA384';
      default: return 'Unknown';
  }
}

const makeResponseList = (response: any): RowProps[] => {
  const result = [] as RowProps[];
  if (!response) return result;
  if (typeof response.RD === 'boolean') result.push({ lbl: 'Recursion Desired (RD)', val: response.RD });
  if (typeof response.RA === 'boolean') result.push({ lbl: 'Recursion Available (RA)', val: response.RA });
  if (typeof response.TC === 'boolean') result.push({ lbl: 'TrunCation (TC)', val: response.TC });
  if (typeof response.AD === 'boolean') result.push({ lbl: 'Authentic Data (AD)', val: response.AD });
  if (typeof response.CD === 'boolean') result.push({ lbl: 'Checking Disabled (CD)', val: response.CD });
  return result;
};

const makeAnswerList = (recordData: any): RowProps[] => {
  return [
    { lbl: 'Domain', val: recordData.name },
    { lbl: 'Type', val: `${getRecordTypeName(recordData.type)} (${recordData.type})` },
    { lbl: 'TTL', val: recordData.TTL },
    { lbl: 'Algorithm', val: recordData.algorithm },
    { lbl: 'Flags', val: recordData.flags },
    { lbl: 'Protocol', val: recordData.protocol },
    { lbl: 'Public Key', val: recordData.publicKey },
    { lbl: 'Key Tag', val: recordData.keyTag },
    { lbl: 'Digest Type', val: recordData.digestType },
    { lbl: 'Digest', val: recordData.digest },
  ].filter((rowData) => rowData.val && rowData.val !== 'Unknown');
};

const DnsSecCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const dnsSec = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {
        ['DNSKEY', 'DS', 'RRSIG'].map((key: string, index: number) => {
          const record = dnsSec[key];
          return (<div key={`${key}-${index}`}>
          <Heading as="h3" size="small" color={colors.primary}>{key}</Heading>
          {(record.isFound && record.answer) && (<>
              <Row lbl={`${key} - Present?`} val="✅ Yes" />
              {
                record.answer.map((answer: any, index: number) => {
                  const keyData = parseDNSKeyData(answer.data);
                  const dsData = parseDSData(answer.data);
                  const label = (keyData.flags && keyData.flags !== 'Unknown') ? keyData.flags : key;
                  return (
                  <ExpandableRow lbl={`Record #${index+1}`} val={label} rowList={makeAnswerList({ ...answer, ...keyData, ...dsData })} open />
                );
                })
              }
          </>)}

            {(!record.isFound && record.response) && (
              <ExpandableRow lbl={`${key} - Present?`} val={record.isFound ? '✅ Yes' : '❌ No'} rowList={makeResponseList(record.response)} />
            )}
          </div>)
        })
      }
    </Card>
  );
}

export default DnsSecCard;
