import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { useLanguage, type Language } from 'client/i18n';

const Switcher = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(3rem, auto));
  height: 2rem;
  padding: 2px;
  border: 1px solid ${colors.primaryTransparent};
  border-radius: 4px;
  background: ${colors.background};
  flex: 0 0 auto;
  button {
    min-width: 0;
    border: 0;
    border-radius: 2px;
    padding: 0 0.55rem;
    background: transparent;
    color: ${colors.textColorSecondary};
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    &[aria-pressed='true'] {
      background: ${colors.primary};
      color: ${colors.background};
      font-weight: 700;
    }
    &:focus-visible {
      outline: 2px solid ${colors.primary};
      outline-offset: 2px;
    }
  }
`;

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { language, setLanguage, t } = useLanguage();
  const options: Array<{ value: Language; label: string; title: string }> = [
    { value: 'en', label: 'EN', title: t('english') },
    { value: 'zh-CN', label: '中文', title: t('chinese') },
  ];
  return (
    <Switcher className={className} role="group" aria-label={t('language')}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
        >
          {option.label}
        </button>
      ))}
    </Switcher>
  );
};

export default LanguageSwitcher;
