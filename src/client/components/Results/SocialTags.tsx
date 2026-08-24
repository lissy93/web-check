import { useEffect, useState } from 'react';
import { Card } from 'client/components/Form/Card';
import Button from 'client/components/Form/Button';
import Row from 'client/components/Form/Row';
import colors from 'client/styles/colors';
import { normalizeXUsername } from 'client/utils/x-profile';

const apiBase = (import.meta.env.PUBLIC_API_ENDPOINT || '/api') as string;

interface XProfile {
  id: string;
  username: string;
  name: string;
  description?: string;
  followers?: number;
  following?: number;
  statusesCount?: number;
  verified?: boolean;
  location?: string;
}

type LookupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; profile: XProfile };

const cardStyles = `
  .banner-image img {
    width: 100%;
    border-radius: 4px;
    margin: 0.5rem 0;
  }
  .color-field {
    border-radius: 4px;
    &:hover {
      color: ${colors.primary};
    }
  }
  .x-profile-lookup {
    margin-top: 0.75rem;
  }
  .x-profile-note {
    color: ${colors.textColorSecondary};
    font-size: 0.8rem;
    margin: 0.5rem 0 0;
  }
  .x-profile-error {
    color: ${colors.error};
  }
`;

const OgBanner = ({ ogImage, ogUrl }: { ogImage: string; ogUrl?: string }): JSX.Element => {
  const urlCover = ogImage.startsWith('/') && ogUrl ? `${ogUrl}${ogImage}` : ogImage;
  return (
    <div className="banner-image">
      <img src={urlCover} alt="Banner" />
    </div>
  );
};

const SocialTagsCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const tags = props.data;
  const username = normalizeXUsername(tags.twitterSite);
  const [lookup, setLookup] = useState<LookupState>({ status: 'idle' });

  useEffect(() => setLookup({ status: 'idle' }), [username]);

  const verifyXProfile = async (): Promise<void> => {
    if (!username || lookup.status === 'loading' || lookup.status === 'success') return;
    setLookup({ status: 'loading' });
    try {
      const profileUrl = `https://x.com/${username}`;
      const response = await fetch(`${apiBase}/x-profile?url=${encodeURIComponent(profileUrl)}`);
      const body = await response.json();
      if (!response.ok || body.error || body.skipped) {
        setLookup({ status: 'error', message: body.error || body.skipped || 'Lookup failed' });
        return;
      }
      if (body.username?.toLowerCase() !== username.toLowerCase()) {
        setLookup({ status: 'error', message: `Profile did not match @${username}` });
        return;
      }
      setLookup({ status: 'success', profile: body as XProfile });
    } catch (error) {
      setLookup({
        status: 'error',
        message: error instanceof Error ? error.message : 'Lookup failed',
      });
    }
  };

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {tags.title && <Row lbl="Title" val={tags.title} />}
      {tags.description && <Row lbl="Description" val={tags.description} />}
      {tags.keywords && <Row lbl="Keywords" val={tags.keywords} />}
      {tags.canonicalUrl && <Row lbl="Canonical URL" val={tags.canonicalUrl} />}
      {tags.themeColor && (
        <Row lbl="" val="">
          <span className="lbl">Theme Color</span>
          <span className="val color-field" style={{ background: tags.themeColor }}>
            {tags.themeColor}
          </span>
        </Row>
      )}
      {tags.twitterSite && (
        <Row lbl="" val="">
          <span className="lbl">X Profile</span>
          <span className="val">
            {username ? (
              <a target="_blank" rel="noreferrer" href={`https://x.com/${username}`}>
                @{username}
              </a>
            ) : (
              tags.twitterSite
            )}
          </span>
        </Row>
      )}
      {tags.author && <Row lbl="Author" val={tags.author} />}
      {tags.publisher && <Row lbl="Publisher" val={tags.publisher} />}
      {tags.generator && <Row lbl="Generator" val={tags.generator} />}
      {tags.ogImage && <OgBanner ogImage={tags.ogImage} ogUrl={tags.ogUrl} />}
      {username && lookup.status !== 'success' && (
        <div className="x-profile-lookup">
          <Button
            onClick={verifyXProfile}
            loadState={lookup.status === 'loading' ? 'loading' : undefined}
            title={`Run one metered Xquik profile lookup for @${username}`}
          >
            Verify @{username} with Xquik
          </Button>
          <p className="x-profile-note">
            Runs only when clicked. Requires a server-side XQUIK_API_KEY.
          </p>
        </div>
      )}
      {lookup.status === 'error' && (
        <p className="x-profile-note x-profile-error">{lookup.message}</p>
      )}
      {lookup.status === 'success' && (
        <>
          <Row lbl="X name" val={lookup.profile.name} />
          {lookup.profile.description && <Row lbl="X bio" val={lookup.profile.description} />}
          {lookup.profile.location && <Row lbl="X location" val={lookup.profile.location} />}
          {lookup.profile.followers !== undefined && (
            <Row lbl="X followers" val={lookup.profile.followers.toLocaleString()} />
          )}
          {lookup.profile.following !== undefined && (
            <Row lbl="X following" val={lookup.profile.following.toLocaleString()} />
          )}
          {lookup.profile.statusesCount !== undefined && (
            <Row lbl="X posts" val={lookup.profile.statusesCount.toLocaleString()} />
          )}
          {lookup.profile.verified !== undefined && (
            <Row lbl="X verified" val={lookup.profile.verified ? 'Yes' : 'No'} />
          )}
        </>
      )}
    </Card>
  );
};

export default SocialTagsCard;
