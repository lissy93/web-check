import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';
import Masonry from 'react-masonry-css';

import colors from 'web-check-live/styles/colors';
import Heading from 'web-check-live/components/Form/Heading';
import Modal from 'web-check-live/components/Form/Modal';
import Footer from 'web-check-live/components/misc/Footer';
import Nav from 'web-check-live/components/Form/Nav';
import Loader from 'web-check-live/components/misc/Loader';
import ErrorBoundary from 'web-check-live/components/misc/ErrorBoundary';
import DocContent from 'web-check-live/components/misc/DocContent';
import ProgressBar, {
  type LoadingJob,
  type LoadingState,
} from 'web-check-live/components/misc/ProgressBar';
import ActionButtons from 'web-check-live/components/misc/ActionButtons';
import AdditionalResources from 'web-check-live/components/misc/AdditionalResources';
import ViewRaw from 'web-check-live/components/misc/ViewRaw';

import { determineAddressType, type AddressType } from 'web-check-live/utils/address-type-checker';
import { hasData } from 'web-check-live/utils/result-processor';
import useJobs from 'web-check-live/hooks/useJobs';
import { jobs, allCards, allCardIds } from 'web-check-live/jobs/registry';

const ResultsOuter = styled.div`
  display: flex;
  flex-direction: column;
  .masonry-grid {
    display: flex;
    width: auto;
  }
  .masonry-grid-col section {
    margin: 1rem 0.5rem;
  }
`;

const ResultsContent = styled.section`
  width: 95vw;
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin: auto;
  width: calc(100% - 2rem);
  padding-bottom: 1rem;
`;

const FilterButtons = styled.div`
  width: 95vw;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  .one-half {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }
  button,
  input,
  .toggle-filters {
    background: ${colors.backgroundLighter};
    color: ${colors.textColor};
    border: none;
    border-radius: 4px;
    font-family: 'PTMono';
    padding: 0.25rem 0.5rem;
    border: 1px solid transparent;
    transition: all 0.2s ease-in-out;
  }
  button,
  .toggle-filters {
    cursor: pointer;
    text-transform: capitalize;
    box-shadow: 2px 2px 0px ${colors.bgShadowColor};
    transition: all 0.2s ease-in-out;
    &:hover {
      box-shadow: 4px 4px 0px ${colors.bgShadowColor};
      color: ${colors.primary};
    }
    &.selected {
      border: 1px solid ${colors.primary};
      color: ${colors.primary};
    }
  }
  input:focus {
    border: 1px solid ${colors.primary};
    outline: none;
  }
  .clear {
    color: ${colors.textColor};
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.8rem;
    opacity: 0.8;
  }
  .toggle-filters {
    font-size: 0.8rem;
  }
  .control-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    a {
      text-decoration: none;
    }
  }
`;

const makeSiteName = (address: string): string => {
  try {
    return new URL(address).hostname.replace('www.', '');
  } catch {
    return address;
  }
};

const makeActionButtons = (title: string, refresh: () => void, showInfo: () => void): ReactNode => (
  <ActionButtons
    actions={[
      { label: `Info about ${title}`, onClick: showInfo, icon: 'ⓘ' },
      { label: `Re-fetch ${title} data`, onClick: refresh, icon: '↻' },
    ]}
  />
);

