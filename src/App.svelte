<script lang="ts">
  import { debounceTime } from "rxjs";

  import SvelteSubject from "./SvelteSubject";

  export let name: string;

  const value = new SvelteSubject("");
  value.pipe(debounceTime(250)).subscribe((value) => {
    console.log(value);
  });
</script>

<main>
  <h1>{name}</h1>

  <input bind:value={$value} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
