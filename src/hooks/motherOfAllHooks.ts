import { useState, useEffect } from 'react';
import { LoadingState } from 'components/misc/ProgressBar';
import { AddressType } from 'utils/address-type-checker';

type UpdateLoadingJobsFunction = (job: string, newState: LoadingState, error?: string) => void;

interface AddressInfo {
  address: string | undefined;
  addressType: AddressType;
  expectedAddressTypes: AddressType[];
}

interface UseIpAddressProps<ResultType = any> {
  addressInfo: AddressInfo;
  updateLoadingJobs: UpdateLoadingJobsFunction;
  jobId: string;
  fetchRequest: () => Promise<ResultType>; 
}

type ResultType = any;

type ReturnType = [ResultType | undefined, React.Dispatch<React.SetStateAction<ResultType | undefined>>];


const useMotherOfAllHooks = <ResultType = any>(params: UseIpAddressProps<ResultType>): ReturnType => {
  // Destructure params
  const { addressInfo, fetchRequest, jobId, updateLoadingJobs } = params;
  const { address, addressType, expectedAddressTypes } = addressInfo;

  // Build useState that will be returned
  const [result, setResult] = useState<ResultType>();

  useEffect(() => {
    // Still waiting for this upstream, cancel job
    if (!address || !addressType) {
      return;
    }
    // This job isn't needed for this address type, cancel job
    if (!expectedAddressTypes.includes(addressType)) {
      // updateLoadingJobs(jobId, 'skipped');
      return;
    }

    // Initiate fetch request, set results and update loading / error state
    fetchRequest()
      .then((res) => {
        // All went to plan, set results and mark as done
        setResult(res);
        updateLoadingJobs(jobId, 'success');
      })
      .catch((err) => {
        // Something fucked up, log the error
        updateLoadingJobs(jobId, 'error', err.message);
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, addressType]);

  return [result, setResult];
};

export default useMotherOfAllHooks;

// I really fucking hate TypeScript sometimes....
// Feels like a weak attempt at trying to make JavaScript less crappy,
// when the real solution would be to just switch to a proper, typed, safe language
// ... Either that, or I'm just really shit at it.
