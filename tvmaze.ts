import axios from "axios";
import * as $ from "jquery";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");

const API_URL = `https://api.tvmaze.com/`;
const DEFAULT_IMG = `https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png`;

interface IShowFromAPI {
  id: number;
  name: string;
  summary: string;
  image: { medium: string } | null;
}

interface IShow {
  id: number;
  name: string;
  summary: string;
  image: string;
}

interface IEpisode {
  id: number;
  name: string;
  season: string;
  number: string;
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<IShow[]> {
  const response = await axios({
    url: `${API_URL}search/shows?q=${term}`,
    method: "GET",
  });

  return response.data.map((result: { show: IShowFromAPI }): IShow => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image?.medium || DEFAULT_IMG,
      // Step 2/3
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: IShow[]) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              /* Step 3 */
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});





/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<IEpisode[]> {
  const response = await axios({
    url: `${API_URL}shows/${id}/episodes`,
    method: "GET",
  });

  return response.data.map((result: { episode: IEpisode }): IEpisode => {
    const show = result.episode;
    console.log(show);
    return {
      id: show.id,
      name: show.name,
      season: show.season,
      number: show.number,
      // Step 2/3
    };
  });
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes: IEpisode[]) {
  $episodesList.empty();
  $episodesArea.show();

  for (let episode of episodes) {
    const $episode = $(
      `<li>
        <div data-episode-id="${episode.id}" class="Episode col-md-12 col-lg-6 mb-4">
         <div class="media">
           <div class="media-body">
             <h5 class="text-primary">${episode.name}</h5>
             <div><small>${episode.season}</small></div>
             <div><small>${episode.number}</small></div>
           </div>
         </div>
        </div>
       </li>
      `
    );

    $episodesList.append($episode);
  }
}

$('.Show-getEpisodes').on('click', 'button', async function(evt) {
  evt.preventDefault();
  await populateEpisodes();
});

