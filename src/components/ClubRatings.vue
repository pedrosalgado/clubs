<template>
  <div class="ratings-container">
    <h1>Club Ratings</h1>
    <Transition name="fade">
      <table v-if="isLoading" class="ratings-table">
        <thead>
        <tr>
          <th></th>
          <th></th>
          <th class="larger-cell"></th>
          <th class="larger-cell">From</th>
          <th>GP</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
          <th>PT</th>
        </tr>
        </thead>
        <tbody>
        <!-- Loop through the clubs and limit the number of items displayed -->
        <tr v-for="index in itemsToShow" :key="index">
          <td v-for="(indx, cellIndex) in 12" :key="indx" :class="['skeleton-cell', { 'larger-cell': cellIndex === 2 || cellIndex === 3 }]">
            <SkeletonCell />
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Display the table when data is loaded -->
      <table v-else class="ratings-table">
        <thead>
        <tr>
          <th></th>
          <th></th>
          <th class="larger-cell"></th>
          <th class="larger-cell">From</th>
          <th>GP</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
          <th>PT</th>
        </tr>
        </thead>
        <tbody>
        <!-- Loop through the clubs and limit the number of items displayed -->
        <tr v-for="(club, index) in clubs.slice(0, itemsToShow)" :key="club.idTeam">
          <td>{{ index + 1 }}</td>
          <td><img :src="club.strTeamBadge" alt="Club Emblem" width="32" height="32" /></td>
          <td class="larger-cell">
             <span v-tooltip="tooltipConfig(club.idTeam)"
                   @mouseover="isTooltipVisible = true"
                   @mouseleave="isTooltipVisible = false"
             >
               {{ club.strTeam }}
             </span>
            <!-- Display the tooltip when isTooltipVisible is true -->
            <div v-if="isTooltipVisible" class="tooltip">
              <ul>
                <li v-for="player in playersInTooltip" :key="player.idPlayer">
                  {{ player.strPlayer }}
                </li>
              </ul>
            </div>
          </td>
          <td class="larger-cell">
            <span v-for="(result, index) in club.strForm" :key="index">
              <i v-if="result === 'W'" class="fa fa-check-circle"></i>
              <i v-else-if="result === 'L'" class="fa fa-times-circle"></i>
              <i v-else class="fa fa-minus-circle"></i>
            </span>
          </td>
          <td>{{ club.intPlayed }}</td>
          <td>{{ club.intWin }}</td>
          <td>{{ club.intDraw }}</td>
          <td>{{ club.intLoss }}</td>
          <td>{{ club.intGoalsFor }}</td>
          <td>{{ club.intGoalsAgainst }}</td>
          <td>{{ club.intGoalsFor - club.intGoalsAgainst }}</td>
          <td>{{ club.intPoints }}</td>
        </tr>
        <tr v-for="n in newlyAddedRows" :key="'skeleton-' + n">
          <td v-for="indx in 12" :key="indx" :class="['skeleton-cell', { 'larger-cell': indx === 2 || indx === 3 }]">
            <SkeletonCell />
          </td>
        </tr>
        </tbody>
      </table>
    </Transition>
    <!-- Conditionally render the "Load more" button -->
    <button v-if="clubs.length > itemsToShow && !isLoading" @click="loadMore">Load more</button>
  </div>
</template>

<script>

import { fetchClubRatings } from '@/services/api.js';
import SkeletonCell from '@/components/SkeletonCell';
import mockTeamPlayers from '@/services/mockTeamPlayers';
import VTooltip from 'v-tooltip';


export default {
  components: {
    SkeletonCell,
  },
  directives: {
    tooltip: VTooltip,
  },
  data() {
    return {
      clubs: [],
      itemsToShow: 5, // Number of items to display initially
      itemsToLoad: 3, // Number of items to load when clicking "Load more"
      isLoading: true, // Initially hide the table
      newlyAddedRows: 0, // track if rows where added
      playersInTooltip: [],
      isTooltipVisible: false,
    };
  },
  mounted() {
    // Make the API call when the component is mounted
    this.fetchClubRatingsData();
  },
  methods: {
    //added a timeout to the API call sot that the skeleton can actually be seen
    async fetchClubRatingsData() {
      try {
        this.clubs = await fetchClubRatings();
        // Introduce a slight delay before showing the table
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      } catch (error) {
        console.error('Error fetching club ratings:', error);
      }
    },
    loadMore() {
      // Update the number of newly added rows
      this.newlyAddedRows = this.itemsToLoad;

      // Introduce a slight delay before showing the result
      setTimeout(() => {
        this.itemsToShow += this.itemsToLoad;
        this.newlyAddedRows = 0; // Reset the newly added rows count
      }, 1000);
    },
    tooltipConfig(teamId) {
      console.log(teamId);
      if (this.isTooltipVisible) {
        // Retrieve player names based on teamId
        const playerNames = mockTeamPlayers[teamId] || [];
        console.log(playerNames);
        return {
          content: playerNames.join(', '),
          delay: 200,
          placement: 'top',
        };
      }
      return { content: '' };
    },
  },
};
</script>

<style scoped>
.fa-check-circle{
  color: green;
}

.fa-times-circle{
  color: red;
}

.fa-minus-circle{
  color: grey;
}

.ratings-container{
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.ratings-table {
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.ratings-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.ratings-table th,
.ratings-table td {
  padding: 12px 15px;
  width: calc(100% / 12);
  height: 40px;
  text-align: left;
}

.ratings-table td.larger-cell,
.ratings-table th.larger-cell{
  width: calc((100% / 12) * 4);
}
.ratings-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.ratings-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.ratings-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 999;
}

/*
	Max width before this PARTICULAR table gets nasty.
	This query will take effect for any screen smaller than 760px and also iPads specifically.
	*/
@media
only screen
and (max-width: 760px), (min-device-width: 768px)
and (max-device-width: 1024px)  {

  .ratings-container{
    max-width: 260px;
  }

  /* Force table to not be like tables anymore */
  table, thead, tbody, th, td, tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin: 0 0 1rem 0;
  }

  tr:nth-child(odd) {
    background: #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 10%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    top: 0;
    left: 6px;
    width: 5%;
    padding-right: 10px;
    white-space: nowrap;
  }

  /*  Label the data */
  td:nth-of-type(1):before { content: ""; }
  td:nth-of-type(2):before { content: ""; }
  td:nth-of-type(3):before { content: ""; }
  td:nth-of-type(4):before { content: "From"; }
  td:nth-of-type(5):before { content: "GP"; }
  td:nth-of-type(6):before { content: "W"; }
  td:nth-of-type(7):before { content: "D"; }
  td:nth-of-type(8):before { content: "L"; }
  td:nth-of-type(9):before { content: "GF"; }
  td:nth-of-type(10):before { content: "GA"; }
  td:nth-of-type(11):before { content: "GD"; }
  td:nth-of-type(12):before { content: "Pts"; }
}
</style>
