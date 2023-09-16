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
            <td
              v-for="idx in 12"
              :key="idx"
              :class="[
                'skeleton-cell',
                { 'larger-cell': idx === 2 || idx === 3 }
              ]"
            >
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
          <tr
            v-for="(club, index) in clubs.slice(0, itemsToShow)"
            :key="club.idTeam"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <img
                :src="club.strTeamBadge"
                alt="Club Emblem"
                width="32"
                height="32"
              />
            </td>
            <td class="larger-cell">
              <span
                class="tooltip-toggle"
                :title="tooltipConfig(club.idTeam)"
                v-title
              >
                {{ club.strTeam }}
              </span>
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
            <td
              v-for="idx in 12"
              :key="idx"
              :class="[
                'skeleton-cell',
                { 'larger-cell': idx === 2 || idx === 3 }
              ]"
            >
              <SkeletonCell />
            </td>
          </tr>
        </tbody>
      </table>
    </Transition>
    <!-- Conditionally render the "Load more" button -->
    <div class="button-container">
      <button
        v-if="clubs.length > itemsToShow && !buttonLoading"
        class="load-button"
        @click="loadMore"
      >
        Load more
      </button>
    </div>
  </div>
</template>

<script>
import { fetchClubRatings } from '@/services/api.js'
import SkeletonCell from '@/components/SkeletonCell'
import mockTeamPlayers from '@/services/mockTeamPlayers'

export default {
  components: {
    SkeletonCell
  },
  data() {
    return {
      clubs: [],
      itemsToShow: 5, // Number of items to display initially
      itemsToLoad: 3, // Number of items to load when clicking "Load more"
      isLoading: true, // Initially hide the table
      buttonLoading: true, //Initially hide the button
      newlyAddedRows: 0 // track if rows where added
    }
  },
  mounted() {
    // Make the API call when the component is mounted
    this.fetchClubRatingsData()
  },
  methods: {
    //added a timeout to the API call sot that the skeleton can actually be seen
    async fetchClubRatingsData() {
      try {
        this.clubs = await fetchClubRatings()
        // Introduce a slight delay before showing the table
        setTimeout(() => {
          this.isLoading = false
          this.buttonLoading = false
        }, 1200)
      } catch (error) {
        console.error('Error fetching club ratings:', error)
      }
    },
    loadMore() {
      this.buttonLoading = true
      // Update the number of newly added rows
      this.newlyAddedRows = this.itemsToLoad

      // Introduce a slight delay before showing the result
      setTimeout(() => {
        this.itemsToShow += this.itemsToLoad
        this.newlyAddedRows = 0 // Reset the newly added rows count
        this.buttonLoading = false
      }, 1200)

      // scroll to bottom
      this.$nextTick(() => {
        const lastItem = document.querySelector('.button-container')

        if (lastItem) {
          lastItem.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        }
      })
    },
    tooltipConfig(teamId) {
      const players = mockTeamPlayers[teamId] || []

      if (players.length > 0) {
        return `Players:<br/><br/>${players.join('<br/>')}<br/>`
      } else {
        return 'No players available'
      }
    }
  }
}
</script>

<style scoped>
.fa {
  margin-left: 4px;
}
.fa-check-circle {
  color: green;
}

.fa-times-circle {
  color: red;
}

.fa-minus-circle {
  color: grey;
}

.ratings-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.tooltip-toggle {
  cursor: pointer;
}

.load-button {
  cursor: pointer;
  padding: 8px 18px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  border: 1px solid #d7d7d7;
  background-color: #bababa;

  &:hover {
    background-color: #dfdfdf;
    border: 1px solid #b5b5b5;
  }
}

.button-container {
  padding-bottom: 30px;
  min-height: 20px;
}

.ratings-table {
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

@media (min-width: 800px) {
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
  .ratings-table th.larger-cell {
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

  .ratings-table tr td:nth-child(1) {
    width: 10px;
  }
  .ratings-table tr td:nth-child(2) {
    width: 64px;
  }
  .ratings-table tr td:nth-child(3) {
    width: 160px;
  }
}

.players-tooltip {
  padding-bottom: 30px;
  h4 {
    padding: 0;
    margin: 0;
  }
}

/*
	Max width before this PARTICULAR table gets nasty.
	This query will take effect for any screen smaller than 760px and also iPads specifically.
	*/
@media (max-width: 799px) {
  .ratings-container {
    max-width: 260px;
  }

  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers*/
  thead tr {
    display: none;
  }

  tr:nth-child(odd) {
    background: #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding: 6px 10px 6px 0;
    margin: 0 10px;
    text-align: right;

    &:before {
      /* Now like a table header */
      position: absolute;
      top: 0;
      left: 0;
      width: 44px;
      padding: 6px;
      text-align: left;
      white-space: nowrap;
      background-color: #009879;
      color: #ffffff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
      border-radius: 3px;
    }

    &:last-child {
      border-bottom: none;
      padding-bottom: 20px;
    }
  }

  td:nth-child(1),
  td:nth-child(2),
  td:nth-child(3) {
    display: table-cell;
    height: 48px;
    vertical-align: middle;
    padding: 0 10px 0 0;
    border-bottom: none;

    &:before {
      width: 0;
      height: 0;
      padding: 0;
    }
  }

  td:nth-child(1) {
    padding: 0 34px;
  }

  td:nth-child(4) {
    border-top: 1px solid #eee;
  }

  /*  Label the data */
  td:nth-of-type(1):before {
    content: '';
  }
  td:nth-of-type(2):before {
    content: '';
  }
  td:nth-of-type(3):before {
    content: '';
  }
  td:nth-of-type(4):before {
    content: 'From';
  }
  td:nth-of-type(5):before {
    content: 'GP';
  }
  td:nth-of-type(6):before {
    content: 'W';
  }
  td:nth-of-type(7):before {
    content: 'D';
  }
  td:nth-of-type(8):before {
    content: 'L';
  }
  td:nth-of-type(9):before {
    content: 'GF';
  }
  td:nth-of-type(10):before {
    content: 'GA';
  }
  td:nth-of-type(11):before {
    content: 'GD';
  }
  td:nth-of-type(12):before {
    content: 'Pts';
  }

  .skeleton-cell {
    padding-left: 100px;

    &:nth-child(1) {
      width: 230px;
      padding: 0 10px;
    }

    &:nth-child(2),
    &:nth-child(3) {
      display: none;
    }
  }
}
</style>
