import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoadingState } from 'components/misc/ProgressBar';
import { AddressType } from 'utils/address-type-checker';

interface UseIpAddressProps<ResultType = any> {
  // Unique identifier for this job type
  jobId: string;
  // The actual fetch request
  fetchRequest: () => Promise<ResultType>;
  // Function to call to update the loading state in parent
  updateLoadingJobs: (job: string, newState: LoadingState, error?: string, retry?: (data?: any) => void | null, data?: any) => void;
  addressInfo: {
    // The hostname/ip address that we're checking
    address: string | undefined;
    // The type of address (e.g. url, ipv4)
    addressType: AddressType;
    // The valid address types for this job
    expectedAddressTypes: AddressType[];
  };
}

type ResultType = any;

type ReturnType = [ResultType | undefined, (data?: any) => void];

const useMotherOfAllHooks = <ResultType = any>(params: UseIpAddressProps<ResultType>): ReturnType => {
  // Destructure params
  const { addressInfo, fetchRequest, jobId, updateLoadingJobs } = params;
  const { address, addressType, expectedAddressTypes } = addressInfo;

  // Build useState that will be returned
  const [result, setResult] = useState<ResultType>();

  // Fire off the HTTP fetch request, then set results and update loading / error state
  const doTheFetch = () => {
    return fetchRequest()
    .then((res: any) => {
      if (!res) {
        updateLoadingJobs(jobId, 'error', res.error, reset);
        throw new Error('No response');
      }
      if (res.error) {
        updateLoadingJobs(jobId, 'error', res.error, reset);
        throw new Error(res.error);
      }
      // All went to plan, set results and mark as done
      setResult(res);
      updateLoadingJobs(jobId, 'success', '', undefined, res);
    })
    .catch((err) => {
      // Something fucked up, log the error
      updateLoadingJobs(jobId, 'error', err.error || err.message, reset);
      throw err;
    })
  }

  // For when the user manually re-triggers the job
  const reset = (data: any) => {
    // If data is provided, then update state
    if (data && !(data instanceof Event) && !data?._reactName) {
      setResult(data);
    } else { // Otherwise, trigger a data re-fetch
      updateLoadingJobs(jobId, 'loading');
      const fetchyFetch = doTheFetch();
      const toastOptions = {
        pending: `Updating Data (${jobId})`,
        success: `Completed (${jobId})`,
        error: `Failed to update (${jobId})`,
      };
      // Initiate fetch, and show progress toast
      toast.promise(fetchyFetch, toastOptions).catch(() => {});
    }
  };

  useEffect(() => {
    // Still waiting for this upstream, cancel job
    if (!address || !addressType) {
      return;
    }
    // This job isn't needed for this address type, cancel job
    if (!expectedAddressTypes.includes(addressType)) {
      if (addressType !== 'empt') updateLoadingJobs(jobId, 'skipped');
      return;
    }

    // Initiate the data fetching process
    doTheFetch().catch(() => {});
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, addressType]);

  return [result, reset];
};

export default useMotherOfAllHooks;

// I really fucking hate TypeScript sometimes....
// Feels like a weak attempt at trying to make JavaScript less crappy,
// when the real solution would be to just switch to a proper, typed, safe language
// ... Either that, or I'm just really shit at it.