const Results = (props: { address?: string }): JSX.Element => {
  const address = props.address || useParams().urlToScan || '';
  const [addressType, setAddressType] = useState<AddressType>('empt');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (addressType === 'empt') setAddressType(determineAddressType(address));
  }, [address, addressType]);

  const { state: jobsState, retry } = useJobs(address, addressType, jobs);

  // Shape useJobs state for the existing ProgressBar contract
  const loadingJobs: LoadingJob[] = useMemo(
    () =>
      allCardIds.map((id) => {
        const e = jobsState[id] || { state: 'loading' as LoadingState };
        return {
          name: id,
          state: e.state,
          error: e.error,
          timeTaken: e.timeTaken,
          retry: () => retry(id),
        };
      }),
    [jobsState, retry],
  );

  // Expose successful job results on window.webCheck for debugging,
  // resetting on new input so prior scans cannot accumulate
  useEffect(() => {
    (window as any).webCheck = {};
  }, [address]);
  useEffect(() => {
    const w = (window as any).webCheck;
    if (!w) return;
    Object.entries(jobsState).forEach(([id, entry]) => {
      if (entry?.state === 'success' && entry.raw !== undefined) {
        w[id] = entry.raw;
      }
    });
  }, [jobsState]);

  const showInfo = (id: string) => {
    setModalContent(DocContent(id));
    setModalOpen(true);
  };

  const showErrorModal = (content: ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const updateTags = (tag: string) =>
    setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [tag]);

  const clearFilters = () => {
    setTags([]);
    setSearchTerm('');
  };

  // Resolve each card's data, applying picker and falling back when needed
  const renderable = allCards.map(({ jobId, card }) => {
    const entry = jobsState[card.id];
    const raw = entry?.raw;
    let data = raw && card.pick ? card.pick(raw) : raw;
    if (!hasData(data) && card.fallback) data = card.fallback(jobsState);
    return { jobId, card, data, entry };
  });

  const cardsToShow = renderable.filter(({ card, data, entry }) => {
    const tagMatch = tags.length === 0 || card.tags.some((t) => tags.includes(t));
    const searchMatch = card.title.toLowerCase().includes(searchTerm.toLowerCase());
    return tagMatch && searchMatch && hasData(data) && !entry?.error;
  });

  return (
    <ResultsOuter>
      <Nav>
        {address && (
          <Heading color={colors.textColor} size="medium">
            {addressType === 'url' && (
              <a target="_blank" rel="noreferrer" href={address}>
                <img width="32px" alt="" src={`https://icon.horse/icon/${makeSiteName(address)}`} />
              </a>
            )}
            {makeSiteName(address)}
          </Heading>
        )}
      </Nav>
      <ProgressBar loadStatus={loadingJobs} showModal={showErrorModal} showJobDocs={showInfo} />
      <Loader show={loadingJobs.filter((j) => j.state !== 'loading').length < 5} />
      <FilterButtons>
        {showFilters ? (
          <>
            <div className="one-half">
              <span className="group-label">Filter by</span>
              {['server', 'client', 'meta'].map((tag) => (
                <button
                  key={tag}
                  className={tags.includes(tag) ? 'selected' : ''}
                  onClick={() => updateTags(tag)}
                >
                  {tag}
                </button>
              ))}
              {(tags.length > 0 || searchTerm.length > 0) && (
                <span onClick={clearFilters} className="clear">
                  Clear Filters
                </span>
              )}
            </div>
            <div className="one-half">
              <span className="group-label">Search</span>
              <input
                type="text"
                placeholder="Filter Results"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="toggle-filters" onClick={() => setShowFilters(false)}>
                Hide
              </span>
            </div>
          </>
        ) : (
          <div className="control-options">
            <span className="toggle-filters" onClick={() => setShowFilters(true)}>
              Show Filters
            </span>
            <a href="#view-download-raw-data">
              <span className="toggle-filters">Export Data</span>
            </a>
            <a href="/about">
              <span className="toggle-filters">Learn about the Results</span>
            </a>
            <a href="/about#additional-resources">
              <span className="toggle-filters">More tools</span>
            </a>
            <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">
              <span className="toggle-filters">View GitHub</span>
            </a>
          </div>
        )}
      </FilterButtons>
      <ResultsContent>
        <Masonry
          breakpointCols={{
            10000: 12,
            4000: 9,
            3600: 8,
            3200: 7,
            2800: 6,
            2400: 5,
            2000: 4,
            1600: 3,
            1200: 2,
            800: 1,
          }}
          className="masonry-grid"
          columnClassName="masonry-grid-col"
        >
          {cardsToShow.map(({ card, data }) => (
            <ErrorBoundary title={card.title} key={`eb-${card.id}`}>
              <card.Component
                key={card.id}
                data={data}
                title={card.title}
                actionButtons={makeActionButtons(
                  card.title,
                  () => retry(card.id),
                  () => showInfo(card.id),
                )}
              />
            </ErrorBoundary>
          ))}
        </Masonry>
      </ResultsContent>
      <ViewRaw
        everything={renderable.map((r) => ({
          id: r.card.id,
          title: r.card.title,
          result: r.data,
        }))}
      />
      <AdditionalResources url={address} />
      <Footer />
      <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
        {modalContent}
      </Modal>
      <ToastContainer
        limit={3}
        draggablePercent={60}
        autoClose={2500}
        theme="dark"
        position="bottom-right"
      />
    </ResultsOuter>
  );
};

export default Results;
