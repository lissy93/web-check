const axios = require('axios');
const middleware = require('./_common/middleware');

const convertTimestampToDate = (timestamp) => {
  const [year, month, day, hour, minute, second] = [
    timestamp.slice(0, 4),
    timestamp.slice(4, 6) - 1,
    timestamp.slice(6, 8),
    timestamp.slice(8, 10),
    timestamp.slice(10, 12),
    timestamp.slice(12, 14),
  ].map(num => parseInt(num, 10));

  return new Date(year, month, day, hour, minute, second);
}

const countPageChanges = (results) => {
  let prevDigest = null;
  return results.reduce((acc, curr) => {
    if (curr[2] !== prevDigest) {
      prevDigest = curr[2];
      return acc + 1;
    }
    return acc;
  }, -1);
}

const getAveragePageSize = (scans) => {
    const totalSize = scans.map(scan => parseInt(scan[3], 10)).reduce((sum, size) => sum + size, 0);
    return Math.round(totalSize / scans.length);
};

const getScanFrequency = (firstScan, lastScan, totalScans, changeCount) => {
  const formatToTwoDecimal = num => parseFloat(num.toFixed(2));

  const dayFactor = (lastScan - firstScan) / (1000 * 60 * 60 * 24);  
  const daysBetweenScans = formatToTwoDecimal(dayFactor / totalScans);
  const daysBetweenChanges = formatToTwoDecimal(dayFactor / changeCount);
  const scansPerDay = formatToTwoDecimal((totalScans - 1) / dayFactor);
  const changesPerDay = formatToTwoDecimal(changeCount / dayFactor);
  return {
    daysBetweenScans,
    daysBetweenChanges,
    scansPerDay,
    changesPerDay,
  };
};

const getWaybackData = async (url) => {
  const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${url}&output=json&fl=timestamp,statuscode,digest,length,offset`;

  try {
    const { data } = await axios.get(cdxUrl);
    
    // Check there's data
    if (!data || !Array.isArray(data) || data.length <= 1) {
      return { skipped: 'Site has never before been archived via the Wayback Machine' };
    }

    // Remove the header row
    data.shift();

    // Process and return the results
    const firstScan = convertTimestampToDate(data[0][0]);
    const lastScan = convertTimestampToDate(data[data.length - 1][0]);
    const totalScans = data.length;
    const changeCount = countPageChanges(data);
    return {
      firstScan,
      lastScan,
      totalScans,
      changeCount,
      averagePageSize: getAveragePageSize(data),
      scanFrequency: getScanFrequency(firstScan, lastScan, totalScans, changeCount),
      scans: data,
      scanUrl: url,
    };
  } catch (err) {
    return { error: `Error fetching Wayback data: ${err.message}` };
  }
};

module.exports = middleware(getWaybackData);
module.exports.handler = middleware(getWaybackData);
