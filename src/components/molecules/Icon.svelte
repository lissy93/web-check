<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import * as brands from '@fortawesome/free-brands-svg-icons';
  import * as solidIcons from '@fortawesome/free-solid-svg-icons';
  import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';


  export const iconMap: Record<string, IconDefinition> = {
    check: solidIcons.faCheck,
    plus: solidIcons.faPlus,
    github: brands.faGithubAlt,
    code: solidIcons.faCode,
    rocket: solidIcons.faRocket,
    copy: solidIcons.faCopy,
  };

  export let name: string;
  export let size: number = 1;
  export let color: string = 'currentColor';
  export let styles: string = '';

</script>

{#if iconMap[name]}
  <FontAwesomeIcon 
    class="fa-icon"
    style={`--icon-size: ${size}rem; --icon-color: ${color}; ${styles}`}
    icon={iconMap[name]} />
{/if}

<style>
  :global(.fa-icon) {
    width: var(--icon-size, 1rem);
    color: var(--icon-color, currentColor);
  }
</style>
