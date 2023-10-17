<template>
    <div>
        <div class="inputWrapper">
            <input type="text" class="search-box" v-model="searchTerm" @input="emitSearch" @keyup="emitSearch" placeholder="Search for a job.."/>
            <b-button @click="emitSearch" class="applyBtn" variant="primary">Search</b-button>
        </div>
        <div>
            <div v-if="!noSearch && searchResults.length > 0">
                <div class="search-item" v-for="(result, index) in searchResults" :key="index">
                    <hr v-if="index > 0" />
                        <p>{{result}}</p>
                </div>
            </div>
            <div v-else-if="noSearch">
                <div class="search-item">
                    <p>Sorry. No Results.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'JobSearch',
  data() {
    return {
      searchResults: [],
      noSearch: null,
      searchTerm: ''
    }
  },
  methods: {
    emitSearch() {
      // Emit the search event with the current value of searchTerm
      this.$emit('search', this.searchTerm);
    },
  },
}
</script>

<style scoped>
    .search-box {
        display: block;
        margin: 60px;
        margin-top: 0;
        margin-bottom: 0;
        max-width: 500px;
        width: 95%;
        height: 50px;
        padding: 0.5rem 1rem;
        border-radius: 30px;
        border: 1px solid #ccc;

    }
    .search-item{
        margin: 60px;
        max-width: 500px;
        width: 95%;
        font-weight: 600;
        font-size: 1.25rem;
    }
    .search-item {
        border-top: none;
        margin: -1.3rem 0 0.5rem 0;
    }
    .btn {
        background-color:rgba(7, 25, 82, 1);
        width: 200px;
        height: 50px;
        border-radius: 30px;
    }
    .inputWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40px;
    }
</style>
