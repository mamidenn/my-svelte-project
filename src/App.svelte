<script lang="ts">
  import {
    catchError,
    debounceTime,
    map,
    of,
    startWith,
    switchMap,
  } from "rxjs";
  import { fromFetch } from "rxjs/fetch";
  import { SvelteSubject } from "@modules";

  export let name: string;

  interface Track {
    artistViewUrl: string;
    artistName: string;
    trackViewUrl: string;
    trackName: string;
  }

  const term = new SvelteSubject("");
  const tracks = term.pipe(
    debounceTime(350),
    switchMap((input) => {
      if (!input) return of([]);
      return fromFetch(`https://itunes.apple.com/search?term==${input}`).pipe(
        switchMap<Response, Promise<{ results: (Track & { kind: string })[] }>>(
          (response) => {
            if (response.ok) return response.json();
            throw new Error(response.statusText);
          }
        ),
        map((result) => result.results.filter((t) => t.kind === "song")),
        catchError((err: Error) => {
          console.error(err);
          return of([]);
        })
      );
    }),
    startWith<Track[]>([])
  );
</script>

<main>
  <h1>{name}</h1>

  <input bind:value={$term} />
  <table>
    <thead>
      <tr><th>Artist</th><th>Track</th></tr>
    </thead>
    {#each $tracks as track}
      <tr
        ><td><a href={track.artistViewUrl}>{track.artistName}</a></td><td>
          <a href={track.trackViewUrl}>{track.trackName}</a></td
        ></tr
      >
    {/each}
  </table>
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
