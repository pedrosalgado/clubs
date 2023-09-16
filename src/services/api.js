import axios from 'axios'

// Function to fetch club ratings data from the API
export const fetchClubRatings = async () => {
  const response = await axios.get(
    'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2020-2021'
  )
  return response.data.table
}
