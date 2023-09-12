<template>
  <div>
    <h1>Club Ratings</h1>
    <table>
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
      <!-- Loop through the clubs and create a row for each -->
      <tr v-for="(club, index) in clubs" :key="club.idTeam">
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
  </div>
</template>

<script>

import { fetchClubRatings } from '@/api/api.js';
export default {
  data() {
    return {
      clubs: [],
    };
  },
  mounted() {
    // Make the API call when the component is mounted
    this.fetchClubRatingsData();
  },
  methods: {
    async fetchClubRatingsData() {
      try {
        this.clubs = await fetchClubRatings();
      } catch (error) {
        console.error('Error fetching club ratings:', error);
      }
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
</style>
