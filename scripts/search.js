export default class Search {
  constructor() {
    //results
    this.results = [];
  }

  // api'den arama sonuclarini alan bir method
  async fetchResults(query) {
    try {
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/search?q=${query}`
      );
        
      const data = await res.json();
      this.results = data;
    } catch (err) {
      console.log(err);
    }
  }
}
