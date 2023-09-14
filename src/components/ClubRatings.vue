<template>
  <div class="ratings-container">
    <h1>Club Ratings</h1>
    <Transition name="fade">
      <!-- Display the table when data is loaded -->
      <table class="ratings-table" v-if="showTable">
        <thead>
        <tr>
          <th>#</th>
          <th>Emblem</th>
          <th>Name</th>
          <th>From</th>
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
          <td>{{ club.strTeam }}</td>
          <td>
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
        </tbody>
      </table>
      <!-- Conditionally render the SkeletonLoader while data is loading -->
      <SkeletonLoader v-else />
    </Transition>
    <!-- Conditionally render the "Load more" button -->
    <button v-if="clubs.length > itemsToShow && showTable" @click="loadMore">Load more</button>
  </div>
</template>

<script>

import { fetchClubRatings } from '@/api/api.js';
import SkeletonLoader from '@/components/SkeletonLoader';

export default {
  components: {
    SkeletonLoader, // Register the SkeletonLoader component
  },
  data() {
    return {
      clubs: [],
      itemsToShow: 5, // Number of items to display initially
      itemsToLoad: 3, // Number of items to load when clicking "Load more"
      showTable: false, // Initially hide the table
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
          this.showTable = true;
        }, 1000);
      } catch (error) {
        console.error('Error fetching club ratings:', error);
      }
    },
    loadMore() {
      this.itemsToShow += this.itemsToLoad;
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
  max-width: 600px;
  margin: 0 auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
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
